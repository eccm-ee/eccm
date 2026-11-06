// items.mjs: the notices, positron's workers/items moved here (asked
// 2026-10-01: "move that items infra over to eccm ... make page on eccm to
// list and add items"). One Durable Object owns the notices, the schedule and
// the send, as it did there: a notice is a row with the moment it is due,
// the object's one alarm is set for the next such moment, and at that moment
// the notice turns published and goes to every phone that asked. Nothing
// polls. What changed on the way: no rooms (this site has one list), no
// shelving, and no Firebase: the object keeps the browsers' subscriptions
// itself and pushes to each through src/push.mjs, dropping one its push
// service answers 404 or 410 for.
//
//   GET  /items              the page: the form and the list (src/render/items.mjs)
//   POST /items              the form, then 303 back, or the form again with what to fix
//   POST /items/subscribe    a browser's PushSubscription as JSON (public/items.mjs)
//   POST /items/unsubscribe  { endpoint }
//   GET  /items/list         the list alone, for the page's own refresh
//   GET  /items/{id}, POST   one notice's form, then a save or a delete
//   GET  /items/key          the public VAPID key a browser subscribes with (public/push.mjs)
//
// Open like the editor: nobody logs in (src/editor.mjs says since when).
// A published notice is also public at /teated/{num} and /en/notices/{num}.
// From 2026-10-07 to 2026-11-06 a notice ticked Väin was also in a Joomla API for Väin's server;
// that went to v2in; staging's object still has the vain column, unread, and a fresh object never gets it.
import { send } from './push.mjs';
import { renderItems, renderItemEdit, itemsList, local } from './render/items.mjs';

const HEAD = { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' };
const JSON_HEAD = { 'content-type': 'application/json', 'cache-control': 'no-store' };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: JSON_HEAD });

// a datetime-local value is Tallinn's wall clock; the offset is read for that
// moment from Intl, twice, so a time either side of a clock change lands right
const LOCAL = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const offset = (ms) => { const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Tallinn', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(ms).map((x) => [x.type, x.value])); return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - ms; };
export const tallinnMs = (local) => { const wall = Date.parse(local + ':00Z'); let ms = wall - offset(wall); ms = wall - offset(ms); return ms; };

export class Items {
  constructor(ctx, env) {
    this.ctx = ctx;
    this.env = env;
    this.sql = ctx.storage.sql;
    this.sql.exec(`CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY, title TEXT NOT NULL, body TEXT NOT NULL DEFAULT '', url TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL, publish_at INTEGER NOT NULL, created_at INTEGER NOT NULL,
      published_at INTEGER, late_ms INTEGER, sent INTEGER, failed INTEGER
    )`);
    this.sql.exec(`CREATE TABLE IF NOT EXISTS subs (
      endpoint TEXT PRIMARY KEY, p256dh TEXT NOT NULL, auth TEXT NOT NULL, created_at INTEGER NOT NULL
    )`);
    // added 2026-10-07: num the notice's public number (/teated/{num}) and updated_at its last edit; an older
    // object gets the columns here and a number for every notice it already holds, oldest first
    const cols = new Set([...this.sql.exec(`PRAGMA table_info(items)`)].map((c) => c.name));
    if (!cols.has('num')) this.sql.exec(`ALTER TABLE items ADD COLUMN num INTEGER`);
    if (!cols.has('updated_at')) this.sql.exec(`ALTER TABLE items ADD COLUMN updated_at INTEGER`);
    this.sql.exec(`CREATE TABLE IF NOT EXISTS counter (name TEXT PRIMARY KEY, n INTEGER NOT NULL)`);
    for (const r of [...this.sql.exec(`SELECT id FROM items WHERE num IS NULL ORDER BY created_at`)]) this.sql.exec(`UPDATE items SET num = ? WHERE id = ?`, this.nextNum(), r.id);
    this.sql.exec(`CREATE UNIQUE INDEX IF NOT EXISTS items_num ON items (num)`);
    // no setAlarm here: on a cold wake the constructor runs before alarm(),
    // and setting one here replaces the alarm that is about to fire
    // (positron's workers/items, where Cloudflare's livelock is described)
  }

  // the next public number, from 1000 up and never one used before, even by a deleted notice, so an
  // address once given out never names another notice
  nextNum() {
    const used = Number([...this.sql.exec(`SELECT MAX(num) AS n FROM items`)][0].n ?? 0);
    const kept = Number([...this.sql.exec(`SELECT n FROM counter WHERE name = 'num'`)][0]?.n ?? 0);
    const n = Math.max(used, kept, 999) + 1;
    this.sql.exec(`INSERT INTO counter (name, n) VALUES ('num', ?) ON CONFLICT (name) DO UPDATE SET n = excluded.n`, n);
    return n;
  }

  nextDue() {
    const t = [...this.sql.exec(`SELECT MIN(publish_at) AS t FROM items WHERE status = 'waiting'`)][0]?.t;
    return t == null ? null : Number(t);
  }

  // set unconditionally: getAlarm() reads null inside a running alarm, and one
  // object has one alarm, so setting replaces; never in the past, which would
  // re-enter at once
  async rearm() {
    const due = this.nextDue();
    if (due == null) await this.ctx.storage.deleteAlarm();
    else await this.ctx.storage.setAlarm(Math.max(due, Date.now() + 1));
  }

  // a throwing alarm is retried about six times and then never again until
  // something sets one, so everything that can fail is caught and the alarm
  // is set again on the way out
  async alarm() {
    const now = Date.now();
    try {
      const due = [...this.sql.exec(`SELECT * FROM items WHERE status = 'waiting' AND publish_at <= ?`, now)];
      for (const row of due) {
        // visible first, announced second: what is published does not depend on a push service
        this.sql.exec(`UPDATE items SET status = 'published', published_at = ?, late_ms = ? WHERE id = ?`, now, now - Number(row.publish_at), row.id);
        const { sent, failed } = await this.announce(row);
        this.sql.exec(`UPDATE items SET sent = ?, failed = ? WHERE id = ?`, sent, failed, row.id);
      }
    } catch (e) {
      console.log(`alarm failed: ${e.message}`);
    }
    await this.rearm();
  }

  async announce(row) {
    const subs = [...this.sql.exec(`SELECT * FROM subs`)];
    if (!subs.length || !this.env.VAPID_JWK) return { sent: 0, failed: subs.length };
    const message = { id: row.id, title: row.title, body: row.body, url: row.url || `/teated/${row.num}` };
    let sent = 0, failed = 0;
    await Promise.all(subs.map(async (s) => {
      const status = await send(this.env, s, message).catch((e) => { console.log(`push failed: ${e.message}`); return 0; });
      if (status >= 200 && status < 300) sent++;
      else {
        failed++;
        if (status === 404 || status === 410) this.sql.exec(`DELETE FROM subs WHERE endpoint = ?`, s.endpoint);
        else console.log(`push ${status} for ${new URL(s.endpoint).host}`);
      }
    }));
    return { sent, failed };
  }

  async fetch(request) {
    const path = new URL(request.url).pathname;
    if (path === '/list') {
      const items = [...this.sql.exec(`SELECT * FROM items ORDER BY publish_at DESC LIMIT 100`)];
      const subs = Number([...this.sql.exec(`SELECT COUNT(*) AS n FROM subs`)][0].n);
      return json({ items, subs });
    }
    // what the public sees: the notices published by now, for /teated/{num}
    if (path === '/published') {
      return json({ items: [...this.sql.exec(`SELECT * FROM items WHERE status = 'published' AND publish_at <= ? ORDER BY num`, Date.now())] });
    }
    const body = await request.json().catch(() => null);
    if (!body) return json({ error: 'body must be JSON' }, 400);
    if (path === '/add') {
      const now = Date.now();
      this.sql.exec(`INSERT INTO items (id, title, body, url, status, publish_at, created_at, updated_at, num) VALUES (?, ?, ?, ?, 'waiting', ?, ?, ?, ?)`,
        crypto.randomUUID(), body.title, body.body || '', body.url || '', Math.max(Number(body.publish_at) || now, now), now, now, this.nextNum());
      await this.rearm();
      return json({ ok: true });
    }
    if (path === '/get') {
      return json({ item: [...this.sql.exec(`SELECT * FROM items WHERE id = ?`, String(body.id))][0] || null });
    }
    // a time is moved only while the notice waits: the guard is in the
    // statement, so a notice the alarm published between the form and the
    // save keeps its time and the reply says so
    if (path === '/edit') {
      const it = [...this.sql.exec(`SELECT status FROM items WHERE id = ?`, String(body.id))][0];
      if (!it) return json({ error: 'gone' }, 404);
      if (body.publish_at != null && it.status !== 'waiting') return json({ error: 'published' }, 409);
      this.sql.exec(`UPDATE items SET title = ?, body = ?, url = ?, updated_at = ? WHERE id = ?`, body.title, body.body || '', body.url || '', Date.now(), body.id);
      if (body.publish_at != null) this.sql.exec(`UPDATE items SET publish_at = ? WHERE id = ? AND status = 'waiting'`, Math.max(Number(body.publish_at), Date.now()), body.id);
      await this.rearm();
      return json({ ok: true });
    }
    if (path === '/delete') {
      this.sql.exec(`DELETE FROM items WHERE id = ?`, String(body.id));
      await this.rearm();
      return json({ ok: true });
    }
    if (path === '/subscribe') {
      const { endpoint, keys } = body;
      if (!/^https:\/\//.test(endpoint || '') || !keys?.p256dh || !keys?.auth) return json({ error: 'a PushSubscription: endpoint and keys.p256dh, keys.auth' }, 400);
      this.sql.exec(`INSERT OR REPLACE INTO subs (endpoint, p256dh, auth, created_at) VALUES (?, ?, ?, ?)`, endpoint, keys.p256dh, keys.auth, Date.now());
      return json({ ok: true });
    }
    if (path === '/unsubscribe') {
      this.sql.exec(`DELETE FROM subs WHERE endpoint = ?`, String(body.endpoint || ''));
      return json({ ok: true });
    }
    return json({ error: 'no such route' }, 404);
  }
}

const store = (env) => env.ITEMS.get(env.ITEMS.idFromName('items'));
export const ask = async (env, path, body) => (await store(env).fetch(`https://items${path}`, body === undefined ? {} : { method: 'POST', body: JSON.stringify(body) })).json();

const page = async (env, form = {}, errors = [], status = 200) => {
  const { items, subs } = await ask(env, '/list');
  return new Response(renderItems({ items, subs, form, errors }), { status, headers: HEAD });
};

// the posted form, trimmed, and what is wrong with it
const readForm = async (request) => {
  const f = Object.fromEntries([...(await request.formData())].map(([k, v]) => [k, String(v).trim()]));
  f.title ??= ''; f.body ??= ''; f.url ??= ''; f.publish_at ??= '';
  const errors = [];
  if (!f.title) errors.push({ field: 'title', msg: 'The title is missing.' });
  if (f.title.length > 120) errors.push({ field: 'title', msg: 'The title is longer than 120 characters.' });
  if (f.url && !/^(https?:\/\/\S+|\/\S*)$/.test(f.url)) errors.push({ field: 'url', msg: 'A link starts with https:// or a slash.' });
  if (f.publish_at && !LOCAL.test(f.publish_at)) errors.push({ field: 'publish_at', msg: 'The time is not valid.' });
  return { f, errors };
};
const back = () => new Response(null, { status: 303, headers: { ...HEAD, location: '/items' } });

async function one(request, env, id) {
  const { item: it } = await ask(env, '/get', { id });
  if (!it) return null;
  if (request.method !== 'POST') {
    const form = { title: it.title, body: it.body, url: it.url, publish_at: local(it.publish_at) };
    return new Response(renderItemEdit({ it, form }), { headers: HEAD });
  }
  const { f, errors } = await readForm(request);
  if (f.do === 'delete') { await ask(env, '/delete', { id }); return back(); }
  if (errors.length) return new Response(renderItemEdit({ it, form: f, errors }), { status: 400, headers: HEAD });
  const waiting = it.status === 'waiting';
  const out = await ask(env, '/edit', { id, title: f.title, body: f.body, url: f.url, ...(waiting ? { publish_at: f.publish_at ? tallinnMs(f.publish_at) : Date.now() } : {}) });
  if (out.error === 'published') {
    const { item } = await ask(env, '/get', { id });
    return new Response(renderItemEdit({ it: item, form: f, errors: [{ field: 'publish_at', msg: 'The notice was published meanwhile and its time can no longer change.' }] }), { status: 409, headers: HEAD });
  }
  return back();
}

export async function itemsRoute(request, env, url) {
  const p = url.pathname.replace(/\/$/, '');
  if (p === '/items' && request.method === 'GET') return page(env);
  if (p === '/items/key') return json({ key: env.VAPID_PUBLIC || null });
  if (p === '/items/list') return new Response(String(itemsList((await ask(env, '/list')).items)), { headers: HEAD });
  if (p === '/items' && request.method === 'POST') {
    const { f, errors } = await readForm(request);
    if (errors.length) return page(env, f, errors, 400);
    await ask(env, '/add', { title: f.title, body: f.body, url: f.url, publish_at: f.publish_at ? tallinnMs(f.publish_at) : Date.now() });
    return back();
  }
  if ((p === '/items/subscribe' || p === '/items/unsubscribe') && request.method === 'POST') {
    const body = await request.json().catch(() => null);
    if (!body) return json({ error: 'body must be JSON' }, 400);
    const out = await ask(env, p.slice('/items'.length), body);
    return json(out, out.ok ? 200 : 400);
  }
  const m = /^\/items\/([0-9a-f-]{36})$/.exec(p);
  if (m) return one(request, env, m[1]);
  return null;
}
