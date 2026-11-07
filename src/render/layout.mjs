// layout.mjs: the Layout page, /edit/layout (src/layout.mjs has the ask): the menu's pages, each a tick and
// its words in both languages, then the footer's logos in the event editor's grid, one Save for both
import { html, raw } from './html.mjs';
import { page } from './chrome.mjs';
import { input } from './editor.mjs';
import { partnerPicker } from './partners.mjs';

const row = (p) => html`<li class="menu-pick">
        <label class="menu-tick"><input type="checkbox" name="menu" value="${p.id}"${p.in_menu ? raw(' checked') : ''}> ${p.title_et || p.title_en}${p.status !== 'published' ? html` <span class="pick-lang">Draft</span>` : ''}</label>
        <span class="menu-words">
          <label><span class="vh">Menu title in Estonian</span>${input(`m-et-${p.id}`, `et_${p.id}`, p.menu_title_et, ` lang="et" maxlength="40" placeholder="${p.title_et || p.title_en || ''}"`)}</label>
          <label><span class="vh">Menu title in English</span>${input(`m-en-${p.id}`, `en_${p.id}`, p.menu_title_en, ` lang="en" maxlength="40" placeholder="${p.title_en || p.title_et || ''}"`)}</label>
        </span>
      </li>`;

export const layoutPage = ({ pages, partners, footer, saved }) => page({ wide: true, lang: 'en', title: 'Layout.', body: html`  <h1>Layout</h1>
  ${saved ? html`<p class="note" role="status">Saved. Every page shows it within a minute.</p>` : ''}
  <form class="form form-wide" method="post" action="/edit/layout">
    <h2>Menu</h2>
    <p class="hint">Events comes first, then every ticked page. The menu shows its words in Estonian and in English, or the page’s title when they are empty.</p>
    <div class="menu-head" aria-hidden="true"><span>Page</span><span>Estonian</span><span>English</span></div>
    <ul class="menu-picks">
      ${pages.map(row)}
    </ul>
    <h2>Footer</h2>
    <div class="picker-bw">
      ${partnerPicker({ partners, selected: footer, name: 'footer', version: null, label: 'Logos', hint: 'Tick every logo the footer shows, drawn in black and white. A logo for one language shows only on that language’s pages.' })}
    </div>
    <div class="actions"><button class="btn btn-pri" type="submit">Save</button></div>
  </form>` });
