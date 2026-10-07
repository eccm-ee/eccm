// joomla.mjs: the part of eccm.ee's Joomla Web Services API that Väin's server
// calls (tarmoj/radio1965, server/joomla_importer.py and the GET /articles/{id}
// proxy in server/main.py, read 2026-10-07), answered from the published
// notices (src/items.mjs) so that after cutover nothing changes on his side
// (asked 2026-10-07). Read-only and public: his server sends a Bearer token
// and any token, or none, is accepted.
//
//   GET /api/index.php/v1/content/articles        filter[state], filter[category], list[fullordering], list[limit]
//   GET /api/index.php/v1/content/articles/{id}   one article, or Joomla's 404
//   GET /api/index.php/v1/tags/{id}               a tag record; no notice carries tags, so it is never asked
//
// A notice ticked Väin is category 47, the one his importer reads; every other
// published notice is category 2 and is listed too, as Joomla would. The
// article id is the notice's num and its link is /teated/{num}. Dates are
// Tallinn's wall clock as "YYYY-MM-DD HH:MM:SS", which his importer parses as
// its own local time. modified is the later of the last edit and the moment
// the notice went public, so a scheduled notice is newer than his last poll
// when it appears and is not skipped.
import { ask } from './items.mjs';
import { md } from './render/md.mjs';
import { esc } from './render/html.mjs';
import { origin } from './render/chrome.mjs';

const BASE = '/api/index.php/v1';
const HEAD = { 'content-type': 'application/vnd.api+json', 'cache-control': 'public, max-age=60' };
const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: HEAD });
const notFound = () => reply({ errors: [{ title: 'Resource not found', code: 404 }] }, 404);

export const VAIN = 47;
const OTHER_CATEGORY = 2;

const stamp = (ms) => (ms == null ? null : new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Tallinn', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(new Date(Number(ms))));
const alias = (title) => String(title).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'teade';
const modifiedMs = (it) => Math.max(Number(it.updated_at || it.created_at), Number(it.published_at || it.publish_at));
const category = (it) => (Number(it.vain) ? VAIN : OTHER_CATEGORY);

// one notice as Joomla's JSON:API article record; the text is the body as the site draws it, and the
// notice's link under it when it has one, absolute, since the app shows the text alone
export const article = (it) => {
  const site = origin();
  const link = it.url ? (it.url.startsWith('/') ? site + it.url : it.url) : '';
  const text = md(it.body, { video: true }) + (link ? `\n<p><a href="${esc(link)}">${esc(link)}</a></p>` : '');
  const attributes = {
    id: Number(it.num), title: it.title, alias: alias(it.title), state: 1,
    text, introtext: text, fulltext: '',
    created: stamp(it.created_at), modified: stamp(modifiedMs(it)),
    publish_up: stamp(it.publish_at), publish_down: null,
    language: '*', link: `${site}/teated/${it.num}`, tags: [],
  };
  return { type: 'articles', id: String(it.num), attributes, relationships: { category: { data: { type: 'categories', id: String(category(it)) } } } };
};

// every value a query parameter carries under name and name[]
const all = (q, name) => [...q.getAll(name), ...q.getAll(`${name}[]`)].flatMap((v) => v.split(',')).map((v) => v.trim()).filter(Boolean);

const ORDER = { 'a.modified': modifiedMs, 'a.created': (it) => Number(it.created_at), 'a.publish_up': (it) => Number(it.publish_at), 'a.id': (it) => Number(it.num), 'a.title': (it) => it.title, 'a.ordering': (it) => Number(it.num) };

async function list(env, url) {
  const q = url.searchParams;
  let items = (await ask(env, '/published')).items;
  const state = all(q, 'filter[state]');
  if (state.length && !state.includes('1') && !state.includes('*')) items = [];
  const cats = all(q, 'filter[category]').map(Number);
  if (cats.length) items = items.filter((it) => cats.includes(category(it)));
  const [col, dir] = (q.get('list[fullordering]') || `${q.get('list[ordering]') || 'a.id'} ${q.get('list[direction]') || 'ASC'}`).trim().split(/\s+/);
  const key = ORDER[col] || ORDER['a.id'];
  const sign = String(dir).toUpperCase() === 'DESC' ? -1 : 1;
  items.sort((a, b) => { const x = key(a), y = key(b); return (x < y ? -1 : x > y ? 1 : Number(a.num) - Number(b.num)) * sign; });
  const limit = Math.min(100, Math.max(1, Number(q.get('list[limit]') || q.get('page[limit]')) || 20));
  const offset = Math.max(0, Number(q.get('page[offset]') || q.get('list[start]')) || 0);
  const pages = Math.max(1, Math.ceil(items.length / limit));
  const self = origin() + url.pathname + url.search;
  const at = (o) => { const u = new URL(url.pathname + url.search, origin()); u.searchParams.set('page[offset]', String(o)); u.searchParams.set('page[limit]', String(limit)); return u.toString(); };
  const links = { self, ...(offset + limit < items.length ? { next: at(offset + limit), last: at((pages - 1) * limit) } : {}), ...(offset > 0 ? { previous: at(Math.max(0, offset - limit)), first: at(0) } : {}) };
  return reply({ links, data: items.slice(offset, offset + limit).map(article), meta: { 'total-pages': pages } });
}

async function one(env, id) {
  const it = (await ask(env, '/published')).items.find((x) => String(x.num) === id);
  return it ? reply({ links: { self: `${origin()}${BASE}/content/articles/${id}` }, data: article(it) }) : notFound();
}

export async function joomlaApi(request, env, url) {
  const p = url.pathname.replace(/\/+$/, '');
  if (!p.startsWith(BASE + '/')) return null;
  const rest = p.slice(BASE.length);
  if (request.method !== 'GET' && request.method !== 'HEAD') return reply({ errors: [{ title: 'Method not allowed', code: 405 }] }, 405);
  if (rest === '/content/articles') return list(env, url);
  let m = /^\/content\/articles\/(\d+)$/.exec(rest);
  if (m) return one(env, m[1]);
  m = /^\/tags\/(\d+)$/.exec(rest);
  if (m) return reply({ data: { type: 'tags', id: m[1], attributes: { id: Number(m[1]), title: m[1], alias: m[1], published: 1 } } });
  return notFound();
}
