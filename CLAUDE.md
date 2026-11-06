# eccm

The site for eccm.ee while it is being built, live at
**https://eccm.positron.studio/**. Private repository; `README.md` is the
maintainer's introduction, and `CLAUDE.local.md`, git-ignored, holds what is
true only of one machine and its accounts. It left the positron repository on 2026-09-27 with its history
(https://github.com/kristjanjansen/positron, where it was `demo/eccm/`).

## What is here

| where | what |
| --- | --- |
| `README.md` | the introduction for whoever inherits the site: what runs where, local run, deploy, login, editing, backups, the newsletter |
| `CLAUDE.local.md` | git-ignored: the owner's machine and accounts, read by Claude Code beside this file |
| `HANDOFF.md` | what state this is in right now |
| `BACKLOG.md` | what has been asked for and not yet done, every ask verbatim |
| `public/` | the site, served as static assets (the front pages `/` and `/en/` come from D1 since 2026-10-03): `ds.html` (the design system, the wordmark at its foot), `site.mjs` (the phone menu, the theme and the YouTube player), `scheme.mjs` (the detector, one copy for the editor and `tools/scheme.mjs`), `eccm.css`, `vendor/` (the fonts, each with its licence), `icons/` (the square marks and every icon size), the pictures, the logo and wordmark SVGs, `manifest.webmanifest`, `_headers` (`X-Robots-Tag: noindex` while the site is on this hostname) |
| `src/` | the Worker: `index.mjs` the router, `newsletter.mjs` the newsletter (the sign-up at /et/uudiskiri and /en/newsletter with double opt-in, the archive, and its editor at /edit/uudiskiri) since 2026-10-01, `mail.mjs` the outbox drained through the `send_email` binding `EMAIL` and by the five-minute cron, `og/` the event share images (`GET /og/e/{id}-{lang}-{v}.png`, resvg wasm, cached in R2; `tools/og-fonts.py` makes its TTFs), `editor.mjs` the editing routes, a new event at /edit/events/new since 2026-11-06, open to anyone from 2026-09-29 until the key login, `auth.mjs` that login: ECCM's one key, the secret `EDITOR_KEY`, typed at /login, a cookie signed with `SESSION_SECRET` and a hash of the key, in front of /admin, /edit, /ds, /logo and /social, `backup.mjs` the daily D1 copy into the R2 bucket `eccm-backup-staging` (binding `BACKUP`), `contact.mjs` the contact form, `redirects.mjs` the old Joomla addresses and the misses in `redirect_miss`, `passthrough.mjs` `/radio1965/streams/*` from v2in.stream, `media.mjs` the upload into the R2 bucket `eccm-media-staging` (binding `MEDIA`) and `/media/*`, `render/` the templates (`html.mjs`, `md.mjs`, `chrome.mjs`, `mark.mjs` the shared chrome markup, `event.mjs`, `editor.mjs`, `newsletter.mjs`, `mail.mjs` the email template, `dates.mjs`, `feeds.mjs` the sitemap and the RSS feeds, `ics.mjs` the calendars, named nowhere until cutover, `pic.mjs` every picture through one `/cdn-cgi/image/` function, on since 2026-09-30, `IMAGE_TRANSFORMS` in `wrangler.jsonc` turns it off) |
| `migrations/`, `data/` | the D1 schema (`0001_step1.sql`, `0002_editing.sql`, `0003_page_editing.sql`, `0004_media_upload.sql`, `0005_newsletter.sql`, `0006_tuma.sql`, `0007_redirect_miss.sql`, `0008_contact.sql`, and whatever came after: `ls migrations`) and the seed files |
| `plans/` | every plan, fourteen today (`ls plans/*.md \| wc -l`, counted and never remembered): the four that came with the move and the ten since (the radio's two moved to v2in `plans/eccm/` on 2026-11-06), each relayed in full when written; `plan-eccm-migration.md` is the plan for moving eccm.ee here, task by task, served at /docs/migration until 2026-11-06 |
| `.claude/skills/eccm-ui` | the type half of the design system, with every rule's measurement and the owner's words. Load before any change under `public/` |
| `.claude/skills/positron-compose` | the composition half, copied from positron. Load beside `eccm-ui` |
| `tools/` | `shot.mjs`, `which-rule-won.mjs`, `ancestry.mjs`, `check-html.mjs`, copied from positron with a header saying so (`shot.mjs` gained `--from px` here on 2026-09-27, owed to positron's copy by hand), `mark.mjs` with `icons.mjs`, which draw the mark per icon size and write the ICOs, `feather.mjs`, which writes the icon sprite `public/vendor/icons/feather/icons.svg` from Feather with every corner square, and `scheme.mjs`, which reads every media row's picture in headless Chrome and writes `data/seed-step5-schemes.sql`, `restore.mjs`, which turns one daily backup back into SQL, and `clear-test-rows.mjs`, which copies a `d1 export` without staging's test rows (subscribers, newsletter issues, outbox, contact messages, redirect misses, wrong login keys) |
| `archive/` | what was removed and why, verbatim, indexed in `archive/README.md`; the radio (station, recorder, /radio, /admin/files, eccm-files) and the research pages (/type, /derive, /icons, /admin/research) left on 2026-10-07, tags `radio-last`, `radio-archive` and `research-last`; the radio's archive moved to v2in `archive/eccm-radio/` on 2026-11-06; the notices to phones (/items, the Items Durable Object, Web Push) left on 2026-11-06, `archive/notices.md`, tag `notices-last` |
| `wrangler.jsonc` | two environments. `staging` is this account and `eccm.positron.studio`; `production` is ECCM's account and `eccm.ee`, blank until cutover |

## Run and check

```sh
npx wrangler d1 migrations apply eccm-staging --local --env staging   # the schema into the local database, once and after every new migration
npx wrangler d1 execute eccm-staging --local --env staging --file data/seed-step1.sql   # the seeded rows (then seed-step2.sql to seed-step7.sql, in that order)
npx wrangler dev --env staging --var IMAGE_TRANSFORMS:off   # http://127.0.0.1:8787/ , the pages under /et/ and /en/ come from D1; the var because wrangler dev serves no /cdn-cgi/image/
node tools/check-html.mjs public/*.html        # every module block parses, no browser
node tools/shot.mjs http://127.0.0.1:8787/ 375 1280   # LOOK, on an iPhone mini and at the desk, before saying it is done
node tools/which-rule-won.mjs http://127.0.0.1:8787/event '.ev-title' font-size
node tools/ancestry.mjs http://127.0.0.1:8787/ '.ev' padding-top --width 375
```

## The wrangler pin

`package.json` pins `wrangler` to exactly `4.107.0`, and `workerd` to exactly
`1.20260701.1` as a devDependency and as an `overrides` entry with its
platform package, so no wrangler bump can pull another binary.
`wrangler.jsonc` sets `compatibility_date` to `2026-07-08`, the newest that
runtime supports. The pin exists because one development machine runs only
binaries it has been told about (`CLAUDE.local.md` there has the details).
Elsewhere wrangler and workerd can be upgraded together, with
`compatibility_date` moved to match; `wrangler deploy` never runs workerd and
works on any version.

## Deploy

```sh
npx wrangler deploy --env staging
```

After a new migration, first `npx wrangler d1 migrations apply eccm-staging
--remote --env staging`, since the deployed Worker reads the remote database
`eccm-staging` (created 2026-09-27, its id in `wrangler.jsonc`), and a seed
file the same way with `d1 execute --remote`. A machine with its own wrangler
prefix (an API token in the shell, say) is named in `CLAUDE.local.md`.

Always with `--env`. `public/` is the source, there is no build step, and a
`.env` in the directory shadows the machine's wrangler login, so deploy without
one. Then `curl -sI https://eccm.positron.studio/` and `/et/sundmused` read `200`.

## Pushing

`git push origin HEAD`. A machine with more than one GitHub account logged in
has its switch commands in `CLAUDE.local.md`; `Repository not found` from a
push is an auth failure wearing a 404.

## Rules that came with it

- **No em dashes and no middots**, anywhere a reader looks: not in a page,
  a comment, a commit message or a reply. A full stop and a second sentence,
  or a colon when the second half names the first.
- **A description is one sentence**, not stretched with a colon, a semicolon
  or an "and" carrying a second fact.
- **Verify economically.** `check-html` first, one shot at 375 and 1280 of the
  page touched, and nothing more for a one-line change.
- **A finished page is handed over as a URL**, never as a path.
- **Every PR, issue or ticket mention is a link with its title**, never a bare
  number.
- **No generated-by or co-authored-by trailers naming Claude**, in commits or
  PR bodies.
- **Nothing of ECCM's enters this repository**: no dump, no editor's address,
  no subscriber. The pictures here are the public thumbnails eccm.ee serves.
- **A background agent does not commit**; it reports, the session commits by
  path.
