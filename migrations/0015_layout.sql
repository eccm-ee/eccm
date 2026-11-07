-- 0015_layout.sql: the menu from the pages, asked 2026-11-07: "how to mark
-- content page to be in the menu? (not events)", then "perhaps a Admin >
-- Layout where you can pick what pages to link and what logos go to footer?"
-- and "i do not care about menu order atm". in_menu is the Layout page's
-- tick; the two titles are the menu's words, short where a page's own title
-- is long ("NAN" for "Nordic Analog Network"), and empty means the page's
-- title. The order is menu_order, set once here and never edited: a page
-- ticked later goes last (src/layout.mjs). Events stays first, it is no page.
ALTER TABLE page ADD COLUMN in_menu INTEGER NOT NULL DEFAULT 0 CHECK (in_menu IN (0,1));
ALTER TABLE page ADD COLUMN menu_title_et TEXT NOT NULL DEFAULT '';
ALTER TABLE page ADD COLUMN menu_title_en TEXT NOT NULL DEFAULT '';
-- the five the menu has named since 2026-09-28, with the words it shows
UPDATE page SET in_menu = 1, menu_title_et = 'ECCM', menu_title_en = 'ECCM' WHERE key = 'eccm';
UPDATE page SET in_menu = 1, menu_title_et = 'Tallinn 1965', menu_title_en = 'Tallinn 1965' WHERE key = 'tallinn-1965';
UPDATE page SET in_menu = 1, menu_title_et = 'NAN', menu_title_en = 'NAN' WHERE key = 'nan';
UPDATE page SET in_menu = 1, menu_title_et = 'Ulysses', menu_title_en = 'Ulysses' WHERE key = 'ulysses';
UPDATE page SET in_menu = 1, menu_title_et = 'Konkursid', menu_title_en = 'Open calls' WHERE key = 'konkursid';
