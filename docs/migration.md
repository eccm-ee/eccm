# Migration

Moving eccm.ee onto this site. Measured on 7 October 2026. Each task says who does it: **ECCM**, or **agent**, meaning someone at ECCM gives the prompt to a coding agent working in this repository.

## Decisions

| What | Decided |
| --- | --- |
| Radio | Removed from the site for now, kept in git so it can come back in about an hour. |
| Newsletter | Needed at launch. The last issue took a week by hand. |
| Calendar | Members add events one at a time today. Each language gets a feed to subscribe to once. |
| Domain | eccm.ee is replaced directly, since the current site is a test too. uus.eccm.ee is optional. |
| Events | Everything to the end of 2026 is entered on eccm.ee. A few dates will change. |
| Admin | Open for now, closed soon. |

## Who does what

| Task | Who | State |
| --- | --- | --- |
| [Noindex on every page until cutover](#noindex-on-every-page-until-cutover) | Agent | Done |
| [Redirects from the old Joomla addresses](#redirects-from-the-old-joomla-addresses) | Agent | Done |
| [Contact form](#contact-form) | Agent | Done |
| [Privacy notice](#privacy-notice) | ECCM approves, agent drafted | Draft live |
| [EU emblem on Ulysses](#eu-emblem-on-ulysses) | Agent | Done |
| [Search basics](#search-basics) | Agent | Done |
| [Login on admin and editing](#login-on-admin-and-editing) | Agent, ECCM adds the people | Before or right after cutover |
| [Backups](#backups) | Agent | Done |
| [Remove the radio, keep it restorable](#remove-the-radio-keep-it-restorable) | Agent | Done |
| [Research pages to git history](#research-pages-to-git-history) | Agent | Done |
| [Missing events, dates and times](#2-content) | ECCM | Ask |
| [Import the archive](#import-the-archive) | Agent | To do |
| [Copy /nan/](#copy-nan) | Agent | Later |
| [Create the Cloudflare account](#create-the-cloudflare-account) | ECCM | Ask |
| [Set up production](#set-up-production) | Agent | After the account |
| [Email sending from eccm.ee](#email-sending-from-eccm-ee) | ECCM | After the zone move |
| [Take a full backup first](#take-a-full-backup-first) | ECCM | Ask |
| [Move the DNS to Cloudflare](#move-the-dns-to-cloudflare) | ECCM | To do |
| [Cutover](#cutover) | ECCM, with the agent ready | To do |
| [After](#after) | ECCM | After |
| [A feed in his importer's shape](#a-feed-in-his-importer-s-shape) | Agent builds, Tarmo switches | Ask Tarmo |
| [His files after cutover](#his-files-after-cutover) | Agent, ECCM adds the alias in cPanel | To do |

## Order

1. **Staging:** the site tasks below, on [staging](https://eccm-staging.kristjan-jansen.workers.dev/).
2. **Content:** the missing events, the archive, the changed dates.
3. **ECCM's account:** Cloudflare account, Workers Paid, production, data copied.
4. **Zone move:** eccm.ee's DNS to Cloudflare, every record pointing where it does today. Nobody sees a change.
5. **Cutover:** eccm.ee and www to the Worker.
6. **After:** two weeks of watching, admin closed, Joomla hosting cancelled with mail kept.

Every agent prompt assumes the agent reads `CLAUDE.md` first, which has the run, deploy and push commands.

## 1. Staging

### Noindex on every page until cutover

**Who:** agent. **State:** to do.

Staging pages can be found by search engines today: the header in `public/_headers` reaches only static files, and every page is made by the Worker. The Worker sends it instead, behind a setting that is off on eccm.ee.

```jsonc
// wrangler.jsonc, env.staging.vars
"NOINDEX": "on"
```

```js
// src/index.mjs, where the Worker returns its response
if (env.NOINDEX === 'on') res.headers.set('x-robots-tag', 'noindex');
```

**Check**

```sh
curl -sI https://eccm-staging.kristjan-jansen.workers.dev/ | grep -i x-robots
curl -sI https://eccm-staging.kristjan-jansen.workers.dev/et/sundmused | grep -i x-robots
```

**Prompt**

```text
In eccm, every page the Worker renders must carry `x-robots-tag: noindex` while
the site is on staging. Add a var NOINDEX ("on" in env.staging, absent in
production) and set the header on every response leaving the fetch handler,
including redirects and 404s, in one place, not per route. Remove the
per-route noindex headers that become redundant. Verify with curl -sI on /,
an event page and /docs, then deploy staging and push.
```

### Redirects from the old Joomla addresses

**Who:** agent. **State:** done, in `src/redirects.mjs`. Misses are counted in the `redirect_miss` table.

Google has eccm.ee's events under three address shapes, and they all answer 404 here. The old ids are already stored: `event_text.legacy_id` per language, `page_text.legacy_path` per page. The design is in `plans/plan-eccm-urls-sitemap-rss.md` section 3, but its event pattern misses one live shape.

```js
// every event shape: /index.php/{lang}/[up to two menu segments, each starting with a letter/]{id}-{alias}[/{date}]
const OLD_EVENT = /^\/index\.php\/(et|en)\/(?:[a-z][a-z0-9-]*\/){0,2}(\d+)(?:-[^/]*)?(?:\/\d{4}(?:-\d\d){4})?\/?$/;
```

| Old | New |
| --- | --- |
| an event, any of the shapes above | the event, by `(lang, legacy_id)` |
| a page | by `legacy_path` |
| `?format=feed&type=rss` | `/et/feed.xml` |
| `?layout=vcal` on an event | that event's `.ics` |
| `?page=`, `?filter_*`, `?iccaldate` | the event list |
| `/images/...` | the picture with the same file name |
| `/administrator/`, `/component/users/` | 410 |
| anything else under `/index.php` | logged in `redirect_miss`, then the front page |

**Check**

```sh
B=https://eccm-staging.kristjan-jansen.workers.dev
for p in /index.php/et/ /index.php/et/syndmusest/122-x /index.php/en/eventseng/past-events/123-y/2026-05-14-19-00 /index.php/et/eccm/kontakt; do
  curl -s -o /dev/null -w "%{http_code} %{redirect_url}  $p\n" "$B$p"
done
```

**Prompt**

```text
In eccm, implement the Joomla redirects of plans/plan-eccm-urls-sitemap-rss.md
section 3, with the event pattern in docs/migration.md (it allows zero to two
menu segments before the id). One 301 hop each, looked up in D1 by
(lang, legacy_id) and page_text.legacy_path. Add a redirect_miss table in a new
migration (path, count, last_seen) and log every /index.php path that matches
nothing. 410 for Joomla's login paths. Test against a list of at least 30 real
old URLs taken from eccm.ee's list pages, report hits and misses, then deploy
staging and push.
```

### Contact form

**Who:** agent. **State:** to do.

The footer's Kirjuta meile links to Joomla's form, gone after cutover. A form on the site: the Worker stores the message and mails it to the office through the email binding the newsletter already uses, with Reply-To set to the sender, so answering is pressing Reply. Turnstile keeps bots out without a puzzle for most people. info@eccm.ee is printed beside it.

```js
// sketch: src/contact.mjs
const ok = await turnstile(env, form.get('cf-turnstile-response'), ip);
await env.DB.prepare('INSERT INTO contact (name, email, message) VALUES (?, ?, ?)').bind(name, email, message).run();
await env.EMAIL.send({ to: env.CONTACT_TO, from: env.MAIL_FROM, replyTo: email, subject: `Kontakt: ${name}`, text: message });
```

**Prompt**

```text
In eccm, add a contact page at /et/kontakt and /en/contact: name, email,
message, posted to the Worker without JavaScript required. Verify Cloudflare
Turnstile server-side (siteverify), store the message in a new D1 table, and
send it through the existing EMAIL binding and src/mail.mjs outbox to the
address in a new var CONTACT_TO, with Reply-To the sender. Print info@eccm.ee
beside the form. Replace the footer's Kirjuta meile / Write to us link in
src/render/mark.mjs with the new page. Load the eccm-ui and positron-compose
skills first. Check at 375 and 1280, deploy staging, push.
```

### Privacy notice

**Who:** ECCM writes, agent builds. **State:** to do.

The site collects newsletter addresses, contact messages and push subscriptions, so it needs a privacy notice in both languages. See Privacy and consent below for what it has to say.

**Prompt**

```text
In eccm, add privacy pages at /et/andmekaitse and /en/privacy from the text
ECCM provides, as D1 pages like the other text pages, link them from the
footer, and add the registry code 80603988 to the footer's copyright line.
Check at 375 and 1280, deploy staging, push.
```

### EU emblem on Ulysses

**Who:** agent. **State:** to do.

Creative Europe requires the Co-funded by the European Union emblem on the Ulysses page. eccm.ee shows it, the rework has only the sentence.

**Prompt**

```text
In eccm, add the official "Co-funded by the European Union" emblem (SVG from
the EU's visual identity download page, kept under public/partners/ with a
SOURCE.md line) to the Ulysses page in both languages, at the size the EU
guidelines give for web. Check at 375 and 1280, deploy staging, push.
```

### Search basics

**Who:** agent. **State:** to do.

No structured event data, no Sitemap line in robots.txt, and the site address is taken from each request, so staging pages name staging as their own address.

```json
{ "@context": "https://schema.org", "@type": "MusicEvent",
  "name": "...", "startDate": "2026-11-01T17:30:00+02:00",
  "location": { "@type": "Place", "name": "...", "address": "Pühavaimu 9, Tallinn" },
  "organizer": { "@type": "Organization", "name": "Eesti Nüüdismuusika Keskus", "url": "https://eccm.ee/" } }
```

```text
# public/robots.txt
User-agent: *
Sitemap: https://eccm.ee/sitemap.xml
```

**Prompt**

```text
In eccm, add schema.org MusicEvent JSON-LD to every event page (offers with
the ticket URL when there is one) and an Organization block on both front
pages (legalName MTÜ Eesti Nüüdismuusika Keskus, identifier 80603988, sameAs
Facebook, Instagram, the Fienta organiser page). Add public/robots.txt naming
the sitemap. Replace useOrigin(url.origin) with a SITE_ORIGIN var so canonical
and og:url name eccm.ee in production. Validate one event in Google's Rich
Results Test, deploy staging, push.
```

### Login on admin and editing

**Who:** agent, ECCM adds the people. **State:** before or right after cutover.

Anyone can edit events and upload pictures today. Cloudflare Access puts a login by emailed code in front of `/admin`, `/edit`, `/files` and `/docs`, with nothing to build in the Worker.

**Prompt**

```text
In eccm, write the steps to put Cloudflare Access (one-time PIN by email) in
front of /admin*, /edit*, /items*, /files* and /docs* on the production zone,
then remove OPEN_UPLOADS and any code that only existed because editing was
open. Do not apply Access yourself: give ECCM the dashboard steps and the
list of paths.
```

### Backups

**Who:** agent. **State:** to do.

Cloudflare keeps 7 days of database history (30 on Workers Paid), and nothing if the database or the account is deleted. The site's existing five-minute cron, once a day, writes every table into a separate bucket and keeps 30 days. Not into git, since the database holds subscribers' addresses. Pictures need none: they are stored by content hash and never overwritten.

```js
// sketch: in scheduled(), once a day
for (const t of TABLES) out[t] = (await env.DB.prepare(`SELECT * FROM ${t}`).all()).results;
await env.BACKUP.put(`d1/${day}.json`, JSON.stringify(out));
```

**Prompt**

```text
In eccm, add a daily backup: on the existing cron, once per UTC day, read
every D1 table and write one JSON file to a new R2 bucket bound as BACKUP
(d1/YYYY-MM-DD.json), delete files older than 30 days, and add a restore
script under tools/ that turns one file back into INSERTs. Test a restore into
the local database. Deploy staging, push.
```

### Remove the radio, keep it restorable

**Who:** agent. **State:** done 7 October 2026, the tag `radio-last`, the restore steps in `archive/radio.md`.

The radio is the station, the recorder, the files Worker and `/radio`. Removing its Durable Objects destroys their state, so the state is saved first. The 46 MB of audio stays in its bucket, free.

```sh
B=https://eccm-staging.kristjan-jansen.workers.dev
curl -s $B/stream/channels.json > archive/radio/channels.json
curl -s $B/radio/state.json > archive/radio/state.json
git tag radio-last && git push origin radio-last
```

To bring it back: `git checkout radio-last -- src/station src/radio.mjs src/files.mjs workers/files ...`, a new migration tag with `new_sqlite_classes` for Schedule, Library and Radio, the secrets `STATION_TOKEN` and `FILES_TOKEN`, deploy `workers/files` first, then load the JSON.

**Prompt**

```text
In eccm, remove the radio from the site and keep it restorable. First save
/stream/channels.json, each channel's schedule.json and /radio/state.json from
staging into archive/radio/, and tag the current commit radio-last. Then remove
the station, recorder, files routes, the Radio card, workers/files, their
bindings and cron calls, and add a deleted_classes migration for Schedule,
Library and Radio. Keep the bucket eccm-files-staging. Write archive/radio.md:
what it was, the tag, and the exact restore steps. Deploy staging, push the tag
and the commit.
```

### Research pages to git history

**Who:** agent. **State:** done 7 October 2026, the tag `research-last`.

`/type`, `/derive`, `/icons` and `/admin/research` are not needed by the site. `/logo`, `/ds` and `/social` stay in Admin.

**Prompt**

```text
In eccm, tag the current commit research-last, then remove /type, /derive,
/icons and /admin/research with their files, routes, cards and the fonts only
they use (check each font is used nowhere else first). Keep public/scheme.mjs,
which the editor uses. Add one line per page to archive/README.md naming the
tag. Deploy staging, push the tag and the commit.
```

## 2. Content

| Problem | Solution | Who | State |
| --- | --- | --- | --- |
| TUMA AFEKT festivalil 1.11 17:30 and in Tartu 2.11 19:00 are on eccm.ee, not here. | Add them in the event editor. | ECCM | To do |
| Up to three / Kuni kolm, 5.12, is here but gone from eccm.ee. | Say whether it moved or was cancelled. | ECCM | Ask |
| Üle Heli (00:00), Koosloome (14.11 11:00) and Schönberg (8.12 18:00) have times eccm.ee does not print. | Confirm each. | ECCM | Ask |
| Feldman has no English text here. | Copy it from eccm.ee in the editor. | ECCM | To do |
| A few dates will change. | Edit them here once known. | ECCM | Waiting |
| 2027 placeholders, empty news, Residentuurid, duplicates on eccm.ee. | Leave them behind. | Nobody | Decided |

### Import the archive

**Who:** agent. **State:** to do.

About 99 Estonian and 91 English past events since 22.09.2024, plus 20 from early 2026, with 76 pictures. Best from the cPanel Full Backup's database, otherwise from the public pages.

**Prompt**

```text
In eccm, import eccm.ee's past events from 22.09.2024 on into D1, both
languages, with their legacy ids so the redirects find them. Source: the
Joomla database in the cPanel Full Backup if ECCM has provided it (iCagenda's
table), else the public list and event pages. Pictures go to R2 through the
same path the editor's upload uses (content hash keys, a media row with alt
text). Skip the 2027 Schönberg placeholders and the 2021 duplicates 67 and 68.
Write a seed file per batch, apply locally, compare counts per year with
eccm.ee's lists, then apply to staging. Report what was skipped and why.
```

### Copy /nan/

**Who:** agent. **State:** to do.

[eccm.ee/nan](https://eccm.ee/nan/) is one hand-made HTML file, 547 KB, its five pictures inside it. It loads Google Fonts, which sends visitors' addresses to Google, so its fonts come from the site when copied.

**Prompt**

```text
In eccm, copy https://eccm.ee/nan/ to public/nan/index.html unchanged except:
serve its IBM Plex Sans, IBM Plex Mono and Archivo Black from public/vendor/
(OFL, licence beside each) instead of Google Fonts, and give it a title and
meta description that say it is an ECCM initiative. Check it renders the same
at 375 and 1280 as the original, deploy staging, push.
```

## 3. ECCM's account

### Create the Cloudflare account

**Who:** ECCM. **State:** ask.

1. Sign up at [dash.cloudflare.com](https://dash.cloudflare.com/sign-up) with an ECCM address, not a person's own.
2. Invite a second admin from ECCM, and the developer, under Manage Account, Members.
3. Subscribe to Workers Paid, $5 a month: the newsletter can then send to any address, and the database keeps 30 days of history.

### Set up production

**Who:** agent. **State:** after the account.

```sh
npx wrangler d1 create eccm --env production
npx wrangler d1 migrations apply eccm --remote --env production
npx wrangler r2 bucket create eccm-media --env production
npx wrangler d1 export eccm-staging --remote --env staging --output /tmp/eccm.sql --no-schema
npx wrangler d1 execute eccm --remote --env production --file /tmp/eccm.sql
npx wrangler secret put VAPID_JWK --env production
```

**Prompt**

```text
In eccm, fill in env.production in wrangler.jsonc for ECCM's account (its
account_id, the D1 id, the media bucket, routes eccm.ee and www.eccm.ee as
custom domains, IMAGE_TRANSFORMS on, NOINDEX absent, MAIL_FROM
uudiskiri@eccm.ee, SITE_ORIGIN https://eccm.ee). Replace the three hardcoded
eccm.positron.studio addresses (src/index.mjs, src/render/editor.mjs,
src/station/station.mjs if the station is still there) with config. Create the
database and bucket, apply migrations, copy the data without the schema, copy
the media/ prefix of the bucket, reuse the staging VAPID key so subscribed
phones stay subscribed. Do not deploy routes until ECCM says the zone is active.
```

### Email sending from eccm.ee

**Who:** ECCM. **State:** after the zone move.

1. In the dashboard, Email, Email Sending, add eccm.ee.
2. Add the records it lists. They go beside the existing mail records: never touch MX, and never turn on Email Routing for eccm.ee, which replaces MX.
3. Send a test issue to yourself from `/edit/uudiskiri`.

## 4. Domain and mail

eccm.ee is ECCM's (registry code 80603988) until 18.03.2027. Registrar, DNS, hosting and mail are all [Virtuaal.com](https://www.virtuaal.com/): cPanel at 185.169.68.37, mail on its Exim at mail.eccm.ee. DNSSEC is off.

| Record | Value today |
| --- | --- |
| A eccm.ee | 185.169.68.37 |
| CNAME www | eccm.ee |
| MX | 0 mail.eccm.ee |
| TXT eccm.ee | v=spf1 a mx include:_spf.virtuaal.com ~all |
| TXT _dmarc | v=DMARC1;p=reject;... |
| TXT default._domainkey | the DKIM key, 2048 bit |
| cPanel names | mail, webmail, cpanel, whm, webdisk, ftp, autodiscover, autoconfig, cpcalendars, cpcontacts |

### Take a full backup first

**Who:** ECCM. **State:** ask.

The old hosting can hold files nobody links to, and the archive's best source is Joomla's database. Neither is visible from outside.

1. Log in to cPanel at Virtuaal.
2. Files, Backup, Download a Full Account Backup.
3. Keep the archive, and give the developer the database dump from it.

### Move the DNS to Cloudflare

**Who:** ECCM. **State:** to do.

DMARC is set to reject, so one wrong mail record bounces everything. Every record is recreated by hand, unproxied (grey cloud: the name points straight at Virtuaal and Cloudflare stays out of the way).

1. A day ahead, lower the TTLs in cPanel's Zone Editor to 300.
2. Export the zone from cPanel's Zone Editor.
3. Add eccm.ee to ECCM's Cloudflare account on the Free plan.
4. Recreate every record, grey cloud, still pointing at Virtuaal. Copy the DKIM key as one exact string.
5. Compare: `dig +short MX eccm.ee @<cloudflare-ns>` and the same for each record against Virtuaal's answers.
6. In Virtuaal's registrar panel, change the nameservers to the two Cloudflare names.
7. Check that mail still arrives and leaves. The site has not changed.

### Cutover

**Who:** ECCM, with the agent ready. **State:** to do.

1. Delete the A record for eccm.ee and the CNAME for www.
2. Deploy production, which attaches eccm.ee and www.eccm.ee to the Worker.
3. Turn on Image Transformations for the zone.
4. Check: the front page, an event, an old Joomla address, the newsletter sign-up.
5. To go back: recreate the A and CNAME records. Minutes.

### After

**Who:** ECCM. **State:** after.

1. Two weeks later, check that mail and webmail renewed their certificates, since the wildcard can no longer renew through Virtuaal's DNS.
2. Before cancelling the Joomla hosting, ask Virtuaal whether mail survives it. Mail runs on the same server.

### A preview address first?

Not needed: the current site is a test too. If wanted, uus.eccm.ee can work before the zone move through [Cloudflare for SaaS](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/) on positron.studio, with one CNAME at Virtuaal.

## 5. Väin

[Väin](https://github.com/tarmoj/radio1965) is U:'s app, by Tarmo Johannes. The app never calls eccm.ee: his server polls eccm.ee's Joomla API every 5 minutes for category 47, and opens `/content/articles/{id}` when an article is tapped. That API ends at cutover. His pages `/radio1965/contributor`, `/radio1965/editor` and the recordings in `/radio/streams` are files in eccm.ee's hosting.

### A feed in his importer's shape

**Who:** agent builds, Tarmo switches. **State:** ask Tarmo.

```json
{ "items": [ { "id": "eccm-27", "title": "...", "summary": "...", "url": "https://eccm.ee/et/sundmused/...",
  "publish_at": "2026-11-20T19:00:00", "tags": ["..."], "html": "<p>...</p>" } ] }
```

**Prompt**

```text
In eccm, add GET /api/radio1965/articles.json: public, CORS *, Cache-Control
max-age=60, an ETag, listing published events (and later notices) in the shape
in docs/migration.md, newest first. Read tarmoj/radio1965's
server/joomla_importer.py to match the fields it maps. Write the 30-line change
his importer needs as a patch file for Tarmo, do not open a PR on his repo.
```

### His files after cutover

**Who:** agent, ECCM adds the alias in cPanel. **State:** to do.

The old server keeps a second name, old.eccm.ee, that points straight at it, and the Worker passes `/radio1965/*` and `/radio/streams/*` through to it until he moves them.

```js
if (p.startsWith('/radio1965/') || p.startsWith('/radio/streams/'))
  return fetch(new URL(p + url.search, 'https://old.eccm.ee'), request);
```

## Privacy and consent

| Problem | Solution | Who | State |
| --- | --- | --- | --- |
| Does the site need a cookie banner? | No. It sets no cookies. The only thing kept in the browser is the theme a visitor picks, their own choice. | Nobody | Done |
| Analytics. | [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/): no cookies, counts only, so no consent. Never Google Analytics or the Meta pixel, which would need a banner. | ECCM turns it on | After migration |
| Third parties. | None on the site: no outside scripts, fonts from the site itself. /nan/'s Google Fonts move to the site, Konkursid's YouTube embed uses youtube-nocookie.com or loads on click. | Agent | To do |
| Personal data: newsletter, contact, push. | A privacy notice per language (GDPR article 13): who is responsible, what and why, how long, Cloudflare as processor, rights, complaints to the [Data Protection Inspectorate](https://www.aki.ee/). | ECCM writes, agent builds | To do |
| Proof of consent. | Double opt-in and one-click unsubscribe on the newsletter, the browser's own permission for push. | Nobody | Done |
| Processor agreement. | Cloudflare's [Data Processing Addendum](https://www.cloudflare.com/cloudflare-customer-dpa/) is part of its terms, nothing to sign. | ECCM | At account setup |
| EULA or terms of use. | A website needs no EULA, terms are optional unless ECCM sells online. | Nobody | Decided |
| Accessibility. | Estonia's rules bind public bodies, not an NGO, but build to WCAG 2.2 AA anyway. | Agent | Ongoing |

This is a reading of the rules, not legal advice. ECCM approves the privacy text.

## To ask

- **ECCM:** who holds the Virtuaal login. Whether mail stays at Virtuaal and who runs the mailboxes. A Cloudflare account of their own, and who pays $5 a month. Whether a subscriber list exists and may be imported. Whether Search Console is verified, and by whom. The privacy text. The changed dates, the three times, Kuni kolm.
- **Tarmo:** what category 47 is. Whether he takes the new feed. Whether old joomla_ ids must keep working. Where his files go. A webhook instead of the poll.

## Links

| Site | What |
| --- | --- |
| [eccm.ee](https://eccm.ee/) | The site today, Joomla at Virtuaal |
| [Staging](https://eccm-staging.kristjan-jansen.workers.dev/) | This site before cutover |
| [Business register](https://ariregister.rik.ee/est/company/80603988) | MTÜ Eesti Nüüdismuusika Keskus, 80603988 |
| [Virtuaal.com](https://www.virtuaal.com/) | Registrar, DNS, hosting and mail for eccm.ee |
| [Väin](https://github.com/tarmoj/radio1965) | U:'s app and its server code |
| [Workers custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) | eccm.ee and www on the Worker |
| [Durable Object migrations](https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/) | What removing the radio does to its state |
| [Email Service](https://developers.cloudflare.com/email-service/) | Sending the newsletter from eccm.ee |
| [Image transformations](https://developers.cloudflare.com/images/transform-images/) | Resizing pictures on the zone |
| [D1 Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/) | Cloudflare's own database history |
| [Access](https://developers.cloudflare.com/cloudflare-one/policies/access/) | The login in front of admin and editing |
| [Turnstile](https://developers.cloudflare.com/turnstile/) | Keeping bots off the contact form |
