// docs.mjs: /docs, the index of written plans and reports, and each doc, which
// is a Markdown file under docs/ rendered here (asked 2026-10-07: "add
// migration card and page to the admin with the report", "move to
// /docs/migration instead and make docs index page", then "is json tables the
// best format? i'd like to see acutual code snippets and prompts what devs need
// to do"). The file is the source: GitHub shows it as it is, an agent reads it
// directly, and this page adds the site's chrome, the .table component and a
// Copy button on every code block. Bundled as text by the **/*.md rule in
// wrangler.jsonc.
import { Marked } from 'marked';
import { html, raw, esc } from './html.mjs';
import { page } from './chrome.mjs';
import { badge, toneOf } from './badge.mjs';
import migration from '../../docs/migration.md';
import presence from '../../docs/presence.md';
import ici from '../../docs/ici.md';

const DOCS = {
  migration: { md: migration, desc: 'Moving eccm.ee here: decisions, the order, every task with its prompt or steps.' },
  presence: { md: presence, desc: 'The site, tickets, social and listings: what is wrong today and what fixes it.' },
  // written by the positron session as src/render/ici.mjs, made Markdown 2026-10-07 ("update /docs/ici to md")
  ici: { md: ici, desc: 'Albert Saprykin\u2019s ici as a session on V\u00e4in, and who does what.' },
};

const slug = (s) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// the site's own markup for the three things Markdown draws differently: a heading gets an id to link to,
// a table is the .table component with each cell's column label for the narrow form, a code block carries Copy
const marked = new Marked({
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      // the id from the visible words: tags and entities out first, so importer's is importer-s, not importer-39-s
      return `<h${depth} id="${slug(text.replace(/<[^>]+>/g, '').replace(/&[#a-z0-9]+;/gi, ' '))}">${text}</h${depth}>\n`;
    },
    table({ header, rows }) {
      const labels = header.map((c) => this.parser.parseInline(c.tokens).replace(/<[^>]+>/g, ''));
      // the component's cells do not wrap: the column with the longest text is its .main, any other
      // that runs past a short phrase is .wrap, the rest stay on one line
      const avg = header.map((_, i) => rows.reduce((n, r) => n + (r[i]?.text.length || 0), 0) / (rows.length || 1));
      const top = avg.indexOf(Math.max(...avg));
      const cls = avg.map((a, i) => (i === top ? ' class="main"' : a > 30 ? ' class="wrap"' : ''));
      const head = header.map((c, i) => `<th scope="col"${cls[i]}>${this.parser.parseInline(c.tokens)}</th>`).join('');
      // a column headed State or Olek is a status, each cell a badge, its tone from the cell's words
      const state = labels.map((l) => /^(state|olek)$/i.test(l.trim()));
      const cell = (c, i) => { const inner = this.parser.parseInline(c.tokens); return state[i] && c.text.trim() ? String(badge(raw(inner))) : inner; };
      // done rows go to the bottom of a table with a status column, the open ones first, each group in its written
      // order (asked 2026-10-07: "move done to the bottom")
      const si = state.indexOf(true);
      const ordered = si < 0 ? rows : [...rows.filter((r) => toneOf(r[si]?.text) !== 'done'), ...rows.filter((r) => toneOf(r[si]?.text) === 'done')];
      const body = ordered.map((r) => `<tr>${r.map((c, i) => `<td${cls[i]} data-label="${esc(labels[i])}">${cell(c, i)}</td>`).join('')}</tr>`).join('');
      return `<div class="table"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>\n`;
    },
    // a task's "**Who:** x. **State:** y." line: the state as the same badge the tables use (asked 2026-10-07:
    // "Who: agent. State: to do. -- use labels heer"), the who as a quiet line beside it
    paragraph({ tokens }) {
      const inner = this.parser.parseInline(tokens);
      const m = /^<strong>Who:<\/strong> (.+?)\. <strong>State:<\/strong> (.+?)\.?$/.exec(inner);
      if (!m) return `<p>${inner}</p>\n`;
      // the badge holds the state's first clause, "done 7 October 2026, the tag radio-last" puts the rest after it
      const [head, ...rest] = m[2].split(/, (.*)/s);
      const cap = (t) => t.replace(/^./, (c) => c.toUpperCase());
      return `<p class="doc-task">${badge(raw(cap(head)))}<span>${cap(m[1])}${rest[0] ? `. ${cap(rest[0])}` : ''}</span></p>\n`;
    },
    code({ text, lang }) {
      return `<div class="doc-code"><pre${lang ? ` data-lang="${esc(lang)}"` : ''}><code>${esc(text)}</code></pre><button class="btn btn-sm btn-ico doc-copy" type="button" data-copy aria-label="Copy"><svg class="ico" aria-hidden="true"><use href="/vendor/icons/feather/icons.svg#copy"/></svg></button></div>\n`;
    },
  },
});

// one handler for every Copy button: the block's text to the clipboard, the icon turns to a check for two seconds
// a link to a folded task opens it, on load and on every jump within the page
const OPEN = `<script>function o(){var t=location.hash&&document.getElementById(decodeURIComponent(location.hash.slice(1)));var d=t&&t.closest('details');if(d&&!d.open){d.open=true;t.scrollIntoView()}}addEventListener('hashchange',o);o()</script>`;
const COPY = `<script>document.addEventListener('click',function(e){var b=e.target.closest('[data-copy]');if(!b)return;var t=b.parentNode.querySelector('code').textContent,u=b.querySelector('use'),h=u.getAttribute('href');navigator.clipboard.writeText(t).then(function(){u.setAttribute('href',h.replace('#copy','#check'));b.setAttribute('aria-label','Copied');setTimeout(function(){u.setAttribute('href',h);b.setAttribute('aria-label','Copy')},2000)})})</script>`;

const cards = (list) => html`<div class="cards">
    ${list.map(([href, title, desc]) => html`<a class="card" href="${href}"><span class="card-title">${title}</span><span class="card-desc">${desc}</span></a>`)}
  </div>`;

// a finished task folds away: an h3 section whose state badge is done becomes a closed <details>, its title and
// badge the summary (asked 2026-10-07: "collapse sections done"); a section runs to the next h2 or h3
const collapseDone = (out) => out.replace(/(<h3 id="[^"]*">[\s\S]*?<\/h3>\n)(<p class="doc-task">[\s\S]*?<\/p>\n)([\s\S]*?)(?=<h[23] |$)/g,
  (m, h3, task, rest) => (task.includes('badge-done') ? `<details class="doc-done"><summary>${h3}${task}</summary>${rest}</details>\n` : m));

// the doc's own # line is its title
const titleOf = (md) => (/^#\s+(.+)$/m.exec(md) || [, 'Doc'])[1].trim();

export const renderDocs = () => page({
  wide: true, root: 'docs', lang: 'en', title: 'Docs.',
  body: html`  <h1>Docs</h1>
  ${cards([
    ...Object.entries(DOCS).map(([key, d]) => [`/docs/${key}`, titleOf(d.md), d.desc]),
  ])}`,
});

export const renderDoc = (key) => {
  const d = DOCS[key];
  if (!d) return null;
  const body = d.md.replace(/^#\s+.+\n/m, '');
  return page({
    wide: true, root: 'docs', lang: 'en', title: `${titleOf(d.md)}.`,
    // the same centred column as a text page from D1 (.page-text); the crumb stays where every admin page has it,
    // at the frame's left (asked 2026-10-07: "keep breadcrumbs in the same place")
    body: html`  <p class="crumb"><a href="/docs">Docs</a></p>
  <div class="page-text"><h1>${titleOf(d.md)}</h1>
  <div class="flow doc">${raw(collapseDone(marked.parse(body)))}</div></div>
  ${raw(COPY)}${raw(OPEN)}`,
  });
};
