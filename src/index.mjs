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
import { notFound, OTHER, useOrigin } from './render/chrome.mjs';
import { editor } from './editor.mjs';
import { renderSitemap, renderFeed } from './render/feeds.mjs';
import { serveMedia } from './media.mjs';
import { useTransforms } from './render/pic.mjs';
import { renderIcs } from './render/ics.mjs';
import { itemsRoute } from './items.mjs';
import { renderStation } from './render/station.mjs';
import { renderAdmin } from './render/admin.mjs';
import { renderResearch, renderRadioResearch } from './render/research.mjs';
import { renderDocs, renderDoc } from './render/docs.mjs';
import { filesRoute } from './files.mjs';
import { newsletter, drain } from './newsletter.mjs';
import { ogRoute } from './og/route.mjs';
import { radioShows, wakeRadio, serveShow, radioState } from './radio.mjs';
export { Items } from './items.mjs';
export { Radio } from './radio.mjs';
import { station, STREAM_BASE } from './station/station.mjs';
export { Schedule, Library } from './station/station.mjs';

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

// an event's or a language's calendar; the rows are the list's query, one event or the window
const ICS = { 'content-type': 'text/calendar; charset=utf-8', 'cache-control': 'public, max-age=300' };
const CALNAME = { et: 'ECCM sündmused', en: 'ECCM events' };
async function calendar(env, lang, slug, url) {
  const q = `SELECT e.id, e.starts_at, e.ends_at, e.duration_min, e.venue, e.address, e.ticket_url, e.updated_at, COALESCE(t1.slug, t0.slug) AS slug, COALESCE(t1.title, t0.title) AS title, COALESCE(t1.lang, t0.lang) AS tlang, COALESCE(t1.body, t0.body) AS body
    FROM event e LEFT JOIN event_text t1 ON t1.event_id = e.id AND t1.lang = ? LEFT JOIN event_text t0 ON t0.event_id = e.id AND t0.lang = 'et'
    WHERE e.status = 'published' AND COALESCE(t1.title, t0.title) IS NOT NULL`;
  let rows;
  if (slug) {
    rows = (await env.DB.prepare(`${q} AND (t1.slug = ? OR (t1.slug IS NULL AND t0.slug = ?))`).bind(lang, slug, slug).all()).results;
    if (!rows.length) return null;
  } else {
    const since = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Tallinn' }).format(new Date(Date.now() - 90 * 864e5));
    rows = (await env.DB.prepare(`${q} AND substr(e.starts_at, 1, 10) >= ? ORDER BY e.starts_at`).bind(lang, since).all()).results;
  }
  const headers = { ...ICS, ...(slug ? { 'content-disposition': `attachment; filename="${slug}.ics"` } : {}) };
  return new Response(renderIcs({ rows, origin: url.origin, lang, name: slug ? rows[0].title : CALNAME[lang] }), { headers });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const p = url.pathname;
    // /cdn-cgi/image/ exists on the zone (positron.studio) and not on workers.dev, which this laptop has to use
    // since its DNS filter blocked the custom domain (2026-10-02, asked: "images broken in .../en/"), so a
    // workers.dev host draws the originals, as wrangler dev does
    useTransforms(url.hostname.endsWith('.workers.dev') ? 'off' : env.IMAGE_TRANSFORMS);
    useOrigin(url.origin);
    // the radio station itself, under /stream since 2026-10-02 (src/station/station.mjs): the prefix comes off
    // here and the station answers as it did on its own Worker, method, headers and body unchanged
    if (p === STREAM_BASE || p.startsWith(STREAM_BASE + '/')) {
      const inner = new URL(url); inner.pathname = p.slice(STREAM_BASE.length) || '/';
      return station.fetch(new Request(inner, request), env, ctx);
    }
    // the uploads in pieces, eccm-files through its service binding (workers/files), since 2026-10-02
    if (p.startsWith('/files/')) return env.FILES_SVC.fetch(request);
    // /admin/files, the site's audio in two directories (src/files.mjs), since 2026-10-02
    if (p === '/admin/files' || p.startsWith('/admin/files/')) { const out = await filesRoute(request, env, url); if (out) return out; }
    // the uploaded pictures from R2, /media/{sha256}.{ext} (src/media.mjs)
    if (p.startsWith('/media/')) { const out = await serveMedia(env, p); if (out) return out; }
    // the event share images and their list for /ds (src/og/route.mjs), since 2026-10-01
    if (p.startsWith('/og/')) { const out = await ogRoute(request, env, url, ctx); if (out) return out; }
    // the sitemap and the feeds, named nowhere until cutover (src/render/feeds.mjs), url.origin while staging only
    if (p === '/sitemap.xml') return new Response(renderSitemap({ origin: url.origin, events: (await env.DB.prepare("SELECT e.id, e.updated_at, t.lang, t.slug FROM event e JOIN event_text t ON t.event_id = e.id WHERE e.status = 'published'").all()).results, pages: (await env.DB.prepare("SELECT p.id, p.updated_at, t.lang, t.slug FROM page p JOIN page_text t ON t.page_id = p.id WHERE p.status = 'published'").all()).results }), { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, s-maxage=86400, stale-while-revalidate=86400' } });
    const fm = /^\/(et|en)\/feed\.xml$/.exec(p);
    if (fm) return new Response(renderFeed({ origin: url.origin, lang: fm[1], rows: (await env.DB.prepare("SELECT m.*, e.*, t.slug, t.title, t.body FROM event e JOIN event_text t ON t.event_id = e.id AND t.lang = ? LEFT JOIN media m ON m.id = e.image_id WHERE e.status = 'published' ORDER BY e.created_at DESC, e.id DESC LIMIT 20").bind(fm[1]).all()).results }), { headers: { 'content-type': 'application/rss+xml; charset=utf-8', 'cache-control': 'public, max-age=60' } });
    // the calendars (src/render/ics.mjs), session 1's last piece since 2026-10-01: one event at its page's
    // address plus .ics, and a feed per language at the list's, the coming events and the last ninety days
    const ic = /^\/(et\/sundmused|en\/events)(?:\/([a-z0-9-]+))?\.ics$/.exec(p);
    if (ic) { const out = await calendar(env, ic[1] === 'et/sundmused' ? 'et' : 'en', ic[2], url); if (out) return out; }
    for (const lang of ['et', 'en']) {
      const m = EVENT[lang].exec(p);
      if (m) { const out = await event(env, lang, m[1], url); if (out) return reply(out); break; }
    }
    // the front pages, both from D1 since 2026-10-03 (asked: "do estonian front page"); public/index.html, the static one, is in git at 5977631
    if (p === '/') return reply(await eventsList(env, 'et', url, true));
    if (p === '/en' || p === '/en/') return reply(await eventsList(env, 'en', url, true));
    if (p === '/et' || p === '/et/') return new Response(null, { status: 301, headers: { location: '/' } });
    if (LIST_LANG[p]) return reply(await eventsList(env, LIST_LANG[p], url));
    // the newsletter: sign-up, confirm, leave, the archive and its editor (src/newsletter.mjs), since 2026-10-01
    if (/^\/(et\/uudiskiri|en\/newsletter|uudiskiri|edit\/uudiskiri)(\/|$)/.test(p)) { const out = await newsletter(request, env, url, ctx); if (out) return out; }
    const pm = PAGE.exec(p);
    if (pm) { const out = await textPage(env, pm[1], pm[2], url); if (out) return reply(out); }
    // the notices and their push subscriptions (src/items.mjs), since 2026-10-01
    if (p === '/items' || p.startsWith('/items/')) { const out = await itemsRoute(request, env, url); if (out) return out; }
    // the radio, positron's station in this site's chrome (src/render/station.mjs), since 2026-10-01
    // the radio, at /radio since 2026-10-01 ("rename station to radio"); /station answers with the way there
    if (p === '/radio') return reply(renderStation(await radioShows(env)));
    // the programming sketch of the morning became the radio tools research the same afternoon (src/render/research.mjs)
    if (p === '/radio/kava') return new Response(null, { status: 301, headers: { location: '/admin/research/radio' } });
    if (p === '/radio/state.json') return radioState(env);
    // a kept live show (src/radio.mjs), since 2026-10-02
    if (p.startsWith('/radio/')) { const out = await serveShow(request, env, p); if (out) return out; }
    if (p === '/station') return new Response(null, { status: 301, headers: { location: `/radio${url.search}` } });
    // the tools, one card each (src/render/admin.mjs), since 2026-10-01
    // research, a card per study (src/render/research.mjs), since 2026-10-02
    if (p === '/admin/research') return new Response(String(renderResearch()), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } });
    if (p === '/admin/research/radio') return new Response(String(renderRadioResearch()), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } });
    // the docs, an index and the plan for moving eccm.ee here (src/render/docs.mjs), since 2026-10-07
    if (p === '/docs' || p === '/docs/') return new Response(String(renderDocs()), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } });
    // each doc is a Markdown file under docs/ (src/render/docs.mjs)
    { const d = /^\/docs\/([a-z0-9-]+)$/.exec(p); const out = d && renderDoc(d[1]); if (out) return new Response(String(out), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } }); }
    if (p === '/admin' || p === '/admin/') return new Response(String(renderAdmin()), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } });
    if (p === '/edit' || p.startsWith('/edit/')) { const out = await editor(request, env, url); if (out) return out; }
    const lang = p.startsWith('/en') ? 'en' : 'et';
    return reply(notFound(lang, p), 404);
  },
  // the cron of wrangler.jsonc, every five minutes since the station came (it was ten): the outbox's retry
  // (src/mail.mjs), the radio's recorder woken if its alarm ever stopped (src/radio.mjs), and the station's
  // sweep of live chunks heard and gone (src/station/station.mjs), which wants five
  async scheduled(event, env, ctx) { ctx.waitUntil(drain(env)); ctx.waitUntil(wakeRadio(env)); await station.scheduled(event, env, ctx); },
};
