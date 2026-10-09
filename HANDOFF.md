# Handoff, 2026-10-09, the thirteenth day of the eccm repository

The prototype of a new eccm.ee, live at **https://eccm.positron.studio/** and
committed on `main` of **https://github.com/kristjanjansen/eccm**, private,
pushed. Push per CLAUDE.md and switch the account back. GitHub refused pushes
with a 500 for about ten minutes on 2026-10-07 and then took them; retry
before suspecting the commit.

**This laptop could not reach `eccm.positron.studio` or `positron.studio`** on
earlier days (its Fortinet DNS filter answered with a block page); on
2026-10-09 `curl` reached it. If it blocks again, check through
**https://eccm-staging.kristjan-jansen.workers.dev/** (the same Worker).

## 2026-10-09: the radio spinoffs read, two docs, no share image on tools

Asked: "do the analysis of eccm spinoffs: radio1965 and then v2in", then a
long run of edits, then "deploy and gimme links".

- **/docs/state-of-radio** (`docs/state-of-radio.md`): Raadio Tallinn 1965 and
  Väin read against the team's concept "tulevik, mida ei tulnud" (16 August,
  pasted in chat, not stored): two equal branches, Raadio Tallinn 1965 the
  local web platform, Väin the open lendable app. Where reality differs, what
  is out there (Linktree, Instagram, Vimeo, Substack, TestFlight, the feed),
  the three marks at original, 60 and 16 px, audiences, next steps: the Üle
  Heli festival 23 to 25 October first (`yleheli` and guest channels), Väin as
  an open space, an experiment with Väin on the web, Raadio Tallinn 1965's
  platform with three addresses (`raadiotallinn1965.ee`,
  `raadiotallinn1965.väin.ee`, `väin.ee/raadiotallinn1965`).
- **/docs/vain-tech-notes** (`docs/vain-tech-notes.md`): Väin's server read at
  `4f9cecb` for Tarmo, before, when and after `eccm.ee` moves: who may write
  (a patch), channels from a file, per-channel defaults in the hook, one push
  topic, https for audio through nginx, times without a zone, what depends on
  `eccm.ee`'s old hosting. The write-route note is worded as a recommendation;
  the user sent both links to Maria Hansar for Tarmo.
- **Pictures** (the marks sheet and the Instagram sheet) are in R2
  `eccm-media-staging` under `media/{sha256}`, local and remote, not in git;
  taken from the team's shared Drive folder `Raadio_Tallinn_1965`.
- **Registry** (`whois.tld.ee/v1/{domain}`): `väin.ee`, `raadiotallinn1965.ee`,
  `radiotallinn1965.ee` free; `vain.ee` taken until 2029-11-09.
- **No share image on admin and docs pages** (`src/render/chrome.mjs`: no
  `siteOg` when `wide`), asked "lets not have them for amdin and docs".
- **Joomla shim checked again**: Väin's importer unchanged since 11 September,
  /items needs nothing.
- **Deployed** to staging (last version `e0052130`) and pushed; the 375 and
  1280 shots of the docs were skipped at the owner's word.
- **Next**: the owner's call on what to send ECCM and Tarmo; nothing built for
  the festival yet. Memories `radio-spinoffs` and `docs-no-formula` hold the
  context and the docs rule.

## 2026-10-08: Tarmo's files pass through to the old server

Asked: "do", of the radio forwarding.

- **`src/passthrough.mjs`** sends `/radio1965`, `/radio1965/*` and
  `/radio/streams/*` to `OLD_ORIGIN` whole (method, headers, body, Range,
  redirects unfollowed), a 502 when it does not answer. Unset everywhere, so
  those paths 404 as before; production gets `https://old.eccm.ee` at cutover.
- **Checked** under `wrangler dev` against a stand-in server: query string,
  a 206 for Range, a POST body, a 302 passed on, `/radio1965x` and
  `/radio/other` untouched, 502 with the server down, 404 with it unset.
- **docs/migration.md**: the task done, `OLD_ORIGIN` in the production
  prompt, and the cutover steps open with ECCM adding old.eccm.ee.
- **Deployed** to staging as version `f15a19a7`, the deploy run from this
  session without a refusal, and pushed as `1f58b92`.
- **Next**: ECCM's dashboard steps for Cloudflare Access on /admin, /edit,
  /items and /docs. Tarmo still owes where his files live after cutover.

## 2026-10-08: the loose ends closed

Asked: "fix these", of the three loose ends the handoff listed.

- **The `eccm-files-staging` Worker is deleted**, run by the owner since the
  auto-mode classifier refused `wrangler delete`. Its bucket stays with the
  radio's audio; the source is under the tag `radio-last`.
- **positron's station row is retired**: out of `demo/manifest.mjs` (56 rows),
  the page in `archive/demos/station-index.html` with its README entry,
  deployed by the owner at `d881601-090801-76c7`, committed as positron
  `cff8baf` and not pushed. positron's tree still holds a
  `workers/pub/wrangler.jsonc` change and `workers/sweep/`, neither from here.
- **Event 5 needed nothing.** Its Fienta page (`...-200456`) sells 11.10 for
  Hõbepappel, Kannike and Vares though its slug names the first trio, and
  eccm.ee lists the same six artists and crew on both evenings.
- **The classifier refuses deploys and deletions from this session**, and
  after one refusal it refused even a `grep` in positron. Hand the owner the
  exact command to run with `!`.
- **Next, the same two tasks**: the pass-through of `/radio1965/*` and
  `/radio/streams/*` to the old server behind a setting off until cutover, and
  ECCM's dashboard steps for Cloudflare Access on /admin, /edit, /items and
  /docs. Everything else in `docs/migration.md` waits on ECCM.

## 2026-10-07: the migration plan, the type, the staging tasks

The team is adopting the rework. Their answers, verbatim in Estonian: the radio
stays separate, the newsletter is needed (the last issue took a week by hand),
members add calendar entries one by one, eccm.ee can be replaced directly since
it is a test too, events to the end of the year are entered there.

- **The plan is `docs/migration.md`, rendered at /docs/migration**, with
  `docs/presence.md` and `docs/ici.md` beside it at /docs. Markdown files
  bundled as text (`**/*.md` rule in wrangler.jsonc), drawn by `marked` in
  `src/render/docs.mjs`: a Who does what table on top (done rows last), every
  agent task with a snippet, a check and a prompt, every ECCM task with steps.
  Read it first; its State column is the open list.
- **Findings behind it** (five read-only investigations): eccm.ee is Joomla 5
  on Virtuaal.com cPanel, registrant MTÜ Eesti Nüüdismuusika Keskus 80603988,
  expires 2027-03-18, registrar, DNS, hosting and Exim mail all Virtuaal, no
  DNSSEC, DMARC p=reject. No privacy page, no other subdomains. Väin (U:'s app)
  is fed by Tarmo's server polling eccm.ee's Joomla API (category 47) every five
  minutes; that and his `/radio1965/*` and `/radio/streams/*.mp3` files on
  eccm.ee break at cutover.
- **Type**: body in **Public Sans** (`vendor/public-sans/`, chosen off a /sans
  study since removed), headings in Instrument Sans a tenth larger, the measure
  35rem, tabular figures tracked -0.03em, buttons in the body face. The serif
  title detection and every serif face are removed, knowledge in
  `archive/serif-titles.md`; colour schemes from pictures stay.
- **Done on staging today**: Joomla redirects (`src/redirects.mjs`, misses
  counted in `redirect_miss`, migration 0007); noindex on every response from
  the Worker behind `NOINDEX`, `SITE_ORIGIN` for canonical, sitemap and feeds,
  `/robots.txt`, MusicEvent and Organization JSON-LD; contact form at
  /et/kontakt and /en/contact (`src/contact.mjs`, migration 0008, to
  `CONTACT_TO` info@eccm.ee, Turnstile only once its keys are set); privacy
  draft at /et/andmekaitse and /en/privacy (`data/seed-step8-privacy.sql`, for
  ECCM to approve); the EU emblem on Ulysses; a daily D1 backup into
  `eccm-backup-staging` (`src/backup.mjs`, `tools/restore.mjs`); the radio and
  the research pages removed (tags `radio-last`, `research-last`); a YouTube
  click-to-play player from trip; `.badge` for status cells; text pages and
  docs in one centred 48rem column; next events in three columns on a desk.
- **Later the same evening**: the archive is in staging (60 past events from
  22.09.2024 with 36 pictures, `data/seed-step9-upcoming.sql` and
  `seed-step10-archive-*.sql`, applied remote; 92 events in all, every row of
  eccm.ee's lists matched, the TUMA AFEKT dates and Feldman's English with
  them). **Väin keeps working unchanged after cutover**: `src/joomla.mjs`
  answers `/api/index.php/v1/content/articles` and `/articles/{id}` in Joomla's
  shape from published notices ticked Väin (category 47), numbered from 1000
  and never reused, each with a public page at `/teated/{n}`; checked with
  Tarmo's own importer functions. Docs: a contents table built from each doc's
  own sections and task lines, finished tasks folded, every title a link,
  uniform badges, each question to ECCM or Tarmo inside its task.
- **Next, agent work that can start without ECCM**: the pass-through of
  `/radio1965/*` and `/radio/streams/*` to the old server behind a setting off
  until cutover; ECCM's exact dashboard steps for Cloudflare Access on /admin,
  /edit, /items and /docs. Everything else in `docs/migration.md` waits on ECCM.
- **Owed by ECCM**: the Virtuaal login and a cPanel Full Backup, a Cloudflare
  account with Workers Paid, info@eccm.ee verified as a destination address (or
  Paid) so contact mail arrives, Turnstile keys if wanted, the team's changed
  dates and the three times, approval of the privacy text, Tarmo's answers.

## 2026-10-03: the Estonian front page, the event page, the seeded rows

Asked: "do estonian front page, eventpage fixes, seederdorw, positron bucket.
radio is only englih".

- **`/` comes from D1**, the same `renderEvents({ home: true })` as `/en/`:
  the events to come, no past. `public/index.html` is deleted (in git at
  5977631).
- **TUMA is a series** (`migrations/0006_tuma.sql` rebuilds `event` for the
  CHECK, copying `event_text` and `event_credit` aside around the drop;
  counts 30, 50, 33 before and after, local and remote). Eight events moved
  from Koostöö in `data/seed-step7.sql`: 4, 9, 12, 22, 23, 26, 27, 29.
- **The event page prints Koduleht** from `website_url`, its host as the link
  text, and the link line the seeds repeated at each body's end is gone.
- **A start at 00:00 is a day with no hour** (`hasClock`, `whenLine` in
  `src/render/dates.mjs`), and an event ending on a later day prints the range:
  the Üle Heli festival is 2026-10-22T00:00 to 2026-10-25T23:59 and reads
  "22.–25. oktoober 2026". eccm.ee still prints 15:51, its form's default.
- **The second Gestures slugs** end in `-2026-10-11` (the editor's rule for a
  taken slug), not `-liisa`. The old addresses 404.
- **/radio stays English only**, the open question answered.
- **positron-station's bucket holds only other media now**: the owner deleted
  the 12 station files and their 12 index files (each kept in
  `eccm-files-staging/uploads/` at the same size), leaving 99 objects, all
  `mimproject/`, `mimproject-images/` and `kristjanjansen/`.
- Seen and left: U:'s 23:42 on 29.12 is still as eccm.ee types it. Event 5's
  ticket link and credits are right (checked 2026-10-08, below).

## Where it stands, 2026-10-07

What is true now, each one checkable on the workers.dev address:

- **The radio and the research pages left on 2026-10-07** (`archive/radio.md`, `archive/README.md`, tags `radio-last` and `research-last`): /stream, /radio, /station, /admin/files, /files/*, eccm-files' source, /type, /derive, /icons and /admin/research answer 404; the state is in `archive/radio/`.
- **/admin** (English) has seven cards, four to a row: Docs, Events, Notices, Newsletter, Components (/ds), Logo, Social
  (`TOOLS` in `src/render/admin.mjs`). Admin pages carry a crumb trail:
  Admin, the parent, the page.
- **Both front pages come from D1**, `/` and `/en/`, the events to come.
- **Dark mode** follows the system, with one word in the footer cycling
  Auto, Light and Dark, kept in the browser and set before the first paint.
  A light event scheme carries its dark half as `light-dark()` pairs.
- **/ds** has a Figures section: admin figures are the body face's tabular
  figures, Geist Mono weighed beside them and not used.
- **Pictures on a workers.dev host are the originals**, since
  `/cdn-cgi/image/` exists only on the zone (`src/index.mjs`, `useTransforms`).
  On `eccm.positron.studio` they are resized as before.
- **Buckets on this account**: `eccm-media-staging` (pictures),
  `eccm-files-staging` (the radio's audio, kept and unbound since 2026-10-07).
  `eccm-station-staging` and positron's `vain-archive` are deleted.
- **Workers**: `eccm-staging` (the site) alone; `eccm-files-staging` was
  deleted 2026-10-08, its source under the tag `radio-last`. positron's
  `positron-station` serves only `GET /media/` for the MIM and kristjanjansen
  media, all its bucket holds since 2026-10-03; `positron-vain` is deleted.
- **positron** is deployed at build `fdc5677-081701-752c`: crate is gone
  (`/crate/` 404), the station row is retired (2026-10-08), click and und sit
  under timeline. Its build tree is committed (0bbbbcc).

To check after a change here: an event page, `/` and `/admin` render, and `/radio` answers 404.

## 2026-10-02, afternoon and night: design pages, share cards, icons, dark mode

Not written down on the day; read back from the commits (61fca86..5977631).

- **The design system is three pages**: /ds the components, /logo the mark,
  wordmark and icon sizes, /social the share images, each a card on /admin.
- **Share cards for every page**, not only events: `/og/g/` (share) and
  `/og/gt/` (Instagram), the page's title and its first sentence on a colour
  hashed from the events' schemes (no browns, pure white left out, the front
  page on the events' lightest grey). Every card's date and venue is in the
  sans.
- **Instagram cards**, 4 : 5: the text card at `/og/t/`, the picture split
  across two cards at `/og/tp/` so a carousel reads as one panorama, the text
  card carrying the picture's first 108 px. Title sizes are each the largest
  that cuts none of the live titles. /social shows the pages first, then each
  event's share card and its Instagram carousel, a swipe per card on a phone.
- **Icons are Feather**: 63 with square corners in one sprite,
  `public/vendor/icons/feather/icons.svg`, written by `tools/feather.mjs`, and
  revalidated on every load since /vendor's immutable rule kept an old copy;
  `.ico`, `.btn-ico` and `.play-btn` in `eccm.css`; /icons shows them. The six
  other sets weighed on the research page are archived.
- **/admin/files** has Edit after Listen, opening the row's form in place.
- **The event list on a phone**: under 36rem the picture is the column's width
  at 3 : 2 above the text.
- **Event pages**: underlines, hover and focus in the text colour, not the
  derived accent.

## 2026-10-02, evening: /admin/files and eccm-files

- **/admin/files** (https://eccm.positron.studio/admin/files) holds the site's
  audio in two directories, Uploads and Recordings, with which channel plays
  each file as a column. Files go up through **eccm-files**
  (`workers/files`), positron's vain protocol in 16 MiB pieces, reached at
  `/files/*` through a service binding. Writes needed `FILES_TOKEN`, asked once
  on the page, until the same night opened them to anyone (above). `plans/plan-eccm-files.md` section 10 has the
  detail and the measurements.
- **The station and the recorder use the files bucket** `eccm-files-staging`:
  programmes are `uploads/...` keys, kept shows `recordings/...`.
- **positron's crate and vain are retired**: row out of the manifest, files in
  positron's `archive/`, Worker and bucket deleted.
- `eccm-station-staging` was emptied of its 34 old copies and deleted the same night.
- After a deploy the service binding answered 404 for a minute.

## 2026-10-02, afternoon: the station is eccm's

- **The radio station moved into this Worker** (asked: "do the station. when
  working, discard the positron one"). `src/station/station.mjs` is positron's
  `workers/station/worker.mjs` with four changes listed in its header; it
  answers under `/stream`, its bucket is `eccm-station-staging` (`STATION_MEDIA`),
  its objects are `Schedule` and `Library` (migration `v3`), its sweep runs on
  the cron, now every five minutes, and writes need `STATION_TOKEN` (a new
  secret, not positron's; locally in `.dev.vars`). `tools/live.mjs` broadcasts
  into it. /radio and the recorder read it in process.
- MOVED: 17 programme files, 18 records and the three channels with their
  clocks, so staging plays what positron played at the same moment (COMPARED
  on all three channels). The playlist decodes in ffmpeg; toonid prints one
  "Header missing" at its 44.1 to 22 kHz change, and positron's did the same.
- MEASURED on staging: a 45 s show broadcast with `tools/live.mjs` was kept as
  a 45.000 s MP3. The first try was missed: the recorder's 2 min idle pace
  saw the slot only after it closed and passed the chunks over; a closed slot
  whose chunks still have bytes is kept now. `GET /radio/state.json` shows the
  recorder's alarm and rows. The test show is in staging's Recordings list.
- DONE the same evening, the owner choosing "strip to media only":
  positron-station keeps only `GET /media/`, its objects deleted, its 34
  station files left in its bucket after the owner stopped their deletion.
  Before: discarding positron-station waited on the owner. Its bucket
  also holds about 1.8 GB that is not the station's (`mimproject/`,
  `mimproject-images/`, `kristjanjansen/`), which positron's resources pages
  and its `pub` container load through positron-station's `/media` route, so
  deleting the Worker breaks them and deleting the bucket destroys them.

## 2026-10-02: live shows kept for replay

- **Every live show on the station is recorded by eccm** (`src/radio.mjs`,
  asked: "how to save live input radio to be replayed later?", then "2. do it
  in eccm"). The Durable Object `Radio` (binding `RADIO`, migration `v2`)
  reads positron-station's public `GET /c/{channel}/schedule` every 30 s while
  a live slot is open and every 2 min otherwise, copies each new chunk into
  `eccm-media-staging` under `radio/parts/`, and when the slot closes joins
  them into `radio/{id}.mp3` with an R2 multipart upload, then deletes the
  parts. Nothing in positron changed. The station still lives in positron;
  eccm only reads it.
- **/radio lists them** under Salvestused in the table component, newest
  first, each with Kuula; a show still on air reads "eetris" and one being
  joined "valmib". `GET /radio/{id}.mp3` serves the file with ranges.
- MEASURED 2026-10-02 under wrangler dev: a 45 s take streamed with
  `live.mjs --realtime` into a temporary slot on `live-test` came back as
  five chunks joined into one 45.000 s MP3 (720,978 bytes) that ffmpeg
  decodes without an error; the channel's running order was put back after.
- **The admin pages are English only** (asked: "convert all admin pages to
  english only"): /admin, the editor, the newsletter editor and its outbox,
  /items, /radio and /type; the crumb reads Admin. The public newsletter pages,
  the letters and the stored values stay as they were. /admin has a Research
  card leading to /admin/research, with Typography (/type) and Radio tools
  (/admin/research/radio): the common structure, views and tools across the
  providers, then only their links. /radio/kava answers 301 there; the sketch
  below is gone from the code (in git at ea94cc6).
- **/radio/kava was a sketch of the programming page** (`src/render/radio-plan.mjs`,
  asked: "do a page with radio ui, does not have to work. also put radio ui
  links below"): the channels, a week of typed slots (loop, live, replay,
  file) told apart by their left edge, the Friday live slot opened as a form
  (artists, fallback, a broadcaster key good only in the slot, the episode's
  address, recording), the checks, the episodes, and the tools'
  pages from `plans/plan-eccm-radio-research.md`. Nothing saves; a card on
  /admin leads to it.
- Not done: putting a kept show back into a channel's running order (a write
  to the station, positron's token) and an English /radio.

## 2026-10-01, last: /radio and the two cards

- **The station page is /radio** (https://eccm.positron.studio/radio),
  rendered by the same `renderStation`; `/station` answers 301 to it with its
  query (`?k=`), and /admin and /ds link to it. The files keep the station's
  name (`src/render/station.mjs`, `public/station.mjs`); only the address moved.
- **Share cards, as they stand** (`src/og/card.mjs`, `src/og/route.mjs`):
  events take their picture's colours; the **site card** (`/og/site-et.png`,
  `/og/site-en.png`) is an event card on deep blue `#1b2746`, the centre's name
  as title, "Pühavaimu 9, Tallinn" as meta, the mark at the foot; the **radio
  card** (`/og/radio-et.png`) the same shape on wine `#3b1d2b`, "Raadio" over the
  centre's name, named in /radio's own head. Both are served with an hour's
  `max-age`, their bytes kept in R2 under `TEMPLATE_V` and `SITE_V`; bump
  `SITE_V` after changing either. The earlier logo-only site card was replaced
  the same evening (asked: "default og should have event card style, pick a bg,
  put logo to bottom left").

## 2026-10-01, late: the station page, UbuWeb, the share cards

- **/station** (https://eccm.positron.studio/station) is the channels in
  columns, each holding the whole of its station and nothing said twice: name
  and state (eetris, kuulad, ootab, ei vasta), what is on in two fixed lines,
  who, a progress line with "0:22 / 0:30", one Kuula or Peata, and the running
  order with the slot on air first, as NTS lays out its two live channels.
  Every part has a fixed height so nothing moves. The intro line and the
  "Tehnilised andmed" fold are gone (asked); the numbers and the log go to the
  browser console, `[station]`. A channel with nothing on air (a live slot
  before its first chunk) says "Ootab otseülekannet" with its button off.
- **Põhikanal is UbuWeb now** (channel `main`, titled UbuWeb): nine sound
  poetry classics from ubu.com, copied into the station's R2 as
  `ubu-*.mp3` with title, who and a `meta.source` link to the UbuWeb page,
  about a 20 minute loop (Lucier clipped to 5 minutes). The ERR relay left it.
  UbuWeb's fair-use stance is not a licence: settle rights before anything
  public. **Otse proov** (`live-test`) is only the live slot "Proovisaade" now.
- **The site had a share card**, replaced by the entry above: `/og/site-et.png` and `/og/site-en.png`, the
  original logo alone on white (the header's lockup, Instrument Sans Condensed
  for the tagline), named by `page()` for every page with no image of its own
  (`useOrigin` in `src/render/chrome.mjs`, set per request in `src/index.mjs`)
  and written by hand into the four static pages with the staging host, **to
  change at cutover**. Before it, a link to /station previewed as a crop of the
  footer's ULYSSES mark. No card draws a staff line past the mark's ends;
  serif card titles take the size the sans would (`TEMPLATE_V` 5). An iMessage
  preview of the bare front page address stays cached without a picture on the
  owner's phone; the server answers iMessage's own fetcher with the card
  (checked), and a fresh address such as `/?p=1` shows it.

## 2026-10-01, the night: admin, components, the station's channels and live

- **/admin** (https://eccm.positron.studio/admin) is a grid of cards, one per
  tool: Sündmused, Teated, Raadio, Uudiskiri, Disainisüsteem, Kirjatüübid
  (Postkast and /derive asked off; the outbox is linked from the newsletter
  page). Every tool page passes `page({ wide: true })` in
  `src/render/chrome.mjs`: it gets a crumb "Haldus" back to /admin (in front
  of its own crumb when it has one) and its forms, tables and grids use the
  whole frame; notes keep the measure. /ds and /type carry the crumb by hand.
- **Components new today, all on /ds:** `.card` (16 by 9, a 1 px ink edge,
  title and description top left, a pointer lightens it with a 200 ms ease),
  `.table` (no box, no zebra, one hairline under the head, the current row in
  600, a narrow form under 36rem of its own width; `src/render/table.mjs`
  writes it, used on the notices, the newsletter's letters, its outbox and its
  public archive, and the station), `.btn-sm` (a row's own action, Muuda in the
  notices table). A light button variant was made and asked away again: the
  two language buttons are plain `.btn`. Lists of a date beside a title
  (`.next-list`, `.edit-list`) hold their two columns on the list and take
  them through subgrid, so titles align.
- **The station has channels and a programme library**, deployed:
  `workers/station` in positron. One Schedule Durable Object per channel
  (`main` is the old one, its clock kept), a `Library` object holding the
  channel registry and one loose record per programme (title, who, kind,
  duration, free `meta`), filled from ID3 on upload and by `POST /backfill`.
  Routes `/c/<name>/station.m3u8`, `/now.json`, `/schedule.json`,
  `/channels.json`, `/programmes.json`. Three channels today: **main**
  (Põhikanal: tones and the ERR Klassikaraadio relay, 30 s each), **toonid**
  (Toonid: three tones) and **live-test** (Otse proov: a tone, then an open
  live slot `mic-test`). The four test files are `test-tone-*.mp3` now; the old
  `prog*.mp3` objects are still in R2 and in the library, unused.
- **Live into the station:** `workers/station/live.mjs` in positron is the
  recorder. It cuts any MP3 stream into frame-aligned 10 s chunks and posts
  them to `/live/<key>/append`; Ctrl-C closes the show. MEASURED locally: a
  25 s tone arrived as 10 + 10 + 5.07 s and closed cleanly. Not yet run against
  the live station. To test: `ffmpeg -f avfoundation -i ":0" -ac 2 -ar 44100
  -b:a 128k -f mp3 - | node workers/station/live.mjs --key mic-test --channel
  live-test` from positron, then Kuula on Otse proov. While a live slot is open
  its channel follows the show, not the loop.
- **eccm /station** shows every channel in a column (title, what is on, who,
  its own Kuula or Peata, the next two), the chosen one's readouts, running
  order and log below, `?k=<name>` in the address.
- **The station's write token was rotated** earlier today and lives as
  `STATION_TOKEN` in positron's git-ignored `.env`; `live.mjs` reads it there.
- **Open:** whether /station wants an English twin (asked back, unanswered);
  the newsletter composer makes a draft on the first press, so abandoned ones
  stay as "(teemata)" (two were deleted); the if-router in `src/index.mjs`
  could become one route table; "scheme" might be renamed "theme" (asked,
  undecided); a broadcast page in the browser, with MP3 encoded there, is the
  next step for live from a phone.

## 2026-10-01, the evening: what is live and what to know

- **The type changed twice and the first change found a bug.** The two
  Schibsted Grotesk files under `public/vendor/` had each other's names, so
  since 2026-09-26 every ASCII letter on the site was drawn in Helvetica
  (MEASURED with `CSS.getPlatformFontsForNode`: 6 of 55 glyphs in a title were
  Schibsted). Fixed, then the owner chose **Instrument Sans** at its normal
  width everywhere, the share cards included (*"jep, schibsted to instrments
  sans everywhere, incl social"*), and **Roboto Serif** as the serif in place of
  Newsreader (*"change serif to Roboto Serif"*). Each has a fallback measured
  in headless Chrome (Instrument Sans 102.09 per cent of Helvetica, Roboto
  Serif 111.01 of Georgia). Tabular figures are off: Schibsted's tnum widened
  the full stop, and the eccm-ui skill records it. Stored schemes, the seed
  files and the share-card TTFs (`tools/og-fonts.py`, `TEMPLATE_V` 4) all name
  the new faces; `public/type.html` still shows the old specimens, as a study.
- **Share cards** are 1200 by 630 PNGs per event and language
  (`/og/e/{id}-{lang}-{v}.png`, resvg wasm, cached in R2), title, meta, and the
  ECCM letters small at the foot with their own short stave (the long staff
  lines went, asked). `/ds` shows the real ones and fits a phone now.
- **More of eccm.ee is in D1:** `data/seed-step6.sql` added 20 events, 6
  English texts for old ones and the Liikmed / Members page (`/et/liikmed`,
  `/en/members`, linked from no menu yet), applied to staging; 30 events in
  all. Open data questions are in `BACKLOG.md`: U:'s 23:42, Residentuu:r 4's two
  venues, the Huddersfield picture read as serif, and the festival's 15:51.
- **Session 1 is complete:** an `.ics` per event (the iCal link in the
  calendar row) and per language (`/et/sundmused.ics`, `/en/events.ics`,
  unlinked until cutover).
- **The newsletter sends for real.** The owner onboarded
  `eccm.positron.studio` as an Email Sending domain (dashboard, 1,000 a day),
  `MAIL_FROM` is `ECCM <uudiskiri@eccm.positron.studio>`, DKIM, SPF and DMARC
  pass (read off a delivered letter's headers), and one real issue, "ECCM
  oktoobris", went to the one confirmed subscriber, the owner. Gmail's own
  Unsubscribe link does not show yet: the headers are right and signed, which
  Gmail decides on by sending reputation. Anyone who finds `/edit/uudiskiri`
  can send to the list.
- **The footer** carries ULYSSES Platform beside Tallinn's mark (the black SVG
  from the network's own header), and on a desk a short page keeps its footer
  at the foot of the window.
- **/station** (https://eccm.positron.studio/station) is positron's station in
  this site's chrome, Estonian only: player, readouts, log and the running
  order in a new `.table` component (also on `/ds`), read from the station
  Worker's `/schedule.json`. The owner asked *"station page is in english
  only"*, which was answered with a question: whether an English
  `/en/station` is wanted. Not yet answered.

## 2026-10-01: in positron, for the station and the items demo

- **The items demo is gone** from positron (archived in its
  `archive/items/README.md`, copied here as `archive/positron-items.md`); its
  worker `positron-items` was deleted by the owner; the view was deployed
  without it.
- **The station** (`workers/station`, https://positron.studio/station/) gained
  an upcoming-first programme table, 30 s clips, and an ERR Klassikaraadio
  relay slot cut from ERR's Icecast MP3 by the Schedule object, and the
  `levelParsingError` was found and fixed (the discontinuity sequence,
  MEASURED 40 mismatches in 200 s before, 0 after). The running order is now
  proga, Klassikaraadio live, progd, progb, 30 s each. **The station's write
  token was rotated** because the old one was unrecoverable: the new one is
  `STATION_TOKEN` in positron's git-ignored `.env`, and anything that wrote
  with the old one (a live recorder) needs it. Rebroadcasting ERR publicly
  may need ERR's permission.
- positron commits: `c6c1143` (station), `35f05bc` (the deployed tree, which
  also shipped the earlier "cap: all secondary buttons" change), `e7f3fba`,
  `d49ed54`, `b132ab9`, `54950bd`; not pushed.

## 2026-10-01: share images, calendars, the Ulysses mark

Share images per event in the derived ground and face, live (`/og/e/...png`, the Open Graph head, real cards on **https://eccm.positron.studio/ds**); the `.ics` per event and per language; ULYSSES Platform in the footer. `BACKLOG.md` has the measurements. A background agent is importing more of eccm.ee's events and one more page into `data/seed-step6.sql`, local only until read.

## 2026-10-01: the newsletter, on the free plan

Asked *"can we start newsletter work event on nonpaid account? see ../trip"*, then *"go"*. Built, in `BACKLOG.md` in full: the sign-up with double opt-in at **https://eccm.positron.studio/et/uudiskiri** (and `/en/newsletter`), unlinked until cutover; the composer at **https://eccm.positron.studio/edit/uudiskiri**; trip's outbox and mail template, sent through the `send_email` binding from `uudiskiri@positron.studio`. On the free plan only verified destination addresses receive mail, and none is verified for the owner yet, so the staging test letter sits in the outbox refused.

## 2026-10-01: notices, push and the installable site

Asked: *"see ../positron items demo. i want eccm.positron.app to pwa with push notifications. move that items infra over to eccm. for pwa logo use single line logo. make page on eccm to list and add items"*, then *"use eccm edit style"*. Done, in `BACKLOG.md` in full: **https://eccm.positron.studio/items** lists and adds notices, a Durable Object publishes each on its moment and pushes it with plain Web Push (VAPID, no Firebase), the site installs as ECCM with the single-line mark. Staging carries one test notice, Proov, and one dead headless subscription that the next push drops. Then *"yes. just put button somewhere up, rm footer"*: a Luba teated bar under the header in the installed app, the footer link gone, and *"it works"* on the owner's iPhone. Then *"do it"*: Muuda on every notice, a waiting one's time movable, any one deletable, and the list refreshing itself. Open: whether /items should stay open to anyone like the editor.

## 2026-09-30: upload, schemes, sitemap, feeds, the image ladder, the font jump

Five asks, verbatim, each with its full entry and measurements in
`BACKLOG.md`:

1. *"implement image upload and apply detection (bg color, sans/serif etc) on
   current content. in bg also sitemap, rss. see plans"*
2. *"Resized image versions -- see ../trip implementation"*
3. *"i saw font change jump on .../gestuurid-situatsioonid-ilma-partituurita-kuulamine
   - can we optimize / preload? see ../trip"*
4. *"why you are using positron skills?"*, answered: CLAUDE.md says to load
   `positron-compose` beside `eccm-ui` before any change under `public/`. The
   owner did not ask for it to change.
5. *"is it paid option?"* of the dashboard's allowed-origins screen, answered:
   no, that screen only chooses sources ("This zone only" kept), and
   transformations are free to 5,000 unique a month and never billed on the
   free plan. Then *"its on"*, and the ladder was switched on the same hour.

**The detector is one module.** `readColour`, `readType` and `scheme` moved
unchanged from `derive.html` into `public/scheme.mjs`, with `contract()`
writing the flat JSON of `plans/plan-eccm-social-images.md` section 10 and
`DETECTOR_V = 1`. derive.html, the editor and `tools/scheme.mjs` import it.

**Every current picture has a scheme.** `node tools/scheme.mjs` (`--remote`
for the keys on Cloudflare, `--keys a,b` for a probe that writes nothing)
reads each media row's picture in headless Chrome through its own small
server and writes `data/seed-step5-schemes.sql`, applied local and remote:
9 of 9, 6 light and 3 dark. No seeded picture's type was readable, so the
only serif is Gestures, marked by hand as derive.html does (`HAND` in the
tool). Keys under `media/` are skipped: uploads got theirs in the browser.

**The event page wears it.** `.event[data-scheme]` in `eccm.css` redefines
the site's tokens from the `--ev-*` values, the ground runs edge to edge
between header and footer (a clipped shadow, no overflow), and the title,
facts and credits take the serif when set, the body only on a ground near
white. `.btn-pri` is the scheme's button fill, never the accent.

**Upload.** The event form posts multipart. The Pilt section is the picture,
a drop field, two description fields and the old file-name field as
Olemasolev pilt. The browser reads a chosen file with `scheme.mjs` and
sends the scheme; `src/media.mjs` sniffs the format from the bytes, reads
width and height from the header, puts the file in R2 bucket
`eccm-media-staging` (binding `MEDIA`, created today) as
`media/{sha256}.{ext}` and upserts the media row. `/media/*` serves it
immutable with CORS, a miss 404 `no-store`. A picture with no scheme is read
as its form opens and gets one on save. The posted scheme passes
`cleanScheme` in `event.mjs` value by value and the style attribute is
escaped. Migration `0004_media_upload.sql` (`media.bytes`) is on the remote.

**Sitemap and feeds**, by a background agent in a worktree, merged and the
worktree removed: `/sitemap.xml` (23 urls locally, hreflang pairs, `lastmod`),
`/et/feed.xml` and `/en/feed.xml` (RSS 2.0, 20 newest per language, no
fallback, enclosure length from `media.bytes`). Advertised nowhere until
cutover, as the plan says.

**The image ladder, on.** `src/render/pic.mjs` is trip's `cdn()` with
eccm's paths: the list at 300, 600, 900 (3 to 2, cover), the poster at 640,
960, 1280, 1920 with `fetchpriority="high"` and a mirrored preload, never a
rung wider than the original. `/cdn-cgi/image/` answers 404 on this zone and
Transformations are a dashboard switch only; the owner switched them on the
same day ("This zone only", the free plan: 5,000 unique a month, never
billed, and every URL carries `onerror=redirect` so a transformation past the
limit falls back to the original). `IMAGE_TRANSFORMS` in `wrangler.jsonc` is
`"on"`; `"off"` draws originals. MEASURED live: renditions 200 in AVIF, a
MISS then a HIT, an R2 upload resized as well.

**The font jump.** Newsreader, the body face on a serif event, was not
preloaded and Georgia is wider, so the page reflowed. Now: Newsreader is
preloaded on every event whose scheme sets it, and `Schibsted Grotesk
Fallback` (Helvetica, Arial) and `Newsreader Fallback` (Georgia) carry
`size-adjust` and ascent and descent overrides MEASURED in headless Chrome,
named in the stacks (the stored schemes regenerated for the new Newsreader
stack). MEASURED on a 620 px Estonian paragraph at 18 px: each face and its
fallback 7 lines, the bare system face 8. Newsreader's width must be taken
at body size: its optical size axis is 10 per cent narrower at 100 px.

**Open from today:** push (above); the
canonical, `robots.txt` and `.ics` parts of the URL plan's sessions 8 and 9;
the list rows are all `loading="lazy"` where the plan wants the first two
eager; an upload has no delete and a replaced picture's row and object stay.

## What is live, page by page

| URL | what |
| --- | --- |
| https://eccm.positron.studio/ | the Estonian front page **from D1** since 2026-10-03, the events to come, as `/en/` |
| https://eccm.positron.studio/en/ | the English front page **from D1**, the events to come under Upcoming events, no button, no past |
| https://eccm.positron.studio/et/sundmused | the events list from D1, and `/en/events`: the events to come, then Toimunud when there are any. The Add button went 2026-09-29 with `/edit/events/new` |
| https://eccm.positron.studio/et/sundmused/surm | an event page from D1, one of ten (`data/seed-step1.sql` to `seed-step4.sql`); `/en/events/{slug}` is its twin where an English row exists (two of ten) and the Estonian text under English chrome with one line saying so where none does |
| https://eccm.positron.studio/et/eccm | the five text pages from D1, ECCM, Tallinn 1965, NAN, Ulysses, Konkursid, at `/et/{slug}` and `/en/{slug}`, a fallback either way where a language has no text, one centred column of the measure |
| https://eccm.positron.studio/edit/events/1 | one event's form, open to anyone who opens it, reached from the Muuda button on the event and from nowhere else. **There is no editor list and no new-event form** |
| https://eccm.positron.studio/edit/pages/1 | one text page's form, reached from the Muuda/Edit button every text page carries; `/edit/pages/new` still makes one |
| https://eccm.positron.studio/derive | design from a picture, four sets of six pictures (`?set=1` to `4`), colours only since 2026-10-07 |
| https://eccm.positron.studio/ds | the components: type, figures, colour, space, buttons, tables and cards, in both themes |
| https://eccm.positron.studio/logo | the square mark, the wordmark in both languages and every icon size |
| https://eccm.positron.studio/icons | Feather, the site's 63 icons, in buttons small and large on both grounds |
| https://eccm.positron.studio/social | the share and Instagram cards of every page and event |
| https://eccm.positron.studio/type | seven faces for body and titles; the ten serifs and the derived page's three uses left 2026-10-07 (archive/serif-titles.md) |

Six static pages (derive, ds, icons, logo, social, type), `ls public/*.html | wc -l` counting 6 on 2026-10-03.

Gone since 2026-09-27: `/wordmark` (folded into the foot of `/ds`), `/serif`
and `/sans` (merged into `/type`), `/layout` (its winning header and footer
became the chrome of every page; footer D lives on in
`plans/plan-eccm-footer-newsletter.md`), `/edit` as a static form (the address
now goes to the front page). Gone 2026-09-29, asked as *"rm old event page,
taglines, logo, edit/event/new, logo"*: `/event` (the static event page, the
design page for event 134, which the D1 event pages have replaced), `/tagline`,
`/tagline-47` and `/logo`, all four in git at `2faec1e^`. The event card on
`/derive`, `/ds` and `/type` links to the D1 event it always showed,
`/et/sundmused/gestuurid-situatsioonid-ilma-partituurita-kuulamine`. Gone the
same day: `/login`, `/logout` and `/edit/events/new`, which answer the 404.

Also under the root: `logo.svg` (two languages), `logo-et.svg`, `logo-en.svg`,
the four `wordmark-*.svg`, `manifest.webmanifest`, `_headers` (noindex on
everything, a year's immutable cache on `/vendor/*`), `partners/` with the six
City of Music marks, `icons/` with the square marks and favicons, and the
event pictures as eccm.ee names them (`ic_medium_*` at 300 px for the front
page rows, `ic_large_*` at 900 px for the event pages).

## The chrome, on every page

The header is the mark with the wordmark beside it in Instrument Sans (the
`beside` lockup, 37 units, the `under` lockup at 40 units on a phone), the
menu of seven items centred, and the ET/EN switch. It has three arrangements
now, not two. Over 70rem the three sit on one line. Between 48rem and 70rem
the menu takes a row of its own under the mark, starting at the frame's left
where the mark's E is, with the switch at the first row's far end: MEASURED
2026-09-29, the nav is two lines at 1080 px and one at 1090 on
`/et/sundmused`, two at 1070 and one at 1080 on `/en/events`, so 70rem clears
the wider of the two menus by 30 px and an eighth item is the thing to measure
again. Under 48rem the menu sits behind three 1px lines in a 3rem box, the
box's own rule asked away 2026-09-29, opens under the header, and the switch
comes last in it.

The footer is four content columns and the City of Music mark since
2026-09-29: the mark and the copyright, the menu in two columns, the venue and
the postal address, then the phone with Kirjuta meile, Instagram and Facebook,
which got their own column that day. One column under 48rem as before.

The Worker's pages take the chrome from `src/render/mark.mjs` (HEADER and
FOOTER strings, the switch href replaced per page); the static pages carry it
inline, so a change to the chrome is one edit in `mark.mjs` and one in each of
the six static pages.

Every language switch stays on this site: the D1 pages and events go to their
twin, the two lists to each other, the Estonian static pages to `/en/`, the
English ones to `/`, and `/et/` answers 301 to `/`.

## What the Worker does today

`src/index.mjs` answers from D1: `/` and `/en/` (the front pages), `/et/sundmused`
and `/en/events` (the lists, `src/render/events.mjs`), `/et/sundmused/{slug}`
and `/en/events/{slug}` (`src/render/event.mjs`), `/et/{slug}` and
`/en/{slug}` (`src/render/page.mjs`, the five text pages; `sundmused` and
`events` are refused as page slugs). The editor in `src/editor.mjs` with
`src/render/editor.mjs` answers `/edit/events/{id}`, `/edit/pages/{id}` and
`/edit/pages/new`, one form for both languages each; `/edit` goes to the front
page. Everything else 404s; assets under `public/` are served first.

**Nothing asks who is editing.** `src/gate.mjs`, `/login`, `/logout`, the
`EDITOR_TOKEN` cookie and the cross-site check went 2026-09-29, asked as *"rm
login/session stuff. all is free for editing"*, so anyone who reaches a form
may save from it and `updated_by` is written empty, since there is nobody to
name. The remote secret was deleted the same day; `wrangler secret list --env
staging` returns `[]`. Putting a door back means an Access application on
`eccm.positron.studio/edit*` (setup plan section 2) and nothing in the Worker.
Every editor reply is still `no-store` and `noindex`, and `_headers` puts
`X-Robots-Tag: noindex` on the whole hostname.

A save is one D1 batch guarded by `rev`, a stale form answers 409 with the
typed values kept, a preview renders the real template without writing, and a
save lands on the public page when the row is published, else on the form
again. MEASURED 2026-09-29 with no cookie: the forms 200, a save 303 with rev
1 to 2, the same form again 409, a cross-site POST 303 where it used to be
403, an empty Algus 422, a preview 200 with rev unchanged.

**The event form, reshaped 2026-09-29**, most of it asked with a crop:

- Algus, Lõpp and Kestus minutites on one row, in a `.field-row` that spans
  the section and inherits its two gaps. MEASURED: 1152 by 95.2 at 1280, one
  line; 343 by 292.4 at 375, three.
- The status radios take the body size in the ink, the same as the text a
  field holds, and the button is `--eccm-s-6`, a scale step larger than it was.
- Every credit opens with a `Tegija N` subheader and the role field is
  labelled Roll. `.field-name` is the body size in the ink now, a step under
  the section's h2 and a step over a field's label.
- Vaba rolli nimetus and Free role, in English appear only on the free option,
  through `option[value=""]:checked` inside `:has()`, so it costs no script and
  is right on the first paint. A credit's rows take three fixed columns on a
  desk so the select keeps its own column when the two are away.
- The select draws its own caret, 14 px wide with a 1 px stroke, set in from
  the edge by the field's own inset. The ink is written out in the data URI,
  since neither `var()` nor `currentColor` reaches into one.
- Labels, legends and subheaders take `--eccm-ink`; the hints under them stay
  `--eccm-ink-2`.

Fixed the same day: the add-credit script carried a regex inside an `html`
template literal, whose backslash the literal ate, so it shipped as
`/Tegija d+, roll/` and had never renumbered a block added in the browser.
**Anything written as a regex or a path inside an `html` template literal
needs its backslashes doubled**, and the check is `curl` and `grep`, not a
reading of the source.

The remote database is `eccm-staging` (id in `wrangler.jsonc`), migrated with
`migrations/0001_step1.sql` to `0004_media_upload.sql`
and seeded with `data/seed-step1.sql` to `seed-step4.sql` and `seed-step5-schemes.sql`. COUNTED on the
remote 2026-09-29: 10 events, 12 event texts, 19 credits, 9 pictures, 5 pages,
7 page texts, and 0 rows with anything in `updated_by`. All six sessions
of `plans/plan-eccm-cms-step-1.md` are done since 2026-09-30, and the editing
the plan left out of step 1 is in. The 2026-09-30 upload test left no row:
it was deleted with its R2 object, so the bucket is empty.

The dev server for local work is `npx wrangler dev --env staging`; none is up.
`.wrangler/state` is the current one and holds the four migrations and the
five seeds, plus two local test uploads (media rows 10 and 11, used by no event); `.wrangler/state-editor`, `state-front`, `state-pages` and
`state-pages-edit` are leftovers of the agents of 2026-09-28 and can go. A
fresh state takes the four migrations and the five seeds in order.

## The plans

`ls plans/*.md | wc -l` counts 13 today, counted and never remembered. Named
here: `plan-eccm-presence.md` (where ECCM is on the web, a priced plan of
twelve items), `plan-eccm-footer-newsletter.md` (footer D, for when a
newsletter comes), `plan-eccm-cms-step-1.md` (seven tables, six sessions),
`plan-eccm-social-images.md`, `plan-eccm-images.md`,
`plan-eccm-event-markup.md`, `plan-eccm-urls-sitemap-rss.md`,
`plan-eccm-bios.md`, `plan-eccm-icons.md`, and the four that came with the
move. Every one was relayed in full in the session that made it.
`~/plans/lightpanda.md` is outside the repository: Lightpanda runs under
`/opt/homebrew` only, does DOM and script but no layout, and is not useful
here.

## Decisions taken 2026-09-28 and 2026-09-29, in the owner's words where there were words

- **Anyone may edit.** *"rm login/session stuff. all is free for editing"*
  (2026-09-29). The gate, the login page, the logout route, the
  `EDITOR_TOKEN` cookie and the cross-site check are gone, and `updated_by`
  is written empty. The site is noindex on this hostname and the editor's own
  replies are noindex too.
- **A new event cannot be made from the site.** *"rm ... edit/event/new"*
  (2026-09-29). `/edit/events/new` and the Add button on the public events
  list are gone; an event is edited from its own Muuda button and made in the
  database. `/edit/pages/new` stays, which was not asked away.
- **Editing happens from the thing itself.** *"only events themselves are
  access ppoint to edit"*, and before that *"rm edit/pages page"*. No editor
  lists; a Muuda button on every event and text page, and since 2026-09-29 no
  other door at all.
- **A form label is the ink, a hint is the second ink.** *"make form labels
  more darker"* (2026-09-29). The pair reads as a name over its control with a
  note under it.
- **A choice reads as a value, not as a label.** *"make same text size as
  textfiels, make radios bigger to match"* (2026-09-29): the radio labels were
  caught by `.field label` and drew at 14 px in the second ink.
- **The form says less.** *"rm Avalik leht: ET EN / Salvestatud kell 13.30."*,
  *"rm Lehed breadcrumb"*: no saved line, no public links, no crumb; landing
  on the page is the feedback. *"make classic horiz radions (o) () instead of
  radiobuttons"* after a segmented pair lasted an hour.
- **A text page is one centred column.** *"page content is too left, not great
  to read, center the paragraph or figure ou right column (images?)"*.
  Centred, since a page has no picture; a picture column would need a
  column on `page`, a field and five pictures.
- **No accent colour.** *"none. keep it black inc outliens."* The token
  `--eccm-accent` is the ink.
- **No serif on a derived page.** *"rm serif title discovery and sttyling.
  leave knowedge"* (2026-10-07): the scheme is colours only, and
  `archive/serif-titles.md` keeps what the detector knew.
- **The chrome is H-B and footer A** from the layout study: *"implement this
  layout on all pages now, rm layout"*, after *"all headers are bad. cramped,
  no proper typo approach"* sent the study back to eight measured sites.
- **The phone menu button is three lines and no box.** A square with a 1px
  rule replaced five stave lines on 2026-09-28; the rule itself went
  2026-09-29 (*"rm border around hamburger menu"*). The 3rem box is the tap
  area alone.
- **The header has a middle width.** *"when between mobile and destop, put
  header menu links to new row"* (2026-09-29).
- **Fonts are cached a year and preloaded.** The wordmark is SVG text in
  Instrument Sans; with `max-age=0, must-revalidate` on every asset it drew
  in the fallback face on every page switch until the 304 came back.
- **One check per change**, on the owner's word: *"speed up yr process"*,
  *"this is not sustainable"* about a re-measure. Measure once, look once,
  deploy, do not re-measure after.
- **A change is finished when it is live.** Asked twice on 2026-09-29,
  *"pushed? deployed?"* and then *"do both"*: commit by path, deploy to
  staging, push with the personal account, and hand back a URL. Do not stop at
  "say the word".

Earlier decisions still standing: credits are role lines; the router is plain
JavaScript; the scheme JSON on the media row is flat with a version beside
it; dates carry the month's name; the venue is Pühavaimu 9 and Herne 11A is
the postal address; the letters E to M are the mark and the stave is
ornament; both lines of a tagline pair are centred or both start on the E.

## Open, for the owner

- **An event can only be made in the database.** Asked for, and worth saying
  out loud: with `/edit/events/new` gone there is no way to add an event from
  the site. `data/seed-step4.sql` is the pattern for adding one by hand.
- **The gate for /admin and /files.** Uploads are open to anyone by the
  owner's word, until Access, the token or open is chosen (the first section).
- **The editor is open on a public hostname.** Noindex everywhere, and an
  address nobody is given, but anyone who finds `/edit/events/1` can save over
  an event. That is what was asked for; the Access application is the way back.
- **The language is not remembered** between visits; the switch is per page.
- **The tagline's face and shape are still unsettled**, and the two pages that
  showed the study, `/tagline` and `/tagline-47`, were asked away 2026-09-29.
  They are in git at `2faec1e^` and the reasoning is in the `eccm-ui` skill,
  section 7. Then the outlines for whichever wins; a true 16 px mark; a
  maskable Android icon; the bios migration when that plan is read.
- **Konkursid** holds the intro and a link to the full call on eccm.ee.
- **The second Gestures evening (event 5) is right as it is**, checked
  2026-10-08: its Fienta page (`...-200456`) sells 11.10 for Hõbepappel,
  Kannike and Vares though its slug names the first trio, and eccm.ee lists
  the same six artists and crew on both evenings.
- **Not done on the radio**: putting a kept show back into a channel's
  running order. /radio stays English only (answered 2026-10-03).
- **UbuWeb's fair-use stance is not a licence**: settle the rights before the
  station plays it anywhere public.

## The machine

This laptop kills binaries it does not know (ThreatLocker): a binary runs
under `/opt/homebrew` and dies with exit 137 in `$HOME`. `wrangler` is pinned
to exactly 4.107.0 and `workerd` to 1.20260701.1 with an override, because
the workerd of wrangler 4.141 exits 137 and wrangler reports it as
`write EPIPE`; `compatibility_date` is 2026-07-08, the newest that runtime
supports. Every local D1 and dev command depends on this. Deploy with
`env -u CF_API_TOKEN -u CLOUDFLARE_API_TOKEN npx wrangler deploy --env staging`
and migrate the remote database before deploying code that needs a column.
`eccm-files` deploys on its own with `-c workers/files/wrangler.jsonc --env
staging`, and both run locally with `npx wrangler dev -c wrangler.jsonc -c
workers/files/wrangler.jsonc --env staging`. positron's `.env` carries a
`CF_API_TOKEN` without access to these Workers, so a positron Worker is
deployed from this directory with `-c <its wrangler.jsonc>`. This wrangler has
no `r2 object list`; the API answers it with the OAuth token in
`~/Library/Preferences/.wrangler/config/default.toml`.
Safari and Chrome measure a variable font's width axis differently unless it
is set with `font-variation-settings`; the two pages that carried both, the
tagline ones, went 2026-09-29, so the next page that sets a width axis has to
carry it again.

`sips` crops a shot for a look: `sips -c <h> <w> --cropOffset <y> <x> in.png
--out out.png`, and an offset of exactly `0 0` is ignored and crops the
centre, so use `1 0` for the top of a page.

## How to go on

Everything is pushed. `BACKLOG.md` has every ask verbatim with what was
measured, the open ones at the top. The candidates now: the gate for /admin
and /files, and the open list above. Agents
report and do not commit; the session commits by path, deploys and pushes,
and a deploy ships the working tree, so `git status` before every deploy.
