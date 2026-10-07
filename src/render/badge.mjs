// badge.mjs: the .badge component of public/eccm.css as markup (asked 2026-10-07: "develop a badge
// component for status cols in tables etc"). badge(text, tone) is one escaped span; text may be a Raw
// from html.mjs (a docs cell's inline Markdown), and tone, when left out, comes from the word map below.
// Four tones name a meaning and are kept as a class for sorting; since "labels are complex to read. make
// uniform ones, no icons / dotted" (2026-10-07) every tone draws the same box with no icon.
import { html } from './html.mjs';

export const TONES = ['neutral', 'progress', 'done', 'problem'];

// every status word the site shows today, Estonian and English, lower case and without a full stop
const WORDS = {
  neutral: ['draft', 'to do', 'todo', 'after migration', 'after', 'pending', 'mustand', 'teha', 'pärast kolimist'],
  progress: ['waiting', 'scheduled', 'ask', 'ongoing', 'sending', 'ootel', 'ajastatud', 'küsi', 'käib', 'saatmisel'],
  done: ['done', 'decided', 'sent', 'published', 'confirmed', 'tehtud', 'otsustatud', 'saadetud', 'avaldatud', 'kinnitatud'],
  problem: ['failed', 'refused', 'error', 'unsubscribed', 'ebaõnnestus', 'keeldus', 'viga', 'lahkunud'],
};
const MAP = new Map(Object.entries(WORDS).flatMap(([tone, ws]) => ws.map((w) => [w, tone])));

// the tone of a status: the whole phrase, then its first clause ("sent, 12", "Ask Tarmo"), then the shape
// of a phrase tied to a later moment ("After the zone move", "Built, sends after Workers Paid"), which is
// waiting on something and so progress; anything unknown is neutral
export const toneOf = (text) => {
  const s = String(text ?? '').replace(/<[^>]+>/g, '').trim().toLowerCase().replace(/\.$/, '');
  if (MAP.has(s)) return MAP.get(s);
  const head = s.split(/[,(]/)[0].trim();
  if (MAP.has(head)) return MAP.get(head);
  const first = head.split(/\s+/)[0];
  if (/^(after|before|at|built|pärast|enne)$/.test(first) || /\bdone\b.*\bto do\b/.test(s)) return 'progress';
  if (MAP.has(first)) return MAP.get(first);
  return 'neutral';
};

export const badge = (text, tone = toneOf(text)) => {
  const t = TONES.includes(tone) ? tone : 'neutral';
  return html`<span class="badge badge-${t}">${text}</span>`;
};
