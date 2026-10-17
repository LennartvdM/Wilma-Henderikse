import { publications, THEMES, TYPES } from './publications';
import pdfMeta from './pdf-meta.json';

export { THEMES, TYPES };

const PDF_BASE = '/wp-content/uploads/publications/';

const slugify = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const formatSize = (bytes) => {
  if (!bytes) return null;
  const mb = bytes / 1024 / 1024;
  return mb >= 1
    ? `${mb.toLocaleString('nl-NL', { maximumFractionDigits: 1 })} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} kB`;
};

// Publications enriched with download link, cover and file facts; newest first.
export const catalog = publications
  .map((p, i) => {
    const meta = p.file ? pdfMeta[p.file] : null;
    if (p.file && !meta && import.meta.env.DEV) {
      console.warn(`[publicaties] geen metadata voor ${p.file} — draai \`npm run covers\``);
    }
    return {
      ...p,
      id: slugify(`${p.year}-${p.title}-${p.subtitle || ''}`),
      order: i,
      href: p.file ? PDF_BASE + encodeURIComponent(p.file) : p.url,
      external: !p.file,
      pages: meta?.pages ?? null,
      size: formatSize(meta?.bytes),
      cover: meta?.cover && !meta.cover.plain
        ? { src: `/covers/${encodeURIComponent(p.file.replace(/\.pdf$/i, ''))}.webp`, w: meta.cover.w, h: meta.cover.h }
        : null,
    };
  })
  .sort((a, b) => b.year - a.year || a.order - b.order);

export const stats = {
  count: catalog.length,
  first: Math.min(...catalog.map((p) => p.year)),
  last: Math.max(...catalog.map((p) => p.year)),
  monitors: catalog.filter((p) => p.type === 'Monitor').length,
};

export const countByTheme = Object.fromEntries(
  Object.keys(THEMES).map((k) => [k, catalog.filter((p) => p.themes.includes(k)).length]),
);
