// editor.mjs: the editor's pages, in Estonian, on the site's own chrome and
// stylesheet: the form for one event, the form for one text page (since
// 2026-09-28, asked as "page from d1 and with edit?"; its list
// went the same day, asked as "rm edit/pages page", since the menu's pages
// are a fixed set reached from their own Muuda buttons; the events list went
// the same evening, asked as "rm https://eccm.positron.studio/edit/events page.
// only events themselves are access ppoint to edit", so an event is reached
// from its own Muuda button, and since 2026-09-29 only from there, the Add
// button and /edit/events/new asked away with it) and the page that says a
// thing is not there. The event form is
// public/edit.html's form grown to the schema (plans/plan-eccm-cms-step-1.md
// section 2): the shared facts first, then the two languages side by side
// where the frame allows it, then the credits as one line per role, then
// publishing. The page form is the same form with nothing a page lacks: the
// two titles and slugs, publishing, the two texts. Native fields with visible
// labels, no placeholder as a label, no script; the server validates and
// answers in words (src/editor.mjs). What the whole editor is meant to become
// is plans/plan-eccm-cms.md section 8.
import { html, raw } from './html.mjs';
import { page } from './chrome.mjs';
import { dateShort, clock } from './dates.mjs';

// a blank credit block, the one the form shows when an event has none and the one Lisa tegija adds
export const BLANK_CREDIT = () => ({ role_key: '', label_et: '', label_en: '', people: '', orgs_et: '', orgs_en: '' });

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
export const field = ({ id, label, hint, err, control, cls = '' }) => html`<div class="field${cls ? ' ' + cls : ''}">
        <label for="${id}">${label}</label>
        ${control}
        ${err ? html`<p class="hint err">${err}</p>` : hint ? html`<p class="hint">${hint}</p>` : ''}
      </div>`;
export const input = (id, name, value, attrs = '') => html`<input id="${id}" name="${name}" value="${value ?? ''}"${raw(attrs)}>`;
// a choice of a few as native radio buttons in a row, each with its label (asked 2026-09-28: "make it radiobutton
// [ Mustand | Avaldatud ]", then "make classic horiz radions (o) () instead of radiobuttons"); a fieldset with the
// field's look, its legend where the label sits
const segment = (name, options, value) => html`<div class="radios">${options.map(([v, label]) => html`<label><input type="radio" name="${name}" value="${v}"${String(v) === String(value ?? '') ? raw(' checked') : ''}> ${label}</label>`)}</div>`;
const group = ({ label, hint, err, control }) => html`<fieldset class="field">
        <legend>${label}</legend>
        ${control}
        ${err ? html`<p class="hint err">${err}</p>` : hint ? html`<p class="hint">${hint}</p>` : ''}
      </fieldset>`;
// one language's fields, in two parts: the title and the slug open the form, the text sits under Tekst
// (asked 2026-09-28: "move pealkiri and slug to their own section, first"); the event form and the page
// form share it, v being either form's values and err its error lookup
const langBlock = (v, err, lang, name, tLabel, sLabel, bLabel, part) => html`<section lang="${lang}">
        <h3 class="field-name">${name}</h3>
        ${part === 'body' ? '' : field({ id: `f-title-${lang}`, label: tLabel, err: err(`title_${lang}`), control: input(`f-title-${lang}`, `title_${lang}`, v[lang].title) })}
        ${part === 'body' ? '' : field({ id: `f-slug-${lang}`, label: sLabel, err: err(`slug_${lang}`), hint: lang === 'et' ? 'Tühjaks jättes tuletatakse pealkirjast. Väikesed tähed a kuni z, numbrid ja sidekriipsud.' : 'Leave empty to derive from the title.', control: input(`f-slug-${lang}`, `slug_${lang}`, v[lang].slug, ' spellcheck="false"') })}
        ${part === 'head' ? '' : field({ id: `f-body-${lang}`, label: bLabel, err: err(`body_${lang}`), hint: lang === 'et' ? 'Tühi rida alustab uut lõiku, rida algusega ## on vahepealkiri, **tekst** on rasvane, [sõnad](https://…) on link.' : 'A blank line starts a paragraph, a line starting with ## is a heading.', control: html`<textarea id="f-body-${lang}" name="body_${lang}" rows="18">${v[lang].body}</textarea>` })}
      </section>`;
// the two texts keep one height: a drag on either resizes the other (asked 2026-09-28: "when resizing textarea in one col, other height should change too")
const SAME_HEIGHT = `      const tas = [...document.querySelectorAll('.langs textarea')];
      const ro = new ResizeObserver((entries) => { for (const en of entries) { const h = en.target.offsetHeight; for (const t of tas) if (t !== en.target && t.offsetHeight !== h) t.style.height = h + 'px'; } });
      tas.forEach((t) => ro.observe(t));`;

// what the detector gave, in one line under the picture: the scheme's mode, its ground and whether the titles
// take the serif; the same words from the stored row and from the browser's reading
const say = (s) => `${s.mode === 'dark' ? 'Tume' : 'Hele'} skeem, taust ${s.ground}${s.accent ? `, rõhuvärv ${s.accent}` : ''}, ${s.serif ? 'pealkiri seriifkirjas' : 'kiri groteskne'}.`;
const schemeSay = (json) => { try { return say(JSON.parse(json)); } catch { return ''; } };
// the picture field's script: a chosen or dropped file is shown at once and read with public/scheme.mjs, and the
// reading goes into the hidden field the save stores on the media row; a picture already on the event with no
// scheme yet is read the same way on load, so opening and saving an old event gives it one
const READ_PICTURE = `      const { read, contract } = await import('/scheme.mjs');
      const say = ${say.toString()};
      const fig = document.querySelector('.edit-pic'), img = fig.querySelector('img'), out = document.getElementById('scheme-say');
      const field = document.querySelector('[name="image_scheme"]'), file = document.querySelector('[name="image_file"]');
      const reading = async (el) => { await el.decode(); const { r, t, s } = read(el); const c = contract(r, t, s); field.value = JSON.stringify(c); out.textContent = say(c); };
      file.addEventListener('change', async () => {
        const f = file.files[0]; if (!f) return;
        field.value = ''; out.textContent = 'Loen pilti.';
        img.removeAttribute('width'); img.removeAttribute('height'); img.src = URL.createObjectURL(f); fig.hidden = false;
        try { await reading(img); } catch { out.textContent = 'Pilti ei õnnestunud lugeda; see salvestub ilma skeemita.'; }
      });
      if (img.hasAttribute('data-read')) reading(img).catch(() => {});`;

// v: the form's values (src/editor.mjs, fromRows or parse); errors: [{ field,
// msg }]; roles: the role table; media: the media table; saved: the row's
// updated_at when the page follows a save; texts: the saved text rows, for
// the public links
// cancel: where Loobu goes, the event itself or the public list (src/editor.mjs)
export const editorForm = ({ v, errors = [], roles, media, cancel = '/et/sundmused' }) => {
  const err = (f) => (errors.find((e) => e.field === f) || {}).msg;
  const action = `/edit/events/${v.id}`;
  const roleOpts = [['', 'vaba roll, nimetus kõrval']].concat(roles.map((r) => [r.key, r.label_et]));
  // the picture as a text field for now, the file name under public/ (asked 2026-09-28: "put pilt textfield for now");
  // the name is resolved against the media rows on save, and the figure shows the row the event has
  const pic = media.find((m) => String(m.id) === String(v.image_id));
  const imageKey = v.image_key ?? (pic ? pic.key : '');
  const title = v.et.title || v.en.title || 'Sündmus';
  // one credit block under its own subheader (asked 2026-09-29: "tegijad. add Tegija 1 etc subheaders"),
  // so the role field is labelled Roll and the number is said once; k is the index in the names and ids,
  // a string so the template below can carry a placeholder
  const credit = (c, i, k = String(i)) => html`<div class="credit">
        <h3 class="field-name">Tegija ${i + 1}</h3>
        <div class="field-row">
          ${field({ id: `f-c${k}-role`, label: 'Roll', err: err(`c${k}_role`), control: html`<select id="f-c${k}-role" name="c${k}_role">${opts(roleOpts, c.role_key)}</select>` })}
          ${field({ cls: 'free', id: `f-c${k}-label-et`, label: 'Vaba rolli nimetus', control: input(`f-c${k}-label-et`, `c${k}_label_et`, c.label_et) })}
          ${field({ cls: 'free', id: `f-c${k}-label-en`, label: 'Free role, in English', control: input(`f-c${k}-label-en`, `c${k}_label_en`, c.label_en) })}
        </div>
        ${field({ id: `f-c${k}-people`, label: 'Nimed', hint: i === 0 ? 'Komaga eraldatud, ühes keeles. Tühjenda nimed ja organisatsioonid, et rida kustutada.' : '', control: input(`f-c${k}-people`, `c${k}_people`, c.people) })}
        <div class="field-row">
          ${field({ id: `f-c${k}-orgs-et`, label: 'Organisatsioonid', hint: i === 0 ? 'Semikooloniga eraldatud, sest nimes võib olla koma.' : '', control: input(`f-c${k}-orgs-et`, `c${k}_orgs_et`, c.orgs_et) })}
          ${field({ id: `f-c${k}-orgs-en`, label: 'Organisations, in English', hint: i === 0 ? 'The same order as the Estonian.' : '', control: input(`f-c${k}-orgs-en`, `c${k}_orgs_en`, c.orgs_en) })}
        </div>
      </div>`;
  const body = html`  <h1>${title}</h1>
  ${errors.length ? html`<div class="errors" role="alert"><p>Ei salvestatud. Paranda:</p><ul>${errors.map((e) => html`<li>${e.msg}</li>`)}</ul></div>` : ''}

  <form class="form form-wide" method="post" action="${action}" enctype="multipart/form-data">
    <input type="hidden" name="rev" value="${v.rev}">
    <input type="hidden" name="credit_count" value="${v.credits.length}">
    <h2>Pealkiri</h2>
    <div class="langs">
      ${langBlock(v, err, 'et', 'Eesti keeles', 'Pealkiri', 'Slug', 'Kirjeldus', 'head')}
      ${langBlock(v, err, 'en', 'Inglise keeles', 'Title', 'Slug', 'Description', 'head')}
    </div>

    <h2>Pilt</h2>
    <!-- the picture and a drop field side by side (asked 2026-09-30: "implement image upload"); the
         browser reads a chosen file with public/scheme.mjs, the derive page's own detector, and sends
         the scheme beside it, so the page takes the picture's colours and faces from the first save -->
    <div class="drop">
      <figure class="edit-pic"${pic ? '' : raw(' hidden')}><img src="${pic ? `/${pic.key}` : ''}"${pic ? raw(` width="${pic.width}" height="${pic.height}"`) : ''} alt=""${pic && !pic.scheme ? raw(' data-read') : ''}><figcaption id="scheme-say">${pic && pic.scheme ? schemeSay(pic.scheme) : ''}</figcaption></figure>
      <label class="drop-zone">
        <span class="drop-say"><b>Lohista pilt siia</b> või vali fail</span>
        <span class="hint${err('image_file') ? ' err' : ''}">${err('image_file') || 'JPEG, PNG, WebP või GIF, kuni 10 MB. Suurim originaal, mis on olemas.'}</span>
        <input type="file" name="image_file" accept="image/jpeg,image/png,image/webp,image/gif">
      </label>
    </div>
    <input type="hidden" name="image_scheme" value="">
    <div class="fields">
      <div class="field-row">
        ${field({ id: 'f-alt-et', label: 'Pildi kirjeldus', hint: 'Mida pildil näeb, lugejale, kes pilti ei näe.', control: input('f-alt-et', 'alt_et', v.alt_et ?? pic?.alt_et ?? '') })}
        ${field({ id: 'f-alt-en', label: 'Picture description, in English', control: input('f-alt-en', 'alt_en', v.alt_en ?? pic?.alt_en ?? '') })}
      </div>
      ${field({ id: 'f-image', label: 'Olemasolev pilt', err: err('image_key'), hint: 'Faili nimi, kui pilt on juba olemas. Üles laaditud pilt asendab selle.', control: input('f-image', 'image_key', imageKey, ' spellcheck="false"') })}
    </div>

    <h2>Millal ja kus</h2>
    <div class="fields">
      <!-- the three that say when, on one row (asked 2026-09-29 with a crop: "move to single row") -->
      <div class="field-row">
        ${field({ id: 'f-start', label: 'Algus', err: err('starts_at'), control: input('f-start', 'starts_at', v.starts_at, ' type="datetime-local" required') })}
        ${field({ id: 'f-end', label: 'Lõpp', err: err('ends_at'), hint: 'Tühi, kui üks õhtu.', control: input('f-end', 'ends_at', v.ends_at, ' type="datetime-local"') })}
        ${field({ id: 'f-duration', label: 'Kestus minutites', err: err('duration_min'), control: input('f-duration', 'duration_min', v.duration_min, ' type="number" min="1" max="1440" inputmode="numeric"') })}
      </div>
      ${field({ id: 'f-venue', label: 'Koht', control: input('f-venue', 'venue', v.venue) })}
      ${field({ id: 'f-address', label: 'Aadress', control: input('f-address', 'address', v.address) })}
      ${field({ id: 'f-tickets', label: 'Piletid', err: err('ticket_url'), control: input('f-tickets', 'ticket_url', v.ticket_url, ' type="url" inputmode="url"') })}
      ${field({ id: 'f-website', label: 'Veebileht', err: err('website_url'), control: input('f-website', 'website_url', v.website_url, ' type="url" inputmode="url"') })}
      ${field({ id: 'f-category', label: 'Sari', err: err('category'), control: html`<select id="f-category" name="category">${opts(CATEGORIES, v.category)}</select>` })}
    </div>

    <h2>Avaldamine</h2>
    <div class="fields">
      ${group({ label: 'Olek', hint: 'Mustandit avalikul lehel ei näe.', err: err('status'), control: segment('status', STATUSES, v.status) })}
      ${field({ id: 'f-publish', label: 'Avalda alates', err: err('publish_at'), hint: 'Tühi = kohe.', control: input('f-publish', 'publish_at', v.publish_at, ' type="datetime-local"') })}
    </div>
    <h2>Tekst</h2>
    <div class="langs">
      ${langBlock(v, err, 'et', 'Eesti keeles', 'Pealkiri', 'Slug', 'Kirjeldus', 'body')}
      ${langBlock(v, err, 'en', 'Inglise keeles', 'Title', 'Slug', 'Description', 'body')}
    </div>

    <h2>Tegijad</h2>
    <div class="credits-edit">
      ${v.credits.map((c, i) => credit(c, i))}
    </div>
    <p class="add-credit"><button class="btn" type="submit" name="do" value="add-credit" formnovalidate>Lisa tegija</button></p>
    <template id="credit-tpl">${credit(BLANK_CREDIT(), v.credits.length, '__i__')}</template>
    <script type="module">
${raw(SAME_HEIGHT)}
${raw(READ_PICTURE)}
      // with script the block is added in place; without, the same button posts the form and the server adds it
      const btn = document.querySelector('[name="do"][value="add-credit"]'), tpl = document.getElementById('credit-tpl'), list = document.querySelector('.credits-edit'), count = document.querySelector('[name="credit_count"]');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const i = Number(count.value);
        list.insertAdjacentHTML('beforeend', tpl.innerHTML.replaceAll('__i__', String(i)).replace(/Tegija \\d+/, 'Tegija ' + (i + 1)));
        count.value = String(i + 1);
        list.lastElementChild.querySelector('select, input').focus();
      });
    </script>

    <div class="actions">
      <button class="btn btn-pri" type="submit" name="do" value="save">Salvesta</button>
      <button class="btn" type="submit" name="do" value="preview-et">Eelvaade ET</button>
      <button class="btn" type="submit" name="do" value="preview-en">Eelvaade EN</button>
      <a class="btn btn-end" href="${cancel}">Loobu</a>
    </div>
  </form>`;
  return page({ lang: 'et', title: `${title}.`, alternate: ALT, body });
};

// ── the text pages: the same form with nothing a page lacks ─────────────────
// v: the form's values (src/editor.mjs, pageFromRows or parsePage); errors as editorForm takes them;
// cancel: where Loobu goes, the page itself (src/editor.mjs)
export const pageForm = ({ v, errors = [], cancel = '/' }) => {
  const err = (f) => (errors.find((e) => e.field === f) || {}).msg;
  const isNew = !v.id;
  const action = isNew ? '/edit/pages/new' : `/edit/pages/${v.id}`;
  const title = isNew ? 'Uus leht' : (v.et.title || v.en.title || 'Leht');
  const body = html`  <h1>${title}</h1>
  ${errors.length ? html`<div class="errors" role="alert"><p>Ei salvestatud. Paranda:</p><ul>${errors.map((e) => html`<li>${e.msg}</li>`)}</ul></div>` : ''}

  <form class="form form-wide" method="post" action="${action}">
    <input type="hidden" name="rev" value="${v.rev}">
    <h2>Pealkiri</h2>
    <div class="langs">
      ${langBlock(v, err, 'et', 'Eesti keeles', 'Pealkiri', 'Slug', 'Tekst', 'head')}
      ${langBlock(v, err, 'en', 'Inglise keeles', 'Title', 'Slug', 'Text', 'head')}
    </div>

    <h2>Avaldamine</h2>
    <div class="fields">
      ${group({ label: 'Olek', hint: 'Mustandit avalikul lehel ei näe.', err: err('status'), control: segment('status', STATUSES, v.status) })}
      ${field({ id: 'f-publish', label: 'Avalda alates', err: err('publish_at'), hint: 'Tühi = kohe.', control: input('f-publish', 'publish_at', v.publish_at, ' type="datetime-local"') })}
    </div>

    <h2>Tekst</h2>
    <div class="langs">
      ${langBlock(v, err, 'et', 'Eesti keeles', 'Pealkiri', 'Slug', 'Tekst', 'body')}
      ${langBlock(v, err, 'en', 'Inglise keeles', 'Title', 'Slug', 'Text', 'body')}
    </div>
    <script type="module">
${raw(SAME_HEIGHT)}
    </script>

    <div class="actions">
      <button class="btn btn-pri" type="submit" name="do" value="save">Salvesta</button>
      <button class="btn" type="submit" name="do" value="preview-et">Eelvaade ET</button>
      <button class="btn" type="submit" name="do" value="preview-en">Eelvaade EN</button>
      <a class="btn btn-end" href="${cancel}">Loobu</a>
    </div>
  </form>`;
  return page({ lang: 'et', title: `${title}.`, alternate: ALT, body });
};

// the two things that can go wrong now that nothing is locked: the row is not
// there, or D1 answered with an error
export const errorPage = ({ status, reason }) => {
  const what = status === 404
    ? (reason === 'page'
      ? ['Sellist lehte ei ole.', html`Lehed on menüüs ja igal lehel on Muuda nupp.`]
      : ['Sellist sündmust ei ole.', html`Sündmused on <a href="/et/sundmused">nimekirjas</a>.`])
    : ['Toimetaja ei vasta.', 'Andmebaas vastas veaga. Värskel paigaldusel on põhjus enamasti rakendamata migratsioon, migrations/0002_editing.sql või 0003_page_editing.sql.'];
  return page({ lang: 'et', title: `${what[0]}`, alternate: ALT, body: html`  <p class="crumb">Toimeta</p>
  <h1>${what[0]}</h1>
  <p class="note">${what[1]}</p>` });
};
