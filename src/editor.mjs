// editor.mjs: the editing step of the CMS, asked 2026-09-28 as "So next cms
// step. Editing?". Routes under /edit, every one of them open:
//
//   GET  /edit                                 to the front page; an event is edited from its own Muuda button
//   GET  /edit/events/{id}, POST               the form from D1, then a save
//   GET  /edit/pages/new, POST                 a blank form, then an insert
//   GET  /edit/pages/{id}, POST                the form from D1, then a save
//
// There is no /edit/events/new since 2026-09-29, asked as "rm ... edit/event/new",
// and with it went the Add button on the public events list: an event is
// edited from its own Muuda button and nothing here makes one. A text page
// still has /edit/pages/new, which was not asked away.
//
// A save is one D1 batch, which is one transaction: every statement is
// guarded by the event's rev as the form saw it, and the event UPDATE that
// bumps rev comes last, so a form saved over by somebody else changes nothing
// at all and the reply is 409 with the typed values kept. Preview renders the
// public template from the POST body without saving (plan-eccm-cms.md section
// 8: preview and published cannot disagree because they are one function).
// The text pages (page and page_text, the five of data/seed-step3.sql) have
// the same three routes, the same guard and the same preview since 2026-09-28
// ("page from d1 and with edit?"), with nothing an event has: no facts, no
// picture, no credits. Nobody logs in: the gate, /login, /logout and the
// editor cookie went 2026-09-29, asked as "rm login/session stuff. all is
// free for editing", so anyone who reaches a form may save from it. Every
// reply here is still no-store and noindex; nothing under /edit is a page for
// a visitor or a crawler.
import { renderEvent, cleanScheme } from './render/event.mjs';
import { storeUpload } from './media.mjs';
import { renderPage, pagePath } from './render/page.mjs';
import { OTHER, origin } from './render/chrome.mjs';
import { editorForm, pageForm, errorPage, CATEGORIES, STATUSES, eventPath, BLANK_CREDIT } from './render/editor.mjs';

const HEAD = { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' };
const reply = (body, status = 200, extra = {}) => new Response(String(body), { status, headers: { ...HEAD, ...extra } });
const redirect = (to, extra = {}) => new Response(null, { status: 303, headers: { ...HEAD, location: to, ...extra } });
const NOW = "strftime('%Y-%m-%dT%H:%M:%SZ','now')";
// updated_by named whoever the gate identified (migrations/0002_editing.sql).
// With no login there is nobody to name, so an insert leaves it and a save
// clears whatever an earlier one wrote.

// ── the form's values, from rows and from a POST ────────────────────────────
const LOCAL = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const URLISH = /^https?:\/\/\S+$/;
const MAP = { ä: 'a', ö: 'o', ü: 'u', õ: 'o', š: 's', ž: 'z', ß: 'ss', æ: 'ae', ø: 'o', å: 'a' };
// the slug rule of plans/plan-eccm-urls-sitemap-rss.md section 2: ASCII,
// lowercase, hyphens, cut at 60 on a word boundary, no id and no date
export const slugify = (title) => {
  let t = String(title ?? '').toLowerCase().replace(/[äöüõšžßæøå]/g, (c) => MAP[c]).normalize('NFD').replace(/[̀-ͯ]/g, '');
  t = t.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (t.length > 60) { const cut = t.lastIndexOf('-', 60); t = t.slice(0, cut > 0 ? cut : 60).replace(/-+$/, ''); }
  return t;
};
const people = (json) => { try { return JSON.parse(json || '[]'); } catch { return []; } };
const names = (v) => v.split(/[,;]/).map((x) => x.trim()).filter(Boolean);
const orgs = (v) => v.split(';').map((x) => x.trim()).filter(Boolean);
// a local time as the field posts it, seconds dropped, and only a real date
const local = (v) => { v = String(v ?? '').trim(); return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(v) ? v.slice(0, 16) : v; };
const isLocal = (v) => LOCAL.test(v) && new Date(v + ':00Z').toISOString().slice(0, 16) === v;

const text = (rows, lang) => { const r = rows.find((t) => t.lang === lang); return { title: r?.title ?? '', slug: r?.slug ?? '', body: r?.body ?? '', exists: !!r }; };
export const fromRows = (ev, texts, credits) => ({
  id: ev?.id, rev: ev?.rev ?? 0,
  starts_at: ev?.starts_at ?? '', ends_at: ev?.ends_at ?? '', duration_min: ev?.duration_min ?? '',
  venue: ev?.venue ?? 'ECCM saal', address: ev?.address ?? 'Pühavaimu 9, Tallinn',
  ticket_url: ev?.ticket_url ?? '', website_url: ev?.website_url ?? '', category: ev?.category ?? 'eccm',
  image_id: ev?.image_id ?? '', status: ev?.status ?? 'draft', publish_at: ev?.publish_at ?? '',
  et: text(texts, 'et'), en: text(texts, 'en'),
  credits: credits.map((c) => ({
    role_key: c.role_key ?? '', label_et: c.label_et ?? '', label_en: c.label_en ?? '',
    people: people(c.people).map((p) => p.name).join(', '),
    orgs_et: people(c.orgs).map((o) => o.et ?? '').join('; '),
    orgs_en: people(c.orgs).map((o) => o.en ?? '').join('; '),
  })),
});
// the credits that exist and nothing more, one blank block only when there are none; another is added by the
// Add credit button, through the add-credit action below with no script and in place with one (asked
// 2026-09-28: "credits: create component that shows first but allows add more items")
const padded = (v) => ({ ...v, credits: v.credits.length ? v.credits : [BLANK_CREDIT()] });

const s = (fd, k) => String(fd.get(k) ?? '').replace(/\r\n/g, '\n').trim();
export const parse = (fd, before) => {
  const count = Math.min(60, Math.max(0, parseInt(fd.get('credit_count'), 10) || 0));
  const v = {
    id: before.id, rev: parseInt(s(fd, 'rev'), 10) || 0,
    starts_at: local(s(fd, 'starts_at')), ends_at: local(s(fd, 'ends_at')), duration_min: s(fd, 'duration_min'),
    venue: s(fd, 'venue'), address: s(fd, 'address'), ticket_url: s(fd, 'ticket_url'), website_url: s(fd, 'website_url'),
    category: s(fd, 'category'), image_key: s(fd, 'image_key'), image_id: '', status: s(fd, 'status'), publish_at: local(s(fd, 'publish_at')),
    alt_et: s(fd, 'alt_et'), alt_en: s(fd, 'alt_en'), image_scheme: cleanScheme(s(fd, 'image_scheme')),
    et: { title: s(fd, 'title_et'), slug: s(fd, 'slug_et').toLowerCase(), body: s(fd, 'body_et'), exists: before.et.exists },
    en: { title: s(fd, 'title_en'), slug: s(fd, 'slug_en').toLowerCase(), body: s(fd, 'body_en'), exists: before.en.exists },
    credits: [],
  };
  for (let i = 0; i < count; i++) {
    v.credits.push({ role_key: s(fd, `c${i}_role`), label_et: s(fd, `c${i}_label_et`), label_en: s(fd, `c${i}_label_en`), people: s(fd, `c${i}_people`), orgs_et: s(fd, `c${i}_orgs_et`), orgs_en: s(fd, `c${i}_orgs_en`) });
  }
  return v;
};

// the messages, in words; every one names the field it is about
export async function validate(v, db, roles, media) {
  const errors = [];
  const bad = (field, msg) => errors.push({ field, msg });
  if (!v.starts_at) bad('starts_at', 'Start is empty.');
  else if (!isLocal(v.starts_at)) bad('starts_at', 'Start is not a date and time.');
  if (v.ends_at && !isLocal(v.ends_at)) bad('ends_at', 'End is not a date and time.');
  else if (v.ends_at && v.starts_at && v.ends_at <= v.starts_at) bad('ends_at', 'End is before the start.');
  if (v.duration_min !== '' && !(/^\d+$/.test(v.duration_min) && +v.duration_min >= 1 && +v.duration_min <= 1440)) bad('duration_min', 'Duration is a whole number of minutes, 1 to 1440.');
  if (v.ticket_url && !URLISH.test(v.ticket_url)) bad('ticket_url', 'The ticket link starts with https:// or http://.');
  if (v.website_url && !URLISH.test(v.website_url)) bad('website_url', 'The website address starts with https:// or http://.');
  if (!CATEGORIES.some(([k]) => k === v.category)) bad('category', 'No series chosen.');
  if (!STATUSES.some(([k]) => k === v.status)) bad('status', 'No status chosen.');
  // the typed file name becomes the media row's id, or a sentence naming the files that exist
  if (v.image_key !== undefined) {
    const m = v.image_key ? media.find((m) => m.key === v.image_key) : null;
    if (v.image_key && !m) bad('image_key', `No such picture. There are: ${media.map((m) => m.key).join(', ') || 'none'}.`);
    v.image_id = m ? String(m.id) : '';
  } else if (v.image_id && !media.some((m) => String(m.id) === v.image_id)) bad('image_id', 'No such picture.');
  if (v.publish_at && !isLocal(v.publish_at)) bad('publish_at', 'Publish from is not a date and time.');
  // the texts: Estonian is required, English is optional but cannot be
  // emptied once it exists, because its row carries the Joomla id
  for (const lang of ['et', 'en']) {
    const t = v[lang];
    const name = lang === 'et' ? 'Estonian' : 'English';
    if (!t.title) {
      if (lang === 'et') bad('title_et', 'Estonian title is empty.');
      else if (t.exists) bad('title_en', 'English title is empty, but the English text exists and cannot be removed here.');
      else if (t.slug || t.body) bad('title_en', 'English title is empty, but the slug or description is filled in.');
      continue;
    }
    const derived = !t.slug;
    if (derived) t.slug = slugify(t.title);
    if (!SLUG.test(t.slug)) { bad(`slug_${lang}`, `${name} slug may hold only lowercase a to z, digits and hyphens.`); continue; }
    const taken = await db.prepare('SELECT event_id FROM event_text WHERE lang = ? AND slug = ? AND event_id != ?').bind(lang, t.slug, v.id ?? 0).first();
    if (taken && derived && v.starts_at) t.slug = slugify(`${t.slug}-${v.starts_at.slice(0, 10)}`);
    else if (taken) bad(`slug_${lang}`, `${name} slug ${t.slug} is already used by another event.`);
  }
  v.credits.forEach((c, i) => {
    c.empty = !c.people && !c.orgs_et && !c.orgs_en;
    if (c.empty) return;
    if (c.role_key && !roles.some((r) => r.key === c.role_key)) bad(`c${i}_role`, `Credit ${i + 1}: no such role.`);
    if (!c.role_key && !c.label_et) bad(`c${i}_role`, `Credit ${i + 1}: choose a role or name a free one.`);
  });
  return errors;
}

// ── rows from the values, for the save and for the preview ─────────────────
const creditRows = (v, before) => {
  // a note on a person (an instrument, a part) is not on the form yet; it
  // survives a save by the person's name
  const notes = new Map();
  for (const c of before) for (const p of people(c.people)) if (p.note) notes.set(p.name, p.note);
  return v.credits.filter((c) => !c.empty).map((c, i) => {
    const et = orgs(c.orgs_et), en = orgs(c.orgs_en);
    const n = Math.max(et.length, en.length);
    return {
      position: i + 1, role_key: c.role_key || null,
      label_et: c.role_key ? null : c.label_et, label_en: c.role_key ? null : (c.label_en || null),
      people: JSON.stringify(names(c.people).map((name) => (notes.has(name) ? { name, note: notes.get(name) } : { name }))),
      orgs: JSON.stringify(Array.from({ length: n }, (_, k) => ({ et: et[k] ?? en[k], en: en[k] ?? '' }))),
    };
  });
};
const eventValues = (v) => [v.starts_at, v.ends_at || null, v.duration_min === '' ? null : +v.duration_min, v.venue, v.address, v.ticket_url, v.website_url, v.category, v.image_id ? +v.image_id : null, v.status, v.publish_at || null];
const EVENT_COLS = 'starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at';

// the picture's descriptions go onto its media row, and the scheme the
// editor's browser read goes there too when the row has none yet (a picture
// seeded before the detector ran, read as the form opened)
const mediaStmts = (db, v, guard, g) => (v.image_id ? [
  db.prepare(`UPDATE media SET alt_et = ?, alt_en = ? WHERE id = ? AND ${guard}`).bind(v.alt_et, v.alt_en, +v.image_id, ...g),
  ...(v.image_scheme ? [db.prepare(`UPDATE media SET scheme = ?, scheme_v = ? WHERE id = ? AND scheme IS NULL AND ${guard}`).bind(v.image_scheme, JSON.parse(v.image_scheme).v, +v.image_id, ...g)] : []),
] : []);

async function save(db, v, before) {
  const credits = creditRows(v, before.creditRows);
  const texts = ['et', 'en'].filter((l) => v[l].title);
  if (!v.id) {
    const ins = await db.prepare(`INSERT INTO event (${EVENT_COLS}) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).bind(...eventValues(v)).run();
    const id = ins.meta.last_row_id;
    const stmts = texts.map((l) => db.prepare('INSERT INTO event_text (event_id, lang, slug, title, body) VALUES (?,?,?,?,?)').bind(id, l, v[l].slug, v[l].title, v[l].body))
      .concat(credits.map((c) => db.prepare('INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs) VALUES (?,?,?,?,?,?,?)').bind(id, c.position, c.role_key, c.label_et, c.label_en, c.people, c.orgs)));
    if (stmts.length) await db.batch(stmts);
    return { id };
  }
  // every statement guarded by the rev the form saw; the bump comes last, and
  // its changed-row count says whether anything happened at all
  const guard = 'EXISTS (SELECT 1 FROM event WHERE id = ? AND rev = ?)';
  const g = [v.id, v.rev];
  const stmts = texts.map((l) => db.prepare(`INSERT INTO event_text (event_id, lang, slug, title, body) SELECT ?,?,?,?,? WHERE ${guard} ON CONFLICT (event_id, lang) DO UPDATE SET slug = excluded.slug, title = excluded.title, body = excluded.body`).bind(v.id, l, v[l].slug, v[l].title, v[l].body, ...g))
    .concat([db.prepare(`DELETE FROM event_credit WHERE event_id = ? AND ${guard}`).bind(v.id, ...g)])
    .concat(credits.map((c) => db.prepare(`INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs) SELECT ?,?,?,?,?,?,? WHERE ${guard}`).bind(v.id, c.position, c.role_key, c.label_et, c.label_en, c.people, c.orgs, ...g)))
    .concat(mediaStmts(db, v, guard, g))
    .concat([db.prepare(`UPDATE event SET starts_at = ?, ends_at = ?, duration_min = ?, venue = ?, address = ?, ticket_url = ?, website_url = ?, category = ?, image_id = ?, status = ?, publish_at = ?, updated_at = ${NOW}, updated_by = NULL, rev = rev + 1 WHERE id = ? AND rev = ?`).bind(...eventValues(v), ...g)]);
  const results = await db.batch(stmts);
  return { id: v.id, stale: results[results.length - 1].meta.changes !== 1 };
}

// ── the text pages: values, validation, save and preview ────────────────────
// the same shape as the event's with the columns a page has: two text rows,
// a status and a publish time; key is the row's name in the page table
// ('eccm', 'tallinn-1965'), set once at the insert and never by the form
export const pageFromRows = (pg, texts) => ({
  id: pg?.id, rev: pg?.rev ?? 0, key: pg?.key ?? '',
  status: pg?.status ?? 'draft', publish_at: pg?.publish_at ?? '',
  et: text(texts, 'et'), en: text(texts, 'en'),
});
export const parsePage = (fd, before) => ({
  id: before.id, rev: parseInt(s(fd, 'rev'), 10) || 0, key: before.key,
  status: s(fd, 'status'), publish_at: local(s(fd, 'publish_at')),
  et: { title: s(fd, 'title_et'), slug: s(fd, 'slug_et').toLowerCase(), body: s(fd, 'body_et'), exists: before.et.exists },
  en: { title: s(fd, 'title_en'), slug: s(fd, 'slug_en').toLowerCase(), body: s(fd, 'body_en'), exists: before.en.exists },
});
// the one segment after the language that is not a page: the events list of
// plans/plan-eccm-urls-sitemap-rss.md section 2
const RESERVED = { et: ['sundmused'], en: ['events'] };
export async function validatePage(v, db) {
  const errors = [];
  const bad = (field, msg) => errors.push({ field, msg });
  if (!STATUSES.some(([k]) => k === v.status)) bad('status', 'No status chosen.');
  if (v.publish_at && !isLocal(v.publish_at)) bad('publish_at', 'Publish from is not a date and time.');
  // the texts: either language may be missing, since on eccm.ee NAN and
  // Ulysses are English only and Tallinn 1965 is Estonian only, but not
  // both, and a language cannot be emptied once it exists, because its row
  // carries the eccm.ee path
  if (!v.et.title && !v.en.title) bad('title_et', 'The title is empty in both languages. At least one language must be filled in.');
  for (const lang of ['et', 'en']) {
    const t = v[lang];
    const name = lang === 'et' ? 'Estonian' : 'English';
    if (!t.title) {
      if (t.exists) bad(`title_${lang}`, `${name} title is empty, but the ${name} text exists and cannot be removed here.`);
      else if (t.slug || t.body) bad(`title_${lang}`, `${name} title is empty, but the slug or text is filled in.`);
      continue;
    }
    if (!t.slug) t.slug = slugify(t.title);
    if (!SLUG.test(t.slug)) { bad(`slug_${lang}`, `${name} slug may hold only lowercase a to z, digits and hyphens.`); continue; }
    if (RESERVED[lang].includes(t.slug)) { bad(`slug_${lang}`, `${name} slug ${t.slug} is the address of the events list.`); continue; }
    const taken = await db.prepare('SELECT page_id FROM page_text WHERE lang = ? AND slug = ? AND page_id != ?').bind(lang, t.slug, v.id ?? 0).first();
    if (taken) bad(`slug_${lang}`, `${name} slug ${t.slug} is already used by another page.`);
  }
  // a new page's key is its first slug, Estonian before English
  if (!v.id && !errors.length) {
    v.key = v.et.slug || v.en.slug;
    if (await db.prepare('SELECT id FROM page WHERE key = ?').bind(v.key).first()) bad(v.et.slug ? 'slug_et' : 'slug_en', `The page key ${v.key} is already used by another page. Choose another slug.`);
  }
  return errors;
}

async function savePage(db, v) {
  const texts = ['et', 'en'].filter((l) => v[l].title);
  if (!v.id) {
    const ins = await db.prepare('INSERT INTO page (key, status, publish_at) VALUES (?,?,?)').bind(v.key, v.status, v.publish_at || null).run();
    const id = ins.meta.last_row_id;
    await db.batch(texts.map((l) => db.prepare('INSERT INTO page_text (page_id, lang, slug, title, body) VALUES (?,?,?,?,?)').bind(id, l, v[l].slug, v[l].title, v[l].body)));
    return { id };
  }
  // every statement guarded by the rev the form saw; the bump comes last, and
  // its changed-row count says whether anything happened at all
  const guard = 'EXISTS (SELECT 1 FROM page WHERE id = ? AND rev = ?)';
  const g = [v.id, v.rev];
  const stmts = texts.map((l) => db.prepare(`INSERT INTO page_text (page_id, lang, slug, title, body) SELECT ?,?,?,?,? WHERE ${guard} ON CONFLICT (page_id, lang) DO UPDATE SET slug = excluded.slug, title = excluded.title, body = excluded.body`).bind(v.id, l, v[l].slug, v[l].title, v[l].body, ...g))
    .concat([db.prepare(`UPDATE page SET status = ?, publish_at = ?, updated_at = ${NOW}, updated_by = NULL, rev = rev + 1 WHERE id = ? AND rev = ?`).bind(v.status, v.publish_at || null, ...g)]);
  const results = await db.batch(stmts);
  return { id: v.id, stale: results[results.length - 1].meta.changes !== 1 };
}

function previewPage(v, lang, url) {
  if (!v[lang].title) lang = OTHER[lang];
  const text = { page_id: v.id, lang, slug: v[lang].slug, title: v[lang].title, body: v[lang].body };
  const other = OTHER[lang];
  const twin = v[other].title ? { lang: other, slug: v[other].slug } : null;
  const notice = 'Preview. Nothing is saved. Close this tab and save from the form.';
  return reply(renderPage({ lang, text, fallback: false, twin, origin: origin(), path: pagePath(lang, text.slug), notice, editHref: v.id ? `/edit/pages/${v.id}` : '/edit/pages/new' }));
}

async function loadPage(db, id) {
  const pg = await db.prepare('SELECT * FROM page WHERE id = ?').bind(id).first();
  if (!pg) return null;
  const texts = (await db.prepare('SELECT * FROM page_text WHERE page_id = ?').bind(id).all()).results;
  return { pg, texts, values: pageFromRows(pg, texts) };
}

// where a page's Cancel goes: the page itself, Estonian first; and where a
// save lands: the page when it is published, else the form again, since a
// draft has no public page. The saved line and the public links left the
// form 2026-09-28 (asked as "rm Avalik leht: ET EN / Salvestatud kell 13.30."
// and "rm Lehed breadcrumb"), so landing on the page is the feedback.
const pageHome = (texts) => { const t = texts.find((x) => x.lang === 'et') || texts.find((x) => x.lang === 'en'); return t ? pagePath(t.lang, t.slug) : null; };
const landing = (v, path) => (v.status === 'published' && (v.et.title || v.en.title) ? path(v.et.title ? 'et' : 'en', v.et.title ? v.et.slug : v.en.slug) : null);

async function pageRoute(request, env, url, id) {
  const db = env.DB;
  const before = id === 'new' ? { pg: null, texts: [], values: pageFromRows(null, []) } : await loadPage(db, +id);
  if (!before) return reply(errorPage({ status: 404, reason: 'page' }), 404);
  const cancel = pageHome(before.texts) || '/';
  if (request.method !== 'POST') return reply(pageForm({ v: before.values, cancel }));
  const fd = await request.formData();
  const v = parsePage(fd, before.values);
  const action = s(fd, 'do');
  const errors = await validatePage(v, db);
  if (errors.length) return reply(pageForm({ v, errors, cancel }), 422);
  if (action.startsWith('preview')) return previewPage(v, action.endsWith('en') ? 'en' : 'et', url);
  const out = await savePage(db, v);
  if (out.stale) return reply(pageForm({ v, errors: [{ field: 'rev', msg: 'Someone else saved this page in the meantime. Open it in a new tab, compare, and make the change again.' }], cancel }), 409);
  return redirect(landing(v, pagePath) || `/edit/pages/${out.id}`);
}

// ── the routes ──────────────────────────────────────────────────────────────
async function load(db, id) {
  const ev = await db.prepare('SELECT * FROM event WHERE id = ?').bind(id).first();
  if (!ev) return null;
  const texts = (await db.prepare('SELECT * FROM event_text WHERE event_id = ?').bind(id).all()).results;
  const creditRows = (await db.prepare('SELECT * FROM event_credit WHERE event_id = ? ORDER BY position').bind(id).all()).results;
  return { ev, texts, creditRows, values: fromRows(ev, texts, creditRows) };
}
const lookups = async (db) => ({
  roles: (await db.prepare('SELECT * FROM role ORDER BY sort').bind().all()).results,
  media: (await db.prepare('SELECT id, key, width, height, alt_et, alt_en, scheme FROM media ORDER BY id').bind().all()).results,
});

async function preview(db, v, lang, before, roles, media, url) {
  if (!v[lang].title) lang = 'et';
  const ev = { id: v.id, rev: v.rev, ...Object.fromEntries(EVENT_COLS.split(', ').map((k, i) => [k, eventValues(v)[i]])) };
  const text = { event_id: v.id, lang, slug: v[lang].slug, title: v[lang].title, body: v[lang].body };
  const other = lang === 'et' ? 'en' : 'et';
  const twin = v[other].title ? { lang: other, slug: v[other].slug } : null;
  const credits = creditRows(v, before.creditRows).map((c) => { const r = roles.find((x) => x.key === c.role_key); return { ...c, role_et: r?.label_et, role_en: r?.label_en }; });
  const pic = media.find((m) => m.id === ev.image_id) || null;
  const next = (await db.prepare(`SELECT e.starts_at, e.venue, COALESCE(t1.slug, t0.slug) AS slug, COALESCE(t1.title, t0.title) AS title, COALESCE(t1.lang, t0.lang) AS tlang
    FROM event e LEFT JOIN event_text t1 ON t1.event_id = e.id AND t1.lang = ? LEFT JOIN event_text t0 ON t0.event_id = e.id AND t0.lang = 'et'
    WHERE e.status = 'published' AND e.starts_at > ? AND e.id != ? ORDER BY e.starts_at LIMIT 3`).bind(lang, ev.starts_at, v.id ?? 0).all()).results;
  const notice = 'Preview. Nothing is saved. Close this tab and save from the form.';
  return reply(renderEvent({ lang, text, fallback: false, ev, media: pic, credits, twin, next, origin: origin(), path: eventPath(lang, text.slug), notice, editHref: v.id ? `/edit/events/${v.id}` : '/edit/events/new' }));
}

async function form(request, env, url, id) {
  const db = env.DB;
  const before = await load(db, +id);
  if (!before) return reply(errorPage({ status: 404 }), 404);
  const { roles, media } = await lookups(db);
  // where Cancel goes: the event itself, Estonian first
  const home = before.texts.find((x) => x.lang === 'et') || before.texts.find((x) => x.lang === 'en');
  const cancel = home ? eventPath(home.lang, home.slug) : '/et/sundmused';
  if (request.method !== 'POST') return reply(editorForm({ v: padded(before.values), roles, media, cancel }));
  const fd = await request.formData();
  const v = parse(fd, before.values);
  const action = s(fd, 'do');
  // a file in the picture field is stored before anything else is looked at,
  // so a form that fails validation comes back naming the stored picture and
  // the file is not asked for twice
  const file = fd.get('image_file');
  const upErrors = [];
  if (file && typeof file === 'object' && file.size > 0) {
    const up = await storeUpload(env, file, v.image_scheme, { et: v.alt_et, en: v.alt_en });
    if (up.error) upErrors.push({ field: 'image_file', msg: up.error });
    else { v.image_key = up.row.key; if (!media.some((m) => m.id === up.row.id)) media.push(up.row); }
  }
  // one more blank credit block, the typed values kept, nothing validated and nothing saved
  if (action === 'add-credit') return reply(editorForm({ v: { ...v, credits: v.credits.concat([BLANK_CREDIT()]) }, roles, media, cancel }));
  const errors = upErrors.concat(await validate(v, db, roles, media));
  if (errors.length) return reply(editorForm({ v: padded(v), errors, roles, media, cancel }), 422);
  if (action.startsWith('preview')) return preview(db, v, action.endsWith('en') ? 'en' : 'et', before, roles, media, url);
  const out = await save(db, v, before);
  if (out.stale) return reply(editorForm({ v: padded(v), errors: [{ field: 'rev', msg: 'Someone else saved this event in the meantime. Open it in a new tab, compare, and make the change again.' }], roles, media, cancel }), 409);
  // the event page when it is published, else the form again, as a page save lands
  return redirect(landing(v, eventPath) || `/edit/events/${out.id}`);
}

export async function editor(request, env, url) {
  const p = url.pathname;
  try {
    if (p === '/edit') return redirect('/');
    const m = /^\/edit\/events\/(\d+)$/.exec(p);
    if (m) return form(request, env, url, m[1]);
    const pm = /^\/edit\/pages\/(new|\d+)$/.exec(p);
    if (pm) return pageRoute(request, env, url, pm[1]);
    return null;
  } catch (e) {
    // a plain sentence, never a stack: the likeliest cause on a fresh deploy
    // is migrations/0002_editing.sql or 0003_page_editing.sql not yet applied
    // to the remote database
    console.error('editor', e && e.message);
    return reply(errorPage({ status: 500 }), 500);
  }
}
