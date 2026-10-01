// push.mjs: Web Push straight from the Worker, the half of positron's
// workers/items that went through Firebase done without it (asked 2026-10-01:
// "i want eccm.positron.app to pwa with push notifications. move that items
// infra over to eccm"). A browser's subscription is an endpoint on its own
// push service (Apple's, Google's, Mozilla's) and two keys; a push is a POST
// to that endpoint, its body encrypted to the browser (RFC 8291, aes128gcm)
// and the request signed with this site's key (RFC 8292, VAPID). fetch and
// WebCrypto only, no library and no Google account, so the key that sends is
// ECCM's own: VAPID_PUBLIC is a var in wrangler.jsonc and VAPID_JWK, the
// private half as a JWK, is a secret.

const enc = new TextEncoder();
const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));
const cat = (...parts) => { const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0)); let i = 0; for (const p of parts) { out.set(p, i); i += p.length; } return out; };
const hmac = async (key, data) => new Uint8Array(await crypto.subtle.sign('HMAC', await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']), data));

// the signature a push service checks against the public key the browser
// subscribed with; Apple refuses an exp more than a day out and a sub that is
// neither mailto: nor https:
async function vapid(env, endpoint) {
  const jwk = JSON.parse(env.VAPID_JWK);
  const key = await crypto.subtle.importKey('jwk', { ...jwk, ext: true }, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const head = b64u(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const body = b64u(enc.encode(JSON.stringify({ aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: env.VAPID_SUB })));
  // WebCrypto's ECDSA signature is r and s side by side, which is what ES256 wants
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(`${head}.${body}`));
  return `vapid t=${head}.${body}.${b64u(sig)}, k=${env.VAPID_PUBLIC}`;
}

// RFC 8291: one record, the payload and the 0x02 that ends it, under a key
// both sides derive from an ECDH between a one-off key pair and the
// browser's p256dh, salted with its auth secret
export async function encrypt(payload, p256dh, auth) {
  const ua = unb64u(p256dh);
  const pair = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const as = new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey));
  const uaKey = await crypto.subtle.importKey('raw', ua, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: uaKey }, pair.privateKey, 256));
  const ikm = await hmac(await hmac(unb64u(auth), shared), cat(enc.encode('WebPush: info\0'), ua, as, [1]));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const prk = await hmac(salt, ikm);
  const cek = (await hmac(prk, cat(enc.encode('Content-Encoding: aes128gcm\0'), [1]))).slice(0, 16);
  const nonce = (await hmac(prk, cat(enc.encode('Content-Encoding: nonce\0'), [1]))).slice(0, 12);
  const key = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const sealed = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, key, cat(enc.encode(payload), [2])));
  // the header: salt, the record size (4096), the key id's length and the one-off public key
  return cat(salt, [0, 0, 16, 0], [as.length], as, sealed);
}

// one push to one subscription; the answer's status is the whole result:
// 201 taken, 404 and 410 a subscription the browser has dropped
export async function send(env, sub, message) {
  const res = await fetch(sub.endpoint, {
    method: 'POST',
    headers: { authorization: await vapid(env, sub.endpoint), 'content-encoding': 'aes128gcm', 'content-type': 'application/octet-stream', ttl: '86400', urgency: 'normal' },
    body: await encrypt(JSON.stringify(message), sub.p256dh, sub.auth),
  });
  return res.status;
}
