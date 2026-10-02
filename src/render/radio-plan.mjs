// radio-plan.mjs: /radio/kava, the radio's programming page as a sketch
// (asked 2026-10-02: "do a page with radio ui, does not have to work. also put
// radio ui links below"). Nothing on it saves or reads the station: the week,
// the slot, the episodes and the warnings are written out here. Its shape is
// what plans/plan-eccm-radio-research.md section 5 took from the tools it read:
// a week of typed slots per channel (Radiocult's calendar, Rivendell's one grid
// per channel), the loop as one named block (Dublab, Cashmere), a live slot
// that holds its artists, a broadcaster key good only inside the slot, a
// fallback and recording on by default (Radiocult), an episode made with the
// slot that the recording lands in and that turns into "listen back" (NTS),
// a replay as a slot pointing at an episode (Rivendell), and the gaps flagged
// on the grid (LibreTime). Below it, the pages of those tools it came from.
import { html } from './html.mjs';
import { page } from './chrome.mjs';
import { table } from './table.mjs';

const CHANNELS = [['UbuWeb', true], ['Toonid', false], ['Otse proov', false]];

// the week of 5 to 11 October 2026, 12.00 to 24.00, each day filled end to end;
// kind is loop, live, rerun or file, and warn is what the check found
const LOOP = 'UbuWeb, helipoeesia';
const WEEK = [
  ['E', '5. okt', [[12, 24, 'loop', LOOP]]],
  ['T', '6. okt', [[12, 19, 'loop', LOOP], [19, 21, 'live', 'Stuudiost otse', 'Mari Kalkun'], [21, 24, 'loop', LOOP]]],
  ['K', '7. okt', [[12, 14, 'rerun', 'Kordus: Stuudiost otse', '6. okt saade'], [14, 24, 'loop', LOOP]]],
  ['N', '8. okt', [[12, 18, 'loop', LOOP], [18, 20, 'file', 'Ludens: Grisey ja Riley', 'kontserdilt'], [20, 22, 'live', 'Öine kuulamine', null, 'Saatja puudub'], [22, 24, 'loop', LOOP]]],
  ['R', '9. okt', [[12, 20, 'loop', LOOP], [20, 23, 'live', 'Klubiõhtu otse', 'Sander Mölder', null, true], [23, 24, 'loop', LOOP]]],
  ['L', '10. okt', [[12, 16, 'rerun', 'Kordus: Klubiõhtu otse', '9. okt saade', 'Salvestis puudub veel'], [16, 24, 'loop', LOOP]]],
  ['P', '11. okt', [[12, 24, 'loop', LOOP]]],
];
const KIND = { loop: 'Tsükkel', live: 'Otse', rerun: 'Kordus', file: 'Salvestis' };
const hh = (h) => `${String(h % 24).padStart(2, '0')}.00`;

const slot = ([from, to, kind, title, who, warn, current]) => html`<li class="rk-slot rk-${kind}" style="--h: ${to - from}"${current ? html` aria-current="true"` : ''}>
          <span class="rk-meta"><span>${hh(from)}–${hh(to)}</span><span>${KIND[kind]}</span></span>
          <span class="rk-title">${title}</span>
          ${who ? html`<span class="rk-who">${who}</span>` : ''}
          ${warn ? html`<span class="rk-warn">${warn}</span>` : ''}
        </li>`;

const week = html`<div class="rk-week" role="group" aria-label="Nädal">
    ${WEEK.map(([d, date, slots]) => html`<section class="rk-day">
      <h3><span>${d}</span> ${date}</h3>
      <ol>
        ${slots.map(slot)}
      </ol>
    </section>`)}
  </div>`;

const field = (id, label, control, hint) => html`<div class="field">
        <label for="${id}">${label}</label>
        ${control}
        ${hint ? html`<p class="hint">${hint}</p>` : ''}
      </div>`;

// the slot on Friday evening, opened: everything a live slot holds
const form = html`<form class="form form-wide rk-form" onsubmit="return false">
    <div class="fields">
      ${field('rk-title', 'Saate nimi', html`<input id="rk-title" value="Klubiõhtu otse">`)}
      ${field('rk-kind', 'Liik', html`<select id="rk-kind"><option>Otse</option><option>Kordus</option><option>Salvestis</option><option>Tsükkel</option></select>`)}
      <div class="field-row">
        ${field('rk-day', 'Päev', html`<input id="rk-day" type="date" value="2026-10-09">`)}
        ${field('rk-from', 'Algus', html`<input id="rk-from" type="time" value="20:00">`)}
        ${field('rk-to', 'Lõpp', html`<input id="rk-to" type="time" value="23:00">`)}
      </div>
      ${field('rk-who', 'Tegijad', html`<input id="rk-who" value="Sander Mölder">`, 'Nimed komadega. Iga nimi saab oma lehe, kus on tema saated.')}
      ${field('rk-fallback', 'Kui saatjat ei ole', html`<select id="rk-fallback"><option>UbuWeb, helipoeesia</option><option>Vaikus</option><option>Viimane kordus</option></select>`, 'Mis kõlab, kui saatja ei ühendu või katkeb.')}
      ${field('rk-key', 'Saatja võti', html`<input id="rk-key" value="eccm-klubi-7f3a-91c2" readonly>`, 'Kehtib ainult reedel 20.00–23.00. Saate lõpus katkestatakse ühendus.')}
      ${field('rk-url', 'Episoodi aadress', html`<input id="rk-url" value="/raadio/klubiohtu-otse/2026-10-09" readonly>`, 'Luuakse koos saatega. Pärast saadet on seal järelkuulamine.')}
      <fieldset class="field">
        <legend>Salvestamine</legend>
        <div class="radios"><label><input type="radio" name="rk-rec" checked> Salvesta ja avalda</label><label><input type="radio" name="rk-rec"> Salvesta, ära avalda</label><label><input type="radio" name="rk-rec"> Ära salvesta</label></div>
      </fieldset>
    </div>
    <div class="actions"><button class="btn" type="button" disabled>Salvesta</button><button class="btn" type="button" disabled>Lisa kordus</button></div>
  </form>`;

const episodes = table({
  label: 'Episoodid',
  cols: [{ label: 'Eetris' }, { label: 'Saade', cls: 'main' }, { label: 'Kestus', cls: 'num' }, { label: 'Olek' }],
  rows: [
    ['9. okt 20.00', 'Klubiõhtu otse', '', 'ootab saadet'],
    ['6. okt 19.00', 'Stuudiost otse', '1:58:40', 'järelkuulatav'],
    ['1. okt 21.00', 'Proovisaade', '0:45', 'avaldamata'],
    ['29. sept 19.00', 'Stuudiost otse', '2:00:12', 'järelkuulatav'],
  ],
});

const warnings = html`<ul class="rk-checks">
    <li><b>N 8. okt 20.00</b> Öine kuulamine: saatja puudub. Võti on loodud, kuid kellelegi antud ei ole.</li>
    <li><b>L 10. okt 12.00</b> Kordus: Klubiõhtu otse. Salvestist veel ei ole, saade on reedel. Kui see ei õnnestu, mängib tsükkel.</li>
    <li><b>Toonid</b> Kanalil ei ole sel nädalal ühtegi otsesaadet.</li>
  </ul>`;

// the tools plans/plan-eccm-radio-research.md read, each at the page that shows its programming screen
const REFS = [
  ['Radiocult', 'nädala kalender liigiga saadetest, saatja ühendub ainult oma saate ajal, salvestus saate kaupa', [
    ['Kava koostamine', 'https://help.radiocult.fm/article/84-scheduling-your-stations-events'],
    ['Otse minek', 'https://help.radiocult.fm/article/88-going-live'],
    ['Saate salvestamine', 'https://help.radiocult.fm/article/7-recording-an-event'],
    ['Võimalused', 'https://www.radiocult.fm/features/scheduling'],
  ]],
  ['LibreTime', 'kalender, mis näitab, kas saade on tühi, pooleli või eetris', [
    ['Kalender', 'https://libretime.org/docs/user-manual/calendar/'],
    ['Saadete ajastamine', 'https://libretime.org/docs/user-manual/scheduling-shows/'],
    ['Otseülekanne', 'https://libretime.org/docs/user-manual/live-broadcast/'],
    ['Eetrilogi', 'https://libretime.org/docs/user-manual/playout-history/'],
  ]],
  ['AzuraCast', 'saatja on konto oma ajavahemikega, salvestused on saatja juures, mitte kavas', [
    ['Saatjad', 'https://www.azuracast.com/docs/user-guide/streamers-and-djs/'],
    ['Esitusloendid', 'https://www.azuracast.com/docs/user-guide/playlists/'],
    ['Salvestis tagasi eetrisse', 'https://github.com/AzuraCast/AzuraCast/discussions/7219'],
  ]],
  ['Radio.co', 'salvestus läheb ise meediakogusse, nimeks kellaaeg', [
    ['Sündmuste ajastamine', 'https://help.radio.co/en/articles/1044910-scheduling-events'],
    ['Otsesaade', 'https://help.radio.co/en/articles/899730-schedule-a-live-event'],
    ['Salvestamine', 'https://www.radio.co/blog/schedule-radio-shows-record-live'],
  ]],
  ['Rivendell', 'iga kanal oma 7 × 24 tunnikellade ruudustik, salvestus läheb kogusse, kuhu kava juba viitab', [
    ['Ruudustikud', 'https://opsguide.rivendellaudio.org/html/sect.rdlogmanager.grids.html'],
    ['Kavahaldur', 'https://opsguide.rivendellaudio.org/html/chapter.rdlogmanager.html'],
    ['Salvestaja', 'https://opsguide.rivendellaudio.org/html/chapter.rdcatch.html'],
  ]],
  ['RadioBOSS', 'ajastaja ja eetri arhiiv', [
    ['Ajastaja', 'https://manual.djsoft.net/radioboss/en/schedule.htm'],
    ['Eetri arhiiv', 'https://manual.djsoft.net/radioboss/en/stream_archive.htm'],
  ]],
  ['mAirList', 'muusika ajastamine andmebaasist', [
    ['Muusika ajastamine', 'https://wiki.mairlist.com/tutorials:mairlistdb:music-scheduling'],
  ]],
  ['Live365', 'tunnikell, mida siin ei kasutata', [
    ['Tunnikellad', 'https://help.live365.com/en/support/solutions/articles/43000533102-clockwheels'],
  ]],
  ['NTS', 'kahe kanali kava, saated ja nende episoodid', [
    ['Kava', 'https://www.nts.live/schedule'],
    ['Saated', 'https://www.nts.live/shows'],
  ]],
  ['Dublab', 'tsükkel ühe nimega plokina, arhiiv', [
    ['Kava', 'https://www.dublab.com/schedule'],
    ['Arhiiv', 'https://www.dublab.com/archive'],
  ]],
  ['Cashmere Radio', 'kuula ja kava ühel lehel', [['Kuula', 'https://cashmereradio.com/listen/']]],
  ['Kiosk Radio', 'päeva kava', [['Kava', 'https://www.kioskradio.com/schedule']]],
  ['Radio 80000', 'kava ja saated', [['Kava', 'https://www.radio80k.de/schedule/']]],
];

const refs = html`<dl class="rk-refs">
    ${REFS.map(([name, what, links]) => html`<div>
      <dt>${name}</dt>
      <dd><span class="rk-ref-links">${links.map(([label, href]) => html`<a href="${href}" rel="noopener">${label}</a>`)}</span><span class="rk-ref-what">${what}</span></dd>
    </div>`)}
  </dl>`;

export const renderRadioPlan = () => page({
  wide: true, lang: 'et', title: 'Raadio kava.', alternate: { lang: 'en', href: '/en/' },
  body: html`  <h1>Raadio kava</h1>
  <p class="note">Kavand: nii võiks raadio haldus välja näha. Siin ei salvestu midagi ja jaama see ei muuda.</p>
  <div class="rk-bar">
    <nav class="rk-chans" aria-label="Kanalid">${CHANNELS.map(([name, cur]) => cur ? html`<span aria-current="true">${name}</span>` : html`<a href="#">${name}</a>`)}</nav>
    <div class="rk-weeknav"><a href="#">Eelmine</a><span>5.–11. okt 2026</span><a href="#">Järgmine</a></div>
  </div>
  ${week}
  <section class="rk-part">
    <h2>R 9. okt 20.00 Klubiõhtu otse</h2>
    ${form}
  </section>
  <section class="rk-part">
    <h2>Kontroll</h2>
    ${warnings}
  </section>
  <section class="rk-part">
    <h2>Episoodid</h2>
    ${episodes}
  </section>
  <section class="rk-part">
    <h2>Kust see tuleb</h2>
    <p class="note">Tööriistad ja jaamad, mille kavalehti selle kavandi jaoks loeti (plans/plan-eccm-radio-research.md).</p>
    ${refs}
  </section>`,
});
