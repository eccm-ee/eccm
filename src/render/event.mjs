// event.mjs: the event page from rows, the markup of public/event.html as it
// stands with the three changes plans/plan-eccm-event-markup.md section 3
// asks for: the top block is a header, the duration is a time element, and
// a page shown in the other language's chrome carries lang on its text.
import { darkOf } from '../../public/scheme.mjs';
import { html, raw, esc } from './html.mjs';
import { md } from './md.mjs';
import { T, OTHER, page } from './chrome.mjs';
import { dayMonth, whenLine, mapsUrl } from './dates.mjs';
import { poster } from './pic.mjs';
import { jsonLd, organizer } from './ld.mjs';
import { opening, clip } from './lead.mjs';
import { cardInput, cardVersion, cardPath, cardAlt, slideDefaults, slideFields, W as CARD_W, H as CARD_H } from '../og/card.mjs';
import { renderSocial } from './social.mjs';
import { partnerRow } from './partners.mjs';
import { seriesName } from '../series.mjs';

// the Open Graph head of plans/plan-eccm-event-markup.md section 4, with the
// versioned share image of src/og/card.mjs; the description is the body's
// first paragraph as plain text, cut at a word under 155 characters, the one
// page() writes as the meta description too
const SITE_NAME = { et: 'Eesti Nüüdismuusika Keskus', en: 'Estonian Centre of Contemporary Music' };
const LOCALE = { et: 'et_EE', en: 'en_GB' };
const describe = ({ title, body, ev, textLang }) => clip(opening(body, { title, venue: ev.venue, address: ev.address, series: seriesOf(ev, textLang) }));
const ogHead = ({ lang, title, desc, ev, media, origin, canonical, textLang }) => {
  // the same input the card route builds, picture included, so og:image names the hash the route renders and no scraper takes a 302 first
  const input = cardInput({ lang, title, ev, scheme: media && media.scheme, pic: media && media.key });
  const image = origin + cardPath(ev.id, lang, cardVersion(input));
  return html`${eventLd({ lang, title, desc, ev, origin, canonical, image, textLang })}
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${title}">
${desc ? html`<meta property="og:description" content="${desc}">` : ''}
<meta property="og:site_name" content="${SITE_NAME[lang]}">
<meta property="og:locale" content="${LOCALE[lang]}">
<meta property="og:locale:alternate" content="${LOCALE[OTHER[lang]]}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="${CARD_W}">
<meta property="og:image:height" content="${CARD_H}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:alt" content="${cardAlt(input)}">
<meta name="twitter:card" content="summary_large_image">
`;
};

// the MusicEvent of plans/plan-eccm-migration.md (Search basics): the times in Tallinn with their offset, the end
// from ends_at or else from the duration, the share card as its picture, an offer only with a ticket link
const eventLd = ({ lang, title, desc, ev, origin, canonical, image, textLang = lang }) => {
  const endLocal = ev.ends_at || (ev.duration_min ? new Date(new Date(ev.starts_at + ':00Z').getTime() + ev.duration_min * 60000).toISOString().slice(0, 16) : null);
  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: title,
    ...(desc ? { description: desc } : {}),
    url: canonical,
    startDate: `${ev.starts_at}:00${offsetFor(ev.starts_at)}`,
    ...(endLocal ? { endDate: `${endLocal}:00${offsetFor(endLocal)}` } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(ev.venue || ev.address ? { location: { '@type': 'Place', name: ev.venue || ev.address, address: ev.address || ev.venue } } : {}),
    organizer: organizer(origin),
    image: [image],
    ...(ev.ticket_url ? { offers: { '@type': 'Offer', url: ev.ticket_url } } : {}),
    inLanguage: textLang,
  });
};

// the event's series in a language, from the series table (src/series.mjs); a preview of a series typed into the
// form and not yet saved carries its name as series_names, since the table has no row for it yet
export const seriesOf = (ev, lang) => (ev.series_names ? ev.series_names[lang] : seriesName(ev.series, lang));
// 'https://www.ule-heli.ee/' as 'ule-heli.ee', the way the seeded bodies wrote it
const host = (url) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; } };
const CONTACT = { tel: '+37255655596', telText: '5565 5596', site: 'https://eccm.ee', siteText: 'eccm.ee' };

// the Europe/Tallinn offset at a local time, '+03:00' in summer and '+02:00'
// in winter, read from Intl rather than typed; the instant is the local time
// taken as UTC, which is exact except within three hours of a clock change
const fmt = new Intl.DateTimeFormat('en', { timeZone: 'Europe/Tallinn', timeZoneName: 'longOffset' });
export const offsetFor = (local) => {
  const part = fmt.formatToParts(new Date(local + ':00Z')).find((p) => p.type === 'timeZoneName').value; // 'GMT+03:00'
  return part.replace('GMT', '') || '+00:00';
};
const pad = (n) => String(n).padStart(2, '0');
const toUtc = (local, off) => { const sign = off[0] === '-' ? 1 : -1; const [h, m] = off.slice(1).split(':').map(Number); return new Date(new Date(local + ':00Z').getTime() + sign * (h * 60 + m) * 60000); };
const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

// the derived scheme, the flat contract, as the six custom properties on the article
const VARS = { ground: '--ev-ground', ink: '--ev-ink', ink2: '--ev-ink2', accent: '--ev-accent', btnFill: '--ev-btn-fill', onBtn: '--ev-on-btn' };
const schemeStyle = (json) => {
  if (!json) return null;
  let s; try { s = JSON.parse(json); } catch { return null; }
  // a light scheme carries its dark half (public/scheme.mjs darkOf), each colour a light-dark() pair, so the
  // article follows the site's theme; a dark scheme is the picture's dark and stays dark in both
  const dk = s.mode === 'light' && HEX.test(s.ground) ? darkOf(s) : null;
  const val = (k) => (dk && k in dk && s[k] != null ? `light-dark(${s[k]}, ${dk[k] || dk.ink})` : s[k]);
  const decl = Object.entries(VARS).filter(([k]) => val(k) != null).map(([k, v]) => `${v}: ${val(k)}`);
  return { mode: s.mode === 'dark' ? 'dark' : 'light', style: esc(decl.join('; ')) };
};
// a scheme as the editor's browser posts it, kept only when every value is
// one the detector can write, six colours as hex, so nothing a visitor typed
// reaches a style attribute; returns the JSON to store, or null. The face
// fields an editor wrote before 2026-10-07 (archive/serif-titles.md) are
// dropped, and a stored row that still has them renders without them
const HEX = /^#[0-9a-f]{6}$/;
export const cleanScheme = (json) => {
  let s; try { s = JSON.parse(json); } catch { return null; }
  if (!s || typeof s !== 'object' || !Number.isInteger(s.v) || !['light', 'dark'].includes(s.mode)) return null;
  if (!['ground', 'ink', 'ink2', 'btnFill', 'onBtn'].every((k) => HEX.test(s[k])) || !(s.accent === null || HEX.test(s.accent))) return null;
  const { titleFace, titleWeight, bodyFace, serif, ...kept } = s;
  return JSON.stringify(kept);
};

const creditValue = (c, lang) => {
  const people = JSON.parse(c.people || '[]').map((p) => p.name + (p.note && p.note[lang] ? ` (${p.note[lang]})` : ''));
  const orgs = JSON.parse(c.orgs || '[]').map((o) => o[lang] || o.et);
  return people.concat(orgs).join(', ');
};
const creditLabel = (c, lang) => c[`role_${lang}`] || c[`label_${lang}`] || c.role_et || c.label_et || '';

// editHref: where the edit button goes, the row's own editor page unless the
// caller says otherwise (a preview of an unsaved event); notice: chrome.mjs;
// editor: a logged-in editor is looking (src/auth.mjs loggedIn), the only one shown the edit button;
// social: { row } for a logged-in editor on the published page, its social previews under the article
// (src/render/social.mjs), row being the fourth Instagram card's stored words or null
// partners: the logos the event chose in this language, each with its version (src/partners.mjs eventPartners)
export const renderEvent = ({ lang, text, fallback, ev, media, credits, twin, next, origin, path, notice, editHref, editor = false, social = null, partners = [] }) => {
  const t = T[lang];
  const textLang = fallback ? 'et' : lang;             // the language the text row is in
  const off = offsetFor(ev.starts_at);
  const start = toUtc(ev.starts_at, off);
  const end = ev.ends_at ? toUtc(ev.ends_at, offsetFor(ev.ends_at)) : new Date(start.getTime() + (ev.duration_min || 60) * 60000);
  const where = [ev.venue, ev.address].filter(Boolean).join(', ');
  const title = text.title;
  const gcal = `https://www.google.com/calendar/event?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${stamp(start)}%2F${stamp(end)}&location=${encodeURIComponent(where)}`;
  const outlook = `https://outlook.live.com/calendar/0/deeplink/compose?rru=addevent&path=%2Fcalendar%2Faction%2Fcompose&startdt=${encodeURIComponent(ev.starts_at + ':00')}&enddt=${encodeURIComponent(end.toISOString().slice(0, 19))}&subject=${encodeURIComponent(title)}&location=${encodeURIComponent(where)}`;
  const design = credits.find((c) => c.role_key === 'graphic-design');
  const scheme = schemeStyle(media && media.scheme);
  const eventPath = (l, slug) => (l === 'et' ? `/et/sundmused/${slug}` : `/en/events/${slug}`);
  const alternate = { lang: OTHER[lang], href: twin ? eventPath(OTHER[lang], twin.slug) : eventPath(OTHER[lang], text.slug) };
  const alternates = twin && !fallback ? [
    { hreflang: 'et', href: origin + (lang === 'et' ? path : alternate.href) },
    { hreflang: 'en', href: origin + (lang === 'en' ? path : alternate.href) },
    { hreflang: 'x-default', href: origin + (lang === 'et' ? path : alternate.href) },
  ] : [];
  const canonical = origin + (fallback ? eventPath('et', text.slug) : path);
  // the poster is the page's LCP, so it is asked for before the stylesheet finds it
  // (asked 2026-09-30: "i saw font change jump ... can we optimize / preload?")
  const pic = media ? poster(media, media[`alt_${lang}`] || media.alt_et) : null;
  const description = describe({ title, body: text.body, ev, textLang });
  const head = html`${ogHead({ lang, title, desc: description, ev, media, origin, canonical, textLang })}${pic ? pic.preload : ''}`;

  const body = html`  <article class="event"${scheme ? raw(` data-scheme="${scheme.mode}" style="${scheme.style}"`) : ''}>
    <header class="event-top">
      <div class="event-lead">
        <p class="crumb"><a href="/">${t.upcoming}</a></p>
        ${fallback ? html`<p class="small">${t.fallback}</p>` : ''}
        <h1 lang="${textLang}">${title}</h1>
        <dl class="facts">
          <div><dt>${t.when}</dt><dd><time datetime="${ev.starts_at}${off}">${whenLine(ev.starts_at, ev.ends_at, lang)}</time>${ev.duration_min ? html`, <time datetime="PT${ev.duration_min}M">${ev.duration_min} ${t.min}</time>` : ''}</dd></div>
          ${where ? html`<div><dt>${t.where}</dt><dd><a class="place" href="${mapsUrl(where)}">${where}</a></dd></div>` : ''}
          ${ev.series !== 'eccm' && seriesOf(ev, lang) ? html`<div><dt>${t.series}</dt><dd>${seriesOf(ev, lang)}</dd></div>` : ''}
          ${ev.website_url ? html`<div><dt>${t.website}</dt><dd><a href="${ev.website_url}">${host(ev.website_url)}</a></dd></div>` : ''}
          <div><dt>${t.calendar}</dt><dd><a href="${gcal}">Google</a> <a href="${outlook}">Outlook</a> <a href="${eventPath(textLang, text.slug)}.ics">iCal</a></dd></div>
          <div><dt>${t.ask}</dt><dd><a href="tel:${CONTACT.tel}">${CONTACT.telText}</a>, <a href="${CONTACT.site}">${CONTACT.siteText}</a></dd></div>
        </dl>
        <p class="event-actions">
          ${ev.ticket_url ? html`<a class="btn btn-pri" href="${ev.ticket_url}">${t.ticket}</a>` : ''}
          ${editor ? html`<a class="btn" href="${editHref || `/edit/events/${ev.id}`}">${t.edit}</a>` : ''}
        </p>
      </div>
      ${media ? html`<figure class="event-pic">
        ${pic.img}
        ${design ? html`<figcaption>${creditLabel(design, lang)} ${creditValue(design, lang)}</figcaption>` : ''}
      </figure>` : ''}
    </header>

    <div class="prose flow" lang="${textLang}">
      ${raw(md(text.body, { video: true }))}
      ${credits.length ? html`
      <h2 lang="${lang}">${t.credits}</h2>
      <dl class="credits" lang="${lang}">
        ${credits.map((c) => html`<div><dt>${creditLabel(c, lang)}</dt><dd>${creditValue(c, lang)}</dd></div>`)}
      </dl>` : ''}
      ${partnerRow(partners, lang)}
    </div>
    ${next.length ? html`
    <section class="next">
      <h2>${t.next}</h2>
      <ol class="next-list">
        ${next.map((n) => html`<li><time datetime="${n.starts_at}${offsetFor(n.starts_at)}">${dayMonth(n.starts_at, lang)}</time><span><a href="${eventPath(n.tlang, n.slug)}"${n.tlang !== lang ? raw(` lang="${n.tlang}"`) : ''}>${n.title}</a>${n.venue ? html`<small>${n.venue}</small>` : ''}</span></li>`)}
      </ol>
    </section>` : ''}
  </article>${social ? renderSocial({
    id: ev.id, lang, slug: text.slug, path, stored: !!social.row,
    input: cardInput({ lang, title, ev, scheme: media && media.scheme, pic: media && media.key }),
    fields: slideFields(social.row, slideDefaults({ title, body: text.body, ev, series: seriesOf(ev, lang) })),
  }) : ''}`;
  return page({ lang, title, alternate, canonical, alternates, body, notice, head, description });
};
