// mail.mjs: the outbox, ../trip's astro-prod/src/lib/email.ts on D1. A mail
// is INSERTed into outbox and then drained through the send_email binding
// (EMAIL); with no binding nothing is sent and the rows are the record, which
// is how a mail is read locally and in tests. One row per recipient, so each
// issue carries its own one-click unsubscribe (RFC 8058, which Gmail and Yahoo
// require of bulk senders) in List-Unsubscribe.
//
// On the Workers Free plan Cloudflare sends only to the account's verified
// destination addresses, free; any other address is refused and the row keeps
// the refusal in error, to be retried by the cron until tries reaches MAX.
// Workers Paid lifts that (plans/plan-eccm-cms.md section 5).

const MAX = 3;
// the sending domain, out of 'ECCM <uudiskiri@eccm.positron.studio>'
const domain = (from) => /@([^>\s]+)/.exec(from)?.[1] || 'eccm.ee';
const BATCH = 20;   // a drain stays well inside one invocation's subrequests

export async function queue(env, rows) {
  if (!rows.length) return;
  const st = env.DB.prepare('INSERT INTO outbox (kind, issue_id, to_addr, subject, text, html, unsub, reply_to) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  // D1 batches are one transaction each; a big list goes in slices
  for (let i = 0; i < rows.length; i += 50) {
    await env.DB.batch(rows.slice(i, i + 50).map((r) => st.bind(r.kind, r.issue_id ?? null, r.to, r.subject, r.text, r.html ?? null, r.unsub ?? null, r.reply_to ?? null)));
  }
}

export async function drain(env) {
  if (!env.EMAIL || !env.MAIL_FROM) return 0;
  const { results } = await env.DB.prepare('SELECT * FROM outbox WHERE sent_at IS NULL AND tries < ? ORDER BY id LIMIT ?').bind(MAX, BATCH).all();
  let sent = 0;
  for (const m of results) {
    try {
      await env.EMAIL.send({
        to: m.to_addr, from: env.MAIL_FROM, subject: m.subject, text: m.text,
        ...(m.html ? { html: m.html } : {}),
        // a contact message's sender, so the office answers with Reply (src/contact.mjs)
        ...(m.reply_to ? { replyTo: m.reply_to } : {}),
        // List-Id names the list, which Gmail reads with List-Unsubscribe when it decides whether to
        // offer its own Unsubscribe beside the sender; that choice is Gmail's and comes with the sending
        // domain's volume and reputation, so the letter's own Lahku link is the one that always works
        ...(m.unsub ? { headers: { 'List-Unsubscribe': `<${m.unsub}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click', 'List-Id': `ECCM <uudiskiri.${domain(env.MAIL_FROM)}>` } } : {}),
      });
      await env.DB.prepare("UPDATE outbox SET sent_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), tries = tries + 1, error = NULL WHERE id = ?").bind(m.id).run();
      sent++;
    } catch (e) {
      await env.DB.prepare('UPDATE outbox SET tries = tries + 1, error = ? WHERE id = ?').bind(String(e?.message || e).slice(0, 300), m.id).run();
    }
  }
  return sent;
}
