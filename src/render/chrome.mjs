// chrome.mjs: the head, the site header with the mark and the language
// switch, the menu, the footer, and the 404 page, lifted from public/event.html
// as it stands (plans/plan-eccm-cms-step-1.md section 4). Since 2026-09-28
// the five text pages the menu names point here, /et/{slug} and /en/{slug}
// (src/render/page.mjs); Sündmused still points at eccm.ee and moves here
// when the list does. The same hrefs sit in mark.mjs's strings and in every
// static page under public/, changed together.
import { html, raw, esc } from './html.mjs';
import { SYMBOL, HEADER, FOOTER } from './mark.mjs';
import { sitePath, siteAlt, pagePath, W as OG_W, H as OG_H } from '../og/card.mjs';
import { footerPartners } from './partners.mjs';

// the site's own origin, SITE_ORIGIN or else the request's, set once per request by src/index.mjs,
// for the absolute address a share image needs
let ORIGIN = '';
export const useOrigin = (o) => { ORIGIN = o; };
export const origin = () => ORIGIN;
// the footer's logos, the partner rows the Layout page flags, set once per request by src/partners.mjs loadFooter
// (asked 2026-11-07: "footer logos should use same system"); null keeps the marks typed into mark.mjs's FOOTER
let FOOT = null;
export const useFooter = (rows) => { FOOT = rows; };
// the menu's pages, the page rows the Layout page ticks, set once per request by src/layout.mjs loadLayout (asked
// 2026-11-07: "perhaps a Admin > Layout where you can pick what pages to link"); null keeps mark.mjs's menu.
// Events first, then each page under its menu words or its title, at its slug in this language or the other's
let NAV = null;
export const useNav = (rows) => { NAV = rows; };
const navItems = (lang) => [[lang === 'et' ? '/' : '/en/', T[lang].events]].concat(NAV.map((p) => [`/${lang}/${p[`slug_${lang}`] || p[`slug_${OTHER[lang]}`]}`, p[`menu_title_${lang}`] || p[`title_${lang}`] || p[`title_${OTHER[lang]}`]]));
const navLis = (lang) => navItems(lang).map(([href, label]) => `<li><a href="${esc(href)}">${esc(label)}</a></li>`).join('');
const header = (lang) => (NAV ? HEADER[lang].replace(/(<ul class="nav">)[\s\S]*?(<li class="lang-in">)/, (m, a, b) => a + navLis(lang) + b) : HEADER[lang]);
const footer = (lang) => {
  let f = FOOT ? FOOTER[lang].replace(/<div class="end">[\s\S]*?<\/div>\n  <\/div><\/div>/, () => `${footerPartners(FOOT, lang)}\n  </div></div>`) : FOOTER[lang];
  // the footer's list of links is the menu's
  if (NAV) f = f.replace(/(<ul class="two">)[\s\S]*?(<\/ul>)/, (m, a, b) => a + navLis(lang) + b);
  return f;
};
// every page that names no share image of its own names the site's card, the
// logo (asked 2026-10-01: "make eccm default social card", "just original
// logo"): a link to such a page used to preview as whatever picture a scraper
// found, a crop of the footer's ULYSSES mark
// admin pages (every wide page) name none, so a shared link to a tool shows its title alone
// (asked 2026-10-09: "lets not have them for amdin and docs")
// og: { key, title, lang } names the page's own card (src/og/card.mjs, pageInput), the site card otherwise; lang
// is the card's when it differs from the page's, a text page shown in its other language
const siteOg = (lang, title, og, canonical, description) => html`<meta property="og:type" content="website">
${canonical ? html`<meta property="og:url" content="${canonical}">` : ''}
<meta property="og:site_name" content="ECCM">
<meta property="og:title" content="${title}">
${description ? html`<meta property="og:description" content="${description}">` : ''}
<meta property="og:image" content="${ORIGIN + (og ? pagePath(og.key, og.lang || lang) : sitePath(lang))}">
<meta property="og:image:width" content="${OG_W}">
<meta property="og:image:height" content="${OG_H}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:alt" content="${og ? og.title : siteAlt(lang)}">
<meta name="twitter:card" content="summary_large_image">`;

export const T = {
  et: {
    menu: 'Menüü', markAlt: 'Eesti nüüdismuusika keskus', upcoming: 'Tulevased üritused', events: 'Sündmused', past: 'Toimunud', noEvents: 'Ühtegi tulevast sündmust ei ole.',
    nav: [['/', 'Sündmused'], ['/et/eccm', 'ECCM'], ['/et/tallinn-1965', 'Tallinn 1965'], ['/et/nan', 'NAN'], ['/et/ulysses', 'Ulysses'], ['/et/konkursid', 'Konkursid']],
    foot: 'Eesti Nüüdismuusika Keskus, Pühavaimu 9, Tallinn',
    notFound: 'Sellist lehte ei ole.', notFoundLead: 'Aadress võib olla vananenud või valesti kirjutatud.',
    when: 'Millal', where: 'Kus', series: 'Sari', website: 'Koduleht', calendar: 'Kalendrisse', ask: 'Küsi', at: 'kell', min: 'min',
    ticket: 'Osta pilet', edit: 'Muuda', credits: 'Tegijad', next: 'Järgmised üritused',
    fallback: 'Sellel lehel ei ole veel eestikeelset versiooni. Järgneb ingliskeelne tekst.',
  },
  en: {
    menu: 'Menu', markAlt: 'Estonian Centre of Contemporary Music', upcoming: 'Upcoming events', events: 'Events', past: 'Past events', noEvents: 'No upcoming events.',
    nav: [['/en/', 'Events'], ['/en/eccm', 'ECCM'], ['/en/tallinn-1965', 'Tallinn 1965'], ['/en/nan', 'NAN'], ['/en/ulysses', 'Ulysses'], ['/en/open-calls', 'Open calls']],
    foot: 'Estonian Centre of Contemporary Music, Pühavaimu 9, Tallinn',
    notFound: 'There is no such page.', notFoundLead: 'The address may be out of date or mistyped.',
    when: 'When', where: 'Where', series: 'Series', website: 'Website', calendar: 'Add to calendar', ask: 'Ask', at: 'at', min: 'min',
    ticket: 'Buy a ticket', edit: 'Edit', credits: 'Credits', next: 'Next events',
    fallback: 'This page has no English version yet. The Estonian text follows.',
  },
};
// the stored theme onto <html> before the stylesheet arrives, so a page kept Dark never paints white first:
// tunniplaan's head line with eccm's key, the same in every static page under public/. Nothing stored is Auto,
// the system's own setting (public/site.mjs, asked 2026-10-02: "do dark mode in bg. see ../tunniplaan etc")
export const THEME_HEAD = '<script>try{var t=localStorage.getItem("eccm:theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}</script>';
export const OTHER = { et: 'en', en: 'et' };
export const LABEL = { et: 'ET', en: 'EN' };

// alternate: { lang, href } for the other language; alternates: the hreflang
// pairs when both texts exist (plans/plan-eccm-event-markup.md section 4)
// notice: one line above main, ruled under, which the editor's preview uses
// to say nothing is saved (src/editor.mjs); absent on every public page
// the two latin subsets every page draws, the headings' Instrument Sans and the body's Public Sans, are preloaded so
// neither waits for the stylesheet before its request (the body's since 2026-11-06, Lighthouse's Speed Index)
// head: preloads the page itself knows it needs, the event's poster
// (src/render/pic.mjs, src/render/event.mjs)
// wide: a tool page (asked 2026-10-01: "admin pages full w"), its forms, tables and grids over the whole frame
// the RSS feed and the calendar in every public page's head, so a feed reader or a browser finds them from any page
// (asked 2026-11-06: "we have rss right?", then "add to head"); not on admin and tool pages
const FEED_TITLE = { et: 'ECCM sündmused', en: 'ECCM events' };
const CAL_TITLE = { et: 'ECCM sündmuste kalender', en: 'ECCM events calendar' };
const CAL = { et: '/et/sundmused.ics', en: '/en/events.ics' };
// description: one sentence in the page's language for a search result and a share preview, the meta description
// and the site card's og:description (asked 2026-11-06, Lighthouse's SEO); a page whose head names its own share
// image writes its own og:description (src/render/event.mjs); never on admin and tool pages
export const DESCRIPTION = {
  home: {
    et: 'Eesti Nüüdismuusika Keskus on Tallinnas tegutsev platvorm ja tugi nüüdismuusika valdkonna uuenemiseks ja arenguks.',
    en: 'The Estonian Centre of Contemporary Music in Tallinn coordinates and develops contemporary and experimental music in Estonia.',
  },
  events: {
    et: 'Eesti Nüüdismuusika Keskuse tulevased ja toimunud kontserdid ning muud sündmused.',
    en: 'Upcoming and past concerts and other events of the Estonian Centre of Contemporary Music.',
  },
  newsletter: {
    et: 'Eesti Nüüdismuusika Keskuse kava ja uudised e-postiga, koos varasemate kirjadega.',
    en: 'The programme and news of the Estonian Centre of Contemporary Music by email, with the earlier letters.',
  },
  contact: {
    et: 'Kirjuta või helista Eesti Nüüdismuusika Keskusele Pühavaimu 9, Tallinn.',
    en: 'Write to or call the Estonian Centre of Contemporary Music at Pühavaimu 9, Tallinn.',
  },
  login: {
    et: 'Eesti Nüüdismuusika Keskuse toimetajate sisselogimine.',
    en: 'The login for editors of the Estonian Centre of Contemporary Music.',
  },
};
export const page = ({ lang, title, alternate, canonical, alternates, body, notice, head, wide, og, description }) => {
  if (wide) description = '';
  const t = T[lang];
  // every tool page leads back to /admin (asked 2026-10-01: "all admin pages should have upper link back to
  // /admin"): in front of the page's own crumb when it has one, as a crumb of its own when not; /admin
  // itself passes wide: 'root' and gets none
  if (wide === true) {
    // the tool pages are in English since 2026-10-02 ("convert all admin pages to english only")
    // a trail since 2026-10-02 ("make preoper breadcumb ... add more space below it in desktop. make it dark"):
    // Admin, the page's own parent crumb when it brings one, then the page itself, unlinked and marked current
    const b = String(body), back = `<a href="/admin">${lang === 'en' ? 'Admin' : 'Haldus'}</a>`, sep = '<span class="crumb-sep" aria-hidden="true">/</span>';
    const here = `${sep}<span aria-current="page">${esc(String(title).replace(/\.$/, ''))}</span>`;
    body = raw(b.includes('<p class="crumb">')
      ? b.replace(/<p class="crumb">([\s\S]*?)<\/p>/, (m, inner) => `<p class="crumb crumb-trail">${back}${sep}${inner}${here}</p>`)
      : `  <p class="crumb crumb-trail">${back}${here}</p>\n${b}`);
  }
  return html`<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} ECCM</title>
${description ? html`<meta name="description" content="${description}">` : ''}
${canonical ? html`<link rel="canonical" href="${canonical}">` : ''}
${(alternates || []).map((a) => html`<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}">`)}
${wide ? '' : html`<link rel="alternate" type="application/rss+xml" title="${FEED_TITLE[lang]}" href="/${lang}/feed.xml">
<link rel="alternate" type="text/calendar" title="${CAL_TITLE[lang]}" href="${CAL[lang]}">`}
<link rel="icon" href="/icons/logo-square-bold.svg" type="image/svg+xml">
<link rel="icon" href="/icons/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="apple-touch-icon" href="/icons/icon-180.png">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="ECCM">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)">
${raw(THEME_HEAD)}
<link rel="stylesheet" href="/eccm.css">
<link rel="preload" href="/vendor/instrument-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/vendor/public-sans/latin.woff2" as="font" type="font/woff2" crossorigin>
${head || ''}
${wide || String(head || '').includes('og:image') ? '' : siteOg(lang, `${title} ECCM`, og, canonical, description)}
</head>
<body>
${raw(SYMBOL)}
${raw(alternate ? header(lang).replace(/<a href="[^"]*" lang="(?:en|et)">/g, `<a href="${alternate.href}" hreflang="${alternate.lang}" lang="${alternate.lang}">`) : header(lang))}

${notice ? html`<div class="notice"><p class="frame">${notice}</p></div>` : ''}
<main class="frame${wide ? ' admin' : ''}">
${body}
</main>

${raw(footer(lang))}
<script type="module" src="/site.mjs"></script>
</body>
</html>
`;
};

export const notFound = (lang, path) => page({
  lang, title: T[lang].notFound, alternate: { lang: OTHER[lang], href: `/${OTHER[lang]}/` },
  body: html`  <article class="event"><h1>${T[lang].notFound}</h1><p class="prose">${T[lang].notFoundLead} <code>${path}</code></p></article>`,
});
