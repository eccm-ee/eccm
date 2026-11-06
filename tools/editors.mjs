// tools/editors.mjs: the editors' keys (src/auth.mjs, migrations/0009_editor.sql),
// through wrangler d1 execute against the local database, or the remote one with --remote.
//
//   node tools/editors.mjs create "Name"     a new key, printed once and kept nowhere
//   node tools/editors.mjs list              every editor, revoked ones too
//   node tools/editors.mjs revoke <id>       the key stops working, its sessions end
//
//   add --remote --env staging (the default env) or --remote --env production
//
// The database is eccm-staging for staging and eccm for production, or --db <name>.
// The key is 12 characters of Crockford's alphabet in groups, xxxx-xxxx-xxxx, 60 bits;
// only the SHA-256 of its normalised form (normKey, the same line as src/auth.mjs) is stored.
import { execFileSync } from 'node:child_process';
import { createHash, randomInt } from 'node:crypto';

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i >= 0 ? args.splice(i, 2)[1] : null; };
const remote = args.includes('--remote');
if (remote) args.splice(args.indexOf('--remote'), 1);
const envName = flag('--env') || 'staging';
const db = flag('--db') || (envName === 'production' ? 'eccm' : 'eccm-staging');
const [cmd, arg] = args;

const ALPHABET = '0123456789abcdefghjkmnpqrstvwxyz';
const normKey = (k) => String(k || '').trim().toLowerCase().replace(/[\s-]/g, '').replace(/[il]/g, '1').replace(/o/g, '0');
const newKey = () => Array.from({ length: 3 }, () => Array.from({ length: 4 }, () => ALPHABET[randomInt(32)]).join('')).join('-');
const lit = (s) => `'${String(s).replace(/'/g, "''")}'`;

// a .env in the directory or a token in the shell would shadow the wrangler login (CLAUDE.md, Deploy)
const childEnv = { ...process.env };
delete childEnv.CF_API_TOKEN; delete childEnv.CLOUDFLARE_API_TOKEN;
const sql = (command) => {
  const out = execFileSync('npx', ['wrangler', 'd1', 'execute', db, remote ? '--remote' : '--local', '--env', envName, '--json', '--command', command], { encoding: 'utf8', env: childEnv, stdio: ['ignore', 'pipe', 'inherit'] });
  return JSON.parse(out).flatMap((r) => r.results || []);
};
const where = `${db} (${remote ? 'remote' : 'local'}, --env ${envName})`;

if (cmd === 'create' && arg && arg.trim()) {
  const key = newKey();
  const hash = createHash('sha256').update(normKey(key)).digest('hex');
  const [row] = sql(`INSERT INTO editor (name, key_hash) VALUES (${lit(arg.trim())}, ${lit(hash)}) RETURNING id`);
  console.log(`Editor ${row.id}, ${arg.trim()}, in ${where}.\nKey, shown this once: ${key}`);
} else if (cmd === 'list') {
  const rows = sql('SELECT id, name, created_at, last_used, revoked_at FROM editor ORDER BY id');
  if (!rows.length) console.log(`No editors in ${where}.`);
  for (const r of rows) console.log([r.id, r.name, `created ${r.created_at}`, `last used ${r.last_used || 'never'}`, r.revoked_at ? `revoked ${r.revoked_at}` : 'active'].join('\t'));
} else if (cmd === 'revoke' && /^\d+$/.test(arg || '')) {
  const rows = sql(`UPDATE editor SET revoked_at = strftime('%Y-%m-%dT%H:%M:%SZ','now') WHERE id = ${Number(arg)} AND revoked_at IS NULL RETURNING id, name`);
  console.log(rows.length ? `Revoked ${rows[0].id}, ${rows[0].name}, in ${where}.` : `No active editor ${arg} in ${where}.`);
} else {
  console.error('usage: node tools/editors.mjs create "Name" | list | revoke <id>  [--remote] [--env staging|production] [--db name]');
  process.exit(1);
}
