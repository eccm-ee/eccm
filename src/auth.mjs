// auth.mjs: who may edit, in place of the Cloudflare Access the migration
// plan had (plans/plan-eccm-migration.md, Login on admin and editing). Each editor has a
// key of their own, a row in editor (migrations/0009_editor.sql) made by
// tools/editors.mjs, typed once at /login; the reply is a cookie for 90 days
// holding a session signed with the secret SESSION_SECRET, naming the row.
// A revoked row ends its sessions on their next request.
//
// The key is v2in's admin token (server/conductor/gate.mjs): xxxx-xxxx-xxxx,
// 60 bits, read as typed any way (case, dashes and spaces dropped, i and l as
// 1, o as 0), its hash compared in constant time with every live row's, and
// at most ten wrong keys an hour from one address, then 429. The count is in
// D1 (login_fail), since a Workers rate limit binding counts over 10 or 60
// seconds only and this one is over an hour.
//
// Behind it: /admin, /edit, and the static /ds, /logo and /social, which assets.run_worker_first sends
// here first. A GET without a session goes to /login?next=..., anything else
// is 401.
import { renderLogin } from './render/login.mjs';

const COOKIE = 'eccm_editor';
const DAYS = 90;
const FAILS_PER_HOUR = 10;
const enc = new TextEncoder();
const NOSTORE = { 'cache-control': 'no-store', 'x-robots-tag': 'noindex' };

const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const unhex = (s) => new Uint8Array((String(s).match(/../g) || []).map((h) => parseInt(h, 16)));
const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = (s) => { try { return Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)); } catch { return null; } };

// the key as typed any way, the one form that is hashed (tools/editors.mjs has the same line)
export const normKey = (k) => String(k || '').trim().toLowerCase().replace(/[\s-]/g, '').replace(/[il]/g, '1').replace(/o/g, '0');
const sha256 = (s) => crypto.subtle.digest('SHA-256', enc.encode(s));

// the protected paths, by the path with its trailing slash dropped
const STATIC = ['/ds', '/ds.html', '/logo', '/logo.html', '/social', '/social.html'];
export const isStatic = (p) => STATIC.includes(p.replace(/\/$/, ''));
export const isProtected = (path) => {
  const p = path.replace(/\/$/, '') || '/';
  return isStatic(p) || /^\/(admin|edit)(\/|$)/.test(p);
};

const hmacKey = (secret) => crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
const sign = async (secret, payload) => b64u(await crypto.subtle.sign('HMAC', await hmacKey(secret), enc.encode(payload)));

const cookieOf = (request) => {
  const m = new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`).exec(request.headers.get('cookie') || '');
  return m ? m[1] : null;
};
const setCookie = (value, maxAge) => `${COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`;

// the editor the request's session names, or null: signature, expiry, and a row not revoked
export async function editorOf(request, env) {
  const c = cookieOf(request);
  if (!c || !env.SESSION_SECRET) return null;
  const [id, exp, sig] = c.split('.');
  if (!/^\d+$/.test(id || '') || !/^\d+$/.test(exp || '') || Number(exp) < Date.now()) return null;
  const raw = sig && unb64u(sig);
  if (!raw) return null;
  // verify is constant time
  const ok = await crypto.subtle.verify('HMAC', await hmacKey(env.SESSION_SECRET), raw, enc.encode(`${id}.${exp}`));
  if (!ok) return null;
  return await env.DB.prepare('SELECT id, name, last_used FROM editor WHERE id = ? AND revoked_at IS NULL').bind(Number(id)).first();
}

// last_used at most once an hour, after the reply
const touch = (env, who, ctx) => {
  if (who.last_used && Date.now() - Date.parse(who.last_used) < 36e5) return;
  const run = env.DB.prepare("UPDATE editor SET last_used = strftime('%Y-%m-%dT%H:%M:%SZ','now') WHERE id = ?").bind(who.id).run().catch(() => {});
  if (ctx) ctx.waitUntil(run);
};

// a request to a protected path: the editor, or the Response that turns it away
export async function gate(request, env, url, ctx) {
  const who = await editorOf(request, env);
  if (who) { touch(env, who, ctx); return { who }; }
  if (request.method === 'GET' || request.method === 'HEAD') {
    const next = url.pathname + url.search;
    return { res: new Response(null, { status: 303, headers: { ...NOSTORE, location: `/login?${new URLSearchParams({ next })}` } }) };
  }
  return { res: new Response('Log in first, at /login.\n', { status: 401, headers: { ...NOSTORE, 'content-type': 'text/plain; charset=utf-8' } }) };
}

// next only as a path on this site, never //host or /\host
const safeNext = (n) => (typeof n === 'string' && /^\/(?![/\\])/.test(n) ? n : '/admin');

// the one key that matches, compared with every live row's hash in constant time and no early exit
async function match(env, key) {
  const want = new Uint8Array(await sha256(normKey(key)));
  const rows = (await env.DB.prepare('SELECT id, key_hash FROM editor WHERE revoked_at IS NULL').all()).results;
  let found = null;
  for (const r of rows) {
    const have = unhex(r.key_hash);
    if (have.length === want.length && crypto.subtle.timingSafeEqual(have, want) && !found) found = r;
  }
  return found;
}

export async function login(request, env, url, ctx) {
  const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'et';
  const next = safeNext(url.searchParams.get('next'));
  const show = (err, status = 200) => new Response(String(renderLogin({ lang, next: url.searchParams.get('next') ? next : '', err })), { status, headers: { ...NOSTORE, 'content-type': 'text/html; charset=utf-8' } });
  if (!env.SESSION_SECRET) return show('off', 503);
  if (request.method !== 'POST') return show();

  const ipHash = hex(await sha256(`eccm-login:${request.headers.get('cf-connecting-ip') || ''}`));
  const recent = await env.DB.prepare("SELECT COUNT(*) AS n FROM login_fail WHERE ip_hash = ? AND at > strftime('%Y-%m-%dT%H:%M:%SZ','now','-1 hour')").bind(ipHash).first();
  if ((recent?.n || 0) >= FAILS_PER_HOUR) return show('many', 429);

  const fd = await request.formData().catch(() => null);
  const key = fd ? String(fd.get('key') || '') : '';
  const row = normKey(key).length >= 12 ? await match(env, key) : null;
  if (!row) {
    await env.DB.batch([
      env.DB.prepare('INSERT INTO login_fail (ip_hash) VALUES (?)').bind(ipHash),
      env.DB.prepare("DELETE FROM login_fail WHERE at < strftime('%Y-%m-%dT%H:%M:%SZ','now','-1 hour')"),
    ]);
    return show('bad', 401);
  }
  await env.DB.prepare("UPDATE editor SET last_used = strftime('%Y-%m-%dT%H:%M:%SZ','now') WHERE id = ?").bind(row.id).run();
  const exp = Date.now() + DAYS * 864e5;
  const value = `${row.id}.${exp}.${await sign(env.SESSION_SECRET, `${row.id}.${exp}`)}`;
  return new Response(null, { status: 303, headers: { ...NOSTORE, location: next, 'set-cookie': setCookie(value, DAYS * 86400) } });
}

export const logout = () => new Response(null, { status: 303, headers: { ...NOSTORE, location: '/', 'set-cookie': setCookie('', 0) } });
