# Väin tech notes

Read from Väin's code at `4f9cecb` (6 October 2026). Each note is a change Tarmo can take or leave. `icecast.xml` and the nginx config are not in the repository, so those snippets follow what the code says about them.

## Before `eccm.ee` moves

For the festival, on the server as it is.

### How it fits together

1. A source (the app, OBS, ffmpeg) sends MP3 to a mount on Icecast, port 8001.
2. Icecast runs `server/icecast_on_connect.sh`. It reads the source's name and flags from `status-json.xsl`, starts a recording if asked, and posts a `livestream` card to the API, FastAPI behind nginx at `https://live.uuu.ee/radio1965/api`.
3. The API stores the card in MariaDB and sends one Firebase push to the topic `radio65_event`.
4. On disconnect, `server/icecast_on_disconnect.sh` archives the card, copies the recording to `eccm.ee` by ssh, and turns the card into a `streamrecording`.
5. A cron job every minute publishes scheduled cards and shelves cards a day old.

### Who may write

With new contributors and a wider audience at the festival, the API's write and push routes should check who is calling: the hooks with a shared secret, the app and editor with a contributor's token.

```python
# server/main.py
HOOK_SECRET = os.environ["RADIO65_HOOK_SECRET"]   # shared with the two hook scripts only

def require_writer(request: Request, session: Session = Depends(db.get_db)):
    if secrets.compare_digest(request.headers.get("x-hook-secret", ""), HOOK_SECRET):
        return None                                   # the Icecast hooks
    token = request.headers.get("authorization", "").removeprefix("Bearer ")
    user = session.query(db.User).filter(db.User.access_token == token).one_or_none() if token else None
    if not user or user.role not in ("contributor", "manager"):
        raise HTTPException(status_code=401, detail="Sign in as a contributor")
    return user

@app.post("/events/publish")
def publish_event(event: EventIn, session: Session = Depends(db.get_db), user=Depends(require_writer)):
    ...
```

The same on unpublish and finalize, managers only on `/notify/*`, CORS narrowed to the editor's and the web page's origins, and the hooks sending `-H "x-hook-secret: $RADIO65_HOOK_SECRET"`. A rate limit on the temporary contributor password belongs here too.

### Channels from a file on the server

The app's channels are written into `app/PlaybackController.qml` and `app/BroadcastPage.qml`, so a new channel is a new build. One file can hold the channels and their rules, served to the app and the web page:

```json
// server/config/channels.json
[
  { "mount": "radio1965", "name": "Raadio Tallinn 1965", "notify": false, "record": false, "broadcast": "managers" },
  { "mount": "live",      "name": "Live",                "notify": true,  "record": true,  "broadcast": "managers" },
  { "mount": "yleheli",   "name": "Üle Heli",            "notify": true,  "record": false, "broadcast": "guests" },
  { "mount": "user1",     "name": "Open 1",              "notify": true,  "record": true,  "broadcast": "contributors" }
]
```

```python
# server/main.py
@app.get("/channels")
def list_channels():
    with open("server/config/channels.json") as f:
        return {"channels": json.load(f)}
```

A guest channel is then a line here and a `<mount>` in `icecast.xml`. A guest tests it from any machine:

```sh
ffmpeg -re -f lavfi -i "sine=frequency=440:duration=60" -c:a libmp3lame -b:a 128k \
  -content_type audio/mpeg -ice_name "Üle Heli" -f mp3 \
  icecast://source:PASSWORD@live.uuu.ee:8001/yleheli
```

### Defaults per channel in the hook

The hook records and notifies unless the source says otherwise, and only the app can say so. OBS, BUTT and ffmpeg cannot, so every guest broadcast is recorded and pushed to everyone. Reading the channel's defaults first fixes that, and records nothing unless asked:

```bash
# server/icecast_on_connect.sh, after NAME/DESCRIPTION are resolved
CHANNELS=/path/to/radio1965/server/config/channels.json
CH=$(jq -c --arg m "$CHANNEL" '.[] | select(.mount == $m)' "$CHANNELS")
SEND_NOTIFICATION=$(echo "$CH" | jq -r '.notify // true')
SAVE_STREAM=$(echo "$CH" | jq -r '.record // false')
[ "$SEND_NOTIFICATION_RAW" = "0" ] && SEND_NOTIFICATION=false
[ "$SEND_NOTIFICATION_RAW" = "1" ] && SEND_NOTIFICATION=true
[ "$SAVE_STREAM_RAW" = "0" ] && SAVE_STREAM=false
[ "$SAVE_STREAM_RAW" = "1" ] && SAVE_STREAM=true
CHANNEL_NAME=$(echo "$CH" | jq -r --arg m "$CHANNEL" '.name // $m')
```

Cards then read "Thomas Ankersmit on Üle Heli", and the `radio1965` special case goes away.

### One push topic for everyone

Every device subscribes to one topic, `radio65_event`, so every guest going live reaches every app user. A topic per channel lets listeners choose. For the festival, `notify: false` on guest channels and one push per Päevamenüü block does it without new code.

### https for audio

Cards point at `http://live.uuu.ee:8001/<mount>`, which an https page cannot play. The nginx that already serves the API can pass Icecast through:

```nginx
# live.uuu.ee, in the server block on 443
location /stream/ {
    proxy_pass http://127.0.0.1:8001/;
    proxy_http_version 1.1;
    proxy_buffering off;
    proxy_request_buffering off;
    proxy_read_timeout 1d;
}
```

Then `https://live.uuu.ee/stream/radio1965` plays in any browser, and `https://live.uuu.ee/stream/status-json.xsl` says who is live. The hook's card `url` changes to match.

### Times without a zone

Feed times have no offset (`2026-10-09T13:53:09`), so a phone in Germany shows them an hour off. A zone-aware `.isoformat()` fixes it for every reader.

### Small things

- `sql/schema.sql` lists seven card types, the code nine. A fresh install fails on the first broadcast.
- Card ids are `evt_<milliseconds>` and can collide. A random suffix avoids it.
- The feed returns the newest 200 cards with no paging.
- Nobody has measured how many listeners U:'s volunteer server carries.

## When `eccm.ee` moves

Five things in Väin touch `eccm.ee`. One keeps working, four need a home of Väin's own before the old hosting is cancelled.

- **Articles: nothing to do.** Väin polls `eccm.ee`'s Joomla API for category 47. The new site answers the same calls in the same shape, from notices ticked Väin at /items ([Väin](/docs/migration#5-vain)).
- **Recordings** go by ssh into the old hosting's `/radio1965/streams`. Old links keep playing through the new site's pass-through, but uploads stop when the hosting is cancelled.
- **The editor and contributor pages** are deployed there by rsync from the GitHub workflow. They are static and can move to any host.
- **Mail** for sign-up and password resets goes through `mail.eccm.ee`, as long as ECCM's mail stays at Virtuaal.
- **Password reset links** point at `https://eccm.ee/radio1965/contributor/` and follow that page wherever it goes.

## After `eccm.ee` moves

For the station page and Väin on its own.

### What the page reads

Väin's feed (`/radio1965/api/events`) gives every card, kept recordings as `streamrecording`. Icecast's `status-json.xsl` gives who is live and how many listen. The page fetches both on the server, caches them for 30 seconds, and needs no database.

### Domains

Checked in the registry (`whois.tld.ee`): `väin.ee` (`xn--vin-qla.ee`), `raadiotallinn1965.ee` and `radiotallinn1965.ee` are free. `vain.ee` is registered until 9 November 2029.

### Images

Väin has no image support in its code or feed. Pictures appear only inside `eccm.ee` articles.
