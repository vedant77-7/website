// Builds the elevation drawing used in the hero and writes it to src/partials/tower.svg.
// Units are loose metres x 4. Run with: node tools/tower.mjs

import { writeFileSync } from 'node:fs';

const GROUND = 392;
const r = (n) => Math.round(n * 100) / 100;

// small seeded random so the lit windows stay the same between builds
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

const blocks = [
  { name: 'podium', floors: 3, height: 16, x0: 40, x1: 200, bay: 20, win: { inset: 2, top: 3, h: 10 } },
  { name: 'tower', floors: 20, height: 13, x0: 70, x1: 170, bay: 25, win: { inset: 2.5, top: 2.5, h: 8 } },
  { name: 'crown', floors: 2, height: 13, x0: 80, x1: 160, bay: 20, win: { inset: 2.5, top: 2.5, h: 8 } },
];

const floors = [];
let base = GROUND;

for (const b of blocks) {
  for (let i = 0; i < b.floors; i++) {
    const bottom = base - i * b.height;
    const top = bottom - b.height;
    const wins = [];
    for (let x = b.x0; x < b.x1; x += b.bay) {
      const lit = rand() < 0.22 ? r(0.12 + rand() * 0.24) : 0;
      wins.push(
        `<rect class="t-win" x="${r(x + b.win.inset)}" y="${r(top + b.win.top)}" width="${r(b.bay - b.win.inset * 2)}" height="${b.win.h}"${lit ? ` data-lit="${lit}"` : ''}/>`
      );
    }
    floors.push(
      `<g class="t-floor"><line class="t-slab" x1="${b.x0}" y1="${top}" x2="${b.x1}" y2="${top}"/>${wins.join('')}</g>`
    );
  }
  base -= b.floors * b.height;
}

const roof = base; // 58
const towerTop = GROUND - 3 * 16 - 20 * 13; // 84

// columns are drawn bottom to top so they can grow with the floors
const cols = [];
for (let x = 40; x <= 200; x += 20) {
  if (x === 80 || x === 120 || x === 160) continue;
  cols.push(`<line class="t-col" x1="${x}" y1="${GROUND}" x2="${x}" y2="${GROUND - 48}"/>`);
}
for (const x of [70, 95, 120, 145, 170]) {
  cols.push(`<line class="t-col" x1="${x}" y1="${GROUND}" x2="${x}" y2="${towerTop}"/>`);
}
for (const x of [80, 160]) {
  cols.push(`<line class="t-col" x1="${x}" y1="${GROUND - 48}" x2="${x}" y2="${roof}"/>`);
}

const piles = [];
for (let x = 40; x <= 200; x += 20) {
  piles.push(`<line class="t-pile" x1="${x}" y1="${GROUND}" x2="${x}" y2="${GROUND + 14}"/>`);
}

const axes = ['A', 'B', 'C', 'D', 'E'].map((letter, i) => {
  const x = 70 + i * 25;
  return `<g class="t-axis"><line x1="${x}" y1="${GROUND + 3}" x2="${x}" y2="${GROUND + 18}"/><circle cx="${x}" cy="${GROUND + 25}" r="7"/><text x="${x}" y="${GROUND + 27.6}">${letter}</text></g>`;
});

const mastTop = 18;
const crown = [
  `<path class="t-crown" d="M112 ${roof} V${roof - 6} H128 V${roof}"/>`,
  `<line class="t-crown" x1="120" y1="${roof - 6}" x2="120" y2="${mastTop}"/>`,
  `<line class="t-crown" x1="115" y1="40" x2="125" y2="40"/>`,
  `<line class="t-crown" x1="116.5" y1="28" x2="123.5" y2="28"/>`,
];

const DIM = 238;
const dim = [
  `<line class="t-dim-ext" x1="${DIM - 12}" y1="${GROUND}" x2="${DIM + 8}" y2="${GROUND}"/>`,
  `<line class="t-dim-ext" x1="128" y1="${mastTop}" x2="${DIM + 8}" y2="${mastTop}"/>`,
  `<line class="t-dim-line" x1="${DIM}" y1="${GROUND}" x2="${DIM}" y2="${mastTop}"/>`,
  `<line class="t-dim-tick" x1="${DIM - 4}" y1="${GROUND + 4}" x2="${DIM + 4}" y2="${GROUND - 4}"/>`,
  `<line class="t-dim-tick" x1="${DIM - 4}" y1="${mastTop + 4}" x2="${DIM + 4}" y2="${mastTop - 4}"/>`,
  `<text class="t-height" x="${DIM - 6}" y="${mastTop + 14}" transform="rotate(-90 ${DIM - 6} ${mastTop + 14})">+107.50</text>`,
];

const svg = `<svg class="tower" viewBox="0 0 260 430" aria-hidden="true" focusable="false">
  <line class="t-ground" x1="6" y1="${GROUND}" x2="254" y2="${GROUND}"/>
  <g class="t-piles">${piles.join('')}</g>
  <g class="t-axes">${axes.join('')}</g>
  <g class="t-cols">${cols.join('')}</g>
  <g class="t-floors">${floors.join('\n    ')}</g>
  <g class="t-top">${crown.join('')}</g>
  <g class="t-dim">${dim.join('')}</g>
</svg>
`;

writeFileSync(new URL('../src/partials/tower.svg', import.meta.url), svg);
console.log(`tower.svg: ${floors.length} floors, ${svg.length} bytes`);
