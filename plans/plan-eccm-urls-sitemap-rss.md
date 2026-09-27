# URLs without index.php, the redirects that keep every old link alive, the sitemap, the feeds

Written 2026-09-27, not executed. Asked, dictated: *"I want a good story on
sitemap, on RSS, and also a fallback story for existing links which need to
map to the new URLs, maybe simpler ones. I want to lose that PHP thing from a
URL, but how to keep old links working. Also SEO, redirection, consideration,
etc."*

**The marks.** MEASURED is a number taken today with the command beside it,
from the ten eccm.ee pages saved in the session's scratchpad on 2026-09-27
(two calendar pages, four past-events pages, the Gestures and Feldman events
in both languages). READ is a page or file read today, named. MEMORY is not
checked today. Fetched today from eccm.ee: `/robots.txt` and `/sitemap.xml`,
once each, nothing else. Fetched from Google's documentation: the site move
guide, the sitemap guide and the localized versions guide, once each.

## The verdict

Every URL on eccm.ee today runs through `/index.php/`, every event has at
least two paths (one from the front page, one from the archive, with a
different prefix per language), the Joomla ids differ between the Estonian
and the English version of one concert, and the aliases spell Estonian with
German digraphs (`rueuetelmaa`, `moeoedunud`). The new scheme is
`/et/sundmused/{slug}` and `/en/events/{slug}` for events, `/et/{slug}` and
`/en/{slug}` for pages, slugs in plain ASCII with `ü` as `u` and never a
number in front, stable for the event's whole life. Old links keep working
through **one regular expression for events**, keyed on the Joomla id and the
language, **one table for everything else**, filled by a crawl of the old
site the week before cutover, **one media rule** that turns an old picture
path into the new one, all answering `301`, one hop, kept for years, with a
hit count and a log of misses so the table is checked against reality rather
than against memory. The sitemap is one file from D1 with the language pairs
in it. The feeds are RSS 2.0 per language and an iCalendar feed per language,
the latter being the one a concert calendar actually earns. Four small
sessions on top of the CMS plan's six.

## 1. What eccm.ee's URLs look like today, MEASURED

Every `href` and `src` pointing at eccm.ee in the ten saved pages, 228
distinct URLs after dropping `/media/` (Joomla's own assets), grouped by
shape with a regular expression (`node -e` over the files; the script is in
the session transcript):

| shape | count seen | example |
| --- | --- | --- |
| event, Estonian, front-page form, with a date | 12 | `/index.php/et/122-sound-plasma-10/2026-11-12-19-00` |
| event, Estonian, front-page form, no date | 6 | `/index.php/et/111-koosloome-opituba` |
| event, Estonian, archive form, with a date | 28 | `/index.php/et/syndmusest/moeoedunud-suendmused/107-eesti-biofoonia/2026-09-08-19-00` |
| event, Estonian, archive form, no date | 4 | `/index.php/et/syndmusest/moeoedunud-suendmused/5-uele-heli-2024` |
| event, English, front-page form | 2 | `/index.php/en/135-gestures-situations-listening-without-a-score-marianna-liik-artjom-astrov-maryn-liis-rueuetelmaa/2026-09-30-19-00` |
| event, English, archive form | 5 | `/index.php/en/eventseng/past-events/108-eesti-biofoonia-eng/2026-09-08-19-00` |
| page, Estonian | 8 | `/index.php/et/eccm`, `/index.php/et/eccm/liikmed`, `/index.php/et/eccm/kontakt`, `/index.php/et/konkursid`, `/index.php/et/syndmusest`, `/index.php/et/ulysses`, `/index.php/et/ulysses/ulysses-uudised`, `/index.php/et/tallinn-1965` and two under it |
| page, English | 10 | `/index.php/en/eccm-new-eng`, `.../memeng`, `.../new-eng-contact`, `/index.php/en/eventseng`, `.../past-events`, `/index.php/en/open-calls`, `/index.php/en/ulysses-eng`, `.../ulysses-uudised-eng`, `/index.php/en/tallinn-1965-eng/residencies`, `.../tallinn-1965-news` |
| home | 2 | `/index.php/et/`, `/index.php/en/` |
| list with a query string | 14 on the front page, 34 on the archive | `?page=2`, `?filter_from=2026-09-27&filter_category=12`, `?filter_to=...`, `?iccaldate=2026-10-1`, `?format=feed&type=rss` |
| event with a query string | 10 per event page | `?iccaldate=2027-09-1` (the calendar module's month links), `?layout=vcal` (a vCalendar download of the event) |
| picture, generated thumbnail | 10 | `/images/icagenda/thumbs/themes/ic_small_w100h100q100_serge.jpg`, and `ic_medium_w300h300q100_*`, `ic_large_w900h600q100_*` |
| picture, original | 4 | `/images/Gestures_Situations%20small.jpg` and `/files/Morton_Feldman.jpg` (the two `og:image` values), `/images/eccm_tallinn_logod_72dpi_no_tln.jpg` |
| Joomla internals | 6 | `/index.php/et/component/users/reset?Itemid=106`, `.../remind?Itemid=112`, `/components/com_icagenda/...css`, `/modules/mod_iccalendar/...js` |
| carried over as is | 1 | `/nan/` |

What the shapes say:

- **The id is the key and the alias is decoration.** Joomla routes on the
  leading number; the alias after it is a slug typed from the title at the
  time the row was made. Every event page's `og:url` (READ, `ev134-et.html`)
  is the front-page form with the date, so that is what Joomla treats as the
  canonical form.
- **One concert, two ids.** The Estonian and English versions are separate
  iCagenda rows: 134 and 135, 109 and 110, 107 and 108, 119 and 120, 147 and
  148, 149 and 150 (MEASURED across the four past pages and the two event
  pairs). The English alias is the Estonian one with `-eng` or `-2` on the
  end, or a real translation. Except the Schönberg series, whose rows appear
  in **both** language trees under one id (`71-schoenbergi-sari-3` in the
  Estonian archive and in `/en/eventseng/past-events/`), so the redirect
  lookup has to be by language and id together, never by id alone, and the
  same id may legitimately map to two rows.
- **The archive form is a menu item, not a state.** The prefix
  `syndmusest/moeoedunud-suendmused` (Estonian) and `eventseng/past-events`
  (English) is the menu item the list was reached through; Joomla's SEF
  router builds the URL from the menu item, so an event is reachable under
  both prefixes at once. No id appears in both a saved upcoming list and a
  saved past list (MEASURED: 18 upcoming ids, 28 past ids, 0 in both), so
  "the URL changes when the event passes" is not observed directly; it
  follows from the shape and from the CMS plan's earlier reading (READ,
  `plan-eccm-cms.md` §9: *"Event URLs have two forms for one event, depending
  on which menu item the visitor came through"*). One fetch of an upcoming
  event under the archive prefix would settle it (section 8).
- **The date segment is optional and is the occurrence, not the event.**
  Twelve of the 18 upcoming links carry `/{yyyy-mm-dd-hh-mm}`, six do not
  (the Schönberg rows and the workshop with no fixed date). The same event
  answers with and without it.
- **The query strings are not pages.** `?page=N` paginates, `?filter_*`
  filters by category and date, `?iccaldate=` is the month picker,
  `?layout=vcal` downloads a vCalendar, `?format=feed&type=rss` is Joomla's
  RSS of the list. `robots.txt` (READ today, 865 bytes, stock Joomla plus
  four lines) disallows `?filter_from=` and `?iccaldate=` but not `?page=`,
  and carries no `Sitemap:` line. `/sitemap.xml` answers `301` with an empty
  body (fetched once; the target was not followed, since the brief allowed
  one fetch); there is no sitemap to inherit.
- **Estonian letters in aliases**, MEASURED from the aliases themselves:
  `ä` becomes `ae` (`paeeva`, `laeks`, `taenava`), `ö` becomes `oe`
  (`moeoedunud`, `schoenbergi`), `ü` becomes `ue` (`suendmused`,
  `nueuedismuusika`, `rueuetelmaa`, `suegisel`), `õ` becomes `o` (`opituba`).
  `š` and `ž` were not seen. This is Joomla's German transliteration table,
  and it makes `Rüütelmaa` read as `rueuetelmaa`.
- **How many URLs.** The Estonian list header says **26 üritus tulekul** and
  the archive header **72 toimunud üritust** (READ, `eccm-page2.html`,
  `eccm-past.html`), so 98 Estonian event rows, each reachable in at least
  two forms and often four (with and without the date, under both prefixes).
  The English tree has its own upcoming and past lists, sizes unknown; from
  the pairs above most concerts have a twin and the Schönberg dates are
  shared. Pages: 18 seen, both languages. A round estimate of **400 to 600
  distinct event URLs and about 30 page URLs** that could be linked from
  outside, plus the pictures. The crawl in section 3 replaces the estimate.

## 2. The new scheme

**Language prefix on everything: `/et/...` and `/en/...`, and `/` answers
`301` to `/et/`.** Both languages exist for real (the English body of
Gestures is longer than the Estonian), hreflang wants a distinct URL per
language, and a uniform prefix means one router, one sitemap builder and one
canonical rule. Estonian is `x-default`.

**Localised path words: `/et/sundmused/{slug}` and `/en/events/{slug}`.**
This changes the CMS step 1 plan's `/{lang}/events/{slug}` (READ,
`plan-eccm-cms-step-1.md` §3), and the reason is that a URL is part of the
page's text: an Estonian reader is handed `sundmused`, which is the word on
the menu and in the old path (`syndmusest`), while `events` under `/et/` is a
word from the code. The router cost is one line mapping two words to one
handler, and a wrong pairing (`/et/events/...`) is a 404. The archive lists
are `/et/sundmused/arhiiv` and `/en/events/archive`. Pages are `/et/{slug}`
and `/en/{slug}` as the CMS plan has them.

**Slug rules.**

- No leading id. The id lives in `event_text.legacy_id` and nowhere a
  visitor sees.
- Plain ASCII, lowercase, hyphens: `ä a`, `ö o`, `ü u`, `õ o`, `š s`, `ž z`,
  everything else outside `[a-z0-9]` a hyphen, runs collapsed, ends trimmed.
  So `Rüütelmaa` is `ruutelmaa` and `möödunud` is `moodunud`, which an
  Estonian reads at once, against Joomla's `rueuetelmaa`. UTF-8 slugs were
  considered and set aside: browsers show them, but a pasted link becomes
  `r%C3%BC%C3%BCtelmaa` in an email or a Facebook post, which is the worst of
  both.
- From the title, cut at 60 characters on a word boundary, so the Gestures
  slug is `gestuurid-situatsioonid-ilma-partituurita-kuulamine` and not the
  100 character alias with three surnames on the end.
- One slug per event per language, unique within the language, set when the
  row is made and **never changed by the passing of time**: no date in it,
  no archive prefix, so an event's URL is the same on the day it is
  announced and ten years later. If a title is edited, the slug stays unless
  an editor changes it on purpose, and then the old slug goes into the
  redirect table automatically.
- A series with twelve dates such as Schönbergi sari is twelve rows on
  eccm.ee today (ids 71, 73 to 80, 152, 153, MEASURED) and stays twelve rows.
  When a slug from the title is already taken, the date is appended in ISO
  form, `schoenbergi-sari-2026-11-19`, never a counter, because a date says
  which concert and a `-2` says nothing. The editor does this without asking.
- The Joomla alias is not the slug. The CMS step 1 plan kept the alias
  verbatim *"so a later redirect from a Joomla path is a lookup and not a
  guess"*; the lookup this plan makes is by language and id, which is what
  Joomla itself routes on, so the alias is free to become a readable slug.
  The alias is recorded anyway, in the redirect table's `from` column.

**Trailing slashes and case.** Canonical paths carry no trailing slash
except `/et/` and `/en/`; a request with one answers `301` to the path
without. Paths are lowercase in the database and a request with capitals
answers `301` to its lowercase form. Both are two lines in the router and
both keep the canonical set to one URL per page.

## 3. The redirects

Three layers, in the order the Worker tries them, all before the 404, all
`301`, none chaining into another:

**Layer 1, the table.** Exact old path to exact new path.

```sql
CREATE TABLE redirect (
  from_path   TEXT PRIMARY KEY,   -- '/index.php/en/eccm-new-eng/memeng', no host, query string kept only when it matters
  to_path     TEXT NOT NULL,      -- '/en/members', always a path that answers 200 itself
  status      INTEGER NOT NULL DEFAULT 301 CHECK (status IN (301, 410)),
  source      TEXT NOT NULL,      -- 'crawl', 'hand', 'slug-change', 'miss'
  hits        INTEGER NOT NULL DEFAULT 0,
  last_hit    TEXT,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
CREATE TABLE redirect_miss (
  path        TEXT PRIMARY KEY,   -- an /index.php/ or /images/ or /files/ path that matched nothing
  hits        INTEGER NOT NULL DEFAULT 1,
  first_seen  TEXT NOT NULL,
  last_seen   TEXT NOT NULL
);
```

Filled by **a crawl of the old site the week before cutover**, one script,
one request a second, cached on disk so it runs once: from both language
homes through every list page (`?page=N` on the front page and the archive,
both languages), every event page in both forms, every page path, and every
`href` and `src` those pages carry. Roughly 400 to 700 requests (section 1's
estimate; the CMS plan §9 priced its own reader at about 220). For each URL
found: an event path maps through layer 2 and is not stored, unless the crawl
finds a shape layer 2 does not match, which is written as a row; a page path
is mapped by hand to the new page (a dozen rows: `eccm` to `/et/eccm`,
`eccm-new-eng` to `/en/eccm`, `memeng` to the members page, `eventseng` to
`/en/events`, `konkursid` and `open-calls` to the open calls page,
`tallinn-1965` and its English twin to wherever that content goes); Joomla
internals (`/component/users/*`, `/administrator/*`) get `410`, since the
public login disappears on purpose (READ, CMS plan §9); anything else the
crawl finds that the site is not keeping gets a row with `410` too, so an
old link answers "gone" rather than "never existed". Every `to_path` is
checked by the script to answer `200` on staging before the table is loaded,
which is what makes "one hop" a measured fact.

**Layer 2, the event pattern.** One regular expression covers every event
shape in section 1:

```
^/index\.php/(et|en)/(?:syndmusest/moeoedunud-suendmused/|eventseng/past-events/)?(\d+)-[^/?]*(?:/\d{4}-\d\d-\d\d-\d\d-\d\d)?/?$
```

Language and id are looked up in `event_text (lang, legacy_id)`; a hit
answers `301` to `/et/sundmused/{slug}` or `/en/events/{slug}`; the query
string is dropped, except `?layout=vcal`, which answers `301` to the event's
`.ics` (section 6). A miss on the lookup falls to layer 1 (an event that was
mapped by hand), then to the miss log and a 404. The Schönberg case works
because the lookup carries the language.

**Layer 2 continued, the lists and the home.** `/index.php/et/` and
`/index.php/et/?page=N`, `?filter_from=...`, `?iccaldate=...` all answer
`301` to `/et/sundmused`; the archive path with any query string to
`/et/sundmused/arhiiv`; the English equivalents likewise; `?format=feed`
anywhere to that language's `/feed.xml`; bare `/index.php` and `/index.php/`
to `/et/`. Filters and month pickers are not preserved as URLs: the new lists
have their own, and Google was told not to index the old ones by
`robots.txt`.

**Layer 3, the pictures.** Old picture paths are out in the world in a way
event paths are not: every Facebook share of an event cached
`https://eccm.ee/images/Gestures_Situations%20small.jpg` as its picture, and
every newsletter carried a thumbnail URL. Two rules: an original under
`/images/...` or `/files/...` is looked up in `media.legacy_path` (a column
the import fills with the Joomla path of every picture it takes) and answers
`301` to the picture's new URL on the media host; a generated thumbnail
`/images/icagenda/thumbs/themes/ic_{size}_w{W}h{H}q{Q}_{name}.{ext}` is
matched by the `{name}` part against the same column's basename and answers
`301` to a rendition of about the same width. Nothing under `/images/` is
served from the new site itself; a miss is a 404 with `no-store`.

**The rules of the whole thing.**

- `301`, never `302`: Google's site move guide (READ today,
  developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
  says *"use HTTP permanent redirects if possible, such as 301 and 308"* and
  *"301 and other permanent redirects don't cause a loss in PageRank"*.
- One hop. The same guide allows up to 10 and advises *"ideally no more than
  3"*; this site does one, because every `to_path` is a page and never a
  redirect, and the check in the crawl script proves it.
- Kept for years. The guide: *"Keep the redirects for as long as possible,
  generally at least 1 year."* The pattern is twenty lines and costs nothing
  to keep forever; the table stays as long as its rows are hit, and the hit
  count says when a row could go, which is never for a row somebody's
  newsletter still links.
- Honest by counting. Every redirect served increments `hits` and stamps
  `last_hit` in `waitUntil`; every `/index.php/`, `/images/` or `/files/`
  request that matched nothing is upserted into `redirect_miss`. A page in
  the editor (or a script against D1 for as long as there is no editor)
  lists the misses by hits, and a miss that is a real old link becomes a
  `redirect` row with `source = 'miss'`. The table is checked against what
  the world asks for, not against what anyone remembers linking.
- The 404 is a page, not a line: the site's chrome, one sentence in the
  visitor's language, the upcoming list's first three rows, and `no-store`
  so a URL asked for before it exists is not cached as missing (READ, CMS
  plan §13, trip's rule).
- A slug changed in the editor writes the old path into `redirect` with
  `source = 'slug-change'` in the same transaction, so the site never breaks
  its own links either.

## 4. SEO at cutover

- **Canonical per language.** Every page carries
  `<link rel="canonical" href="https://eccm.ee/et/sundmused/{slug}">` with
  its own URL, absolute, from the configured origin and never from
  `request.url` (trip's note that it *"lies about protocol on workerd"*, READ
  in `sitemap.xml.ts`).
- **hreflang, both directions, plus x-default.** Google's localized versions
  guide (READ today): *"Each language version must list itself as well as
  all other language versions"* and *"If two pages don't both point to each
  other, the tags will be ignored"*; URLs *"must be fully-qualified"*; codes
  are ISO 639-1. So each event page emits three `link rel="alternate"` lines,
  `et`, `en` and `x-default` pointing at the Estonian, and a page whose twin
  is missing emits only itself and `x-default`, never a link to a fallback
  page, because the fallback renders Estonian text under an English URL and
  would be a duplicate. The same pairs go in the sitemap (section 5), which
  is the second of Google's three accepted methods.
- **noindex on the staging host, lifted only on eccm.ee.** Today
  `public/_headers` sends `X-Robots-Tag: noindex` on every response (READ,
  eccm `CLAUDE.md`). At cutover the header goes, `robots.txt` allows
  everything except the editor and carries the `Sitemap:` line, and the
  staging hostname keeps its `noindex` and starts answering `301` to the same
  path on `eccm.ee` for a year (READ, `plan-eccm-setup.md` §2). Google's
  guide says exactly this for a launch: remove the `noindex` and robots
  blocks added during development.
- **Search Console.** The Change of Address tool does not apply: *"You only
  need this tool when moving from one domain or subdomain to another"*
  (READ). For a same-domain rebuild what applies is: verify the `eccm.ee`
  property (whoever holds it at ECCM today, section 8), submit the new
  sitemap, and read the Pages report for *"Page with redirect"* growing and
  *"Not found"* staying small; Joomla published no sitemap, so there is no
  old one to remove.
- **Ranking passes through 301s** (READ, quoted above), and what loses it is
  a chain, a 404 or a 302, which the three layers and the crawl check are
  built to prevent.
- **Links out in the world.** ECCM's Facebook posts and newsletters carry
  the old event URLs and, through Facebook's own cache, the old `og:image`
  URLs. The event pattern covers the first; the picture rule covers the
  second when Facebook re-scrapes a shared link, which it does when the post
  is shared again or when the Sharing Debugger is asked. Nothing has to be
  edited on Facebook. The Fienta ticket links and the Jotform forms were
  never on eccm.ee's domain and are untouched (READ, CMS plan §9).
- **The order on cutover day**, folded into the setup plan's §8 checklist:
  (1) editing on Joomla stops; (2) the crawl runs and the tables are filled;
  (3) the content import runs; (4) the redirect check runs on staging, every
  `from_path` answering `301` to a `200`, the count printed; (5) DNS for
  `eccm.ee` moves to the Worker on ECCM's account; (6) `noindex` off,
  `robots.txt` with the `Sitemap:` line, the feeds advertised in the head;
  (7) the sitemap submitted in Search Console; (8) the Joomla site stays
  reachable on an internal hostname for thirty days for comparison, and its
  `robots.txt` there says `Disallow: /`; (9) `redirect_miss` is read every
  day for two weeks and every week for three months.

## 5. The sitemap

- **One file, `/sitemap.xml`, built from D1 on request**, no index and no
  chunks: every published event in both languages and every published page,
  about 98 events plus their English twins plus 20 pages, some 250 URLs
  today and a few hundred in years, against the limit of *"50MB
  (uncompressed) or 50,000 URLs"* per file (READ today, Google's sitemap
  guide). trip chunks at 40,000 because it has 54,000 threads (READ,
  `astro-prod/src/lib/sitemap.js`); the chunk loop and the index route are
  the part not taken, `xmlEsc` and the `entry` builder are.
- **Each `url` carries its language pairs**, `xhtml:link rel="alternate"
  hreflang="et"`, `"en"` and `"x-default"` with absolute URLs, the third of
  Google's methods and the one that needs no change to the pages when a twin
  is added later. A page with no twin lists only itself and `x-default`.
- **`lastmod` from `updated_at`**, in full ISO with the offset, and nothing
  else: Google *"ignores priority and changefreq"* and uses `lastmod` only
  *"when it's consistently and verifiably accurate"* (READ), which
  `updated_at` is if it changes only when the text, the picture or a fact
  changes and not on a re-save with nothing edited. The editor rule that
  follows: `updated_at` moves only when a compared field differs.
- **Past events stay in.** They are the archive, they carry the inbound
  links, and Google should find the redirect targets listed rather than only
  redirected to. The CMS plan §13 says the same (READ).
- **No image extension for now.** The pictures are in the pages with alt
  text, which is what image search reads; the extension is a later line if
  ECCM cares about image results.
- **Cached a day at the edge** with `Cache-Control: public, s-maxage=86400,
  stale-while-revalidate=86400` and the tag `sitemap`, purged on publish
  through the same purge the lists use, so a new event is in the sitemap
  within the purge's eventual consistency (10 to 30 s, READ, CMS plan §13).
  The host comes from the configured origin, never from the request.
- **Advertised only on eccm.ee**: the `Sitemap:` line in `robots.txt` and the
  Search Console submission happen at cutover; on the staging hostname the
  route exists, answers, and is named nowhere, which is trip's dual-run
  posture (READ, `sitemap.xml.ts`'s header comment: *"ships now, advertised
  NEVER while dual-run holds"*).

## 6. RSS, and the calendar feed beside it

- **RSS 2.0, one feed per language, `/et/feed.xml` and `/en/feed.xml`**,
  hand-rolled in about forty lines the way trip's `lib/rss.ts` does it (READ:
  `rssDoc()` with `xmlEsc` everywhere, `guid` equal to the link,
  `lastBuildDate` from the newest item so the cached document is
  deterministic, `content-type: application/rss+xml`). RSS 2.0 over Atom
  because it is what Joomla served at `?format=feed&type=rss` (so an existing
  subscriber's reader keeps understanding the document behind the redirect),
  what every reader parses, and Atom's advantages (typed `updated`, a real
  `id`) buy nothing for twenty items.
- **An item is an event when it is published**, newest first by
  `created_at`, twenty items: title, link (the event page), description (the
  first paragraph of the body as text, with the date, the venue and the
  ticket link as one line in front of it), `pubDate` from `created_at`, and
  the picture as `<enclosure url="..." type="image/jpeg" length="...">`.
  The `length` attribute is required by RSS 2.0, so `media` gains a `bytes`
  column filled at import and upload; trip's plan deferred hero enclosures
  and notes *"jpeg only"* because feed readers share email's refusal of AVIF
  (READ, `plans/rss.md`). The Estonian feed carries the Estonian text row
  and the English feed the English one, an event with no English row
  appearing only in the Estonian feed.
- **Advertised in the head** of the list pages and the home with
  `<link rel="alternate" type="application/rss+xml" href="/et/feed.xml">`
  in the page's language, at cutover and not before, trip's rule again.
  `?format=feed&type=rss` on any old path answers `301` to the language's
  feed (section 3).
- **The iCalendar feed is the sibling that matters more.** A concert
  calendar is a thing people subscribe to in Calendar, Outlook and Google
  Calendar; eccm.ee already offers a per-event `?layout=vcal` download, which
  says the demand exists. So: `/et/sundmused.ics` and `/en/events.ics`, one
  `VEVENT` per upcoming published event (and the last ninety days, so a
  subscriber's calendar does not lose what just happened), `UID` as
  `event-{id}@eccm.ee`, `DTSTART` and `DTEND` with `TZID=Europe/Tallinn`,
  `SUMMARY` the title, `LOCATION` the venue, `DESCRIPTION` the first
  paragraph and the ticket link, `URL` the event page, `LAST-MODIFIED` from
  `updated_at`; and a per-event `/et/sundmused/{slug}.ics` replacing
  `?layout=vcal`, which the event page links as "Lisa kalendrisse", the
  button `event.html` already draws. RFC 5545 is MEMORY; forty lines, no
  library. `webcal:` is the same URL with the scheme swapped and is what the
  subscribe link uses.
- Both feeds are cached under the lists' tags so a publish refreshes them
  for free, which is what trip decided for its two feeds (READ, `rss.md`).

## 7. The sessions this adds

After the CMS step 1 plan's six, in its way of working: one thing per
session, one check per thing, nothing re-run.

| session | delivers | verified by |
| --- | --- | --- |
| 7 | the `redirect` and `redirect_miss` tables, the event pattern, the list and home rules, the picture rule, the 404 page, the slug-change hook noted for the editor | one `curl -sI` per shape in section 1's table, twelve shapes, each reading `301` and a `location` that then reads `200`; one curl of a Joomla internal reading `410`; one of a nonsense path reading `404` with `no-store` |
| 8 | `/sitemap.xml`, the canonical and hreflang lines in the head, `robots.txt` with `Disallow: /edit` and the `Sitemap:` line behind the production flag | the sitemap fetched and parsed by a ten line script that counts `url` elements against `SELECT count(*)` and checks every pair points both ways; one event page's three alternate lines read back with curl |
| 9 | `/et/feed.xml`, `/en/feed.xml`, `/et/sundmused.ics`, `/en/events.ics`, the per-event `.ics`, the head links behind the flag | each feed parsed by the same kind of script (well-formed XML, twenty items, an enclosure with a length that matches the file); one `.ics` imported into Calendar on the desk once and its title, time and place read |
| 10 | `scripts/crawl-old-site.mjs` and the table fill, run against eccm.ee the week before cutover and not before | the script's own last line: N old paths, N answering `301` to a `200` on staging, 0 chains, 0 misses |

Sessions 7 to 9 happen on the staging hostname, unadvertised; session 10 is
the last thing before the setup plan's §8 checklist.

## 8. What could not be settled from this disk

| question | why not | what settles it |
| --- | --- | --- |
| the full URL inventory | ten pages were saved, not the site; the English lists were not fetched | the crawl of session 10, which is also the redirect table's source |
| whether an upcoming event answers under the archive prefix | no id sits in both saved lists | one fetch of `/index.php/et/syndmusest/moeoedunud-suendmused/122-sound-plasma-10` on the day the crawl runs |
| how many English event rows there are | the English lists were not saved | the same crawl |
| how Joomla spells `š` and `ž` in an alias | no alias with either was seen | the crawl, or a look at any event carrying one |
| what `?layout=vcal` returns | not fetched; only the link was seen | one fetch, to make the per-event `.ics` a superset of it |
| whether a D1 point read per redirect needs a cache in front of it | not measured | one `wrangler dev` run with timing on a redirect, against Workers Free's 10 ms of CPU, which a point read should not touch since it waits rather than computes |
| who holds the `eccm.ee` Search Console property | not on this disk | ECCM, at the handover |
| where `tallinn-1965`, `ulysses` and `konkursid` land in the new site | content decisions not made in any plan yet | the CMS plan's page tree, before the table is written by hand |
| whether Facebook re-scrapes old shares on its own | MEMORY that it does not until asked | one Sharing Debugger fetch after cutover on the most shared old URL |

## Sources

Read 2026-09-27: the ten saved eccm.ee pages named at the top; eccm.ee's
`/robots.txt` and `/sitemap.xml`, once each; Google's site move with URL
changes guide, sitemap guide and localized versions guide; in this
repository `CLAUDE.md`, `plans/plan-eccm-cms-step-1.md` §3 and §7,
`plans/plan-eccm-cms.md` §9 and §13, `plans/plan-eccm-setup.md` §2; in trip
`astro-prod/src/pages/sitemap.xml.ts`, `sitemap/[chunk].xml.ts`,
`src/lib/sitemap.js`, `src/lib/rss.ts`, `plans/rss.md`, and
`src/middleware.ts` line 33 to 36 (trip's one 301, built as `new Response`
because `Response.redirect()` has immutable headers).
