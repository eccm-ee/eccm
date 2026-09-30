# Handoff, 2026-09-29, the third day of the eccm repository

The prototype of a new eccm.ee moved out of positron on 2026-09-27 and has
grown for three days. Everything below is live at
**https://eccm.positron.studio/**, committed on `main` of
**https://github.com/kristjanjansen/eccm**, private, and pushed: `HEAD` is
`9fb68bd` and `origin/main` is the same, so nothing is outstanding. Today's two
commits are `2faec1e` and `9fb68bd`. Numbers here were counted with a command
when this was written; count again before building on one.

The day was one long run of small asks, each answered and shipped: the editor
lost its door, four study pages went, the event form was reshaped six ways,
the footer grew a column and the header learned a middle width. `BACKLOG.md`
has every one verbatim with what was measured.

## 2026-09-30, the fourth day: upload, schemes, sitemap, feeds

Asked: *"implement image upload and apply detection (bg color, sans/serif etc)
on current content. in bg also sitemap, rss. see plans"*. `BACKLOG.md` has
the whole entry with what was measured. In short: the detector is
`public/scheme.mjs`, imported by `derive.html`, the editor and
`tools/scheme.mjs`; all nine pictures carry a scheme (`data/seed-step5-schemes.sql`,
applied remote) and every event page wears its picture's ground, inks and
faces; the event form uploads to R2 `eccm-media-staging` under the sha256,
with the scheme read in the editor's browser; `/sitemap.xml`,
`/et/feed.xml` and `/en/feed.xml` answer and are advertised nowhere.
Migration `0004_media_upload.sql` (`media.bytes`) is on the remote database.
Open: renditions and `srcset` wait for Image Transformations on the zone;
canonical, `robots.txt` and the `.ics` feeds are the rest of the URL plan's
sessions 8 and 9.

## What is live, page by page

| URL | what |
| --- | --- |
| https://eccm.positron.studio/ | the Estonian front page, static, ten rows with kicker, title and summary; since 2026-09-28 every row links to the event's own page from D1 |
| https://eccm.positron.studio/en/ | the English front page **from D1**, the events to come under Upcoming events, no button, no past |
| https://eccm.positron.studio/et/sundmused | the events list from D1, and `/en/events`: the events to come, then Toimunud when there are any. The Add button went 2026-09-29 with `/edit/events/new` |
| https://eccm.positron.studio/et/sundmused/surm | an event page from D1, one of ten (`data/seed-step1.sql` to `seed-step4.sql`); `/en/events/{slug}` is its twin where an English row exists (two of ten) and the Estonian text under English chrome with one line saying so where none does |
| https://eccm.positron.studio/et/eccm | the five text pages from D1, ECCM, Tallinn 1965, NAN, Ulysses, Konkursid, at `/et/{slug}` and `/en/{slug}`, a fallback either way where a language has no text, one centred column of the measure |
| https://eccm.positron.studio/edit/events/1 | one event's form, open to anyone who opens it, reached from the Muuda button on the event and from nowhere else. **There is no editor list and no new-event form** |
| https://eccm.positron.studio/edit/pages/1 | one text page's form, reached from the Muuda/Edit button every text page carries; `/edit/pages/new` still makes one |
| https://eccm.positron.studio/derive | design from a picture, four sets of six pictures (`?set=1` to `4`), Newsreader as the serif with Literata and Roboto Serif on `?serif=literata` and `?serif=roboto` |
| https://eccm.positron.studio/ds | the design system, with the wordmark studies at its foot: type specimens, bios, colour (the ink only, no accent since 2026-09-28), space, buttons with a disabled state, the logos, the square marks, the icons |
| https://eccm.positron.studio/type | seventeen faces for body and titles, then the six sans and the ten serifs in the derived page's three uses |

Four static pages, `ls public/*.html | wc -l` counting 4 today.

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
the four static pages.

Every language switch stays on this site: the D1 pages and events go to their
twin, the two lists to each other, the Estonian static pages to `/en/`, the
English ones to `/`, and `/et/` answers 301 to `/`.

## What the Worker does today

`src/index.mjs` answers from D1: `/en/` (the English front page), `/et/sundmused`
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
`migrations/0001_step1.sql`, `0002_editing.sql` and `0003_page_editing.sql`
and seeded with `data/seed-step1.sql` to `seed-step4.sql`. COUNTED on the
remote 2026-09-29: 10 events, 12 event texts, 19 credits, 9 pictures, 5 pages,
7 page texts, and 0 rows with anything in `updated_by`. Sessions 1, 2, 5 and 6
of `plans/plan-eccm-cms-step-1.md` are done, 3 and 4 are not, and the editing
the plan left out of step 1 is in.

The dev server for local work is `npx wrangler dev --env staging`; none is up.
`.wrangler/state` is the current one and holds the three migrations and the
four seeds; `.wrangler/state-editor`, `state-front`, `state-pages` and
`state-pages-edit` are leftovers of the agents of 2026-09-28 and can go. A
fresh state takes the three migrations and the four seeds in order.

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
- **Newsreader is the serif** on the derived page and the design system, with
  Literata and Roboto Serif as alternatives.
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
- **The editor is open on a public hostname.** Noindex everywhere, and an
  address nobody is given, but anyone who finds `/edit/events/1` can save over
  an event. That is what was asked for; the Access application is the way back.
- **The Estonian front page is still static** while the English one comes
  from D1. Making `/` the list from D1 means removing `public/index.html`
  (the Worker sees only paths no file answers) and giving the Estonian home
  the front page's heading; `renderEvents` with `home: true` already does the
  English one.
- **TUMA has no category key**, so Scrapyard and Sound Plasma print
  "Sari: Koostöö". A `tuma` key is a migration (the CHECK constraint) plus
  `CATEGORY` in `src/render/event.mjs` and `CATEGORIES` in
  `src/render/editor.mjs`.
- **The event template stores `website_url` and does not print it**, so the
  Koduleht link sits as the last body line on every seeded event that has
  one. A small change in `src/render/event.mjs`.
- **Two seeded rows want the editor's hand**: the Üle Heli festival carries
  eccm.ee's own 15:51 to 23:51; the second Gestures event's slug ends in
  "-liisa" at the 60-character cut.
- **The language is not remembered** between visits; the switch is per page.
- **The tagline's face and shape are still unsettled**, and the two pages that
  showed the study, `/tagline` and `/tagline-47`, were asked away 2026-09-29.
  They are in git at `2faec1e^` and the reasoning is in the `eccm-ui` skill,
  section 7. Then the outlines for whichever wins; a true 16 px mark; a
  maskable Android icon; the bios migration when that plan is read.
- **Konkursid** holds the intro and a link to the full call on eccm.ee.
- Sessions 3 and 4 of the CMS plan: the scheme on the media row, uploads.

## The machine

This laptop kills binaries it does not know (ThreatLocker): a binary runs
under `/opt/homebrew` and dies with exit 137 in `$HOME`. `wrangler` is pinned
to exactly 4.107.0 and `workerd` to 1.20260701.1 with an override, because
the workerd of wrangler 4.141 exits 137 and wrangler reports it as
`write EPIPE`; `compatibility_date` is 2026-07-08, the newest that runtime
supports. Every local D1 and dev command depends on this. Deploy with
`env -u CF_API_TOKEN -u CLOUDFLARE_API_TOKEN npx wrangler deploy --env staging`
and migrate the remote database before deploying code that needs a column.
Safari and Chrome measure a variable font's width axis differently unless it
is set with `font-variation-settings`; the two pages that carried both, the
tagline ones, went 2026-09-29, so the next page that sets a width axis has to
carry it again.

`sips` crops a shot for a look: `sips -c <h> <w> --cropOffset <y> <x> in.png
--out out.png`, and an offset of exactly `0 0` is ignored and crops the
centre, so use `1 0` for the top of a page.

## How to go on

`BACKLOG.md` has every ask of all three days verbatim with what was measured,
the open ones at the top. The first candidates: the Estonian front page from
D1, the `tuma` key, the website field on the event page. Then session 3 of the
CMS plan, `tools/scheme.mjs` reading the pictures through derive.html's own
functions and writing `media.scheme`. Agents report and do not commit; the
session commits by path, deploys and pushes, and a deploy ships the working
tree, so `git status` before every deploy.
