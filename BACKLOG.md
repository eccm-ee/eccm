# Backlog

What has been asked for and not yet done. A request lands here before it is
worked on, verbatim, and leaves by being finished or refused in writing.
Earlier eccm lines, up to the move-out of 2026-09-27, are in positron's
`BACKLOG.md`.

## Open

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

### Open 2026-09-27: "look up what, how ✅ `plan-eccm-images.md`, 394 lines: trip rents every rendition from a hashed R2 master through one URL function; three ladders for eccm; the 300 px thumbnails are soft on 2x and the masters exist on eccm.ee as og:image. should we mark up the event pages. What is the standard here?"

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

