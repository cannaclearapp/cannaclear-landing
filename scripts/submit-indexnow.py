#!/usr/bin/env python3
"""Submit CannaClear sitemap URLs to IndexNow.

This script uses the remote sitemap as the single source of truth. It can:
- wait until the public sitemap is reachable and matches the committed sitemap
- load either a normal sitemap or sitemap index
- collect unique URLs for one host only
- batch and submit them to IndexNow
- run in dry-run mode for local validation
"""

from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from collections import OrderedDict
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


DEFAULT_HOST = "www.cannaclear.app"
DEFAULT_SITEMAP_URL = "https://www.cannaclear.app/sitemap.xml"
DEFAULT_INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow"
DEFAULT_KEY = "0233a08feb0c4a1e9816734cd953f7a5"
DEFAULT_KEY_LOCATION = (
    "https://www.cannaclear.app/0233a08feb0c4a1e9816734cd953f7a5.txt"
)
DEFAULT_BATCH_SIZE = 100
DEFAULT_WAIT_INTERVALS = [5, 5, 10, 10, 15, 15, 20, 20, 30, 30, 45, 45]
USER_AGENT = "cannaclear-indexnow/1.0"


class IndexNowError(RuntimeError):
    """Raised when sitemap loading or IndexNow submission fails."""


@dataclass
class HttpResponse:
    status: int
    body: str
    url: str


@dataclass
class SitemapCollection:
    sitemaps_loaded: int
    raw_urls_found: int
    unique_urls: list[str]


def log(message: str) -> None:
    print(message, flush=True)


def split_tag(tag: str) -> str:
    if "}" in tag:
        return tag.rsplit("}", 1)[1]
    return tag


def normalize_text(value: str | None) -> str:
    return (value or "").strip()


def normalize_top_level_locs(xml_text: str) -> list[str]:
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError as exc:
        raise IndexNowError(f"Unable to parse sitemap XML for readiness check: {exc}") from exc

    locs: list[str] = []
    for child in root:
        if split_tag(child.tag) not in {"url", "sitemap"}:
            continue
        for grandchild in child:
            if split_tag(grandchild.tag) == "loc":
                loc = normalize_text(grandchild.text)
                if loc:
                    locs.append(loc)
                break
    return locs


def chunked(items: list[str], size: int) -> Iterable[list[str]]:
    for index in range(0, len(items), size):
        yield items[index : index + size]


def http_request(
    url: str,
    *,
    method: str = "GET",
    data: bytes | None = None,
    headers: dict[str, str] | None = None,
    timeout: int = 30,
) -> HttpResponse:
    request = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={"User-Agent": USER_AGENT, **(headers or {})},
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            body = response.read().decode("utf-8", errors="replace")
            return HttpResponse(status=response.getcode(), body=body, url=response.geturl())
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        return HttpResponse(status=exc.code, body=body, url=url)
    except urllib.error.URLError as exc:
        raise IndexNowError(f"Network error while requesting {url}: {exc}") from exc


def load_remote_text(url: str) -> str:
    response = http_request(url)
    if response.status != 200:
        raise IndexNowError(
            f"Expected HTTP 200 for sitemap {url}, got {response.status}.\n"
            f"Response body:\n{response.body}"
        )
    return response.body


def parse_sitemap_urls(xml_text: str, source_url: str) -> tuple[str, list[str]]:
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError as exc:
        raise IndexNowError(f"Failed to parse XML from {source_url}: {exc}") from exc

    root_name = split_tag(root.tag)
    locs: list[str] = []

    if root_name == "urlset":
        for url_node in root:
            if split_tag(url_node.tag) != "url":
                continue
            for child in url_node:
                if split_tag(child.tag) == "loc":
                    loc = normalize_text(child.text)
                    if loc:
                        locs.append(loc)
                    break
        return "urlset", locs

    if root_name == "sitemapindex":
        for sitemap_node in root:
            if split_tag(sitemap_node.tag) != "sitemap":
                continue
            for child in sitemap_node:
                if split_tag(child.tag) == "loc":
                    loc = normalize_text(child.text)
                    if loc:
                        locs.append(loc)
                    break
        return "sitemapindex", locs

    raise IndexNowError(
        f"Unsupported sitemap root <{root_name}> in {source_url}. "
        "Expected <urlset> or <sitemapindex>."
    )


def normalize_and_filter_urls(urls: Iterable[str], host: str) -> tuple[int, list[str]]:
    ordered: OrderedDict[str, None] = OrderedDict()
    raw_count = 0
    for value in urls:
        candidate = normalize_text(value)
        if not candidate:
            continue
        raw_count += 1
        parsed = urllib.parse.urlparse(candidate)
        if parsed.netloc != host:
            continue
        ordered[candidate] = None
    return raw_count, list(ordered.keys())


def collect_sitemap_urls(sitemap_url: str, host: str) -> SitemapCollection:
    queue = [sitemap_url]
    seen_sitemaps: set[str] = set()
    all_urls_in_order: list[str] = []
    raw_urls_found = 0
    sitemaps_loaded = 0

    while queue:
        current = queue.pop(0)
        if current in seen_sitemaps:
            continue
        seen_sitemaps.add(current)

        log(f"Loading sitemap: {current}")
        xml_text = load_remote_text(current)
        doc_type, locs = parse_sitemap_urls(xml_text, current)
        sitemaps_loaded += 1

        if doc_type == "sitemapindex":
            for loc in locs:
                if loc not in seen_sitemaps:
                    queue.append(loc)
            continue

        raw_urls_found += len(locs)
        all_urls_in_order.extend(locs)

    filtered_raw_count, unique_urls = normalize_and_filter_urls(all_urls_in_order, host)
    return SitemapCollection(
        sitemaps_loaded=sitemaps_loaded,
        raw_urls_found=filtered_raw_count,
        unique_urls=unique_urls,
    )


def wait_for_remote_sitemap(
    sitemap_url: str,
    expected_sitemap_path: Path | None,
    wait_intervals: list[int],
) -> None:
    if expected_sitemap_path is None:
        log("No expected local sitemap path provided. Waiting only for HTTP 200.")
        expected_locs: list[str] | None = None
    else:
        try:
            local_text = expected_sitemap_path.read_text(encoding="utf-8")
        except OSError as exc:
            raise IndexNowError(
                f"Unable to read local sitemap at {expected_sitemap_path}: {exc}"
            ) from exc
        expected_locs = normalize_top_level_locs(local_text)
        log(
            f"Using local sitemap readiness check from {expected_sitemap_path} "
            f"with {len(expected_locs)} top-level <loc> entries."
        )

    consecutive_ready_checks = 0

    for attempt, interval in enumerate(wait_intervals, start=1):
        try:
            response = http_request(sitemap_url)
        except IndexNowError as exc:
            log(f"[wait attempt {attempt}] {exc}")
            consecutive_ready_checks = 0
            time.sleep(interval)
            continue

        if response.status != 200:
            log(
                f"[wait attempt {attempt}] Sitemap not ready yet: "
                f"HTTP {response.status} from {sitemap_url}"
            )
            consecutive_ready_checks = 0
            if response.body:
                log(response.body[:5000])
            time.sleep(interval)
            continue

        if expected_locs is None:
            consecutive_ready_checks += 1
            log(
                f"[wait attempt {attempt}] Remote sitemap returned HTTP 200 "
                f"({consecutive_ready_checks}/2 consecutive ready checks)."
            )
            if consecutive_ready_checks >= 2:
                return
            time.sleep(interval)
            continue

        remote_locs = normalize_top_level_locs(response.body)
        if remote_locs == expected_locs:
            consecutive_ready_checks += 1
            log(
                f"[wait attempt {attempt}] Remote sitemap matches local top-level "
                f"entries ({len(remote_locs)} locs) "
                f"({consecutive_ready_checks}/2 consecutive ready checks)."
            )
            if consecutive_ready_checks >= 2:
                return
            time.sleep(interval)
            continue

        consecutive_ready_checks = 0
        log(
            f"[wait attempt {attempt}] Remote sitemap is reachable but does not yet "
            f"match the committed sitemap ({len(remote_locs)} remote locs vs "
            f"{len(expected_locs)} local locs). Retrying in {interval}s."
        )
        time.sleep(interval)

    raise IndexNowError(
        "Timed out waiting for the public sitemap to become ready and match the "
        "committed sitemap."
    )


def submit_batches(
    *,
    endpoint: str,
    host: str,
    key: str,
    key_location: str,
    urls: list[str],
    batch_size: int,
    pause_seconds: float,
    dry_run: bool,
) -> None:
    batches = list(chunked(urls, batch_size))
    log(f"Creating {len(batches)} batch(es) with batch size {batch_size}.")

    for batch_number, batch in enumerate(batches, start=1):
        payload = {
            "host": host,
            "key": key,
            "keyLocation": key_location,
            "urlList": batch,
        }
        log(
            f"Batch {batch_number}/{len(batches)} contains {len(batch)} URL(s)."
        )
        if dry_run:
            log(json.dumps(payload, indent=2, ensure_ascii=False))
            continue

        response = http_request(
            endpoint,
            method="POST",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json; charset=utf-8"},
        )
        log(f"Batch {batch_number}/{len(batches)} -> HTTP {response.status}")

        if response.status not in {200, 202}:
            raise IndexNowError(
                f"IndexNow request failed for batch {batch_number}/{len(batches)} "
                f"with HTTP {response.status}.\nResponse body:\n{response.body}"
            )

        if response.body.strip():
            log(f"Response body:\n{response.body}")

        if batch_number < len(batches) and pause_seconds > 0:
            time.sleep(pause_seconds)


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default=DEFAULT_HOST)
    parser.add_argument("--sitemap-url", default=DEFAULT_SITEMAP_URL)
    parser.add_argument("--endpoint", default=DEFAULT_INDEXNOW_ENDPOINT)
    parser.add_argument("--key", default=DEFAULT_KEY)
    parser.add_argument("--key-location", default=DEFAULT_KEY_LOCATION)
    parser.add_argument("--batch-size", type=int, default=DEFAULT_BATCH_SIZE)
    parser.add_argument(
        "--batch-pause-seconds",
        type=float,
        default=1.0,
        help="Pause between batches to avoid bursty requests.",
    )
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument(
        "--wait-for-deploy",
        action="store_true",
        help="Wait until the public sitemap is reachable and matches the committed sitemap.",
    )
    parser.add_argument(
        "--expected-sitemap-path",
        default="sitemap.xml",
        help="Local sitemap path used to determine when the public sitemap reflects the current deploy.",
    )
    parser.add_argument(
        "--wait-intervals",
        default=",".join(str(value) for value in DEFAULT_WAIT_INTERVALS),
        help="Comma-separated retry intervals in seconds for the deploy wait logic.",
    )
    return parser.parse_args(argv)


def parse_wait_intervals(raw: str) -> list[int]:
    try:
        values = [int(item.strip()) for item in raw.split(",") if item.strip()]
    except ValueError as exc:
        raise IndexNowError(
            f"Invalid --wait-intervals value {raw!r}. Use comma-separated integers."
        ) from exc
    if not values:
        raise IndexNowError("At least one wait interval must be provided.")
    return values


def main(argv: list[str]) -> int:
    args = parse_args(argv)

    if args.batch_size <= 0:
        raise IndexNowError("--batch-size must be greater than zero.")

    wait_intervals = parse_wait_intervals(args.wait_intervals)
    expected_sitemap_path = Path(args.expected_sitemap_path)

    if args.wait_for_deploy:
        wait_for_remote_sitemap(
            args.sitemap_url,
            expected_sitemap_path if args.expected_sitemap_path else None,
            wait_intervals,
        )

    collection = collect_sitemap_urls(args.sitemap_url, args.host)
    log(f"Sitemaps loaded: {collection.sitemaps_loaded}")
    log(f"URLs found in sitemap documents: {collection.raw_urls_found}")
    log(f"Unique {args.host} URLs to submit: {len(collection.unique_urls)}")

    if not collection.unique_urls:
        raise IndexNowError(
            f"No URLs for host {args.host} were found in {args.sitemap_url}."
        )

    submit_batches(
        endpoint=args.endpoint,
        host=args.host,
        key=args.key,
        key_location=args.key_location,
        urls=collection.unique_urls,
        batch_size=args.batch_size,
        pause_seconds=args.batch_pause_seconds,
        dry_run=args.dry_run,
    )

    if args.dry_run:
        log("Dry run complete. No IndexNow requests were sent.")
    else:
        log("IndexNow submission complete.")

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except IndexNowError as exc:
        log(f"ERROR: {exc}")
        raise SystemExit(1)
