// station.mjs: the radio page, /radio, in English (asked 2026-10-02: "convert all admin
// pages to english only") and in the site's chrome
// (asked 2026-10-01: "when station is done, copy its content with
// functonality to the eccm page \"/station\", use eccm components (add table
// one)"). The station is this site's own since 2026-10-02, src/station/station.mjs
// at /stream, moved from positron's workers/station, with any number of
// channels. This module draws the page's bones and public/station.mjs fills
// them, since everything on it is the station's state, read from /stream in the
// browser.
//
// Each channel is a column holding the whole of that station, and nothing is
// said twice (asked 2026-10-01: "whole stations need to fit so single col.
// avoid dumplication and vertical jumps. reeatch similar radio statio uis"):
// its name and state, what is on, who, how far in, one Listen or Stop, and
// the running order with the row on air marked. The shape is the one
// multi-channel stations use, NTS's two live channels side by side each with
// its play button and "Next on" list the nearest. The numbers about this
// page's own listening and its log go to the browser's console, not the page
// (asked 2026-10-01: "rm tehnilsied andmed").
import { html } from './html.mjs';
import { page, origin } from './chrome.mjs';
import { radioPath, W as OG_W, H as OG_H } from '../og/card.mjs';
import { table } from './table.mjs';
import { dayMonth, clock } from './dates.mjs';

// a moment as Tallinn's wall clock, YYYY-MM-DDTHH:MM, the shape dates.mjs reads
const LOCAL = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Tallinn', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
const local = (ms) => LOCAL.format(new Date(ms)).replace(' ', 'T');
const length = (s) => { s = Math.round(s); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = String(s % 60).padStart(2, '0'); return h ? `${h}:${String(m).padStart(2, '0')}:${x}` : `${m}:${x}`; };

// the live shows kept by src/radio.mjs (asked 2026-10-02: "how to save live input
// radio to be replayed later?"), newest first; one still on air or being joined
// is listed with what it is doing in place of the button
const kept = (shows) => {
  if (!shows.length) return html`<p class="small">No live shows have been recorded yet. Every live show is recorded here when it ends.</p>`;
  return table({
    label: 'Recordings',
    cols: [{ label: 'Start' }, { label: 'Show', cls: 'main' }, { label: 'Length', cls: 'num' }, { label: '' }],
    rows: shows.map((x) => {
      const at = local(x.started_at);
      const act = x.status === 'done'
        ? html`<button class="btn btn-sm" type="button" data-show="/radio/${x.id}.mp3" data-title="${x.title}">Listen</button>`
        : x.status === 'rec' ? 'on air' : 'processing';
      return [`${dayMonth(at, 'en')} ${clock(at, 'en')}`, x.title, length(x.dur), act];
    }),
  });
};

export const renderStation = (shows = []) => {
  const body = html`  <h1>Radio</h1>
  <div class="station-cols" id="st-channels" role="group" aria-label="Channels">
    <p class="small" id="st-loading">Loading the station.</p>
  </div>
  <section class="station-kept" id="st-kept">
    <h2>Recordings</h2>
    ${kept(shows)}
  </section>
  <script src="/vendor/hls-1.7.1.min.js"></script>
  <script type="module" src="/station.mjs"></script>`;
  // its own share card, the radio's (src/og/card.mjs), in place of the site's
  const head = html`<meta property="og:type" content="website">
<meta property="og:site_name" content="ECCM">
<meta property="og:title" content="ECCM Radio">
<meta property="og:url" content="${origin()}/radio">
<meta property="og:image" content="${origin() + radioPath('en')}">
<meta property="og:image:width" content="${OG_W}">
<meta property="og:image:height" content="${OG_H}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:alt" content="Radio, Estonian Centre of Contemporary Music">
<meta name="twitter:card" content="summary_large_image">`;
  return page({ lang: 'en', title: 'Radio.', body, wide: true, head });
};
