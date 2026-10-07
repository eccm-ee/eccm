-- 0007_redirect_miss.sql: every old Joomla address (/index.php, /images/) that
-- src/redirects.mjs could not map, counted, so the misses the world asks for
-- become redirects (plans/plan-eccm-urls-sitemap-rss.md section 3).
CREATE TABLE redirect_miss (
  path        TEXT PRIMARY KEY,            -- the path and its query, trackers removed: '/index.php/et/5-uele-heli-2024'
  count       INTEGER NOT NULL DEFAULT 1,
  first_seen  TEXT NOT NULL,               -- '2026-10-07T16:00:00Z'
  last_seen   TEXT NOT NULL
);
