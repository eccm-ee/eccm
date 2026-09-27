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
const M = (wide) => `<rect x="273" y="29" width="14" height="93"/><rect x="319" y="29" width="14" height="93"/><polygon points="${wide ? '281,29 295,29 302.5,84 310,29 324,29 309,122 296,122' : '283,29 293,29 302.5,84 312,29 322,29 306,122 299,122'}"/>`;
// the hairlines as segments in logo units: [x0, x1, y]
const STAVE = [58.5, 65.875, 73.25, 80.625, 88].map((y) => [333, 345, y]);
const JOIN_EC = [73, 109, 108], JOIN_CC = [153, 190, 88], JOIN_CM = [234, 273, 58.5];

// the two marks: side in logo units, and rows of letters with their offset
// and their hairlines
export const MARKS = {
  square: { side: 354, rows: [{ dx: -7, dy: 103.5, letters: (wide) => E + C(0) + C(81) + M(wide), lines: [JOIN_EC, JOIN_CC, JOIN_CM, ...STAVE] }] },
  stack: { side: 270, rows: [
    { dx: 28.5, dy: -1, letters: () => E + C(0), lines: [JOIN_EC] },
    { dx: -126.5, dy: 120, letters: (wide) => C(81) + M(wide), lines: [JOIN_CM, ...STAVE] },
  ] },
};

// an SVG of n by n device pixels: the letters scaled, the hairlines snapped;
// plain drops the hairlines and widens the M's arms to a stem, for the sizes
// under 128 where even a snapped line is noise
export const svgFor = (kind, n, plain) => {
  const m = MARKS[kind];
  const s = n / m.side;
  const t = Math.max(1, Math.round(1.5 * s));                 // a hairline's thickness in px
  const pitch = Math.max(t + 1, Math.round(7.375 * s));      // the stave's pitch in px, at least a gap of one
  const parts = [];
  for (const row of m.rows) {
    parts.push(`<g transform="scale(${s}) translate(${row.dx} ${row.dy})">${row.letters(plain)}</g>`);
    if (plain) continue;
    let staveIndex = 0;
    for (const [x0, x1, y] of row.lines) {
      const isStave = y === STAVE[0][2] || staveIndex > 0;
      // the stave runs from the M to the square's right edge (asked 2026-09-27)
      const X0 = Math.round((x0 + row.dx) * s), X1 = isStave ? n : Math.max(X0 + 1, Math.round((x1 + row.dx) * s));
      let Y = Math.round((y + row.dy) * s);
      if (isStave) { Y = Math.round((STAVE[0][2] + row.dy) * s) + staveIndex * pitch; staveIndex++; }
      parts.push(`<rect x="${X0}" y="${Y}" width="${X1 - X0}" height="${t}" shape-rendering="crispEdges"/>`);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" width="${n}" height="${n}"><rect width="${n}" height="${n}" fill="#ffffff"/><g fill="#1a1a1a" color="#1a1a1a">${parts.join('')}</g></svg>`;
};

// the stave alone for a raster graphic: five lines t px thick on an integer
// pitch, w px wide, to be placed flush to the right edge with a padding from
// the top (the rule of public/icons/stave.svg)
export const staveSvg = (w, t = 1, pitch = 5) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${4 * pitch + t}" width="${w}" height="${4 * pitch + t}"><g fill="currentColor">${[0, 1, 2, 3, 4].map((i) => `<rect x="0" y="${i * pitch}" width="${w}" height="${t}" shape-rendering="crispEdges"/>`).join('')}</g></svg>`;
