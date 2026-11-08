// stats.mjs: /admin/stats (src/stats.mjs has the ask): the last 90 days, views per day as a row of bars,
// then the pages, the sites readers came from and their countries, each the 20 most
import { html } from './html.mjs';
import { page } from './chrome.mjs';
import { table } from './table.mjs';

const num = (n) => Math.round(Number(n) || 0).toLocaleString('en').replace(/,/g, ' ');
// the last 90 days, every one of them, a day with no views a zero, so one busy day is one thin column and not the
// whole row (reported 2026-11-08: "what is black box???", then "show 3 months or smth and simle bars"); a date
// under the first of each month only
const DAYS = 90;
const span = (rows) => {
  const by = new Map(rows.map((r) => [String(r.day).slice(0, 10), Number(r.n || 0)]));
  return Array.from({ length: DAYS }, (_, i) => {
    const t = new Date(Date.now() - (DAYS - 1 - i) * 864e5), key = t.toISOString().slice(0, 10);
    return { key, label: `${t.getUTCDate()}.${t.getUTCMonth() + 1}`, n: by.get(key) || 0, first: t.getUTCDate() === 1 };
  });
};
const list = (label, head, rows) => html`<h2>${label}</h2>
  ${rows.length ? table({ label, cols: [{ label: head, cls: 'main' }, { label: 'Views', cls: 'num' }], rows: rows.map((r) => [r.k, num(r.n)]) }) : html`<p class="note">None yet.</p>`}`;

export const renderStats = ({ days = [], pages = [], from = [], countries = [], feeds = [], missing = false, error = '' }) => {
  const total = days.reduce((s, d) => s + Number(d.n || 0), 0);
  const cols = span(days);
  const max = Math.max(1, ...cols.map((d) => d.n));
  const body = missing
    ? html`  <h1>Stats</h1>
  <p class="note">Views are being counted. To read them here, this environment needs STATS_TOKEN, a Cloudflare API token with Account Analytics: Read, set with wrangler secret put STATS_TOKEN.</p>`
    : error
    ? html`  <h1>Stats</h1>
  <p class="note">Cloudflare did not answer: ${error}</p>`
    : html`  <h1>Stats</h1>
  <p class="note">${num(total)} page views in the last 90 days, at most ${num(max)} a day. Bots and the admin pages are not counted, and no visitor is identified.</p>
  <ol class="stats-days" aria-label="Views per day">
    ${cols.map((d) => html`<li style="--h: ${(d.n / max).toFixed(3)}" title="${d.label}: ${num(d.n)}"><span class="stats-bar"></span><span class="stats-d">${d.first ? d.label : ''}</span></li>`)}
  </ol>
  ${list('Pages', 'Page', pages)}
  ${list('Came from', 'Site', from)}
  ${list('Countries', 'Country', countries)}
  <h2>Feeds and calendars</h2>
  ${feeds.length ? table({ label: 'Feeds and calendars', cols: [{ label: 'Feed', cls: '' }, { label: 'Reader', cls: 'main' }, { label: 'Fetches', cls: 'num' }, { label: 'Subscribers', cls: 'num' }], rows: feeds.map((r) => [r.path, r.who || 'Unknown', num(r.n), Number(r.subs) ? num(r.subs) : '']) }) : html`<p class="note">None yet.</p>`}
  <p class="note">A reader like Feedly fetches for all its subscribers at once and says how many it serves; one that does not say counts as its fetches.</p>`;
  return page({ wide: true, lang: 'en', title: 'Stats.', body: html`<div class="stats">${body}</div>` });
};
