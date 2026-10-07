# ici on Väin

Albert Saprykin's ici as a session on [Väin](https://github.com/tarmoj/radio1965), with nothing in between. Read from Väin's code on 7 October 2026, nothing built yet.

## Who does what

| Who | What | Size |
| --- | --- | --- |
| Albert | Agree to ici on Väin, and say which recordings may be broadcast. | A conversation |
| Albert | Run the source: a Liquidsoap script with a picker that reads Firebase and weights by age. Silence between fragments is sent, never nothing, or Icecast drops the source. | About a day |
| Albert | A machine that stays on for the sessions. The Raspberry Pi he uses for Ariel will do. | None new |
| Albert | The card text: the stream name ici and a description saying it is mostly silence, with the address of ici's web app. | Minutes |
| Tarmo | An ici mount in icecast.xml with the same on-connect and on-disconnect hooks as user1 to user4, and its source password to Albert. | Minutes |
| ECCM | Agree to the load on live.uuu.ee: one source for each session, and the listeners Väin brings. | A conversation |
| ECCM | Choose the slot: when the session runs and for how long. | A conversation |
| Nobody | The Väin app, its server code, and this site. | None |

## How it works

| Step | What happens |
| --- | --- |
| Record | A visitor records 15 seconds on a phone in ici's own web app, reached by a QR code. |
| Store | The recording goes to ici's own Firebase Storage, as it does today. |
| Play | A source program picks a recording, last 24 hours first, plays it, then sends silence for a random while. That is the television of the installation. |
| Broadcast | The source sends MP3 to an Icecast mount on live.uuu.ee, named ici. |
| Announce | Väin's on-connect hook already turns any source on a mount into a livestream card and a push. Nothing in Väin changes. |
| Recede | Väin moves a card to the shelf after one day, the same 24 hours ici already uses. |

## To decide

| What | Why |
| --- | --- |
| Sessions or always on | A source that stays connected makes one card, and the card goes to the shelf after a day while the stream is still live. A daily session gives one push and one fresh card a day. Recommended: a session. |
| Slot | Radio 1965 works in 28, 56 and 112 minute slots with silence between programmes. Which one ici gets is ECCM's and Albert's call. |
| Freiburg recordings | The 200 recordings from June 2025 were given to an installation in a foyer, and broadcasting them is a new use. Starting with recordings made after the app says they will be broadcast avoids the question. |
| Mount | A mount of its own, ici, or one of user1 to user4. Its own name keeps the card title right. |

## Not doing

| What | Why not |
| --- | --- |
| A card for every recording | Every published card sends a push, so this would mean a notification every few minutes. |
| Recording inside Väin | Väin's server has no upload. ici's web app already records and stores. |
| A relay on this site or on positron | Väin plays plain HTTP Icecast directly. A relay is only needed by a web page on HTTPS. |
