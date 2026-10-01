// route.mjs: GET /og/e/{id}-{lang}-{v}.png, the event's share image, and
// GET /og/e.json, the current cards for /ds. trip's contract
// (trip/astro-prod/src/pages/og/t/[card].png.ts, plans/plan-eccm-social-images.md
// sections 3 and 5): v is a hash of everything the card shows, so a change of
// title, date, venue or scheme is a new URL and nothing is ever purged; a
// card is rendered once, on its first fetch, and then read back. Three
// places, nearest first: this colo's Cache API, the R2 bucket MEDIA under
// og/e/, and a render that fills both after the response. A stale v answers
// 302 to the current card and a missing event 404, both no-store, so a
// fetch made before the content exists cannot poison the URL.
import { cardInput, cardVersion, cardPath, cardSvg, W } from './card.mjs';
import { renderPng } from './render.mjs';

const CC = 'public, max-age=31536000, immutable';
const png = (body, from) => new Response(body, { headers: { 'content-type': 'image/png', 'cache-control': CC, 'x-og': from } });
const none = (status, headers = {}) => new Response(null, { status, headers: { 'cache-control': 'no-store', ...headers } });
const CARD = /^\/og\/e\/(\d+)-(et|en)-([0-9a-f]{8})\.png$/;

// the card's rows for one event in one language, the queries the event page
// makes: its text in that language or the Estonian one, the picture's scheme
async function rows(db, id, lang) {
  const ev = await db.prepare("SELECT * FROM event WHERE id = ? AND status = 'published'").bind(id).first();
  if (!ev) return null;
  const text = await db.prepare('SELECT title FROM event_text WHERE event_id = ? AND lang = ?').bind(id, lang).first()
    || await db.prepare("SELECT title FROM event_text WHERE event_id = ? AND lang = 'et'").bind(id).first();
  if (!text) return null;
  const media = ev.image_id ? await db.prepare('SELECT scheme FROM media WHERE id = ?').bind(ev.image_id).first() : null;
  return cardInput({ lang, title: text.title, ev, scheme: media && media.scheme });
}

export async function ogRoute(request, env, url, ctx) {
  const p = url.pathname;
  if (p === '/og/e.json') return list(env, url);
  const m = CARD.exec(p);
  if (!m) return null;
  const [, id, lang, v] = m;
  const cache = caches.default;
  const hit = await cache.match(request);
  if (hit) return png(hit.body, 'cache');
  const key = `og/e/${id}-${lang}-${v}.png`;
  const stored = env.MEDIA && await env.MEDIA.get(key);
  if (stored) {
    const bytes = await stored.arrayBuffer();
    ctx.waitUntil(cache.put(request, png(bytes, 'cache')));
    return png(bytes, 'r2');
  }
  const input = await rows(env.DB, Number(id), lang);
  if (!input) return none(404);
  const now = cardVersion(input);
  if (now !== v) return none(302, { location: cardPath(id, lang, now) });
  const bytes = await renderPng(cardSvg(input), W);
  // after the response, and a failure said in the log rather than dropped (trip's lib/bg.ts)
  const keep = (what, p) => ctx.waitUntil(p.catch((e) => console.error(JSON.stringify({ msg: 'og-keep-failed', what, key, err: String(e) }))));
  if (env.MEDIA) keep('r2', env.MEDIA.put(key, bytes, { httpMetadata: { contentType: 'image/png', cacheControl: CC } }));
  keep('cache', cache.put(request, png(bytes, 'cache')));
  return png(bytes, 'render');
}

// every published event's card in each language it has a text in, newest
// start first, for the design system page; the urls are the ones the event
// pages carry, so /ds shows what a scraper fetches
async function list(env, url) {
  const all = (await env.DB.prepare(`SELECT e.id, e.starts_at, t.lang, t.slug FROM event e JOIN event_text t ON t.event_id = e.id
    WHERE e.status = 'published' ORDER BY e.starts_at DESC, e.id, t.lang`).all()).results;
  const out = [];
  for (const r of all) {
    const input = await rows(env.DB, r.id, r.lang);
    if (!input) continue;
    out.push({ id: r.id, lang: r.lang, title: input.title, serif: input.serif, ground: input.ground, page: r.lang === 'et' ? `/et/sundmused/${r.slug}` : `/en/events/${r.slug}`, image: cardPath(r.id, r.lang, cardVersion(input)) });
  }
  return new Response(JSON.stringify(out), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=60' } });
}
