// icons.mjs: the raster icons and favicon.ico from public/icons/logo-square.svg,
// rendered by headless Chrome over CDP the way tools/shot.mjs does (same
// launch, same profile discipline, same capture call), and the ICO written in
// plain Node with PNG entries. No new binary is installed: this laptop kills
// binaries it does not know (CLAUDE.md), and Chrome and Node are known.
//   node tools/icons.mjs            # writes public/icons/icon-<n>.png, favicon.ico, and two enlarged looks under tmp/shots/
import { spawn } from 'node:child_process';
import { mkdtemp, rm, writeFile, readFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { svgFor } from './mark.mjs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SIZES = [16, 32, 48, 64, 128, 180, 192, 256, 512];
const ROOT = resolve(import.meta.dirname, '..');
const SVG = join(ROOT, 'public/icons/logo-square.svg');
// under 128 the stave and the joins are dropped: a 1.5 unit line is a smear
// there (asked 2026-09-27: "drop thin lines below 128")
const PLAIN = join(ROOT, 'public/icons/logo-square-plain.svg');
// the stacked alternative, EC over CM, rendered beside the wide one for the
// owner to pick; the ICO stays the wide mark
const STACK = join(ROOT, 'public/icons/logo-stack.svg');
const STACK_PLAIN = join(ROOT, 'public/icons/logo-stack-plain.svg');
const PLAIN_BELOW = 128;
const OUT = join(ROOT, 'public/icons');
const LOOK = join(ROOT, 'tmp/shots');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PROFILE = await mkdtemp(join(tmpdir(), 'eccm-icons-'));
const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${PROFILE}`, '--no-first-run', '--no-default-browser-check', '--disable-gpu', '--mute-audio'], { stdio: ['ignore', 'pipe', 'pipe'] });
chrome.stderr.on('data', () => {});
process.on('exit', () => { try { chrome.kill(); } catch { /* gone */ } });
process.on('SIGINT', () => process.exit(130));
let wsUrl = null, port = null;
for (let i = 0; i < 60 && !wsUrl; i++) {
  await sleep(250);
  try {
    if (!port) port = Number((await readFile(`${PROFILE}/DevToolsActivePort`, 'utf8')).split('\n')[0]);
    if (!Number.isFinite(port) || !port) { port = null; continue; }
    wsUrl = (await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()).webSocketDebuggerUrl;
  } catch { /* not up yet */ }
}
if (!wsUrl) { chrome.kill(); throw new Error('chrome did not come up'); }
const ws = new WebSocket(wsUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let msgId = 0; const pending = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { resolve: ok, reject } = pending.get(m.id); pending.delete(m.id); m.error ? reject(new Error(m.error.message)) : ok(m.result); } };
const S = (method, params = {}) => new Promise((ok, reject) => { const id = ++msgId; pending.set(id, { resolve: ok, reject }); ws.send(JSON.stringify({ id, method, params })); });
const { targetId } = await S('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await S('Target.attachToTarget', { targetId, flatten: true });
const P = (method, params = {}) => new Promise((ok, reject) => { const id = ++msgId; pending.set(id, { resolve: ok, reject }); ws.send(JSON.stringify({ id, method, params, sessionId })); });
await P('Page.enable');

// one page per size: the SVG as an <img> at exactly n by n CSS px on a 1x
// screen, so the raster is the browser's own downscale of the vector. The
// picture travels as a data URI inside a data URI page: a page at a data URL
// is an opaque origin and may not load file:// pictures (MEASURED on the
// first run, nine broken image glyphs)
const svgUrl = `data:image/svg+xml;base64,${(await readFile(SVG)).toString('base64')}`;
const plainUrl = `data:image/svg+xml;base64,${(await readFile(PLAIN)).toString('base64')}`;
const stackUrl = `data:image/svg+xml;base64,${(await readFile(STACK)).toString('base64')}`;
const stackPlainUrl = `data:image/svg+xml;base64,${(await readFile(STACK_PLAIN)).toString('base64')}`;
const written = [];
// each size is its own SVG from tools/mark.mjs, the letters as vectors and
// the hairlines snapped to whole pixels (reported 2026-09-27: the five stave
// lines came out in three shades at 128 and 180); the files under
// public/icons/ stay the general-purpose marks
for (const [prefix, kind] of [['icon', 'square'], ['stack', 'stack']]) for (const n of SIZES) {
  await P('Emulation.setDeviceMetricsOverride', { width: n, height: n, deviceScaleFactor: 1, mobile: false });
  const sized = `data:image/svg+xml;base64,${Buffer.from(svgFor(kind, n, n < PLAIN_BELOW)).toString('base64')}`;
  const html = `<!doctype html><html><head><style>html,body{margin:0;background:#fff}img{display:block}</style></head><body><img src="${sized}" width="${n}" height="${n}"></body></html>`;
  await P('Page.navigate', { url: `data:text/html;charset=utf-8,${encodeURIComponent(html)}` });
  await sleep(300);
  const { data } = await P('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: n, height: n, scale: 1 } });
  const file = join(OUT, `${prefix}-${n}.png`);
  await writeFile(file, Buffer.from(data, 'base64'));
  if (prefix === 'icon') written.push(file);
}
// two enlarged looks: the 16 and the 32 raster at 8x, pixel for pixel
await mkdir(LOOK, { recursive: true });
for (const n of [16, 32]) {
  await P('Emulation.setDeviceMetricsOverride', { width: n * 8 + 32, height: n * 8 + 32, deviceScaleFactor: 1, mobile: false });
  const png = (await readFile(join(OUT, `icon-${n}.png`))).toString('base64');
  const html = `<!doctype html><html><head><style>html,body{margin:0;background:#888}img{display:block;margin:16px;image-rendering:pixelated}</style></head><body><img src="data:image/png;base64,${png}" width="${n * 8}" height="${n * 8}"></body></html>`;
  await P('Page.navigate', { url: `data:text/html;charset=utf-8,${encodeURIComponent(html)}` });
  await sleep(300);
  const { data } = await P('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: n * 8 + 32, height: n * 8 + 32, scale: 1 } });
  await writeFile(join(LOOK, `icon-${n}-x8.png`), Buffer.from(data, 'base64'));
}
ws.close(); chrome.kill();
// Chrome is still writing its profile as it dies, so the removal waits and
// is allowed to fail (MEASURED: ENOTEMPTY on the second run)
await sleep(800); await rm(PROFILE, { recursive: true, force: true }).catch(() => {});

// favicon.ico: a 6 byte header, a 16 byte directory entry per image, then the
// PNG bytes of 16, 32 and 48, which every current reader accepts as entries
const icoSizes = [16, 32, 48];
const pngs = await Promise.all(icoSizes.map((n) => readFile(join(OUT, `icon-${n}.png`))));
const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(icoSizes.length, 4);
const dir = Buffer.alloc(16 * icoSizes.length);
let offset = 6 + dir.length;
icoSizes.forEach((n, i) => {
  const e = i * 16;
  dir.writeUInt8(n === 256 ? 0 : n, e); dir.writeUInt8(n === 256 ? 0 : n, e + 1); dir.writeUInt8(0, e + 2); dir.writeUInt8(0, e + 3);
  dir.writeUInt16LE(1, e + 4); dir.writeUInt16LE(32, e + 6); dir.writeUInt32LE(pngs[i].length, e + 8); dir.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
await writeFile(join(OUT, 'favicon.ico'), Buffer.concat([header, dir, ...pngs]));

// verify by reading back: every PNG's IHDR, and the ICO's directory
const rows = [];
for (const n of SIZES) {
  const b = await readFile(join(OUT, `icon-${n}.png`));
  rows.push({ file: `icon-${n}.png`, width: b.readUInt32BE(16), height: b.readUInt32BE(20), bytes: b.length });
}
const ico = await readFile(join(OUT, 'favicon.ico'));
const count = ico.readUInt16LE(4);
const entries = Array.from({ length: count }, (_, i) => { const e = 6 + i * 16; const w = ico.readUInt8(e) || 256, size = ico.readUInt32LE(e + 8), off = ico.readUInt32LE(e + 12); const png = ico.subarray(off, off + size); return { w, size, off, pngWidth: png.readUInt32BE(16), signature: png.subarray(0, 8).toString('hex') }; });
console.log(JSON.stringify({ rows, ico: { bytes: ico.length, type: ico.readUInt16LE(2), count, entries } }, null, 1));
