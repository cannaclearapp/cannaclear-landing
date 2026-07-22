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

function renderEditorialFeedback(indent) {
  return `${indent}<div class="editorial-feedback" role="note" aria-label="Editorial feedback">
${indent}  <svg class="icon" aria-hidden="true"><use href="/assets/article-icons.svg#i-pencil"></use></svg>
${indent}  <div>
${indent}    <strong>Help us keep this article accurate</strong>
${indent}    <p>Notice an unclear claim, outdated source, or factual error? <a href="mailto:cannaclearapp@gmail.com?subject=Editorial%20feedback%20for%20CannaClear">Send editorial feedback</a> or read our <a href="/editorial-policy#corrections-policy">corrections policy</a>.</p>
${indent}  </div>
${indent}</div>

`;
}

function injectEditorialFeedback(html) {
  const existingFeedback = /[ \t]*<div class="editorial-feedback" role="note" aria-label="Editorial feedback">[\s\S]*?<\/p>\s*<\/div>\s*<\/div>\s*(?=<(?:div|section) class="author reveal">)/;
  const withoutFeedback = html.replace(existingFeedback, "");

  const authorPattern = /(<(?:div|section) class="author reveal">)\n([ \t]+)</;
  const author = withoutFeedback.match(authorPattern);
  if (!author) {
    const inlineAuthorPattern = /^([ \t]*)(<(?:div|section) class="author reveal">)/m;
    const inlineAuthor = withoutFeedback.match(inlineAuthorPattern);
    if (!inlineAuthor) return withoutFeedback;

    const indent = inlineAuthor[1];
    return withoutFeedback.replace(
      inlineAuthorPattern,
      `${renderEditorialFeedback(indent)}${indent}${inlineAuthor[2]}`
    );
  }

  const childIndent = author[2];
  const indent = childIndent.length >= 2 ? childIndent.slice(0, -2) : "";

  return withoutFeedback.replace(authorPattern, `${renderEditorialFeedback(indent)}${indent}${author[0]}`);
}

for (const filePath of walk(root)) {
  if (!shouldPatch(filePath)) continue;
  const html = fs.readFileSync(filePath, "utf8");
  const patched = injectScript(injectEditorialFeedback(html));
  if (patched !== html) fs.writeFileSync(filePath, patched);
}
