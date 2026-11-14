# Motion

Motion explains the idea: drawings become built things. If an effect doesn't do that or
help someone use the page, leave it out. One strong moment per section is enough.

## Rules

- GSAP 3.15 with ScrollTrigger, SplitText, DrawSVGPlugin and ScrambleTextPlugin, plus Lenis.
  All are already in `src/assets/vendor/`. Don't add other animation libraries.
- Wrap all motion in `gsap.matchMedia()` under `(prefers-reduced-motion: no-preference)`.
  With reduced motion on, the page shows complete and still.
- The page must be complete without JavaScript. CSS shows every element in its final
  state; JS sets start states only for the tweens it is about to run.
- Animate only `transform`, `opacity`, `clip-path`, SVG strokes (DrawSVG) and CSS
  variables. Never animate width, height, top or left.
- Reveals run once, with `toggleActions: 'play none none none'`. Don't use `once: true`:
  a `once` trigger kills itself in the middle of ScrollTrigger's refresh, and reloading the
  page part way down crashed the intro and left the loader on screen. Only the Method
  line, the Work wipe and the Timeline spine are scrubbed.
- Default ease `power3.out`, type uses `expo.out`. Reveals 0.8 to 1.1 s, staggers 0.06 to
  0.12 s, hovers 0.2 to 0.3 s. No bounce, elastic or back eases.
- No loops: no pulsing dots, floating cards, bobbing arrows or glows. The only continuous
  movement on the page is the globe turning, and only while it's on screen.
- Reveal trigger `start: 'top 80%'`. Scrub triggers `start: 'top 70%'`, `end: 'bottom 60%'`.
- Phones: shorter distances (16 px instead of 40), no pinning, no cursor effects,
  no magnetic buttons.
- Clean up: anything created per breakpoint lives inside its `matchMedia` context so it
  reverts on resize.

## Code layout

`main.js` currently holds the loader, hero and stats. When adding sections, move to
native ES modules (no bundler needed, CSP allows same-origin modules):

```
src/assets/js/
  boot.js            unchanged, loads first
  app.js             <script type="module">: Lenis, plugin registration, imports below
  hero.js            loader, tower, intro, stats (moved from main.js)
  method.js
  work.js
  timeline.js
  capabilities.js
  credentials.js
  globe.js
  contact.js
  sheet-counter.js
```

Each module exports `init(ctx)` and receives `{ gsap, ScrollTrigger, lenis, finePointer }`.
Keep the `bail()` fallback from `main.js`: any error drops motion and shows the page.

## Built (milestone 1)

| Piece | What happens |
| --- | --- |
| Loader | Counter 000 to 100 over 0.95 s while fonts and the portrait load (capped at 3 s), orange bar fills, sheet lifts with `expo.inOut` |
| Grid | Background grid wipes in from the top |
| Tower | Ground line from the centre, piles and grid bubbles, frame and floors climb together (1.7 s), height counts to +107.50, crown, about 1 in 5 windows light |
| Name | SplitText chars rise from line masks, 0.04 s stagger |
| Portrait | Starts as the name settles (1 s after the loader lifts) and rises over 1.3 s with `power3.out`, a steady medium pace; lands just before the tower tops out. Face shows about 2.8 s after the page opens |
| Role and status | ScrambleText |
| Stats | Counters from 0, dividers grow; starts during the intro if the band is visible |
| After intro | Parallax (grid 110 px, tower 70 px, name 20 px), CAD cursor readout in the hero, magnetic buttons |

## To build

### Sheet counter (site-wide, desktop only)

Fixed label in the left margin near the bottom, set vertically so it reads upwards like a
note on a drawing border, mono 11 px: `A-00 / 07` in the hero, then `A-01 / 07` and so on.
Shown only above 1100 px with a mouse. ScrollTrigger per section with `onToggle`; swap the number with a 0.3 s
ScrambleText. Bottom offset adds `env(safe-area-inset-bottom)`.

### Menu marker (site-wide)

The orange mark under the current menu link grows from the left with a 0.3 s CSS
transition; with reduced motion it just appears. `nav.js` sets `aria-current` on the link
from an IntersectionObserver watching a line across the middle of the screen, so it works
without GSAP.

### A-01 / Method

- The orange line: `scaleX` 0 to 1 from the left, scrubbed (`scrub: 0.6`).
- As the line passes each column (timeline positions 0, 0.25, 0.5, 0.75, 1), that
  column's number goes from muted to orange, its icon strokes draw with DrawSVG (0.8 s),
  and the name and line rise 16 px.
- Phone: the line runs down (`scaleY`), same order.

### A-02 / Selected Work

- Featured card: the blueprint layer starts covering the whole photo and its clip-path
  scrubs from `inset(0 0 0 0)` to `inset(0 0 0 55%)` (`start: 'top 85%'`, `end: 'top 35%'`).
  The building appears out of its own drawing.
- Text panel rises 24 px and fades in once the wipe passes halfway.
- Small cards rise 40 px, 0.12 s apart.
- Hover (fine pointer only): the blueprint shows through a 120 px circle that follows the
  cursor. Set `--x` and `--y` on pointermove; the layer uses
  `clip-path: circle(var(--r) at var(--x) var(--y))` and `--r` transitions 0 to 120 px.
- NOW tag is static.

### A-03 / About and Timeline

- About headline: SplitText lines rise from masks, body fades up after.
- Spine: DrawSVG or `scaleY` from the top, scrubbed across the timeline.
- Each card slides in 40 px from its own side (left cards from the left), its hairline
  draws to the spine and the node scales in. Once per card at `top 85%`.

### A-04 / Capabilities

- Tiles rise with a 0.08 s stagger.
- Corner brackets start 24 px further out and transparent, then lock onto the corners
  (0.6 s) just after their tile lands. Like a camera finding focus.
- Hover and focus: brackets pull in to 2 px (CSS transition 0.25 s) and the list opens
  with `grid-template-rows: 0fr` to `1fr` (CSS, 0.3 s). No JS for the hover.

### A-05 / Credentials

- Stamps land one at a time, 0.25 s apart: from `scale: 1.6`, rotation +12 degrees past
  their final angle and `autoAlpha: 0`, to their final state in 0.35 s with `power4.in`.
  On each landing the paper panel shakes once: x 3, -2, 1, 0 px over 0.18 s.
- Details rows fade in after the last stamp.

### A-06 / Global

- Canvas globe, orthographic projection written by hand (no d3 at runtime). Land points
  come from `src/assets/data/land-dots.json` (see `docs/05-assets.md`).
- On enter: the globe turns from Mumbai towards the Atlantic, the Mumbai to Chicago arc
  draws (1.2 s), then Chicago to Dubai (1.2 s); a small dot travels each arc once after
  it's drawn. Pins and labels appear as each arc lands.
- After that, a slow turn (one revolution per 90 s) only while the section is in view.
  Pause with ScrollTrigger `onToggle` or an IntersectionObserver.
- Reduced motion: draw once, centred at longitude -7, latitude 30, which shows all three
  cities, with both arcs complete.
- Arcs are great circle paths lifted off the surface by `1 + 0.15 * sin(PI * t)`.
- Render at `devicePixelRatio` up to 2. Redraw only when the angle changes.

### A-07 / Let's Build

- Headline chars rise once; the arrow draws with DrawSVG.
- Field underline: a `::after` bar `scaleX` 0 to 1 on focus (CSS).
- On submit: button text changes to "Sending"; on success the form fades and a "Brief
  received" stamp lands like the credential stamps, then the thank you line.
- On error: no shaking. Show the message under the field and move focus to the first
  field with a problem.

### Footer

- Title block cells fade in together, values ScrambleText once.

### Case study pages

- No page transition library. On load, the hero photo does the blueprint to photo wipe
  (not scrubbed, 1.2 s). Result tiles count up like the stats band.
