# partners

Marks of other organisations, each as its owner publishes it, never redrawn.

## Tallinn, UNESCO City of Music (Tallinna muusikalinn)

The six SVGs `tallinn-muusikalinn-{sinine,must,valge}_RGB.svg` (Estonian) and
`tallinn-cityofmusic-{blue,black,valge}_RGB.svg` (English) are the screen
files from `Tallinn-muusikalinn-logo-EST-ENG.zip`, downloaded once on
2026-09-27 from the City of Tallinn's identity site,
https://identiteet.tallinn.ee/#/logode-ja-dokumentide-failid/tallinna-muusikalinn
(the zip at
https://identiteet-admin.tallinn.ee/wp-content/uploads/2022/02/Tallinn-muusikalinn-logo-EST-ENG.zip,
dated 2022-02-11). The page's rule, verbatim: *"Logo kasutatakse valgena või
Tallinna sinisena. Kui värvikasutus ei ole võimalik, kasutatakse logo mustana."*
and *"NB! Võimalusel kasutage alati .svg faile"*. The usage guide it links is
`UCCN_Logo_Guidelines_EN.pdf` at the same upload path, not copied here.
eccm.ee shows the older wording of this mark in its sidebar as a 120 by 118
JPEG (`tallinn_muusika_small.jpg`).

## ULYSSES Platform (the ULYSSES Network)

`ulysses-platform-black.svg` is the mark as the network draws it in the
header of its own site, https://ulysses-platform.eu/ , copied byte for byte
from that page's inline SVG on 2026-10-01 (116 by 40, every fill black), with
only `role="img"` and an `aria-label` added. No press kit or logo download was
found: the older project site, https://project.ulysses-network.eu/ , serves
only a coloured PNG, `UlyssesNetwork-project.png` (960 by 201, "ULYSSES
network PROJECT"), and no SVG beside it.

## Co-funded by the European Union (Kaasrahastanud Euroopa Liit)

`eu-cofunded-{et,en}.png` (the positive version) and `eu-cofunded-{et,en}-neg.png`
(the negative version, white text, for the dark theme) are the horizontal RGB
PNGs from `co-funded_et.zip` and `co-funded_en.zip`, downloaded once on
2026-10-07 from the European Education and Culture Executive Agency's page,
https://www.eacea.ec.europa.eu/about-eacea/visual-identity/visual-identity-programming-period-2021-2027/european-flag-emblem-and-multilingual-disclaimer_en
(the zips at
https://ec.europa.eu/regional_policy/sources/information-sources/logo-download-center/co-funded_{et,en}.zip),
scaled from 919 px tall to 192 px with `sips` and otherwise untouched. The
zips carry EPS, JPEG and PNG and no SVG. The rule, from *The use of the EU
emblem in the context of EU programmes 2021-2027*,
https://commission.europa.eu/document/download/3192a0ef-6bda-4e1a-81ca-65ade2ffad73_en?filename=eu_emblem_rules.pdf :
*"The minimum height of the EU emblem must be 1 cm."*, and the negative version
is one of the four it shows. The flag is about 86 per cent of these files'
height, so the page draws them 3rem tall (a flag of about 41 CSS px, over
1cm's 37.8).

`eu-cofunded-{et,en}-bw.png` are the black-and-white versions the Logos page
draws (`migrations/0014_partners.sql`), made on 2026-11-07 from the positive
files with the mask an upload gets (`public/partners.mjs`): black on
transparent, each pixel's opacity its opacity in the positive times its
darkness, so the text and the flag are solid and the stars a lighter shape
inside it. Drawn as a CSS mask in the ink, never as the EU's own monochrome
version, which the zips do not carry as a PNG.

## Uploaded logos

Since 2026-11-07 a partner's logo is uploaded on the Logos page,
`/edit/partners`, and stored in R2 under `partners/`, not here. The
processing is the one above: an SVG kept as uploaded with only what could run
or fetch taken out, its black-and-white version every fill and stroke set to
`currentColor` (`src/partners.mjs`); a PNG or JPEG scaled down to 192 px tall
in the editor's browser and given the mask above (`public/partners.mjs`). The
files in this directory stay where they are and are the seeded rows.
