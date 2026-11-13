// news.mjs: the news pages, asked 2026-11-13 by an ECCM editor (migrations/0018_news.sql has the words): the list at
// /et/uudised and /en/news, newest first, which is also the archive; one item at /et/uudised/{slug} and
// /en/news/{slug}; the front page's column of the three newest; and the editor's form and list. The list rows are
// the events list's (.ev), with the date where an event has its date and place; an item is a text page with its
// date, its picture, its links and its logos. Like a page, an item with no text in this language shows the other
// language's under this language's chrome with the fallback line.
import { html, raw } from './html.mjs';
import { md } from './md.mjs';
import { T, OTHER, page } from './chrome.mjs';
import { dateLong, dateShort } from './dates.mjs';
import { listImg, poster } from './pic.mjs';
import { opening, firstSentence, clip } from './lead.mjs';
import { partnerRow, partnerPicker } from './partners.mjs';
import { field, input, group, segment } from './editor.mjs';

export const NEWS = { et: '/et/uudised', en: '/en/news' };
export const newsPath = (lang, slug) => `${NEWS[lang]}/${slug}`;
const W = {
  et: { news: 'Uudised', all: 'Kõik uudised', none: 'Uudiseid veel ei ole.', links: 'Lingid' },
  en: { news: 'News', all: 'All news', none: 'No news yet.', links: 'Links' },
};
export const NEWS_WORDS = W;

// the opening of a body as plain text, its first sentence when it runs long, as an event row's summary
const lead = (n) => {
  const plain = opening(n.body, { title: n.title });
  if (plain.length <= 220) return plain;
  const m = /^(.{40,219}?[.!?])(\s|$)/.exec(plain);
  return m ? m[1] : plain.slice(0, 220).replace(/\s+\S*$/, '') + '…';
};
const when = (n, lang) => html`<time datetime="${n.published_on}"><span class="d-long">${dateLong(n.published_on, lang)}</span><span class="d-short">${dateShort(n.published_on, lang)}</span></time>`;

// one row of the list, the events list's own markup; href: the item, or its form in the editor's list
const row = (n, lang, first = false, href = newsPath(n.tlang, n.slug)) => {
  const foreign = n.tlang !== lang ? raw(` lang="${n.tlang}"`) : '';
  const summary = lead(n);
  return html`<li class="ev">
      ${n.pic ? html`<a class="ev-pic" href="${href}" tabindex="-1" aria-hidden="true">${listImg(n.pic, n.width, n.height, first)}</a>` : html`<span class="ev-pic ev-blank" aria-hidden="true"></span>`}
      <div class="ev-body">
        <p class="ev-kicker">${when(n, lang)}${n.status && n.status !== 'published' ? html`<span>Draft</span>` : ''}</p>
        <h2 class="ev-title"><a href="${href}"${foreign}>${n.title || 'Untitled'}</a></h2>
        ${summary ? html`<p class="ev-summary prose"${foreign}>${summary}</p>` : ''}
      </div>
    </li>`;
};

export const renderNewsList = ({ lang, rows, origin }) => {
  const w = W[lang];
  const alternates = [
    { hreflang: 'et', href: origin + NEWS.et },
    { hreflang: 'en', href: origin + NEWS.en },
    { hreflang: 'x-default', href: origin + NEWS.et },
  ];
  const body = html`  <article class="event">
    <h1>${w.news}</h1>
    ${rows.length ? html`<ol class="events">
    ${rows.map((n, i) => row(n, lang, i === 0))}
    </ol>` : html`<p class="note">${w.none}</p>`}
  </article>`;
  return page({ lang, title: w.news, alternate: { lang: OTHER[lang], href: NEWS[OTHER[lang]] }, canonical: origin + NEWS[lang], alternates, body, og: { key: 'news', title: w.news }, description: lang === 'et' ? 'Eesti Nüüdismuusika Keskuse uudised.' : 'News from the Estonian Centre of Contemporary Music.' });
};

// the front page's column (asked 2026-11-13: the three newest "with picture and opening"), beside the events on a
// desk and under them on a phone (public/eccm.css .home-news)
export const newsColumn = (rows, lang) => (rows.length ? html`<aside class="home-news" aria-labelledby="home-news-h">
      <h2 id="home-news-h">${W[lang].news}</h2>
      <ol class="news-col">
        ${rows.map((n) => html`<li>
          ${n.pic ? html`<a class="news-col-pic" href="${newsPath(n.tlang, n.slug)}" tabindex="-1" aria-hidden="true">${listImg(n.pic, n.width, n.height)}</a>` : ''}
          <p class="news-col-when">${dateShort(n.published_on, lang)}</p>
          <h3><a href="${newsPath(n.tlang, n.slug)}"${n.tlang !== lang ? raw(` lang="${n.tlang}"`) : ''}>${n.title}</a></h3>
          ${lead(n) ? html`<p class="news-col-lead"${n.tlang !== lang ? raw(` lang="${n.tlang}"`) : ''}>${lead(n)}</p>` : ''}
        </li>`)}
      </ol>
      <p class="news-col-all"><a href="${NEWS[lang]}">${W[lang].all}</a></p>
    </aside>` : '');

// one item: text { news_id, lang, slug, title, body }, item the news row, media its picture or null, links its
// news_link rows, partners its logos in this language, twin the other language's { lang, slug } or null
export const renderNewsItem = ({ lang, text, fallback, item, media, links = [], partners = [], twin, origin, path, editor = false, notice, editHref }) => {
  const t = T[lang];
  const textLang = fallback ? text.lang : lang;
  const alternate = { lang: OTHER[lang], href: twin ? newsPath(twin.lang, twin.slug) : NEWS[OTHER[lang]] };
  const alternates = twin && !fallback ? [
    { hreflang: 'et', href: origin + (lang === 'et' ? path : alternate.href) },
    { hreflang: 'en', href: origin + (lang === 'en' ? path : alternate.href) },
    { hreflang: 'x-default', href: origin + (lang === 'et' ? path : alternate.href) },
  ] : [];
  const pic = media ? poster(media, media[`alt_${textLang}`] || '') : null;
  const label = (l) => (lang === 'en' ? l.label_en || l.label_et : l.label_et || l.label_en) || l.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  const body = html`  <article class="event page-text">
    <header class="event-top">
      <div class="event-lead">
        ${fallback ? html`<p class="small">${t.fallback}</p>` : ''}
        <p class="small">${when(item, lang)}</p>
        <h1 lang="${textLang}">${text.title}</h1>
        <p class="event-actions">
          ${editor ? html`<a class="btn" href="${editHref || `/edit/news/${item.id}`}">${t.edit}</a>` : ''}
        </p>
      </div>
    </header>
    ${pic ? html`<figure class="event-pic news-pic">${pic.img}</figure>` : ''}
    <div class="prose flow" lang="${textLang}">
      ${raw(md(text.body, { video: true }))}
    </div>
    ${links.length ? html`<ul class="news-links" aria-label="${W[lang].links}">
      ${links.map((l) => html`<li><a href="${l.url}" rel="noopener">${label(l)}</a></li>`)}
    </ul>` : ''}
    ${partnerRow(partners, lang)}
  </article>`;
  return page({ lang, title: text.title, alternate, canonical: origin + (fallback ? newsPath(text.lang, text.slug) : path), alternates, body, notice, head: pic ? pic.preload : null, og: { key: `news-${text.slug}`, title: text.title, lang: textLang }, description: clip(firstSentence(opening(text.body, { title: text.title }))) });
};

// ── the editor ──────────────────────────────────────────────────────────────
export const STATUSES = [['draft', 'Draft'], ['published', 'Published']];

// every item, drafts dimmed, newest first, each to its form; New news first
export const renderNewsAdmin = ({ rows }) => page({
  wide: true, lang: 'en', title: 'News.',
  body: html`  <h1>News</h1>
  <p class="note"><a class="btn" href="/edit/news/new">New item</a></p>
  ${rows.length ? html`<ol class="events">
  ${rows.map((n, i) => row(n, 'en', i === 0, `/edit/news/${n.id}`))}
  </ol>` : html`<p class="note">No news yet.</p>`}`,
});

// v: the form's values (src/news.mjs); media: the media rows for the picture's name; partners: every logo
export const newsForm = ({ v, errors = [], media = [], partners = [], cancel = '/edit/news' }) => {
  const err = (f) => (errors.find((e) => e.field === f) || {}).msg;
  const isNew = !v.id;
  const title = isNew ? 'New news item' : (v.et.title || v.en.title || 'News item');
  const lang = (l, name) => html`<section lang="${l}">
        <h3 class="field-name">${name}</h3>
        ${field({ id: `f-title-${l}`, label: 'Title', err: err(`title_${l}`), control: input(`f-title-${l}`, `title_${l}`, v[l].title) })}
        ${field({ id: `f-slug-${l}`, label: 'Slug', err: err(`slug_${l}`), hint: 'Leave empty to derive it from the title.', control: input(`f-slug-${l}`, `slug_${l}`, v[l].slug, ' spellcheck="false"') })}
        ${field({ id: `f-body-${l}`, label: 'Text', err: err(`body_${l}`), hint: l === 'et' ? 'A blank line starts a paragraph, **text** is bold, [words](https://…) is a link.' : '', control: html`<textarea id="f-body-${l}" name="body_${l}" rows="14">${v[l].body}</textarea>` })}
      </section>`;
  const body = html`  <h1>${title}</h1>
  ${errors.length ? html`<div class="errors" role="alert"><p>Not saved. Fix these:</p><ul>${errors.map((e) => html`<li>${e.msg}</li>`)}</ul></div>` : ''}

  <form class="form form-wide" method="post" action="${isNew ? '/edit/news/new' : `/edit/news/${v.id}`}" enctype="multipart/form-data">
    <input type="hidden" name="rev" value="${v.rev}">
    <h2>Publishing</h2>
    <div class="fields">
      ${group({ label: 'Status', hint: 'A draft is not shown on the public site.', err: err('status'), control: segment('status', STATUSES, v.status) })}
      ${field({ id: 'f-date', label: 'Date', err: err('published_on'), hint: 'The date shown, and the order.', control: input('f-date', 'published_on', v.published_on, ' type="date" required') })}
    </div>

    <h2>Text</h2>
    <div class="langs">
      ${lang('et', 'Estonian')}
      ${lang('en', 'English')}
    </div>

    <h2>Picture</h2>
    <div class="fields">
      ${field({ id: 'f-image-file', label: 'Picture file', err: err('image_file'), hint: 'Optional. JPEG, PNG, WebP or GIF, up to 10 MB.', control: html`<input id="f-image-file" type="file" name="image_file" accept="image/jpeg,image/png,image/webp,image/gif">` })}
      ${field({ id: 'f-image', label: 'Or one already here, by file name', err: err('image_key'), hint: 'Empty the field to remove the picture.', control: html`<input id="f-image" name="image_key" value="${v.image_key}" list="media-keys" spellcheck="false"><datalist id="media-keys">${media.map((m) => html`<option value="${m.key}">`)}</datalist>` })}
      <div class="field-row">
        ${field({ id: 'f-alt-et', label: 'Picture description, in Estonian', hint: 'What the picture shows, for a reader who cannot see it.', control: input('f-alt-et', 'alt_et', v.alt_et) })}
        ${field({ id: 'f-alt-en', label: 'Picture description, in English', control: input('f-alt-en', 'alt_en', v.alt_en) })}
      </div>
    </div>

    <h2>Links</h2>
    <div class="fields">
      ${field({ id: 'f-links', label: 'Links', err: err('links'), hint: 'One per line: the address, then | and the words in Estonian, then | and the words in English. Words are optional: https://example.com | Loe lähemalt | Read more', control: html`<textarea id="f-links" name="links" rows="5" spellcheck="false">${v.links}</textarea>` })}
    </div>

    <h2>Partners</h2>
    ${partnerPicker({ partners, selected: v.partners || [], version: v.partner_version || 'bw', label: 'Logos', err: err('partner') || err('partner_version') })}

    <div class="actions">
      <button class="btn btn-pri" type="submit" name="do" value="save">Save</button>
      <button class="btn" type="submit" name="do" value="preview-et">Preview ET</button>
      <button class="btn" type="submit" name="do" value="preview-en">Preview EN</button>
      <a class="btn btn-end" href="${cancel}">Cancel</a>
    </div>
  </form>`;
  return page({ wide: true, lang: 'en', title: `${title}.`, body });
};
