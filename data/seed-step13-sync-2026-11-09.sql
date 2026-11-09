-- seed-step13-sync-2026-11-09.sql: what changed on eccm.ee since step 11 of 2026-11-06, read once each off its
-- public pages on 2026-11-09 (the upcoming lists in both languages, every event page from 23.10 on in each
-- language, the menu pages; one request a second, through www.eccm.ee), compared with staging. The shape is step
-- 11's: titles as eccm.ee writes them, dashes written as commas and colons, the English venue on event_text.venue.
--
-- Two new events, ids 1206 and 1207 in date order, both Improtest in the ECCM hall with Improtest's own picture:
-- Three Free Radicals on 20.11 (iCagenda 169 and 170) and Taavo Remmel on 10.12 (145 and 146). The album cover
-- inside the Three Free Radicals text is left out, since an event's text carries no pictures here. Taavo
-- Remmel's text on eccm.ee is its title, so it is the name alone, the way Electro Funeral's is.
--
-- Changed: the two Schönberg evenings to come, OPUS MIRUM on 19.11 and Performance etüüdid #9 on 8.12, have
-- tickets on Fienta.
--
-- Unchanged: every other event and the menu pages. The open calls page still has none. Barry Guy, Maya
-- Homburger, Liudas Mockunas (143 and 144) and Kuni kolm (128 and 129) still answer 404 and stay drafts.
--
-- Runs twice without harm: an event only when no text carries its legacy_id, a ticket link only while the row
-- has none. Apply after seed-step12-english.sql.

-- 1206: eccm.ee 169 and 170, 2026-11-20T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1206, '2026-11-20T19:00', NULL, NULL, 'ECCM saal', 'Pühavaimu 9, Tallinn',
   '', 'https://www.improtest.ee', 'improtest', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_improtest.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id IN (169, 170));
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, venue, body)
  SELECT 1206, 'et', 'improtest-three-free-radicals',
   'Improtest: Three Free Radicals', 169, NULL,
'Improvisatsiooniline kooslus **Three Free Radicals** koondab kaht muusikut: duo moodustavad Minneapolise helilooja ja live-elektroonika artist Scott L. Miller ja kitarrist-helilooja Mart Soo.

20. novembril esitlevad nad IMPROTESTIL oma uut albumit **DECADE**, millega tähistavad 10 aastast koostööd ja viienda plaadi ilmumist.

Albumi DECADE salvestas 2025. aasta mais Heikki Tikas, kujunduse tegi Raul Keller ja see ilmub IMPROTEST RECORDSi leibli alt.

**Scott L. Miller** on tuntud oma interaktiivse elektroaukustilise kammermuusika, ekosüsteemsete esinemiste ja Kyma helidisaini platvormi kasutamise poolest vabas improvisatsioonis, kannab professori tiitlit St. Cloudi Osariigi Ülikoolis Minnesotas.

**Mart Soo** on Eesti kitarrist, helilooja ja improviseerija, kes on loonud hulga muusikat raadiosaadetele, teatrietendustele ning filmidele. 2005. aastast alates korraldab ta koos muusik Taavi Kerikmäega improvisatsioonilise muusika ürituste seeriat IMPROTEST ning on teinud koostööd muljetavaldava hulga muusikutega Euroopast, Ameerikast ning Jaapanist.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1206 AND starts_at = '2026-11-20T19:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, venue, body)
  SELECT 1206, 'en', 'improtest-three-free-radicals',
   'Improtest: Three Free Radicals', 170, 'ECCM hall',
'The improvisational ensemble **Three Free Radicals** brings together two musicians: the duo consists of Minneapolis composer and live-electronics artist Scott L. Miller and guitarist-composer Mart Soo.

On November 20, they will present their new album **DECADE** at IMPROTEST, celebrating 10 years of collaboration and the release of their fifth record.

The album DECADE was recorded in May 2025 by Heikki Tikas, designed by Raul Keller, and is released under the IMPROTEST RECORDS label.

**Scott L. Miller** is known for his interactive electroacoustic chamber music, ecosystemic performances, and use of the Kyma sound design platform in free improvisation. He holds the title of Professor at St. Cloud State University in Minnesota.

**Mart Soo** is an Estonian guitarist, composer and improviser who has created a wide range of music for radio shows, theater productions, and films. Since 2005, together with musician Taavi Kerikmäe, he has organized the improvisational music event series IMPROTEST and has collaborated with an impressive lineup of musicians from Europe, America, and Japan.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1206 AND starts_at = '2026-11-20T19:00');

-- 1207: eccm.ee 145 and 146, 2026-12-10T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1207, '2026-12-10T19:00', NULL, NULL, 'ECCM saal', 'Pühavaimu 9, Tallinn',
   '', 'https://www.improtest.ee', 'improtest', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_improtest.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id IN (145, 146));
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, venue, body)
  SELECT 1207, 'et', 'improtest-taavo-remmel-est', 'Improtest: Taavo Remmel (EST)', 145, NULL, 'Taavo Remmel (EST)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1207 AND starts_at = '2026-12-10T19:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, venue, body)
  SELECT 1207, 'en', 'improtest-taavo-remmel-est', 'Improtest: Taavo Remmel (EST)', 146, 'ECCM hall', 'Taavo Remmel (EST)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1207 AND starts_at = '2026-12-10T19:00');

-- CHANGED EVENTS

-- 25, Schönbergi sari OPUS MIRUM (73), 19.11: tickets on Fienta
UPDATE event SET ticket_url = 'https://fienta.com/et/schoenbergi-sari-opus-mirum', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1
  WHERE id = 25 AND ticket_url = '';
-- 28, Schönbergi sari Performance etüüdid #9 (153), 8.12: tickets on Fienta
UPDATE event SET ticket_url = 'https://fienta.com/et/schoenbergi-sari-performance-et%C3%BC%C3%BCdid-9', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1
  WHERE id = 28 AND ticket_url = '';
