-- 0001_step1.sql: the seven tables of plans/plan-eccm-cms-step-1.md section 2.
-- Times are ISO 8601 text in Europe/Tallinn local time; the Worker adds the
-- offset when it prints one. One row per thing, one text row per language,
-- Estonian as the fallback.

CREATE TABLE media (
  id          INTEGER PRIMARY KEY,
  key         TEXT NOT NULL UNIQUE,        -- step 1: the file name under public/; later the R2 key (sha256 plus extension)
  width       INTEGER NOT NULL,
  height      INTEGER NOT NULL,
  alt_et      TEXT NOT NULL DEFAULT '',
  alt_en      TEXT NOT NULL DEFAULT '',
  scheme      TEXT,                        -- JSON, the flat contract of plan-eccm-social-images.md section 4; NULL until computed
  scheme_v    INTEGER,                     -- the detector version that wrote scheme; NULL with it
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);

CREATE TABLE event (
  id            INTEGER PRIMARY KEY,
  starts_at     TEXT NOT NULL,             -- '2026-09-30T19:00'
  ends_at       TEXT,                      -- NULL for one evening
  duration_min  INTEGER,                   -- 60 for Gestures; NULL when nobody typed it
  venue         TEXT NOT NULL DEFAULT '',  -- 'ECCM saal'
  address       TEXT NOT NULL DEFAULT '',  -- 'Herne 11A, Tallinn'
  ticket_url    TEXT NOT NULL DEFAULT '',
  website_url   TEXT NOT NULL DEFAULT '',
  category      TEXT NOT NULL DEFAULT 'eccm'
                CHECK (category IN ('eccm','koostoo','improtest','schoenberg','ulysses','u')),
  image_id      INTEGER REFERENCES media(id),
  status        TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published')),
  publish_at    TEXT,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
CREATE INDEX event_starts ON event (starts_at);

CREATE TABLE event_text (
  event_id    INTEGER NOT NULL REFERENCES event(id) ON DELETE CASCADE,
  lang        TEXT NOT NULL CHECK (lang IN ('et','en')),
  slug        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL DEFAULT '',    -- markdown, the subset src/render/md.mjs renders
  legacy_id   INTEGER,                     -- the iCagenda id in this language: 134 and 135 are one event
  PRIMARY KEY (event_id, lang),
  UNIQUE (lang, slug),
  UNIQUE (lang, legacy_id)
);

-- the credits: one line per role, in order, names typed once, labels from a
-- dictionary; decided 2026-09-27, plan section 1
CREATE TABLE role (
  key         TEXT PRIMARY KEY,
  label_et    TEXT NOT NULL,
  label_en    TEXT NOT NULL,
  sort        INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE event_credit (
  id          INTEGER PRIMARY KEY,
  event_id    INTEGER NOT NULL REFERENCES event(id) ON DELETE CASCADE,
  position    INTEGER NOT NULL,            -- the line's order on the page
  role_key    TEXT REFERENCES role(key),   -- NULL for a one-off role, typed below in both languages
  label_et    TEXT,
  label_en    TEXT,
  people      TEXT NOT NULL DEFAULT '[]',  -- JSON [{"name":"Marianna Liik","note":{"et":"","en":""}}, ...]
  orgs        TEXT NOT NULL DEFAULT '[]'   -- JSON [{"et":"Eesti Nüüdismuusika Keskus","en":"Estonian Centre of Contemporary Music"}, ...]
);
CREATE INDEX event_credit_event ON event_credit (event_id, position);

CREATE TABLE page (
  id          INTEGER PRIMARY KEY,
  key         TEXT NOT NULL UNIQUE,        -- 'eccm'
  parent_key  TEXT REFERENCES page(key),
  menu_order  INTEGER NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published')),
  publish_at  TEXT,
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
CREATE TABLE page_text (
  page_id     INTEGER NOT NULL REFERENCES page(id) ON DELETE CASCADE,
  lang        TEXT NOT NULL CHECK (lang IN ('et','en')),
  slug        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL DEFAULT '',
  legacy_path TEXT,                        -- '/index.php/en/eccm-new-eng'
  PRIMARY KEY (page_id, lang),
  UNIQUE (lang, slug)
);
