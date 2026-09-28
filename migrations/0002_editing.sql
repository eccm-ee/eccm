-- 0002_editing.sql: the two columns the editor needs on event. rev is the
-- optimistic lock of plans/plan-eccm-cms.md section 8: the form carries the
-- rev it was rendered from, every statement of a save is guarded by it, and
-- a save against a row somebody else saved meanwhile changes nothing and is
-- answered 409. updated_by is whoever the gate identified, the Access email
-- once Access is in front, the word token while the staging stand-in is.
ALTER TABLE event ADD COLUMN rev INTEGER NOT NULL DEFAULT 1;
ALTER TABLE event ADD COLUMN updated_by TEXT;
