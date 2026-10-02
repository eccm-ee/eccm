# The six icon sets Feather was chosen over, removed 2026-10-02

Asked, verbatim: *"pick feather and implement. add bunch on icons in buttons (big and small) to icons page.
move icons up one level"*, after *"but i do not want lucode rounded stuff"*.

/icons compared play, pause and stop from Feather, Tabler, Lucide, Iconoir, Hugeicons, Phosphor thin and
Carbon at 16, 20, 24 and 32 px and in buttons, each vendored under `public/vendor/icons/<set>/` with its
licence. Feather won because its shapes carry the fewest radii and its line measured 1 CSS px at every size.
Of 36 icons a radio station needs, Feather had 33, Tabler all 36 but a radius on nearly every one, Iconoir
33 and soft throughout. The six other sets, the comparison page and Feather's three single files are in git
at 7ac7e20; the site's icons are now `public/vendor/icons/feather/icons.svg`, written by `tools/feather.mjs`.
