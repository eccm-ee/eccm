// edge.mjs: the answers kept in the data centre's cache (the Cache API, free), so a crawler costs D1 nothing.
// Asked 2026-11-15 after D1's free daily reads ran out at 17:50 UTC and eccm.ee answered 500 until midnight:
// d1 insights put 3.9 million of the day's reads on the events list (373 rows each, 10,437 times) and 1.5 million
// on the old addresses' legacy_path lookups (101,809 times), and wrangler tail showed SemrushBot, ExaSearchBot and
// Googlebot walking the old JEvents calendar (?iccaldate=1641-6-1, 2300-07-1).
// A page, a feed or a calendar is fresh for five minutes, a redirect or a 410 for an hour; a stale copy is kept a
// day and sent when the Worker fails, so a D1 outage shows the last pages instead of a 500. An editor (the
// session cookie) always gets a fresh page. A cached 404 or redirect is not logged again (src/redirects.mjs).
const NOT = /^\/(admin|edit|login|logout|ui|media|og|img|cdn-cgi|radio1965|uudiskiri|et\/uudiskiri|en\/newsletter|et\/kontakt|en\/contact)(\/|$)/;
const TYPES = /^(text\/html|application\/(rss\+)?xml|text\/calendar)/;
const FRESH = { 200: 300, 404: 300, 301: 3600, 410: 3600 };
const KEEP = 86400;
const AT = 'x-edge-at', CC = 'x-edge-cc';

// the kept copy as the reader gets it: its own cache-control back, the cache's marks off, x-edge saying which
function served(hit, how = 'hit') {
  const out = new Response(hit.body, hit);
  out.headers.set('x-edge', how);
  out.headers.set('cache-control', hit.headers.get(CC) || 'no-store');
  out.headers.delete(AT); out.headers.delete(CC);
  return out;
}

// the address as the cache keys it, without the trackers, which change nothing on the page
function keyOf(url) {
  const u = new URL(url);
  for (const k of [...u.searchParams.keys()]) if (k === 'fbclid' || k === 'gclid' || k === 'from' || k.startsWith('utm_')) u.searchParams.delete(k);
  return new Request(u.toString(), { method: 'GET' });
}

export async function edge(request, ctx, run) {
  const url = new URL(request.url);
  const cache = globalThis.caches?.default;
  if (!cache || request.method !== 'GET' || NOT.test(url.pathname) || /(?:^|;\s*)eccm_editor=/.test(request.headers.get('cookie') || '')) return run();
  const key = keyOf(url);
  const hit = await cache.match(key).catch(() => null);
  if (hit && Date.now() - Number(hit.headers.get(AT) || 0) < 1000 * (FRESH[hit.status] || 0)) return served(hit);
  let res;
  try { res = await run(); } catch (e) { if (hit) return served(hit, 'stale'); throw e; }
  if (res.status >= 500 && hit) return served(hit, 'stale');
  const typed = res.status === 301 || res.status === 410 || TYPES.test(res.headers.get('content-type') || '');
  if (FRESH[res.status] && typed && !res.headers.has('set-cookie') && !res.webSocket) {
    const copy = new Response(res.clone().body, res);
    copy.headers.set(AT, String(Date.now()));
    copy.headers.set(CC, res.headers.get('cache-control') || '');
    copy.headers.set('cache-control', `public, s-maxage=${KEEP}`);
    copy.headers.delete('vary');
    ctx.waitUntil(cache.put(key, copy).catch(() => {}));
  }
  return res;
}
