# Migration

Moving eccm.ee onto this site. Measured on 7 October 2026. Each task says who does it: **ECCM**, or **agent**, meaning someone at ECCM gives the prompt to a coding agent working in this repository.

## Decisions

| What | Decided |
| --- | --- |
| Radio | Not on this site: the radio and Väin live in [v2in](https://v2in.stream/). |
| Newsletter | Needed at launch. The last issue took a week by hand. |
| Calendar | Members add events one at a time today. Each language gets a feed to subscribe to once. |
| Domain | eccm.ee is replaced directly, since the current site is a test too. uus.eccm.ee is optional. |
| Events | Everything to the end of 2026 is entered on eccm.ee. A few dates will change. |
| Admin | Behind ECCM's one editor key since 6 November 2026, the secret `EDITOR_KEY`. |

## 1. Staging

The site tasks, on [staging](https://eccm-staging.kristjan-jansen.workers.dev/). Every agent prompt assumes the agent reads `CLAUDE.md` first, which has the run, deploy and push commands.

### Noindex on every page until cutover

**Who:** agent. **State:** done, the `NOINDEX` var on staging and one header for every response.

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
an event page and /admin, then deploy staging and push.
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
section 3, with the event pattern in plans/plan-eccm-migration.md (it allows zero to two
menu segments before the id). One 301 hop each, looked up in D1 by
(lang, legacy_id) and page_text.legacy_path. Add a redirect_miss table in a new
migration (path, count, last_seen) and log every /index.php path that matches
nothing. 410 for Joomla's login paths. Test against a list of at least 30 real
old URLs taken from eccm.ee's list pages, report hits and misses, then deploy
staging and push.
```

### Contact form

**Who:** agent. **State:** done, at /et/kontakt and /en/contact, mail arrives once info@eccm.ee is a verified address or the account is on Workers Paid.

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

**Who:** agent, ECCM approves. **State:** done, at /et/andmekaitse and /en/privacy.

**Ask ECCM:** approve the text, or send corrections.

The site collects newsletter addresses and contact messages, so it needs a privacy notice in both languages. See Privacy and consent below for what it has to say.

**Prompt**

```text
In eccm, add privacy pages at /et/andmekaitse and /en/privacy from the text
ECCM provides, as D1 pages like the other text pages, link them from the
footer, and add the registry code 80603988 to the footer's copyright line.
Check at 375 and 1280, deploy staging, push.
```

### EU emblem on Ulysses

**Who:** agent. **State:** done.

Creative Europe requires the Co-funded by the European Union emblem on the Ulysses page. eccm.ee shows it, the rework has only the sentence.

**Prompt**

```text
In eccm, add the official "Co-funded by the European Union" emblem (SVG from
the EU's visual identity download page, kept under public/partners/ with a
SOURCE.md line) to the Ulysses page in both languages, at the size the EU
guidelines give for web. Check at 375 and 1280, deploy staging, push.
```

### Search basics

**Who:** agent. **State:** done, MusicEvent and Organization data, `/robots.txt`, `SITE_ORIGIN`.

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

**Who:** agent. **State:** done on staging, the one editor key in `src/auth.mjs`.

ECCM has one key, shared by everyone who edits, typed once at `/login`, then a cookie for 90 days. It guards `/admin`, `/edit`, `/ds`, `/logo` and `/social`; everything else stays public. Ten wrong keys an hour from one address, then a wait. Saves write ECCM in `updated_by`.

The key is the secret `EDITOR_KEY`, in the form `xxxx-xxxx-xxxx`. Make one and set it; to change it, put a new one the same way, which logs every browser out:

```sh
node -e "const a='0123456789abcdefghjkmnpqrstvwxyz',r=require('crypto').randomInt;console.log([0,0,0].map(()=>[0,0,0,0].map(()=>a[r(32)]).join('')).join('-'))"
npx wrangler secret put EDITOR_KEY --env staging   # paste the key printed above
```

**Check**

```sh
curl -sI https://eccm-staging.kristjan-jansen.workers.dev/admin | grep -i location   # /login?next=%2Fadmin
```

### Backups

**Who:** agent. **State:** done, daily into `eccm-backup-staging`, restore with `tools/restore.mjs`.

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

**Who:** agent. **State:** done 7 October 2026, the tag `radio-last`, the restore steps in v2in's `archive/eccm-radio/radio.md` since 6 November 2026 (here under the tag `radio-archive`).

The radio is the station, the recorder, the files Worker and `/radio`. Removing its Durable Objects destroys their state, so the state is saved first. The 46 MB of audio stayed in the bucket `eccm-files-staging` until 3 November 2026, then moved to `v2in-media/eccm-radio/` and the bucket was deleted.

```sh
B=https://eccm-staging.kristjan-jansen.workers.dev
curl -s $B/stream/channels.json > archive/radio/channels.json
curl -s $B/radio/state.json > archive/radio/state.json
git tag radio-last && git push origin radio-last
```

To bring it back: the code from the tag `radio-last`, the saved state from the tag `radio-archive` (or v2in's `archive/eccm-radio/`), the audio from `v2in-media/eccm-radio/` into a new bucket, and the steps in v2in's `archive/eccm-radio/radio.md`.

**Prompt**

```text
In eccm, remove the radio from the site and keep it restorable. First save
/stream/channels.json, each channel's schedule.json and /radio/state.json from
staging into archive/radio/, and tag the current commit radio-last. Then remove
the station, recorder, files routes, the Radio card, workers/files, their
bindings and cron calls, and add a deleted_classes migration for Schedule,
Library and Radio. Write archive/radio.md:
what it was, the tag, and the exact restore steps. Deploy staging, push the tag
and the commit.
```

### Remove the notices to phones

**Who:** agent. **State:** done 6 November 2026, `archive/notices.md`, the tag `notices-last`.

`/items`, `/teated/{n}`, `/en/notices/{n}`, the Items Durable Object, Web Push and the Luba teated bar. ECCM never asked for them, and their Väin use went to v2in. The class is deleted by the tag `v5` in `wrangler.jsonc`, which empties staging's object: two test notices, kept by title in the archive note, and the push subscriptions.

The privacy pages' notices section (4. Teated, 4. Notifications) was taken out the same day, on staging and in `data/seed-step8-privacy.sql`, and the sections after it renumbered.

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

The missing events, the archive, the changed dates.

### Missing events, dates and times

**Who:** ECCM. **State:** ask.

**Ask ECCM:** the dates that will change, the three times below, and whether Kuni kolm on 5.12 is still on.

| Problem | Solution | Who | State |
| --- | --- | --- | --- |
| TUMA AFEKT festivalil 1.11 17:30 and in Tartu 2.11 19:00 were on eccm.ee, not here. | Imported with the archive. | Agent | Done |
| Up to three / Kuni kolm, 5.12, is here but gone from eccm.ee. | Say whether it moved or was cancelled. | ECCM | Ask |
| Üle Heli (00:00), Koosloome (14.11 11:00) and Schönberg (8.12 18:00) have times eccm.ee does not print. | Confirm each. | ECCM | Ask |
| Feldman had no English text here. | Imported with the archive. | Agent | Done |
| A few dates will change. | Edit them here once known. | ECCM | Waiting |
| 2027 placeholders, empty news, Residentuurid, duplicates on eccm.ee. | Leave them behind. | Nobody | Decided |

### Existing subscribers

**Who:** ECCM pastes the list. **State:** built; the owner said the list is the existing one ECCM writes to, so confirmed (6 November 2026: "use confirmed. its existing list").

At `/edit/uudiskiri/tellijad`, paste the To or BCC field of the last mail as it is, pick the language and press Check, then Add. The new addresses become confirmed subscribers marked as imported, with no mail sent; addresses already subscribed or unsubscribed are skipped. The same page lists everyone and removes one, which unsubscribes them so a later paste does not add them back. `tools/clear-test-rows.mjs` keeps imported rows when the content moves to production.

### Import the archive

**Who:** agent. **State:** done, 60 past events since 22.09.2024 with 36 pictures, in `data/seed-step10-archive-*.sql`.

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

**Who:** agent. **State:** later.

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

Cloudflare account, Workers Paid, production, the data copied.

### Create the Cloudflare account

**Who:** ECCM. **State:** the account exists since 7 November 2026; the members and Workers Paid to confirm.

1. Sign up at [dash.cloudflare.com](https://dash.cloudflare.com/sign-up) with an ECCM address, not a person's own.
2. Invite a second admin from ECCM, and the developer, under Manage Account, Members.
3. Subscribe to Workers Paid, $5 a month: the newsletter can then send to any address, and the database keeps 30 days of history.

### Set up production

**Who:** agent. **State:** steps 1 to 3 done on 7 November 2026: ECCM's account_id and the database `eccm` (`ffdd830e-81a4-427a-9dc2-c3543e49df64`, EEUR) are in `env.production`, all migrations applied, and the content copied without staging's test rows (95 events, 190 texts, 38 credits, 70 media rows, 7 pages, 12 page texts, 11 roles, 5 logos, the same counts as staging). Steps 2 and 4 done the same night once R2 was on: the buckets `eccm-media` and `eccm-backup`, the secrets `EDITOR_KEY` (a new key, given to the owner) and `SESSION_SECRET`, and the 9 uploaded pictures under `media/` copied. Step 5 done: live at https://eccm.eccm.workers.dev/ (the account's subdomain `eccm`), the front pages, the events list, an event, a text page, robots.txt, the contact page, an uploaded picture, a logo and the login all answer, canonical names https://eccm.ee/. Since 8 November 2026 it counts page views (/admin/stats, src/stats.mjs): the Analytics Engine dataset `eccm_views` made in ECCM's dashboard, and the secret `STATS_TOKEN`, an account token with Account Analytics: Read. Turnstile is not set; the contact form works without it.

One prompt does it all: the agent runs the commands below in this order and checks each step. ECCM only has to be logged in to its own Cloudflare account in the terminal (`npx wrangler login`).

```text
In eccm, set up production in ECCM's Cloudflare account; do not deploy to
eccm.ee until ECCM says the zone is active. Every wrangler command runs as
env -u CF_API_TOKEN -u CLOUDFLARE_API_TOKEN npx wrangler ... (CLAUDE.md, Deploy).

1. npx wrangler whoami, and put that account id in env.production's
   account_id in place of FILL-ECCM-ACCOUNT-ID. Never leave it empty:
   wrangler drops an empty one and deploys to staging's account.
2. Create the resources and the secrets, checking each:
   npx wrangler d1 create eccm --env production          (put its database_id in env.production's d1_databases)
   npx wrangler d1 migrations apply eccm --remote --env production
   npx wrangler r2 bucket create eccm-media
   npx wrangler r2 bucket create eccm-backup
   npx wrangler secret put EDITOR_KEY --env production          (a new key, made as in Login on admin and editing, handed to ECCM privately)
   npx wrangler secret put SESSION_SECRET --env production      (a new random value, openssl rand -hex 32)
   npx wrangler secret put TURNSTILE_SITEKEY --env production   (a Turnstile widget in ECCM's account for eccm.ee and the workers.dev address)
   npx wrangler secret put TURNSTILE_SECRET --env production    (the same widget's secret, for the contact form)
3. Move the content without staging's test rows (subscribers other than the imported list, drafts,
   outbox, contact messages, redirect misses and login failures), with
   tools/clear-test-rows.mjs:
   npx wrangler d1 export eccm-staging --remote --env staging --no-schema --output tmp/staging.sql
   node tools/clear-test-rows.mjs tmp/staging.sql tmp/production.sql
   npx wrangler d1 execute eccm --remote --env production --file tmp/production.sql
4. Copy what staging holds in its media bucket under media/ (uploaded
   pictures) to eccm-media; og/ is a cache and rebuilds itself. The event
   pictures under public/ deploy with the site.
5. npx wrangler deploy --env production, to the workers.dev address only
   (routes stay commented out), and check: the front page in both
   languages, an event, /robots.txt, a login, the contact form.
   Mail from uudiskiri@eccm.ee works only after Email sending from eccm.ee.
Report the account, ids and what was copied, with row counts against staging.
```

What the throwaway deploy found:

- `env.production` has its own `"migrations": []`. Wrangler takes a list per environment, and the empty one replaces the top-level list, which is staging's history. The new Worker got no Durable Object at all.
- Replaying staging's tags on a new Worker works too: v1 to v4, the radio's classes made and deleted in one upload, were accepted. The empty list is the plainer of the two.
- Staging dropped Items on 6 November 2026 with a `deleted_classes: ["Items"]` tag, `v5`, on the top-level list. Production's empty list is untouched by it, and a class production needs later starts its own tags there.
- On an empty database `/` shows "Ühtegi tulevast sündmust ei ole." and `/en/` "No upcoming events.", both 200. `/robots.txt` names `https://eccm.ee/sitemap.xml`. On workers.dev the pictures are the originals, since `/cdn-cgi/image/` exists only on a zone.

### Email sending from eccm.ee

**Who:** ECCM. **State:** after the zone move.

1. In the dashboard, Email, Email Sending, add eccm.ee.
2. Add the records it lists. They go beside the existing mail records and leave MX alone; Email Routing, which replaces MX, comes later in [Mail to Cloudflare](#mail-to-cloudflare-gmail-as-the-interface).
3. Send a test issue to yourself from `/edit/uudiskiri`.

## 4. Domain and mail

The zone move first: eccm.ee's DNS to Cloudflare with every record pointing where it does today, so nobody sees a change. Then the cutover, eccm.ee and www to the Worker, and two weeks of watching.

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

**Ask ECCM:** who holds the Virtuaal login (registrar, cPanel and mail are probably one account). Answered 7 November 2026: the owner has ECCM's Virtuaal client account (MTÜ Eesti Nüüdismuusika Keskus), which holds eccm.ee and also v2in.stream.

The old hosting can hold files nobody links to, and the archive's best source is Joomla's database. Neither is visible from outside.

1. Log in to cPanel at Virtuaal.
2. Files, Backup, Download a Full Account Backup.
3. Keep the archive, and give the developer the database dump from it.

### Move the DNS to Cloudflare

**Who:** ECCM, or the owner in their Virtuaal and Cloudflare accounts. **State:** to do. On 7 November 2026 eccm.ee's nameservers at Virtuaal are `ns1.virtuaal.com`, `ns2.virtuaal.com` and `ns3.virtuaal.com`, nothing changed yet. Production already runs at https://eccm.eccm.workers.dev/, so nothing waits on the site.

DMARC is set to reject, so one wrong mail record bounces everything. Every record is recreated by hand, unproxied (grey cloud: the name points straight at Virtuaal and Cloudflare stays out of the way).

1. A day ahead, lower the TTLs in cPanel's Zone Editor to 300.
2. Export the zone from cPanel's Zone Editor.
3. Add eccm.ee to ECCM's Cloudflare account on the Free plan.
4. Recreate every record, grey cloud, still pointing at Virtuaal. Copy the DKIM key as one exact string.
5. Compare: `dig +short MX eccm.ee @<cloudflare-ns>` and the same for each record against Virtuaal's answers.
6. In Virtuaal's client area, Domeenid, eccm.ee, Nimeserverid: keep "Kasuta võõraid nimeservereid", put the two Cloudflare names in Nimeserver 1 and 2, empty 3, and Muuda nimeserverid. Virtuaal says up to 24 hours. Only after step 5 matches: a missing mail record bounces every mail, since DMARC is reject.
7. Check that mail still arrives and leaves. The site has not changed.

### Cutover

**Who:** ECCM, with the agent ready. **State:** to do.

1. Check that Tarmo has made [his changes](#what-tarmo-changes-before-cutover).
2. Read eccm.ee once more for what changed since the last sync, write the next `data/seed-step*-sync-*.sql` the way step 13 is, and apply it to staging and production. The last sync is step 13 of 9 November 2026: two Improtest evenings and two Fienta links, on staging and production.
3. Delete the A record for eccm.ee and the CNAME for www.
4. Deploy production, which attaches eccm.ee and www.eccm.ee to the Worker. In the same deploy, delete the two noindex lines (`/*` and `X-Robots-Tag: noindex`) at the top of `public/_headers`: static files bypass the Worker's `NOINDEX`.
5. Turn on Image Transformations for the zone.
6. Check: the front page, an event, an old Joomla address, the newsletter sign-up, a file under /radio1965/streams.
7. To go back: recreate the A and CNAME records. Minutes.

### Mail to Cloudflare, Gmail as the interface

**Who:** the owner, in ECCM's Cloudflare account and the team's Gmail. **State:** decided 8 November 2026, after the cutover.

ECCM's mail is two addresses, info@eccm.ee and eccm@eccm.ee, and the team reads both in one shared Gmail account and already sends as ECCM from it. Cloudflare has no mailboxes, which is fine: Email Routing forwards the two addresses to that Gmail, and Gmail's "Send mail as" sends through Cloudflare's SMTP. The team's work does not change, and the Joomla hosting at Virtuaal can then go, keeping only the domain.

Its own step, on a quiet day, after the DNS move and the cutover, so a problem has one cause. Going back is restoring Virtuaal's MX record.

Before:

1. In the Gmail, Settings, Accounts, "Send mail as", edit each address and note its SMTP server. If it is `mail.eccm.ee`, sending depends on Virtuaal today and switches in step 4 below.
2. Check that nothing lives only in the Virtuaal mailboxes. If everything was always forwarded to the Gmail, the archive is already there; if not, export it from cPanel first.

The move:

1. Email Service, Email Routing, eccm.ee: enable it. It replaces Virtuaal's MX, SPF and DKIM with Cloudflare's; keep the DMARC record.
2. Add the team's Gmail as a destination and verify it, then two rules: info@eccm.ee and eccm@eccm.ee, both to that Gmail.
3. Email Sending is on for eccm.ee already ([Email sending from eccm.ee](#email-sending-from-eccmee)). Make an account API token with only "Email Sending: Edit". It is a password: whoever holds it can send as any @eccm.ee address.
4. In the Gmail, for each address in "Send mail as": SMTP server `smtp.mx.cloudflare.net`, port 465, SSL, username `api_token`, password the token.
5. Test in both directions from an outside address, for each of the two addresses, and check the received headers say `dkim=pass` for eccm.ee.

To know:

- Cloudflare's SMTP submission is in beta since June 2026. If it misbehaves, Gmail can send through another SMTP relay; receiving is unaffected.
- Forwarding can fail DMARC for senders with a strict policy, and Email Routing sends no bounce, so such a mail is lost quietly. Rare for a contact address.
- The newsletter and the contact form already send through Cloudflare and do not change.

### After

**Who:** ECCM. **State:** after.

**Ask ECCM:** whether Google Search Console is verified for eccm.ee, and by whom.

1. Once the mail has run through Cloudflare for two weeks, cancel the Joomla hosting at Virtuaal (next renewal 27.01.2027), keeping the domain registration (renews 08.03.2027). The `mail`, `webmail` and cPanel names in DNS go with it.

### Before cancelling Virtuaal

**Who:** the owner, from ECCM's cPanel. **State:** to do. What still lives in the Joomla hosting besides the site, the DNS and the mail; Tarmo's ties to eccm.ee are v2in's plan.

1. The full cPanel backup ([Take a full backup first](#take-a-full-backup-first)): the file list of `public_html` goes to the developer, who marks the files old pages still link to (PDFs, press kits, article images, folders nobody remembers); the Joomla database dump is the archive.
2. The zone export: every record, subdomains and verification records included, recreated in the DNS move.
3. Google Search Console: how eccm.ee is verified. An HTML file or meta tag on the Joomla site breaks at the cutover; a DNS TXT record (a Domain property) survives it.
4. cPanel cron jobs and mail forwarders: each forwarder becomes an Email Routing rule.
5. v2in.stream is in the same Virtuaal account and stays.

### A preview address first?

Not needed: the current site is a test too. If wanted, uus.eccm.ee can work before the zone move through [Cloudflare for SaaS](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/) on positron.studio, with one CNAME at Virtuaal.

## 5. Väin

[Väin](https://github.com/tarmoj/radio1965) is U:'s app, by Tarmo Johannes. Its radio, events and recordings move to [v2in](https://v2in.stream/), not to this site, so eccm.ee needs no old.eccm.ee and keeps one path for it.

| on eccm.ee today | after cutover |
| --- | --- |
| The Joomla API, category 47, polled by his server every 5 minutes | Gone. ECCM's articles are already v2in events, and new ones are written there. |
| The recordings in `/radio1965/streams/` | Copied to v2in. This site forwards the path there. |
| The contributor and editor pages, `/radio1965/contributor/` and `/radio1965/editor/` | Tarmo's to move, to live.uuu.ee beside the API they call. Until then they answer 404. |
| Sign-up and reset mail through `mail.eccm.ee` | Works until ECCM's mail moves to Cloudflare; his server needs another SMTP before then. |

### The recordings from v2in

**Who:** agent. **State:** done 6 November 2026 in `src/passthrough.mjs`.

Events in the app link to `https://eccm.ee/radio1965/streams/<file>`. The Worker fetches the same path from `https://v2in.stream`, which holds all 44 files, and passes the request on whole, so seeking works.

**Check**

```sh
curl -sI https://eccm.ee/radio1965/streams/tarmo-20261025-184903.mp3   # 200, audio/mpeg, after cutover
```

### What Tarmo changes before cutover

**Who:** Tarmo. **State:** to ask.

**Ask Tarmo:** the three steps below, and a date for them.

1. Stop copying recordings to eccm.ee by ssh (`icecast_on_disconnect.sh`, `rtmp_on_record_done.sh`, `remote_files.py`).
2. Point `deploy-static.yml`'s secrets at his own server, so the contributor and editor pages live at live.uuu.ee, and set `RADIO65_CONTRIBUTOR_WEB_URL` to match.
3. Retire `joomla_importer.py`, since eccm.ee's Joomla API ends at cutover.

## Privacy and consent

| Problem | Solution | Who | State |
| --- | --- | --- | --- |
| Does the site need a cookie banner? | No. Visitors get no cookies; the only thing kept in their browser is the theme they pick. Editors get one login cookie, strictly necessary. | Nobody | Done |
| Analytics. | [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/): no cookies, counts only, so no consent. Never Google Analytics or the Meta pixel, which would need a banner. | ECCM turns it on | After migration |
| Third parties. | None on the site: no outside scripts, fonts from the site itself. /nan/'s Google Fonts move to the site, Konkursid's YouTube embed uses youtube-nocookie.com or loads on click. | Agent | To do |
| Personal data: newsletter, contact. | A privacy notice per language (GDPR article 13): who is responsible, what and why, how long, Cloudflare as processor, rights, complaints to the [Data Protection Inspectorate](https://www.aki.ee/). | ECCM writes, agent builds | To do |
| Proof of consent. | Double opt-in and one-click unsubscribe on the newsletter. The list ECCM already writes to is imported as confirmed (source `import`, with its date), by the owner's word that it is their existing list. | Nobody | Done |
| Processor agreement. | Cloudflare's [Data Processing Addendum](https://www.cloudflare.com/cloudflare-customer-dpa/) is part of its terms, nothing to sign. | ECCM | At account setup |
| EULA or terms of use. | A website needs no EULA, terms are optional unless ECCM sells online. | Nobody | Decided |
| Accessibility. | Estonia's rules bind public bodies, not an NGO, but build to WCAG 2.2 AA anyway. | Agent | Ongoing |

This is a reading of the rules, not legal advice. ECCM approves the privacy text.

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
| [Turnstile](https://developers.cloudflare.com/turnstile/) | Keeping bots off the contact form |
