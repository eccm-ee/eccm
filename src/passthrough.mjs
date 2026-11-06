// passthrough.mjs: the radio1965 recordings, /radio1965/streams/*, which events in the VÄIN app link to on eccm.ee,
// fetched from v2in.stream, where all 44 were copied on 2026-11-05 and nginx serves them at the same path. The
// request goes on whole, so a Range request for an mp3 reaches v2in as sent; a redirect it answers is handed to the
// browser unfollowed. No old.eccm.ee: the Joomla API went to v2in too (asked 2026-11-06).
const V2IN = 'https://v2in.stream';
const STREAMS = /^\/radio1965\/streams\//;

export async function passthrough(request, env, url) {
  if (!STREAMS.test(url.pathname)) return null;
  try {
    const headers = new Headers(request.headers);
    headers.delete('host');
    return await fetch(new URL(url.pathname + url.search, V2IN), { method: request.method, headers, body: request.body, redirect: 'manual' });
  } catch {
    return new Response('v2in.stream did not answer.\n', { status: 502, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
  }
}
