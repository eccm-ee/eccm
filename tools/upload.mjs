// upload.mjs: put audio files into the site's uploads/ the way /admin/files does
// (plans/plan-eccm-files.md): /files/open, each 16 MiB piece, /files/close, then
// /admin/files/ingest for its index and record. FILES_TOKEN from the
// environment or .dev.vars; FILES_BASE is the site, local by default.
//
//   node tools/upload.mjs a.mp3 b.wav                          into http://127.0.0.1:8787
//   FILES_BASE=https://eccm-staging.kristjan-jansen.workers.dev node tools/upload.mjs a.mp3
//   --stop-after <n>   send n pieces and stop, to try a resume (the id is printed)
//   --resume <id>      go on with an upload from the pieces that landed
import { readFileSync, statSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const VARS = (() => { try { return readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', '.dev.vars'), 'utf8'); } catch { return ''; } })();
const TOKEN = process.env.FILES_TOKEN || /^FILES_TOKEN=(.+)$/m.exec(VARS)?.[1]?.trim();
const BASE = (process.env.FILES_BASE || 'http://127.0.0.1:8787').replace(/\/$/, '');
const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(`--${k}`); if (i < 0) return null; const v = args[i + 1]; args.splice(i, 2); return v; };
const stopAfter = opt('stop-after'), resume = opt('resume');
if (!TOKEN) { console.error('no FILES_TOKEN in the environment or .dev.vars'); process.exit(2); }

const call = async (path, init = {}) => {
  const r = await fetch(BASE + path, { ...init, headers: { authorization: `Bearer ${TOKEN}`, ...(init.headers || {}) } });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${path} ${r.status}: ${j.error || ''}`);
  return j;
};
const post = (path, body) => call(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

for (const f of args) {
  const size = statSync(f).size, bytes = readFileSync(f);
  let open, done = [];
  if (resume) { open = { id: resume, ...(await call(`/files/show/${resume}`)) }; done = open.done; open.pieceBytes = 16 * 1024 * 1024; }
  else open = await post('/files/open', { name: basename(f), size });
  console.log(`${basename(f)}: ${open.key}, ${open.pieces} pieces, id ${open.id}${done.length ? `, ${done.length} already there` : ''}`);
  let sent = 0;
  for (let n = 0; n < open.pieces; n++) {
    if (done.includes(n)) continue;
    if (stopAfter != null && sent >= Number(stopAfter)) { console.log(`stopped after ${sent} pieces; go on with --resume ${open.id}`); process.exit(0); }
    const r = await call(`/files/piece/${open.id}/${n}`, { method: 'PUT', body: bytes.subarray(n * open.pieceBytes, Math.min(size, (n + 1) * open.pieceBytes)) });
    sent++;
    console.log(`  piece ${n}: ${r.done} of ${r.of}`);
  }
  const closed = await post(`/files/close/${open.id}`, {});
  const ing = await post('/admin/files/ingest', { key: closed.key });
  console.log(`  ${closed.key}, ${closed.bytes} bytes, ${ing.playable ? `${ing.dur} s, ${ing.seg} segments` : 'not MP3'}`);
}
