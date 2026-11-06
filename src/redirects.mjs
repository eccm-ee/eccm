// redirects.mjs: eccm.ee's old Joomla addresses, answered before anything else
// (plans/plan-eccm-urls-sitemap-rss.md section 3, plans/plan-eccm-migration.md
// "Redirects from the old Joomla addresses"). Only /index.php, /images/ and
// /administrator reach here; every other path gets null at once. Each answer is
// one hop: a 301 to a page that answers 200 itself, a 410 for Joomla's login,
// or the 404 page with the path upserted into redirect_miss (0007) in
// waitUntil, so the response does not wait for the write.
import { LIST } from './render/events.mjs';
import { notFound, OTHER } from './render/chrome.mjs';

// every event shape: /index.php/{lang}/[up to two menu segments/]{id}-{alias}[/{date}]; a menu
// segment starts with a letter, so an id segment is never taken for one
const OLD_EVENT = /^\/index\.php\/(et|en)\/(?:[a-z][a-z0-9-]*\/){0,2}(\d+)(?:-[^/]*)?(?:\/\d{4}(?:-\d\d){4})?\/?$/;
const OLD_LANG = /^\/index\.php\/(et|en)(?:\/(.*))?$/;
const LOGIN = /^\/index\.php\/(?:[^/]+\/)*component\/users(?:\/|$)/;
const FEED = { et: '/et/feed.xml', en: '/en/feed.xml' };
const HOME = { et: '/', en: '/en/' };
const eventPath = (lang, slug) => (lang === 'et' ? `/et/sundmused/${slug}` : `/en/events/${slug}`);

// the menu paths with no page_text.legacy_path of their own, after /index.php/{lang}/:
// a string is a path, { page } a page key looked up in D1 so a renamed slug follows
const MENU = {
  et: {
    syndmusest: LIST.et, 'syndmusest/moeoedunud-suendmused': LIST.et,
    'tallinn-1965/residentuurid': { page: 'tallinn-1965' }, 'tallinn-1965/tallinn-1965-uudised': { page: 'tallinn-1965' },
    ulysses: { page: 'ulysses' }, 'ulysses/ulysses-uudised': { page: 'ulysses' },
    konkursid: { page: 'konkursid' }, kontakt: '/et/kontakt', 'eccm/kontakt': '/et/kontakt',
  },
  en: {
    eventseng: LIST.en, 'eventseng/past-events': LIST.en,
    'tallinn-1965-eng': { page: 'tallinn-1965' }, 'tallinn-1965-eng/residencies': { page: 'tallinn-1965' }, 'tallinn-1965-eng/tallinn-1965-news': { page: 'tallinn-1965' },
    'ulysses-eng/ulysses-uudised-eng': { page: 'ulysses' },
    'open-calls': { page: 'konkursid' }, 'new-eng-contact': '/en/contact', 'eccm-new-eng/new-eng-contact': '/en/contact',
  },
};

const moved = (url, to) => new Response(null, { status: 301, headers: { location: url.origin + to, 'cache-control': 'public, max-age=3600' } });
const page = (lang, path, status) => new Response(String(notFound(lang, path)), { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': status === 410 ? 'public, max-age=3600' : 'no-store' } });
const isList = (q) => [...q.keys()].some((k) => k === 'page' || k === 'iccaldate' || k.startsWith('filter_'));

// the event by (lang, legacy_id), then by the other language's id, in the
// visitor's language when it has a text and in the other language when not
async function eventTarget(db, lang, id) {
  const hit = (await db.prepare('SELECT t.event_id FROM event_text t JOIN event e ON e.id = t.event_id WHERE t.lang = ? AND t.legacy_id = ? AND e.status = ?').bind(lang, id, 'published').first())
    || (await db.prepare('SELECT t.event_id FROM event_text t JOIN event e ON e.id = t.event_id WHERE t.lang = ? AND t.legacy_id = ? AND e.status = ?').bind(OTHER[lang], id, 'published').first());
  if (!hit) return null;
  const t = await db.prepare('SELECT lang, slug FROM event_text WHERE event_id = ? ORDER BY lang = ? DESC LIMIT 1').bind(hit.event_id, lang).first();
  return t && eventPath(t.lang, t.slug);
}

// a page by its key, at the visitor's language's prefix: with no text in that
// language the other one's slug, which the page route answers by its fallback
async function pageByKey(db, lang, key) {
  const t = await db.prepare("SELECT t.slug FROM page_text t JOIN page p ON p.id = t.page_id WHERE p.key = ? AND p.status = 'published' ORDER BY t.lang = ? DESC LIMIT 1").bind(key, lang).first();
  return t && `/${lang}/${t.slug}`;
}

// a public/ file by name, asked of the assets binding
async function asset(env, url, name) {
  if (!env.ASSETS || !name) return false;
  const r = await env.ASSETS.fetch(new Request(new URL('/' + encodeURIComponent(name), url.origin), { method: 'HEAD' }));
  return r.status === 200;
}

// the picture with the same file name: the name as it is in public/, then
// Joomla's thumbnail name for it (lowercase, every run of other characters a
// hyphen, the ic_{size}_w..h..q.._ prefix off) against a media row's key and
// the medium thumbnail in public/
async function pictureTarget(env, url, p) {
  let name;
  try { name = decodeURIComponent(p.slice(p.lastIndexOf('/') + 1)); } catch { return null; }
  if (!name || name.includes('/')) return null;
  if (await asset(env, url, name)) return '/' + encodeURIComponent(name);
  const dot = name.lastIndexOf('.');
  if (dot < 1) return null;
  const stem = name.slice(0, dot).replace(/^ic_[a-z]+_w\d+h\d+q\d+_/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const norm = `${stem}.${name.slice(dot + 1).toLowerCase()}`;
  const row = await env.DB.prepare("SELECT key FROM media WHERE key = ? OR key LIKE ? ESCAPE '\\' ORDER BY key LIKE 'ic\\_large\\_%' ESCAPE '\\' DESC LIMIT 1").bind(norm, '%\\_' + norm).first();
  if (row) return '/' + row.key;
  for (const n of [`ic_large_w900h600q100_${norm}`, `ic_medium_w300h300q100_${norm}`]) if (await asset(env, url, n)) return '/' + n;
  return null;
}

// the path and its query as the miss log keeps them, without the trackers
function missKey(url) {
  const q = new URLSearchParams(url.search);
  for (const k of [...q.keys()]) if (k === 'fbclid' || k === 'gclid' || k.startsWith('utm_')) q.delete(k);
  const s = q.toString();
  return (url.pathname + (s ? '?' + s : '')).slice(0, 500);
}

function logMiss(env, ctx, url) {
  const now = new Date().toISOString().slice(0, 19) + 'Z';
  const write = env.DB.prepare('INSERT INTO redirect_miss (path, count, first_seen, last_seen) VALUES (?, 1, ?, ?) ON CONFLICT (path) DO UPDATE SET count = count + 1, last_seen = excluded.last_seen')
    .bind(missKey(url), now, now).run().catch(() => {});
  if (ctx && ctx.waitUntil) ctx.waitUntil(write);
}

async function target(env, url) {
  const p = url.pathname.toLowerCase();
  const q = url.searchParams;
  if (p.startsWith('/images/')) return pictureTarget(env, url, url.pathname);
  if (p === '/index.php' || p === '/index.php/') {
    if (q.get('format') === 'feed') return FEED.et;
    return isList(q) ? LIST.et : HOME.et;
  }
  const m = OLD_LANG.exec(p);
  if (!m) return null;
  const lang = m[1];
  const rest = (m[2] || '').replace(/\/+$/, '');
  if (q.get('format') === 'feed') return FEED[lang];
  const ev = OLD_EVENT.exec(p);
  if (ev) {
    const to = await eventTarget(env.DB, lang, Number(ev[2]));
    if (to && q.get('layout') === 'vcal') return `${to}.ics`;
    if (to) return to;
  }
  if (!rest) return isList(q) ? LIST[lang] : HOME[lang];
  const row = await env.DB.prepare("SELECT t.lang, t.slug FROM page_text t JOIN page p ON p.id = t.page_id WHERE t.legacy_path = ? AND p.status = 'published'").bind(`/index.php/${lang}/${rest}`).first();
  if (row) return `/${row.lang}/${row.slug}`;
  const hit = Object.hasOwn(MENU[lang], rest) ? MENU[lang][rest] : null;
  if (typeof hit === 'string') return hit;
  if (hit) return pageByKey(env.DB, lang, hit.page);
  return null;
}

export async function legacy(request, env, url, ctx) {
  const p = url.pathname;
  const lp = p.toLowerCase();
  const old = lp === '/index.php' || lp.startsWith('/index.php/') || lp.startsWith('/images/');
  if (!old && !lp.startsWith('/administrator')) return null;
  const lang = lp.startsWith('/index.php/en') ? 'en' : 'et';
  if (lp.startsWith('/administrator') || LOGIN.test(lp)) return page(lang, p, 410);
  const to = await target(env, url);
  if (to) return moved(url, to);
  logMiss(env, ctx, url);
  return page(lang, p, 404);
}
