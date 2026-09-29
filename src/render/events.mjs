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
// list is edited; the Add button that led to /edit/events/new went 2026-09-29
// with that route. With home set it is the English front page at /en/ (asked
// 2026-09-28 with a picture of /en/ answering the 404): the front page's
// heading, the events to come, no button and no past.
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

export const HOME = { et: '/', en: '/en/' };

export const renderEvents = ({ lang, upcoming, past, origin, path, home = false }) => {
  const t = T[lang];
  const where = home ? HOME : LIST;
  const alternate = { lang: OTHER[lang], href: where[OTHER[lang]] };
  const alternates = [
    { hreflang: 'et', href: origin + where.et },
    { hreflang: 'en', href: origin + where.en },
    { hreflang: 'x-default', href: origin + where.et },
  ];
  const body = html`  <article class="event">
    ${home ? html`<h1 class="list-label">${t.upcoming}</h1>` : html`<h1>${t.events}</h1>`}
    ${upcoming.length ? html`<ol class="events">
    ${upcoming.map((e) => row(e, lang))}
    </ol>` : html`<p class="note">${t.noEvents}</p>`}
    ${past.length && !home ? html`
    <section class="next">
      <h2>${t.past}</h2>
      <ol class="events">
      ${past.map((e) => row(e, lang))}
      </ol>
    </section>` : ''}
  </article>`;
  return page({ lang, title: home ? t.upcoming : t.events, alternate, canonical: origin + path, alternates, body });
};
