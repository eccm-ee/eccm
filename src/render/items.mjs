// items.mjs: the notices page, /items, in Estonian and in the editor's form
// (asked 2026-10-01: "make page on eccm to list and add items", then "use
// eccm edit style"). Three sections: this device and its notifications, which
// public/items.mjs fills in, since only the browser knows; the form for a new
// notice; and the list, newest moment first, each with what became of it and
// its Muuda link. /items/{id} is one notice's form: a waiting one keeps its
// time and can move it, a published one only its words in the list, since
// what went to the phones cannot be called back; either can be deleted
// (asked 2026-10-01: "do it", of editing and deleting a waiting notice and a
// list that refreshes itself, which public/items.mjs does). The forms post
// with no script, as the editor's do.
import { html } from './html.mjs';
import { page } from './chrome.mjs';
import { field, input } from './editor.mjs';
import { dayMonth, clock } from './dates.mjs';
import { table } from './table.mjs';

// a moment in ms as Tallinn's local ISO text, the shape dates.mjs reads
export const local = (ms) => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Tallinn', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(Number(ms))).replace(' ', 'T');
const when = (ms) => { const l = local(ms); return `${dayMonth(l, 'et')} ${clock(l, 'et')}`; };

// what became of a notice, in one line
const fate = (it) => {
  if (it.status === 'waiting') return 'Ootab.';
  const n = Number(it.sent || 0);
  if (n) return `Saadetud ${n} seadmesse${it.failed ? `, ${it.failed} ei võtnud vastu` : ''}.`;
  return it.failed ? `Ükski seade ei võtnud vastu (${it.failed}).` : 'Ilmus, ühtegi seadet ei olnud.';
};

// the notice's fields, the new form's and the edit form's; time is false on a published notice
const fields = (form, err, time = true) => html`${field({ id: 'f-title', label: 'Pealkiri', err: err('title'), hint: 'Teate esimene rida, telefonis rasvaselt.', control: input('f-title', 'title', form.title, ' required maxlength="120"') })}
    ${field({ id: 'f-body', label: 'Tekst', err: err('body'), control: html`<textarea id="f-body" name="body" rows="3">${form.body || ''}</textarea>` })}
    ${field({ id: 'f-url', label: 'Link', err: err('url'), hint: 'Mis avaneb teatele vajutades. Tühi = teadete leht.', control: input('f-url', 'url', form.url, ' spellcheck="false" placeholder="/et/sundmused/…"') })}
    ${time ? field({ id: 'f-publish', label: 'Avalda', err: err('publish_at'), hint: 'Tallinna aja järgi. Tühi = kohe.', control: input('f-publish', 'publish_at', form.publish_at, ' type="datetime-local"') }) : ''}`;
const errorList = (errors, what) => (errors.length ? html`<div class="errors" role="alert"><p>${what} Paranda:</p><ul>${errors.map((e) => html`<li>${e.msg}</li>`)}</ul></div>` : '');

// the list alone, which public/items.mjs swaps in when it has changed
export const itemsList = (items) => (items.length ? table({
  label: 'Teated',
  cols: [{ label: 'Aeg' }, { label: 'Teade', cls: 'main' }, { label: 'Olek' }, { label: '' }],
  rows: items.map((it) => ({
    current: it.status === 'waiting',
    cells: [
      html`<time datetime="${new Date(Number(it.publish_at)).toISOString()}">${when(it.publish_at)}</time>`,
      html`${it.url ? html`<a href="${it.url}">${it.title}</a>` : it.title}${it.body ? html`<br><span class="small">${it.body}</span>` : ''}`,
      fate(it),
      html`<a class="btn btn-sm" href="/items/${it.id}">Muuda</a>`,
    ],
  })),
}) : html`<p class="note">Teateid ei ole veel.</p>`);

export const renderItems = ({ items, subs, form = {}, errors = []}) => {
  const err = (f) => (errors.find((e) => e.field === f) || {}).msg;
  const body = html`  <h1>Teated</h1>
  <p class="note">Määratud ajal ilmub teade siia ja jõuab igasse seadmesse, kus teated on lubatud.</p>
  ${errorList(errors, 'Ei avaldatud.')}
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
    ${fields(form, err)}
    <div class="actions">
      <button class="btn btn-pri" type="submit">Avalda</button>
    </div>
  </form>

  <section class="items-list">
    <h2>Teated</h2>
    <div id="items-list">${itemsList(items)}</div>
  </section>
  </div>
  <script type="module" src="/items.mjs"></script>`;
  return page({ lang: 'et', title: 'Teated.', alternate: { lang: 'en', href: '/en/' }, body });
};

// one notice's form; form is the notice's values, or what was posted when it had something to fix
export const renderItemEdit = ({ it, form, errors = [] }) => {
  const err = (f) => (errors.find((e) => e.field === f) || {}).msg;
  const waiting = it.status === 'waiting';
  const body = html`  <p class="crumb"><a href="/items">Teated</a></p>
  <h1>${it.title}</h1>
  <p class="note">${waiting ? `Ootab, ilmub ${when(it.publish_at)}.` : `${when(it.publish_at)}: ${fate(it)} Telefonidesse läinud teadet ei saa muuta, siin muutub ainult teadete nimekiri.`}</p>
  ${errorList(errors, 'Ei salvestatud.')}
  <form class="form" method="post" action="/items/${it.id}">
    ${fields(form, err, waiting)}
    <div class="actions">
      <button class="btn btn-pri" type="submit" name="do" value="save">Salvesta</button>
      <button class="btn" type="submit" name="do" value="delete">Kustuta</button>
      <a class="btn btn-end" href="/items">Loobu</a>
    </div>
  </form>`;
  return page({ lang: 'et', title: `${it.title}.`, alternate: { lang: 'en', href: '/en/' }, body });
};
