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
