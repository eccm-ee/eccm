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
import { cardInput, cardVersion, cardPath, tallVersion, tallPath, cardSvg, slideSvg, slideVersion, slidePath, slideDefaults, slideFields, SLIDE_MAX, siteSvg, PAGE_TITLES, schemeColors, pageColorMap, SITE_CARD, pageInput, pagePath, pageVersion, TEMPLATE_V, SITE_V, W, TALL_W } from './card.mjs';
import { renderPng } from './render.mjs';
import { CATEGORY } from '../render/event.mjs';

const CC = 'public, max-age=31536000, immutable';
const png = (body, from) => new Response(body, { headers: { 'content-type': 'image/png', 'cache-control': CC, 'x-og': from } });
const none = (status, headers = {}) => new Response(null, { status, headers: { 'cache-control': 'no-store', ...headers } });
// /og/e/ the share card, /og/t/ and /og/tp/ the tall 4:5 pair for Instagram
// (2026-10-02); /og/p/, a wide picture layout, came and went the same day
// and /og/tp1/ and /og/tp2/ the picture's two halves since the same evening
// and /og/t4/ the fourth, the text card at the carousel's end whose words the editor writes (2026-11-07)
const CARD = /^\/og\/(e|t|tp1|tp2|t4)\/(\d+)-(et|en)-([0-9a-f]{8})\.png$/;
const PART = { e: 0, t: 0, tp1: 1, tp2: 2, t4: 0 };
const VERSION = (kind, i, fields) => (kind === 'e' ? cardVersion(i) : kind === 't4' ? slideVersion(i, fields) : tallVersion(i, PART[kind]));
const PATH = (kind, id, l, v) => (kind === 'e' ? cardPath(id, l, v) : kind === 't4' ? slidePath(id, l, v) : tallPath(id, l, v, PART[kind]));

// the card's rows for one event in one language, the queries the event page
// makes: its text in that language or the Estonian one, the picture's scheme;
// with slide, also the fourth card's words, the stored ones or the defaults
async function rows(db, id, lang, slide = false) {
  const ev = await db.prepare("SELECT * FROM event WHERE id = ? AND status = 'published'").bind(id).first();
  if (!ev) return null;
  const text = await db.prepare('SELECT title, venue, body FROM event_text WHERE event_id = ? AND lang = ?').bind(id, lang).first()
    || await db.prepare("SELECT title, venue, body FROM event_text WHERE event_id = ? AND lang = 'et'").bind(id).first();
  if (!text) return null;
  const media = ev.image_id ? await db.prepare('SELECT scheme, key FROM media WHERE id = ?').bind(ev.image_id).first() : null;
  const e = { ...ev, venue: text.venue || ev.venue };
  const input = cardInput({ lang, title: text.title, ev: e, scheme: media && media.scheme, pic: media && media.key });
  if (!slide) return input;
  const row = await db.prepare('SELECT header, body, footer FROM event_social WHERE event_id = ? AND lang = ?').bind(id, lang).first();
  return { input, fields: slideFields(row, slideDefaults({ title: text.title, body: text.body, ev: e, series: CATEGORY[ev.category] && CATEGORY[ev.category][lang] })) };
}

// the fourth card drawn from words in the address, for the editor's preview as they type: under /edit, so
// behind the login (src/auth.mjs), never stored and never cached, so no one else can put words on a card
export async function slidePreview(env, url, id, lang) {
  const r = await rows(env.DB, id, lang, true);
  if (!r) return none(404);
  const q = url.searchParams;
  const fields = Object.fromEntries(Object.keys(SLIDE_MAX).map((k) => [k, (q.has(k) ? q.get(k) : r.fields[k]).slice(0, SLIDE_MAX[k])]));
  const picture = r.input.pic ? await pictureUri(env, url, r.input.pic) : null;
  const bytes = await renderPng(slideSvg(r.input, fields, picture), TALL_W);
  return new Response(bytes, { headers: { 'content-type': 'image/png', 'cache-control': 'private, no-store', 'x-og': 'preview' } });
}

// a page's card: its title, from the page's own row when it has one; null for
// anything else, so no text can be put on a card through its address
async function pageCard(db, key, lang) {
  const schemes = (await db.prepare("SELECT DISTINCT m.scheme FROM media m JOIN event e ON e.image_id = m.id WHERE e.status = 'published' AND m.scheme IS NOT NULL ORDER BY m.id").all()).results.map((r) => r.scheme);
  const pageKeys = (await db.prepare("SELECT key FROM page WHERE status = 'published'").all()).results.map((r) => `page:${r.key}`);
  const map = pageColorMap([...Object.keys(PAGE_TITLES), ...pageKeys], schemeColors(schemes));
  const pageColors = (k) => map.get(k) || SITE_CARD;
  const text = (slug) => db.prepare("SELECT t.title, p.key FROM page_text t JOIN page p ON p.id = t.page_id WHERE t.slug = ? AND t.lang = ? AND p.status = 'published'").bind(slug, lang).first();
  if (key === 'home') return { title: PAGE_TITLES.home[lang], colors: pageColors('home') };
  if (PAGE_TITLES[key]) return { title: PAGE_TITLES[key][lang], colors: pageColors(key) };
  const r = await text(key);
  return r ? { title: r.title, colors: pageColors(`page:${r.key}`) } : null;
}

// every page's two cards, for /social, each with its version as a query so a browser's hour-old copy does not stand in
async function pageList(env) {
  const out = [];
  const add = async (key, lang, page) => {
    const c = await pageCard(env.DB, key, lang);
    if (!c) return;
    const input = pageInput(key, lang, c.title, c.colors);
    out.push({ key, lang, title: c.title, page, ground: input.ground, image: `${pagePath(key, lang)}?v=${pageVersion(input)}`, tall: `${pagePath(key, lang, true)}?v=${pageVersion(input, true)}` });
  };
  for (const lang of ['et', 'en']) {
    await add('home', lang, lang === 'et' ? '/' : '/en/');
    await add('events', lang, lang === 'et' ? '/et/sundmused' : '/en/events');
  }
  const texts = (await env.DB.prepare("SELECT t.slug, t.lang FROM page_text t JOIN page p ON p.id = t.page_id WHERE p.status = 'published' ORDER BY p.menu_order, t.lang").all()).results;
  for (const t of texts) await add(t.slug, t.lang, `/${t.lang}/${t.slug}`);
  for (const lang of ['et', 'en']) {
    await add('newsletter', lang, lang === 'et' ? '/et/uudiskiri' : '/en/newsletter');
  }
  return new Response(JSON.stringify(out), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=60' } });
}

export async function ogRoute(request, env, url, ctx) {
  const p = url.pathname;
  if (p === '/og/e.json') return list(env, url);
  if (p === '/og/g.json') return pageList(env);
  // a page's own card, /og/g/ to share and /og/gt/ for Instagram: one address read fresh, kept an hour by a
  // browser, its bytes in R2 under the version of what it shows
  const g = /^\/og\/(g|gt)\/([a-z0-9-]+)-(et|en)\.png$/.exec(p);
  if (g) {
    const [, kind, key, lang] = g, tall = kind === 'gt';
    const hour = (body, from) => new Response(body, { headers: { 'content-type': 'image/png', 'cache-control': 'public, max-age=3600', 'x-og': from } });
    const c = await pageCard(env.DB, key, lang);
    if (!c) return none(404);
    const input = pageInput(key, lang, c.title, c.colors);
    const rkey = `og/${kind}/${key}-${lang}-${pageVersion(input, tall)}.png`;
    const stored = env.MEDIA && await env.MEDIA.get(rkey);
    if (stored) return hour(await stored.arrayBuffer(), 'r2');
    const bytes = await renderPng(cardSvg(input, null, tall), tall ? TALL_W : W);
    if (env.MEDIA) ctx.waitUntil(env.MEDIA.put(rkey, bytes, { httpMetadata: { contentType: 'image/png' } }).catch(() => {}));
    return hour(bytes, 'render');
  }
  // the site's own card, the logo: one address per language, kept a day, its
  // bytes in R2 under the template's version so a new template renders anew
  const site = /^\/og\/(site)-(et|en)\.png$/.exec(p);
  if (site) {
    const key = `og/${site[1]}-${site[2]}-${TEMPLATE_V}-${SITE_V}.png`;
    const day = (body, from) => new Response(body, { headers: { 'content-type': 'image/png', 'cache-control': 'public, max-age=3600', 'x-og': from } });
    const stored = env.MEDIA && await env.MEDIA.get(key);
    if (stored) return day(await stored.arrayBuffer(), 'r2');
    const bytes = await renderPng(siteSvg(site[2]), W);
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
  const got = await rows(env.DB, Number(id), lang, kind === 't4');
  if (!got) return none(404);
  const { input, fields } = kind === 't4' ? got : { input: got };
  const withPic = PART[kind] > 0, tall = kind !== 'e';
  if (withPic && !input.pic) return none(404);
  // the tall text cards of an event with a picture carry the panorama's first strip and its last
  // and since 2026-11-09 the share card its left edge
  const strip = (kind === 't' || kind === 't4' || kind === 'e') && !!input.pic;
  const now = VERSION(kind, input, fields);
  if (now !== v) return none(302, { location: PATH(kind, id, lang, now) });
  const picture = withPic || strip ? await pictureUri(env, url, input.pic) : null;
  if (withPic && !picture) return none(404);
  const bytes = await renderPng(kind === 't4' ? slideSvg(input, fields, picture) : cardSvg(input, picture, tall, strip ? 0 : PART[kind] || 1), tall ? TALL_W : W);
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
  const all = (await env.DB.prepare(`SELECT e.*, COALESCE(NULLIF(t.venue, ''), e.venue) AS venue, t.lang, t.slug, t.title, t.body AS text_body, m.scheme, m.key AS pic_key,
    s.event_id AS s_id, s.header AS s_header, s.body AS s_body, s.footer AS s_footer FROM event e
    JOIN event_text t ON t.event_id = e.id LEFT JOIN media m ON m.id = e.image_id LEFT JOIN event_social s ON s.event_id = e.id AND s.lang = t.lang
    WHERE e.status = 'published' ORDER BY e.starts_at DESC, e.id, t.lang`).all()).results;
  const out = all.map((r) => {
    const input = cardInput({ lang: r.lang, title: r.title, ev: r, scheme: r.scheme, pic: r.pic_key });
    const fields = slideFields(r.s_id ? { header: r.s_header, body: r.s_body, footer: r.s_footer } : null,
      slideDefaults({ title: r.title, body: r.text_body, ev: r, series: CATEGORY[r.category] && CATEGORY[r.category][r.lang] }));
    return {
      id: r.id, lang: r.lang, title: input.title, ground: input.ground,
      page: r.lang === 'et' ? `/et/sundmused/${r.slug}` : `/en/events/${r.slug}`,
      image: cardPath(r.id, r.lang, cardVersion(input)), tall: tallPath(r.id, r.lang, tallVersion(input)),
      ...(input.pic ? { tallPictures: [1, 2].map((n) => tallPath(r.id, r.lang, tallVersion(input, n), n)) } : {}),
      tallText: slidePath(r.id, r.lang, slideVersion(input, fields)), slug: r.slug,
    };
  });
  return new Response(JSON.stringify(out), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=60' } });
}
