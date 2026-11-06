// tools/clear-test-rows.mjs: a copy of a `wrangler d1 export` file without the
// rows staging collects while it is tried out, so the content (events, pages,
// pictures, roles) moves to production and the test traffic does not.
//
//   npx wrangler d1 export eccm-staging --remote --env staging --output tmp/staging.sql
//   node tools/clear-test-rows.mjs tmp/staging.sql tmp/production.sql
//   npx wrangler d1 execute eccm --remote --env production --file tmp/production.sql
//
// Cleared by default, each one's INSERTs dropped and its CREATE TABLE kept:
//   subscriber      sign-ups made while testing the newsletter (migrations/0005_newsletter.sql)
//   issue           newsletter drafts and test sends, a sent one would show in the archive (0005)
//   outbox          every mail queued or sent: confirmations, issues, contact copies (0005, 0008)
//   contact         messages sent through the contact form (0008_contact.sql)
//   redirect_miss   old Joomla addresses staging was asked for (0007_redirect_miss.sql)
//   login_fail      wrong keys typed at /login, an hour's worth (0009_editor.sql)
//   editor          staging's keys, so production starts with the ones tools/editors.mjs makes there (0009)
// A table missing from the export counts 0. --keep editor keeps a table's rows, --also name clears another table's.
// Not in the export at all: the push subscriptions and the notices, which
// live in the Items Durable Object (src/items.mjs), not in D1.
//
// The file is split into statements with quotes respected, so a value holding
// a semicolon or a newline never cuts one in two. Counts go to stderr.
import { readFileSync, writeFileSync } from 'node:fs';

const DEFAULT = ['subscriber', 'issue', 'outbox', 'contact', 'redirect_miss', 'login_fail', 'editor'];

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

const src = readFileSync(input, 'utf8');
const removed = Object.fromEntries([...clear].map((t) => [t, 0]));
const kept = {};
const out = [];
for (const s of statements(src)) {
  const t = target(s);
  if (t && clear.has(t)) { removed[t]++; continue; }
  if (t) kept[t] = (kept[t] || 0) + 1;
  out.push(s);
}
writeFileSync(output, out.join(''));

const w = Math.max(...Object.keys({ ...removed, ...kept }).map((t) => t.length));
console.error(`removed from ${input}:`);
for (const [t, n] of Object.entries(removed)) console.error(`  ${t.padEnd(w)}  ${n}`);
console.error(`kept in ${output}:`);
for (const [t, n] of Object.entries(kept).sort()) console.error(`  ${t.padEnd(w)}  ${n}`);
