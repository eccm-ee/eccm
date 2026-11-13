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
// a data centre is not a reader (asked 2026-11-13, "are us visitors bots": 291 views from the US and Canada in two
// hours after the cutover, no referrer, fifty pages each, with ordinary browser names). The Free plan has no bot
// score, so the network decides: the big clouds and hosts by number, and any other whose name says hosting. A
// reader on Cloudflare's WARP (13335) stays counted
const HOSTING_ASN = new Set([16509, 14618, 8987, 15169, 396982, 19527, 8075, 8068, 14061, 24940, 213230, 16276, 63949, 20473, 45102, 37963, 132203, 45090, 31898, 36352, 9009, 212238, 60068, 51167, 12876, 8100, 46606, 26496, 197540, 55286, 62240, 60781, 28753, 16125, 47583, 35916, 40021, 174, 23470, 398324, 399629, 208091, 211252, 202425, 136907, 55990]);
const HOSTING_NAME = /amazon|aws|google cloud|microsoft|azure|digitalocean|hetzner|ovh|linode|akamai|vultr|choopa|alibaba|tencent|oracle|contabo|scaleway|m247|datacamp|cdn77|colocrossing|leaseweb|hostinger|ionos|netcup|quadranet|psychz|clouvider|hosting|datacenter|data center|server|cloud|vps/i;
const hosting = (cf) => !!cf && Number(cf.asn) !== 13335 && (HOSTING_ASN.has(Number(cf.asn)) || HOSTING_NAME.test(String(cf.asOrganization || '')));

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
  if (!ua || BOT.test(ua) || request.cf?.verifiedBotCategory || hosting(request.cf)) return;
  let from = '';
  // a newsletter's link says which issue it came from (src/render/mail.mjs), since mail apps send no referer
  const tagged = url.searchParams.get('from');
  if (tagged && /^uudiskiri-\d+$/.test(tagged)) from = tagged;
  else try { const r = new URL(request.headers.get('referer') || ''); if (r.hostname !== url.hostname) from = r.hostname.replace(/^www\./, ''); } catch {}
  const lang = p.startsWith('/en') ? 'en' : 'et';
  try { env.VIEWS.writeDataPoint({ blobs: [p.slice(0, 200), from.slice(0, 100), String(request.cf?.country || ''), lang, 'page', String(request.cf?.asn || ''), String(request.cf?.asOrganization || '').slice(0, 80)], doubles: [1, 0], indexes: [lang] }); } catch {}
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
  // a view counted before the network was recorded (blob6 empty, until 2026-11-13) that came from abroad with no
  // referrer is left out: that was the shape of the bots after the cutover, and stored points cannot be deleted
  const since = "timestamp > NOW() - INTERVAL '90' DAY AND blob5 = 'page' AND NOT (blob6 = '' AND blob3 != 'EE' AND blob2 = '')";
  const top = (blob, extra = '') => `SELECT ${blob} AS k, SUM(_sample_interval) AS n FROM ${ds} WHERE ${since}${extra} GROUP BY k ORDER BY n DESC LIMIT 20`;
  try {
    const [days, pages, from, countries, feeds] = await Promise.all([
      sql(env, `SELECT toStartOfInterval(timestamp, INTERVAL '1' DAY) AS day, SUM(_sample_interval) AS n FROM ${ds} WHERE ${since} GROUP BY day ORDER BY day`),
      sql(env, top('blob1')),
      sql(env, top('blob2', " AND blob2 != ''")),
      sql(env, top('blob3', " AND blob3 != ''")),
      // each feed and calendar: its fetches, and per reader the most subscribers it reported in the period
      sql(env, `SELECT blob1 AS path, blob2 AS who, SUM(_sample_interval) AS n, MAX(double2) AS subs FROM ${ds} WHERE timestamp > NOW() - INTERVAL '90' DAY AND blob5 = 'feed' GROUP BY path, who ORDER BY n DESC LIMIT 30`),
    ]);
    return new Response(String(renderStats({ days, pages, from, countries, feeds })), { headers: HEAD });
  } catch (e) {
    return new Response(String(renderStats({ error: String(e.message || e) })), { headers: HEAD });
  }
}
