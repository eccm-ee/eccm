# Backlog

What has been asked for and not yet done. A request lands here before it is
worked on, verbatim, and leaves by being finished or refused in writing.
Earlier eccm lines, up to the move-out of 2026-09-27, are in positron's
`BACKLOG.md`.

## Open

### Open 2026-09-27: "look up trip image handling in the posts and index pages, size optimizations, responsive and size handling and 2x and all that stuff"

Asked verbatim, mid-task. A reading of trip's image pipeline for pages (not cards): originals, transforms, variants, srcset and sizes, 2x, formats, the CLS attributes, caching and the free tier, and what eccm takes for its list, event page and the derive reading. Written to `plans/plan-eccm-images.md`, not executed.

### Open 2026-09-27: "look up what, how should we mark up the event pages. What is the standard here?"

Asked verbatim, mid-task, after the credits assessment mentioned schema.org. The standard for an event page: schema.org Event and MusicEvent as JSON-LD, what Google requires and recommends, the HTML5 semantics, hreflang and Open Graph for two languages, ics, what eccm.ee and arvopart.ee carry today. Written to `plans/plan-eccm-event-markup.md` with a worked example for event 134, not executed.

### Done 2026-09-27: "do it", the credits shape and the plain router, into both plans

After the assessment of the per-language question, of credits modelling and of Astro: the CMS step 1 plan gets credit lines (a role key from a translated dictionary, names typed once, organisation names per language, a free-text role for one-offs) in place of the per-language credits JSON, and both plans state that the router is plain JavaScript, no Astro, with the numbers measured on trip's build. ✅ Done: the CMS plan is seven tables now (`role` and `event_credit` added, `event_text.credits` gone), its section 1 carries the measured three kinds of credit content and section 3 the seed rule for them, its section 4 the no-framework paragraph with the sizes; the social plan's no-Astro bullet carries the same numbers.

### Done 2026-09-27: plans, not execution, for the next steps on the eccm side

Asked verbatim (dictated): *"Let's make a plan in ECCM side. What are the next steps? Uh, I'd like you to uh, make maybe several plans. One of them is the first step in uh, CMS side. So take a couple of pages uh, of uh, current ECCM content, multilingual. Take your plan from the Positron side about uh, CMS schema or actually bring it over. Bring all the ECCM uh, plans over to uh, from Positron to ECCM. And uh, whatever your old plan says, let's go it very slowly, very kind of step by step. And at first uh, just have a the data in D1 in a schema and uh, you show it we don't even do the editing yet mm, in parallel research uh, the uh, OG uh, images generation uh, Facebook image generation and Instagram images generation from um, from trip so one uh, in directory one level up and down to trip and it has full implementation of uh, social media image generation so look it up uh, and note that the whole pipeline need to work together with this uh, our uh, style detection from uh, images so That data which will travel along the content you need to also figure out the schema out where to store those um, CSS variable values for the posts um, we need um, it in OG as well I think it's not a problem because OG will be generated after the content is being created or saved or updated I have some ideas uh, how a social media should look, so don't do anything yet there visually, just investigate the pipeline. Um, so if you are done with planning, give me your plans and don't execute any of the plans yet."*

Two plans in `plans/`, written in parallel and reported in full, nothing executed: (1) the CMS first step, a couple of eccm.ee pages in ET and EN as rows in a D1 schema and shown read-only, no editing, from `plan-eccm-cms.md`; (2) the social image pipeline as `~/personal/trip` implements it, and how it meets the derive page's scheme, including where the scheme's CSS variable values live beside a post. ✅ The four eccm plans are already here since the move-out; positron holds no other (its `plan-radio-messages.md` names eccm.ee's radio archive, not this project). ✅ Both plans written the same afternoon, `plan-eccm-cms-step-1.md` (473 lines, five tables, six sessions) and `plan-eccm-social-images.md` (525 lines, trip's resvg-wasm pipeline and how the scheme feeds it), each with a section 10 reconciling the one shape they disagreed on. Nothing executed.

### Done 2026-09-27: "Add new set of derived examples"

Asked verbatim. A fourth set on `public/derive.html`, the default, from the
next six pictured past events going backwards from set three's last (31.05.2026),
skipping pictures already used by an earlier set. ✅ Set four is the six from 27.05.2026 back to 09.05.2026 (Improtest: Post Horn, Residentuu:r 4, OPEN SPACE #4, Schönbergi sari, Puutetundlikkus, Improtest: Baumann / Pietilä / Soo); Eesti / Biofoonia on the way carries the picture set one has for Surm. MEASURED: four dark grounds, two light greys, two accents, no serif. ⚠️ Residentuu:r 4 read 90 per cent serif on a bold sans until the foot test learned that a bar the width of the glyph is not a foot (a serif foot stays under seven tenths of the glyph); Sound Plasma and Improtest keep their serif verdicts through it. ⚠️ Schönbergi sari, a warm abstract, gets a dark brown ground, hue 35 at chroma 0.06, which sits just outside the mud band of 40 to 110 and reads brownish; left as the rules give it, for the owner to judge.

