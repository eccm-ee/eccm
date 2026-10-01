// render.mjs: SVG to PNG on workerd through @resvg/resvg-wasm, trip's
// renderer (trip/astro-prod/src/lib/og-render.ts). The wasm arrives as a
// compiled module import, since a Worker may not compile one from bytes at
// run time, and is initialised once per isolate, since a second initWasm
// throws. workerd has no system fonts: the three faces are TTFs bundled as
// Data modules (the rules entry in wrangler.jsonc), made by tools/og-fonts.py.
import { initWasm, Resvg } from '@resvg/resvg-wasm';
import wasm from '@resvg/resvg-wasm/index_bg.wasm';
import sans from './fonts/schibsted-grotesk.ttf';
import serif from './fonts/newsreader-display.ttf';
import serifText from './fonts/newsreader-text.ttf';

let ready = null;
let fonts = null;

export async function renderPng(svg, width) {
  await (ready ??= initWasm(wasm));
  fonts ??= [sans, serif, serifText].map((b) => new Uint8Array(b));
  return new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { fontBuffers: fonts, loadSystemFonts: false, defaultFontFamily: 'Schibsted Grotesk' },
  }).render().asPng();
}
