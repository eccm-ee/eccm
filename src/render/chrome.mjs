// chrome.mjs: the head, the site header with the mark and the language
// switch, the menu, the footer, and the 404 page, lifted from public/event.html
// as it stands (plans/plan-eccm-cms-step-1.md section 4). Since 2026-09-28
// the five text pages the menu names point here, /et/{slug} and /en/{slug}
// (src/render/page.mjs); Sündmused still points at eccm.ee and moves here
// when the list does. The same hrefs sit in mark.mjs's strings and in every
// static page under public/, changed together.
import { html, raw } from './html.mjs';
import { SYMBOL, HEADER, FOOTER } from './mark.mjs';

export const T = {
  et: {
    menu: 'Menüü', markAlt: 'Eesti nüüdismuusika keskus', upcoming: 'Tulevased üritused', events: 'Sündmused', past: 'Toimunud', noEvents: 'Ühtegi tulevast sündmust ei ole.',
    nav: [['/', 'Avaleht'], ['/et/eccm', 'ECCM'], ['/et/tallinn-1965', 'Tallinn 1965'], ['/et/nan', 'NAN'], ['/et/ulysses', 'Ulysses'], ['/et/konkursid', 'Konkursid'], ['/et/sundmused', 'Sündmused']],
    foot: 'Eesti Nüüdismuusika Keskus, Pühavaimu 9, Tallinn',
    notFound: 'Sellist lehte ei ole.', notFoundLead: 'Aadress võib olla vananenud või valesti kirjutatud.',
    when: 'Millal', where: 'Kus', series: 'Sari', calendar: 'Kalendrisse', ask: 'Küsi', at: 'kell', min: 'min',
    ticket: 'Osta pilet', edit: 'Muuda', credits: 'Tegijad', next: 'Järgmised üritused',
    fallback: 'Sellel lehel ei ole veel eestikeelset versiooni. Järgneb ingliskeelne tekst.',
  },
  en: {
    menu: 'Menu', markAlt: 'Estonian Centre of Contemporary Music', upcoming: 'Upcoming events', events: 'Events', past: 'Past events', noEvents: 'No upcoming events.',
    nav: [['/', 'Home'], ['/en/eccm', 'ECCM'], ['/en/tallinn-1965', 'Tallinn 1965'], ['/en/nan', 'NAN'], ['/en/ulysses', 'Ulysses'], ['/en/open-calls', 'Open calls'], ['/en/events', 'Events']],
    foot: 'Estonian Centre of Contemporary Music, Pühavaimu 9, Tallinn',
    notFound: 'There is no such page.', notFoundLead: 'The address may be out of date or mistyped.',
    when: 'When', where: 'Where', series: 'Series', calendar: 'Add to calendar', ask: 'Ask', at: 'at', min: 'min',
    ticket: 'Buy a ticket', edit: 'Edit', credits: 'Credits', next: 'Next events',
    fallback: 'This page has no English version yet. The Estonian text follows.',
  },
};
export const OTHER = { et: 'en', en: 'et' };
export const LABEL = { et: 'ET', en: 'EN' };

// alternate: { lang, href } for the other language; alternates: the hreflang
// pairs when both texts exist (plans/plan-eccm-event-markup.md section 4)
// notice: one line above main, ruled under, which the editor's preview uses
// to say nothing is saved (src/editor.mjs); absent on every public page
export const page = ({ lang, title, alternate, canonical, alternates, body, notice }) => {
  const t = T[lang];
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
<link rel="stylesheet" href="/eccm.css">
<link rel="preload" href="/vendor/instrument-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/vendor/schibsted-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin>
</head>
<body>
${raw(SYMBOL)}
${raw(alternate ? HEADER[lang].replace(/<a href="[^"]*" lang="(?:en|et)">/g, `<a href="${alternate.href}" hreflang="${alternate.lang}" lang="${alternate.lang}">`) : HEADER[lang])}

${notice ? html`<div class="notice"><p class="frame">${notice}</p></div>` : ''}
<main class="frame">
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
