-- seed-step18-schoenberg-2027-2028.sql: the sixteen Schönberg series evenings of 2027 and 2028 that eccm.ee
-- listed as placeholders and the move left behind (plans/plan-eccm-migration.md, "2027 placeholders ... Leave them
-- behind"), asked back on 2026-11-20 by the Estonian Arnold Schönberg Society as drafts. Read from the Joomla
-- database of the full backup of 2026-11-13 09:21: iCagenda 74 to 80, 152 and 161 to 168, each one row for both
-- languages, titled "Schönbergi sari", 19:00, with no text and no picture.
--
-- Each is a draft in the series schoenberg at Eesti Nüüdismuusika Keskus, Pühavaimu 9, where this year's evenings
-- are (74 to 80 named the House of the Blackheads, copied from older ones), with its iCagenda id on both texts, so
-- the old address leads to its page once it is published and to the list until then.
--
-- Runs twice without harm: each event only while no text carries its iCagenda id, and its texts on the event just
-- made, the newest row of event, the English one on the event its Estonian one names.

-- 74, 2027-02-04
INSERT INTO event (starts_at, venue, address, website_url, category, series, status)
  SELECT '2027-02-04T19:00', 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn', 'https://schoenberg.ee/', 'schoenberg', 'schoenberg', 'draft'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 74);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id)
  SELECT (SELECT max(id) FROM event), 'et', 'schonbergi-sari-2027-02-04', 'Schönbergi sari', 74
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 74);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id, venue)
  SELECT (SELECT event_id FROM event_text WHERE lang = 'et' AND legacy_id = 74), 'en', 'schonberg-series-2027-02-04', 'Schönberg series', 74, 'Estonian Centre of Contemporary Music'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 74);

-- 75, 2027-03-11
INSERT INTO event (starts_at, venue, address, website_url, category, series, status)
  SELECT '2027-03-11T19:00', 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn', 'https://schoenberg.ee/', 'schoenberg', 'schoenberg', 'draft'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 75);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id)
  SELECT (SELECT max(id) FROM event), 'et', 'schonbergi-sari-2027-03-11', 'Schönbergi sari', 75
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 75);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id, venue)
  SELECT (SELECT event_id FROM event_text WHERE lang = 'et' AND legacy_id = 75), 'en', 'schonberg-series-2027-03-11', 'Schönberg series', 75, 'Estonian Centre of Contemporary Music'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 75);

-- 76, 2027-04-08
INSERT INTO event (starts_at, venue, address, website_url, category, series, status)
  SELECT '2027-04-08T19:00', 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn', 'https://schoenberg.ee/', 'schoenberg', 'schoenberg', 'draft'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 76);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id)
  SELECT (SELECT max(id) FROM event), 'et', 'schonbergi-sari-2027-04-08', 'Schönbergi sari', 76
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 76);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id, venue)
  SELECT (SELECT event_id FROM event_text WHERE lang = 'et' AND legacy_id = 76), 'en', 'schonberg-series-2027-04-08', 'Schönberg series', 76, 'Estonian Centre of Contemporary Music'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 76);

-- 77, 2027-05-13
INSERT INTO event (starts_at, venue, address, website_url, category, series, status)
  SELECT '2027-05-13T19:00', 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn', 'https://schoenberg.ee/', 'schoenberg', 'schoenberg', 'draft'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 77);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id)
  SELECT (SELECT max(id) FROM event), 'et', 'schonbergi-sari-2027-05-13', 'Schönbergi sari', 77
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 77);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id, venue)
  SELECT (SELECT event_id FROM event_text WHERE lang = 'et' AND legacy_id = 77), 'en', 'schonberg-series-2027-05-13', 'Schönberg series', 77, 'Estonian Centre of Contemporary Music'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 77);

-- 78, 2027-09-09
INSERT INTO event (starts_at, venue, address, website_url, category, series, status)
  SELECT '2027-09-09T19:00', 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn', 'https://schoenberg.ee/', 'schoenberg', 'schoenberg', 'draft'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 78);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id)
  SELECT (SELECT max(id) FROM event), 'et', 'schonbergi-sari-2027-09-09', 'Schönbergi sari', 78
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 78);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id, venue)
  SELECT (SELECT event_id FROM event_text WHERE lang = 'et' AND legacy_id = 78), 'en', 'schonberg-series-2027-09-09', 'Schönberg series', 78, 'Estonian Centre of Contemporary Music'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 78);

-- 79, 2027-10-07
INSERT INTO event (starts_at, venue, address, website_url, category, series, status)
  SELECT '2027-10-07T19:00', 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn', 'https://schoenberg.ee/', 'schoenberg', 'schoenberg', 'draft'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 79);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id)
  SELECT (SELECT max(id) FROM event), 'et', 'schonbergi-sari-2027-10-07', 'Schönbergi sari', 79
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 79);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id, venue)
  SELECT (SELECT event_id FROM event_text WHERE lang = 'et' AND legacy_id = 79), 'en', 'schonberg-series-2027-10-07', 'Schönberg series', 79, 'Estonian Centre of Contemporary Music'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 79);

-- 80, 2027-11-18
INSERT INTO event (starts_at, venue, address, website_url, category, series, status)
  SELECT '2027-11-18T19:00', 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn', 'https://schoenberg.ee/', 'schoenberg', 'schoenberg', 'draft'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 80);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id)
  SELECT (SELECT max(id) FROM event), 'et', 'schonbergi-sari-2027-11-18', 'Schönbergi sari', 80
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 80);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id, venue)
  SELECT (SELECT event_id FROM event_text WHERE lang = 'et' AND legacy_id = 80), 'en', 'schonberg-series-2027-11-18', 'Schönberg series', 80, 'Estonian Centre of Contemporary Music'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 80);

-- 152, 2027-12-07
INSERT INTO event (starts_at, venue, address, website_url, category, series, status)
  SELECT '2027-12-07T19:00', 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn', 'https://schoenberg.ee/', 'schoenberg', 'schoenberg', 'draft'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 152);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id)
  SELECT (SELECT max(id) FROM event), 'et', 'schonbergi-sari-2027-12-07', 'Schönbergi sari', 152
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 152);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id, venue)
  SELECT (SELECT event_id FROM event_text WHERE lang = 'et' AND legacy_id = 152), 'en', 'schonberg-series-2027-12-07', 'Schönberg series', 152, 'Estonian Centre of Contemporary Music'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 152);

-- 161, 2028-02-03
INSERT INTO event (starts_at, venue, address, website_url, category, series, status)
  SELECT '2028-02-03T19:00', 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn', 'https://schoenberg.ee/', 'schoenberg', 'schoenberg', 'draft'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 161);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id)
  SELECT (SELECT max(id) FROM event), 'et', 'schonbergi-sari-2028-02-03', 'Schönbergi sari', 161
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 161);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id, venue)
  SELECT (SELECT event_id FROM event_text WHERE lang = 'et' AND legacy_id = 161), 'en', 'schonberg-series-2028-02-03', 'Schönberg series', 161, 'Estonian Centre of Contemporary Music'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 161);

-- 162, 2028-03-09
INSERT INTO event (starts_at, venue, address, website_url, category, series, status)
  SELECT '2028-03-09T19:00', 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn', 'https://schoenberg.ee/', 'schoenberg', 'schoenberg', 'draft'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 162);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id)
  SELECT (SELECT max(id) FROM event), 'et', 'schonbergi-sari-2028-03-09', 'Schönbergi sari', 162
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 162);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id, venue)
  SELECT (SELECT event_id FROM event_text WHERE lang = 'et' AND legacy_id = 162), 'en', 'schonberg-series-2028-03-09', 'Schönberg series', 162, 'Estonian Centre of Contemporary Music'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 162);

-- 163, 2028-04-13
INSERT INTO event (starts_at, venue, address, website_url, category, series, status)
  SELECT '2028-04-13T19:00', 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn', 'https://schoenberg.ee/', 'schoenberg', 'schoenberg', 'draft'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 163);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id)
  SELECT (SELECT max(id) FROM event), 'et', 'schonbergi-sari-2028-04-13', 'Schönbergi sari', 163
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 163);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id, venue)
  SELECT (SELECT event_id FROM event_text WHERE lang = 'et' AND legacy_id = 163), 'en', 'schonberg-series-2028-04-13', 'Schönberg series', 163, 'Estonian Centre of Contemporary Music'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 163);

-- 164, 2028-05-11
INSERT INTO event (starts_at, venue, address, website_url, category, series, status)
  SELECT '2028-05-11T19:00', 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn', 'https://schoenberg.ee/', 'schoenberg', 'schoenberg', 'draft'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 164);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id)
  SELECT (SELECT max(id) FROM event), 'et', 'schonbergi-sari-2028-05-11', 'Schönbergi sari', 164
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 164);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id, venue)
  SELECT (SELECT event_id FROM event_text WHERE lang = 'et' AND legacy_id = 164), 'en', 'schonberg-series-2028-05-11', 'Schönberg series', 164, 'Estonian Centre of Contemporary Music'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 164);

-- 165, 2028-09-14
INSERT INTO event (starts_at, venue, address, website_url, category, series, status)
  SELECT '2028-09-14T19:00', 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn', 'https://schoenberg.ee/', 'schoenberg', 'schoenberg', 'draft'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 165);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id)
  SELECT (SELECT max(id) FROM event), 'et', 'schonbergi-sari-2028-09-14', 'Schönbergi sari', 165
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 165);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id, venue)
  SELECT (SELECT event_id FROM event_text WHERE lang = 'et' AND legacy_id = 165), 'en', 'schonberg-series-2028-09-14', 'Schönberg series', 165, 'Estonian Centre of Contemporary Music'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 165);

-- 166, 2028-10-12
INSERT INTO event (starts_at, venue, address, website_url, category, series, status)
  SELECT '2028-10-12T19:00', 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn', 'https://schoenberg.ee/', 'schoenberg', 'schoenberg', 'draft'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 166);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id)
  SELECT (SELECT max(id) FROM event), 'et', 'schonbergi-sari-2028-10-12', 'Schönbergi sari', 166
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 166);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id, venue)
  SELECT (SELECT event_id FROM event_text WHERE lang = 'et' AND legacy_id = 166), 'en', 'schonberg-series-2028-10-12', 'Schönberg series', 166, 'Estonian Centre of Contemporary Music'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 166);

-- 167, 2028-11-09
INSERT INTO event (starts_at, venue, address, website_url, category, series, status)
  SELECT '2028-11-09T19:00', 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn', 'https://schoenberg.ee/', 'schoenberg', 'schoenberg', 'draft'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 167);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id)
  SELECT (SELECT max(id) FROM event), 'et', 'schonbergi-sari-2028-11-09', 'Schönbergi sari', 167
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 167);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id, venue)
  SELECT (SELECT event_id FROM event_text WHERE lang = 'et' AND legacy_id = 167), 'en', 'schonberg-series-2028-11-09', 'Schönberg series', 167, 'Estonian Centre of Contemporary Music'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 167);

-- 168, 2028-12-05
INSERT INTO event (starts_at, venue, address, website_url, category, series, status)
  SELECT '2028-12-05T19:00', 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn', 'https://schoenberg.ee/', 'schoenberg', 'schoenberg', 'draft'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 168);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id)
  SELECT (SELECT max(id) FROM event), 'et', 'schonbergi-sari-2028-12-05', 'Schönbergi sari', 168
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 168);
INSERT INTO event_text (event_id, lang, slug, title, legacy_id, venue)
  SELECT (SELECT event_id FROM event_text WHERE lang = 'et' AND legacy_id = 168), 'en', 'schonberg-series-2028-12-05', 'Schönberg series', 168, 'Estonian Centre of Contemporary Music'
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 168);
