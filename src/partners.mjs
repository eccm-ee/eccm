// partners.mjs: the partners' logos, asked 2026-11-07: "eccm wants each post
// to contain list of partner logo(s). make a admin page to upload logos (add
// processing like you did for muusikalinn etc), have bw and color optoins.
// allow editing to pick from logos. make it a grid, multiple select. footer
// logos should use same system." The page is Logos, at /edit/partners, behind
// the editor key (src/auth.mjs), upload, edit and delete only: which logos the
// footer draws is the Layout page's to set (asked the same day), from
// partner.in_footer and partner.footer_order (migrations/0014_partners.sql).
//
//   GET  /edit/partners          every logo as a grid, and the form for a new one
//   POST /edit/partners          a new logo
//   GET  /edit/partners/{id}     one logo's form
//   POST /edit/partners/{id}     a save, or with do=delete the row gone
//
// The processing follows public/partners/SOURCE.md. An SVG is kept as
// uploaded, with only what could run or fetch taken out (sanitizeSvg below),
// and its black-and-white version is the same file with every fill and stroke
// set to currentColor. A PNG or JPEG is processed in the editor's browser
// before the form is sent (public/partners.mjs): scaled down to 192 px tall as
// the EU files were, and its black-and-white version made a one-colour mask,
// black on transparent, which the event page draws in the ink with CSS mask
// and the footer draws with the theme's invert, so no white twin is needed.
// The Worker checks every file again by its bytes and stores it in R2 under
// partners/, served at /media/partners/ (src/media.mjs).
import { sniff, size } from './media.mjs';
import { logosPage, logoForm } from './render/partners.mjs';
import { errorPage } from './render/editor.mjs';
import { useFooter } from './render/chrome.mjs';

const HEAD = { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' };
const reply = (body, status = 200) => new Response(String(body), { status, headers: HEAD });
const redirect = (to) => new Response(null, { status: 303, headers: { ...HEAD, location: to } });
const NOW = "strftime('%Y-%m-%dT%H:%M:%SZ','now')";
const MAX = 2 * 1024 * 1024;
const URLISH = /^https?:\/\/\S+$/;
const IMMUTABLE = 'public, max-age=31536000, immutable';
const TYPE = { svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg' };

// ── the SVG sanitizer ───────────────────────────────────────────────────────
// No DOM in a Worker, so a tokenizer: every token is a comment, CDATA, a
// declaration, a processing instruction, a tag or text, and a file with
// anything else is refused rather than guessed at. Elements outside the list
// are dropped with everything inside them (script, foreignObject, image,
// animate and the editors' own namespaces); so are the doctype, which is where
// entities are declared, and every processing instruction but the XML
// declaration, since xml-stylesheet fetches. On the elements kept: no on*
// attribute, an href only to #, no url() but url(#...), no javascript:, and in
// a style no @import. A file that needed none of that is stored byte for byte.
const ELEMENTS = new Set(['svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text', 'tspan', 'textpath',
  'defs', 'use', 'symbol', 'title', 'desc', 'lineargradient', 'radialgradient', 'stop', 'clippath', 'mask', 'pattern', 'style', 'switch']);
const TOKEN = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<!DOCTYPE[^[>]*(?:\[[\s\S]*?\])?\s*>|<\?[\s\S]*?\?>|<\/[A-Za-z][\w:.-]*\s*>|<[A-Za-z][\w:.-]*(?:\s+[\w:.-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'))?)*\s*\/?>|[^<]+/y;
const ATTR = /([\w:.-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g;
const ENTITY = /&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)[^;\s<]*;?/g;
const localName = (n) => n.toLowerCase().replace(/^svg:/, '');
const externalUrl = /url\(\s*(?!['"]?#)[^)]*\)/gi;
const cleanCss = (css) => css.replace(/@import[^;]*;?/gi, '').replace(externalUrl, 'none').replace(/expression\s*\(/gi, '');
const badValue = (v) => /javascript:|data:text|vbscript:/i.test(v.replace(/[\s\0]/g, ''));

// the black-and-white version: every paint a colour or a gradient becomes currentColor, none stays none
const PAINT = new Set(['fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color', 'color']);
const toInk = (v) => (/^\s*none\s*$/i.test(v) ? v : 'currentColor');
const inkCss = (css) => css.replace(/(^|[;{\s])(fill|stroke|stop-color|flood-color|lighting-color)\s*:\s*([^;}!]+)/gi, (m, pre, prop, val) => `${pre}${prop}:${toInk(val)}`);

// returns { svg, width, height } or { error }; bw makes the black-and-white version as it sanitizes
export function sanitizeSvg(text, { bw = false } = {}) {
  text = String(text).replace(/^\uFEFF/, '');
  const out = [];
  let skip = 0, inStyle = false, root = null, i = 0;
  TOKEN.lastIndex = 0;
  while (i < text.length) {
    TOKEN.lastIndex = i;
    const m = TOKEN.exec(text);
    if (!m) return { error: 'This SVG could not be read: it has markup the sanitizer does not know.' };
    const tok = m[0];
    i = TOKEN.lastIndex;
    if (tok.startsWith('<!--')) { if (!skip) out.push(tok); continue; }
    if (tok.startsWith('<![CDATA[')) { if (!skip && inStyle) out.push(`<![CDATA[${bw ? inkCss(cleanCss(tok.slice(9, -3))) : cleanCss(tok.slice(9, -3))}]]>`); continue; }
    if (tok.startsWith('<!')) continue;
    if (tok.startsWith('<?')) { if (/^<\?xml\s/i.test(tok) && !out.length) out.push(tok); continue; }
    if (tok.startsWith('</')) {
      if (skip) { skip--; continue; }
      if (localName(tok.slice(2).replace(/[\s>]/g, '')) === 'style') inStyle = false;
      out.push(tok);
      continue;
    }
    if (tok.startsWith('<')) {
      const selfClosing = /\/\s*>$/.test(tok);
      const name = /^<([\w:.-]+)/.exec(tok)[1];
      if (skip) { if (!selfClosing) skip++; continue; }
      const local = localName(name);
      if (!ELEMENTS.has(local)) { if (!selfClosing) skip = 1; continue; }
      if (!root) { if (local !== 'svg') return { error: 'This file is not an SVG: its first element is not svg.' }; }
      let changed = false;
      const attrs = [];
      for (const a of tok.slice(name.length + 1).replace(/\/?\s*>$/, '').matchAll(ATTR)) {
        const an = a[1], lower = an.toLowerCase();
        let v = a[2] ?? a[3] ?? '';
        if (lower.startsWith('on') || badValue(v)) { changed = true; continue; }
        if ((lower === 'href' || lower === 'xlink:href') && !v.trim().startsWith('#')) { changed = true; continue; }
        if (lower === 'style') { const c = bw ? inkCss(cleanCss(v)) : cleanCss(v); if (c !== v) { v = c; changed = true; } }
        else if (externalUrl.test(v)) { externalUrl.lastIndex = 0; v = v.replace(externalUrl, 'none'); changed = true; }
        externalUrl.lastIndex = 0;
        if (bw && PAINT.has(lower) && toInk(v) !== v) { v = toInk(v); changed = true; }
        attrs.push([an, v]);
      }
      if (!root) {
        root = Object.fromEntries(attrs.map(([k, v]) => [k.toLowerCase(), v]));
        // an SVG with a size and no viewBox cannot scale in an img, so it is given the viewBox its size implies
        if (!root.viewbox && parseFloat(root.width) > 0 && parseFloat(root.height) > 0) { attrs.push(['viewBox', `0 0 ${parseFloat(root.width)} ${parseFloat(root.height)}`]); root.viewbox = attrs.at(-1)[1]; changed = true; }
      }
      if (local === 'style' && !selfClosing) inStyle = true;
      out.push(changed ? `<${name}${attrs.map(([k, v]) => ` ${k}="${v.replace(/"/g, '&quot;')}"`).join('')}${selfClosing ? '/>' : '>'}` : tok);
      continue;
    }
    if (skip) continue;
    out.push(inStyle ? (bw ? inkCss(cleanCss(tok)) : cleanCss(tok)) : tok.replace(ENTITY, ''));
  }
  if (!root) return { error: 'This file is not an SVG.' };
  const vb = String(root.viewbox || '').trim().split(/[\s,]+/).map(Number);
  const width = Math.round(vb.length === 4 && vb[2] > 0 ? vb[2] : parseFloat(root.width));
  const height = Math.round(vb.length === 4 && vb[3] > 0 ? vb[3] : parseFloat(root.height));
  if (!(width > 0 && height > 0)) return { error: 'This SVG has neither a viewBox nor a width and height, so its shape is unknown.' };
  return { svg: out.join(''), width, height };
}

// ── storing a file ──────────────────────────────────────────────────────────
const sha = async (bytes) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map((x) => x.toString(16).padStart(2, '0')).join('');
const isSvg = (bytes) => /^\s*(?:<\?xml[\s\S]*?\?>\s*)?(?:<!--[\s\S]*?-->\s*|<!DOCTYPE[^[>]*(?:\[[\s\S]*?\])?\s*>\s*)*<svg[\s>]/i.test(new TextDecoder().decode(bytes.slice(0, 4096)).replace(/^\uFEFF/, ''));

async function put(env, bytes, ext) {
  const key = `partners/${await sha(bytes)}.${ext}`;
  if (!(await env.MEDIA.head(key))) await env.MEDIA.put(key, bytes, { httpMetadata: { contentType: TYPE[ext], cacheControl: IMMUTABLE } });
  return `/media/${key}`;
}

// one file from the form: { src, width, height, svg } with the sanitized text when it is an SVG, or { error }
async function store(env, file, what, { bw = false } = {}) {
  if (!env.MEDIA) return { error: 'Logo storage is not connected (the R2 binding MEDIA is missing).' };
  if (file.size > MAX) return { error: `The ${what} file is ${(file.size / 1048576).toFixed(1)} MB, the most allowed is 2 MB.` };
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (isSvg(bytes)) {
    const s = sanitizeSvg(new TextDecoder().decode(bytes), { bw });
    if (s.error) return { error: `The ${what} file: ${s.error}` };
    return { src: await put(env, new TextEncoder().encode(s.svg), 'svg'), width: s.width, height: s.height, svg: s.svg };
  }
  const ext = sniff(bytes);
  if (ext !== 'png' && ext !== 'jpg') return { error: `The ${what} file is not an SVG, PNG or JPEG.` };
  const dims = size(ext, bytes);
  if (!dims || !dims.width || !dims.height) return { error: `Could not read the size of the ${what} file.` };
  return { src: await put(env, bytes, ext), width: dims.width, height: dims.height };
}
const given = (f) => f && typeof f === 'object' && f.size > 0;

// ── reading rows ────────────────────────────────────────────────────────────
export const allPartners = async (db) => (await db.prepare('SELECT * FROM partner ORDER BY name COLLATE NOCASE, lang').all()).results;
// an event's logos in a language, in the event's order, each with the version the event draws it in
export const eventPartners = async (db, eventId, lang) => (await db.prepare(`SELECT p.*, ep.version FROM event_partner ep JOIN partner p ON p.id = ep.partner_id
  WHERE ep.event_id = ? AND (p.lang IS NULL OR p.lang = ?) ORDER BY ep.position`).bind(eventId, lang).all()).results;

// the footer's logos, read once a minute per isolate rather than on every page, and at once after a save
// here; a database without the table (migration 0014 not applied) keeps the footer's static markup
let footer = { at: 0, rows: null };
export const resetFooter = () => { footer = { at: 0, rows: null }; };
export async function loadFooter(env) {
  if (Date.now() - footer.at > 60000) {
    try { footer = { at: Date.now(), rows: (await env.DB.prepare('SELECT * FROM partner WHERE in_footer = 1 ORDER BY footer_order, id').all()).results }; }
    catch { footer = { at: Date.now(), rows: null }; }
  }
  useFooter(footer.rows);
}

// ── the routes ──────────────────────────────────────────────────────────────
const blank = () => ({ name: '', url: '', lang: '' });
const values = (fd) => ({ name: String(fd.get('name') ?? '').trim(), url: String(fd.get('url') ?? '').trim(), lang: ['et', 'en'].includes(fd.get('lang')) ? fd.get('lang') : '' });
const check = (v) => {
  const errors = [];
  if (!v.name) errors.push({ field: 'name', msg: 'Name is empty. It is the text a reader who cannot see the logo hears.' });
  if (v.url && !URLISH.test(v.url)) errors.push({ field: 'url', msg: 'The link starts with https:// or http://.' });
  return errors;
};
const uses = async (db) => Object.fromEntries((await db.prepare('SELECT partner_id, COUNT(*) AS n FROM event_partner GROUP BY partner_id').all()).results.map((r) => [r.partner_id, r.n]));

// the three files of a save: the colour file, and the black-and-white one given or else derived from the
// colour file (an SVG with its paints set to currentColor, a raster the mask the browser made, sent as
// bw_auto, and without script the colour file itself, whose shape is then the mask); the dark file only
// when given. A row being edited keeps every file the form did not replace
async function files(env, fd, row) {
  const errors = [], out = {};
  const color = fd.get('color_file'), own = null, auto = fd.get('bw_auto'), dark = null;
  if (given(color)) {
    const c = await store(env, color, 'colour');
    if (c.error) errors.push({ field: 'color_file', msg: c.error });
    else {
      Object.assign(out, { color_src: c.src, color_w: c.width, color_h: c.height });
      if (!given(own)) {
        let b;
        if (c.svg) b = await store(env, new Blob([c.svg]), 'black and white', { bw: true });
        else if (given(auto)) b = await store(env, auto, 'black and white');
        else b = { src: c.src, width: c.width, height: c.height };
        if (b.error) errors.push({ field: 'bw_file', msg: b.error });
        else Object.assign(out, { bw_src: b.src, bw_w: b.width, bw_h: b.height });
      }
    }
  } else if (!row) errors.push({ field: 'color_file', msg: 'No logo file chosen.' });
  if (given(own)) {
    const b = await store(env, own, 'black and white', { bw: true });
    if (b.error) errors.push({ field: 'bw_file', msg: b.error });
    else Object.assign(out, { bw_src: b.src, bw_w: b.width, bw_h: b.height });
  }
  if (given(dark)) {
    const d = await store(env, dark, 'dark ground');
    if (d.error) errors.push({ field: 'dark_file', msg: d.error });
    else out.dark_src = d.src;
  }
  // the two fields for an own black-and-white file and a dark-ground file went 2026-11-07 ("2 drop fields"); a replaced logo drops its old negative
  if (given(color)) out.dark_src = null;
  return { errors, out };
}

// an uploaded object no row names any more goes from R2; a seeded file under public/ is never touched
async function sweep(env, srcs) {
  for (const src of new Set(srcs.filter((s) => s && s.startsWith('/media/partners/')))) {
    const still = await env.DB.prepare('SELECT 1 FROM partner WHERE color_src = ?1 OR bw_src = ?1 OR dark_src = ?1 LIMIT 1').bind(src).first();
    if (!still && env.MEDIA) await env.MEDIA.delete(src.slice('/media/'.length));
  }
}

async function list(request, env) {
  const db = env.DB;
  if (request.method !== 'POST') return reply(logosPage({ partners: await allPartners(db), uses: await uses(db), v: blank() }));
  const fd = await request.formData();
  const v = values(fd);
  const errors = check(v);
  const f = await files(env, fd, null);
  errors.push(...f.errors);
  if (errors.length) return reply(logosPage({ partners: await allPartners(db), uses: await uses(db), v, errors }), 422);
  const o = f.out;
  await db.prepare('INSERT INTO partner (name, url, lang, color_src, color_w, color_h, dark_src, bw_src, bw_w, bw_h) VALUES (?,?,?,?,?,?,?,?,?,?)')
    .bind(v.name, v.url, v.lang || null, o.color_src, o.color_w, o.color_h, o.dark_src ?? null, o.bw_src, o.bw_w, o.bw_h).run();
  return redirect('/edit/partners');
}

async function one(request, env, id) {
  const db = env.DB;
  const row = await db.prepare('SELECT * FROM partner WHERE id = ?').bind(id).first();
  if (!row) return reply(errorPage({ status: 404, reason: 'logo' }), 404);
  const n = (await uses(db))[id] || 0;
  if (request.method !== 'POST') return reply(logoForm({ row, v: { name: row.name, url: row.url, lang: row.lang || '' }, uses: n }));
  const fd = await request.formData();
  if (fd.get('do') === 'delete') {
    await db.prepare('DELETE FROM partner WHERE id = ?').bind(id).run();
    await sweep(env, [row.color_src, row.bw_src, row.dark_src]);
    resetFooter();
    return redirect('/edit/partners');
  }
  const v = values(fd);
  const errors = check(v);
  const f = await files(env, fd, row);
  errors.push(...f.errors);
  if (errors.length) return reply(logoForm({ row, v, errors, uses: n }), 422);
  const next = { ...row, ...f.out };
  await db.prepare(`UPDATE partner SET name = ?, url = ?, lang = ?, color_src = ?, color_w = ?, color_h = ?, dark_src = ?, bw_src = ?, bw_w = ?, bw_h = ?, updated_at = ${NOW} WHERE id = ?`)
    .bind(v.name, v.url, v.lang || null, next.color_src, next.color_w, next.color_h, next.dark_src ?? null, next.bw_src, next.bw_w, next.bw_h, id).run();
  await sweep(env, [row.color_src, row.bw_src, row.dark_src].filter((s) => ![next.color_src, next.bw_src, next.dark_src].includes(s)));
  resetFooter();
  return redirect('/edit/partners');
}

export async function partners(request, env, url) {
  const p = url.pathname.replace(/\/$/, '');
  try {
    if (p === '/edit/partners') return list(request, env);
    const m = /^\/edit\/partners\/(\d+)$/.exec(p);
    if (m) return one(request, env, +m[1]);
    return null;
  } catch (e) {
    console.error('partners', e && e.message);
    return reply(errorPage({ status: 500 }), 500);
  }
}
