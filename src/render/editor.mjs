// editor.mjs: the editor's pages, in Estonian, on the site's own chrome and
// stylesheet: the list of events, the form for one event, the login page and
// the closed door. The form is public/edit.html's form grown to the schema
// (plans/plan-eccm-cms-step-1.md section 2): the shared facts first, then the
// two languages side by side where the frame allows it, then the credits as
// one line per role, then publishing. Native fields with visible labels, no
// placeholder as a label, no script; the server validates and answers in
// words (src/editor.mjs). What the whole editor is meant to become is
// plans/plan-eccm-cms.md section 8.
import { html, raw } from './html.mjs';
import { page } from './chrome.mjs';
import { dateShort, clock } from './dates.mjs';

const ALT = { lang: 'en', href: '/en/' };
export const CATEGORIES = [['eccm', 'ECCM'], ['koostoo', 'Koostöö'], ['improtest', 'Improtest'], ['schoenberg', 'Schönbergi sari'], ['ulysses', 'Ulysses'], ['u', 'U:']];
export const STATUSES = [['draft', 'Mustand'], ['published', 'Avaldatud']];
export const eventPath = (lang, slug) => (lang === 'et' ? `/et/sundmused/${slug}` : `/en/events/${slug}`);

const fmtClock = new Intl.DateTimeFormat('et', { timeZone: 'Europe/Tallinn', hour: '2-digit', minute: '2-digit' });
const fmtStamp = new Intl.DateTimeFormat('et', { timeZone: 'Europe/Tallinn', day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
// updated_at is UTC text, 'YYYY-MM-DDTHH:MM:SSZ'
export const tallinnClock = (utc) => fmtClock.format(new Date(utc)).replace(':', '.');
const tallinnStamp = (utc) => fmtStamp.format(new Date(utc)).replace(/(\d+):(\d+)$/, '$1.$2');

const opts = (options, value) => options.map(([v, label]) => html`<option value="${v}"${String(v) === String(value ?? '') ? raw(' selected') : ''}>${label}</option>`);
const field = ({ id, label, hint, err, control }) => html`<div class="field">
        <label for="${id}">${label}</label>
        ${control}
        ${err ? html`<p class="hint err">${err}</p>` : hint ? html`<p class="hint">${hint}</p>` : ''}
      </div>`;
const input = (id, name, value, attrs = '') => html`<input id="${id}" name="${name}" value="${value ?? ''}"${raw(attrs)}>`;

export const editorList = ({ events }) => page({
  lang: 'et', title: 'Sündmused.', alternate: ALT,
  body: html`  <p class="crumb">Toimeta</p>
  <h1>Sündmused</h1>
  <p class="actions"><a class="btn btn-pri" href="/edit/events/new">Uus sündmus</a> <a class="btn" href="/logout">Logi välja</a></p>
  ${events.length ? html`<ol class="edit-list">
    ${events.map((e) => html`<li><time datetime="${e.starts_at}">${dateShort(e.starts_at, 'et')} ${clock(e.starts_at, 'et')}</time><span><a href="/edit/events/${e.id}">${e.title_et || e.title_en || '(pealkirjata)'}</a><small>${e.status === 'published' ? 'Avaldatud' : 'Mustand'}, ${e.title_en ? 'ET ja EN' : 'ainult ET'}, muudetud ${tallinnStamp(e.updated_at)}</small></span></li>`)}
  </ol>` : html`<p class="note">Ühtegi sündmust ei ole.</p>`}`,
});

// v: the form's values (src/editor.mjs, fromRows or parse); errors: [{ field,
// msg }]; roles: the role table; media: the media table; saved: the row's
// updated_at when the page follows a save; texts: the saved text rows, for
// the public links
export const editorForm = ({ v, errors = [], roles, media, saved, texts = {} }) => {
  const err = (f) => (errors.find((e) => e.field === f) || {}).msg;
  const isNew = !v.id;
  const action = isNew ? '/edit/events/new' : `/edit/events/${v.id}`;
  const roleOpts = [['', 'vaba roll, nimetus kõrval']].concat(roles.map((r) => [r.key, r.label_et]));
  const mediaOpts = [['', 'pilti ei ole']].concat(media.map((m) => [m.id, `${m.key} (${m.width} × ${m.height})`]));
  const pic = media.find((m) => String(m.id) === String(v.image_id));
  const title = isNew ? 'Uus sündmus' : (v.et.title || v.en.title || 'Sündmus');
  const langBlock = (lang, name, tLabel, sLabel, bLabel) => html`<section lang="${lang}">
        <h3 class="field-name">${name}</h3>
        ${field({ id: `f-title-${lang}`, label: tLabel, err: err(`title_${lang}`), control: input(`f-title-${lang}`, `title_${lang}`, v[lang].title) })}
        ${field({ id: `f-slug-${lang}`, label: sLabel, err: err(`slug_${lang}`), hint: lang === 'et' ? 'Tühjaks jättes tuletatakse pealkirjast. Väikesed tähed a kuni z, numbrid ja sidekriipsud.' : 'Leave empty to derive from the title.', control: input(`f-slug-${lang}`, `slug_${lang}`, v[lang].slug, ' spellcheck="false"') })}
        ${field({ id: `f-body-${lang}`, label: bLabel, err: err(`body_${lang}`), hint: lang === 'et' ? 'Tühi rida alustab uut lõiku, rida algusega ## on vahepealkiri, **tekst** on rasvane, [sõnad](https://…) on link.' : 'A blank line starts a paragraph, a line starting with ## is a heading.', control: html`<textarea id="f-body-${lang}" name="body_${lang}" rows="18">${v[lang].body}</textarea>` })}
      </section>`;
  const credit = (c, i) => html`<div class="credit">
        <div class="field-row">
          ${field({ id: `f-c${i}-role`, label: `Tegija ${i + 1}, roll`, err: err(`c${i}_role`), control: html`<select id="f-c${i}-role" name="c${i}_role">${opts(roleOpts, c.role_key)}</select>` })}
          ${field({ id: `f-c${i}-label-et`, label: 'Vaba rolli nimetus', control: input(`f-c${i}-label-et`, `c${i}_label_et`, c.label_et) })}
          ${field({ id: `f-c${i}-label-en`, label: 'Free role, in English', control: input(`f-c${i}-label-en`, `c${i}_label_en`, c.label_en) })}
        </div>
        ${field({ id: `f-c${i}-people`, label: 'Nimed', hint: i === 0 ? 'Komaga eraldatud, ühes keeles. Tühjenda nimed ja organisatsioonid, et rida kustutada.' : '', control: input(`f-c${i}-people`, `c${i}_people`, c.people) })}
        <div class="field-row">
          ${field({ id: `f-c${i}-orgs-et`, label: 'Organisatsioonid', hint: i === 0 ? 'Semikooloniga eraldatud, sest nimes võib olla koma.' : '', control: input(`f-c${i}-orgs-et`, `c${i}_orgs_et`, c.orgs_et) })}
          ${field({ id: `f-c${i}-orgs-en`, label: 'Organisations, in English', hint: i === 0 ? 'The same order as the Estonian.' : '', control: input(`f-c${i}-orgs-en`, `c${i}_orgs_en`, c.orgs_en) })}
        </div>
      </div>`;
  const links = ['et', 'en'].filter((l) => texts[l]).map((l) => html`<a href="${eventPath(l, texts[l].slug)}" hreflang="${l}">${l.toUpperCase()}</a>`);
  const body = html`  <p class="crumb"><a href="/edit/events">Sündmused</a></p>
  <h1>${title}</h1>
  ${links.length ? html`<p class="note">Avalik leht: ${raw(links.map(String).join(" "))}${v.status !== 'published' ? html` <span class="small">(mustand, avalikult ei näe)</span>` : ''}</p>` : ''}
  ${saved ? html`<p class="note">Salvestatud kell ${tallinnClock(saved)}.</p>` : ''}
  ${errors.length ? html`<div class="errors" role="alert"><p>Ei salvestatud. Paranda:</p><ul>${errors.map((e) => html`<li>${e.msg}</li>`)}</ul></div>` : ''}

  <form class="form form-wide" method="post" action="${action}">
    <input type="hidden" name="rev" value="${v.rev}">
    <input type="hidden" name="credit_count" value="${v.credits.length}">
    <h2>Millal ja kus</h2>
    <div class="field-row">
      ${field({ id: 'f-start', label: 'Algus', err: err('starts_at'), control: input('f-start', 'starts_at', v.starts_at, ' type="datetime-local" required') })}
      ${field({ id: 'f-end', label: 'Lõpp', err: err('ends_at'), hint: 'Tühi, kui üks õhtu.', control: input('f-end', 'ends_at', v.ends_at, ' type="datetime-local"') })}
      ${field({ id: 'f-duration', label: 'Kestus minutites', err: err('duration_min'), control: input('f-duration', 'duration_min', v.duration_min, ' type="number" min="1" max="1440" inputmode="numeric"') })}
    </div>
    <div class="field-row">
      ${field({ id: 'f-venue', label: 'Koht', control: input('f-venue', 'venue', v.venue) })}
      ${field({ id: 'f-address', label: 'Aadress', control: input('f-address', 'address', v.address) })}
    </div>
    <div class="field-row">
      ${field({ id: 'f-tickets', label: 'Piletid', err: err('ticket_url'), control: input('f-tickets', 'ticket_url', v.ticket_url, ' type="url" inputmode="url"') })}
      ${field({ id: 'f-website', label: 'Veebileht', err: err('website_url'), control: input('f-website', 'website_url', v.website_url, ' type="url" inputmode="url"') })}
    </div>
    <div class="field-row">
      ${field({ id: 'f-category', label: 'Sari', err: err('category'), control: html`<select id="f-category" name="category">${opts(CATEGORIES, v.category)}</select>` })}
      ${field({ id: 'f-image', label: 'Pilt', err: err('image_id'), hint: 'Olemasolevate piltide hulgast. Üleslaadimine tuleb hiljem.', control: html`<select id="f-image" name="image_id">${opts(mediaOpts, v.image_id)}</select>` })}
    </div>
    ${pic ? html`<figure class="edit-pic"><img src="/${pic.key}" width="${pic.width}" height="${pic.height}" alt="${pic.alt_et}"><figcaption>${pic.alt_et}</figcaption></figure>` : ''}

    <h2>Tekst</h2>
    <div class="langs">
      ${langBlock('et', 'Eesti keeles', 'Pealkiri', 'Slug', 'Kirjeldus')}
      ${langBlock('en', 'Inglise keeles', 'Title', 'Slug', 'Description')}
    </div>

    <h2>Tegijad</h2>
    <div class="credits-edit">
      ${v.credits.map(credit)}
    </div>

    <h2>Avaldamine</h2>
    <div class="field-row">
      ${field({ id: 'f-status', label: 'Olek', hint: 'Mustandit avalikul lehel ei näe.', control: html`<select id="f-status" name="status">${opts(STATUSES, v.status)}</select>` })}
      ${field({ id: 'f-publish', label: 'Avalda alates', err: err('publish_at'), hint: 'Tühi = kohe.', control: input('f-publish', 'publish_at', v.publish_at, ' type="datetime-local"') })}
    </div>
    <div class="actions">
      <button class="btn btn-pri" type="submit" name="do" value="save">Salvesta</button>
      <button class="btn" type="submit" name="do" value="preview-et">Eelvaade ET</button>
      <button class="btn" type="submit" name="do" value="preview-en">Eelvaade EN</button>
      <a class="btn" href="/edit/events">Loobu</a>
    </div>
  </form>`;
  return page({ lang: 'et', title: `${title}.`, alternate: ALT, body });
};

export const loginPage = ({ next, wrong }) => page({
  lang: 'et', title: 'Sisselogimine.', alternate: ALT,
  body: html`  <p class="crumb">Toimeta</p>
  <h1>Sisselogimine</h1>
  <p class="note">Toimetamine on lukus. Sisse saab võtmega, mille said lingina.</p>
  <form class="form" method="post" action="/login">
    <input type="hidden" name="next" value="${next}">
    ${field({ id: 'f-token', label: 'Võti', err: wrong ? 'Vale võti.' : '', control: input('f-token', 'token', '', ' type="password" autocomplete="off" required') })}
    <div class="actions"><button class="btn btn-pri" type="submit">Sisene</button></div>
  </form>`,
});

export const gatePage = ({ status, reason }) => {
  const what = status === 503
    ? ['Toimetaja ei ole seadistatud.', 'Sellel serveril ei ole sisselogimise viisi seatud, nii et toimetada ei saa keegi.']
    : status === 404
      ? ['Sellist sündmust ei ole.', html`Nimekiri on <a href="/edit/events">sündmuste all</a>.`]
      : status === 403
        ? ['Päring tuli mujalt.', 'Vorm saadeti teiselt saidilt ja seda ei võetud vastu. Ava toimetaja uuesti ja saada sealt.']
        : status === 500
          ? ['Toimetaja ei vasta.', 'Andmebaas vastas veaga. Värskel paigaldusel on põhjus enamasti rakendamata migratsioon migrations/0002_editing.sql.']
          : reason === 'access'
            ? ['Sisselogimine ei kehti.', 'Access ei kinnitanud seda päringut. Ava leht uuesti ja logi sisse.']
            : ['Toimetamine on lukus.', html`Sisse saab võtmega: <a href="/login">logi sisse</a>.`];
  return page({ lang: 'et', title: `${what[0]}`, alternate: ALT, body: html`  <p class="crumb">Toimeta</p>
  <h1>${what[0]}</h1>
  <p class="note">${what[1]}</p>` });
};
