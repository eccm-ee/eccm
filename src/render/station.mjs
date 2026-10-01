// station.mjs: the radio page, /station, in Estonian and in the site's chrome
// (asked 2026-10-01: "when station is done, copy its content with
// functonality to the eccm page \"/station\", use eccm components (add table
// one)"). The station is positron's: its page is demo/station/index.html
// there, live at https://positron.studio/station/, and its Worker is
// workers/station/worker.mjs, deployed as positron-station. This module draws
// the page's bones and public/station.mjs fills them, since everything on it
// is the station's state, read from the station's own origin in the browser;
// the station sends access-control-allow-origin * on every route, so nothing
// is proxied through this Worker. The station has channels since 2026-10-01
// (the owner: "Note we run multiple channels", "Can be n channels"): the
// switch above the title is filled from the station's /channels.json and the
// chosen one is in the address as ?k=<name>, the default channel when absent. Rendered here rather than kept as a static
// file so the header, the menu and the footer are the ones every other page
// draws (src/render/chrome.mjs).
import { html } from './html.mjs';
import { page } from './chrome.mjs';

export const renderStation = () => {
  const body = html`  <h1>Raadio</h1>
  <p class="note">Üks voog, mille järjekorra kirjutab tekstifail: millised sekundid millisest salvestusest tulevad järgmisena.</p>
  <div class="station">
  <section class="station-now">
    <nav class="station-channels" id="st-channels" aria-label="Kanalid" hidden></nav>
    <div aria-live="polite">
      <p class="small" id="st-air">Jaama olekut veel ei tea.</p>
      <p class="station-title" id="st-title">Eetrist väljas</p>
      <p class="station-who" id="st-who"></p>
    </div>
    <div class="actions">
      <button class="btn btn-pri" type="button" id="st-play" aria-pressed="false">Kuula</button>
    </div>
    <dl class="facts station-read">
      <div><dt>Saates</dt><dd id="st-into"></dd></div>
      <div><dt>Otsest maas</dt><dd id="st-behind"></dd></div>
      <div><dt>Kiirus</dt><dd id="st-advance"></dd></div>
      <div><dt>Saatevahetusi</dt><dd id="st-crossed"></dd></div>
    </dl>
    <p class="small station-read-say" id="st-read-say">Otsest maas, kiirus ja saatevahetused ilmuvad, kui vajutad Kuula.</p>
  </section>

  <section>
    <h2>Kava</h2>
    <p class="note" id="st-order-say">Kava loetakse jaamast.</p>
    <div class="table" id="st-order" hidden>
      <table>
        <thead><tr><th scope="col">Algus</th><th scope="col">Lõpp</th><th scope="col" class="num">Kestus</th><th scope="col" class="main">Saade</th><th scope="col">Kes</th><th scope="col">Liik</th></tr></thead>
        <tbody></tbody>
      </table>
    </div>
  </section>

  <section>
    <h2>Logi</h2>
    <ol class="edit-list station-log" id="st-log"></ol>
  </section>
  </div>
  <script src="/vendor/hls-1.7.1.min.js"></script>
  <script type="module" src="/station.mjs"></script>`;
  return page({ lang: 'et', title: 'Raadio.', alternate: { lang: 'en', href: '/en/' }, body, wide: true });
};
