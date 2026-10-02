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
import { cardInput, cardVersion, cardPath, tallVersion, tallPath, cardSvg, siteSvg, radioSvg, TEMPLATE_V, SITE_V, W, TALL_W } from './card.mjs';
import { renderPng } from './render.mjs';

const CC = 'public, max-age=31536000, immutable';
const png = (body, from) => new Response(body, { headers: { 'content-type': 'image/png', 'cache-control': CC, 'x-og': from } });
const none = (status, headers = {}) => new Response(null, { status, headers: { 'cache-control': 'no-store', ...headers } });
// /og/e/ the share card, /og/t/ and /og/tp/ the tall 4:5 pair for Instagram
// (2026-10-02); /og/p/, a wide picture layout, came and went the same day
const CARD = /^\/og\/(e|t|tp)\/(\d+)-(et|en)-([0-9a-f]{8})\.png$/;
const VERSION = { e: cardVersion, t: (i) => tallVersion(i), tp: (i) => tallVersion(i, true) };
const PATH = { e: cardPath, t: (id, l, v) => tallPath(id, l, v), tp: (id, l, v) => tallPath(id, l, v, true) };

// the card's rows for one event in one language, the queries the event page
// makes: its text in that language or the Estonian one, the picture's scheme
async function rows(db, id, lang) {
  const ev = await db.prepare("SELECT * FROM event WHERE id = ? AND status = 'published'").bind(id).first();
  if (!ev) return null;
  const text = await db.prepare('SELECT title FROM event_text WHERE event_id = ? AND lang = ?').bind(id, lang).first()
    || await db.prepare("SELECT title FROM event_text WHERE event_id = ? AND lang = 'et'").bind(id).first();
  if (!text) return null;
  const media = ev.image_id ? await db.prepare('SELECT scheme, key FROM media WHERE id = ?').bind(ev.image_id).first() : null;
  return cardInput({ lang, title: text.title, ev, scheme: media && media.scheme, pic: media && media.key });
}

export async function ogRoute(request, env, url, ctx) {
  const p = url.pathname;
  if (p === '/og/e.json') return list(env, url);
  // the site's own card, the logo: one address per language, kept a day, its
  // bytes in R2 under the template's version so a new template renders anew
  const site = /^\/og\/(site|radio)-(et|en)\.png$/.exec(p);
  if (site) {
    const key = `og/${site[1]}-${site[2]}-${TEMPLATE_V}-${SITE_V}.png`;
    const day = (body, from) => new Response(body, { headers: { 'content-type': 'image/png', 'cache-control': 'public, max-age=3600', 'x-og': from } });
    const stored = env.MEDIA && await env.MEDIA.get(key);
    if (stored) return day(await stored.arrayBuffer(), 'r2');
    const bytes = await renderPng((site[1] === 'radio' ? radioSvg : siteSvg)(site[2]), W);
    if (env.MEDIA) ctx.waitUntil(env.MEDIA.put(key, bytes, { httpMetadata: { contentType: 'image/png' } }).catch(() => {}));
    return day(bytes, 'render');
  }
  const m = CARD.exec(p);
  if (!m) return null;
  const [, kind, id, lang, v] = m;
  const cache = caches.default;
  const hit = await cache.match(request);
  if (hit) return png(hit.body, 'cache');
  const key = `og/${kind}/${id}-${lang}-${v}.png`;
  const stored = env.MEDIA && await env.MEDIA.get(key);
  if (stored) {
    const bytes = await stored.arrayBuffer();
    ctx.waitUntil(cache.put(request, png(bytes, 'cache')));
    return png(bytes, 'r2');
  }
  const input = await rows(env.DB, Number(id), lang);
  if (!input) return none(404);
  const withPic = kind === 'tp', tall = kind !== 'e';
  if (withPic && !input.pic) return none(404);
  const now = VERSION[kind](input);
  if (now !== v) return none(302, { location: PATH[kind](id, lang, now) });
  const picture = withPic ? await pictureUri(env, url, input.pic) : null;
  if (withPic && !picture) return none(404);
  const bytes = await renderPng(cardSvg(input, picture, tall), tall ? TALL_W : W);
  // after the response, and a failure said in the log rather than dropped (trip's lib/bg.ts)
  const keep = (what, p) => ctx.waitUntil(p.catch((e) => console.error(JSON.stringify({ msg: 'og-keep-failed', what, key, err: String(e) }))));
  if (env.MEDIA) keep('r2', env.MEDIA.put(key, bytes, { httpMetadata: { contentType: 'image/png', cacheControl: CC } }));
  keep('cache', cache.put(request, png(bytes, 'cache')));
  return png(bytes, 'render');
}

// the event's picture as a data URI for resvg, which reads no URL: an upload
// from the pictures bucket (media/...), a seeded picture from the site's own
// files through the ASSETS binding
async function pictureUri(env, url, key) {
  let res = null;
  if (key.startsWith('media/')) res = env.MEDIA ? await env.MEDIA.get(key) : null;
  else if (env.ASSETS) { const r = await env.ASSETS.fetch(new URL(`/${key}`, url)); res = r.ok ? r : null; }
  if (!res) return null;
  const b = new Uint8Array(await res.arrayBuffer());
  let bin = '';
  for (let i = 0; i < b.length; i += 0x8000) bin += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
  return `data:${/\.png$/i.test(key) ? 'image/png' : 'image/jpeg'};base64,${btoa(bin)}`;
}

// every published event's card in each language it has a text in, newest
// start first, for the design system page; the urls are the ones the event
// pages carry, so /ds shows what a scraper fetches
async function list(env, url) {
  // one query for every card, where it was the event page's four per card
  // (2026-10-02: /social sat on "Loading the events." for seconds over 50)
  const all = (await env.DB.prepare(`SELECT e.*, t.lang, t.slug, t.title, m.scheme, m.key AS pic_key FROM event e
    JOIN event_text t ON t.event_id = e.id LEFT JOIN media m ON m.id = e.image_id
    WHERE e.status = 'published' ORDER BY e.starts_at DESC, e.id, t.lang`).all()).results;
  const out = all.map((r) => {
    const input = cardInput({ lang: r.lang, title: r.title, ev: r, scheme: r.scheme, pic: r.pic_key });
    return {
      id: r.id, lang: r.lang, title: input.title, serif: input.serif, ground: input.ground,
      page: r.lang === 'et' ? `/et/sundmused/${r.slug}` : `/en/events/${r.slug}`,
      image: cardPath(r.id, r.lang, cardVersion(input)), tall: tallPath(r.id, r.lang, tallVersion(input)),
      ...(input.pic ? { tallPicture: tallPath(r.id, r.lang, tallVersion(input, true), true) } : {}),
    };
  });
  return new Response(JSON.stringify(out), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=60' } });
}
