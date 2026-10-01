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
//   GET  /items/key          the public VAPID key a browser subscribes with (public/push.mjs)
//
// Open like the editor: nobody logs in (src/editor.mjs says since when).
import { send } from './push.mjs';
import { renderItems } from './render/items.mjs';

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
    // no setAlarm here: on a cold wake the constructor runs before alarm(),
    // and setting one here replaces the alarm that is about to fire
    // (positron's workers/items, where Cloudflare's livelock is described)
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
    const message = { id: row.id, title: row.title, body: row.body, url: row.url || '/items' };
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
    const body = await request.json().catch(() => null);
    if (!body) return json({ error: 'body must be JSON' }, 400);
    if (path === '/add') {
      const now = Date.now();
      this.sql.exec(`INSERT INTO items (id, title, body, url, status, publish_at, created_at) VALUES (?, ?, ?, ?, 'waiting', ?, ?)`,
        crypto.randomUUID(), body.title, body.body || '', body.url || '', Math.max(Number(body.publish_at) || now, now), now);
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
const ask = async (env, path, body) => (await store(env).fetch(`https://items${path}`, body === undefined ? {} : { method: 'POST', body: JSON.stringify(body) })).json();

const page = async (env, form = {}, errors = [], status = 200) => {
  const { items, subs } = await ask(env, '/list');
  return new Response(renderItems({ items, subs, form, errors }), { status, headers: HEAD });
};

export async function itemsRoute(request, env, url) {
  const p = url.pathname.replace(/\/$/, '');
  if (p === '/items' && request.method === 'GET') return page(env);
  if (p === '/items/key') return json({ key: env.VAPID_PUBLIC || null });
  if (p === '/items' && request.method === 'POST') {
    const f = Object.fromEntries([...(await request.formData())].map(([k, v]) => [k, String(v).trim()]));
    const errors = [];
    if (!f.title) errors.push({ field: 'title', msg: 'Pealkiri on puudu.' });
    if (f.title.length > 120) errors.push({ field: 'title', msg: 'Pealkiri on pikem kui 120 märki.' });
    if (f.url && !/^(https?:\/\/\S+|\/\S*)$/.test(f.url)) errors.push({ field: 'url', msg: 'Link algab https:// või kaldkriipsuga.' });
    if (f.publish_at && !LOCAL.test(f.publish_at)) errors.push({ field: 'publish_at', msg: 'Aeg on vigane.' });
    if (errors.length) return page(env, f, errors, 400);
    await ask(env, '/add', { title: f.title, body: f.body, url: f.url, publish_at: f.publish_at ? tallinnMs(f.publish_at) : Date.now() });
    return new Response(null, { status: 303, headers: { ...HEAD, location: '/items' } });
  }
  if ((p === '/items/subscribe' || p === '/items/unsubscribe') && request.method === 'POST') {
    const body = await request.json().catch(() => null);
    if (!body) return json({ error: 'body must be JSON' }, 400);
    const out = await ask(env, p.slice('/items'.length), body);
    return json(out, out.ok ? 200 : 400);
  }
  return null;
}
