// chrome.mjs: the head, the site header with the mark and the language
// switch, the menu, the footer, and the 404 page, lifted from public/event.html
// as it stands (plans/plan-eccm-cms-step-1.md section 4). Since 2026-09-28
// the five text pages the menu names point here, /et/{slug} and /en/{slug}
// (src/render/page.mjs); Sündmused still points at eccm.ee and moves here
// when the list does. The same hrefs sit in mark.mjs's strings and in every
// static page under public/, changed together.
import { html, raw } from './html.mjs';
import { SYMBOL, HEADER, FOOTER } from './mark.mjs';
import { sitePath, siteAlt, pagePath, W as OG_W, H as OG_H } from '../og/card.mjs';

// the request's origin, set once per request by src/index.mjs, for the absolute
// address a share image needs
let ORIGIN = '';
export const useOrigin = (o) => { ORIGIN = o; };
export const origin = () => ORIGIN;
// every page that names no share image of its own names the site's card, the
// logo (asked 2026-10-01: "make eccm default social card", "just original
// logo"): a link to such a page used to preview as whatever picture a scraper
// found, a crop of the footer's ULYSSES mark
// og: { key, title, lang } names the page's own card (src/og/card.mjs, pageInput), the site card otherwise; lang
// is the card's when it differs from the page's, a text page shown in its other language
const siteOg = (lang, title, og) => html`<meta property="og:type" content="website">
<meta property="og:site_name" content="ECCM">
<meta property="og:title" content="${title}">
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
    when: 'Millal', where: 'Kus', series: 'Sari', calendar: 'Kalendrisse', ask: 'Küsi', at: 'kell', min: 'min',
    ticket: 'Osta pilet', edit: 'Muuda', credits: 'Tegijad', next: 'Järgmised üritused',
    fallback: 'Sellel lehel ei ole veel eestikeelset versiooni. Järgneb ingliskeelne tekst.',
  },
  en: {
    menu: 'Menu', markAlt: 'Estonian Centre of Contemporary Music', upcoming: 'Upcoming events', events: 'Events', past: 'Past events', noEvents: 'No upcoming events.',
    nav: [['/en/', 'Events'], ['/en/eccm', 'ECCM'], ['/en/tallinn-1965', 'Tallinn 1965'], ['/en/nan', 'NAN'], ['/en/ulysses', 'Ulysses'], ['/en/open-calls', 'Open calls']],
    foot: 'Estonian Centre of Contemporary Music, Pühavaimu 9, Tallinn',
    notFound: 'There is no such page.', notFoundLead: 'The address may be out of date or mistyped.',
    when: 'When', where: 'Where', series: 'Series', calendar: 'Add to calendar', ask: 'Ask', at: 'at', min: 'min',
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
// head: preloads the page itself knows it needs, the event's poster and the
// serif its scheme sets (src/render/pic.mjs, src/render/event.mjs)
// wide: a tool page (asked 2026-10-01: "admin pages full w"), its forms, tables and grids over the whole frame
export const page = ({ lang, title, alternate, canonical, alternates, body, notice, head, wide, og }) => {
  const t = T[lang];
  // every tool page leads back to /admin (asked 2026-10-01: "all admin pages should have upper link back to
  // /admin"): in front of the page's own crumb when it has one, as a crumb of its own when not; /admin
  // itself passes wide: 'root' and gets none
  if (wide === true) {
    // the tool pages are in English since 2026-10-02 ("convert all admin pages to english only")
    const b = String(body), back = `<a href="/admin">${lang === 'en' ? 'Admin' : 'Haldus'}</a>`;
    body = raw(b.includes('<p class="crumb">') ? b.replace('<p class="crumb">', `<p class="crumb">${back}<span class="crumb-sep" aria-hidden="true">/</span>`) : `  <p class="crumb">${back}</p>\n${b}`);
  }
  return html`<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title} ECCM</title>
${canonical ? html`<link rel="canonical" href="${canonical}">` : ''}
${(alternates || []).map((a) => html`<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}">`)}
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
${head || ''}
${String(head || '').includes('og:image') ? '' : siteOg(lang, `${title} ECCM`, og)}
</head>
<body>
${raw(SYMBOL)}
${raw(alternate ? HEADER[lang].replace(/<a href="[^"]*" lang="(?:en|et)">/g, `<a href="${alternate.href}" hreflang="${alternate.lang}" lang="${alternate.lang}">`) : HEADER[lang])}

${notice ? html`<div class="notice"><p class="frame">${notice}</p></div>` : ''}
<main class="frame${wide ? ' admin' : ''}">
${body}
</main>

${raw(FOOTER[lang])}
<script type="module" src="/site.mjs"></script>
</body>
</html>
`;
};

export const notFound = (lang, path) => page({
  lang, title: T[lang].notFound, alternate: { lang: OTHER[lang], href: `/${OTHER[lang]}/` },
  body: html`  <article class="event"><h1>${T[lang].notFound}</h1><p class="prose">${T[lang].notFoundLead} <code>${path}</code></p></article>`,
});
