// Copies src/ to dist/, then fills in every .html page: resolves <!-- @include name -->
// markers from src/partials and replaces {{name}} placeholders.
// A page sets its own values at the top with <!-- @set name: value -->.
// {{a|b}} uses a, or b when a isn't set.
// Run with: node tools/build.mjs

import { cpSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src');
const dist = join(root, 'dist');
const partials = join(src, 'partials');

if (existsSync(dist)) rmSync(dist, { recursive: true });

cpSync(src, dist, {
  recursive: true,
  filter: (path) => path !== partials && !path.startsWith(partials + sep),
});

function pagesIn(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return pagesIn(path);
    return path.endsWith('.html') ? [path] : [];
  });
}

function build(page) {
  const name = relative(dist, page);
  const vars = {};

  return readFileSync(page, 'utf8')
    .replace(/^<!-- @set (\w+):\s*(.*?)\s*-->\n?/gm, (_, key, value) => {
      vars[key] = value;
      return '';
    })
    .replace(/^([ \t]*)<!-- @include ([\w.-]+) -->$/gm, (_, indent, partial) => {
      const html = readFileSync(join(partials, partial), 'utf8').trim();
      return html.split('\n').map((line) => (line ? indent + line : line)).join('\n');
    })
    .replace(/\{\{(\w+)(?:\|(\w+))?\}\}/g, (_, key, fallback) => {
      const value = vars[key] ?? (fallback && vars[fallback]);
      if (value === undefined) throw new Error(`${name}: no value for {{${key}}}`);
      return value;
    });
}

const pages = pagesIn(dist);
for (const page of pages) writeFileSync(page, build(page));

console.log(`built dist/ (${pages.length} pages)`);
