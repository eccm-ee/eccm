-- 0005_newsletter.sql: the newsletter, asked 2026-10-01 as "go" after
-- "can we start newsletter work event on nonpaid account? see ../trip".
-- plans/plan-eccm-cms.md section 7 is the schema, kept but for two things:
-- issue has a slug, since every sent issue is a page (section 5, hint 7),
-- and no created_by, since nobody logs in (src/editor.mjs says since when).
-- The outbox is ../trip's _emails (astro-prod/migrations/0013): a mail is a
-- row first and a send second, so a failed or impossible send stays a row,
-- and with no EMAIL binding (tests, a free plan's arbitrary recipient) the
-- rows are the capture.

CREATE TABLE subscriber (
  id              INTEGER PRIMARY KEY,
  email           TEXT NOT NULL UNIQUE COLLATE NOCASE,
  lang            TEXT NOT NULL DEFAULT 'et' CHECK (lang IN ('et','en')),
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','unsubscribed')),
  token           TEXT NOT NULL UNIQUE,    -- random, in the confirm and the unsubscribe links
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  confirmed_at    TEXT,
  unsubscribed_at TEXT
);

CREATE TABLE issue (                       -- one newsletter, one language
  id          INTEGER PRIMARY KEY,
  lang        TEXT NOT NULL CHECK (lang IN ('et','en')),
  slug        TEXT,                        -- set when sent; the archive page's address
  subject     TEXT NOT NULL DEFAULT '',
  body        TEXT NOT NULL DEFAULT '',    -- markdown, src/render/md.mjs; the composer pre-fills it from upcoming events
  status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent')),
  sent_at     TEXT,
  sent_count  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  UNIQUE (lang, slug)
);

CREATE TABLE outbox (
  id          INTEGER PRIMARY KEY,
  kind        TEXT NOT NULL CHECK (kind IN ('confirm','issue','test')),
  issue_id    INTEGER REFERENCES issue(id) ON DELETE SET NULL,
  to_addr     TEXT NOT NULL,
  subject     TEXT NOT NULL,
  text        TEXT NOT NULL,               -- the plain part, always
  html        TEXT,                        -- the HTML part, an issue's only
  unsub       TEXT,                        -- the one-click unsubscribe URL, RFC 8058
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  sent_at     TEXT,
  tries       INTEGER NOT NULL DEFAULT 0,
  error       TEXT
);
CREATE INDEX outbox_unsent ON outbox (sent_at, tries);
