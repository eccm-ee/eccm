-- seed-step9-upcoming.sql: what eccm.ee lists to come and D1 did not have, read
-- once each off eccm.ee's public pages on 2026-10-07 (plans/plan-eccm-migration.md, "2. Content").
--
-- The two TUMA evenings at the AFEKT festival, each with its Estonian and
-- English page (iCagenda 154 and 155, 1.11.2026 17:30 in Krulli kvartal; 156
-- and 157, 2.11.2026 19:00 in Tartu), series tuma, titles as eccm.ee writes
-- them. Both pages show the picture of event 29 under other names, byte for
-- byte the same file, so they take its media row. An evening is made only when
-- no event carries its Estonian legacy_id and no event starts at the same
-- minute in the tuma series, so one typed into the editor meanwhile is left
-- alone.
--
-- And the English text of Morton Feldman 100 (iCagenda 110), added to the
-- event whose Estonian text is iCagenda 109, written the way that text is:
-- the dash in the title a colon, the years a range in words, the link line to
-- the Arvo Pärt Centre left out since the credits name it, "tha seldomly" mended.
--
-- Not touched: Kuni kolm, and the three times the team is asked to confirm.
-- Runs twice without harm. Apply after seed-step8-privacy.sql.

-- 1201: eccm.ee 154 and 155, 2026-11-01T17:30
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1201, '2026-11-01T17:30', NULL, NULL, 'Krulli kvartal', 'Krulli kvartal, Tallinn',
   '', 'https://festivalafekt.ee/', 'tuma', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_sohvi-viik-11-pisike.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 154) AND NOT EXISTS (SELECT 1 FROM event WHERE starts_at = '2026-11-01T17:30' AND category = 'tuma');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1201, 'et', 'rituaalid-tallinna-uue-muusika-ansambel-afekt-festivalil',
   'RITUAALID / Tallinna Uue Muusika Ansambel AFEKT festivalil', 154,
'Programmi iga teos avab omamoodi akna, olgu see siis ruumiline, emotsionaalne, tehnoloogiline või kultuuriline, ning kogu kava tervik peegeldab meie ansambli väärtusi: uudishimu, riskivalmidust ja helilist mitmekesisust.

Ansamblina köidab meid muusika, mis annab avanemisvõimalusi, nii publiku, meie endi kui ka heli enda jaoks.

See programm on ühtaegu nii meie olemuse peegeldus kui ka kutse astuda avaramasse kuulamisseisundisse.

**Kavas:**
**Justė Janulytė** "Psalms" viola d’amorele ja elektroonikale (2008/2023)
**Pascal Criton** "Hold" keelpillitriole (2018)
**Arash Yazdani** "Gā Geriv" flöödile ja elektroonikale (2020)
**Jeffrey Arlo Brown** “Motion harmony” #6 pendlitele (2014)
**Tatjana Kozlova-Johannes** "Crasis" flöödile, viiulile, vioolale ja tšellole (2013)

**Tallinna Uue Muusika Ansambel:**
Maria Lume (flöödid)
Toomas Hendrik Ellervee (viiul)
Talvi Nurgamaa (viola, viola d''amore)
Paul-Gunnar Loorand (tšello)
Karl Erik Laas (heliinsener)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1201 AND starts_at = '2026-11-01T17:30');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1201, 'en', 'rituals-ensemble-for-new-music-tallinn-at-afekt-festival',
   'RITUALS / Ensemble for New Music Tallinn at AFEKT festival', 155,
'Each piece in the programme opens a different kind of aperture, spatial, emotional, technological, or cultural, and the full arc of the programme reflects our ensemble’s values: curiosity, risk, and sonic diversity.

As an ensemble, we’re drawn to music that creates openings, for the audience, for ourselves, and for sound itself.

This programme is both a reflection of who we are and an invitation: to step through into expanded states of listening.

**Program:**
**Justė Janulytė** "Psalms" for viola d''amore and electronics (2008/2023)
**Pascal Criton** "Hold" for string trio (2018)
**Arash Yazdani** "Gā Geriv" for flute and pre-recordings (2020)
**Jeffrey Arlo Brown** “Motion harmony” #6 for pendulums (2014)
**Tatjana Kozlova-Johannes** "Crasis" for flute, violin, viola and cello (2013)

**Ensemble for New Music Tallinn:**
Maria Lume (flutes)
Toomas Hendrik Ellervee (violin)
Talvi Nurgamaa (viola, viola d''amore)
Paul-Gunnar Loorand (cello)
Karl Erik Laas (sound engineer)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1201 AND starts_at = '2026-11-01T17:30');

-- 1202: eccm.ee 156 and 157, 2026-11-02T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1202, '2026-11-02T19:00', NULL, NULL, 'Tartu Linnamuuseum', 'Narva mnt 23, Tartu',
   '', '', 'tuma', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_sohvi-viik-11-pisike.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 156) AND NOT EXISTS (SELECT 1 FROM event WHERE starts_at = '2026-11-02T19:00' AND category = 'tuma');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1202, 'et', 'tuma-afekt-festivalil-tartus',
   'TUMA AFEKT festivalil Tartus', 156,
'Programmi iga teos avab omamoodi akna, olgu see siis ruumiline, emotsionaalne, tehnoloogiline või kultuuriline, ning kogu kava tervik peegeldab meie ansambli väärtusi: uudishimu, riskivalmidust ja helilist mitmekesisust.

Ansamblina köidab meid muusika, mis annab avanemisvõimalusi, nii publiku, meie endi kui ka heli enda jaoks.

See programm on ühtaegu nii meie olemuse peegeldus kui ka kutse astuda avaramasse kuulamisseisundisse.

**Kavas:**
**Jesper Nordin** ''''Calm like a bomb'''' viiulile ja elektroonikale (2000)
**Justė Janulytė** "Psalms" for viola d''amorele ja elektreoonikale (2008/2023)
**Pascal Criton** "Hold" keelpillitriole (2018)
**Arash Yazdani** "Gā Geriv" flöödile ja elektroonikale (2020)
**Tatjana Kozlova-Johannes** "Crasis" flöödile, viiulile, vioolale ja tšellole (2013)

**Tallinna Uue Muusika Ansambel:**
Maria Lume (flöödid)
Toomas Hendrik Ellervee (viiul)
Talvi Nurgamaa (viola, viola d''amore)
Paul-Gunnar Loorand (tšello)
Karl Erik Laas (heliinsener)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1202 AND starts_at = '2026-11-02T19:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1202, 'en', 'ensemble-for-new-music-tallinn-at-afekt-festival-in-tartu',
   'Ensemble for New Music Tallinn at AFEKT festival in Tartu', 157,
'Each piece in the programme opens a different kind of aperture, spatial, emotional, technological, or cultural, and the full arc of the programme reflects our ensemble’s values: curiosity, risk, and sonic diversity.

As an ensemble, we’re drawn to music that creates openings, for the audience, for ourselves, and for sound itself.

This programme is both a reflection of who we are and an invitation: to step through into expanded states of listening.

**Program:**
**Jesper Nordin ''''Calm like a bomb'''' viiulile ja elektroonikale (2000)**
**Justė Janulytė** "Psalms" for viola d''amore and electronics (2008/2023)
**Pascal Criton** "Hold" for string trio (2018)
**Arash Yazdani** "Gā Geriv" for flute and pre-recordings (2020)
**Tatjana Kozlova-Johannes** "Crasis" for flute, violin, viola and cello (2013)

**Ensemble for New Music Tallinn:**
Maria Lume (flutes)
Toomas Hendrik Ellervee (violin)
Talvi Nurgamaa (viola, viola d''amore)
Paul-Gunnar Loorand (cello)
Karl Erik Laas (sound engineer)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1202 AND starts_at = '2026-11-02T19:00');

-- the English Feldman, on the event whose Estonian text is iCagenda 109
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT t.event_id, 'en', 'morton-feldman-100-for-philip-guston',
   'Morton Feldman 100: For Philip Guston', 110,
'**Tarmo Johannes** (flute), **Taavi Kerikmäe** (piano, celesta) and **Vambola Krigul** (percussion) perform one of the outstanding works by **Morton Feldman** of his last creative period that seldom can be heard in live performance.

The duration of the piece is over 4 hours.

Program:
**Morton Feldman** (1926 to 1987) _For Philip Guston_ (1984) for flute, piano/celesta and percussion'
  FROM event_text t WHERE t.lang = 'et' AND t.legacy_id = 109
   AND NOT EXISTS (SELECT 1 FROM event_text x WHERE x.event_id = t.event_id AND x.lang = 'en');
