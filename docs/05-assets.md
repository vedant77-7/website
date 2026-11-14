# Assets

## Where things live

```
src/assets/img/            portrait (vedant-560.webp, vedant-800.webp)
src/assets/img/work/       project photos and their blueprint versions
src/assets/data/           land-dots.json for the globe (generated)
src/assets/docs/           Vedant_Desai_CV.pdf (public version, phone removed)
src/partials/icons.svg     hand drawn icon symbols
photos/                    raw originals from Vedant or Flow, never deployed (gitignored)
```

File names: lowercase, words joined by hyphens, no spaces. WebP for photos, quality
around 82. Every `<img>` gets `width`, `height`, `alt`, and `loading="lazy"` unless it's in
the hero.

## Portrait

Now: Vedant's headshot, background removed, at 560 and 800 px wide. It's cropped at the
chest, so `main.css` fades the shoulders with a mask on `.hero__portrait img`.

When the waist-up Flow image is approved:

1. Put the full resolution file in `photos/portrait-flow.png`.
2. Remove the background: `pip install rembg[cpu]` then
   `rembg i -m isnet-general-use photos/portrait-flow.png photos/portrait-cut.png`.
   Check the hair edge on a dark background; fix stray pixels by hand if needed.
3. Crop to the figure, export WebP at 640 and 960 px wide as `vedant-640.webp` and
   `vedant-960.webp` (keep transparency).
4. In `index.html` update `src`, `srcset`, `width` and `height`.
5. In `main.css` remove the side mask on `.hero__portrait img`, then retune
   `.hero__portrait` `left` and `width` so his head overlaps the T of VEDANT and his
   waist sits on the base line, as in the layout.
6. Check desktop and phone, with and without reduced motion.

## Project photos

Real photos from Vedant replace everything below. Until then use temporary images.

Pipeline for every project image:

```
python3 tools/blueprint.py photos/chicago-residential.jpg chicago-residential
```

This writes the photo and a blueprint version (pale lines on blueprint blue) at 1600 and
900 px into `src/assets/img/work/`. Both come from one file, so they line up exactly for
the wipe. Needs `pip install opencv-python-headless pillow`. Source photos should be
landscape, 2000 px or wider, with the building filling at least half the frame.

Names: `chicago-residential`, `holiday-inn-express`, `staybridge-suites`.

### Temporary images (generate in Flow)

Prefix temporary files with `temp-` (for example `temp-chicago-residential.jpg`) so
they're easy to find and replace. These are generic buildings, not the real projects;
they're only there until Vedant's photos arrive.

Chicago Residential:

```
Photorealistic architectural photograph of a modern seven storey residential apartment building in Chicago, red brick and dark metal panel facade, regular rows of windows and small balconies, shops at street level, late afternoon sun, clear sky. Shot from across the street at a slight upward angle, building fills the right two thirds of the frame. No people, no cars in front, no text, no signage, no logos. Landscape 16:9, high resolution.
```

Holiday Inn Express (generic five storey hotel):

```
Photorealistic architectural photograph of a modern five storey limited service hotel in the American Midwest, light grey and white panel facade with a darker stair tower, glass entrance canopy, landscaped strip in front, blue hour light with some rooms lit. Three quarter view, building fills most of the frame. No signage, no brand names, no logos, no people. Landscape 16:10, high resolution.
```

Staybridge Suites (generic hotel under construction):

```
Photorealistic construction site photograph of a four storey extended stay hotel nearing completion in Illinois, facade panels partly installed, scaffolding on one side, a mobile crane, clean site, overcast daylight. Three quarter view from the site entrance, building fills most of the frame. No people's faces, no signage, no brand names, no logos. Landscape 16:10, high resolution.
```

## Globe data

`tools/globe.mjs` (to write) samples land points for the dotted globe:

- Dev dependencies only: `npm i -D world-atlas topojson-client d3-geo`.
- Load `world-atlas/land-110m.json`, convert with `topojson-client`, test a lat/lon grid
  every 2 degrees with `d3-geo`'s `geoContains`, offset every other row by 1 degree so the
  dots sit in a staggered pattern.
- Write `[[lon, lat], ...]` rounded to one decimal to `src/assets/data/land-dots.json`.
  Expect a few thousand points, under 60 KB.
- Add it to the `build` script after `tower.mjs`. Nothing from these packages ships to
  the browser.

City coordinates for pins and arcs: Mumbai 72.88 E 19.08 N, Chicago 87.63 W 41.88 N,
Dubai 55.27 E 25.20 N.

## Icons

Drawn by hand as `<symbol>`s in `src/partials/icons.svg` and included at the top of
`<body>` with the existing `<!-- @include -->` system. Used with
`<svg class="icon" aria-hidden="true"><use href="#i-plan"></use></svg>`. List and style
rules are in `docs/03-design.md`. No icon fonts, no icon libraries.

## Social card and favicon

- `favicon.svg` exists (V with an orange square).
- Social card: `src/og-image.png`, 1200 x 630: ink background, VEDANT DESAI in Big
  Shoulders, the tower drawing on the right, role line in mono. Build it as a small HTML
  page in `tools/`, screenshot it once at 1200 x 630, commit the PNG. Add `og:image` and
  `twitter:card` tags with absolute URLs at launch.
- `apple-touch-icon.png` 180 x 180 from the favicon.

## CV

`src/assets/docs/Vedant_Desai_CV.pdf` is the public version: phone removed, metadata
cleaned. If Vedant sends a new CV, remove the phone the same way and check the file's
text (not only how it looks) no longer contains the number.
