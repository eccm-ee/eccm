// news.mjs: the news, asked 2026-11-13 (migrations/0018_news.sql has the words). Public: the list at /et/uudised and
// /en/news, one item at /et/uudised/{slug} and /en/news/{slug}, and the three newest for the front page. Behind the
// editor key: /edit/news (every item, drafts too), /edit/news/new and /edit/news/{id}, a save guarded by the
// item's rev the way an event's is (src/editor.mjs), preview drawn by the public template without saving.
import { renderNewsList, renderNewsItem, renderNewsAdmin, newsForm, newsPath, STATUSES } from './render/news.mjs';
import { OTHER, origin } from './render/chrome.mjs';
import { slugify } from './editor.mjs';
import { storeUpload } from './media.mjs';
import { allPartners } from './partners.mjs';
import { VERSIONS } from './render/partners.mjs';
import { errorPage } from './render/editor.mjs';

const HEAD = { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' };
const reply = (body, status = 200) => new Response(String(body), { status, headers: HEAD });
const redirect = (to) => new Response(null, { status: 303, headers: { ...HEAD, location: to } });
const NOW = "strftime('%Y-%m-%dT%H:%M:%SZ','now')";
const BY = 'ECCM';
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const URLISH = /^https?:\/\/\S+$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const TODAY = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Tallinn' }).format(new Date());

// the rows the list and the front page draw: each published item's text in this language or else its Estonian or
// English one, the picture joined; limit for the front page
const LIST_Q = `SELECT n.id, n.published_on, n.status, COALESCE(t1.slug, t0.slug, t2.slug) AS slug, COALESCE(t1.title, t0.title, t2.title) AS title,
    COALESCE(t1.lang, t0.lang, t2.lang) AS tlang, COALESCE(t1.body, t0.body, t2.body) AS body, m.key AS pic, m.width, m.height
  FROM news n LEFT JOIN news_text t1 ON t1.news_id = n.id AND t1.lang = ? LEFT JOIN news_text t0 ON t0.news_id = n.id AND t0.lang = 'et'
    LEFT JOIN news_text t2 ON t2.news_id = n.id AND t2.lang = 'en' LEFT JOIN media m ON m.id = n.image_id`;
export const newsRows = async (db, lang, limit = 500) => {
  try { return (await db.prepare(`${LIST_Q} WHERE n.status = 'published' AND COALESCE(t1.title, t0.title, t2.title) IS NOT NULL ORDER BY n.published_on DESC, n.id DESC LIMIT ?`).bind(lang, limit).all()).results; }
  catch { return []; } // a database without migration 0018 has no news
};

const LISTP = { '/et/uudised': 'et', '/en/news': 'en' };
const ITEM = /^\/(et\/uudised|en\/news)\/([a-z0-9-]+)$/;

async function item(env, lang, slug, url, editor) {
  const db = env.DB;
  const q = "SELECT t.* FROM news_text t JOIN news n ON n.id = t.news_id WHERE t.lang = ? AND t.slug = ? AND n.status = 'published'";
  let text = await db.prepare(q).bind(lang, slug).first();
  let fallback = false;
  if (!text) { text = await db.prepare(q).bind(OTHER[lang], slug).first(); fallback = !!text; }
  if (!text) return null;
  const n = await db.prepare('SELECT * FROM news WHERE id = ?').bind(text.news_id).first();
  const media = n.image_id ? await db.prepare('SELECT * FROM media WHERE id = ?').bind(n.image_id).first() : null;
  const links = (await db.prepare('SELECT * FROM news_link WHERE news_id = ? ORDER BY position').bind(n.id).all()).results;
  const partners = (await db.prepare('SELECT p.*, np.version FROM news_partner np JOIN partner p ON p.id = np.partner_id WHERE np.news_id = ? AND (p.lang IS NULL OR p.lang = ?) ORDER BY np.position').bind(n.id, lang).all()).results;
  const twin = await db.prepare('SELECT lang, slug FROM news_text WHERE news_id = ? AND lang = ?').bind(n.id, OTHER[lang]).first();
  return renderNewsItem({ lang, text, fallback, item: n, media, links, partners, twin, origin: origin(), path: url.pathname, editor });
}

// the public routes; replyFor is index.mjs's, so an editor's copy is never cached
export async function newsPublic(request, env, url, { loggedIn, replyFor, reply: pub }) {
  const p = url.pathname.replace(/\/$/, '');
  if (LISTP[p]) return pub(renderNewsList({ lang: LISTP[p], rows: await newsRows(env.DB, LISTP[p]), origin: origin() }));
  const m = ITEM.exec(p);
  if (m) {
    const lang = m[1] === 'et/uudised' ? 'et' : 'en';
    const editor = await loggedIn(request, env);
    const out = await item(env, lang, m[2], url, editor);
    if (out) return replyFor(out, editor);
  }
  return null;
}

// ── the editor ──────────────────────────────────────────────────────────────
const s = (fd, k) => String(fd.get(k) ?? '').replace(/\r\n/g, '\n').trim();
const textOf = (rows, lang) => { const r = rows.find((t) => t.lang === lang); return { title: r?.title ?? '', slug: r?.slug ?? '', body: r?.body ?? '', exists: !!r }; };
// a link row back to its line, the words dropped from the end when empty
const linkLine = (l) => [l.url, l.label_et, l.label_en].join(' | ').replace(/( \| )+$/, '');
const fromRows = (n, texts, links, nps, pic) => ({
  id: n?.id, rev: n?.rev ?? 0, status: n?.status ?? 'draft', published_on: n?.published_on ?? TODAY(),
  et: textOf(texts, 'et'), en: textOf(texts, 'en'),
  image_key: pic?.key ?? '', alt_et: pic?.alt_et ?? '', alt_en: pic?.alt_en ?? '',
  links: links.map(linkLine).join('\n'),
  partners: nps.map((r) => r.partner_id), partner_version: nps[0]?.version ?? 'bw',
});
const parse = (fd, before) => ({
  id: before.id, rev: parseInt(s(fd, 'rev'), 10) || 0, status: s(fd, 'status'), published_on: s(fd, 'published_on'),
  et: { title: s(fd, 'title_et'), slug: s(fd, 'slug_et').toLowerCase(), body: s(fd, 'body_et'), exists: before.et.exists },
  en: { title: s(fd, 'title_en'), slug: s(fd, 'slug_en').toLowerCase(), body: s(fd, 'body_en'), exists: before.en.exists },
  image_key: s(fd, 'image_key'), alt_et: s(fd, 'alt_et'), alt_en: s(fd, 'alt_en'),
  links: s(fd, 'links'),
  partners: [...new Set(fd.getAll('partner').map((x) => parseInt(x, 10)).filter((x) => x > 0))], partner_version: s(fd, 'partner_version') || 'bw',
});
const linkRows = (text) => text.split('\n').map((x) => x.trim()).filter(Boolean).map((line) => {
  const [url, et = '', en = ''] = line.split('|').map((x) => x.trim());
  return { url, label_et: et, label_en: en };
});

async function validate(v, db, media, partners) {
  const errors = [];
  const bad = (field, msg) => errors.push({ field, msg });
  if (!STATUSES.some(([k]) => k === v.status)) bad('status', 'No status chosen.');
  if (!DAY.test(v.published_on) || Number.isNaN(Date.parse(v.published_on))) bad('published_on', 'Date is not a date.');
  if (!v.et.title && !v.en.title) bad('title_et', 'The title is empty in both languages. At least one language must be filled in.');
  for (const lang of ['et', 'en']) {
    const t = v[lang];
    const name = lang === 'et' ? 'Estonian' : 'English';
    if (!t.title) {
      if (t.exists) bad(`title_${lang}`, `${name} title is empty, but the ${name} text exists and cannot be removed here.`);
      else if (t.slug || t.body) bad(`title_${lang}`, `${name} title is empty, but the slug or text is filled in.`);
      continue;
    }
    const derived = !t.slug;
    if (derived) t.slug = slugify(t.title);
    if (!SLUG.test(t.slug)) { bad(`slug_${lang}`, `${name} slug may hold only lowercase a to z, digits and hyphens.`); continue; }
    const taken = await db.prepare('SELECT news_id FROM news_text WHERE lang = ? AND slug = ? AND news_id != ?').bind(lang, t.slug, v.id ?? 0).first();
    if (taken && derived) t.slug = slugify(`${t.slug}-${v.published_on}`);
    else if (taken) bad(`slug_${lang}`, `${name} slug ${t.slug} is already used by another news item.`);
  }
  const m = v.image_key ? media.find((x) => x.key === v.image_key) : null;
  if (v.image_key && !m) bad('image_key', 'No such picture. Choose one from the list or upload a file.');
  v.image_id = m ? m.id : null;
  v.linkRows = linkRows(v.links);
  v.linkRows.forEach((l, i) => { if (!URLISH.test(l.url)) bad('links', `Link ${i + 1} does not start with https:// or http://.`); });
  if (v.partners.some((id) => !partners.some((p) => p.id === id))) bad('partner', 'One of the ticked logos is no longer there. Tick them again.');
  if (!VERSIONS.some(([k]) => k === v.partner_version)) bad('partner_version', 'Choose colour or black and white for the logos.');
  return errors;
}

async function save(db, v) {
  const texts = ['et', 'en'].filter((l) => v[l].title);
  const alt = v.image_id ? [db.prepare('UPDATE media SET alt_et = ?, alt_en = ? WHERE id = ?').bind(v.alt_et, v.alt_en, v.image_id)] : [];
  if (!v.id) {
    const ins = await db.prepare('INSERT INTO news (published_on, image_id, status, updated_by) VALUES (?,?,?,?)').bind(v.published_on, v.image_id, v.status, BY).run();
    const id = ins.meta.last_row_id;
    const stmts = texts.map((l) => db.prepare('INSERT INTO news_text (news_id, lang, slug, title, body) VALUES (?,?,?,?,?)').bind(id, l, v[l].slug, v[l].title, v[l].body))
      .concat(v.linkRows.map((l, i) => db.prepare('INSERT INTO news_link (news_id, position, label_et, label_en, url) VALUES (?,?,?,?,?)').bind(id, i + 1, l.label_et, l.label_en, l.url)))
      .concat(v.partners.map((pid, i) => db.prepare('INSERT INTO news_partner (news_id, partner_id, position, version) VALUES (?,?,?,?)').bind(id, pid, i + 1, v.partner_version)))
      .concat(alt);
    if (stmts.length) await db.batch(stmts);
    return { id };
  }
  const guard = 'EXISTS (SELECT 1 FROM news WHERE id = ? AND rev = ?)';
  const g = [v.id, v.rev];
  const stmts = texts.map((l) => db.prepare(`INSERT INTO news_text (news_id, lang, slug, title, body) SELECT ?,?,?,?,? WHERE ${guard} ON CONFLICT (news_id, lang) DO UPDATE SET slug = excluded.slug, title = excluded.title, body = excluded.body`).bind(v.id, l, v[l].slug, v[l].title, v[l].body, ...g))
    .concat([db.prepare(`DELETE FROM news_link WHERE news_id = ? AND ${guard}`).bind(v.id, ...g)])
    .concat(v.linkRows.map((l, i) => db.prepare(`INSERT INTO news_link (news_id, position, label_et, label_en, url) SELECT ?,?,?,?,? WHERE ${guard}`).bind(v.id, i + 1, l.label_et, l.label_en, l.url, ...g)))
    .concat([db.prepare(`DELETE FROM news_partner WHERE news_id = ? AND ${guard}`).bind(v.id, ...g)])
    .concat(v.partners.map((pid, i) => db.prepare(`INSERT INTO news_partner (news_id, partner_id, position, version) SELECT ?,?,?,? WHERE ${guard}`).bind(v.id, pid, i + 1, v.partner_version, ...g)))
    .concat(alt.map((st) => st))
    .concat([db.prepare(`UPDATE news SET published_on = ?, image_id = ?, status = ?, updated_at = ${NOW}, updated_by = ?, rev = rev + 1 WHERE id = ? AND rev = ?`).bind(v.published_on, v.image_id, v.status, BY, ...g)]);
  const results = await db.batch(stmts);
  return { id: v.id, stale: results[results.length - 1].meta.changes !== 1 };
}

async function load(db, id) {
  const n = await db.prepare('SELECT * FROM news WHERE id = ?').bind(id).first();
  if (!n) return null;
  const texts = (await db.prepare('SELECT * FROM news_text WHERE news_id = ?').bind(id).all()).results;
  const links = (await db.prepare('SELECT * FROM news_link WHERE news_id = ? ORDER BY position').bind(id).all()).results;
  const nps = (await db.prepare('SELECT partner_id, version FROM news_partner WHERE news_id = ? ORDER BY position').bind(id).all()).results;
  const pic = n.image_id ? await db.prepare('SELECT key, alt_et, alt_en FROM media WHERE id = ?').bind(n.image_id).first() : null;
  return { n, texts, values: fromRows(n, texts, links, nps, pic) };
}

async function form(request, env, url, id) {
  const db = env.DB;
  const before = id === 'new' ? { n: null, texts: [], values: fromRows(null, [], [], [], null) } : await load(db, +id);
  if (!before) return reply(errorPage({ status: 404 }), 404);
  const media = (await db.prepare('SELECT id, key, width, height, alt_et, alt_en FROM media ORDER BY id').all()).results;
  const partners = await allPartners(db);
  const home = before.texts.find((x) => x.lang === 'et') || before.texts.find((x) => x.lang === 'en');
  const cancel = home && before.n.status === 'published' ? newsPath(home.lang, home.slug) : '/edit/news';
  if (request.method !== 'POST') return reply(newsForm({ v: before.values, media, partners, cancel }));
  const fd = await request.formData();
  const v = parse(fd, before.values);
  const action = s(fd, 'do');
  const errors = [];
  const file = fd.get('image_file');
  if (file && typeof file === 'object' && file.size > 0) {
    const up = await storeUpload(env, file, '', { et: v.alt_et, en: v.alt_en });
    if (up.error) errors.push({ field: 'image_file', msg: up.error });
    else { v.image_key = up.row.key; if (!media.some((x) => x.id === up.row.id)) media.push(up.row); }
  }
  errors.push(...await validate(v, db, media, partners));
  if (errors.length) return reply(newsForm({ v, errors, media, partners, cancel }), 422);
  if (action.startsWith('preview')) {
    let lang = action.endsWith('en') ? 'en' : 'et';
    if (!v[lang].title) lang = OTHER[lang];
    const text = { news_id: v.id, lang, slug: v[lang].slug, title: v[lang].title, body: v[lang].body };
    const pic = v.image_id ? { ...media.find((x) => x.id === v.image_id), alt_et: v.alt_et, alt_en: v.alt_en } : null;
    const logos = v.partners.map((pid) => partners.find((p) => p.id === pid)).filter((p) => p && (!p.lang || p.lang === lang)).map((p) => ({ ...p, version: v.partner_version }));
    const twin = v[OTHER[lang]].title ? { lang: OTHER[lang], slug: v[OTHER[lang]].slug } : null;
    return reply(renderNewsItem({ lang, text, fallback: false, item: { id: v.id, published_on: v.published_on }, media: pic, links: v.linkRows, partners: logos, twin, origin: origin(), path: newsPath(lang, text.slug), editor: true, notice: 'Preview. Nothing is saved. Close this tab and save from the form.', editHref: v.id ? `/edit/news/${v.id}` : '/edit/news/new' }));
  }
  const out = await save(db, v);
  if (out.stale) return reply(newsForm({ v, errors: [{ field: 'rev', msg: 'Someone else saved this item in the meantime. Open it in a new tab, compare, and make the change again.' }], media, partners, cancel }), 409);
  const l = v.et.title ? 'et' : 'en';
  return redirect(v.status === 'published' ? newsPath(l, v[l].slug) : `/edit/news/${out.id}`);
}

export async function newsEdit(request, env, url) {
  const p = url.pathname.replace(/\/$/, '');
  try {
    if (p === '/edit/news') {
      const rows = (await env.DB.prepare(`${LIST_Q} ORDER BY n.published_on DESC, n.id DESC`).bind('et').all()).results;
      return reply(renderNewsAdmin({ rows }));
    }
    const m = /^\/edit\/news\/(new|\d+)$/.exec(p);
    if (m) return form(request, env, url, m[1]);
    return null;
  } catch (e) {
    console.error('news', e && e.message);
    return reply(errorPage({ status: 500 }), 500);
  }
}
