# eccm-files: one place for the site's audio, and /admin/files

Asked 2026-10-02: *"what about creating a eccm-files worker and admin/files
paeg and mimick crate/vain. staton files should be a subdir there? plan first.
when implenented discard crate/vain"*, then *"split audio into 2?"* and *"yes
and implement"*. BUILT the same day; section 10 says what was built where it
differs from the sections above, and those win where they disagree.

The model is positron's `workers/vain` (the Worker, `positron-vain`) and
`demo/crate` (its page), read on 2026-10-02 with `plans/plan-vain-upload.md`
beside them. vain takes a long recording into R2 in pieces and plays it back
with byte ranges, with no database. This plan carries that over and gives the
station, the kept live shows and anything an editor uploads one bucket with
one directory each.

## 1. Why a second Worker, and what it does not buy

- **It does not raise the upload limit.** A Worker's request body limit belongs
  to the zone's plan, and positron.studio is on Free, so 100 MB per request
  whichever Worker answers (vain's header, plan-vain-upload section 1). A
  two-hour broadcast at 128 kbit/s is 115 MB, so files travel in pieces either
  way.
- **What it buys is a separate failure surface and a separate deploy.** An
  upload in flight must not be able to stop the site or the station, and a
  site deploy must not cut an upload in half. That is the argument
  positron-station's own config made for keeping it apart from vain.
- **How the site reaches it: a service binding, not a second hostname.** The
  site Worker forwards `/files/*` to `eccm-files` through a `services` binding,
  so the page and the API share an origin. No CORS, no second certificate, and
  the gate in section 5 sees the site's own requests.

## 2. One bucket, two directories a person sees

`eccm-files-staging` (and `eccm-files` at cutover). Split by where a file came
from, which never changes (asked 2026-10-02: *"i do no get differentce
programmers recordins uploads difference"*, then *"split audio into 2?"*):

| directory | what is in it | written by | shown |
| --- | --- | --- | --- |
| `uploads/` | files a person put there: concert recordings, masters, works, and the 17 the channels played when this was built | eccm-files, in pieces | yes, a tab |
| `recordings/` | the live shows the station recorded itself | the recorder (`src/radio.mjs`) | yes, a tab |
| `live/` | the chunks of a show while it is on air | the station's `/live/<key>/append` | no; the sweep deletes them |
| `index/` | the frame index of each file a channel can play | the station's ingest | no |

Nothing moves between directories. Whether a channel plays a file is a
column, On, and any file in either directory can be added to a channel; a
recording put on a channel is a replay and stays in `recordings/`.

**The station reads the bucket by full key, with no wrapper.** A slot's key is
the file's key (`uploads/ubu-ball-karawane.mp3`), so the station's playlist
asks `/stream/media/uploads/...` and its sweep lists `live/` and nothing else.

**Pictures stay where they are.** `MEDIA` (`eccm-media-staging`) holds the
editor's pictures keyed by hash, with rows in D1 and renditions through
`/cdn-cgi/image/`. They are a different thing with their own model, and the
files page does not show them.

## 3. What is carried over from vain, and what is not

**Carried over:**
- **The upload protocol.** `POST /open` with name, size and type answers an id,
  the piece size and the piece count. `PUT /piece/<id>/<n>` takes one piece of
  exactly 16 MiB (the last shorter), `POST /close/<id>` with the metadata
  completes it, and `POST /abort/<id>` drops it. It is an R2 multipart upload
  underneath, and R2 refuses parts of uneven size, so a wrong-sized piece is
  refused when it arrives rather than at the end (vain's red rule).
- **One Durable Object, `Uploads`, holding the sessions in flight**, so the
  caps are atomic and a resumed upload knows which pieces landed.
- **Sniffing.** The extension picks a format and the first bytes of piece 0
  must agree, or the 415 names the four bytes it found. Formats: mp3, wav,
  flac, ogg, opus, m4a, mp4, as vain.
- **R2 is the truth.** A file is a directory, `<dir>/<stamp>-<id>/`, holding
  the file and a `meta.json` (name, title, who, note, bytes, type, uploaded
  time, recorded date when one was read). A listing is
  `list({ prefix, delimiter: '/' })`. No table to keep in step.
- **Range reads**, `GET /files/a/<key>`, answering 206, so a player scrubs.
- **The page reads tags in the browser** with `File.slice`, before sending, and
  the server keeps what it was told as a claim with its source, as vain does.

**Not carried over:**
- **The sandbox tier** (`vain-dev`, 48 MiB, six-hour expiry, its hourly cron).
  It existed because crate was a public demo page. /admin/files is an admin
  page, so there is one tier.
- **positron's date model** (`normalizeWhen` in its `timeline/transport.mjs`,
  versioned rules, ignorance and vagueness). eccm has no timeline. A recorded
  date is a plain date with the tag it came from, or empty.
- **The address-hash principal.** One tier, behind the gate in section 5.

**Caps**, vain's kept tier: 500 MB a file (8.7 hours at 128 kbit/s, or 29
minutes of a 48 kHz 24-bit stereo master), 4 GB an hour, 40 uploads an hour.

## 4. /admin/files

An admin page in English, in the site's chrome and components, `wide: true`:

- **The three directories as a row of links** (Programmes, Recordings, Uploads),
  the current one underlined, as the menu does it, and its size and count.
- **A drop zone** at the top of each directory ("Drop audio files here or
  choose"), taking several at once. Each file gets a row that fills as pieces
  are acknowledged by the server, which is the only progress that is evidence
  (plan-vain-upload section 4). A failed piece is retried, and a closed tab can
  resume from the pieces that landed.
- **The listing**, the table component: name or title, who, length, size,
  uploaded, and a Listen button playing the file with the native player's
  scrub. The figures are the admin's tabular ones.
- **One file opened**: title, who and note editable, and the actions its
  directory allows. In Programmes that is "Add to channel", appending a slot to
  the chosen running order. In Recordings and Uploads it is "Move to
  Programmes", so a kept show or an uploaded concert can be scheduled. Delete
  is everywhere, and in Programmes it
  is refused while a running order names the file.

## 5. The gate, which is the owner's decision

The admin has been open since 2026-09-29 (*"rm login/session stuff. all is
free for editing"*). Uploads are a different risk from text edits: 500 MB a
file, 4 GB an hour, into storage that costs money. vain had a token and an
origin check, and its page held no token. The options:

1. **Cloudflare Access on `/admin*` and `/files*`**, one email allowlist, no
   code. It is a dashboard action on the zone and moves to ECCM's account at
   cutover. Recommended.
2. **A token the page asks for once** and keeps in the browser, checked by the
   Worker the way vain's `tierOf` does.
3. **Open, with the caps as the only fence.** A stranger who finds the page can
   fill 4 GB an hour.

## 6. Order of work

1. **The Worker**: `workers/files/` with its own `wrangler.jsonc` (staging and
   production), the bucket, `Uploads`, and the routes of section 3, ported from
   vain with the sandbox and the date model removed. Measured from node with a
   generated 40 MB file (three pieces, the last short) and a 120 MB one (eight
   pieces), each read back with a Range request.
2. **The site's service binding** and `/files/*` forwarding.
3. **The station on the files bucket**: the mapping wrapper, `STATION_MEDIA`
   pointed at `eccm-files-staging`, the 17 programmes copied into `programmes/`
   and their indexes into `index/`, and the three channels still playing what
   they played (compared, as in today's move). `eccm-station-staging` is then
   emptied and deleted.
4. **The station's ingest from a stored file.** `buildIndex` reads a whole
   file into memory today, which a 500 MB upload would not survive in a
   Worker's 128 MB. It becomes a walk over ranges: read 1 MB at a time, find
   frames, carry the remainder.
5. **Recordings**: the recorder writes `recordings/<id>.mp3`, the shows kept so
   far are copied over, and `/radio/<id>.mp3` reads from there.
6. **/admin/files**, its card on /admin, a section on /ds for the upload row
   and the progress line, and shots at 375 and 1280.
7. **Discard crate and vain** (section 7).

## 7. Discarding crate and vain, once 1 to 6 hold

- **vain's one kept file** is a generated 90-minute 440 Hz test tone
  (`vain/20260915-155124-679bda98a58c7612`, *"90 minutes of 440 Hz,
  generated"*, by *"the repo"*). It is not carried over.
- **Delete the `positron-vain` Worker and the `vain-archive` bucket**, after
  checking that nothing else in positron reads `positron-vain` (crate is the
  only reader found on 2026-10-02; workers/ingest is a sibling with its own
  bucket and is not touched).
- **In positron**: `demo/crate/` and `workers/vain/` move to `archive/` with the
  reason, and crate's row leaves `demo/manifest.mjs`, in one commit.

## 8. Done when

- A 120 MB file dropped on /admin/files at 375 and at 1280 lands in Uploads
  with a progress line that moves per piece, plays, and scrubs to its last
  minute.
- A closed tab halfway through resumes from the pieces that landed.
- A file moved into Programmes is added to a channel and heard on /radio.
- A live show lands in Recordings and moves to Programmes as a replay.
- The three channels play what they played before the bucket changed.
- positron-vain and vain-archive are gone, and positron's front page has no
  crate row.

## 9. Risks

1. **Memory on ingest** (step 4). If the range walk is not done first, the
   first long concert recording put into Programmes fails at ingest after a
   successful upload.
2. **The wrapper is the only fence** between the sweep and everything else in
   the bucket. It gets an assert: a sweep run against a bucket holding
   `uploads/x`, `recordings/y` and `programmes/z` deletes none of them.
3. **The gate.** Built without one, the page is an open 4 GB an hour upload.
4. **This laptop's DNS filter** answers for `eccm.positron.studio` with a
   blocked page since 2026-10-02, so every check from here goes through
   `eccm-staging.kristjan-jansen.workers.dev`, and the service binding means
   the files Worker needs no hostname of its own.

## 10. What was built, 2026-10-02

- `workers/files/worker.mjs` and its `wrangler.jsonc`: `eccm-files-staging`, the
  upload protocol of section 3, its `Uploads` object, writes behind the bearer
  token `FILES_TOKEN`. The gate of section 5 was not chosen by the owner, so it
  is option 2, the token, until it is; the page asks for it once.
- No `meta.json`. A file's title, who and length are the station's record of
  it (its Library), written by `/admin/files/ingest` after a close from the
  file's tags, and by the recorder for a recording, so there is one place a
  title lives.
- No read route in eccm-files: `/stream/media/<key>` already answers ranges.
- `src/files.mjs` and `src/render/files.mjs`, `public/files.mjs`: /admin/files
  with its two tabs, the drop zone, a line per upload, the table, and a row's
  Edit with Save, Add to channel and Delete (refused while a channel plays it).
- `buildIndexFrom` in `src/station/station.mjs`: the frame walk over 2 MB
  ranges, identical to the whole-file walk on all 17 programmes (COMPARED), and
  the station's `/ingest/<key>` built on it.
- `tools/upload.mjs`: the same protocol from the command line, with
  `--stop-after` and `--resume`.
- MEASURED on staging: a 43,201,140 byte file in three pieces read back
  byte for byte, and deleted. Locally: a resume after one piece; a text file
  named .mp3 refused with its first four bytes; a 45 s show swapped out of the
  running order the moment it closed kept whole (it was kept as 30 s before
  the recorder learned to read leftover chunks from the bucket).
- Moved: the 17 programmes uploaded through the protocol, their records and the
  three running orders rewritten to `uploads/` keys with their clocks, and
  staging's one recording copied to `recordings/`.
- Discarded: positron's crate and vain (positron fdc5677), the Worker
  `positron-vain` and the bucket `vain-archive` deleted.
- Left: the bucket `eccm-station-staging`, which nothing binds any more, still
  holds the 17 files, their indexes and some live chunks; wrangler here has no
  object listing to empty it with.
