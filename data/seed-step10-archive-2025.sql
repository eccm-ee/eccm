-- seed-step10-archive-2025.sql: eccm.ee's past events of 2025, read once each off its public
-- pages on 2026-10-07 (the four list pages and each event page, one request a second,
-- cached), plans/plan-eccm-migration.md "Import the archive". 24 events, 31 texts, 16 new pictures.
--
-- The shape, decided for the whole archive (seed-step10-archive-2024.sql to
-- -2026.sql) rather than by hand per event:
--   One event per occasion. iCagenda gives a language its own id; an Estonian
--   and an English id at the same date and minute are one event with two
--   texts (Vestlusring 92 and Panel Discussion 93 by their title, the English
--   page's 17.04 being wrong: the ticket page says 11.04.2026 17:30). An id in
--   both lists is one text, in the language of its body's opening; bodies
--   that carry both languages stay whole.
--   legacy_id is the iCagenda id in the row's language, for src/redirects.mjs.
--   Titles as eccm.ee writes them, capitals kept, a trailing colon and the
--   dashes off (" - " and a spaced dash are a colon).
--   Bodies from the page's HTML into the markdown md.mjs renders: paragraphs,
--   line breaks, **bold**, _italic_, links (Facebook's redirect and fbclid
--   taken off), lists, headings. Pictures inside a body, e-mail addresses
--   and phone numbers are left out. Dashes are commas, a range of numbers is
--   "kuni" or "to". Credits stay in the body: no page has the one-role-a-line
--   block event_credit takes without reading it by hand.
--   The Piletid line, when it is more than a link, is the body's last line.
--   ticket_url is its first link, website_url the Koduleht.
--   Category from iCagenda's: ECCM eccm, U: u, Koostöö, Collaboration, EES
--   and Ludens koostoo, Improtest improtest, TUMA tuma, Schönbergi ühing
--   schoenberg, Ulysses ulysses; a title beginning "Schönbergi sari" is
--   schoenberg and one naming Improtest improtest whatever iCagenda says.
--   A start at a minute nobody types (19:14, 16:49, 12:22, 14:11, 14:56,
--   iCagenda's form filling in the hour of entry) is the day alone, T00:00.
--   Slugs by the editor's rule, the date after one already taken.
--   Venue as the page writes it, address short from its Aadress line.
--
-- Event ids 1001 on, in date order, clear of the editor's. The file runs twice
-- without harm: an event is made only when no event carries its first text's
-- legacy_id, a text only when its event has the id and start written here, a
-- media row only when its key is new. Pictures are the ic_large files the pages
-- name, fetched once into public/ and measured with sips; their schemes are in
-- seed-step10-archive-schemes.sql. Apply after seed-step9-upcoming.sql.

INSERT OR IGNORE INTO media (key, width, height, alt_et, alt_en) VALUES
  ('ic_large_w900h600q100_jahu-pilt.jpg', 900, 587,
   'Villem Jahu Improtestil',
   'Villem Jahu Improtestil'),
  ('ic_large_w900h600q100_29122019-fb-19201000px-2.jpg', 900, 333,
   'Residentuu:r 1',
   'Residentuu:r 1'),
  ('ic_large_w900h600q100_480280013-1055828976584454-2012969398720128354-n.jpg', 400, 600,
   'Kirke Karja Improtestil',
   'Kirke Karja Improtestil'),
  ('ic_large_w900h600q100_hetkfest-logo.png', 1200, 472,
   'HETKfEST',
   'HETKfEST'),
  ('ic_large_w900h600q100_screenshot-2025-03-06-at-16-08-26.png', 885, 600,
   'Devaux/ Girard-Charest/ Kerikmäe Improtestil',
   'Devaux/ Girard-Charest/ Kerikmäe Improtestil'),
  ('ic_large_w900h600q100_486933146-1674327330144671-4763156796710841880-n.jpg', 900, 471,
   'Schönbergi sari. Yellow Wasabi',
   'Schönbergi sari. Yellow Wasabi'),
  ('ic_large_w900h600q100_unknown-4.jpg', 424, 600,
   'SEEDS',
   'SEEDS'),
  ('ic_large_w900h600q100_screenshot-2025-04-22-at-18-19-45.png', 900, 496,
   'Suudio Tallinn 1965: EMP 2025',
   'Suudio Tallinn 1965: EMP 2025'),
  ('ic_large_w900h600q100_kurtag.png', 900, 474,
   'MUBA Uue muusika ansambli kontsert',
   'Concert of the MUBA Contemporary Music Ensemble'),
  ('ic_large_w900h600q100_screenshot-2025-04-22-at-18-54-39.png', 900, 582,
   'Viktoria Grahv. Glagoliitiliste unede raamat',
   'Viktoria Grahv. Glagoliitiliste unede raamat'),
  ('ic_large_w900h600q100_screenshot-2025-04-23-at-17-40-48.png', 900, 510,
   'Schönbergi sari REMIX 3 Andrus Kallastu autorikontsert',
   'Schönbergi sari REMIX 3 Andrus Kallastu autorikontsert'),
  ('ic_large_w900h600q100_2025-kultuurioo-vaike-copy.jpeg', 900, 471,
   'Tallinn 1965 Koolikokkutulek Kultuuriööl',
   'Tallinn 1965 Koolikokkutulek Kultuuriööl'),
  ('ic_large_w900h600q100_ampsud-foto.jpeg', 811, 600,
   'Vanamuusika Ampsud. Pika tänava festival.',
   'Vanamuusika Ampsud. Pika tänava festival.'),
  ('ic_large_w900h600q100_pimenaegemine-pilt.jpeg', 860, 440,
   'Pimenägemine',
   'Pimenägemine'),
  ('ic_large_w900h600q100_36869c31-100a-42aa-9094-12f713471581-1-105-c.jpeg', 851, 600,
   'Synth DIY Tallinn',
   'Synth DIY Tallinn'),
  ('ic_large_w900h600q100_uh2025-ii-v.jpg', 874, 1240,
   'Üle Heli 25 / ANSAMBEL U: "STRATIFIKATSIOONID" ja HELIPORTATSIOON',
   'Üle Heli 25 / ANSAMBEL U: "STRATIFIKATSIOONID" ja HELIPORTATSIOON');

-- 1017: eccm.ee 33, 2025-01-17T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1017, '2025-01-17T19:00', NULL, NULL, 'Eesti Nüüdismuusika keskus', '',
   '', 'https://eccm.ee', 'improtest', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_jahu-pilt.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 33);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1017, 'et', 'villem-jahu-improtestil',
   'Villem Jahu Improtestil', 33,
'Villem Jahu on visuaal- ja helikunstnik, süntesist ja vabaimprovisaator, kes on keskendunud abstraktsemale helikeelele ja live esinemistele peamiselt iseehitatud elektroonilistel instrumentidel.

Viimaste aastate jooksul on Villem Jahu tegelenud aktiivselt kontsertesinemistega nii Eestis kui Saksamaal, Suurbritannias, Portugalis, Itaalias, Hispaanias ja mujal. Ühiselt on helilaineid tekitatud teiste seas koos Katariin Raska, Juhan Vihterpali, Roomet Jakapi, Erik Alalooga, Riho Kalli, Siim Kuusemäe, Meelis Salujärvega.

[villemjahu.com](http://villemjahu.com/)

Improtest on vabaimprovisatsioonilise muusika sari aastast 2005, mille kuraatorid on Mart Soo ja Taavi Kerikmäe. Kontsertsarja partner on Eesti nüüdismuusika keskus, Muusikalinn Tallinn. Sarja toetab Eesti Kultuurkapital

Piletid: Piletid Fientas ja kohapeal 10/8€'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1017 AND starts_at = '2025-01-17T19:00');

-- 1018: eccm.ee 21 and 22, 2025-01-22T18:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1018, '2025-01-22T18:00', NULL, NULL, 'ECCM saal', '',
   '', 'https://uuu.ee/j/projektid/residenuu-r', 'u', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_29122019-fb-19201000px-2.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 21);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1018, 'et', 'residentuu-r-1',
   'Residentuu:r 1', 21,
'**Residentuu:r** on ansambel U: avalike õpitubade sari. 2025. a on Residentuu:ri teemaks "**Pärimus ja inimpsüühika**", läbivaks teljeks **Liisa Hõbepappeli** uue kammerooperi valmimisprotsess, mis tugineb muinasjutust pärineva sümboolika tõlgendamisele. Toimuvad neli kohtumist, kus kutsutud külalised avavad nimetatud teema erinevaid tahkusid. Alates teisest kohtumisest toimuvad ka avalikud töötoad ooperi valmiva materjaliga ansambel U:, lauljate ja Liisa Hõbepappeli osalusel.

Sissepääs tasuta.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1018 AND starts_at = '2025-01-22T18:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1018, 'en', 'residentuu-r-1',
   'Residentuu:r 1', 22,
'**Residentuu:r** is a public workshop series by the ensemble U:. In 2025, the theme of Residentuu:r will be "**Folklore and the Human Psyche,**" with a central focus on the creation process of **Liisa Hõbepappel’**s new chamber opera, which is based on the interpretation of symbols from fairy tales. There will be four events, where invited guests will explore various aspects of the theme. Starting from the second event, public workshops featuring the opera’s developing material will be held with the participation of ensemble U:, singers, and Liisa Hõbepappel.

Admission is free.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1018 AND starts_at = '2025-01-22T18:00');

-- 1019: eccm.ee 23 and 24, 2025-02-04T18:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1019, '2025-02-04T18:00', NULL, NULL, 'ECCM saal', '',
   '', 'https://uuu.ee/j/projektid/residenuu-r', 'u', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_29122019-fb-19201000px-2.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 23);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1019, 'et', 'residentuu-r-2',
   'Residentuu:r 2', 23,
'**Residentuu:r** on ansambel U: avalike õpitubade sari. 2025. a on Residentuu:ri teemaks "**Pärimus ja inimpsüühika**", läbivaks teljeks **Liisa Hõbepappeli** uue kammerooperi valmimisprotsess, mis tugineb muinasjutust pärineva sümboolika tõlgendamisele. Toimuvad neli kohtumist, kus kutsutud külalised avavad nimetatud teema erinevaid tahkusid. Alates teisest kohtumisest toimuvad ka avalikud töötoad ooperi valmiva materjaliga ansambel U:, lauljate ja Liisa Hõbepappeli osalusel.

Sissepääs tasuta.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1019 AND starts_at = '2025-02-04T18:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1019, 'en', 'residentuu-r-2',
   'Residentuu:r 2', 24,
'**Residentuu:r** is a public workshop series by the ensemble U:. In 2025, the theme of Residentuu:r will be "**Folklore and the Human Psyche,**" with a central focus on the creation process of **Liisa Hõbepappel’**s new chamber opera, which is based on the interpretation of symbols from fairy tales. There will be four events, where invited guests will explore various aspects of the theme. Starting from the second event, public workshops featuring the opera’s developing material will be held with the participation of ensemble U:, singers, and Liisa Hõbepappel.

Admission is free.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1019 AND starts_at = '2025-02-04T18:00');

-- 1020: eccm.ee 29, 2025-02-12T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1020, '2025-02-12T19:00', NULL, NULL, 'ECCM saal', '',
   '', 'https://uuu.ee/j/kontserdid2', 'u', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_29122019-fb-19201000px-2.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 29);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1020, 'et', 'urr-45-defitsiit',
   'URR-45: Defitsiit', 29,
'**URR-45: Defitsiit**

Kavas:

**Tom Johnson** (1939-2024) - _Maximum Efficiency_ (1985) kolmele esitajale
**Frederic Rzewski** (1938-2021) - _Love of Money_ (1993) häälele ja klaverile
**Jüri Reinvere** (1971) - _Ööpilt magava Cupidoga_ (2023) flöödile, klarnetile, löökpillidele, klaverile, viiulile ja tšellole
**Frederic Rzewski** (1938-2021) - _Coming Together_ (1971) lugejale* ja instrumentidele

Kontserdist toimub ülekanne [elektron.art](https://elektron.art/) platvormil.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1020 AND starts_at = '2025-02-12T19:00');

-- 1021: eccm.ee 6 and 30, 2025-02-22T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1021, '2025-02-22T19:00', NULL, NULL, 'ECCM saal', 'Pühavaimu 9, Tallinn',
   '', 'https://tarmo.uuu.ee/duos', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_lained-laiem.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 6);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1021, 'et', 'duod-iii',
   'DUOD III', 6,
'"DUOD" on Tarmo Johannese kureeritud sari muusikast flöödile ja veel ühele esitajale. Tarmo Johannese partneriteks on hooaja jooksul neli suurepärast interpreeti - Merje Roomere (viiul), Fie Schouten (bassklarnet, Holland), Iris Oja (hääl), Gunnhildur Einarsdottir (harf, Island/Saksamaa).

Kolmandal kontserdil on partneriks **Iris Oja** (hääl).

Kavas:
**Tatjana Kozlova-Johannes** - II osa kammerooperist "söövitab.tuhk" (2022) flöödile ja häälele
**Edith Canat De Chizy** - "Litanie" (1982) altflöödile ja mezzosopranile
**Age Veeroos** - "Enesekaotus" (2002) altflöödile ja mezzosopranile
**Salvatore Sciarrino** - "Immagine Fenicia" (1996/2000) võimendatud flöödile
**Beat Furrer** - "auf tönernen füssen" (2001) võimendatud flöödile ja häälele

Kontserdid toimuvad koostöös Eesti Nüüdismuusika Keskusega ENMK saalis ning pakuvad kuulamiseks hoolega valitud tänapäevast kammermuusikat kõrgetasemelises esituses'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1021 AND starts_at = '2025-02-22T19:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1021, 'en', 'duod-iii',
   'DUOD III', 30,
'**"DUOD"** is a concert series curated by Tarmo Johannes, focusing on music for flute and another performer. Throughout the season, Tarmo Johannes collaborates with four outstanding musicians: Merje Roomere (violin), Fie Schouten (bass clarinet, Netherlands), Iris Oja (voice), and Gunnhildur Einarsdottir (harp, Iceland/Germany).

In the third concert, his partner will be Iris Oja (voice).

**Program:**

**Tatjana Kozlova-Johannes**, _Part II from the chamber opera "söövitab.tuhk"_ (2022) for flute and voice
**Edith Canat de Chizy**, _"Litanie"_ (1982) for alto flute and mezzo-soprano
**Age Veeroos**, _"Enesekaotus"_ (2002) for alto flute and mezzo-soprano
**Salvatore Sciarrino**, _"Immagine Fenicia"_ (1996/2000) for amplified flute
**Beat Furrer**, _"auf tönernen füssen"_ (2001) for amplified flute and voice

The concerts are organized in collaboration with the Estonian Contemporary Music Centre and take place at the ECCM hall, offering carefully selected contemporary chamber music performed at a high artistic level.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1021 AND starts_at = '2025-02-22T19:00');

-- 1022: eccm.ee 35, 2025-02-28T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1022, '2025-02-28T19:00', NULL, NULL, 'ECCM', '',
   '', '', 'improtest', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_480280013-1055828976584454-2012969398720128354-n.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 35);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1022, 'et', 'kirke-karja-improtestil',
   'Kirke Karja Improtestil', 35,
'Kirke Karja (1989) on pianist ja helilooja. Tema peamiseks muusikaliseks väljundiks on rahvusvaheline trio Karja/Renard/Wandinger, selle ansambliga on nad viimastel aastatel esinenud paljudel rahvusvahelistel jazzifestivalidel, muuhulgas Jazzfest Berlin, Vossa Jazz, Punkt, Jazzahead, Südtirol Jazzfest; arvukad kontsertreisid on viinud neid Soome, Norra, Hollandisse, Prantsusmaale, Saksamaale, Itaaliasse, Šveitsi, Ungarisse, Poola ja Kanadasse. Aktuaalne on Draamateatri lavastus "Solist", kus ta kehastab Käbi Lareteid. Heliloojana on Kirke kirjutanud muusikat nii kammeransamblitele kui ka orkestritele. 2022. aastal valmis klaverikontsert, mis on loodud spetsiaalselt Pärnu Linnaorkestrile, dirigent Kaspar Mändile ja pianist Sten Heinojale. Sama klaverikontserti kandis Kirke ise ette ka 2023. aasta juunis Kanadas koos Hamiltoni filharmoonikutega. 2024. aastal valmis pikk mitmeosaline teos "Murenemine" värskele kammermuusikaansamblile Ludensemble.

Improtest on aastast 2005 toimuv rahvusvaheline improvisatsioonilise muusika kontsertsari, mida kureerivad Mart Soo ja Taavi Kerikmäe

Piletid: 10/8€ Fientas ja kohapeal'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1022 AND starts_at = '2025-02-28T19:00');

-- 1023: eccm.ee 34, 2025-03-07T00:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1023, '2025-03-07T00:00', '2025-03-09T23:00', NULL, 'ECCM', '',
   '', 'https://hetkfest.ee/', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_hetkfest-logo.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 34);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1023, 'et', 'hetkfest',
   'HETKfEST', 34,
'HETKfEST on uus festival, mis keskendub hetkeloomingule ehk improvisatsioonikunstile.

Kava:
Reede, 7. märts
19.00 avaHETK (piletid [Fientas](https://fienta.com/et/hetk1) 12/7)
Paul Beaudoin
Bósons duo
DongBin Lee
KriHeAn
Laupäev, 8. märts
12.00 teatriHETK (piletid [Fientas](https://fienta.com/et/teatrihetk) 10/5)
Nähtamatu Teatri pime-etendus
14.00 elamusHETK (tasuta)
Maggie Nicolsi töötuba
registreerimislink osalemiseks: [forms.gle/7UeQh1uVJs5WjJMLA](https://forms.gle/7UeQh1uVJs5WjJMLA)
20.30 kõrgHETK (piletid [Fientas](https://fienta.com/et/hetk1-120091) 12/7)
Maggie Nicols
Rooluulend
Roosna&Flak
Pühapäev, 9. märts
14.00 ansambliHETK (tasuta)
HETKfEST ansambli töötuba, avatud muusikutele/tantsijatele/luuletajatele/näitlejatele/+
registreerimislink osalemiseks:[forms.gle/omJbaZxUUT55aBAP8](https://forms.gle/omJbaZxUUT55aBAP8)
17.00 lõppHETK
HETKfEST ansambli kontsert (piletid [Fientas](https://fienta.com/et/hetk1-120092) 10/5)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1023 AND starts_at = '2025-03-07T00:00');

-- 1024: eccm.ee 26 and 25, 2025-03-08T18:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1024, '2025-03-08T18:00', NULL, NULL, 'ECCM saal', '',
   '', 'https://uuu.ee/j/projektid/residenuu-r', 'u', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_29122019-fb-19201000px-2.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 26);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1024, 'et', 'residentuu-r-3',
   'Residentuu:r 3', 26,
'**Residentuu:r** on ansambel U: avalike õpitubade sari. 2025. a on Residentuu:ri teemaks "**Pärimus ja inimpsüühika**", läbivaks teljeks **Liisa Hõbepappeli** uue kammerooperi valmimisprotsess, mis tugineb muinasjutust pärineva sümboolika tõlgendamisele. Toimuvad neli kohtumist, kus kutsutud külalised avavad nimetatud teema erinevaid tahkusid. Alates teisest kohtumisest toimuvad ka avalikud töötoad ooperi valmiva materjaliga ansambel U:, lauljate ja Liisa Hõbepappeli osalusel.

Sissepääs tasuta.

Admission is free.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1024 AND starts_at = '2025-03-08T18:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1024, 'en', 'residentuu-r-3',
   'Residentuu:r 3', 25,
'**Residentuu:r** is a public workshop series by the ensemble U:. In 2025, the theme of Residentuu:r will be "**Folklore and the Human Psyche,**" with a central focus on the creation process of **Liisa Hõbepappel’**s new chamber opera, which is based on the interpretation of symbols from fairy tales. There will be four events, where invited guests will explore various aspects of the theme. Starting from the second event, public workshops featuring the opera’s developing material will be held with the participation of ensemble U:, singers, and Liisa Hõbepappel.

[Nicholas Tamagna](https://stephensnicolson.com/artists/tamagna.html) is an internationally acclaimed counter-tenor, often performing in baroque operas, but also contemporary music projects.

Admission is free.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1024 AND starts_at = '2025-03-08T18:00');

-- 1025: eccm.ee 36, 2025-03-12T20:30
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1025, '2025-03-12T20:30', NULL, NULL, 'ECCM', '',
   'https://fienta.com/et/devaux-girard-charest-kerikmae-improtestil', '', 'improtest', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_screenshot-2025-03-06-at-16-08-26.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 36);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1025, 'en', 'devaux-girard-charest-kerikmae-improtestil',
   'Devaux/ Girard-Charest/ Kerikmäe Improtestil', 36,
'Sylvain Devaux is an oboist, improviser and composer. Dedicated to new music, he is a member if l''Itineraire and collaborates with ensembles such as l''Instant Donné, l''ensemble Intercontemporain or Ictus. [www.sylvaindevaux.com](http://www.sylvaindevaux.com/)

Émilie Girard-Charest is a cellist, a composer and improviser, dedicated to new music. As a chamber musician she has taken partin the premiere of more than sixty new works working together with composers like Malcolm Gldstein, Thomas Nicholson, Kasper T. Toeplitz etc

Taavi Kerikmäe is a musician, working on the field of new, experimental and early music. He performs on various keyboard instruments and electronics.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1025 AND starts_at = '2025-03-12T20:30');

-- 1026: eccm.ee 27 and 28, 2025-04-08T18:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1026, '2025-04-08T18:00', NULL, NULL, 'ECCM saal', '',
   '', 'https://uuu.ee/j/projektid/residenuu-r', 'u', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_29122019-fb-19201000px-2.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 27);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1026, 'et', 'residentuu-r-4-2025-04-08',
   'Residentuu:r 4', 27,
'**Residentuu:r** on ansambel U: avalike õpitubade sari. 2025. a on Residentuu:ri teemaks "**Pärimus ja inimpsüühika**", läbivaks teljeks **Liisa Hõbepappeli** uue kammerooperi valmimisprotsess, mis tugineb muinasjutust pärineva sümboolika tõlgendamisele. Toimuvad neli kohtumist, kus kutsutud külalised avavad nimetatud teema erinevaid tahkusid. Alates teisest kohtumisest toimuvad ka avalikud töötoad ooperi valmiva materjaliga ansambel U:, lauljate ja Liisa Hõbepappeli osalusel.

Sissepääs tasuta.

Admission is free.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1026 AND starts_at = '2025-04-08T18:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1026, 'en', 'residentuu-r-4-2025-04-08',
   'Residentuu:r 4', 28,
'**Residentuu:r** is a public workshop series by the ensemble U:. In 2025, the theme of Residentuu:r will be "**Folklore and the Human Psyche,**" with a central focus on the creation process of **Liisa Hõbepappel’**s new chamber opera, which is based on the interpretation of symbols from fairy tales. There will be four events, where invited guests will explore various aspects of the theme. Starting from the second event, public workshops featuring the opera’s developing material will be held with the participation of ensemble U:, singers, and Liisa Hõbepappel.

Admission is free.

Admission is free.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1026 AND starts_at = '2025-04-08T18:00');

-- 1027: eccm.ee 37, 2025-04-10T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1027, '2025-04-10T19:00', NULL, NULL, 'ECCM', '',
   '', 'https://schoenberg.ee/', 'schoenberg', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_486933146-1674327330144671-4763156796710841880-n.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 37);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1027, 'et', 'schonbergi-sari-yellow-wasabi',
   'Schönbergi sari. Yellow Wasabi', 37,
'Yellow Wasabi sündis 1999. aastal Hiinas Kantonis. Ta mängib lapsest peale hiina harfi guzhengi, tal on bakalaureusekraad ökoloogias ja magistrikraad neuroteadustes Paris-Saclay ülikoolist Prantsusmaal. Füüsikaprofessorist isa ja kaunite kunstide professorist ema mõjul usub ta, et teadus ja kunst on ühendatud. Ta on otsustanud dünaamiliselt muutuva maailma kunstiliseks uurimiseks kasutada bioloogiat ja uusi meediaid.

Yellow Wasabi on avastanud eksperimentaalmuusika, eriti harsh noise’i. Oma loomingus ühendab ta guzhengi Max/MSP-ga, uuendades esitusi biomeetriliste moodulite, mikroskoopide, liikumisandurite ja tehisintellekti poolt genereeritud interaktiivsete 3D projektsioonide abil. Väljakannatamatu müra on tema jaoks elu tühiste asjade sonifikatsioon.

Yellow Wasabi tahab inimesi üles äratada, nihutades nende füüsilisi piire ja ühendades nende keha uuesti keskkonnaga. Tema jaoks on kunst inimese tunnetuse fossiil. Ta soovib muuta eluvõitluse rõõmsaks elujõuks ning tuua inimestele õnne teaduse ja kunstide kaudu.

Yellow Wasabi on Euroopa Nõukogu, Prantsuse rahvuslike kunstifondide ja erafondide toel esinenud Hiinas, Prantsusmaal, Belgias, Hollandis, Saksamaal, Poolas, Lätis, Leedus, Eestis, Soomes, Šveitsis ja Kreekas. Yellow Wasabi on aktiivne Euroopa ja Aasia eksperimentaalmuusika areenil, kaasaegse kunsti galeriides ja teaduskongressidel. Noore teadlasena on ta olnud mitmete Euroopa ja siseriiklike projektide resideeruv kunstnik.

Koostöös
Eesti Arnold Schönbergi Ühing
Eesti Nüüdismuusika Keskus
EELK Pärnu Eliisabeti kogudus
EELK Tartu Ülikooli-Jaani Kogudus
Pärnu Ooper
Autorfest

Toetajad
Pärnu linn
Tartu linn
Tallinna linn
Kultuurkapital
Kultuuriministeerium
Culture Moves Europe

[www.yellowwasabi.net](https://www.yellowwasabi.net/)
[schoenberg.ee](https://schoenberg.ee/)

Piletid: 20/10/5'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1027 AND starts_at = '2025-04-10T19:00');

-- 1028: eccm.ee 31 and 32, 2025-04-12T20:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1028, '2025-04-12T20:00', NULL, NULL, 'ECCM saal', 'Pühavaimu 9, Tallinn',
   'https://fienta.com/et/duod-iv', 'https://tarmo.uuu.ee/duos', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_lained-laiem.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 31);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1028, 'et', 'duod-iv',
   'DUOD IV', 31,
'"DUOD" on Tarmo Johannese kureeritud sari muusikast flöödile ja veel ühele esitajale. Tarmo Johannese partneriteks on hooaja jooksul neli suurepärast interpreeti.

Neljandal kontserdil on partneriks Dario Calderone (kontrabass, Holland/Itaalia)

Kavas:
**Bernhard Lang** (1957) - "DW22. Winterlicht" (2010) bassflöödile ja kontrabassile. I osa
**Age Veeroos** (1973) - "Haav" veerandtoonflöödile (2025, esiettekanne)
**Simon Steen-Andersen** (1976) - "Next to Beside Besides" #5 võimendatud pikolole & #9 kontrabassile (2003/2009)
**Dario Calderone** (1978) - "Aurale" (2017) kontrabassile
**Annea Lockwood** (1939) - "Jitterbug" (2010) instrumentidele ja fonogrammile

Kontserdid toimuvad koostöös Eesti Nüüdismuusika Keskusega ENMK saalis ning pakuvad kuulamiseks hoolega valitud tänapäevast kammermuusikat kõrgetasemelises esituses'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1028 AND starts_at = '2025-04-12T20:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1028, 'en', 'duod-iv',
   'DUOD IV', 32,
'**"DUOD"** is a concert series curated by Tarmo Johannes, focusing on music for flute and another performer. Throughout the season, Tarmo Johannes collaborates with four outstanding musicians. In the fourth concert, his partner will be [**Dario Calderone**](https://dariocalderone.com/) (double bass, Iceland/Germany) .

Program:

**Bernhard Lang** (1957) - "DW22. Winterlicht" (2010) for bass flute and double bass. 1st movement
**Age Veeroos** (1973) - "Haav" ("Wound") for solo quartertone flute (2025, **première**)
**Simon Steen-Andersen** (1976) - "Next to Beside Besides" #5 for amplified piccolo & #9 for double bass (2003/2009)
**Dario Calderone** (1978) - "Aurale" (2017) for solo double bass
**Annea Lockwood** (1939) - "Jitterbug" (2010) for instruments and 6-channel tape

The concerts are organized in collaboration with the Estonian Contemporary Music Centre and take place at the ECCM hall, offering carefully selected contemporary chamber music performed at a high artistic level.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1028 AND starts_at = '2025-04-12T20:00');

-- 1029: eccm.ee 38, 2025-04-14T18:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1029, '2025-04-14T18:00', NULL, NULL, 'ECCM', '',
   '', '', 'eccm', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_unknown-4.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 38);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1029, 'et', 'seeds',
   'SEEDS', 38,
'Nüüdismuusika keskuse uus sari "SEEDS" loob ruumi professionnaalse nüüdismuusiku teed alustavatele interpreetidele ja heliloojatele. Sel korral kuuleme Eesti Muusikaakadeemia elektroakustilise muusika tudengite loomingut.

Kavas:

Marina Karpova
“Breath!”EAMT Ensamble: Elia Dell’Orco, Eugenio Cecchini, Gabriele Teti,
Marina Karpova, Olga Avdeeva (voice, electronics)

Toshio Hosokawa
“Slow motion”
David-Ovid Komlev (accordion), Erko Sild (performer)

Chaya Czernowin
“Knights of the Strange”
Luca Zanoni (e-guitar), Darja Goldberg (accordion)

Mario Davidovsky
“Synchronisms No.9” (Estonian premiere)
Nuria Díaz Fuentes (violin, tape)

Viktoria Grahv
“Crescendo for Insane Birds”
Darius Gustaitis (accordion)

- - BREAK - -

Canetamburo
impro
Elia Dell’Orco (e-guitar, electronics)
Eugenio Cecchini (voice, electronics)
Gabriele Teti (toys, electronics)

Electro Funeral
impro
David-Ovid Komlev (accordion)
Darja Goldberg (accordion)
Marina Karpova (electronics)

Piletid: tasuta kontsert'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1029 AND starts_at = '2025-04-14T18:00');

-- 1030: eccm.ee 39, 2025-04-28T18:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1030, '2025-04-28T18:00', NULL, NULL, '', '',
   '', '', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_screenshot-2025-04-22-at-18-19-45.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 39);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1030, 'et', 'suudio-tallinn-1965-emp-2025',
   'Suudio Tallinn 1965: EMP 2025', 39,
'“Stuudio Tallinn 1965”
Eesti Nüüdismuusika Keskus

18.00: Debatt nüüdismuusika ökosüsteemist.

19.30: Ekke Västrik tutvustab “Stuudio Tallinn 1965” residentuuris valmivat teost, milles ta kasutab ajaloolist stuudiotehnikat elavas ettekandes. Kesksel kohal on noodikiri kui vahend, mis võimaldab avastada uusi kõlamaastikke ja esitlusviise. See on ühtlasi Västriku doktoriõpingute viimane loominguline töö. Teose tellis Üle Heli festival ning see tuleb täies mahus ettekandele 2025 sügisel.

21.00: Lindidisko. Eesti Elektroonilise Muusika Seltsi ansambli (EMA) muusikud valivad muusikat “Suudio Tallinn 1965” obskuursest lindikogust.

Sissepääs tasuta!
“Studio Tallinn 1965” Estonian Center for Contemporary Music
18:00: Debate on the ecosystem of contemporary music.

19:30: Ekke Västrik presents a work being created during the residency at “Studio Tallinn 1965,” in which he uses historical studio technology for a live performance. Central to this is the musical score as a tool that allows for the exploration of new soundscapes and modes of presentation. This also represents Västrik''s final creative work in his doctoral studies. The piece is commissioned by the Üle Heli festival and will be presented in full in the fall of 2025.

21:00: Tape Disco. Musicians of the Estonian Electronic Music Society (EMA) will choose music from the obscure tape collection of “Studio Tallinn 1965.”

Entrance is free!'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1030 AND starts_at = '2025-04-28T18:00');

-- 1031: eccm.ee 41 and 42, 2025-05-14T17:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1031, '2025-05-14T17:00', NULL, NULL, 'ECCM saal', '',
   '', 'https://muba.edu.ee/sundmused/', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_kurtag.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 41);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1031, 'et', 'muba-uue-muusika-ansambli-kontsert',
   'MUBA Uue muusika ansambli kontsert', 41,
'## MUBA Uue muusika ansambli kevadkontsert

Esinevad:
**Helis Kärbo**, flööt
**Daniel Hinno**, tromboon
**Paulina Andrejeva**, kannel
**Miia Polding**, kannel
**Melinda Felicia Nitschke**, klaver
**Helena Laving**, viola da gamba
**Juhan Laasik**, tšello
**Hannela Lüsi**, hääl

Kavas: **John Cage, Györgi Kurtág, Pauline Oliveros, Malle Maltis, Mirjam Tally** jt
Juhendajad: **Iris Oja, Tarmo Johannes**
Sissepääs tasuta'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1031 AND starts_at = '2025-05-14T17:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1031, 'en', 'concert-of-the-muba-contemporary-music-ensemble',
   'Concert of the MUBA Contemporary Music Ensemble', 42,
'## Spring concert of of the contemporary music ensemble of MUBA

Performers:
**Helis Kärbo**, flute
**Daniel Hinno**, trombone
**Paulina Andrejeva**, kannel
**Miia Polding**, kannel
**Melinda Felicia Nitschke**, piano
**Helena Laving**, viola da gamba
**Juhan Laasik**, cello
**Hannela Lüsi**, voice

Program: **John Cage, Györgi Kurtág, Pauline Oliveros, Malle Maltis, Mirjam Tally**
Supervisors: **Iris Oja, Tarmo Johannes**
Entrance: free'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1031 AND starts_at = '2025-05-14T17:00');

-- 1032: eccm.ee 40, 2025-05-15T17:30
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1032, '2025-05-15T17:30', NULL, NULL, '', '',
   '', '', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_screenshot-2025-04-22-at-18-54-39.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 40);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1032, 'et', 'viktoria-grahv-glagoliitiliste-unede-raamat',
   'Viktoria Grahv. Glagoliitiliste unede raamat', 40,
'Viktoria Grahv. „Glagoliitiliste unede raamat“ (esiettekanne)

Evelyn Kanepi (hääl), Anastassia Danilenko (hääl), Brigitta-Selestine Petropavlova (klaver), Anna-Helena Inno (vioola), David-Ovid Komlev (akordion)

„Glagoliitiliste unede raamat“ on kirjutatud kahele lauljale, klaverile, akordionile, vioolale, fonogrammile ja videole. Teos tegeleb üksinduse ja isolatsiooni teemadega. Oluline osa teosest on 13 teksti, mis avavad üksinduse olemust erinevate igapäevaelu objektide kaudu. Tekstid on kirja pandud kasutades keskaegset glagoolitsa tähestikku.

Kontsert on osa Eesti Muusika- ja Teatriakadeemia heli, visuaali ja muusikatehnoloogia festivalist COMMUTE#7, mis kannab alapealkirja „Heaolu“. Festival toimub 8., 16. maini ning keskendub tänavu vaimse tervise teemadele.

_Teos on vene keeles, eestikeelsete subtiitritega._

_Festivali korraldab Eesti Muusika- ja Teatriakadeemia. Toetavad Eesti Kultuurkapital ja Tallinna linn._

Viktoria Grahv. “Book of Glagolitic Dreams” (Premiere)

Evelyn Kanepi (voice), Anastassia Danilenko (voice), Brigitta-Selestine Petropavlova (piano), Anna-Helena Inno (viola), David-Ovid Komlev (accordion)

“Book of Glagolitic Dreams” is written for two singers, piano, accordion, viola, phonogram, and video. The work addresses themes of loneliness and isolation. An important part of the piece consists of 13 texts that explore the essence of solitude through various everyday objects. The texts are written using the medieval Glagolitic alphabet.

The concert is part of the Estonian Academy of Music and Theatre''s sound, visual, and music technology festival COMMUTE#7, which has the subtitle “Well-Being.” The festival takes place from May 8 to 16 and focuses this year on mental health issues.

The piece is in Russian, with Estonian subtitles.

The festival is organized by the Estonian Academy of Music and Theatre, supported by the Estonian Cultural Endowment and the City of Tallinn.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1032 AND starts_at = '2025-05-15T17:30');

-- 1033: eccm.ee 44, 2025-05-15T20:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1033, '2025-05-15T20:00', NULL, NULL, '', '',
   '', '', 'schoenberg', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_screenshot-2025-04-23-at-17-40-48.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 44);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1033, 'et', 'schonbergi-sari-remix-3-andrus-kallastu-autorikontsert',
   'Schönbergi sari REMIX 3 Andrus Kallastu autorikontsert', 44,
'Schönbergi sari
N 15.5.2025 kell 20.00
Eesti Nüüdismuusika Keskus (Pühavaimu 9, Tallinn)
REMIX 3
Andrus Kallastu autorikontsert

Pääsmed 20/10/5
[fienta.com/et/schonbergi-sari-remix3-andrus-kallastu-autorikontsert](https://fienta.com/et/schonbergi-sari-remix3-andrus-kallastu-autorikontsert)

KAVA

Andrus Kallastu (1967)

Kolm momenti, instrumentaalteater kammeransamblile (2025, esiettekanne)
1. Purjekad | Sailboats
2. Vahvlipeer | Waffle fart
3. Blékété

Roomet Jakapi kolm loengut filosoofiast
Lectiones, retsitatiiv häälele ja kammeransamblile (2019)
Descartes
Spinoza
Leibniz

Disputationes, sonaat kammeransamblile (2019)
Descartes. Allegro elastico
Spinoza. Andante rigoroso
Leibniz. Vivace

Repoo Ensemble
Kai Kallastu, hääl, heliobjektid
Leonora Palu, flööt
Aare Tammesalu, tšello
Jorma Toots, klaver
Andrus Kallastu, dirigent, elektroonika

Kontseptuaalses kontserdikavas Remix 3 kõlavad Andrus Kallastu momentvormis teosed. Kolm momenti on kolme partikulaarse helimaterjali transkriptsioon noodikirjas. Roomet Jakapi kolm loengut filosoofiast käsitleb maailma metafüüsilise ehitise alusüksuseid ehk substantse, tehes seda kolme varauusaegse filosoofi positsioone uurides. René Descartes’i dualism, Baruch Spinoza monism ja Gottfried Wilhelm Leibnizi pluralism avanevad siin uute vaatenurkade alt, kõnetades nüüdisaegset inimest tema pidetus ja pinnalises tunnetuses. Kõigi kolme filosoofi vaadete esituse lähtekohaks võetakse historiograafilis-kontekstualiseeriv rekonstruktsioon, millele lisandub argumentide üksikasjalik lahtikirjutus ja analüüs. Seejuures pööratakse tähelepanu kõnealuste positsioonide ja argumentide kõlalistele aspektidele, mida senine filosoofiline uurimistegevus on üldjuhul ignoreerinud. Loengutele järgneb varajase sonaadi vormis kolmeosaline muusikaline dispuut.

Momendi ja momentvormi mõiste võttis kasutusele Karlheinz Stockhausen seoses oma teosega Kontakte (1958 kuni 60). Moment on Stockhausenil heliteose mistahes vormiüksus, mis on äratuntav teatud äravahetamatu karakteri tõttu. Moment võib olla jagamatu kujund, selgete osistega struktuur või nende kahe segu. Moment võib olla staatiline või dünaamiline või nende kahe kombinatsioon. Moment võib olla mistahes pikkusega. Momentvorm on kompositsiooniline lähenemine muusikale, mille puhul teadlikult välditakse narratiivsust. Momentvormis teostes on momendid seotud mittelineaarselt. Kui momentide süsteem ammendub teatud hulga võimalustega, on vorm suletud. Kui momentide jada on lõpetamata, on vorm avatud. Momentvorm tingimata ei välista eesmärgipärastena tajutavaid protsesse. Momendid lihtsalt ei osale suunatud narratiivses kaares. Momentvorm ei ole suunatud kulminatsiooni suunas ning sellel puuduvad kulminatiivsele vormile tavapärased sissejuhatavad, tõusu, üleminekut ja hääbumist esindavad etapid. Samuti ei ole momentvorm piiritletud kogu teose kestust hõlmava arengukõverana. Vastupidi, momentvorm saavutab koheselt maksimumintensiivsuse, mille tase säilib kuni teose lõpuni. Momentvormis teoses võib igal hetkel oodata dünaamilist miinimumi või maksimumi ning teose arengu suund on ennustamatu. Momentvorm on justkui alati juba alanud ja jätkub igavesti. Momentvormis on korraga kõik või mitte midagi. Nüüd-hetki ei saa pidada neile eelnevate hetkede tagajärjeks ja tulevaste hetkede ettevalmistuseks. Momendid ei ole ka miski, millele inimene võiks loota. Momendid on pigem sõltumatud, võimelised eksisteerima iseseisvalt. Momentvormis ei ole hetk punkt ajateljel või mõõdetud kestusega ajalõik. Momentvorm keskendub olevikule, milles iga hetk loob otsekui vertikaalseid kiile läbi horisontaalse, tuues kaasa aja puudumise, igaviku. Igavik ei alga aja lõpus, vaid on olemas igal ajahetkel. Momentvormis teos taotleb justkui aja kaotamist või täpsemalt ajalise kestuse tunnetuse kaotamist. Kuigi momentvormis teos võib teatud aja möödudes lakata, on nii selle algus kui ka lõpp kuulaja jaoks tihti avatud.

Koostöös
Eesti Arnold Schönbergi Ühing
Eesti Nüüdismuusika Keskus
EELK Pärnu Eliisabeti kogudus
EELK Tartu Ülikooli-Jaani Kogudus
Pärnu Ooper
Autorfest

Toetajad
Pärnu linn
Tartu linn
Tallinna linn
Kultuurkapital
Kultuuriministeerium

[www.kallastu.ee](https://www.kallastu.ee/)
[schoenberg.ee](https://schoenberg.ee/)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1033 AND starts_at = '2025-05-15T20:00');

-- 1034: eccm.ee 43, 2025-05-17T16:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1034, '2025-05-17T16:00', NULL, NULL, '', '',
   '', '', 'koostoo', NULL, 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 43);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1034, 'et', 'mette-mari-kaljas-karl-jogi-stan-callewaert-graafilise',
   'Mette Mari Kaljas / Karl Jõgi / Stan Callewaert: graafilise disaineri ja helilooja koostööpotentsiaalist', 43,
'17.05 kell 17 toimub Mette Mari Kaljase bakalaureuseprojekti esitlus. Eesti Kunstiakadeemia graafilise disaini tudengi Mette Mari Kaljase lõputöö käsitleb graafilist notatsiooni ning uurib graafilise disaineri ja helilooja koostööpotentsiaali noodigraafika loomisel. Esitamisele tuleb koostöös Karl Jõgi ja Stan Callewaertiga valminud teos viiulile ja kontrabassile, aset leiab ka vestlusring.

_On May 17 at 5 PM, Mette Mari Kaljas will present her bachelor''s project. In her graduation project in the Graphic Design department of Estonian Academy of Arts, Mette Mari Kaljas explores graphic notation, investigating the potential collaboration between the roles of graphic designer and composer. The presentation will feature a piece for violin and double bass, created in collaboration with Karl Jõgi and Stan Callewaert, and will conclude with a discussion._'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1034 AND starts_at = '2025-05-17T16:00');

-- 1035: eccm.ee 45, 2025-08-29T18:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1035, '2025-08-29T18:00', '2025-08-29T23:00', NULL, 'Mustpeade maja Pikk 26', 'Pikk 26, Tallinn',
   '', 'https://www.eccm.ee/', 'eccm', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_2025-kultuurioo-vaike-copy.jpeg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 45);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1035, 'et', 'tallinn-1965-koolikokkutulek-kultuuriool',
   'Tallinn 1965 Koolikokkutulek Kultuuriööl', 45,
'Ideaaljuhul tähendab kool mingisugust kokkukuuluvust sisemiselt äratuntud loogika järgi. Seda loogikat suudavad ära tunda sageli ka teised, need kes kuuluvad mingitesse teistesse koolidesse või ei kuulu üldse kuhugi. Seekordse koolikokkutuleku üks võimalik alusmuster on “a school of fish”, kalad ujuvad koos koordineeritud viisil, neil on mingi sisemine sünkronisatsioon. Aga need siin ei ole sarnased kalad, nad lihtsalt saavad aru üksteise loogikatest ja on nõus seda natuke aega jagama.

Ideally, a school is understood as a sense of belonging based on an internally recognizable logic. This logic is often recognizable by others as well, those who belong to different schools or who don''t belong to any school at all. One possible pattern for this school reunion is "a school of fish", fish swim together in a coordinated manner, with some internal synchronization. However, these here are not similar fish; they simply understand each other''s logics and are willing to share this understanding for a little while.

18.00 Ansambel EMA / Mikko Ojanen / Jari Suominen "Elektra"
18.30 Raul Keller Installatsioon ‘Segaja / Jammer’
19.00 Aivar Tõnso ‘Ebakõlarid‘
20.00 Roberto Becerra / Matas Samulionis
Jesper Pedersen
Theodor Parker
21.00 Vestlus - esinejad + Girts Ozolins, Anna Fisere
22.00 Tarmo Johannes interaktiivne ‘Mustrimäng’

Artistid:
JESPER PEDERSEN [ISL]

Reykjavikis tegutsev helilooja, helikunstnik ja live-elektroonik, kes on loonud elektroakustilist muusikat ja helikunsti teoseid akustilistele instrumentidele ja eksperimentaalsetele omatehtud instrumentidele. Tema teosed kasutavad sageli eksperimentaalset animeeritud või graafilist notatsiooni, mis uurivad heli ruumilisi ja esituslikke kotseptsioone. Viimastel aastatel on Pedersen keskendunud modulaarssüntesaatorile ja live-elektroonikale. Ta läheneb helile improvisatsiooni ja kuulamise kaudu ning uurib abstraktset heli, tekstuuri, müra ja drone''i ja on teinud palju koostööd teiste muusikutega.

ROBERTO BECERRA [MEX,LT] on multidistsiplinaarne kunstnik, tehnoloogia entusiast, insener. Vilniuses asuva loomeruumi “Ideas Block” ja kultuuriplatvormi “Arttice” kaasasutaja. Roberto töötab ka programmeerija, õppejõu ja projektijuhina Leedu Muusika- ja Teatriakadeemias.

MATAS SAMULIONIS [LT] on muusik, helilooja, produtsent ja uurija, kes on pühendunud akustilise ja elektroonilise muusika kokkupuutepunktide uurimisele. Ta on osav improviseerija, kes ühendab traditsioonilised ja avangardsed muusikapõhimõtted, et luua uuenduslikke ja eksperimentaalseid kompositsioone ja live-etteasteid. Omades jazz-saksofoni (Ba) ja kaasaegse improvisatsiooni (Ma) akadeemilist tausta, ühendab Matas erialased teadmised erinevate elektrooniliste instrumentide ja lähenemisviisidega. Tema töö tuumaks on vaba improvisatsioon rõhuasetusega vormil ja kontrollil kui olulistel vahenditel kunstilise terviku dokumenteerimisel ja täiustamisel.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1035 AND starts_at = '2025-08-29T18:00');

-- 1036: eccm.ee 46, 2025-09-11T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1036, '2025-09-11T19:00', NULL, NULL, '', 'Pikk 26, Tallinn',
   '', '', 'schoenberg', NULL, 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 46);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1036, 'et', 'schonbergi-sari-keskoo-laulud-eriko-takahashi-klaver',
   'Schönbergi sari. Kesköö laulud. Eriko Takahashi (klaver)', 46,
'Schönbergi sari
N 11.9.2025 kell 19.00
Eesti Nüüdismuusika Keskus (Mustpeade maja, Pikk 26, Tallinn)

Kesköö laulud

Eesti, soome ja jaapani 20. ja 21. sajandi klaverimuusikat. Teosed autoritelt Arvo Pärt, Urmas Sisask, Helena Tulve, Toshi Ichiyanagi, Akira Kobayashi, Somei Sato, Kai Nieminen, Selim Palmgren ja Ari Romppanen.

Midnight Songs

Estonian, Finnish and Japanese program with piano music from 20th and 21th century. Works by Arvo Pärt, Urmas Sisask, Helena Tulve, Toshi Ichiyanagi, Akira Kobayashi, Somei Sato, Kai Nieminen, Selim Palmgren and Ari Romppanen.

Eriko Takahashi (klaver, Jaapan)
Kontserdile järgneb arutelu. | The concert will be followed by a discussion.
Pääsmed 20/10/5

KAVA
Urmas Sisask (1960-2022)
Aquarius (dream) from "Starry Sky Cycle op. 10" (1980-1987)

Helena Tulve (*1972)
Three Songs (2008)
1. Night Song
2. It was a River in the Mountains, I guess
3. It is Evening, the Light

Kai Nieminen (*1953)
Nightingale... Midnight Song... and Morning Rain... (2024)

Ari Romppanen (*1974)
Himawari (2023)

Arvo Pärt (*1935)
Partita op. 2 (1959)

Toshi Ichiyanagi (1933-2022)
Cloud Atlas VIII "Cloud in the Distance" (1989)

Akira Kobayashi (*1960)
Glass Swan (2000)

Somei Sato (*1947)
Pieta (2024)

Ari Romppanen (*1974)
Erakis (2016-2017)

Urmas Sisask (1960-2022)
Lyre (happiness) from "Starry Sky Cycle op. 10" (1980-1987)

Eriko Takahashi (klaver)

„Kesköö laulud“, eesti, soome ja jaapani 20. ja 21. sajandi klaverimuusika. Teosed autoritelt Arvo Pärt, Urmas Sisask, Helena Tulve, Toshi Ichiyanagi, Akira Kobayashi, Somei Sato, Kai Nieminen, Selim Palmgren ja Ari Romppanen.

Jaapanis Yokohamas sündinud pianist Eriko Takahashi tunneb suurt huvi vähemtuntud või unustatud teoste ja ka nüüdismuusika vastu. Ta on teinud koostööd mitmete heliloojatega, teoseid esiettekandnud ja talle on ka teoseid pühendatud.

11aastaselt esines ta koos Roland Baderi ja Capella Cracoviensisega kontserdil Tokyos. 2013. aastal esines ta Benjamin Britteni juubelikontserdil Brucknerhausis Linzis Austrias. Aastatel 2023 ja 2024 esines ta Joensuu muusikafestivalil Soomes. Ta on välja andnud kaks CD-d: „Musique Variée“ (2019) ja „Nordic Visions, Finnish Piano Music“ (2025, ALM Records).

Alates 2020. aastast on ta Tokyos asuva Jaapani-Soome Kaasaegse Muusika Seltsi liige. Alates 2024. aastast õpetab ta klaverit Tokyo Jaapani Naisteülikoolis.

Pärast Toho Gakueni Muusikakooli lõpetamist Tokyos õppis Takahashi klaverit ja kammermuusikat Linzi Anton Bruckneri Eraülikoolis. Samuti õppis ta nüüdismuusikat Grazi Muusika- ja Esituskunstide Ülikoolis. Ta on pälvinud auhindu klaverikonkurssidelt nagu „Cittá di Barletta“ Itaalias, „Premio Accademia Giovani“ Roomas ja Julian Cochrani klaverikonkurss Varssavis. 2015. aastal pälvis ta Austria Rotary Klubi Welsi stipendiumi.

Ta oli žürii liige rahvusvahelisel klaverikonkursil „Clavis St. Petersburg 2017“ ja „Japan Classical Music Competition 2023“.

A native of Yokohama, Japan, pianist Eriko Takahashi has a big interest for less known or forgotten works and also contemporary music. She has cooperated with several composers, given numerous first performances and also received dedications.

At the age of 11 she performed with Roland Bader and Capella Cracoviensis in a concert in Tokyo. In 2013 she appeared in the anniversary concert of Benjamin Britten at the Brucknerhaus in Linz, Austria. In 2023 and 2024 she performed at the Joensuu Music Festival in Finland. She has released two CDs “Musique Variée“ (2019) and “Nordic Visions, Finnish Piano Music” (2025, ALM Records).

Since 2020 she is a member of Japan Finland Contemporary Music Society in Tokyo. Since 2024 she has been teaching piano at the Japan Women’s University in Tokyo.

After her graduation at the Toho Gakuen School of Music in Tokyo, Takahashi studied piano and chamber music at the Anton Bruckner Private University in Linz. She also studied contemporary music at the University of Music and Performing Arts in Graz. She is awarded especially in the following international piano competitions: “Cittá di Barletta” in Italy, “Premio Accademia Giovani” in Rome, and Julian Cochran Piano Competition in Warsaw. In 2015 she was awarded with a scholarship from the Rotary Club Wels in Austria.

She was a judge in the international piano competition "Clavis St. Petersburg 2017", and "Japan Classical Music Competition 2023".

Koostöös
Eesti Arnold Schönbergi Ühing
Eesti Nüüdismuusika Keskus
EELK Pärnu Eliisabeti kogudus
EELK Tartu Ülikooli-Jaani Kogudus
Pärnu Ooper
Autorfest

Toetajad
Pärnu linn
Tartu linn
Tallinna linn
Kultuurkapital
Kultuuriministeerium

[erikotakahashi.com](https://erikotakahashi.com/)
[schoenberg.ee](https://schoenberg.ee/)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1036 AND starts_at = '2025-09-11T19:00');

-- 1037: eccm.ee 47, 2025-09-14T16:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1037, '2025-09-14T16:00', NULL, NULL, '', 'Pikk 18, Tallinn',
   '', '', 'eccm', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_ampsud-foto.jpeg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 47);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1037, 'et', 'vanamuusika-ampsud-pika-tanava-festival',
   'Vanamuusika Ampsud. Pika tänava festival.', 47,
'Vanamuusika ampsud on seeria minikontsertidest koos rahvusvaheliselt tunnustatud varajase- ja nüüdismuusika soprani Tuuli Lindebergiga. Koos Lindebergiga astuvad üles Anna-Liisa Eller ja Taavi Kerikmäe.

Esitusele tulevad: kl 16 Keskaja muusika minikontsert kl 17 renessaanssmuusika minikontsert kl 19 barokkmuusika minikontsert. Kontsertidele valitud muusikat ja seoseid Eestiga tutvustavad muusikud inglise keeles. Kuulda saab nii erinevaid klavikorde, klavitsimbalumi, arpanettat, erinevaid näppepille ja muidugi Tuuli helisevat sopranit. Samuti saab näha Hedi Jaansoo ja Juliana Lindenhoferi Draakoni galerii näitust.

Kontsert toimub Pika tänava festivali raames. Koostööpartneriks Draakoni galerii'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1037 AND starts_at = '2025-09-14T16:00');

-- 1038: eccm.ee 48, 2025-09-14T20:30
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1038, '2025-09-14T20:30', NULL, NULL, 'Mustpeade Maja Vennaste saal', 'Pikk 26, Tallinn',
   'https://www.piletimaailm.com/performances/146917-pimenagemine?lang=et_EE', 'https://www.theatrum.ee/', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_pimenaegemine-pilt.jpeg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 48);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1038, 'et', 'pimenagemine',
   'Pimenägemine', 48,
'Autor: **Karl Ristikivi**

Lavastaja: **Ott Aardam**

Loevad: **Lembit Peterson**, **Laura Peterson-Aardam**, **Helvin Kaljula**, **Marius Peterson**, **Tarmo** **Song**, **Ott Aardam** ja **Abram Aardam**

Helid: **Taavi Kerikmäe**

Esietendus 14. septembril 2025 kell 20.30 Mustpeade majas

**Karl Ristikivi** kuuldemäng **„Pimenägemine”** on kirjutatud 1950ndatel rootsi keeles pseudonüümi all **Kent Jansson**. Millegipärast pidas Ristikivi oluliseks peita ennast pseudonüümi taha. „Pimenägemise” keskseks tegelaseks on mees, kes poeb peitu pimedusse. Ta ei näe, ta silmad on korras, aga ta ei näe. Või ei taha näha või ei suuda?

Ristikivi küsib, kas alasti karm tõde on see, mis maailma päästab, või on tõde ilma armastuseta nii laastav, et tervislikum on tema eest peitu pugeda? Nendesse teemadesse saab koos Karl Ristikivi, Theatrumi näitlejate ja Taavi Kerikmäe loodud helikujundusega ennast sisse kuulata.

**Theatrumi „Kuulamiste” sari** on ellu kutsutud, et erinevaid tekste koos kuulata. Koos kuulab tekstist alati midagi sellist välja, mida üksi ei kuuleks.

Seekord oleme „Kuulamistega” läinud veel ühe sammu edasi. Tegu on omamoodi kuulamiseksperimendiga, kus publikul on silmad kinni kaetud. Jääb vaid kuulamine. Ja kui hästi teravalt kuulata, võib ka näha.

**„Pimenägemise” kuuldemäng** jõuab lavale **Pika tänava festivali** raames.

Toetajad: **Tallinna linn**, **Kultuurkapital**, **Eesti Nüüdismuusika Keskus**, **Karl Ristikivi Selts**

Ürituse korraldaja:

SA Theatrum
Vene 14, Tallinn 10123
See e-posti aadress on spämmirobotite eest kaitstud. Selle nägemiseks peab su veebilehitsejas olema JavaSkript sisse lülitatud.
reg.nr: 90008956'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1038 AND starts_at = '2025-09-14T20:30');

-- 1039: eccm.ee 49, 2025-10-25T10:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1039, '2025-10-25T10:00', '2025-10-25T22:00', NULL, 'Mustpeade Maja', '',
   '', 'https://www.liivatera.com/', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_36869c31-100a-42aa-9094-12f713471581-1-105-c.jpeg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 49);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1039, 'en', 'synth-diy-tallinn',
   'Synth DIY Tallinn', 49,
'Electronic music is a unique mix of artistic and scientific creativity, producing sounds that have been part of our lives almost since the start of universal electrical supplies. Each phase (teleharmonium, Hammond, Musique Concrète, mono & polyphonic synthesizers…) has had a visionary that had a ‘foot in both camps’ and the drive to make something not heard before. With the commoditisation of synthesizers in the last 40 years modular synthesisers have been rediscovered as one way to keep making things that have never been heard before, as shown by the huge range of modules available today. Even so, the individual creativity still burns today, with different ways to interact with music creation, experience it and share it. This desire necessitates experimentation and building prototypes, and a healthy DIY scene. This is why we are holding a synthesizer DIY event in Tallinn - a city renowned for its technical creativity - so we may even witness the next Stockhausen, Moog or Ciani. In collaboration with Liivatera , there will be a gathering for anyone interested in home-made electronic instruments.

If you have something to show, drop us a note so we can ensure enough tables for everyone and bring it along.
If you''re curious, come and see what others are doing, chat, be inspired, inspire others....

If you''re a beginner there will be a workshop run by Erica Synths to get you off to a great start - but registration is required (address in flyer).

If you have questions there will be a panel discussion with Erica Synths Neil J (Cesyg, Sound Semi) and me.
There will be a raffle for DIY-related prizes

In the evening there will be an ''open mic'' where anyone can make a (short) performance with their creation (but register your interest in New programme timetable

10.30 Doors open
11.00 Module building workshop
14.30 DIY electronics/synthesiser building session
19.00 Concert

The module building session is now a VCO calibrator & tuner provided by Liivatera, and there are still a couple of places free advance)

UPDATE
New programme timetable

10.30 Doors open
11.00 Module building workshop
14.30 DIY electronics/synthesiser building session
19.00 Concert'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1039 AND starts_at = '2025-10-25T10:00');

-- 1040: eccm.ee 50, 2025-12-13T00:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1040, '2025-12-13T00:00', NULL, NULL, 'Mustpeade Maja', '',
   'https://fienta.com/et/ule-heli-25-ansambel-u-stratifikatsioonid', 'https://www.ule-heli.ee/', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_uh2025-ii-v.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 50);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1040, 'et', 'ule-heli-25-ansambel-u-stratifikatsioonid-ja-heliportatsioon',
   'Üle Heli 25 / ANSAMBEL U: "STRATIFIKATSIOONID" ja HELIPORTATSIOON', 50,
'**18:00 ANSAMBEL U: "STRATIFIKATSIOONID"** Valges saalis

Ansambel U: kontsert "Stratifikatsioonid" tegeleb kihistumiste, ladestumiste, hargnemiste, tardumiste, hajumiste, tajumistega. Iga teos on seotud mingi füüsilise nähtuse, materjali või üleminekuolukorraga.

**Kavas:**
Malin Bång "Structures of Molten Light" (2011)
Viktoria Grahv "Jäälill601512" (2025, esiettekanne)
Liina Sumera ""Pāhoehoe / ʻAʻā"" (2025, esiettekanne)
Ülo Krigul "Nehalennia dunings" (2025, esiettekanne)
Peter Ablinger "Kyrie nach Machaut" (1983/2022)

**19:30 HELIPORTATSIOON** erinevates Mustpeade maja ruumides

Üle Heli 25 II osa lõpetab ühiselt koos Eesti Nüüdismuusika Keskusega korraldatud labürintlik Heliportatsioon. Lisaks heliliselt ajastute ja reaalsuste vahel kulgemisele võimaldavad Mustpeade maja erinevad nurgatagused teha seda ka ruumiliselt.

**Kavas:**
Eesti Elektroonilise Muusika Seltsi Ansambel "EMA" esitlus
Tarmo Johannes, Toomas Siitan, Anna-Liisa Eller, Taavi Kerikmäe, Hans-Gunter Lock, Helena Tuuling "detour : ümberminek"
Varm & Correia "Hiiumaa" esitlus (visuaalid Tencu)
Raul Kelleri Installatsioon ‘Segaja / Jammer’

CoPeCo Collective (Mara Hebel, Mattia Giustetto, Alberto Piazza, Hugo Coelho, Kenn-Eerik Kannike, Kristýna Švihálková , Xu Dong, Martina Copello ja Theodore Parker)

Aivar Tõnso "Lummafooria" ebakõlarisüsteemile
valguskujundus Rene Manivald Tamm

**Lisainfo:**
[www.ule-heli.ee](http://www.ule-heli.ee/)
[www.facebook.com/events/1349780166615262](https://www.facebook.com/events/1349780166615262)
[www.facebook.com/events/1984676808993019](https://www.facebook.com/events/1984676808993019)

Piletid: Ansambel U: "Stratifikatsioonid" 10/12/15 [fienta.com/et/ule-heli-25-ansambel-u-stratifikatsioonid](https://fienta.com/et/ule-heli-25-ansambel-u-stratifikatsioonid) Helipirtatsioon 10/12/15 [fienta.com/et/ule-heli-25-heliportatsioon](https://fienta.com/et/ule-heli-25-heliportatsioon) Päevapilet 15/20 [fienta.com/et/ule-heli-25-mustpeade-majas](https://fienta.com/et/ule-heli-25-mustpeade-majas)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1040 AND starts_at = '2025-12-13T00:00');

