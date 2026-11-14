# Design

Reference: `docs/reference/layout-final.jpg`. The layout image shows each section as a
narrow panel; on a desktop page each section runs full width inside the 1360 px wrap.
Tokens already exist at the top of `src/assets/css/main.css`. Use them, don't add new colours.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | #0B0F14 | Page background |
| `--ink-raised` | #111821 | Cards, tiles, form panel |
| `--paper` | #ECE6DA | Headlines, light bands |
| `--line` | #6FA8DC | Drawings, grid, spine, cursor readout |
| `--orange` | #FF5A1F | Buttons, NOW tags, stamps, arcs, the Method line. Nothing else |
| `--muted` | #8A94A3 | Labels, secondary text |
| `--rule` | cyan at 18% | Hairlines on ink |
| `--grid` | cyan at 7% | Background grid |
| `--paper-rule` | ink at 22% | Hairlines on paper |

Orange is for things you can click, plus the few accents listed. If a design choice
needs a sixth colour, it's the wrong choice.

## Type

| Role | Face | Size | Notes |
| --- | --- | --- | --- |
| Hero name | Big Shoulders 900 | clamp(5.5rem, 19.5vw, 19rem) | Built |
| Section label | Big Shoulders 700 | clamp(1.25rem, 2vw, 1.75rem) | Uppercase, `A-01` in muted, `/` in orange |
| Section headline | Big Shoulders 800 | clamp(2.5rem, 5vw, 4.5rem) | Used in About and Let's Build |
| Card title | Big Shoulders 700 | clamp(1.75rem, 3vw, 3.25rem) featured, 1.625rem cards | |
| Big numbers | Big Shoulders 800 | clamp(2.75rem, 5vw, 4.5rem) | `tabular-nums` |
| Body | Barlow 400 | 1rem to 1.125rem, line height 1.55 | Max 62ch |
| Lead lines | Barlow 500 | clamp(1.125rem, 1.6vw, 1.375rem) | Section intros |
| Buttons | Barlow 600 | 1rem, 0.875rem small | Built |
| Labels, chips, dates | IBM Plex Mono 500 | 0.6875rem to 0.75rem | Uppercase, letter-spacing 0.12em |

`text-wrap: balance` on headings. No other typefaces.

## Layout system

- Wrap: 1360 px max, side padding `var(--pad-l)` / `var(--pad-r)` (already defined).
- Section padding: `padding-block: clamp(72px, 9vw, 128px)`, top border `1px solid var(--rule)`.
- Breakpoints: 1100, 760, 480. Mobile first is not required, but every section must work at 360 px.
- Spacing steps: 4, 8, 12, 16, 24, 32, 48, 72, 96. Use `gap` on grid/flex, not margins between siblings.
- Corners: 6 px on cards and panels, 999 px on buttons, chips and tags. Nothing else rounded.
- No shadows, no blur, no gradients except the existing image masks.

## Shared components

**Nav**: stays at the top on every page (`position: sticky`). Solid `--ink` with the 1 px
`--rule` line under it, 72 px tall (64 px under 760). No blur, no shadow. The link for the
section on screen turns `--paper` and gets a 2 px orange mark sitting on the bar's bottom
line; Credentials and Global share a row, so both mark Credentials. `html` has
`scroll-padding-top` set to the bar height, so anchor jumps and keyboard focus stop below it.

**Section header** (every section A-01 to A-07):

```html
<header class="section-head">
  <h2 class="section-head__label"><span class="section-head__no">A-01</span><span class="section-head__slash" aria-hidden="true">/</span> Method</h2>
  <p class="section-head__intro">How a project gets from a brief to a building, and where I keep it on track.</p>
</header>
```

Label left, intro under it at max 46ch. A 1 px rule under the header on desktop.

**Chip**: mono 11 px uppercase, 1 px border `--rule`, padding 6 10, radius 999. On paper
backgrounds the border is `--paper-rule`.

**Tag**: like a chip but filled. `NOW` = orange with ink text. `EDUCATION` = outline in `--line`.

**Card**: `--ink-raised` background, 1 px `--rule` border, radius 6, no shadow.

**Corner brackets** (Capabilities): four L shapes, 18 px arms, 2 px orange, sitting 6 px
outside each corner. Draw them with two pseudo elements and a background trick or four
small spans; no images.

**Underline field**: mono label above, transparent input, 1 px `--rule` bottom border,
2 px orange bottom border on focus, 16 px text (avoids iOS zoom).

**Icons**: custom architectural line icons, drawn by hand as SVG `<symbol>`s in
`src/partials/icons.svg`, 32 x 32 grid, stroke 1.5, square caps, `currentColor`. No icon
libraries. Needed: plan (Concept), elevation and set square (Design), document with stamp
(Procure), building frame with crane (Build), finished tower with key (Handover), gantt
bars (Project Management), set square over elevation (Architectural Design), contract
with stamp (Contracts & Procurement), screen with model cube (Software & BIM), arrow
right, arrow up right, download.

## Sections

Background order, matching the layout: hero ink, stats paper, Method ink, Work ink,
Timeline ink, Capabilities ink, Credentials paper and Global ink side by side, Let's Build
ink panel, footer ink.

### A-01 / Method (`#method`)

Desktop: five equal columns split by vertical hairlines. Each column, top to bottom:
orange number (Big Shoulders 600, clamp(2.5rem, 4vw, 3.5rem)), 64 px icon in `--paper`,
step name (Barlow 500, 1.25rem), one line (Barlow 400, 0.9375rem, muted, max 26ch).
One orange 2 px line runs through all five columns at icon height, behind the icons.

Mobile: one column. Number left, text right; the orange line runs down the left edge.

### A-02 / Selected Work (`#work`)

Featured card, full width, height clamp(380px, 42vw, 580px):
- Photo fills the card (`object-fit: cover`).
- The blueprint version of the same photo sits on top, clipped to the right 45%.
- Text panel bottom left on solid `--ink` at 92% opacity (no blur): title, chips, role,
  summary, "Read the case study" link with arrow.
- `NOW` tag top right.

Two cards below, two columns, gap 24: photo 16:10 on top, then title, chips, summary,
link. Same blueprint layer, hidden until hover.

"All projects" link, right aligned, under the grid.

Mobile: featured photo 4:5 with the text panel below it, not on top. Cards stack.

### A-03 / About and Timeline (`#about`)

About first: two columns. Left the headline (section headline size, max 14ch). Right the
body (1.125rem, max 60ch).

Timeline under it: a 1 px `--line` spine in the centre. Cards alternate left and right,
each `calc(50% - 48px)` wide, joined to the spine by a 32 px hairline and an 8 px square
node. The NOW node is a 10 px orange square. Card contents: tag (optional), dates in mono,
role (Barlow 600, 1.25rem), company and city (muted), one line.

Mobile: spine 12 px from the left, every card on the right.

### A-04 / Capabilities (`#capabilities`)

2 x 2 grid, gap 32 (room for the brackets). Tile: `--ink-raised`, padding 28, min height
220, icon top left, title (Barlow 600, 1.375rem), line and the list from `02-content.md` as
chips at the bottom. The list is always shown (hiding it on hover made the row jump).

Mobile: one column.

### A-05 / Credentials and A-06 / Global (`#credentials`, `#global`)

Desktop: one row, 45% Credentials, 55% Global, no gap, joined by a hairline.

Credentials: paper background with an ink graph grid (6% opacity, 16 px). Four stamps in
a loose 2 x 2 cluster, each 140 px, rotated -8, 5, -3 and 9 degrees. A stamp is an SVG:
outer double ring, issuer text on a circular path, abbreviation in the middle (Big
Shoulders 800). Ink colour `--orange` with a light SVG turbulence filter so it looks
pressed, not printed. The details table sits under the cluster in ink text.

Global: ink background. Dotted globe on a canvas, max 520 px square, land as cyan dots,
two orange arcs (Mumbai to Chicago, Chicago to Dubai), three pins with mono labels. The
pin list and "Ready for the UAE" list under the globe.

Mobile: stacked, Credentials first.

### A-07 / Let's Build (`#contact`)

A bordered `--ink-raised` panel, radius 6, padding clamp(24px, 4vw, 56px), two columns.
Left: headline "Let's build something." (section headline size), an orange arrow, the
line, then email and LinkedIn as text links. Right: the form with underline fields and a
solid orange "Send Brief" button aligned right.

Mobile: stacked, button full width.

### Footer (built)

Title block as built. Add one row under it: copyright left, links right (LinkedIn, Email,
Download CV, Back to top), mono 11 px, muted.

## Case study pages (`work/<slug>.html`)

Same nav and footer. Sheet label in the corner (`A-02.1`). Order: title and facts row,
full width photo with its blueprint twin, "The job", "What I did" as a list, results as
number tiles (stats band style on paper), next project link.
