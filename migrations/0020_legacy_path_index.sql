-- 0020: the old addresses' lookup by page_text.legacy_path read the whole table each time, 101,809 times on
-- 2026-11-15 (wrangler d1 insights), as crawlers walked eccm.ee's old Joomla addresses (src/redirects.mjs)
CREATE INDEX IF NOT EXISTS page_text_legacy_path ON page_text (legacy_path);
