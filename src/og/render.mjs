// render.mjs: SVG to PNG on workerd through @resvg/resvg-wasm, trip's
// renderer (trip/astro-prod/src/lib/og-render.ts). The wasm arrives as a
// compiled module import, since a Worker may not compile one from bytes at
// run time, and is initialised once per isolate, since a second initWasm
// throws. workerd has no system fonts: the two faces are TTFs bundled as
// Data modules (the rules entry in wrangler.jsonc), made by tools/og-fonts.py.
import { initWasm, Resvg } from '@resvg/resvg-wasm';
import wasm from '@resvg/resvg-wasm/index_bg.wasm';
import sans from './fonts/instrument-sans.ttf';
import tag from './fonts/instrument-sans-condensed.ttf';

let ready = null;
let fonts = null;

export async function renderPng(svg, width) {
  await (ready ??= initWasm(wasm));
  fonts ??= [sans, tag].map((b) => new Uint8Array(b));
  // both objects live in wasm memory, which the garbage collector never sees, so each is freed by hand: unfreed,
  // every picture card left its decoded picture behind and a few renders later the isolate answered 1102 (2026-11-09)
  const r = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { fontBuffers: fonts, loadSystemFonts: false, defaultFontFamily: 'Instrument Sans' },
  });
  const img = r.render();
  try { return img.asPng(); } finally { img.free(); r.free(); }
}
