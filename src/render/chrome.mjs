// chrome.mjs: the head, the site header with the mark and the language
// switch, the menu, the footer, and the 404 page, lifted from public/event.html
// as it stands (plans/plan-eccm-cms-step-1.md section 4). The menu still
// points at eccm.ee for the pages this site does not render yet; each link
// moves here when its page does.
import { html, raw } from './html.mjs';

export const T = {
  et: {
    menu: 'Menüü', markAlt: 'ECCM, Eesti Nüüdismuusika Keskus', upcoming: 'Tulevased üritused',
    nav: [['/', 'Avaleht'], ['https://eccm.ee/index.php/et/eccm', 'ECCM'], ['https://eccm.ee/index.php/et/tallinn-1965', 'Tallinn 1965'], ['https://eccm.ee/nan/', 'NAN'], ['https://eccm.ee/index.php/et/ulysses', 'Ulysses'], ['https://eccm.ee/index.php/et/konkursid', 'Konkursid'], ['https://eccm.ee/index.php/et/syndmusest', 'Sündmused']],
    foot: 'Eesti Nüüdismuusika Keskus, Pühavaimu 9, Tallinn',
    notFound: 'Sellist lehte ei ole.', notFoundLead: 'Aadress võib olla vananenud või valesti kirjutatud.',
    when: 'Millal', where: 'Kus', series: 'Sari', calendar: 'Kalendrisse', ask: 'Küsi', at: 'kell', min: 'min',
    ticket: 'Osta pilet', edit: 'Muuda', credits: 'Tegijad', next: 'Järgmised üritused',
    fallback: null,
  },
  en: {
    menu: 'Menu', markAlt: 'ECCM, Estonian Centre of Contemporary Music', upcoming: 'Upcoming events',
    nav: [['/', 'Home'], ['https://eccm.ee/index.php/en/eccm-new-eng', 'ECCM'], ['https://eccm.ee/index.php/en/tallinn-1965-eng', 'Tallinn 1965'], ['https://eccm.ee/nan/', 'NAN'], ['https://eccm.ee/index.php/en/ulysses-eng', 'Ulysses'], ['https://eccm.ee/index.php/en/open-calls', 'Open calls'], ['https://eccm.ee/index.php/en/eventseng', 'Events']],
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
export const page = ({ lang, title, alternate, canonical, alternates, body }) => {
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
<link rel="icon" href="/icons/logo-square.svg" type="image/svg+xml">
<link rel="icon" href="/icons/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="apple-touch-icon" href="/icons/icon-180.png">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="stylesheet" href="/eccm.css">
</head>
<body>
<header class="site-head">
  <div class="frame">
    <a class="mark" href="/"><img src="/logo-${lang}.svg" width="310" height="133" alt="${t.markAlt}"></a>
    <span class="lang"><span aria-current="page" lang="${lang}">${LABEL[lang]}</span><a href="${alternate.href}" hreflang="${alternate.lang}" lang="${alternate.lang}">${LABEL[alternate.lang]}</a></span>
  </div>
</header>
<nav class="site-nav" aria-label="${t.menu}">
  <div class="frame">
    <ul class="nav">
      ${t.nav.map(([href, label]) => html`<li><a href="${href}">${label}</a></li>`)}
    </ul>
  </div>
</nav>

<main class="frame">
${body}
</main>

<footer class="frame site-foot">
  <span>${t.foot}</span>
</footer>
</body>
</html>
`;
};

export const notFound = (lang, path) => page({
  lang, title: T[lang].notFound, alternate: { lang: OTHER[lang], href: `/${OTHER[lang]}/` },
  body: html`  <article class="event"><h1>${T[lang].notFound}</h1><p class="prose">${T[lang].notFoundLead} <code>${path}</code></p></article>`,
});
