// events.mjs: the events list, /et/sundmused and /en/events, the one menu
// item that still led to eccm.ee until 2026-09-28 (asked as "do main menu
// pages and make them editable"). The rows are the static front page's list rows
// on the same stylesheet rules: the picture, the kicker with the date twice
// (long and short, the stylesheet shows one), the clock, the place, the
// series when it is not ECCM's own, the title, the first paragraph.
// Published events only; the ones still to come first in date order, then
// the ones that have been, newest first, under their own heading. An event
// with no text in this language shows its Estonian title and links to the
// fallback page, the way an event page's next-events list does. The Muuda
// button under the title leads to the events editor, which is where this
// list is edited; the Add button that led to /edit/events/new went 2026-09-29,
// and the form, back since 2026-11-06, is reached from /admin, so this page
// stays the same for every visitor. With home set it is the English front page at /en/ (asked
// 2026-09-28 with a picture of /en/ answering the 404): the front page's
// heading, the events to come, no button and no past. The Estonian front
// page at / is the same since 2026-10-03, in place of public/index.html.
import { PAGE_TITLES } from '../og/card.mjs';
import { html, raw } from './html.mjs';
import { T, OTHER, page, DESCRIPTION } from './chrome.mjs';
import { dateLong, dateShort, clock, hasClock, mapsUrl } from './dates.mjs';
import { offsetFor, seriesOf } from './event.mjs';
import { listImg } from './pic.mjs';
import { opening } from './lead.mjs';
import { jsonLd, organization } from './ld.mjs';

export const LIST = { et: '/et/sundmused', en: '/en/events' };
const eventPath = (l, slug) => (l === 'et' ? `/et/sundmused/${slug}` : `/en/events/${slug}`);

// the opening of a body as plain text (src/render/lead.mjs: a first line
// repeating the title or saying only when and where is passed over), its
// first sentence when it runs long
const lead = (e, lang) => {
  const plain = opening(e.body, { title: e.title, venue: e.venue, address: e.address, series: seriesOf(e, e.tlang) });
  if (plain.length <= 220) return plain;
  const m = /^(.{40,219}?[.!?])(\s|$)/.exec(plain);
  return m ? m[1] : plain.slice(0, 220).replace(/\s+\S*$/, '') + '…';
};

// href: where the title and the picture lead, the public page unless the
// drafts list below sends them to the editor
export const row = (e, lang, first = false, href = eventPath(e.tlang, e.slug)) => {
  const foreign = e.tlang !== lang ? raw(` lang="${e.tlang}"`) : '';
  const summary = lead(e, lang);
  return html`<li class="ev">
      ${e.pic ? html`<a class="ev-pic" href="${href}" tabindex="-1" aria-hidden="true">${listImg(e.pic, e.width, e.height, first)}</a>` : html`<span class="ev-pic ev-blank" aria-hidden="true"></span>`}
      <div class="ev-body">
        <p class="ev-kicker"><time datetime="${e.starts_at}${offsetFor(e.starts_at)}"><span class="d-long">${dateLong(e.starts_at, lang)}</span><span class="d-short">${dateShort(e.starts_at, lang)}</span></time>${hasClock(e.starts_at) ? html`<time>${clock(e.starts_at, lang)}</time>` : ''}${e.venue ? html`<span><a class="place" href="${mapsUrl(e.venue)}">${e.venue}</a></span>` : ''}${e.series !== 'eccm' && seriesOf(e, lang) ? html`<span>${seriesOf(e, lang)}</span>` : ''}</p>
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
    ${home ? html`<h1 class="vh">${t.upcoming}</h1>` : html`<h1>${t.events}</h1>`}
    ${upcoming.length ? html`<ol class="events">
    ${upcoming.map((e, i) => row(e, lang, i === 0))}
    </ol>` : html`<p class="note">${t.noEvents}</p>`}
    ${past.length && !home ? html`
    <section class="next">
      <h2>${t.past}</h2>
      <ol class="events">
      ${past.map((e) => row(e, lang))}
      </ol>
    </section>` : ''}
  </article>`;
  return page({ lang, title: home ? t.upcoming : t.events, alternate, canonical: origin + path, alternates, body, head: home ? jsonLd(organization(origin, lang)) : null, og: home ? { key: 'home', title: PAGE_TITLES.home[lang] } : { key: 'events', title: PAGE_TITLES.events[lang] }, description: DESCRIPTION[home ? 'home' : 'events'][lang] });
};

// the drafts list at /edit/events/drafts, asked 2026-11-07 as "drafts list.
// re-use events list but with Drafts header and dim them in listing view":
// every event that is not published, in the rows above, each leading to its
// editor because a draft has no public page. Newest first by when it was
// made, so the draft just saved from New event is on top. In English like
// every admin page, and dimmed by the class on the list (public/eccm.css).
export const renderDrafts = ({ drafts }) => page({
  wide: true, lang: 'en', title: 'Drafts.',
  body: html`  <article class="event">
    <h1>Drafts</h1>
    ${drafts.length ? html`<ol class="events events-drafts">
    ${drafts.map((e, i) => row({ ...e, title: e.title || 'Untitled' }, 'en', i === 0, `/edit/events/${e.id}`))}
    </ol>` : html`<p class="note">No drafts.</p>`}
  </article>`,
});
