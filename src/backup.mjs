// backup.mjs: the daily copy of the database (plans/plan-eccm-migration.md, Backups).
// Cloudflare keeps 7 days of D1 history and nothing once the database or the
// account is gone, so the five-minute cron, once per UTC day, reads every
// table and writes one JSON file into the R2 bucket bound as BACKUP, at
// d1/YYYY-MM-DD.json, and deletes the files older than 30 days. The guard is
// the day's own file: if it exists the run does nothing, so no KV and no
// state. Not into git, since the database holds subscribers' addresses.
// tools/restore.mjs turns one file back into INSERT statements.
//
// The file: { format: 1, day, taken, tables: { name: { sql, columns, rows } } },
// rows as arrays in column order, a BLOB as { $hex } (no table has one today).

const KEEP_DAYS = 30;
const skip = (name) => name.startsWith('_cf_') || name.startsWith('sqlite_') || name === 'd1_migrations';

const cell = (v) => {
  if (v instanceof ArrayBuffer || ArrayBuffer.isView(v)) {
    const b = v instanceof ArrayBuffer ? new Uint8Array(v) : new Uint8Array(v.buffer, v.byteOffset, v.byteLength);
    return { $hex: [...b].map((x) => x.toString(16).padStart(2, '0')).join('') };
  }
  return v;
};

export async function dump(db) {
  const list = (await db.prepare("SELECT name, sql FROM sqlite_master WHERE type = 'table' ORDER BY name").all()).results;
  const tables = {};
  for (const { name, sql } of list) {
    if (skip(name)) continue;
    const [columns = [], ...rows] = await db.prepare(`SELECT * FROM "${name.replace(/"/g, '""')}"`).raw({ columnNames: true });
    tables[name] = { sql, columns, rows: rows.map((r) => r.map(cell)) };
  }
  return tables;
}

// once per UTC day, from scheduled(); a binding left out (production until
// cutover) makes it a no-op
export async function backup(env, when = Date.now()) {
  if (!env.BACKUP || !env.DB) return;
  const day = new Date(when).toISOString().slice(0, 10);
  const key = `d1/${day}.json`;
  if (await env.BACKUP.head(key)) return;
  const tables = await dump(env.DB);
  await env.BACKUP.put(key, JSON.stringify({ format: 1, day, taken: new Date(when).toISOString(), tables }), {
    httpMetadata: { contentType: 'application/json' },
  });
  const oldest = new Date(when - KEEP_DAYS * 86400000).toISOString().slice(0, 10);
  let cursor;
  do {
    const page = await env.BACKUP.list({ prefix: 'd1/', cursor });
    const old = page.objects.map((o) => o.key).filter((k) => /^d1\/\d{4}-\d{2}-\d{2}\.json$/.test(k) && k.slice(3, 13) < oldest);
    if (old.length) await env.BACKUP.delete(old);
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
}
