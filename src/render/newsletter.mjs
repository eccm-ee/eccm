// newsletter.mjs: the newsletter's pages, asked 2026-10-01 as "go". Public:
// the sign-up with the archive of sent issues under it, the pages a confirm
// link and an unsubscribe link land on, and one sent issue as a page
// (plans/plan-eccm-cms.md section 5, hint 7). The editor's, in English (asked
// 2026-10-02: "convert all admin pages to english only") and in its form: the list of issues, one issue's form with the letter as it will
// arrive drawn under it, and the outbox with the addresses masked, since the
// editor is open to anyone.
import { PAGE_TITLES } from '../og/card.mjs';
import { html, raw } from './html.mjs';
import { page, OTHER } from './chrome.mjs';
import { field, input } from './editor.mjs';
import { md } from './md.mjs';
import { dateLong } from './dates.mjs';
import { table } from './table.mjs';
import { badge } from './badge.mjs';

export const NL = { et: '/et/uudiskiri', en: '/en/newsletter' };
const T = {
  et: { title: 'Uudiskiri', lead: 'ECCM-i kava ja uudised e-postiga. Lahkuda saab iga kirja lõpust.', email: 'E-post', join: 'Liitu', bad: 'See ei ole e-posti aadress.',
        sent: (a) => `Saatsime aadressile ${a} kirja. Tellimus hakkab kehtima, kui avad selles oleva lingi.`, already: (a) => `Aadress ${a} on juba uudiskirjaga liitunud.`,
        past: 'Varasemad kirjad', date: 'Kuupäev', letter: 'Kiri', confirmed: 'Oled uudiskirjaga liitunud. Esimene kiri tuleb koos järgmise kavaga.', gone: 'Seda linki ei ole. Võib-olla on tellimus juba lõpetatud.',
        leaveQ: (a) => `Lahkud ECCM-i uudiskirjast aadressil ${a}.`, leave: 'Lahku', left: 'Oled uudiskirjast lahkunud. Rohkem kirju ei tule.', back: 'Tagasi uudiskirja lehele', draft: 'Eelvaade. See kiri on veel saatmata.' },
  en: { title: 'Newsletter', lead: 'The ECCM programme and news by email. Every letter ends with a way to leave.', email: 'Email', join: 'Subscribe', bad: 'That is not an email address.',
        sent: (a) => `We sent a letter to ${a}. The subscription starts when you open the link in it.`, already: (a) => `${a} is already subscribed.`,
        past: 'Earlier letters', date: 'Date', letter: 'Letter', confirmed: 'You are subscribed. The first letter comes with the next programme.', gone: 'There is no such link. Perhaps the subscription has already ended.',
        leaveQ: (a) => `You are leaving the ECCM newsletter at ${a}.`, leave: 'Unsubscribe', left: 'You have unsubscribed. No more letters will come.', back: 'Back to the newsletter page', draft: 'Preview. This letter has not been sent yet.' },
};
const alt = (lang) => ({ lang: OTHER[lang], href: NL[OTHER[lang]] });
const sentDay = (utc, lang) => dateLong(utc.slice(0, 10), lang);

// the sign-up, and the sent issues in this language under it
export const renderSignup = ({ lang, issues, form = {}, say, err }) => {
  const t = T[lang];
  const body = html`  <article class="page-text news-page">
    <h1>${t.title}</h1>
    <p class="note">${t.lead}</p>
    ${say ? html`<p class="news-say" role="status">${say}</p>` : html`<form class="form news-form" method="post" action="${NL[lang]}">
      ${field({ id: 'n-email', label: t.email, err, control: input('n-email', 'email', form.email, ' type="email" autocomplete="email" required') })}
      <div class="hp" aria-hidden="true"><label for="n-site">Website</label><input id="n-site" name="website" tabindex="-1" autocomplete="off"></div>
      <div class="actions"><button class="btn btn-pri" type="submit">${t.join}</button></div>
    </form>`}
    ${issues.length ? html`<section class="news-past"><h2>${t.past}</h2>${table({ label: t.past, cols: [{ label: t.date }, { label: t.letter, cls: 'main' }], rows: issues.map((i) => [html`<time datetime="${i.sent_at}">${sentDay(i.sent_at, lang)}</time>`, html`<a href="${NL[lang]}/${i.slug}">${i.subject}</a>`]) })}</section>` : ''}
  </article>`;
  return page({ lang, title: `${t.title}.`, alternate: alt(lang), body, og: { key: 'newsletter', title: PAGE_TITLES.newsletter[lang] } });
};

// the page a confirm or unsubscribe link lands on
export const renderNotice = ({ lang, text, form }) => {
  const t = T[lang];
  const body = html`  <article class="page-text news-page">
    <h1>${t.title}</h1>
    <p class="news-say" role="status">${text}</p>
    ${form ? html`<form class="form" method="post" action="${form}"><div class="actions"><button class="btn btn-pri" type="submit">${t.leave}</button></div></form>` : html`<p><a href="${NL[lang]}">${t.back}</a></p>`}
  </article>`;
  return page({ lang, title: `${t.title}.`, alternate: alt(lang), body, og: { key: 'newsletter', title: PAGE_TITLES.newsletter[lang] } });
};
export const NOTICE = T;

// one sent issue as a page
// draft: a test letter's preview, under the notice line the editor's preview uses
export const renderArchive = ({ lang, issue, draft = false }) => {
  const body = html`  <article class="page-text">
    <p class="crumb"><a href="${NL[lang]}">${T[lang].title}</a>${draft ? '' : `, ${sentDay(issue.sent_at, lang)}`}</p>
    <h1>${issue.subject || T[lang].title}</h1>
    <div class="prose flow">${raw(md(issue.body))}</div>
  </article>`;
  return page({ lang, title: `${issue.subject || T[lang].title}.`, alternate: alt(lang), body, notice: draft ? T[lang].draft : undefined });
};

// ── the editor ───────────────────────────────────────────────────────────
const LANG = { et: 'Estonian', en: 'English' };
const STATE = (i) => (i.status === 'sent' ? `Sent ${sentDay(i.sent_at, 'en')} to ${i.sent_count} ${i.sent_count === 1 ? 'subscriber' : 'subscribers'}.` : 'Draft.');

export const renderIssues = ({ issues, counts }) => {
  const c = (lang, status) => counts.find((r) => r.lang === lang && r.status === status)?.n || 0;
  const body = html`  <h1>Newsletter</h1>
  <p class="note">Confirmed subscribers: ${c('et', 'confirmed')} in Estonian, ${c('en', 'confirmed')} in English. Awaiting confirmation: ${c('et', 'pending') + c('en', 'pending')}. The sign-up pages are <a href="${NL.et}">${NL.et}</a> and <a href="${NL.en}">${NL.en}</a>.</p>
  <div class="items">
    <form class="form" method="post" action="/edit/uudiskiri/new">
      <h2>New letter</h2>
      <p class="hint">The letter comes filled in with the next six weeks of events. The greeting, one paragraph and the signature are yours to write.</p>
      <div class="actions">
        <button class="btn" type="submit" name="lang" value="et">In Estonian</button>
        <button class="btn" type="submit" name="lang" value="en">In English</button>
      </div>
    </form>
    <section class="items-list">
      <h2>Letters</h2>
      ${issues.length ? table({ label: 'Letters', cols: [{ label: 'Date' }, { label: 'Subject', cls: 'main' }, { label: 'Language' }, { label: 'Status' }], rows: issues.map((i) => ({ current: i.status === 'draft', cells: [html`<time datetime="${i.sent_at || i.updated_at}">${sentDay(i.sent_at || i.updated_at, 'en')}</time>`, html`<a href="/edit/uudiskiri/${i.id}">${i.subject || '(no subject)'}</a>`, i.lang === 'et' ? 'Estonian' : 'English', i.status === 'sent' ? html`${badge('Sent', 'done')} <span class="small">${i.sent_count}</span>` : badge('Draft', 'neutral')] })) }) : html`<p class="note">No letters yet.</p>`}
    </section>
    <p><a href="/edit/uudiskiri/postkast">Outbox</a>: every mail, sent and unsent.</p>
  </div>`;
  return page({ wide: true, lang: 'en', title: 'Newsletter.', body });
};

export const renderIssueForm = ({ issue, form = issue, errors = [], say, mail, test = '' }) => {
  const err = (f) => (errors.find((e) => e.field === f) || {}).msg;
  const sent = issue.status === 'sent';
  const body = html`  <p class="crumb"><a href="/edit/uudiskiri">Newsletter</a></p>
  <h1>${issue.subject || 'New letter'}</h1>
  <p class="note">A letter in ${LANG[issue.lang]}. ${STATE(issue)}${sent ? html` <a href="${NL[issue.lang]}/${issue.slug}">On the web</a>.` : ''}</p>
  ${errors.length ? html`<div class="errors" role="alert"><p>That did not work. Please fix:</p><ul>${errors.map((e) => html`<li>${e.msg}</li>`)}</ul></div>` : ''}
  ${say ? html`<p class="news-say" role="status">${say}</p>` : ''}
  ${sent ? '' : html`<form class="form form-wide" method="post" action="/edit/uudiskiri/${issue.id}">
    ${field({ id: 'f-subject', label: 'Subject', err: err('subject'), hint: 'The line in the inbox. Write it yourself, not “Newsletter no. 4”.', control: input('f-subject', 'subject', form.subject, ' maxlength="140"') })}
    ${field({ id: 'f-body', label: 'Letter', err: err('body'), hint: 'A blank line starts a new paragraph, ## is a subheading, **text** is bold, [words](https://…) is a link.', control: html`<textarea id="f-body" name="body" rows="24">${form.body}</textarea>` })}
    <div class="actions">
      <button class="btn btn-pri" type="submit" name="do" value="save">Save</button>
      <button class="btn" type="submit" name="do" value="delete">Delete</button>
      <a class="btn btn-end" href="/edit/uudiskiri">Cancel</a>
    </div>
    <h2>Send</h2>
    ${field({ id: 'f-test', label: 'Test letter to', err: err('test'), hint: 'On the free Cloudflare plan, mail reaches only the account’s verified addresses.', control: input('f-test', 'test', test, ' type="email"') })}
    <div class="actions"><button class="btn" type="submit" name="do" value="test">Send test letter</button></div>
    <label class="check"><input type="checkbox" name="sure" value="1"> I am sending to every confirmed subscriber in ${LANG[issue.lang]}</label>
    ${err('sure') ? html`<p class="hint err">${err('sure')}</p>` : ''}
    <div class="actions"><button class="btn btn-pri" type="submit" name="do" value="send">Send to all</button></div>
  </form>`}
  <h2 class="mail-head">How it looks in the inbox</h2>
  <iframe class="mail-preview" title="The letter in the inbox" srcdoc="${mail}"></iframe>`;
  return page({ wide: true, lang: 'en', title: `${issue.subject || 'New letter'}.`, body });
};

// a@b.ee as a***@b.ee: the outbox shows that a mail went and to whom roughly, never the list
const mask = (a) => String(a).replace(/^(.)[^@]*/, '$1***');
const KIND = { confirm: 'Confirmation', issue: 'Letter', test: 'Test letter' };
export const renderOutbox = ({ rows }) => {
  const body = html`  <p class="crumb"><a href="/edit/uudiskiri">Newsletter</a></p>
  <h1>Outbox</h1>
  <p class="note">The last 100 mails, newest first. An unsent mail is tried again every ten minutes, up to three times.</p>
  ${rows.length ? table({ label: 'Outbox', cols: [{ label: 'Time' }, { label: 'Kind' }, { label: 'Subject', cls: 'main' }, { label: 'To' }, { label: 'Status' }], rows: rows.map((m) => [html`<time datetime="${m.created_at}">${m.created_at.slice(0, 16).replace('T', ' ')}</time>`, KIND[m.kind], html`${m.subject}${!m.sent_at && m.error ? html`<br><span class="small">${m.error}</span>` : ''}`, mask(m.to_addr), m.sent_at ? badge('Sent', 'done') : m.error ? html`${badge('Failed', 'problem')} <span class="small">${m.tries} ${m.tries === 1 ? 'try' : 'tries'}</span>` : badge('Waiting', 'progress')]) }) : html`<p class="note">No mail yet.</p>`}`;
  return page({ wide: true, lang: 'en', title: 'Outbox.', body });
};
