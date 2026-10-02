// items.mjs: the This device section of /items (src/render/items.mjs), the only
// part of the page that needs a script, since only the browser knows whether
// it can be told and whether it has asked. The steps are public/push.mjs.
import { standalone, offered, apple, told, enable, disable } from '/push.mjs';

const say = document.getElementById('push-say');
const on = document.getElementById('push-on');
const off = document.getElementById('push-off');
const count = say.textContent;
// public/push.mjs answers in Estonian for the public bar; this admin page says it in English
const FAIL = { 'Saatmise võti on serveris seadistamata.': 'The push key is not set up on the server.', 'Server ei võtnud seda seadet vastu.': 'The server did not accept this device.' };

async function paint(line) {
  on.hidden = true; off.hidden = true;
  if (line) { say.textContent = `${line} ${count}`; return; }
  if (!offered) {
    say.textContent = apple && !standalone
      ? `On iPhone and iPad, notifications arrive when ECCM is on the Home Screen: Share, then Add to Home Screen, and open ECCM from there. ${count}`
      : `This browser does not support notifications. ${count}`;
    return;
  }
  if (Notification.permission === 'denied') { say.textContent = `Notifications are blocked in this browser. Allow them in the browser settings. ${count}`; return; }
  if (await told()) { say.textContent = `This device gets notifications. ${count}`; off.hidden = false; return; }
  say.textContent = `This device does not get notifications. ${count}`;
  on.hidden = false;
}

on.addEventListener('click', () => {
  on.disabled = true;
  enable().then((r) => (r === 'on' ? location.reload() : paint(r === 'refused' ? '' : `Failed: ${FAIL[r] || r}`))).finally(() => { on.disabled = false; });
});

off.addEventListener('click', async () => {
  off.disabled = true;
  await disable();
  location.reload();
});

paint();

// the list keeps itself current: a notice written on another device, or one
// reaching its moment, shows without a reload. Every ten seconds while the
// page is in sight, and at once when it comes back, since a phone freezes the
// timers of a page in the background (positron's demo/items measured it); the
// list is swapped only when its markup changed, so nothing moves under a reader
const list = document.getElementById('items-list');
let last = null;
async function refresh() {
  if (document.visibilityState !== 'visible') return;
  const r = await fetch('/items/list', { cache: 'no-store' }).catch(() => null);
  if (!r?.ok) return;
  const text = await r.text();
  if (last !== null && text !== last) list.innerHTML = text;
  last = text;
}
setInterval(refresh, 10000);
addEventListener('visibilitychange', refresh);
addEventListener('pageshow', refresh);
refresh();
