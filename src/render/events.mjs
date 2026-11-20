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
import { newsColumn } from './news.mjs';
import { table } from './table.mjs';

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
// news editor's list sends them to its form
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

// news: the front page's newest items, drawn beside the events on a desk and under them on a phone
export const renderEvents = ({ lang, upcoming, past, origin, path, home = false, news = [] }) => {
  const t = T[lang];
  const where = home ? HOME : LIST;
  const alternate = { lang: OTHER[lang], href: where[OTHER[lang]] };
  const alternates = [
    { hreflang: 'et', href: origin + where.et },
    { hreflang: 'en', href: origin + where.en },
    { hreflang: 'x-default', href: origin + where.et },
  ];
  const list = upcoming.length ? html`<ol class="events">
    ${upcoming.map((e, i) => row(e, lang, i === 0))}
    </ol>` : html`<p class="note">${t.noEvents}</p>`;
  const body = html`  <article class="event">
    ${home ? html`<h1 class="vh">${t.upcoming}</h1>` : html`<h1>${t.events}</h1>`}
    ${home && news.length ? html`<div class="home">
    <div class="home-events">${list}</div>
    ${newsColumn(news, lang)}
    </div>` : list}
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

// the editor's list at /edit/events (asked 2026-11-20: "perhaps we need a filterable list of events instad of just
// drafts under admin. with dropdowns, more compact listing"), in place of the drafts list of 2026-11-07: one table
// row per event, four dropdowns that send the form on a change, every choice in the address so a view can be kept
// as a link. f: the filters as read (src/editor.mjs eventList); series: every series row; years: the years events
// have. In English like every admin page.
const WHEN = [['upcoming', 'Upcoming'], ['past', 'Past'], ['all', 'All dates']];
const STATUS = [['', 'Any status'], ['draft', 'Draft'], ['published', 'Published']];
const select = (name, label, options, value) => html`<div class="field"><label for="f-${name}">${label}</label><select id="f-${name}" name="${name}">${options.map(([v, l]) => html`<option value="${v}"${String(v) === String(value) ? raw(' selected') : ''}>${l}</option>`)}</select></div>`;
export const renderEventAdmin = ({ rows, f, series, years }) => page({
  wide: true, lang: 'en', title: 'Events.',
  body: html`  <h1>Events</h1>
  <p class="note"><a class="btn" href="/edit/events/new">New event</a></p>
  <form class="form form-wide ev-filter" method="get" action="/edit/events">
    <div class="field-row">
      ${select('when', 'When', WHEN, f.when)}
      ${select('status', 'Status', STATUS, f.status)}
      ${select('series', 'Series', [['', 'Any series']].concat(series.map((r) => [r.key, r.name_en])), f.series)}
      ${select('year', 'Year', [['', 'Any year']].concat(years.map((y) => [y, y])), f.year)}
    </div>
    <noscript><p><button class="btn" type="submit">Show</button></p></noscript>
  </form>
  <script type="module">
    const form = document.querySelector('.ev-filter');
    form.addEventListener('change', () => form.submit());
  </script>
  <p class="note">${rows.length === 1 ? '1 event' : `${rows.length} events`}</p>
  ${rows.length ? table({ label: 'Events', cols: [{ label: 'Date', cls: '' }, { label: 'Title', cls: 'main' }, { label: 'Series', cls: '' }, { label: 'Status', cls: '' }, { label: 'Page', cls: '' }],
    rows: rows.map((e) => [
      html`<time datetime="${e.starts_at}">${dateShort(e.starts_at, 'en')}${hasClock(e.starts_at) ? `, ${clock(e.starts_at, 'en')}` : ''}</time>`,
      html`<a href="/edit/events/${e.id}"${e.tlang !== 'en' ? raw(` lang="${e.tlang}"`) : ''}>${e.title || 'Untitled'}</a>`,
      seriesOf(e, 'en') || e.series,
      e.status === 'published' ? 'Published' : 'Draft',
      e.status === 'published' && e.slug ? html`<a href="${eventPath(e.tlang, e.slug)}">View</a>` : '',
    ]) }) : html`<p class="note">No events.</p>`}`,
});
