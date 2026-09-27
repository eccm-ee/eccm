# How an event page is marked up: the standard, and what eccm.ee and its peer carry today

Written 2026-09-27, asked verbatim: *"look up what, how should we mark up the
event pages. What is the standard here?"* Nothing is built. **The marks:**
READ is a page or file read today, named. MEASURED is a number taken today,
with the command. MEMORY is not checked today, and section 8 says what would
check it.

**The verdict.** The standard is three layers on one page, and neither
eccm.ee nor arvopart.ee has the first of them. (1) A schema.org `MusicEvent`
as JSON-LD in one `<script type="application/ld+json">`, one event per page,
with Google's four required properties (name, a start with the Tallinn
offset, a place with a name and a postal address) and its recommended ones
(end, status, image, offers, organizer, performer, description). (2) HTML
whose elements say what the parts are: one `main`, one `article` with a
`header`, `time` with `datetime` on every date, `dl` for label and value
pairs, `figure` and `figcaption` for the poster, links styled as buttons for
tickets because they leave the page. `public/event.html` has most of this
already; what changes is small and listed in section 3. (3) A head that
tells two languages apart: `canonical` per language, `hreflang` in both
directions plus `x-default`, Open Graph with `og:type` `website` because the
core vocabulary has no event type, `og:locale` and its alternate, the
versioned card image from the social image plan, and `twitter:card`. The
credits map onto `performer`, `organizer`, `sponsor` and `contributor` with
a `Role` wrapper for the label; the one thing the page cannot fill from
eccm.ee is the ticket price, which lives on Fienta.

## 1. What the two sites carry today, MEASURED

Counted with `grep -o -i <pattern> file | wc -l` over the four eccm.ee event
pages saved in the scratchpad (`ev134-et.html`, `ev135-en.html`,
`ev109-et.html`, `ev110-en.html`, fetched earlier today) and one fetch of
arvopart.ee's Feldman page (`arvopart-feldman.html`, 83,680 bytes).

| in the page | eccm.ee, each of 4 | arvopart.ee |
| --- | --- | --- |
| `application/ld+json` | 0 | 0 |
| `itemprop`, `itemscope` (microdata) | 0 | 0 |
| `property="og:` | 8 | 5 |
| `name="twitter:` | 0 | 4 |
| `hreflang=` | 0 | 3 |
| `rel="canonical"` | 0 | 1 |
| `<time`, `datetime=` | 0 | 0 |
| `<article` | 0 | 1 |
| `<main` | 1 | 1 |
| `<dl` | 0 | 0 |
| `<html lang` | `et-ee` | `et` |

eccm.ee's eight Open Graph lines on event 134 (READ): `og:title` is the
capitals title with a trailing colon, `og:type` is `website`, `og:image` is
the 2000 by 1333 original with width and height, `og:url` the Joomla path,
`og:description` the body's first characters in capitals, `og:site_name`
`Eesti nüüdismuusika keskus`. No Twitter card, no canonical, no hreflang, and
the language switcher points at `/index.php/en/`, the English front page,
not the English twin. The generator is Joomla.

arvopart.ee (READ): `og:type` `website`, `og:url`, `og:title` with the site
name appended, `og:description` that is the organisation's boilerplate and
not the event's, `og:image` 1800 by 1013 without width or height; a Twitter
card `summary_large_image` with title, description and image; three
`hreflang` links, `et`, `en` and `x-default` pointing at the Estonian page,
which is the shape section 4 recommends; a `canonical`; WordPress's oEmbed
and REST alternates. No structured event data.

trip, for comparison: `grep -rc "ld+json" astro-prod/src` is 0 in every file
(MEASURED), so its news pages carry Open Graph and nothing structured, and
there is nothing to port for this section.

So neither Estonian site has event structured data, and one of the two has
the language head right. Everything in the next sections is new ground for
both.

## 2. The standard: schema.org MusicEvent as JSON-LD, and what Google wants

**The type.** `MusicEvent` is a subtype of `Event` and adds no property of
its own; schema.org's page lists only the inherited ones (READ,
https://schema.org/MusicEvent). Its value is the label: a search engine can
tell a concert from a lecture. A talk or a workshop is an `Event` or an
`EducationEvent`; the type comes from `event.category` and stays a one line
map.

**The format.** JSON-LD in a `<script type="application/ld+json">` in the
head, which Google recommends over microdata (READ,
https://developers.google.com/search/docs/appearance/structured-data/event).
Two rules from the same page that shape the whole site: *"Each event MUST
have a unique URL (a leaf page) and markup on that URL"* and *"The event
experience on Google only supports pages that focus on a single event"*. So
the list page carries no `Event` markup at all, and every date of a series
is its own page with its own JSON-LD, which eccm.ee already does by giving
each Schönberg date its own id (71 to 80, MEASURED in the calendar parse
earlier today).

**Required by Google for the rich result** (READ, the same page):

| property | type | note |
| --- | --- | --- |
| `name` | Text | the event's title, never the venue's name |
| `startDate` | DateTime | ISO 8601 with the offset: `2026-09-30T19:00:00+03:00` |
| `location` | Place | with `name` and `address` |
| `location.address` | PostalAddress | *"the venue's detailed street address"* |

**Recommended** (READ): `description` (the event, not the date and place
again), `endDate`, `eventStatus` (`EventScheduled`, `EventCancelled`,
`EventPostponed`, `EventRescheduled`; schema.org adds `EventMovedOnline`,
READ https://schema.org/EventStatusType), `image` (at least 720 px wide and
50,000 pixels, in 16:9, 4:3 and 1:1), `offers` with `price`,
`priceCurrency` (ISO 4217), `url` to *"a landing page that clearly provides
the opportunity to buy a ticket"*, `availability` (`InStock`, `SoldOut`,
`PreOrder`) and `validFrom`, `organizer` with name and url, `performer` as
`Person` or `PerformingGroup`, and `previousStartDate` only with a
rescheduled status. A free event is an offer with `price` `0` (READ,
https://schema.org/Offer).

**Eligibility** (READ): *"Events must be bookable to the general public"*
and must have a physical location; not promotions, not business hours, not
coupons, not events needing a membership or an invitation. Every ECCM
concert qualifies; a members-only rehearsal would not, and would simply
carry no markup.

**The offset.** Europe/Tallinn is +02:00 in winter and +03:00 from the last
Sunday of March to the last Sunday of October (MEMORY). The schema stores
`starts_at` as local time without an offset, so the renderer computes the
offset per date, which is one call to `Intl.DateTimeFormat` with
`timeZone: 'Europe/Tallinn'` and `timeZoneName: 'longOffset'` on a Worker
(MEMORY, to be run once under wrangler dev). Both dates in the sample fall in
summer time, so `+03:00`, which `public/event.html` already writes.

**Series.** Google's page says nothing about series, `subEvent` or
`superEvent` (MEASURED: the fetched page carries no such passage).
schema.org has `superEvent` (*"an event that this event is a part of"*),
`subEvent` and `eventSchedule` (*"where it is preferable to share a schedule
for a series of repeating events rather than data on the individual
events"*), all READ. For Schönbergi sari the honest markup is twelve
`MusicEvent` pages, each with a `superEvent` naming the series only once a
series page exists to be its URL. Until then, leave `superEvent` out; the
rich result loses nothing.

**Pointless here, or premature:** `eventAttendanceMode` is one harmless line
(`OfflineEventAttendanceMode`, MEMORY for the enumeration's exact names)
that says every ECCM event is in a room; `maximumAttendeeCapacity`,
`remainingAttendeeCapacity`, `typicalAgeRange`, `audience` and `doorTime`
have no source in the schema; `inLanguage` describes the event's language,
not the page's, so a concert leaves it out and a talk sets it; `composer`
and `workPerformed` would be right for the Feldman page (*"For Philip
Guston"* by Morton Feldman) and the credits model has no notion of a work,
which section 8 lists.

## 3. The HTML5 semantics, starting from public/event.html

What the page has today (READ, `public/event.html`): one `main.frame`, one
`article.event`, the title as the page's only `h1`, `dl.facts` with
`div`-wrapped `dt` and `dd` pairs, `time datetime` on the event date and on
the three next dates, `figure.event-pic` with an `img` carrying `width`,
`height` and `alt` and a `figcaption`, the body as `p` and `h2`, `dl.credits`
under an `h2`, `section.next` with an `h2` and an `ol`, `nav.site-nav` with
an `aria-label`, `footer.site-foot`, `html lang="et"`, and the ticket as an
`a.btn.btn-pri`. That is most of the standard. What changes:

```html
<html lang="et">
<main class="frame">
  <article class="event">
    <header class="event-top">
      <div class="event-lead">
        <nav class="crumb" aria-label="Asukoht"><ol><li><a href="/et/">Avaleht</a></li><li><a href="/et/events/">Sündmused</a></li></ol></nav>
        <h1>…</h1>
        <dl class="facts">
          <div><dt>Millal</dt><dd><time datetime="2026-09-30T19:00:00+03:00">30.09.2026 kell 19.00</time>, <time datetime="PT1H">60 min</time></dd></div>
          <div><dt>Kus</dt><dd>ECCM saal, Herne 11A, Tallinn</dd></div>
          …
        </dl>
        <p class="event-actions"><a class="btn btn-pri" href="https://fienta.com/…">Osta pilet</a> <a class="btn" href="/et/events/….ics" type="text/calendar">Kalendrisse</a></p>
      </div>
      <figure class="event-pic"><img src="…" width="…" height="…" alt="…"><figcaption>…</figcaption></figure>
    </header>
    <div class="prose flow" lang="et">…</div>
    <section class="credits-block"><h2>Tegijad</h2><dl class="credits">…</dl></section>
    <section class="next"><h2>Järgmised üritused</h2><ol class="next-list">…</ol></section>
  </article>
</main>
<footer class="frame site-foot"><address>Eesti Nüüdismuusika Keskus, Herne 11A, 10135 Tallinn</address> …</footer>
```

- **`header` inside the article.** The crumb, the title, the facts, the
  actions and the poster are the article's header, so `div.event-top`
  becomes `header.event-top`. The class stays and `eccm.css` does not change.
- **The crumb is a `nav` with an `ol`** once it has two levels, which is the
  WAI-ARIA breadcrumb pattern (MEMORY); with one link, as today, a `p` is the
  honest element. `aria-current="page"` goes on nothing in the crumb, since
  the page itself is not in it.
- **`time` on every date, and on the duration.** `datetime="PT1H"` is a
  valid duration string for `time` (MEMORY, the HTML standard's duration
  form), so `60 min` becomes machine-readable without a second element.
- **No `address` for the venue.** The HTML standard reserves `address` for
  the contact information of the nearest `article` or `body`, and says it
  must not be used for arbitrary postal addresses (MEMORY). The venue stays
  a `dd`; the footer's ECCM line is the site's own contact and may be an
  `address`.
- **`dl` for facts and for credits, `div`-wrapped pairs**, as today. A
  credit line with several people stays a comma list in one `dd`; a `ul`
  inside the `dd` is the alternative when the design wants one name per
  line, and that is a design decision, not a markup one.
- **Links, not buttons.** Tickets go to Fienta, the calendar file is a
  download, the editor is another page: every one is a navigation and is an
  `a`, styled as a button by `.btn`. A `button` element belongs only to an
  action on this page, and the event page has none. No `role="button"`.
- **Headings.** One `h1`, then `h2` for the body's sections, for Tegijad and
  for Järgmised üritused. The markdown renderer maps `##` to `h2` and `###`
  to `h3` and refuses `#`, so a body can never carry a second `h1`.
- **`lang`.** The page's `html lang` is the route's language. When the
  English text row is missing and the Estonian text is shown under English
  chrome, the article's prose block, its `h1` and its credits carry
  `lang="et"`, the chrome stays `en`, and one line in English above the `h1`
  says the page is in Estonian only. That line's wording is the owner's;
  the element is a `p` with `lang="en"`, not an `aside`, because it is part
  of the reading order.
- **The language switch** is `<a href="/en/events/…" hreflang="en"
  lang="en">EN</a>`, the `hreflang` attribute on an `a` being the standard
  hint for a link to another language (MEMORY).
- **`meta name="robots" noindex`** in the page and `X-Robots-Tag` in
  `_headers` both leave at cutover; until then every rule below is written
  for eccm.ee and tested on a hostname search engines are told to ignore.

## 4. The head for two languages

```html
<link rel="canonical" href="https://eccm.ee/et/events/gestuurid-situatsioonid-ilma-partituurita-kuulamine">
<link rel="alternate" hreflang="et" href="https://eccm.ee/et/events/gestuurid-situatsioonid-ilma-partituurita-kuulamine">
<link rel="alternate" hreflang="en" href="https://eccm.ee/en/events/gestures-situations-listening-without-a-score">
<link rel="alternate" hreflang="x-default" href="https://eccm.ee/et/events/gestuurid-situatsioonid-ilma-partituurita-kuulamine">
<link rel="alternate" type="application/rss+xml" hreflang="et" href="https://eccm.ee/et/feed" title="Eesti Nüüdismuusika Keskus">
<meta name="description" content="…">
<meta property="og:type" content="website">
<meta property="og:url" content="https://eccm.ee/et/events/gestuurid-situatsioonid-ilma-partituurita-kuulamine">
<meta property="og:title" content="Gestuurid/situatsioonid: ilma partituurita kuulamine">
<meta property="og:description" content="…">
<meta property="og:site_name" content="Eesti Nüüdismuusika Keskus">
<meta property="og:locale" content="et_EE">
<meta property="og:locale:alternate" content="en_GB">
<meta property="og:image" content="https://eccm.ee/og/e/134-et-1a2b3c4d.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="…">
<meta name="twitter:card" content="summary_large_image">
```

- **`canonical` per language, to itself**, fully qualified. Google reads the
  three methods, HTML links, HTTP `Link` headers or the sitemap, as
  equivalent; the HTML link is the one a reader can see (READ,
  https://developers.google.com/search/docs/specialty/international/localized-versions).
- **`hreflang` in both directions, plus `x-default`.** *"Each language
  version must list itself as well as all other language versions"* and
  *"If two pages don't both point to each other, the tags will be ignored"*
  (READ, same page). `x-default` is the page for any language not listed,
  which for ECCM is the Estonian one; arvopart.ee does exactly this. Codes
  are ISO 639-1, `et` and `en`, with no region.
- **When the English row is missing** the English URL shows Estonian text,
  so it is not an alternate: no `hreflang` pair on either page, and the
  English URL's `canonical` points at the Estonian page, which tells Google
  the two are one document. The pair appears the day the English row is
  written. This is the recommendation; the owner may prefer the pair
  regardless, and section 8 lists it.
- **`og:type` is `website`.** The core Open Graph vocabulary has `article`,
  `book`, `profile`, `website`, the `music.*` and `video.*` types and no
  event (READ, https://ogp.me/); *"any non-marked up webpage should be
  treated as og:type website"*. `article` would tell a scraper to look for
  `article:published_time` and treat the page as a dated publication, which
  an event is not. Both eccm.ee and arvopart.ee say `website` today.
- **`og:locale` is `language_TERRITORY`** (READ, ogp.me): `et_EE` and, for
  the English page, `en_GB`, since ECCM writes *Centre*; the other page's
  locale goes in `og:locale:alternate`.
- **`og:image` is the versioned card** from `plans/plan-eccm-social-images.md`
  section 5: `og/e/{id}-{lang}-{v}.{png|jpg}` with `v` hashing the title, the
  dates, the venue, the category, the picture key, the scheme and the
  template version (READ). Width, height, type and alt beside it, as ogp.me
  lists. Its URL changes when the content does, on purpose.
- **`twitter:card` `summary_large_image`** and nothing more: X reads the
  `og:` properties for title, description and image (MEMORY, and what
  arvopart.ee relies on with its four lines).
- **The feed link** belongs to the URLs, sitemap and RSS plan being written
  in parallel; the line is here so the head is complete.

## 5. The worked example: event 134 in Estonian

Filled from `ev134-et.html` and `public/event.html` (READ), and mapped onto
the seven tables of `plans/plan-eccm-cms-step-1.md` section 2 (READ). The
price is absent because the page has none (MEASURED: `grep -i "€\|eur\|hind"`
finds nothing on either language page; the Fienta link is the only offer
fact).

```json
{
  "@context": "https://schema.org",
  "@type": "MusicEvent",
  "@id": "https://eccm.ee/et/events/gestuurid-situatsioonid-ilma-partituurita-kuulamine#event",
  "url": "https://eccm.ee/et/events/gestuurid-situatsioonid-ilma-partituurita-kuulamine",
  "name": "Gestuurid/situatsioonid: ilma partituurita kuulamine. Marianna Liik, Artjom Astrov, Maryn-Liis Rüütelmaa",
  "description": "Gestuurid/situatsioonid: ilma partituurita kuulamine on sündinud soovist mõtestada praegust aegruumi ja selle vajadusi …",
  "startDate": "2026-09-30T19:00:00+03:00",
  "endDate": "2026-09-30T20:00:00+03:00",
  "duration": "PT1H",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "ECCM saal",
    "address": { "@type": "PostalAddress", "streetAddress": "Herne 11A", "addressLocality": "Tallinn", "postalCode": "10135", "addressCountry": "EE" }
  },
  "image": [
    "https://eccm.ee/media/<key>/1200x900.jpg",
    "https://eccm.ee/media/<key>/1200x675.jpg",
    "https://eccm.ee/media/<key>/1200x1200.jpg"
  ],
  "offers": {
    "@type": "Offer",
    "url": "https://fienta.com/et/gestuurid-situatsioonid-ilma-partituurita-kuulamine-marianna-liik-artjom-astrov-maryn-liis-ruutelmaa",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "validFrom": "2026-09-01T00:00:00+03:00"
  },
  "organizer": [
    { "@type": "Organization", "name": "Eesti Nüüdismuusika Keskus", "url": "https://eccm.ee" },
    { "@type": "Person", "name": "Maria Hansar" }
  ],
  "performer": [
    { "@type": "Person", "name": "Marianna Liik" },
    { "@type": "Person", "name": "Liisa Hõbepappel" },
    { "@type": "Person", "name": "Artjom Astrov" },
    { "@type": "Person", "name": "Kenn-Eerik Kannike" },
    { "@type": "Person", "name": "Liis Vares" },
    { "@type": "Person", "name": "Maryn-Liis Rüütelmaa" }
  ],
  "contributor": [
    { "@type": "Role", "roleName": "Dramaturg", "contributor": { "@type": "Person", "name": "Alissa Šnaider" } },
    { "@type": "Role", "roleName": "Graafiline disain", "contributor": { "@type": "Person", "name": "Jaan Evart" } },
    { "@type": "Role", "roleName": "Loovkommunikatsioon", "contributor": { "@type": "Person", "name": "Maria Solei Järvet" } },
    { "@type": "Role", "roleName": "Projektijuht", "contributor": { "@type": "Person", "name": "Annika Üprus" } }
  ],
  "sponsor": [
    { "@type": "Organization", "name": "Eesti Kultuurkapital" },
    { "@type": "Organization", "name": "Tallinna linn" },
    { "@type": "Organization", "name": "Ulysses platvorm" }
  ]
}
```

The `Role` wrapper is schema.org's way of putting a label on a link: the
`Role` object stands where the person would and repeats the property name
inside itself (READ for the Role type earlier today, the repeat-the-property
convention MEMORY). Google ignores properties it does not use, so the
wrapper costs nothing in the rich result and keeps the credit's label for
anyone else reading the page.

**Field by field, from the tables:**

| JSON-LD | from |
| --- | --- |
| `@type` | `event.category`: `MusicEvent` for `eccm`, `koostoo`, `improtest`, `schoenberg`, `u`, `ulysses`; `Event` when a category is a talk, decided per category in one map |
| `@id`, `url`, `og:url`, `canonical` | the route from `event_text.lang` and `event_text.slug` |
| `name` | `event_text.title` |
| `description` | the first paragraph of `event_text.body`, plain text, the same string as `meta description` |
| `startDate` | `event.starts_at` plus the Tallinn offset for that date |
| `endDate` | `event.ends_at`, else `starts_at` plus `duration_min`, else left out |
| `duration` | `event.duration_min` as `PT{n}M`, left out when NULL |
| `eventStatus` | `EventScheduled` in step 1; a `status` value for cancelled and postponed is the editing step's, since nothing can set it yet |
| `location.name`, `address` | `event.venue`, `event.address` split into street and locality; the postal code and country from a venue lookup when a `venue` table exists, typed for ECCM's own hall until then |
| `image` | `media.key` through the image variants the image plan being written in parallel defines; Google asks for 16:9, 4:3 and 1:1 at 720 px or wider |
| `offers.url` | `event.ticket_url`; the offer is left out entirely when it is empty |
| `offers.price` | nothing in the schema holds it; section 8 |
| `offers.validFrom` | `event.publish_at`, else `created_at` |
| `organizer` | ECCM always, from the site's constants; plus each `event_credit` row whose `role_key` is `coproducer` or `collaboration`, its people as `Person` and its orgs as `Organization` in the page's language |
| `performer` | the `event_credit` rows with `role_key` `artists` or `performers`, each name a `Person`; a name's `note` in the page's language becomes a `PerformanceRole` with `roleName` when present |
| `contributor` | every other `event_credit` row: the label from `role.label_{lang}` or the row's own `label_{lang}` as `roleName`, the people inside |
| `sponsor` | the `event_credit` row with `role_key` `supporters`, its orgs in the page's language |
| `inLanguage` | left out for a concert; `et` or `en` for a talk, which needs a column the schema does not have yet |
| `@type` `EventSeries`, `superEvent` | not in step 1; needs a series page |

The English page's JSON-LD is the same object with `event_text` of `en`,
the labels from `label_en`, the organisation names from `orgs[].en`, and its
own `url`. The people's names are the same strings, which is what the
credits model was cut for.

## 6. Other formats, one line each

- **h-event microformats2**: `class="h-event"` on the article with
  `p-name`, `dt-start`, `dt-end`, `p-location`, `u-url` and `p-summary` on
  the elements that already exist. Read by IndieWeb tools and a few calendar
  scrapers; costs six class names; low value, harmless, add if free.
- **`.ics` and `webcal`**: eccm.ee's `Kalendrisse` link today is Joomla's
  `?layout=vcal` (READ, `public/event.html` carries it). The new site serves
  `/et/events/{slug}.ics` as `text/calendar` with one `VEVENT`
  (`DTSTART;TZID=Europe/Tallinn`, a stable `UID` per event, `URL`,
  `LOCATION`, `DESCRIPTION`), and `/et/events.ics` as the whole calendar for
  a `webcal://` subscription. One route, the natural "subscribe to ECCM"
  feature, and the Google and Outlook deep links can stay beside it or go.
- **An events feed**: RSS or Atom per language is the URLs, sitemap and RSS
  plan's; the head's `link rel="alternate" type="application/rss+xml"` is in
  section 4.
- **`BreadcrumbList` JSON-LD**: a second small object, three lines per
  level, which Google shows under the result as a path; worth adding when
  the crumb has two levels, pointless with one.
- **`ItemList` on the list page**: not for events; Google's event
  experience reads single-event pages only (READ, section 2), and a list
  page carries no `Event` markup.
- **Microdata**: no; JSON-LD says the same thing in one place without
  touching the markup, and Google recommends it.

## 7. Validation: what a pass means

- **Google's Rich Results Test** (search.google.com/test/rich-results, MEMORY
  for the URL) takes a URL or pasted HTML and reports whether the event is
  eligible, with required properties missing as errors and recommended ones
  as warnings. Run it at the session that first renders the head from D1,
  by pasting the rendered HTML, and again on eccm.ee after cutover. On
  eccm.positron.studio a pass means the markup is well formed and eligible;
  it does not mean anything will show, because `X-Robots-Tag: noindex` keeps
  the page out of the index, and it does not test eligibility rules such as
  *"bookable to the general public"*, which are judged, not parsed.
- **The schema.org validator** (validator.schema.org, MEMORY) checks that
  the JSON-LD is valid against the vocabulary, types and property names, and
  nothing about Google's requirements. Run it on the worked example before
  the renderer exists, which needs no page.
- **The Nu HTML checker** (validator.w3.org/nu, MEMORY) for the skeleton of
  section 3: one run per template change, on the rendered page.
- **hreflang** has no Google tool since the International Targeting report
  was retired (MEMORY): a ten line script that fetches both language pages
  and checks that each lists the other and itself is the check, run in the
  session that adds the pair.
- **After cutover**, Search Console's Enhancements report for Events is the
  only measure of whether Google shows the rich result, and it takes days to
  fill (MEMORY).
- **Facebook's Sharing Debugger** for the Open Graph half is the social
  image plan's, with its noindex caveat.

## 8. What could not be settled, and what would settle it

| open | why | what settles it |
| --- | --- | --- |
| the ticket price | not on eccm.ee's pages, only on Fienta (MEASURED); Google recommends `price` and `priceCurrency` | a `price` column filled by the editor, or one Fienta fetch at save time; the owner's call, since it is a fact ECCM would maintain twice |
| the image aspect ratios | Google wants 16:9, 4:3 and 1:1 at 720 px or wider; the originals are 3:2 and 2000 px | the image plan being written in parallel, which decides the variants; three crops per picture is the likely answer |
| `eventAttendanceMode` and the exact `Event` property list | the enumeration page and schema.org's `Event` page were not fetched; `contributor`, `director`, `funder` on `Event` are MEMORY | one fetch each of https://schema.org/Event and https://schema.org/EventAttendanceModeEnumeration before the renderer is written |
| the `Role` convention | that the wrapper repeats the property name inside itself is MEMORY | the same `Event` page, which carries an example, or the schema.org blog post that introduced Role |
| the venue address | `event.address` is empty for events away from Herne 11A, and the postal code and country are constants today | a `venue` table when the CMS plan reaches it; ECCM's own hall typed until then |
| a series page | `superEvent` needs a URL to point at | a `series` row and route, not in step 1 |
| the English fallback and `hreflang` | this plan says no pair and a canonical to Estonian while the English row is missing | the owner, at the session that renders the head |
| `og:locale` for English | `en_GB` assumed from *Centre* | the owner |
| past events | Google's page as fetched says nothing about expired events; an older version advised against marking them up (MEMORY) | keep the markup with the true dates, since a past concert is still a true record; revisit if Search Console reports it |
| whether Google shows event rich results for a site this size at all | unknowable from this desk | the Enhancements report after cutover |
| `composer` and `workPerformed` | the Feldman page knows the work and the composer; the credits model has no notion of a work | a `works` list per event when a programme is worth modelling, which is a design question for a music centre and not a markup one |

## Sources

**Files read:** `/Users/s32863/personal/eccm/CLAUDE.md`,
`public/event.html`, `plans/plan-eccm-cms-step-1.md` section 2,
`plans/plan-eccm-social-images.md` section 5, the scratchpad's
`ev134-et.html`, `ev135-en.html`, `ev109-et.html`, `ev110-en.html`, and
`arvopart-feldman.html`; `grep -rc "ld+json"` over
`/Users/s32863/personal/trip/astro-prod/src`.

**URLs fetched today:** https://www.arvopart.ee/arvo-pardi-keskus/sundmused/sundmus/morton-feldman-100-ansambel-u/
(once, saved), https://developers.google.com/search/docs/appearance/structured-data/event,
https://schema.org/MusicEvent, https://schema.org/EventStatusType,
https://schema.org/Offer,
https://developers.google.com/search/docs/specialty/international/localized-versions,
https://ogp.me/. Nothing else external.
