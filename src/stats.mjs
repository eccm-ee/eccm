// stats.mjs: page views, asked 2026-11-08 ("A sinple web stats to admin page?", then "Can y not query cf
// analytics?"). Every page a reader is shown is one data point in Workers Analytics Engine (binding VIEWS):
// the path, the site the reader came from, the country and the page's language. No IP, no cookie, nothing
// that names a person, so no consent is needed. Bots, files and the tools are not counted. The points are kept
// three months; /admin/stats reads them back through the Analytics Engine SQL API with STATS_TOKEN, an API
// token that can only read analytics (Account Analytics: Read), made once per account in the dashboard.
// Before the zone move there is no zone traffic to read, which is why the Worker counts for itself.
import { renderStats } from './render/stats.mjs';

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|whatsapp|telegram|discord|curl|wget|python|httpclient|headless|lighthouse|pagespeed|monitor|uptime|feed|scrap/i;
const TOOLS = /^\/(admin|edit|login|logout|ui|media|og|cdn-cgi)(\/|$)/;

// a feed reader's name from its user agent, its first word ("Feedly/1.0 ..." is Feedly), and the subscribers
// it says it serves when it says ("... 123 subscribers"), which is how a feed's readers are counted at all
const reader = (ua) => ({ name: (/^([\w .-]+?)[/ (]/.exec(ua) || [, ua])[1].slice(0, 60), subs: Number((/(\d+) (?:subscribers|readers)/i.exec(ua) || [])[1] || 0) });
const FEED = /^\/(et|en)\/(feed\.xml|sundmused\.ics|events\.ics)$/;

// one view, after the response is made: a GET that drew an HTML page with 200, from something that looks like a
// person; and, asked the same day ("Rss?"), each fetch of a feed or calendar with the reader's name, bots welcome
export function recordView(request, env, url, res) {
  if (!env.VIEWS || request.method !== 'GET' || !res || res.status !== 200) return;
  const p = url.pathname;
  if (FEED.test(p)) {
    const r = reader(request.headers.get('user-agent') || '');
    try { env.VIEWS.writeDataPoint({ blobs: [p, r.name, String(request.cf?.country || ''), p.startsWith('/en') ? 'en' : 'et', 'feed'], doubles: [1, r.subs], indexes: ['feed'] }); } catch {}
    return;
  }
  if (!(res.headers.get('content-type') || '').startsWith('text/html')) return;
  if (TOOLS.test(p)) return;
  const ua = request.headers.get('user-agent') || '';
  if (!ua || BOT.test(ua) || request.cf?.verifiedBotCategory) return;
  let from = '';
  // a newsletter's link says which issue it came from (src/render/mail.mjs), since mail apps send no referer
  const tagged = url.searchParams.get('from');
  if (tagged && /^uudiskiri-\d+$/.test(tagged)) from = tagged;
  else try { const r = new URL(request.headers.get('referer') || ''); if (r.hostname !== url.hostname) from = r.hostname.replace(/^www\./, ''); } catch {}
  const lang = p.startsWith('/en') ? 'en' : 'et';
  try { env.VIEWS.writeDataPoint({ blobs: [p.slice(0, 200), from.slice(0, 100), String(request.cf?.country || ''), lang, 'page'], doubles: [1, 0], indexes: [lang] }); } catch {}
}

// the Analytics Engine SQL API; every count weighs each point by its sample interval, since the engine samples
const sql = async (env, query) => {
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.STATS_ACCOUNT}/analytics_engine/sql`, {
    method: 'POST', headers: { authorization: `Bearer ${env.STATS_TOKEN}` }, body: query,
  });
  if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 200)}`);
  return (await r.json()).data || [];
};

const HEAD = { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' };
export async function stats(request, env) {
  const ds = env.STATS_DATASET;
  if (!env.STATS_TOKEN || !env.STATS_ACCOUNT || !ds) return new Response(String(renderStats({ missing: true })), { headers: HEAD });
  const since = "timestamp > NOW() - INTERVAL '30' DAY AND blob5 = 'page'";
  const top = (blob, extra = '') => `SELECT ${blob} AS k, SUM(_sample_interval) AS n FROM ${ds} WHERE ${since}${extra} GROUP BY k ORDER BY n DESC LIMIT 20`;
  try {
    const [days, pages, from, countries, feeds] = await Promise.all([
      sql(env, `SELECT toStartOfInterval(timestamp, INTERVAL '1' DAY) AS day, SUM(_sample_interval) AS n FROM ${ds} WHERE ${since} GROUP BY day ORDER BY day`),
      sql(env, top('blob1')),
      sql(env, top('blob2', " AND blob2 != ''")),
      sql(env, top('blob3', " AND blob3 != ''")),
      // each feed and calendar: its fetches, and per reader the most subscribers it reported in the period
      sql(env, `SELECT blob1 AS path, blob2 AS who, SUM(_sample_interval) AS n, MAX(double2) AS subs FROM ${ds} WHERE timestamp > NOW() - INTERVAL '30' DAY AND blob5 = 'feed' GROUP BY path, who ORDER BY n DESC LIMIT 30`),
    ]);
    return new Response(String(renderStats({ days, pages, from, countries, feeds })), { headers: HEAD });
  } catch (e) {
    return new Response(String(renderStats({ error: String(e.message || e) })), { headers: HEAD });
  }
}
