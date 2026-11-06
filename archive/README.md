# Archive

What was removed, and where to find it again. A tag names the last commit
that still has a thing; `git checkout <tag> -- <path>` brings a file back.

## The notices to phones, removed 2026-11-06, tag `notices-last`

- **/items**, **/teated/{n}** and **/en/notices/{n}**, the Items Durable
  Object, Web Push and the Luba teated bar: `notices.md`, with the two test
  notices staging held and the restore steps. ECCM never asked for it, and
  its Väin use went to v2in.

## The research pages, removed 2026-10-07, tag `research-last`

- **/type** (`public/type.html`): the faces weighed for the body and the
  titles, with the sans and serifs in a derived page's three uses. Its fonts
  went with it: Anybody, Archivo, Bricolage Grotesque, Familjen Grotesk,
  Inter, IBM Plex Sans, Schibsted Grotesk, Sofia Sans Condensed and Source
  Serif 4, each `public/vendor/*-latin*.woff2` with its `LICENSE-*`.
- **/derive** (`public/derive.html`): design from a picture, the study the
  colour detector came out of. The detector itself stays in
  `public/scheme.mjs`, which the editor runs on upload.
- **/icons** (`public/icons.html`): the Feather sprite in buttons small and
  large. The sprite stays at `public/vendor/icons/feather/icons.svg`.
- **/admin/research** and **/admin/research/radio** (`src/render/research.mjs`,
  their routes in `src/index.mjs` and the `.rk-*` rules in `public/eccm.css`):
  the index of studies, and the radio tools research, common structure, views
  and tools with who is best at each.

## The radio, removed 2026-10-07

The radio archive moved to v2in `archive/eccm-radio/` on 2026-11-06; the code is under the tags `radio-last` and `radio-archive`.

## Earlier

- `serif-titles.md`: the serif title detector and the faces tried.
- `icon-sets.md`: the six icon sets Feather was chosen over.
- `positron-items.md`: what positron's items demo learned, copied when the notices moved here.
- `eccm-derive-mailing/`: the mailing and verdict on the derive study, 2026-09-27.
