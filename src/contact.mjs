// contact.mjs: the contact form at /et/kontakt and /en/contact, which
// replaces the footer's link to Joomla's form (plans/plan-eccm-migration.md, Contact
// form). A POST is a row in contact and a mail in the outbox (src/mail.mjs)
// to CONTACT_TO with Reply-To the sender, then the thank-you on the same page.
// It works without JavaScript; with TURNSTILE_SITEKEY and TURNSTILE_SECRET
// both set, Turnstile's token is checked at siteverify, and without them
// (locally) the honeypot and the limit of five posts an hour per address are
// what keep bots out. The address is kept only as a SHA-256 hash.
import { queue, drain } from './mail.mjs';
import { CONTACT, renderContact } from './render/contact.mjs';

const PUB = { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' };
const reply = (body, status = 200) => new Response(String(body), { status, headers: PUB });
const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;
const PER_HOUR = 5;
const KEEP = '-1 year';

const hash = async (s) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].map((b) => b.toString(16).padStart(2, '0')).join('');
const turnstileOn = (env) => !!(env.TURNSTILE_SITEKEY && env.TURNSTILE_SECRET);

async function siteverify(env, token, ip) {
  if (!token) return false;
  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    return !!(await r.json()).success;
  } catch { return false; }
}

// messages and their mails older than a year go, on every post
const sweep = (env) => env.DB.batch([
  env.DB.prepare(`DELETE FROM contact WHERE created_at < strftime('%Y-%m-%dT%H:%M:%SZ','now','${KEEP}')`),
  env.DB.prepare(`DELETE FROM outbox WHERE kind = 'contact' AND created_at < strftime('%Y-%m-%dT%H:%M:%SZ','now','${KEEP}')`),
]);

export async function contact(request, env, url, ctx) {
  const lang = url.pathname.replace(/\/$/, '') === CONTACT.en ? 'en' : 'et';
  const sitekey = turnstileOn(env) ? env.TURNSTILE_SITEKEY : null;
  const show = (o = {}, status = 200) => reply(renderContact({ lang, sitekey, ...o }), status);
  if (request.method !== 'POST') return show();

  const f = Object.fromEntries([...(await request.formData())].map(([k, v]) => [k, String(v).trim()]));
  const name = (f.name || '').replace(/\s+/g, ' ').slice(0, 200);
  const email = (f.email || '').toLowerCase();
  const message = (f.message || '').replace(/\r\n/g, '\n');
  // the field a person never sees: thanked, and nothing stored or sent
  if (f.website) return show({ done: { name } });

  const errors = {};
  if (!name) errors.name = 'name';
  if (!EMAIL.test(email) || email.length > 200) errors.email = 'email';
  if (!message) errors.message = 'message';
  else if (message.length > 5000) errors.message = 'long';
  if (Object.keys(errors).length) return show({ form: f, errors }, 400);

  const ip = request.headers.get('cf-connecting-ip') || '';
  if (sitekey && !(await siteverify(env, f['cf-turnstile-response'], ip))) return show({ form: f, errors: { form: 'robot' } }, 400);
  const ipHash = await hash(`eccm-contact:${ip}`);
  const recent = await env.DB.prepare("SELECT COUNT(*) AS n FROM contact WHERE ip_hash = ? AND created_at > strftime('%Y-%m-%dT%H:%M:%SZ','now','-1 hour')").bind(ipHash).first();
  if ((recent?.n || 0) >= PER_HOUR) return show({ form: f, errors: { form: 'many' } }, 429);

  await env.DB.prepare('INSERT INTO contact (name, email, message, lang, ip_hash) VALUES (?, ?, ?, ?, ?)').bind(name, email, message, lang, ipHash).run();
  if (env.CONTACT_TO) {
    const text = `${message}\n\n${name} <${email}>\n${url.origin}${url.pathname}`;
    await queue(env, [{ kind: 'contact', to: env.CONTACT_TO, subject: `Kontakt: ${name}`, text, reply_to: email }]);
    ctx?.waitUntil(drain(env).catch(() => {}));
  }
  ctx?.waitUntil(sweep(env).catch(() => {}));
  return show({ done: { name } });
}

export const CONTACT_PATHS = Object.values(CONTACT);
