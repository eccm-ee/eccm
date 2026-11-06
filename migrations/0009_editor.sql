-- 0009_editor.sql: the people who may edit, each with a key of their own
-- (src/auth.mjs), in place of the Cloudflare Access the plan had. key_hash
-- is the SHA-256 of the key as normalised (case, dashes and spaces dropped,
-- i and l as 1, o as 0); the key itself is printed once by tools/editors.mjs
-- and kept nowhere. A revoked row stays, so updated_by keeps naming someone.
CREATE TABLE editor (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  key_hash    TEXT NOT NULL UNIQUE,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  last_used   TEXT,
  revoked_at  TEXT
);

-- the wrong keys, one row each, counted per address over the last hour
-- (ten, then 429). The address is kept only as a SHA-256 hash, as contact's
-- is, and rows older than an hour are deleted on every wrong key.
CREATE TABLE login_fail (
  ip_hash     TEXT NOT NULL,
  at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
CREATE INDEX login_fail_ip ON login_fail (ip_hash, at);
