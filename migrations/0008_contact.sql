-- 0008_contact.sql: the contact form at /et/kontakt and /en/contact
-- (src/contact.mjs), which replaces the footer's link to Joomla's form.
-- Each message is a row here and a mail in the outbox to CONTACT_TO, with
-- Reply-To the sender, so answering is pressing Reply. ip_hash is a SHA-256
-- of the sender's address, kept only to count posts per hour; rows older
-- than a year are deleted, as the privacy page says.
CREATE TABLE contact (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  message     TEXT NOT NULL,
  lang        TEXT NOT NULL DEFAULT 'et' CHECK (lang IN ('et','en')),
  ip_hash     TEXT,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
CREATE INDEX contact_ip ON contact (ip_hash, created_at);

-- the outbox gains reply_to and the kind 'contact'. SQLite cannot change a
-- CHECK in place, so the table is copied into its new shape.
CREATE TABLE outbox_new (
  id          INTEGER PRIMARY KEY,
  kind        TEXT NOT NULL CHECK (kind IN ('confirm','issue','test','contact')),
  issue_id    INTEGER REFERENCES issue(id) ON DELETE SET NULL,
  to_addr     TEXT NOT NULL,
  subject     TEXT NOT NULL,
  text        TEXT NOT NULL,
  html        TEXT,
  unsub       TEXT,
  reply_to    TEXT,                        -- the Reply-To address, a contact message's sender
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  sent_at     TEXT,
  tries       INTEGER NOT NULL DEFAULT 0,
  error       TEXT
);
INSERT INTO outbox_new (id, kind, issue_id, to_addr, subject, text, html, unsub, created_at, sent_at, tries, error)
  SELECT id, kind, issue_id, to_addr, subject, text, html, unsub, created_at, sent_at, tries, error FROM outbox;
DROP TABLE outbox;
ALTER TABLE outbox_new RENAME TO outbox;
CREATE INDEX outbox_unsent ON outbox (sent_at, tries);
