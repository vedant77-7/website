# Security

A static site has a small attack surface. Keep it that way: no third-party code, no inline
script, no secrets in the repo, and a contact form that can't be abused.

## Headers (already set)

`src/_headers` (Netlify) and `src/vercel.json` (Vercel) send the same headers:

| Header | Value |
| --- | --- |
| Content-Security-Policy | `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests` |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` |
| X-Content-Type-Options | `nosniff` |
| X-Frame-Options | `DENY` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | camera, microphone, geolocation, payment, usb, browsing-topics all off |
| Cross-Origin-Opener-Policy | `same-origin` |
| Cross-Origin-Resource-Policy | `same-origin` |

If you change one file, change the other in the same commit.

HSTS `preload` is hard to undo. Only submit the domain to hstspreload.org after HTTPS has
worked on the apex and every subdomain for a while.

## Rules for code

- No inline `<script>` blocks and no `style="..."` attributes in markup. Setting styles
  from JS (`el.style.x = ...`, GSAP) is fine; CSP allows it.
- No `onclick` or other inline handlers. Use `addEventListener`.
- No `innerHTML` with anything that came from a user or the network. Use `textContent`.
- No third-party scripts, fonts, iframes, embeds, maps or analytics. Everything is
  served from the site's own domain.
- External links: `rel="noopener noreferrer"` and `target="_blank"` only where it helps.
- If a feature truly needs another domain (for example a form provider), add that exact
  origin to the one CSP directive it needs, in both header files, and note why in the
  commit message.

## Dependencies

- Browser code is limited to the files in `src/assets/vendor/`, pinned: GSAP 3.15.0 and
  Lenis 1.3.26. Update them on purpose, one at a time, and test the site after.
- Packages in `package.json` are dev tools only (globe data, image scripts). Nothing from
  `node_modules` ships to the browser.
- Run `npm audit` before launch.

## Contact form

The form must work without JavaScript (plain POST) and be enhanced with `fetch` when JS runs.

Pick one at launch:

| Host | Backend | CSP change |
| --- | --- | --- |
| Netlify | Netlify Forms (`data-netlify="true"`, `netlify-honeypot="company_site"`) | None, posts to the same origin |
| Vercel | `api/contact.js` serverless function sending mail through Resend or Postmark; API key in an environment variable | None, posts to `/api/contact` |

Server side, whichever backend:

- Honeypot field (`company_site`, hidden with CSS and `tabindex="-1"`, `autocomplete="off"`).
  Filled in means silently accept and drop.
- Time trap: a hidden field with the page load time; reject posts sent in under 3 seconds.
- Validate on the server, not only in the browser: name 1 to 100 chars, email up to 254
  and a sane pattern, company up to 120, brief 10 to 4000. Reject control characters and
  any CR or LF in name, email and company (stops header injection).
- Send the email as plain text. Put the visitor's email in `Reply-To` only after it passes
  validation. Never echo input back as HTML.
- Rate limit per IP: 5 posts per 10 minutes (Vercel firewall rule or Netlify's built-in
  spam filtering).
- Return generic errors to the browser; log details server side only.
- No CAPTCHA unless spam gets through. If it does, Cloudflare Turnstile, and add its
  origin to `script-src` and `frame-src`.

## Personal data

- No phone number or home address anywhere on the site or in the CV file.
- Email on the page is assembled by JS from `data-user` and `data-domain`; without JS it
  reads "vedant at vedantvkdesai dot com". Keeps casual scrapers off.
- Strip EXIF and GPS from every photo before it goes into `src/` (phone photos carry the
  location). Re-saving through Pillow or the blueprint script drops it; check with
  `exiftool` if unsure.
- No analytics or cookies at launch, so no cookie banner is needed.

## Repo

- Keep the repository private. It holds working docs that aren't part of the site.
- Never commit `.env` files or API keys. `.gitignore` already covers them, and
  `.claude/settings.json` blocks Claude Code from reading them.
- Only `dist/` is deployed. `docs/`, `tools/`, `CLAUDE.md` and `AGENTS.md` never reach
  the live site.

## Checks before launch

- securityheaders.com grades the live domain A or A+.
- Mozilla Observatory score 90+.
- Browser console shows no CSP violations on any page.
- The form rejects: an empty post, a 5000 character brief, an email with a line break,
  a post sent in under 3 seconds, a filled honeypot.
