// pic.mjs: every picture the Worker draws, through one function that holds
// the quality and the format, trip's cdn() (trip/astro-prod/src/lib/media.ts)
// with eccm's paths (plans/plan-eccm-images.md section 4, asked 2026-09-30:
// "Resized image versions -- see ../trip implementation"). One original per
// picture, every rendition a same-zone /cdn-cgi/image/ URL, the ladder fixed
// so the unique transformations stay bounded, w-descriptors and an honest
// sizes, width and height always, no dpr= and no client hints.
//
// The renditions need Image Transformations on the zone, a dashboard switch,
// on for positron.studio since 2026-09-30 with "This zone only" as the
// allowed sources; IMAGE_TRANSFORMS in wrangler.jsonc turns them off again,
// and then a picture is its original with the same attributes and no srcset.
import { html } from './html.mjs';

// 'on' the zone's /cdn-cgi/image/; 'binding' the Worker's own /img/ through the Images binding, for a
// workers.dev host, which has no /cdn-cgi/image/ (src/img.mjs, 2026-11-09: production on workers.dev sent
// 3.8 MB of originals for the list's first twelve pictures, "prod 3.8 sunds baddd"); anything else the originals
let MODE = 'off', ON = false;
export const useTransforms = (v) => { MODE = v; ON = v === 'on' || v === 'binding'; };
export const QUALITY = 82;
// onerror=redirect: past the free plan's 5,000 unique transformations a
// month a new one answers error 9422, and this sends it to the original
// instead (developers.cloudflare.com/images/pricing/, read 2026-09-30)
export const cdn = (key, t) => (MODE === 'binding' ? `/img/${t}/${key}` : `/cdn-cgi/image/${t},quality=${QUALITY},format=auto,onerror=redirect/${key}`);
// a rung wider than the original would be an upscale, which is the one sin
// (the images plan, section 4); the original's own width stands in for them
const rungs = (ladder, w) => { const r = ladder.filter((x) => x <= w); return r.length === ladder.length ? r : r.concat(w); };

// the list: 3 to 2, cover, the 300 px slot at 1x, 2x and 3x; under 51rem the
// slot is the compact row's 6.5rem square, which the 300 rung covers, and under 38rem the phone row's
// full column, where the 600 and 900 rungs are what a 3x phone asks for
// first: the list's first picture, the front page's LCP on a phone and at the desk, fetched eagerly at high priority
// so the preload scanner starts it with the stylesheet; every other one is lazy (asked 2026-11-06, Lighthouse found the
// LCP lazily loaded, waiting for layout before its request)
export const LIST = [300, 600, 900];
export const listImg = (key, w, h, first = false) => {
  const load = first ? html` fetchpriority="high"` : html` loading="lazy"`;
  if (!ON) return html`<img src="/${key}" width="${w}" height="${h}" alt=""${load} decoding="async">`;
  const set = rungs(LIST, w).map((x) => `${cdn(key, `width=${x},height=${Math.round(x * 2 / 3)},fit=cover`)} ${x}w`).join(', ');
  return html`<img src="${cdn(key, 'width=300,height=200,fit=cover')}" srcset="${set}" sizes="(max-width: 38rem) calc(100vw - 2rem), (max-width: 51rem) 6.5rem, 300px" width="300" height="200" alt=""${load} decoding="async">`;
};

// the poster, the event page's LCP: the original's own ratio, eager, high
// priority, and a preload that mirrors the img exactly, since a preload that
// differs fetches twice (trip's Base contract)
export const POSTER = [640, 960, 1280, 1920];
const POSTER_SIZES = '(max-width: 48rem) calc(100vw - 2rem), (max-width: 64rem) calc(100vw - 4rem), (max-width: 76rem) calc(50vw - 3.5rem), 34.5rem';
export const poster = (m, alt) => {
  if (!ON) return { img: html`<img src="/${m.key}" width="${m.width}" height="${m.height}" alt="${alt}" fetchpriority="high" decoding="async">`, preload: html`<link rel="preload" as="image" href="/${m.key}" fetchpriority="high">` };
  const set = rungs(POSTER, m.width).map((x) => `${cdn(m.key, `width=${x}`)} ${x}w`).join(', ');
  const src = cdn(m.key, `width=${Math.min(1280, m.width)}`);
  return {
    img: html`<img src="${src}" srcset="${set}" sizes="${POSTER_SIZES}" width="${m.width}" height="${m.height}" alt="${alt}" fetchpriority="high" decoding="async">`,
    preload: html`<link rel="preload" as="image" href="${src}" imagesrcset="${set}" imagesizes="${POSTER_SIZES}" fetchpriority="high">`,
  };
};
