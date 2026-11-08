// index.mjs: the Worker behind eccm.positron.studio. Assets under public/ are
// served before this runs, so it sees only paths no file answers: the two
// language trees, /et/* and /en/*, and everything else as a 404 of its own
// (plans/plan-eccm-cms-step-1.md section 4). Session 1 and 2: the event page
// in both languages, with the fallback of section 2 when the English text row
// is missing. The URL words are plans/plan-eccm-urls-sitemap-rss.md section 2.
// The editor (src/editor.mjs) answers /edit/events* and /edit/pages*, and
// /edit itself goes to the front page. In front of it and the other tools
// since 2026-11-06, ECCM's one editor key, /login and /logout (src/auth.mjs); the
// first gate went 2026-09-29, asked as "rm login/session stuff. all is free
// for editing". Before that /edit was the
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
import { notFound, OTHER, useOrigin, origin } from './render/chrome.mjs';
import { editor } from './editor.mjs';
import { social, socialRow } from './social.mjs';
import { renderSitemap, renderFeed } from './render/feeds.mjs';
import { serveMedia } from './media.mjs';
import { useTransforms } from './render/pic.mjs';
import { renderIcs } from './render/ics.mjs';
import { renderAdmin } from './render/admin.mjs';
import { backup } from './backup.mjs';
import { newsletter, drain } from './newsletter.mjs';
import { contact, CONTACT_PATHS } from './contact.mjs';
import { ogRoute } from './og/route.mjs';
import { legacy } from './redirects.mjs';
import { passthrough } from './passthrough.mjs';
import { partners, eventPartners } from './partners.mjs';
import { layout, loadLayout } from './layout.mjs';
import { recordView, stats } from './stats.mjs';
import { gate, isProtected, isStatic, login, logout, loggedIn } from './auth.mjs';

const HTML = { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60' };
const EVENT = { et: /^\/et\/sundmused\/([a-z0-9-]+)$/, en: /^\/en\/events\/([a-z0-9-]+)$/ };
const PAGE = /^\/(et|en)\/([a-z0-9-]+)$/;
const LIST_LANG = Object.fromEntries(Object.entries(LIST).map(([l, p]) => [p, l]));
// today in Tallinn as YYYY-MM-DD, so an event is still to come for the whole of its day
const tallinnToday = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Tallinn' }).format(new Date());

const reply = (body, status = 200) => new Response(String(body), { status, headers: HTML });
// a public page that differs for a logged-in editor (the edit button, the social preview): never kept by a
// browser or a cache for the editor, and kept per cookie for everyone else
const replyFor = (body, editor) => new Response(String(body), { headers: editor ? { 'content-type': HTML['content-type'], 'cache-control': 'private, no-store' } : { ...HTML, vary: 'cookie' } });

async function event(env, lang, slug, url, editor = false) {
  const db = env.DB;
  let text = await db.prepare('SELECT * FROM event_text WHERE lang = ? AND slug = ?').bind(lang, slug).first();
  let fallback = false;
  // no text in this language: the Estonian row under this language's chrome,
  // reached because the switch on the Estonian page links here with the
  // Estonian slug when no twin exists
  if (!text && lang !== 'et') { text = await db.prepare('SELECT * FROM event_text WHERE lang = ? AND slug = ?').bind('et', slug).first(); fallback = !!text; }
  if (!text) return null;
  const row = await db.prepare("SELECT * FROM event WHERE id = ? AND status = 'published'").bind(text.event_id).first();
  if (!row) return null;
  // the venue in the text's language when it has one (migration 0012), else the event's own
  const ev = { ...row, venue: text.venue || row.venue };
  const media = ev.image_id ? await db.prepare('SELECT * FROM media WHERE id = ?').bind(ev.image_id).first() : null;
  const credits = (await db.prepare('SELECT c.*, r.label_et AS role_et, r.label_en AS role_en FROM event_credit c LEFT JOIN role r ON r.key = c.role_key WHERE c.event_id = ? ORDER BY c.position').bind(ev.id).all()).results;
  const twin = await db.prepare('SELECT lang, slug FROM event_text WHERE event_id = ? AND lang = ?').bind(ev.id, OTHER[lang]).first();
  // an English address carrying the Estonian slug, the fallback's, once the event has an English text of its
  // own (seed-step12-english.sql gave 42 events one): 301 to that text, so the old links keep working
  if (fallback) { const own = await db.prepare('SELECT slug FROM event_text WHERE event_id = ? AND lang = ?').bind(ev.id, lang).first(); if (own) return { moved: `/en/events/${own.slug}` }; }
  const next = (await db.prepare(`SELECT e.starts_at, COALESCE(NULLIF(t1.venue, ''), e.venue) AS venue, COALESCE(t1.slug, t0.slug) AS slug, COALESCE(t1.title, t0.title) AS title, COALESCE(t1.lang, t0.lang) AS tlang
    FROM event e LEFT JOIN event_text t1 ON t1.event_id = e.id AND t1.lang = ? LEFT JOIN event_text t0 ON t0.event_id = e.id AND t0.lang = 'et'
    WHERE e.status = 'published' AND e.starts_at > ? AND e.id != ? ORDER BY e.starts_at LIMIT 3`).bind(lang, ev.starts_at, ev.id).all()).results;
  // an editor sees the event's social previews under it, the fourth Instagram card's words with them (src/social.mjs)
  const sp = editor ? { row: await socialRow(db, ev.id, lang) } : null;
  // the logos the event chose, in this page's language (src/partners.mjs)
  const logos = await eventPartners(db, ev.id, lang);
  return renderEvent({ lang, text, fallback, ev, media, credits, twin, next, origin: origin(), path: url.pathname, editor, social: sp, partners: logos });
}

// the events list: every published event with a text in this language, or
// its Estonian text when it has none, the picture joined; the ones still to
// come in date order, the ones that have been newest first
async function eventsList(env, lang, url, home = false) {
  const rows = (await env.DB.prepare(`SELECT e.id, e.starts_at, COALESCE(NULLIF(t1.venue, ''), e.venue) AS venue, e.category, COALESCE(t1.slug, t0.slug) AS slug, COALESCE(t1.title, t0.title) AS title, COALESCE(t1.lang, t0.lang) AS tlang, COALESCE(t1.body, t0.body) AS body, m.key AS pic, m.width, m.height
    FROM event e LEFT JOIN event_text t1 ON t1.event_id = e.id AND t1.lang = ? LEFT JOIN event_text t0 ON t0.event_id = e.id AND t0.lang = 'et' LEFT JOIN media m ON m.id = e.image_id
    WHERE e.status = 'published' AND COALESCE(t1.title, t0.title) IS NOT NULL ORDER BY e.starts_at`).bind(lang).all()).results;
  const today = tallinnToday();
  const upcoming = rows.filter((r) => r.starts_at.slice(0, 10) >= today);
  const past = rows.filter((r) => r.starts_at.slice(0, 10) < today).reverse();
  return renderEvents({ lang, upcoming, past, origin: origin(), path: url.pathname, home });
}

// a text page by (lang, slug), the same query shape as an event's: the text
// row joined to its published page row; with no row in this language, the
// other language's row under this language's chrome and the fallback line
async function textPage(env, lang, slug, url) {
  const db = env.DB;
  const q = "SELECT t.*, p.key AS page_key FROM page_text t JOIN page p ON p.id = t.page_id WHERE t.lang = ? AND t.slug = ? AND p.status = 'published'";
  let text = await db.prepare(q).bind(lang, slug).first();
  let fallback = false;
  if (!text) { text = await db.prepare(q).bind(OTHER[lang], slug).first(); fallback = !!text; }
  if (!text) return null;
  const twin = await db.prepare('SELECT lang, slug FROM page_text WHERE page_id = ? AND lang = ?').bind(text.page_id, OTHER[lang]).first();
  return renderPage({ lang, text, fallback, twin, origin: origin(), path: url.pathname });
}

// an event's or a language's calendar; the rows are the list's query, one event or the window
const ICS = { 'content-type': 'text/calendar; charset=utf-8', 'cache-control': 'public, max-age=300' };
const CALNAME = { et: 'ECCM sündmused', en: 'ECCM events' };
async function calendar(env, lang, slug, url) {
  const q = `SELECT e.id, e.starts_at, e.ends_at, e.duration_min, COALESCE(NULLIF(t1.venue, ''), e.venue) AS venue, e.address, e.ticket_url, e.updated_at, COALESCE(t1.slug, t0.slug) AS slug, COALESCE(t1.title, t0.title) AS title, COALESCE(t1.lang, t0.lang) AS tlang, COALESCE(t1.body, t0.body) AS body
    FROM event e LEFT JOIN event_text t1 ON t1.event_id = e.id AND t1.lang = ? LEFT JOIN event_text t0 ON t0.event_id = e.id AND t0.lang = 'et'
    WHERE e.status = 'published' AND COALESCE(t1.title, t0.title) IS NOT NULL`;
  let rows;
  if (slug) {
    rows = (await env.DB.prepare(`${q} AND (t1.slug = ? OR t0.slug = ?) ORDER BY t1.slug = ? DESC LIMIT 1`).bind(lang, slug, slug, slug).all()).results;
    if (!rows.length) return null;
  } else {
    const since = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Tallinn' }).format(new Date(Date.now() - 90 * 864e5));
    rows = (await env.DB.prepare(`${q} AND substr(e.starts_at, 1, 10) >= ? ORDER BY e.starts_at`).bind(lang, since).all()).results;
  }
  const headers = { ...ICS, ...(slug ? { 'content-disposition': `attachment; filename="${slug}.ics"` } : {}) };
  return new Response(renderIcs({ rows, origin: origin(), lang, name: slug ? rows[0].title : CALNAME[lang] }), { headers });
}

// robots.txt from here rather than public/, since its Sitemap line is an absolute address and the
// origin is the environment's (SITE_ORIGIN); crawling stays open so a crawler can read the noindex
const robots = () => new Response(`User-agent: *\nAllow: /\n\nSitemap: ${origin()}/sitemap.xml\n`, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600' } });

// x-robots-tag: noindex on every response the Worker returns while NOINDEX is "on" (staging), the one place
// it is set for the whole site (plans/plan-eccm-migration.md, Noindex on every page until cutover). A response with
// immutable headers (a fetched one) is copied first; a WebSocket upgrade is left alone
const noindex = (res) => {
  if (!res || res.webSocket) return res;
  try { res.headers.set('x-robots-tag', 'noindex'); return res; } catch {
    const out = new Response(res.body, res); out.headers.set('x-robots-tag', 'noindex'); return out;
  }
};

export default {
  async fetch(request, env, ctx) {
    const res = await routes.fetch(request, env, ctx);
    // one page view to Analytics Engine, for /admin/stats (src/stats.mjs)
    recordView(request, env, new URL(request.url), res);
    return env.NOINDEX === 'on' ? noindex(res) : res;
  },
  // the cron of wrangler.jsonc, every five minutes: the outbox's retry (src/mail.mjs) and the daily backup (src/backup.mjs); the radio's recorder
  // and the station's sweep ran here until 2026-10-07 (v2in's archive/eccm-radio/radio.md)
  async scheduled(event, env, ctx) { ctx.waitUntil(backup(env, event.scheduledTime)); ctx.waitUntil(drain(env)); },
};

// every route, its response sent through fetch above; redirects name the request's own origin in Location
// (src/redirects.mjs), so a staging host stays on itself
const routes = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const p = url.pathname;
    // /cdn-cgi/image/ exists on the zone (positron.studio) and not on workers.dev, which this laptop has to use
    // since its DNS filter blocked the custom domain (2026-10-02, asked: "images broken in .../en/"), so a
    // workers.dev host draws the originals, as wrangler dev does
    useTransforms(url.hostname.endsWith('.workers.dev') ? 'off' : env.IMAGE_TRANSFORMS);
    // the site's own address for canonical, og:url, og:image, the sitemap, the feeds and the calendars:
    // SITE_ORIGIN from wrangler.jsonc, the request's origin only where it is not set
    useOrigin(env.SITE_ORIGIN || url.origin);
    if (p === '/robots.txt') return robots();
    // the editors' login, and the gate in front of the tools (src/auth.mjs)
    // the footer's logos from the partner table before any page is drawn (src/partners.mjs), asked 2026-11-07
    // as "footer logos should use same system"; not for the files and images below, which draw no footer
    if (!p.startsWith('/media/') && !p.startsWith('/og/')) await loadLayout(env);
    if (p === '/login') return login(request, env, url);
    if (p === '/logout') return logout();
    if (isProtected(p)) { const out = await gate(request, env, url); if (out) return out; }
    // /ui is a file under public/, sent here first by assets.run_worker_first so the gate sees it
    if (isStatic(p)) return env.ASSETS.fetch(request);
    // eccm.ee's old Joomla addresses: 301, 410, or the 404 with the miss logged (src/redirects.mjs)
    { const out = await legacy(request, env, url, ctx); if (out) return out; }
    // the radio1965 recordings, /radio1965/streams/*, from v2in.stream (src/passthrough.mjs)
    { const out = await passthrough(request, env, url); if (out) return out; }
    // the radio (/stream, /files/*, /admin/files, /radio, /station) went 2026-10-07, restorable from the tag radio-last (v2in's archive/eccm-radio/radio.md)
    // the uploaded pictures from R2, /media/{sha256}.{ext} (src/media.mjs)
    if (p.startsWith('/media/')) { const out = await serveMedia(env, p); if (out) return out; }
    // the event share images and their list for /ds (src/og/route.mjs), since 2026-10-01
    if (p.startsWith('/og/')) { const out = await ogRoute(request, env, url, ctx); if (out) return out; }
    // the sitemap and the feeds (src/render/feeds.mjs), at SITE_ORIGIN; robots.txt names the sitemap
    if (p === '/sitemap.xml') return new Response(renderSitemap({ origin: origin(), events: (await env.DB.prepare("SELECT e.id, e.updated_at, t.lang, t.slug FROM event e JOIN event_text t ON t.event_id = e.id WHERE e.status = 'published'").all()).results, pages: (await env.DB.prepare("SELECT p.id, p.updated_at, t.lang, t.slug FROM page p JOIN page_text t ON t.page_id = p.id WHERE p.status = 'published'").all()).results }), { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, s-maxage=86400, stale-while-revalidate=86400' } });
    const fm = /^\/(et|en)\/feed\.xml$/.exec(p);
    if (fm) return new Response(renderFeed({ origin: origin(), lang: fm[1], rows: (await env.DB.prepare("SELECT m.*, e.*, COALESCE(NULLIF(t.venue, ''), e.venue) AS venue, t.slug, t.title, t.body FROM event e JOIN event_text t ON t.event_id = e.id AND t.lang = ? LEFT JOIN media m ON m.id = e.image_id WHERE e.status = 'published' ORDER BY e.created_at DESC, e.id DESC LIMIT 20").bind(fm[1]).all()).results }), { headers: { 'content-type': 'application/rss+xml; charset=utf-8', 'cache-control': 'public, max-age=60' } });
    // the calendars (src/render/ics.mjs), session 1's last piece since 2026-10-01: one event at its page's
    // address plus .ics, and a feed per language at the list's, the coming events and the last ninety days
    const ic = /^\/(et\/sundmused|en\/events)(?:\/([a-z0-9-]+))?\.ics$/.exec(p);
    if (ic) { const out = await calendar(env, ic[1] === 'et/sundmused' ? 'et' : 'en', ic[2], url); if (out) return out; }
    for (const lang of ['et', 'en']) {
      const m = EVENT[lang].exec(p);
      if (m) { const editor = await loggedIn(request, env); const out = await event(env, lang, m[1], url, editor); if (out?.moved) return new Response(null, { status: 301, headers: { location: url.origin + out.moved } }); if (out) return replyFor(out, editor); break; }
    }
    // the front pages, both from D1 since 2026-10-03 (asked: "do estonian front page"); public/index.html, the static one, is in git at 5977631
    if (p === '/') return reply(await eventsList(env, 'et', url, true));
    if (p === '/en' || p === '/en/') return reply(await eventsList(env, 'en', url, true));
    if (p === '/et' || p === '/et/') return new Response(null, { status: 301, headers: { location: '/' } });
    if (LIST_LANG[p]) return reply(await eventsList(env, LIST_LANG[p], url));
    // the newsletter: sign-up, confirm, leave, the archive and its editor (src/newsletter.mjs), since 2026-10-01
    if (/^\/(et\/uudiskiri|en\/newsletter|uudiskiri|edit\/uudiskiri)(\/|$)/.test(p)) { const out = await newsletter(request, env, url, ctx); if (out) return out; }
    // the contact form, /et/kontakt and /en/contact (src/contact.mjs), since 2026-10-07; before the text pages, whose pattern it matches
    if (CONTACT_PATHS.includes(p.replace(/\/$/, ''))) return contact(request, env, url, ctx);
    const pm = PAGE.exec(p);
    if (pm) { const out = await textPage(env, pm[1], pm[2], url); if (out) return reply(out); }
    // the notices to phones (/items, /teated/{n}, /en/notices/{n}, the Items Durable Object and Web Push) went 2026-11-06 (archive/notices.md)
    // the tools, one card each (src/render/admin.mjs), since 2026-10-01
    // /docs, the migration plan and the presence notes drawn from Markdown, went 2026-11-06; the plan is plans/plan-eccm-migration.md
    // the page views of the last 30 days (src/stats.mjs), since 2026-11-08
    if (p === '/admin/stats') return stats(request, env);
    if (p === '/admin' || p === '/admin/') return new Response(String(renderAdmin()), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } });
    // the fourth Instagram card's preview and its words, under the event page since 2026-11-07 (src/social.mjs)
    if (p.startsWith('/edit/og/') || p.startsWith('/edit/social/')) { const out = await social(request, env, url); if (out) return out; }
    // the Layout page, the menu's pages and the footer's logos (src/layout.mjs), since 2026-11-07
    if (p === '/edit/layout') { const out = await layout(request, env, url); if (out) return out; }
    // the Logos page, the partners' logos (src/partners.mjs), since 2026-11-07
    if (p === '/edit/partners' || p.startsWith('/edit/partners/')) { const out = await partners(request, env, url); if (out) return out; }
    if (p === '/edit' || p.startsWith('/edit/')) { const out = await editor(request, env, url); if (out) return out; }
    const lang = p.startsWith('/en') ? 'en' : 'et';
    return reply(notFound(lang, p), 404);
  },
};
