// docs.mjs: /docs, the index of written plans and reports, and /docs/migration,
// the plan for moving eccm.ee onto this site (asked 2026-10-07: "add migration
// card and page to the admin with the report", then "move to /docs/migration
// instead and make docs index page"). Written from five read-only investigations run the same day: the
// old site and its archive, storage, the radio and admin pages, the domain,
// and how Väin reads eccm.ee. The team's answers of that day are the
// decisions at the top. Every figure was measured on 2026-10-07 unless the
// row says otherwise.
import { html } from './html.mjs';
import { page } from './chrome.mjs';
import { table } from './table.mjs';

const part = (title, body) => html`<section class="rk-part">
    <h2>${title}</h2>
    ${body}
  </section>`;
const two = (label, a, b, rows) => table({ label, cols: [{ label: a }, { label: b, cls: 'main' }], rows });
const three = (label, a, b, c, rows) => table({ label, cols: [{ label: a }, { label: b, cls: 'main' }, { label: c, cls: 'wrap' }], rows });

const cards = (list) => html`<div class="cards">
    ${list.map(([href, title, desc]) => html`<a class="card" href="${href}"><span class="card-title">${title}</span><span class="card-desc">${desc}</span></a>`)}
  </div>`;

export const renderDocs = () => page({
  wide: true, lang: 'en', title: 'Docs.',
  body: html`  <h1>Docs</h1>
  ${cards([
    ['/docs/migration', 'Migration', 'Moving eccm.ee here: decisions, steps, findings and open questions.'],
    ['/docs/ici', 'ici on V\u00e4in', 'Albert Saprykin\u2019s ici as a session on V\u00e4in, and who does what.'],
  ])}`,
});

const DECISIONS = [
  ['Radio', 'Stays, as its own thing. It moves into its own Worker, not deleted.'],
  ['Newsletter', 'Needed at launch. The last issue took a week by hand.'],
  ['Calendar', 'Members add events one at a time today. Each language gets a feed to subscribe to once.'],
  ['Domain', 'eccm.ee can be replaced directly, since the current site is a test too. uus.eccm.ee is optional.'],
  ['Events', 'Everything to the end of 2026 is entered on eccm.ee. A few dates will change.'],
  ['Admin', 'Open for now, closed soon.'],
];

const STEPS = [
  ['1', 'Staging', 'Radio into its own Worker. Research pages archived. Noindex on every page. Redirects from Joomla. Contact and privacy pages. Backups.'],
  ['2', 'Content', 'The missing 2026 events, the archive from 2024, the pictures into storage, the changed dates.'],
  ['3', 'ECCM\u2019s account', 'Cloudflare account, Workers Paid, the production environment, the data copied from staging.'],
  ['4', 'Zone move', 'eccm.ee\u2019s DNS to Cloudflare with every record pointing where it does today. Nobody sees a change.'],
  ['5', 'Cutover', 'Apex and www to the Worker, noindex off, Väin and Tarmo\u2019s files kept working.'],
  ['6', 'After', 'Two weeks of watching redirect misses, Search Console, admin closed, Joomla hosting cancelled with mail kept.'],
];

const STAGING = [
  ['Radio', 'Own Worker eccm-radio with a transferred_classes migration, so channels, schedules and the recording keep their data. The bucket stays. /radio on the site 301s to it. Tag radio-in-site first.', 'To do'],
  ['Research pages', '/type, /derive, /logo, /icons and /admin/research archived: archive/research-pages.md and the tag research-last. /ds and /social stay. scheme.mjs stays, the editor uses it.', 'To do'],
  ['Noindex', 'The header in public/_headers reaches only static files. Pages are indexable on staging today. Move it into the Worker behind a flag that is off on eccm.ee.', 'To do'],
  ['Redirects', 'Joomla event URLs by legacy id from D1, about 30 page paths as a map, list and feed query strings, old /images/ by file name, 410 for Joomla internals, misses logged to D1.', 'To do'],
  ['Contact', 'The footer\u2019s Kirjuta meile links to Joomla\u2019s form. It breaks at cutover. A mailto or a form.', 'To do'],
  ['Privacy', 'The newsletter collects addresses, so a privacy notice is needed. The registry code 80603988 in the footer.', 'To do'],
  ['EU emblem', 'Ulysses needs the Co-funded by the EU emblem, which Creative Europe requires.', 'To do'],
  ['SEO', 'schema.org Event data on event pages, robots.txt with a Sitemap line, the origin from config instead of the request.', 'To do'],
  ['Backups', 'A daily D1 export into R2 outside the database, and a copy of media/, uploads/ and recordings/. Time Travel keeps 30 days on Paid.', 'To do'],
  ['Share cards', 'Page and front page cards carry the title only.', 'Committed, not deployed'],
];

const CONTENT = [
  ['Upcoming, missing', 'TUMA AFEKT festivalil 1.11 17:30 (Joomla 154/155) and in Tartu 2.11 19:00 (156/157).'],
  ['Upcoming, gone', 'Up to three / Kuni kolm, 5.12, is in D1 but not on eccm.ee. Probably one of the changed dates.'],
  ['Times to confirm', 'Üle Heli (D1 00:00 to 25.10), Koosloome (14.11 11:00), Schönberg (8.12 18:00). eccm.ee prints no time.'],
  ['English missing', 'Feldman (Joomla 110), D1 event 3 has Estonian only.'],
  ['2026 before May', '20 Estonian events 10.02 to 12.05 and four English-only rows, not in D1.'],
  ['Archive', 'About 99 Estonian and 91 English events from 22.09.2024 with real bodies, 82 to 674 words. 76 distinct pictures.'],
  ['Leave out', 'The 2027 Schönberg placeholders, Residentuurid, the empty news categories, the 2021 duplicates 67 and 68.'],
  ['NAN', '/nan/ is a separate static site, 547 KB, funded by Nordic Culture Point. Copy it under /nan/ as it is.'],
  ['Attachments', 'None on eccm.ee. One YouTube embed on Konkursid.'],
];

const STORAGE = [
  ['Image upload', 'Built and working in the event editor: JPEG, PNG, WebP, GIF up to 10 MB, stored by hash in R2, alt text in both languages. Never used on staging.'],
  ['Pictures now', 'All 30 events have one. All 25 files are in public/ (7.6 MB), none in R2. The archive import puts them in R2.'],
  ['R2 today', 'Media bucket 514 objects, 117 MB, nearly all the share-card cache. Files bucket 36 objects, 46.5 MB, the radio.'],
  ['Attachments', 'Not supported. Needs a table, an att/ prefix in R2, a file field in the editors and a list on the page.'],
  ['Resizing', 'On the zone through Image Transformations, 5,000 unique a month free. About 1,300 expected.'],
  ['Not in pictures', 'No focal point, no picture library, notices and the newsletter have no pictures.'],
];

const ACCOUNT = [
  ['Account', 'A Cloudflare account owned by ECCM, Kristjan a member. Two admins, one of them ECCM\u2019s.'],
  ['Plan', 'Workers Paid, $5 a month: the newsletter can then send to any address, and Time Travel keeps 30 days.'],
  ['D1', 'Create eccm, apply migrations 0001 to 0006, import the data from a staging export.'],
  ['R2', 'A pictures bucket and an audio bucket, the media/, uploads/ and recordings/ prefixes copied. og/ rebuilds itself.'],
  ['Durable Objects', 'Items on the site Worker. Schedule, Library, Radio on the radio Worker, Uploads on eccm-files. Notices and push subscriptions start empty unless exported.'],
  ['Secrets', 'FILES_TOKEN, STATION_TOKEN, VAPID_JWK. Reusing the staging VAPID key keeps phones subscribed.'],
  ['Mail', 'Email Sending onboarded for eccm.ee, from uudiskiri@eccm.ee. Its records go beside Virtuaal\u2019s, the MX is not touched.'],
  ['Hardcoded', 'eccm.positron.studio in src/index.mjs:12, src/render/editor.mjs:6 and src/station/station.mjs:534.'],
];

const DNS = [
  ['Holder', 'MTÜ Eesti nüüdismuusika keskus, registry code 80603988. Expires 18.03.2027.'],
  ['Registrar, DNS, hosting, mail', 'All Virtuaal.com OÜ: cPanel shared hosting at 185.169.68.37, mail on its Exim at mail.eccm.ee.'],
  ['DNSSEC', 'Off, no DS at the registry. Changing nameservers cannot break it.'],
  ['Mail records', 'MX 0 mail.eccm.ee, SPF with include:_spf.virtuaal.com, DKIM at default._domainkey, DMARC p=reject.'],
  ['Subdomains', 'Only cPanel\u2019s: www, mail, webmail, cpanel, whm, webdisk, ftp, autodiscover, autoconfig, cpcalendars, cpcontacts. No wildcard. uus is free.'],
];

const MOVE = [
  ['1', 'Export the zone from cPanel. Lower TTLs a day ahead.'],
  ['2', 'Add eccm.ee to ECCM\u2019s account on Free. Recreate every record by hand, grey cloud, apex and www still at Virtuaal. DKIM copied as one exact string.'],
  ['3', 'Change the nameservers in Virtuaal\u2019s registrar panel. The site and mail carry on as before.'],
  ['4', 'Cutover: delete the apex A and www CNAME, attach the Worker\u2019s custom domains eccm.ee and www.eccm.ee, www redirects to the apex.'],
  ['5', 'Two weeks later: check that mail and webmail renewed their certificates, since the wildcard can no longer renew through Virtuaal\u2019s DNS.'],
];

const UUS = [
  ['Direct', 'The team says the current site is a test too. Steps 1 to 4 above, no preview address. Recommended.'],
  ['uus.eccm.ee first', 'Cloudflare for SaaS on positron.studio, free for 100 hostnames: a fallback origin, the custom hostname, a route uus.eccm.ee/* to the Worker, and one CNAME at Virtuaal. Touches nothing else in the zone.'],
  ['Not possible', 'A Worker custom domain before the zone is on Cloudflare. A partial CNAME setup, Business plan only. A CNAME straight to workers.dev.'],
];

const VAIN = [
  ['What it is', 'Väin, U:\u2019s native app (org.eccm.vain, github.com/tarmoj/radio1965), by Tarmo Johannes. Its server is live.uuu.ee.'],
  ['How it gets items', 'The app fetches live.uuu.ee/radio1965/api/events at launch, on refresh and on a push. It never calls eccm.ee.'],
  ['What polls eccm.ee', 'Their server, every 5 minutes: Joomla\u2019s API /api/index.php/v1/content/articles, category 47, with a token. Then /content/articles/{id} when an article is opened.'],
  ['What breaks', 'That API, and /radio1965/contributor/, /radio1965/editor/ and /radio/streams/*.mp3, which live in eccm.ee\u2019s hosting.'],
  ['Our answer', 'A small public feed in the shape their importer already makes, /api/radio1965/articles.json. Tarmo changes the base URL and about 30 lines. The app does not change.'],
  ['His files', 'Until he moves them, the Worker passes /radio1965/* and /radio/streams/* through to the old host on a grey-cloud name.'],
];

const RISKS = [
  ['Mail', 'DMARC is p=reject: a lost SPF or DKIM record bounces mail at once. Never turn on Email Routing for eccm.ee, never proxy mail.', 'Records checked before the nameserver change'],
  ['Hosting cancelled', 'Mail is on the same Virtuaal server as Joomla. Cancelling the hosting may end the mail.', 'Ask Virtuaal before cancelling'],
  ['Open editing', 'Anyone can edit events and upload today.', 'Cloudflare Access on /admin, /edit and /files before or right after cutover'],
  ['Search', 'Old URLs are indexed under three event shapes. A missed redirect is a 404.', 'Miss log read daily for two weeks'],
  ['Väin', 'Their importer stops at cutover.', 'Tarmo told a week ahead, the feed ready'],
];

const ASK = [
  ['ECCM', 'Who holds the Virtuaal login (registrar, cPanel and mail are probably one account).'],
  ['ECCM', 'Whether mail stays at Virtuaal, and who runs the mailboxes.'],
  ['ECCM', 'A Cloudflare account of their own, and who pays the $5.'],
  ['ECCM', 'Whether an external subscriber list exists, and if the addresses may be imported.'],
  ['ECCM', 'Whether Search Console is verified, and by whom.'],
  ['Team', 'The changed dates, the three times, and Kuni kolm.'],
  ['Tarmo', 'What category 47 is, whether he takes the new feed, whether old joomla_ ids must keep working, where his files go, a webhook instead of the poll.'],
];

export const renderMigration = () => page({
  wide: true, lang: 'en', title: 'Migration.',
  body: html`  <p class="crumb"><a href="/docs">Docs</a></p>
  <h1>Migration</h1>
  <p class="note">Moving eccm.ee onto this site. Measured on 7 October 2026.</p>
  ${part('Decisions', two('Decisions', 'What', 'Decided', DECISIONS))}
  ${part('Steps', table({ label: 'Steps', cols: [{ label: 'Step', cls: 'num' }, { label: 'What' }, { label: 'Covers', cls: 'main' }], rows: STEPS }))}
  ${part('1. Staging', three('Staging', 'What', 'How', 'State', STAGING))}
  ${part('2. Content', two('Content', 'What', 'Found', CONTENT))}
  ${part('Storage', two('Storage', 'What', 'Found', STORAGE))}
  ${part('3. ECCM\u2019s account', two('Account', 'What', 'Needed', ACCOUNT))}
  ${part('Domain today', two('Domain', 'What', 'Found', DNS))}
  ${part('4. Zone move and 5. cutover', two('Zone move', 'Step', 'What', MOVE))}
  ${part('uus.eccm.ee', two('uus.eccm.ee', 'Path', 'How', UUS))}
  ${part('Väin', two('Väin', 'What', 'Found', VAIN))}
  ${part('Risks', three('Risks', 'Risk', 'Why', 'Handled by', RISKS))}
  ${part('To ask', two('To ask', 'Whom', 'What', ASK))}`,
});
