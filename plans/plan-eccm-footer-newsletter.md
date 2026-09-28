# The footer with the newsletter field, kept for when the newsletter comes

Written 2026-09-28 on *"D. Four columns and a newsletter - leave it to md /
plans, we need when newslette comes"*, when `public/layout.html` was cut to
one header and one footer. This is footer D as the page drew it at
`eee60c1`, verbatim, so it can be put back when the newsletter exists
(`plans/plan-eccm-cms.md` section 5 prices it and needs Workers Paid; the
presence plan's item 5 says the list starts at cutover and never on staging).

## What it is

Four columns: the mark alone at 6rem; the menu in two columns under a
`Menüü` label; the contact under `Kontakt` with the name, the venue, the
postal address, the phone, a link to the contact form, Instagram and
Facebook; a newsletter field whose placeholder is its name, `E-post`, with
the same name for a screen reader and a `Liitu` button. Under everything a
line with the copyright and the language switch at the start and the City
of Music mark in black at the end. The placeholder is the site's lighter
grey, `--eccm-rule-strong`, not the second ink (asked 2026-09-28:
"placeholder needs to be grayer"). The field posts nowhere yet.

## The markup, as the page's script wrote it

```js
  { title: 'Four columns and a newsletter', what: 'the mark alone, 6rem; the menu in two columns; the contact with the Instagram and Facebook links; a newsletter field with its name as the placeholder and its button; under everything a line with the copyright and the switch at the start and the City of Music mark in black at the end (asked 2026-09-27: "E-post as placeholder in field, rm label. rm toetajad. find place to muusikalinn", "try 2 col links in D")', html: (p) => `
    <div class="cols">
      <div>${mark(p, 6)}</div>
      <div><p class="label">${p.menuLabel}</p>${menu(p, 'two')}</div>
      <div><p class="label">${p.contact}</p><p>${p.name}</p><p>${VENUE}</p><p style="margin-block-start: var(--eccm-s-3)">${p.post}<br>${POST}</p><p style="margin-block-start: var(--eccm-s-3)">${p.phone}<br><a href="tel:+3725162103">${PHONE}</a></p><p style="margin-block-start: var(--eccm-s-3)"><a href="${FORM}">${p.write}</a></p>${social()}</div>
      <div><p class="label">${p.news}</p><form class="news" onsubmit="return false"><input type="email" name="email" autocomplete="email" placeholder="${p.email}" aria-label="${p.email}"><button class="btn" type="submit">${p.join}</button></form></div>
    </div>
    <div class="line" style="justify-content: space-between; align-items: center"><span class="line" style="margin: 0"><span>${p.copy}</span>${p.sw}</span>${partner(p, true)}</div>` },
```

`p` is the language pack (`L.et` or `L.en` on the page); `mark`, `menu`,
`partner`, `social` and the constants `PHONE`, `FORM`, `VENUE`, `POST` are
the page's helpers, the phone and the form from eccm.ee's contact page
(READ 2026-09-28).

## The rules it needs, from the page's stylesheet at that commit

```css
.ft .label { color: var(--eccm-ink); margin-block-end: var(--eccm-s-2); }
.ft .cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr)); gap: var(--eccm-s-8); }
.ft .stack li + li { margin-block-start: var(--eccm-s-1); }
.ft .two { display: grid; grid-template-columns: repeat(2, max-content); column-gap: var(--eccm-s-12); row-gap: var(--eccm-s-2); grid-auto-flow: row; }
.ft .end { justify-self: end; }
.ft .partner { --pw: 4rem; display: block; inline-size: var(--pw); margin-inline-end: calc(var(--pw) * -0.136); }
.ft .end .partner { margin-block-start: calc(var(--pw) * -0.1355); }
.ft .partner img { display: block; inline-size: 100%; block-size: auto; }
@container (max-width: 48rem) { .ft .cols.four { grid-template-columns: minmax(0, 1fr); } .ft .end { justify-self: start; } .ft .partner { margin-inline: calc(var(--pw) * -0.136) 0; } }
.ft .line { display: flex; flex-wrap: wrap; gap: var(--eccm-s-2) var(--eccm-s-8); margin-block-start: var(--eccm-s-8); }
.ft .line.top { margin-block-start: 0; margin-block-end: var(--eccm-s-8); }
.ft .news { display: flex; flex-wrap: wrap; gap: var(--eccm-s-2); align-items: end; }
.ft .news label { display: grid; gap: var(--eccm-s-1); }
.ft input { font: inherit; block-size: 3rem; inline-size: 14rem; max-inline-size: 100%; padding-inline: var(--eccm-s-3); border: 1px solid var(--eccm-ink); border-radius: 0; background: transparent; color: var(--eccm-ink); }
.ft input::placeholder { color: var(--eccm-rule-strong); opacity: 1; }
.ft .btn { color: var(--eccm-ink); border-color: var(--eccm-ink); }
```

The footer sits on the site's `.frame`, `padding-block` `--eccm-s-8` above
and `--eccm-s-12` below, at `--eccm-t-s` in `--eccm-ink-2`. The button
reuses `.btn` from `eccm.css`.

## What is still open

- The consent line a newsletter field needs (erso.ee carries one under its
  field, READ 2026-09-27), and double opt-in, are the CMS plan's.
- The funders' slots that once sat above the bottom line were removed on
  2026-09-28 ("rm toetajad") and are not here.
