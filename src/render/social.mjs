// social.mjs: the event's social previews under its page, for a logged-in
// editor only (asked 2026-11-07: "move social preview under the post preview /
// public view when admin. og and ig"): the share card its og:image names, the
// Instagram carousel as /social draws it, now four cards (the text card, the
// picture's two halves and a text card the editor writes, "For ig add fourth
// slide with 2-3 fields header / body / footer"), and the three fields. Every
// image has a download button ("social images should have download icons"),
// a file named after the event's slug.
// The fields redraw the fourth card as they are typed, from /edit/og/t4/ with
// the words in the address (src/social.mjs); Save keeps them, and the card's
// own versioned address changes with them, so nothing stored is ever purged.
import { html, raw } from './html.mjs';
import { cardPath, cardVersion, tallPath, tallVersion, slidePath, slideVersion, SLIDE_MAX, W, H, TALL_W, TALL_H } from '../og/card.mjs';

const ICONS = '/vendor/icons/feather/icons.svg';
const download = (href, name) => html`<a class="btn btn-sm btn-ico" href="${href}" download="${name}"><svg class="ico" aria-hidden="true"><use href="${ICONS}#download"/></svg><span class="vh">Download ${name}</span></a>`;
const fig = (cls, src, w, h, cap, name, alt, extra = '') => html`<figure class="${cls}"${raw(extra)}>
          <img src="${src}" width="${w}" height="${h}" alt="${alt}" decoding="async">
          <figcaption>${download(src, name)}<span>${cap}</span></figcaption>
        </figure>`;

// id, lang, slug: the event; input: its cardInput; fields: the fourth card's words as stored or defaulted;
// stored: whether a row exists; path: the page, to come back to after a save
export const renderSocial = ({ id, lang, slug, input, fields, stored, path }) => {
  const base = `eccm-${slug}-${lang}`;
  const og = cardPath(id, lang, cardVersion(input));
  const pics = input.pic ? [1, 2].map((n) => tallPath(id, lang, tallVersion(input, n), n)) : [];
  const n = 2 + pics.length;
  const last = slidePath(id, lang, slideVersion(input, fields));
  return html`
  <section class="social" id="social" aria-labelledby="social-h" lang="en">
    <h2 id="social-h">Social</h2>
    <p class="social-note">Seen only when logged in. The share card is what a link to this page shows; the Instagram cards are a carousel at 1080 by 1350.</p>
    ${fig('social-og', og, W, H, 'Share card', `${base}-share.png`, input.title)}
    <div class="social-ig">
      ${fig('', tallPath(id, lang, tallVersion(input)), TALL_W, TALL_H, `Instagram 1/${n}`, `${base}-ig-1.png`, input.title)}
      ${pics.map((src, i) => fig('', src, TALL_W, TALL_H, `Instagram ${i + 2}/${n}`, `${base}-ig-${i + 2}.png`, `${input.title}, picture`))}
      ${fig('', last, TALL_W, TALL_H, `Instagram ${n}/${n}`, `${base}-ig-${n}.png`, fields.header || input.title, ' data-slide')}
    </div>
    <form class="form social-form" method="post" action="/edit/social/${id}/${lang}" data-preview="/edit/og/t4/${id}-${lang}.png">
      <input type="hidden" name="back" value="${path}">
      <p class="social-note">The last Instagram card's words, ${stored ? 'as saved' : 'the defaults until saved'}. A field left empty stays empty.</p>
      <div class="field"><label for="sl-header">Header</label><textarea id="sl-header" name="header" rows="2" maxlength="${SLIDE_MAX.header}">${fields.header}</textarea></div>
      <div class="field"><label for="sl-body">Body</label><textarea id="sl-body" name="body" rows="5" maxlength="${SLIDE_MAX.body}">${fields.body}</textarea></div>
      <div class="field"><label for="sl-footer">Footer</label><textarea id="sl-footer" name="footer" rows="1" maxlength="${SLIDE_MAX.footer}">${fields.footer}</textarea></div>
      <p class="event-actions"><button class="btn btn-pri" type="submit" name="action" value="save">Save</button>${stored ? html`<button class="btn" type="submit" name="action" value="reset">Back to the defaults</button>` : ''}</p>
    </form>
    <script type="module">
      // the last card redrawn from the fields a moment after typing stops; its download takes what is shown
      const form = document.querySelector('.social-form');
      const fig = document.querySelector('.social-ig [data-slide]');
      const img = fig.querySelector('img'), dl = fig.querySelector('a[download]');
      // a click on the card itself goes to its first field (asked 2026-11-07: "i need it editable"; no pencil, "no need edit button")
      img.addEventListener('click', () => { form.elements.header.focus(); form.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      // a card that failed is drawn again, up to five times a few seconds apart: on ECCM's free Workers plan a
      // first render runs over the CPU limit about half the time, and one that succeeds is kept for good (2026-11-09)
      const retry = (im) => {
        const n = Number(im.dataset.tries || 0);
        if (n >= 5) return;
        im.dataset.tries = n + 1;
        setTimeout(() => { const u = new URL(im.src); u.searchParams.set('try', n + 1); im.src = u; }, 1500 * (n + 1));
      };
      for (const im of document.querySelectorAll('.social figure img')) {
        im.addEventListener('error', () => retry(im));
        if (im.complete && !im.naturalWidth) retry(im);
      }
      let t = 0;
      form.addEventListener('input', () => {
        clearTimeout(t);
        t = setTimeout(() => {
          const q = new URLSearchParams(['header', 'body', 'footer'].map((k) => [k, form.elements[k].value]));
          delete img.dataset.tries;
          img.src = dl.href = form.dataset.preview + '?' + q;
        }, 400);
      });
    </script>
  </section>`;
};
