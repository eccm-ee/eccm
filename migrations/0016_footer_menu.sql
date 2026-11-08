-- 0016_footer_menu.sql: the footer's list of links chosen apart from the header's, asked 2026-11-08 ("layout /
-- header menu / footer menu / footer logos"). in_footer_menu is the Layout page's second tick; a page's menu
-- words serve both lists. Seeded with what the header lists today, which is what the footer showed.
ALTER TABLE page ADD COLUMN in_footer_menu INTEGER NOT NULL DEFAULT 0 CHECK (in_footer_menu IN (0,1));
UPDATE page SET in_footer_menu = in_menu;
