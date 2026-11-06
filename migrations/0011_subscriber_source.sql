-- 0011_subscriber_source.sql: where a subscriber came from (asked 2026-11-06,
-- with the import of the list ECCM already writes to: "use confirmed. its
-- existing list"). 'signup' is the double opt-in at /et/uudiskiri and
-- /en/newsletter, 'import' a paste at /edit/uudiskiri/tellijad, confirmed
-- with no mail. Every row before this came through the sign-up, so the
-- default fills them with 'signup' and nothing is left NULL.
ALTER TABLE subscriber ADD COLUMN source TEXT DEFAULT 'signup' CHECK (source IN ('signup','import'));
