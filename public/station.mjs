// station.mjs: the radio page's whole behaviour (src/render/station.mjs draws
// its bones). It is positron's demo/station/index.html in this site's
// components: the same engine, the same numbers and the same watchdog, with
// positron's shell, its transport bar, its diagram and its self-checks left
// behind. The comments marked as measured are positron's, kept because they
// are the reasons the code is the shape it is.
//
// What it reads, all from the station's own origin, which answers every route
// with access-control-allow-origin *:
//   /channels.json   once on load: every channel, its title and what it plays
//   /station.m3u8    the live playlist, to hls.js or to WebKit's own player
//   /media/{key}     the byte ranges the playlist names, fetched by the player
//   /now.json        every two seconds, from load: on air or not, the programme, its title and who, into, the slot
//   /schedule.json   the running order with wall-clock times, on load and when /now.json says it moved
// Every channel but the default one answers the last three under /c/{name}/;
// the default answers them where they always were, so this page works against
// a station from before channels, where /channels.json is a 404 and the
// switch simply never appears.
// /schedule.json and the `title` and `slot` of /now.json are new in positron on
// 2026-10-01; where the deployed station has neither, the page says so in words
// and marks the playing row by its key.

// `?base=` points the page at another copy of the station worker, which is how
// it is run against `wrangler dev` without touching the deployed one
const PARAMS = new URLSearchParams(location.search);
const STATION = (PARAMS.get('base')
  || 'https://positron-station.kristjan-jansen.workers.dev').replace(/\/+$/, '');

// The channel, from ?k=, else the station's default. Until /channels.json has
// answered, the default is taken to be `main`, which is what the station calls
// the channel that was the whole station before there were others.
const ch = { name: PARAMS.get('k') || null, def: 'main', list: [] };
const route = (path) => `${STATION}${!ch.name || ch.name === ch.def ? '' : `/c/${encodeURIComponent(ch.name)}`}${path}`;
const chTitle = () => ch.list.find((c) => c.name === (ch.name || ch.def))?.title || 'Raadio';
const POLL_MS = 2000;          // how often the numbers are re-read
const RATE_WINDOW_MS = 4000;   // over how long `advance` is measured
const ORDER_RETRY_MS = 60000;  // how long a running order that did not load waits before it is asked again

// NATIVE HLS ONLY ON WEBKIT, GATED ON ManagedMediaSource.
// `canPlayType('application/vnd.apple.mpegurl')` answers "maybe" in Chrome and
// in headless Chrome as well as in Safari, so it cannot tell the two apart;
// MMS is WebKit-only and is therefore a capability test rather than a brand
// check. Three positron demos shipped broken without it.
const NATIVE_HLS = 'ManagedMediaSource' in window
  && !!document.createElement('audio').canPlayType('application/vnd.apple.mpegurl');

const $ = (id) => document.getElementById(id);
const air = $('st-air'), title = $('st-title'), who = $('st-who'), btn = $('st-play'), chNav = $('st-channels');
const read = { into: $('st-into'), behind: $('st-behind'), advance: $('st-advance'), crossed: $('st-crossed') };
const orderBox = $('st-order'), orderSay = $('st-order-say'), rows = orderBox.querySelector('tbody');
const logList = $('st-log');

// numbers in Estonian: a decimal comma, one place
const num = (n, places = 1) => n.toLocaleString('et-EE', { minimumFractionDigits: places, maximumFractionDigits: places });
// A readout with nothing to say is empty, its line held. The three that
// measure this page's own listening (behind, speed, crossings) have nothing to
// say until Kuula is pressed, and one line under them says so, once, instead
// of a placeholder word in each that read as a broken readout (asked
// 2026-10-01, of "Otsest maas kuulates / Kiirus kuulates / Saatevahetusi
// kuulates": "3 last ones empty?"). After the first press the line is emptied
// with its height kept, and a pause leaves the last numbers standing.
const readSay = $('st-read-say');
const set = (k, text) => { read[k].textContent = text || ''; };

// the wall clock in Tallinn, with seconds, since a slot can be forty seconds
// long; the dot is this site's clock separator (src/render/dates.mjs)
const CLOCK = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Tallinn', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});
const clock = (ms) => (ms == null ? '' : CLOCK.format(new Date(ms)).replaceAll(':', '.'));
const span = (s) => {
  const m = Math.floor(s / 60), r = Math.round(s - m * 60);
  return r === 60 ? `${m + 1}:00` : `${m}:${String(r).padStart(2, '0')}`;
};
const KIND = { file: 'salvestis', live: 'otse', relay: 'ülekanne', missing: 'puudub' };

// the log, newest first, forty lines at most: a stall, a programme boundary, a
// restart, the engine. Each line says what happened in words, so nothing in it
// rests on a colour (eccm-ui section 2)
function log(text) {
  const li = document.createElement('li');
  const t = document.createElement('time');
  t.dateTime = new Date().toISOString();
  t.textContent = clock(Date.now());
  const d = document.createElement('div');
  d.textContent = text;
  li.append(t, d);
  logList.prepend(li);
  while (logList.children.length > 40) logList.lastElementChild.remove();
}

/**
 * THE ELEMENT IS A SOUND SOURCE, NOT A SURFACE. With no `controls` it renders
 * at zero height, so it is hidden without needing to be hidden, and the one
 * control is the button above it.
 */
const audio = document.createElement('audio');
audio.setAttribute('playsinline', '');
document.querySelector('.station-now').append(audio);

// ── on air ──────────────────────────────────────────────────────────────────
// WHAT MAKES "EETRIS" TRUE IS /now.json ANSWERING, and it is the station's
// state, not this page's: the poll runs from load and never stops, so the line
// answers "is there a programme playing out there" whether or not anybody here
// has pressed play. Two misses of the two second poll, four seconds of silence
// from the worker, is what it takes to say it went away; before the first
// answer the line says it does not know yet, which is the honest state.
let seenAt = 0, misses = 0;
function onAir(answered) {
  if (answered) { seenAt = Date.now(); misses = 0; air.textContent = 'Eetris.'; return; }
  misses++;
  if (misses < 2) return;
  air.textContent = seenAt ? 'Eetrist väljas: jaam ei vasta.' : 'Jaam ei vasta.';
}

// ── the running order ─────────────────────────────────────────────────────────
// One row per slot with its wall-clock start and end in the loop that is
// playing now, Tallinn time, and the row on air marked (positron, asked
// 2026-10-01: "can i have a table with programme?"). The rows come from
// /schedule.json, which positron writes from the same flatten() as the
// playlist, so the table cannot disagree with what plays. It is read once on
// load and again only when /now.json reports a new loop or a new running
// order; the marked row moves on the two second poll that already runs.
const order = { rev: null, loop: null, playing: null, key: null, busy: false, failedAt: 0, ok: false, ch: null };
function mark() {
  for (const tr of rows.children) {
    const on = order.playing != null ? Number(tr.dataset.i) === order.playing : tr.dataset.key === order.key;
    if (on) tr.setAttribute('aria-current', 'true'); else tr.removeAttribute('aria-current');
  }
}
function cell(text, label, cls) {
  const td = document.createElement('td');
  td.textContent = text;
  td.dataset.label = label;
  if (cls) td.className = cls;
  return td;
}
async function readOrder() {
  if (order.busy) return;
  if (!order.ok && order.failedAt && Date.now() - order.failedAt < ORDER_RETRY_MS) return;
  order.busy = true;
  const asked = ch.name;
  try {
    const r = await fetch(route('/schedule.json'), { cache: 'no-store' });
    const s = await r.json();
    if (asked !== ch.name) return;   // the channel changed while this was on its way
    if (!Array.isArray(s.slots)) throw new Error(s.error || `${r.status}`);
    order.rev = s.rev; order.loop = s.loop; order.ok = true;
    if (s.playing != null && order.playing == null) order.playing = s.playing;
    rows.replaceChildren(...s.slots.map((x) => {
      const tr = document.createElement('tr');
      tr.dataset.i = x.i; tr.dataset.key = x.key;
      tr.append(
        cell(clock(x.from), 'Algus'),
        cell(x.open ? 'lahtine' : clock(x.to), 'Lõpp'),
        cell(x.missing ? '' : span(x.dur), 'Kestus', 'num'),
        cell(x.title || x.key, 'Saade', 'main'),
        cell(x.who || '', 'Kes', 'who'),
        cell(KIND[x.missing ? 'missing' : x.kind] || x.kind, 'Liik'),
      );
      return tr;
    }));
    mark();
    orderBox.hidden = !s.slots.length;
    orderSay.textContent = s.slots.length
      ? `Ring kestab ${span(s.total)}, kellaajad on praeguse ringi omad.`
      : 'Kava on tühi.';
  } catch {
    // the station is allowed to be slow, and a station that has no running
    // order to give says so here in words; the page goes on without the table
    if (asked !== ch.name) return;
    order.failedAt = Date.now();
    if (!order.ok) orderSay.textContent = 'Kava ei ole jaamast praegu saada.';
  } finally { order.busy = false; }
}
readOrder();

let hls = null, engine = 'none';
let stalls = 0, crossed = 0, lastProgramme = null, lastTitle = null, lastWho = null, playing = false;
let rateAt = 0, rateT = 0;

// a stall is an event that HAPPENED rather than a number sitting at zero, so
// it reaches a person through the log
audio.addEventListener('waiting', () => { if (playing) { stalls++; log(`Puhverdab, ${stalls}. kord.`); } });

// ── the lock screen ─────────────────────────────────────────────────────────
// Without mediaSession a phone's lock screen shows the page title and a generic
// icon, and the pause button on a pair of headphones does nothing. The
// metadata is refreshed on every programme change, because a station that keeps
// one title across four programmes is lying on the one surface a listener sees
// with the screen off. The artwork is the site's own square mark; the artist is
// who made what is on, from the programme's record, and the album the channel.
const MEDIA_SESSION = 'mediaSession' in navigator;
function announce(name, by) {
  if (!MEDIA_SESSION) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: name || 'Raadio',
    artist: by || 'ECCM',
    album: chTitle(),
    artwork: [{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }],
  });
  navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
  try {
    navigator.mediaSession.setActionHandler('play', () => start());
    navigator.mediaSession.setActionHandler('pause', () => stop());
  } catch { /* an agent that does not take handlers is not a failure */ }
}

// ── the numbers ─────────────────────────────────────────────────────────────
/** How far behind the live edge the sound is, in seconds, or null where this
 *  engine cannot say. hls.js keeps the playing segment's PROGRAM-DATE-TIME;
 *  WebKit exposes the playlist's start date on the element itself. */
function behindS() {
  if (hls && hls.playingDate) return (Date.now() - hls.playingDate.getTime()) / 1000;
  if (audio.getStartDate) {
    const s = audio.getStartDate();
    if (s && !Number.isNaN(s.getTime())) return (Date.now() - (s.getTime() + audio.currentTime * 1000)) / 1000;
  }
  return null;
}

// ── the watchdog ────────────────────────────────────────────────────────────
// A RECOVERY ACTION IS NOT FREE. It waits STUCK_MS before believing the sound
// has stopped, backs off to eight seconds between attempts, and gives up in
// words after twelve rather than retrying into an outage forever. WebKit's
// native HLS needs none of this: the element keeps its own loader and retries
// on its own, which is why it only ever acts on hls.js.
const STUCK_MS = 6000, RESTART_CAP = 12;
let lastT = 0, lastMoveAt = performance.now(), restarts = 0, lastRestart = 0;
function watchdog() {
  if (!hls || audio.paused) { lastMoveAt = performance.now(); return; }
  const now = performance.now();
  if (audio.currentTime !== lastT) { lastT = audio.currentTime; lastMoveAt = now; return; }
  if (now - lastMoveAt < STUCK_MS) return;
  const wait = Math.min(1000 * 2 ** restarts, 8000);
  if (Date.now() - lastRestart < wait) return;
  if (restarts >= RESTART_CAP) return;
  lastRestart = Date.now(); restarts++;
  log(`Heli ei ole ${((now - lastMoveAt) / 1000).toFixed(0)} s liikunud, laadimine algab uuesti (${restarts}. kord).`);
  try { hls.startLoad(); } catch { /* torn down */ }
  if (restarts === RESTART_CAP) log('Jaam on liiga kaua kättesaamatu olnud, rohkem ei proovita.');
}

async function poll() {
  watchdog();
  // advance: seconds of audio per second of wall clock.
  //
  // SINCE PLAYBACK BEGAN, NOT OVER THE LAST FEW SECONDS, AND THAT IS NOT A
  // SMOOTHING PREFERENCE. A short window reads a legitimate 0 x every time the
  // player catches up to the live edge and waits for the segment that has not
  // been written yet, which is the normal state of a live stream several times
  // a minute (MEASURED in positron: it failed a page that had just played
  // 60.0 s of audio without a gap). The average since the first frame is the
  // quantity the claim is about, and it still moves: every stall pulls it down
  // and it never comes back up.
  const now = performance.now();
  if (playing) {
    if (!rateT && audio.currentTime > 0 && !audio.paused) { rateAt = audio.currentTime; rateT = now; }
    if (rateT && now - rateT >= RATE_WINDOW_MS) set('advance', `${num((audio.currentTime - rateAt) / ((now - rateT) / 1000), 2)} x`);
    const b = behindS();
    set('behind', b === null ? '' : `${num(b)} s`);
  }

  let n = null;
  const asked = ch.name;
  try { n = await fetch(route('/now.json'), { cache: 'no-store' }).then((r) => r.json()); } catch { /* the station is allowed to be slow */ }
  if (asked !== ch.name) return;   // an answer about the channel that was left
  if (!n || n.error) { onAir(false); return; }
  // The station answered with a programme, which is the whole of the claim the
  // line above makes, stamped with this clock and never a time from inside the
  // payload.
  onAir(true);
  // the slot's title when it has one, otherwise its key: /now.json carried no
  // title at all until 2026-10-01, and positron told every visitor `no title`
  // beside a file name
  title.textContent = n.title || n.programme;
  who.textContent = n.who || '';
  lastWho = n.who || null;
  // a new loop moves every row's clock time, and a new rev is a new running
  // order, so either one means the table is read again
  if (n.rev !== order.rev || n.loop !== order.loop) readOrder();
  order.playing = Number.isInteger(n.slot) ? n.slot : null;
  order.key = n.programme;
  mark();
  set('into', `${num(n.into)} s`);
  if (lastProgramme && n.programme !== lastProgramme) {
    if (playing) { crossed++; set('crossed', String(crossed)); }
    log(`${lastTitle}, siis ${n.title || n.programme}.`);
    announce(n.title || n.programme, n.who);
  }
  if (!lastProgramme) announce(n.title || n.programme, n.who);
  lastProgramme = n.programme;
  lastTitle = n.title || n.programme;
}

// ── going on air ────────────────────────────────────────────────────────────
// A pause tears the player down and a press builds a new one, because a live
// station has no past worth resuming from: the next press starts at the edge.
function stop() {
  if (!playing) return;
  playing = false;
  audio.pause();
  if (hls) { hls.destroy(); hls = null; }
  audio.removeAttribute('src');
  audio.load();
  btn.textContent = 'Kuula'; btn.setAttribute('aria-pressed', 'false');
  announce(lastTitle, lastWho);
}

function start() {
  if (playing) return;
  playing = true;
  restarts = 0;
  btn.textContent = 'Peata'; btn.setAttribute('aria-pressed', 'true');
  if (NATIVE_HLS) {
    engine = 'Safari oma HLS';
    // REQUIRED WITH ManagedMediaSource ANYWHERE NEAR, and harmless otherwise:
    // an AirPlay-eligible element can be handed to a remote route
    // mid-measurement, and then the numbers describe a device that is not here
    audio.disableRemotePlayback = true;
    audio.src = route('/station.m3u8');
  } else if (window.Hls && Hls.isSupported()) {
    engine = 'hls.js';
    hls = new Hls({ lowLatencyMode: false, liveSyncDurationCount: 3 });
    // MEASURED in positron 2026-09-15, AND IT IS THE OPPOSITE OF WHAT THE NATIVE
    // PATH DOES. With the station blocked for 30 s from outside the page, the
    // element played out its 26.4 s of buffer, stalled at 79.97 s, and was STILL
    // at 79.97 s forty seconds after the block was lifted: no error on the
    // element, `ended` false, readyState 2, and no way back. hls.js exhausts its
    // retries and then stops loading; the element it is feeding has no loader of
    // its own to keep trying.
    //
    // AND THE RECOVERY WATCHES THE PLAYHEAD, NOT THE ERROR EVENT. The first
    // attempt hung a restart off Hls.Events.ERROR, which read correct and
    // MEASURED as three restarts during the outage and then silence: once
    // hls.js has exhausted its retries it stops loading, and a loader that is
    // not loading raises no more errors, so an event-driven recovery has nothing
    // left to fire on. The watchdog above, on "is the sound still moving", has
    // no such dependency.
    hls.on(Hls.Events.ERROR, (_, data) => {
      if (!data.fatal) return;
      log(`hls.js: ${data.type} ${data.details}.`);
      if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError?.();
    });
    hls.loadSource(route('/station.m3u8'));
    hls.attachMedia(audio);
  } else {
    engine = 'none';
    playing = false;
    btn.textContent = 'Kuula'; btn.setAttribute('aria-pressed', 'false');
    log('Selles brauseris ei ole HLS-i ega MediaSource\'i, siin seda raadiot kuulata ei saa.');
    return;
  }
  log(`Mängib, ${engine}.`);
  // FIRE IT AND MOVE ON. `audio.play()` waits on a user gesture in a real
  // browser and never rejects into anything useful, so awaiting it here is a
  // hang rather than an error (positron lost two demos to exactly that)
  audio.play().catch((e) => log(`Mängimine ootab: ${e.name}.`));
  rateAt = 0; rateT = 0;   // the average starts at the first frame, not at the press
  crossed = 0; set('crossed', '0');
  readSay.textContent = '';
  poll();
  clearInterval(timer); timer = setInterval(poll, POLL_MS);
}

btn.addEventListener('click', () => (playing ? stop() : start()));

// ── the channels ────────────────────────────────────────────────────────────
// One small button per channel, as many as the station has, wrapping at their
// own sizes; the one this page plays is filled and carries aria-current. Each
// is a real link to ?k=<name>, so it opens in a new tab and works with no
// script; a click here switches in place instead: the player is torn down and,
// if it was playing, built again on the new channel's playlist, since a live
// channel has no past to carry over. One channel draws no switch at all.
function drawChannels() {
  chNav.replaceChildren(...ch.list.map((c) => {
    const a = document.createElement('a');
    const q = new URLSearchParams(PARAMS);
    q.set('k', c.name);
    a.href = `?${q}`;
    a.textContent = c.title || c.name;
    const on = c.name === (ch.name || ch.def);
    a.className = on ? 'btn btn-sm btn-pri' : 'btn btn-sm';
    if (on) a.setAttribute('aria-current', 'true');
    a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      e.preventDefault();
      choose(c.name);
    });
    return a;
  }));
  chNav.hidden = ch.list.length < 2;
}

function choose(name) {
  if (name === (ch.name || ch.def)) return;
  const was = playing;
  stop();
  ch.name = name;
  const q = new URLSearchParams(PARAMS);
  q.set('k', name);
  history.replaceState(null, '', `?${q}`);
  forget();
  drawChannels();
  log(`Kanal ${chTitle()}.`);
  if (was) start();
}

// Everything on the page that was about the channel just left, cleared and
// asked again of the one now chosen.
function forget() {
  Object.assign(order, { rev: null, loop: null, playing: null, key: null, failedAt: 0, ok: false });
  rows.replaceChildren(); orderBox.hidden = true; orderSay.textContent = 'Kava loetakse jaamast.';
  lastProgramme = null; lastTitle = null; lastWho = null;
  title.textContent = 'Eetrist väljas'; who.textContent = '';
  set('into', '');
  readOrder(); poll();
}

async function readChannels() {
  try {
    const r = await fetch(`${STATION}/channels.json`, { cache: 'no-store' });
    if (!r.ok) return;   // a station from before channels: one channel, no switch
    const d = await r.json();
    ch.def = d.default || 'main';
    ch.list = d.channels || [];
    // a name the station does not have plays the default, and the log and the
    // address say so
    if (ch.name && !ch.list.some((c) => c.name === ch.name)) {
      const bad = ch.name;
      ch.name = null;
      log(`Kanalit ${bad} ei ole, mängib ${chTitle()}.`);
      const q = new URLSearchParams(PARAMS); q.delete('k');
      history.replaceState(null, '', q.size ? `?${q}` : location.pathname);
      if (!playing) forget();
    }
    drawChannels();
  } catch { /* the switch waits for a station that answers */ }
}
readChannels();

log('Leht avati, jaama loetakse.');
let timer = setInterval(poll, POLL_MS);
poll();
