// radio.mjs: the live shows kept, so a show heard on /radio can be heard
// again later (asked 2026-10-02: "how to save live input radio to be replayed
// later?", then "2. do it in eccm"). The station is positron's and throws a
// live show away as it plays: a recorder posts one MP3 chunk of about ten
// seconds at a time, and the station's five-minute sweep keeps only the last
// 24 of a slot as bytes (KEEP_SEGS in positron's workers/station/worker.mjs),
// so four minutes after it was heard a chunk is gone. Nothing in positron
// changed for this. Its GET /schedule is public and lists every live slot,
// whether it is open, and every chunk it was sent, so this object reads that
// and copies each chunk it has not seen into this site's bucket before the
// sweep can reach it.
//
// One Durable Object, `Radio`, owns it. Its alarm reads the station every
// 30 s while a live slot is open or a show is being kept, and every 2 min
// otherwise; a chunk lives at least 240 s, so neither pace can miss one. A
// show begins when an open live slot has a chunk this object has not seen,
// and ends when the slot closes or leaves the running order. Then its chunks
// are joined into one MP3, radio/{id}.mp3, with an R2 multipart upload in
// parts of 5 MB, so an hour (about 58 MB) is never held at once. A chunk is
// the encoder's own frames cut on frame boundaries, so chunks set end to end
// are a valid MP3 and nothing is re-encoded. The chunks are deleted after.
//
//   GET /radio/{id}.mp3   a kept show, with ranges so a player can seek
//
// Not done: putting a kept show back into a channel's running order, which
// is a write to the station and needs positron's token.
export const STATION = 'https://positron-station.kristjan-jansen.workers.dev';
const FAST = 30_000, SLOW = 120_000;
const PART = 5 * 1024 * 1024;   // R2's smallest multipart part, the last excepted
const JSON_HEAD = { 'content-type': 'application/json', 'cache-control': 'no-store' };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: JSON_HEAD });
const get = async (url) => { const r = await fetch(url, { headers: { accept: 'application/json' } }); if (!r.ok) throw new Error(`${url} answered ${r.status}`); return r.json(); };

export class Radio {
  constructor(ctx, env) {
    this.ctx = ctx;
    this.env = env;
    this.sql = ctx.storage.sql;
    // status: rec while the slot is open, join once it closed and until the file is whole, done after
    this.sql.exec(`CREATE TABLE IF NOT EXISTS shows (
      id TEXT PRIMARY KEY, channel TEXT NOT NULL, slot TEXT NOT NULL, title TEXT NOT NULL,
      started_at INTEGER NOT NULL, ended_at INTEGER, status TEXT NOT NULL,
      chunks INTEGER NOT NULL DEFAULT 0, missed INTEGER NOT NULL DEFAULT 0, dur REAL NOT NULL DEFAULT 0, bytes INTEGER
    )`);
    // every chunk URI the station has listed and this object has decided on: copied
    // into a show (show set), or passed over, as the chunks of a show that closed
    // before this object was watching, so a slot opened again never takes them
    this.sql.exec(`CREATE TABLE IF NOT EXISTS seen (
      uri TEXT PRIMARY KEY, show TEXT, n INTEGER, dur REAL, bytes INTEGER
    )`);
    // no setAlarm here, as in src/items.mjs: it would replace the alarm about to fire
  }

  // a throwing alarm is retried a few times and then never again, so the read is
  // caught and the alarm set on the way out, whatever happened
  async alarm() {
    let busy = true;
    try { busy = await this.tick(); } catch (e) { console.log(`radio: ${e.message}`); }
    await this.ctx.storage.setAlarm(Date.now() + (busy ? FAST : SLOW));
  }

  async tick() {
    const { channels = [] } = await get(`${STATION}/channels.json`);
    const listed = new Set(), open = new Set(), unanswered = new Set();
    for (const c of channels) {
      const pre = c.default ? '' : `/c/${encodeURIComponent(c.name)}`;
      let s;
      try { s = await get(`${STATION}${pre}/schedule`); } catch (e) { console.log(`radio: ${e.message}`); unanswered.add(c.name); continue; }
      for (const slot of s.slots || []) {
        if (slot.kind !== 'live') continue;
        listed.add(`${c.name}/${slot.key}`);
        if (slot.open) open.add(`${c.name}/${slot.key}`);
        await this.take(c.name, slot, s.live?.[slot.key] || []);
      }
    }
    // a show whose slot closed, or left the running order, is joined; one on a
    // channel that did not answer stays open until it does
    for (const show of [...this.sql.exec(`SELECT * FROM shows WHERE status IN ('rec', 'join')`)]) {
      const k = `${show.channel}/${show.slot}`;
      if (show.status === 'rec' && (open.has(k) || unanswered.has(show.channel))) continue;
      await this.join(show);
    }
    return open.size > 0 || unanswered.size > 0;
  }

  // one live slot's chunk list: the new ones into the open show, or a show begun for them
  async take(channel, slot, list) {
    const fresh = list.filter((e) => ![...this.sql.exec(`SELECT 1 FROM seen WHERE uri = ?`, e.u)].length);
    if (!fresh.length) return;
    let show = [...this.sql.exec(`SELECT * FROM shows WHERE channel = ? AND slot = ? AND status = 'rec'`, channel, slot.key)][0];
    if (!show && !slot.open) {
      for (const e of fresh) this.sql.exec(`INSERT INTO seen (uri) VALUES (?)`, e.u);
      return;
    }
    if (!show) {
      const now = Date.now();
      show = { id: `${slot.key}-${now.toString(36)}`, chunks: 0, missed: 0 };
      this.sql.exec(`INSERT INTO shows (id, channel, slot, title, started_at, status) VALUES (?, ?, ?, ?, ?, 'rec')`,
        show.id, channel, slot.key, slot.title || slot.key, now);
    }
    // in the station's order, which is the order they were heard in
    for (const e of fresh) {
      if (e.x) { this.sql.exec(`INSERT INTO seen (uri, show) VALUES (?, ?)`, e.u, show.id); this.sql.exec(`UPDATE shows SET missed = missed + 1 WHERE id = ?`, show.id); continue; }
      const r = await fetch(`${STATION}${e.u}`);
      // a chunk the sweep took in the moment between the list and the fetch is a gap, said in the row
      if (r.status === 404) { this.sql.exec(`INSERT INTO seen (uri, show) VALUES (?, ?)`, e.u, show.id); this.sql.exec(`UPDATE shows SET missed = missed + 1 WHERE id = ?`, show.id); continue; }
      if (!r.ok) throw new Error(`${e.u} answered ${r.status}`);   // tried again on the next tick
      const bytes = await r.arrayBuffer();
      const n = Number([...this.sql.exec(`SELECT chunks FROM shows WHERE id = ?`, show.id)][0].chunks);
      await this.env.MEDIA.put(partKey(show.id, n), bytes, { httpMetadata: { contentType: 'audio/mpeg' } });
      this.sql.exec(`INSERT INTO seen (uri, show, n, dur, bytes) VALUES (?, ?, ?, ?, ?)`, e.u, show.id, n, Number(e.d) || 0, bytes.byteLength);
      this.sql.exec(`UPDATE shows SET chunks = chunks + 1, dur = dur + ? WHERE id = ?`, Number(e.d) || 0, show.id);
    }
  }

  // the chunks end to end into radio/{id}.mp3, then the chunks deleted; a failure
  // leaves the show at 'join' and the next tick starts the upload again
  async join(show) {
    if (show.status === 'rec') this.sql.exec(`UPDATE shows SET status = 'join', ended_at = ? WHERE id = ?`, Date.now(), show.id);
    const parts = [...this.sql.exec(`SELECT n FROM seen WHERE show = ? AND n IS NOT NULL ORDER BY n`, show.id)].map((r) => partKey(show.id, r.n));
    if (!parts.length) { this.sql.exec(`DELETE FROM shows WHERE id = ?`, show.id); return; }
    const key = fileKey(show.id);
    const meta = { httpMetadata: { contentType: 'audio/mpeg', contentDisposition: `inline; filename="${show.id}.mp3"` } };
    const read = async (k) => { const o = await this.env.MEDIA.get(k); return o ? new Uint8Array(await o.arrayBuffer()) : new Uint8Array(0); };
    const cat = (list) => { const out = new Uint8Array(list.reduce((a, b) => a + b.length, 0)); let i = 0; for (const b of list) { out.set(b, i); i += b.length; } return out; };
    let total = 0;
    const upload = await this.env.MEDIA.createMultipartUpload(key, meta);
    try {
      const done = [];
      let held = [], size = 0;
      for (const k of parts) {
        const b = await read(k);
        held.push(b); size += b.length; total += b.length;
        if (size >= PART) { done.push(await upload.uploadPart(done.length + 1, cat(held))); held = []; size = 0; }
      }
      if (held.length || !done.length) done.push(await upload.uploadPart(done.length + 1, cat(held)));
      await upload.complete(done);
    } catch (e) {
      await upload.abort().catch(() => {});
      throw e;
    }
    for (let i = 0; i < parts.length; i += 1000) await this.env.MEDIA.delete(parts.slice(i, i + 1000));
    this.sql.exec(`UPDATE shows SET status = 'done', bytes = ? WHERE id = ?`, total, show.id);
    console.log(`radio: ${show.id} kept, ${parts.length} chunks, ${total} bytes`);
  }

  async fetch(request) {
    const path = new URL(request.url).pathname;
    // the alarm is started by whoever asks first: the cron, or a visit to /radio
    if ((await this.ctx.storage.getAlarm()) == null) await this.ctx.storage.setAlarm(Date.now() + 1000);
    if (path === '/list') return json({ shows: [...this.sql.exec(`SELECT * FROM shows ORDER BY started_at DESC LIMIT 100`)] });
    if (path === '/tick') return json({ busy: await this.tick() });
    return json({ ok: true });
  }
}

const partKey = (id, n) => `radio/parts/${id}/${String(n).padStart(6, '0')}.mp3`;
const fileKey = (id) => `radio/${id}.mp3`;
const ID = /^\/radio\/([a-z0-9-]+)\.mp3$/;

const radio = (env) => env.RADIO.get(env.RADIO.idFromName('radio'));

// the kept shows for /radio, newest first; the show still on air is listed with no file
export async function radioShows(env) {
  if (!env.RADIO) return [];
  const r = await radio(env).fetch('https://radio/list').catch(() => null);
  return r && r.ok ? (await r.json()).shows : [];
}

// the cron's nudge, so the alarm runs even if nobody opens /radio
export const wakeRadio = (env) => (env.RADIO ? radio(env).fetch('https://radio/wake').catch(() => {}) : Promise.resolve());

// GET /radio/{id}.mp3, with Range, since a player seeks by asking for bytes
export async function serveShow(request, env, path) {
  const m = ID.exec(path);
  if (!m || !env.MEDIA) return null;
  const ranged = request.headers.has('range');
  const obj = await env.MEDIA.get(fileKey(m[1]), ranged ? { range: request.headers } : {});
  if (!obj) return new Response('Not found', { status: 404, headers: { 'cache-control': 'no-store' } });
  const h = new Headers();
  obj.writeHttpMetadata(h);
  h.set('etag', obj.httpEtag);
  h.set('accept-ranges', 'bytes');
  h.set('cache-control', 'public, max-age=31536000, immutable');
  const r = obj.range;
  if (ranged && r && (r.offset !== undefined || r.length !== undefined || r.suffix !== undefined)) {
    const off = r.suffix !== undefined ? obj.size - r.suffix : (r.offset ?? 0);
    const len = r.suffix !== undefined ? r.suffix : (r.length ?? obj.size - off);
    h.set('content-range', `bytes ${off}-${off + len - 1}/${obj.size}`);
    h.set('content-length', String(len));
    return new Response(obj.body, { status: 206, headers: h });
  }
  h.set('content-length', String(obj.size));
  return new Response(obj.body, { headers: h });
}
