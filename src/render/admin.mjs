// admin.mjs: /admin, one card per tool the site has (asked 2026-10-01: "make
// "/admin" page that has cards for Events, Items, Station, Newsletter and
// Design System (anything else i am missing.) 3 col grid"). The five asked
// for, then the type study, which had no way in. The newsletter's outbox is
// reached from the newsletter's own page (asked: "rm postkart from admin top
// level"). /derive, the study the picture detector came
// out of, has no card: the detector runs on upload now (public/scheme.mjs)
// and nobody editing needs the page (asked: "is derive needed as we have
// content done?"). The Notices and Docs cards went 2026-11-06 with the notices
// (archive/notices.md) and /docs (the plan is plans/plan-eccm-migration.md). Behind the one editor key (src/auth.mjs) since 2026-11-06,
// with Log out above the cards.
import { html } from './html.mjs';
import { page } from './chrome.mjs';

// in English since 2026-10-02 ("convert all admin pages to english only"), and the type study moved under
// Research the same day with the radio tools ("in admin page to reseach card link"), and the design system is
// three cards since that evening ("split ds into components logo and social, separate cards in admin. 4 col cards").
// Radio, Files, Icons and Research went 2026-10-07 with what they led to (archive/README.md, v2in's archive/eccm-radio/radio.md)
const TOOLS = [
  // left of New event (asked 2026-11-07: "add link to admin page in left of new event"), the drafts list
  ['/edit/events/drafts', 'Drafts', 'Every event not yet published, each opening in the editor.'],
  // the one door to a new event's form (asked 2026-11-06), here since the public list is the same for every visitor
  ['/edit/events/new', 'New event', 'A blank event form. It is saved as a draft until set to Published.'],
  ['/edit/uudiskiri', 'Newsletter', 'Issues to subscribers: compose from events, send a test, send to all.'],
  // the partners' logos, upload, edit and delete (asked 2026-11-07: "make a admin page to upload logos"), called
  // Logos the same day; before User interface, which stays last
  ['/edit/partners', 'Logos', 'Partners’ logos for event pages and the footer, in colour and in black and white.'],
  // the menu's pages and the footer's logos (asked 2026-11-07: "perhaps a Admin > Layout where you can pick what pages to link and what logos go to footer?")
  ['/edit/layout', 'Layout', 'Which pages the menu links and which logos the footer shows.'],
  // one card since 2026-11-07 (asked: "drop social. mv logo to User interface (/ui) with components. last item"),
  // each event's share cards under its own page for an editor
  ['/ui', 'User interface', 'Type, colour, space, buttons, tables, cards, video and the logo with every icon size.'],
];

export const renderAdmin = () => page({
  wide: 'root', lang: 'en', title: 'Admin.',
  body: html`  <h1>Admin</h1>
  <p class="note"><a href="/logout">Log out</a></p>
  <div class="cards">
    ${TOOLS.map(([href, title, desc]) => html`<a class="card" href="${href}"><span class="card-title">${title}</span><span class="card-desc">${desc}</span></a>`)}
  </div>`,
});
