# Brief

## Who and why

Vedant Desai is an Assistant Project Manager and a registered architect (India), PMP
certified, with an M.Eng in Construction Management from Illinois Institute of Technology.
He works in Chicago today (LG Group, developer side, US$35M residential build) and is
relocating to Dubai or Abu Dhabi.

The site has one job: get him interviews with developers and PMC firms in the UAE.

## Audience

1. Recruiters and hiring managers at UAE developers and PMC firms. They skim, check facts
   against the CV and LinkedIn, and often open the site on a phone.
2. Senior project directors who want proof he can run programme, procurement and cost.

Both want real numbers, real projects and a quick way to get the CV or make contact.

## The idea

The page reads like an architectural drawing set coming to life. Sheets are numbered
(A-01 to A-07), drawings turn into built things as you scroll, and the footer is a title
block. Two sides of Vedant in one scroll: the architect (drawings, plans) and the project
manager (numbers, programme, procurement).

## Layout

`docs/reference/layout-final.jpg` is the approved layout. Build it as it is. The only
differences are content fixes so the page matches the CV:

| Layout shows | We build |
| --- | --- |
| "Trades Coordinated", "On-Time Delivery" | "Packages Tracked", "Material Readiness" |
| Mumbai Tower, Bengaluru Complex, Facade Systems | Chicago Residential, Holiday Inn Express, Staybridge Suites |
| Two PMP stamps | PMP, COA, M.ENG, B.ARCH |
| Globe arc India to UAE | Mumbai to Chicago to Dubai |
| Nav item "Journal" | Work, About, Contact |

## What exists already

Milestone 1 is built and approved for review: loader, nav, hero (rising tower, name
reveal, portrait, open to roles line), stats band, title block footer, security headers,
self-hosted fonts and libraries. Everything else is in `docs/07-build-plan.md`.

## Decisions made

- Plain HTML, CSS and JS with GSAP and Lenis, no framework.
- Waist-up portrait will be generated in Flow from Vedant's face photo and approved by him.
  The current cut-out headshot stays until then.
- Project photos come from Vedant later. Use temporary images until then (`docs/05-assets.md`).
- Public CV: phone number removed, everything else as in his original.
- Hero says he's open to roles in Dubai and Abu Dhabi.
- Launch details (domain, hosting, form provider) are decided later.

## The two non-negotiables from the client

1. The site must not look or read as machine-made. See the rules in `CLAUDE.md`.
2. The site must be secure. See `docs/06-security.md`.
