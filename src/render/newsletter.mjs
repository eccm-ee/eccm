// newsletter.mjs: the newsletter's pages, asked 2026-10-01 as "go". Public:
// the sign-up with the archive of sent issues under it, the pages a confirm
// link and an unsubscribe link land on, and one sent issue as a page
// (plans/plan-eccm-cms.md section 5, hint 7). The editor's, in Estonian and in
// its form: the list of issues, one issue's form with the letter as it will
// arrive drawn under it, and the outbox with the addresses masked, since the
// editor is open to anyone.
import { html, raw } from './html.mjs';
import { page, OTHER } from './chrome.mjs';
import { field, input } from './editor.mjs';
import { md } from './md.mjs';
import { dateLong } from './dates.mjs';

export const NL = { et: '/et/uudiskiri', en: '/en/newsletter' };
const T = {
  et: { title: 'Uudiskiri', lead: 'ECCM-i kava ja uudised e-postiga. Lahkuda saab iga kirja lõpust.', email: 'E-post', join: 'Liitu', bad: 'See ei ole e-posti aadress.',
        sent: (a) => `Saatsime aadressile ${a} kirja. Tellimus hakkab kehtima, kui avad selles oleva lingi.`, already: (a) => `Aadress ${a} on juba uudiskirjaga liitunud.`,
        past: 'Varasemad kirjad', confirmed: 'Oled uudiskirjaga liitunud. Esimene kiri tuleb koos järgmise kavaga.', gone: 'Seda linki ei ole. Võib-olla on tellimus juba lõpetatud.',
        leaveQ: (a) => `Lahkud ECCM-i uudiskirjast aadressil ${a}.`, leave: 'Lahku', left: 'Oled uudiskirjast lahkunud. Rohkem kirju ei tule.', back: 'Tagasi uudiskirja lehele', draft: 'Eelvaade. See kiri on veel saatmata.' },
  en: { title: 'Newsletter', lead: 'The ECCM programme and news by email. Every letter ends with a way to leave.', email: 'Email', join: 'Subscribe', bad: 'That is not an email address.',
        sent: (a) => `We sent a letter to ${a}. The subscription starts when you open the link in it.`, already: (a) => `${a} is already subscribed.`,
        past: 'Earlier letters', confirmed: 'You are subscribed. The first letter comes with the next programme.', gone: 'There is no such link. Perhaps the subscription has already ended.',
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
    ${issues.length ? html`<section class="news-past"><h2>${t.past}</h2><ol class="edit-list">${issues.map((i) => html`<li><time datetime="${i.sent_at}">${sentDay(i.sent_at, lang)}</time><div><a href="${NL[lang]}/${i.slug}">${i.subject}</a></div></li>`)}</ol></section>` : ''}
  </article>`;
  return page({ lang, title: `${t.title}.`, alternate: alt(lang), body });
};

// the page a confirm or unsubscribe link lands on
export const renderNotice = ({ lang, text, form }) => {
  const t = T[lang];
  const body = html`  <article class="page-text news-page">
    <h1>${t.title}</h1>
    <p class="news-say" role="status">${text}</p>
    ${form ? html`<form class="form" method="post" action="${form}"><div class="actions"><button class="btn btn-pri" type="submit">${t.leave}</button></div></form>` : html`<p><a href="${NL[lang]}">${t.back}</a></p>`}
  </article>`;
  return page({ lang, title: `${t.title}.`, alternate: alt(lang), body });
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
const LANG = { et: 'eesti keeles', en: 'inglise keeles' };
const STATE = (i) => (i.status === 'sent' ? `Saadetud ${sentDay(i.sent_at, 'et')}, ${i.sent_count} tellijale.` : 'Mustand.');

export const renderIssues = ({ issues, counts }) => {
  const c = (lang, status) => counts.find((r) => r.lang === lang && r.status === status)?.n || 0;
  const body = html`  <h1>Uudiskiri</h1>
  <p class="note">Kinnitatud tellijaid: ${c('et', 'confirmed')} eesti keeles, ${c('en', 'confirmed')} inglise keeles. Kinnitust ootab ${c('et', 'pending') + c('en', 'pending')}. Liitumise leht on <a href="${NL.et}">${NL.et}</a> ja <a href="${NL.en}">${NL.en}</a>.</p>
  <div class="items">
    <form class="form" method="post" action="/edit/uudiskiri/new">
      <h2>Uus kiri</h2>
      <p class="hint">Kiri tuleb ette täidetuna järgmise kuue nädala sündmustega. Tervitus, üks lõik ja allkiri on sinu kirjutada.</p>
      <div class="actions">
        <button class="btn btn-pri" type="submit" name="lang" value="et">Eesti keeles</button>
        <button class="btn" type="submit" name="lang" value="en">Inglise keeles</button>
      </div>
    </form>
    <section class="items-list">
      <h2>Kirjad</h2>
      ${issues.length ? html`<ol class="edit-list">${issues.map((i) => html`<li><time datetime="${i.updated_at}">${sentDay(i.sent_at || i.updated_at, 'et')}</time><div><a href="/edit/uudiskiri/${i.id}">${i.subject || '(teemata)'}</a><small>${LANG[i.lang]}. ${STATE(i)}</small></div></li>`)}</ol>` : html`<p class="note">Kirju ei ole veel.</p>`}
    </section>
    <p><a href="/edit/uudiskiri/postkast">Postkast</a>: iga saadetud ja saatmata kiri.</p>
  </div>`;
  return page({ lang: 'et', title: 'Uudiskiri.', alternate: alt('et'), body });
};

export const renderIssueForm = ({ issue, form = issue, errors = [], say, mail, test = '' }) => {
  const err = (f) => (errors.find((e) => e.field === f) || {}).msg;
  const sent = issue.status === 'sent';
  const body = html`  <p class="crumb"><a href="/edit/uudiskiri">Uudiskiri</a></p>
  <h1>${issue.subject || 'Uus kiri'}</h1>
  <p class="note">Kiri ${LANG[issue.lang]}. ${STATE(issue)}${sent ? html` <a href="${NL[issue.lang]}/${issue.slug}">Veebis</a>.` : ''}</p>
  ${errors.length ? html`<div class="errors" role="alert"><p>Ei õnnestunud. Paranda:</p><ul>${errors.map((e) => html`<li>${e.msg}</li>`)}</ul></div>` : ''}
  ${say ? html`<p class="news-say" role="status">${say}</p>` : ''}
  ${sent ? '' : html`<form class="form form-wide" method="post" action="/edit/uudiskiri/${issue.id}">
    ${field({ id: 'f-subject', label: 'Teema', err: err('subject'), hint: 'Rida postkastis. Kirjuta see ise, mitte „Uudiskiri nr 4”.', control: input('f-subject', 'subject', form.subject, ' maxlength="140"') })}
    ${field({ id: 'f-body', label: 'Kiri', err: err('body'), hint: 'Tühi rida alustab uut lõiku, ## on vahepealkiri, **tekst** on rasvane, [sõnad](https://…) on link.', control: html`<textarea id="f-body" name="body" rows="24">${form.body}</textarea>` })}
    <div class="actions">
      <button class="btn btn-pri" type="submit" name="do" value="save">Salvesta</button>
      <button class="btn" type="submit" name="do" value="delete">Kustuta</button>
      <a class="btn btn-end" href="/edit/uudiskiri">Loobu</a>
    </div>
    <h2>Saada</h2>
    ${field({ id: 'f-test', label: 'Testkiri aadressile', err: err('test'), hint: 'Tasuta Cloudflare’i plaanil jõuab kiri ainult konto kinnitatud aadressidele.', control: input('f-test', 'test', test, ' type="email"') })}
    <div class="actions"><button class="btn" type="submit" name="do" value="test">Saada testkiri</button></div>
    <label class="check"><input type="checkbox" name="sure" value="1"> Saadan kõigile kinnitatud tellijatele ${LANG[issue.lang]}</label>
    ${err('sure') ? html`<p class="hint err">${err('sure')}</p>` : ''}
    <div class="actions"><button class="btn btn-pri" type="submit" name="do" value="send">Saada kõigile</button></div>
  </form>`}
  <h2 class="mail-head">Nii see postkastis paistab</h2>
  <iframe class="mail-preview" title="Kiri postkastis" srcdoc="${mail}"></iframe>`;
  return page({ lang: 'et', title: `${issue.subject || 'Uus kiri'}.`, alternate: alt('et'), body });
};

// a@b.ee as a***@b.ee: the outbox shows that a mail went and to whom roughly, never the list
const mask = (a) => String(a).replace(/^(.)[^@]*/, '$1***');
const fate = (m) => (m.sent_at ? `Saadetud ${m.sent_at.slice(0, 16).replace('T', ' ')}.` : m.error ? `Ei läinud (${m.tries} korda): ${m.error}` : 'Ootab saatmist.');
const KIND = { confirm: 'Kinnitus', issue: 'Kiri', test: 'Testkiri' };
export const renderOutbox = ({ rows }) => {
  const body = html`  <p class="crumb"><a href="/edit/uudiskiri">Uudiskiri</a></p>
  <h1>Postkast</h1>
  <p class="note">Viimased 100 kirja, uuemad eespool. Saatmata kiri proovitakse uuesti iga kümne minuti järel, kuni kolm korda.</p>
  ${rows.length ? html`<ol class="edit-list">${rows.map((m) => html`<li><time datetime="${m.created_at}">${m.created_at.slice(0, 16).replace('T', ' ')}</time><div>${KIND[m.kind]}: ${m.subject}<small>${mask(m.to_addr)}. ${fate(m)}</small></div></li>`)}</ol>` : html`<p class="note">Kirju ei ole veel.</p>`}`;
  return page({ lang: 'et', title: 'Postkast.', alternate: alt('et'), body });
};
