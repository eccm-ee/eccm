// admin.mjs: /admin, one card per tool the site has (asked 2026-10-01: "make
// "/admin" page that has cards for Events, Items, Station, Newsletter and
// Design System (anything else i am missing.) 3 col grid"). The five asked
// for, then the two that already existed and had no way in: the newsletter's
// outbox and the type study. /derive, the study the picture detector came
// out of, has no card: the detector runs on upload now (public/scheme.mjs)
// and nobody editing needs the page (asked: "is derive needed as we have
// content done?"). In Estonian, like the
// editor, and open like it: nobody logs in (src/editor.mjs says since when).
import { html } from './html.mjs';
import { page } from './chrome.mjs';

const TOOLS = [
  ['/et/sundmused', 'Sündmused', 'Kõik sündmused. Iga sündmust muudetakse tema enda lehe nupust Muuda.'],
  ['/items', 'Teated', 'Teade telefonidesse kindlal ajal, ja teadete nimekiri.'],
  ['/station', 'Raadio', 'Jaama voog, kava ja otseülekanne.'],
  ['/edit/uudiskiri', 'Uudiskiri', 'Kirjad tellijatele: koosta sündmustest, saada testiks, saada kõigile.'],
  ['/ds', 'Disainisüsteem', 'Kirjad, värvid, logo, komponendid ja sotsiaalmeedia pildid.'],
  ['/edit/uudiskiri/postkast', 'Postkast', 'Iga saadetud ja saatmata kiri.'],
  ['/type', 'Kirjatüübid', 'Kirjatüüpide võrdlus lehe enda suurustes.'],
];

export const renderAdmin = () => page({
  wide: true, lang: 'et', title: 'Haldus.', alternate: { lang: 'en', href: '/en/' },
  body: html`  <h1>Haldus</h1>
  <div class="cards">
    ${TOOLS.map(([href, title, desc]) => html`<a class="card" href="${href}"><span class="card-title">${title}</span><span class="card-desc">${desc}</span></a>`)}
  </div>`,
});
