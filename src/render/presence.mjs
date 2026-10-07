// presence.mjs: /docs/presence, ECCM's presence on the web as problems and
// solutions (asked 2026-10-07: "add doc based on the web presence plan"). The
// findings are plans/plan-eccm-presence.md, read on 2026-09-28; the State
// column is what this site does on 2026-10-07, read off staging that day.
import { html } from './html.mjs';
import { page } from './chrome.mjs';
import { table } from './table.mjs';

const part = (title, body) => html`<section class="rk-part">
    <h2>${title}</h2>
    ${body}
  </section>`;
const fix = (label, rows) => table({
  label,
  cols: [{ label: 'Problem', cls: 'wrap' }, { label: 'Solution', cls: 'main' }, { label: 'Who' }, { label: 'State' }],
  rows,
});

const SITE = [
  ['Five of six eccm.ee pages are titled Avaleht, Home or Kontakt, without the organisation’s name. Registry mirrors outrank the site for its own name.', 'Every title ends in the name: event title and ECCM, page name and ECCM.', 'Kristjan', 'Done here'],
  ['The name is spelled four ways: for and of, centre and center, upper and lower case.', 'One spelling per language: Eesti Nüüdismuusika Keskus, Estonian Centre for Contemporary Music, the one the City and Estonian Music Days use. og:site_name the same on every page.', 'ECCM decides, Kristjan applies', 'og:site_name differs between pages'],
  ['No page description and no structured data. Search engines read the contact page’s organisation as a Person with a name in the fax field.', 'A description per page from its summary. Organization data on the front page with the registry code 80603988, the venue, and links to Facebook, Instagram, Fienta and EMIC. MusicEvent data on every event.', 'Kristjan', 'To do'],
  ['Instagram is linked from nowhere, Facebook from one page.', 'Both in the footer and on the contact page.', 'Kristjan', 'Done here'],
  ['No way to follow the site: no newsletter, the RSS feed advertised nowhere.', 'Newsletter with double opt-in, feeds in the head, a calendar feed per language.', 'Kristjan', 'Built, sends after Workers Paid'],
  ['The contact page prints a person’s mobile number. info@eccm.ee appears only on /nan/.', 'The contact form, info@eccm.ee, postal and venue addresses kept apart, the feeds named for calendars and listings.', 'Kristjan', 'To do'],
  ['A search for Nordic Analog Network finds a darkroom photography network, not ECCM’s NAN.', 'A title and description on /nan/ that say it is an ECCM initiative, and a link from the about page.', 'Kristjan', 'To do'],
];

const TICKETS = [
  [html`<a href="https://fienta.com/et/o/16904" rel="noopener">Fienta’s organiser page</a> is filed under a staff member’s name, lists no events, has the address twice with two postcodes and links http://eccm.ee.`, 'Rename it Eesti Nüüdismuusika Keskus, the mark as picture, https://eccm.ee, one address, two lines of description, the public page on.', 'ECCM', 'Ask'],
  ['The site never links the organiser page.', 'Link it from the footer and the tickets line. Read each event’s price from Fienta’s own data.', 'Kristjan', 'After Fienta is fixed'],
  ['Piletilevi and Piletikeskus list ECCM as a venue, through Estonian Music Days.', 'Nothing to claim there.', 'Nobody', 'Decided'],
];

const SOCIAL = [
  ['Instagram (213 followers, 22 posts) reads better than the site: one full picture per event, a name at the top, a rhythm.', 'The site takes that over: the picture first at full width, a dated list, the newest first. It stays the source, since Instagram has no dates as data, no languages, no tickets, no search.', 'Kristjan', 'Done here'],
  ['Posts are made by hand, separately from the site.', 'The site makes the post: a share card and a 4:5 Instagram carousel per event, then a copy-caption button in the editor.', 'Kristjan', 'Cards done, button to do'],
  ['Facebook’s website field and Instagram’s bio link do not point at the site.', 'Both point at eccm.ee after cutover.', 'ECCM', 'At cutover'],
  ['YouTube @ECCMjournal may or may not be ECCM’s.', 'One look while logged in. Unlist it if empty, link recordings from events if not.', 'ECCM', 'Ask'],
  ['Of seven member and partner sites, only TUMA links to eccm.ee.', 'One email each from ECCM: City of Music, Ulysses Platform, Ensemble U:, Sound Plasma, Improtest.', 'ECCM, text by Kristjan', 'To do'],
];

const LISTINGS = [
  ['No Wikipedia article in either language.', 'An Estonian article from published sources, then English, and a Wikidata item with the registry code. ECCM does not write it, by Wikipedia’s conflict rule: a volunteer or the article-for-creation route.', 'Kristjan drafts', 'To do'],
  ['No Google Maps card is known.', 'Claim or create it at Pühavaimu 9 as Eesti Nüüdismuusika Keskus. Verification comes by post or phone.', 'ECCM', 'Ask'],
  ['Search Console is not set up for the new site.', 'A property verified by DNS, the sitemap submitted, the old one kept until the redirects are crawled.', 'Kristjan with DNS', 'At cutover'],
  ['No measurement at all.', 'Cloudflare Web Analytics: free, no cookie, so no banner. Subscribers counted by the Worker, no tracking pixel.', 'Kristjan', 'At cutover'],
  ['EMIC and Estonian Music Days already list ECCM.', 'Nothing to do but check their link after cutover.', 'Kristjan', 'At cutover'],
];

// the rhythm one part-time person can keep, the site the source of every other surface
const RHYTHM = [
  ['14 days before', 'Event saved on the site, the Fienta event made from it', 'Site, Fienta', '20'],
  ['Same day', 'One post: the 4:5 card and the caption from the editor', 'Instagram, Facebook', '10'],
  ['2 days before', 'A story or reminder with the ticket link', 'Instagram, Facebook', '5'],
  ['First week of the month', 'The newsletter: the month’s events, sent from the site', 'Email', '20'],
  ['First week of the month', 'One grid post of last month’s pictures', 'Instagram', '10'],
  ['Quarterly', 'Followers, Search Console and Fienta numbers written down', 'Site', '20'],
];

const MEASURE = [
  ['Facebook followers', '316'],
  ['Instagram followers, posts', '213, 22'],
  ['Events on the Fienta organiser page', '0'],
  ['eccm.ee’s position for its own name', '8th'],
  ['Wikipedia articles', '0'],
  ['Newsletter subscribers', '0, no list'],
  ['eccm.ee pages whose title names the organisation', '1 of 6'],
];

export const renderPresence = () => page({
  wide: true, lang: 'en', title: 'Web presence.',
  body: html`  <p class="crumb"><a href="/docs">Docs</a></p>
  <h1>Web presence</h1>
  <p class="note">The site as the one source, Instagram and Facebook fed from it, nothing new opened. Read on 28 September 2026, the State column on 7 October.</p>
  ${part('The site', fix('The site', SITE))}
  ${part('Tickets', fix('Tickets', TICKETS))}
  ${part('Social', fix('Social', SOCIAL))}
  ${part('Listings and search', fix('Listings and search', LISTINGS))}
  ${part('Rhythm', html`<p class="note">About 3 hours a month at four events a month.</p>
    ${table({ label: 'Rhythm', cols: [{ label: 'When' }, { label: 'What', cls: 'main' }, { label: 'Where' }, { label: 'Minutes', cls: 'num' }], rows: RHYTHM })}`)}
  ${part('Baseline', table({ label: 'Baseline', cols: [{ label: 'Measure', cls: 'main' }, { label: '28 September', cls: 'num' }], rows: MEASURE }))}
  ${part('To ask', html`<p>Which accounts does ECCM hold under its own name (Fienta, Facebook, Instagram, YouTube, Google, the domain), who holds each login, and is there a list of people you already write to?</p>`)}`,
});
