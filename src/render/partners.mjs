// partners.mjs: the partners' logos as markup (asked 2026-11-07: "eccm wants
// each post to contain list of partner logo(s) ... have bw and color optoins.
// allow editing to pick from logos. make it a grid, multiple select. footer
// logos should use same system."). One logo in one version (logo), the row
// under an event's credits (partnerRow), the footer's end column
// (footerPartners), the picker the event editor shows and the Layout page will
// show unchanged (partnerPicker), and the Logos page with its form
// (logosPage, logoForm). src/partners.mjs has the routes and the processing.
import { html, raw } from './html.mjs';
import { page } from './chrome.mjs';
import { field, input, segment, group } from './editor.mjs';

export const VERSIONS = [['bw', 'Black and white'], ['color', 'Colour']];
const LANGS = [['', 'Both'], ['et', 'Estonian only'], ['en', 'English only']];
const LANG_TAG = { et: 'ET', en: 'EN' };
const host = (url) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; } };

// one logo. Colour is the file as an img, with its dark-ground twin beside it when there is one, CSS showing
// the one the ground needs (eccm.css .logo-pos, .logo-neg). Black and white is the black-and-white file as a
// CSS mask over currentColor, so it is drawn in the ink of whatever it sits on: the site's in either theme,
// an event's own scheme on its page. The paths are the row's own, written by src/partners.mjs or the seed
export const logo = (p, version) => {
  if (version === 'bw') return html`<span class="logo logo-bw" role="img" aria-label="${p.name}" style="--src: url('${p.bw_src}'); aspect-ratio: ${p.bw_w} / ${p.bw_h}"></span>`;
  const img = (src, cls) => html`<img class="logo ${cls}" src="${src}" alt="${p.name}" width="${p.color_w}" height="${p.color_h}" loading="lazy" decoding="async">`;
  return p.dark_src ? html`${img(p.color_src, 'logo-pos')}${img(p.dark_src, 'logo-neg')}` : img(p.color_src, '');
};
const linked = (p, inner, cls) => (p.url ? html`<a class="${cls}" href="${p.url}">${inner}</a>` : html`<span class="${cls}">${inner}</span>`);
const slugClass = (p) => `partner${p.slug ? ` partner-${p.slug}` : ''}`;

// the logos an event chose, each in the version saved with it, as one row under the credits
const LABEL = { et: 'Partnerid', en: 'Partners' };
export const partnerRow = (rows, lang) => (rows && rows.length ? html`<ul class="partners" aria-label="${LABEL[lang]}">
        ${rows.map((p) => html`<li>${linked(p, logo(p, p.version), slugClass(p))}</li>`)}
      </ul>` : '');

// the footer's end column from the rows the Layout page flags, in their order, in the page's language. Each
// is the black-and-white file as an img under the theme's invert, which is the markup the footer had when
// the marks were typed into src/render/mark.mjs, so the seeded rows draw exactly what was there
export const footerPartners = (rows, lang) => html`<div class="end">${rows.filter((p) => !p.lang || p.lang === lang).map((p) => linked(p, html`<img src="${p.bw_src}" alt="${p.name}" width="${p.bw_w}" height="${p.bw_h}" loading="lazy" decoding="async">`, slugClass(p)))}</div>`;

// the picker: every logo a tile with its checkbox, any number checked, and one choice of version for all
// of them, which the tiles follow as it changes (CSS only). partners: every row; selected: the chosen ids;
// name: the checkboxes' field name; version: the chosen version, or null for a picker without the choice;
// err: a message about the field, shown in place of the hint
export const partnerPicker = ({ partners, selected = [], name = 'partner', version = 'bw', versionName = `${name}_version`, label = 'Partners', hint = '', err = '' }) => {
  const on = new Set(selected.map(Number));
  return html`<div class="picker-wrap">
      ${group({ label, err, hint: hint || (partners.length ? 'Tick every logo to show. A logo for one language shows only on that language’s page.' : ''), control: partners.length ? html`<div class="picker">
        ${partners.map((p) => html`<label class="pick">
          <input type="checkbox" name="${name}" value="${p.id}"${on.has(p.id) ? raw(' checked') : ''}>
          <span class="pick-logo">${logo(p, 'color')}${logo(p, 'bw')}</span>
          <span class="pick-name">${p.name}${p.lang ? html` <span class="pick-lang">${LANG_TAG[p.lang]}</span>` : ''}</span>
        </label>`)}
      </div>` : html`<p class="note">No logos yet. <a href="/edit/partners">Upload one</a>.</p>` })}
      ${version === null || !partners.length ? '' : group({ label: 'Logos in', control: segment(versionName, VERSIONS, version) })}
    </div>`;
};

// ── the Logos page ──────────────────────────────────────────────────────────
// the browser half of the processing, public/partners.mjs: a PNG or JPEG chosen in a file field is scaled
// and given its mask before the form is sent, and every chosen file is shown in the preview beside its field
const PROCESS = `      const { attach } = await import('/partners.mjs');
      attach(document.querySelector('form.logo-form'));`;

const errs = (errors) => (errors.length ? html`<div class="errors" role="alert"><p>Not saved. Fix these:</p><ul>${errors.map((e) => html`<li>${e.msg}</li>`)}</ul></div>` : '');

// the fields a new logo and an edited one share; row is the saved row when editing
const fields = (v, err, row) => html`<div class="fields">
      <div class="field-row">
        ${field({ id: 'f-name', label: 'Name', err: err('name'), hint: 'The logo’s alt text, read out wherever it is drawn.', control: input('f-name', 'name', v.name, ' required') })}
        ${field({ id: 'f-url', label: 'Link', err: err('url'), hint: 'Where the logo leads, on event pages and in the footer. Empty for none.', control: input('f-url', 'url', v.url, ' type="url" inputmode="url" spellcheck="false"') })}
      </div>
      ${group({ label: 'Language', hint: 'A logo drawn in one language, like Tallinn’s, has a row per language.', control: segment('lang', LANGS, v.lang) })}
      <div class="logo-files">
        ${fileField('color_file', row ? 'Replace the colour version' : 'Logo', err('color_file'), row ? 'SVG, PNG or JPEG. Its black-and-white version is made again unless one is given below.' : 'SVG, PNG or JPEG, up to 2 MB. An SVG is kept as it is, a PNG or JPEG is scaled to 192 px tall.', row && logo(row, 'color'))}
        ${fileField('bw_file', 'Own black-and-white version', err('bw_file'), 'Optional. Without one it is made from the logo: every colour in the ink, or for a PNG or JPEG its dark parts.', row && logo(row, 'bw'))}
        ${fileField('dark_file', 'Colour version for a dark ground', err('dark_file'), 'Optional, like the EU emblem’s negative. Shown in place of the colour version in the dark theme.', row && row.dark_src ? html`<img class="logo" src="${row.dark_src}" alt="" width="${row.color_w}" height="${row.color_h}">` : '', true)}
      </div>
      ${row && row.dark_src ? html`<label class="check"><input type="checkbox" name="dark_clear" value="1"> Remove the dark-ground version</label>` : ''}
      <input class="vh" type="file" name="bw_auto" tabindex="-1" aria-hidden="true">
    </div>`;
const fileField = (name, label, err, hint, current, dark = false) => html`<div class="field logo-file">
        <label for="f-${name}">${label}</label>
        <div class="logo-prev${dark ? ' logo-prev-dark' : ''}" data-for="${name}">${current || ''}</div>
        <input id="f-${name}" type="file" name="${name}" accept="image/svg+xml,image/png,image/jpeg">
        <p class="hint${err ? ' err' : ''}">${err || hint}</p>
      </div>`;

// every logo as a tile: its colour version over the ground and its black-and-white one in the ink, the
// name, the language, the link's host, how many events show it, and Edit; Delete is on the logo's own page
export const logosPage = ({ partners, uses = {}, v, errors = [] }) => {
  const err = (f) => (errors.find((e) => e.field === f) || {}).msg;
  return page({ wide: true, lang: 'en', title: 'Logos.', body: html`  <h1>Logos</h1>
  <p class="note">Partners’ logos for event pages and the footer, each in colour and in black and white. Which ones the footer shows is set on the Layout page.</p>
  ${partners.length ? html`<ul class="logo-grid">
    ${partners.map((p) => html`<li class="logo-tile">
      <div class="logo-pair"><span class="logo-cell">${logo(p, 'color')}</span><span class="logo-cell">${logo(p, 'bw')}</span></div>
      <p class="logo-name">${p.name}${p.lang ? html` <span class="pick-lang">${LANG_TAG[p.lang]}</span>` : ''}</p>
      <p class="logo-meta">${p.url ? host(p.url) : 'No link'}. ${uses[p.id] ? `On ${uses[p.id]} event${uses[p.id] === 1 ? '' : 's'}` : 'On no event'}${p.in_footer ? ', in the footer' : ''}.</p>
      <p><a class="btn btn-sm" href="/edit/partners/${p.id}">Edit</a></p>
    </li>`)}
  </ul>` : html`<p class="note">No logos yet.</p>`}

  <h2 class="logo-add" id="add">Add a logo</h2>
  ${errs(errors)}
  <form class="form form-wide logo-form" method="post" action="/edit/partners" enctype="multipart/form-data">
    ${fields(v, err, null)}
    <script type="module">
${raw(PROCESS)}
    </script>
    <div class="actions"><button class="btn btn-pri" type="submit">Add</button></div>
  </form>` });
};

export const logoForm = ({ row, v, errors = [], uses = 0 }) => {
  const err = (f) => (errors.find((e) => e.field === f) || {}).msg;
  const gone = uses ? `It goes from the ${uses} event${uses === 1 ? '' : 's'} that show${uses === 1 ? 's' : ''} it.` : '';
  return page({ wide: true, lang: 'en', title: `${row.name}.`, body: html`  <p class="crumb"><a href="/edit/partners">Logos</a></p>
  <h1>${row.name}</h1>
  ${errs(errors)}
  <form class="form form-wide logo-form" method="post" action="/edit/partners/${row.id}" enctype="multipart/form-data">
    ${fields(v, err, row)}
    <script type="module">
${raw(PROCESS)}
      // a delete asks first, and says what else goes with the logo
      const del = document.querySelector('[name="do"][value="delete"]');
      del.addEventListener('click', (e) => { if (!confirm(del.dataset.confirm)) e.preventDefault(); });
    </script>
    <div class="actions">
      <button class="btn btn-pri" type="submit" name="do" value="save">Save</button>
      <a class="btn" href="/edit/partners">Cancel</a>
      <button class="btn btn-end" type="submit" name="do" value="delete" formnovalidate data-confirm="${`Delete ${row.name}? ${gone}`.trim()}">Delete</button>
    </div>
  </form>` });
};
