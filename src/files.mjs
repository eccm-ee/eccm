// files.mjs: /admin/files, the site's audio in the files bucket
// (plans/plan-eccm-files.md, asked 2026-10-02: "what about creating a
// eccm-files worker and admin/files paeg and mimick crate/vain", then "split
// audio into 2?" and "yes and implement"). Two directories, by where a file
// came from, which never changes: uploads/, put there by a person through
// eccm-files in pieces, and recordings/, the live shows the recorder kept
// (src/radio.mjs). Whether a channel plays a file is a column, not a place.
//
//   GET  /admin/files?dir=uploads|recordings   the page (src/render/files.mjs)
//   POST /admin/files/ingest {key}             a closed upload: its index and its record (title, who, length)
//   POST /admin/files/add    {key, channel}    the file appended to a channel's running order, its clock kept
//   POST /admin/files/meta   {key, title, who} the record's title and who
//   POST /admin/files/delete {key}             refused while a running order names it
//
// The POSTs need the bearer token FILES_TOKEN, the same one eccm-files takes;
// the page asks for it once. The station is called in process with its own
// token, as the recorder does.
import { station } from './station/station.mjs';
import { admitted } from '../workers/files/worker.mjs';
import { renderFiles } from './render/files.mjs';

export const DIRS = { uploads: 'uploads/', recordings: 'recordings/' };
const NO_CTX = { waitUntil() {} };
const JSON_HEAD = { 'content-type': 'application/json', 'cache-control': 'no-store' };
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: JSON_HEAD });

const ask = async (env, path, init = {}) => {
  const headers = { authorization: `Bearer ${env.STATION_TOKEN}`, ...(init.body ? { 'content-type': 'application/json' } : {}) };
  const r = await station.fetch(new Request(`https://station${path}`, { ...init, headers }), env, NO_CTX);
  return [r.status, await r.json().catch(() => ({}))];
};
const chanPath = (c) => (c.default ? '' : `/c/${encodeURIComponent(c.name)}`);

// every channel with its running order, and which channels play each key
async function channels(env) {
  const [, d] = await ask(env, '/channels.json');
  const out = [];
  for (const c of d.channels || []) {
    const [, s] = await ask(env, `${chanPath(c)}/schedule`);
    out.push({ ...c, sched: s });
  }
  return out;
}

async function listing(env, dir) {
  const objects = [];
  let cursor;
  do {
    const l = await env.STATION_MEDIA.list({ prefix: DIRS[dir], cursor });
    objects.push(...l.objects);
    cursor = l.truncated ? l.cursor : undefined;
  } while (cursor);
  const [, lib] = await ask(env, '/programmes.json');
  const recs = Object.fromEntries((lib.programmes || []).map((r) => [r.key, r]));
  const chans = await channels(env);
  const on = (key) => chans.filter((c) => (c.sched.slots || []).some((s) => s.key === key)).map((c) => c.title || c.name);
  const files = objects.sort((a, b) => b.uploaded - a.uploaded).map((o) => ({
    key: o.key, name: o.key.slice(DIRS[dir].length), bytes: o.size, uploaded: o.uploaded.getTime(),
    title: recs[o.key]?.title || null, who: recs[o.key]?.who || null, duration: recs[o.key]?.duration ?? null,
    on: on(o.key),
  }));
  const total = objects.reduce((a, o) => a + o.size, 0);
  return { files, total, channels: chans.map((c) => ({ name: c.name, title: c.title || c.name })) };
}

const inDirs = (key) => typeof key === 'string' && Object.values(DIRS).some((d) => key.startsWith(d)) && !key.includes('..');

export async function filesRoute(request, env, url) {
  const p = url.pathname;
  if (p === '/admin/files' && request.method === 'GET') {
    const dir = DIRS[url.searchParams.get('dir')] ? url.searchParams.get('dir') : 'uploads';
    const counts = {};
    for (const d of Object.keys(DIRS)) { const l = await env.STATION_MEDIA.list({ prefix: DIRS[d] }); counts[d] = l.objects.length + (l.truncated ? '+' : ''); }
    return new Response(String(renderFiles({ dir, counts, ...(await listing(env, dir)) })), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } });
  }
  if (request.method !== 'POST') return null;
  if (!admitted(request, env)) return json({ error: env.FILES_TOKEN ? 'the upload key is wrong' : 'no FILES_TOKEN is set' }, env.FILES_TOKEN ? 401 : 503);
  const b = await request.json().catch(() => ({}));
  if (!inDirs(b.key)) return json({ error: 'not a file in uploads/ or recordings/' }, 400);

  if (p === '/admin/files/ingest') {
    const q = new URLSearchParams({ source: b.key.startsWith(DIRS.recordings) ? 'recorded live' : 'uploaded' });
    const [st, out] = await ask(env, `/ingest/${encodeURIComponent(b.key)}?${q}`, { method: 'POST' });
    return json(out, st);
  }
  if (p === '/admin/files/meta') {
    const fields = {};
    for (const f of ['title', 'who']) if (typeof b[f] === 'string') fields[f] = b[f].trim() || null;
    const [st, out] = await ask(env, `/programmes/${encodeURIComponent(b.key)}`, { method: 'PUT', body: JSON.stringify(fields) });
    return json(out, st);
  }
  if (p === '/admin/files/add') {
    const chans = await channels(env);
    const c = chans.find((x) => x.name === b.channel);
    if (!c) return json({ error: 'no such channel' }, 404);
    // a file that has never been indexed is indexed now; one the station cannot play is refused here
    if (!(await env.STATION_MEDIA.head(`index/${b.key}.json`))) {
      const [, ing] = await ask(env, `/ingest/${encodeURIComponent(b.key)}`, { method: 'POST' });
      if (!ing.playable) return json({ error: 'the station plays MP3 only, and this file has no MP3 frames' }, 415);
    }
    // the epoch is sent back as it was: a running order PUT without one restarts the channel's clock
    const slots = [...(c.sched.slots || []), { key: b.key, kind: 'file' }];
    const [st, out] = await ask(env, `${chanPath(c)}/schedule`, { method: 'PUT', body: JSON.stringify({ epoch: c.sched.epoch, slots }) });
    return json(st === 200 ? { ok: true, channel: c.title || c.name, slots: slots.length } : out, st);
  }
  if (p === '/admin/files/delete') {
    const chans = await channels(env);
    const playing = chans.filter((c) => (c.sched.slots || []).some((s) => s.key === b.key)).map((c) => c.title || c.name);
    if (playing.length) return json({ error: `${playing.join(' and ')} plays it; take it out of the running order first` }, 409);
    await env.STATION_MEDIA.delete([b.key, `index/${b.key}.json`]);
    return json({ ok: true });
  }
  return null;
}
