# Web presence

The site as the one source of facts, with Instagram and Facebook as their own places that the site gives material to. Nothing new opened. Read on 28 September 2026, the State lines on 7 October. Each task says who does it: **ECCM**, or **agent**, meaning someone at ECCM gives the prompt to a coding agent working in this repository.

## The site

### One name, spelled one way

**Who:** ECCM decides, agent applies. **State:** to do.

The name is spelled five ways across the web:

| Spelling | Where |
| --- | --- |
| Eesti nüüdismuusika keskus | eccm.ee's link-preview name, its structured data, the Estonian front page heading |
| Eesti Nüüdismuusika Keskus | eccm.ee's about page, tallinn.ee, EMIC, the business register |
| Estonian Centre **of** Contemporary Music | eccm.ee's English about page, Facebook's category, ulysses-platform.eu, this site's header and footer |
| Estonian Centre **for** Contemporary Music | tallinn.ee in English, Estonian Music Days, helilooja.ee |
| Estonian Cent**er** of Contemporary Music | eccm.ee/nan |

The proposal is **Eesti Nüüdismuusika Keskus** and **Estonian Centre for Contemporary Music**, the English that the City, Estonian Music Days and the Composers' Union use, since they rank above the site. This site's link-preview name is "ECCM" on pages and "Eesti Nüüdismuusika Keskus" on events today.

**Prompt**

```text
In eccm, use one name per language everywhere: "Eesti Nüüdismuusika Keskus"
and "Estonian Centre for Contemporary Music" (or what ECCM decided). Change
og:site_name to that name on every page in its language, the header tagline
and footer copyright text, aria-labels on the mark, the share cards and the
newsletter's sender name. grep for every variant first and list them. Check
at 375 and 1280, deploy staging, push.
```

### Page descriptions and structured data

**Who:** agent. **State:** to do.

No page has a description, and search engines read eccm.ee's contact page as a Person with a name in the fax field. The prompt is under Search basics in [Migration](/docs/migration).

### Titles name the organisation

**Who:** agent. **State:** done.

Five of six eccm.ee pages are titled Avaleht, Home or Kontakt. Here every title ends in ECCM.

### Instagram and Facebook linked

**Who:** agent. **State:** done.

Both are in the footer.

### A way to follow

**Who:** agent. **State:** built, sends after Workers Paid.

Newsletter with double opt-in, feeds in the head, a calendar feed per language: `/et/sundmused.ics` and `/en/events.ics`. A calendar app subscribes once and every event arrives by itself, so members no longer add them one at a time.

### NAN is found as NAN

**Who:** agent. **State:** to do.

A search for Nordic Analog Network finds a darkroom photography network. The /nan/ copy gets a title and description saying it is an ECCM initiative, in the prompt under Copy /nan/ in [Migration](/docs/migration), and the about page links it.

## Tickets

### Fix the Fienta organiser page

**Who:** ECCM. **State:** ask.

[Fienta's organiser page](https://fienta.com/et/o/16904) is filed under a staff member's name, lists no events, has the address twice with two postcodes, and links http://eccm.ee without the s.

1. Log in to Fienta, organiser settings.
2. Name: Eesti Nüüdismuusika Keskus.
3. Picture: `https://eccm.ee/icons/icon-512.png`.
4. Website: `https://eccm.ee`.
5. Address once: Pühavaimu 9, 10123 Tallinn.
6. Description, two lines:

```text
Eesti Nüüdismuusika Keskus toob kokku nüüdismuusika tegijad ja kuulajad Tallinnas Pühavaimu 9.
Estonian Centre for Contemporary Music, a home for new music at Pühavaimu 9, Tallinn.
```

7. Turn the public organiser page on, if that is why it lists nothing.

### Link it from the site

**Who:** agent. **State:** after Fienta is fixed.

**Prompt**

```text
In eccm, link the Fienta organiser page https://fienta.com/et/o/16904 from the
footer (both languages) and from the tickets line on event pages whose ticket
link is on fienta.com. Where an event's ticket URL is a Fienta event, read the
price from that page's JSON-LD once at save time in the editor and store it, for
the event's offers.price. Check at 375 and 1280, deploy staging, push.
```

Piletilevi and Piletikeskus list ECCM as a venue through Estonian Music Days. Nothing to claim there.

## Social

### Material for Instagram

**Who:** agent. **State:** event cards done, editor to do.

[Instagram](https://www.instagram.com/eccm.ee/) (213 followers, 22 posts) works well as its own place, but every post is made by hand, outside the brand's type and colours. The site already makes each event's share card and a 4:5 carousel automatically ([/social](/social)). What is missing is an in-brand editor for any other post: text cards and pictures set in the brand's type, and the caption ready to copy.

**Prompt**

```text
In eccm, add /admin/post: an in-brand editor for Instagram posts that are not
events. Inputs: a title, a short text, an optional picture (upload, as the
event editor does), a colour from the events' schemes. Output: 4:5 PNGs drawn
by the same renderer as /og/t/ and /og/tp/ (src/og/), a download button per
card, and a caption field with a copy button. For events, add a copy-caption
button to the event editor that writes title, date, place and the event URL.
Load eccm-ui and positron-compose first. Check at 375 and 1280, deploy
staging, push.
```

### Point the profiles at the site

**Who:** ECCM. **State:** at cutover.

1. Facebook page, About, Website: `https://eccm.ee`.
2. Instagram, Edit profile, Links: `https://eccm.ee`.

### YouTube

**Who:** ECCM. **State:** ask.

[@ECCMjournal](https://www.youtube.com/@ECCMjournal) may or may not be ECCM's. One look while logged in: unlist it if empty, or link its recordings from the events they belong to.

### Partner links

**Who:** ECCM. **State:** to do.

Of seven member and partner sites only [TUMA](https://www.enmtallinn.com/) links to eccm.ee. One email each to [Music City Tallinn](https://muusikalinntallinn.ee/), [Ulysses Platform](https://ulysses-platform.eu/), [Ensemble U:](https://uuu.ee/), [Sound Plasma](https://sound-plasma.com/) and [Improtest](https://www.improtest.ee/):

```text
Tere!

Eesti Nüüdismuusika Keskusel on uus koduleht: https://eccm.ee
Kas saaksite oma lehel (näiteks jaluses või partnerite all) meile viidata?
Lingi tekst: Eesti Nüüdismuusika Keskus / Estonian Centre for Contemporary Music

Aitäh!
```

## Listings and search

### Wikipedia

**Who:** ECCM, agent drafts. **State:** to do.

No article in either language. ECCM does not write it, by Wikipedia's conflict-of-interest rule: a volunteer publishes it, or it goes through the articles-for-creation route.

**Prompt**

```text
Draft a short Estonian Wikipedia article on Eesti Nüüdismuusika Keskus from
published independent sources only (the business register, tallinn.ee's news
of 17.11.2022, EMIC, Estonian Music Days, Ulysses Platform's partner list, Sirp
and ERR reviews), in the house style of the existing ImproTest article, then an
English one from it, and a Wikidata item with the registry code 80603988 and
the official website. Write them to a file for a volunteer; do not publish.
```

### Google Maps

**Who:** ECCM. **State:** ask.

1. Search for ECCM in [Google Maps](https://maps.google.com) while logged in.
2. Claim the card, or create it at [business.google.com](https://business.google.com/) as Eesti Nüüdismuusika Keskus, Pühavaimu 9, category performing arts venue.
3. Verification arrives by post or phone.

### Search Console

**Who:** ECCM. **State:** at cutover.

1. [Search Console](https://search.google.com/search-console), add the domain property eccm.ee, verify with the TXT record it shows (in Cloudflare DNS).
2. Submit `https://eccm.ee/sitemap.xml`.
3. Watch Pages, Not found for two weeks beside the redirect misses.

### Measurement

**Who:** ECCM turns it on. **State:** at cutover.

[Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/) for the zone: free, no cookie, so no banner. Subscribers are counted by the Worker, no tracking pixel.

[EMIC](https://www.emic.ee/Uhingud-ja-liidud) and [Estonian Music Days](https://www.eestimuusikapaevad.ee/en/venue/estonian-centre-for-contemporary-music-eccm/) already list ECCM. Check their links after cutover.

## Rhythm

About 3 hours a month at four events a month.

| When | What | Where | Minutes |
| --- | --- | --- | --- |
| 14 days before | Event saved on the site, the Fienta event made from it | Site, Fienta | 20 |
| Same day | One post: the 4:5 card and the caption from the editor | Instagram, Facebook | 10 |
| 2 days before | A story or reminder with the ticket link | Instagram, Facebook | 5 |
| First week of the month | The newsletter: the month's events, sent from the site | Email | 20 |
| First week of the month | One grid post of last month's pictures | Instagram | 10 |
| Quarterly | Followers, Search Console and Fienta numbers written down | Site | 20 |

## Baseline, 28 September

| Measure | Value |
| --- | --- |
| Facebook followers | 316 |
| Instagram followers, posts | 213, 22 |
| Events on the Fienta organiser page | 0 |
| eccm.ee's position for its own name | 8th |
| Wikipedia articles | 0 |
| Newsletter subscribers | 0, no list |
| eccm.ee pages whose title names the organisation | 1 of 6 |

## To ask

Which accounts does ECCM hold under its own name (Fienta, Facebook, Instagram, YouTube, Google, the domain), who holds each login, and is there a list of people you already write to?

## Links

| Site | What |
| --- | --- |
| [Instagram](https://www.instagram.com/eccm.ee/) | eccm.ee |
| [Facebook](https://www.facebook.com/eestinyydismuusikakeskus) | eestinyydismuusikakeskus |
| [YouTube](https://www.youtube.com/@ECCMjournal) | @ECCMjournal, ECCM's or not |
| [Fienta organiser](https://fienta.com/et/o/16904) | Where ECCM's own tickets are sold |
| [EMIC](https://www.emic.ee/Uhingud-ja-liidud) | Estonian Music Information Centre |
| [Estonian Music Days](https://www.eestimuusikapaevad.ee/en/venue/estonian-centre-for-contemporary-music-eccm/) | The venue page |
| [tallinn.ee](https://www.tallinn.ee/et/muusikalinn/uudis/eesti-nuudismuusika-keskuse-asub-nuud-mustpeade-majas) | City of Music news on ECCM's move, 17.11.2022 |
| [Business register](https://ariregister.rik.ee/est/company/80603988) | 80603988 |
| [Inforegister](https://www.inforegister.ee/80603988-EESTI-NUUDISMUUSIKA-KESKUS-MTU/) | The mirror that outranks eccm.ee for its own name |
