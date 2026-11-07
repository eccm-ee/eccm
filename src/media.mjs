// media.mjs: the pictures an editor uploads, asked 2026-09-30 as "implement
// image upload". One original per picture in the R2 bucket bound as MEDIA,
// keyed by the sha256 of its bytes with its extension, so the same file
// uploaded twice is one object and one media row (plans/plan-eccm-images.md
// sections 4 and 5). Nothing is resized here: the width and height are read
// from the file's own header, and the scheme comes from the editor's browser,
// which read the picture with public/scheme.mjs before the form was sent.
// Renditions through /cdn-cgi/image/ wait for Image Transformations on the
// zone (the images plan, section 7).

const TYPES = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' };
export const MAX_BYTES = 10 * 1024 * 1024;

// the format from the first bytes, never from the name or the browser's word
const sniff = (b) => {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg';
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'png';
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return 'gif';
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'webp';
  return null;
};

// width and height from the header of each of the four formats
const size = (ext, b) => {
  const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  if (ext === 'png') return { width: v.getUint32(16), height: v.getUint32(20) };
  if (ext === 'gif') return { width: v.getUint16(6, true), height: v.getUint16(8, true) };
  if (ext === 'webp') {
    const chunk = String.fromCharCode(b[12], b[13], b[14], b[15]);
    if (chunk === 'VP8 ') return { width: v.getUint16(26, true) & 0x3fff, height: v.getUint16(28, true) & 0x3fff };
    if (chunk === 'VP8L') { const n = v.getUint32(21, true); return { width: (n & 0x3fff) + 1, height: ((n >> 14) & 0x3fff) + 1 }; }
    if (chunk === 'VP8X') return { width: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)), height: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)) };
    return null;
  }
  // a JPEG: walk the segments to the first start-of-frame
  for (let i = 2; i + 9 < b.length;) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { width: v.getUint16(i + 7), height: v.getUint16(i + 5) };
    if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { i += 2; continue; }
    i += 2 + v.getUint16(i + 2);
  }
  return null;
};

// the file from the form into R2 and a media row; returns { row } or
// { error } in words. scheme is the JSON the editor's browser read, already
// checked by cleanScheme, or null; a row that exists keeps the scheme it has
// unless it had none
export async function storeUpload(env, file, scheme, alt) {
  if (!env.MEDIA) return { error: 'Picture storage is not connected (the R2 binding MEDIA is missing).' };
  if (file.size > MAX_BYTES) return { error: `The picture is ${Math.round(file.size / 1048576)} MB, the most allowed is 10 MB.` };
  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = sniff(bytes);
  if (!ext) return { error: 'This file is not a JPEG, PNG, WebP or GIF.' };
  const dims = size(ext, bytes);
  if (!dims || !dims.width || !dims.height) return { error: 'Could not read the picture size from the file.' };
  const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map((x) => x.toString(16).padStart(2, '0')).join('');
  const key = `media/${hash}.${ext}`;
  if (!(await env.MEDIA.head(key))) await env.MEDIA.put(key, bytes, { httpMetadata: { contentType: TYPES[ext], cacheControl: 'public, max-age=31536000, immutable' } });
  const row = await env.DB.prepare(`INSERT INTO media (key, width, height, bytes, alt_et, alt_en, scheme, scheme_v) VALUES (?,?,?,?,?,?,?,?)
    ON CONFLICT (key) DO UPDATE SET scheme = COALESCE(media.scheme, excluded.scheme), scheme_v = COALESCE(media.scheme_v, excluded.scheme_v), bytes = excluded.bytes
    RETURNING *`).bind(key, dims.width, dims.height, bytes.length, alt.et, alt.en, scheme, scheme ? JSON.parse(scheme).v : null).first();
  return { row };
}

// GET /media/yt/{id}.jpg: a YouTube video's picture for the player in
// src/render/md.mjs, trip's /yt/{id}.jpg (astro-prod/src/pages/yt/[id].jpg.ts,
// read 2026-10-07). The Worker fetches i.ytimg.com once and keeps the bytes in
// R2 under yt/{id}.jpg, so a visitor's browser never asks Google for it. The
// 1280 px picture when YouTube has one (a missing one is a tiny grey stand-in,
// hence the size floor), else the 480 px one every video has; a miss is a 404
// that is never cached, so a bad id cannot stick.
const YT = /^\/media\/yt\/([A-Za-z0-9_-]{11})\.jpg$/;
const IMMUTABLE = 'public, max-age=31536000, immutable';
async function ytThumb(env, id) {
  const key = `yt/${id}.jpg`;
  const hit = env.MEDIA ? await env.MEDIA.get(key) : null;
  if (hit) return new Response(hit.body, { headers: { 'content-type': 'image/jpeg', 'cache-control': IMMUTABLE } });
  let res = await fetch(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);
  if (!res.ok || Number(res.headers.get('content-length') ?? '0') < 2000) res = await fetch(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
  if (!res.ok) return new Response('Not found', { status: 404, headers: { 'cache-control': 'no-store' } });
  const bytes = new Uint8Array(await res.arrayBuffer());
  if (env.MEDIA) await env.MEDIA.put(key, bytes, { httpMetadata: { contentType: 'image/jpeg', cacheControl: IMMUTABLE } });
  return new Response(bytes, { headers: { 'content-type': 'image/jpeg', 'cache-control': IMMUTABLE } });
}

// GET /media/vimeo/{id}.jpg or /media/vimeo/{id}-{hash}.jpg: a Vimeo video's
// picture for the same player (asked 2026-11-07: "Vimeo videos support").
// Vimeo has no fixed thumbnail address, so the Worker asks its oEmbed
// (vimeo.com/api/oembed.json, no key, the hash in the URL for an unlisted
// video) for thumbnail_url at 1280 px, fetches that once and keeps it in R2
// under vimeo/{id}.jpg, beside YouTube's. The page itself stays fast and asks
// Vimeo for nothing: the picture is a request of its own to this site, and a
// miss (a private video, Vimeo down) is a 404 never cached, which leaves the
// box empty with the play button on it, still a link to the video.
const VIMEO = /^\/media\/vimeo\/(\d{5,12})(?:-([0-9a-f]{6,20}))?\.jpg$/;
async function vimeoThumb(env, id, hash) {
  const key = `vimeo/${id}.jpg`;
  const hit = env.MEDIA ? await env.MEDIA.get(key) : null;
  if (hit) return new Response(hit.body, { headers: { 'content-type': hit.httpMetadata?.contentType ?? 'image/jpeg', 'cache-control': IMMUTABLE } });
  const miss = () => new Response('Not found', { status: 404, headers: { 'cache-control': 'no-store' } });
  const page = `https://vimeo.com/${id}${hash ? `/${hash}` : ''}`;
  const o = await fetch(`https://vimeo.com/api/oembed.json?width=1280&url=${encodeURIComponent(page)}`);
  if (!o.ok) return miss();
  const thumb = (await o.json().catch(() => ({}))).thumbnail_url;
  if (!thumb || !/^https:\/\/i\.vimeocdn\.com\//.test(thumb)) return miss();
  const res = await fetch(thumb);
  if (!res.ok) return miss();
  const type = (res.headers.get('content-type') ?? '').startsWith('image/') ? res.headers.get('content-type') : 'image/jpeg';
  const bytes = new Uint8Array(await res.arrayBuffer());
  if (env.MEDIA) await env.MEDIA.put(key, bytes, { httpMetadata: { contentType: type, cacheControl: IMMUTABLE } });
  return new Response(bytes, { headers: { 'content-type': type, 'cache-control': IMMUTABLE } });
}

// GET /media/{sha256}.{ext}: the original from R2, immutable under its hash;
// a miss is a 404 that is never cached, so a link asked for early does not
// stay broken (the images plan, section 4, Caching)
const KEY = /^\/(media\/[0-9a-f]{64}\.(?:jpg|png|webp|gif))$/;
export async function serveMedia(env, path) {
  const y = YT.exec(path);
  if (y) return ytThumb(env, y[1]);
  const v = VIMEO.exec(path);
  if (v) return vimeoThumb(env, v[1], v[2]);
  const m = KEY.exec(path);
  if (!m) return null;
  const obj = env.MEDIA ? await env.MEDIA.get(m[1]) : null;
  if (!obj) return new Response('Not found', { status: 404, headers: { 'cache-control': 'no-store' } });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  headers.set('access-control-allow-origin', '*');
  return new Response(obj.body, { headers });
}
