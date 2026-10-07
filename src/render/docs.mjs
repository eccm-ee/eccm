// docs.mjs: /docs, the index of written plans and reports, and each doc, which
// is a Markdown file under docs/ rendered here (asked 2026-10-07: "add
// migration card and page to the admin with the report", "move to
// /docs/migration instead and make docs index page", then "is json tables the
// best format? i'd like to see acutual code snippets and prompts what devs need
// to do"). The file is the source: GitHub shows it as it is, an agent reads it
// directly, and this page adds the site's chrome, the .table component and a
// Copy button on every code block. Bundled as text by the **/*.md rule in
// wrangler.jsonc. /docs/ici is its own module (src/render/ici.mjs).
import { Marked } from 'marked';
import { html, raw, esc } from './html.mjs';
import { page } from './chrome.mjs';
import migration from '../../docs/migration.md';
import presence from '../../docs/presence.md';

const DOCS = {
  migration: { md: migration, desc: 'Moving eccm.ee here: decisions, the order, every task with its prompt or steps.' },
  presence: { md: presence, desc: 'The site, tickets, social and listings: what is wrong today and what fixes it.' },
};

const slug = (s) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// the site's own markup for the three things Markdown draws differently: a heading gets an id to link to,
// a table is the .table component with each cell's column label for the narrow form, a code block carries Copy
const marked = new Marked({
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      return `<h${depth} id="${slug(text.replace(/<[^>]+>/g, ''))}">${text}</h${depth}>\n`;
    },
    table({ header, rows }) {
      const labels = header.map((c) => this.parser.parseInline(c.tokens).replace(/<[^>]+>/g, ''));
      // the component's cells do not wrap: the column with the longest text is its .main, any other
      // that runs past a short phrase is .wrap, the rest stay on one line
      const avg = header.map((_, i) => rows.reduce((n, r) => n + (r[i]?.text.length || 0), 0) / (rows.length || 1));
      const top = avg.indexOf(Math.max(...avg));
      const cls = avg.map((a, i) => (i === top ? ' class="main"' : a > 30 ? ' class="wrap"' : ''));
      const head = header.map((c, i) => `<th scope="col"${cls[i]}>${this.parser.parseInline(c.tokens)}</th>`).join('');
      const body = rows.map((r) => `<tr>${r.map((c, i) => `<td${cls[i]} data-label="${esc(labels[i])}">${this.parser.parseInline(c.tokens)}</td>`).join('')}</tr>`).join('');
      return `<div class="table"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>\n`;
    },
    code({ text, lang }) {
      return `<div class="doc-code"><pre${lang ? ` data-lang="${esc(lang)}"` : ''}><code>${esc(text)}</code></pre><button class="doc-copy" type="button" data-copy>Copy</button></div>\n`;
    },
  },
});

// one handler for every Copy button: the block's text to the clipboard, the button says so for two seconds
const COPY = `<script>document.addEventListener('click',function(e){var b=e.target.closest('[data-copy]');if(!b)return;var t=b.parentNode.querySelector('code').textContent;navigator.clipboard.writeText(t).then(function(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy'},2000)})})</script>`;

const cards = (list) => html`<div class="cards">
    ${list.map(([href, title, desc]) => html`<a class="card" href="${href}"><span class="card-title">${title}</span><span class="card-desc">${desc}</span></a>`)}
  </div>`;

// the doc's own # line is its title
const titleOf = (md) => (/^#\s+(.+)$/m.exec(md) || [, 'Doc'])[1].trim();

export const renderDocs = () => page({
  wide: true, lang: 'en', title: 'Docs.',
  body: html`  <h1>Docs</h1>
  ${cards([
    ...Object.entries(DOCS).map(([key, d]) => [`/docs/${key}`, titleOf(d.md), d.desc]),
    ['/docs/ici', 'ici on Väin', 'Albert Saprykin’s ici as a session on Väin, and who does what.'],
  ])}`,
});

export const renderDoc = (key) => {
  const d = DOCS[key];
  if (!d) return null;
  const body = d.md.replace(/^#\s+.+\n/m, '');
  return page({
    wide: true, lang: 'en', title: `${titleOf(d.md)}.`,
    body: html`  <p class="crumb"><a href="/docs">Docs</a></p>
  <h1>${titleOf(d.md)}</h1>
  <div class="flow doc">${raw(marked.parse(body))}</div>
  ${raw(COPY)}`,
  });
};
