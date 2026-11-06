// tools/clear-test-rows.mjs: a copy of a `wrangler d1 export` file without the
// rows staging collects while it is tried out, so the content (events, pages,
// pictures, roles) moves to production and the test traffic does not.
//
//   npx wrangler d1 export eccm-staging --remote --env staging --output tmp/staging.sql
//   node tools/clear-test-rows.mjs tmp/staging.sql tmp/production.sql
//   npx wrangler d1 execute eccm --remote --env production --file tmp/production.sql
//
// Cleared by default, each one's INSERTs dropped and its CREATE TABLE kept:
//   subscriber      sign-ups made while testing the newsletter (migrations/0005_newsletter.sql); a row
//                   imported at /edit/uudiskiri/tellijad, source 'import' (0011_subscriber_source.sql),
//                   is ECCM's real list and is kept
//   issue           newsletter drafts and test sends, a sent one would show in the archive (0005)
//   outbox          every mail queued or sent: confirmations, issues, contact copies (0005, 0008)
//   contact         messages sent through the contact form (0008_contact.sql)
//   redirect_miss   old Joomla addresses staging was asked for (0007_redirect_miss.sql)
//   login_fail      wrong keys typed at /login, an hour's worth (0009_editor.sql)
// A table missing from the export counts 0. --keep contact keeps a table's rows, --also name clears another table's.
// The editor key is a secret (EDITOR_KEY), not a row, so nothing of it is in the export.
//
// The file is split into statements with quotes respected, so a value holding
// a semicolon or a newline never cuts one in two. Counts go to stderr.
import { readFileSync, writeFileSync } from 'node:fs';

const DEFAULT = ['subscriber', 'issue', 'outbox', 'contact', 'redirect_miss', 'login_fail'];

const args = process.argv.slice(2);
const flag = (name) => args.flatMap((a, i) => (a === name && args[i + 1] ? [args[i + 1]] : []));
const keep = new Set(flag('--keep'));
const also = flag('--also');
const files = args.filter((a, i) => !a.startsWith('--') && !['--keep', '--also'].includes(args[i - 1]));
const [input, output = input?.replace(/\.sql$/, '') + '-clean.sql'] = files;
if (!input) {
  console.error('usage: node tools/clear-test-rows.mjs <export.sql> [out.sql] [--keep table] [--also table]');
  process.exit(1);
}
const clear = new Set([...DEFAULT, ...also].filter((t) => !keep.has(t)));

// statements, each with its trailing semicolon and newline, split outside
// single-quoted strings, double-quoted names and comments
function statements(sql) {
  const out = [];
  let start = 0;
  for (let i = 0; i < sql.length; i++) {
    const c = sql[i];
    if (c === "'" || c === '"') {
      const q = c;
      for (i++; i < sql.length; i++) {
        if (sql[i] === q) { if (sql[i + 1] === q) i++; else break; }
      }
    } else if (c === '-' && sql[i + 1] === '-') {
      while (i < sql.length && sql[i] !== '\n') i++;
    } else if (c === ';') {
      let end = i + 1;
      if (sql[end] === '\n') end++;
      out.push(sql.slice(start, end));
      start = end;
    }
  }
  if (start < sql.length) out.push(sql.slice(start));
  return out;
}

const target = (stmt) => {
  const m = /^\s*INSERT\s+(?:OR\s+\w+\s+)?INTO\s+(?:"((?:[^"]|"")+)"|`([^`]+)`|\[([^\]]+)\]|(\w+))/i.exec(stmt);
  return m ? (m[1]?.replace(/""/g, '"') ?? m[2] ?? m[3] ?? m[4]) : null;
};

// one INSERT's values as written, quotes respected; with no column list, source is subscriber's last column
// (0011 added it with ALTER TABLE, which appends)
const values = (stmt) => {
  const m = /\bVALUES\s*\(([\s\S]*)\)\s*;?\s*$/i.exec(stmt);
  if (!m) return [];
  const out = [];
  let cur = '', q = false;
  for (let i = 0; i < m[1].length; i++) {
    const c = m[1][i];
    if (c === "'") { if (q && m[1][i + 1] === "'") { cur += c; i++; } else q = !q; continue; }
    if (c === ',' && !q) { out.push(cur.trim()); cur = ''; } else cur += c;
  }
  out.push(cur.trim());
  return out;
};
const columns = (stmt) => {
  const m = /^\s*INSERT\s+(?:OR\s+\w+\s+)?INTO\s+\S+\s*\(([^)]*)\)\s*VALUES/i.exec(stmt);
  return m ? m[1].split(',').map((c) => c.trim().replace(/^["`\[]|["`\]]$/g, '')) : null;
};
const imported = (stmt) => {
  const v = values(stmt), cols = columns(stmt);
  return (cols ? v[cols.indexOf('source')] : v[v.length - 1]) === 'import';
};
const KEEP_ROW = { subscriber: imported };

const src = readFileSync(input, 'utf8');
const removed = Object.fromEntries([...clear].map((t) => [t, 0]));
const kept = {};
const out = [];
for (const s of statements(src)) {
  const t = target(s);
  if (t && clear.has(t) && !KEEP_ROW[t]?.(s)) { removed[t]++; continue; }
  if (t) kept[t] = (kept[t] || 0) + 1;
  out.push(s);
}
writeFileSync(output, out.join(''));

const w = Math.max(...Object.keys({ ...removed, ...kept }).map((t) => t.length));
console.error(`removed from ${input}:`);
for (const [t, n] of Object.entries(removed)) console.error(`  ${t.padEnd(w)}  ${n}`);
console.error(`kept in ${output}:`);
for (const [t, n] of Object.entries(kept).sort()) console.error(`  ${t.padEnd(w)}  ${n}`);
