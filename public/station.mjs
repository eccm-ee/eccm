// station.mjs: the radio page's whole behaviour (src/render/station.mjs draws
// its bones). positron's demo/station/index.html in this site's components:
// the same engine, numbers and watchdog; the comments marked as measured are
// positron's, kept because they are why the code is this shape.
//
// Every channel is a column holding the whole of that station (asked
// 2026-10-01: "whole stations need to fit so single col. avoid dumplication
// and vertical jumps"): its name and state, what is on in at most two lines,
// who, a line showing how far in, one Kuula or Peata, and the running order
// with the row on air marked. Every part of a column keeps its height whatever
// it says, and each part has a fixed height (public/eccm.css), so
// nothing moves while somebody is looking. One player serves the page: Kuula
// on a column starts it there and stops it anywhere else.
//
// What it reads, all from the station's own origin:
//   /channels.json   every 2 s: each channel's title and what is on, its title, who, into, slot
//   /schedule.json   per channel, on load and when that channel's slot, loop or running order moves
//   /station.m3u8    the playing channel's live playlist, to hls.js or to WebKit's own player
// A channel other than the default answers under /c/{name}/.

const PARAMS = new URLSearchParams(location.search);
// `?base=` points the page at another copy of the station, as with wrangler dev
const STATION = (PARAMS.get('base') || 'https://positron-station.kristjan-jansen.workers.dev').replace(/\/+$/, '');
const POLL_MS = 2000;          // how often what is on is re-read, and how often the numbers move
const RATE_WINDOW_MS = 4000;   // how long `advance` waits before it says anything

// NATIVE HLS ONLY ON WEBKIT, GATED ON ManagedMediaSource. canPlayType answers
// "maybe" in Chrome too, so it cannot tell the two apart; MMS is WebKit only.
// Three positron demos shipped broken without this.
const NATIVE_HLS = 'ManagedMediaSource' in window && !!document.createElement('audio').canPlayType('application/vnd.apple.mpegurl');

const $ = (id) => document.getElementById(id);
const box = $('st-channels');
const num = (n, places = 1) => n.toLocaleString('et-EE', { minimumFractionDigits: places, maximumFractionDigits: places });
const CLOCK = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Tallinn', hour: '2-digit', minute: '2-digit' });
const clock = (ms) => (ms == null ? '' : CLOCK.format(new Date(ms)).replace(':', '.'));
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

// what happens, for whoever opens the console; the page itself shows only the station (asked: "rm tehnilsied andmed")
const log = (text) => console.info(`[station] ${text}`);

// ── the channels ─────────────────────────────────────────────────────────────
// one record per channel, its column's nodes in `ui` so a poll changes text and
// never builds anything
let DEF = 'main';
const chans = new Map();
const route = (name, path) => `${STATION}${name === DEF ? '' : `/c/${encodeURIComponent(name)}`}${path}`;
let current = PARAMS.get('k') || null;   // the channel being listened to, or last listened to

function column(c) {
  const col = el('section', 'station-col');
  const head = el('header', 'station-col-head');
  const a = el('a', null, c.title || c.name);
  const q = new URLSearchParams(PARAMS); q.set('k', c.name); a.href = `?${q}`;
  const state = el('span', 'station-col-state', '');
  head.append(a, state);
  const now = el('p', 'station-col-now', 'Eetrist väljas');
  const who = el('p', 'station-col-who', '');
  const bar = el('div', 'station-col-bar'); const fill = el('span'); bar.append(fill);
  const times = el('p', 'station-col-times', '');
  const btn = el('button', 'btn btn-sm', 'Kuula'); btn.type = 'button';
  btn.addEventListener('click', () => (playing && current === c.name ? stop() : start(c.name)));
  const order = el('ol', 'station-col-order');
  col.append(head, now, who, bar, times, btn, order);
  c.ui = { col, state, now, who, fill, times, btn, order };
  return col;
}

// the running order: the slot on air first and what follows, as the station
// lists it (NTS's "Next on"), each with its start, the row on air in weight; one row per slot, so the column is as tall as the
// channel's longest running order and no taller
function drawOrder(c) {
  const o = c.ui.order;
  o.replaceChildren(...(c.slots || []).filter((x) => !x.missing).map((x) => {
    const li = el('li');
    li.dataset.i = x.i;
    li.append(el('time', null, x.open ? 'otse' : clock(x.from)), el('span', null, x.title || x.key));
    return li;
  }));
  markOrder(c);
}
function markOrder(c) {
  for (const li of c.ui.order.children) {
    if (Number(li.dataset.i) === c.playing?.slot) li.setAttribute('aria-current', 'true'); else li.removeAttribute('aria-current');
  }
}

async function readSchedule(c) {
  try {
    const r = await fetch(route(c.name, '/schedule.json'), { cache: 'no-store' });
    // an empty channel (an open live slot before its first chunk) answers 503 and still lists its slots
    const d = await r.json().catch(() => null);
    if (!d || !Array.isArray(d.slots)) return;
    c.slots = d.slots || [];
    // the station's own order: the slot on air first, then what follows it, each with its next start
    c.rev = d.rev; c.loop = d.loop;
    drawOrder(c);
  } catch { /* the column keeps what it had */ }
}

// what is on, with a line through it: the slot's start and end from the
// running order, the clock moving between polls, so the bar moves smoothly and
// the poll only corrects it
function drawNow(c) {
  const p = c.playing || {};
  const u = c.ui;
  u.now.textContent = p.title || p.programme || 'Eetrist väljas';
  u.now.title = u.now.textContent;
  u.who.textContent = p.who || '';
  const slot = (c.slots || []).find((x) => x.i === p.slot);
  if (slot && slot.from != null && slot.to != null) {
    const into = Math.max(0, Math.min((Date.now() - slot.from) / 1000, slot.dur));
    u.fill.style.inlineSize = `${(into / slot.dur) * 100}%`;
    u.times.textContent = `${mmss(into)} / ${mmss(slot.dur)}`;
  } else {
    u.fill.style.inlineSize = slot && slot.open ? '100%' : '0';
    u.times.textContent = slot && slot.open ? 'otse' : '';
  }
  const on = playing && current === c.name;
  u.state.textContent = c.down ? 'ei vasta' : on ? 'kuulad' : p.programme ? 'eetris' : 'ootab';
  u.btn.textContent = on ? 'Peata' : 'Kuula';
  u.btn.className = on ? 'btn btn-sm btn-pri' : 'btn btn-sm';
  u.btn.setAttribute('aria-pressed', String(on));
  // a channel with nothing on air (a live slot before its first chunk) has no playlist to start
  u.btn.disabled = !on && !p.programme;
  if (!p.programme) u.now.textContent = c.slots?.some((x) => x.open) ? 'Ootab otseülekannet' : 'Eetrist väljas';
  if (current === c.name) u.col.setAttribute('aria-current', 'true'); else u.col.removeAttribute('aria-current');
}

let misses = 0;
async function readChannels() {
  let d = null;
  try { const r = await fetch(`${STATION}/channels.json`, { cache: 'no-store' }); if (r.ok) d = await r.json(); } catch { /* slow is allowed */ }
  if (!d) { if (++misses >= 2) for (const c of chans.values()) { c.down = true; drawNow(c); } return; }
  misses = 0;
  DEF = d.default || 'main';
  const list = d.channels || [];
  if (current && !list.some((c) => c.name === current)) { log(`Kanalit ${current} ei ole.`); current = null; }
  // a channel the page has not seen gets its column; one the station dropped loses it
  let built = false;
  for (const c of list) {
    if (!chans.has(c.name)) { chans.set(c.name, { name: c.name, title: c.title }); built = true; }
  }
  for (const name of [...chans.keys()]) if (!list.some((c) => c.name === name)) { chans.get(name).ui?.col.remove(); chans.delete(name); }
  if (built || !box.querySelector('.station-col')) box.replaceChildren(...[...chans.values()].map((c) => c.ui?.col || column(c)));
  for (const c of list) {
    const r = chans.get(c.name);
    r.title = c.title; r.down = false;
    const was = r.playing?.slot;
    r.playing = c.playing || null;
    // a new slot can be a new loop, whose clock times differ, so the order is read again on every change
    if (!r.slots || r.playing?.slot !== was) readSchedule(r); else markOrder(r);
    if (current === c.name && was != null && r.playing?.slot !== was) crossedOne(r);
    drawNow(r);
  }
}

// ── the player ───────────────────────────────────────────────────────────────
const audio = document.createElement('audio');
audio.setAttribute('playsinline', '');
document.body.append(audio);
let hls = null, playing = false, engine = '', crossed = 0, rateAt = 0, rateT = 0;

const MEDIA_SESSION = 'mediaSession' in navigator;
function announce() {
  if (!MEDIA_SESSION || !current) return;
  const c = chans.get(current), p = c?.playing || {};
  navigator.mediaSession.metadata = new MediaMetadata({
    title: p.title || p.programme || 'Raadio', artist: p.who || 'ECCM', album: c?.title || 'Raadio',
    artwork: [{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }],
  });
  navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
  try {
    navigator.mediaSession.setActionHandler('play', () => start(current));
    navigator.mediaSession.setActionHandler('pause', () => stop());
  } catch { /* an agent that takes no handlers is not a failure */ }
}
function crossedOne(c) {
  if (!playing) return;
  crossed++;
  log(`${c.title}: ${c.playing?.title || c.playing?.programme || ''}.`);
  announce();
}

// how far behind the live edge the sound is: hls.js keeps the playing
// segment's PROGRAM-DATE-TIME; WebKit exposes the playlist's start date
function behindS() {
  if (hls && hls.playingDate) return (Date.now() - hls.playingDate.getTime()) / 1000;
  if (audio.getStartDate) { const s = audio.getStartDate(); if (s && !Number.isNaN(s.getTime())) return (Date.now() - (s.getTime() + audio.currentTime * 1000)) / 1000; }
  return null;
}

// THE WATCHDOG WATCHES THE PLAYHEAD, NOT THE ERROR EVENT (MEASURED in positron
// 2026-09-15): with the station blocked for 30 s hls.js played out its buffer,
// stalled, exhausted its retries and stopped loading for good, raising no more
// errors to hang a recovery on. So: six seconds without movement, a reload,
// backing off to eight seconds, giving up in words after twelve. WebKit's own
// player retries by itself and is left alone.
const STUCK_MS = 6000, RESTART_CAP = 12;
let lastT = 0, lastMoveAt = performance.now(), restarts = 0, lastRestart = 0;
function watchdog() {
  if (!hls || audio.paused) { lastMoveAt = performance.now(); return; }
  const now = performance.now();
  if (audio.currentTime !== lastT) { lastT = audio.currentTime; lastMoveAt = now; return; }
  if (now - lastMoveAt < STUCK_MS || Date.now() - lastRestart < Math.min(1000 * 2 ** restarts, 8000) || restarts >= RESTART_CAP) return;
  lastRestart = Date.now(); restarts++;
  log(`Heli ei ole ${((now - lastMoveAt) / 1000).toFixed(0)} s liikunud, laadimine algab uuesti (${restarts}. kord).`);
  try { hls.startLoad(); } catch { /* torn down */ }
  if (restarts === RESTART_CAP) log('Jaam on liiga kaua kättesaamatu olnud, rohkem ei proovita.');
}

// advance is seconds of audio per second of clock SINCE PLAYBACK BEGAN: a short
// window reads 0 x every time the player waits at the live edge, the normal
// state of a live stream (MEASURED in positron)
function numbers() {
  if (!playing) return;
  watchdog();
  const now = performance.now();
  if (!rateT && audio.currentTime > 0 && !audio.paused) { rateAt = audio.currentTime; rateT = now; }
  if (rateT && now - rateT >= RATE_WINDOW_MS && Math.round((now - rateT) / POLL_MS) % 15 === 0) {
    const b = behindS();
    log(`kiirus ${num((audio.currentTime - rateAt) / ((now - rateT) / 1000), 2)} x, otsest maas ${b === null ? '?' : `${num(b)} s`}, saatevahetusi ${crossed}`);
  }
}

// a pause tears the player down and a press builds a new one at the live edge
function stop() {
  if (!playing) return;
  playing = false;
  audio.pause();
  if (hls) { hls.destroy(); hls = null; }
  audio.removeAttribute('src'); audio.load();
  for (const c of chans.values()) drawNow(c);
  announce();
}

function start(name) {
  if (playing) stop();
  current = name;
  const q = new URLSearchParams(PARAMS); q.set('k', name); history.replaceState(null, '', `?${q}`);
  const src = route(name, '/station.m3u8');
  restarts = 0;
  if (NATIVE_HLS) {
    engine = 'Safari oma HLS';
    audio.disableRemotePlayback = true;   // an AirPlay route would make the numbers describe another device
    audio.src = src;
  } else if (window.Hls && Hls.isSupported()) {
    engine = 'hls.js';
    hls = new Hls({ lowLatencyMode: false, liveSyncDurationCount: 3 });
    hls.on(Hls.Events.ERROR, (_, data) => {
      if (!data.fatal) return;
      log(`hls.js: ${data.type} ${data.details}.`);
      if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError?.();
    });
    hls.loadSource(src);
    hls.attachMedia(audio);
  } else {
    log("Selles brauseris ei ole HLS-i ega MediaSource'i, siin seda raadiot kuulata ei saa.");
    return;
  }
  playing = true;
  crossed = 0; rateAt = 0; rateT = 0;
  log(`${chans.get(name)?.title || name}, ${engine}.`);
  // fire and move on: play() waits on a gesture and never rejects usefully
  audio.play().catch((e) => log(`Mängimine ootab: ${e.name}.`));
  for (const c of chans.values()) drawNow(c);
  announce();
}

// the bar between polls: the clock moves it, the poll corrects it
setInterval(() => { for (const c of chans.values()) drawNow(c); }, 1000);
setInterval(() => { readChannels(); numbers(); }, POLL_MS);
readChannels();
