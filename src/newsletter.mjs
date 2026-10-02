// newsletter.mjs: the newsletter, asked 2026-10-01 as "go", after "can we
// start newsletter work event on nonpaid account? see ../trip". ../trip gave
// the outbox, the mail template and the one-click unsubscribe (src/mail.mjs,
// src/render/mail.mjs); what trip never built, a sign-up without an account
// and so with double opt-in, and a composer, are here. The issue's shape is
// plans/plan-eccm-cms.md section 5: a greeting and one paragraph a person
// writes, the events as blocks of a title, a date line and a link, a closing
// line and a name.
//
//   GET  /et/uudiskiri, /en/newsletter, POST    the sign-up and the archive; a POST queues the confirm mail
//   GET  /uudiskiri/kinnita/{token}             confirms
//   GET  /uudiskiri/lahku/{token}, POST         the unsubscribe page, and the one-click POST of RFC 8058
//   GET  /et/uudiskiri/{slug}, /en/newsletter/{slug}   a sent issue
//   GET  /edit/uudiskiri, POST /edit/uudiskiri/new     the issues; a new one, composed
//   GET  /edit/uudiskiri/{id}, POST             one issue: save, delete, a test, the send
//   GET  /edit/uudiskiri/postkast               the outbox, masked
//
// The sign-up is not linked from the menu: the list starts at cutover, never
// on staging (plans/plan-eccm-presence.md item 5). On the Workers Free plan
// only the account's verified addresses receive anything; src/mail.mjs says
// what happens to the rest.
import { queue, drain } from './mail.mjs';
import { renderIssueMail, confirmMail } from './render/mail.mjs';
import { NL, NOTICE, renderSignup, renderNotice, renderArchive, renderIssues, renderIssueForm, renderOutbox } from './render/newsletter.mjs';
import { slugify } from './editor.mjs';

const PUB = { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' };
const EDIT = { ...PUB, 'x-robots-tag': 'noindex' };
const reply = (body, status = 200, headers = PUB) => new Response(String(body), { status, headers });
const go = (to) => new Response(null, { status: 303, headers: { ...EDIT, location: to } });
const NOW = "strftime('%Y-%m-%dT%H:%M:%SZ','now')";
const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;
const token = () => [...crypto.getRandomValues(new Uint8Array(18))].map((b) => b.toString(16).padStart(2, '0')).join('');
const form = async (request) => Object.fromEntries([...(await request.formData())].map(([k, v]) => [k, String(v).trim()]));
const later = (ctx, env) => ctx?.waitUntil(drain(env).catch(() => {}));

// ── the composer ─────────────────────────────────────────────────────────
const ADESSIVE = ['jaanuaril', 'veebruaril', 'märtsil', 'aprillil', 'mail', 'juunil', 'juulil', 'augustil', 'septembril', 'oktoobril', 'novembril', 'detsembril'];
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAY = { et: ['Pühapäeval', 'Esmaspäeval', 'Teisipäeval', 'Kolmapäeval', 'Neljapäeval', 'Reedel', 'Laupäeval'], en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] };
// "Kolmapäeval, 8. oktoobril kell 19.00, ECCM saal" and "Wednesday 8 October at 19:00, ECCM saal":
// the date in its own sentence, needing no year and no lexicon (section 5, hint 3). The weekday
// leads, and not only for the reader: a line opening "8. oktoobril" is an ordered list item to
// src/render/md.mjs, which drew it as "1. oktoobril" in the first test letter (2026-10-01)
const when = (local, venue, lang) => {
  const m = Number(local.slice(5, 7)) - 1, d = Number(local.slice(8, 10)), hm = local.slice(11, 16);
  const wd = WEEKDAY[lang][new Date(`${local.slice(0, 10)}T12:00:00Z`).getUTCDay()];
  const at = lang === 'et' ? `${wd}, ${d}. ${ADESSIVE[m]} kell ${hm.replace(':', '.')}` : `${wd} ${d} ${MONTH[m]} at ${hm}`;
  return venue ? `${at}, ${venue}` : at;
};
const eventUrl = (origin, lang, slug) => `${origin}${lang === 'et' ? '/et/sundmused/' : '/en/events/'}${slug}`;
const COPY = {
  et: { hi: 'Tere!', para: 'Kirjuta siia üks lõik: mis lähinädalatel ECCM-is toimub ja miks tulla.', head: 'Tulemas', none: 'Lähinädalatel sündmusi ei ole.', more: 'Loe lähemalt', ticket: 'pilet', end: 'Kohtumiseni!\nNimi' },
  en: { hi: 'Hello!', para: 'Write one paragraph here: what is on at ECCM in the coming weeks and why to come.', head: 'Coming up', none: 'No events in the coming weeks.', more: 'Read more', ticket: 'ticket', end: 'See you there!\nName' },
};
export async function compose(env, lang, origin) {
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Tallinn' }).format(new Date());
  const until = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Tallinn' }).format(new Date(Date.now() + 42 * 864e5));
  const { results } = await env.DB.prepare(`SELECT e.starts_at, e.venue, e.ticket_url, COALESCE(t1.slug, t0.slug) AS slug, COALESCE(t1.title, t0.title) AS title, COALESCE(t1.lang, t0.lang) AS tlang
    FROM event e LEFT JOIN event_text t1 ON t1.event_id = e.id AND t1.lang = ? LEFT JOIN event_text t0 ON t0.event_id = e.id AND t0.lang = 'et'
    WHERE e.status = 'published' AND substr(e.starts_at, 1, 10) BETWEEN ? AND ? AND COALESCE(t1.title, t0.title) IS NOT NULL ORDER BY e.starts_at`).bind(lang, today, until).all();
  const c = COPY[lang];
  const blocks = results.map((e) => `**${e.title}**\n${when(e.starts_at, e.venue, lang)}\n[${c.more}](${eventUrl(origin, e.tlang, e.slug)})${e.ticket_url ? `, [${c.ticket}](${e.ticket_url})` : ''}`);
  return [c.hi, c.para, `## ${c.head}`, ...(blocks.length ? blocks : [c.none]), c.end].join('\n\n');
}

// ── public ───────────────────────────────────────────────────────────────
const sentIssues = async (env, lang) => (await env.DB.prepare("SELECT slug, subject, sent_at FROM issue WHERE lang = ? AND status = 'sent' ORDER BY sent_at DESC").bind(lang).all()).results;

async function signup(request, env, url, ctx, lang) {
  const t = NOTICE[lang];
  if (request.method !== 'POST') return reply(renderSignup({ lang, issues: await sentIssues(env, lang) }));
  const f = await form(request);
  const email = (f.email || '').toLowerCase();
  if (f.website) return reply(renderSignup({ lang, issues: [], say: t.sent(email) }));   // the field a person never sees
  if (!EMAIL.test(email) || email.length > 200) return reply(renderSignup({ lang, issues: await sentIssues(env, lang), form: f, err: t.bad }), 400);
  const row = await env.DB.prepare('SELECT * FROM subscriber WHERE email = ?').bind(email).first();
  if (row?.status === 'confirmed') return reply(renderSignup({ lang, issues: [], say: t.already(email) }));
  // a new address, one that never confirmed or one that left: a fresh token, pending, and the confirm mail
  const tok = token();
  await env.DB.prepare(`INSERT INTO subscriber (email, lang, status, token) VALUES (?, ?, 'pending', ?)
    ON CONFLICT (email) DO UPDATE SET lang = excluded.lang, status = 'pending', token = excluded.token, unsubscribed_at = NULL`).bind(email, lang, tok).run();
  const m = confirmMail(lang, `${url.origin}/uudiskiri/kinnita/${tok}`);
  await queue(env, [{ kind: 'confirm', to: email, subject: m.subject, text: m.text }]);
  later(ctx, env);
  return reply(renderSignup({ lang, issues: [], say: t.sent(email) }));
}

async function confirm(env, tok) {
  const row = await env.DB.prepare('SELECT * FROM subscriber WHERE token = ?').bind(tok).first();
  if (!row || row.status === 'unsubscribed') return reply(renderNotice({ lang: row?.lang || 'et', text: NOTICE[row?.lang || 'et'].gone }), 404);
  if (row.status === 'pending') await env.DB.prepare(`UPDATE subscriber SET status = 'confirmed', confirmed_at = ${NOW} WHERE id = ?`).bind(row.id).run();
  return reply(renderNotice({ lang: row.lang, text: NOTICE[row.lang].confirmed }));
}

// GET asks, POST leaves: a mail client's one-click POST and the page's button land on the same address
async function leave(request, env, url, tok) {
  const row = await env.DB.prepare('SELECT * FROM subscriber WHERE token = ?').bind(tok).first();
  if (!row) return reply(renderNotice({ lang: 'et', text: NOTICE.et.gone }), 404);
  const t = NOTICE[row.lang];
  if (request.method === 'POST') {
    await env.DB.prepare(`UPDATE subscriber SET status = 'unsubscribed', unsubscribed_at = ${NOW} WHERE id = ? AND status != 'unsubscribed'`).bind(row.id).run();
    return reply(renderNotice({ lang: row.lang, text: t.left }));
  }
  if (row.status === 'unsubscribed') return reply(renderNotice({ lang: row.lang, text: t.left }));
  return reply(renderNotice({ lang: row.lang, text: t.leaveQ(row.email), form: url.pathname }));
}

// ── the editor ───────────────────────────────────────────────────────────
// a sent issue's web page is its slug; a draft's, which a test letter links, is its preview
const webFor = (issue, origin) => `${origin}${NL[issue.lang]}/${issue.status === 'sent' && issue.slug ? issue.slug : `eelvaade/${issue.id}`}`;
const mailFor = (issue, origin, unsub = `${origin}/uudiskiri/lahku/test`) => renderIssueMail(issue, { web: webFor(issue, origin), unsub });

async function issuePage(request, env, url, ctx, id) {
  const issue = await env.DB.prepare('SELECT * FROM issue WHERE id = ?').bind(id).first();
  if (!issue) return null;
  const show = (extra = {}, status = 200) => {
    const shown = { ...issue, ...(extra.form ? { subject: extra.form.subject, body: extra.form.body } : {}) };
    return reply(renderIssueForm({ issue, mail: mailFor(shown, url.origin).html, ...extra }), status, EDIT);
  };
  if (request.method !== 'POST') return show();
  if (issue.status === 'sent') return show({ errors: [{ field: 'body', msg: 'A sent letter cannot be changed.' }] }, 409);
  const f = await form(request);
  if (f.do === 'delete') { await env.DB.prepare('DELETE FROM issue WHERE id = ?').bind(id).run(); return go('/edit/uudiskiri'); }
  await env.DB.prepare(`UPDATE issue SET subject = ?, body = ?, updated_at = ${NOW} WHERE id = ?`).bind(f.subject || '', f.body || '', id).run();
  const now = { ...issue, subject: f.subject || '', body: f.body || '' };
  const errors = [];
  if (f.do === 'test' || f.do === 'send') {
    if (!now.subject) errors.push({ field: 'subject', msg: 'The subject is missing.' });
    if (!now.body) errors.push({ field: 'body', msg: 'The letter is empty.' });
  }
  if (f.do === 'test') {
    if (!EMAIL.test(f.test || '')) errors.push({ field: 'test', msg: 'The test address is missing or not valid.' });
    if (errors.length) return show({ form: f, errors, test: f.test }, 400);
    const m = mailFor(now, url.origin);
    await queue(env, [{ kind: 'test', issue_id: id, to: f.test, subject: `[test] ${now.subject}`, text: m.text, html: m.html, unsub: `${url.origin}/uudiskiri/lahku/test` }]);
    await drain(env);
    const last = await env.DB.prepare("SELECT * FROM outbox WHERE kind = 'test' AND issue_id = ? ORDER BY id DESC LIMIT 1").bind(id).first();
    const say = last?.sent_at ? `Test letter sent to ${f.test}.` : `The test letter is in the outbox but did not go${last?.error ? `: ${last.error}` : '. Sending is not set up.'}`;
    return reply(renderIssueForm({ issue: now, mail: m.html, say, test: f.test }), 200, EDIT);
  }
  if (f.do === 'send') {
    if (f.sure !== '1') errors.push({ field: 'sure', msg: 'Tick the box to confirm sending to everyone.' });
    if (errors.length) return show({ form: f, errors, test: f.test }, 400);
    const subs = (await env.DB.prepare("SELECT email, token FROM subscriber WHERE lang = ? AND status = 'confirmed'").bind(issue.lang).all()).results;
    // the slug from the subject, made unique in this language
    let slug = slugify(now.subject) || `kiri-${id}`;
    for (let n = 2; await env.DB.prepare('SELECT 1 FROM issue WHERE lang = ? AND slug = ?').bind(issue.lang, slug).first(); n++) slug = `${slugify(now.subject) || `kiri-${id}`}-${n}`;
    // sent first, guarded on draft, so a second press sends nothing
    const done = await env.DB.prepare(`UPDATE issue SET status = 'sent', slug = ?, sent_at = ${NOW}, sent_count = ? WHERE id = ? AND status = 'draft'`).bind(slug, subs.length, id).run();
    if (!done.meta.changes) return go(`/edit/uudiskiri/${id}`);
    const sent = { ...now, slug, status: 'sent' };
    await queue(env, subs.map((s) => { const unsub = `${url.origin}/uudiskiri/lahku/${s.token}`; const m = mailFor(sent, url.origin, unsub); return { kind: 'issue', issue_id: id, to: s.email, subject: now.subject, text: m.text, html: m.html, unsub }; }));
    later(ctx, env);
    return go(`/edit/uudiskiri/${id}`);
  }
  return go(`/edit/uudiskiri/${id}`);
}

export async function newsletter(request, env, url, ctx) {
  const p = url.pathname.replace(/\/$/, '');
  for (const lang of ['et', 'en']) {
    if (p === NL[lang]) return signup(request, env, url, ctx, lang);
    // a draft's preview, which a test letter's "Loe veebis" opens; noindex, and gone once the issue is sent
    const pv = new RegExp(`^${NL[lang]}/eelvaade/(\\d+)$`).exec(p);
    if (pv) {
      const issue = await env.DB.prepare('SELECT * FROM issue WHERE id = ? AND lang = ?').bind(Number(pv[1]), lang).first();
      if (!issue) return null;
      if (issue.status === 'sent') return go(`${NL[lang]}/${issue.slug}`);
      return reply(renderArchive({ lang, issue, draft: true }), 200, EDIT);
    }
    if (p.startsWith(`${NL[lang]}/`)) {
      const issue = await env.DB.prepare("SELECT * FROM issue WHERE lang = ? AND slug = ? AND status = 'sent'").bind(lang, p.slice(NL[lang].length + 1)).first();
      return issue ? reply(renderArchive({ lang, issue })) : null;
    }
  }
  let m = /^\/uudiskiri\/kinnita\/([0-9a-f]{36})$/.exec(p);
  if (m) return confirm(env, m[1]);
  m = /^\/uudiskiri\/lahku\/([0-9a-f]{36})$/.exec(p);
  if (m) return leave(request, env, url, m[1]);
  if (p === '/edit/uudiskiri') {
    const issues = (await env.DB.prepare('SELECT * FROM issue ORDER BY COALESCE(sent_at, updated_at) DESC').all()).results;
    const counts = (await env.DB.prepare('SELECT lang, status, COUNT(*) AS n FROM subscriber GROUP BY lang, status').all()).results;
    return reply(renderIssues({ issues, counts }), 200, EDIT);
  }
  if (p === '/edit/uudiskiri/new' && request.method === 'POST') {
    const lang = (await form(request)).lang === 'en' ? 'en' : 'et';
    const r = await env.DB.prepare('INSERT INTO issue (lang, body) VALUES (?, ?) RETURNING id').bind(lang, await compose(env, lang, url.origin)).first();
    return go(`/edit/uudiskiri/${r.id}`);
  }
  if (p === '/edit/uudiskiri/postkast') {
    return reply(renderOutbox({ rows: (await env.DB.prepare('SELECT * FROM outbox ORDER BY id DESC LIMIT 100').all()).results }), 200, EDIT);
  }
  m = /^\/edit\/uudiskiri\/(\d+)$/.exec(p);
  if (m) return issuePage(request, env, url, ctx, Number(m[1]));
  return null;
}

export { drain };
