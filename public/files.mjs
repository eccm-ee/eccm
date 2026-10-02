// files.mjs: /admin/files' behaviour (src/render/files.mjs, plans/plan-eccm-files.md).
// An upload is positron's crate protocol against eccm-files: /files/open, then
// each 16 MiB piece in order with up to three tries, then /files/close, then the
// site indexes it and writes its record. The line under a file moves only when
// the server has acknowledged a piece. An upload cut off is kept in this
// browser by name and size, and the same file dropped again goes on from the
// pieces that landed. The token is asked for once and kept here.
const KEY = 'eccm-files-key';
const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } }, del(k) { try { localStorage.removeItem(k); } catch { /* private mode */ } } };
const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const mb = (b) => `${(b / 1048576).toFixed(1)} MB`;

const keyBox = $('file-key'), keyIn = $('file-key-in');
// open while the site says so (OPEN_UPLOADS): no key asked and none sent
const OPEN = !!document.querySelector('script[src="/files.mjs"][data-open]');
function token() {
  if (OPEN) return '';
  const t = store.get(KEY) || keyIn?.value.trim();
  if (!t && keyBox) { keyBox.hidden = false; keyIn.focus(); }
  return t || null;
}
keyIn?.addEventListener('change', () => { if (keyIn.value.trim()) store.set(KEY, keyIn.value.trim()); });
const call = async (path, init = {}) => {
  const t = token();
  if (t === null) throw new Error('enter the upload key first');
  const r = await fetch(path, { ...init, headers: { ...(t ? { authorization: `Bearer ${t}` } : {}), ...(init.headers || {}) } });
  const j = await r.json().catch(() => ({}));
  if (r.status === 401) { store.del(KEY); if (keyBox) keyBox.hidden = false; }
  if (!r.ok) throw new Error(j.error || `${r.status}`);
  return j;
};
const post = (path, body) => call(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

// ── uploads ───────────────────────────────────────────────────────────────────
async function upload(file) {
  const li = el('li', 'file-up');
  const name = el('span', 'file-up-name', file.name), say = el('span', 'file-up-say', 'waiting');
  const bar = el('div', 'station-col-bar'); const fill = el('span'); bar.append(fill);
  li.append(name, say, bar);
  $('file-queue').append(li);
  const mark = `eccm-files-open:${file.name}:${file.size}`;
  try {
    let open = JSON.parse(store.get(mark) || 'null'), done = [];
    if (open) {
      try { done = (await call(`/files/show/${open.id}`)).done; } catch { open = null; }
    }
    if (!open) { open = await post('/files/open', { name: file.name, size: file.size, type: file.type }); store.set(mark, JSON.stringify(open)); }
    const draw = () => { fill.style.inlineSize = `${(done.length / open.pieces) * 100}%`; say.textContent = `${done.length} of ${open.pieces} pieces, ${mb(Math.min(file.size, done.length * open.pieceBytes))} of ${mb(file.size)}`; };
    draw();
    for (let n = 0; n < open.pieces; n++) {
      if (done.includes(n)) continue;
      const piece = file.slice(n * open.pieceBytes, Math.min(file.size, (n + 1) * open.pieceBytes));
      for (let attempt = 1; ; attempt++) {
        try { await call(`/files/piece/${open.id}/${n}`, { method: 'PUT', body: piece }); break; }
        catch (e) { if (attempt >= 3 || /does not start like|has to be|wrong/.test(e.message)) throw e; await new Promise((r) => setTimeout(r, 1000 * attempt)); }
      }
      done.push(n); draw();
    }
    say.textContent = 'joining';
    const closed = await post(`/files/close/${open.id}`, {});
    store.del(mark);
    say.textContent = 'reading its tags';
    const ing = await post('/admin/files/ingest', { key: closed.key });
    say.textContent = `in Uploads as ${closed.key.slice('uploads/'.length)}${ing.playable ? '' : ', not MP3, so channels cannot play it'}`;
    li.dataset.done = '1';
  } catch (e) {
    say.textContent = `stopped: ${e.message}. Drop the same file again to go on.`;
  }
}
const pick = $('file-pick');
pick?.addEventListener('change', async () => {
  if (token() === null) return;
  for (const f of pick.files) await upload(f);
  pick.value = '';
  if ([...document.querySelectorAll('.file-up')].every((x) => x.dataset.done)) location.reload();
});

// ── listen, one at a time ─────────────────────────────────────────────────────
const audio = document.createElement('audio');
audio.preload = 'none';
document.body.append(audio);
let playing = null;
const stopAll = () => { audio.pause(); audio.removeAttribute('src'); audio.load(); if (playing) playing.textContent = 'Listen'; playing = null; };
audio.addEventListener('ended', stopAll);

// ── a row's actions ───────────────────────────────────────────────────────────
document.addEventListener('click', async (e) => {
  // Edit opens the row's form under its name and closes it again; the button says which it will do
  const edit = e.target.closest('button[data-edit]');
  if (edit) {
    const box = document.getElementById(edit.dataset.edit);
    const open = box.hidden;
    box.hidden = !open;
    edit.setAttribute('aria-expanded', String(open));
    edit.textContent = open ? 'Close' : 'Edit';
    if (open) box.querySelector('input')?.focus();
    return;
  }
  const listen = e.target.closest('button[data-listen]');
  if (listen) {
    if (playing === listen) return stopAll();
    stopAll(); audio.src = listen.dataset.listen; playing = listen; listen.textContent = 'Stop';
    audio.play().catch(() => {});
    return;
  }
  const b = e.target.closest('button[data-act]');
  if (!b) return;
  const box = b.closest('.file-edit'), key = box.dataset.key, say = box.querySelector('.file-say');
  const v = (n) => box.querySelector(`[name="${n}"]`).value;
  try {
    say.textContent = 'working';
    if (b.dataset.act === 'meta') { await post('/admin/files/meta', { key, title: v('title'), who: v('who') }); say.textContent = 'saved'; }
    if (b.dataset.act === 'add') { const r = await post('/admin/files/add', { key, channel: v('channel') }); say.textContent = `added to ${r.channel}, slot ${r.slots}`; }
    if (b.dataset.act === 'delete') { await post('/admin/files/delete', { key }); location.reload(); return; }
  } catch (err) { say.textContent = err.message; }
});
