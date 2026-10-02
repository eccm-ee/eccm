// files.mjs: /admin/files (src/files.mjs, plans/plan-eccm-files.md). The two
// directories as a row of links, the current one underlined as the menu does
// it; on Uploads a drop zone, the editor's own, taking several files that go up
// in pieces with a line each that moves only as the server acknowledges a
// piece; then the table component, one row a file, its name and who, its
// length, size, when it came and the channels that play it. A row opens to
// its title and who, Add to channel and Delete. public/files.mjs does the
// uploads, the token, Listen and the actions.
import { html } from './html.mjs';
import { page } from './chrome.mjs';
import { table } from './table.mjs';
import { dayMonth, clock } from './dates.mjs';

const LOCAL = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Tallinn', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
const when = (ms) => { const at = LOCAL.format(new Date(ms)).replace(' ', 'T'); return `${dayMonth(at, 'en')} ${clock(at, 'en')}`; };
const size = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const length = (s) => { if (s == null) return ''; s = Math.round(s); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = String(s % 60).padStart(2, '0'); return h ? `${h}:${String(m).padStart(2, '0')}:${x}` : `${m}:${x}`; };
const TABS = [['uploads', 'Uploads'], ['recordings', 'Recordings']];

const row = (f, channels) => {
  const name = html`<span class="file-name">${f.title || f.name}</span>${f.who ? html`<span class="file-who">${f.who}</span>` : ''}
      <details class="file-edit" data-key="${f.key}">
        <summary>Edit</summary>
        <div class="form file-form">
          <p class="small">${f.key}</p>
          <div class="field-row">
            <div class="field"><label>Title</label><input name="title" value="${f.title || ''}"></div>
            <div class="field"><label>Who</label><input name="who" value="${f.who || ''}"></div>
          </div>
          <div class="field-row file-add">
            <div class="field"><label>Channel</label><select name="channel">${channels.map((c) => html`<option value="${c.name}">${c.title}</option>`)}</select></div>
          </div>
          <div class="actions"><button class="btn btn-sm" type="button" data-act="meta">Save</button><button class="btn btn-sm" type="button" data-act="add">Add to channel</button><button class="btn btn-sm btn-end" type="button" data-act="delete">Delete</button></div>
          <p class="hint file-say" aria-live="polite"></p>
        </div>
      </details>`;
  return [name, length(f.duration), size(f.bytes), when(f.uploaded), f.on.join(', '),
    html`<button class="btn btn-sm" type="button" data-listen="/stream/media/${f.key}" data-title="${f.title || f.name}">Listen</button>`];
};

export const renderFiles = ({ dir, counts, files, total, channels }) => page({
  wide: true, lang: 'en', title: 'Files.',
  body: html`  <h1>Files</h1>
  <nav class="file-tabs" aria-label="Directories">${TABS.map(([d, label]) => (d === dir ? html`<span aria-current="true">${label} ${counts[d]}</span>` : html`<a href="/admin/files?dir=${d}">${label} ${counts[d]}</a>`))}</nav>
  <p class="note">${dir === 'uploads' ? 'Files a person put here: concert recordings, masters, works. Any of them can be added to a channel.' : 'The live shows the station recorded itself, one file each. Any of them can be added to a channel as a replay.'} ${files.length} ${files.length === 1 ? 'file' : 'files'}, ${size(total)}.</p>
  ${dir === 'uploads' ? html`<div class="form file-drop">
    <label class="drop-zone">
      <span class="drop-say"><b>Drop audio files here</b> or choose</span>
      <span class="hint">MP3, WAV, FLAC, Ogg, Opus or M4A, up to 500 MB each. Channels play MP3.</span>
      <input type="file" id="file-pick" multiple accept=".mp3,.wav,.flac,.ogg,.opus,.m4a,audio/*">
    </label>
    <ol class="file-queue" id="file-queue"></ol>
    <div class="field file-key" id="file-key" hidden><label for="file-key-in">Upload key</label><input id="file-key-in" type="password" autocomplete="off"><p class="hint">Asked once and kept in this browser. Without it nothing uploads or changes.</p></div>
  </div>` : ''}
  ${files.length ? table({ label: 'Files', cols: [{ label: 'Name', cls: 'main' }, { label: 'Length', cls: 'num' }, { label: 'Size', cls: 'num' }, { label: 'Added' }, { label: 'On' }, { label: '' }], rows: files.map((f) => row(f, channels)) }) : html`<p class="small">Nothing here yet.</p>`}
  <script type="module" src="/files.mjs"></script>`,
});
