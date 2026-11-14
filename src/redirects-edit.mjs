// redirects-edit.mjs: /edit/redirects, asked 2026-11-14: "two-way log missed URLs. We need to keep track of those
// and learn from redirects, because there might be pages which we didn't even know browsers are requesting."
// Three lists from D1 (migration 0019): the addresses that answered 404 (people and bots apart), the redirects
// that were followed and the rule that sent each, and the redirect table itself, where a miss becomes a row.
//
//   GET  /edit/redirects            the lists and the form
//   POST /edit/redirects            add or replace a row (from, to, status, note), or delete one (delete=from)
import { html } from './render/html.mjs';
import { page } from './render/chrome.mjs';
import { table } from './render/table.mjs';

const HEAD = { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' };
const num = (n) => Math.round(Number(n) || 0).toLocaleString('en').replace(/,/g, ' ');
const day = (t) => String(t || '').slice(0, 10);

// a from path as the table keys it: lowercase, no host, a leading slash
const keyOf = (s) => { let v = String(s || '').trim(); try { if (/^https?:/i.test(v)) { const u = new URL(v); v = u.pathname + u.search; } } catch {} return v ? (v.startsWith('/') ? v : '/' + v).toLowerCase().slice(0, 500) : ''; };
const toOf = (s) => { let v = String(s || '').trim(); try { if (/^https?:/i.test(v)) { const u = new URL(v); v = u.pathname + u.search; } } catch {} return v && !v.startsWith('/') ? '/' + v : v; };

export async function redirectsEdit(request, env, url) {
  let notice = '';
  if (request.method === 'POST') {
    const fd = await request.formData();
    const del = keyOf(fd.get('delete'));
    if (del) { await env.DB.prepare('DELETE FROM redirect WHERE from_path = ?').bind(del).run(); notice = `Removed ${del}.`; }
    else {
      const from = keyOf(fd.get('from')), status = fd.get('status') === '410' ? 410 : 301, to = status === 410 ? '' : toOf(fd.get('to'));
      if (!from || (status === 301 && !to)) notice = 'A redirect needs the old address and, unless it is gone, the new one.';
      else if (status === 301 && from === to.toLowerCase()) notice = 'The new address is the same as the old one.';
      else {
        await env.DB.prepare(`INSERT INTO redirect (from_path, to_path, status, source, note) VALUES (?, ?, ?, ?, ?)
          ON CONFLICT (from_path) DO UPDATE SET to_path = excluded.to_path, status = excluded.status, note = excluded.note`)
          .bind(from, to, status, fd.get('source') === 'miss' ? 'miss' : 'hand', String(fd.get('note') || '').slice(0, 200)).run();
        notice = status === 410 ? `${from} now answers Gone.` : `${from} now goes to ${to}.`;
      }
    }
  }
  const all = async (sql) => { try { return (await env.DB.prepare(sql).all()).results || []; } catch { return null; } };
  const [misses, hits, rows] = await Promise.all([
    all("SELECT path, count, bots, area, referrer, first_seen, last_seen FROM redirect_miss WHERE path NOT IN (SELECT from_path FROM redirect) ORDER BY (count - bots) DESC, count DESC LIMIT 200"),
    all('SELECT from_path, to_path, rule, count, bots, last_seen FROM redirect_hit ORDER BY count DESC LIMIT 200'),
    all('SELECT from_path, to_path, status, source, note, created_at FROM redirect ORDER BY created_at DESC'),
  ]);
  const body = misses === null
    ? html`<h1>Redirects</h1><p class="note">This database has no redirect tables yet: migration 0019 is not applied.</p>`
    : html`<h1>Redirects</h1>
  ${notice ? html`<p class="note" role="status">${notice}</p>` : ''}
  <p class="note">Old and broken addresses people and search engines ask for, and where the site sends them. Counts start from the day each list was switched on.</p>
  <form method="post" class="redirect-form">
    <label>Old address <input name="from" id="from" required placeholder="/index.php/et/..."></label>
    <label>New address <input name="to" id="to" placeholder="/et/..."></label>
    <label>Answer <select name="status" id="status"><option value="301">Moved to the new address</option><option value="410">Gone</option></select></label>
    <label>Note <input name="note" id="note"></label>
    <button type="submit">Save redirect</button>
  </form>
  <h2>Not found</h2>
  <p class="note">Addresses that answered "page not found", most asked by people first. Copy one into the form above to send it somewhere.</p>
  ${misses.length ? table({ label: 'Not found', cols: [{ label: 'Address', cls: 'main' }, { label: 'People', cls: 'num' }, { label: 'Bots', cls: 'num' }, { label: 'Linked from', cls: '' }, { label: 'Last', cls: '' }],
    rows: misses.map((r) => [r.path, num(r.count - r.bots), num(r.bots), r.referrer || '', day(r.last_seen)]) }) : html`<p class="note">None yet.</p>`}
  <h2>Redirects followed</h2>
  <p class="note">Each old address that was sent on, how often, and which rule sent it: table is a row below, the others are the built-in rules for old events, menus, pages and pictures.</p>
  ${hits.length ? table({ label: 'Redirects followed', cols: [{ label: 'Old address', cls: 'main' }, { label: 'Went to', cls: '' }, { label: 'Rule', cls: '' }, { label: 'People', cls: 'num' }, { label: 'Bots', cls: 'num' }, { label: 'Last', cls: '' }],
    rows: hits.map((r) => [r.from_path, r.to_path, r.rule, num(r.count - r.bots), num(r.bots), day(r.last_seen)]) }) : html`<p class="note">None yet.</p>`}
  <h2>Redirect table</h2>
  ${rows.length ? table({ label: 'Redirect table', cols: [{ label: 'Old address', cls: 'main' }, { label: 'New address', cls: '' }, { label: 'Answer', cls: '' }, { label: 'Note', cls: '' }, { label: '', cls: '' }],
    rows: rows.map((r) => [r.from_path, r.to_path, r.status === 410 ? 'Gone' : 'Moved', r.note || r.source,
      html`<form method="post"><input type="hidden" name="delete" value="${r.from_path}"><button type="submit">Remove</button></form>`]) }) : html`<p class="note">No rows yet.</p>`}`;
  return new Response(String(page({ wide: true, lang: 'en', title: 'Redirects.', body: html`<div class="stats">${body}</div>` })), { headers: HEAD });
}
