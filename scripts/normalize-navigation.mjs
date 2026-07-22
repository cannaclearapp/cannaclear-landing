import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const ignoredDirectories = new Set([
  ".git",
  ".pycache",
  "assets",
  "cannaclear_new-homepage",
  "infographics",
  "public",
  "scripts",
]);

const navigation = `    <header class="nav">
      <div class="nav-in">
        <a href="/" class="brand"><img src="/assets/new/app-icon.webp" alt="" width="32" height="32" />CannaClear</a>
        <details class="nav-menu">
          <summary aria-label="Open navigation"><svg class="icon" aria-hidden="true"><use href="/assets/article-icons.svg#i-list"></use></svg></summary>
          <nav class="nav-menu-panel" aria-label="Mobile navigation">
            <a href="/features">Features <svg class="icon" aria-hidden="true"><use href="/assets/article-icons.svg#i-chevright"></use></svg></a>
            <a href="/guides">Guides <svg class="icon" aria-hidden="true"><use href="/assets/article-icons.svg#i-chevright"></use></svg></a>
            <a href="/quit-weed-timeline">Recovery Timeline <svg class="icon" aria-hidden="true"><use href="/assets/article-icons.svg#i-chevright"></use></svg></a>
            <a href="/about">About <svg class="icon" aria-hidden="true"><use href="/assets/article-icons.svg#i-chevright"></use></svg></a>
          </nav>
        </details>
        <nav class="nav-links" aria-label="Main">
          <a href="/features">Features</a>
          <a href="/guides">Guides</a>
          <a href="/quit-weed-timeline">Recovery Timeline</a>
          <a href="/about">About</a>
          <a href="/download" class="nav-cta">Get the app</a>
        </nav>
      </div>
    </header>`;

function walk(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolute));
    if (entry.isFile() && entry.name === "index.html") files.push(absolute);
  }
  return files;
}

let updated = 0;
for (const sourcePath of walk(root)) {
  if (sourcePath === path.join(root, "index.html")) continue;

  const html = fs.readFileSync(sourcePath, "utf8");
  if (!html.includes('/assets/article.css') || !html.includes('class="nav"')) continue;

  const next = html.replace(/\s*<header class="nav">[\s\S]*?<\/header>/, `\n${navigation}`);
  if (next === html) continue;

  fs.writeFileSync(sourcePath, next);
  const relative = path.relative(root, sourcePath);
  const publicPath = path.join(root, "public", relative);
  fs.mkdirSync(path.dirname(publicPath), { recursive: true });
  fs.writeFileSync(publicPath, next);
  updated += 1;
}

console.log(`Normalized navigation in ${updated} source pages and their public mirrors.`);
