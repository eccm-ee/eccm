// partners.mjs: the browser half of the logo processing on the Logos page,
// /edit/partners (asked 2026-11-07: "make a admin page to upload logos (add
// processing like you did for muusikalinn etc), have bw and color optoins").
// It runs where public/scheme.mjs runs, in the editor's browser on upload,
// because a Worker has no canvas. A PNG or JPEG chosen as the logo is scaled
// down to 192 px tall, never up, the way the EU files were scaled with sips
// (public/partners/SOURCE.md), with a PNG's empty transparent margin cut first;
// and unless an own black-and-white file is chosen, its mask is made beside it
// and sent as bw_auto. A PNG or JPEG chosen as the black-and-white version is
// made a mask the same way. An SVG is sent as it is: the Worker sanitizes it
// and sets its paints to currentColor (src/partners.mjs).
//
// The mask is black on transparent, its opacity the source's opacity times
// its darkness, so black type is solid, a white ground vanishes, and a light
// colour on a dark one (the EU flag's stars) stays a lighter shape inside it.
// A logo that is light all over (a white negative) would vanish that way, so
// when the mask keeps under a sixth of the source's opacity its shape is used
// instead. The event page draws it in the ink with CSS mask, the footer
// with the theme's invert, so no white twin is stored.
export const HEIGHT = 192;
const RASTER = /^image\/(png|jpeg)$/;

const canvasOf = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const blobOf = (c) => new Promise((ok, no) => c.toBlob((b) => (b ? ok(b) : no(new Error('toBlob'))), 'image/png'));
// relative luminance of an sRGB pixel, 0 for black and 1 for white
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const LUM = Array.from({ length: 256 }, (_, v) => lin(v));
const lum = (d, i) => 0.2126 * LUM[d[i]] + 0.7152 * LUM[d[i + 1]] + 0.0722 * LUM[d[i + 2]];

// the box of everything not fully transparent, or the whole picture when nothing is
function inkBox(data, w, h) {
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (data[(y * w + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  return x1 < 0 ? { x: 0, y: 0, w, h } : { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

// the scaled colour picture as a canvas: trimmed, then down to HEIGHT
export async function scaled(file) {
  const bmp = await createImageBitmap(file);
  const src = canvasOf(bmp.width, bmp.height), sx = src.getContext('2d', { willReadFrequently: true });
  sx.drawImage(bmp, 0, 0);
  const box = file.type === 'image/png' ? inkBox(sx.getImageData(0, 0, bmp.width, bmp.height).data, bmp.width, bmp.height) : { x: 0, y: 0, w: bmp.width, h: bmp.height };
  const h = Math.min(HEIGHT, box.h), w = Math.max(1, Math.round(box.w * h / box.h));
  const out = canvasOf(w, h), ox = out.getContext('2d', { willReadFrequently: true });
  ox.imageSmoothingQuality = 'high';
  ox.drawImage(src, box.x, box.y, box.w, box.h, 0, 0, w, h);
  return out;
}

// the mask of a canvas, a new canvas of the same size
export function mask(c) {
  const ctx = c.getContext('2d', { willReadFrequently: true });
  const img = ctx.getImageData(0, 0, c.width, c.height), d = img.data;
  const dark = new Uint8ClampedArray(d.length / 4);
  let kept = 0, had = 0;
  for (let i = 0, k = 0; i < d.length; i += 4, k++) { dark[k] = d[i + 3] * (1 - lum(d, i)); kept += dark[k]; had += d[i + 3]; }
  const shape = kept < had / 6;
  const out = canvasOf(c.width, c.height), ox = out.getContext('2d');
  const m = ox.createImageData(c.width, c.height);
  for (let i = 0, k = 0; i < d.length; i += 4, k++) m.data[i + 3] = shape ? d[i + 3] : dark[k];
  ox.putImageData(m, 0, 0);
  return out;
}

const asFile = (blob, name) => new File([blob], name.replace(/\.\w+$/, '') + '.png', { type: 'image/png' });
const put = (input, file) => { const dt = new DataTransfer(); if (file) dt.items.add(file); input.files = dt.files; };

// the preview beside a field: what will be stored, the black-and-white one on the ink
function show(form, name, blob, bw = false) {
  const box = form.querySelector(`.logo-prev[data-for="${name}"]`);
  if (!box) return;
  const url = URL.createObjectURL(blob);
  box.replaceChildren();
  if (bw) { const s = document.createElement('span'); s.className = 'logo logo-bw'; s.style.setProperty('--src', `url("${url}")`); box.append(s); const i = new Image(); i.onload = () => { s.style.aspectRatio = `${i.naturalWidth} / ${i.naturalHeight}`; }; i.src = url; }
  else { const i = document.createElement('img'); i.className = 'logo'; i.alt = ''; i.src = url; box.append(i); }
}

// wires one Logos form; a failure leaves the file as chosen, which the Worker stores unprocessed
export function attach(form) {
  if (!form) return;
  const color = form.querySelector('[name="color_file"]'), own = form.querySelector('[name="bw_file"]'), auto = form.querySelector('[name="bw_auto"]'), dark = form.querySelector('[name="dark_file"]');
  let busy = Promise.resolve();
  const step = (fn) => { busy = busy.then(fn).catch((e) => console.error('logo processing', e)); };
  color.addEventListener('change', () => step(async () => {
    const f = color.files[0];
    put(auto, null);
    if (!f) return;
    if (!RASTER.test(f.type) || f.processed) { show(form, 'color_file', f); if (!own.files[0]) show(form, 'bw_file', f, true); return; }
    const c = await scaled(f);
    const cf = asFile(await blobOf(c), f.name); cf.processed = true;
    put(color, cf);
    show(form, 'color_file', cf);
    const m = await blobOf(mask(c));
    put(auto, asFile(m, `${f.name}-bw`));
    if (!own.files[0]) show(form, 'bw_file', m, true);
  }));
  own.addEventListener('change', () => step(async () => {
    const f = own.files[0];
    if (!f) return;
    if (!RASTER.test(f.type) || f.processed) { show(form, 'bw_file', f, true); return; }
    const m = asFile(await blobOf(mask(await scaled(f))), f.name); m.processed = true;
    put(own, m);
    show(form, 'bw_file', m, true);
  }));
  dark.addEventListener('change', () => step(async () => {
    const f = dark.files[0];
    if (!f) return;
    if (!RASTER.test(f.type) || f.processed) { show(form, 'dark_file', f); return; }
    const d = asFile(await blobOf(await scaled(f)), f.name); d.processed = true;
    put(dark, d);
    show(form, 'dark_file', d);
  }));
  // the form waits for a picture still being processed, so what is sent is what the preview shows
  form.addEventListener('submit', (e) => {
    if (form.dataset.ready) return;
    e.preventDefault();
    const by = e.submitter;
    busy.then(() => { form.dataset.ready = '1'; form.requestSubmit(by); });
  });
}
