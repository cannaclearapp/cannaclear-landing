# cannaclear-landing
Official landing page for CannaClear: Quit Weed &amp; Reset – a cannabis detox app to help users quit weed, track sober days, and build better habits.

## IndexNow

This repository includes an automatic IndexNow integration for `https://www.cannaclear.app`.

### When it runs

- automatically on every push to `main`
- manually via GitHub Actions `workflow_dispatch`
- daily as a fallback via cron

Because the site is deployed by Vercel outside GitHub Actions, the workflow waits for the public sitemap to be reachable and to match the committed `sitemap.xml` before submitting URLs.

### Source of truth

The public sitemap is the only source of submitted URLs:

- `https://www.cannaclear.app/sitemap.xml`

The script supports both normal sitemaps and sitemap indexes, including XML namespaces. It removes duplicates, ignores empty values, and only submits URLs for `www.cannaclear.app`.

### Script

Implementation lives in:

- `scripts/submit-indexnow.py`

It uses only the Python standard library.

### Dry run

For a local validation without sending any requests:

```bash
python scripts/submit-indexnow.py --dry-run
```

### Manual run

You can start the workflow manually from GitHub Actions, or run the script locally:

```bash
python scripts/submit-indexnow.py --wait-for-deploy --expected-sitemap-path sitemap.xml
```

### IndexNow key

The IndexNow key is intentionally public, per the IndexNow specification:

- key: `0233a08feb0c4a1e9816734cd953f7a5`
- key file: `https://www.cannaclear.app/0233a08feb0c4a1e9816734cd953f7a5.txt`

It is not stored as a GitHub secret.

### Batching

The script submits URLs in batches of 100 by default and logs:

- number of loaded sitemaps
- total found URLs
- unique URLs kept for `www.cannaclear.app`
- number of generated batches
- HTTP status for every IndexNow request

If IndexNow returns anything other than HTTP `200` or `202`, the script prints the full response body and exits with a non-zero status.
