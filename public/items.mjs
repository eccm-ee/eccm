// items.mjs: the See seade section of /items (src/render/items.mjs), the only
// part of the page that needs a script, since only the browser knows whether
// it can be told and whether it has asked. The steps are public/push.mjs.
import { standalone, offered, apple, told, enable, disable } from '/push.mjs';

const say = document.getElementById('push-say');
const on = document.getElementById('push-on');
const off = document.getElementById('push-off');
const count = say.textContent;

async function paint(line) {
  on.hidden = true; off.hidden = true;
  if (line) { say.textContent = `${line} ${count}`; return; }
  if (!offered) {
    say.textContent = apple && !standalone
      ? `iPhone'is ja iPadis tulevad teated siis, kui ECCM on avaekraanil: Jaga, siis Lisa avaekraanile, ja ava ECCM sealt. ${count}`
      : `See brauser teateid ei toeta. ${count}`;
    return;
  }
  if (Notification.permission === 'denied') { say.textContent = `Teated on selles brauseris keelatud, luba need brauseri seadetes. ${count}`; return; }
  if (await told()) { say.textContent = `See seade saab teated. ${count}`; off.hidden = false; return; }
  say.textContent = `See seade teateid ei saa. ${count}`;
  on.hidden = false;
}

on.addEventListener('click', () => {
  on.disabled = true;
  enable().then((r) => (r === 'on' ? location.reload() : paint(r === 'refused' ? '' : `Ei õnnestunud: ${r}`))).finally(() => { on.disabled = false; });
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
