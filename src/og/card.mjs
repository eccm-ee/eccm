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
import { SYMBOL } from '../render/mark.mjs';
import { dateLong, clock } from '../render/dates.mjs';
import M from './metrics.mjs';

// bump on any visual change: it is in every card's hash, so each URL changes
// and the stored images are orphaned, never purged
export const TEMPLATE_V = 3;
export const W = 1200, H = 630;

// the frame: 64 on every side, the site's --eccm-s-16 at 1x
const PAD = 64;
// the mark at 4 / 7.375 of its units, so the stave's pitch is a whole 4 px and
// each line one pixel; the letters E to M are then 162 px, the block every
// alignment is taken from (eccm-ui, the mark). It was 7 / 7.375, 283 px, until
// asked 2026-10-01: "make logo smaller and rm long noodijooned"
const K = 4 / 7.375;
const E_LEFT = 35, E_TOP = 29, E_BOTTOM = 122;
const MARK_H = (E_BOTTOM - E_TOP) * K;
const MARK_TOP = Math.round(H - PAD - MARK_H);
// the least air between the text and the mark, --eccm-s-12; it is usually far more
const AIR = 48;
// the title steps, about 1.26 apart, and the meta line under them: four sizes
// and one, the large contrast of eccm-ui section 2. The largest that holds the
// whole title in the room above the mark wins; under the last, an ellipsis.
const STEPS = [96, 76, 60, 48];
const TITLE_LH = 1.12;
const META = 30, META_LH = 1.4, META_GAP = 32;
// title to meta: the title's descent and then --eccm-s-8, the gap within the group
const GROUP = 32;
const MEASURE = W - 2 * PAD;

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

// the meta line: the date and time, then the venue, set apart by space and
// no glyph; on two lines when the two do not fit on one
const metaLines = (cells, face) => {
  const [a, b] = cells;
  if (!b) return [[a]];
  return width(a, face, META) + META_GAP + width(b, face, META) <= MEASURE ? [[a, b]] : [[a], [b]];
};

// the lines of title the room above the mark holds at a size, given the meta's lines
const room = (fs, face, metaN) => {
  const cap = M[face].cap * fs;
  const metaBlock = 0.25 * fs + GROUP + M[face === 'serif' ? 'serifText' : 'sans'].cap * META + (metaN - 1) * META_LH * META + 0.25 * META;
  const avail = MARK_TOP - AIR - PAD - cap - metaBlock;
  return 1 + Math.floor(avail / (TITLE_LH * fs));
};

function fitTitle(title, face, metaN) {
  const raw = pieces(title);
  for (const fs of STEPS) {
    const ps = fitPieces(raw, face, fs, MEASURE);
    if (wrapAt(ps, face, fs, MEASURE).length <= room(fs, face, metaN)) return { fs, lines: balance(ps, face, fs, MEASURE) };
  }
  const fs = STEPS[STEPS.length - 1], max = room(fs, face, metaN);
  const lines = wrapAt(fitPieces(raw, face, fs, MEASURE), face, fs, MEASURE).slice(0, max);
  let last = lines[max - 1] + '…';
  while (last.length > 2 && width(last, face, fs) > MEASURE) last = last.slice(0, -2).trimEnd() + '…';
  lines[max - 1] = last;
  return { fs, lines };
}

// what the card shows, from the rows the event page reads: the title in the
// page's language (the Estonian one when there is no other), the start and
// the venue, and from the picture's scheme the ground, the two inks and
// whether the title is the serif. Everything visible is here, so its hash is
// the card's version.
export const cardInput = ({ lang, title, ev, scheme }) => {
  let s = null;
  if (scheme) { try { s = JSON.parse(scheme); } catch { s = null; } }
  const ok = s && HEX.test(s.ground) && HEX.test(s.ink) && HEX.test(s.ink2);
  const at = lang === 'et' ? 'kell' : 'at';
  return {
    lang, title,
    meta: [`${dateLong(ev.starts_at, lang)} ${at} ${clock(ev.starts_at, lang)}`, ev.venue].filter(Boolean),
    ground: ok ? s.ground : SITE.ground, ink: ok ? s.ink : SITE.ink, ink2: ok ? s.ink2 : SITE.ink2,
    serif: !!(ok && (s.serif || s.titleFace)),
  };
};

// FNV-1a, 8 hex, over the visible inputs and the template version
export const cardVersion = (input) => {
  let h = 0x811c9dc5;
  for (const b of new TextEncoder().encode(JSON.stringify(input) + '|' + TEMPLATE_V)) { h ^= b; h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
};
export const cardPath = (id, lang, v) => `/og/e/${id}-${lang}-${v}.png`;

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
const markSvg = (ink) => {
  const tx = PAD - E_LEFT * K, ty = MARK_TOP - E_TOP * K;
  const letters = `<g transform="translate(${tx} ${ty}) scale(${K})" fill="${ink}">${LETTERS.replace(/INK/g, ink)}</g>`;
  const lines = LINES.map(([x, y, w]) => {
    const top = Math.round(ty + y * K);
    const x0 = Math.round(tx + x * K);
    const x1 = Math.max(x0 + 1, Math.round(tx + (x + w) * K));
    return `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="1" fill="${ink}"/>`;
  }).join('');
  return letters + `<g shape-rendering="crispEdges">${lines}</g>`;
};

export const cardSvg = (input) => {
  const face = input.serif ? 'serif' : 'sans';
  const metaFace = input.serif ? 'serifText' : 'sans';
  const meta = metaLines(input.meta, metaFace);
  const { fs, lines } = fitTitle(input.title, face, meta.length);
  const out = [];
  // the title's first cap on the top margin: the ink, not the line box
  let y = PAD + M[face].cap * fs;
  for (const l of lines) { out.push(`<text x="${PAD}" y="${y.toFixed(1)}" font-family="${M[face].family}" font-size="${fs}" fill="${input.ink}">${xml(l)}</text>`); y += TITLE_LH * fs; }
  y += -TITLE_LH * fs + 0.25 * fs + GROUP + M[metaFace].cap * META;
  for (const row of meta) {
    let x = PAD;
    for (const cell of row) { out.push(`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-family="${M[metaFace].family}" font-size="${META}" fill="${input.ink2}">${xml(cell)}</text>`); x += width(cell, metaFace, META) + META_GAP; }
    y += META_LH * META;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`
    + `<rect width="${W}" height="${H}" fill="${input.ground}"/>${out.join('')}${markSvg(input.ink)}</svg>`;
};

// the words a reader of the card's alt hears: the title, then the meta line
export const cardAlt = (input) => [input.title, ...input.meta].join(', ');
