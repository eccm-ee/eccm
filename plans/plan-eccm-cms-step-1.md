# eccm CMS, step 1: the data in D1, shown read-only

Written 2026-09-27 on the owner's dictated ask: *"the first step in CMS side.
So take a couple of pages of current ECCM content, multilingual. Take your
plan from the Positron side about CMS schema ... whatever your old plan says,
let's go it very slowly, very kind of step by step. And at first just have the
data in D1 in a schema and you show it, we don't even do the editing yet."*
Nothing here is built. `plan-eccm-cms.md` is the whole CMS; this is its first
step cut down to what two events and one page need, and it is written to be
done in six sittings of under an hour each.

| mark | means |
| --- | --- |
| **MEASURED** | taken today, 2026-09-27, off a page fetched from eccm.ee or a file in this repository, with the command or the file named |
| **READ** | quoted today from developers.cloudflare.com through the Cloudflare docs search, URL given |
| **MEMORY** | from `plan-eccm-cms.md` or `plan-eccm-setup.md`, which read it on 2026-09-26; not re-read today |

**Fetched today, seven pages from eccm.ee, one at a time, nothing retried:**
`/index.php/et/134-gestuurid-situatsioonid-ilma-partituurita-kuulamine-marianna-liik-artjom-astrov-maryn-liis-rueuetelmaa/2026-09-30-19-00`,
`/index.php/en/` (to find the English event URLs, which the Estonian event
page does not link),
`/index.php/en/135-gestures-situations-listening-without-a-score-marianna-liik-artjom-astrov-maryn-liis-rueuetelmaa/2026-09-30-19-00`,
`/index.php/et/109-morton-feldman-100-for-philip-guston/2026-10-10-18-00`,
`/index.php/en/110-morton-feldman-100-for-philip-guston-eng/2026-10-10-18-00`,
`/index.php/et/eccm`, `/index.php/en/eccm-new-eng`. The HTML sits in the
session's scratchpad and does not enter this repository.

## The verdict

Five tables, not eleven: `media`, `event`, `event_text`, `page`, `page_text`.
One row per thing, one text row per language, which the sample confirms is
the right cut: on eccm.ee the Estonian and English versions of one concert
are two iCagenda rows with different ids (134 and 135, 109 and 110,
MEASURED), and the shared facts have already drifted between them (the
Estonian Feldman row has no ticket link and the English one does; the
duration is typed only into the Estonian Gestures body). The derived scheme
from `derive.html` lives on the picture, as one JSON column `media.scheme`
with a version number, computed once per picture at seed time by the same
code that draws the derive page, in a headless browser, and read by the
event page and by the social image pipeline through one contract stated in
section 2. Six sessions, the first of which is one migration and one row on
one route. No editing, no login, no upload, no redirects, no calendar grid,
no mailing.

## 1. The content sample, MEASURED

Three things in both languages: the Gestures event that `public/event.html`
already renders, the Morton Feldman event (its picture is already in
`public/`, from the derive page's first set), and the ECCM about page.

| field | Gestures ET (134) | Gestures EN (135) | Feldman ET (109) | Feldman EN (110) |
| --- | --- | --- | --- | --- |
| title | capitals, 108 characters | capitals, 96 characters | `Morton Feldman 100 - For Philip Guston` | same string as ET |
| date, time | 30.09.2026 19:00 | same | 10.10.2026 18:00 | same |
| venue (list card) | ECCM | ECCM | Arvo Pärdi Keskus, Laulasmaa | Arvo Pärdi Keskus, Kellasaju tee 3, Laulasmaa |
| category (list card) | Ulysses | `Ulysses_eng` | not on the saved list | `U: (eng)` |
| picture | `og:image` `/images/Gestures_Situations small.jpg` 2000 by 1333; thumb `ic_large_w900h600q100_gestures-situations-small.jpg` | the same file, same size | `og:image` `/files/Morton_Feldman.jpg` 3682 by 2445; thumb `ic_large_w900h600q100_morton-feldman.jpg` | the same file |
| body | 673 words, 37 lines, one heading typed in capitals | 908 words, 41 lines, two headings, one section the Estonian has not got | 47 words, 5 lines | 61 words, 5 lines |
| credits | 8 `Label: value` lines at the foot of the body (Kunstnikud, Dramaturg, Graafiline disain, Loovkommunikatsioon, Kaasprodutsent, Projektijuht, Toetajad, Kestus) | 7 lines, translated labels, no duration | `Koostöös: Arvo Pärdi Keskus` | `In collaboration with: Arvo Pärdi Keskus` |
| duration | `Kestus: 60 min`, in the body | absent | absent | absent |
| ticket link | fienta.com, twice (labels `Piletid` and `Tickets`) | the same two | **none** | fienta.com/et/morton-feldman |
| phone, email, website | 55655596, cloaked email, eccm.ee | same | cloaked email, arvopart.ee | same |
| meta description | the body's first 160 characters | same | same rule | same rule |
| short description, registration, price, map, files | empty | empty | empty | empty |

The about page: Estonian `eccm` is 188 words, one link, no picture, titled
*ECCM - Eesti Nüüdismuusika Keskus*; English `eccm-new-eng` is 316 words, no
links, no picture, titled *ECCM - Estonian Centre of Contemporary Music*, and
**it is a different text, not a translation**: it opens on the move to the
House of the Blackheads and quotes a spokesperson, while the Estonian lists
the seven member organisations. MEASURED with a tag-stripping word count over
the article block of each page.

What this settles for the schema, each line MEASURED above:

- One picture serves both language rows of an event, at its original size,
  through `og:image`; the 900 px file on the page is a generated thumbnail.
  So `media` is one row per picture and both text rows point at one event row
  that points at it.
- The credits are prose on eccm.ee and a definition list in `event.html`, per
  language, so they are a per-language column and not shared facts.
- The duration is a shared fact typed in one language only, so it is a column
  on `event`, nullable.
- The English body is a third longer than the Estonian and carries a section
  the Estonian lacks, so the fallback rule (Estonian when English is missing)
  is a rule about missing rows and never about merging bodies.
- The Joomla id differs per language, so the legacy id for redirects belongs
  on `event_text`, not on `event`. `plan-eccm-cms.md` §7 has it on `event`;
  this plan moves it.
- The meta description is the first paragraph on every page read, so no
  column carries it.

## 2. The step 1 schema, five tables, with the scheme contract

Taken from `plan-eccm-cms.md` §7 (MEMORY for its reasoning, the SQL below is
this plan's) and cut to what section 1 needs. Times are ISO 8601 text in
Europe/Tallinn local time, as the CMS plan decided. Two things are new against
§7: `legacy_id` moves to the text row, and `media` gains `scheme`.

**The multilingual model, decided: one row per thing, one text row per
language, Estonian as the fallback.** The alternatives the CMS plan priced
(one row per language with associations, or `title_et` and `title_en`
columns) are rejected on today's evidence: the first is what produces two
Feldman rows of which one has no ticket link, and the second cannot hold an
English text that is longer than the Estonian one as a separate state of
completion. The fallback rule: a route in a language with no text row shows
the Estonian text under the visitor's language chrome and one line saying so.

```sql
-- migrations/0001_step1.sql

CREATE TABLE media (
  id          INTEGER PRIMARY KEY,
  key         TEXT NOT NULL UNIQUE,        -- step 1: the file name under public/; later the R2 key (sha256 plus extension)
  width       INTEGER NOT NULL,
  height      INTEGER NOT NULL,
  alt_et      TEXT NOT NULL DEFAULT '',
  alt_en      TEXT NOT NULL DEFAULT '',
  scheme      TEXT,                        -- JSON, the contract below; NULL until computed
  scheme_v    INTEGER,                     -- the detector version that wrote scheme; NULL with it
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);

CREATE TABLE event (
  id            INTEGER PRIMARY KEY,
  starts_at     TEXT NOT NULL,             -- '2026-09-30T19:00'
  ends_at       TEXT,                      -- NULL for one evening
  duration_min  INTEGER,                   -- 60 for Gestures; NULL when nobody typed it
  venue         TEXT NOT NULL DEFAULT '',  -- 'ECCM saal'
  address       TEXT NOT NULL DEFAULT '',  -- 'Herne 11A, Tallinn'
  ticket_url    TEXT NOT NULL DEFAULT '',
  website_url   TEXT NOT NULL DEFAULT '',  -- 'https://www.arvopart.ee/...' on Feldman
  category      TEXT NOT NULL DEFAULT 'eccm'
                CHECK (category IN ('eccm','koostoo','improtest','schoenberg','ulysses','u')),
  image_id      INTEGER REFERENCES media(id),
  status        TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published')),
  publish_at    TEXT,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
CREATE INDEX event_starts ON event (starts_at);

CREATE TABLE event_text (
  event_id    INTEGER NOT NULL REFERENCES event(id) ON DELETE CASCADE,
  lang        TEXT NOT NULL CHECK (lang IN ('et','en')),
  slug        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL DEFAULT '',    -- markdown, the subset trip's md.ts renders
  credits     TEXT NOT NULL DEFAULT '[]',  -- JSON [["Kunstnikud","Marianna Liik, ..."], ...], the label in this language
  legacy_id   INTEGER,                     -- the iCagenda id in this language: 134 and 135 are one event
  PRIMARY KEY (event_id, lang),
  UNIQUE (lang, slug),
  UNIQUE (lang, legacy_id)
);

CREATE TABLE page (
  id          INTEGER PRIMARY KEY,
  key         TEXT NOT NULL UNIQUE,        -- 'eccm'
  parent_key  TEXT REFERENCES page(key),
  menu_order  INTEGER NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published')),
  publish_at  TEXT,
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);

CREATE TABLE page_text (
  page_id     INTEGER NOT NULL REFERENCES page(id) ON DELETE CASCADE,
  lang        TEXT NOT NULL CHECK (lang IN ('et','en')),
  slug        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL DEFAULT '',
  legacy_path TEXT,                        -- '/index.php/en/eccm-new-eng'
  PRIMARY KEY (page_id, lang),
  UNIQUE (lang, slug)
);
```

`status` defaults to `published` in step 1 because there is no editor to make
a draft; the CMS plan's `draft` default returns with the forms. `created_by`
is left out for the same reason: there is no Access identity to record, and
a seed script is not an editor.

**The scheme contract, which the social image plan reads.** `media.scheme`
holds exactly what `public/derive.html`'s `scheme(r, t)` and `sample()`
produce for the picture, as JSON:

```json
{
  "v": 1,
  "mode": "light",
  "vars": {
    "--ev-ground": "#d9c8d9",
    "--ev-ink": "#1a1a1a",
    "--ev-ink2": "#555555",
    "--ev-accent": "#805e55",
    "--ev-btn-fill": "#1a1a1a",
    "--ev-on-btn": "#ffffff",
    "--ev-title-face": "inherit",
    "--ev-title-weight": null,
    "--ev-body-face": "inherit"
  },
  "serif": false,
  "type": { "verdict": "type too small to read for serifs", "found": 13, "n": 6, "share": 0.83 },
  "read": {
    "meanY": 0.18, "meanC": 0.021, "cast": { "h": 347, "C": 0.016 },
    "top": [{ "hex": "#000000", "share": 0.11 }, { "hex": "#110011", "share": 0.08 }, { "hex": "#aa99aa", "share": 0.07 }],
    "groundNote": "the picture's mid tone #aa99aa, 7 per cent of it, taken half way to white with its chroma kept to 0.03; the picture is not about black"
  },
  "computed_at": "2026-09-27T12:00:00Z"
}
```

The rules of the contract:

1. `vars` has exactly the nine keys above and no others. They are the custom
   properties `sample()` sets on `.sample` today (MEASURED: `derive.html`
   lines 387 to 397 set `--ev-ground`, `--ev-ink`, `--ev-ink2`, `--ev-accent`
   when there is one, `--ev-btn-fill`, `--ev-on-btn`, `--ev-title-face`,
   `--ev-title-weight` when serif, `--ev-body-face`). A key whose value the
   page would not set is present with `null`, so a reader never has to ask
   which keys exist. Every non-null value is a CSS value string, ready for a
   `style` attribute or a `setProperty` call, never a number to be formatted.
2. `mode` is `light` or `dark`; `serif` is the boolean that picks the title
   face. A consumer that only needs the two colours reads `vars` and `mode`
   and nothing else; that is the social image pipeline's whole dependency.
3. `type` and `read` are the detector's readings, kept so the derive page's
   readout can be drawn from the row and so a false verdict can be argued
   with later; nothing renders from them.
4. `v` is the detector version and `media.scheme_v` copies it into a column
   so a query can find rows computed by an old rule set. It is bumped by hand
   whenever `scheme()`, `readColour()` or `readType()` changes, in the same
   commit; the comment at the top of `derive.html` names the current number.
   The three rule changes of 2026-09-27 (the wall, the height floor, the bar)
   would each have bumped it, which is the argument for having it.
5. It is recomputed only when the picture changes. In step 1 a picture never
   changes, because `media.key` is a file under `public/` and a new picture
   would be a new row. With uploads, `key` is the content hash and the same
   rule holds: a re-upload of the same bytes is the same row and the same
   scheme.
6. An event page reads the scheme through `event.image_id`; a page with no
   picture has no scheme and the site's own tokens apply, which is the
   `var(--ev-ink, var(--eccm-ink))` fallback `eccm.css` already carries on
   `.btn` (MEASURED, `eccm.css` lines 255 to 258).

## 3. The seed

The sampled pages become rows through one script,
`scripts/seed-step1.mjs`, run on the desk against the fetched HTML, writing
`data/seed-step1.sql`. The SQL is committed; the HTML is not. The rows are
public text from public pages, which the repository already holds in
`public/event.html`, and no dump, address or subscriber is involved, so the
repository rule about ECCM's data is kept.

What the script does, per event page, in the order the extractor written
today does it (MEASURED against all four pages):

- title from `<h1>`, then sentence-cased by hand for the two Gestures titles
  typed in capitals, exactly as `event.html` did, and the SQL says so in a
  comment; the Feldman title is stored as typed.
- `starts_at` from the `ic-single-next` and `ic-single-starttime` spans, with
  `duration_min` from a trailing `Kestus: N min` line if present, removed
  from the body.
- `venue` and `category` from the list card, since the event page does not
  print them in a block of their own; the category label is mapped to the
  CHECK list (`Ulysses` and `Ulysses_eng` to `ulysses`, `U: (eng)` to `u`).
- `ticket_url` from the info box's Fienta link, `website_url` from its
  website line, and the phone and email are not stored: the phone is ECCM's
  own on every event and the email is cloaked, so both are the site's contact
  and not the event's.
- `body` from `ic-full-description`, HTML to the markdown subset: paragraphs,
  a line in capitals with no full stop becomes `## ` plus the line
  sentence-cased, `<strong>` and `<em>` keep their marks, `<a href>` becomes a
  link, everything else is stripped. The trailing `Label: value` lines become
  the `credits` JSON and leave the body.
- `legacy_id` from the URL's leading number, per language.
- one `media` row per distinct `og:image` URL, with the width and height the
  page declares, `key` set to the thumbnail file already in `public/`
  (`ic_large_w900h600q100_gestures-situations-small.jpg` and
  `ic_medium_w300h300q100_morton-feldman.jpg`, both present, MEASURED with
  `ls public`), `scheme` NULL until session 3 fills it.

Per page: `page.key = 'eccm'`, one text row per language with the article
block as markdown, `legacy_path` set to the Joomla path.

**The URL scheme, decided:** `/{lang}/events/{slug}` and `/{lang}/{slug}`
for pages. In step 1 a slug is the Joomla alias verbatim, per language,
minus the leading id (`gestuurid-situatsioonid-ilma-partituurita-kuulamine-marianna-liik-artjom-astrov-maryn-liis-rueuetelmaa`,
100 characters), so a later redirect from a Joomla path is a lookup and not a
guess; a row created in the editor later gets a slug from its title cut at
60 characters. The page slug is `eccm` in both languages, so `eccm-new-eng`
is dropped and recorded in `legacy_path`. Joomla paths are not redirected in
step 1; the `legacy_id` and `legacy_path` columns are the whole preparation
for the CMS plan's session 3.

## 4. Showing it, read-only

**Where the script sits.** `src/index.mjs` becomes `main` in
`wrangler.jsonc`; `public/` stays the assets directory and is served before
the script runs, so every existing page keeps its URL and nothing in step 1
touches `public/*.html` (READ in `plan-eccm-setup.md` §4: assets are served
before the Worker). The script answers only paths that begin with `/et/` or
`/en/`, which no asset has, and 404s everything else itself.

**Routes, six, each one query or two:**

| route | query | template |
| --- | --- | --- |
| `/et/`, `/en/` | published events with `starts_at >= now`, ordered, joined to the text row in the language with a fallback to `et` | the list, from `public/index.html`'s row markup |
| `/et/events/{slug}`, `/en/events/{slug}` | the text row by `(lang, slug)`, its event, its media, plus the next three events for the foot | the event page, from `public/event.html` |
| `/et/eccm`, `/en/eccm` | the page by `(lang, slug)` with the fallback | the article page, the event page's prose block alone |

**Templates.** `src/render/` holds `list.mjs`, `event.mjs`, `page.mjs` and
`chrome.mjs` (head, nav, foot), each a function from rows to a string, with
the markup lifted from `public/index.html` and `public/event.html` as they
stand, and `src/render/md.mjs` renders the body's markdown subset, ported by
reading trip's `astro-prod/src/lib/md.ts` (MEMORY, 3,059 bytes in the CMS
plan's count). The stylesheet is `public/eccm.css`, unchanged, linked by its
existing path. The language switch on a rendered page links to the same
thing in the other language, which is the one thing eccm.ee cannot do
(MEASURED: the Estonian event page's switcher points at `/index.php/en/`).

**How the scheme reaches the page.** The event template reads
`media.scheme`, and when it is present sets the nine `vars` as a `style`
attribute on `<article class="event" data-scheme="light">`, skipping the
nulls, which is exactly what `sample()` does with `setProperty` on
`.sample` (MEASURED, `derive.html` lines 387 to 397). In step 1 the scheme
applies to what the derive page's sample applies it to and no more: the
event's head and prose on that ground, the buttons through `.btn`'s
existing `--ev-*` fallbacks. How much of the page takes the scheme is a
design decision for the owner and is not made here.

**How the scheme is computed.** `derive.html` runs in a browser on a canvas,
and a Worker has no canvas. Step 1 does not port it. A tool,
`tools/scheme.mjs`, opens `public/derive.html`'s functions in headless Chrome
through the same CDP driving `tools/shot.mjs` uses, hands it one picture,
and prints the contract JSON; the seed script calls it once per media row.
That is the exact code the derive page runs, so the row and the page cannot
disagree, which is the same rule trip learned about preview renderers
(MEMORY, CMS plan §8). Computing on save, when uploads arrive, is a decision
for the editing step and has two honest routes, both outside step 1: a Node
port of `readColour` and `readType` over a pure JavaScript decoder, whose
cost on a Worker's CPU budget is unmeasured, or Browser Rendering, which is
not on Workers Free (MEMORY). The contract in section 2 is what makes that
choice deferrable: every reader sees a column, never a computation.

**Bindings and config, the diff to `wrangler.jsonc`:** `main: "src/index.mjs"`;
under `env.staging`, `d1_databases: [{ binding: "DB", database_name:
"eccm-staging", database_id: "<from wrangler d1 create>", migrations_dir:
"migrations" }]`; `assets.binding: "ASSETS"` so the script can hand a
request back to the assets when it wants to. `env.production` gets the same
shape with a blank id and a comment. `wrangler d1 create eccm-staging` is run
once, on this account, in session 6.

## 5. Local development and verification

`npx wrangler dev --env staging` runs the script against a local D1 in
`.wrangler/state` with no account; `wrangler dev` is local by default (READ,
developers.cloudflare.com/workers/wrangler/configuration/, the note under
D1 bindings). Before the first run, and after any new migration:

```sh
npx wrangler d1 migrations apply eccm-staging --local
npx wrangler d1 execute eccm-staging --local --file data/seed-step1.sql
```

The two flags are `--local` for `.wrangler/state` and `--remote` for the
deployed database (READ, developers.cloudflare.com/d1/tutorials/d1-and-prisma-orm/,
the flag definitions). `.wrangler/` goes in `.gitignore`.

The checks, sized to the change and never a suite, per this repository's
rule:

- `curl -s http://127.0.0.1:8787/et/events/<slug> > tmp/route.html && node
  tools/check-html.mjs tmp/route.html`, the parse with no browser, on the
  route touched.
- `node tools/shot.mjs http://127.0.0.1:8787/et/events/<slug> 375 1280`, one
  look at the route touched, the way the static pages are looked at.
- one `curl -s -o /dev/null -w '%{http_code}'` per route that exists, six at
  most.
- for session 3 only, a diff: the `style` attribute the route renders
  against the `--ev-*` values `derive.html` sets for the same picture, read
  off the derive page with the CDP eval the session already uses. Equal or
  the scheme is not the derive page's.

No `node --test` in step 1; the render functions are small enough that the
route's parse and the shot are the test. The CMS plan's `test/render.test.mjs`
returns when a second template author appears.

## 6. The sessions, very small

| session | delivers | verified by | must not touch |
| --- | --- | --- | --- |
| **1** | `migrations/0001_step1.sql`, the D1 binding, `src/index.mjs` with one route, the Gestures ET row seeded by hand in `data/seed-step1.sql`, shown at `/et/events/gestuurid-situatsioonid-ilma-partituurita-kuulamine-marianna-liik-artjom-astrov-maryn-liis-rueuetelmaa` from D1 through `event.mjs` | check-html on the curl, one shot, `curl` 200 | `public/*.html`, `eccm.css`, `derive.html` |
| **2** | the EN text row (135), `/en/events/...`, the language switch between the twins, the fallback line for a language with no row (proved by asking for `/en/eccm` before session 5 seeds it) | the same three, on the EN route | the same |
| **3** | `tools/scheme.mjs`, the two `media.scheme` values written by it, the `style` attribute on the article | the diff against `derive.html`'s values, one shot | `derive.html`'s rules; the tool calls them, never copies them |
| **4** | `scripts/seed-step1.mjs` replacing the hand-written rows, the Feldman event in both languages, `/et/` and `/en/` from D1 with two rows, the next-events foot | check-html on the list, one shot of `/et/`, six curls | `public/index.html` |
| **5** | `page`, `page_text`, the about page in both languages, the nav pointing at `/et/eccm` and `/en/eccm` on rendered pages only | check-html, one shot | the static pages' nav |
| **6** | `wrangler d1 create eccm-staging`, the id in `wrangler.jsonc`, `migrations apply --remote`, `execute --remote --file`, deploy, the six routes on https://eccm.positron.studio | six curls against the deploy, one shot of the deployed event route | the static pages, which must still answer 200 at their URLs after the deploy |

Each session ends with the same handover: the URL of the route, the two
numbers (status and assert-free shot), and a `HANDOFF.md` line; commits by
path, by the session and never by an agent.

## 7. What stays out of step 1, and why

- **Editing, drafts, preview, `created_by`**: the owner's words are *"we
  don't even do the editing yet"*, and every one of these needs an identity
  to write, which needs Access. The `status` and `publish_at` columns are
  present so the read queries are already the final ones (`status =
  'published' AND (publish_at IS NULL OR publish_at <= now)`), and nothing
  else of editing is.
- **Login and Access**: nothing is written, so nothing is protected. The
  `noindex` header stays on every response, rendered ones included.
- **Media upload and R2**: `media.key` is a file in `public/` for two rows;
  the column's name and the content-hash rule are written so the upload
  session changes a value and not a schema.
- **The calendar**: the month grid module under every eccm.ee page and the
  past-events archive are both queries over the same `event` table and both
  wait; step 1's list is the upcoming rows and nothing else.
- **The mailing**: `subscriber` and `issue` are the CMS plan's session 4 and
  need Workers Paid for sending (MEMORY, CMS plan §6).
- **Redirects from Joomla paths, sitemap, RSS, `.ics`**: each is one query,
  and each is a promise to the outside world that this hostname is not
  making while it is `noindex` on `eccm.positron.studio`. The `legacy_id` and
  `legacy_path` columns are seeded so nothing has to be re-read when they
  come.
- **Open calls (`post`)**: one article on eccm.ee, not in the sample, its
  table unchanged from the CMS plan.

## 8. What could not be settled from this disk

| unsettled | why | what would settle it |
| --- | --- | --- |
| the venue's address for either event | the event page prints no address block; the list card gives `Arvo Pärdi Keskus, Kellasaju tee 3, Laulasmaa` only in English | the iCagenda dump, or leaving `address` empty in the seed, which is what the plan does |
| the Estonian Feldman event's category | the saved Estonian calendar page one was overwritten by page two on 2026-09-27 | one fetch of `/index.php/et/` when session 4 runs |
| whether the Estonian and English rows are always the same picture | true for both sampled events (one `og:image` URL each, MEASURED) | the dump; the schema allows a per-event picture and not a per-language one, which is the bet |
| the cost of `readType` on a Worker | never run outside a browser; on the desk the derive page reads six pictures in well under a second | a Node port timed with `--cpu-prof`, only if computing on save is wanted before Browser Rendering is |
| the markdown subset's exact rules | `md.ts` is trip's and was not read today | reading it before session 1 writes `md.mjs`, 3,059 bytes |
| how much of the event page takes the derived scheme | a design decision the owner has not made; the derive page's sample is a card | the owner, looking at session 3's route |

## 9. Cost

READ today from developers.cloudflare.com/workers/platform/pricing/, the D1
table: Workers Free allows **5 million rows read a day, 100,000 rows written a
day, 5 GB of storage in total**. READ today from the changelog post of
2026-09-01, *"D1 enforces free tier daily query limits"*: since that date
queries on the Free plan **fail with an error** past either daily limit until
midnight UTC, and stored data is unaffected. That is new since
`plan-eccm-cms.md` was written on 2026-09-26 and it changes nothing for step
1's numbers: an event route reads one text row, one event, one media row and
three next-event rows, about six rows a view, so the daily read limit is
about 800,000 event views, and the seed writes under fifty rows once. The
500 MB per database, 10 databases and 7 days of Time Travel on Free are
MEMORY from the CMS plan's 2026-09-26 reading and were not re-read today.
`wrangler dev --local` costs nothing and needs no account. The one paid thing
in the whole CMS plan, Email Sending, is nowhere near step 1.

## Sources

- `plans/plan-eccm-cms.md` §1, §3, §4, §6, §7, §9, §11, §12, read today
- `plans/plan-eccm-setup.md` §4, §5, §6, read today
- `public/event.html`, `public/index.html` (its row markup), `public/eccm.css`
  lines 255 to 258, `public/derive.html` lines 255 to 300 and 387 to 397, read
  today
- the seven eccm.ee pages listed at the top, fetched today and read through
  `scratchpad/extract-ic-event.mjs`, `scratchpad/parse-ic.mjs` and a
  tag-stripping word count
- developers.cloudflare.com/workers/platform/pricing/ (D1 table),
  developers.cloudflare.com/changelog/post/2026-09-01-d1-free-tier-limit-enforcement/,
  developers.cloudflare.com/workers/wrangler/configuration/ (D1 bindings,
  local by default), developers.cloudflare.com/d1/tutorials/d1-and-prisma-orm/
  (the `--local` and `--remote` flags), all through the Cloudflare docs search
  today
