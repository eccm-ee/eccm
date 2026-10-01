// mail.mjs: the newsletter as an email, ../trip's astro-prod/src/lib/
// emailRender.ts (read 2026-10-01) in eccm's ink, and the confirmation mail.
// What email forces, from trip's notes:
// - inline styles win: Gmail drops <head><style> in forwards and in its app,
//   so every visual style is an attribute and the <style> block (the phone
//   width, dark mode) is progressive only;
// - tables with role="presentation": Outlook on Windows renders with Word, so
//   no flex or grid, the width held by an MSO conditional table;
// - no web fonts: Outlook and the Gmail app drop them, so Helvetica and Arial,
//   the faces eccm.css names after Schibsted Grotesk, and a text wordmark;
// - mso-line-height-rule:exactly wherever a line height is set, the Apple
//   no-reformatting meta, and a hidden preheader padded with invisible
//   characters so the inbox snippet is the letter's first line and no more;
// - no pictures yet; when a composer adds them: absolute https, JPEG (no mail
//   client draws AVIF, which /cdn-cgi/image/ serves by default), alt, width
//   and height, and a ground colour behind.
// The page is white with no box around the letter, the site's own rule
// (eccm-ui section 2: hierarchy is size and space, never a box). The plain
// part is the same words, *bold* and links as "text <url>", which is what a
// plaintext client and a parser read (plans/plan-eccm-cms.md section 5, hint 5).
import { esc } from './html.mjs';
import { md } from './md.mjs';

const FONT = 'Helvetica,Arial,sans-serif';
const INK = '#1a1a1a';
const INK2 = '#555555';
const RULE = '#d9d9d9';

const L = {
  et: { web: 'Loe veebis', leave: 'Lahku uudiskirjast', who: 'Eesti Nüüdismuusika Keskus, Pühavaimu 9, Tallinn',
        cSubject: 'Kinnita ECCM-i uudiskirja tellimus', cBody: (u) => `Tere!\n\nKeegi, loodetavasti sina, soovis selle aadressiga ECCM-i uudiskirja. Tellimuse kinnitamiseks ava see link:\n\n${u}\n\nKui see polnud sina, ära tee midagi: ilma kinnituseta kirju ei tule.\n\nEesti Nüüdismuusika Keskus` },
  en: { web: 'Read on the web', leave: 'Unsubscribe', who: 'Estonian Centre of Contemporary Music, Pühavaimu 9, Tallinn',
        cSubject: 'Confirm your ECCM newsletter subscription', cBody: (u) => `Hello!\n\nSomeone, hopefully you, asked for the ECCM newsletter at this address. To confirm, open this link:\n\n${u}\n\nIf it was not you, do nothing: no letter comes without confirmation.\n\nEstonian Centre of Contemporary Music` },
};

const inlineBody = (h) => h
  // one empty line between paragraphs and two above a heading, half under it: the site's own .flow
  // rule (eccm-ui section 1), in pixels because mail has no lh unit; 17px at 1.5 is a 26px line
  // (asked 2026-10-01: "add one empty line / space before each title")
  .replace(/<p>/g, `<p style="margin:0 0 26px;font-size:17px;mso-line-height-rule:exactly;line-height:1.5;color:${INK}">`)
  .replace(/<h2>/g, `<h2 style="margin:52px 0 13px;font-size:21px;mso-line-height-rule:exactly;line-height:1.25;color:${INK};font-weight:400">`)
  .replace(/<h3>/g, `<h3 style="margin:24px 0 8px;font-size:17px;mso-line-height-rule:exactly;line-height:1.3;color:${INK};font-weight:700">`)
  .replace(/<(ul|ol)>/g, `<$1 style="margin:0 0 26px;padding:0 0 0 22px;font-size:17px;mso-line-height-rule:exactly;line-height:1.5;color:${INK}">`)
  .replace(/<li>/g, '<li style="margin:0 0 6px">')
  .replace(/<b>/g, '<b style="font-weight:700">')
  .replace(/<a href=/g, `<a style="color:${INK};text-decoration:underline" href=`);

const INVIS = ' ‌​‍‎‏﻿';
const pad = (used) => { let out = ''; for (let i = 0; used + out.length < 200; i++) out += INVIS[i % INVIS.length]; return out; };

// the plain part from the markdown source
export const toText = (src) => String(src ?? '')
  .replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1 <$2>')
  .replace(/\*\*([^*\n]+)\*\*/g, '*$1*')
  .replace(/(^|\s)_([^_\n]+)_/g, '$1$2')
  .replace(/^#{1,3}\s+(.+)$/gm, (_, h) => h.toUpperCase())
  .trim();

// one issue as { html, text }; web is the archive page, unsub this recipient's link
export function renderIssueMail(issue, { web, unsub }) {
  const t = L[issue.lang];
  const pre = toText(issue.body).replace(/\s+/g, ' ').slice(0, 110);
  const foot = (c) => `<a href="${esc(web)}" style="color:${c}">${t.web}</a>&nbsp;&nbsp;&nbsp;<a href="${esc(unsub)}" style="color:${c}">${t.leave}</a>`;
  const html = `<!doctype html>
<html lang="${issue.lang}"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${esc(issue.subject)}</title>
<style>
  @media (max-width:620px){ .wrap{width:100%!important} .pad{padding-left:20px!important;padding-right:20px!important} }
  @media (prefers-color-scheme:dark){ .page{background:#141414!important} .ink,.ink p,.ink h2,.ink h3,.ink li,.ink a{color:#f0f0f0!important} .ink2,.ink2 a{color:#b0b0b0!important} .rule{border-color:#3a3a3a!important} }
</style>
</head>
<body style="margin:0;padding:0;background:#ffffff" class="page">
<div style="display:none;line-height:1px;max-height:0;max-width:0;overflow:hidden;opacity:0">${esc(pre)}${pad(pre.length)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff" class="page">
<tr><td align="center" style="padding:32px 12px">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="wrap" style="width:600px;max-width:600px">
  <tr><td class="pad" style="padding:0 24px 32px">
    <a href="${esc(web)}" class="ink" style="text-decoration:none;color:${INK};font-family:${FONT};font-size:28px;font-weight:700;mso-line-height-rule:exactly;line-height:1">ECCM</a>
  </td></tr>
  <tr><td class="pad ink" style="padding:0 24px;font-family:${FONT};color:${INK}">
    ${inlineBody(md(issue.body))}
  </td></tr>
  <tr><td class="pad" style="padding:16px 24px 8px">
    <hr class="rule" style="border:none;border-top:1px solid ${RULE};margin:0 0 16px">
    <p class="ink2" style="margin:0;font-family:${FONT};font-size:14px;mso-line-height-rule:exactly;line-height:1.5;color:${INK2}">${foot(INK2)}</p>
    <p class="ink2" style="margin:8px 0 0;font-family:${FONT};font-size:14px;mso-line-height-rule:exactly;line-height:1.5;color:${INK2}">${esc(t.who)}</p>
  </td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body></html>`;
  const text = `${toText(issue.body)}\n\n-- \n${t.web}: ${web}\n${t.leave}: ${unsub}\n${t.who}\n`;
  return { html, text };
}

export const confirmMail = (lang, url) => ({ subject: L[lang].cSubject, text: L[lang].cBody(url) });
