// items.mjs: the notices page, /items, in Estonian and in the editor's form
// (asked 2026-10-01: "make page on eccm to list and add items", then "use
// eccm edit style"). Three sections: this device and its notifications, which
// public/items.mjs fills in, since only the browser knows; the form for a new
// notice; and the list, newest moment first, each with what became of it.
// The form posts with no script, as the editor's do.
import { html } from './html.mjs';
import { page } from './chrome.mjs';
import { field, input } from './editor.mjs';
import { dayMonth, clock } from './dates.mjs';

// a moment in ms as Tallinn's local ISO text, the shape dates.mjs reads
const local = (ms) => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Tallinn', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(Number(ms))).replace(' ', 'T');
const when = (ms) => { const l = local(ms); return `${dayMonth(l, 'et')} ${clock(l, 'et')}`; };

// what became of a notice, in one line
const fate = (it) => {
  if (it.status === 'waiting') return 'Ootab.';
  const n = Number(it.sent || 0);
  if (n) return `Saadetud ${n} seadmesse${it.failed ? `, ${it.failed} ei võtnud vastu` : ''}.`;
  return it.failed ? `Ükski seade ei võtnud vastu (${it.failed}).` : 'Ilmus, ühtegi seadet ei olnud.';
};

export const renderItems = ({ items, subs, form = {}, errors = []}) => {
  const err = (f) => (errors.find((e) => e.field === f) || {}).msg;
  const body = html`  <h1>Teated</h1>
  <p class="note">Määratud ajal ilmub teade siia ja jõuab igasse seadmesse, kus teated on lubatud.</p>
  ${errors.length ? html`<div class="errors" role="alert"><p>Ei avaldatud. Paranda:</p><ul>${errors.map((e) => html`<li>${e.msg}</li>`)}</ul></div>` : ''}
  <div class="items">
  <section class="form items-device">
    <h2>See seade</h2>
    <p id="push-say">Teated jõuavad ${subs} seadmesse.</p>
    <div class="actions">
      <button class="btn btn-pri" type="button" id="push-on" hidden>Luba teated</button>
      <button class="btn" type="button" id="push-off" hidden>Lõpeta teated</button>
    </div>
  </section>

  <form class="form" method="post" action="/items">
    <h2>Uus teade</h2>
    ${field({ id: 'f-title', label: 'Pealkiri', err: err('title'), hint: 'Teate esimene rida, telefonis rasvaselt.', control: input('f-title', 'title', form.title, ' required maxlength="120"') })}
    ${field({ id: 'f-body', label: 'Tekst', err: err('body'), control: html`<textarea id="f-body" name="body" rows="3">${form.body || ''}</textarea>` })}
    ${field({ id: 'f-url', label: 'Link', err: err('url'), hint: 'Mis avaneb teatele vajutades. Tühi = see leht.', control: input('f-url', 'url', form.url, ' spellcheck="false" placeholder="/et/sundmused/…"') })}
    ${field({ id: 'f-publish', label: 'Avalda', err: err('publish_at'), hint: 'Tallinna aja järgi. Tühi = kohe.', control: input('f-publish', 'publish_at', form.publish_at, ' type="datetime-local"') })}
    <div class="actions">
      <button class="btn btn-pri" type="submit">Avalda</button>
    </div>
  </form>

  <section class="items-list">
    <h2>Teated</h2>
    ${items.length ? html`<ol class="edit-list">${items.map((it) => html`<li>
      <time datetime="${new Date(Number(it.publish_at)).toISOString()}">${when(it.publish_at)}</time>
      <div>${it.url ? html`<a href="${it.url}">${it.title}</a>` : it.title}${it.body ? html`<small>${it.body}</small>` : ''}<small>${fate(it)}</small></div>
    </li>`)}</ol>` : html`<p class="note">Teateid ei ole veel.</p>`}
  </section>
  </div>
  <script type="module" src="/items.mjs"></script>`;
  return page({ lang: 'et', title: 'Teated.', alternate: { lang: 'en', href: '/en/' }, body });
};
