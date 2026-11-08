// page.mjs: a text page from a page_text row, in the event page's shape with
// nothing an event has: no facts, no picture, no credits, no next events. The
// title is the h1 and the body is prose at the measure in .flow, under the
// same chrome, with the hreflang pair and the language switch pointing at the
// twin exactly as event.mjs does it (plans/plan-eccm-cms-step-1.md section 4
// and its session 5, widened 2026-09-28 to the five pages the menu names).
// The fallback runs both ways here, unlike the event page's Estonian-only
// one, because on eccm.ee the NAN and Ulysses pages are English and Tallinn
// 1965 is Estonian: a route in a language with no row shows the other row
// under the visitor's chrome with one line saying so. Since 2026-09-28 the
// lead is the event page's header without the picture, so the Muuda button
// sits under the title the way event.mjs shows it and the prose follows at
// the same distance; the editor (src/editor.mjs) renders this same function
// for a preview, with a notice and an editHref of its own. page-text is the
// stylesheet's one centred column of the measure, since a page has no
// picture for the event page's second column (asked 2026-09-28: "page
// content is too left, not great to read").
import { html, raw } from './html.mjs';
import { md } from './md.mjs';
import { T, OTHER, page } from './chrome.mjs';
import { opening, firstSentence, clip } from './lead.mjs';

export const pagePath = (lang, slug) => `/${lang}/${slug}`;

// The Co-funded by the European Union emblem Creative Europe requires on the
// Ulysses page, in the visitor's language, the negative file in the dark theme
// (public/partners/SOURCE.md has the source and the size rule). A body cannot
// carry a picture (md.mjs), so it is drawn here for the page key.
const EU = {
  et: { alt: 'Kaasrahastanud Euroopa Liit', w: 191 },
  en: { alt: 'Co-funded by the European Union', w: 215 },
};
const euEmblem = (lang) => html`<p class="eu-emblem">${['', '-neg'].map((v) => html`<img class="eu${v || '-pos'}" src="/partners/eu-cofunded-${lang}${v}.png" alt="${EU[lang].alt}" width="${EU[lang].w}" height="48" loading="lazy" decoding="async">`)}</p>`;

// text: the page_text row shown (with page_key when the caller read it), in the requested language or, when fallback
// is true, in the other one; twin: { lang, slug } of the other language's row
// when it exists, which in the fallback case is the row shown; editHref:
// where the edit button goes, the row's own editor page unless the caller
// says otherwise (a preview of an unsaved page); notice: chrome.mjs; editor: a logged-in editor is looking,
// the only one shown the edit button, as on an event (src/render/event.mjs)
export const renderPage = ({ lang, text, fallback, twin, origin, path, notice, editHref, editor = false }) => {
  const t = T[lang];
  const textLang = fallback ? text.lang : lang;
  const alternate = { lang: OTHER[lang], href: pagePath(OTHER[lang], twin ? twin.slug : text.slug) };
  const alternates = twin && !fallback ? [
    { hreflang: 'et', href: origin + (lang === 'et' ? path : alternate.href) },
    { hreflang: 'en', href: origin + (lang === 'en' ? path : alternate.href) },
    { hreflang: 'x-default', href: origin + (lang === 'et' ? path : alternate.href) },
  ] : [];
  const canonical = origin + (fallback ? pagePath(text.lang, text.slug) : path);

  const body = html`  <article class="event page-text">
    <header class="event-top">
      <div class="event-lead">
        ${fallback ? html`<p class="small">${t.fallback}</p>` : ''}
        <h1 lang="${textLang}">${text.title}</h1>
        <p class="event-actions">
          ${editor ? html`<a class="btn" href="${editHref || `/edit/pages/${text.page_id}`}">${t.edit}</a>` : ''}
        </p>
      </div>
    </header>
    <div class="prose flow" lang="${textLang}">
      ${raw(md(text.body, { video: true }))}
      ${text.page_key === 'ulysses' ? euEmblem(lang) : ''}
    </div>
  </article>`;
  return page({ lang, title: text.title, alternate, canonical, alternates, body, notice, og: { key: text.slug, title: text.title, lang: textLang }, description: clip(firstSentence(opening(text.body, { title: text.title }))) });
};
