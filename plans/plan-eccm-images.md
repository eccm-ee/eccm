# Pictures on the pages: what trip does, and what eccm takes

Written 2026-09-27 on the ask, dictated: *"look up trip image handling in the
posts and index pages, size optimizations, responsive and size handling and
2x and all that stuff."* Nothing here is built; nothing visual is decided.
The card pipeline (OG and Instagram renders) is `plan-eccm-social-images.md`
and is only pointed at.

**The marks.** READ is a file or page read today, named. MEASURED is a number
taken today, with its command. MEMORY is not checked today. The trip
repository is `/Users/s32863/personal/trip`; paths under it are relative.

**The verdict.** trip keeps ONE original per picture in R2 under a hashed
key and rents every rendition from Cloudflare's zone transformations through
a `/cdn-cgi/image/` URL built by one function that holds the quality and the
format; nothing is baked except composed cards. Every `<img>` carries a
`srcset` from a fixed ladder, an honest `sizes`, explicit `width` and
`height`, `loading="lazy" decoding="async"` below the fold and
`fetchpriority="high"` with a mirrored preload for the one picture that is
the LCP; 2x and 3x screens are served by the ladder's rungs sitting about
twice apart, never by device pixel ratio hints, and the format is negotiated
by `format=auto` into AVIF or WebP per browser. eccm takes all of it, with
three ladders for its three placements, and pays about 13 unique
transformations per picture against a free tier of 5,000 a month. The one
thing eccm cannot fix without new masters: its pictures today are eccm.ee's
300 px thumbnails, soft on every 2x screen and, at JPEG quality 100, heavier
than an 800 px AVIF would be. The masters exist on eccm.ee as the
`og:image` originals, 2000 and 3682 px wide on the two pages read.

## 1. trip's page image pipeline, exactly

**Originals and keys.** One master per picture in the R2 bucket
`trip-media`, served through the custom domain `media.trip.dance`, keyed
`news/{id}-orig.{ext}`, `img/{id}-orig.{ext}`, `offers/{id}-orig.jpg` and
`av/{sha256-16}-orig.{ext}` for avatars, with the measured width and height
stored beside the key in the row (READ `plans/images.md`, the sections
"News images, RENT model" and "ONE MODEL FOR ALL IMAGES"; READ
`astro-prod/wrangler.jsonc` lines 34 to 41 for the `MEDIA` bucket binding and
the `IMAGES` binding). `Cache-Control: immutable` on PUT. Since 2026-07-15
everything is this one model: *"everything is ONE original in R2 +
/cdn-cgi renditions"*; the earlier baked ladder of webp variants was retired
the same evening, 186 baked objects deleted, because *"quality/format
decisions were frozen into R2 objects and changing them meant re-running
backfills"*.

**The transform route for pages: the URL, not the binding.** Every page
rendition is a `/cdn-cgi/image/` URL, and `astro.config.mjs` sets
`imageService: 'cloudflare'` explicitly with the comment that the adapter's
default routes every image through the Worker with a per-colo cache and no
tiered upper cache, while the URL rewrite is *"tiered cache, no worker in
the image path"* (READ `astro-prod/astro.config.mjs`). The binding exists
for one thing only, the card overlay that the URL cannot draw (READ
`wrangler.jsonc` line 40). The one function:

```ts
export const MEDIA = 'https://media.trip.dance'
export const QUALITY = 82
export const cdn = (key, t, quality = QUALITY) =>
  `${MEDIA}/cdn-cgi/image/${t},quality=${quality},format=auto/${key}`
```

(READ `astro-prod/src/lib/media.ts`.) Quality and format live in that
constant and nowhere in markup; *"changing them is a code edit + tag purge,
no backfill"*.

**The ladders, per placement** (READ the four pages and `offer-card.ts`):

| placement | file | renditions | `sizes` | intrinsic attrs |
| --- | --- | --- | --- | --- |
| article hero | `pages/uudised/[slug].astro` lines 77 to 104 | `width=960`, `1280`, `1600` as `960w 1280w 1600w`, src 1600 | `(max-width: 46rem) 100vw, 42rem` | `width={n.bg_w} height={n.bg_h}` (the master's), `loading="eager" decoding="async" fetchpriority="high"`, plus a `<link rel=preload>` mirroring src, srcset and sizes exactly |
| news thumb on the index | `pages/index.astro` lines 51 to 74 | `width=640,height=360,fit=cover` and `960x540` as `640w 960w` | `(max-width: 46rem) 100vw, (max-width: 60rem) 45vw, 18rem` | `width=640 height=360`, `loading="lazy" decoding="async"` |
| offer card, scroller | `components/OffersScroller.astro`, `lib/offer-card.ts` | `width=360,height=450,fit=cover,gravity=auto` and `560x700` as `360w 560w` | `(max-width: 46rem) 65vw, 15rem` | `width=360 height=450`, first card `eager` and `fetchpriority="high"`, the rest lazy |
| offer card, index | `pages/odavad-lennupiletid.astro` lines 46 to 78 | the same 360 and 560 family, plus a 720 rung added 2026-08-03 | `(max-width: 46rem) 50vw, (max-width: 56rem) 31vw, (max-width: 72rem) 23vw, 14rem` | `width=400 height=500`, first two eager |
| body figure | `lib/media.ts` `imageFigure()` | `width=800`, `1200`, `1600` as `800w 1200w 1600w` | `(max-width: 46rem) 100vw, 42rem` | the master's `w` and `h`, lazy, async |
| avatar | `components/Avatar.astro` | `width=90,height=90,fit=cover` and `180` as `1x, 2x` | none, a fixed 75 CSS px slot | `width` and `height` the slot, lazy unless `eager` |
| header band | `components/Header.astro` lines 80 to 82, `plans/specs.md` lines 218 to 231 | a `<picture>`: `width=828` under 768 px (byte-identical to the card's 560 rendition on purpose, so a tap arrives cached), `1920` at quality 70 above | media query on the `<source>` | `fetchpriority="high" decoding="async"`, an inline `onload` crossfade over a blurred tiny |

**How the ladder was chosen, and how 2x is served.** The rungs sit about
twice apart so that a 2x screen picks the next rung: *"the 320/800/1600
rungs sit ~2x apart precisely so DPR-2 picks the next rung"*; the 1200 rung
was added after the lab because *"real phones at DPR 2.6 to 3 need
~1100 to 1200 px and would otherwise pull 1600 (2x the bytes)"*, and the
hero's 1280 exists for the same arithmetic, *"a 100vw hero on a DPR 2.6-3
phone needs ~1081-1236 physical px"* (READ `plans/images.md`, the avatar
ground truth and Workstream S sections). Fixed-size slots (avatars) use
x-descriptors, `1x, 2x`; everything that changes width with the viewport
uses w-descriptors and `sizes`. Client Hints were REJECTED in writing:
Chromium only, they force `Vary` fragmentation against the communal cache,
and *"produce arbitrary widths that unbound the unique-transformation count
srcset's fixed ladder deliberately bounds"*. `dpr=` is never used, and the
transform URL accepts it only up to 2 (READ today, Cloudflare's transform
via URL page).

**Format and quality.** `format=auto` everywhere on pages, negotiated by the
`Accept` header: MEASURED by trip on the live edge, no Accept gives jpeg,
webp Accept gives webp, avif Accept gives avif; at 800 px AVIF was 84 KB
against 110 KB WebP, at 1600 px 389 KB against 457 KB. Quality 82, one
constant; band renditions under a scrim drop to 70 (273 to 217 KB at
1920 px). One caveat trip hit: `format=auto` declined AVIF on a 4,600 px
source once, *"CF's documented encode-time budget"*, and served AVIF on the
re-check, so it was variance. Cards are the exception, PNG or JPEG only,
because scrapers reject WebP and AVIF (the social plan has it).

**Cropping, aspect and focal point.** Cover crops are transform parameters,
`width=360,height=450,fit=cover,gravity=auto`, where `gravity=auto` is
Cloudflare's saliency crop; the same gravity on the tiny and on the card
gives the same framing (READ `offer-card.ts`, `worklog/2026-08.md` line
430). Art direction with `<picture>` for the hero was tried and DROPPED:
*"center-crop on mobile is fine; scored identically, art-directed crop cost
+55 KiB for composition nobody needed"*. `aspect-ratio` in CSS holds the
box and `object-fit: cover` fills it.

**The placeholder.** Since 2026-08-10 the offer band and cards paint a
blurred tiny under the picture: `width=128,height=160,fit=cover,blur=50,
quality=40`, 448 bytes, fetched at render time and inlined as a data URI so
it paints with the HTML and there is no grey phase (READ `lib/lqip.ts`,
`worklog/2026-08.md` lines 446 to 470). The worklog calls it *"the key
color idea, but derived from the image itself, no color-extraction
pipeline, no DB column"*. eccm has that column; see section 4.

**Caching.** Renditions follow the original's caching rules with a minimum
of one hour (READ today, the transform via URL page); masters are immutable
under hashed keys, so a re-upload is a new key and nothing is purged. Two
gotchas from the lab: an R2 custom domain caches a 404 for four hours, so a
URL requested before its object exists is poisoned and *"migration order is
UPLOAD FIRST, announce URLs after"*, with a cache rule making 404 no-store;
and `wrangler r2 object put` writes to local storage unless `--remote`.

**The free tier and how trip counts it.** 5,000 unique transformations a
month free, then $0.50 per 1,000; a unique is one original with one set of
options, and *"repeat requests for the same transformation within the same
month are counted only once"* (READ today, Cloudflare's Images pricing
page). So a rendition costs only in a month somebody requested it, which is
why the earlier fear of 46,000 avatars re-billing was retired: the distinct
heads on viewed pages are a few thousand a month. The ladder is fixed so the
count is bounded by ladder size times pictures; the lab's gate was that the
dashboard's uniques counter reads ladder times images. Cold renditions are
prewarmed for the ten newest offers by a cron (40 fetches, under the free
plan's 50 subrequests) because the first request of a rendition pays
*"R2-fetch + resize + AVIF-encode (~1.3 s measured)"*.

**What it measured.** Warm rendition TTFB about 53 to 120 ms; cold with a
5 MB resize 490 ms to 1.4 s. Lighthouse mobile after the rent model: the
news index 99 with LCP 2.3 s and 877 KiB, an article with 13 inline images
99 with LCP 1.9 s and CLS 0; the offer page 99 to 100 with LCP 807 to
836 ms after the placeholder work; the forum index 100 at 43 KiB (READ
`plans/images.md` and `worklog/2026-08.md` line 436). Naive originals as a
control: 15 MB page, LCP 71 s in the dev lab, 13.5 MB and 25.6 s live.

**What broke.** The adapter's default image service routed every image
through the Worker (found by a source dive); Astro's `<Image>` pins
`format=webp` and needs a typed cast to pass `auto`; its layout mode treats
`width` as the display width and appends a retina rung; the `image.domains`
allowlist fails silent and serves originals untouched, so a test has to
assert `/cdn-cgi/image/` in rendered HTML; a preload that does not mirror
the `<img>` srcset double-fetches; the R2 404 cache; the `--remote` flag;
`format=auto` declining AVIF once on a huge source. None of these is a
transformation defect; all are edges of the framework and the cache.

## 2. What trip learned and dropped

- Baking variants was dropped for renting them, because quality and format
  froze into objects. The one bake class left is composed cards.
- Art-directed `<picture>` heroes were dropped for one wide crop with
  `object-fit: cover`.
- Client Hints were rejected for srcset with a fixed ladder.
- The band's CSS background was dropped for a real `<img>`: the lab measured
  the `<img>` hero at 100 and LCP 1.4 s against the background replica at
  84 and 4.6 s on the same page.
- A tap-to-band image handoff through sessionStorage was deleted for a
  cache-identity solution: the band's mobile source is the card's rendition
  URL byte for byte, so it arrives cached. *"When a fix needs a cross-page
  protocol, look for a CACHE-IDENTITY solution first."*
- The grey flash before the blur was fixed by inlining the tiny at render
  time, not by another fade.
- Cloudflare Images (the stored-images product) was rejected for the zone
  transformations: it fights hash naming and, READ today, is priced per
  100,000 images stored and delivered rather than per transformation.

## 3. eccm's placements, and what eccm.ee serves

MEASURED today with `grep` over `public/eccm.css`, `index.html`,
`event.html` and `derive.html`, and over the pages saved in the scratchpad:

| placement | rule | CSS box | device px at 2x | at 3x |
| --- | --- | --- | --- | --- |
| list picture, desk | `.ev { grid-template-columns: var(--eccm-pic-w) minmax(0, 1fr) }`, `--eccm-pic-w: 300px`, `.ev-pic { aspect-ratio: 3 / 2 }`, `object-fit: cover` | 300 by 200 | 600 by 400 | 900 by 600 |
| list picture, compact, `main` under 47rem | `.ev { grid-template-columns: 5.5rem minmax(0, 1fr) }`, `.ev-pic { aspect-ratio: 1 }` | 88 by 88 | 176 | 264 |
| poster, one column, `main` under 60rem | `.event-top` one column; `.event-pic img { inline-size: 100%; aspect-ratio: 900 / 599 }` | the container: 343 on a 375 phone, up to 60rem (960) | 686 on the phone | 1029 on the phone |
| poster, two columns, `main` at 60rem and over | `grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: var(--eccm-s-12)` | (container minus 3rem) over 2: 456 at 60rem, 552 at the frame's 72rem cap | 912 to 1104 | 1368 to 1656 |
| the mark | `--eccm-mark-w: 20rem`, 11rem under 40rem; `logo.svg` | 320 or 176 wide | vector | vector |
| the derive reading | `readColour` on a 64 px canvas, `readType` at `min(600, naturalWidth)` | 64 and up to 600 | | |

The frame is `min(100% - 2 * var(--eccm-gutter), 72rem)` with a 1rem gutter
under a 48rem viewport and 2rem above, and `main` is the container, so the
compact row begins when the viewport is under 51rem and the two-column head
when it reaches 64rem. Those are the media conditions `sizes` can express,
since `sizes` cannot read a container.

**What the pages carry today.** `index.html` has 11 `<img>`: the mark and
ten pictures, each a bare `src` to an `ic_medium_w300h300q100_*` file with
`width` and `height` and, from the fifth row, `loading="lazy"`; no `srcset`,
no `sizes`, no `decoding`. `event.html` has the poster as
`ic_large_w900h600q100_gestures-situations-small.jpg` at `width="900"
height="599"` with an alt, no `srcset`, no priority, no preload.

**What eccm.ee serves.** Joomla's iCagenda writes three thumbnail classes,
`ic_small` at 100 px, `ic_medium` at 300 px and `ic_large` at 900 px on the
long side (MEASURED from the saved calendar page: 6 medium and 8 small
references; from the two event pages: one large each), all JPEG at quality
100 from gd-jpeg (MEASURED with `file`: *"quality = 100, baseline"*). The
originals are linked as `og:image` at their full size: 2000 by 1333 for
Gestures, 3682 by 2445 for Feldman (MEASURED from `og:image:width` and
`height` on the saved pages). The 27 medium thumbnails in `public/` weigh
1,390,135 bytes, mean 51,486, from 5,625 to 143,986 (MEASURED with `ls -l`).
So the list draws a 300 px file at 300 CSS px, which is soft on every 2x
screen, and pays about 50 KB for it where trip pays 84 KB for 800 px of AVIF.
Both faults have one cause: the site has no masters, only Joomla's
thumbnails, and the masters are one fetch away on eccm.ee.

## 4. What eccm takes

**The model.** One master per picture in R2, keyed by content hash with its
extension, width and height in the `media` row, and every rendition a
`/cdn-cgi/image/` URL from one function with the quality and the format in
one place, exactly trip's `cdn()` with eccm's host. The masters for the
seeded events are the `og:image` originals fetched once from eccm.ee at
import (two fetches for the two sampled events; a hundred for the whole
site, once), never the thumbnails.

**The host and the source path.** Renditions are same-zone:
`https://eccm.positron.studio/cdn-cgi/image/{options}/media/{hash}.{ext}`,
with `/media/{hash}.{ext}` served by the Worker from the R2 binding (in
step 1, before R2, from `public/`). trip's lab ran exactly this shape,
transformations on the zone over same-zone asset URLs, before its media
domain existed, and the serving semantics were identical. This needs Image
Transformations switched on for the `positron.studio` zone in the dashboard,
and at cutover for `eccm.ee`'s zone, which is section 7's first line.

**Three ladders, written out.**

```html
<!-- the list, 3:2, cover; rungs at 1x, 2x and 3x of the 300 px slot -->
<img src=".../width=300,height=200,fit=cover,quality=82,format=auto/media/{hash}.jpg"
     srcset=".../width=300,height=200,fit=cover,.../media/{hash}.jpg 300w,
             .../width=600,height=400,fit=cover,.../media/{hash}.jpg 600w,
             .../width=900,height=600,fit=cover,.../media/{hash}.jpg 900w"
     sizes="(max-width: 51rem) 5.5rem, 300px"
     width="300" height="200" alt="{alt in this language}"
     loading="lazy" decoding="async">
```

Under 51rem the slot is a square of 88 px, and the browser picks the 300w
rung from the 3:2 family and `object-fit: cover` crops it: a downscale,
which trip's avatar note calls *"free and correct, upscale is the only
sin"*. A dedicated square family, `width=176,height=176,fit=cover` and
`264`, would save about 15 KB a row on a phone at two more uniques a
picture; whether that is worth it is measured on the phone shot in section
6, not decided here. The first two rows are `loading="eager"`, the rest
lazy, as `index.html` already does from the fifth.

```html
<!-- the poster, the master's own ratio, the page's LCP -->
<link rel="preload" as="image" imagesrcset="{the same four}" imagesizes="{the same sizes}">
<img src=".../width=1280,quality=82,format=auto/media/{hash}.jpg"
     srcset="... 640w, ... 960w, ... 1280w, ... 1920w"
     sizes="(max-width: 48rem) calc(100vw - 2rem), (max-width: 64rem) calc(100vw - 4rem), (max-width: 76rem) calc(50vw - 3.5rem), 34.5rem"
     width="{media.width}" height="{media.height}" alt="{alt}"
     loading="eager" decoding="async" fetchpriority="high">
```

The rungs are trip's hero arithmetic applied to eccm's columns: a 375 px
phone at 3x wants 1029 and takes 1280; the two-column poster at 552 CSS px
takes 640 at 1x and 1280 at 2x; 1920 covers a 3x desk. The preload mirrors
the `<img>` exactly, which is trip's Base contract, because a mismatch
fetches twice.

```html
<!-- the reading, for the derive scheme: two renditions the editor's browser reads on a canvas -->
.../width=64,quality=90,format=jpeg/media/{hash}.jpg
.../width=600,quality=90,format=jpeg/media/{hash}.jpg
```

The social plan's section 4 puts the scheme reading in the editor's browser
before the save, with a headless Chrome script for imports and detector
bumps, and this plan agrees: the two renditions above are what that browser
loads, at the sizes `derive.html` reads today, so the reading is identical
to the derive page's. Two things follow. The renditions must be served with
`Access-Control-Allow-Origin` and loaded with `crossorigin="anonymous"`, or
`getImageData` throws on a tainted canvas (MEMORY, the canvas security
model). And the format is pinned to JPEG, not `auto`, so the pixels the
detector reads do not change with the browser's `Accept` header.

**The attributes, always.** `width` and `height` on every `<img>`, the
slot's for a cover family and the master's for the poster, so CLS is 0
without a wrapper; `alt` from `media.alt_et` or `alt_en`, empty for a
decorative thumbnail beside a title that already names the event; `loading`
and `decoding` as above; `fetchpriority="high"` on the poster and nothing
else. The mark stays an SVG with no ladder.

**Format and quality.** `format=auto` and quality 82 on every page
rendition, trip's constants, in the one function; JPEG at 90 for the two
reading renditions; PNG or JPEG for cards, the social plan's rule. No
`dpr=` and no Client Hints, for trip's reasons.

**The placeholder, if any.** trip inlines a 448 byte blurred tiny because it
has no colour column. eccm has `media.scheme` with `--ev-ground`, so the
box under a picture can carry `background: var(--ev-ground)` at zero bytes
and no fetch, which is the "key colour" trip mentions and did not build.
Whether the page does that is visual and is not decided here.

**Caching.** Masters `Cache-Control: public, max-age=31536000, immutable`
under hashed keys; renditions inherit it with Cloudflare's one hour floor;
a 404 on `/media/*` answered `no-store` so an early link never poisons a
URL; nothing is purged, a changed picture is a new key. A prewarm cron is
not needed at eccm's size: a new event's renditions are first fetched by
the editor looking at the page, which is the warm-up.

**Uniques per picture and per hundred events.**

| family | uniques |
| --- | --- |
| list 3:2 | 3 |
| poster | 4 |
| reading | 2 |
| card crops (the social plan's OG and Instagram) | 2 |
| square compact, if adopted | 2 |
| total | 11, or 13 with the squares |

A hundred pictured events cost at most 1,300 uniques in the month they are
all viewed, against 5,000 free; past events cost only in a month somebody
opens them. Beyond the tier, $0.50 per 1,000.

## 5. Upload, later

The CMS plan's `media` row needs from this plan exactly three things the
upload handler writes: the content hash as the key, and the width and height
read from the bytes (trip uses the Images binding as *"a ruler (info →
dims), never an encoder"*; `format=json` on the transform URL returns the
same). Nothing is rendered at upload; the scheme reading is the editor's
browser, per the social plan.

## 6. Verification, per session that touches this

One shot at 375 and one at 1280 with the device pixel ratio at 2. The phone
preset in `tools/shot.mjs` already emulates 3 (`PHONE = { height: 812, dpr:
3 }`, READ line 75); the desk shot runs at 1 and needs a flag for 2, a one
line change to `deviceScaleFactor` at line 171. Then one `curl -sI -H
'Accept: image/avif'` of one rendition, reading `content-type`,
`content-length` and `cf-cache-status`, twice, so the second reads HIT. And
a grep of the rendered page for `srcset` and `sizes` on every `<img>` that
is not the mark, which is the test trip's lab owed and this page owes.

## 7. What could not be settled from this disk

| question | why it is open | what settles it |
| --- | --- | --- |
| whether Image Transformations are enabled on the `positron.studio` zone | a dashboard toggle per zone; trip's is `trip.dance` | one `curl` of a `/cdn-cgi/image/width=64/...` URL on `eccm.positron.studio` after the toggle: 200 and `content-type: image/*`, or the original untouched |
| whether a Worker-served `/media/*` path is a valid same-zone source | trip's lab used deploy assets as sources on the same zone, which is the same thing served by the same product, but eccm's has not been tried | the same curl |
| the canvas taint on the reading renditions | not tried across origins here | one `getImageData` in the editor's browser after the CORS header is set on `/media/*` |
| whether ECCM holds masters larger than the `og:image` files | the two pages read link 2000 and 3682 px originals; the archive may hold more or less | asking ECCM, and the import's log of every `og:image` width |
| the phone bytes of the square family against the 3:2 downscale | a design and bytes trade, not measured | the 375 shot's network log with and without the family |
| the desk shot at 2x | `tools/shot.mjs` runs the desk at 1 | the flag in section 6 |

## 8. Cost

From trip's numbers, which are the only measured ones: a warm rendition
answers in about 53 to 120 ms, a cold one in 490 ms to 1.4 s; AVIF at 800 px
is about 84 KB and at 1600 px about 389 KB for photographs; a 448 byte tiny
if a blur is ever wanted. For eccm: at most 1,300 uniques for a hundred
events in one month, inside the 5,000 free; a few hundred masters at 1 to
4 MB is about 1 GB of R2, which is about $0.015 a month (MEMORY, R2's
storage price); one Class A write per master and one Class B read per edge
miss, both inside the free operations. Nothing here needs the Workers Paid
plan; the social plan's section 8 is where that question lives.

## Sources

READ today: `trip/plans/images.md` in full; `trip/plans/specs.md` lines 212
to 235; `trip/astro-prod/astro.config.mjs`; `trip/astro-prod/wrangler.jsonc`
lines 27 to 46; `trip/astro-prod/src/lib/media.ts`, `lqip.ts`,
`offer-card.ts` (the exports); `src/pages/uudised/[slug].astro` lines 77 to
104, `src/pages/index.astro` lines 51 to 74, `src/pages/odavad-lennupiletid.astro`
lines 46 to 78 and 129 to 137, `src/components/Avatar.astro`,
`OffersScroller.astro` lines 12 to 46 and 88 to 92, `Header.astro` lines 22
to 60 and 80 to 82, `Video.astro`; `test/news.test.ts` lines 57 to 64,
`test/thread.test.ts` line 80; `trip/worklog/2026-07.md` lines 1708 to 1829
and `2026-08.md` lines 150 to 172, 406 to 470 and 505 to 535;
`eccm/public/eccm.css`, `index.html`, `event.html`, `derive.html`,
`tools/shot.mjs` line 75 and 171; the scratchpad's `ev134-et.html`,
`ev109-et.html` and `eccm-page2.html`. Fetched today:
https://developers.cloudflare.com/images/pricing/ and
https://developers.cloudflare.com/images/transform-images/transform-via-url/.
MEMORY: the canvas taint rule, R2's storage price.
