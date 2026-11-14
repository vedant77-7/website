# QA and launch

## Devices and browsers

- [ ] Chrome, Safari, Firefox, Edge on desktop at 1280, 1440 and 1920 px wide
- [ ] iPhone (Safari) and an Android phone (Chrome), portrait and landscape
- [ ] A tablet at 768 px
- [ ] Reduced motion on (macOS, iOS, Windows, Android): page complete and still
- [ ] JavaScript off: page complete, nav links work, form posts
- [ ] Vendor scripts blocked (DevTools request blocking on `/assets/vendor/*`): page complete within 4 s
- [ ] Slow 3G profile: loader finishes within its 3 s cap, nothing jumps after load

## Content

- [ ] Every number and date matches the CV
- [ ] No `[ASK VEDANT]` markers left on any page
- [ ] Spelling checked in British English (programme, storeys, licence), matching the CV
- [ ] Vedant has read and approved every page
- [ ] All temporary images replaced; no `temp-` files left in `src/`
- [ ] Download CV gets the public PDF and it has no phone number in its text

## Looks hand-made

- [ ] No em dashes or en dashes anywhere in the copy (`grep -rn "—\|–" src`)
- [ ] No emoji
- [ ] No stock phrases: elevate, craft, seamless, passionate, leverage, unlock, journey, cutting edge
- [ ] No glassmorphism (`backdrop-filter`), glows, drop shadows, gradient text
- [ ] No floating, bobbing or pulsing elements; only the globe turns
- [ ] Only the five brand colours and three typefaces are used
- [ ] No "generator" meta tag, no tool credits, no mention of how the site was made in
      code, comments, file names, image metadata or the PDF
- [ ] Comments in code are short and practical, written the way the team writes them
- [ ] Icons are the custom set, not a library

## Accessibility

- [ ] Keyboard only: skip link works, focus is always visible, order follows the page
- [ ] Every image has a useful alt; decorative SVGs have `aria-hidden="true"`
- [ ] One `h1`, then `h2` per section, `h3` inside
- [ ] Text contrast AA everywhere, including muted text on ink and on paper
- [ ] Form errors are announced (`aria-live="polite"`) and focus moves to the first problem
- [ ] Screen reader pass with VoiceOver or NVDA on the hero, Work and the form

## Performance

- [ ] Lighthouse mobile: Performance, Accessibility, Best Practices, SEO all 90+
- [ ] Hero portrait has `fetchpriority="high"`; everything below the fold is lazy
- [ ] Total page weight under 1 MB on first load
- [ ] No layout shift when fonts load (CLS under 0.05)

## Security

- [ ] Everything in `docs/06-security.md` "Checks before launch"
- [ ] `npm audit` clean or reviewed
- [ ] No `.env`, keys or raw `photos/` in the repo

## Launch

1. Choose the host (Vercel or Netlify) and connect the private repo. Build command
   `npm run build`, output folder `dist`.
2. Wire the contact form for that host (build plan step 12) and send a real test.
3. Point the domain (vedantvkdesai.com if that's the one Vedant owns), turn on HTTPS,
   redirect `www` to the apex (or the other way round, pick one).
4. Check the headers on the live domain.
5. Submit `sitemap.xml` in Google Search Console.
6. Share the link with Vedant for a final look on his own phone.

## After launch

- [ ] Add the site link to his LinkedIn and CV
- [ ] Re-run Lighthouse and securityheaders.com a week later
- [ ] Calendar reminder every 3 months: update the NOW project, numbers and CV
