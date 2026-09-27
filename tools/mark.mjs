// mark.mjs: the ECCM mark's geometry in logo.svg's units, and an SVG for one
// icon size in which the hairlines are snapped to whole device pixels. At 128
// px a 1.5 unit hairline is 0.54 px and the 7.375 pitch is 2.67 px, so of
// five stave lines some cover one pixel and some straddle two, and they come
// out in three shades (reported 2026-09-27 with a crop: "5 line strips look
// bad / uneven on smaller sizes. do we need canvas rendering to preserve
// pixel lines?"). No canvas is needed: the letters scale as vectors and the
// hairlines are emitted as integer rectangles with crispEdges, one pixel
// thick on an integer pitch, which is what a hinting engine would do.
const E = '<rect x="35" y="29" width="14" height="93"/><rect x="35" y="29" width="38" height="13"/><rect x="35" y="67" width="31" height="13"/><rect x="35" y="108" width="38" height="14"/>';
const C = (dx) => `<path d="M${146 + dx} 60 V49 A15 15 0 0 0 ${116 + dx} 49 V101.5 A15 15 0 0 0 ${146 + dx} 101.5 V88" fill="none" stroke="currentColor" stroke-width="14"/>`;
// the plain M is 12 units wider, its right stem at 331 and its V arms a stem
// wide, so the counters open at 48 and 64 where the drawn M is a blob
// (asked 2026-09-27: "M is bloby under 64. make it wider to compensate?")
const M = (mode) => mode === 'bold' ? M_B : mode === 'plain' ? M_WIDE : M_DRAWN;
const M_DRAWN = '<rect x="273" y="29" width="14" height="93"/><rect x="319" y="29" width="14" height="93"/><polygon points="283,29 293,29 302.5,84 312,29 322,29 306,122 299,122"/>';
const M_WIDE = '<rect x="273" y="29" width="14" height="93"/><rect x="331" y="29" width="14" height="93"/><polygon points="281,29 295,29 309,84 323,29 337,29 316,122 302,122"/>';
// the bold set for 16 and 32: stems of 20 instead of 14, the way eccm.ee's
// own favicon fills its square with heavy letters (asked 2026-09-27)
const M_B = '<rect x="273" y="29" width="20" height="93"/><rect x="325" y="29" width="20" height="93"/><polygon points="287,29 305,29 309,82 313,29 331,29 319,122 299,122"/>';
const E_B = '<rect x="35" y="29" width="20" height="93"/><rect x="35" y="29" width="44" height="19"/><rect x="35" y="66" width="37" height="19"/><rect x="35" y="103" width="44" height="19"/>';
const C_B = (dx) => `<path d="M${146 + dx} 62 V49 A15 15 0 0 0 ${116 + dx} 49 V101.5 A15 15 0 0 0 ${146 + dx} 101.5 V86" fill="none" stroke="currentColor" stroke-width="20"/>`;
// the hairlines as segments in logo units: [x0, x1, y]
const STAVE = [58.5, 65.875, 73.25, 80.625, 88].map((y) => [333, 345, y]);
const JOIN_EC = [73, 109, 108], JOIN_CC = [153, 190, 88], JOIN_CM = [234, 273, 58.5];

// the two marks: side in logo units, and rows of letters with their offset
// and their hairlines
export const MARKS = {
  square: { side: 354, rows: [{ dx: -7, plainDx: -13, dy: 103.5, letters: (mode) => (mode === 'bold' ? E_B + C_B(0) + C_B(81) : E + C(0) + C(81)) + M(mode), lines: [JOIN_EC, JOIN_CC, JOIN_CM, ...STAVE] }] },
  stack: { side: 270, rows: [
    // the first row spreads to the block: the E on the left edge over the C,
    // the C on the right edge over the M, the join across the gap (asked
    // 2026-09-27: "align E to left and C to right"); the E's offset is the
    // row's, the C's is 25 units more in the full mark and 37 in the others
    { dx: 28.5, plainDx: 22.5, dy: -1, letters: (mode) => (mode === 'bold' ? E_B + `<g transform="translate(37 0)">${C_B(0)}</g>` : mode === 'plain' ? E + `<g transform="translate(37 0)">${C(0)}</g>` : E + `<g transform="translate(25 0)">${C(0)}</g>`), lines: [[73, 134, 108]] },
    { dx: -126.5, plainDx: -132.5, dy: 120, letters: (mode) => (mode === 'bold' ? C_B(81) : C(81)) + M(mode), lines: [JOIN_CM, ...STAVE] },
  ] },
};

// an SVG of n by n device pixels: the letters scaled, the hairlines snapped;
// plain drops the hairlines and widens the M's arms to a stem, for the sizes
// under 128 where even a snapped line is noise
export const svgFor = (kind, n, plain, neg = false) => {
  const mode = n <= 32 ? 'bold' : plain ? 'plain' : 'full';
  const m = MARKS[kind];
  const s = n / m.side;
  const t = Math.max(1, Math.round(1.5 * s));                 // a hairline's thickness in px
  const pitch = Math.max(t + 1, Math.round(7.375 * s));      // the stave's pitch in px, at least a gap of one
  const parts = [];
  for (const row of m.rows) {
    parts.push(`<g transform="scale(${s}) translate(${mode === 'full' ? row.dx : row.plainDx} ${row.dy})">${row.letters(mode)}</g>`);
    if (mode !== 'full') continue;
    let staveIndex = 0;
    for (const [x0, x1, y] of row.lines) {
      const isStave = y === STAVE[0][2] || staveIndex > 0;
      // the stave runs from the M to the square's right edge (asked 2026-09-27)
      // the stave at its own width, as in the logo (asked 2026-09-27: "narrow as in original logo")
      const X0 = Math.round((x0 + row.dx) * s), X1 = Math.max(X0 + 1, Math.round((x1 + row.dx) * s));
      let Y = Math.round((y + row.dy) * s);
      if (isStave) { Y = Math.round((STAVE[0][2] + row.dy) * s) + staveIndex * pitch; staveIndex++; }
      parts.push(`<rect x="${X0}" y="${Y}" width="${X1 - X0}" height="${t}" shape-rendering="crispEdges"/>`);
    }
  }
  const ink = neg ? '#ffffff' : '#1a1a1a', ground = neg ? '#1a1a1a' : '#ffffff';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" width="${n}" height="${n}"><rect width="${n}" height="${n}" fill="${ground}"/><g fill="${ink}" color="${ink}">${parts.join('')}</g></svg>`;
};

// the stave alone for a raster graphic: five lines t px thick on an integer
// pitch, w px wide, to be placed flush to the right edge with a padding from
// the top (the rule of public/icons/stave.svg)
export const staveSvg = (w, t = 1, pitch = 5) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${4 * pitch + t}" width="${w}" height="${4 * pitch + t}"><g fill="currentColor">${[0, 1, 2, 3, 4].map((i) => `<rect x="0" y="${i * pitch}" width="${w}" height="${t}" shape-rendering="crispEdges"/>`).join('')}</g></svg>`;
