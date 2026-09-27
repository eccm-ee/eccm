# The square marks and the icons, 2026-09-27

Asked, verbatim: *"in bg work with logo. do in square positive and negative
options (no subline), 1px outline and not, do classical icon sizes all the way
to .ico"*. Everything below was made and measured today; nothing is on a page
yet, and the head lines at the end are what a page adds when the session
decides to.

## 1. The four square marks, `public/icons/`

| file | ground | mark | outline |
| --- | --- | --- | --- |
| `logo-square.svg` | #ffffff | #1a1a1a | none |
| `logo-square-neg.svg` | #1a1a1a | #ffffff | none |
| `logo-square-outline.svg` | #ffffff | #1a1a1a | 1 px in the ink |
| `logo-square-neg-outline.svg` | #1a1a1a | #ffffff | 1 px in white |

**The geometry, all in the units of `logo.svg`, whose numbers are pixel
coordinates of the JPEG eccm.ee serves.** The mark without the tagline is the
group of four capitals, five stave hairlines and three joins: 310 wide (x 35
to 345) and 93 tall (y 29 to 122), READ off `logo.svg`. The square is 366 on a
side: the mark's width plus a margin of 28 at each side, which is two of the
mark's own 14 unit stem, so the air is a multiple of the mark's unit and not a
percentage picked by eye (the mark fills 84.7 per cent of the width). A mark
aligns to ink (eccm-ui, LESSONS 122 in positron), so the margin is measured
from the ink box, and the group is translated by (-7, 109.5) to land there.

**Vertical placement, the optical centre.** The mark is wider than tall, and
its own middle is not its box's middle: the E's middle bar runs from y 67 to
80, centre 73.5, while the box's centre is 75.5. The mark sits with the E's
bar on the square's centre line, which puts the ink box 2 units above the
geometric centre. That is the direction the eye asks for (a wide object
centred geometrically reads as sitting low) and the magnitude is the mark's
own rather than a typed percentage, which positron-compose §2 asks of any
optical correction: derived from the object, not eyeballed.

**The outline** is a rectangle on the square's edge with a 2 device pixel
stroke and `vector-effect="non-scaling-stroke"`: the stroke is centred on the
edge, the outer half is clipped by the viewport, and exactly 1 px stays inside
at every rendered size. A 1 px stroke inset by half a unit would scale with
the drawing and be a hair at 16 px and a bar at 512.

## 2. The raster sizes, `tools/icons.mjs`

Rendered from `logo-square.svg` by headless Chrome over CDP, the way
`tools/shot.mjs` drives it: one page per size with the SVG as an `<img>` at
exactly n by n CSS px on a 1x screen, so each raster is the browser's own
downscale of the vector, then `Page.captureScreenshot` with a clip of n by n.
The picture travels as a data URI inside a data URI page, because a page at a
data URL is an opaque origin and may not load a `file://` picture (MEASURED on
the first run: nine broken image glyphs, 109 to 2,588 bytes each). The ICO is
written in plain Node with PNG entries: a 6 byte header, a 16 byte directory
entry per image, the PNG bytes; every current browser accepts PNG entries.
No binary was installed. MEASURED by reading every file back
(`node tools/icons.mjs`, which parses each PNG's IHDR and the ICO directory):

| file | pixels | bytes |
| --- | --- | --- |
| icon-16.png | 16 by 16 | 314 |
| icon-32.png | 32 by 32 | 599 |
| icon-48.png | 48 by 48 | 918 |
| icon-64.png | 64 by 64 | 1,213 |
| icon-128.png | 128 by 128 | 2,129 |
| icon-180.png (apple-touch-icon) | 180 by 180 | 2,802 |
| icon-192.png (manifest) | 192 by 192 | 2,973 |
| icon-256.png | 256 by 256 | 3,928 |
| icon-512.png (manifest) | 512 by 512 | 7,715 |
| favicon.ico | 16, 32, 48 as PNG entries at offsets 54, 368, 967 | 1,885 |

**The 16 px verdict, from the enlarged looks (`tmp/shots/icon-16-x8.png` and
`icon-32-x8.png`, the rasters at 8x with no smoothing).** At 32 the four
letters read as E C C M and the joins are faint grey; the stave is a smudge.
At 16 the mark is four grey blobs on white: the stems are 14 units of 366,
which is 0.6 px, the hairlines are 1.5 units, which is 0.07 px, and nothing
survives. A 16 px version would have to be a different drawing: drop the
stave and the joins, thicken the four letters to a whole pixel or two, and
probably lose the C's counters. Not drawn; that is the owner's call. Until
then the ICO's 16 entry is the honest downscale and a browser tab shows a
grey mark.

## 3. The head lines a page adds

```html
<link rel="icon" href="/icons/logo-square.svg" type="image/svg+xml">
<link rel="icon" href="/icons/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="apple-touch-icon" href="/icons/icon-180.png">
<link rel="manifest" href="/manifest.webmanifest">
```

and in `manifest.webmanifest`:

```json
{ "name": "ECCM", "short_name": "ECCM", "icons": [
  { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
  { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" } ] }
```

Every page today carries `<link rel="icon" href="data:,">`, which is the
line these replace.

## 4. Unsettled

- A 16 px mark of its own, section 2; nothing here decides it.
- Android's maskable icons keep only the inner 80 per cent circle safe, and
  the mark fills 84.7 per cent of the width, so a `purpose: maskable` icon
  would need a wider margin (a 20 per cent one) as a separate file; not made.
- Dark tabs: an SVG favicon can carry a `prefers-color-scheme` rule and draw
  the negative on a dark tab bar; the negative file exists, the rule is not
  written, since the owner may want the positive everywhere.
- Whether the outline files are wanted at icon sizes at all; they are made
  for places where a hairline frame matters, an avatar on a grey ground.
- `manifest.webmanifest` is not written; two lines when a page takes the icons.
