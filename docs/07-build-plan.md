# Build plan

Work top to bottom. Each step has a prompt to paste into Claude Code, and a "done when".
Commit after every step that passes. Keep steps small: one section per session works best.

Slash commands in `.claude/commands/` do most of the work:

| Command | What it does |
| --- | --- |
| `/section <name>` | Builds a section's markup and styles from the docs, no motion |
| `/motion <name>` | Adds that section's motion from `docs/04-motion.md` |
| `/review` | Checks the current changes against the project rules and fixes what fails |
| `/launch-check` | Runs the automatic part of the launch checklist |

Section names: `method`, `work`, `about-timeline`, `capabilities`, `credentials-global`,
`contact`, `footer`.

---

## Where things stand

Steps 0 to 11 are done: every section, all motion, the case study pages, All projects and the
404 page are built. Next is Step 9 (share for review), then 12 to 15. Use `/section` and
`/motion` only to rework a part after review comments.

On hold until the client has reviewed the site: Method with a building drawn at five stages
in place of the icons. It's saved on the `method-drawings` branch. To use it, run
`git merge method-drawings` on master, then `npm run build`.

## Step 0. Set up (you, not Claude)

1. Unzip `vedant-desai-site.zip` to its own folder and open that folder in Antigravity
   (File, Open Folder).
2. In the terminal: `node -v` (needs 18+), then `npm run build` and `npm run serve`.
   Open the local address it prints and check the hero runs.
3. `git init`, then commit everything as "Milestone 1: hero".
4. Open a new Claude Code session in this folder. Don't run `/init`; `CLAUDE.md` is
   already written.

First prompt:

```
Read CLAUDE.md and everything in docs/, and look at docs/reference/layout-final.jpg. Don't change any files. Tell me in a few lines what this project is, what's already built, and what you'd build next.
```

Done when: the summary matches `docs/01-brief.md`.

## Step 1. Split the JavaScript into modules

```
Following docs/04-motion.md "Code layout", split src/assets/js/main.js into ES modules: app.js plus hero.js, with no change in behaviour. Load app.js with type="module". Keep boot.js and the bail() fallback working. Run npm run build, then check the hero still plays, still works with reduced motion, and still shows the page if the vendor scripts are blocked. Run /review at the end.
```

Done when: the hero looks and moves exactly as before.

## Step 2. Page skeleton and icons

```
Add empty shells for every section after the stats band, in this order: A-01 Method (#method), A-02 Selected Work (#work), A-03 About and Timeline (#about), A-04 Capabilities (#capabilities), A-05 Credentials and A-06 Global (#credentials, #global, side by side), A-07 Let's Build (#contact). Each gets the section header component from docs/03-design.md with the label and intro from docs/02-content.md. Then draw the icon set listed in docs/03-design.md as SVG symbols in src/partials/icons.svg and include it at the top of <body>. Draw them yourself as clean architectural line icons; no icon libraries. Show me the icons on a temporary test page in dist only, not in src.
```

Done when: the nav links scroll to the right sections, and the icons look hand drawn and consistent.

## Steps 3 to 8. Sections, one at a time

```
/section method
```
```
/section work
```
For Work, first generate the three temporary images in Flow (prompts in `docs/05-assets.md`),
save them in `photos/` and run `tools/blueprint.py` on each, or ask Claude to run it.
```
/section about-timeline
```
```
/section capabilities
```
```
/section credentials-global
```
This one also needs the globe data: ask Claude to write `tools/globe.mjs` as described in
`docs/05-assets.md` and draw the globe once, still, with both arcs.
```
/section contact
```
The form front end only: fields, validation messages, honeypot and time trap fields. The
backend comes in step 12.

Done when (each): matches the layout on desktop, works at 360 px, content is word for word
from `docs/02-content.md`, and `/review` passes.

## Step 9. Full page review

```
/review
```
Then build and share for review. Quickest: drag the `dist` folder onto
app.netlify.com/drop for a temporary link, or run `npx vercel` for a preview. Collect
Vedant's and the client's comments before adding motion.

## Step 10. Motion, one section at a time

```
/motion method
```
Then `work`, `about-timeline`, `capabilities`, `credentials-global`, `contact`, `footer`,
and finally:
```
Add the sheet counter described in docs/04-motion.md.
```

Done when (each): smooth on a mid-range phone, nothing moves with reduced motion on,
no console errors.

## Step 11. Case studies, all projects, 404

```
Build work/index.html (all projects table) and work/chicago-residential.html, work/holiday-inn-express.html and work/staybridge-suites.html using the case study template in docs/03-design.md and the copy in docs/02-content.md. Keep [ASK VEDANT] lines visible as a muted note so they're easy to spot. Add 404.html with the copy from docs/02-content.md. Share the nav, footer and head through partials so they aren't copied by hand. Update tools/build.mjs if it needs to process more than index.html.
```

## Step 12. Contact form backend

After the hosting choice. Tell Claude which host, then:

```
Wire the contact form for <Netlify|Vercel> exactly as docs/06-security.md describes: works without JS, fetch enhancement, server side validation, honeypot, time trap, rate limit, plain text email, generic errors. Show me how to test each rejection case.
```

## Step 13. Final photos

When the Flow portrait is approved and Vedant's project photos arrive:

```
Replace the temporary portrait with photos/portrait-flow.png following docs/05-assets.md "Portrait", steps 2 to 6. Then replace the temp- project images with the real photos in photos/ using tools/blueprint.py, and delete the temp files.
```

## Step 14. SEO and sharing

```
Add the social card, apple-touch-icon, og and twitter tags, a Person schema as an inline JSON-LD data block (browsers don't execute it, so the CSP doesn't block it), sitemap.xml and canonical URLs. Domain: <domain>. Follow docs/05-assets.md and docs/06-security.md, and confirm the console shows no CSP errors.
```

## Step 15. Launch

```
/launch-check
```
Then go through `docs/08-qa-launch.md` by hand.
