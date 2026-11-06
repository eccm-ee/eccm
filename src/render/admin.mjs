// admin.mjs: /admin, one card per tool the site has (asked 2026-10-01: "make
// "/admin" page that has cards for Events, Items, Station, Newsletter and
// Design System (anything else i am missing.) 3 col grid"). The five asked
// for, then the type study, which had no way in. The newsletter's outbox is
// reached from the newsletter's own page (asked: "rm postkart from admin top
// level"). /derive, the study the picture detector came
// out of, has no card: the detector runs on upload now (public/scheme.mjs)
// and nobody editing needs the page (asked: "is derive needed as we have
// content done?"). In Estonian, like the
// editor, and open like it: nobody logs in (src/editor.mjs says since when).
import { html } from './html.mjs';
import { page } from './chrome.mjs';

// in English since 2026-10-02 ("convert all admin pages to english only"), and the type study moved under
// Research the same day with the radio tools ("in admin page to reseach card link"), and the design system is
// three cards since that evening ("split ds into components logo and social, separate cards in admin. 4 col cards").
// Radio, Files, Icons and Research went 2026-10-07 with what they led to (archive/README.md, v2in's archive/eccm-radio/radio.md)
const TOOLS = [
  // first while the migration is the work at hand (asked 2026-10-07: "move to /docs/migration instead and make docs index page")
  ['/docs', 'Docs', 'Plans and reports, starting with the migration of eccm.ee.'],
  ['/et/sundmused', 'Events', 'Every event. Each one is edited from the Edit button on its own page.'],
  ['/items', 'Notices', 'A notice to phones at a set time, and the list of notices.'],
  ['/edit/uudiskiri', 'Newsletter', 'Issues to subscribers: compose from events, send a test, send to all.'],
  ['/ds', 'Components', 'Type, figures, colour, space, buttons, tables and cards.'],
  ['/logo', 'Logo', 'The square mark, the wordmark in both languages, and every icon size.'],
  ['/social', 'Social', 'The share image of every published event, as a scraper sees it.'],
];

export const renderAdmin = () => page({
  wide: 'root', lang: 'en', title: 'Admin.',
  body: html`  <h1>Admin</h1>
  <div class="cards">
    ${TOOLS.map(([href, title, desc]) => html`<a class="card" href="${href}"><span class="card-title">${title}</span><span class="card-desc">${desc}</span></a>`)}
  </div>`,
});
