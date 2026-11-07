// auth.mjs: who may edit, in place of the Cloudflare Access the migration
// plan had (plans/plan-eccm-migration.md, Login on admin and editing). One
// key for ECCM, the secret EDITOR_KEY, typed once at /login (asked
// 2026-11-06: "no its one eccm editor key", in place of a key per editor);
// the reply is a cookie for 90 days holding an expiry signed with HMAC.
//
// The key is v2in's admin token (server/conductor/gate.mjs): xxxx-xxxx-xxxx,
// 60 bits, read as typed any way (case, dashes and spaces dropped, i and l as
// 1, o as 0), its hash compared with EDITOR_KEY's in constant time, and at
// most ten wrong keys an hour from one address, then 429. The count is in D1
// (login_fail), since a Workers rate limit binding counts over 10 or 60
// seconds only and this one is over an hour.
//
// The signing key is SESSION_SECRET together with a hash of EDITOR_KEY, so a
// new EDITOR_KEY logs every browser out, and so does a new SESSION_SECRET.
// SESSION_SECRET stays a secret of its own because a cookie signed with a
// key drawn from the 60-bit EDITOR_KEY alone would let whoever holds one
// cookie test guesses offline, past the ten an hour.
//
// Behind it: /admin, /edit, and the static /ui, which assets.run_worker_first sends
// here first. A GET without a session goes to /login?next=..., anything else
// is 401.
import { renderLogin } from './render/login.mjs';

const COOKIE = 'eccm_editor';
const DAYS = 90;
const FAILS_PER_HOUR = 10;
const enc = new TextEncoder();
const NOSTORE = { 'cache-control': 'no-store', 'x-robots-tag': 'noindex' };

const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = (s) => { try { return Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)); } catch { return null; } };

// the key as typed any way, the one form that is hashed
export const normKey = (k) => String(k || '').trim().toLowerCase().replace(/[\s-]/g, '').replace(/[il]/g, '1').replace(/o/g, '0');
const sha256 = (s) => crypto.subtle.digest('SHA-256', enc.encode(s));
const ready = (env) => !!(env.EDITOR_KEY && env.SESSION_SECRET);

// the protected paths, by the path with its trailing slash dropped
const STATIC = ['/ui', '/ui.html'];
export const isStatic = (p) => STATIC.includes(p.replace(/\/$/, ''));
export const isProtected = (path) => {
  const p = path.replace(/\/$/, '') || '/';
  return isStatic(p) || /^\/(admin|edit)(\/|$)/.test(p);
};

// the HMAC key: SESSION_SECRET and the hash of EDITOR_KEY as normalised
const hmacKey = async (env) => crypto.subtle.importKey('raw',
  enc.encode(`${env.SESSION_SECRET}:${hex(await sha256(`eccm-editor-key:${normKey(env.EDITOR_KEY)}`))}`),
  { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);

const cookieOf = (request) => {
  const m = new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`).exec(request.headers.get('cookie') || '');
  return m ? m[1] : null;
};
// Lax, not Strict: a link from a mail or a chat to /admin carries the cookie, a form posted from another site still does not
const setCookie = (value, maxAge) => `${COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;

// whether the request carries a live session: signature and expiry
export async function loggedIn(request, env) {
  const c = cookieOf(request);
  if (!c || !ready(env)) return false;
  const [exp, sig] = c.split('.');
  if (!/^\d+$/.test(exp || '') || Number(exp) < Date.now()) return false;
  const raw = sig && unb64u(sig);
  if (!raw) return false;
  // verify is constant time
  return crypto.subtle.verify('HMAC', await hmacKey(env), raw, enc.encode(`editor.${exp}`));
}

// a request to a protected path: null, or the Response that turns it away
export async function gate(request, env, url) {
  if (await loggedIn(request, env)) return null;
  if (request.method === 'GET' || request.method === 'HEAD') {
    const next = url.pathname + url.search;
    return new Response(null, { status: 303, headers: { ...NOSTORE, location: `/login?${new URLSearchParams({ next })}` } });
  }
  return new Response('Log in first, at /login.\n', { status: 401, headers: { ...NOSTORE, 'content-type': 'text/plain; charset=utf-8' } });
}

// next only as a path on this site, never //host or /\host
const safeNext = (n) => (typeof n === 'string' && /^\/(?![/\\])/.test(n) ? n : '/admin');

// the typed key against EDITOR_KEY, both hashed so their lengths match, compared in constant time
const keyOk = async (env, key) => {
  if (normKey(key).length < 12) return false;
  const have = new Uint8Array(await sha256(normKey(key)));
  const want = new Uint8Array(await sha256(normKey(env.EDITOR_KEY)));
  return crypto.subtle.timingSafeEqual(have, want);
};

export async function login(request, env, url) {
  const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'et';
  const next = safeNext(url.searchParams.get('next'));
  const show = (err, status = 200) => new Response(String(renderLogin({ lang, next: url.searchParams.get('next') ? next : '', err })), { status, headers: { ...NOSTORE, 'content-type': 'text/html; charset=utf-8' } });
  if (!ready(env)) return show('off', 503);
  // already in: on to where the editor was going (asked 2026-11-06: "when i have key recorded why your prompt login again")
  if (request.method !== 'POST') return (await loggedIn(request, env)) ? new Response(null, { status: 303, headers: { ...NOSTORE, location: next } }) : show();

  const ipHash = hex(await sha256(`eccm-login:${request.headers.get('cf-connecting-ip') || ''}`));
  const recent = await env.DB.prepare("SELECT COUNT(*) AS n FROM login_fail WHERE ip_hash = ? AND at > strftime('%Y-%m-%dT%H:%M:%SZ','now','-1 hour')").bind(ipHash).first();
  if ((recent?.n || 0) >= FAILS_PER_HOUR) return show('many', 429);

  const fd = await request.formData().catch(() => null);
  if (!(await keyOk(env, fd ? String(fd.get('key') || '') : ''))) {
    await env.DB.batch([
      env.DB.prepare('INSERT INTO login_fail (ip_hash) VALUES (?)').bind(ipHash),
      env.DB.prepare("DELETE FROM login_fail WHERE at < strftime('%Y-%m-%dT%H:%M:%SZ','now','-1 hour')"),
    ]);
    return show('bad', 401);
  }
  const exp = Date.now() + DAYS * 864e5;
  const sig = b64u(await crypto.subtle.sign('HMAC', await hmacKey(env), enc.encode(`editor.${exp}`)));
  return new Response(null, { status: 303, headers: { ...NOSTORE, location: next, 'set-cookie': setCookie(`${exp}.${sig}`, DAYS * 86400) } });
}

export const logout = () => new Response(null, { status: 303, headers: { ...NOSTORE, location: '/', 'set-cookie': setCookie('', 0) } });
