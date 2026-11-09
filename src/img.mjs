// img.mjs: GET /img/{t}/{key}, a picture's rendition through the Images binding, for a host with no
// /cdn-cgi/image/ (a workers.dev one; src/render/pic.mjs says when). The same renditions the zone makes:
// t is one of the ladder's own transforms, anything else goes to the original, so no address can spend the
// free plan's 5,000 unique transformations a month; the format from the browser's Accept, as format=auto
// does; kept in this colo's cache a day; a failure, the limit's 9422 among them, goes to the original, as
// onerror=redirect does on the zone.
import { LIST, POSTER, QUALITY } from './render/pic.mjs';
import { pictureBytes } from './og/route.mjs';

const ALLOWED = new Map([
  ...LIST.map((w) => [`width=${w},height=${Math.round(w * 2 / 3)},fit=cover`, { width: w, height: Math.round(w * 2 / 3), fit: 'cover' }]),
  ...POSTER.map((w) => [`width=${w}`, { width: w, fit: 'scale-down' }]),
]);
const KEY = /^(media\/[0-9a-f]{64}|[\w.-]+)\.(jpe?g|png|webp|gif)$/i;

export async function serveImg(request, env, url, ctx) {
  const m = /^\/img\/([^/]+)\/(.+)$/.exec(url.pathname);
  if (!m) return null;
  const [, t, key] = m;
  if (!KEY.test(key)) return new Response(null, { status: 404 });
  const original = new Response(null, { status: 302, headers: { location: `/${key}`, 'cache-control': 'public, max-age=3600' } });
  const tr = ALLOWED.get(t);
  if (!tr || !env.IMAGES) return original;
  const accept = request.headers.get('accept') || '';
  const format = accept.includes('image/avif') ? 'image/avif' : accept.includes('image/webp') ? 'image/webp' : 'image/jpeg';
  const cacheKey = new Request(`${url.origin}/img/${t}/${format.slice(6)}/${key}`);
  const hit = await caches.default.match(cacheKey);
  if (hit) return hit;
  try {
    const b = await pictureBytes(env, url, key);
    if (!b) return new Response(null, { status: 404 });
    const out = await env.IMAGES.input(new Response(b).body).transform(tr).output({ format, quality: QUALITY });
    const bytes = await out.response().arrayBuffer();
    const res = new Response(bytes, { headers: { 'content-type': format, 'cache-control': 'public, max-age=86400', vary: 'accept' } });
    ctx.waitUntil(caches.default.put(cacheKey, res.clone()));
    return res;
  } catch (e) {
    console.error(JSON.stringify({ msg: 'img-failed', key, t, err: String(e) }));
    return original;
  }
}
