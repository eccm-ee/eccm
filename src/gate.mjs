// gate.mjs: who may reach the editor. Two doors, tried in this order.
//
// 1. Cloudflare Access. The plans put an Access application with a one-time
//    PIN in front of /edit* (plan-eccm-setup.md section 2, plan-eccm-cms.md
//    section 6). Access then sends a signed JWT in Cf-Access-Jwt-Assertion on
//    every request, and this module verifies it against the team's public
//    keys at https://<team>.cloudflareaccess.com/cdn-cgi/access/certs (READ
//    2026-09-28 in the Workers changelog example on developers.cloudflare.com,
//    which does the same with jose; this is the same check in plain WebCrypto
//    so there is no dependency). The door is open only when ACCESS_TEAM is
//    set; ACCESS_AUD, when set, must appear in the token's aud. Access itself
//    refuses a visitor before the Worker runs, so this is the check that
//    keeps a forged or missing header from mattering, not the login.
//    ⚠️ Written from the documentation and not run against a real team from
//    this machine: there is no Access application on staging yet.
//
// 2. The staging stand-in, until Access exists: a secret EDITOR_TOKEN
//    (wrangler secret put EDITOR_TOKEN --env staging) that a person presents
//    once at /login?token=..., which sets an HttpOnly cookie holding a hash
//    of the token, and every editor request after that carries the cookie.
//    This is not a login system: one shared secret, no identity, and its
//    whole job is to keep the form off the open web until the Access
//    application is created. Then ACCESS_TEAM is set, the secret is deleted,
//    and /login answers 503.
//
// Neither configured: 503, the editor is closed. The default is silence.
const COOKIE = 'eccm_edit';
const MONTH = 60 * 60 * 24 * 30;
const enc = new TextEncoder();
const dec = new TextDecoder();

const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
// constant time on equal lengths; a length mismatch returns at once, which
// tells an attacker the token's length and nothing else
const same = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
};
const cookieValue = async (token) => hex(await crypto.subtle.digest('SHA-256', enc.encode('eccm-editor-cookie:' + token)));
const cookies = (request) => Object.fromEntries((request.headers.get('cookie') || '').split(';').map((c) => c.trim().split('=')).filter(([k, v]) => k && v != null).map(([k, ...v]) => [k, v.join('=')]));

export const setCookie = async (token, url) => `${COOKIE}=${await cookieValue(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MONTH}${url.protocol === 'https:' ? '; Secure' : ''}`;
export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
export const tokenMatches = (given, env) => same(String(given ?? ''), String(env.EDITOR_TOKEN ?? ''));

// ── the Access JWT ──────────────────────────────────────────────────────────
const b64u = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=')), (c) => c.charCodeAt(0));
let certCache = { iss: null, at: 0, keys: [] };
const certs = async (iss) => {
  if (certCache.iss === iss && Date.now() - certCache.at < 10 * 60 * 1000) return certCache.keys;
  const r = await fetch(`${iss}/cdn-cgi/access/certs`);
  if (!r.ok) return [];
  const j = await r.json();
  certCache = { iss, at: Date.now(), keys: j.keys || [] };
  return certCache.keys;
};
export async function verifyAccess(token, team, aud) {
  try {
    const [h, p, sig] = token.split('.');
    if (!sig) return null;
    const header = JSON.parse(dec.decode(b64u(h)));
    const payload = JSON.parse(dec.decode(b64u(p)));
    if (header.alg !== 'RS256') return null;
    const iss = `https://${team}.cloudflareaccess.com`;
    const now = Math.floor(Date.now() / 1000);
    if (payload.iss !== iss) return null;
    if (!payload.exp || payload.exp < now - 60) return null;
    if (payload.nbf && payload.nbf > now + 60) return null;
    if (aud && ![].concat(payload.aud || []).includes(aud)) return null;
    const jwk = (await certs(iss)).find((k) => k.kid === header.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64u(sig), enc.encode(`${h}.${p}`));
    return ok ? { who: payload.email || payload.sub || 'access', via: 'access' } : null;
  } catch {
    return null;
  }
}

// { who, via } when the request may edit; { status, reason } when it may not
export async function identify(request, env) {
  const jwt = request.headers.get('cf-access-jwt-assertion');
  if (jwt && env.ACCESS_TEAM) return (await verifyAccess(jwt, env.ACCESS_TEAM, env.ACCESS_AUD)) || { status: 401, reason: 'access' };
  if (env.EDITOR_TOKEN) {
    const c = cookies(request)[COOKIE];
    if (c && same(c, await cookieValue(env.EDITOR_TOKEN))) return { who: 'token', via: 'token' };
    return { status: 401, reason: 'token' };
  }
  return { status: 503, reason: 'unset' };
}
