// tools/feather.mjs: writes public/vendor/icons/feather/icons.svg, the site's icons, from Feather 4.29.2
// (MIT, LICENSE beside the sprite), asked 2026-10-02: "pick feather and implement". Each icon is fetched from
// jsDelivr as published and changed in four ways only, because the site has no radius and a 1px line:
//   - stroke width, caps and joins come off, so the page sets them (eccm.css .ico and .btn-ico);
//   - vector-effect non-scaling-stroke on every shape, so a stroke of 1 is one CSS pixel at every size;
//   - a corner drawn round is drawn square: a rect's rx goes, and in a path a quarter arc of radius 2 or
//     less that follows a straight segment becomes the corner it rounded (Feather rounds boxes and trays at
//     2 units, and mail with cubics of the same size, squared the same way; a larger arc, a circle or a
//     long curve is the drawing, and stays);
//   - shape-rendering crispEdges on rects and on horizontal or vertical lines, so a 1px edge between two
//     pixels is one black pixel and not two grey ones.
// Run: node tools/feather.mjs. The list below is the site's vocabulary; add a name to add an icon.
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const BASE = 'https://cdn.jsdelivr.net/npm/feather-icons@4.29.2/dist/icons/';
// [id in the sprite, Feather's name], grouped as /icons shows them
export const GROUPS = [
  ['Playback', [['play', 'play'], ['pause', 'pause'], ['stop', 'square'], ['record', 'circle'], ['skip-back', 'skip-back'], ['skip-forward', 'skip-forward'], ['rewind', 'rewind'], ['fast-forward', 'fast-forward'], ['repeat', 'repeat'], ['shuffle', 'shuffle']]],
  ['Sound and radio', [['volume', 'volume-2'], ['volume-low', 'volume-1'], ['volume-off', 'volume'], ['mute', 'volume-x'], ['mic', 'mic'], ['mic-off', 'mic-off'], ['headphones', 'headphones'], ['radio', 'radio'], ['cast', 'cast'], ['activity', 'activity'], ['music', 'music'], ['rss', 'rss']]],
  ['Files', [['upload', 'upload'], ['download', 'download'], ['file', 'file'], ['folder', 'folder'], ['image', 'image'], ['edit', 'edit-2'], ['trash', 'trash-2'], ['copy', 'copy'], ['link', 'link'], ['external', 'external-link'], ['share', 'share']]],
  ['Navigation', [['menu', 'menu'], ['close', 'x'], ['plus', 'plus'], ['minus', 'minus'], ['check', 'check'], ['search', 'search'], ['filter', 'filter'], ['more', 'more-horizontal'], ['chevron-left', 'chevron-left'], ['chevron-right', 'chevron-right'], ['chevron-up', 'chevron-up'], ['chevron-down', 'chevron-down'], ['arrow-left', 'arrow-left'], ['arrow-right', 'arrow-right'], ['refresh', 'refresh-cw'], ['maximize', 'maximize-2']]],
  ['Events and people', [['calendar', 'calendar'], ['clock', 'clock'], ['map-pin', 'map-pin'], ['user', 'user'], ['users', 'users'], ['mail', 'mail'], ['message', 'message-square'], ['bell', 'bell'], ['globe', 'globe'], ['info', 'info'], ['alert', 'alert-triangle'], ['eye', 'eye'], ['lock', 'lock'], ['settings', 'settings'], ['moon', 'moon']]],
];

// a path's d with its small corner arcs made square. Feather writes its corners relative ("v4a2 2 0 0 1-2 2"),
// so the walk tracks the pen and the last segment's kind and replaces "a r r 0 0 s dx dy" after a straight
// segment, |dx| = |dy| = r <= 2, by the two straight legs meeting where the curve's tangents cross: the first
// leg continues the incoming direction.
const squareCorners = (d) => {
  const toks = d.match(/[a-zA-Z]|-?(?:\d*\.\d+|\d+)(?:e-?\d+)?/g);
  const out = [];
  let i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0, lastStraight = null; // null, 'h' or 'v'
  const num = () => Number(toks[i++]);
  const isNum = () => i < toks.length && !/[a-zA-Z]/.test(toks[i]);
  while (i < toks.length) {
    if (!isNum()) cmd = toks[i++];
    const rel = cmd === cmd.toLowerCase();
    const C = cmd.toUpperCase();
    if (C === 'Z') { out.push(cmd); x = sx; y = sy; lastStraight = null; continue; }
    if (C === 'M') { const a = num(), b = num(); x = rel ? x + a : a; y = rel ? y + b : b; sx = x; sy = y; out.push(`M${x} ${y}`); lastStraight = null; cmd = rel ? 'l' : 'L'; continue; }
    if (C === 'H') { const a = num(); x = rel ? x + a : a; out.push(`H${x}`); lastStraight = 'h'; continue; }
    if (C === 'V') { const a = num(); y = rel ? y + a : a; out.push(`V${y}`); lastStraight = 'v'; continue; }
    if (C === 'L') { const a = num(), b = num(); const nx = rel ? x + a : a, ny = rel ? y + b : b; lastStraight = nx === x ? 'v' : ny === y ? 'h' : null; x = nx; y = ny; out.push(`L${x} ${y}`); continue; }
    if (C === 'A') {
      const rx = num(), ry = num(), rot = num(), large = num(), sweep = num(), a = num(), b = num();
      const nx = rel ? x + a : a, ny = rel ? y + b : b, dx = nx - x, dy = ny - y;
      // a shape that starts on its corner (the headphones' cups) has nothing before the arc, so the leg it
      // leaves on decides: an h after it means it arrived vertically
      const next = toks[i] && /[a-zA-Z]/.test(toks[i]) ? toks[i].toLowerCase() : '';
      if (!lastStraight && out.length && out[out.length - 1][0] === 'M' && (next === 'h' || next === 'v')) lastStraight = next === 'h' ? 'v' : 'h';
      if (lastStraight && rx === ry && rx <= 2 && Math.abs(Math.abs(dx) - rx) < 1e-9 && Math.abs(Math.abs(dy) - rx) < 1e-9) {
        if (lastStraight === 'v') { out.push(`V${ny}`, `H${nx}`); lastStraight = 'h'; } else { out.push(`H${nx}`, `V${ny}`); lastStraight = 'v'; }
      } else { out.push(`A${rx} ${ry} ${rot} ${large} ${sweep} ${nx} ${ny}`); lastStraight = null; }
      x = nx; y = ny; continue;
    }
    if (C === 'C') {
      const p = [num(), num(), num(), num(), num(), num()]; const q = rel ? p.map((v, k) => v + (k % 2 ? y : x)) : p;
      const dx = q[4] - x, dy = q[5] - y;
      // mail draws its corners as cubics, not arcs: the same quarter turn of 2 or less, squared the same way
      if (lastStraight && Math.abs(Math.abs(dx) - Math.abs(dy)) < 1e-9 && Math.abs(dx) > 0 && Math.abs(dx) <= 2) {
        if (lastStraight === 'v') { out.push(`V${q[5]}`, `H${q[4]}`); lastStraight = 'h'; } else { out.push(`H${q[4]}`, `V${q[5]}`); lastStraight = 'v'; }
      } else { out.push(`C${q.join(' ')}`); lastStraight = null; }
      x = q[4]; y = q[5]; continue;
    }
    if (C === 'S' || C === 'Q') { const p = [num(), num(), num(), num()]; const q = rel ? p.map((v, k) => v + (k % 2 ? y : x)) : p; x = q[2]; y = q[3]; out.push(`${C}${q.join(' ')}`); lastStraight = null; continue; }
    if (C === 'T') { const a = num(), b = num(); x = rel ? x + a : a; y = rel ? y + b : b; out.push(`T${x} ${y}`); lastStraight = null; continue; }
    throw new Error(`path command ${cmd} in ${d}`);
  }
  // the pen's sums carry float noise (8.46 + 7.07), so every number is written back at three decimals
  return out.join('').replace(/-?\d*\.\d+/g, (n) => String(+Number(n).toFixed(3)));
};

const shape = (el) => {
  let s = el.replace(/\s*\/?>$/, '');
  s = s.replace(/\s(rx|ry)="[^"]*"/g, '');
  s = s.replace(/\sd="([^"]+)"/, (_, d) => ` d="${squareCorners(d)}"`);
  const crisp = /^<rect/.test(s) || (/^<line/.test(s) && (/x1="([^"]+)"[^>]*x2="\1"/.test(s) || /y1="([^"]+)"[^>]*y2="\1"/.test(s)));
  return `${s}${crisp ? ' shape-rendering="crispEdges"' : ''} vector-effect="non-scaling-stroke"/>`;
};

// run, not imported: the page's generator reads GROUPS without fetching
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
const symbols = [];
for (const [, icons] of GROUPS) for (const [id, name] of icons) {
  const svg = await (await fetch(BASE + name + '.svg')).text();
  const els = svg.match(/<(path|rect|circle|line|polyline|polygon|ellipse)\b[^>]*>/g);
  if (!els) throw new Error(`no shapes in ${name}`);
  symbols.push(`  <symbol id="${id}" viewBox="0 0 24 24"><!-- ${name} -->${els.map(shape).join('')}</symbol>`);
}

writeFileSync(new URL('../public/vendor/icons/feather/icons.svg', import.meta.url), `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor">
  <!-- public/vendor/icons/feather/icons.svg, the site's icons, written by tools/feather.mjs from Feather 4.29.2
       (MIT, LICENSE beside it), each symbol's comment its Feather name. What changed from the published files
       is in the tool's header: no stroke width, caps or joins, a non-scaling stroke, corners square, and crisp
       edges on rects and straight lines. Do not edit by hand; add a name to the tool and run it. -->
${symbols.join('\n')}
</svg>
`);
console.log(`${symbols.length} icons`);
}
