-- 0010_one_key.sql: one key for ECCM, the secret EDITOR_KEY (src/auth.mjs),
-- in place of a key per editor (asked 2026-11-06: "no its one eccm editor
-- key"), so the editor table of 0009 goes. login_fail stays, the count of
-- wrong keys per address.
DROP TABLE IF EXISTS editor;
