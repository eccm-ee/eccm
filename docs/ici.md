# ici on Väin

Albert Saprykin's ici as a session on [Väin](https://github.com/tarmoj/radio1965): visitors record 15 seconds on a phone, a small program on Albert's Raspberry Pi plays one now and then with silence between, and Väin shows it as a live card with a push. Read from Väin's code at `4f9cecb` on 7 October 2026, nothing built yet. Each task says who does it, then gives the code, a check and a prompt for a coding agent.

ici's own code was not found on GitHub or on this machine, so the picker below is written against Firebase Storage's documented Admin API and the bucket path is a placeholder.

## Who does what

| Who | What | Size |
| --- | --- | --- |
| Tarmo | A mount `/ici` on live.uuu.ee with the same hooks as `user1` to `user4`, and its source password to Albert. | Minutes |
| Albert | The picker, the Liquidsoap script and the systemd units on the Raspberry Pi. | About a day |
| Albert | Say which recordings may be broadcast, and write the card text. | A conversation |
| ECCM | Agree to the load on live.uuu.ee and choose the slot. | A conversation |
| Nobody | The Väin app, its server code, and this site. | None |

## How it works

1. A visitor records 15 seconds in ici's own web app, reached by a QR code, and it goes to ici's Firebase Storage as today.
2. The picker on the Pi lists the recordings, prefers the last 24 hours, downloads one and converts it to WAV.
3. Liquidsoap plays it, then sends silence for a random 20 to 120 s, and sends MP3 to `live.uuu.ee:8001/ici` the whole time, so Icecast never drops the source.
4. Icecast runs Väin's `icecast_on_connect.sh`, which reads the source's name and description from `status-json.xsl` and publishes a `livestream` card titled `<name> on ici`, with a push.
5. When the session ends, `icecast_on_disconnect.sh` unpublishes the card at once.

Väin's own rule moves a card to the Collection after one day (`DEFAULT_SHELF_DELAY` in `server/main.py`), the same 24 hours ici already uses, which is why a source left on for days would sit on the shelf while still live.

## To decide

- **Sessions or always on.** A daily session gives one push and one fresh card a day. Recommended: a session.
- **Slot.** Radio 1965 works in 28, 56 and 112 minute slots with silence between programmes. The code below assumes 56 minutes at 20:00.
- **Freiburg recordings.** The 200 recordings from June 2025 were given to an installation in a foyer, and broadcasting them is a new use. `ICI_SINCE` below plays only recordings made after the app says they will be broadcast.
- **Card title.** The hook writes `<ice-name> on <mount>`, so a stream named `ici` on `/ici` reads "ici on ici".
- **Recording the session.** The hook records every source unless it sends `save_stream=0`, then puts the hour in the Collection. The script below sends `save_stream=0`.
- **Load.** One source per session, and the listeners Väin brings, on a volunteer server.

## 1. The mount

**Who:** Tarmo. **Mirrors:** `server/icecast_on_connect.sh` and `server/icecast_on_disconnect.sh`, and the `<mount>` example in `project-description.md` §8.1.

`icecast.xml` is not in the repository. The hook scripts say they are linked into `/usr/local/bin`, and §8.1 shows the older names `stream-started.sh` and `stream-stopped.sh`, so copy the two hook lines from the live `/user1` block rather than from here.

```xml
<!-- icecast.xml, beside the /user1 to /user4 blocks -->
<mount type="normal">
    <mount-name>/ici</mount-name>
    <password>ICI_SOURCE_PASSWORD</password>
    <on-connect>/usr/local/bin/icecast_on_connect.sh</on-connect>
    <on-disconnect>/usr/local/bin/icecast_on_disconnect.sh</on-disconnect>
</mount>
```

A password of its own means `/ici` can be closed or changed without touching the user mounts. Make one, and send it to Albert by Signal or in person, never in a repository or an email thread:

```sh
openssl rand -base64 24
```

Then reload Icecast so it reads the new mount:

```sh
sudo systemctl reload icecast2      # sends HUP
sudo systemctl status icecast2 --no-pager | head -5
```

Assumption: the server runs Debian's `icecast2` package (the hooks name the `icecast2` user) and re-reads mounts on HUP. If `/ici` still refuses after a reload, `sudo systemctl restart icecast2` does it, and drops the listeners of the other mounts for a moment.

**Check**

```sh
# a 60 second test tone as the source, from any machine
ffmpeg -re -f lavfi -i "sine=frequency=440:duration=60" -c:a libmp3lame -b:a 128k \
  -content_type audio/mpeg -ice_name "ici test" -ice_description "Test tone" \
  -f mp3 "icecast://source:ICI_SOURCE_PASSWORD@live.uuu.ee:8001/ici"

# on the server, while it plays: the hook ran and published
tail -n 20 /tmp/icecast_hooks.log
```

The log shows `[on-connect] invoked: mount='/ici' channel='ici'`, then `resolved name='ici test'` and `publish response: http=200`. After the tone ends it shows `[on-disconnect]` and `unpublish response: http=200`. A test sends a real push to every phone, so run it once, at a sensible hour.

**Prompt**

```text
On the live.uuu.ee Icecast server, add a mount /ici to icecast.xml next to the
/user1 to /user4 blocks. Copy the on-connect and on-disconnect lines exactly
from the existing /user1 block (they run icecast_on_connect.sh and
icecast_on_disconnect.sh from tarmoj/radio1965 server/). Give /ici its own
<password>, generated with `openssl rand -base64 24`, and print it once so I
can pass it on; do not write it anywhere else. Validate the XML with xmllint,
back up the old icecast.xml, reload icecast2 and confirm it is still serving
/radio1965. Then show me the ffmpeg test-tone command for /ici, but do not run
it: it sends a push to every phone.
```

## 2. The source on the Raspberry Pi

**Who:** Albert. **Mirrors:** `server/notifications.py` (Firebase Admin in Python with a service account file, `server/config/README.md`) and `app/icecastbroadcaster.cpp` (the headers Väin's own broadcaster sends to the same server).

### Files

```text
/opt/ici/pick.py                    the picker
/opt/ici/ici.liq                    the Liquidsoap script
/opt/ici/.venv/                     python3 -m venv /opt/ici/.venv && /opt/ici/.venv/bin/pip install firebase-admin
/etc/ici/ici.env                    settings and the source password, mode 600, owner ici
/etc/ici/service-account.json       Firebase service account key, mode 600, owner ici
/var/cache/ici/                     converted fragments, made by systemd
/etc/systemd/system/ici.service
/etc/systemd/system/ici.timer
```

```sh
sudo useradd --system --home /var/cache/ici --shell /usr/sbin/nologin ici
sudo install -d -o ici -g ici -m 700 /etc/ici
sudo apt install ffmpeg python3-venv
```

The service account needs only the role Storage Object Viewer. Make it in Google Cloud Console under IAM, Service Accounts, then Keys, Add key, JSON.

```sh
# /etc/ici/ici.env
ICI_PASSWORD=ICI_SOURCE_PASSWORD
ICI_CREDENTIALS=/etc/ici/service-account.json
ICI_BUCKET=YOUR-PROJECT.firebasestorage.app
ICI_PREFIX=recordings/
ICI_SINCE=2026-11-01T00:00:00+00:00
ICI_CACHE=/var/cache/ici
ICI_PICKER="/opt/ici/.venv/bin/python /opt/ici/pick.py"
```

Assumption: the bucket name and `recordings/` prefix are placeholders, ici's real ones are in its Firebase console. Older projects use `YOUR-PROJECT.appspot.com`.

### The picker

```python
#!/usr/bin/env python3
# /opt/ici/pick.py: print the path of one ici fragment as WAV, or nothing.
import hashlib, json, os, random, subprocess, sys, time
from datetime import datetime, timezone

import firebase_admin
from firebase_admin import credentials, storage

CACHE = os.environ.get("ICI_CACHE", "/var/cache/ici")
PLAYED = os.path.join(CACHE, "played.json")
NO_REPEAT = 20  # none of the last 20 again


def weight(age_hours):
    # last 24 hours first, then half as likely for every day older
    return 1.0 if age_hours < 24 else 0.5 ** ((age_hours - 24) / 24)


def main():
    firebase_admin.initialize_app(
        credentials.Certificate(os.environ["ICI_CREDENTIALS"]),
        {"storageBucket": os.environ["ICI_BUCKET"]},
    )
    bucket = storage.bucket()
    now = datetime.now(timezone.utc)
    since = os.environ.get("ICI_SINCE")
    since = datetime.fromisoformat(since) if since else None

    try:
        played = json.load(open(PLAYED))
    except (OSError, ValueError):
        played = []

    blobs = [
        b for b in bucket.list_blobs(prefix=os.environ.get("ICI_PREFIX", ""))
        if b.size and not b.name.endswith("/")
        and (since is None or b.time_created >= since)
    ]
    # skip the recently played, unless they are all there is
    blobs = [b for b in blobs if b.name not in played] or blobs
    if not blobs:
        return 1

    ages = [(now - b.time_created).total_seconds() / 3600 for b in blobs]
    blob = random.choices(blobs, weights=[weight(a) for a in ages])[0]

    key = hashlib.sha1(f"{blob.name}#{blob.generation}".encode()).hexdigest()[:16]
    wav = os.path.join(CACHE, key + ".wav")
    if not os.path.exists(wav):
        src = os.path.join(CACHE, key + ".src")
        blob.download_to_filename(src)
        # WebM/Opus from Chrome or MP4/AAC from Safari, both become 44.1 kHz stereo WAV
        subprocess.run(
            ["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-i", src, "-vn",
             "-ac", "2", "-ar", "44100", "-af", "loudnorm=I=-18:TP=-2", wav],
            check=True,
        )
        os.remove(src)

    json.dump((played + [blob.name])[-NO_REPEAT:], open(PLAYED, "w"))

    # forget fragments not played for two days
    for f in os.listdir(CACHE):
        p = os.path.join(CACHE, f)
        if f.endswith(".wav") and time.time() - os.path.getmtime(p) > 172800:
            os.remove(p)
    os.utime(wav)

    print(wav)
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

Assumption: ici's own weighting is not public, so `weight()` is a stand-in for "last 24 hours first, older ones less and less". Albert's rule replaces it.

### The Liquidsoap script

Written against Liquidsoap 2.4.5, the current release. Debian trixie ships 2.3.2, which should run it. Bookworm's 2.1.3 is too old, so on a bookworm Pi install `liquidsoap_2.4.5-debian-trixie-*_arm64.deb` from the [releases](https://github.com/savonet/liquidsoap/releases) or move to trixie.

```liquidsoap
# /opt/ici/ici.liq: one fragment, then silence for 20 to 120 s, never disconnecting.
settings.log.stdout := true
settings.log.file := false

picker = environment.get(default="/opt/ici/.venv/bin/python /opt/ici/pick.py", "ICI_PICKER")

fragments = request.queue(id="ici")

# Runs in its own thread, so a slow Firebase never stalls the stream.
# The returned number is the seconds until the next fragment.
def next_fragment() =
  path = string.trim(process.read(timeout=60., picker))
  if path != "" then
    log.important(label="ici", "fragment #{path}")
    fragments.push.uri(path)
    15. + random.float(min=20., max=120.)
  else
    log.important(label="ici", "nothing to play, asking again in 30 s")
    30.
  end
end

thread.run.recurrent(fast=false, delay=5., next_fragment)

# Silence whenever the queue is empty, so Icecast always gets MP3 frames.
radio = mksafe(fragments)

output.icecast(
  %mp3(bitrate=128, samplerate=44100, stereo=true),
  host="live.uuu.ee",
  port=8001,
  mount="ici",
  password=environment.get("ICI_PASSWORD"),
  name="ici",
  description="Mostly silence. Now and then, 15 seconds somebody recorded today. Record yours at ICI-APP-ADDRESS",
  genre="avant-garde",
  url="ICI-APP-ADDRESS",
  # Icecast reads ice-name and ice-description as Latin-1, see app/icecastbroadcaster.cpp
  encoding="ISO-8859-1",
  public=false,
  # read back by icecast_on_connect.sh: push on connect, do not record the session
  headers=[("ice-audio-info", "send_notification=1;save_stream=0")],
  radio
)
```

The name and description are what Väin shows: `icecast_on_connect.sh` copies `server_name` into the card title and `server_description` into its summary. The `headers` entry replaces the `ice-audio-info` Liquidsoap would send, read in its `icecast2.ml` and in `cry.ml`.

### Starting it for the session

```ini
# /etc/systemd/system/ici.service
[Unit]
Description=ici on Väin, one session
Wants=network-online.target
After=network-online.target

[Service]
Type=simple
User=ici
Group=ici
EnvironmentFile=/etc/ici/ici.env
CacheDirectory=ici
# the slot: 56 minutes, then a clean disconnect, which takes the card down
ExecStart=/usr/bin/timeout 56m /usr/bin/liquidsoap /opt/ici/ici.liq
SuccessExitStatus=124
Restart=on-failure
RestartSec=15
```

```ini
# /etc/systemd/system/ici.timer
[Unit]
Description=ici session every evening

[Timer]
OnCalendar=*-*-* 20:00:00 Europe/Tallinn
AccuracySec=1s

[Install]
WantedBy=timers.target
```

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now ici.timer
```

For always on instead of a session, drop `timeout 56m` from `ExecStart`, add `[Install]` with `WantedBy=multi-user.target` to the service and enable it in place of the timer.

**Check**

```sh
# the picker alone, as the service user
sudo -u ici bash -c 'set -a; . /etc/ici/ici.env; /opt/ici/.venv/bin/python /opt/ici/pick.py'
ffprobe -hide_banner /var/cache/ici/*.wav 2>&1 | grep Stream

# the script parses
liquidsoap --check /opt/ici/ici.liq

# the timer is set
systemctl list-timers ici.timer
```

The picker prints one path like `/var/cache/ici/3f9a0c1e2b4d5a6f.wav`, and `ffprobe` shows `Audio: pcm_s16le, 44100 Hz, stereo`. `--check` prints nothing and exits 0. `list-timers` shows the next run at 20:00.

To run one session now, `sudo systemctl start ici.service`, then `journalctl -u ici -f` shows `Connection setup was successful.` and a `fragment` line every one to two and a half minutes.

**Prompt**

```text
On a Raspberry Pi (Debian, arm64), set up the ici source for Väin from the
doc at https://eccm.positron.studio/docs/ici, section 2: /opt/ici/pick.py,
/opt/ici/ici.liq, /etc/ici/ici.env, ici.service and ici.timer, exactly as
written there, with a system user ici. Install ffmpeg, python3-venv and
firebase-admin in /opt/ici/.venv, and Liquidsoap 2.3 or newer (the 2.4.5
trixie arm64 .deb from github.com/savonet/liquidsoap/releases if apt has an
older one). I will put the service account JSON at
/etc/ici/service-account.json and fill ICI_PASSWORD, ICI_BUCKET, ICI_PREFIX
and ICI_SINCE myself; never print or log them. Replace the weight() function
in pick.py with this rule if I give you one: <ici's own rule, or delete this
line>. Verify: run the picker as user ici and ffprobe its output, run
`liquidsoap --check`, and show `systemctl list-timers ici.timer`. Do not start
ici.service: a session sends a push to every Väin phone.
```

## 3. Checks during a session

Run these while the service is on air.

```sh
# the stream itself: name, description, format
ffprobe -hide_banner http://live.uuu.ee:8001/ici 2>&1 | grep -E 'icy-name|icy-description|Stream'
```

Prints `icy-name : ici`, the description, and `Stream #0:0: Audio: mp3, 44100 Hz, stereo, fltp, 128 kb/s`.

```sh
# what the on-connect hook reads
curl -s http://live.uuu.ee:8001/status-json.xsl | jq '.icestats.source
  | (if type=="array" then . else [.] end)
  | map(select(.listenurl | endswith("/ici")))[0]
  | {server_name, server_description, send_notification, save_stream, listeners, stream_start}'
```

Prints `"server_name": "ici"`, the description, `"send_notification": 1`, `"save_stream": 0`, the listener count and the start time.

```sh
# the card in Väin's feed
curl -s https://live.uuu.ee/radio1965/api/events | jq '.events[]
  | select(.url == "http://live.uuu.ee:8001/ici")
  | {type, title, summary, status, publish_at, shelf_at}'
```

Prints `"type": "livestream"`, `"title": "ici on ici"`, the description as `summary`, `"status": "new"`, and `shelf_at` one day after `publish_at`. After the session it prints nothing, because the disconnect hook archives the card.

```sh
# the gaps are silence, not a dropped stream: a minute should show at least one long silence
ffmpeg -nostdin -t 60 -i http://live.uuu.ee:8001/ici -af silencedetect=noise=-60dB:d=10 -f null - 2>&1 | grep silence_
```

Prints `silence_start` and `silence_end` lines, and the command reads a full 60 s without a connection error.

Port 8001 is plain HTTP on a port some networks block, so a failure from a phone hotspot or an office proxy is worth one retry from another network before it counts.

## Not doing

- **A card for every recording.** Every published card sends a push, so this would mean a notification every few minutes.
- **Recording inside Väin.** Väin's server has no upload, and ici's web app already records and stores.
- **A relay on this site or on positron.** Väin plays plain HTTP Icecast directly, and only a web page on HTTPS needs one.
