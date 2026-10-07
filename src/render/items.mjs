// items.mjs: the notices page, /items, in English (asked 2026-10-02: "convert all admin
// pages to english only") and in the editor's form
// (asked 2026-10-01: "make page on eccm to list and add items", then "use
// eccm edit style"). Three sections: this device and its notifications, which
// public/items.mjs fills in, since only the browser knows; the form for a new
// notice; and the list, newest moment first, each with what became of it and
// its Edit link. /items/{id} is one notice's form: a waiting one keeps its
// time and can move it, a published one only its words in the list, since
// what went to the phones cannot be called back; either can be deleted
// (asked 2026-10-01: "do it", of editing and deleting a waiting notice and a
// list that refreshes itself, which public/items.mjs does). The forms post
// with no script, as the editor's do.
import { html, raw } from './html.mjs';
import { page } from './chrome.mjs';
import { field, input } from './editor.mjs';
import { dayMonth, clock } from './dates.mjs';
import { table } from './table.mjs';
import { badge } from './badge.mjs';

// a moment in ms as Tallinn's local ISO text, the shape dates.mjs reads
export const local = (ms) => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Tallinn', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(Number(ms))).replace(' ', 'T');
const when = (ms) => { const l = local(ms); return `${dayMonth(l, 'en')} ${clock(l, 'en')}`; };

// what became of a notice, in one line
const fate = (it) => {
  if (it.status === 'waiting') return 'Waiting.';
  const n = Number(it.sent || 0);
  if (n) return `Sent to ${n} ${n === 1 ? 'device' : 'devices'}${it.failed ? `, ${it.failed} refused` : ''}.`;
  return it.failed ? `No device accepted it (${it.failed}).` : 'Published, no devices to send to.';
};

// the same as a badge and its figures, for the list's Status column
const state = (it) => {
  if (it.status === 'waiting') return badge('Waiting', 'progress');
  const n = Number(it.sent || 0), f = Number(it.failed || 0);
  if (n) return html`${badge('Sent', 'done')} <span class="small">${n} ${n === 1 ? 'device' : 'devices'}${f ? `, ${f} refused` : ''}</span>`;
  return f ? html`${badge('Failed', 'problem')} <span class="small">${f} refused</span>` : html`${badge('Published', 'done')} <span class="small">no devices</span>`;
};

// the notice's fields, the new form's and the edit form's; time is false on a published notice
const fields = (form, err, time = true) => html`${field({ id: 'f-title', label: 'Title', err: err('title'), hint: 'The first line of the notice, bold on the phone.', control: input('f-title', 'title', form.title, ' required maxlength="120"') })}
    ${field({ id: 'f-body', label: 'Text', err: err('body'), control: html`<textarea id="f-body" name="body" rows="3">${form.body || ''}</textarea>` })}
    ${field({ id: 'f-url', label: 'Link', err: err('url'), hint: 'What opens when the notice is tapped. Empty means its own page.', control: input('f-url', 'url', form.url, ' spellcheck="false" placeholder="/et/sundmused/…"') })}
    <div class="field">
      <label class="check"><input type="checkbox" name="vain" value="1"${form.vain ? raw(' checked') : ''}> Väin</label>
      <p class="hint">Also in U:'s Väin app.</p>
    </div>
    ${time ? field({ id: 'f-publish', label: 'Publish at', err: err('publish_at'), hint: 'Tallinn time. Empty means now.', control: input('f-publish', 'publish_at', form.publish_at, ' type="datetime-local"') }) : ''}`;
const errorList = (errors, what) => (errors.length ? html`<div class="errors" role="alert"><p>${what} Please fix:</p><ul>${errors.map((e) => html`<li>${e.msg}</li>`)}</ul></div>` : '');

// the list alone, which public/items.mjs swaps in when it has changed
export const itemsList = (items) => (items.length ? table({
  label: 'Notices',
  cols: [{ label: 'Time' }, { label: 'Notice', cls: 'main' }, { label: 'Status' }, { label: '' }],
  rows: items.map((it) => ({
    current: it.status === 'waiting',
    cells: [
      html`<time datetime="${new Date(Number(it.publish_at)).toISOString()}">${when(it.publish_at)}</time>`,
      html`${it.url ? html`<a href="${it.url}">${it.title}</a>` : it.title}${it.body ? html`<br><span class="small">${it.body}</span>` : ''}${Number(it.vain) ? html`<br>${badge('Väin', 'neutral')}` : ''}`,
      state(it),
      html`<a class="btn btn-sm" href="/items/${it.id}">Edit</a>`,
    ],
  })),
}) : html`<p class="note">No notices yet.</p>`);

export const renderItems = ({ items, subs, form = {}, errors = []}) => {
  const err = (f) => (errors.find((e) => e.field === f) || {}).msg;
  const body = html`  <h1>Notices</h1>
  <p class="note">At its set time a notice appears here and reaches every device that allowed notifications.</p>
  ${errorList(errors, 'Not published.')}
  <div class="items">
  <section class="form items-device">
    <h2>This device</h2>
    <p id="push-say">Notices reach ${subs} ${subs === 1 ? 'device' : 'devices'}.</p>
    <div class="actions">
      <button class="btn btn-pri" type="button" id="push-on" hidden>Allow notifications</button>
      <button class="btn" type="button" id="push-off" hidden>Stop notifications</button>
    </div>
  </section>

  <form class="form" method="post" action="/items">
    <h2>New notice</h2>
    ${fields(form, err)}
    <div class="actions">
      <button class="btn btn-pri" type="submit">Publish</button>
    </div>
  </form>

  <section class="items-list">
    <h2>Notices</h2>
    <div id="items-list">${itemsList(items)}</div>
  </section>
  </div>
  <script type="module" src="/items.mjs"></script>`;
  return page({ wide: true, lang: 'en', title: 'Notices.', body });
};

// one notice's form; form is the notice's values, or what was posted when it had something to fix
export const renderItemEdit = ({ it, form, errors = [] }) => {
  const err = (f) => (errors.find((e) => e.field === f) || {}).msg;
  const waiting = it.status === 'waiting';
  const body = html`  <p class="crumb"><a href="/items">Notices</a></p>
  <h1>${it.title}</h1>
  <p class="note">${waiting ? `Waiting, publishes ${when(it.publish_at)}.` : `${when(it.publish_at)}: ${fate(it)} A notice already sent to phones cannot be changed there, only in this list.`}</p>
  <p class="note">${waiting ? `Its page will be /teated/${it.num}.` : html`Its page is <a href="/teated/${it.num}">/teated/${it.num}</a>.`}</p>
  ${errorList(errors, 'Not saved.')}
  <form class="form" method="post" action="/items/${it.id}">
    ${fields(form, err, waiting)}
    <div class="actions">
      <button class="btn btn-pri" type="submit" name="do" value="save">Save</button>
      <button class="btn" type="submit" name="do" value="delete">Delete</button>
      <a class="btn btn-end" href="/items">Cancel</a>
    </div>
  </form>`;
  return page({ wide: true, lang: 'en', title: `${it.title}.`, body });
};
