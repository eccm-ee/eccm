-- 0017_series.sql: the series as rows, asked 2026-11-13 in place of a category tree editor: "why not have dropdown
-- and optional textfield on edit event/page?". A series typed into either form is made here on save, its key the
-- name slugified and both names the typed one. event.series is the event's series; event.category stays as it
-- was, since changing its CHECK means rebuilding event (0006_tuma.sql), and a save keeps it at one of its seven
-- keys. page.series is the series whose coming events a page lists under its text, NULL for none.
CREATE TABLE series (
  key         TEXT PRIMARY KEY,           -- 'ulysses'; ASCII, lowercase, hyphens
  name_et     TEXT NOT NULL,
  name_en     TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
-- the seven of CATEGORY in src/render/event.mjs as it stood, in its order
INSERT INTO series (key, name_et, name_en) VALUES
  ('eccm', 'ECCM', 'ECCM'),
  ('koostoo', 'Koostöö', 'Collaboration'),
  ('improtest', 'Improtest', 'Improtest'),
  ('schoenberg', 'Schönbergi sari', 'Schönberg series'),
  ('ulysses', 'Ulysses', 'Ulysses'),
  ('u', 'U:', 'U:'),
  ('tuma', 'TUMA', 'TUMA');

ALTER TABLE event ADD COLUMN series TEXT NOT NULL DEFAULT 'eccm';
UPDATE event SET series = category;
ALTER TABLE page ADD COLUMN series TEXT;

-- a seed or a sync written before this file names only category (data/seed-step11 and on, INSERT OR IGNORE, and
-- seed-step7's UPDATE), so a category other than eccm written that way is copied into series; the editor writes
-- both and these find nothing to do
CREATE TRIGGER event_series_on_insert AFTER INSERT ON event
  WHEN NEW.category != 'eccm' AND NEW.series = 'eccm'
  BEGIN UPDATE event SET series = NEW.category WHERE id = NEW.id; END;
CREATE TRIGGER event_series_on_category AFTER UPDATE OF category ON event
  WHEN NEW.category != OLD.category AND NEW.category != 'eccm' AND NEW.series = OLD.series
  BEGIN UPDATE event SET series = NEW.category WHERE id = NEW.id; END;
