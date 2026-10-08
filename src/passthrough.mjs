// passthrough.mjs: Tarmo's files on eccm.ee's old hosting, /radio1965/* (Väin's contributor and editor pages)
// and /radio/streams/* (the recordings), fetched from the old server once eccm.ee points here
// (docs/migration.md, "His files after cutover"). OLD_ORIGIN names that server, old.eccm.ee once ECCM adds
// the alias in cPanel; unset, as on staging and in production until cutover, every path gets null at once.
// The request goes on whole, method, headers and body, so a Range request for an mp3 and a form post on
// the editor reach the old server as sent; a redirect it answers is handed to the browser unfollowed.
const OLD = /^\/radio1965(?:\/|$)|^\/radio\/streams\//;

export async function passthrough(request, env, url) {
  if (!env.OLD_ORIGIN || !OLD.test(url.pathname)) return null;
  try {
    const headers = new Headers(request.headers);
    headers.delete('host');
    return await fetch(new URL(url.pathname + url.search, env.OLD_ORIGIN), { method: request.method, headers, body: request.body, redirect: 'manual' });
  } catch {
    return new Response('The old server did not answer.\n', { status: 502, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
  }
}
