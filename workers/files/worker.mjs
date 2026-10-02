// eccm-files: audio into the files bucket in pieces (plans/plan-eccm-files.md,
// asked 2026-10-02: "what about creating a eccm-files worker and admin/files
// paeg and mimick crate/vain"). The protocol is positron's workers/vain, read
// that day: a file travels in pieces of exactly 16 MiB because a Worker takes
// at most 100 MB in one request on this zone's plan, whichever Worker it is,
// and R2's multipart upload refuses parts of uneven size, so a wrong-sized
// piece is refused when it arrives and not after the last one.
//
// It is its own Worker so an upload in flight cannot stop the site or the
// station, and a site deploy cannot cut an upload in half. The site reaches it
// through a service binding and forwards /files/* unchanged, so the page and
// these routes share an origin.
//
//   GET  /files/limits                      the caps and the piece size
//   POST /files/open     {name, size, type}  -> {id, key, pieceBytes, pieces}
//   PUT  /files/piece/<id>/<n>              one piece -> {n, done, of}
//   GET  /files/show/<id>                   an upload in flight, for a resume -> {done: [n...]}
//   POST /files/close/<id>                  -> {key, bytes}
//   POST /files/abort/<id>                  -> {ok}
//
// Writes need the bearer token FILES_TOKEN, the same value the site holds; the
// page asks for it once. Reading the files back is the station's /stream/media/,
// which already answers ranges. What a file is called and who made it is the
// station's record of it (its Library), written by the site after a close, so
// there is one place a title lives and no meta.json beside the bytes.
//
// Not carried over from vain: its sandbox tier and hourly cron (crate was a
// public demo, this is an admin page), positron's date model, and the
// per-address accounting.

const PIECE = 16 * 1024 * 1024;
const CAPS = { maxFileBytes: 500 * 1024 * 1024, maxBytesPerHour: 4 * 1024 * 1024 * 1024, maxUploadsPerHour: 40 };
const DIR = 'uploads/';

// the extension picks the format and the first bytes of piece 0 must agree
const tag = (b, i) => (i + 4 > b.length ? '' : String.fromCharCode(b[i], b[i + 1], b[i + 2], b[i + 3]));
const FORMATS = {
  mp3: { type: 'audio/mpeg', sniff: (b) => tag(b, 0).startsWith('ID3') || (b[0] === 0xff && (b[1] & 0xe0) === 0xe0) },
  wav: { type: 'audio/wav', sniff: (b) => tag(b, 0) === 'RIFF' && tag(b, 8) === 'WAVE' },
  flac: { type: 'audio/flac', sniff: (b) => tag(b, 0) === 'fLaC' },
  ogg: { type: 'audio/ogg', sniff: (b) => tag(b, 0) === 'OggS' },
  opus: { type: 'audio/ogg', sniff: (b) => tag(b, 0) === 'OggS' },
  m4a: { type: 'audio/mp4', sniff: (b) => tag(b, 4) === 'ftyp' },
};
const hex4 = (b) => [...b.slice(0, 4)].map((x) => x.toString(16).padStart(2, '0')).join(' ');

const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

// constant-time-ish, as vain's tierOf: a length check, then every character
export function admitted(request, env) {
  const secret = env.FILES_TOKEN, auth = request.headers.get('authorization') || '';
  if (!secret || !auth.startsWith('Bearer ')) return false;
  const given = auth.slice(7);
  if (given.length !== secret.length) return false;
  let diff = 0;
  for (let i = 0; i < secret.length; i++) diff |= given.charCodeAt(i) ^ secret.charCodeAt(i);
  return diff === 0;
}

// a name a person can read in a key: lower case, a to z, digits and hyphens, its extension kept
const slug = (name) => {
  const m = /^(.*?)(?:\.([a-z0-9]+))?$/i.exec(String(name).trim());
  const base = m[1].normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'file';
  return { base, ext: (m[2] || '').toLowerCase() };
};

// One object holds every upload in flight, so the caps are counted in one
// place and a resumed upload knows which pieces landed (vain's Uploads).
export class Uploads {
  constructor(ctx, env) {
    this.ctx = ctx; this.env = env; this.sql = ctx.storage.sql;
    this.sql.exec(`CREATE TABLE IF NOT EXISTS uploads (
      id TEXT PRIMARY KEY, key TEXT NOT NULL, upload_id TEXT NOT NULL, size INTEGER NOT NULL,
      pieces INTEGER NOT NULL, type TEXT NOT NULL, ext TEXT NOT NULL, opened_at INTEGER NOT NULL, closed_at INTEGER
    )`);
    this.sql.exec(`CREATE TABLE IF NOT EXISTS parts (id TEXT NOT NULL, n INTEGER NOT NULL, etag TEXT NOT NULL, PRIMARY KEY (id, n))`);
  }

  async fetch(request) {
    const op = new URL(request.url).pathname;
    const body = await request.json();
    const one = (id) => [...this.sql.exec(`SELECT * FROM uploads WHERE id = ? AND closed_at IS NULL`, id)][0];
    if (op === '/open') {
      const hour = Date.now() - 3600_000;
      const used = [...this.sql.exec(`SELECT COUNT(*) AS n, COALESCE(SUM(size), 0) AS bytes FROM uploads WHERE opened_at > ?`, hour)][0];
      if (Number(used.n) >= CAPS.maxUploadsPerHour) return json({ error: `${CAPS.maxUploadsPerHour} uploads an hour is the most; wait a little` }, 429);
      if (Number(used.bytes) + body.size > CAPS.maxBytesPerHour) return json({ error: 'over the 4 GB an hour; wait a little' }, 429);
      // the first free name: the file's own, then -2, -3, against what is stored and what is on its way
      let key = `${DIR}${body.base}.${body.ext}`;
      for (let i = 2; (await this.env.FILES.head(key)) || [...this.sql.exec(`SELECT 1 FROM uploads WHERE key = ? AND closed_at IS NULL`, key)].length; i++) key = `${DIR}${body.base}-${i}.${body.ext}`;
      const up = await this.env.FILES.createMultipartUpload(key, { httpMetadata: { contentType: body.type } });
      const id = crypto.randomUUID();
      this.sql.exec(`INSERT INTO uploads (id, key, upload_id, size, pieces, type, ext, opened_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        id, key, up.uploadId, body.size, Math.max(1, Math.ceil(body.size / PIECE)), body.type, body.ext, Date.now());
      return json({ id, key, pieceBytes: PIECE, pieces: Math.max(1, Math.ceil(body.size / PIECE)) });
    }
    const u = one(body.id);
    if (!u) return json({ error: 'no such upload in flight' }, 404);
    if (op === '/part') {
      this.sql.exec(`INSERT OR REPLACE INTO parts (id, n, etag) VALUES (?, ?, ?)`, u.id, body.n, body.etag);
      return json({ ok: true });
    }
    const done = [...this.sql.exec(`SELECT n, etag FROM parts WHERE id = ? ORDER BY n`, u.id)];
    if (op === '/get') return json({ ...u, done: done.map((p) => Number(p.n)), parts: done });
    if (op === '/closed') { this.sql.exec(`UPDATE uploads SET closed_at = ? WHERE id = ?`, Date.now(), u.id); this.sql.exec(`DELETE FROM parts WHERE id = ?`, u.id); return json({ ok: true }); }
    return json({ error: 'no such op' }, 404);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname.replace(/^\/files/, '');
    const desk = env.UPLOADS.get(env.UPLOADS.idFromName('uploads'));
    const ask = async (op, body) => { const r = await desk.fetch(`https://uploads${op}`, { method: 'POST', body: JSON.stringify(body) }); return [r.status, await r.json()]; };

    if (p === '/limits') return json({ pieceBytes: PIECE, ...CAPS, formats: Object.keys(FORMATS) });
    if (!admitted(request, env)) return json({ error: env.FILES_TOKEN ? 'the upload key is wrong' : 'no FILES_TOKEN is set' }, env.FILES_TOKEN ? 401 : 503);

    if (p === '/open' && request.method === 'POST') {
      const b = await request.json().catch(() => ({}));
      const { base, ext } = slug(b.name || '');
      const f = FORMATS[ext];
      if (!f) return json({ error: `.${ext || '?'} is not one of ${Object.keys(FORMATS).join(', ')}` }, 415);
      const size = Number(b.size);
      if (!(size > 0)) return json({ error: 'the size is a number of bytes' }, 400);
      if (size > CAPS.maxFileBytes) return json({ error: `${Math.round(size / 1048576)} MB is over the 500 MB a file` }, 413);
      const [status, out] = await ask('/open', { base, ext, size, type: f.type });
      return json(out, status);
    }

    let m = /^\/piece\/([0-9a-f-]+)\/(\d+)$/.exec(p);
    if (m && request.method === 'PUT') {
      const [, id, ns] = m, n = Number(ns);
      const [st, u] = await ask('/get', { id });
      if (st !== 200) return json(u, st);
      if (n >= u.pieces) return json({ error: `piece ${n} of ${u.pieces}` }, 400);
      const bytes = new Uint8Array(await request.arrayBuffer());
      const want = n < u.pieces - 1 ? PIECE : u.size - PIECE * (u.pieces - 1);
      if (bytes.length !== want) return json({ error: `piece ${n} is ${bytes.length} bytes and has to be ${want}` }, 400);
      // a file that is not what its name says is refused and its upload ended, so its name is free again
      if (n === 0 && !FORMATS[u.ext].sniff(bytes)) {
        await env.FILES.resumeMultipartUpload(u.key, u.upload_id).abort().catch(() => {});
        await ask('/closed', { id });
        return json({ error: `this does not start like a .${u.ext} file: its first bytes are ${hex4(bytes)}` }, 415);
      }
      const part = await env.FILES.resumeMultipartUpload(u.key, u.upload_id).uploadPart(n + 1, bytes);
      await ask('/part', { id, n, etag: part.etag });
      return json({ n, done: u.done.length + (u.done.includes(n) ? 0 : 1), of: u.pieces });
    }

    m = /^\/show\/([0-9a-f-]+)$/.exec(p);
    if (m) { const [st, u] = await ask('/get', { id: m[1] }); return json(st === 200 ? { key: u.key, pieces: u.pieces, done: u.done } : u, st); }

    m = /^\/close\/([0-9a-f-]+)$/.exec(p);
    if (m && request.method === 'POST') {
      const [st, u] = await ask('/get', { id: m[1] });
      if (st !== 200) return json(u, st);
      if (u.done.length !== u.pieces) return json({ error: `${u.done.length} of ${u.pieces} pieces have arrived`, done: u.done }, 409);
      const obj = await env.FILES.resumeMultipartUpload(u.key, u.upload_id).complete(u.parts.map((x) => ({ partNumber: Number(x.n) + 1, etag: x.etag })));
      await ask('/closed', { id: u.id });
      return json({ key: u.key, bytes: obj.size });
    }

    m = /^\/abort\/([0-9a-f-]+)$/.exec(p);
    if (m && request.method === 'POST') {
      const [st, u] = await ask('/get', { id: m[1] });
      if (st !== 200) return json(u, st);
      await env.FILES.resumeMultipartUpload(u.key, u.upload_id).abort().catch(() => {});
      await ask('/closed', { id: u.id });
      return json({ ok: true });
    }

    return json({ error: 'no such route', path: url.pathname }, 404);
  },
};
