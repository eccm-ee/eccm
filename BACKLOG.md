# Backlog

What has been asked for and not yet done. A request lands here before it is
worked on, verbatim, and leaves by being finished or refused in writing.
Earlier eccm lines, up to the move-out of 2026-09-27, are in positron's
`BACKLOG.md`.

## Open

### Done 2026-09-28: "move et en to mobile menu. use same element as in right side of logo. more touch area than just element"

Asked verbatim, the headers on `public/layout.html`. In a narrow box the language switch leaves the mark's line and becomes the last row of the opened menu; the five-hairline button stands alone at the mark's right; its tap area is padded to a finger's size, 48 by 45 px, with the icon where it was, and the opened menu's rows get the same air to tap.
✅ Done. MEASURED at 1280: at the desk the in-menu switch hidden and the line switch shown; in the 375 box the line switch hidden, the button 48 by 45 px with the icon's right edge 0 px off the frame's edge; in the open figure eight rows, the switch last, each link 36 px tall. One shot at 1280.

### Open 2026-09-28: "bring other /sans versions back"

Asked verbatim. The five sans faces of 2026-09-27 ("give me some fresher stuff": Bricolage Grotesque, Instrument Sans, Sofia Sans Condensed, Familjen Grotesk, Anybody) were on `public/wordmark.html` as settings L to P at 50c3226 and were cut to Instrument Sans at cf2fdb5; their files and licences stayed under `public/vendor`. A background agent brings the other four back on the wordmark page as a section of their own, the under lockup at 40 units in each face at the two widths, both languages, with the face's own width and weight as the earlier settings had them, so the faces compare against the Instrument Sans lockups above. The agent reports and does not commit.
⚠️ Asked again, verbatim, before the agent reported, so the second place the five faces lived is covered too: `public/type.html` had them as body and title specimens H to L at 1357720 and was pruned at cf2fdb5; the four others return there after Instrument Sans and before the ten serifs, re-lettered.

### Done 2026-09-28: "perhaps header typo should be bit smaller? do mobile menu solution, elegant one (thin 1px lines, 5 of them). H-B. One line - logo variant with side workmark on desktop, below in mobile"

Asked verbatim, the headers on `public/layout.html`. The menu and the switch in every header go to the small size, 14 px, the size four of the eight measured sites use. In a narrow box the menu hides behind a button of five hairlines one pixel each, the stave's own count, and opens under the mark's line one item a line; the phone mocks show it closed, and a short figure beside each shows the header open. H-B draws the mark with its wordmark, the beside lockup from the wordmark page at the desk and the under lockup in a narrow box, the mark itself at one width in both.
⚠️ Added mid-task: *"make layoyt desktop examples full page w"*: the desk mocks span the viewport, header, ground and footer edge to edge, with the site's frame inside them, so a mock is the page and not a picture of it.
✅ All four done. MEASURED at 1280: the menu and the switch 14 px; the desk box 1280 wide with the site's frame 1152 inside, the footer on the frame too; the button hidden at the desk and shown in the 375 box with the menu hidden behind it, five rectangles one pixel tall, the open figure listing seven items one a line; H-B's beside lockup 222 px wide at the desk and its under lockup 128 px in the box, the mark 128 in both; the switch group's right edge on the frame's edge in all four headers after a first cut left it before the menu; the headers 213, 126, 335 and 89 px tall. Shot at 1280 and 375.

### Done 2026-09-28: "in bg: footer logo should be smaller and tallinn-muusikalinn too a bit. add instagram and facebook to footer,"

Asked verbatim. A background agent on `public/layout.html`: every footer's mark a step down its scale (8rem to 6, 11 to 8), the City of Music mark from 5rem to 4 with its ink still on the mark's top and the footer's edge, and Instagram and Facebook as text links in the contact columns of A and D, the handles from `plans/plan-eccm-presence.md` (instagram.com/eccm.ee, facebook.com/eestinyydismuusikakeskus). The agent reports and does not commit.
✅ Done by the agent, shipped by the session as 8bafd6d. MEASURED at 1280: the ECCM mark 96 px wide in A, B and D and 128 in C, the City of Music mark 64 px, its ink's top 0.00 px off the mark's top and its outer edge 0.01 px off the footer's edge; Instagram and Facebook once in each drawing of A and D, 14 pairs on the page; the header marks unchanged. One shot at 1280.

### Done 2026-09-28: "credtist: create comojent that shows first but allows add more items" and "move image to top"

Asked verbatim, mid-task, the editor form. The credits section shows the credits that exist and no blank blocks, with a button that adds one; the button works with no script through the server, which re-renders the form with one more block and saves nothing, and a few lines of script add the block in place when they can. The picture moves to the top of the form, shown with its select under it, its own section before Millal ja kus.
⚠️ Added mid-task: *"move avaldamine above text"*: the order becomes Pilt, Millal ja kus, Avaldamine, Tekst, Tegijad.
⚠️ Added mid-task: *"when resizing textarea in one col, other height should change too"*: the two description fields follow each other's height through a ResizeObserver, a few lines of script.
⚠️ Added mid-task: *"move pealkiri and slut to their own section, first"*: the title and the slug of both languages open the form as a section of their own, and Tekst keeps the descriptions.
⚠️ Added mid-task: *"pr pilt textfield for now"*, read as put: the picture field is a text field holding the file name for now, resolved against the media rows on save, since a media row needs a width and a height that a typed name cannot give; an unknown name is refused with a sentence naming the files that exist.
✅ All six done. The order is Pealkiri, Pilt, Millal ja kus, Avaldamine, Tekst, Tegijad. MEASURED on the agent's server: 7 credit blocks and no blank one, a click adds an eighth in place with its names `c7_*` and the label `Tegija 8, roll`, the same button through the server answers 200 with eight blocks and the count at 8; the two descriptions read 400 px each after one was set to 400; the picture field is a text field holding the file name, a bogus name answers 422 with `Sellist pilti ei ole. Olemas: ...` naming the one file, the right name passes. Shot at 1280 and 375.

### Done 2026-09-28: "fix alignment, make a fields grid component or smh" (a crop of the editor's Millal ja kus fields)

Asked with a picture: the first row holds three fields whose tops and heights differ, the date-time fields taller than the number, a hint under one pushing nothing and lining up with nothing, and the rows under it two columns wide so no edge lines up with the row above. One `.fields` grid in `eccm.css`: two equal columns from 48rem and one under, every control 3rem tall, the label one line above, the hint one small line below, a short control its own width inside its column.
✅ Done: `.fields` in `eccm.css`, and the cause of the misaligned tops found on the way: the field grid stretched to its row and shared the spare height between the label and the control, so a field with a hint sat its control higher; every field starts at its row's top now. MEASURED at 1280 on the agent's server: two columns, every control in a row on one line, the column edges at 64 and 656 px down the section, controls 48 px tall, the dates 256 px and the number 128 px wide.

### Done 2026-09-28: "So next cms step. Editing?" and "In bg"

Asked verbatim. A background agent takes the next sessions of `plans/plan-eccm-cms-step-1.md` up to and including the editor: the scheme column the handoff names as next, then the editing route and the form saving to D1 behind a gate, on its own local database and port so the session's dev server is untouched. It reports and does not commit; the session commits, migrates the remote database and deploys.
✅ Built and proved locally by the agent, then shipped by the session: `/edit/events` (the list), `/edit/events/{id}` (one form for both languages, the facts, the credits, the status and the publish time), `/edit/events/new`, `/login`, `/logout`, behind a gate that takes a Cloudflare Access JWT when `ACCESS_TEAM` is set and, on staging, a cookie set by `/login?token=` against the `EDITOR_TOKEN` secret, a stand-in until the Access application exists. A save is one D1 batch guarded by `rev`, so a stale form answers 409 with its values kept; preview renders the real template without writing. `migrations/0002_editing.sql` adds `rev` and `updated_by`. Step 1's sessions 3 to 5 untouched, since the editor needs none; no upload, no draft table, no redirect on a changed slug. MEASURED locally by the agent: 401, 401, 303, 200 on the gate, 35 fields plus 9 credit blocks, 303 on save and rev 2, 409 on a stale save, 422 with four sentences on bad input; re-checked by the session on the agent's server: 401, 401, 303, 200 with no-store and noindex, 73 fields, the page parses.

### Done 2026-09-28: "all headers are bad. cramped, no proper typo approach, not leaving nice detected area stand out... not good at all. all you typo whitespace reaerch? looks what others do"

Asked verbatim, the four headers on `public/layout.html`. Before redrawing: the whitespace and scale rules in `.claude/skills/eccm-ui/SKILL.md` and `positron-compose` §1 and §4 are read and applied, and seven comparable sites' headers are measured in a browser once each (the header's height, the mark's drawn size, the menu's size and gaps, the air between the header and the first content, rules or none), so the redraw stands on numbers and not on taste.
⚠️ Added mid-task: *"replace posthord with smth else"* and *"bring more detected ones"*: the Improtest example leaves the pages and each header gets its own derived example, taken from the derive page's four sets, more of them and different ones, the serif one among them.
✅ Redrawn. MEASURED first, eight sites in a browser once each (arvopart, eestikontsert, erso, gaudeamus, hcmf, ircam, saal, kumu): the designed headers are 71 to 117 px tall with the mark in 25 to 31 px of air, the menu at 14 to 21 px on the mark's line, and none draws a rule; arvopart gives its mark a 900 px screen with the menu on it. The rule applied from `eccm-ui` §1: vertical space is counted in leadings. The four now, every distance a whole number of the 27 px leading and no rule anywhere: H-A two lines, the mark at 12rem, 2lh above and below, the menu 1lh under; H-B one line, the mark at 8rem with the menu and the switch on its baseline, 1.5lh above and below; H-C the mark large at 20rem, 3lh above, the menu 2lh under, 3lh below; H-D running, 6rem, 1lh above and below. The menu is body size with 2rem between items. The derived block pads itself 2lh at the top and 4lh at the bottom. The examples are four, one a header: Sound Plasma (set 2, light green, Literata by its serif verdict), Huddersfield (set 2, mauve mid tone), Varssavi (set 3, plum), Scrapyard (set 1, navy); the Improtest and Open Space ones are out. MEASURED at 1280: header heights 229, 128, 343 and 91 px. Shot at 1280 and 375.

### Done 2026-09-28: "in bg analyze and write plan of eccm social media presence and web presence in general - in fienta pages etc"

Asked verbatim. A background agent writes `plans/plan-eccm-presence.md`: an inventory of where ECCM is on the web today (eccm.ee, ticketing pages on Fienta and elsewhere, social accounts, listings, streaming and archive services), each read once and labelled READ or INFERRED, and a plan for the presence, reported in full when it lands. The agent does not commit.
✅ Landed: `plans/plan-eccm-presence.md`, 532 lines, ten numbered sections, 26 fetches one per page, relayed in full in the session; committed by the session.

### Done 2026-09-28: "rm Eesti Nüüdismuusika Keskus from 3rd col" and "wheer is contact info in footer? email? smth else?"

Asked verbatim, footer A on `public/layout.html`. The name leaves the contact column. There was no email or phone because none of ECCM's was on record in this repository, and `plans/plan-eccm-design.md` read only one person's mobile off the contact page; that page is read once more for a general address, and what it gives goes into the column as text.
✅ READ 2026-09-28: the contact page publishes the postal address, an empty `Faks:` label, one mobile number under the tegevjuht's name, and a contact form; no email address and no social link. The column carries the venue, the postal address, the phone as `Telefon`, and `Kirjuta meile` linking to the form as the email's stand-in; the name is out.
✅ Done in A, both languages, and the phone and the form link added to D's contact column too, its name and label kept.

### Done 2026-09-28: "make also header variants. in between but some derived example(s)"

Asked verbatim. `public/layout.html` gains header variants, each shown as a whole page: the header, then a derived event page from `derive.html` in its own scheme, then footer A, at the desk and in a 375 px box. The derived examples are copies of what the derive page draws, one light and one dark, with the scheme values it measured, and the page says which picture each came from.
✅ Done, with *"but -> put"* read as put. Four headers, H-A to H-D, each on a whole page at the desk and in a 375 px box: as the site is with the bare mark at 20rem and the ruled menu band; one band with the mark at 8rem, the menu and the switch on one line; stacked with air only, the mark at 11rem; a running header, the mark at 6rem on a thin band ruled in the hairline grey. The pages alternate the Improtest scheme (dark, ground #421c19) and the Open Space scheme (light, ground #ededed), both copied from derive.html as drawn on 2026-09-28. MEASURED locally at 1280: 8 pages, 26 marks and 14 partner marks on the page, 19,037 px tall. Shot at 1280 and 375.

### Done 2026-09-28: "rm E"

Asked verbatim. `public/layout.html`: the white-on-black footer leaves the page (in git at 6db2a37) with its inverted rule; four footers remain, A to D.

### Done 2026-09-28: "rm instumert sans examples from layput page"

Asked verbatim. `public/layout.html`: every footer in Schibsted Grotesk only, so 12 footers instead of 24; the Instrument Sans declaration, the face class and the face names in the captions leave the page, the font files stay under `public/vendor` for the wordmark and type pages.

### Done 2026-09-28: "placeholder neesd to be grayer"

Asked verbatim, the email field in footer D on `public/layout.html`: the placeholder was the second ink, #555; it is `--eccm-rule-strong`, #999, now, the lighter grey the site already has.

### Done 2026-09-28: "add more space between" (a crop of the two-column menu)

Asked with a picture of the menu in two columns, Avaleht beside ECCM. The column gap grows from the footer's 2rem to 3rem in every two-column menu, A and D, in both languages; the rows keep their half step.

### Done 2026-09-28: "rm wordmarks on logos in footers"

Asked verbatim. `public/layout.html`: every footer draws the mark alone, letters and stave, no tagline under it; the wordmark drawing code leaves the page (in git at 65025af) and the captions and the intro stop naming it.

### Done 2026-09-27: "D: maek E-post as placeholder in field, rm label. rm toetajad . find place to muusikalinn" and "try 2 col links in D"

Asked verbatim, mid-task, footer D on `public/layout.html`: the email field carries E-post as its placeholder and keeps that name for a screen reader with no visible label; the funders' row goes; the City of Music mark in black sits at the end of the bottom line, the copyright and the switch at its start, and the text line naming the city goes since the mark says it; the menu in two columns as in A, its label kept since nothing was said about it.
✅ Done, all four. The mark sits in the bottom line centred on the line, the city's file being symmetric above and below its ink. One shot at 1280.

### Done 2026-09-27: "rm Kontakt\n\nEesti Nüüdismuusika Keskus . add more space between  links in fooer (C). tallinn muusikalinn -> make it black"

Asked verbatim, footer C on `public/layout.html`: the `Kontakt` label goes and the name is the column's first line, in the label's ink; the two-column menu's column gap grows from 1.5rem to the footer's own 2rem and its row gap from 0.25rem to 0.5rem; the City of Music mark is the black file from the city's pack, which its rule allows where colour is not used.
⚠️ Added mid-task: *"and bit smaller aht align top wich eccm. move var c to the top as a anad make engliosh ver"*: the City of Music mark a step smaller and its ink's top on the ECCM mark's top; footer C becomes the first, lettered A, the others move down a letter; and an English version of it under the Estonian one, with the English wordmark, menu, contact and copyright and the English black City of Music file.
✅ Done, all six. The City of Music box is 5rem and its ink 58 px wide; the file carries 60.5 units of air above the ink and about 60.8 beside it in a 446.46 box (MEASURED with getBBox), so the img is pulled up and out by those fractions. MEASURED at 1280 in both languages: the ink's top is 0 px off the ECCM mark's top and its right edge 0 and 0.3 px off the footer's padding edge. Lettered A now; the old A and B are B and C; the English version has the English wordmark, menu, contact, copyright and the city's English black file. 24 footers and 12 partner marks on the page. Shot at 1280.

### Done 2026-09-27: "c. smaller logo. menu in 2 col? No \"Menyy\" https://muusikalinntallinn.ee/ logo hast to be somewhere as well (right side?)"

Asked verbatim, about footer C on `public/layout.html`: the mark smaller, the menu in two columns without its label, and the Tallinn UNESCO City of Music mark in the footer, at the right. The mark is fetched once off https://muusikalinntallinn.ee/ and kept under `public/` with a note of where it came from; eccm.ee shows it today in its sidebar as a 120 by 118 JPEG.
⚠️ Added mid-task: *"look up city of music svg if posisble"*: an official vector is looked for first, on muusikalinntallinn.ee, in Tallinn's brand kit and by search; a redraw only if none is published.
✅ Done, and the vector was found: Tallinn's identity site publishes the pack at https://identiteet.tallinn.ee/#/logode-ja-dokumentide-failid/tallinna-muusikalinn (a zip dated 2022-02-11, Estonian and English, blue, black and white, RGB SVG plus CMYK and PMS PDFs, and the UCCN guidelines PDF), with the rule *"Logo kasutatakse valgena või Tallinna sinisena. Kui värvikasutus ei ole võimalik, kasutatakse logo mustana"* and *"Võimalusel kasutage alati .svg faile"*. The six screen SVGs are under `public/partners/` with `SOURCE.md`; muusikalinntallinn.ee itself is a Readymag app with no SVG in its markup, tallinn.ee's English City of Music page carries only a 500 px PNG, and the Estonian page answers 403 to a fetch. Footer C: the mark 8rem instead of 11, the menu in two columns of four and three with no label, the Estonian blue mark 6rem wide at the end of the row, and last in the stack on the phone. The `Kontakt` label stays, not asked about. MEASURED: an `auto` track beside an auto-fit repeat is not a valid track list (`CSS.supports` false), so the four tracks are written out. Shot at 1280.

### Done 2026-09-27: "create new page layout where you tray first several footers. eccm logo, with and without workmark, main links, credits etc. use Schibsted and Instrument" and "i mean page \"/layout\""

Asked verbatim, mid-task, two messages. A new `public/layout.html` at https://eccm.positron.studio/layout: a study of several site footers, each with the mark (with the wordmark and without), the main links, the credits and the rest a footer carries, set in Schibsted Grotesk and in Instrument Sans. What a footer carries is taken from eccm.ee's own footer and the current `site-foot`, and every one is shown at the phone width and the desk.
⚠️ Added mid-task: *"look aroind other footers too"*: the footers of comparable sites, read once each, one fetch a site, for what they carry; the inventory goes in the page's intro and here.
✅ Done: https://eccm.positron.studio/layout, five footers (one row; wordmark and the menu; three columns; four columns with a newsletter field and funders' slots; white on black), each in Schibsted Grotesk and Instrument Sans at the desk and in a 375 px box that is the footer's container, 20 footers and 20 marks drawn. Left out, said on the page: a phone, an email and social links (none of ECCM's on record here) and a privacy line (no page). The inventory, seven sites fetched once each on 2026-09-27 (eestikontsert.ee, erso.ee, helilooja.ee, gaudeamus.nl, hcmf.co.uk, ircam.fr, saal.ee; arvopart.ee and eestimuusikapaevad.ee answered with no footer element, eccm.ee's is Joomla's login form): every one gives the name and address, five repeat the menu, four an email, four a phone, four a privacy or legal line, three a copyright line, three social links, three a newsletter field, two the funders, two a registry number. MEASURED: the first cut's phone boxes were 163 px wide at the desk, a flex item's percentage with nothing to resolve against, so the width sits on the figure now and reads 375. `tools/shot.mjs` gained `--from px` to capture a page taller than 6000 px in parts, owed to positron's copy by hand.

### Done 2026-09-27: "use literata now on the derived page not the prev serif one"

Asked verbatim. `public/derive.html`: the serif a derived page takes when its picture reads as serif is Literata, in place of Source Serif 4, wherever that page names it.
✅ Done in `derive.html` (the constant, the comment, the intro), `ds.html` (the type prose and the two serif specimens) and `eccm.css`, where Literata is declared in Source Serif 4's place; `type.html` declares Source Serif 4 for itself as its B. MEASURED locally on `?set=2`, the set with a serif verdict: Literata loaded, one sample set in it, Source Serif 4 nowhere. The default set reads no serif, so the face is not fetched there.

### Done 2026-09-27: "in square move eng up and est down so they have same y padding as they have x padding. sma"

Asked verbatim. `public/wordmark.html`, the two bilingual squares: the language over the mark moves up and the one under it moves down until each sits 28 units from the square's edge, the letters' own margin at the sides; the mark stays centred on the square. MEASURED before: the lockup box is 267.8 tall in a 354 square, so the blocks sat 45 and 43 from the edges. The one-language square is not touched, one block cannot sit at both margins.
✅ Done in both bilingual squares and their inverted twins. MEASURED at 20rem as the page opens: 28 units over the top language and 28 under the bottom one in each. One shot at 1280.

### Done 2026-09-27: "make versions inside square, 1px black border  and white on black bg. for side titles a rectangle"

Asked verbatim. `public/wordmark.html`: beside every plain lockup, the same lockup in a frame, once with a 1px border in the ink and once white on black; a square for the under lockups, centred on the letters with the stave reaching into the margin as the square marks do, a rectangle round the ink for the beside ones; the margin from the ink is the square marks' 28 units.
✅ Done: 42 lockups on the page, 14 plain and each with its two frames. MEASURED at 20rem, in units: every under square is 354 a side; the beside rectangles are 657.5, 593.5 and 885 wide by 152.5. The border is a CSS pixel at any scale, the inverted frame is the ink's own box with no line. Shot at 375 and 1280.

### Done 2026-09-27: "the Estonian above the mark and the English under it,  - estonian needs mor space under it cause typography. do inversed languaged verson too"

Asked verbatim. `public/wordmark.html`, the bilingual under lockup. Why it reads tight: under the mark the 12 units run from the mark's edge to the cap line, and a lowercase line's bulk sits at the x-height, 6.8 units lower at 40 units, so the eye reads 18.8; over the mark the line sits on its baseline with no descenders, so the eye reads the bare 12. The air over the mark is measured to the x-height as well, which puts the baseline 18.8 units over the mark's top at this size. And a second lockup with the English over the mark and the Estonian under it.
✅ Done, both. The rule in the page is one line: the baseline over the mark keeps GAP plus (CAP minus XH) times the size, 18.8 units at 40. MEASURED at 20rem: each bilingual box is 310 by 267.8 units. One shot at 1280.

### Done 2026-09-27: "C ups and downs are cut off, adjust svg \"padding\"" (a crop of the mark, the C's top curves flat)

Asked with a picture. The two C's are stadiums whose stroke reaches 27 above and 123.5 below, 2 over the E and M's top at 29 and 1.5 under their bottom at 122, the round letter's overshoot. A box of `35 29 310 93` on the mark clips both. The box has to carry the ink, `35 27 310 96.5`, wherever the mark is drawn.
✅ Done on the three pages that draw the mark from an inline symbol, wordmark, tagline and tagline-47: the symbol's box and the use's box are `35 27 310 96.5`, and the beside boxes on /wordmark read 96.5 tall instead of 95. The standalone logo and wordmark SVGs and the icons already box from 27 and were not touched. One shot at 1280: the C's arcs rise over the E's top.

### Done 2026-09-27: "rm 37.0 units, 21.0 px at 11rem, both languages as one block, English over Estonian, centred on the E's middle bar"

Asked verbatim, the caption of the cell. `public/wordmark.html`: the one-block bilingual beside lockup leaves the page, so of the two readings of "also both languages beside" the side-by-side one stays; the one-block shape is in git at 5e3102d.

### Done 2026-09-27: "move estonian version on top of ECCM in the \"English then Estonian\""

Asked verbatim. `public/wordmark.html`, the bilingual under lockup: the Estonian two lines go above the mark, their last baseline 12 units over the mark's top, the same air the English keeps under its bottom; the English stays under.
✅ Done. MEASURED at 20rem: the box is 310 by 261 units, from 49 over the mark's top to 88 under its bottom.

### Done 2026-09-27: "also both languages beside"

Asked verbatim, mid-task. `public/wordmark.html`: a bilingual beside setting at 37 units. Two readings, both drawn so the owner can strike one: the four lines as one block to the right of the stave, centred on the E's middle bar, the languages parted by 12 units of air; and each language its own two-line block, side by side, each centred on the bar, the gap between them the same as after the stave.
✅ Both drawn. MEASURED at 20rem, in units: the one-block lockup's box is 154.6 tall against the mark's 93, the four lines overhanging the mark by about 27 above and 23 below; the side-by-side lockup is 829 wide, 2.7 marks.

### Done 2026-09-27: "do variant with both languages under ECCM"

Asked verbatim, mid-task. `public/wordmark.html`: a third setting, the mark with the English two lines and the Estonian two lines under it as one lockup, at the under setting's 40 units, the languages parted by the same 12 units of clear air the mark and the first line have.
✅ Done. MEASURED at 20rem: the box is 310 by 271 units against 183 for one language.

### Done 2026-09-27: "add more space between ECCM and beside wordmark"

Asked verbatim, mid-task. `public/wordmark.html`, the beside setting: the gap between the stave's end and the two lines is 18 units; the same ask on 2026-09-27 ("Bit more horiz gap") took it to 28 in d61d4ff before that layout was reverted whole, so 28 is the number with a history.
✅ Done at 28, and the same 28 parts the two languages when they sit side by side.

### Done 2026-09-27: "for serif page leave Schibsted Grotesk, Instrument Sans, Literata,"

Asked verbatim. `public/serif.html` keeps K Schibsted Grotesk, M Instrument Sans and C Literata; the other ten leave the page, their files under `public/vendor` and their faces declared as before.
✅ Done in the order named, K, M, C, under their letters; the ten are in git at 475e4bb. The two kept sans sections had `id="spec-newsreader"` copied onto them and carry their own ids now.

### Done 2026-09-27: "in https://eccm.positron.studio/wordmark under the mark do 40units for estonian and english. for beside make 37 units 2 line, vert centered. rm others"

Asked verbatim. `public/wordmark.html`: the under layout at one size, 40 units, both languages at 20rem and 11rem; the beside layout at 37 units, two lines, centred on the E's middle bar as the page's centred shape already is; the line height and size studies, the other two beside sizes and the three other beside shapes leave the page (in git at 73e4d2a).
✅ MEASURED as the page opens: the English fit is 41.8 units and the Estonian 55.3, so at 40 the widest English line is 284.8 units and the Estonian 215.6 against the letters' 298, both inside the block; beside at 37 the lines run 263.5 and 199.5 units past the stave. Shot at 375 and 1280, nothing sideways.

### Done 2026-09-27: "save handoff"

HANDOFF.md written in this repository for the first time, with every number counted by a command.

### Done 2026-09-27: "Do horz layout with single line of workmaek and also bottom aliged varints"

Asked verbatim. The beside study on /wordmark has four shapes at each of its three sizes: two lines centred on the E's bar, two lines with the last on the letters' baseline, one line centred, one line on the baseline; English and Estonian at 20rem and 11rem, the one-line Estonian unbroken.

### Done 2026-09-27: "Revert latest wordmark change"

Asked verbatim. /wordmark is back at the three studies (line height, size, beside) with the hairline placed from the drawn line; the paired horizontal and vertical layout is in git at d61d4ff.

### Done 2026-09-27: "Bring all serifs and 3 others back"

Asked verbatim. /serif shows the ten serifs again, A to J, and after them the three the type page keeps, K Schibsted Grotesk, the default, L Source Serif 4 and M Instrument Sans, each in the derived page's three uses.

### Done 2026-09-27: "Leave these for hor layout and put vert layoud next to them. Bit more horiz gap" (a phone screenshot of the beside lockups)

Asked verbatim. /wordmark is one study now: at 30, 36 and 42 units, each language at 20rem and 11rem, the horizontal lockup with the lines right of the stave and, beside it, the vertical lockup with the same lines under the mark at the same size; the gap between the stave and the lines grows from 18 to 28 units. The line-height and size studies are in git.

### Done 2026-09-27: "Dash is in wrong place" (a phone screenshot of /wordmark)

On Safari the hairline sat in a gap after "eesti nüüdis": the page measured the line with the face at its full width and Safari drew it at 75, so the fitted lines came out narrow and the dash far right. The width axis is now set with font-variation-settings as well, which Safari measures, and the dash is placed from the drawn line's own length, a third of the size long after a gap of eight hundredths, on /wordmark, /tagline-47 and /tagline.

### Done 2026-09-27: "wordmark. leave lowercase. reduce lineheight of workmark. try differetnt text sizes and do vriant of ECCM (workmark) flex layout"

Asked verbatim. /wordmark is lowercase only, in three studies: the line height of the two tagline lines under the mark at 1.05, 0.95 and 0.88; the size at the fit and at 90, 80 and 70 per cent of it, at 0.95; and a beside layout with the two lines to the right of the stave, centred on the E's middle bar, at three sizes, the mark kept at the same width as in the under layout.

### Done 2026-09-27: "leave b c e g in serif, hide the rest"

Asked verbatim. /serif shows B Newsreader, C Literata, E Piazzolla and G Petrona under their letters; the six others are out of the page and in git, their files stay under public/vendor and their faces declared.

### Done 2026-09-27: "https://eccm.positron.studio/type - only use our default and then source sans and instuments and the rest 10 has to be serif fonts, mordern"

Asked verbatim. /type keeps three of its twelve, A Schibsted Grotesk (the default), B Source Serif 4 and C Instrument Sans, read with "source sans" as the Source Serif 4 the site uses; the ten modern serifs the background agent is fetching become D to M on the same page when they land, and the unused face declarations leave the page. ✅ Done: D Newsreader, E Fraunces, F Piazzolla, G Literata, H Bodoni Moda, I Brygada 1918, J Petrona, K Besley, L Roboto Serif, M Instrument Serif (titles only), in the ranking's order; "source serif" confirmed.

### Done 2026-09-27: "develop these further, rm the rest. do the nyydis-, different cases and 2 workmark sizes" (setting M, with a crop)

Asked verbatim. /wordmark is setting M alone now: Instrument Sans medium at width 75 on two lines fitted to the letters, in lowercase, sentence case, words capitalised and uppercase, at 20rem and 11rem, English and Estonian with the break inside the long word and the hairline hyphen; the fifteen other settings are gone, their faces stay under public/vendor and on /type.

### Done 2026-09-27: "in parallel work on replacement options to Source Serif 4, come up with 10 version of moder sans, no garamod"

Asked verbatim. Read as ten modern serifs, since it replaces a serif and excludes Garamond; a background agent fetches ten as subsets with licences and builds public/serif.html with each in the derived page's use, title and facts in the serif over the sans body, the body in it too on white, and a dark ground where the body stays sans, then ranks them. ✅ Done: public/serif.html with the ten in the three uses, 30 files under public/vendor, the ranking in section 7 of the skill: Newsreader, Fraunces, Piazzolla put forward.

### Done 2026-09-27: "and use instument sans too, make similar versions too. rm other stuff."

Asked verbatim, on the 47 page. It holds only the four DIN lockups of setting 1 and the same four in Instrument Sans condensed, uppercase at 0.08em on two lines fitted, drawn by the page from the webfont; the twelve variants and the sizes are gone. An Instrument Sans lockup as a file needs the letters as outlines, which is a step not taken.

### Done 2026-09-27: "where are sans examples?" then "i mean sans body texts etc" and "and titles"

Asked verbatim: the five fresh sans faces as specimens for the site's body text and titles, the way /type compares the earlier seven, not as taglines. Five specimens added to /type in the five faces already under public/vendor. ✅ H to L on https://eccm.positron.studio/type: Bricolage Grotesque (titles at width 90), Instrument Sans (titles at 85), Sofia Sans Condensed, Familjen Grotesk, Anybody (titles at 85), each the same row, facts, diacritics line and paragraph as A to G.

### Done 2026-09-27: "take first on 1 example in 47 and do estonian and centered versions"

Asked verbatim with a crop of setting 1 on /tagline-47: uppercase DIN Condensed at 0.08em on two lines fitted to the letters, left aligned, full size. Four files under public/: the English and the Estonian lockup, each left aligned and centred, the Estonian with the hairline hyphen, the sizes measured on the page; shown at the top of /tagline-47. ✅ wordmark-en-left.svg, wordmark-en-centred.svg at 34.6 units and wordmark-et-left.svg, wordmark-et-centred.svg at 45.0, each fitted on its longer line.

### Done 2026-09-27: "use thin dash like the element in logo in nyydis-"

Asked verbatim. On /tagline and /tagline-47 the hyphen after nüüdis is drawn as a hairline of the logo's weight, 1.5 units, in the slot the font's hyphen took, at the middle of the x-height or of the cap height.

### Done 2026-09-27: "add examples with larger size like page logo but not that big"

Asked verbatim. Every setting on /tagline-47 shows its pair a second time at 16rem, between the phone's 11rem and the header's 20rem, under the 11rem pair.

### Done 2026-09-27: "do Eesti nyydis- / muusika keskus"

Asked verbatim. The Estonian two-liner on /tagline and /tagline-47 breaks inside the long word, "eesti nüüdis-" over "muusika keskus", in whichever casing the setting has, and is fitted on its longer line as before.

### Done 2026-09-27: "Take 47 and make separate page with uppercase and lowercase variants left and center and 3 font sizes (small difference)"

Asked verbatim. Setting 47 is uppercase, tracking 0.08em, two lines fitted, left aligned. public/tagline-47.html holds it in uppercase and lowercase, left aligned and centred, at the fitted size and at 92 and 85 per cent of it, twelve settings in both languages at 11rem; the lowercase carries a light 0.02em since the rule tracks no lowercase and the owner can say otherwise.

### Done 2026-09-27: "There is no such thing. Either both lines left aligned or both centered."

Said with a phone screenshot of setting 8, where the fitted line started on the E and the shorter one was centred. Every line of a lockup now follows the setting, centred on the letters' axis with text-anchor middle or starting on the E, and the tracking travels as a style too, since Safari drew the tracked line narrower than Chrome measured it.

### Done 2026-09-27: "try to pack more examples to page. rm 20 rem versions for now"

Asked verbatim. /tagline shows each setting at 11rem only, English and Estonian side by side, in a grid of three cells a row on a desk, the caption a step above its pair.

### Done 2026-09-27: "add leftaligned text versions"

Asked verbatim. Every setting on /tagline exists twice now: a shorter line centred on the letters, as before, and a shorter line starting on the E's edge; 48 settings.

### Done 2026-09-27: "rm all grays and ones where text is wider than ECCM"

Asked verbatim. On /tagline the muted and light grey inks go and so does the one-line setting at 27 units, whose English line runs wider than the letters; 24 settings remain, all in ink and all fitted to the block.

### Done 2026-09-27: "in tagline rm horiz lines and add a looooot vert space between explanations and logos themselves"

Asked verbatim. On /tagline the rule above every cell goes; the caption sits a long way above its lockups, three steps up the scale, and the cells sit further apart than that.

### Done 2026-09-27: "on icon samples put black to back to each icon not whole block"

Asked verbatim. On /ds the negative icon rows lose their black band; each negative icon carries its own black, which is the square the file already paints, and the row sits on the page like the positive one.

### Done 2026-09-27: "None of the proposed wordmark versions work. Those first DIN examples are the best, but work now hard on this font size. Letter spacing and also casing, capital casing, full uppercase, words uppercase, sentence case, font size, wrapping, so create a lot of variants, make it work, maybe also a gray version, not sure about it, do it"

Asked, dictated. public/tagline.html: the tagline in DIN Condensed under the mark in every combination of four casings (lowercase, sentence case, words capitalised, uppercase), three trackings, three wraps (one line fitted to the letters E to M, one line at the current 27 units unsqueezed, two lines fitted) and three inks (ink, muted ink, light grey), 108 settings, each at 20rem and 11rem with the size in units and the x-height on the phone printed, both languages, the current squeezed line as the reference at the top. ✅ Done at https://eccm.positron.studio/tagline, 108 settings, DIN Condensed confirmed drawing by the fitted size matching the measured natural width; the fitted one-liner is 24.5 units, 7.2 px of x-height on a phone, under the floor, the two-liners about 45 units, over it.

### Done 2026-09-27: "On EC / CM align E to left and C to right" and "Give me five more alternative fonts, no Garamond. Give me some fresher stuff."

Asked verbatim, with "Where are alt wordmark fonts" in between, answered with the URL. The stacked mark's first row spreads to the block: the E on the left edge over the C, the C on the right edge over the M, the join between them the longer for it, in every stacked file and in the size builder. Five contemporary faces, none a Garamond, are fetched as latin and latin-ext subsets with their licences, set as settings L to P on /wordmark in both languages at both widths and measured like the others. ✅ The stacked mark is done and deployed; the five faces are with a background agent. ✅ Bricolage Grotesque, Instrument Sans, Sofia Sans Condensed, Familjen Grotesk and Anybody as settings L to P on /wordmark, all over the 7 px floor on a phone; Instrument Sans condensed and Sofia Sans Condensed put forward; fifteen files under public/vendor.

### Done 2026-09-27: "center workmark", "do icons inverted too", "add disabled buttons variants to ds"

Asked verbatim, the first with a crop of logo-et.svg. The Estonian tagline is centred under the letters E to M; the icon rasters exist in the negative too, icon-neg-<n>.png and stack-neg-<n>.png with a favicon-neg.ico, shown on /ds under the positive rows; and the buttons have a disabled state, faded to 45 per cent with no pointer, in both modes on every ground on /ds.

### Done 2026-09-27: "stave examples: should be narrow as in original logo, do not extend or adjust eccm size. in EC / CM align C to the right of M" and "original favicon seems more readable than your 16 variant"

Asked verbatim with a crop of eccm.ee's favicon, heavy ECCM letters filling an orange square. The stave goes back to its 12 units as in the logo in every square and every size; the letters keep their size; in the stacked mark the first row is right-aligned so its C ends on the M; and for 16 and 32 a bold set of the letters, stems of 20 units instead of 14, fills the square the way the original favicon does, and the SVG favicon points at it. ✅ Done; the first render of the bold set lost its C's to a broken path in the size builder, fixed before the commit.

### Done 2026-09-27: "use or create a typography skill to propose alternatives to the Estonian Centre of Contemporary Music workmark its hard to read"

Asked verbatim. A background agent writes the tagline rules into the eccm-ui skill from typographic sources, measures the current tagline (DIN Condensed squeezed to 95 per cent, its x-height at the header and phone mark widths), and builds public/wordmark.html with six to eight alternatives under the mark, each measured, for the owner to pick; nothing changes in the logos until then. ✅ Done: section 7 of the eccm-ui skill, seven rules with sources; public/wordmark.html with eleven settings measured in both languages at 20rem and 11rem; the current line is squeezed 5.4 and 7.5 per cent and sits at 7.9 px of x-height on a phone, the floor; the recommendation is Schibsted Grotesk medium on two lines fitted to the mark, 10.3 px on a phone, no squeeze, the site's own face.

### Done 2026-09-27: "use Eesti nyydismuusika keskus / Estonian Centre of Contemporary Music alternatives", "borders around icons when hovered", "m's still bobby"

Asked verbatim with a crop of the 16 to 64 row. The alternative texts of the logos become the centre's name in the page's language, sentence case as the tagline has it; the icons on /ds show their square on hover; and the M in the small-size marks is made wider, the letter and not only its arms, which is what "make it wider to compensate" meant, so its counters open at 48 and 64.

### Done 2026-09-27: "i feels like E C C M is a fixed thing and those various extended lines are thing than come go, can be animated etc"

Said verbatim, a principle. Written into the skill and the icons plan, and made real in the files: every mark SVG holds the letters in a group with the class letters and the hairlines in a group with the class lines, so a page or a graphic can leave the lines out, extend them or animate them without touching the letters. No animation drawn.

### Done 2026-09-27: "in sq examples consider ECCM as a block to align and 5 lines just extend from M to right edge" and "treat 5 1px lines next to em also as separate element we can use in social media graphics etc in top rigght corner, edget to right side, padding from top"

Asked verbatim with a crop. In every square the letters are the centred block and the stave runs from the M to the square's right edge; the stave is also its own file, public/icons/stave.svg, five one-unit lines on the mark's pitch, with the rule for graphics written beside it: top right corner, flush to the right edge, padded from the top.
 ✅ Done in all ten square files, in the size builder, and stave.svg is 60 by 29 px with one pixel lines on a seven pixel pitch, shown on /ds on a white and a dark ground.

### Done 2026-09-27: "5 line strips look bad / uneven on smaller sizes. do we need canvas rendering to preserve pixel lines?" "on sall sizes"

Asked verbatim with a crop of the stave at 128. MEASURED: at 128 a 1.5 unit hairline is 0.54 px on a 2.67 px pitch, so lines land on and between pixels and come out in three shades. No canvas: tools/mark.mjs builds one SVG per size with the letters as vectors and the hairlines as whole-pixel rectangles on an integer pitch with crispEdges, which is hinting by hand; the files under public/icons/ stay general-purpose.
 ✅ Done: MEASURED on the size row at 3x, the five lines are one shade at 128, 180 and 256.

### Done 2026-09-27: "M is bloby under 64. make it wider to compensate?" and "create EC / CM alternatives in squares"

Asked verbatim, together. The plain mark for the small sizes gets an M whose V arms are a full stem wide, 14 instead of 10, so its strokes weigh the same as the stems at 32 and 64; the wide mark keeps the drawn M. And a stacked mark, EC over CM, in the same four files plus a plain one, rendered at the same sizes beside the wide one on /ds for the owner to pick; the favicon stays the wide mark until then.
 ✅ Done: the plain marks carry the wide M, the stacked mark is four files plus a plain one, and both sets are rendered at the nine sizes on /ds.

### Done 2026-09-27: "drop thin lines below 128"

Asked verbatim. The icon sizes under 128 render from a plain square mark without the stave and the joins, which are 1.5 units and become smears; the SVG favicon, which browsers draw at 16 to 32, points at the plain one too.
 ✅ Done: logo-square-plain.svg and logo-stack-plain.svg, tools/icons.mjs renders 16 to 64 from them, the SVG favicon is the plain mark.

### Done 2026-09-27: "you need to consider the thin lines on logo as extra ornaments, in alignment the aligning / padding needs to consider E from left to M to right"

Asked verbatim. The stave hairlines past the M are ornament: every margin and centring of the mark is measured from the E's left edge to the M's right edge, and the stave hangs into the margin. The square marks are re-cut, the icons re-rendered, the rule written into the skill and the icons plan, and the header checked.
 ✅ Done: the squares are 354, margins from the letters, and after the later ask the stave runs to the edge; the header already aligned the E to the frame.

### Done 2026-09-27: "in bg work with logo. do in square positive and negative options (no subline), 1px outline and not, do classical icon sizes all the way to .ico"

Asked verbatim. A background agent draws the square mark from logo.svg without the tagline, positive and negative, with and without a 1px outline, and renders the classical icon sizes down to a multi-size .ico, with no new binary on this machine; it touches no existing page and reports the head lines to add. ✅ Done: public/icons/ holds the four SVGs, nine PNGs and favicon.ico, tools/icons.mjs renders them in headless Chrome and writes the ICO in plain Node, plans/plan-eccm-icons.md has the geometry and the unsettled list; the session put the marks and the sizes on /ds, the four head lines into every page and the chrome, and a manifest at /manifest.webmanifest. At 16 px the mark is four blobs; a true 16 px mark is the owner's call.

### Done 2026-09-27: three general rules, dictated

*"general rule: use jaanuar / veebruar etc on dates when you have space and jan / veebr ... when not (narrow cols / mobile). locations need to be links to gmaps but std udnerline might be too heavy. in body text perhaps use semibold or medium for bold"*. Dates with the month's name, long where there is room and the short form in narrow columns and the compact row; places as links to Google Maps with a lighter underline than a text link; bold in body text at a lighter weight. Into eccm.css, the rendered event page, the static list and event pages, and the eccm-ui skill; /ds after the bios agent hands the file back. ✅ Done: src/render/dates.mjs, the event template, eccm.css (a.place, .prose b at 600, .d-long and .d-short with the compact row showing the short one), the static list and event pages, and the skill; MEASURED on the shots: "30. september 2026" on the desk, "30. sept 2026" on the phone, places with the light line.

### Done 2026-09-27: "colour -> color"

Asked verbatim: American spelling on /ds, the heading and the page's own prose. Handed to the bios agent, which holds the file, so that two writers do not meet in it. ✅ Done in the same pass as the bio specimen, 3 occurrences.

### Done 2026-09-27: artist bios, "i do not see artist bios. how do desin them? in a box? how to deal with multiple bios? figure out your style bases on the skill ... how to model? are they just sections after body text. look up in data how currently performer bios are are prensented (inside body or out) multiple bios? photos (squares?) wor in bg"

Asked verbatim with Alissa Šnaider's bio pasted as the example. A background agent surveys eccm.ee's event pages for how bios appear today (inside the body, where, how many, with photos or not), decides the model (a section of the body, a per-event bio row attached to a credit line, or a person table) and the design from the eccm-ui skill, writes `plans/plan-eccm-bios.md`, and adds the specimen to /ds for the owner to judge. Nothing in the schema changes until the plan is read. ✅ plans/plan-eccm-bios.md written and the specimen on /ds: MEASURED on 13 eccm.ee event pages, 2 carry a bio, one each, inside the body before the credits, no heading, no photo anywhere; the model chosen is an event_bio row per event with text per language and an optional photo; the design a section after the body, names as prose headings, no box, a 5.5rem square photo when there is one.

### Done 2026-09-27: "add serif examples" and "add more space between examples / secions in ds"

Asked verbatim, one after the other. /ds gains a serif specimen in Source Serif 4 as a derived page sets it, on white with the body in it too, and on a dark derived ground with the body back in the sans; the face declaration moves from derive.html into eccm.css so it is declared once. The gaps between specimens and above sections each grow one step.

### Done 2026-09-27: "rm --eccm-t-s ... the measure of prose and of a title"

Asked verbatim, the whole type token table on /ds; the specimens stay.

### Done 2026-09-27: "rm , served from here."

Asked verbatim: the clause leaves the typography paragraph on /ds.

### Done 2026-09-27: "rb borders from color swwatched excep white in ds"

Asked verbatim: the colour swatches on /ds lose their border, the white one keeps it since it has no other edge.

### Done 2026-09-27: "rm One page of everything the new eccm.ee pages are made of. ..."

Asked verbatim: the opening paragraph of /ds goes; the page starts at its first heading.

### Done 2026-09-27: "ds page is in english"

Asked verbatim. /ds speaks English (its chrome, headings, captions and prose), with the English logo and menu; the specimens stay the site's Estonian, marked lang="et", because they show the site as it is.

### Done 2026-09-27: "ECCM saal, Herne 11A, Tallinn - where its from? it might be a post box but eccm venue is not there ... location is ECCM (pin icon). its At Estonian Centre of Contemporary Music, Pühavaimu 9, Tallinna, Estonia. -- i am surprised its not shown anywhere on page"

Asked verbatim. MEASURED: Herne 11A, 10135 Tallinn is the postal address on eccm.ee's contact page (plan-eccm-design.md line 247, read 2026-09-26), and the first shaping of public/event.html took it for the venue; the venue is Pühavaimu 9, which eccm.ee prints in its lists as "ECCM saal, Pühavaimu 9" and "Stuudio 1965, Pühavaimu 9" and, on the English event page only, as the map's geocoded address. ✅ Pühavaimu 9, Tallinn now in the seed and both databases, the static event, edit, derive and ds pages, and every footer (the footer names the place people go to; the postal address belongs on the contact page when it exists); the CMS and markup plans corrected the same way.

### Done 2026-09-27: "make /ds page for desing system elements. typography, buttons, logo. make 2 variants of logo, estonian and english and switch them on site header based on language. keep 2language logo version also around"

Asked verbatim. `public/ds.html` at /ds: the tokens with their values, every text style in use as a specimen, the buttons in both modes on the page ground and on a derived ground, the colours, and the three logos. `public/logo-et.svg` and `public/logo-en.svg` beside `public/logo.svg` (the two-language one, kept); the site header takes the language's one on the static pages and in the rendered chrome. ✅ Done and deployed; the one-language logos keep the mark and one tagline on the first baseline with the box cut to the ink below it, 310 by 133; the Estonian line alone sits left on the E's edge at its measured width rather than stretched. MEASURED: /ds parses, shots at 375 and 1280 with nothing sideways after the token table learned to stack on a phone.

### Done 2026-09-27: "rm Upcoming events / Design trial: the text and the picture are eccm.ee’s own as of 27.09.2026."

Asked verbatim: the two footer lines, the upcoming events link and the design trial line, leave the rendered chrome and every static page's footer. The edit form's own note that it saves nothing stays, since it is true and not a footer. ✅ Done in `src/render/chrome.mjs` and six static pages; MEASURED live: 0 matches on /, /event and /derive, the rendered footer one line.

### Done 2026-09-27: "deploy"

Asked verbatim, right after. The Worker carries a D1 binding now, so a deploy needs the remote database: session 6's first step, `wrangler d1 create eccm-staging`, its id into `wrangler.jsonc`, the migration and both seeds applied remotely, then the deploy and a curl per route on https://eccm.positron.studio. ✅ Done: database `3be30799-baa1-4844-937c-b4c6858fc915`, migration applied, 11 roles, 2 texts, 7 credits remotely; deployed; MEASURED live: both event routes 200 with hreflang pairs, the fallback URL 200 with its line and canonical, an unknown path 404, the static pages 200. Session 6 of the CMS plan is therefore done early except for the routes it lists that do not exist yet.

### Done 2026-09-27: "pin workerd in eccm"

Asked verbatim. The workerd binary is pinned by name and exact version in `package.json`, with an override so a wrangler bump cannot pull another, and its version and hash are written into CLAUDE.md beside the wrangler pin. ✅ Done: `workerd` 1.20260701.1 in devDependencies and overrides, the binary's hash unchanged after the reinstall, a local D1 query still answering.

### Done 2026-09-27: "Cms 1 and 2"

Asked verbatim after "Where to start?". Sessions 1 and 2 of `plans/plan-eccm-cms-step-1.md`: the migration with the seven tables, the D1 binding, `src/index.mjs` with the event route, the Gestures Estonian row seeded by hand and shown from D1; then the English twin, its route, the switch between twins and the fallback line. The two open decisions go with the plans' recommendations, the flat scheme JSON and the localised path words `/et/sundmused/` and `/en/events/`. Local D1 only; the remote database is session 6. ✅ Done: `migrations/0001_step1.sql`, `data/seed-step1.sql` and `seed-step2.sql`, `src/index.mjs` and `src/render/` (html, md, chrome, event), the `DB` binding in `wrangler.jsonc`. MEASURED on the dev server: `/et/sundmused/gestuurid-situatsioonid-ilma-partituurita-kuulamine` 200 and parsing, the English URL with the Estonian slug 200 with the fallback line and a canonical to the Estonian page, `/en/events/gestures-situations-listening-without-a-score` 200 with hreflang pairs both ways, an unknown path 404, the static pages still 200; shots at 375 and 1280. ⚠️ Two things found on the way: this laptop kills the workerd of wrangler 4.141, so wrangler is pinned to 4.107.0 (CLAUDE.md); and the credits list collapsed its second column at desk width on the static page too, fixed by one line in `eccm.css`. Not deployed: the Worker needs the remote database of session 6.

### Done 2026-09-27: "a good story on sitemap, on RSS, and also a fallback story for existing links which need to map to the new URLs, maybe simpler ones. I want to lose that PHP thing from a URL, but how to keep old links working. Also SEO, redirection, consideration, etc."

Asked verbatim, mid-task. An inventory of eccm.ee's URL shapes as fetched today, a simpler URL scheme without `index.php`, the redirect story (a table from a crawl plus pattern rules, 301, one hop, kept for years), the sitemap and RSS from D1 in two languages, and what trip already has for both. Written to `plans/plan-eccm-urls-sitemap-rss.md`, not executed. ✅ 453 lines: 228 old URLs inventoried in ten shapes, `/et/sundmused/{slug}` and `/en/events/{slug}` with ASCII slugs, three redirect layers keyed on language and Joomla id, one sitemap with language pairs, RSS 2.0 and an iCalendar feed per language, sessions 7 to 10; the CMS plan gained a section 11 taking its URL scheme.

### Done 2026-09-27: "look up trip image handling in the posts and index pages, size optimizations, responsive and size handling and 2x and all that stuff"

Asked verbatim, mid-task. A reading of trip's image pipeline for pages (not cards): originals, transforms, variants, srcset and sizes, 2x, formats, the CLS attributes, caching and the free tier, and what eccm takes for its list, event page and the derive reading. Written to `plans/plan-eccm-images.md`, not executed.

### Done 2026-09-27: "look up what, how should we mark up the event pages. What is the standard here?"

Asked verbatim, mid-task, after the credits assessment mentioned schema.org. The standard for an event page: schema.org Event and MusicEvent as JSON-LD, what Google requires and recommends, the HTML5 semantics, hreflang and Open Graph for two languages, ics, what eccm.ee and arvopart.ee carry today. Written to `plans/plan-eccm-event-markup.md` with a worked example for event 134, not executed. ✅ `plan-eccm-event-markup.md`, 466 lines: MusicEvent as JSON-LD, the HTML5 skeleton off event.html, the two-language head, event 134 mapped onto the seven tables; neither eccm.ee nor arvopart.ee carries event structured data.

### Done 2026-09-27: "do it", the credits shape and the plain router, into both plans

After the assessment of the per-language question, of credits modelling and of Astro: the CMS step 1 plan gets credit lines (a role key from a translated dictionary, names typed once, organisation names per language, a free-text role for one-offs) in place of the per-language credits JSON, and both plans state that the router is plain JavaScript, no Astro, with the numbers measured on trip's build. ✅ Done: the CMS plan is seven tables now (`role` and `event_credit` added, `event_text.credits` gone), its section 1 carries the measured three kinds of credit content and section 3 the seed rule for them, its section 4 the no-framework paragraph with the sizes; the social plan's no-Astro bullet carries the same numbers.

### Done 2026-09-27: plans, not execution, for the next steps on the eccm side

Asked verbatim (dictated): *"Let's make a plan in ECCM side. What are the next steps? Uh, I'd like you to uh, make maybe several plans. One of them is the first step in uh, CMS side. So take a couple of pages uh, of uh, current ECCM content, multilingual. Take your plan from the Positron side about uh, CMS schema or actually bring it over. Bring all the ECCM uh, plans over to uh, from Positron to ECCM. And uh, whatever your old plan says, let's go it very slowly, very kind of step by step. And at first uh, just have a the data in D1 in a schema and uh, you show it we don't even do the editing yet mm, in parallel research uh, the uh, OG uh, images generation uh, Facebook image generation and Instagram images generation from um, from trip so one uh, in directory one level up and down to trip and it has full implementation of uh, social media image generation so look it up uh, and note that the whole pipeline need to work together with this uh, our uh, style detection from uh, images so That data which will travel along the content you need to also figure out the schema out where to store those um, CSS variable values for the posts um, we need um, it in OG as well I think it's not a problem because OG will be generated after the content is being created or saved or updated I have some ideas uh, how a social media should look, so don't do anything yet there visually, just investigate the pipeline. Um, so if you are done with planning, give me your plans and don't execute any of the plans yet."*

Two plans in `plans/`, written in parallel and reported in full, nothing executed: (1) the CMS first step, a couple of eccm.ee pages in ET and EN as rows in a D1 schema and shown read-only, no editing, from `plan-eccm-cms.md`; (2) the social image pipeline as `~/personal/trip` implements it, and how it meets the derive page's scheme, including where the scheme's CSS variable values live beside a post. ✅ The four eccm plans are already here since the move-out; positron holds no other (its `plan-radio-messages.md` names eccm.ee's radio archive, not this project). ✅ Both plans written the same afternoon, `plan-eccm-cms-step-1.md` (473 lines, five tables, six sessions) and `plan-eccm-social-images.md` (525 lines, trip's resvg-wasm pipeline and how the scheme feeds it), each with a section 10 reconciling the one shape they disagreed on. Nothing executed.

### Done 2026-09-27: "Add new set of derived examples"

Asked verbatim. A fourth set on `public/derive.html`, the default, from the
next six pictured past events going backwards from set three's last (31.05.2026),
skipping pictures already used by an earlier set. ✅ Set four is the six from 27.05.2026 back to 09.05.2026 (Improtest: Post Horn, Residentuu:r 4, OPEN SPACE #4, Schönbergi sari, Puutetundlikkus, Improtest: Baumann / Pietilä / Soo); Eesti / Biofoonia on the way carries the picture set one has for Surm. MEASURED: four dark grounds, two light greys, two accents, no serif. ⚠️ Residentuu:r 4 read 90 per cent serif on a bold sans until the foot test learned that a bar the width of the glyph is not a foot (a serif foot stays under seven tenths of the glyph); Sound Plasma and Improtest keep their serif verdicts through it. ⚠️ Schönbergi sari, a warm abstract, gets a dark brown ground, hue 35 at chroma 0.06, which sits just outside the mud band of 40 to 110 and reads brownish; left as the rules give it, for the owner to judge.

