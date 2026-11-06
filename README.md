# Eden House The Park

Landing page for Eden House The Park (Next.js 16, App Router), connected to
the Refine admin panel (`https://projects-admin.refinedubai.com`) the same way
as Movenpick and Oceara.

| | Live | Staging |
|---|---|---|
| Branch | `main` | `stg` |
| Address | `https://edenhousethepark.refinedubai.com` | `https://stg-edenhousethepark.refinedubai.com` |
| Panel site key | `edenhousethepark` | `edenhousethepark-staging` |

Work goes to `stg` first; `main` is updated only once staging is approved.

## Running it

```bash
npm ci
npm run dev        # http://localhost:3000
npm test           # unit tests (node:test)
npx eslint src scripts test
npm run build
```

No environment variables are needed locally: the site renders exactly as
designed from the committed snapshot and the code defaults. See
`.env.example` for every variable.

## How content works

Every word, image, link and list on the page is a field in the panel. Each
field resolves, in order, to:

1. the panel (`CONTENT_API_URL` + `CONTENT_API_TOKEN`), one request per
   render, cached and tagged `content`;
2. `src/content/snapshot.json`, the last published content, used when the
   panel cannot be reached;
3. the default in `src/content/sections/*.js`, which is the page's original
   copy.

So the panel being down, slow or not yet set up never breaks the page.

- **Sections** live in `src/content/sections/`, registered in
  `src/content/sections/index.js` (`SECTION_REGISTRY`, `SECTION_GROUPS`).
  Repeating content (menu links, figures, cards, layouts, destinations,
  instalments, contact details, partners...) is a `LIST` field.
- **Manifest**: at every server start `src/instrumentation.js` pushes the
  registry to the panel (`POST /api/v1/manifest`), so the editor always
  matches the code. It never blocks start-up and never throws.
  `test/manifest-limits.test.mjs` enforces the panel's limits (100 fields per
  section, key pattern, label and helper-text lengths, 1 to 20 item fields,
  no nested lists), because the panel refuses the whole manifest otherwise.
  Do not rename a section slug or field key once content is saved.
- **Formatting**: any TEXT field may hold bold, italic, underline, line
  breaks, font weight/style spans and safe links. Values are sanitised on the
  server (`src/lib/inline-html.js`) and rendered with `<InlineText>`.
  Attributes (alt, aria-label, meta tags) use plain text. Chat text is always
  plain text, because it is mixed with what the visitor types.
- **Privacy and Terms** are RICHTEXT fields, sanitised again on this site
  (`src/lib/sanitize-rich-text.js`). Their default is a holding notice, not
  legal text: replace it with counsel-reviewed copy before launch.
- **Instant updates**: the panel calls `POST /api/revalidate` with
  `Authorization: Bearer <REVALIDATE_SECRET>` after a save.
- **Preview**: the panel's preview link opens `/api/preview?token=...`; the
  token is checked with the panel before draft mode is turned on.
  `/api/preview/exit` leaves preview.
- **Snapshot**: refresh after significant content changes, from the LIVE
  site's values, then commit:

  ```bash
  CONTENT_API_URL=https://projects-admin.refinedubai.com CONTENT_API_TOKEN=... \
  SITE_KEY=edenhousethepark npm run content:snapshot
  ```

  The first snapshot was made from the code defaults
  (`npm run content:snapshot -- --from-defaults`). While it holds the
  defaults, changing a default in code also needs that command re-run, or
  the old snapshot value keeps showing.

## Leads

The contact form and the chat post to `/api/eden-lead`; the chat's call-back
slot posts to `/api/eden-lead-slot`. The server:

- accepts only `Content-Type: application/json` (exactly, after removing
  parameters) and bodies up to 16 KB;
- validates every field (lengths, email and E.164 phone patterns, consent);
- drops bots that fill the hidden honeypot field;
- rate-limits by the visitor's real IP (`src/lib/client-ip.js`; set
  `CF_ORIGIN_SECRET` so the Cloudflare IP cannot be spoofed);
- guards against spreadsheet formulas (a leading `= + - @`, tab or CR gets an
  apostrophe, except a value that is wholly a phone number);
- forwards to the panel's `/api/leads/intake` with the site key, the visitor's
  IP and the browser's `submissionId`, so a retry is stored once.

The visitor sees "Thank you" only when the panel (or another configured
destination) confirmed the lead; otherwise the form shows its error message
and can be sent again. Logs never include personal data. Zapier is optional
and off unless its webhook variables are set.

## Search engines and staging

- `robots.txt` disallows everything unless the panel's "Allow search engines
  to index this site" is on AND the site is not staging.
- Staging (any `stg-` address, by `SITE_URL` or by the request's host) always
  sends `X-Robots-Tag: noindex, nofollow` and a `noindex, nofollow` meta tag.
- `STAGING_PASSWORD` turns on HTTP Basic auth on staging (`src/proxy.js`);
  static files and `/api/revalidate` stay open.

## Security headers

`next.config.mjs` sends a Content-Security-Policy matched to what the page
loads (its own assets, Mapbox's API, events and blob workers, the panel's
media host), plus X-Frame-Options, nosniff, Referrer-Policy,
Permissions-Policy and HSTS. `X-Powered-By` is off.

## Images

`CLOUDFLARE_IMAGE_RESIZING=true` (refinedubai.com addresses only) sends
`/images/...` and `media.refinedubai.com` images through Cloudflare's
resizing; AVIF and SVG are served as they are. Otherwise Next's own optimiser
is used. `IMAGE_HOSTS` lists the hosts images may come from.

## Render environment

| Variable | Live | Staging | Where it comes from |
|---|---|---|---|
| `CONTENT_API_URL` | `https://projects-admin.refinedubai.com` | same | fixed |
| `CONTENT_API_TOKEN` | live site's API key | staging site's API key | panel, per site (secret) |
| `SITE_KEY` | `edenhousethepark` | `edenhousethepark-staging` | fixed |
| `SITE_URL` | `https://edenhousethepark.refinedubai.com` | `https://stg-edenhousethepark.refinedubai.com` | fixed |
| `REVALIDATE_SECRET` | live site's revalidate secret | staging site's revalidate secret | panel, per site (secret) |
| `IMAGE_HOSTS` | `media.refinedubai.com` | same | fixed |
| `CLOUDFLARE_IMAGE_RESIZING` | `true` | `true` | fixed |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox public token | same | Mapbox account |
| `NEXT_PUBLIC_MAPBOX_STYLE_URL` | Mapbox style | same | Mapbox Studio |
| `STAGING_PASSWORD` | not set | optional | chosen by the team (secret) |
| `CF_ORIGIN_SECRET` | optional | optional | generated, also in a Cloudflare Transform Rule (secret) |

In the panel, each site's revalidate URL is `<SITE_URL>/api/revalidate`.
