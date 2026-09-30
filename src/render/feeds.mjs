// feeds.mjs: the sitemap and the two RSS feeds of
// plans/plan-eccm-urls-sitemap-rss.md sections 5 and 6, hand rolled the way
// trip's lib/rss.ts and sitemap.js are, xmlEsc on every value. /sitemap.xml
// lists every published event and text page in both languages, the two lists
// and the two homes, each url with its hreflang pairs (section 4): et, en and
// x-default on the Estonian, a thing with no twin listing only itself and
// x-default. /et/feed.xml and /en/feed.xml carry the twenty newest published
// events by created_at with a text row in that language, no fallback.
// Nothing advertises them yet: no link rel=alternate in a head and no Sitemap
// line in robots.txt, because the host is noindex and section 5 says both
// wait for cutover; the routes exist, answer, and are named nowhere. The host
// is the request's origin while this is staging only; at cutover it becomes
// the configured origin, never request.url (section 4).
import { T } from './chrome.mjs';
import { LIST, HOME } from './events.mjs';
import { pagePath } from './page.mjs';
import { dateLong, clock } from './dates.mjs';

const XML_ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };
export const xmlEsc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => XML_ESC[c]);
const eventPath = (lang, slug) => (lang === 'et' ? `/et/sundmused/${slug}` : `/en/events/${slug}`);

// one url entry: loc is the path in lang, paths is { et, en } of every
// language the thing exists in; x-default is the Estonian, or the only one
const entry = (origin, loc, paths, lastmod) => {
  const alt = Object.entries(paths).map(([l, p]) => `<xhtml:link rel="alternate" hreflang="${l}" href="${xmlEsc(origin + p)}"/>`);
  alt.push(`<xhtml:link rel="alternate" hreflang="x-default" href="${xmlEsc(origin + (paths.et || loc))}"/>`);
  return `<url><loc>${xmlEsc(origin + loc)}</loc>${lastmod ? `<lastmod>${xmlEsc(lastmod)}</lastmod>` : ''}${alt.join('')}</url>`;
};

// rows: { id, lang, slug, updated_at } of text rows; grouped per thing so
// each language's url carries the other as its pair
const things = (origin, rows, path) => {
  const by = new Map();
  for (const r of rows) { const t = by.get(r.id) || { paths: {}, updated_at: r.updated_at }; t.paths[r.lang] = path(r.lang, r.slug); by.set(r.id, t); }
  return [...by.values()].flatMap((t) => Object.values(t.paths).map((p) => entry(origin, p, t.paths, t.updated_at)));
};

// events and pages: the published rows joined to their texts; the lists and
// the homes take the newest event's updated_at, since the events are what
// changes on them
export const renderSitemap = ({ origin, events, pages }) => {
  const newest = events.reduce((m, r) => (r.updated_at > m ? r.updated_at : m), '');
  const fixed = [[LIST.et, LIST.en], [HOME.et, HOME.en]].flatMap(([et, en]) => [entry(origin, et, { et, en }, newest), entry(origin, en, { et, en }, newest)]);
  const urls = fixed.concat(things(origin, events, eventPath), things(origin, pages, pagePath));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
};

// the first paragraph of a body as plain text, whole, the heading, list,
// bold, italic and link marks of md.mjs taken off
const firstPara = (body) => {
  const para = String(body || '').split(/\r?\n\s*\r?\n/).map((x) => x.trim()).find((x) => x && !x.startsWith('#'));
  if (!para) return '';
  return para.replace(/^\s*(?:[-*]|\d+[.)])\s+/gm, '').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/(^|\s)_([^_\n]+)_/g, '$1$2')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\s+/g, ' ');
};
const TYPE = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', avif: 'image/avif', gif: 'image/gif' };
const rfc822 = (utc) => new Date(utc).toUTCString();

// rows: event joined to its text in lang and its media row (m.*), newest
// first; bytes is read only when the column is there and filled, since the
// media.bytes migration lands separately and length is left out until then
const item = (origin, lang, r) => {
  const link = origin + eventPath(lang, r.slug);
  const facts = [`${dateLong(r.starts_at, lang)} ${T[lang].at} ${clock(r.starts_at, lang)}`, r.venue, r.ticket_url && `${T[lang].ticket}: ${r.ticket_url}`].filter(Boolean).join(', ');
  const desc = [facts, firstPara(r.body)].filter(Boolean).join('\n\n');
  const type = r.key && TYPE[r.key.split('.').pop().toLowerCase()];
  const enclosure = type ? `<enclosure url="${xmlEsc(origin + '/' + r.key)}" type="${type}"${r.bytes != null ? ` length="${xmlEsc(r.bytes)}"` : ''}/>` : '';
  return `<item><title>${xmlEsc(r.title)}</title><link>${xmlEsc(link)}</link><guid isPermaLink="true">${xmlEsc(link)}</guid><pubDate>${rfc822(r.created_at)}</pubDate><description>${xmlEsc(desc)}</description>${enclosure}</item>`;
};

export const renderFeed = ({ origin, lang, rows }) => {
  const self = `${origin}/${lang}/feed.xml`;
  const built = rows[0] ? `<lastBuildDate>${rfc822(rows[0].created_at)}</lastBuildDate>` : '';
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>ECCM: ${xmlEsc(T[lang].events)}</title><link>${xmlEsc(origin + LIST[lang])}</link><description>${xmlEsc(T[lang].markAlt)}</description><language>${lang}</language>${built}<atom:link href="${xmlEsc(self)}" rel="self" type="application/rss+xml"/>
${rows.map((r) => item(origin, lang, r)).join('\n')}
</channel></rss>\n`;
};
