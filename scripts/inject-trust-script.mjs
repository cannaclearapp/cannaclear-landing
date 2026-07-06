import fs from "node:fs";
import path from "node:path";

const root = "/Users/luk/Documents/New project/cannaclear_website";

const ARTICLE_EXCLUDES = new Set([
  "index.html",
  "support/index.html",
  "privacy/index.html",
  "terms/index.html",
  "legal-notice/index.html",
  "download/index.html",
  "newsletter/confirm/index.html",
  "newsletter/unsubscribe/index.html",
  "about/index.html",
  "editorial-policy/index.html",
  "medical-disclaimer/index.html"
]);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "assets" || entry.name === ".git") continue;
      files.push(...walk(fullPath));
    } else if (entry.name === "index.html") {
      files.push(fullPath);
    }
  }

  return files;
}

function shouldPatch(filePath) {
  const relative = path.relative(root, filePath).replace(/\\/g, "/");
  const normalized = relative.startsWith("public/") ? relative.slice(7) : relative;
  return !ARTICLE_EXCLUDES.has(normalized);
}

function injectScript(html) {
  if (html.includes('/assets/trust.js')) return html;
  return html.replace("</body>", '    <script src="/assets/trust.js" defer></script>\n  </body>');
}

for (const filePath of walk(root)) {
  if (!shouldPatch(filePath)) continue;
  const html = fs.readFileSync(filePath, "utf8");
  const patched = injectScript(html);
  if (patched !== html) fs.writeFileSync(filePath, patched);
}
