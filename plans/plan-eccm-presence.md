# ECCM's presence on the web today, and what it should be

Written 2026-09-28, not executed. Asked, verbatim: *"in bg analyze and write
plan of eccm social media presence and web presence in general - in fienta
pages etc"*. And while it was being written: *"omg how much better
https://www.instagram.com/eccm.ee/ is that web"*.

**The marks.** READ is a page fetched once on 2026-09-28 (between 00:14 and
00:20 EEST) with the URL beside it, or a page saved on this disk from an
earlier session with its date. MEASURED is a number computed with a command
over a saved page or a search result. INFERRED is concluded from two READ
things and stated by neither. UNSETTLED is what a fetch could not answer and
says what would.

**How it was done.** 26 fetches, one per page, none retried, none re-fetched,
no stream and no media file opened, all saved in the session scratchpad under
`presence/`. Four of the 26 went to eccm.ee (the English front page, the about
page, `/nan/`, and a HEAD of the root); the front page, event 134, the contact
page, the past-events pages and the RSS feed were read from copies saved on
2026-09-26 and 2026-09-27 and not fetched again. 24 web searches, which touch
a search engine and nobody's server. Facebook and Instagram were fetched once
each and both answer a login wall: only what their public `<head>` carries is
recorded, and nothing was guessed about what sits behind the wall.

## The verdict

ECCM's presence is a Joomla site that says *Avaleht* and *Home* in its title
tags, a Facebook page with 316 followers and an Instagram account with 213
followers and 22 posts, neither of which the site links from its front page,
a Fienta organiser page filed under a staff member's name that lists no
events, no newsletter, no Wikipedia article in either language, and a name
spelled four ways across the web. Third parties carry the organisation better
than it carries itself: the company registry mirror ranks first for its own
name, EMIC lists the address, phone and email the site does not, and the
Estonian Music Days venue page is the first result for *ECCM Tallinn*. The
plan is not to open anything new. It is to make the site the one canonical
source with the organisation's name on every page and in its structured
data, to fix the ticketing organiser identity, to keep exactly Instagram and
Facebook and feed both from the site, to start the newsletter the CMS plan
already prices, to claim four listings that cost an hour each, and to take
from Instagram the thing that makes it better, which is one full-frame
picture per event and a rhythm, without taking its lack of dates, languages,
tickets and search. About 28 hours of our work and 6 of ECCM's, most of it
after cutover, and then 3 to 4 hours a month of ECCM's to keep the rhythm.

## 1. eccm.ee itself

**The root and the tree. READ.** `https://eccm.ee/` answers `301` to
`/index.php/et/` (HEAD, 2026-09-28), served by LiteSpeed with HSTS preload
and `cache-control: no-store`. The Estonian front page (saved 2026-09-26,
68,390 bytes) and the English one (READ today, 49,456 bytes) carry three
`hreflang` links (`et-EE`, `en-GB`, `x-default` pointing at Estonian) and
nothing else that names the organisation to a machine.

**Title tags. READ.**

| page | `<title>` |
| --- | --- |
| `/index.php/et/` | `Avaleht` |
| `/index.php/en/` | `Home` |
| `/index.php/et/eccm` | `ECCM - Eesti Nüüdismuusika Keskus` |
| `/index.php/et/eccm/kontakt` | `Kontakt` |
| `/index.php/et/syndmusest/moeoedunud-suendmused` | `Möödunud sündmused` |
| event 134 | the event title in capitals with its trailing colon, no site name |

Only one page of six says who this is, which is INFERRED to be most of why the
site ranks below the registry mirror for its own name (section 1, ranking).

**Head markup. MEASURED** with `grep -o -i <pattern> | wc -l` over the saved
front page and the pages fetched today:

| in the page | ET front | EN front | about | kontakt | event 134 |
| --- | --- | --- | --- | --- | --- |
| `ld+json` | 0 | 0 | 0 | 1 | 0 |
| `og:` | 0 | 0 | 0 | 0 | 8 |
| `twitter:` | 0 | 0 | 0 | 0 | 0 |
| `rel="canonical"` | 0 | 0 | 0 | 0 | 0 |
| `meta description` | 0 | 0 | 0 | 0 | 0 |
| `hreflang` | 3 | 3 | 3 | 3 | 0 |

The one JSON-LD block is Joomla's `com_contact` output on the contact page
(READ, saved copy of 2026-09-28): an `Organization` and a `WebSite` named
*"Eesti nüüdismuusika keskus"* with the URL, and then a `Person` entity, also
named *"Eesti nüüdismuusika keskus"*, whose `address` holds the postal address
(Herne 11A, 10135 Tallinn), whose `telephone` holds a mobile number, and whose
`faxNumber` field holds the contact person's name and role as free text. An
organisation typed as a Person with a name in the fax field is what a search
engine reads about ECCM today. The front page also carries
`<meta name="rights" content="ECCM, Kuuratsanikud">`, a rights line naming a
second party that appears nowhere else on the site (INFERRED: a leftover from
whoever set the template up).

**Event 134's Open Graph. READ**, already tabled in
`plans/plan-eccm-event-markup.md` section 1: eight lines, `og:type website`,
the 2000 by 1333 original as image, `og:site_name` *"Eesti nüüdismuusika
keskus"* in lowercase, the description as the body's first characters in
capitals.

**What it links out to. MEASURED** over every saved and fetched eccm.ee page
(front, three list pages, event 134, about, kontakt, EN front), every
`https?://` not on eccm.ee, counted:

| target | count | where |
| --- | --- | --- |
| `fienta.com/et/gestuurid-...` | 8 | event 134, the ticket button repeated per layout |
| `icagenda.com`, `joomlic.com` | 20 | the calendar component's credit |
| `snaider.ee/2` | 4 | event 134's dramaturg |
| `facebook.com/eestinyydismuusikakeskus` | 1 | the about page only |
| `instagram.com` | 0 | nowhere |
| `youtube.com`, `soundcloud.com`, `bandcamp.com` | 0 | nowhere |
| `google.com/calendar`, `outlook.live.com` | 4 | iCagenda's add-to-calendar |

So the Facebook page is reachable from one page of the site and the Instagram
account from none.

**robots.txt and sitemap. READ 2026-09-27** in `plans/plan-eccm-urls-sitemap-rss.md`:
stock Joomla, 865 bytes, no `Sitemap:` line; `/sitemap.xml` answers a `301` to
the front page. Not fetched again.

**RSS. READ**, saved 2026-09-26 (`eccm.rss`, 30,055 bytes): Joomla's
`?format=feed&type=rss` of the front page, channel title *"Avaleht"*, empty
description, ten items, each item's description a date, a 300 px thumbnail
and the body. It is advertised nowhere on the page and one item links to
Fienta (`fienta.com/et/schoenbergi-sari-W-EEnsemble`).

**The name, four ways. READ** across the pages fetched:

| spelling | where |
| --- | --- |
| Eesti nüüdismuusika keskus (lowercase) | `og:site_name`, JSON-LD, the ET front page's `<h1>` area |
| Eesti Nüüdismuusika Keskus | the about page body, tallinn.ee, EMIC, the registry |
| Estonian Centre **of** Contemporary Music | eccm.ee EN about title, the Facebook page's category, ulysses-platform.eu |
| Estonian Centre **for** Contemporary Music | tallinn.ee EN, eestimuusikapaevad.ee, helilooja.ee |
| Estonian Cent**er** of Contemporary Music | `/nan/` |

Two prepositions and two spellings of centre. A search engine merges these
badly, and every partner who copies one has a one in four chance of matching
the site.

**Ranking. MEASURED in this tool's search engine, which is not Google**, on
2026-09-28, position of the first eccm.ee result among ten:

| query | first eccm.ee result | position | who is above it |
| --- | --- | --- | --- |
| `"Eesti Nüüdismuusika Keskus"` | `/index.php/et/eccm` | 8 | inforegister.ee, tallinn.ee, eestimuusikapaevad.ee, a Facebook post by Üle Heli, emic.ee, teatmik.ee, en.wikipedia (a different centre) |
| `"ECCM Tallinn" contemporary music` | `/index.php/en/eccm-new-eng` | 10 | eestimuusikapaevad.ee (twice), emic.ee (three times), en.wikipedia (Composers' Union), artesliberales.lv |

UNSETTLED: Google's own ranking from a browser in Estonia. What is MEASURED
is that in one engine the two registry mirrors and three directories outrank
the site for its own name, and the title tags above are the plainest reason.

**`/nan/`. READ today**, 546,853 bytes, a single page whose title reads NAN, Nordic
Analog Network: a Nordic-Baltic network for experimental electronic music,
2024 to 2026, funded by the Nordic-Baltic Mobility Programme for Culture,
with ECCM as *"Network coordinator and lead applicant"*, core partners in
Stockholm, Helsinki, Riga and Malmö, network partners hcmf, Ultima and the
Ulysses Platform, and the lines *"ECCM's membership in the IRCAM-coordinated
Ulysses Platform since 2025"* and a three-year partnership with hcmf in
Huddersfield for 2025 to 2027. It is the best-written page on the domain and the only one that
publishes a general address, `info@eccm.ee`. ⚠️ Its name collides: a web
search for *"Nordic Analog Network"* returns a Nordic darkroom photography
network of the same name (nordicanalognetwork.com, its own Instagram) in
every result, and ECCM's NAN in none.

## 2. Ticketing

**Fienta is where ECCM's own tickets are. READ.** Event 134's Fienta page
(`fienta.com/et/gestuurid-situatsioonid-...`, 124,279 bytes) carries a JSON-LD
`Event` with `startDate` `2026-09-30T19:00:00+03:00`, `endDate` an hour later,
`eventStatus` scheduled, `inLanguage` et, `isAccessibleForFree` false, and the
description naming Eesti Nüüdismuusika Keskus; `og:type` `events.event`, a
1200 px `og:image`; one ticket type, *Tavapilet 15.00 €*; and the organiser's
website link as `http://eccm.ee`, without the `s`. The RSS feed's Schönberg
series item links to Fienta too, and a search finds *"Tallinn 1965 - Tulevik
läks meist mööda"* on Fienta. So the price the event markup plan could not
fill from eccm.ee is on Fienta's page in machine-readable form.

**The organiser page. READ** `https://fienta.com/et/o/16904` (14,355 bytes):
`<title>` is a staff member's name followed by *"üritused | Fienta"*, the
`og:title` is that name, and under it the page prints *"Eesti nüüdismuusika
keskus"*, `info@eccm.ee`, and *"Pühavaimu 9, 10123 Tallinn, Harju maakond,
Tallinn, 10129, HArju, Eesti"*, an address typed twice with two postcodes and
a capitalisation slip. MEASURED: 0 event links in the page. Whether that is a
setting (the organiser's public page turned off) or the list being rendered
after load is UNSETTLED. The name is not copied here.

**Piletilevi and Piletikeskus carry ECCM as a venue, not as an organiser.
READ** `piletikeskus.ee/et/e/2pthk1`: *"Ulgu-Eesti muusika kontsert" Eesti
Nüüdismuusika Keskuses / EMP 2026*, organiser Eesti Muusika Päevad in its
JSON-LD. A search finds the same festival's *Vestlusring* on Piletilevi with
ECCM in the title. INFERRED: the Estonian Music Days rents the hall and sells
on the big platforms; ECCM's own series sell on Fienta. There is no ECCM
organiser page on either big platform to claim.

**Does eccm.ee link to the organiser page?** MEASURED: no. Eight links to one
event's ticket page, none to `/o/16904`, and none from the footer.

## 3. Social

**ECCM's own accounts. READ** from each page's public `<head>` only, since
both answer a login wall to an anonymous fetch:

| platform | handle | followers | other counts | linked from eccm.ee |
| --- | --- | --- | --- | --- |
| Facebook | `eestinyydismuusikakeskus`, page name *ECCM*, category *Estonian Centre of Contemporary Music* | 316 | 18 talking about it, 26 check-ins | the about page, once |
| Instagram | `eccm.ee`, display name *ECCM* | 213 | 252 following, 22 posts | nowhere |
| YouTube | `@ECCMjournal`, channel *ECCM journal* | not in the page | no description, no counts in the served HTML | nowhere |

The Facebook `og:type` is `video.other` and the Instagram page carries
`robots noarchive, noimageindex`, so neither is a place a search engine will
index a picture from. Last post dates are not visible without login and are
not claimed. UNSETTLED: whether *ECCM journal* on YouTube is ECCM's at all;
the served page has no description and the handle could as easily belong to
a journal of another ECCM. One look while logged in settles it.

**Not found. INFERRED absent** from a domain-restricted search over
youtube.com, soundcloud.com, bandcamp.com, mixcloud.com and vimeo.com, which
returned only the YouTube rows above: no SoundCloud, no Bandcamp, no
Mixcloud, no Vimeo, no Spotify presence under ECCM's name. Absence in a search
is not proof, and the one question in section 10 covers it.

**The ensembles and series around it, and whether they point back. READ**,
one fetch of each front page, links counted with a regular expression:

| who | site | Facebook | Instagram | YouTube | links to eccm.ee |
| --- | --- | --- | --- | --- | --- |
| TUMA / Ensemble for New Music Tallinn | enmtallinn.com (Webflow) | `enmtallinn` | `enmtallinn` | `@ENMTallinn`, plus Vimeo | yes, 2 event pages |
| Ensemble U: | uuu.ee (Joomla) | `ansambelU` | `ensemble_u` | `@ensembleu6195` | 0 in the page |
| Sound Plasma | sound-plasma.com (WordPress) | `sound.plasma.festival` (search) | `sound_plasma` (search) | none found | 0 in the page |
| Improtest | improtest.ee (Squarespace) | `Improtest-104696222897716` | none found | none found | 0 in the page |
| Üle Heli | ule-heli.ee | `uleheli` | not checked | not checked | a post naming ECCM as partner (search) |
| Ludensemble | none found | said to exist (search snippet) | said to exist | not checked | not fetched |
| NAN | eccm.ee/nan | none | none | none | is eccm.ee |
| Ulysses Platform | ulysses-platform.eu | `UlyssesNetwork` | `ulyssesplatform` | not checked | names ECCM on its front page, no link |

So of the seven member and partner sites read, one links to eccm.ee. The
Ulysses Platform's front page (READ) lists *"the Estonian Centre of
Contemporary Music (Estonia)"* among fourteen partners as plain text.

## 4. Listings and directories

| directory | state | mark |
| --- | --- | --- |
| emic.ee, *Ühingud ja liidud* | listed: Pühavaimu 9, a phone, an email behind Cloudflare's obfuscation, `https://eccm.ee`, the tegevjuht's name | READ |
| emic.ee, *Muusikasündmuste kalender* | ECCM events appear (entry id 30320 in search) | READ (search) |
| eestimuusikapaevad.ee venue page | *Estonian Centre for Contemporary Music (ECCM)*, links to `eccm.ee/index.php/en/` | READ |
| tallinn.ee, City of Music news | *Eesti Nüüdismuusika Keskuse asub nüüd Mustpeade majas*, 17.11.2022, in ET and EN; links to the City's own Facebook and Instagram, not to ECCM's | READ |
| muusikalinntallinn.ee front page | no mention of ECCM, no link | READ |
| tallinn.ee/et/kultuur/unesco-muusikalinn-tallinn | answered *"Ligipääs puudub"* on 2026-09-27 | READ |
| emc.ee (Eesti Muusikanõukogu), *Organisatsioon* | ECCM not among the members | READ |
| inforegister.ee, teatmik.ee | registry mirrors: `EESTI NÜÜDISMUUSIKA KESKUS MTÜ`, code 80603988, registered 22.11.2021, Herne tn 11a, no VAT number; inforegister counts 546 profile visits and sells *"Koduleht 1€ eest"* on the same page | READ |
| et.wikipedia | 0 hits for *"Nüüdismuusika Keskus"*; an *ImproTest* article exists (831 bytes, 2019) and a *Mart Soo* one | MEASURED, API |
| en.wikipedia | 0 hits for *"Estonian Centre for Contemporary Music"*; the *Estonian Centre for Contemporary Art* article is what a search finds instead | MEASURED, API |
| Google Business Profile / Maps | not fetchable without a browser session; a search shows no Maps card | UNSETTLED |
| kultuur.info | the domain now serves a blog titled *Eesti Kultuurimaastik: Teatrid, Muuseumid ja Kontserdisaalid*; the old `/syndmus/` calendar URLs survive only as dead links on uuu.ee | READ |
| allevents.in | scrapes Facebook events; an Improtest at Pühavaimu 9 from 2025 | READ (search) |
| ERR | Klassikaraadio's *Delta* covers Sound Plasma; a December 2025 item quotes the director on festivals and *"a web environment where listeners can navigate through recordings"* | READ (search snippet) |
| Sirp | reviews (*Heliplasma Tallinnas*, *Kas John Cage on surnud?*) | READ (search) |
| artesliberales.lv | a project page *ECCM - Estonian Centre of Contemporary Music* | READ (search) |

INFERRED from the table: the directories that matter for a concert-goer,
EMIC and the Estonian Music Days, already carry ECCM. What is missing is the
two that a stranger reaches first, Google Maps and Wikipedia, and the City of
Music site that ECCM calls itself a partner of.

## 5. Newsletter

**None. MEASURED** on eccm.ee (eleven pages in the CMS plan's scan, four
today: no form, no *uudiskiri*, no Mailchimp or Brevo script), none on the
Fienta organiser page (READ), none found by a search for *uudiskiri OR
newsletter OR mailchimp* with the organisation's name, and the Instagram bio
is behind the wall. The Ulysses Platform runs one of its own (READ, its
footer). INFERRED: ECCM has no list, or has one that lives in a mailbox. The
CMS plan's section 12 already asks; section 10 here folds it into the one
question.

## 6. What Instagram does better, and what the site takes from it

The owner's words are the finding: *"omg how much better
https://www.instagram.com/eccm.ee/ is that web"*. The posts were not seen
(login wall), so what follows weighs the format and the counts, not the
pictures. INFERRED throughout, marked once here.

What the account has that the site does not:

| Instagram | eccm.ee today |
| --- | --- |
| one full-frame picture per event, the grid is the archive | a 100 px thumbnail floated left of a paragraph in capitals |
| a name and a mark at the top of every view | `Avaleht` |
| a fixed rhythm, 22 posts, each dated by the platform | 98 events with no visible publish date |
| a caption of a few lines | the same text in capitals, uncut |
| 213 people who chose to follow | no way to follow at all |

What the site takes over, and most of it is already drawn:

- **The picture first, at full width**, which is `derive.html`'s event page
  and the derived scheme behind it. The list gets a picture-grid variant
  beside the text list, so the front page can read the way the grid does.
- **One asset, three uses.** The card the social images plan renders after
  a save is the Open Graph image, the Instagram picture (a 4:5 crop of the
  same scheme) and the Facebook picture (1.91:1). The post is made from the
  site, not the site from the post.
- **The caption is the summary line.** The one-sentence rule this
  repository already has for descriptions is exactly an Instagram caption's
  first line. The event's `summary` is written once and travels to the card,
  the `og:description`, the feed item and the post.
- **Dated entries and a rhythm** the site can show: *published* on every
  event, the newest first on the list, the feed advertised in the head.

What the site must do that Instagram cannot, and why it stays canonical:
both languages, the ticket link inline, dates as data (`time datetime`,
JSON-LD, the iCalendar feed), search, an archive by year, links that a
search engine indexes (Instagram says `noimageindex`), and being owned.

## 7. The plan, in priority order

Hours are ours unless marked ECCM. Everything that touches eccm.ee's DNS or
production waits for cutover; everything else can start now.

| # | item | hours | ECCM hours | depends on |
| --- | --- | --- | --- | --- |
| 1 | the canonical site: names on every page | 4 | 0 | CMS step 1 sessions 3 to 5 |
| 2 | cutover, Search Console, sitemap submitted | 3 | 1 | the URL plan's four sessions, the DNS owner |
| 3 | the Fienta organiser identity | 1 | 1 | the Fienta login |
| 4 | Instagram and Facebook kept, linked, fed from the site | 3 | 1 | the social images plan's card route |
| 5 | the newsletter: field, double opt-in, first issue | 4 | 0 | Workers Paid, the email domain, the CMS plan's session 5 |
| 6 | Google Business Profile | 1 | 1 | a verification code that arrives at Pühavaimu 9 or by phone |
| 7 | Wikipedia, ET first, then EN | 4 | 0 | sources only, no ECCM edit |
| 8 | partner links: City of Music, Ulysses, three member sites | 1 | 1 | one email each from ECCM |
| 9 | structured data and Open Graph deltas | 2 | 0 | the event markup plan, item 1 |
| 10 | NAN's name and page | 2 | 0 | nothing |
| 11 | a press and partner line on the contact page | 1 | 0 | item 1 |
| 12 | measurement in place | 2 | 0 | cutover |
| | **total** | **28** | **6** | |

Plus the rhythm in section 8, which is ECCM's time and continuing, 3 to 4
hours a month by section 8's arithmetic.

**1. The canonical site: names on every page. 4 h.** The `<title>` pattern
is *event title, date, ECCM* on events, *page name, ECCM* on pages, and
*Eesti Nüüdismuusika Keskus* alone on the front page, per language; a
`meta description` per page from the summary; the organisation's name spelled
one way in each language and written down in the skill. The decision to take:
**Estonian Centre for Contemporary Music**, because the City, the Estonian
Music Days and the Composers' Union already use it and they outrank the site.
`og:site_name` and JSON-LD `Organization.name` carry the capitalised Estonian
name, not the lowercase one. The `rights` meta goes. The contact page's
`Person` block is replaced by the `Organization` of item 9.

**2. Cutover, Search Console, sitemap. 3 h, 1 h ECCM.** The URL plan has the
redirects, the `noindex` flip and the sitemap. What is added here: a Search
Console property per language, verified by DNS (ECCM's hour, since the DNS
owner is unknown, CMS plan section 12), the sitemap submitted, the old Joomla
property kept alive until the coverage report shows the redirects crawled,
and a note in `HANDOFF.md` of the date so the before and after of section 9
can be read.

**3. The Fienta organiser identity. 1 h, 1 h ECCM.** ECCM renames the
organiser to *Eesti Nüüdismuusika Keskus*, sets the mark as its picture, the
website to `https://eccm.ee` with the `s`, the address once with one
postcode, a two-line description, and turns the public organiser page on if
that is what the empty list means. We link `/o/16904` from the site's tickets
line and footer, and read each event's price from Fienta's own JSON-LD into
`offers.price` when an event row carries a Fienta URL (item 9). If ECCM
prefers not to share the Fienta login, the rename is their hour and nothing
here needs it.

**4. Instagram and Facebook, kept and fed. 3 h, 1 h ECCM.** Keep both, open
nothing else. The footer drawn on `/layout` left social links out for want
of a record; the record is now `facebook.com/eestinyydismuusikakeskus` and
`instagram.com/eccm.ee`, and both go into the footer and the contact page.
The site produces the post: the card route from the social images plan
gains a 4:5 rendition and a *copy caption* button on the editor, so a post
is a download, a paste and a link, made after the event is saved and never
before. ECCM's hour is the Facebook page's `website` field and the Instagram
bio link, both pointing at the site, and settling whether *ECCM journal* on
YouTube is theirs: if it is and it is empty, unlist it; if it holds
recordings, link it from the event pages that have them.

**5. The newsletter. 4 h here, the send pipeline priced in the CMS plan.**
The field is drawn in footer D on `/layout`. What this plan adds is the
subscribe route with double opt-in (a signed token in the confirmation link,
a `subscriber` table with `confirmed_at`), the unsubscribe route the CMS plan
already requires, and the first issue's shape: the coming month's events as
the list page already renders them, one language per list, sent in the first
week of the month. The list starts at cutover and not on the staging host,
because nothing of ECCM's enters this repository and a subscriber is
ECCM's. Dependency: Workers Paid at $5 a month and SPF and DKIM on eccm.ee,
which is the DNS owner again.

**6. Google Business Profile. 1 h, 1 h ECCM.** Search for the listing while
logged in; claim it or create it as *Eesti Nüüdismuusika Keskus* at Pühavaimu
9, category performing arts venue, hours by appointment, website, phone, the
mark and six pictures from the derive sets. Verification arrives by post or
phone to ECCM, which is their hour. UNSETTLED until then whether a card
exists that somebody else created.

**7. Wikipedia. 4 h, none of it ECCM's.** No article in either language. The
sources for a short one are already READ: the City's news of 17.11.2022, the
registry entry, the Estonian Music Days venue page, EMIC's directory, the
Ulysses Platform's partner list, the *ImproTest* article to link from, and
the Sirp and ERR pieces for the events. Write the Estonian article first
(the *ImproTest* article shows the house style for the field), then the
English one from it, with a Wikidata item carrying the registry code and the
official website. ECCM does not edit it, by Wikipedia's conflict rule; the
draft and its sources are handed to a volunteer or published through the
articles-for-creation route.

**8. Partner links. 1 h, 1 h ECCM.** Three emails from ECCM: the City of
Music office for a partner listing on muusikalinntallinn.ee, the Ulysses
Platform for the link its front page lacks, and the member ensembles whose
front pages do not link back (Ensemble U:, Sound Plasma, Improtest) for a
line in their footers. TUMA already does it. Our hour is the text of the
three and a page on the new site the links can point at.

**9. Structured data and Open Graph deltas. 2 h.** The event markup plan
has `MusicEvent`, the head for two languages and the versioned card. This
plan adds only: an `Organization` block on the front page with `legalName`
*MTÜ Eesti Nüüdismuusika Keskus*, `identifier` 80603988, the venue as
`location`, and `sameAs` listing the Facebook page, the Instagram account,
the Fienta organiser page, EMIC's entry and the Wikipedia article once it
exists; `offers.price` and `priceCurrency` read from Fienta's JSON-LD (item
3); and `og:site_name` spelled as item 1 decides.

**10. NAN's name and page. 2 h.** The page stays where it is and is carried
over as static assets, as the CMS plan says. What changes: a title that says
whose it is (*NAN, Nordic Analog Network for experimental electronics, an
ECCM initiative*), a `meta description` saying the same, and a line on the
about page and in the Organization block linking it, so a search for the
name has one result that is not a darkroom. Whether the name itself should
change is ECCM's call and is not proposed here.

**11. A press and partner line on the contact page. 1 h.** `info@eccm.ee`
as the site already publishes on `/nan/`, the postal and the venue address
kept apart as `HANDOFF.md` decided, the feed URLs and the iCalendar feed
named as *for calendars and listings*, and the two social handles. No
person's mobile number, which the current page prints.

**12. Measurement in place. 2 h.** Section 9.

## 8. A posting rhythm one part-time person can keep

The site is the source; every other surface is derived from it. Per event,
the sequence is the site entry, the Fienta event pasted from it, then the
post. Nothing is written twice.

| when | what | where | minutes |
| --- | --- | --- | --- |
| 14 days before | the event saved on the site, card rendered; the Fienta event created from the same title, summary and picture | site, Fienta | 20 |
| same day | one post, the 4:5 card and the caption copied from the editor, the site link in the bio | Instagram, Facebook | 10 |
| 2 days before | one story or reminder with the ticket link | Instagram, Facebook | 5 |
| first week of each month | the newsletter: the month's list, one per language, sent from the site | email | 20 |
| first week of each month | one grid post of last month's pictures | Instagram | 10 |
| quarterly | follower counts, Search Console and Fienta numbers copied into `PROGRESS` | site | 20 |

MEASURED against the archive's rate: 98 events over two years is about four
a month, so the per-event rows cost about 140 minutes a month and the
monthly rows 50. **About 3 hours a month, 4 with the quarterly hour spread**,
which one part-time person can keep and which the current 22 posts suggest
is more than is kept today. What is not in the table on purpose: replies,
reels, a second language per post, and any platform not listed.

## 9. What to measure

Baselines taken 2026-09-28, to be read again a quarter after cutover:

| measure | today | source |
| --- | --- | --- |
| Facebook followers | 316 | the page's `og:description` |
| Instagram followers, posts | 213, 22 | the page's `og:description` |
| Fienta organiser page, events listed | 0 | the page's HTML |
| position of eccm.ee for its own name, this tool's engine | 8 | section 1 |
| Wikipedia articles | 0 | the API |
| newsletter subscribers | 0, no list | section 5 |
| pages on eccm.ee whose title names the organisation | 1 of 6 | section 1 |

After cutover: Search Console impressions and clicks per language and per
query, with the two queries of section 1 watched by name; referrers by host
(instagram.com, facebook.com, fienta.com, emic.ee) from Cloudflare Web
Analytics, which is free and sets no cookie, so no banner; the redirect
table's hit and miss counts from the URL plan; subscribers confirmed per
month and the unsubscribe count, counted by the Worker and not by a tracking
pixel; Fienta's sales per event beside the event page's views, which needs
ECCM to export Fienta's report; Google Business Profile views and direction
requests, which its dashboard gives. Follower counts are the least useful
row and are kept only because they are the only number ECCM sees today.

## 10. What is uncertain, and the one question

| unsettled | what would settle it |
| --- | --- |
| whether the Fienta organiser page lists nothing by setting or by rendering | one look while logged in to Fienta |
| whether *ECCM journal* on YouTube is ECCM's | one look while logged in to YouTube |
| the last post dates and the pictures on Facebook and Instagram | a logged-in view; nothing was seen behind the wall |
| whether a Google Maps card exists for Pühavaimu 9 under ECCM's name | one search in Maps |
| Google's own ranking for the two queries | one search from a clean browser in Estonia |
| whether a mailing list exists in a mailbox | the question below |
| who holds the DNS for eccm.ee | the CMS plan's section 12 question, still open |
| whether Ludensemble is a member or a tenant, and where its pages are | ECCM |

**The one question to ECCM:** *Which accounts does ECCM hold under its own
name (Fienta, Facebook, Instagram, YouTube, Google, the domain's DNS), who
holds each login, and is there a list of people you already write to?*
The answer settles six of the eight rows and decides the order of items 3,
4, 5 and 6.

## Sources

Fetched once on 2026-09-28: `https://eccm.ee/` (HEAD),
`https://eccm.ee/index.php/en/`, `https://eccm.ee/index.php/et/eccm`,
`https://eccm.ee/nan/`, `https://www.instagram.com/eccm.ee/`,
`https://www.facebook.com/eestinyydismuusikakeskus`,
`https://www.youtube.com/channel/UCrmmIjWPF565J8bs9HhSB8Q`,
`https://fienta.com/et/gestuurid-situatsioonid-ilma-partituurita-kuulamine-marianna-liik-artjom-astrov-maryn-liis-ruutelmaa`,
`https://fienta.com/et/o/16904`, `https://fienta.com/et/s/sound-plasma`
(404), `https://piletikeskus.ee/et/e/2pthk1`,
`https://www.tallinn.ee/et/muusikalinn/uudis/eesti-nuudismuusika-keskuse-asub-nuud-mustpeade-majas`,
`https://muusikalinntallinn.ee/`,
`https://www.eestimuusikapaevad.ee/en/venue/estonian-centre-for-contemporary-music-eccm/`,
`https://www.emic.ee/Uhingud-ja-liidud`, `https://emc.ee/organisatsioon/`,
`https://www.inforegister.ee/80603988-EESTI-NUUDISMUUSIKA-KESKUS-MTU/`,
`https://ulysses-platform.eu/`, `https://sound-plasma.com/`,
`https://www.improtest.ee/`, `https://www.enmtallinn.com/`,
`http://uuu.ee/j/kontserdid2`, `https://www.kultuur.info/`, and the
Wikipedia search API on et and en, three calls.

Read from disk: eccm.ee's front page, event 134 and contact page saved
2026-09-26, the past-events pages and RSS feed saved 2026-09-26 and
2026-09-27, the contact page saved 2026-09-28, `tallinn.ee/et/muusikalinn`
and the UNESCO page saved 2026-09-27. Plans built on and not repeated:
`plan-eccm-cms.md` (sections 5, 12, 13), `plan-eccm-event-markup.md`,
`plan-eccm-social-images.md`, `plan-eccm-urls-sitemap-rss.md`.
