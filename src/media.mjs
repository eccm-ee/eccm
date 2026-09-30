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
  if (!env.MEDIA) return { error: 'Pildihoidla ei ole ühendatud (R2 sidumine MEDIA puudub).' };
  if (file.size > MAX_BYTES) return { error: `Pilt on ${Math.round(file.size / 1048576)} MB, suurim lubatud on 10 MB.` };
  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = sniff(bytes);
  if (!ext) return { error: 'See fail ei ole JPEG, PNG, WebP ega GIF.' };
  const dims = size(ext, bytes);
  if (!dims || !dims.width || !dims.height) return { error: 'Pildi mõõte ei õnnestunud failist lugeda.' };
  const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map((x) => x.toString(16).padStart(2, '0')).join('');
  const key = `media/${hash}.${ext}`;
  if (!(await env.MEDIA.head(key))) await env.MEDIA.put(key, bytes, { httpMetadata: { contentType: TYPES[ext], cacheControl: 'public, max-age=31536000, immutable' } });
  const row = await env.DB.prepare(`INSERT INTO media (key, width, height, bytes, alt_et, alt_en, scheme, scheme_v) VALUES (?,?,?,?,?,?,?,?)
    ON CONFLICT (key) DO UPDATE SET scheme = COALESCE(media.scheme, excluded.scheme), scheme_v = COALESCE(media.scheme_v, excluded.scheme_v), bytes = excluded.bytes
    RETURNING *`).bind(key, dims.width, dims.height, bytes.length, alt.et, alt.en, scheme, scheme ? JSON.parse(scheme).v : null).first();
  return { row };
}

// GET /media/{sha256}.{ext}: the original from R2, immutable under its hash;
// a miss is a 404 that is never cached, so a link asked for early does not
// stay broken (the images plan, section 4, Caching)
const KEY = /^\/(media\/[0-9a-f]{64}\.(?:jpg|png|webp|gif))$/;
export async function serveMedia(env, path) {
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
