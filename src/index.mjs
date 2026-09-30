// index.mjs: the Worker behind eccm.positron.studio. Assets under public/ are
// served before this runs, so it sees only paths no file answers: the two
// language trees, /et/* and /en/*, and everything else as a 404 of its own
// (plans/plan-eccm-cms-step-1.md section 4). Session 1 and 2: the event page
// in both languages, with the fallback of section 2 when the English text row
// is missing. The URL words are plans/plan-eccm-urls-sitemap-rss.md section 2.
// The editor (src/editor.mjs) answers /edit/events* and /edit/pages*, and
// /edit itself goes to the front page. Nothing in front of it asks who is
// there: the gate, /login and /logout went 2026-09-29, asked as "rm
// login/session stuff. all is free for editing". Before that /edit was the
// static public/edit.html, the form that saved nothing, removed 2026-09-28
// (asked as "rm https://eccm.positron.studio/edit, make real edit stff").
// Since 2026-09-28 the text pages the menu names, /et/{slug} and /en/{slug},
// come from page_text
// through src/render/page.mjs, with the fallback running both ways (its
// header says why); the event and page routes cannot collide, since a page
// path has one segment after the language and an event path has two. The
// events list, /et/sundmused and /en/events, is answered before the page
// route since 2026-09-28 (src/render/events.mjs), the last menu item that
// led to eccm.ee. /en/ is the English front page since the same evening,
// the events to come from D1 under the front page's heading, because / is
// the static Estonian front page and /en/ answered the 404; /et/ goes to /.
import { renderEvent } from './render/event.mjs';
import { renderPage } from './render/page.mjs';
import { renderEvents, LIST } from './render/events.mjs';
import { notFound, OTHER } from './render/chrome.mjs';
import { editor } from './editor.mjs';
import { renderSitemap, renderFeed } from './render/feeds.mjs';
import { serveMedia } from './media.mjs';
import { useTransforms } from './render/pic.mjs';

const HTML = { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60' };
const EVENT = { et: /^\/et\/sundmused\/([a-z0-9-]+)$/, en: /^\/en\/events\/([a-z0-9-]+)$/ };
const PAGE = /^\/(et|en)\/([a-z0-9-]+)$/;
const LIST_LANG = Object.fromEntries(Object.entries(LIST).map(([l, p]) => [p, l]));
// today in Tallinn as YYYY-MM-DD, so an event is still to come for the whole of its day
const tallinnToday = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Tallinn' }).format(new Date());

const reply = (body, status = 200) => new Response(String(body), { status, headers: HTML });

async function event(env, lang, slug, url) {
  const db = env.DB;
  let text = await db.prepare('SELECT * FROM event_text WHERE lang = ? AND slug = ?').bind(lang, slug).first();
  let fallback = false;
  // no text in this language: the Estonian row under this language's chrome,
  // reached because the switch on the Estonian page links here with the
  // Estonian slug when no twin exists
  if (!text && lang !== 'et') { text = await db.prepare('SELECT * FROM event_text WHERE lang = ? AND slug = ?').bind('et', slug).first(); fallback = !!text; }
  if (!text) return null;
  const ev = await db.prepare("SELECT * FROM event WHERE id = ? AND status = 'published'").bind(text.event_id).first();
  if (!ev) return null;
  const media = ev.image_id ? await db.prepare('SELECT * FROM media WHERE id = ?').bind(ev.image_id).first() : null;
  const credits = (await db.prepare('SELECT c.*, r.label_et AS role_et, r.label_en AS role_en FROM event_credit c LEFT JOIN role r ON r.key = c.role_key WHERE c.event_id = ? ORDER BY c.position').bind(ev.id).all()).results;
  const twin = await db.prepare('SELECT lang, slug FROM event_text WHERE event_id = ? AND lang = ?').bind(ev.id, OTHER[lang]).first();
  const next = (await db.prepare(`SELECT e.starts_at, e.venue, COALESCE(t1.slug, t0.slug) AS slug, COALESCE(t1.title, t0.title) AS title, COALESCE(t1.lang, t0.lang) AS tlang
    FROM event e LEFT JOIN event_text t1 ON t1.event_id = e.id AND t1.lang = ? LEFT JOIN event_text t0 ON t0.event_id = e.id AND t0.lang = 'et'
    WHERE e.status = 'published' AND e.starts_at > ? AND e.id != ? ORDER BY e.starts_at LIMIT 3`).bind(lang, ev.starts_at, ev.id).all()).results;
  return renderEvent({ lang, text, fallback, ev, media, credits, twin, next, origin: url.origin, path: url.pathname });
}

// the events list: every published event with a text in this language, or
// its Estonian text when it has none, the picture joined; the ones still to
// come in date order, the ones that have been newest first
async function eventsList(env, lang, url, home = false) {
  const rows = (await env.DB.prepare(`SELECT e.id, e.starts_at, e.venue, e.category, COALESCE(t1.slug, t0.slug) AS slug, COALESCE(t1.title, t0.title) AS title, COALESCE(t1.lang, t0.lang) AS tlang, COALESCE(t1.body, t0.body) AS body, m.key AS pic, m.width, m.height
    FROM event e LEFT JOIN event_text t1 ON t1.event_id = e.id AND t1.lang = ? LEFT JOIN event_text t0 ON t0.event_id = e.id AND t0.lang = 'et' LEFT JOIN media m ON m.id = e.image_id
    WHERE e.status = 'published' AND COALESCE(t1.title, t0.title) IS NOT NULL ORDER BY e.starts_at`).bind(lang).all()).results;
  const today = tallinnToday();
  const upcoming = rows.filter((r) => r.starts_at.slice(0, 10) >= today);
  const past = rows.filter((r) => r.starts_at.slice(0, 10) < today).reverse();
  return renderEvents({ lang, upcoming, past, origin: url.origin, path: url.pathname, home });
}

// a text page by (lang, slug), the same query shape as an event's: the text
// row joined to its published page row; with no row in this language, the
// other language's row under this language's chrome and the fallback line
async function textPage(env, lang, slug, url) {
  const db = env.DB;
  const q = "SELECT t.* FROM page_text t JOIN page p ON p.id = t.page_id WHERE t.lang = ? AND t.slug = ? AND p.status = 'published'";
  let text = await db.prepare(q).bind(lang, slug).first();
  let fallback = false;
  if (!text) { text = await db.prepare(q).bind(OTHER[lang], slug).first(); fallback = !!text; }
  if (!text) return null;
  const twin = await db.prepare('SELECT lang, slug FROM page_text WHERE page_id = ? AND lang = ?').bind(text.page_id, OTHER[lang]).first();
  return renderPage({ lang, text, fallback, twin, origin: url.origin, path: url.pathname });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;
    useTransforms(env.IMAGE_TRANSFORMS);
    // the uploaded pictures from R2, /media/{sha256}.{ext} (src/media.mjs)
    if (p.startsWith('/media/')) { const out = await serveMedia(env, p); if (out) return out; }
    // the sitemap and the feeds, named nowhere until cutover (src/render/feeds.mjs), url.origin while staging only
    if (p === '/sitemap.xml') return new Response(renderSitemap({ origin: url.origin, events: (await env.DB.prepare("SELECT e.id, e.updated_at, t.lang, t.slug FROM event e JOIN event_text t ON t.event_id = e.id WHERE e.status = 'published'").all()).results, pages: (await env.DB.prepare("SELECT p.id, p.updated_at, t.lang, t.slug FROM page p JOIN page_text t ON t.page_id = p.id WHERE p.status = 'published'").all()).results }), { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, s-maxage=86400, stale-while-revalidate=86400' } });
    const fm = /^\/(et|en)\/feed\.xml$/.exec(p);
    if (fm) return new Response(renderFeed({ origin: url.origin, lang: fm[1], rows: (await env.DB.prepare("SELECT m.*, e.*, t.slug, t.title, t.body FROM event e JOIN event_text t ON t.event_id = e.id AND t.lang = ? LEFT JOIN media m ON m.id = e.image_id WHERE e.status = 'published' ORDER BY e.created_at DESC, e.id DESC LIMIT 20").bind(fm[1]).all()).results }), { headers: { 'content-type': 'application/rss+xml; charset=utf-8', 'cache-control': 'public, max-age=60' } });
    for (const lang of ['et', 'en']) {
      const m = EVENT[lang].exec(p);
      if (m) { const out = await event(env, lang, m[1], url); if (out) return reply(out); break; }
    }
    if (p === '/en' || p === '/en/') return reply(await eventsList(env, 'en', url, true));
    if (p === '/et' || p === '/et/') return new Response(null, { status: 301, headers: { location: '/' } });
    if (LIST_LANG[p]) return reply(await eventsList(env, LIST_LANG[p], url));
    const pm = PAGE.exec(p);
    if (pm) { const out = await textPage(env, pm[1], pm[2], url); if (out) return reply(out); }
    if (p === '/edit' || p.startsWith('/edit/')) { const out = await editor(request, env, url); if (out) return out; }
    const lang = p.startsWith('/en') ? 'en' : 'et';
    return reply(notFound(lang, p), 404);
  },
};
