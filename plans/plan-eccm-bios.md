# Artist bios: how eccm.ee carries them, how the rows hold them, how the page draws them

Asked 2026-09-27, verbatim: *"i do not see artist bios. how do desin them? in
a box? how to deal with multiple bios? figure out your style bases on the skill
... how to model? are they just sections after body text. look up in data how
currently performer bios are are prensented (inside body or out) multiple
bios? photos (squares?)"*, with Alissa Šnaider's five paragraphs and her link
as the example.

**The marks.** MEASURED is a number taken 2026-09-27 off a saved eccm.ee page
with `survey-bio.mjs` in the session's scratchpad; READ is a file named; MEMORY
is not checked today.

## The verdict

On eccm.ee a bio is rare, and when it exists it is paragraphs inside the body,
after the description and before the credit lines, with no heading, no bold
name, no photo, and the link as a bare URL on its own line. Thirteen event
pages read: one person bio (Alissa Šnaider, on the Gestures pages in both
languages), one ensemble bio (Ludensemble, 77 words), and nothing else;
performers appear far more often as a list with instruments. So bios are
modelled as their own rows from the start, because the page has to draw them
differently from the body (a name that is a heading, a link that is a line, a
photo slot), and because the same paragraphs already travel in two languages.
Step 1 takes an `event_bio` row per event with a text row per language and an
optional photo, not a person table yet: nothing on eccm.ee today reuses a bio
across events, and a person table is a one column migration from this shape
when person pages are wanted. The design is the skill's: no box, no tint, no
rule, the name an h2 in the prose register, the paragraphs at the measure, the
link the last line, bios one after another with the between-group gap three
steps above the within-group gap, and a photo, when there is one, as a plain
square at 5.5rem beside the name on a desk and above it on a phone.

## 1. The survey, MEASURED

Thirteen pages: the four saved on 2026-09-27 for the CMS plan (events 134 and
135, 109 and 110) and nine fetched today, one at a time, chosen for likely
bios. URLs fetched today, all under `https://eccm.ee/index.php/et/`:
`122-sound-plasma-10/2026-11-12-19-00`,
`syndmusest/moeoedunud-suendmused/103-improtest-post-horn/2026-05-27-19-00`,
`syndmusest/moeoedunud-suendmused/97-open-space-4/2026-05-16-19-00`,
`syndmusest/moeoedunud-suendmused/147-ema-varssavi-suegisel/2026-09-21-17-00`,
`syndmusest/moeoedunud-suendmused/119-tallinna-uue-muusika-ansambel-varssavi-suegisel/2026-09-21-19-30`,
`syndmusest/moeoedunud-suendmused/138-ludensemble-esitleb-gerard-grisey-vortex-temporum-ja-terry-riley-in-c/2026-09-13-18-00`,
`129-uus-kontserdisari-up-to-three-kuni-kolm/2026-12-05-19-00`,
`syndmusest/moeoedunud-suendmused/101-joy-muba-uue-muusika-ansambli-kontsert/2026-05-31-19-00`,
`105-scrapyard-3/2026-10-10-19-30` (nine, one over the eight the brief
allowed, because Scrapyard was the one upcoming TUMA production not yet
saved).

| event | body words | bio | where | how many | bio words | heading or bold name | photo | link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 134 Gestures ET | 672 | person, Alissa Šnaider | after the two description sections, before the credit lines | 1 | 139 in 5 paragraphs | none, the name opens the first sentence | none | bare URL on its own line after the last paragraph |
| 135 Gestures EN | 908 | the same, translated | the same, then one more body paragraph after the link | 1 | 142 in 5 paragraphs | none | none | the same bare URL |
| 138 Ludensemble | 356 | ensemble | fourth of five paragraphs, after the programme, before the line-up | 1 | 77 | none | none | none |
| 109, 110 Feldman | 47, 61 | none, performers named with instruments in the first sentence | | 0 | | | none | one link in the collaboration line |
| 97 Open Space 4 | 135 | none, a bold `Esitajad:` list of three | | 0 | | | none | none |
| 101 JOY | 87 | none, a bold `Esitajad:` list with instruments | | 0 | | | none | none |
| 119 TUMA Warsaw | 64 | none, a programme in bold lines | | 0 | | | none | none |
| 147 EMA Warsaw | 65 | none, a programme and an organiser line | | 0 | | | none | one bare URL |
| 122 Sound Plasma | 79 | none, a programme in bold lines | | 0 | | | none | none |
| 129 Up to Three | 114 | none, the format described | | 0 | | | none | none |
| 105 Scrapyard | 65 | none, TUMA described as the description | | 0 | | | none | none |
| 103 Improtest | 11 | none, "more info soon" | | 0 | | | none | two bare URLs |

Findings: 2 of 13 pages carry a bio, never more than one a page, always inside
the body and never in a field of their own (iCagenda has no bio field; its
`ic-info` box holds phone, email, website and tickets, READ on every page);
the bio's place is after the description and before the credit lines; no page
marks the bio with a heading or a bold name, and the reader knows it is a bio
because the first sentence is `Name on ...`; **0 images inside any of the 13
bodies**, so no performer photo exists on the site today and the only picture
is the event picture; links are bare URLs on their own line (3 pages) or an
anchor in a credit line (1 page); the Estonian and English Gestures pages
carry the same bio in translation with the same five paragraphs. Performers
are a list with instruments on 4 of 13 pages, which is the credits model's
`people` with a `note`, already in the schema.

## 2. The model

Three shapes weighed.

| shape | gives | costs | verdict |
| --- | --- | --- | --- |
| paragraphs inside the body markdown, as today | zero schema, the editor types where eccm.ee types | the page cannot draw a name as a heading, a link as a line or a photo, without the editor writing markup; nothing joins a bio to the credit line or to the JSON-LD `performer`; two languages drift as the credits did | the state to migrate from |
| `event_bio` per event, ordered, text per language, optional photo | the page draws it, the markup joins it by name, the seed maps Alissa's paragraphs in one pass, a photo has a slot, nothing on eccm.ee today reuses a bio | no reuse across events, no person page | **step 1** |
| a `person` table, bio and photo on the person, referenced from the credits | reuse, person pages, one bio per person | every credit name becomes an entity before it is needed, and the survey shows bios written for the event (Alissa's is about Gestures) | later, one column away |

The migration, `migrations/0002_bios.sql`:

```sql
-- 0002_bios.sql: a bio is its own row, per event and in order, with a text
-- row per language and an optional photo; the name is the one on the credit
-- line so the page and the JSON-LD can join them (plans/plan-eccm-bios.md)
CREATE TABLE event_bio (
  id          INTEGER PRIMARY KEY,
  event_id    INTEGER NOT NULL REFERENCES event(id) ON DELETE CASCADE,
  position    INTEGER NOT NULL,
  name        TEXT NOT NULL,                 -- 'Alissa Šnaider', as typed on the credit line
  url         TEXT NOT NULL DEFAULT '',      -- 'https://www.snaider.ee/2', the last line
  photo_id    INTEGER REFERENCES media(id)   -- NULL today on every page eccm.ee has
);
CREATE INDEX event_bio_event ON event_bio (event_id, position);
CREATE TABLE event_bio_text (
  bio_id      INTEGER NOT NULL REFERENCES event_bio(id) ON DELETE CASCADE,
  lang        TEXT NOT NULL CHECK (lang IN ('et','en')),
  body        TEXT NOT NULL DEFAULT '',      -- markdown, paragraphs and inline marks only, no headings
  PRIMARY KEY (bio_id, lang)
);
```

The fallback is the body's: a bio with no text row in the page's language is
drawn from the Estonian row with `lang="et"`. An ensemble bio (Ludensemble)
is the same row with the ensemble's name. When a person table comes, it is
`ALTER TABLE event_bio ADD COLUMN person_id INTEGER REFERENCES person(id)`
and a script that moves texts up where an editor says they are the person's
and not the event's.

The seed for event 134: one `event_bio` (event 1, position 1, `Alissa
Šnaider`, `https://www.snaider.ee/2`, no photo); `event_bio_text` `et` with
the five paragraphs that `data/seed-step1.sql` carries today under `##
Alissa Šnaider`, and `en` with the five under the same heading in
`seed-step2.sql`; both bodies lose that heading, the paragraphs and the link
line, and the English body keeps its closing "A public gesture" paragraph,
which is not bio. The name matches the `dramaturge` credit line's person.

The markup plan's JSON-LD takes it by name: a bio whose name is on a
`performers` or `artists` line becomes the `performer` entry's `description`
(the first paragraph, plain) and `sameAs` (the url); on any other credit line
it is the `contributor` entry's; an ensemble is a `PerformingGroup` with the
same two properties; a photo, when one exists, is the entry's `image`. No new
schema.org type is needed (READ, plans/plan-eccm-event-markup.md section 5's
mapping table).

## 3. The design

From `.claude/skills/eccm-ui/SKILL.md` §1 to §3 and `positron-compose` §1
and §4 (READ): hierarchy is size and space, never a rule, a box or a tint;
the gap between groups is two scale steps above the gap within; a picture is
plain and drawn at its own size.

- **Where.** A section after the body and before the credits, the place
  eccm.ee already puts it. No heading of its own: the names are the headings,
  and the credits' "Tegijad" heading follows at its 2lh.
- **The name** is an `h2` in the prose register, `--eccm-t-l` at weight 400,
  exactly what a sub-heading in the body is, so a reader meets no new size.
- **The paragraphs** sit at the measure, 66ch, with the body's own rhythm
  between them (the `.flow` owl).
- **The link** is the last line, the domain as the text, the body's underline.
- **Several bios** follow one another in one column, `--eccm-s-12` between
  bios against `--eccm-s-4` between a name and its text, three steps on the
  scale, one more than the two the rule asks for, so a bio never reads as a
  paragraph of the one before it (compose §1); no rule between them, nothing painted under any of
  them (eccm-ui §1, the ladder stopping on its first rung).
- **The photo**, when a row has one, is a square at 5.5rem, the compact row's
  thumbnail size and already a size the system draws, `object-fit: cover`,
  plain, no radius; on a desk it stands in a first column beside the name and
  the text hangs off the second, on a phone (under 40rem) it sits above the
  name in one column. When there is no photo the bio is one column and
  nothing reserves the slot, which is what every page on eccm.ee gets today:
  the survey found no performer photo on the site, so step 1 draws none and
  the slot waits for the first upload. A square rather than the list's 3:2
  because a portrait crops to a square and a 3:2 slot beside a name reads as
  a second event picture.
- **The markup** the event template renders, replacing today's `## Alissa
  Šnaider` inside the prose:

```html
<section class="bios">
  <article class="bio">
    <img class="bio-photo" src="…" width="88" height="88" alt="">   <!-- only when photo_id -->
    <h2>Alissa Šnaider</h2>
    <div class="flow"><p>…</p><p>…</p></div>
    <p class="bio-link"><a href="https://www.snaider.ee/2">snaider.ee</a></p>
  </article>
</section>
```

- **The rules**, page-local on `/ds` today and moved into `eccm.css` the
  session the event template renders bios:

```css
.bios { display: grid; row-gap: var(--eccm-s-12); max-inline-size: var(--eccm-measure); margin-block-start: 2lh; }
.bio { display: grid; row-gap: var(--eccm-s-4); }
.bio:has(.bio-photo) { grid-template-columns: 5.5rem minmax(0, 1fr); column-gap: var(--eccm-s-6); }
.bio:has(.bio-photo) > :not(.bio-photo) { grid-column: 2; }
.bio-photo { inline-size: 5.5rem; block-size: 5.5rem; object-fit: cover; grid-row: 1 / span 3; }
.bio h2 { font-size: var(--eccm-t-l); margin: 0; }
.bio-link { margin: 0; }   /* the paragraphs inside .flow keep the body rhythm */
@media (max-width: 40rem) { .bio:has(.bio-photo) { grid-template-columns: minmax(0, 1fr); } .bio:has(.bio-photo) > * { grid-column: 1; } .bio-photo { grid-row: auto; } }
```

The specimen on `/ds` shows three bios under the typography specimens:
Alissa's real Estonian text, and two placeholders of two sentences each on
credit names, one with a placeholder photo, marked as such in a comment.

## 4. The sessions this adds

- **Session 3b**, after the scheme column: `0002_bios.sql`, the two seed
  files rewritten so the bio leaves the body, the template's `bios` section,
  the rules into `eccm.css`; verified by one curl of each language route
  reading the `bios` section, `check-html` on the curl, one shot at 375 and
  1280.
- The JSON-LD join lands with the head, in the session the markup plan's
  head is rendered.
- The photo slot is exercised the session the first portrait is uploaded;
  until then it is a rule nothing hits.

## 5. Unsettled

- Whether ECCM has performer portraits at all, and in what shape: the site
  has none, so the square is a decision from the skill, not from data; the
  first upload settles it.
- Whether a bio should ever be reused across events: the survey says not
  today; the person table waits for the day an editor writes the same bio
  twice.
- The Ludensemble line-up sentence ("Tallinna Arhitektuuribiennaalil
  musitseerivad ... Maria Luisk (flööt), ...") is a performers credit line
  with notes, not a bio, and the seed should split it that way when that
  event is imported.
