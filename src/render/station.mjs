// station.mjs: the radio page, /station, in Estonian and in the site's chrome
// (asked 2026-10-01: "when station is done, copy its content with
// functonality to the eccm page \"/station\", use eccm components (add table
// one)"). The station is positron's: its Worker is workers/station/worker.mjs,
// deployed as positron-station, with any number of channels. This module
// draws the page's bones and public/station.mjs fills them, since everything
// on it is the station's state, read from the station's own origin in the
// browser (it answers access-control-allow-origin * on every route).
//
// Each channel is a column holding the whole of that station, and nothing is
// said twice (asked 2026-10-01: "whole stations need to fit so single col.
// avoid dumplication and vertical jumps. reeatch similar radio statio uis"):
// its name and state, what is on, who, how far in, one Kuula or Peata, and
// the running order with the row on air marked. The shape is the one
// multi-channel stations use, NTS's two live channels side by side each with
// its play button and "Next on" list the nearest. The numbers about this
// page's own listening and its log go to the browser's console, not the page
// (asked 2026-10-01: "rm tehnilsied andmed").
import { html } from './html.mjs';
import { page, origin } from './chrome.mjs';
import { radioPath, W as OG_W, H as OG_H } from '../og/card.mjs';

export const renderStation = () => {
  const body = html`  <h1>Raadio</h1>
  <div class="station-cols" id="st-channels" role="group" aria-label="Kanalid">
    <p class="small" id="st-loading">Jaama loetakse.</p>
  </div>
  <script src="/vendor/hls-1.7.1.min.js"></script>
  <script type="module" src="/station.mjs"></script>`;
  // its own share card, the radio's (src/og/card.mjs), in place of the site's
  const head = html`<meta property="og:type" content="website">
<meta property="og:site_name" content="ECCM">
<meta property="og:title" content="Raadio ECCM">
<meta property="og:url" content="${origin()}/radio">
<meta property="og:image" content="${origin() + radioPath('et')}">
<meta property="og:image:width" content="${OG_W}">
<meta property="og:image:height" content="${OG_H}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:alt" content="Raadio, Eesti Nüüdismuusika Keskus">
<meta name="twitter:card" content="summary_large_image">`;
  return page({ lang: 'et', title: 'Raadio.', alternate: { lang: 'en', href: '/en/' }, body, wide: true, head });
};
