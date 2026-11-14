// redirects.mjs: eccm.ee's old Joomla addresses, answered before anything else
// (plans/plan-eccm-urls-sitemap-rss.md section 3, plans/plan-eccm-migration.md
// "Redirects from the old Joomla addresses"). Only /index.php, /images/ and
// /administrator reach legacy(); every other path gets null at once, and meets
// lastChance() only where it would otherwise 404. Each answer is one hop: a 301
// to a page that answers 200 itself, a 410, or the 404 page.
// Both ways are logged in waitUntil, so no response waits for the write (0019):
// every redirect answered, with the rule that answered it, into redirect_hit, and
// every 404 on the site into redirect_miss, with bots apart and the referring site.
// The redirect table (0019) is tried first; /edit/redirects reads both logs and
// turns a miss into a row.
import { LIST } from './render/events.mjs';
import { notFound, OTHER } from './render/chrome.mjs';
import { BOT, hosting } from './stats.mjs';

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
    ulysses: { page: 'ulysses' }, 'ulysses/ulysses-uudised': { page: 'koosloome' },
    konkursid: { page: 'konkursid' }, kontakt: '/et/kontakt', 'eccm/kontakt': '/et/kontakt',
  },
  en: {
    eventseng: LIST.en, 'eventseng/past-events': LIST.en,
    'tallinn-1965-eng': { page: 'tallinn-1965' }, 'tallinn-1965-eng/residencies': { page: 'tallinn-1965' }, 'tallinn-1965-eng/tallinn-1965-news': { page: 'tallinn-1965' },
    'ulysses-eng/ulysses-uudised-eng': { page: 'koosloome' },
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

const nowIso = () => new Date().toISOString().slice(0, 19) + 'Z';
const isBot = (request) => { const ua = request?.headers.get('user-agent') || ''; return !ua || BOT.test(ua) || !!request?.cf?.verifiedBotCategory || hosting(request?.cf); };
const referrer = (request, url) => { try { const r = new URL(request?.headers.get('referer') || ''); return r.hostname === url.hostname ? '' : r.hostname.replace(/^www\./, '').slice(0, 100); } catch { return ''; } };
const later = (ctx, p) => { if (ctx && ctx.waitUntil) ctx.waitUntil(p); };

// a 404: counted per path, bots apart, the last referring site kept; 'old' for a Joomla address, 'site' for the rest
export function logMiss(env, ctx, url, request, area = 'old') {
  const now = nowIso(), bot = isBot(request) ? 1 : 0, ref = referrer(request, url);
  later(ctx, env.DB.prepare(`INSERT INTO redirect_miss (path, count, first_seen, last_seen, bots, area, referrer) VALUES (?, 1, ?, ?, ?, ?, ?)
    ON CONFLICT (path) DO UPDATE SET count = count + 1, last_seen = excluded.last_seen, bots = bots + excluded.bots,
    referrer = CASE WHEN excluded.referrer != '' THEN excluded.referrer ELSE referrer END`)
    .bind(missKey(url), now, now, bot, area, ref).run().catch(() => {}));
}

// a redirect answered, by the address asked, where it went and which rule sent it
function logHit(env, ctx, url, request, to, rule) {
  const now = nowIso(), bot = isBot(request) ? 1 : 0;
  later(ctx, env.DB.prepare(`INSERT INTO redirect_hit (from_path, to_path, rule, count, bots, first_seen, last_seen) VALUES (?, ?, ?, 1, ?, ?, ?)
    ON CONFLICT (from_path) DO UPDATE SET count = count + 1, bots = bots + excluded.bots, to_path = excluded.to_path, rule = excluded.rule, last_seen = excluded.last_seen`)
    .bind(missKey(url), to, rule, bot, now, now).run().catch(() => {}));
}

// the redirect table's row for this address: the path and its query lowercased, then the path alone, each
// with and without a trailing slash
async function fromTable(db, url) {
  const k = missKey(url).toLowerCase(), p = url.pathname.toLowerCase();
  const keys = [...new Set([k, p, p.replace(/\/+$/, ''), p.replace(/\/+$/, '') + '/'])].filter(Boolean);
  try {
    return await db.prepare(`SELECT to_path, status FROM redirect WHERE from_path IN (${keys.map(() => '?').join(', ')}) LIMIT 1`).bind(...keys).first();
  } catch { return null; }   // a database without 0019
}

async function target(env, url) {
  const p = url.pathname.toLowerCase();
  const q = url.searchParams;
  if (p.startsWith('/images/')) { const to = await pictureTarget(env, url, url.pathname); return to && { to, rule: 'picture' }; }
  if (p === '/index.php' || p === '/index.php/') {
    if (q.get('format') === 'feed') return { to: FEED.et, rule: 'feed' };
    return isList(q) ? { to: LIST.et, rule: 'list' } : { to: HOME.et, rule: 'home' };
  }
  const m = OLD_LANG.exec(p);
  if (!m) return null;
  const lang = m[1];
  const rest = (m[2] || '').replace(/\/+$/, '');
  if (q.get('format') === 'feed') return { to: FEED[lang], rule: 'feed' };
  const ev = OLD_EVENT.exec(p);
  if (ev) {
    const to = await eventTarget(env.DB, lang, Number(ev[2]));
    if (to && q.get('layout') === 'vcal') return { to: `${to}.ics`, rule: 'event' };
    if (to) return { to, rule: 'event' };
  }
  if (!rest) return isList(q) ? { to: LIST[lang], rule: 'list' } : { to: HOME[lang], rule: 'home' };
  // the path itself, then each parent menu: an old article under a known menu (its alias has no id) goes to that
  // menu's page rather than the 404
  for (let r = rest; r; r = r.includes('/') ? r.slice(0, r.lastIndexOf('/')) : '') {
    const row = await env.DB.prepare("SELECT t.lang, t.slug FROM page_text t JOIN page p ON p.id = t.page_id WHERE t.legacy_path = ? AND p.status = 'published'").bind(`/index.php/${lang}/${r}`).first();
    const rule = r === rest ? 'page' : 'parent';
    if (row) return { to: `/${row.lang}/${row.slug}`, rule };
    const hit = Object.hasOwn(MENU[lang], r) ? MENU[lang][r] : null;
    if (typeof hit === 'string') return { to: hit, rule: r === rest ? 'menu' : 'parent' };
    if (hit) { const to = await pageByKey(env.DB, lang, hit.page); if (to) return { to, rule: r === rest ? 'menu' : 'parent' }; }
  }
  return null;
}

export async function legacy(request, env, url, ctx) {
  const p = url.pathname;
  const lp = p.toLowerCase();
  const old = lp === '/index.php' || lp.startsWith('/index.php/') || lp.startsWith('/images/');
  if (!old && !lp.startsWith('/administrator')) return null;
  const lang = lp.startsWith('/index.php/en') ? 'en' : 'et';
  if (lp.startsWith('/administrator') || LOGIN.test(lp)) return page(lang, p, 410);
  const row = await fromTable(env.DB, url);
  if (row) { logHit(env, ctx, url, request, row.to_path, 'table'); return row.status === 410 ? page(lang, p, 410) : moved(url, row.to_path); }
  const hit = await target(env, url);
  if (hit) { logHit(env, ctx, url, request, hit.to, hit.rule); return moved(url, hit.to); }
  logMiss(env, ctx, url, request, 'old');
  return page(lang, p, 404);
}

// any other address, where it would otherwise be the 404: the redirect table, else the miss counted and null
export async function lastChance(request, env, url, ctx) {
  const row = await fromTable(env.DB, url);
  if (row) {
    logHit(env, ctx, url, request, row.to_path, 'table');
    if (row.status === 410) return page(url.pathname.startsWith('/en') ? 'en' : 'et', url.pathname, 410);
    return moved(url, row.to_path);
  }
  if (request.method === 'GET' || request.method === 'HEAD') logMiss(env, ctx, url, request, 'site');
  return null;
}
