-- 0006_tuma.sql: TUMA as a series key (asked 2026-10-03, "eventpage fixes":
-- Scrapyard and Sound Plasma printed "Sari: Koostöö"). SQLite cannot change a
-- CHECK in place, so event is rebuilt. Dropping it deletes through the ON
-- DELETE CASCADE of event_text and event_credit, so both are copied aside
-- first and put back after; the data moves in data/seed-step7.sql.
PRAGMA defer_foreign_keys = true;

CREATE TABLE keep_event_text AS SELECT * FROM event_text;
CREATE TABLE keep_event_credit AS SELECT * FROM event_credit;

CREATE TABLE event_new (
  id            INTEGER PRIMARY KEY,
  starts_at     TEXT NOT NULL,             -- '2026-09-30T19:00'; T00:00 is a day with no hour given
  ends_at       TEXT,                      -- NULL for one evening
  duration_min  INTEGER,                   -- 60 for Gestures; NULL when nobody typed it
  venue         TEXT NOT NULL DEFAULT '',  -- 'ECCM saal'
  address       TEXT NOT NULL DEFAULT '',  -- 'Herne 11A, Tallinn'
  ticket_url    TEXT NOT NULL DEFAULT '',
  website_url   TEXT NOT NULL DEFAULT '',
  category      TEXT NOT NULL DEFAULT 'eccm'
                CHECK (category IN ('eccm','koostoo','improtest','schoenberg','ulysses','u','tuma')),
  image_id      INTEGER REFERENCES media(id),
  status        TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published')),
  publish_at    TEXT,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  rev           INTEGER NOT NULL DEFAULT 1,
  updated_by    TEXT
);
INSERT INTO event_new (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at, created_at, updated_at, rev, updated_by)
  SELECT id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at, created_at, updated_at, rev, updated_by FROM event;

DROP TABLE event;
ALTER TABLE event_new RENAME TO event;
CREATE INDEX event_starts ON event (starts_at);

DELETE FROM event_text;
INSERT INTO event_text SELECT * FROM keep_event_text;
DELETE FROM event_credit;
INSERT INTO event_credit SELECT * FROM keep_event_credit;
DROP TABLE keep_event_text;
DROP TABLE keep_event_credit;
