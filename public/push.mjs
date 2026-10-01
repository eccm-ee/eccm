// push.mjs: turning notifications on, one copy for the bar under the header
// (site.mjs) and the See seade section of /items (items.mjs). What positron's
// demo/items learned is kept here:
// - iOS hides Notification and PushManager until the site is on the Home
//   Screen, so their absence there is a step to name, not a broken browser;
// - the permission prompt shows only inside a press, so enable() reaches
//   requestPermission with nothing awaited in front of it;
// - a subscription the server never stored receives nothing and looks fine,
//   so enable() says what the server answered.
export const standalone = navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
export const offered = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
export const apple = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// the worker only shows notifications and caches nothing (public/sw.js), so
// registering it on every visit costs one small file
const reg = offered ? navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => null) : Promise.resolve(null);
const post = (path, body) => fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }).then((r) => r.ok);
const b64 = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

export const subscription = async () => (offered ? (await reg)?.pushManager.getSubscription() : null);
export const told = async () => offered && Notification.permission === 'granted' && !!(await subscription());

// called from a click handler, synchronously: the answer is 'on', 'refused'
// or the reason it failed
export function enable() {
  const asked = Notification.requestPermission();
  return (async () => {
    if (await asked !== 'granted') return 'refused';
    const r = await reg;
    await navigator.serviceWorker.ready;
    const { key } = await (await fetch('/items/key')).json();
    if (!key) return 'Saatmise võti on serveris seadistamata.';
    const sub = (await r.pushManager.getSubscription()) || await r.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(key) });
    return (await post('/items/subscribe', sub.toJSON())) ? 'on' : 'Server ei võtnud seda seadet vastu.';
  })().catch((e) => e.message);
}

export async function disable() {
  const sub = await subscription();
  if (sub) { await post('/items/unsubscribe', { endpoint: sub.endpoint }); await sub.unsubscribe(); }
}
