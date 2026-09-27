// md.mjs: the markdown subset the bodies use, ported from trip's
// astro-prod/src/lib/md.ts (68 lines, read 2026-09-27) and nothing more:
// paragraphs on blank lines, ## and ### headings (a # is an h2 too, the h1
// is the title), - and 1. lists, links to http(s) only, **bold**, _italic_.
// Every transform runs on ALREADY ESCAPED text, so a quote inside a URL is
// already &quot; and cannot leave the attribute, and a javascript: link never
// matches the https-only pattern and stays visibly literal.
import { esc } from './html.mjs';

export const mdInline = (e) => {
  let s = e.replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s<>)]+)\)/g, (_, t, u) => `<a href="${u}" rel="noopener">${t}</a>`);
  s = s.replace(/\*\*([^*\n]+)\*\*/g, '<b>$1</b>');
  s = s.replace(/(^|\s)_([^_\n]+)_(?=[\s.,;:!?)]|$)/gm, '$1<i>$2</i>');
  return s;
};
const inline = (s) => mdInline(esc(s));
const li = (l) => /^\s*[-*]\s+(.+)$/.exec(l);
const oli = (l) => /^\s*\d+[.)]\s+(.+)$/.exec(l);
const isHead = (l) => /^#{1,3}\s+/.test(l.trim());

export const md = (text) => {
  const out = [];
  for (const block of String(text ?? '').split(/\r?\n\s*\r?\n/)) {
    if (!block.trim()) continue;
    const lines = block.split(/\r?\n/);
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const h = /^(#{1,3})\s+(.+)$/.exec(line.trim());
      if (h) { const tag = h[1].length === 3 ? 'h3' : 'h2'; out.push(`<${tag}>${inline(h[2])}</${tag}>`); i++; continue; }
      if (li(line)) { const items = []; while (i < lines.length && li(lines[i])) { items.push(li(lines[i])[1]); i++; } out.push(`<ul>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</ul>`); continue; }
      if (oli(line)) { const items = []; while (i < lines.length && oli(lines[i])) { items.push(oli(lines[i])[1]); i++; } out.push(`<ol>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</ol>`); continue; }
      const run = [];
      while (i < lines.length && !li(lines[i]) && !oli(lines[i]) && !isHead(lines[i])) { run.push(lines[i]); i++; }
      const para = run.join('\n').trim();
      if (para) out.push(`<p>${inline(para).replace(/\r?\n/g, '<br>')}</p>`);
    }
  }
  return out.join('\n');
};
