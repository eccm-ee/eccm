-- 0013_event_social.sql: the words on an event's fourth Instagram card, per
-- language (asked 2026-11-07: "For ig add fourth slide with 2-3 fields header
-- / body / footer"). The editor writes them under the event page; an event
-- with no row here shows the defaults (src/og/card.mjs slideDefaults), and a
-- row keeps an empty field empty. A table of its own rather than columns on
-- event_text, so the editor's save of the text never touches them.
CREATE TABLE event_social (
  event_id    INTEGER NOT NULL REFERENCES event(id) ON DELETE CASCADE,
  lang        TEXT NOT NULL CHECK (lang IN ('et','en')),
  header      TEXT NOT NULL DEFAULT '',
  body        TEXT NOT NULL DEFAULT '',
  footer      TEXT NOT NULL DEFAULT '',
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  PRIMARY KEY (event_id, lang)
);
