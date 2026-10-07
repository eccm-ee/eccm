# The radio, removed 2026-10-07

Asked as `docs/migration.md`, "Remove the radio, keep it restorable": the radio
is not part of the site eccm.ee moves to, so it left the Worker with its state
saved first. The last commit that has it is the tag **`radio-last`**.

## What it was

**The station** (`src/station/station.mjs`, answering under `/stream`) was
positron's `positron-station`, moved into this Worker on 2026-10-02. A channel
was an HLS media playlist whose segments were `#EXT-X-BYTERANGE` ranges into
whole MP3 files in R2: the Worker wrote about 600 bytes of playlist every
eleven seconds and no audio passed through it, which is why it kept playing on
a locked iPhone. The playlist was always live, never VOD. A running order held
file slots, relay slots (somebody else's live stream played inside the
playlist, one upstream connection per channel) and live slots (ten second MP3
chunks posted by `tools/live.mjs`). Two Durable Objects held it: `Schedule`,
one per channel, the running order and its clock, and `Library`, the channels
and a record per programme (title, who, kind, duration, free `meta`). Writes
needed the secret `STATION_TOKEN`. Three channels at the end: UbuWeb (`main`),
Toonid (`toonid`) and Otse proov (`live-test`, one open live slot).

**The recorder** (`src/radio.mjs`, the Durable Object `Radio`) read the
station's running order every 30 s while a live slot was open, copied each
live chunk before the station's five-minute sweep deleted it, and joined a
closed show into one MP3, `recordings/{id}.mp3`, with an R2 multipart upload.
It kept one show, `rec-test2-muqn2zy3`, a 45 s test.

**/radio** (`src/render/station.mjs`, `public/station.mjs` with hls.js 1.7.1
for browsers without native HLS) showed every channel as a column, what was on
and the running order, and the kept shows under Recordings. `/station`
answered 301 to it. It had its own share card, `/og/radio-{lang}.png`.

**Files** were `/admin/files` (`src/files.mjs`, `src/render/files.mjs`,
`public/files.mjs`): the bucket's `uploads/` and `recordings/`, with which
channel plays each. Uploads went through **eccm-files** (`workers/files/`,
deployed as the Worker `eccm-files-staging` with its own Durable Object
`Uploads`) in 16 MiB pieces, reached at `/files/*` through the service binding
`FILES_SVC`; writes needed `FILES_TOKEN` unless `OPEN_UPLOADS` was `on`, which
it was. `tools/upload.mjs` put a file through the same path from the shell.

## What was kept

- **The bucket `eccm-files-staging`**, untouched: `uploads/` (the 17
  programmes), `recordings/` (the one show), `index/` (each file's frame
  index) and `live/`. Nothing in it was deleted. It is no longer bound.
- **The Worker `eccm-files-staging`** is still deployed on the account; only
  its source left this repository. Deleting it is a separate decision.
- **The state**, read from staging before the removal, in `archive/radio/`:

| file | what | read from |
| --- | --- | --- |
| `channels.json` | the channels, their titles and what each was playing | `GET /stream/channels.json` |
| `schedule-{channel}.json` | each channel's running order as `Schedule` stored it: `epoch`, `slots`, `rev`, `live` | `GET /stream/c/{channel}/schedule` |
| `running-order-{channel}.json` | the same with titles and wall-clock times, for reading | `GET /stream/c/{channel}/schedule.json` |
| `programmes.json` | the library, 38 records | `GET /stream/programmes.json` |
| `state.json` | the recorder's alarm, its shows and the last chunks it saw | `GET /radio/state.json` |

## To bring it back

1. The code, from the tag:

   ```sh
   git checkout radio-last -- src/station src/radio.mjs src/files.mjs \
     src/render/station.mjs src/render/files.mjs public/station.mjs public/files.mjs \
     public/vendor/hls-1.7.1.min.js public/vendor/LICENSE-hls.js workers/files \
     tools/live.mjs tools/upload.mjs
   git diff radio-last -- src/index.mjs src/og src/render/admin.mjs public/eccm.css public/ds.html public/social.html wrangler.jsonc
   ```

   The second command shows the routes, the cron calls (`wakeRadio(env)` and
   `station.scheduled(event, env, ctx)`), the share card, the `.station-*` and
   `.file-*` CSS and the Radio and Files cards to put back by hand.
2. In `wrangler.jsonc`, keep `v1` to `v4` as they are and append a new tag,
   `{ "tag": "v5", "new_sqlite_classes": ["Radio", "Schedule", "Library"] }`.
   Put back the bindings: Durable Objects `RADIO` (`Radio`), `SCHEDULE`
   (`Schedule`), `LIBRARY` (`Library`); the R2 bucket `STATION_MEDIA` on
   `eccm-files-staging`; the service `FILES_SVC` on `eccm-files-staging`; and
   the var `OPEN_UPLOADS` if uploads are to be open again.
3. The secrets, in both Workers:

   ```sh
   env -u CF_API_TOKEN -u CLOUDFLARE_API_TOKEN npx wrangler secret put STATION_TOKEN --env staging
   env -u CF_API_TOKEN -u CLOUDFLARE_API_TOKEN npx wrangler secret put FILES_TOKEN --env staging
   env -u CF_API_TOKEN -u CLOUDFLARE_API_TOKEN npx wrangler secret put FILES_TOKEN -c workers/files/wrangler.jsonc --env staging
   ```

4. Deploy `workers/files` first, since the site's service binding names it,
   then the site:

   ```sh
   env -u CF_API_TOKEN -u CLOUDFLARE_API_TOKEN npx wrangler deploy -c workers/files/wrangler.jsonc --env staging
   env -u CF_API_TOKEN -u CLOUDFLARE_API_TOKEN npx wrangler deploy --env staging
   ```

5. Load the state through the station's write routes with `STATION_TOKEN`.
   Each running order goes back with its title (a PUT creates the channel);
   leave `epoch` out to start the clock now, or keep it to resume the old one:

   ```sh
   B=https://eccm-staging.kristjan-jansen.workers.dev/stream
   H="authorization: Bearer $STATION_TOKEN"
   for c in main toonid live-test; do
     t=$(jq -r --arg c "$c" '.channels[] | select(.name == $c) | .title' archive/radio/channels.json)
     jq --arg t "$t" '{epoch, slots, title: $t}' archive/radio/schedule-$c.json \
       | curl -s -X PUT -H "$H" -H 'content-type: application/json' --data @- $B/c/$c/schedule
   done
   # the library records, title, who, kind, duration and meta each
   jq -c '.programmes[]' archive/radio/programmes.json | while read -r r; do
     k=$(jq -rn --arg k "$(echo "$r" | jq -r .key)" '$k | @uri')
     echo "$r" | jq '{title, who, kind, duration, meta}' \
       | curl -s -X PUT -H "$H" -H 'content-type: application/json' --data @- "$B/programmes/$k"
   done
   ```

   The file slots play straight away, since their MP3s and `index/` files are
   still in the bucket. The recorder has no write route: its one show is
   `recordings/rec-test2-muqn2zy3.mp3` in the bucket, and its row
   (`state.json`, `shows[0]`) goes back by hand into the `shows` table if
   /radio should list it.
6. Check: `/stream/channels.json` names what each channel plays, `/radio`
   plays, `/radio/state.json` shows an alarm, and `/admin/files` lists the 17
   uploads.
