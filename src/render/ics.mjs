// ics.mjs: the events as iCalendar, session 1's last piece (asked 2026-10-01:
// "do session 1 too"), shaped by plans/plan-eccm-urls-sitemap-rss.md
// section 6: one VEVENT per event, UID event-{id}@eccm.ee so a subscriber's
// calendar updates the same entry rather than adding a second, SUMMARY the
// title, LOCATION the venue and address, DESCRIPTION the first paragraph and
// the ticket link, URL the event page, LAST-MODIFIED from updated_at. Times
// are written in UTC rather than with TZID=Europe/Tallinn: a TZID obliges the
// file to carry the zone's VTIMEZONE rules, which calendars read unevenly,
// and a UTC instant is the same moment in every one of them. RFC 5545: CRLF
// line ends, text escaped, lines folded at 75 octets. No library.
import { offsetFor } from './event.mjs';

const toUtc = (local) => { const off = offsetFor(local); const sign = off[0] === '-' ? 1 : -1; const [h, m] = off.slice(1).split(':').map(Number); return new Date(new Date(local + ':00Z').getTime() + sign * (h * 60 + m) * 60000); };
const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
const text = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
// a line longer than 75 octets continues on the next after one space, cut on a character boundary
const fold = (line) => {
  const enc = new TextEncoder();
  if (enc.encode(line).length <= 75) return line;
  const out = []; let cur = ''; let n = 0;
  for (const ch of line) {
    const b = enc.encode(ch).length;
    if (n + b > (out.length ? 74 : 75)) { out.push(cur); cur = ''; n = 0; }
    cur += ch; n += b;
  }
  out.push(cur);
  return out.join('\r\n ');
};
// the body's first paragraph as plain text: links to their words, no marks
const firstPara = (md) => (String(md ?? '').split(/\r?\n\s*\r?\n/).find((b) => b.trim() && !/^#/.test(b.trim())) || '')
  .replace(/\[([^\]\n]+)\]\([^)]+\)/g, '$1').replace(/\*\*|__|(^|\s)_|_(?=\s|$)/g, '$1').replace(/\s+/g, ' ').trim();

const PATH = { et: (s) => `/et/sundmused/${s}`, en: (s) => `/en/events/${s}` };
const TICKET = { et: 'Piletid', en: 'Tickets' };

// rows: event joined to its text in the calendar's language (tlang the text's own), name: the calendar's name
export const renderIcs = ({ rows, origin, lang, name }) => {
  const now = stamp(new Date());
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ECCM//eccm.ee//ET', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    `X-WR-CALNAME:${text(name)}`, 'X-WR-TIMEZONE:Europe/Tallinn'];
  for (const e of rows) {
    const start = toUtc(e.starts_at);
    const end = e.ends_at ? toUtc(e.ends_at) : new Date(start.getTime() + (e.duration_min || 60) * 60000);
    const desc = [firstPara(e.body), e.ticket_url ? `${TICKET[lang]}: ${e.ticket_url}` : ''].filter(Boolean).join('\n\n');
    lines.push('BEGIN:VEVENT', `UID:event-${e.id}@eccm.ee`, `DTSTAMP:${now}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
      `SUMMARY:${text(e.title)}`);
    const where = [e.venue, e.address].filter(Boolean).join(', ');
    if (where) lines.push(`LOCATION:${text(where)}`);
    if (desc) lines.push(`DESCRIPTION:${text(desc)}`);
    lines.push(`URL:${origin}${PATH[e.tlang](e.slug)}`);
    if (e.updated_at) lines.push(`LAST-MODIFIED:${stamp(new Date(e.updated_at))}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
};
