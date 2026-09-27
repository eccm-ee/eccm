# The social image pipeline: what trip built, and how it meets the scheme

Written 2026-09-27 from the code on this disk, nothing fetched, nothing built,
nothing drawn. Asked, dictated: *"in parallel research the OG images
generation, Facebook image generation and Instagram images generation from
trip ... it has full implementation of social media image generation, so look
it up, and note that the whole pipeline need to work together with our style
detection from images. That data which will travel along the content, you need
to also figure out the schema, where to store those CSS variable values for
the posts. We need it in OG as well; I think it's not a problem because OG
will be generated after the content is being created or saved or updated. I
have some ideas how social media should look, so don't do anything yet there
visually, just investigate the pipeline."*

**The marks.** READ is a file on this disk read today, named by path.
MEASURED is a number taken today, with the command. MEMORY is something not
checked today and is marked so a reader knows what would have to be looked up.
`../trip` means `/Users/s32863/personal/trip`.

## The verdict

trip renders every social card as an SVG string composed in plain JavaScript,
rasterised on the Worker by `@resvg/resvg-wasm` with two TTF fonts handed in
as buffers, and, when the card carries a photograph, drawn as a transparent
PNG overlay onto the photograph by the Cloudflare Images binding. A card's URL
carries an 8 hex hash of everything visible in it plus a template version, so
a change of content is a new URL and never a purge; the bytes are memoised in
R2 on the first fetch and served with a one year immutable cache. Nothing in
it is Astro-specific except the route wrapper, and nothing in it decides a
colour: every hex in trip's cards is a literal because resvg has no CSS
cascade. That last fact is the whole interface to the derive page. **The
scheme travels as one JSON column on the picture row, the card renderer reads
its hexes and its face out of that JSON and writes them into the SVG as
literals, and the same JSON sets the `--ev-*` custom properties on the event
page.** The card is generated after a save, as the owner says, with the lazy
render on a miss kept as the safety net, and its URL changes when the scheme
or the content does, because scrapers cache by URL.

## 1. What trip's pipeline is, exactly

**The renderer.** `@resvg/resvg-wasm` at `^2.6.2` in `package.json`, `2.6.2`
installed (MEASURED: `node -e "require('./astro-prod/node_modules/@resvg/resvg-wasm/package.json').version"`).
No satori anywhere in production: `satori`, `yoga-wasm-web`,
`@resvg/resvg-js` and `@cf-wasm/photon` are all absent from
`astro-prod/node_modules` (MEASURED, same command per package). The prototype
`../trip/astro-dev` composes its cards in plain JavaScript too and rasterises
with the native `@resvg/resvg-js` `^2.6.2` (READ, `astro-dev/package.json`
line 12), which is Node only; `plans/og-cards.md` says so in its first step:
*"astro-dev og.js is pure-JS SVG composition (NO satori)"*. The one line in
`plans/images.md` reading *"satori → resvg"* describes the prototype loosely
and the og-cards plan is the corrected account.

**Where it runs.** Astro `^7` on `@astrojs/cloudflare` `^14` (READ,
`astro-prod/package.json`), four server routes with `export const prerender =
false`, so a card is rendered at request time inside the Worker on the first
fetch of its URL, then served from R2. No cron, no queue, no publish-time
step: `plans/images.md` lines 53 to 75 planned publish-time baking for
composer artifacts, and what shipped for threads, news and offers is the
lazy class, *"render-once-store-forever"*, because *"never-shared threads
cost zero"* (READ, `plans/og-cards.md`).

**The card kinds and their sizes** (READ, the four route files and
`lib/og-card.ts`, `lib/og-news.ts`, `lib/og-offer.ts`):

| route | what | size | format | composition |
| --- | --- | --- | --- | --- |
| `/og/t/{id}-{v}.png` | forum thread | 1200 by 630 | PNG | the dotted regional map with a located dot, title, wordmark, since 2026-08-15 (`TEMPLATE_V` 6) |
| `/og/n/{id}-{v}.jpg` | news with a hero | 1200 by 630 | JPEG q85 | the hero cover-cropped, a scrim and the white wordmark bottom-left, no text ever |
| `/og/n/{id}-{v}.png` | news without a hero | 1200 by 630 | PNG | the brand card, flat ink `#303436` and the wordmark |
| `/og/o/{id}-{v}.jpg` or `.png` | flight offer | 1200 by 630 | JPEG or PNG | hero plus scrim plus white title (at most 3 rows, `w/20`) plus a summary line (`w/34`) plus wordmark; brand card when photo-less |
| `/ig/o/{id}-{v}.jpg` or `.png` | the offer's Instagram card | 1080 by 1350, 4:5 | JPEG or PNG | the same builder with its own geometry, 6 title rows |

There is no Facebook-specific size: Facebook, X, LinkedIn, WhatsApp and Slack
all read the `og:image` and trip verified *"FB + X previews render the card"*
(READ, `plans/og-cards.md`). Instagram is not an Open Graph consumer, so
`/ig/o` is a file to download and post by hand, which the worklog says is the
strategy (*"Posting stays manual"*, READ, `worklog/2026-07.md` line 1466).
Square 1080 by 1080 and carousels exist only in the prototype (READ,
`plans/images.md` line 145, `worklog/2026-07.md` line 1466). Every geometry
is a ratio of the card width, `pad = w/16`, wordmark `w/6`, title `w/20`,
summary `w/34`, so one set of rules holds at both sizes (READ,
`lib/og-offer.ts`, the `Geo` type).

**Fonts.** Sailec Regular and Bold as TTF, 89,680 and 89,932 bytes
(MEASURED, `ls -l astro-prod/src/fonts`), imported with Vite's `?inline` as
data URIs, decoded to `Uint8Array` and passed to resvg as `fontBuffers` with
`loadSystemFonts: false` and `defaultFontFamily: 'Sailec-Regular'` (READ,
`lib/og-render.ts`). The woff2 files beside them are the web fonts and are
not used by the renderer; the header of `og-render.ts` says the TTFs are
*"woff2→ttf-converted Sailec masters"*, which is the evidence that resvg wants
TrueType or OpenType bytes. A converted webfont TTF carries a per-weight
family name, so bold text names `Sailec-Bold` as a family and `font-weight`
alone would never select it (READ, `lib/og-card.ts`). Medium is woff2 only
and is not in the renderer (READ, `worklog/2026-07.md` line 2404).

**The picture inside a card.** The hero master is read from R2 through the
`MEDIA` binding on bucket `trip-media`, then
`env.IMAGES.input(hero.body).transform({ width, height, fit: 'cover' }).draw(overlayPng, { left: 0, top: 0 }).output({ format: 'image/jpeg', quality: 85 })`
(READ, `pages/og/n/[card].ts`). The overlay is itself an SVG rendered by
resvg to a transparent PNG at the card's size: the news logo overlay renders
once per isolate and is drawn onto every hero, the offer and Instagram
overlays carry per-offer text and render per request, *"resvg is ~tens of
ms"* (READ, `pages/og/o/[card].ts`). The URL-based `/cdn-cgi/image` service
cannot overlay; only the binding's `draw()` can, and the binding has to be
declared as `"images": { "binding": "IMAGES" }` or the adapter never injects
it, which was the first 404 (READ, `wrangler.jsonc`, `plans/og-cards.md`).

**What is cached where, keyed on what.** The route checks R2 first under
`og/n/{id}-{v}.{ext}`; on a miss it queries the row, recomputes `v`, and if
the URL's `v` is stale answers `302` to the current path with
`cache-control: no-store`; otherwise it renders, `PUT`s to R2 in the
background through `waitUntil` (READ, `lib/bg.ts`, which logs a `bg-failed`
line rather than dropping silently), sets the edge cache to a year with tag
`og`, and answers with `cache-control: public, max-age=31536000, immutable`
and an `x-og: r2` or `x-og: render` header for observability. A missing row
is `404` with `no-store`, so a fetch made before the content exists cannot
poison the URL (READ, all four routes). `v` is FNV-1a over the visible
inputs joined with `|` plus the template version: for threads
`title|author|date|comments|TEMPLATE_V`; for news `bg_key|title|author|date|TEMPLATE_V|LOGO_V`;
for offers `bg_key|title|summary|TEMPLATE_V|OFFER_V` (READ, the three lib
files). The page builds the `og:image` URL with the same function, so page
and card re-key together, and a visual change is a constant bump that
orphans every stored card without a purge (READ, `lib/og-card.ts`, the
comment on `TEMPLATE_V`).

**Tests** (READ, `test/og.test.ts`, `test/og-news.test.ts`): the thread page
carries `og:image` with an 8 hex version, `twitter:card summary_large_image`
and `article:published_time`; the index carries no `og:image`; `robots.txt`
allows the preview crawlers; the endpoint answers `200 image/png` with a PNG
signature and more than 1,000 bytes, the second fetch reads `x-og: r2` within
a 5 s poll, a stale version `302`s, a bad id `404`s with `no-store`;
`cardVersion` changes on every input; the SVG escapes markup and carries the
byline. The photograph path needs the Images binding and a real R2 hero and
is *"live-smoke territory"*, tested by hand after deploy (READ,
`test/og-news.test.ts` header). `test/bot.test.ts` is the view-counting
classifier and lists `facebookexternalhit` as a bot, which matters only in
that trip treats scraper fetches as non-views.

**The limits it hit, with the numbers the worklog recorded.**

- The wasm is 2,478,606 bytes (MEASURED, `ls -l node_modules/@resvg/resvg-wasm/index_bg.wasm`,
  the same size in `dist/server/_astro/`), and *"MUST arrive as a
  compiled-module import (runtime WebAssembly.compile is forbidden)"* on
  workerd; one `initWasm` per isolate, a second call throws, guarded by a
  module-level promise (READ, `worklog/2026-07.md` lines 1930 to 1940,
  `lib/og-render.ts`).
- A miss renders in about 82 ms wall time, *"miss app;dur ≈ 82 ms"*, a
  thread card is a 45 to 46 KB PNG, the Malta news card a 200 KB JPEG (READ,
  `plans/og-cards.md`, `worklog/2026-07.md` line 1937). CPU time was never
  written down separately.
- The prototype's map sampled Natural Earth land with point-in-polygon at
  render time through `fs` and `d3-geo` and *"can't run on workerd"*, the
  blocker the worklog calls P18; solved by baking a 1 degree land mask
  offline into a 5.8 KB base64 bitset of 14,761 cells, so the prod renderer
  is arithmetic only (READ, `worklog/2026-08.md` lines 588 to 597).
- `plans/images.md` line 57: *"never per-request rendering on the og:image
  path (crawlers hammer it; the render is ~100s of ms)"*, which is why every
  route memoises.
- Scrapers reject WebP and AVIF, so a card is PNG or JPEG, the *"standing
  rule"* (READ, `plans/images.md` line 73, `lib/og-offer.ts` header).
- Meta's Sharing Debugger reported a synthetic `403` for a day while the
  zone served `200`s: their parser does not honour a shared robots group, so
  `robots.txt` needs one `User-agent` group per bot, and Meta caches
  `robots.txt` for about 24 hours (READ, `plans/og-cards.md`, the Meta-403
  saga).
- X draws its own title pill over the card's bottom-left, where trip's byline
  sits; Facebook, LinkedIn and WhatsApp draw nothing over it (READ,
  `plans/og-cards.md`).
- On the offer card *"the scrim was a red herring; the bug was font size"*:
  a title at `w/14` over 4 rows climbed into the bright sky of the
  photograph where no bottom-anchored scrim reaches; the fix was the compact
  `w/20` over 3 rows so the stack sits inside the dark part (READ,
  `worklog/2026-07.md` lines 2524 to 2536). A temporary version marker in a
  corner ended the *"did it even deploy?"* confusion, because tag purges are
  eventually consistent and a stale card masquerades as a broken one.

## 2. What trip learned, and what its standing contracts say

- **No headline text on a news card, ever**, from an 11 outlet survey in
  which 0 of 11 bake text and 8 of 11 serve the plain recropped hero, 3 add
  a small corner logo (READ, `plans/og-cards.md`, News OG images). Offers are
  the composed class and bake title and summary onto the photograph; the two
  classes are a deliberate pair, not a contradiction. Which class an ECCM
  event card belongs to is the owner's visual decision and this plan does not
  make it.
- **The Instagram card is a generated image, not an HTML mock**: the `/ds`
  page had shown an HTML card over a CDN thumbnail and the owner *"rightly
  called it out"* (READ, `worklog/2026-07.md` line 2538).
- **The scrim went lighter, not heavier**: a 0.78 bottom scrim *"made photos
  muddy"* and the shipped news scrim is 0.55 at the bottom, 0.15 at 30 per
  cent, clear at 55 per cent, only enough for the logo corner to read (READ,
  `lib/og-news.ts`).
- **A logo lockup sits on its baseline at the padding line with the
  descender hanging into the padding**, and a dot that would straddle the
  card edge is nudged 6 px so no dot straddles; both are CARD rules and were
  kept off the site header on purpose (READ, `lib/og-news.ts`, `plans/specs.md`
  line 207).
- **Tried and dropped**: the typographic thread card (superseded by the map
  on 2026-08-15, `TEMPLATE_V` 5 to 6); a separate logo PNG asset (replaced by
  rendering the overlay from the logo's SVG through the same resvg pipeline);
  a text drop-shadow halo and a text-height band under the offer title
  (rejected in favour of smaller type); the `astro-seo` package (30 lines of
  own markup beat a dependency); `format=auto` on the OG path (rejected by
  the PNG or JPEG rule) (READ, `plans/og-cards.md`, `worklog/2026-07.md`).
- **The standing contracts** (`plans/images.md` lines 53 to 75, status
  shipped): generated cards are a fourth class of image, artifacts not
  uploads; composer-published artifacts bake at publish time under
  `og/<content-hash>.png`; the long tail bakes lazily on first crawler fetch
  with R2 memoisation and a static brand card as the fallback on render
  failure; `og:image` URLs are absolute and stable per content version;
  1200 by 630 fixed; PNG or JPEG only; Lighthouse never sees OG images, so the
  format rule costs nothing.

## 3. What carries over to eccm, what changes, what is not needed

**Unchanged, because it is not about trip's content:**

- `@resvg/resvg-wasm` as the rasteriser, imported as a compiled module,
  initialised once per isolate, fonts as buffers, `loadSystemFonts: false`.
- The SVG-as-string composition with a per-character width table, greedy
  wrap, the balance search and `fitTitle` stepping the size down to 72 per
  cent before an ellipsis, about 80 lines in `lib/og-card.ts` (READ). The
  width table is tuned for Sailec and has to be re-measured for Schibsted
  Grotesk and Source Serif 4, which is a table and not a design.
- The URL contract: `{id}-{v}.{png|jpg}`, `v` an FNV-1a 8 hex over the
  visible inputs plus a template version, stale `302` with `no-store`, missing
  `404` with `no-store`, `immutable` for a year, `x-og: r2|render`.
- R2 memoisation in `waitUntil` with a logged failure, the edge cache with a
  tag, and the brand card fallback when a render fails.
- The overlay-as-transparent-PNG trick and the Images binding's
  `transform(...).draw(...)` for any card that carries the photograph; the
  binding declared explicitly in `wrangler.jsonc`.
- The meta contract: absolute `og:image` with width, height, type and alt,
  `twitter:card summary_large_image`, `og:type article`, and `robots.txt`
  with one group per preview bot above the noindex posture, which
  `plan-eccm-cms.md` section 13 already carries (READ).
- The test shape: page carries the versioned URL, endpoint renders real
  bytes, second fetch from R2, stale redirects, bad id 404, version function
  sensitive to every input, SVG escaping.

**What has to change:**

- No Astro. eccm is planned as one Worker with server-rendered HTML and a
  router in `src/index.mjs` (READ, `plan-eccm-setup.md` section 4), and today
  it is static assets with no script at all (READ, `wrangler.jsonc`). trip's
  routes become two handlers in that router, `GET /og/e/...` and
  `GET /ig/e/...`, and `ctx.cache.set` becomes a `Cache-Control` header plus
  the `caches.default` API if wanted.
- The content is an event in two languages: title, date and time, venue,
  category, the picture, from the `event`, `event_text` and `media` tables
  (READ, `plan-eccm-cms.md` section 7). trip hashes `bg_key`; eccm hashes the
  media row's `r2_key` and the scheme, see section 5.
- **Every colour and face in the SVG comes from the scheme JSON, not from a
  constant.** trip writes `#f1f3f5`, `#303436`, `#607684` as literals with the
  comment *"resvg composes the SVG with no CSS cascade, so var() never
  resolves here"* (READ, `lib/og-card.ts`). That constraint is exactly why
  the scheme has to be stored as values and not as a stylesheet: the card
  renderer takes `scheme.ground`, `scheme.ink`, `scheme.ink2`,
  `scheme.accent`, `scheme.titleFace` and writes them into `fill` and
  `font-family` attributes.
- Fonts: Schibsted Grotesk and Source Serif 4 as TTF, section 6.
- Two languages mean either two cards per event, one per language page, or
  one language-neutral card. That is content, so it waits for the owner's
  visual ideas; the URL contract carries `lang` either way.
- Images binding transforms on this account are the free tier's 5,000
  uniques a month (READ, `plan-eccm-cms.md` section 6 quoting Cloudflare),
  which section 9 prices.

**Not needed:** the dotted map, its baked land mask and the gazetteer
resolver; the offer summary with carriers and validity; Hyperdrive and
Postgres (eccm is D1); the bot classifier; the composer's carousels; the
avatar pipeline; `LOGO_V` as a separate constant unless the logo lockup gets
tuned separately from the template.

## 4. The data that travels with the content: the scheme

**What the derive page computes today** (READ, `public/derive.html`,
`readColour` returning at line 174, `readType` at line 269, `scheme()` at
lines 273 to 376, `sample()` at lines 383 to 410). Colour is read on a 64 px
canvas: mean luminance, mean chroma, the vivid share, the cast (mean OKLab
`a`,`b` as a hue and chroma), the three biggest 4 bit colours with shares,
the four edges (flat or not, share, median colour), the seed hue and every
hue bin with its share, then the mode (dark under 0.22 luminance unless the
picture is not about black and has a wall), a ground with a note, ink and
muted ink, an accent or none with a note, the button fill and its text, the
serif verdict and how it was reached. Type is read on a canvas at most 600 px
wide: verdict `serif`, `sans`, `unsure`, `no type found` or `type too small
to read for serifs`, with the shape counts, the serif-like share, median
stroke contrast, median foot and polarity. The sample sets nine custom
properties: `--ev-ground`, `--ev-ink`, `--ev-ink2`, `--ev-accent` (only when
there is one), `--ev-btn-fill`, `--ev-on-btn`, `--ev-title-face`,
`--ev-title-weight` (only when serif), `--ev-body-face`.

**The contract, one JSON column named `scheme` on the `media` row**, the
picture row of `plan-eccm-cms.md` section 7, recomputed whenever the row's
bytes change (a new `r2_key` is a new row, so in practice computed once per
upload) and re-run in bulk when the detector version changes. The CMS plan
being written in parallel uses this exact shape:

```json
{
  "v": 1,
  "detector": "derive-2026-09-27",
  "mode": "light",
  "ground": "#d9c8d9",
  "ink": "#1a1a1a",
  "ink2": "#4d4d4d",
  "accent": "#805e55",
  "btnFill": "#1a1a1a",
  "onBtn": "#ffffff",
  "titleFace": "'Source Serif 4', Georgia, serif",
  "titleWeight": 400,
  "bodyFace": "inherit",
  "serif": true,
  "serifHow": "the detector read the type as serif",
  "notes": { "ground": "the picture’s mid tone #aa99aa, 7 per cent of it, taken half way to white with its chroma kept to 0.03; the picture is not about black", "accent": "chroma 0.047, hue 36; on the ground 3.61:1, for underlines and focus only" },
  "readings": {
    "meanY": 0.18, "meanC": 0.021, "vivid": 0.03, "cast": { "C": 0.016, "h": 347 },
    "top": [{ "hex": "#000000", "share": 0.11 }, { "hex": "#110011", "share": 0.08 }, { "hex": "#aa99aa", "share": 0.07 }],
    "edges": { "top": { "flat": false, "share": 0.70 }, "bottom": { "flat": false, "share": 0.10 }, "left": { "flat": false, "share": 0.30 }, "right": { "flat": false, "share": 0.30 } },
    "flatAll": false, "seed": [0.65, 0.043, 36], "hues": [{ "share": 0.01, "lch": [0.65, 0.043, 36] }], "wall": { "hex": "#aa99aa", "share": 0.07 },
    "type": { "verdict": "type too small to read for serifs", "found": 13, "n": 6, "small": 7, "share": 0.83, "contrast": 0.5, "foot": 1.5, "polarity": "light type on dark", "W": 300, "H": 200 }
  }
}
```

`accent` is `null` when the picture gives none, `titleWeight` is present only
when `serif` is true, and every hex is what `sample()` writes into the custom
properties today, so the event page sets `--ev-ground: scheme.ground` and so
on from the same object on the event's root element, and the card renderer
writes `fill="${scheme.ground}"`, `fill="${scheme.ink}"`,
`font-family="${scheme.serif ? 'SourceSerif4' : 'SchibstedGrotesk'}"` into
the SVG. `readings` is kept because it is what a reader of a bad card needs
to argue with, the way the derive page's readings rows are; `notes` are the
two sentences the derive page prints. `detector` is a date-stamped name and
`v` is the shape version; a rule change on the derive page bumps `detector`,
and a bulk re-run rewrites the column for every row whose `detector` is
older, which changes every card's hash and therefore every card URL, which is
correct.

**Where the reading runs.** Today it runs in a browser with `canvas` at
`https://eccm.positron.studio/derive`. Three ways to run it on a save:

1. **In the editor's browser, before the POST.** The same module reads the
   file the editor picked, with `createImageBitmap` and a canvas, and the
   scheme rides in the form body beside the upload. Exactly the code that
   exists, zero Worker CPU, the same result the derive page shows. The costs:
   the Worker has to trust the client's numbers, which is fine for an editor
   behind Access and wrong for anybody else; an import script and a detector
   bump need a browser too, which `tools/shot.mjs` already drives headlessly
   (a CDP script read pictures through the derive page's own functions
   today), so `scripts/rescheme.mjs` is a headless Chrome pass over every
   media row.
2. **On the Worker, with a decoder.** workerd has no canvas. The Images
   binding can resize a picture to 64 px and hand back PNG bytes, and a PNG
   is zlib inside, which `DecompressionStream('deflate')` can inflate, so a
   64 px colour reading is a small decoder plus the existing arithmetic
   (MEMORY: that a Worker can inflate PNG data with `DecompressionStream`;
   not tried). The type reading at 300 px is a connected-components pass
   over 45,000 pixels and its CPU time on workerd has not been measured; the
   Free plan allows 10 ms of CPU per invocation (READ, `plan-eccm-cms.md`
   section 6), which the type pass may exceed. A wasm decoder such as photon
   is the other road and adds a second wasm to the bundle.
3. **Browser Rendering.** A real Chrome on Cloudflare runs the derive page
   itself; it is a paid binding and heavy for a 64 px reading.

The recommendation is 1, with the Worker storing what the editor's browser
computed and `scripts/rescheme.mjs` for imports and detector bumps, and 2 as
the thing to measure before the editor exists, since the CMS first step has
no editor and imports its pictures by script. Either way the Worker never
computes a scheme on the request path.

**What the card renderer reads from it**: `mode`, `ground`, `ink`, `ink2`,
`accent`, `btnFill`, `onBtn`, `serif`; nothing from `readings`. What the
version hash reads from it: the whole JSON, hashed, so a scheme change is a
card change (section 5).

## 5. When a card is generated, and what its URL is

The owner's model, *"OG will be generated after the content is being created
or saved or updated"*, and trip's model, render on the first fetch, are
combined rather than chosen between:

- **On save of a published event**, the Worker computes the version, writes
  the event page with that URL in its `og:image`, and in `waitUntil` renders
  the card and `PUT`s it to R2. The scraper that arrives later finds the
  object. A save of a draft renders nothing.
- **On a fetch that misses R2**, the route renders and memoises, as trip's
  does, so a background render that failed, an import that skipped a row, or
  a detector bump that re-keyed every card cannot produce a broken preview.
  The brand card is the fallback when the render itself throws.

**The key.** `og/e/{id}-{lang}-{v}.{png|jpg}` and `ig/e/{id}-{lang}-{v}.{png|jpg}`
in the `eccm-media` bucket the CMS plan already names, with

```
v = fnv1a8( title | starts_at | ends_at | venue | category | media.r2_key | fnv1a8(scheme JSON) | scheme.detector | TEMPLATE_V )
```

The scheme hash rides inside the version so a re-derived scheme is a new
card; `TEMPLATE_V` is bumped on any visual change and orphans every stored
card; nothing is ever purged. Bytes live in R2, never in KV (a card is 45 KB
to 200 KB, READ trip's numbers, and KV values are for small things) and never
only in the Cache API, which is per colo and evictable.

**The URL is not stable while its bytes change, on purpose.** Facebook,
LinkedIn and Slack cache a preview by URL and refetch only through their
debuggers (READ, `plans/og-cards.md`: Meta re-scrapes on request and caches
`robots.txt` about 24 hours), so a stable URL with new bytes shows the old
card to everyone who has ever shared it. trip's versioned URL with a `302`
from the stale one is the way a change reaches the platforms without a
manual re-scrape, and it is what eccm keeps. The page's URL stays stable;
the card's does not.

## 6. Fonts

resvg takes raw TrueType or OpenType bytes in `fontBuffers`; trip converted
its woff2 web fonts to TTF for the renderer (READ, `lib/og-render.ts` header,
`worklog/2026-07.md` line 1913 *"woff2→ttf conversion already done"*), and
that resvg reads no woff2 is MEMORY consistent with that conversion. eccm's
`public/vendor/` holds only woff2 subsets (MEASURED, `ls -l public/vendor`):
Schibsted Grotesk latin 20,844 and latin-ext 46,864 bytes, Source Serif 4
latin 100,772 and latin-ext 29,664 bytes, both under the OFL whose texts sit
beside them, so bundling them in a Worker is allowed. The derive page's title
face is Source Serif 4 at weight 400 and its sans is Schibsted Grotesk at
400 (READ, `public/derive.html` line 412, `public/eccm.css` through the
`eccm-ui` skill).

What has to be added: static TTF instances of Schibsted Grotesk Regular and
Source Serif 4 Regular, subset to latin plus latin-ext so Estonian keeps
`õäöüšž`, sizes to be measured after subsetting (a full Source Serif 4
variable TTF is several hundred KB, MEMORY), placed under `src/fonts/` and
imported as data modules through a wrangler `rules` entry of type `Data`
(MEMORY: wrangler supports `Data` module rules for arbitrary binary files;
trip used Vite's `?inline` instead because Astro bundles for it). Each with
a distinct family name so the SVG can name the face by family, as trip does
for weights. A second weight is added only if the owner's visual ideas ask
for one.

## 7. The pipeline, step by step, nothing visual decided

1. An editor uploads a picture. The bytes are hashed, put to R2 as
   `media.r2_key`, the `media` row is written with width, height and the
   alts (READ, `plan-eccm-cms.md` section 7).
2. The scheme is computed for that picture, in the editor's browser at
   upload or by `scripts/rescheme.mjs`, and stored in `media.scheme` with its
   `detector`.
3. The event is saved. The renderer of the event page sets the `--ev-*`
   custom properties from `media.scheme` on the event's root element, and
   the head carries `og:image` with the versioned URL of section 5, plus
   width, height, type and alt.
4. If the event is published, the save handler renders the OG card and the
   Instagram card in `waitUntil` and `PUT`s both to R2 under their versioned
   keys.
5. **The composition step, `eventCardSvg(kind, geo, content, scheme)`**,
   returns an SVG string with literal hexes and family names from the scheme
   and the text laid out by the ported text engine. **This is the one step
   the owner's visual ideas plug into**, behind `TEMPLATE_V`; everything
   before and after it is plumbing that does not change when the look does.
   If the card carries the photograph, this step returns an overlay and step
   6 draws it; if not, it returns the whole card.
6. `renderPng(svg, width)` through resvg-wasm with the two font buffers;
   for a photograph card, the Images binding cover-crops the R2 original to
   the card size and `draw()`s the overlay, output JPEG quality 85; otherwise
   the PNG is the card.
7. `GET /og/e/{id}-{lang}-{v}.{ext}` and `GET /ig/e/...`: R2 hit streams
   with `immutable`; miss recomputes `v` from the row, `302`s a stale one,
   renders steps 5 and 6, memoises, serves; unknown id `404` `no-store`.
8. `robots.txt` lists the preview crawlers one group each above the noindex
   posture, which today is the `X-Robots-Tag` in `public/_headers` (READ).
9. Tests as in trip: the page carries the URL, the endpoint renders, the
   second fetch is `r2`, stale `302`, bad id `404`, the version function is
   sensitive to every input including the scheme JSON, and one check that a
   known scheme produces the expected literal hexes in the SVG.

## 8. What could not be settled from this disk, and what would settle it

- **Whether the 2,478,606 byte wasm fits eccm's Worker.** Workers Free caps
  a script at 3 MB compressed and Paid at 10 MB (MEMORY). trip's plan is not
  written in its config. Settled by `npx wrangler deploy --dry-run --outdir
  tmp/dry --env staging` and gzipping the output once the Worker exists.
- **CPU time of a render on the Free plan.** trip recorded 82 ms wall per
  miss and never CPU; the Free limit is 10 ms CPU per invocation (READ,
  `plan-eccm-cms.md`). Settled by one render under `wrangler dev` with the
  `cpuTime` field in Workers Logs, or a live probe; if it does not fit, the
  answer is the Paid plan at $5 a month or rendering at save time only, where
  a longer `waitUntil` has the same limit and would also need measuring.
- **Whether `draw()` on the Images binding is on the free tier and how a
  drawn card counts** against the 5,000 uniques. trip's own note reads
  *"whether the Images paid plan has a base fee (UNVERIFIED)"* (READ,
  `plans/images.md` line 316). Settled by one drawn card on this account and
  the dashboard's uniques counter the next day.
- **The type reading's CPU cost on workerd**, section 4 option 2. Settled by
  porting `readType` to run on a decoded 300 px buffer in Node and timing
  it, then the same on `wrangler dev`.
- **Whether eccm's account is on Workers Free or Paid.** Not readable from
  any file here; the dashboard or `wrangler whoami` plus the plan page says.
- **The per-character width table for Schibsted Grotesk and Source Serif 4.**
  trip's is *"measured Sailec-ish factors"* (READ, `lib/og-card.ts`); a new
  table is measured with `measureText` in a browser once the faces are
  chosen, which is a morning.
- **Facebook's acceptance of the versioned flow** trip verified for its own
  domain (READ); for `eccm.positron.studio` behind `noindex` it is one Sharing
  Debugger fetch after the first deploy.

## 9. Cost

- A render: about 82 ms wall on a miss (READ, `plans/og-cards.md`), the
  overlay *"tens of ms"* (READ, `pages/og/o/[card].ts`), CPU unknown. One R2
  Class A `PUT` per card against 1 million free a month, one Class B `GET`
  per edge miss against 10 million (READ, `plan-eccm-cms.md` section 6
  quoting Cloudflare).
- A photograph card: one Images transformation unique per picture and size,
  so about 100 events with one picture each at two sizes is 200 uniques
  against 5,000 free, then $0.50 per 1,000 (READ, same section). Whether a
  `draw()` is a second unique is section 8.
- Bytes: 45 to 46 KB for a typographic PNG, about 200 KB for a photograph
  JPEG (READ, trip's numbers); a cold transform of a 5 MB original took trip
  490 ms to 1.3 s and trip prewarms the newest ten (READ, `plan-eccm-cms.md`
  quoting `plans/images.md`).
- trip's whole-system prospective bill after cutover: *"≈ $0–5/mo transforms
  + ~$0.05/mo R2"* (READ, `plans/images.md` line 306). ECCM is smaller by
  two orders of magnitude and sits inside the free tiers unless the Worker
  needs the Paid plan for CPU or bundle size, which is the one number in
  section 8 that changes the bill.

## 10. Reconciliation with plan-eccm-cms-step-1.md, 2026-09-27

The two plans were written in parallel and agree on everything that matters:
one JSON column `scheme` on the `media` row, a version beside it, `mode` and
the serif verdict, the nine derived values, the readings kept for argument,
recomputed only when the picture changes. They differ in the JSON's shape:
this plan writes flat keys (`ground`, `ink`, `titleFace`, `detector` as a
dated name) and the CMS plan writes a `vars` object keyed by the nine CSS
custom property names with an integer `v`. **Recommended: this plan's flat
shape**, because the card renderer writes literal hexes and family names and
would otherwise strip `--ev-` prefixes, while the event page builds its nine
properties from the flat keys through one fixed map of nine lines. Keep the
CMS plan's `scheme_v` integer column beside the JSON for bulk re-runs, and
carry `detector` inside the JSON as the human name of that version. The
decision is taken at session 3 of the CMS plan, before any row is written.
