# eccm

The site for eccm.ee while it is being built, live at
**https://eccm.positron.studio/**. Private repository, `kristjanjansen/eccm`.
It left the positron repository on 2026-09-27 with its history
(https://github.com/kristjanjansen/positron, where it was `demo/eccm/`).

## What is here

| where | what |
| --- | --- |
| `public/` | the site, served as static assets: `index.html` (the list), `event.html`, `edit.html`, `derive.html` (the design-from-image example), `logo.html`, `type.html`, `eccm.css`, `vendor/` (the fonts, each with its licence), the pictures, `logo.svg`, `_headers` (`X-Robots-Tag: noindex` while the site is on this hostname) |
| `plans/` | the four plans: what to build (`plan-eccm-cms.md`), what it looks like (`plan-eccm-design.md`), the setup and the handover (`plan-eccm-setup.md`), and design from image (`plan-eccm-design-from-image.md`) |
| `.claude/skills/eccm-ui` | the type half of the design system, with every rule's measurement and the owner's words. Load before any change under `public/` |
| `.claude/skills/positron-compose` | the composition half, copied from positron. Load beside `eccm-ui` |
| `tools/` | `shot.mjs`, `which-rule-won.mjs`, `ancestry.mjs`, `check-html.mjs`, copied from positron with a header saying so. Positron's copies are the originals |
| `archive/` | what was removed and why, verbatim |
| `wrangler.jsonc` | two environments. `staging` is this account and `eccm.positron.studio`; `production` is ECCM's account and `eccm.ee`, blank until cutover |

## Run and check

```sh
npx wrangler d1 migrations apply eccm-staging --local --env staging   # the schema into the local database, once and after every new migration
npx wrangler d1 execute eccm-staging --local --env staging --file data/seed-step1.sql   # the seeded rows (then seed-step2.sql)
npx wrangler dev --env staging                 # http://127.0.0.1:8787/ , the pages under /et/ and /en/ come from D1
node tools/check-html.mjs public/*.html        # every module block parses, no browser
node tools/shot.mjs http://127.0.0.1:8787/ 375 1280   # LOOK, on an iPhone mini and at the desk, before saying it is done
node tools/which-rule-won.mjs http://127.0.0.1:8787/event '.ev-title' font-size
node tools/ancestry.mjs http://127.0.0.1:8787/ '.ev' padding-top --width 375
```

## The wrangler pin, and why it is exact

`package.json` pins `wrangler` to exactly `4.107.0` and `wrangler.jsonc` sets
`compatibility_date` to `2026-07-08`, the newest that version's runtime
supports. This laptop's endpoint security lets only known binaries run, and the
`workerd` that wrangler 4.141 ships is killed on start (MEASURED 2026-09-27:
`workerd --version` exits 137, and wrangler reports it as `write EPIPE` from
`wrangler dev` and every `d1 ... --local` command). trip pins the same version
for the same reason. The binary itself is pinned too, asked 2026-09-27 ("pin
workerd in eccm"): `workerd` `1.20260701.1` as a devDependency and as an
`overrides` entry with its platform package, so no wrangler bump can pull
another; `workerd --version` prints `workerd 2026-07-01` and the binary's
sha256 is `edd9ecf3b9ca100cbfba5e2960874443dc6937b0bc94ba9d47b73a43e8dc1410`
(MEASURED with `shasum -a 256 node_modules/@cloudflare/workerd-darwin-arm64/bin/workerd`).
A different hash after an install is the thing to check before blaming code. Upgrading wrangler here means a new binary to have allowed
first; `wrangler deploy` never runs workerd and works on any version.

## Deploy

```sh
env -u CF_API_TOKEN -u CLOUDFLARE_API_TOKEN npx wrangler deploy --env staging
```

Always with `--env`. `public/` is the source, there is no build step, and a
`.env` in the directory shadows the machine's wrangler login, so deploy without
one. Then `curl -sI https://eccm.positron.studio/event` reads `200`, because
`html_handling` serves `event.html` at `/event`.

## Pushing needs the personal GitHub account

Two accounts are logged in on this machine. `kristjanjansen` owns this
repository; `Kristjan-Jansen_enefit` is the work account and the default.
`git push` under the wrong one answers `Repository not found`, which is an auth
failure wearing a 404.

```sh
gh auth switch --user kristjanjansen
git push origin HEAD
gh auth switch --user Kristjan-Jansen_enefit   # put it back, every time
```

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
