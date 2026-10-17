#!/usr/bin/env node
/**
 * Sync the "Talent naar de Top" scrollytelling monitor into this site at /monitor/.
 *
 * The scrolly is built in the monitortalent.nl repo (Vragenlijst-Executive-Search)
 * as a self-contained snapshot: factsheet-cirkel-lab-archive/<rev>/. This script
 * copies that snapshot to public/monitor/ and adapts it for this site:
 *   - engine scripts + photos load from absolute /monitor/… paths (so /monitor and
 *     /monitor/ both work)
 *   - the corner "Zoekt u de survey?" link becomes a link back to Wilma's homepage
 *   - the survey prerender is skipped (there is no survey on this site)
 *   - canonical points at monitortalent.nl, the original home of the monitor
 *
 * Usage:
 *   node scripts/sync-monitor.mjs --from ../Vragenlijst-Executive-Search [--rev c272]
 * Without --rev the rev named in factsheet-deck/deck.json is used.
 */
import { readFileSync, writeFileSync, rmSync, cpSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const arg = (k) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : null; };
const from = resolve(arg('--from') || '../Vragenlijst-Executive-Search');
const rev = arg('--rev') || JSON.parse(readFileSync(join(from, 'factsheet-deck', 'deck.json'), 'utf8')).rev;
const src = join(from, 'factsheet-cirkel-lab-archive', rev);
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'monitor');
const ROOT = '/monitor/';

if (!existsSync(join(src, 'index.html'))) {
  console.error(`snapshot not found: ${src}`);
  process.exit(1);
}

// Every patch must apply exactly as intended — if the upstream markup changed, fail
// loudly instead of shipping a half-adapted page.
function patch(text, file, find, replace) {
  const next = text.replace(find, replace);
  if (next === text) {
    console.error(`patch did not apply in ${file}: ${find}`);
    process.exit(1);
  }
  return next;
}

rmSync(out, { recursive: true, force: true });
cpSync(src, out, { recursive: true });

let html = readFileSync(join(out, 'index.html'), 'utf8');
html = patch(html, 'index.html', /<meta name="robots" content="noindex, nofollow">\s*/,
  '<link rel="canonical" href="https://monitortalent.nl/">\n');
html = patch(html, 'index.html', /<a class="survey-link" href="\/vragenlijst"[^>]*>[\s\S]*?<\/a>/,
  '<a class="survey-link" href="/" aria-label="Terug naar de website van Wilma Henderikse" style="left:clamp(18px,2.4vw,34px);right:auto">← Wilma Henderikse</a>');
html = patch(html, 'index.html', /src="assets\//g, `src="${ROOT}assets/`);
html = patch(html, 'index.html',
  /src="(konva\.min\.js|cirkelgen-core\.js|cirkel\.js|mobile\.js(?:\?v=[^"]+)?)"/g, `src="${ROOT}$1"`);
html = patch(html, 'index.html', /<script src="(app\.js(?:\?v=[^"]+)?)"><\/script>/,
  `<script src="${ROOT}$1" data-asset-base="${ROOT}assets/web/"></script>`);
writeFileSync(join(out, 'index.html'), html);

let app = readFileSync(join(out, 'app.js'), 'utf8');
app = patch(app, 'app.js', 'function armPriming(){',
  'function armPriming(){\n    if (!document.querySelector(\'[data-route-transition="login"]\')) return; // wilmahenderikse.nl: no survey to prime');
writeFileSync(join(out, 'app.js'), app);

writeFileSync(join(out, 'VERSION'), `${rev}\n`);
console.log(`synced monitor ${rev} → public/monitor/`);
