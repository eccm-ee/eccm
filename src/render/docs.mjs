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

const cards = (list) => html`<div class="cards">
    ${list.map(([href, title, desc]) => html`<a class="card" href="${href}"><span class="card-title">${title}</span><span class="card-desc">${desc}</span></a>`)}
  </div>`;

export const renderDocs = () => page({
  wide: true, lang: 'en', title: 'Docs.',
  body: html`  <h1>Docs</h1>
  ${cards([
    ['/docs/migration', 'Migration', 'Moving eccm.ee here: decisions, steps, findings and open questions.'],
    ['/docs/presence', 'Web presence', 'The site, tickets, social and listings: what is wrong today and what fixes it.'],
    ['/logo', 'Logo', 'The mark, the wordmarks in both languages and every icon size, to look at and download.'],
    ['/docs/ici', 'ici on V\u00e4in', 'Albert Saprykin\u2019s ici as a session on V\u00e4in, and who does what.'],
  ])}`,
});

const DECISIONS = [
  ['Radio', 'Removed from the site for now, kept in git so it can come back in about an hour.'],
  ['Newsletter', 'Needed at launch. The last issue took a week by hand.'],
  ['Calendar', 'Members add events one at a time today. Each language gets a feed to subscribe to once.'],
  ['Domain', 'eccm.ee can be replaced directly, since the current site is a test too. uus.eccm.ee is optional.'],
  ['Events', 'Everything to the end of 2026 is entered on eccm.ee. A few dates will change.'],
  ['Admin', 'Open for now, closed soon.'],
];

const STEPS = [
  ['1', 'Staging', 'Radio removed. Research pages to git history. Noindex on every page. Redirects from Joomla. Contact and privacy pages. Backups.'],
  ['2', 'Content', 'The missing 2026 events, the archive from 2024, the pictures into storage, the changed dates.'],
  ['3', 'ECCM\u2019s account', 'Cloudflare account, Workers Paid, the production environment, the data copied from staging.'],
  ['4', 'Zone move', 'eccm.ee\u2019s DNS to Cloudflare with every record pointing where it does today. Nobody sees a change.'],
  ['5', 'Cutover', 'Apex and www to the Worker, noindex off, Väin and Tarmo\u2019s files kept working.'],
  ['6', 'After', 'Two weeks of watching redirect misses, Search Console, admin closed, Joomla hosting cancelled with mail kept.'],
];

// every finding as the problem, what solves it, who does it and where it stands (asked 2026-10-07: "i do not
// see problem soltion columns"); the facts behind each row are in the row, nothing kept in a separate list
const fix = (label, rows) => table({
  label,
  cols: [{ label: 'Problem', cls: 'wrap' }, { label: 'Solution', cls: 'main' }, { label: 'Who' }, { label: 'State' }],
  rows,
});

const SITE = [
  ['Staging pages can be indexed by search engines. The noindex header reaches only CSS and scripts.', 'Send noindex from the Worker on every response, behind a setting that is off on eccm.ee.', 'Kristjan', 'To do'],
  ['Old Joomla addresses answer 404 here. Google has events indexed under three address shapes.', 'Redirect by the old event id (already stored in D1), a map of about 30 page paths, rules for list and feed query strings, old /images/ by file name, 410 for Joomla login pages. Log every miss.', 'Kristjan', 'To do'],
  ['The footer\u2019s Kirjuta meile links to Joomla\u2019s contact form, gone after cutover.', 'A form at /et/kontakt and /en/contact: name, email, message. The Worker stores it in D1 and mails it to the office through the email binding the newsletter already uses, Reply-To the sender, so answering is pressing Reply. Cloudflare Turnstile, free and invisible to most people, keeps bots out. The address is printed beside it for anyone who prefers their own mail.', 'Kristjan', 'To do'],
  ['The newsletter collects addresses and there is no privacy notice.', 'A privacy page in both languages, and the registry code 80603988 in the footer.', 'Kristjan, text from ECCM', 'To do'],
  ['Ulysses lacks the EU emblem Creative Europe requires.', 'The Co-funded by the EU emblem on the Ulysses page.', 'Kristjan', 'To do'],
  ['No structured event data for search, no Sitemap line in robots.txt, the site address taken from each request.', 'schema.org Event on event pages, a robots.txt naming the sitemap, the address from config.', 'Kristjan', 'To do'],
  ['Anyone can edit events and upload pictures.', 'Cloudflare Access on /admin, /edit and /files: a login by email code for ECCM\u2019s people.', 'Kristjan', 'Before or right after cutover'],
  ['No backups beyond D1\u2019s own history. Cloudflare keeps 7 days of it (30 on Workers Paid), and nothing if the database or account is deleted.', 'The site\u2019s existing cron, once a day, writes every table into a separate backup bucket and keeps 30 days. Not into git, since the database holds subscribers\u2019 addresses. Pictures need none: they are stored by content hash and never overwritten.', 'Kristjan', 'To do'],
  ['Page share cards repeated the page\u2019s first sentence.', 'Page and front page cards carry the title only.', 'Kristjan', 'Done'],
];

const ADMIN = [
  ['The radio is not wanted on the site for now, but may be needed back fast.', 'Save the channels and schedules as JSON in archive/radio.md, tag radio-last, remove the station, recorder, files Worker and /radio. The 46 MB of audio stays in its bucket. Back: check out the tag, deploy, load the JSON.', 'Kristjan', 'To do'],
  ['Research and design-study pages (/type, /derive, /icons, /admin/research) are not needed by the site.', 'Remove them. In git at the tag research-last. /logo moves to Docs, /ds and /social stay.', 'Kristjan', 'To do'],
];

const CONTENT = [
  ['Two upcoming events are on eccm.ee and not here: TUMA AFEKT festivalil 1.11 17:30, and in Tartu 2.11 19:00.', 'Add them.', 'Team or Kristjan', 'To do'],
  ['Up to three / Kuni kolm, 5.12, is here but gone from eccm.ee.', 'Ask whether it moved or was cancelled.', 'Team', 'Ask'],
  ['Three times differ: Üle Heli (00:00), Koosloome (14.11 11:00), Schönberg (8.12 18:00). eccm.ee prints none.', 'Confirm each.', 'Team', 'Ask'],
  ['Feldman has no English text here.', 'Copy the English from eccm.ee.', 'Kristjan', 'To do'],
  ['A few dates will change, said the team.', 'The team edits them here, in the event editor, once they are known.', 'Team', 'Waiting'],
  ['The archive is not here: about 99 Estonian and 91 English past events since 22.09.2024, plus 20 from early 2026, 76 pictures.', 'Import them from eccm.ee with their old ids, so the redirects find them. Pictures into R2.', 'Kristjan', 'To do'],
  ['eccm.ee also holds test content: 2027 placeholders, empty news, Residentuurid, duplicates.', 'Leave it behind.', 'Nobody', 'Decided'],
  ['/nan/ (NAN, Nordic Analog Network) 404s here. It is one hand-made HTML file, 547 KB, its five pictures inside it.', 'Copy the file to /nan/, so every link to it keeps working. nan.eccm.ee instead only if NAN should read as its own site, after the zone move.', 'Kristjan', 'To do'],
];

const STORAGE = [
  ['Is there working image upload?', 'Yes, in the event editor: JPEG, PNG, WebP, GIF up to 10 MB into R2, alt text in both languages. Not used yet: today\u2019s 30 pictures are files in the site itself.', 'Nobody', 'Works'],
  ['No attachments (PDFs, documents). eccm.ee has none either.', 'Add when needed: a file field in the editor, files in R2, a list on the page.', 'Kristjan', 'Later'],
  ['Notices and the newsletter have no pictures.', 'Add if asked.', 'Kristjan', 'Later'],
  ['Pictures are resized only on a Cloudflare zone.', 'Turn on Image Transformations for eccm.ee. 5,000 a month are free, about 1,300 expected.', 'Kristjan', 'At cutover'],
];

const ACCOUNT = [
  ['The site runs on Kristjan\u2019s own Cloudflare account.', 'A Cloudflare account owned by ECCM, with Kristjan as a member and one ECCM admin besides.', 'ECCM', 'Ask'],
  ['On the free plan the newsletter only reaches verified addresses.', 'Workers Paid, $5 a month. It also keeps 30 days of database history.', 'ECCM pays', 'Ask'],
  ['Production is empty.', 'Create the database, buckets and secrets in ECCM\u2019s account and copy the data from staging. Reuse the push key so phones stay subscribed.', 'Kristjan', 'After the account'],
  ['The newsletter sends from uudiskiri@eccm.positron.studio.', 'Set up Cloudflare\u2019s email sending for eccm.ee. Its records go beside the existing mail records.', 'Kristjan', 'After the zone move'],
  ['Three places in the code name eccm.positron.studio.', 'Take the address from config.', 'Kristjan', 'To do'],
];

const DOMAIN = [
  ['The old hosting can hold files nobody links to, and the archive\u2019s source is Joomla\u2019s database. Neither is visible from outside.', 'Take cPanel\u2019s Full Backup first: every file, the database and the mailboxes in one archive. Read it for anything still in use, import the archive from it, keep it.', 'ECCM gives the login, Kristjan', 'Ask'],
  ['eccm.ee, its DNS, hosting and mail are all at Virtuaal.com. The domain is ECCM\u2019s and runs to 18.03.2027.', 'Move only the DNS to Cloudflare. Registration and mail stay at Virtuaal.', 'ECCM gives access, Kristjan does it', 'Ask'],
  ['Moving DNS can break mail. DMARC is set to reject, so one wrong record bounces everything.', 'Export the zone from cPanel and recreate every record by hand, unproxied, all still pointing at Virtuaal. Check mail before the switch. Never turn on Cloudflare Email Routing for eccm.ee.', 'Kristjan', 'To do'],
  ['The nameserver switch itself.', 'Change it in Virtuaal\u2019s registrar panel. DNSSEC is off, so nothing else to undo. Nobody sees a change, because every record still points where it did.', 'Kristjan with ECCM\u2019s login', 'To do'],
  ['The cutover.', 'Point eccm.ee and www at the Worker. Minutes, and reversible by pointing them back.', 'Kristjan', 'To do'],
  ['A preview address first?', 'Not needed: the team says the current site is a test too. If wanted, uus.eccm.ee can work through Cloudflare for SaaS on positron.studio, with one record at Virtuaal.', 'Team', 'Decided: direct'],
  ['Mail\u2019s certificates renew through Virtuaal\u2019s DNS, which stops after the move.', 'Check two weeks later that mail and webmail renewed.', 'Kristjan', 'After'],
  ['Cancelling Joomla hosting may end mail, which runs on the same Virtuaal server.', 'Ask Virtuaal before cancelling. Keep a mail-only plan, or move mail first.', 'ECCM', 'Ask'],
];

const VAIN = [
  ['Väin (U:\u2019s app, Tarmo Johannes) gets eccm.ee articles: his server polls eccm.ee\u2019s Joomla API every 5 minutes. That API ends at cutover.', 'A small public feed here in the shape his importer already uses. He changes one address and about 30 lines. The app itself does not change.', 'Kristjan builds, Tarmo switches', 'Ask Tarmo'],
  ['His pages /radio1965/contributor and /radio1965/editor, and the recordings in /radio/streams, are files in eccm.ee\u2019s hosting.', 'Until he moves them, the new site fetches those addresses from the old server and passes them on. The old server keeps a second name, old.eccm.ee, that points straight at it without going through Cloudflare. Virtuaal adds it in cPanel as an alias of the site.', 'Kristjan, ECCM for cPanel', 'To do'],
  ['Which articles feed Väin (Joomla category 47) is unknown.', 'Ask him, and whether a webhook on publish should replace the poll.', 'Tarmo', 'Ask'],
];

const ASK = [
  ['ECCM', 'Who holds the Virtuaal login. Whether mail stays at Virtuaal and who runs the mailboxes. A Cloudflare account of their own, and who pays $5 a month. Whether a subscriber list exists and may be imported. Whether Search Console is verified, and by whom. The privacy text.'],
  ['Team', 'The changed dates, the three times, Kuni kolm.'],
  ['Tarmo', 'What category 47 is. Whether he takes the new feed. Whether old joomla_ ids must keep working. Where his files go. A webhook instead of the poll.'],
];

export const renderMigration = () => page({
  wide: true, lang: 'en', title: 'Migration.',
  body: html`  <p class="crumb"><a href="/docs">Docs</a></p>
  <h1>Migration</h1>
  <p class="note">Moving eccm.ee onto this site. Measured on 7 October 2026.</p>
  ${part('Decisions', two('Decisions', 'What', 'Decided', DECISIONS))}
  ${part('Steps', table({ label: 'Steps', cols: [{ label: 'Step', cls: 'num' }, { label: 'What' }, { label: 'Covers', cls: 'main' }], rows: STEPS }))}
  ${part('Site', fix('Site', SITE))}
  ${part('Radio and admin pages', fix('Radio and admin pages', ADMIN))}
  ${part('Content', fix('Content', CONTENT))}
  ${part('Storage', fix('Storage', STORAGE))}
  ${part('ECCM\u2019s account', fix('Account', ACCOUNT))}
  ${part('Domain and mail', fix('Domain and mail', DOMAIN))}
  ${part('Väin', fix('Väin', VAIN))}
  ${part('To ask', two('To ask', 'Whom', 'What', ASK))}`,
});
