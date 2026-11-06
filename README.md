# eccm

The website of ECCM, the Estonian Centre of Contemporary Music, for eccm.ee.
Events, text pages and a newsletter, in Estonian and English, edited
in the browser by ECCM's own people.

Start here. `plans/plan-eccm-migration.md` is the plan for moving eccm.ee onto
this site, task by task.

## What runs where

Everything is on Cloudflare, in one account per environment.

| Part | What it does |
| --- | --- |
| Worker (`src/`) | Draws every page from the database, handles editing, the newsletter, the contact form and redirects from the old Joomla addresses. |
| Static files (`public/`) | The stylesheet, fonts, icons, pictures of the design pages, served as they are. There is no build step. |
| D1 database (`DB`) | Events, pages, pictures' details, subscribers, newsletter issues, the mail outbox, editors. Schema in `migrations/`. |
| R2 bucket (`MEDIA`) | Uploaded pictures, one file per picture, named by its content hash. |
| R2 bucket (`BACKUP`) | A copy of the database every day, kept 30 days. |
| Email (`EMAIL`) | Sends the newsletter, sign-up confirmations and contact form mail through Cloudflare Email Sending. |
| Cron, every five minutes | Sends mail that did not go at once, and takes the daily backup. |

`wrangler.jsonc` names all of these, with two environments: `staging` and
`production`. Every command takes `--env`.

## Run it locally

Node 20 or newer.

```sh
npm install
npx wrangler d1 migrations apply eccm-staging --local --env staging
npx wrangler dev --env staging --var IMAGE_TRANSFORMS:off
```

Then open http://127.0.0.1:8787/. The local database starts empty. To fill it,
run the files in `data/` in order of their step number:

```sh
npx wrangler d1 execute eccm-staging --local --env staging --file data/seed-step1.sql
```

Or load a copy of the live database (see Backups below) with `--local`.

Secrets the Worker reads, for local use in a `.dev.vars` file (git-ignored):
`SESSION_SECRET` for logins. Without it the site runs, but logging in does
not.

## Deploy

```sh
npx wrangler d1 migrations apply eccm --remote --env production   # only when migrations/ has a new file
npx wrangler deploy --env production
```

The same with `eccm-staging` and `--env staging` for staging. The secret is
set once per environment, with
`npx wrangler secret put SESSION_SECRET --env production`.
`plans/plan-eccm-migration.md`, Set up production, has the first deploy. A `.env` file in
this directory overrides wrangler's login, so keep none here.

## Editors and logging in

Each editor has a key of their own, like `xxxx-xxxx-xxxx`, typed once at
`/login`. It stays logged in for 90 days. Keys are managed from this
directory with `tools/editors.mjs`:

- **create** an editor: prints their new key once. Send it to them; it is not
  stored anywhere and cannot be shown again.
- **list** the editors, with when each key was last used.
- **revoke** an editor's key: they are logged out on their next click.

Run `node tools/editors.mjs` with no arguments for the exact commands. A lost
key is revoked and a new one created.

Behind the login: `/admin`, `/edit`, `/ds`, `/logo` and `/social`. Everything else is public.

## Editing

- **Events and pages:** every event and text page has an Edit button (Muuda
  in Estonian). It opens the form for that page, asking for the key first.
  Preview shows the page without saving; Save stores it, and a page set to
  Draft is hidden from visitors. Two people saving the same page at once
  cannot overwrite each other: the second gets the form back with their text
  kept.
- **New events** start from the New event card on `/admin`, at
  `/edit/events/new`, and are saved as a draft until set to Published. A
  title already used by another event gets the date added to its address.
- **New pages** start at `/edit/pages/new`.
- **Pictures** are uploaded in the edit form and resized by Cloudflare on the
  way to visitors.
- **`/admin`** links to everything else: the events, a new event, the
  newsletter, and the design pages (`/ds`, `/logo`, `/social`).

## Newsletter

The sign-up is at `/et/uudiskiri` and `/en/newsletter`. A new subscriber gets
a confirmation mail and is on the list once they click it. Every mail has an
unsubscribe link that works in one click.

Editors write issues at `/edit/uudiskiri`: a new issue is filled in from the
coming events, a test goes to one address, then Send goes to everyone in that
language. Sent issues stay readable at the sign-up address.

Mail is written to the `outbox` table first and then sent; what fails is
retried by the cron three times. `/edit/uudiskiri/postkast` shows the outbox.
Sending needs Email Sending set up for the sending domain in the Cloudflare
dashboard, and on the Workers Free plan Cloudflare delivers only to the
account's verified addresses.

## Backups and restore

Every day the Worker writes the whole database to the `BACKUP` bucket as
`d1/YYYY-MM-DD.json` and deletes copies older than 30 days (`src/backup.mjs`).
Pictures need no backup: they are never overwritten.

To restore one day:

```sh
npx wrangler r2 object get <backup-bucket>/d1/2026-11-06.json --remote --file backup.json
node tools/restore.mjs backup.json > restore.sql
npx wrangler d1 execute eccm --remote --env production --file restore.sql
```

This replaces every table's rows with the backup's. Try it with `--local`
first.

For a full copy at any moment, `npx wrangler d1 export eccm --remote --env
production --output copy.sql`. Copying staging's content into a new
database without its test sign-ups, mail and keys:
`node tools/clear-test-rows.mjs copy.sql clean.sql`.

The backups hold subscribers' addresses: never commit one.

## After a change

```sh
node tools/check-html.mjs public/*.html
```

Then look, on a phone width and a desk width: the front page `/`, one event
page, `/en/`, and `/admin` after logging in. `node tools/shot.mjs <url> 375
1280` takes both screenshots. After a deploy, the same pages on the live
address.

## Where to read more

- `plans/plan-eccm-migration.md`: moving eccm.ee here, and what is decided.
- `CLAUDE.md`: the layout of the code, file by file, and the house rules, for a
  person or a coding agent.
- `plans/`: why things are the way they are.
