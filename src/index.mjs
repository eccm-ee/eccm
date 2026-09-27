// index.mjs: the Worker behind eccm.positron.studio. Assets under public/ are
// served before this runs, so it sees only paths no file answers: the two
// language trees, /et/* and /en/*, and everything else as a 404 of its own
// (plans/plan-eccm-cms-step-1.md section 4). Session 1 and 2: the event page
// in both languages, with the fallback of section 2 when the English text row
// is missing. The URL words are plans/plan-eccm-urls-sitemap-rss.md section 2.
import { renderEvent } from './render/event.mjs';
import { notFound, OTHER } from './render/chrome.mjs';

const HTML = { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60' };
const EVENT = { et: /^\/et\/sundmused\/([a-z0-9-]+)$/, en: /^\/en\/events\/([a-z0-9-]+)$/ };

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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;
    for (const lang of ['et', 'en']) {
      const m = EVENT[lang].exec(p);
      if (m) { const out = await event(env, lang, m[1], url); if (out) return reply(out); break; }
    }
    const lang = p.startsWith('/en') ? 'en' : 'et';
    return reply(notFound(lang, p), 404);
  },
};
