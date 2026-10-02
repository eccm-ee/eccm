// card.mjs: the event's share image as an SVG string, asked 2026-10-01: "lets
// work on social media og images ... use derived bg color and font", the
// title, its meta line, and ECCM at the foot. trip's composition in plain
// JavaScript (trip/astro-prod/src/lib/og-card.ts: greedy wrap, a balance
// search, the size stepped down before an ellipsis, FNV-1a over what is
// visible), with eccm's faces and widths read from the fonts themselves
// (src/og/metrics.mjs, tools/og-fonts.py) rather than guessed per letter.
// Every colour is a literal from the picture's scheme, since resvg has no
// cascade and a var() never resolves (plans/plan-eccm-social-images.md
// section 3); an event without one takes the site's own white and ink.
import { SYMBOL, HEADER } from '../render/mark.mjs';
import { dateLong, clock } from '../render/dates.mjs';
import M from './metrics.mjs';

// bump on any visual change: it is in every card's hash, so each URL changes
// and the stored images are orphaned, never purged
export const TEMPLATE_V = 10;
export const W = 1200, H = 630;

// the frame: 64 on every side, the site's --eccm-s-16 at 1x
const PAD = 64;
// the mark at 4 / 7.375 of its units, so the stave's pitch is a whole 4 px and
// each line one pixel; the letters E to M are then 162 px, the block every
// alignment is taken from (eccm-ui, the mark). It was 7 / 7.375, 283 px, until
// asked 2026-10-01: "make logo smaller and rm long noodijooned"
// The mark is 6 / 7.375 since 2026-10-02 ("just make logo smaller" ran the
// other way that day: "just make logo bigger in social cards"), the stave's
// pitch a whole 6 px and the letters E to M 243 px, half as large again.
const K = 6 / 7.375;
const E_LEFT = 35, E_TOP = 29, E_BOTTOM = 122;
const MARK_H = (E_BOTTOM - E_TOP) * K;
const MARK_TOP = Math.round(H - PAD - MARK_H);
// the least air between the text and the mark, --eccm-s-12; it is usually far more
const AIR = 48;
// the title at one size on every card (asked 2026-10-02: "lock social images
// title size (find most average size)"). It stepped 96, 76, 60, 48 before, the
// largest that fit, and the 50 live cards took 96 (38) or 76 (12): mean 91.2.
// An average size cuts the long titles with an ellipsis, so the size is the
// largest every live title holds at, MEASURED over the 50 each time the room
// changed: 68 with the venue on its own row (72 and 70 cut 4), then 62 once the
// mark grew to 6 / 7.375 (68 and 64 cut 3), the longest, 104 characters, on
// four lines. A longer title still ends in an ellipsis.
const STEPS = [62];
const TITLE_LH = 1.12;
const META = 30, META_LH = 1.4, META_GAP = 32;
// title to meta: the title's descent and then --eccm-s-8, the gap within the group
const GROUP = 32;
const MEASURE = W - 2 * PAD;
// The wide picture layout, text left and the picture right at /og/p/, was made
// and removed on 2026-10-02 ("rm horz og image variants"); the tall picture
// card below is the one with a picture.
// The tall cards, 1080 by 1350, Instagram's 4:5 feed shape (asked 2026-10-02:
// "do also vertical (instagram) layouts, see ../trip", then "see also eccm ig
// style"): trip's portrait sibling of its share card, one renderer and its own
// address (trip/astro-prod/src/lib/og-offer.ts), and eccm.ee's own posts on
// Instagram, which are 4:5 with the picture across the frame. The tall text
// card is the wide one at its own size; the tall picture card is the picture
// alone (cardSvg says when that changed).
export const TALL_W = 1080, TALL_H = 1350;
// the date and venue at 52 since the same evening ("make ig subtext bigger
// too"), 44 for an hour before and the share card's 30 before that
const TALL_META = 52;
// the mark a third larger than on the share card, 8 / 7.375, the stave's pitch
// a whole 8 px and the letters E to M 323 px (asked the same evening: "ig cards
// logos too small"); the nameplate grows with it
const TALL_K = 8 / 7.375;
const TALL_MARK_H = (E_BOTTOM - E_TOP) * TALL_K;
// MEASURED over the 50 live titles: the title at 104 cuts none with the date
// and venue at 52, the longest on eight lines, where at 56 it cuts 1
const TALL_TITLE = 104;

// where everything goes on the two cards with text: the text's top, the mark's
// top and scale, the measure, the title size and the date and venue's size
const LAYOUTS = {
  wide: { w: W, h: H, top: PAD, markTop: MARK_TOP, measure: MEASURE, steps: STEPS },
  tall: { w: TALL_W, h: TALL_H, top: PAD, markTop: Math.round(TALL_H - PAD - TALL_MARK_H), k: TALL_K, measure: TALL_W - 2 * PAD, steps: [TALL_TITLE], meta: TALL_META },
};

const SITE = { ground: '#ffffff', ink: '#1a1a1a', ink2: '#555555' };
const HEX = /^#[0-9a-f]{6}$/;

const xml = (s) => String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);
const width = (s, face, fs) => { let w = 0; for (const ch of s) w += M[face].adv[ch.codePointAt(0)] ?? 0.55; return w * fs; };

// the pieces a line may break between: at a space, and after a slash, since
// "Gestuurid/situatsioonid:" has no space and ran past a phone's column
const pieces = (text) => text.split(/\s+/).filter(Boolean).flatMap((w) => w.split(/(?<=\/)(?=.)/).map((p, i) => ({ p, sp: i === 0 })));
const join = (ps) => ps.map((x, i) => (i && x.sp ? ' ' : '') + x.p).join('');
// a piece wider than the measure on its own is cut by letters, the last resort
const fitPieces = (ps, face, fs, maxW) => ps.flatMap((x) => {
  if (width(x.p, face, fs) <= maxW) return [x];
  const out = []; let cur = '';
  for (const ch of x.p) { if (cur && width(cur + ch, face, fs) > maxW) { out.push({ p: cur, sp: !out.length && x.sp }); cur = ch; } else cur += ch; }
  out.push({ p: cur, sp: !out.length && x.sp });
  return out;
});
function wrapAt(ps, face, fs, maxW) {
  const lines = []; let cur = [];
  for (const x of ps) {
    if (cur.length && width(join([...cur, x]), face, fs) > maxW) { lines.push(cur); cur = [{ ...x, sp: true }]; } else cur.push(cur.length ? x : { ...x, sp: true });
  }
  if (cur.length) lines.push(cur);
  return lines.map(join);
}
// the narrowest measure that keeps the line count, text-wrap: balance by hand
function balance(ps, face, fs, maxW) {
  const n = wrapAt(ps, face, fs, maxW).length;
  if (n < 2) return wrapAt(ps, face, fs, maxW);
  let lo = Math.max(...ps.map((x) => width(x.p, face, fs))), hi = maxW;
  for (let i = 0; i < 14; i++) { const mid = (lo + hi) / 2; if (wrapAt(ps, face, fs, mid).length > n) lo = mid; else hi = mid; }
  return wrapAt(ps, face, fs, hi);
}

// the meta: the date and time, and the venue on a row of its own under it
// (asked 2026-10-02: "put location to its own row"); it shared the line when
// the two fitted until then
// A cell wider than the measure wraps onto the rows under it like the title
// does, since the Instagram card's larger size put the longest venue, "Witold
// Lutosławski Polish Radio Concert Studio", 1131 px into a 952 px measure
// (MEASURED 2026-10-02)
const metaLines = (cells, face, fs, measure) => cells.filter(Boolean).flatMap((c) => wrapAt(fitPieces(pieces(c), face, fs, measure), face, fs, measure).map((l) => [l]));

// the lines of title the room above the mark holds at a size, given the meta's lines
const room = (fs, face, metaN, L = LAYOUTS.wide) => {
  const cap = M[face].cap * fs;
  const meta = L.meta || META;
  const metaBlock = 0.25 * fs + GROUP + M[face === 'serif' ? 'serifText' : 'sans'].cap * meta + (metaN - 1) * META_LH * meta + 0.25 * meta;
  const avail = L.markTop - AIR - L.top - cap - metaBlock;
  return 1 + Math.floor(avail / (TITLE_LH * fs));
};

// The size is the one the sans would take for this title, for both faces, so a
// serif card and a sans card of the same title are set at the same size (asked
// 2026-10-01: "same font size to sans serif"; Roboto Serif sets wider, and
// fitting it on its own widths put its titles a step smaller). The serif then
// wraps at that size and steps down only when it truly does not fit.
function fitTitle(title, face, metaN, L = LAYOUTS.wide) {
  const steps = L.steps, measure = L.measure;
  const raw = pieces(title);
  const fits = (f, fs) => wrapAt(fitPieces(raw, f, fs, measure), f, fs, measure).length <= room(fs, f, metaN, L);
  const start = face === 'sans' ? 0 : Math.max(0, steps.findIndex((fs) => fits('sans', fs)));
  for (const fs of steps.slice(start)) {
    const ps = fitPieces(raw, face, fs, measure);
    if (wrapAt(ps, face, fs, measure).length <= room(fs, face, metaN, L)) return { fs, lines: balance(ps, face, fs, measure) };
  }
  const fs = steps[steps.length - 1], max = room(fs, face, metaN, L);
  const lines = wrapAt(fitPieces(raw, face, fs, measure), face, fs, measure).slice(0, max);
  let last = lines[max - 1] + '…';
  while (last.length > 2 && width(last, face, fs) > measure) last = last.slice(0, -2).trimEnd() + '…';
  lines[max - 1] = last;
  return { fs, lines };
}

// what the card shows, from the rows the event page reads: the title in the
// page's language (the Estonian one when there is no other), the start and
// the venue, and from the picture's scheme the ground, the two inks and
// whether the title is the serif. Everything visible is here, so its hash is
// the card's version.
export const cardInput = ({ lang, title, ev, scheme, pic }) => {
  let s = null;
  if (scheme) { try { s = JSON.parse(scheme); } catch { s = null; } }
  const ok = s && HEX.test(s.ground) && HEX.test(s.ink) && HEX.test(s.ink2);
  const at = lang === 'et' ? 'kell' : 'at';
  return {
    lang, title,
    meta: [`${dateLong(ev.starts_at, lang)} ${at} ${clock(ev.starts_at, lang)}`, ev.venue].filter(Boolean),
    ground: ok ? s.ground : SITE.ground, ink: ok ? s.ink : SITE.ink, ink2: ok ? s.ink2 : SITE.ink2,
    serif: !!(ok && (s.serif || s.titleFace)),
    // the picture's key for the picture layout, a JPEG or PNG resvg can draw; the bytes are read at render
    ...(pic && /\.(jpe?g|png)$/i.test(pic) ? { pic } : {}),
  };
};

// FNV-1a, 8 hex, over the visible inputs and the template version
export const cardVersion = (input) => {
  let h = 0x811c9dc5;
  for (const b of new TextEncoder().encode(JSON.stringify(input) + '|' + TEMPLATE_V)) { h ^= b; h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
};
export const cardPath = (id, lang, v) => `/og/e/${id}-${lang}-${v}.png`;
// the tall cards, /og/t/ the text one and /og/tp/ the picture one
export const tallVersion = (input, pic = false) => cardVersion({ ...input, layout: pic ? 'tallPicture' : 'tall' });
export const tallPath = (id, lang, v, pic = false) => `/og/${pic ? 'tp' : 't'}/${id}-${lang}-${v}.png`;

// the mark from the site's own symbol (src/render/mark.mjs), the letters as
// they are drawn and the stave apart from them, so the two can be placed apart
const SRC = SYMBOL.replace(/<!--[\s\S]*?-->/g, '');
const LETTERS = SRC.slice(SRC.indexOf('<g class="letters">') + 19, SRC.indexOf('<g font-family')).replace(/currentColor/g, 'INK').replace(/\s+/g, ' ').trim();
const LINES = [...SRC.slice(SRC.indexOf('<g class="lines">')).matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)].map((m) => m.slice(1).map(Number));

// the mark at the foot: the E's left edge on the frame, the E's foot on the
// bottom margin, the whole at whole pixels; the five stave lines stay the
// mark's own short ends past the M (they ran to the card's edge until
// 2026-10-01), one pixel each, snapped rather than scaled (eccm-ui, hairlines
// in a raster), and the three joins between the letters drawn the same way
// the nameplate at the foot, the header's own lockup with the tagline beside
// the mark (asked 2026-10-02: "use eccm nameplate on social card footer"):
// its two lines and the hyphen drawn as a rule, lifted from the header's
// svg.beside in the card's language and set at the mark's scale in the
// tagline's face, Instrument Sans at width 75 and weight 500 (og-fonts.py)
const PLATE = Object.fromEntries(['et', 'en'].map((l) => {
  const svg = HEADER[l].slice(HEADER[l].indexOf('<svg class="beside"'));
  const inner = svg.slice(svg.indexOf('>') + 1, svg.indexOf('</svg>'));
  return [l, inner.replace(/<use[^>]*><\/use>|<use[^>]*\/>/g, '').replace(/ class="tag-is"/g, ` font-family="${M.tag.family}"`)];
}));
const plateSvg = (ink, lang, markTop = MARK_TOP, k = K) => {
  const tx = PAD - E_LEFT * k, ty = markTop - E_TOP * k;
  return `<g transform="translate(${tx} ${ty}) scale(${k})" fill="${ink}">${(PLATE[lang] || PLATE.et).replace(/currentColor/g, ink)}</g>`;
};
// the stave's lines a whole pixel each, two when the mark is drawn large enough
// that one would read thinner than the letters' own joins
const markSvg = (ink, markTop = MARK_TOP, k = K) => {
  const tx = PAD - E_LEFT * k, ty = markTop - E_TOP * k;
  const letters = `<g transform="translate(${tx} ${ty}) scale(${k})" fill="${ink}">${LETTERS.replace(/INK/g, ink)}</g>`;
  const lh = Math.max(1, Math.round(1.5 * k));
  const lines = LINES.map(([x, y, w]) => {
    const top = Math.round(ty + y * k);
    const x0 = Math.round(tx + x * k);
    const x1 = Math.max(x0 + 1, Math.round(tx + (x + w) * k));
    return `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${lh}" fill="${ink}"/>`;
  }).join('');
  return letters + `<g shape-rendering="crispEdges">${lines}</g>`;
};

// picture: the picture as a data URI for the tall picture card; tall: the 4:5 card.
// The tall picture card is the picture alone, cropped to fill the frame, made to
// sit beside the tall text card as a carousel's two slides (asked 2026-10-02:
// "make text card and image only card next to each other"); for an hour it had
// the picture across the top at 2 : 1 and the text under it.
export const cardSvg = (input, picture = null, tall = false) => {
  if (tall && picture) return `<svg xmlns="http://www.w3.org/2000/svg" width="${TALL_W}" height="${TALL_H}" viewBox="0 0 ${TALL_W} ${TALL_H}">`
    + `<rect width="${TALL_W}" height="${TALL_H}" fill="${input.ground}"/><image x="0" y="0" width="${TALL_W}" height="${TALL_H}" preserveAspectRatio="xMidYMid slice" href="${picture}"/></svg>`;
  const L = tall ? LAYOUTS.tall : LAYOUTS.wide;
  const face = input.serif ? 'serif' : 'sans';
  const metaFace = input.serif ? 'serifText' : 'sans';
  const meta = metaLines(input.meta, metaFace, L.meta || META, L.measure);
  const { fs, lines } = fitTitle(input.title, face, meta.length, L);
  const out = [];
  // the title's first cap on the top margin: the ink, not the line box
  let y = L.top + M[face].cap * fs;
  for (const l of lines) { out.push(`<text x="${PAD}" y="${y.toFixed(1)}" font-family="${M[face].family}" font-size="${fs}" fill="${input.ink}">${xml(l)}</text>`); y += TITLE_LH * fs; }
  const metaFs = L.meta || META;
  y += -TITLE_LH * fs + 0.25 * fs + GROUP + M[metaFace].cap * metaFs;
  for (const row of meta) {
    let x = PAD;
    for (const cell of row) { out.push(`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-family="${M[metaFace].family}" font-size="${metaFs}" fill="${input.ink2}">${xml(cell)}</text>`); x += width(cell, metaFace, metaFs) + META_GAP; }
    y += META_LH * metaFs;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${L.w}" height="${L.h}" viewBox="0 0 ${L.w} ${L.h}">`
    + `<rect width="${L.w}" height="${L.h}" fill="${input.ground}"/>${out.join('')}${markSvg(input.ink, L.markTop, L.k)}${input.plate === false ? '' : plateSvg(input.ink, input.lang, L.markTop, L.k)}`
    + '</svg>';
};

// the words a reader of the card's alt hears: the title, then the meta line
export const cardAlt = (input) => [input.title, ...input.meta].join(', ');

// ── the site's own card ──────────────────────────────────────────────────────
// Every page that is not an event shares this one (asked 2026-10-01: "make eccm
// default social card", then "default og should have event card style, pick a
// bg, put logo to bottom left", after a link to /station previewed as a crop of
// the footer's ULYSSES mark, which is what a scraper takes when a page names no
// image). It is an event card: the centre's name as the title, the hall's
// address as the meta line, the mark at the foot on the left, on a ground no
// event takes from its picture, the deep blue /ds already shows as its dark
// ground, with white ink, so a shared page reads as ECCM's own at a glance.
const SITE_CARD = { ground: '#1b2746', ink: '#ffffff', ink2: '#c9c9c9' };
const SITE_NAME = { et: 'Eesti Nüüdismuusika Keskus', en: 'Estonian Centre of Contemporary Music' };
export const SITE_V = 3;   // the site card's own version, in its R2 key
export const siteSvg = (lang) => {
  const l = lang === 'en' ? 'en' : 'et';
  // the mark alone at its foot: the title is already the centre's name, which the nameplate would say twice
  return cardSvg({ lang: l, title: SITE_NAME[l], meta: ['Pühavaimu 9, Tallinn'], ...SITE_CARD, serif: false, plate: false });
};
// the radio's own card, the same shape in the wine, so a link to /radio is
// told from the site's card at a glance (asked 2026-10-01: "rename station to
// radio and make a social card for it"). On a pale wine ground with the wine
// as its ink since 2026-10-02, when the deep wine ground read as a dark mode
// ("raadio has dark mode bg", "social radio bg not fixed"); the ink is 12.96 : 1
// on the ground and the second ink 6.57 : 1
const RADIO_CARD = { ground: '#f4ecf0', ink: '#3b1d2b', ink2: '#6b4a5b' };
const RADIO_NAME = { et: 'Raadio', en: 'Radio' };
export const radioSvg = (lang) => {
  const l = lang === 'en' ? 'en' : 'et';
  return cardSvg({ lang: l, title: RADIO_NAME[l], meta: [SITE_NAME[l]], ...RADIO_CARD, serif: false, plate: false });
};
export const radioPath = (lang) => `/og/radio-${lang === 'en' ? 'en' : 'et'}.png`;
export const sitePath = (lang) => `/og/site-${lang === 'en' ? 'en' : 'et'}.png`;
export const siteAlt = (lang) => (lang === 'en' ? 'ECCM, Estonian Centre of Contemporary Music' : 'ECCM, Eesti Nüüdismuusika Keskus');
