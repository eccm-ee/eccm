// page.mjs: a text page from a page_text row, in the event page's shape with
// nothing an event has: no facts, no picture, no credits, no next events. The
// title is the h1 and the body is prose at the measure in .flow, under the
// same chrome, with the hreflang pair and the language switch pointing at the
// twin exactly as event.mjs does it (plans/plan-eccm-cms-step-1.md section 4
// and its session 5, widened 2026-09-28 to the five pages the menu names).
// The fallback runs both ways here, unlike the event page's Estonian-only
// one, because on eccm.ee the NAN and Ulysses pages are English and Tallinn
// 1965 is Estonian: a route in a language with no row shows the other row
// under the visitor's chrome with one line saying so.
import { html, raw } from './html.mjs';
import { md } from './md.mjs';
import { T, OTHER, page } from './chrome.mjs';

export const pagePath = (lang, slug) => `/${lang}/${slug}`;

// text: the page_text row shown, in the requested language or, when fallback
// is true, in the other one; twin: { lang, slug } of the other language's row
// when it exists, which in the fallback case is the row shown
export const renderPage = ({ lang, text, fallback, twin, origin, path }) => {
  const t = T[lang];
  const textLang = fallback ? text.lang : lang;
  const alternate = { lang: OTHER[lang], href: pagePath(OTHER[lang], twin ? twin.slug : text.slug) };
  const alternates = twin && !fallback ? [
    { hreflang: 'et', href: origin + (lang === 'et' ? path : alternate.href) },
    { hreflang: 'en', href: origin + (lang === 'en' ? path : alternate.href) },
    { hreflang: 'x-default', href: origin + (lang === 'et' ? path : alternate.href) },
  ] : [];
  const canonical = origin + (fallback ? pagePath(text.lang, text.slug) : path);

  const body = html`  <article class="event">
    <div class="event-lead">
      ${fallback ? html`<p class="small">${t.fallback}</p>` : ''}
      <h1 lang="${textLang}">${text.title}</h1>
    </div>
    <div class="prose flow" lang="${textLang}">
      ${raw(md(text.body))}
    </div>
  </article>`;
  return page({ lang, title: text.title, alternate, canonical, alternates, body });
};
