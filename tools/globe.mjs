// Samples land points for the dotted globe in A-06 and writes src/assets/data/land-dots.json.
// The JSON is committed, so this only needs running if the spacing changes.
// Run with: npm install, then npm run globe

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { geoContains } from 'd3-geo';
import { feature } from 'topojson-client';

const STEP = 1.8; // degrees between dots
const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve('world-atlas/land-110m.json'), 'utf8'));
const land = feature(topo, topo.objects.land);

const dots = [];
let row = 0;
for (let lat = -58; lat <= 82; lat += STEP, row++) {
  // fewer dots towards the poles so spacing stays even on the sphere
  const step = STEP / Math.max(Math.cos((lat * Math.PI) / 180), 0.25);
  const offset = row % 2 ? step / 2 : 0;
  for (let lon = -180 + offset; lon < 180; lon += step) {
    if (geoContains(land, [lon, lat])) dots.push(Math.round(lon * 10) / 10, Math.round(lat * 10) / 10);
  }
}

const out = new URL('../src/assets/data/land-dots.json', import.meta.url);
mkdirSync(new URL('.', out), { recursive: true });
writeFileSync(out, JSON.stringify(dots));
console.log(`land-dots.json: ${dots.length / 2} dots`);
