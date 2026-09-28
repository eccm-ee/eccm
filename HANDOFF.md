# Handoff, 2026-09-27, the first day of the eccm repository

The prototype of a new eccm.ee moved out of positron this morning and grew all
day. Everything below is live at **https://eccm.positron.studio/** and pushed
to **https://github.com/kristjanjansen/eccm**, private, branch `main`. Numbers
here were counted with a command when this was written; count again before
building on one.

## What is live, page by page

| URL | what |
| --- | --- |
| https://eccm.positron.studio/ | the list, static, ten rows with kicker, title and summary, dates with the month named |
| https://eccm.positron.studio/event | the event page, static, event 134 |
| https://eccm.positron.studio/et/sundmused/gestuurid-situatsioonid-ilma-partituurita-kuulamine | the same event **from D1**, Estonian |
| https://eccm.positron.studio/en/events/gestures-situations-listening-without-a-score | its English twin from D1, hreflang pairs both ways |
| https://eccm.positron.studio/en/events/gestuurid-situatsioonid-ilma-partituurita-kuulamine | the fallback: Estonian text under English chrome with one line saying so |
| https://eccm.positron.studio/et/eccm | the five text pages from D1, ECCM, Tallinn 1965, NAN, Ulysses, Konkursid, at `/et/{slug}` and `/en/{slug}`, a fallback where a language has no text |
| https://eccm.positron.studio/edit | the HTML-only edit form, saves nothing |
| https://eccm.positron.studio/edit/events | the editor from D1 behind the gate: the list, `/edit/events/{id}`, `/edit/events/new`; `/login?token=...` opens it on staging |
| https://eccm.positron.studio/edit/pages | the same for the five text pages: the list, `/edit/pages/{id}`, `/edit/pages/new`; every public page carries a Muuda/Edit button |
| https://eccm.positron.studio/derive | design from a picture, four sets of six pictures (`?set=1` to `4`) |
| https://eccm.positron.studio/ds | the design system, with the wordmark studies at its foot: type specimens, serif specimens, bios, colour, space, buttons with a disabled state, the logos, the square marks, the icon sizes, the stave element |
| https://eccm.positron.studio/type | seventeen faces for body and titles, then the six sans and the ten serifs in the derived page's three uses |
| https://eccm.positron.studio/tagline | the tagline in DIN Condensed, 48 settings by casing, tracking, wrap and alignment |
| https://eccm.positron.studio/tagline-47 | setting 47 taken apart: four DIN files and the same four in Instrument Sans |
| https://eccm.positron.studio/logo | the mark measured off eccm.ee's JPEG |

Also under the root: `logo.svg` (two languages), `logo-et.svg`, `logo-en.svg`,
`wordmark-en-left.svg`, `wordmark-en-centred.svg`, `wordmark-et-left.svg`,
`wordmark-et-centred.svg`, `manifest.webmanifest`, and `icons/` with 51 files:
the square marks (positive, negative, outlined, plain for 48 and 64, bold for
16 and 32), the stacked EC over CM marks, nine sizes of each in both
polarities, `favicon.ico` and `favicon-neg.ico`, and `stave.svg`.

## What the Worker does today

`src/index.mjs` answers `/et/sundmused/{slug}` and `/en/events/{slug}` from
D1, and since 2026-09-28 the editor: `/edit/events` (the list), `/edit/events/{id}`
(one form for both languages, the facts, the credits, the status and the
publish time), `/edit/events/new`, `/login` and `/logout`, all in
`src/editor.mjs` with `src/render/editor.mjs` and the gate in `src/gate.mjs`;
and the same afternoon the five text pages of `/et/{slug}` and `/en/{slug}`
became editable at `/edit/pages`, `/edit/pages/{id}` and `/edit/pages/new`,
with `sundmused` and `events` refused as page slugs.
The gate takes a Cloudflare Access JWT when `ACCESS_TEAM` (and `ACCESS_AUD`)
is set, and on staging a cookie set by `/login?token=` against the
`EDITOR_TOKEN` secret, which is a stand-in until the Access application on
`eccm.positron.studio/edit*` exists (setup plan section 2); every editor
reply is `no-store` and `noindex`. A save is one D1 batch guarded by `rev`, a
stale form answers 409, preview renders the real template without writing.
Everything else 404s; assets under `public/` are served first, so `/edit`
with no path is still the static form. The remote database is `eccm-staging`
(id in `wrangler.jsonc`), migrated with `migrations/0001_step1.sql`,
`0002_editing.sql` and `0003_page_editing.sql` and seeded with
`data/seed-step1.sql`, `seed-step2.sql` and `seed-step3.sql` (the five pages).
Sessions 1, 2 and 6 of `plans/plan-eccm-cms-step-1.md` are done, 3 to 5 are
not, and the editing the plan left out of step 1 is in. The dev server for
local work is `npx wrangler dev --env staging`; one was running on port 8797
when this was written, the editor agent's on 8798 against
`.wrangler/state-editor`, and the page editing agent's on 8800 against
`.wrangler/state-pages-edit`.

## The plans, twelve

`plan-eccm-presence.md` (2026-09-28: where ECCM is on the web, what Instagram does better, a priced plan of twelve items and a posting rhythm), `plan-eccm-cms-step-1.md` (seven tables, six sessions, section 10 reconciles
the scheme JSON with the social plan, section 11 takes the URL scheme),
`plan-eccm-social-images.md` (trip's resvg pipeline and how the scheme feeds
it), `plan-eccm-images.md` (how trip rents renditions, three ladders for
eccm), `plan-eccm-event-markup.md` (MusicEvent as JSON-LD, the head for two
languages, event 134 worked), `plan-eccm-urls-sitemap-rss.md` (228 old URLs
inventoried, `/et/sundmused/` and `/en/events/`, three redirect layers,
sitemap, RSS and an iCalendar feed), `plan-eccm-bios.md` (13 pages surveyed,
an event_bio row per event), `plan-eccm-icons.md`, and the four that came
with the move. Every one was relayed in full in the session that made it.

## Decisions taken today, in the owner's words where there were words

- Credits are role lines: a role key from a translated dictionary, names typed
  once, organisation names per language, a free role for one-offs. Not a
  per-language JSON. (*"We are just names, or is it about the labels which
  are different?"*)
- The router is plain JavaScript, no Astro, with trip's build measured (179 KB
  of runtime gzipped, 824 KB of server JS, 111 chunks).
- The scheme JSON on the media row is the flat shape, with an integer version
  column beside it.
- Dates carry the month's name, long where there is room, short in a narrow
  column; places link to Google Maps with a lighter line; bold in the body is
  600. All three in the skill.
- The venue is Pühavaimu 9, Tallinn. Herne 11A is the association's postal
  address on eccm.ee's contact page and was wrongly used as the venue for a
  day.
- The letters E to M are the mark; the stave is ornament at its own 12 units,
  and a layer that comes and goes: every mark file holds a `letters` and a
  `lines` group. In the small-size marks the M is 12 units wider; under 128 px
  the hairlines are dropped; at 16 and 32 the letters are a bold set with
  stems of 20, which the SVG favicon is.
- The stave is an element of its own for graphics: top right corner, flush to
  the right edge, padded from the top only.
- Both lines of a tagline pair are centred on one axis or both start on the E.
  Never mixed. The Estonian breaks inside its long word, `nüüdis-` over
  `muusika keskus`, the hyphen a hairline of the mark's weight placed from
  the drawn line.
- The negative icons carry their own black; the design page's rows sit on the
  page.
- On /serif, the four the owner named first were Newsreader, Literata,
  Piazzolla and Petrona; all thirteen are shown again on request.

## Open, for the owner

- The tagline's face and shape: DIN Condensed setting 47 (uppercase, 0.08em,
  two lines) has four files; Instrument Sans at width 75 has two settings on
  /wordmark. Either needs the letters as outlines to become a file that works
  off this machine, since DIN Condensed is a macOS face and Instrument Sans
  is a webfont.
- The serif to replace Source Serif 4: the agent's ranking puts Newsreader,
  Fraunces and Piazzolla forward; the owner's first short list was
  Newsreader, Literata, Piazzolla, Petrona.
- Whether the header takes the new lockup and which; today it carries
  `logo-et.svg` and `logo-en.svg` by language, the interim lowercase DIN.
- A true 16 px mark beyond the bold set; a maskable Android icon.

## The machine

This laptop kills binaries it does not know. `wrangler` is pinned to exactly
4.107.0 and `workerd` to 1.20260701.1 with an override, because the workerd
of wrangler 4.141 exits 137 and wrangler reports it as `write EPIPE`;
`compatibility_date` is 2026-07-08, the newest that runtime supports. Every
local D1 and dev command depends on this. Safari and Chrome measure a
variable font's width axis differently unless it is set with
`font-variation-settings`; the tagline pages carry both.

## How to go on

Session 3 of the CMS plan: `tools/scheme.mjs` reading the two seeded
pictures through derive.html's own functions in headless Chrome and writing
the flat JSON to `media.scheme`, then the style attribute on the article.
Then sessions 4 and 5. The bios migration when the plan is approved. The
outlines for whichever tagline wins. `BACKLOG.md` here has every ask of the
day verbatim with what was measured; positron's has the ones before the move.
