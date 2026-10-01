// items.mjs: the See seade section of /items (src/render/items.mjs), the only
// part of the page that needs a script, since only the browser knows whether
// it can be told and whether it has asked. Positron's demo/items had the same
// two steps; what carried over is what it learned:
// - iOS hides Notification and PushManager until the site is on the Home
//   Screen, so their absence there is a step to name, not a broken browser;
// - the permission prompt shows only inside a press, so requestPermission is
//   reached with nothing awaited in front of it;
// - a subscription the server never stored receives nothing and looks fine,
//   so the page says what the server answered.
const box = document.querySelector('.items-device');
const say = document.getElementById('push-say');
const on = document.getElementById('push-on');
const off = document.getElementById('push-off');
const key = box.dataset.key;
const count = say.textContent;

const standalone = navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
const offered = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
const apple = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// the worker only shows notifications and caches nothing (public/sw.js), so
// registering it on every visit costs one small file
const reg = offered ? navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => null) : Promise.resolve(null);

const post = (path, body) => fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }).then((r) => r.ok);
const b64 = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

async function paint(line) {
  on.hidden = true; off.hidden = true;
  if (line) { say.textContent = `${line} ${count}`; return; }
  if (!offered) {
    say.textContent = apple && !standalone
      ? `iPhone'is ja iPadis tulevad teated siis, kui ECCM on avaekraanil: Jaga, siis Lisa avaekraanile, ja ava ECCM sealt. ${count}`
      : `See brauser teateid ei toeta. ${count}`;
    return;
  }
  if (!key) { say.textContent = `Saatmise võti on serveris seadistamata. ${count}`; return; }
  if (Notification.permission === 'denied') { say.textContent = `Teated on selles brauseris keelatud, luba need brauseri seadetes. ${count}`; return; }
  const sub = await (await reg)?.pushManager.getSubscription();
  if (sub && Notification.permission === 'granted') { say.textContent = `See seade saab teated. ${count}`; off.hidden = false; return; }
  say.textContent = `See seade teateid ei saa. ${count}`;
  on.hidden = false;
}

on.addEventListener('click', () => {
  // asked first, inside the press, before anything is awaited
  const asked = Notification.requestPermission();
  on.disabled = true;
  (async () => {
    if (await asked !== 'granted') return paint();
    const r = await reg;
    await navigator.serviceWorker.ready;
    const sub = (await r.pushManager.getSubscription()) || await r.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(key) });
    if (!await post('/items/subscribe', sub.toJSON())) return paint('Server ei võtnud seda seadet vastu, proovi uuesti.');
    location.reload();
  })().catch((e) => paint(`Ei õnnestunud: ${e.message}`)).finally(() => { on.disabled = false; });
});

off.addEventListener('click', async () => {
  off.disabled = true;
  const sub = await (await reg)?.pushManager.getSubscription();
  if (sub) { await post('/items/unsubscribe', { endpoint: sub.endpoint }); await sub.unsubscribe(); }
  location.reload();
});

paint();
