// Render every route to static HTML after `vite build` + the SSR build, so each page
// ships its full content (fast first paint, readable without JS, indexable) and the
// client bundle hydrates it. Routes: /, /publicaties, and a 404 page.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'build');
const ssrDir = join(root, '.ssr');
const { render, routeMeta } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);
const template = readFileSync(join(out, 'index.html'), 'utf8');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const pages = { '/': 'index.html', '/publicaties': 'publicaties/index.html', '/404': '404.html' };

for (const [url, file] of Object.entries(pages)) {
  const meta = routeMeta[url];
  const html = template
    .replace('<!--app-->', render(url))
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(meta.description)}`);
  mkdirSync(dirname(join(out, file)), { recursive: true });
  writeFileSync(join(out, file), html);
  console.log(`prerendered ${url} → build/${file}`);
}
rmSync(ssrDir, { recursive: true, force: true });
