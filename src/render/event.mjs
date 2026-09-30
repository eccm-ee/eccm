// event.mjs: the event page from rows, the markup of public/event.html as it
// stands with the three changes plans/plan-eccm-event-markup.md section 3
// asks for: the top block is a header, the duration is a time element, and
// a page shown in the other language's chrome carries lang on its text.
import { html, raw, esc } from './html.mjs';
import { md } from './md.mjs';
import { T, OTHER, page } from './chrome.mjs';
import { dateLong, dayMonth, clock, mapsUrl } from './dates.mjs';
import { poster } from './pic.mjs';

export const CATEGORY = {
  eccm: { et: 'ECCM', en: 'ECCM' }, koostoo: { et: 'Koostöö', en: 'Collaboration' }, improtest: { et: 'Improtest', en: 'Improtest' },
  schoenberg: { et: 'Schönbergi sari', en: 'Schönberg series' }, ulysses: { et: 'Ulysses', en: 'Ulysses' }, u: { et: 'U:', en: 'U:' },
};
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

// the derived scheme, the flat contract, as the nine custom properties on the article
const VARS = { ground: '--ev-ground', ink: '--ev-ink', ink2: '--ev-ink2', accent: '--ev-accent', btnFill: '--ev-btn-fill', onBtn: '--ev-on-btn', titleFace: '--ev-title-face', titleWeight: '--ev-title-weight', bodyFace: '--ev-body-face' };
const schemeStyle = (json) => {
  if (!json) return null;
  let s; try { s = JSON.parse(json); } catch { return null; }
  const decl = Object.entries(VARS).filter(([k]) => s[k] != null).map(([k, v]) => `${v}: ${s[k]}`);
  return { mode: s.mode === 'dark' ? 'dark' : 'light', style: esc(decl.join('; ')), serif: !!(s.titleFace || s.bodyFace) };
};
// a scheme as the editor's browser posts it, kept only when every value is
// one the detector can write: six colours as hex, the faces from
// public/scheme.mjs's SERIFS, so nothing a visitor typed reaches a style
// attribute; returns the JSON to store, or null
const HEX = /^#[0-9a-f]{6}$/;
const FACES = ["'Newsreader', 'Newsreader Fallback', Georgia, serif", "'Literata', Georgia, serif", "'Roboto Serif', Georgia, serif"];
export const cleanScheme = (json) => {
  let s; try { s = JSON.parse(json); } catch { return null; }
  if (!s || typeof s !== 'object' || !Number.isInteger(s.v) || !['light', 'dark'].includes(s.mode)) return null;
  if (!['ground', 'ink', 'ink2', 'btnFill', 'onBtn'].every((k) => HEX.test(s[k])) || !(s.accent === null || HEX.test(s.accent))) return null;
  if (![s.titleFace, s.bodyFace].every((f) => f === null || FACES.includes(f)) || !(s.titleWeight === null || /^\d{3}$/.test(s.titleWeight))) return null;
  return JSON.stringify(s);
};

const creditValue = (c, lang) => {
  const people = JSON.parse(c.people || '[]').map((p) => p.name + (p.note && p.note[lang] ? ` (${p.note[lang]})` : ''));
  const orgs = JSON.parse(c.orgs || '[]').map((o) => o[lang] || o.et);
  return people.concat(orgs).join(', ');
};
const creditLabel = (c, lang) => c[`role_${lang}`] || c[`label_${lang}`] || c.role_et || c.label_et || '';

// editHref: where the edit button goes, the row's own editor page unless the
// caller says otherwise (a preview of an unsaved event); notice: chrome.mjs
export const renderEvent = ({ lang, text, fallback, ev, media, credits, twin, next, origin, path, notice, editHref }) => {
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
  // the poster is the page's LCP and the serif, when the scheme sets one, is
  // most of its text, so both are asked for before the stylesheet finds them
  // (asked 2026-09-30: "i saw font change jump ... can we optimize / preload?")
  const pic = media ? poster(media, media[`alt_${lang}`] || media.alt_et) : null;
  const head = html`${pic ? pic.preload : ''}${scheme && scheme.serif ? html`<link rel="preload" href="/vendor/newsreader-latin.woff2" as="font" type="font/woff2" crossorigin>` : ''}`;

  const body = html`  <article class="event"${scheme ? raw(` data-scheme="${scheme.mode}" style="${scheme.style}"`) : ''}>
    <header class="event-top">
      <div class="event-lead">
        <p class="crumb"><a href="/">${t.upcoming}</a></p>
        ${fallback ? html`<p class="small">${t.fallback}</p>` : ''}
        <h1 lang="${textLang}">${title}</h1>
        <dl class="facts">
          <div><dt>${t.when}</dt><dd><time datetime="${ev.starts_at}${off}">${dateLong(ev.starts_at, lang)} ${t.at} ${clock(ev.starts_at, lang)}</time>${ev.duration_min ? html`, <time datetime="PT${ev.duration_min}M">${ev.duration_min} ${t.min}</time>` : ''}</dd></div>
          <div><dt>${t.where}</dt><dd><a class="place" href="${mapsUrl(where)}">${where}</a></dd></div>
          ${ev.category !== 'eccm' ? html`<div><dt>${t.series}</dt><dd>${CATEGORY[ev.category][lang]}</dd></div>` : ''}
          <div><dt>${t.calendar}</dt><dd><a href="${gcal}">Google</a> <a href="${outlook}">Outlook</a></dd></div>
          <div><dt>${t.ask}</dt><dd><a href="tel:${CONTACT.tel}">${CONTACT.telText}</a>, <a href="${CONTACT.site}">${CONTACT.siteText}</a></dd></div>
        </dl>
        <p class="event-actions">
          ${ev.ticket_url ? html`<a class="btn btn-pri" href="${ev.ticket_url}">${t.ticket}</a>` : ''}
          <a class="btn" href="${editHref || `/edit/events/${ev.id}`}">${t.edit}</a>
        </p>
      </div>
      ${media ? html`<figure class="event-pic">
        ${pic.img}
        ${design ? html`<figcaption>${creditLabel(design, lang)} ${creditValue(design, lang)}</figcaption>` : ''}
      </figure>` : ''}
    </header>

    <div class="prose flow" lang="${textLang}">
      ${raw(md(text.body))}
      ${credits.length ? html`
      <h2 lang="${lang}">${t.credits}</h2>
      <dl class="credits" lang="${lang}">
        ${credits.map((c) => html`<div><dt>${creditLabel(c, lang)}</dt><dd>${creditValue(c, lang)}</dd></div>`)}
      </dl>` : ''}
    </div>
    ${next.length ? html`
    <section class="next">
      <h2>${t.next}</h2>
      <ol class="next-list">
        ${next.map((n) => html`<li><time datetime="${n.starts_at}${offsetFor(n.starts_at)}">${dayMonth(n.starts_at, lang)}</time><span><a href="${eventPath(n.tlang, n.slug)}"${n.tlang !== lang ? raw(` lang="${n.tlang}"`) : ''}>${n.title}</a><small>${n.venue}</small></span></li>`)}
      </ol>
    </section>` : ''}
  </article>`;
  return page({ lang, title, alternate, canonical, alternates, body, notice, head });
};
