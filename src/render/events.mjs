// events.mjs: the events list, /et/sundmused and /en/events, the one menu
// item that still led to eccm.ee until 2026-09-28 (asked as "do main menu
// pages and make them editable"). The rows are public/index.html's list rows
// on the same stylesheet rules: the picture, the kicker with the date twice
// (long and short, the stylesheet shows one), the clock, the place, the
// series when it is not ECCM's own, the title, the first paragraph.
// Published events only; the ones still to come first in date order, then
// the ones that have been, newest first, under their own heading. An event
// with no text in this language shows its Estonian title and links to the
// fallback page, the way an event page's next-events list does. The Muuda
// button under the title leads to the events editor, which is where this
// list is edited.
import { html, raw } from './html.mjs';
import { T, OTHER, page } from './chrome.mjs';
import { dateLong, dateShort, clock, mapsUrl } from './dates.mjs';
import { offsetFor, CATEGORY } from './event.mjs';

export const LIST = { et: '/et/sundmused', en: '/en/events' };
const eventPath = (l, slug) => (l === 'et' ? `/et/sundmused/${slug}` : `/en/events/${slug}`);

// the first paragraph of a body as plain text, its first sentence when the
// paragraph runs long, the bold and link marks of md.mjs taken off
const lead = (body) => {
  const para = String(body || '').split(/\n\s*\n/).map((x) => x.trim()).find((x) => x && !x.startsWith('#'));
  if (!para) return '';
  const plain = para.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\s+/g, ' ');
  if (plain.length <= 220) return plain;
  const m = /^(.{40,219}?[.!?])(\s|$)/.exec(plain);
  return m ? m[1] : plain.slice(0, 220).replace(/\s+\S*$/, '') + '…';
};

const row = (e, lang) => {
  const href = eventPath(e.tlang, e.slug);
  const foreign = e.tlang !== lang ? raw(` lang="${e.tlang}"`) : '';
  const summary = lead(e.body);
  return html`<li class="ev">
      ${e.pic ? html`<a class="ev-pic" href="${href}" tabindex="-1" aria-hidden="true"><img src="/${e.pic}" width="${e.width}" height="${e.height}" alt="" loading="lazy"></a>` : html`<span class="ev-pic ev-blank" aria-hidden="true"></span>`}
      <div class="ev-body">
        <p class="ev-kicker"><time datetime="${e.starts_at}${offsetFor(e.starts_at)}"><span class="d-long">${dateLong(e.starts_at, lang)}</span><span class="d-short">${dateShort(e.starts_at, lang)}</span></time><time>${clock(e.starts_at, lang)}</time><span><a class="place" href="${mapsUrl(e.venue)}">${e.venue}</a></span>${e.category !== 'eccm' && CATEGORY[e.category] ? html`<span>${CATEGORY[e.category][lang]}</span>` : ''}</p>
        <h2 class="ev-title"><a href="${href}"${foreign}>${e.title}</a></h2>
        ${summary ? html`<p class="ev-summary prose"${foreign}>${summary}</p>` : ''}
      </div>
    </li>`;
};

export const renderEvents = ({ lang, upcoming, past, origin, path }) => {
  const t = T[lang];
  const alternate = { lang: OTHER[lang], href: LIST[OTHER[lang]] };
  const alternates = [
    { hreflang: 'et', href: origin + LIST.et },
    { hreflang: 'en', href: origin + LIST.en },
    { hreflang: 'x-default', href: origin + LIST.et },
  ];
  const body = html`  <article class="event">
    <header class="event-top">
      <div class="event-lead">
        <h1>${t.events}</h1>
        <p class="event-actions"><a class="btn" href="/edit/events">${t.edit}</a></p>
      </div>
    </header>
    ${upcoming.length ? html`<ol class="events">
    ${upcoming.map((e) => row(e, lang))}
    </ol>` : html`<p class="note">${t.noEvents}</p>`}
    ${past.length ? html`
    <section class="next">
      <h2>${t.past}</h2>
      <ol class="events">
      ${past.map((e) => row(e, lang))}
      </ol>
    </section>` : ''}
  </article>`;
  return page({ lang, title: t.events, alternate, canonical: origin + path, alternates, body });
};
