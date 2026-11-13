// series.mjs: the series an event belongs to and a page can list, from the series table
// (migrations/0017_series.sql), asked 2026-11-13: "why not have dropdown and optional textfield on edit
// event/page?". The names are read once a minute per isolate, like the footer's logos (src/partners.mjs),
// and at once after a form makes a new series; the templates ask seriesName, which reads what was loaded.
import { slugify } from './editor.mjs';

let cache = { at: 0, names: new Map() };
export const resetSeries = () => { cache = { at: 0, names: new Map() }; };
export async function loadSeries(env) {
  if (Date.now() - cache.at <= 60000) return;
  // a database without the table (migration 0017 not applied) names no series
  try { cache = { at: Date.now(), names: new Map((await allSeries(env.DB)).map((r) => [r.key, r])) }; }
  catch { cache = { at: Date.now(), names: new Map() }; }
}
// the series' name in a language, or undefined for a key with no row
export const seriesName = (key, lang) => { const r = cache.names.get(key); return r ? r[`name_${lang}`] : undefined; };

// every series for the forms' dropdowns, the seven of the migration first and then in the order they were made
export const allSeries = async (db) => (await db.prepare('SELECT key, name_et, name_en FROM series ORDER BY created_at, rowid').all()).results;

// the seven keys event.category's CHECK allows (migrations/0006_tuma.sql); a series outside them leaves category at eccm
const CATEGORY_KEYS = ['eccm', 'koostoo', 'improtest', 'schoenberg', 'ulysses', 'u', 'tuma'];
export const categoryFor = (series) => (CATEGORY_KEYS.includes(series) ? series : 'eccm');

// the form's two fields into one key: the typed name when there is one, matched to a series whose name in either
// language or whose key is the same once case and whitespace are set aside, else a new series, v.newSeries, which
// the save inserts; otherwise the dropdown's choice. required: an event needs a series, a page may have none.
// Returns an error sentence or null
const norm = (x) => String(x ?? '').toLowerCase().replace(/\s+/g, '');
export function resolveSeries(v, list, required) {
  v.newSeries = null;
  const typed = v.series_new.replace(/\s+/g, ' ').trim();
  if (typed) {
    const key = slugify(typed);
    const same = list.find((r) => [r.name_et, r.name_en, r.key].some((n) => norm(n) === norm(typed)) || r.key === key);
    if (same) { v.series = same.key; v.series_new = ''; return null; }
    if (!key) return 'The new series needs a letter or a digit in its name.';
    v.series = key;
    v.newSeries = { key, name: typed.slice(0, 80) };
    return null;
  }
  if (!v.series) return required ? 'No series chosen.' : null;
  return list.some((r) => r.key === v.series) ? null : 'No such series. Choose one or type a new one.';
}
// the insert of a series a form typed, guarded the way the save's other statements are; nothing when a series of
// that key was made meanwhile
export const insertSeries = (db, s, guard = '1', g = []) =>
  db.prepare(`INSERT INTO series (key, name_et, name_en) SELECT ?, ?, ? WHERE ${guard} ON CONFLICT (key) DO NOTHING`).bind(s.key, s.name, s.name, ...g);

// the published events of a series still to come, in a language or else in Estonian, in the rows the events list
// draws (src/render/events.mjs); today is Tallinn's, YYYY-MM-DD
export const seriesEvents = async (db, lang, key, today) => (await db.prepare(`SELECT e.id, e.starts_at, COALESCE(NULLIF(t1.venue, ''), e.venue) AS venue, e.series, COALESCE(t1.slug, t0.slug) AS slug, COALESCE(t1.title, t0.title) AS title, COALESCE(t1.lang, t0.lang) AS tlang, COALESCE(t1.body, t0.body) AS body, m.key AS pic, m.width, m.height
    FROM event e LEFT JOIN event_text t1 ON t1.event_id = e.id AND t1.lang = ? LEFT JOIN event_text t0 ON t0.event_id = e.id AND t0.lang = 'et' LEFT JOIN media m ON m.id = e.image_id
    WHERE e.status = 'published' AND e.series = ? AND substr(e.starts_at, 1, 10) >= ? AND COALESCE(t1.title, t0.title) IS NOT NULL ORDER BY e.starts_at`).bind(lang, key, today).all()).results;
