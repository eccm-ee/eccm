// lead.mjs: the opening of an event's text as plain text, for the list's
// summary, the share description, the calendar and the feed. Text pasted from
// eccm.ee often opens with the title again or a date and place line
// ("Schönbergi sari. OPUS MIRUM / N 19.11.2026 kell 19.00 Eesti Nüüdismuusika
// Keskus (Pühavaimu 9, Tallinn)"), which the page already prints above it, so
// leading lines of that kind are passed over (asked 2026-11-06: "english data
// is a mess"), and so is a label or a programme line before the first prose.

const norm = (s) => String(s ?? '').toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const words = (s) => norm(s).split(' ').filter(Boolean);
const MONTH = /\b(jaan|veebr|märts|apr|mai|juuni|juuli|aug|sept|okt|nov|dets|jan|feb|mar|may|june|july|oct|dec)[a-zäöüõ]*\b/i;
const DATE = /\b\d{1,2}\.\s?\d{1,2}\.(\s?\d{4})?|\b\d{1,2}\.?\s+[a-zäöüõ]+\s+\d{4}\b|\bkell\s+\d{1,2}[.:]\d{2}\b|\bat\s+\d{1,2}[.:]\d{2}\b/i;
const ADDRESS = /^[^()]{1,80}\([^()]*\d[^()]*\)\.?$/;

// one line is a repeat of the title or the series, or only says when or where
const skippable = (line, ctx) => {
  const n = norm(line);
  if (!n) return true;
  const title = norm(ctx.title);
  if (title && (title.startsWith(n) || (n.startsWith(title) && n.length <= title.length + 12))) return true;
  const known = new Set(words(`${ctx.title} ${ctx.series || ''} ${ctx.venue || ''} ${ctx.address || ''}`));
  const w = n.split(' ');
  if (w.every((x) => known.has(x))) return true;
  if (line.length <= 120 && w.length <= 12 && DATE.test(line)) return true;
  if (line.length <= 100 && MONTH.test(line) && /\d/.test(line) && w.length <= 8) return true;
  if (ADDRESS.test(line.trim())) return true;
  if (/^(piletid|pääsmed|pilet|tickets?|sissepääs|admission)\b/i.test(line)) return true;
  if (!/\s/.test(line.trim()) && /\.[a-z]{2,}(\/|$)/i.test(line)) return true;
  if (w.length <= 2 && (line === line.toUpperCase() || /:$/.test(line.trim()))) return true;
  return false;
};

const plain = (s) => s.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/(^|\s)_([^_]+)_(?=[\s.,;:!?)]|$)/g, '$1$2').replace(/\s+/g, ' ').trim();

// prose: a paragraph that reads as sentences, not a label ("KAVA"), a
// programme line or a list of players and instruments
const prose = (t) => { const n = t.split(' ').length; return !/^[^.!?]*\([^)]*\)\s*$/.test(t) && ((n >= 3 && /[.!?…]["”»)]?$/.test(t)) || (n >= 12 && /[.!?…]["”»)]?\s+\p{Lu}/u.test(t))); };

// ctx: { title, series, venue, address }; the text of the first paragraph
// that reads as prose within the first eight, its title, date or place lines
// taken off its top, or else the first paragraph with anything left at all
export const opening = (body, ctx = {}) => {
  let first = '';
  const paras = String(body || '').split(/\r?\n\s*\r?\n/).slice(0, 8);
  for (const para of paras) {
    const p = para.trim();
    if (!p || p.startsWith('#')) continue;
    const lines = p.split(/\r?\n/);
    while (lines.length && skippable(plain(lines[0]), ctx)) lines.shift();
    const rest = plain(lines.join(' '));
    if (!rest) continue;
    if (prose(rest)) return rest;
    first ||= rest;
  }
  return first;
};

// a meta description from plain text: whole when it fits, else cut at the last word under max characters with an
// ellipsis, so a search result shows a sentence rather than a word broken off (asked 2026-11-06, Lighthouse's SEO)
export const clip = (s, max = 155) => {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  return t.length <= max ? t : t.slice(0, max - 1).replace(/[\s,;:.]+\S*$/, '') + '…';
};
// the first sentence of a text: up to the first full stop, question or exclamation mark followed by a capital
export const firstSentence = (s) => {
  const t = String(s || '').trim();
  const m = t.match(/^.+?[.!?…]["”»)]?(?=\s+["„«(]?\p{Lu})/u);
  return m ? m[0] : t;
};
