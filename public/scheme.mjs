// scheme.mjs: the detector of plans/plan-eccm-design-from-image.md, lifted
// out of derive.html on 2026-09-30 so that one copy of it runs everywhere a
// picture is read: the derive page, the editor's picture field (which reads
// an upload in the editor's own browser before the save) and
// tools/scheme.mjs (which reads the pictures already in D1 in headless
// Chrome). The rules are unchanged from derive.html; contract() at the foot
// turns a reading into the flat JSON media.scheme holds
// (plans/plan-eccm-social-images.md section 10, the shape chosen at session
// 3 of plans/plan-eccm-cms-step-1.md). DETECTOR_V is bumped by hand in the
// same commit as any change to readColour, readType or scheme.
export const DETECTOR_V = 1;

// ── colour arithmetic, the plan's §4 in code ─────────────────────────────
export const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
export const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
export const lum = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
export const contrast = (y1, y2) => (Math.max(y1, y2) + 0.05) / (Math.min(y1, y2) + 0.05);
export const hex = ([r, g, b]) => '#' + [r, g, b].map((c) => Math.round(Math.min(1, Math.max(0, gam(c))) * 255).toString(16).padStart(2, '0')).join('');
export const fromHex = (h) => [1, 3, 5].map((i) => lin(parseInt(h.slice(i, i + 2), 16) / 255));
export const toLab = ([r, g, b]) => {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
};
export const fromLab = ([L, a, b]) => {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s];
};
const inGamut = (rgb) => rgb.every((c) => c >= -0.0005 && c <= 1.0005);
export const lch = ([L, a, b]) => [L, Math.hypot(a, b), (Math.atan2(b, a) * 180 / Math.PI + 360) % 360];
export const fromLch = ([L, C, h]) => fromLab([L, C * Math.cos(h * Math.PI / 180), C * Math.sin(h * Math.PI / 180)]);
export const gamutLch = (L, C, h) => { let c = C, rgb = fromLch([L, c, h]); while (!inGamut(rgb) && c > 0.002) { c -= 0.002; rgb = fromLch([L, c, h]); } return { rgb, C: c }; };
export const INK = fromHex('#1a1a1a'), INK2 = fromHex('#555555'), WHITE = [1, 1, 1];
const Y_INK = lum(INK), Y_WHITE = 1;

// ── colour, on 64 px ─────────────────────────────────────────────────────
export const readColour = (img) => {
  const W = 64, H = Math.max(8, Math.round(64 * img.naturalHeight / img.naturalWidth));
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, W, H);
  const d = ctx.getImageData(0, 0, W, H).data;
  const px = [];
  for (let i = 0; i < d.length; i += 4) px.push([lin(d[i] / 255), lin(d[i + 1] / 255), lin(d[i + 2] / 255)]);
  const at = (x, y) => px[y * W + x];
  const labs = px.map(toLab);
  const chroma = labs.map((l) => Math.hypot(l[1], l[2]));
  const meanY = px.reduce((s, p) => s + lum(p), 0) / px.length;
  const meanC = chroma.reduce((s, v) => s + v, 0) / chroma.length;
  // the cast: the picture's mean colour as a hue and a chroma, which a
  // black and white photograph still has and the hue bins below cannot
  // see, since they count only pixels over 0.04
  const cast = (() => { const a = labs.reduce((s, l) => s + l[1], 0) / labs.length, b = labs.reduce((s, l) => s + l[2], 0) / labs.length; const [, C, hh] = lch([0, a, b]); return { C, h: hh }; })();
  const vivid = chroma.filter((v) => v >= 0.04).length / chroma.length;
  const bins = new Map();
  for (let i = 0; i < d.length; i += 4) { const k = ((d[i] >> 4) << 8) | ((d[i + 1] >> 4) << 4) | (d[i + 2] >> 4); bins.set(k, (bins.get(k) || 0) + 1); }
  const top = [...bins.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, n]) => ({ hex: '#' + [(k >> 8) & 15, (k >> 4) & 15, k & 15].map((v) => (v * 17).toString(16).padStart(2, '0')).join(''), share: n / px.length }));
  const edge = (pts) => {
    const ch = [0, 1, 2].map((i) => { const v = pts.map((p) => Math.round(gam(p[i]) * 255)).sort((a, b) => a - b); return v[v.length >> 1]; });
    const near = pts.filter((p) => [0, 1, 2].every((i) => Math.abs(Math.round(gam(p[i]) * 255) - ch[i]) <= 12)).length / pts.length;
    return { flat: near >= 0.97, share: near, rgb: ch.map((v) => lin(v / 255)) };
  };
  const rows = (ys) => ys.flatMap((y) => Array.from({ length: W }, (_, x) => at(x, y)));
  const cols = (xs) => xs.flatMap((x) => Array.from({ length: H }, (_, y) => at(x, y)));
  const edges = { top: edge(rows([0, 1])), bottom: edge(rows([H - 2, H - 1])), left: edge(cols([0, 1])), right: edge(cols([W - 2, W - 1])) };
  const flatAll = Object.values(edges).every((e) => e.flat);
  let seed = null;
  if (vivid >= 0.01) {
    const hb = Array.from({ length: 24 }, () => ({ n: 0, L: 0, a: 0, b: 0 }));
    labs.forEach((l, i) => { if (chroma[i] >= 0.04) { const h = (Math.atan2(l[2], l[1]) * 180 / Math.PI + 360) % 360; const b = hb[Math.floor(h / 15) % 24]; b.n++; b.L += l[0]; b.a += l[1]; b.b += l[2]; } });
    const best = hb.reduce((m, b) => (b.n > m.n ? b : m));
    seed = lch([best.L / best.n, best.a / best.n, best.b / best.n]);
    // every hue the picture has, strongest first, so a scheme can pass over
    // a muddy one for a purer one behind it (asked 2026-09-27: "Fall back to
    // nonmudsy detected colors first")
    var hues = hb.filter((b) => b.n >= 0.01 * labs.length).sort((a, b) => b.n - a.n).map((b) => ({ share: b.n / labs.length, lch: lch([b.L / b.n, b.a / b.n, b.b / b.n]) }));
  }
  return { meanY, meanC, vivid, cast, top, edges, flatAll, seed, hues: hues || [] };
};

// ── type, on up to 600 px: stroke contrast and feet, per text-like shape ──
export const readType = (img) => {
  const W = Math.min(600, img.naturalWidth), H = Math.round(W * img.naturalHeight / img.naturalWidth);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, W, H);
  const d = ctx.getImageData(0, 0, W, H).data;
  const Y = new Float32Array(W * H);
  let sum = 0;
  for (let i = 0, j = 0; i < d.length; i += 4, j++) { Y[j] = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255; sum += Y[j]; }
  const light = sum / (W * H) > 0.5;
  const mask = new Uint8Array(W * H);
  for (let j = 0; j < W * H; j++) mask[j] = light ? (Y[j] < 0.35 ? 1 : 0) : (Y[j] > 0.65 ? 1 : 0);
  // a horizontal run longer than a tenth of the width is a rule, not a
  // letter: the Gestures poster draws three through its words, and they
  // welded every letter into one shape on the first pass (MEASURED: 4
  // text-like shapes found on a poster with 17 letters)
  const LONG = Math.max(24, Math.round(W / 10));
  for (let y = 0; y < H; y++) { let len = 0; for (let x = 0; x <= W; x++) { const on = x < W && mask[y * W + x]; if (on) len++; else { if (len >= LONG) for (let k = x - len; k < x; k++) mask[y * W + k] = 0; len = 0; } } }
  // connected components, 8 neighbours, iterative
  const label = new Int32Array(W * H).fill(-1);
  const comps = [];
  const stack = [];
  for (let s = 0; s < W * H; s++) {
    if (!mask[s] || label[s] >= 0) continue;
    const id = comps.length;
    const comp = { id, pts: [], x0: W, x1: 0, y0: H, y1: 0 };
    stack.push(s); label[s] = id;
    while (stack.length) {
      const p = stack.pop(); const x = p % W, y = (p - x) / W;
      comp.pts.push(p); if (x < comp.x0) comp.x0 = x; if (x > comp.x1) comp.x1 = x; if (y < comp.y0) comp.y0 = y; if (y > comp.y1) comp.y1 = y;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const q = ny * W + nx; if (mask[q] && label[q] < 0) { label[q] = id; stack.push(q); }
      }
    }
    comps.push(comp);
  }
  // text-like: 7 to 80 px tall, not a line, not a blob, not a speck
  const shapes = comps.filter((k) => { const h = k.y1 - k.y0 + 1, w = k.x1 - k.x0 + 1; const fill = k.pts.length / (w * h); return h >= 7 && h <= 80 && w >= 3 && w <= 120 && w / h <= 2.5 && fill >= 0.15 && fill <= 0.75 && k.pts.length >= 16; });
  // type sits in lines: a shape counts only with three or more others of
  // a like height whose bottoms sit within a fifth of that height, which
  // no photograph's specks manage (MEASURED on the first pass: three
  // photographs read as serif from their grain)
  const text = shapes.filter((k) => { const h = k.y1 - k.y0 + 1; let mates = 0; for (const o of shapes) { if (o === k) continue; const oh = o.y1 - o.y0 + 1; if (Math.abs(o.y1 - k.y1) <= 0.2 * h && oh >= 0.6 * h && oh <= 1.6 * h && Math.abs(o.x0 - k.x0) <= 12 * h) mates++; } return mates >= 3; });
  const q = (arr, p) => { const a = [...arr].sort((x, y) => x - y); return a[Math.min(a.length - 1, Math.floor(p * a.length))]; };
  // a serif is read only on a letter 14 px tall or more with a stem of 3
  // px or more: below that a serif is one pixel, antialiasing is half a
  // stroke, and a capital's bar reads as a foot (MEASURED 2026-09-27 on the
  // Ludensemble poster at 300 px: letters 7 to 9 px tall, stems 2 px, 15 of
  // 15 read as serif in a geometric sans; asked: "why serif? no serifs on
  // image"); the same floor took the Huddersfield photograph's arrows, 2 px
  // strokes, out of a serif verdict they had made on their own
  const MIN_H = 14, MIN_STEM = 3;
  let serifish = 0, small = 0; const contrasts = [], feet = [];
  for (const k of text) {
    const h = k.y1 - k.y0 + 1;
    if (h < MIN_H) { small++; continue; }
    const runs = [], rowMax = new Map();
    for (let y = k.y0; y <= k.y1; y++) {
      let len = 0;
      for (let x = k.x0; x <= k.x1 + 1; x++) {
        const on = x <= k.x1 && label[y * W + x] === k.id;
        if (on) len++; else if (len) { runs.push(len); rowMax.set(y, Math.max(rowMax.get(y) || 0, len)); len = 0; }
      }
    }
    if (runs.length < 6) continue;
    const stem = q(runs, 0.5);
    if (stem < MIN_STEM) { small++; continue; }
    const strokes = runs.filter((r) => r <= 1.5 * stem + 1);
    if (strokes.length < 4) continue;
    const contrastRatio = (q(strokes, 0.9) - q(strokes, 0.1)) / Math.max(1, q(strokes, 0.5));
    const band = Math.max(1, Math.round(h * 0.14));
    const bottom = Math.max(...Array.from({ length: band }, (_, i) => rowMax.get(k.y1 - i) || 0));
    const top = Math.max(...Array.from({ length: band }, (_, i) => rowMax.get(k.y0 + i) || 0));
    const mid = Math.max(1, q(Array.from({ length: Math.max(1, k.y1 - k.y0 - 2 * band) }, (_, i) => rowMax.get(k.y0 + band + i) || 0), 0.5));
    // a bar the width of the glyph (E, L, T, D in any face) is not a foot:
    // a serif foot is a stem widened at its end and stays under seven
    // tenths of the glyph (MEASURED 2026-09-27: the Residentuur poster's
    // bold sans capitals, 19 px tall, carried "feet" of 13 to 15 px on 15
    // to 18 px glyphs and read 90 per cent serif; Sound Plasma's real
    // serifs run 11 to 15 px on 23 to 28 px glyphs and 9 of 11 pass either
    // way)
    const wG = k.x1 - k.x0 + 1;
    const asFoot = (run) => (run <= 0.7 * wG ? run : 0);
    const foot = Math.max(asFoot(bottom), asFoot(top)) / mid;
    contrasts.push(contrastRatio); feet.push(foot);
    if (contrastRatio >= 0.9 || foot >= 1.8) serifish++;
  }
  const n = contrasts.length;
  const share = n ? serifish / n : 0;
  const verdict = n >= 8 ? (share >= 0.45 ? 'serif' : share <= 0.25 ? 'sans' : 'unsure') : text.length >= 8 ? 'type too small to read for serifs' : 'no type found';
  return { verdict, n, found: text.length, small, share, contrast: n ? q(contrasts, 0.5) : 0, foot: n ? q(feet, 0.5) : 0, polarity: light ? 'dark type on light' : 'light type on dark', W, H };
};

// ── the scheme, §3 and §4 with the asks of 2026-09-27 ────────────────────
export const scheme = (r, t) => {
  let dark = r.meanY < 0.22;
  // a pure hue: chroma 0.08 or more and outside the yellow-to-brown band
  // (OKLCH hue 40 to 110), which reads as mud however dark it is (asked
  // 2026-09-27: "Discourage brownish muddiah tones pick purer daker
  // grayer")
  const isPure = (c) => c[1] >= 0.08 && !(c[2] >= 40 && c[2] <= 110);
  const pick = r.hues.find((x) => isPure(x.lch));
  // a dark picture that is not about black: no pure hue to make a dark
  // ground of, and a mid tone holding a real share of it, the wall behind
  // players dressed in black (asked 2026-09-27 of the Huddersfield
  // photograph, which had read as a pure dark grey: "that lighter tone can
  // be bg? maybe bitl ligtened nicely no to wash out. i do not now what
  // the rule could be but image in general is not about black"); the mid
  // tone is the ground and the scheme is light. White type on a black
  // poster does not count as a wall, which is what the 0.85 ceiling is for
  let wall = null;
  if (dark && !pick) {
    wall = r.top.map((c) => ({ ...c, y: lum(fromHex(c.hex)) })).filter((c) => c.share >= 0.05 && c.y >= 0.25 && c.y < 0.85).sort((a, b) => b.y - a.y)[0] || null;
    if (wall) dark = false;
  }
  const s = { mode: dark ? 'dark' : 'light', notes: [], wall };
  if (dark) {
    // a dark ground of the picture's pure hue, otherwise a pure dark grey
    const g = pick ? gamutLch(0.28, Math.min(pick.lch[1], 0.06), pick.lch[2]) : { rgb: fromHex('#262626') };
    s.ground = g.rgb;
    s.groundNote = pick ? `the picture’s hue ${Math.round(pick.lch[2])} at OKLCH lightness 0.28${pick !== r.hues[0] ? `, passing over its stronger hue ${Math.round(r.hues[0].lch[2])} as mud` : ''}` : r.seed ? `a pure dark grey; none of the picture’s ${r.hues.length} hues is both strong and clean` : 'a pure dark grey, the picture has no hue';
    s.pure = !!pick; s.pickHue = pick ? pick.lch : null;
    s.ink = WHITE; s.ink2 = fromHex('#c9c9c9');
    while (contrast(lum(s.ink2), lum(s.ground)) < 4.5) s.ink2 = s.ink2.map((c) => c + (1 - c) * 0.1);
    s.onAccentIsInk = true;
  } else {
    s.ink = INK; s.ink2 = INK2; s.onAccentIsInk = false;
    const es = Object.values(r.edges);
    // a light ground: the picture's own flat edge, or its lightest big
    // colour, taken most of the way to white so a breath of its colour is
    // left (asked 2026-09-27: "Prefer ligher tones but with bit color like
    // leftmost on light bgs"); a grey picture whose own ground is white
    // gets the page's white and no grey at all ("Iimpeo: shoild be black on
    // white. See the logo no grays realky")
    const flatBase = r.flatAll ? [0, 1, 2].map((i) => es.reduce((q, e) => q + e.rgb[i], 0) / 4) : null;
    const big = r.top[0], bigRgb = fromHex(big.hex), bigY = lum(bigRgb);
    // a flat edge that is not white is the ground before anything else is
    // asked, however little chroma the picture has: the Gestures sage is
    // 77 per cent of its poster at chroma 0.010 and was read as grey once
    if (wall) {
      // the wall taken half way to white, with a little of its colour
      // kept: lightened, not washed out
      const [L0, C0, h0] = lch(toLab(fromHex(wall.hex)));
      s.ground = gamutLch(L0 + (1 - L0) * 0.5, Math.min(C0, 0.03), h0).rgb;
      s.groundNote = `the picture’s mid tone ${wall.hex}, ${Math.round(100 * wall.share)} per cent of it, taken half way to white with its chroma kept to 0.03; the picture is not about black`;
      while (contrast(lum(s.ink2), lum(s.ground)) < 4.5) s.ink2 = s.ink2.map((c) => c * 0.9);
    } else if (flatBase && contrast(Y_WHITE, lum(flatBase)) >= 1.1) {
      const [L0, C0, h0] = lch(toLab(flatBase));
      s.ground = gamutLch(Math.max(0.95, L0 + (1 - L0) * 0.6), Math.min(C0, 0.02), h0).rgb;
      s.groundNote = `the flat edge ${hex(flatBase)} taken most of the way to white, chroma capped at 0.02`;
    } else if (r.meanC < 0.02 && bigY >= 0.85 && big.share >= 0.5) {
      s.ground = WHITE; s.groundNote = 'white, the picture’s own ground is white and it has no hue';
    } else if (r.meanC < 0.02) {
      // a grey picture with a faint cast keeps it, as a hue at a chroma too
      // small to name and too large to miss (asked 2026-09-27 of the
      // Varssavi photograph, players in black on a light grey wall that had
      // come out neutral: "missing a small pinkish hue here")
      if (r.cast.C >= 0.006) {
        const C = Math.min(0.015, Math.max(0.008, r.cast.C));
        s.ground = gamutLch(0.94, C, r.cast.h).rgb;
        s.groundNote = `a light grey with the picture’s faint cast, hue ${Math.round(r.cast.h)} at chroma ${C.toFixed(3)}`;
      } else { s.ground = fromHex('#ededed'); s.groundNote = 'a light grey, the picture has no hue'; }
    } else {
      const from = bigY >= 0.5 ? bigRgb : null;
      if (from) {
        const [L0, C0, h0] = lch(toLab(from));
        s.ground = gamutLch(Math.max(0.95, L0 + (1 - L0) * 0.6), Math.min(C0, 0.02), h0).rgb;
        s.groundNote = `the lightest big colour ${hex(from)} taken most of the way to white, chroma capped at 0.02`;
      } else {
        s.ground = gamutLch(0.96, 0.015, r.seed[2]).rgb; s.groundNote = `a light tint of the picture’s hue ${Math.round(r.seed[2])}`;
      }
    }
  }
  // the accent: the seed's hue and chroma, toned until it reads where it is used
  s.accent = null;
  if (r.seed && r.meanC >= 0.02 && (!dark || s.pure)) {
    const src = (dark && s.pickHue) || (r.hues.find((x) => !(x.lch[2] >= 40 && x.lch[2] <= 110) && x.lch[1] >= 0.04) || {}).lch || r.seed;
    const [, C, h] = src;
    const yg = lum(s.ground);
    const ok = dark
      ? (y) => contrast(y, yg) >= 3 && contrast(y, Y_INK) >= 4.5 && y <= 0.6      // an underline on the dark ground, ink text on the filled button
      : (y) => contrast(y, yg) >= 3 && contrast(y, Y_INK) >= 3 && y <= 0.35; // an underline that stands off the ground and off the ink
    for (let L = dark ? 0.45 : 0.30; L <= 0.9 && !s.accent; L += 0.005) {
      const g = gamutLch(L, C, h);
      if (g.C >= 0.04 && ok(lum(g.rgb))) s.accent = { rgb: g.rgb, L, C: g.C, h };
    }
    if (!s.accent) s.notes.push('no tone of the hue keeps 0.04 chroma inside the window');
  } else s.notes.push(dark && r.seed ? 'no accent, the hue is too weak or too muddy for one' : 'no accent, the picture is grey');
  // the filled button is the ground's inverse, ink on white or white on the
  // dark ground, never the accent (asked 2026-09-27: "Readability issues on
  // a purchase button", of an accent-filled one); the accent stays on
  // underlines and the focus ring
  s.btnFill = dark ? WHITE : INK; s.onBtn = dark ? INK : WHITE;
  // the faces: a serif for a serif-typed graphic, in the title and facts; in
  // the body only on a light ground
  s.serif = t.verdict === 'serif' || !!r.serifByHand;
  s.serifHow = t.verdict === 'serif' ? 'the detector read the type as serif' : r.serifByHand ? 'marked serif by hand, the detector found no type: the letters lie on the dark disc under three rules' : '';
  return s;
};
// the serif a derived page takes, Newsreader since 2026-09-28, with the two
// alternatives derive.html switches to on ?serif=
export const SERIFS = { newsreader: { name: 'Newsreader', family: "'Newsreader', Georgia, serif", weight: 400 }, literata: { name: 'Literata', family: "'Literata', Georgia, serif", weight: 400 }, roboto: { name: 'Roboto Serif', family: "'Roboto Serif', Georgia, serif", weight: 400 } };

// the body takes the serif only on a ground near white; on a darker light
// ground, the Gestures sage, it stays in the sans, the same legibility rule
// as on a dark ground (asked 2026-09-27)
export const bodySerif = (s) => s.serif && s.mode === 'light' && lum(s.ground) >= 0.8;

// a reading as the row stores it: the nine values the event page sets as
// --ev-* properties, the mode and the serif, and the readings kept so a false
// verdict can be argued with later; nothing renders from those
export const contract = (r, t, s, face = SERIFS.newsreader) => ({
  v: DETECTOR_V,
  detector: 'derive 2026-09-27',
  mode: s.mode,
  ground: hex(s.ground), ink: hex(s.ink), ink2: hex(s.ink2),
  accent: s.accent ? hex(s.accent.rgb) : null,
  btnFill: hex(s.btnFill), onBtn: hex(s.onBtn),
  titleFace: s.serif ? face.family : null,
  titleWeight: s.serif ? String(face.weight) : null,
  bodyFace: bodySerif(s) ? face.family : null,
  serif: s.serif,
  notes: [s.groundNote, ...s.notes].filter(Boolean),
  readings: {
    meanY: +r.meanY.toFixed(3), meanC: +r.meanC.toFixed(4), cast: { h: Math.round(r.cast.h), C: +r.cast.C.toFixed(4) }, top: r.top.map((c) => ({ hex: c.hex, share: +c.share.toFixed(3) })),
    type: { verdict: t.verdict, found: t.found, n: t.n, share: +t.share.toFixed(2) },
  },
  computed_at: new Date().toISOString().slice(0, 19) + 'Z',
});

// the whole reading of one decoded picture, which is what the editor and
// the tool call; hand: { serif: true } for a picture whose letters the
// detector cannot see (derive.html's serifByHand)
export const read = (img, hand = {}) => {
  const r = readColour(img);
  r.serifByHand = !!hand.serif;
  const t = readType(img);
  return { r, t, s: scheme(r, t) };
};
