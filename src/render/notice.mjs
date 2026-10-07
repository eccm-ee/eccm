// notice.mjs: one published notice as a public page, /teated/{num} and
// /en/notices/{num} (asked 2026-10-07, for Väin: the article link its server
// keeps points here). The text page's shape (src/render/page.mjs): the title,
// the publish date and the link as the event page's facts, then the body in
// .flow. A notice has one text, so the two addresses differ only in chrome.
import { html, raw } from './html.mjs';
import { md } from './md.mjs';
import { OTHER, page } from './chrome.mjs';
import { dateLong, clock } from './dates.mjs';

export const noticePath = (lang, num) => (lang === 'et' ? `/teated/${num}` : `/en/notices/${num}`);

const W = { et: { published: 'Avaldatud', at: 'kell', link: 'Link' }, en: { published: 'Published', at: 'at', link: 'Link' } };

// a moment in ms as Tallinn's local ISO text, the shape dates.mjs reads
const local = (ms) => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Tallinn', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(Number(ms))).replace(' ', 'T');

export const renderNotice = ({ lang, it, origin }) => {
  const w = W[lang];
  const at = local(it.publish_at);
  const alternate = { lang: OTHER[lang], href: noticePath(OTHER[lang], it.num) };
  const href = it.url && it.url.startsWith('/') ? origin + it.url : it.url;
  const body = html`  <article class="event page-text">
    <header class="event-top">
      <div class="event-lead">
        <h1>${it.title}</h1>
        <dl class="facts">
          <div><dt>${w.published}</dt><dd><time datetime="${new Date(Number(it.publish_at)).toISOString()}">${dateLong(at, lang)} ${w.at} ${clock(at, lang)}</time></dd></div>
          ${it.url ? html`<div><dt>${w.link}</dt><dd><a href="${it.url}">${String(href).replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</a></dd></div>` : ''}
        </dl>
      </div>
    </header>
    <div class="prose flow">
      ${raw(md(it.body, { video: true }))}
    </div>
  </article>`;
  return page({ lang, title: it.title, alternate, canonical: origin + noticePath('et', it.num), body });
};
