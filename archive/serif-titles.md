# Serif titles from the picture's type, removed 2026-10-07

Asked, verbatim, 2026-10-07: *"rm serif title discovery and sttyling. leave knowedge"*.

From 2026-09-27 to 2026-10-07 the detector in `public/scheme.mjs` read not only a picture's colours but
whether the type in it was a serif, and an event whose picture read as one set its title, its prose
headings and (on a ground near white) its body in a serif; the share card drew its title in the same
serif. The colour half stays: the ground, the two inks, the accent, the button and the dark half
(`darkOf`) are read and stored exactly as before, `DETECTOR_V` is 2, and the scheme carries no face.
Rows stored before still hold `titleFace`, `titleWeight`, `bodyFace` and `serif`; the event page ignores
them and `cleanScheme` drops them from anything an old editor posts. Body and headings are Public Sans and
Instrument Sans everywhere since the same day's type change (`public/eccm.css`).

Everything removed is in git at 6312ed1, the last commit with it:

    git show 6312ed1:public/scheme.mjs          # readType, scheme's serif fields, SERIFS, bodySerif, contract
    git show 6312ed1:public/derive.html         # the ?serif= switch and the type row of each card
    git show 6312ed1:public/type.html           # the ten serifs H to Q and the derived page's three uses
    git log --diff-filter=D --name-only -1 -- public/vendor src/og/fonts   # the font files the removal deleted

## What the detector did

`readType(img)` drew the picture at up to 600 px wide and thresholded it by its own polarity: mean
luminance over 0.5 meant dark type on light (ink under 0.35), otherwise light type on dark (ink over
0.65). Then:

1. **Rules are not letters.** A horizontal run longer than a tenth of the width (at least 24 px) was
   erased first. The Gestures poster draws three rules through its words and on the first pass they
   welded every letter into one shape (MEASURED: 4 text-like shapes on a poster with 17 letters).
2. **Connected components, 8 neighbours**, kept as text-like when 7 to 80 px tall, 3 to 120 px wide, no
   wider than 2.5 times their height, filled 15 to 75 per cent, and at least 16 pixels.
3. **Type sits in lines.** A shape counted only with three or more others of like height (0.6 to 1.6
   times) whose bottoms sat within a fifth of that height and within twelve heights sideways. Without
   this, three photographs read as serif from their grain (MEASURED on the first pass).
4. **The 14 px letter and 3 px stem floor.** A serif was judged only on a letter 14 px tall or more with
   a median stem of 3 px or more. Below that a serif is one pixel, antialiasing is half a stroke and a
   capital's bar reads as a foot: MEASURED 2026-09-27 on the Ludensemble poster at 300 px, letters 7 to
   9 px tall with 2 px stems, 15 of 15 read as serif in a geometric sans (asked: *"why serif? no serifs
   on image"*). The same floor took the Huddersfield photograph's arrows, 2 px strokes, out of a serif
   verdict they had made on their own.
5. **Two signs per letter.** Stroke contrast, (90th minus 10th percentile of the stroke runs) over their
   median, and the foot: the widest run in the top or bottom 14 per cent of the letter over the median
   width of its middle. A letter was serif-like when contrast was 0.9 or more **or the foot 1.8 or
   more**.
6. **A bar the width of the glyph is not a foot.** A run counted as a foot only when it stayed under
   seven tenths of the glyph's width. MEASURED 2026-09-27: the Residentuu:r 4 poster's bold sans
   capitals, 19 px tall, carried "feet" of 13 to 15 px on 15 to 18 px glyphs and read 90 per cent
   serif; Sound Plasma's real serifs run 11 to 15 px on 23 to 28 px glyphs, and 9 of 11 passed with or
   without the rule.
7. **The verdict, from eight letters or more:** serif at a serif-like share of **0.45** or more, sans at
   **0.25** or less, unsure between. Under eight judged letters it said "type too small to read for
   serifs" when eight or more text-like shapes were found, and "no type found" otherwise.

Gestures was the case the detector could not see: its letters lie on a dark disc under three rules, so
it was marked serif by hand (`serifByHand` on `derive.html`, `HAND` in `tools/scheme.mjs`). On the nine
seeded pictures of 2026-09-30 no picture's type was readable at 600 px, so Gestures was the only serif
event, by hand; set four on the derive page (27.05 back to 09.05.2026) read no serif at all. On the
derive page's own sets, Sound Plasma and Improtest read as serif and kept that verdict through the foot
rule.

## What the page did with it

- The title and the prose headings took the serif (`--ev-title-face`, weight 400 by `--ev-title-weight`).
  The facts and the credits took it too until 2026-10-02, when they went back to the sans (*"in serif
  social cards use sans serif for meta info. same for event pages"*).
- **The body took it only on a ground near white**, relative luminance 0.8 or more (`bodySerif`), and
  never on a dark ground or a darker light one: the Gestures sage stayed sans (asked 2026-09-27). A
  light scheme gone dark with the site's theme set its body back in the sans for the same reason.
- The serif's latin file was preloaded on such an event, and the fallback over Georgia was
  metric-matched so the swap moved nothing (Roboto Serif at 111.01 per cent of Georgia, Newsreader
  91.38; MEASURED in headless Chrome over one Estonian and English line). Newsreader's width had to be
  taken at body size: its optical size axis draws 10 per cent narrower at 100 px than at 18.
- The share card drew a serif title in Roboto Serif instanced at optical size 72 (a second instance at
  30 for the meta, later dropped for the sans). Its size was the one the sans would take for the same
  title (asked 2026-10-01: *"same font size to sans serif"*), since Roboto Serif sets wider and fitting
  it on its own widths put titles a step smaller; it then wrapped at that size and stepped down only when
  it did not fit. `TEMPLATE_V` went to 17 when the branch left, so no card with a serif title is served
  again.

## The faces tried

Source Serif 4 first. On 2026-09-27, asked for ten modern alternatives (*"no garamod"*), a page showed
Newsreader, Fraunces, Piazzolla, Literata, Bodoni Moda, Brygada 1918, Petrona, Besley, Roboto Serif and
Instrument Serif, each in the derived page's three uses; Newsreader ranked first for its optical size
axis (a text cut that holds its counters at 18 px, a display cut that carries a title at 400). The
owner's picks then ran: Literata (*"use literata now on the derived page"*, 2026-09-27); Roboto Serif
for an hour on 2026-09-28 (*"replace literata with roboto serif"*); Literata again; Newsreader the same
day (*"use newsreader in derive"*); and Roboto Serif from 2026-10-01 (*"change serif to Roboto Serif"*),
chosen with Instrument Sans, a serif the type page described as made to sit beside a grotesk, with Newsreader and Literata kept
as the derive page's alternatives until today.

## Lessons worth keeping

- **Read type only where it is big enough to have a serif.** A floor in pixels of letter height and
  stem, not a share threshold, is what stopped every false serif.
- **Grain and rules masquerade as letters.** Ask for lines of like shapes, and erase long runs first.
- **A foot is a widened stem end, never a full-width bar.**
- **Pictures whose type the reader can see may hide it from a detector** (Gestures). A verdict needs a
  hand override or it is wrong on the case the owner looks at first.
- **A second face on a derived page doubles the font work:** a preload, a measured fallback, a width
  taken at body size, a legibility rule per ground, and a second set of card TTFs.
