# The notices to phones, removed 2026-11-06

## What it was

A notice was a short line with a time, sent to every phone that had turned
notifications on. It ran from 2026-10-01 to 2026-11-06.

- **/items**, behind the editor keys: the form (title, text, time), the list,
  and the device's own state with a Luba teated button. **/items/{id}** moved
  a waiting notice, reworded or deleted one.
- **/teated/{n}** and **/en/notices/{n}**: a published notice's public page,
  numbered from 1000, the link Väin kept.
- **The Items Durable Object** (`src/items.mjs`, binding `ITEMS`, SQLite): the
  notices, one alarm set for the next waiting one, and the browsers' push
  subscriptions. At the alarm a notice turned published and went to every
  subscription.
- **Web Push with VAPID** (`src/push.mjs`): `VAPID_PUBLIC` and `VAPID_SUB` as
  vars, `VAPID_JWK` as a secret. A subscription its push service answered 404
  or 410 for was dropped.
- **In the browser:** `public/sw.js` the push worker (no fetch handler),
  `public/push.mjs` the subscribe steps, `public/items.mjs` the device part of
  /items, and the Luba teated bar `public/site.mjs` put under the header in
  the installed app while notifications were off.
- **The Notices card** on /admin.

The manifest stays: it gave the home screen icon and name before the
notices. Only "ja teated" left its description.

## Why it was removed

ECCM never asked for it. It came over from positron's items demo
(`archive/positron-items.md`), and its one real use, notices for Väin through
the Joomla API shim, went to v2in on 2026-11-06.

## What was in it

Removing the class (`deleted_classes: ["Items"]`, tag `v5` in
`wrangler.jsonc`) destroys staging's object, its notices and its push
subscriptions. Two notices were published, both tests, read from their public
pages before the removal:

| Number | Title | Published |
| --- | --- | --- |
| 1000 | Hello! | 1 October 2026, 15.39 |
| 1001 | Test | 1 October 2026, 19.27 |

The subscriptions were not saved.

## To bring it back

The code is at commit `52cb36a` (tag `notices-last`):

```sh
git checkout notices-last -- src/items.mjs src/push.mjs src/render/items.mjs src/render/notice.mjs public/sw.js public/push.mjs public/items.mjs
```

Then put back the routes in `src/index.mjs`, `OPEN_ITEMS` in `src/auth.mjs`,
the bar in `public/site.mjs`, the card in `src/render/admin.mjs`, and in
`wrangler.jsonc` the `ITEMS` binding, the VAPID vars and a new tag with
`new_sqlite_classes: ["Items"]` (a deleted class cannot come back under its
old tag). The object starts empty, and every phone subscribes again.
