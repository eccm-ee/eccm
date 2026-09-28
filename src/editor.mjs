// editor.mjs: the editing step of the CMS, asked 2026-09-28 as "So next cms
// step. Editing?". Routes under /edit and the two gate routes:
//
//   GET  /login, POST /login, GET /logout      the staging stand-in (gate.mjs)
//   GET  /edit/events                          every event, any status
//   GET  /edit/events/new, POST                a blank form, then an insert
//   GET  /edit/events/{id}, POST               the form from D1, then a save
//
// A save is one D1 batch, which is one transaction: every statement is
// guarded by the event's rev as the form saw it, and the event UPDATE that
// bumps rev comes last, so a form saved over by somebody else changes nothing
// at all and the reply is 409 with the typed values kept. Preview renders the
// public template from the POST body without saving (plan-eccm-cms.md section
// 8: preview and published cannot disagree because they are one function).
// Every reply here is no-store and noindex; nothing under /edit is a page for
// a visitor or a crawler.
import { renderEvent } from './render/event.mjs';
import { editorList, editorForm, loginPage, gatePage, CATEGORIES, STATUSES, eventPath, BLANK_CREDIT } from './render/editor.mjs';
import { identify, tokenMatches, setCookie, clearCookie } from './gate.mjs';

const HEAD = { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' };
const reply = (body, status = 200, extra = {}) => new Response(String(body), { status, headers: { ...HEAD, ...extra } });
const redirect = (to, extra = {}) => new Response(null, { status: 303, headers: { ...HEAD, location: to, ...extra } });
const NOW = "strftime('%Y-%m-%dT%H:%M:%SZ','now')";

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
// Lisa tegija button, through the add-credit action below with no script and in place with one (asked
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
  if (!v.starts_at) bad('starts_at', 'Algus on tühi.');
  else if (!isLocal(v.starts_at)) bad('starts_at', 'Algus ei ole kuupäev ja kellaaeg.');
  if (v.ends_at && !isLocal(v.ends_at)) bad('ends_at', 'Lõpp ei ole kuupäev ja kellaaeg.');
  else if (v.ends_at && v.starts_at && v.ends_at <= v.starts_at) bad('ends_at', 'Lõpp on enne algust.');
  if (v.duration_min !== '' && !(/^\d+$/.test(v.duration_min) && +v.duration_min >= 1 && +v.duration_min <= 1440)) bad('duration_min', 'Kestus on täisarv minuteid, 1 kuni 1440.');
  if (v.ticket_url && !URLISH.test(v.ticket_url)) bad('ticket_url', 'Piletilink algab https:// või http://.');
  if (v.website_url && !URLISH.test(v.website_url)) bad('website_url', 'Veebilehe aadress algab https:// või http://.');
  if (!CATEGORIES.some(([k]) => k === v.category)) bad('category', 'Sari on valimata.');
  if (!STATUSES.some(([k]) => k === v.status)) bad('status', 'Olek on valimata.');
  // the typed file name becomes the media row's id, or a sentence naming the files that exist
  if (v.image_key !== undefined) {
    const m = v.image_key ? media.find((m) => m.key === v.image_key) : null;
    if (v.image_key && !m) bad('image_key', `Sellist pilti ei ole. Olemas: ${media.map((m) => m.key).join(', ') || 'mitte ükski'}.`);
    v.image_id = m ? String(m.id) : '';
  } else if (v.image_id && !media.some((m) => String(m.id) === v.image_id)) bad('image_id', 'Sellist pilti ei ole.');
  if (v.publish_at && !isLocal(v.publish_at)) bad('publish_at', 'Avaldamise aeg ei ole kuupäev ja kellaaeg.');
  // the texts: Estonian is required, English is optional but cannot be
  // emptied once it exists, because its row carries the Joomla id
  for (const lang of ['et', 'en']) {
    const t = v[lang];
    const name = lang === 'et' ? 'Eestikeelne' : 'Ingliskeelne';
    if (!t.title) {
      if (lang === 'et') bad('title_et', 'Eestikeelne pealkiri on tühi.');
      else if (t.exists) bad('title_en', 'Ingliskeelne pealkiri on tühi, aga ingliskeelne tekst on olemas ja seda ei saa siit kustutada.');
      else if (t.slug || t.body) bad('title_en', 'Ingliskeelne pealkiri on tühi, aga slug või kirjeldus on täidetud.');
      continue;
    }
    const derived = !t.slug;
    if (derived) t.slug = slugify(t.title);
    if (!SLUG.test(t.slug)) { bad(`slug_${lang}`, `${name} slug tohib sisaldada ainult väikesi tähti a kuni z, numbreid ja sidekriipse.`); continue; }
    const taken = await db.prepare('SELECT event_id FROM event_text WHERE lang = ? AND slug = ? AND event_id != ?').bind(lang, t.slug, v.id ?? 0).first();
    if (taken && derived && v.starts_at) t.slug = slugify(`${t.slug}-${v.starts_at.slice(0, 10)}`);
    else if (taken) bad(`slug_${lang}`, `${name} slug ${t.slug} on juba teisel sündmusel kasutusel.`);
  }
  v.credits.forEach((c, i) => {
    c.empty = !c.people && !c.orgs_et && !c.orgs_en;
    if (c.empty) return;
    if (c.role_key && !roles.some((r) => r.key === c.role_key)) bad(`c${i}_role`, `Tegija ${i + 1}: sellist rolli ei ole.`);
    if (!c.role_key && !c.label_et) bad(`c${i}_role`, `Tegija ${i + 1}: vali roll või kirjuta vaba rolli nimetus.`);
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

async function save(db, v, before, who) {
  const credits = creditRows(v, before.creditRows);
  const texts = ['et', 'en'].filter((l) => v[l].title);
  if (!v.id) {
    const ins = await db.prepare(`INSERT INTO event (${EVENT_COLS}, updated_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).bind(...eventValues(v), who).run();
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
    .concat([db.prepare(`UPDATE event SET starts_at = ?, ends_at = ?, duration_min = ?, venue = ?, address = ?, ticket_url = ?, website_url = ?, category = ?, image_id = ?, status = ?, publish_at = ?, updated_at = ${NOW}, updated_by = ?, rev = rev + 1 WHERE id = ? AND rev = ?`).bind(...eventValues(v), who, ...g)]);
  const results = await db.batch(stmts);
  return { id: v.id, stale: results[results.length - 1].meta.changes !== 1 };
}

// ── the routes ──────────────────────────────────────────────────────────────
const safeNext = (n) => (typeof n === 'string' && /^\/edit\/[a-z0-9/_-]*$/i.test(n) ? n : '/edit/events');

async function login(request, env, url) {
  if (!env.EDITOR_TOKEN) return reply(gatePage({ status: 503 }), 503);
  let token = url.searchParams.get('token');
  let next = url.searchParams.get('next');
  if (request.method === 'POST') { const fd = await request.formData(); token = fd.get('token'); next = fd.get('next'); }
  next = safeNext(next);
  if (token == null || token === '') return reply(loginPage({ next }));
  if (!tokenMatches(token, env)) return reply(loginPage({ next, wrong: true }), 401);
  return redirect(next, { 'set-cookie': await setCookie(env.EDITOR_TOKEN, url) });
}

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
  const notice = lang === 'et' ? 'Eelvaade. Midagi ei ole salvestatud; sulge see vahekaart ja salvesta vormilt.' : 'Preview. Nothing is saved; close this tab and save from the form.';
  return reply(renderEvent({ lang, text, fallback: false, ev, media: pic, credits, twin, next, origin: url.origin, path: eventPath(lang, text.slug), notice, editHref: v.id ? `/edit/events/${v.id}` : '/edit/events/new' }));
}

async function form(request, env, url, id, who) {
  const db = env.DB;
  const before = id === 'new' ? { ev: null, texts: [], creditRows: [], values: fromRows(null, [], []) } : await load(db, +id);
  if (!before) return reply(gatePage({ status: 404 }), 404);
  const { roles, media } = await lookups(db);
  const texts = Object.fromEntries(before.texts.map((t) => [t.lang, t]));
  if (request.method !== 'POST') {
    const saved = url.searchParams.get('saved') && before.ev ? before.ev.updated_at : null;
    return reply(editorForm({ v: padded(before.values), roles, media, saved, texts }));
  }
  // a cross-site form post cannot carry the cookie (SameSite=Lax), and a
  // browser that says where the post came from is believed
  const site = request.headers.get('sec-fetch-site');
  if (site && site !== 'same-origin' && site !== 'none') return reply(gatePage({ status: 403, reason: 'origin' }), 403);
  const fd = await request.formData();
  const v = parse(fd, before.values);
  const action = s(fd, 'do');
  // one more blank credit block, the typed values kept, nothing validated and nothing saved
  if (action === 'add-credit') return reply(editorForm({ v: { ...v, credits: v.credits.concat([BLANK_CREDIT()]) }, roles, media, texts }));
  const errors = await validate(v, db, roles, media);
  if (errors.length) return reply(editorForm({ v: padded(v), errors, roles, media, texts }), 422);
  if (action.startsWith('preview')) return preview(db, v, action.endsWith('en') ? 'en' : 'et', before, roles, media, url);
  const out = await save(db, v, before, who);
  if (out.stale) return reply(editorForm({ v: padded(v), errors: [{ field: 'rev', msg: 'Keegi teine salvestas selle sündmuse vahepeal. Ava leht uues vahekaardis, võrdle ja tee muudatus uuesti.' }], roles, media, texts }), 409);
  return redirect(`/edit/events/${out.id}?saved=1`);
}

export async function editor(request, env, url) {
  const p = url.pathname;
  try {
    if (p === '/login') return login(request, env, url);
    if (p === '/logout') return redirect('/login', { 'set-cookie': clearCookie() });
    const id = await identify(request, env);
    if (id.status) return reply(gatePage(id), id.status);
    if (p === '/edit/events') {
      const events = (await env.DB.prepare(`SELECT e.id, e.starts_at, e.status, e.updated_at, t0.title AS title_et, t1.title AS title_en
        FROM event e LEFT JOIN event_text t0 ON t0.event_id = e.id AND t0.lang = 'et' LEFT JOIN event_text t1 ON t1.event_id = e.id AND t1.lang = 'en'
        ORDER BY e.starts_at DESC`).bind().all()).results;
      return reply(editorList({ events }));
    }
    const m = /^\/edit\/events\/(new|\d+)$/.exec(p);
    if (m) return form(request, env, url, m[1], id.who);
    return null;
  } catch (e) {
    // a plain sentence, never a stack: the likeliest cause on a fresh deploy
    // is migrations/0002_editing.sql not yet applied to the remote database
    console.error('editor', e && e.message);
    return reply(gatePage({ status: 500 }), 500);
  }
}
