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
// its play button and "Next on" list the nearest; the numbers about this
// page's own listening and the log live once, folded, under the columns.
import { html } from './html.mjs';
import { page } from './chrome.mjs';

export const renderStation = () => {
  const body = html`  <h1>Raadio</h1>
  <p class="note">Iga kanal on oma veerus: mis on eetris, kes, ja mis tuleb järgmisena.</p>
  <div class="station-cols" id="st-channels" role="group" aria-label="Kanalid">
    <p class="small" id="st-loading">Jaama loetakse.</p>
  </div>
  <details class="station-tech">
    <summary>Tehnilised andmed</summary>
    <dl class="facts station-read">
      <div><dt>Otsest maas</dt><dd id="st-behind"></dd></div>
      <div><dt>Kiirus</dt><dd id="st-advance"></dd></div>
      <div><dt>Saatevahetusi</dt><dd id="st-crossed"></dd></div>
      <div><dt>Mängija</dt><dd id="st-engine"></dd></div>
    </dl>
    <ol class="edit-list station-log" id="st-log"></ol>
  </details>
  <script src="/vendor/hls-1.7.1.min.js"></script>
  <script type="module" src="/station.mjs"></script>`;
  return page({ lang: 'et', title: 'Raadio.', alternate: { lang: 'en', href: '/en/' }, body, wide: true });
};
