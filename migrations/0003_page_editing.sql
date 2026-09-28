-- 0003_page_editing.sql: the two columns the editor needs on page, the same
-- two 0002_editing.sql gave event and for the same reasons. rev is the
-- optimistic lock of plans/plan-eccm-cms.md section 8: the form carries the
-- rev it was rendered from, every statement of a save is guarded by it, and a
-- save against a row somebody else saved meanwhile changes nothing and is
-- answered 409. updated_by is whoever the gate identified. Asked 2026-09-28
-- as "page from d1 and with edit?", the five text pages of data/seed-step3.sql
-- editable at /edit/pages the way the events are at /edit/events.
ALTER TABLE page ADD COLUMN rev INTEGER NOT NULL DEFAULT 1;
ALTER TABLE page ADD COLUMN updated_by TEXT;
