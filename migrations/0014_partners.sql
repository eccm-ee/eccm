-- 0014_partners.sql: the partners' logos as rows, asked 2026-11-07: "eccm
-- wants each post to contain list of partner logo(s). make a admin page to
-- upload logos (add processing like you did for muusikalinn etc), have bw and
-- color optoins. allow editing to pick from logos. make it a grid, multiple
-- select. footer logos should use same system."
--
-- partner is one logo file pair: the colour version and the black-and-white
-- one, each a path the site serves (public/partners/ for the seeded marks,
-- /media/partners/ for an upload in R2, src/partners.mjs). name is the alt
-- text wherever the logo is drawn and url the link it carries. lang is NULL
-- for a logo shown in both languages, else the one language it is drawn in.
-- dark_src is an optional colour file for a dark ground (the EU emblem's
-- negative), the black-and-white version needing none since it is drawn in
-- the ink. slug names the hand-set footer rules a seeded mark has in
-- eccm.css; an upload has none and takes the general rule. in_footer and
-- footer_order are set by the Layout page, not by the Logos page (asked the
-- same day: footer logos are chosen on "Admin > Layout").
CREATE TABLE partner (
  id            INTEGER PRIMARY KEY,
  name          TEXT NOT NULL,
  url           TEXT NOT NULL DEFAULT '',
  lang          TEXT CHECK (lang IN ('et','en')),
  slug          TEXT,
  color_src     TEXT NOT NULL,
  color_w       INTEGER NOT NULL,
  color_h       INTEGER NOT NULL,
  dark_src      TEXT,
  bw_src        TEXT NOT NULL,
  bw_w          INTEGER NOT NULL,
  bw_h          INTEGER NOT NULL,
  in_footer     INTEGER NOT NULL DEFAULT 0 CHECK (in_footer IN (0,1)),
  footer_order  INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- the logos an event shows, in order, and the version it draws them in; one
-- choice per event today, written to every row, so a choice per logo needs no
-- new column
CREATE TABLE event_partner (
  event_id    INTEGER NOT NULL REFERENCES event(id) ON DELETE CASCADE,
  partner_id  INTEGER NOT NULL REFERENCES partner(id) ON DELETE CASCADE,
  position    INTEGER NOT NULL,
  version     TEXT NOT NULL DEFAULT 'bw' CHECK (version IN ('color','bw')),
  PRIMARY KEY (event_id, partner_id)
);
CREATE INDEX event_partner_partner ON event_partner (partner_id);

-- the marks that were static files, as rows pointing at those same files, so
-- nothing moves and the footer draws what it drew before: ULYSSES, then
-- Tallinn's in the page's language (public/partners/SOURCE.md has every
-- file's source). The EU emblem is not in the footer; its black-and-white
-- files were derived 2026-11-07 the way an upload's are.
INSERT INTO partner (id, name, url, lang, slug, color_src, color_w, color_h, dark_src, bw_src, bw_w, bw_h, in_footer, footer_order) VALUES
  (1, 'ULYSSES Platform', 'https://ulysses-platform.eu/', NULL, 'ulysses', '/partners/ulysses-platform-black.svg', 116, 40, NULL, '/partners/ulysses-platform-black.svg', 116, 40, 1, 1),
  (2, 'Tallinn, UNESCO muusikalinn', 'https://muusikalinntallinn.ee/', 'et', 'tallinn', '/partners/tallinn-muusikalinn-sinine_RGB.svg', 446, 461, '/partners/tallinn-muusikalinn-valge_RGB.svg', '/partners/tallinn-muusikalinn-must_RGB.svg', 446, 461, 1, 2),
  (3, 'Tallinn, UNESCO City of Music', 'https://muusikalinntallinn.ee/eng/', 'en', 'tallinn', '/partners/tallinn-cityofmusic-blue_RGB.svg', 446, 461, '/partners/tallinn-cityofmusic-valge_RGB.svg', '/partners/tallinn-cityofmusic-black_RGB.svg', 446, 461, 1, 2),
  (4, 'Kaasrahastanud Euroopa Liit', '', 'et', 'eu', '/partners/eu-cofunded-et.png', 764, 192, '/partners/eu-cofunded-et-neg.png', '/partners/eu-cofunded-et-bw.png', 764, 192, 0, 0),
  (5, 'Co-funded by the European Union', '', 'en', 'eu', '/partners/eu-cofunded-en.png', 860, 192, '/partners/eu-cofunded-en-neg.png', '/partners/eu-cofunded-en-bw.png', 860, 192, 0, 0);
