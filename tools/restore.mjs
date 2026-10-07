// tools/restore.mjs: one daily backup (src/backup.mjs, d1/YYYY-MM-DD.json in
// the BACKUP bucket) back into SQL for wrangler d1 execute.
//
//   npx wrangler r2 object get eccm-backup-staging/d1/2026-10-07.json --remote --file backup.json
//   node tools/restore.mjs backup.json > restore.sql
//   npx wrangler d1 execute eccm-staging --env staging --remote --file restore.sql
//
// The output empties every table in the file and inserts its rows, parents
// before children (read off each table's REFERENCES), so it runs on a database
// whose schema is already there: the live one, or a fresh one after
// `d1 migrations apply`. --schema puts each table's CREATE TABLE first instead
// of the DELETEs, for an empty database with no migrations applied.
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const schema = args.includes('--schema');
const file = args.find((a) => !a.startsWith('--'));
if (!file) { console.error('usage: node tools/restore.mjs <backup.json> [--schema] > restore.sql'); process.exit(1); }

const { format, day, tables } = JSON.parse(readFileSync(file, 'utf8'));
if (format !== 1) { console.error(`unknown backup format ${format}`); process.exit(1); }

const id = (s) => `"${String(s).replace(/"/g, '""')}"`;
const lit = (v) => {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'NULL';
  if (typeof v === 'boolean') return v ? '1' : '0';
  if (typeof v === 'object' && typeof v.$hex === 'string') return `X'${v.$hex}'`;
  return `'${String(v).replace(/'/g, "''")}'`;
};

// parents first: a table waits for every other table its sql REFERENCES
const names = Object.keys(tables);
const deps = Object.fromEntries(names.map((n) => [n, [...(tables[n].sql || '').matchAll(/REFERENCES\s+"?(\w+)"?/gi)].map((m) => m[1]).filter((d) => d !== n && tables[d])]));
const order = [];
const seen = new Set();
const visit = (n, path = new Set()) => {
  if (seen.has(n) || path.has(n)) return;
  path.add(n);
  for (const d of deps[n]) visit(d, path);
  seen.add(n);
  order.push(n);
};
names.sort().forEach((n) => visit(n));

const out = [`-- restore of the eccm D1 backup of ${day}, written by tools/restore.mjs`, 'PRAGMA defer_foreign_keys = true;'];
if (schema) for (const n of order) out.push(`${tables[n].sql};`);
else for (const n of [...order].reverse()) out.push(`DELETE FROM ${id(n)};`);
for (const n of order) {
  const { columns, rows } = tables[n];
  if (!rows.length) continue;
  const cols = columns.map(id).join(', ');
  for (const r of rows) out.push(`INSERT INTO ${id(n)} (${cols}) VALUES (${r.map(lit).join(', ')});`);
}
process.stdout.write(out.join('\n') + '\n');
const count = names.reduce((s, n) => s + tables[n].rows.length, 0);
console.error(`${day}: ${names.length} tables, ${count} rows`);
