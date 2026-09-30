// tools/scheme.mjs: reads every picture in the media table with the detector
// in public/scheme.mjs, the same module derive.html and the editor run, and
// writes one UPDATE per row to data/seed-step5-schemes.sql. Session 3 of
// plans/plan-eccm-cms-step-1.md, written 2026-09-30 when the upload arrived
// ("implement image upload and apply detection ... on current content").
//
//   node tools/scheme.mjs            # the keys from the local database
//   node tools/scheme.mjs --remote   # the keys from eccm-staging on Cloudflare
//
// then apply the file the same way as a seed, --local or --remote. A picture
// is read from public/ through a small server of this script's own, in
// headless Chrome, which posts what it read back to that server, so no dev server has to be up. Keys under
// media/ are uploads: the editor read those in the editor's browser before
// the save, and they are skipped here.
import { createServer } from 'node:http';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { execFileSync, spawn } from 'node:child_process';
import { extname, join, normalize } from 'node:path';
import { tmpdir } from 'node:os';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PUBLIC = new URL('../public/', import.meta.url).pathname;
const OUT = new URL('../data/seed-step5-schemes.sql', import.meta.url).pathname;
const where = process.argv.includes('--remote') ? '--remote' : '--local';
// derive.html's serifByHand: the Gestures letters lie on a dark disc under
// three rules and the detector finds no type in them
const HAND = { 'ic_large_w900h600q100_gestures-situations-small.jpg': { serif: true } };

const q = (sql) => JSON.parse(execFileSync('npx', ['wrangler', 'd1', 'execute', 'eccm-staging', where, '--env', 'staging', '--json', '--command', sql], { encoding: 'utf8', env: { ...process.env, CF_API_TOKEN: '', CLOUDFLARE_API_TOKEN: '' } }))[0].results;
// --keys a.jpg,b.png reads those files and writes nothing, for a probe
const probe = process.argv.includes('--keys') ? process.argv[process.argv.indexOf('--keys') + 1].split(',') : null;
const rows = probe ? probe.map((key, i) => ({ id: i, key })) : q('SELECT id, key FROM media ORDER BY id').filter((r) => !r.key.startsWith('media/'));

const PAGE = `<!doctype html><meta charset="utf-8"><script type="module">
import { read, contract } from '/scheme.mjs';
const rows = ${JSON.stringify(rows.map((r) => ({ ...r, hand: HAND[r.key] || {} })))};
const out = [];
for (const r of rows) {
  const img = new Image(); img.src = '/' + r.key;
  try { await img.decode(); const { r: c, t, s } = read(img, r.hand); out.push({ id: r.id, key: r.key, scheme: contract(c, t, s) }); }
  catch (e) { out.push({ id: r.id, key: r.key, error: String(e) }); }
}
await fetch('/done', { method: 'POST', body: JSON.stringify(out) });
</script>`;
const TYPES = { '.mjs': 'text/javascript', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' };
let done;
const posted = new Promise((r) => { done = r; });
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (path === '/done') { let b = ''; for await (const c of req) b += c; res.end(); return done(JSON.parse(b)); }
  if (path === '/') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(PAGE); }
  try { const body = await readFile(join(PUBLIC, normalize(path))); res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'application/octet-stream' }); res.end(body); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/`;
// Chrome in a profile of its own, killed once the page has posted what it read
const profile = await mkdtemp(join(tmpdir(), 'eccm-scheme-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', `--user-data-dir=${profile}`, url], { stdio: 'ignore' });
const timer = setTimeout(() => { console.error('the page did not post within 60 s'); chrome.kill(); process.exit(1); }, 60000);
const results = await posted;
clearTimeout(timer); chrome.kill(); server.close();
await rm(profile, { recursive: true, force: true }).catch(() => {});
const sqlText = (s) => `'${s.replace(/'/g, "''")}'`;
const lines = results.filter((x) => x.scheme).map((x) => `UPDATE media SET scheme = ${sqlText(JSON.stringify(x.scheme))}, scheme_v = ${x.scheme.v} WHERE id = ${x.id} AND key = ${sqlText(x.key)};`);
if (!probe) await writeFile(OUT, `-- seed-step5-schemes.sql: the derived scheme of every picture in public/, written by\n-- tools/scheme.mjs on ${new Date().toISOString().slice(0, 10)} from the ${where.slice(2)} database; apply after the four seeds.\n${lines.join('\n')}\n`);
for (const x of results) console.log(x.error ? `${x.id} ${x.key}: ${x.error}` : `${x.id} ${x.scheme.mode} ground ${x.scheme.ground} accent ${x.scheme.accent ?? 'none'} ${x.scheme.serif ? 'serif' : 'sans'} (${x.scheme.readings.type.verdict})`);
console.log(probe ? `${results.length} read, nothing written` : `${lines.length} of ${results.length} rows written to data/seed-step5-schemes.sql`);
