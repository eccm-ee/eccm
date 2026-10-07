// ici.mjs: /docs/ici, who does what to put Albert Saprykin's ici on Väin
// (asked 2026-10-07: "make a page to ../eccm to /docs/ici with who needs to do
// what"). The plan is positron's plans/plan-ici-vain.md. Read from
// tarmoj/radio1965 at 0ff5e8a (2026-08-29, not fetched since); nothing was
// measured against live.uuu.ee and nothing is built. Two findings about
// Tarmo's server are left out of this page on purpose because the page is
// public; they go to him directly.
import { html } from './html.mjs';
import { page } from './chrome.mjs';
import { table } from './table.mjs';

const part = (title, body) => html`<section class="rk-part">
    <h2>${title}</h2>
    ${body}
  </section>`;
const two = (label, a, b, rows) => table({ label, cols: [{ label: a }, { label: b, cls: 'main' }], rows });
const three = (label, a, b, c, rows) => table({ label, cols: [{ label: a }, { label: b, cls: 'main' }, { label: c, cls: 'wrap' }], rows });

const HOW = [
  ['Record', 'A visitor records 15 seconds on a phone in ici’s own web app, reached by a QR code.'],
  ['Store', 'The recording goes to ici’s own Firebase Storage, as it does today.'],
  ['Play', 'A source program picks a recording, last 24 hours first, plays it, then sends silence for a random while. That is the television of the installation.'],
  ['Broadcast', 'The source sends MP3 to an Icecast mount on live.uuu.ee, named ici.'],
  ['Announce', 'Väin’s on-connect hook already turns any source on a mount into a livestream card and a push. Nothing in Väin changes.'],
  ['Recede', 'Väin moves a card to the shelf after one day, the same 24 hours ici already uses.'],
];

const WHO = [
  ['Albert', 'Agree to ici on Väin, and say which recordings may be broadcast.', 'A conversation'],
  ['Albert', 'Run the source: a Liquidsoap script with a picker that reads Firebase and weights by age. Silence between fragments is sent, never nothing, or Icecast drops the source.', 'About a day'],
  ['Albert', 'A machine that stays on for the sessions. The Raspberry Pi he uses for Ariel will do.', 'None new'],
  ['Albert', 'The card text: the stream name ici and a description saying it is mostly silence, with the address of ici’s web app.', 'Minutes'],
  ['Tarmo', 'An ici mount in icecast.xml with the same on-connect and on-disconnect hooks as user1 to user4, and its source password to Albert.', 'Minutes'],
  ['ECCM', 'Agree to the load on live.uuu.ee: one source for each session, and the listeners Väin brings.', 'A conversation'],
  ['ECCM', 'Choose the slot: when the session runs and for how long.', 'A conversation'],
  ['Nobody', 'The Väin app, its server code, and this site.', 'None'],
];

const DECIDE = [
  ['Sessions or always on', 'A source that stays connected makes one card, and the card goes to the shelf after a day while the stream is still live. A daily session gives one push and one fresh card a day. Recommended: a session.'],
  ['Slot', 'Radio 1965 works in 28, 56 and 112 minute slots with silence between programmes. Which one ici gets is ECCM’s and Albert’s call.'],
  ['Freiburg recordings', 'The 200 recordings from June 2025 were given to an installation in a foyer, and broadcasting them is a new use. Starting with recordings made after the app says they will be broadcast avoids the question.'],
  ['Mount', 'A mount of its own, ici, or one of user1 to user4. Its own name keeps the card title right.'],
];

const NOT = [
  ['A card for every recording', 'Every published card sends a push, so this would mean a notification every few minutes.'],
  ['Recording inside Väin', 'Väin’s server has no upload. ici’s web app already records and stores.'],
  ['A relay on this site or on positron', 'Väin plays plain HTTP Icecast directly. A relay is only needed by a web page on HTTPS.'],
];

export const renderIci = () => page({
  wide: true, lang: 'en', title: 'ici on Väin.',
  body: html`  <p class="crumb"><a href="/docs">Docs</a></p>
  <h1>ici on Väin</h1>
  <p class="note">Albert Saprykin’s ici as a session on Väin, with nothing in between. Read from Väin’s code on 7 October 2026, nothing built yet.</p>
  ${part('Who does what', three('Who does what', 'Who', 'What', 'Size', WHO))}
  ${part('How it works', two('How it works', 'Step', 'What happens', HOW))}
  ${part('To decide', two('To decide', 'What', 'Why', DECIDE))}
  ${part('Not doing', two('Not doing', 'What', 'Why not', NOT))}`,
});
