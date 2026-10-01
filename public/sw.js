// sw.js: the half of /items that runs when no page does, positron's
// demo/items/push-sw.js moved here (2026-10-01). Served from the root, so its
// scope is the whole site and a notification can open any page of it.
//
// It caches nothing and has no fetch handler, on purpose: every page here
// changes on deploy and a worker serving a returning visitor the previous one
// makes "still broken" and "the fix never loaded" the same observation. This
// file exists to be awake when a push arrives, and a fetch listener added here
// later would be a bug.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  // always show something: a push that shows nothing makes Chrome post its own
  // "this site has been updated in the background"
  let m = {};
  try { m = event.data ? event.data.json() : {}; } catch { m = { body: event.data ? event.data.text() : '' }; }
  event.waitUntil(self.registration.showNotification(m.title || 'ECCM', {
    body: m.body || '',
    icon: '/icons/icon-192.png',
    // the notice's own id, so two notices stack and a repeat of one does not
    tag: `eccm-${m.id || 'x'}`,
    data: { url: m.url || '/items' },
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || '/items', self.location.origin).href;
  event.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const w of wins) if (w.url === url && 'focus' in w) return w.focus();
    if (self.clients.openWindow) return self.clients.openWindow(url);
  })());
});
