-- 0018_news.sql: news, asked 2026-11-13 by an ECCM editor ("Kas me saaks teha lehe uudised /news, millel tekiks ka
-- arhiiv ja viimane ilmuks esilehel sündmuste kõrval eraldi vertikaalse tulbana?", the fields "pealkiri, body, pilt,
-- link, logod", several links). The owner chose the three newest with picture and opening on the front page, below
-- the events on a phone, and News in the menu after Events. An item has a date, an optional picture, a text per
-- language, any number of links and the logos the events pick from.
CREATE TABLE news (
  id            INTEGER PRIMARY KEY,
  published_on  TEXT NOT NULL,             -- '2026-11-13', the date shown and the order
  image_id      INTEGER REFERENCES media(id),
  status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  rev           INTEGER NOT NULL DEFAULT 1,
  updated_by    TEXT
);
CREATE INDEX news_on ON news (published_on);

CREATE TABLE news_text (
  news_id  INTEGER NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  lang     TEXT NOT NULL CHECK (lang IN ('et','en')),
  slug     TEXT NOT NULL,
  title    TEXT NOT NULL,
  body     TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (news_id, lang),
  UNIQUE (lang, slug)
);

-- the links under the text, in order; the words per language, the English falling back to the Estonian
CREATE TABLE news_link (
  news_id   INTEGER NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  position  INTEGER NOT NULL,
  label_et  TEXT NOT NULL DEFAULT '',
  label_en  TEXT NOT NULL DEFAULT '',
  url       TEXT NOT NULL,
  PRIMARY KEY (news_id, position)
);

-- the logos, as event_partner (0014_partners.sql)
CREATE TABLE news_partner (
  news_id     INTEGER NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  partner_id  INTEGER NOT NULL REFERENCES partner(id) ON DELETE CASCADE,
  position    INTEGER NOT NULL,
  version     TEXT NOT NULL DEFAULT 'bw' CHECK (version IN ('color','bw')),
  PRIMARY KEY (news_id, partner_id)
);
CREATE INDEX news_partner_partner ON news_partner (partner_id);
