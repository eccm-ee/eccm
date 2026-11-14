-- 0019_redirect.sql: the redirect table (layer 1 of plans/plan-eccm-urls-sitemap-rss.md section 3, never built
-- until 2026-11-14) and the two-way log asked for that day: "two-way log missed URLs. We need to keep track of
-- those and learn from redirects, because there might be pages which we didn't even know browsers are requesting."
CREATE TABLE redirect (
  from_path   TEXT PRIMARY KEY,            -- lowercase path and its query, trackers removed: '/index.php/et/ulysses/ulysses-uudised/kandideeri-u-koosloome-programmi'
  to_path     TEXT NOT NULL DEFAULT '',     -- a path that answers 200 itself: '/et/koosloome-programm'; '' with 410
  status      INTEGER NOT NULL DEFAULT 301 CHECK (status IN (301, 410)),
  source      TEXT NOT NULL DEFAULT 'hand', -- 'hand', 'joomla', 'miss'
  note        TEXT NOT NULL DEFAULT '',
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- every redirect answered, by the address asked and the rule that answered it
CREATE TABLE redirect_hit (
  from_path   TEXT PRIMARY KEY,
  to_path     TEXT NOT NULL,
  rule        TEXT NOT NULL,                -- 'table', 'event', 'menu', 'parent', 'page', 'picture', 'home', 'list', 'feed'
  count       INTEGER NOT NULL DEFAULT 1,
  bots        INTEGER NOT NULL DEFAULT 0,   -- of count, the ones from a bot or a data centre
  first_seen  TEXT NOT NULL,
  last_seen   TEXT NOT NULL
);

-- the miss log now takes every 404 on the site, not only old Joomla addresses
ALTER TABLE redirect_miss ADD COLUMN bots INTEGER NOT NULL DEFAULT 0;
ALTER TABLE redirect_miss ADD COLUMN area TEXT NOT NULL DEFAULT 'old';   -- 'old' an /index.php or /images/ address, 'site' any other
ALTER TABLE redirect_miss ADD COLUMN referrer TEXT NOT NULL DEFAULT '';  -- the last other site that linked here, host only
