-- seed-step10-archive-2026.sql: eccm.ee's past events of 2026 up to 12 May, the day before the earliest event seed-step6.sql brought, read once each off its public
-- pages on 2026-10-07 (the four list pages and each event page, one request a second,
-- cached), docs/migration.md "Import the archive". 20 events, 31 texts, 12 new pictures.
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
  ('ic_large_w900h600q100_ludens-dream-sequence-of-an-ancient-forest-plakatid-var-1-1920-x-1080-px-1200-x-1200-px.jpg', 800, 800,
   'Dream Sequence of an Ancient Forest. Madli Marje Gildemanni albumi esitluskontsert.',
   'Dream Sequence of an Ancient Forest. Madli Marje Gildemanni albumi esitluskontsert.'),
  ('ic_large_w900h600q100_screenshot-2026-02-10-at-15-40-54.png', 899, 475,
   'Tencu/ Samson Improtestil',
   'Tencu/ Samson Improtestil'),
  ('ic_large_w900h600q100_open-space-pilt.jpeg', 849, 600,
   'OPEN SPACE',
   'OPEN SPACE'),
  ('ic_large_w900h600q100_626535432-1481474323986439-5414415055884952965-n.jpg', 800, 533,
   'Schönbergi sari. PARADIGMAD. Loeng-kontsert-arutelu. Leo Semlek "Muusikastiilide perioodsüsteem"',
   'Schönbergi sari. PARADIGMAD. Loeng-kontsert-arutelu. Leo Semlek "Muusikastiilide perioodsüsteem"'),
  ('ic_large_w900h600q100_laine2.png', 900, 506,
   'DUOD V',
   'DUOS V'),
  ('ic_large_w900h600q100_mustpead.jpg', 900, 543,
   'Kahe saali kontsert',
   'Two-Hall Concert'),
  ('ic_large_w900h600q100_700x1400px-scrapyard-vaike.jpg', 1000, 500,
   'SCRAPYARD',
   'SCRAPYARD'),
  ('ic_large_w900h600q100_649918062-1513415897458948-1454279337550947045-n.jpg', 900, 600,
   'Schönbergi sari. LAIVELEKTROONIKA. Hans-Gunter Lock, Andrus Kallastu',
   'Schönbergi sari. LAIVELEKTROONIKA. Hans-Gunter Lock, Andrus Kallastu'),
  ('ic_large_w900h600q100_11-04-vestlus-ruut.png', 600, 600,
   'Vestlusring: mille pinnalt tärkab uus muusikateater?',
   'Panel Discussion: What is the Breeding Ground for New Music Theatre?'),
  ('ic_large_w900h600q100_12-04-vestlus-ruut.png', 600, 600,
   'Vestlusring: vabadus, piirid ja helid: Eesti nüüdismuusika teekonnad maailmas',
   'Panel Discussion: Freedom, Boundaries, and Sounds: The Paths of Estonian Contemporary Music in the World'),
  ('ic_large_w900h600q100_ulysse-logo-green.jpg', 900, 417,
   'ULYSSES JOURNEYS FOR LIVE ELECTRONICS COMPOSING VOL 2.',
   'ULYSSES JOURNEYS FOR LIVE ELECTRONICS COMPOSING VOL 2.'),
  ('ic_large_w900h600q100_improtest-090526.jpg', 588, 330,
   'Improtest: Baumann / Pietilä / Soo',
   'Improtest: Baumann / Pietilä / Soo');

-- 1041: eccm.ee 57 and 54, 2026-02-10T18:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1041, '2026-02-10T18:00', NULL, NULL, 'Olavi Hall, House of the Blackheads', 'Pikk 26, Tallinn',
   '', 'https://uuu.ee/', 'u', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_residentuur-26.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 57);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1041, 'et', 'residentuu-r-1-2026-02-10',
   'Residentuu:r 1', 57,
'**U:** jätkab **Reisdentuu:ride** sarjaga. 2026. a on Residentuu:ri teemaks "**Ülekanne. Kommunikatsioon. Meedia** ". Eesmärgiks on püüda laiemas mõttes vaadelda sõnumite-mõtete-ideede edasiandmist, tõlkimist ühest meediast teise, suhtlust ja kommunikatsiooni - printsiipe, mis on kogu kunstiloome aluseks. Ühtlasi esitab U: teemadega seotud valitud teoseid.

Esimesel kohtumisel on külaliseks **Daniele Monticelli**, Tallinna Ülikooli semiootika ja tõlkeuuringute professor.

**Sissepääs tasuta.**'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1041 AND starts_at = '2026-02-10T18:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1041, 'en', 'residentuu-r-1-2026-02-10',
   'Residentuu:r 1', 54,
'U: continues its **Residency** series. In 2026, the theme for the Residency is **''Transfer. Communication. Media''**. The goal is to examine the transmission of messages, thoughts, and ideas in a broader sense-the translation from one medium to another, interaction, and communication-principles that form the very foundation of all artistic creation. Additionally, U: will perform selected works related to these themes.

The guest for the first session is **Daniele Monticelli**, Professor of Semiotics and Translation Studies at Tallinn University.

**Free admission.**'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1041 AND starts_at = '2026-02-10T18:00');

-- 1042: eccm.ee 66, 2026-02-16T00:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1042, '2026-02-16T00:00', NULL, NULL, 'Mustpeade maja Valge saal', 'Pikk 26, Tallinn',
   'https://piletikeskus.ee/et/e/qootw1', 'https://www.ludensemble.ee/', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_ludens-dream-sequence-of-an-ancient-forest-plakatid-var-1-1920-x-1080-px-1200-x-1200-px.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 66);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1042, 'et', 'dream-sequence-of-an-ancient-forest-madli-marje-gildemanni',
   'Dream Sequence of an Ancient Forest. Madli Marje Gildemanni albumi esitluskontsert.', 66,
'**Ludensemble** esitleb 2026. aasta jaanuaris ilmunud helilooja **Madli Marje Gildemanni** muusikaga albumit **Dream Sequence of an Ancient Forest.**

Album koondab teoseid, mis on inspireeritud bioloogilistest protsessidest, looduse varjatud rütmidest ja mütoloogilisest kujutlusvõimest. Albumi muusika on inspireeritud taimede varjatud elust, looduse öistest rütmidest ja metsa unenäolisest maailmast ning suhestub ka inimloodud maailma ja selle mütoloogiliste tähendustega. Albumi **Dream Sequence of an Ancient Forest.** esitluskontsert kutsub kuulajat süvenema ja kogema muusikat kui ruumi, kus looduslik ja inimlik maailm põimuvad.

Kadri-Ann Sumera (klaver), Madli Marje Gildemann (klaver), Taniel Kirikal (ülemhelilaul) ja Raido Lill (kõrilaul)

Ludensemble koosseisus **Maria Luisk** (flööt), **Alexandr** **Avramenko** (klarnet), **Kaija Lukas** (viiul), **Elisabeth Härmand** (viiul), **Sandra Klimaitė** (vioola), **Theodor Sink** (tšello), **Regina Udod**, **Madis Jürgens** (kontrabass), **Kärt Ruubel** (klaver), **Maarja Nuut, Tiit Joamets** (löökpillid), dirigent **Kaspar Mänd**.

**Madli Marje Gildemanni** muusika on inspireeritud ja mõjutatud tema huvist bioloogiliste protsesside ja looduslike nähtuste vastu. See on sündinud püüdest muuta need protsessid helide kaudu tajutavaks, luues seeläbi ainulaadseid helimaastikke. Ta on kirjutanud ansamblitele nagu Klangforum Wien, Adelphi String Quartet, Pärnu Linnaorkester, Ensemble for New Music Tallinn, Ensemble 21, Estonian Percussion Group, The Mondrian Ensemble, Ensemble Synaesthesis, Sinfonietta Rīga, Tallinna Kammerorkester, Eesti Riiklik Sümfooniaorkester ja Ensemble U: ning paljudele teistele. 2022. aastal pälvis Gildemann Palermos, Sitsiilias toimunud Rahvusvahelisel Heliloojate Rostrumil alla 30-aastaste kategoorias teosega _Transpiration_ teise koha. 2023. aastal sai ta Lõuna-Aafrikas Kaplinnas ISCMi Noore Helilooja Auhinna teose _Osmosis_ eest, mis kanti ette ISCMi Maailma Muusika Päevadel. Samal aastal nomineeriti _Transpiration_ Monaco Printsi Pierre’i Muusikaauhinnale. 2024. aastal pälvis ta teose _Nocturnal Migrants_ eest LHV Uue Heliteose Auhinna (Au-tasu), ühe olulisema nüüdismuusika tunnustuse Eestis, millega austatakse erakordse kunstilise tasemega maailmaesiettekandeid, mis väärivad rahvusvahelist tähelepanu. Gildemanni muusikat on esitatud paljudel festivalidel, sealhulgas ORF Musikprotokoll Festivalil, Lucerne’i festivalil, Berni muusikafestivalil, Eesti Muusika Päevadel, Balti Muusika Päevadel, ISCMi Maailma Muusika Päevadel (Eestis ja Lõuna-Aafrikas), Huddersfieldi nüüdismuusika festivalil, Al(t)chemie festivalil, Classical Next Showcase’il ja Afekti festivalil.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1042 AND starts_at = '2026-02-16T00:00');

-- 1043: eccm.ee 82, 2026-02-20T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1043, '2026-02-20T19:00', NULL, NULL, 'Mustpeade Maja', '',
   '', 'https://improtest.ee/', 'improtest', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_screenshot-2026-02-10-at-15-40-54.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 82);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1043, 'et', 'tencu-samson-improtestil',
   'Tencu/ Samson Improtestil', 82,
'tencu/samson

Modulaarsüntesaatori ja saksofoni improvisatsioonist kujuneb elektroakustiline helimaastik, mis kōigub kaose ja vaoshoitud müra piiril. Yurii Samson on poeet ja bussijuht. Tencu aga video- ja helikunstnik.

[tencusamson.bandcamp.com](https://tencusamson.bandcamp.com/)

piletid: 10/8€

Improtest on rahvusvaheline vabaimprovisatsioonilise muusika kontsertsari, mis toimub aastast 2005. Sarja kuraatorid on Mart Soo ja Taavi Kerikmäe. Koostööpartnerid: ECCM! Eesti Kultuurkapital, Muusikalinn Tallinn, Tallinna Filharmoonia

[www.improtest.ee](http://www.improtest.ee/)

Piletid: pilet 8€/10€'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1043 AND starts_at = '2026-02-20T19:00');

-- 1044: eccm.ee 63 and 64, 2026-02-26T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1044, '2026-02-26T19:00', NULL, NULL, 'Mustpeade maja valge saal', 'Pikk 26, Tallinn',
   '', 'https://www.enmtallinn.com/', 'tuma', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_open-space-pilt.jpeg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 63);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1044, 'et', 'open-space',
   'OPEN SPACE', 63,
'Open Space kontserdisari on algatatud Tallinna Uue Muusika Ansambli poolt sooviga soodustada mitmekesisema kaasaegse muusika kogukonna kasvamist ning suurendada kogukonna ühtsust. Samuti tuua ettekandele nii värskelt valminud uudisteosed kui ka krestomaatilised nüüdismuusika teosed, mida esitatakse Eestis pigem harva.

Open Space sarja raames avame oma ansambli uksed kõigile heliloojatele ja interpreetidele, kaasaegse muusika harrastajatele, üliõpilastele ja professionaalidele, et nad saaksid kas üksi või Tallinna Uue Muusika Ansambli muusikutega esitada oma teoseid sundimatus õhkkonnas regulaarselt toimuvate kontsertide raames.

Sissepääs TASUTA'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1044 AND starts_at = '2026-02-26T19:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1044, 'en', 'open-space',
   'OPEN SPACE', 64,
'The Open Space concert series was initiated by the Ensemble for New Music Tallinn with the aim of fostering the growth of a more diverse contemporary music community and increasing community cohesion. It also presents both newly composed works and classic contemporary music works that are rarely performed in Estonia.

As part of the Open Space concert series, we open the doors of our ensemble to all composers and performers, contemporary music enthusiasts, students and professionals, so that they can perform their works either alone or with the musicians of the ENMT in a relaxed atmosphere during regular concerts.

FREE entrance'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1044 AND starts_at = '2026-02-26T19:00');

-- 1045: eccm.ee 65, 2026-03-05T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1045, '2026-03-05T19:00', '2026-03-05T22:00', NULL, 'Eesti Nüüdismuusika Keskus (Mustpeade maja, Pikk 26, Tallinn)', 'Pikk 26, Tallinn',
   'https://fienta.com/et/schonbergi-sari-paradigmad-semlek', 'https://www.facebook.com/events/1321537313070873/', 'schoenberg', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_626535432-1481474323986439-5414415055884952965-n.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 65);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1045, 'et', 'schonbergi-sari-paradigmad-loeng-kontsert-arutelu-leo-semlek',
   'Schönbergi sari. PARADIGMAD. Loeng-kontsert-arutelu. Leo Semlek "Muusikastiilide perioodsüsteem"', 65,
'Schönbergi sari
N 5.3.2026 kell 19.00
Eesti Nüüdismuusika Keskus (Mustpeade maja, Pikk 26, Tallinn)

PARADIGMAD
loeng-kontsert-arutelu

Kavas Leo Semlek "Muusikastiilide perioodsüsteem" (1990)

Schönbergi ühingu häälutajate trio Juhatus:
Gerhard Lock
Andrus Kallastu
Hans-Gunter Lock

Koostööpartnerid
Eesti Arnold Schönbergi Ühing
Tallinna Muusika- ja Balletikool MUBA
Pärnu Muusikakool
Eesti Muusika- ja Teatriakadeemia
Tallinna Ülikooli Balti filmi, meedia ja kunstide instituut
Port Artur
Pärnu linnagalerii
Pärnu Ooper
Autorfest
MASSIA loomeresidents
Pärnu Keskraamatukogu
Eesti Nüüdismuusika Keskus
Muusikalinn Tallinn
Kultuurkapital
Pärnu linn

Piletid [fienta.com/et/schonbergi-sari-paradigmad-semlek](https://fienta.com/et/schonbergi-sari-paradigmad-semlek)
Tavapilet 20.00 eurot
Sooduspilet (ülalpeetavad ja pensionärid) 10.00 eurot
Tudengipääse (üliõpilased) 5.00 eurot

[schoenberg.ee](https://schoenberg.ee/)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1045 AND starts_at = '2026-03-05T19:00');

-- 1046: eccm.ee 83 and 84, 2026-03-07T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1046, '2026-03-07T19:00', NULL, NULL, 'Tallinna Muusika ja Balletiool, suur kammersaal', 'Pärnu mnt 59, Tallinn',
   'https://fienta.com/et/duod-v', 'https://tarmo.uuu.ee/duos/', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_laine2.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 83);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1046, 'et', 'duod-v',
   'DUOD V', 83,
'"DUOD" on Tarmo Johannese kureeritud sari muusikast flöödile ja veel ühele esitajale. Tarmo Johannese partneriteks on kokku viis suurepärast interpreeti, sarja viimasel kontserdil - Gunnhildur Einarsdóttir (harf, Island) .

Kavas:
**Salvatore Sciarrino** - "Fauno che fischia a un merlo" (1980) flöödile ja harfile
**Luciano Berio** - Sequenza II (1963) harfile
**Guðmundur Steinn Gunnarson** - "Á gönguferð í grasagarðinum" (2026) flöödile ja harfile (**esiettekanne**)
**Ivan Fedele** - "Imaginery Skylines" (1998) flöödile ja harfile
**Toivo Tulev** - "Dawn, almost Dawn" (2021) mansur ney''le, versioon bassflöödile (versiooni esiettekanne)
**Toru Takemitsu** - "Toward the Sea III" (1989) altflöödile ja harfile'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1046 AND starts_at = '2026-03-07T19:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1046, 'en', 'duos-v',
   'DUOS V', 84,
'The series "DUOS" is curated by Tarmo Johannes and features music for flute and one other performer. This time his partner is a renowned harpist Gunnhildur Einarsdóttir.

Program:

**Salvatore Sciarrino** - "Fauno che fischia a un merlo" (1980) for flute and harp
**Luciano Berio** - _Sequenza II_ (1963) for harp

**Guðmundur Steinn Gunnarson** - "Á gönguferð í grasagarðinum" (eng. _On a Walk in a Botanic Garden_, 2026, **première**) for flute and harp (**esiettekanne**)

**Ivan Fedele** - "Imaginery Skylines" (1998) for flute and harp
**Toivo Tulev** - "Dawn, almost Dawn" (2021) for _mansur ney_, version for bass flute (**permière of the version**)
**Toru Takemitsu** - "Toward the Sea III" (1989) for alto flute and harp'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1046 AND starts_at = '2026-03-07T19:00');

-- 1047: eccm.ee 51 and 56, 2026-03-10T18:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1047, '2026-03-10T18:00', NULL, NULL, 'Mustpeade maja Olavi saal', 'Pikk 26, Tallinn',
   '', 'https://uuu.ee/', 'u', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_residentuur-26.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 51);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1047, 'et', 'residentuu-r-2-2026-03-10',
   'Residentuu:r 2', 51,
'**U:** jätkab **Reisdentuu:ride** sarjaga. 2026. a on Residentuu:ri teemaks "**Ülekanne. Kommunikatsioon. Meedia** ". Eesmärgiks on püüda laiemas mõttes vaadelda sõnumite-mõtete-ideede edasiandmist, tõlkimist ühest meediast teise, suhtlust ja kommunikatsiooni - printsiipe, mis on kogu kunstiloome aluseks. Ühtlasi esitab U: teemadega seotud valitud teoseid.

Teises kohtumises on külaliseks itaalia helilooja [**Valerio Sannicandro,**](http://www.valeriosannicandro.eu/)kes on peategleaseks ka kahe päeva pärast toimuval Kahe Saali Kontserdil

Sissepääs tasuta.

Piletid: TASUTA'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1047 AND starts_at = '2026-03-10T18:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1047, 'en', 'residentuu-r-2-2026-03-10',
   'Residentuu:r 2', 56,
'U: continues its **Residency** series. In 2026, the theme for the Residency is **''Transfer. Communication. Media''**. The goal is to examine the transmission of messages, thoughts, and ideas in a broader sense-the translation from one medium to another, interaction, and communication-principles that form the very foundation of all artistic creation. Additionally, U: will perform selected works related to these themes.

The guest for the second session is composer **Valerio Sannicandro**, who is also the central figure of the Two-Hall Concert two days later.

Topic: Memory as a medium, space as a mean

**Free admission.**'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1047 AND starts_at = '2026-03-10T18:00');

-- 1048: eccm.ee 58 and 55, 2026-03-12T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1048, '2026-03-12T19:00', NULL, NULL, 'Mustpeade maja Valge ja Olavi saal', '',
   'https://fienta.com/et/ansambel-u-kahe-saali-kontsert', 'https://uuu.ee/', 'u', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_mustpead.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 58);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1048, 'et', 'kahe-saali-kontsert',
   'Kahe saali kontsert', 58,
'Tegemist on ambitsioonika projektiga, mis uurib, kuidas olla kahel kontserdil korraga. Kahe-saali-kontsert toimub kahes saalis samal ajal ning esitatakse kaks korda. Osades teostes kantakse osa helist ka teise saali üle.

Publik jaguneb kahe saali vahel, seejärel vahetavad kuulajad saali ning kuulavad ära kava teise, varem vihjatud poole - mälu, ettekujutuse ja akustiliste vihjete mäng.

Kontserdi keskmes on **Valerio Sannicandro** kahe-saali-kontseptsiooni järgi loodud teos "Iter-Reti", mille uus versioon Osmose süntesaatoriga kõlab kontserdil esmaettekandes.

Kavas:

OLAVI SAALIS
**Valerio Sannicandro** “Iter” Klaverile ja Osmose süntesaatorile (versiooni esiettekanne)
**Xu Dong** "Synchronizität (1)" löökpillidele ja klaverile kahes saalis
**Helena Tulve** “Valvaja” (2002/2023 versioon süntesaatorile)

VALGES SAALIS

**Valerio Sannicandro** “Reti” flöödile, klarnetile, viiulile, tšellole ja löökpillidele **Xu Dong** "Synchronizität (1)" löökpillidele ja klaverile

**Fausto Romitelli** “Domeniche alla periferia dell’impero” flöödile, klarnetile, viiulile ja tšellole'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1048 AND starts_at = '2026-03-12T19:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1048, 'en', 'two-hall-concert',
   'Two-Hall Concert', 55,
'This is an ambitious project exploring how to be at two concerts at once. The **Double-Hall Concert** takes place in two halls simultaneously and is performed twice. In certain works, part of the sound is transmitted to the other hall.

The audience is divided between the two halls; after the first part, listeners switch rooms to experience the second, previously hinted-at half of the program-a play on memory, imagination, and acoustic cues.

At the heart of the concert is **Valerio Sannicandro’s** work **"Iter-Reti"**, created according to the double-hall concept. A new version featuring the **Osmose synthesizer** will receive its world premiere.

**Program:**
**IN THE OLAVI HALL**

- **Valerio Sannicandro:** _Iter_, for piano and Osmose synthesizer (Premiere of this version)
- **Xu Dong:** _Synchronizität (1)_, for percussion and piano in two halls
- **Helena Tulve:** _Valvaja_ (The Guard), (2002/2023 version for synthesizer)

**IN THE WHITE HALL**

- **Valerio Sannicandro:** _Reti_, for flute, clarinet, violin, cello, and percussion
- **Xu Dong:** _Synchronizität (1)_, for percussion and piano
- **Fausto Romitelli:** _Domeniche alla periferia dell’impero_, for flute, clarinet, violin, and cello'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1048 AND starts_at = '2026-03-12T19:00');

-- 1049: eccm.ee 85, 2026-03-14T19:30
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1049, '2026-03-14T19:30', NULL, NULL, 'Kanuti Gildi SAAL', 'Pikk 20, Tallinn',
   'https://sviby.com/et/e/s4spj6', 'https://saal.ee/', 'tuma', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_700x1400px-scrapyard-vaike.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 85);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1049, 'et', 'scrapyard-2026-03-14',
   'SCRAPYARD', 85,
'2020. aastal pani Tallinna Uue Muusika Ansambel aluse erilisele kontserdisarjale nimega "Scrapyard", mis on pühendatud Lo-Fi muusikale.

Sellel põneval ja erilisel Scrapyardi seeria multimeediakontserdil tulevad ettekandele nüüdismuusikat ja erinevaid meediumeid ühendavad teosed, milles on oluline osa liigutusel ja liikumisel. See ei piirdu ainult kontseptuaalse manifestatsiooniga, vaid liikumine avaldub konkreetselt ka sellest tulenevalt muutuvas kõlamaailmas.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1049 AND starts_at = '2026-03-14T19:30');

-- 1050: eccm.ee 81, 2026-03-22T00:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1050, '2026-03-22T00:00', '2026-03-24T14:00', NULL, 'Erika Synth, Riga', 'Tīklu iela 3, Riga',
   '', '', 'ulysses', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_serge.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 81);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1050, 'en', 'ulysses-journeys',
   'ULYSSES JOURNEYS', 81,
'ULYSSES JOURNEYS FOR LIVE ELECTRONICS COMPOSING VOL 1. by Studio Tallinn 1965, Erica Synth and ensemble EMA

Live electronics has become an essential tool for music making for (not only) the younger generation of musicians worldwide. It has contributed to democratization of music making, allowing people with no classic education of interpreters or composing to stages in various genres. !It has also contributed a lot to the group of "hybrid" performer/composer to emerge both on the underground experimental and also "classical" contemporary music scene. Yet in the contemporary music scene composing for performers with live electronics especially for live electronic ensembles is still not very widely spread among classically educated composers. It is mainly due to a certain conservative mindset in some conservatories but mainly also because of a lack of qualified teachers in the field yet of good knowledge-base and experience in both working with live electronic compositions and performance practice. The workshop led by EMA in partnership with Erica Synths is designed for composers who want to dive into composing for live electronics ensemble, encouraging composers with no previous experience on the field as well as the ones with some experience to join.

“Tallinn 1965” is an open experimental, multifunctional analog music studio. Alongside modern phonics, analog devices from decades ago are also put to work for recording sounds (professional old-time studio tape recorders) as well as creating music (classical oscillators, filters, echo machines). We approach music through the concrete artifacts and technological layers that range from hardware to software processes that have been part of the circulation of time and memory that condition the knowledge, but also the perceptions, and the sensations.

Acclaimed ensemble EMA (Estonian Electronic Music Society''s Ensemble) was founded in 2017 and currently consists of 5 musicians with different classical education backgrounds (composition, different interpretation studies) as well as with backgrounds from various experimental music scenes. Ensemble has been active performing and composing live electronic works and has lead several workshops addressing related problems including: notation for electronic music, technical setups, sound synthesis, etc. [www.emamusic.ee](https://www.emamusic.ee/)

**Topics of the workshop**

-Live electronic instrument. What is it? How to define it, how to classify?

-Sound design as one of the key issues of working with electronics. Challenges of how to find a common ground between composer and performer in composing for "unknown" nonstandardized instrumentarium

- Different notation options for compositions with live electronic performance

-Technical obstacles working with electronic setups. Mapping possibilities, challenges

- Syncing performers in real time. Options of different metronomes, Vclick app

**Schedule**
**March 22**
**Session 1. 16.00 - 19.00**

Introduction, -Live electronic instrument. What is it? How to define it, how to classify Particularities of different performance devices?

Sound design as one of the key issues of working with electronics. Challenges of how to find a common ground between composer and performer in composing for "unknown" nonstandardized instrumentarium.

**Session 2. 10.00 - 13.00**

Continuation of previous session topics, Different notation options for compositions with live electronic performance.

**Session 3. 15.00 - 18.00**

Technical obstacles working with electronic setups. Mapping possibilities, challenges. Syncing performers in real time. Options of different metronomes, Vclick app

**March 24**
**Session 4. 10.00 - 13.00**
Analyzing scores, conclusions, brainstorming roundtable
**ULYSSES JOURNEYS FOR LIVE ELECTRONICS COMPOSING VOL 2.**
Workshop will take place from May 8-10 2026 in ECCM Tallinn at Studio Tallinn 1965.

This workshop is a hands-on laboratory with EMA (Estonian Electronic Music Society Ensemble) for development of material brought by participants. 6 participants are chosen with an open call. The participants present their preliminary ideas, sketches, conceptions to address questions of conception, sound design and instrumentation.

_**This event is part of the Ulysses Platform, co-funded by the European Union.**_'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1050 AND starts_at = '2026-03-22T00:00');

-- 1051: eccm.ee 87, 2026-03-27T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1051, '2026-03-27T19:00', '2026-03-27T20:00', NULL, 'ECCM', 'Pikk 26, Tallinn',
   'https://fienta.com/et/phil-minton-kriton-beyer-improtestil', 'https://www.improtest.ee/', 'improtest', NULL, 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 87);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1051, 'en', 'phil-minton-kriton-beyer-improtestil',
   'Phil Minton / Kriton Beyer Improtestil', 87,
'The MINTON-BEYER DUO seems like a study of the phenomenon of the voice with two different instruments: the human voice and the daxophone.

Phil Minton, perhaps the best-known vocal artist in free improvisation, is known for his remarkable extended vocal techniques that span the entire spectrum of human expression: from simple breathing, to murmurs, grumbling and whispering, to whistling, burping and rattling, screaming and moaning, from shrill highs to rumbling lows, all part of his vocabulary. And all his vocal abilities are always paired with an extraordinary, unique presence and an absolutely unfiltered expression.

Kriton Beyer in turn, uses his still quite obscure instrument, the daxophone, in an extremely voice-like way, often imitating human and animal sounds and speech patterns that seem to have been built into the nature and character of the instrument. Compared to other instruments, it seems to be very easy to imitate animal sounds and voices, from bird song to grunting, roaring, cawing, croaking, chattering, cooing and chirping of various animal species on the daxophone. All of this has been well researched and practically tested by Kriton Beyer in cross-species communication with his daxophone as an instrument and is also audibly processed in the musical dialogue in the work in this duo.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1051 AND starts_at = '2026-03-27T19:00');

-- 1052: eccm.ee 69, 2026-04-09T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1052, '2026-04-09T19:00', '2026-04-09T22:00', NULL, 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn',
   'https://fienta.com/et/schonbergi-sari-laivelektroonika-260409', 'https://schoenberg.ee/', 'schoenberg', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_649918062-1513415897458948-1454279337550947045-n.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 69);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1052, 'et', 'schonbergi-sari-laivelektroonika-hans-gunter-lock-andrus',
   'Schönbergi sari. LAIVELEKTROONIKA. Hans-Gunter Lock, Andrus Kallastu', 69,
'Schönbergi sari
N 9.4.2026 kell 19.00
Eesti Nüüdismuusika Keskus ([Pühavaimu 9, Tallinn, Estonia](https://www.bing.com/maps/default.aspx?v=2&pc=FACEBK&mid=8100&where1=P%C3%BChavaimu+9%2C+Tallinn%2C+Estonia&FORM=FBKPL1&mkt=en-GB))

LAIVELEKTROONIKA

Hans-Gunter Lock (viiul, löökpillid, elektroonika)
Andrus Kallastu (klaver, löökpillid, elektroonika)

LAIVELEKTROONIKA kujutab enesest akustiliste instrumentide ja elektroonika vahetut dialoogi. Heliloojad Hans-Gunter Lock ja Andrus Kallastu loovad reaalajas helimaastiku, milles struktuur põimub improvisatsiooniga. Kontsert keskendub helide sünnile hetkes, transformatsioonile ja ruumilisusele, moodustades elava, kordumatu ja riskantse kuulamiskogemuse.

Hans-Gunter Lock (1974) on sündinud Saksamaal, Saale äärses Halles. Eestis elab ja tegutseb ta alates 2000. aastast. Hans-Gunter Locki looming hõlmab valdavalt elektroonilist ja elektroakustilist muusikat, kammerteoseid ning filmimuusikat. Oma loomingus on ta korduvalt pöördunud kunstide sünteesi poole uurides valguse, video, teksti, liikumise ja heli ühendamise võimalusi ning interaktiivsete vahendite kasutamist. Hans-Gunter Locki loomingus on kindel koht ka eksperimentaalsetel püüdlustel ning ta on teinud mitmekülgset koostööd erinevate performansi- ja multimeediumikunstnikega.

Andrus Kallastu (1967) on õppinud Tallinna Konservatooriumis ja Sibeliuse Akadeemias ning tegutseb vabakutselise helilooja ja dirigendina. Kallastu loomingu võib jagada kahte perioodi, enne ja pärast aastat 1991. Esimese perioodi loomingut iseloomustab vaba atonaalne helikeel, motoorne, tihti ostinaatne rütmika, neoklassitsistlik kõlakäsitlus, teise perioodi teoseid seriaalne tekstuur, väljatehnika, mittepulseeriv rütmika, muusikalise heli ning müra piire kompav kõla. Mitmed Kallastu teosed kõnelevad huvist muusika ja erinevate kunstiliikide ühendamise ning performansi vastu.

Koostööpartnerid
Eesti Arnold Schönbergi Ühing
Eesti Muusika- ja Teatriakadeemia
Tallinna Ülikooli Balti filmi, meedia ja kunstide instituut
Pärnu Ooper
Autorfest
Eesti Nüüdismuusika Keskus
Muusikalinn Tallinn
Kultuurkapital
Pärnu linn

Piletid [fienta.com/et/schonbergi-sari-laivelektroonika-260409](https://fienta.com/et/schonbergi-sari-laivelektroonika-260409)
Tavapilet 20.00 eurot
Sooduspilet (ülalpeetavad ja pensionärid) 10.00 eurot
Tudengipääse (üliõpilased) 5.00 eurot

[schoenberg.ee](https://schoenberg.ee/)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1052 AND starts_at = '2026-04-09T19:00');

-- 1053: eccm.ee 92 and 93, 2026-04-11T17:30
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1053, '2026-04-11T17:30', NULL, NULL, 'Estonia kontserdisaali kohvik', 'Estonia pst 4, Tallinn',
   'https://piletikeskus.ee/et/e/frnh4j', 'https://www.eestimuusikapaevad.ee/', 'eccm', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_11-04-vestlus-ruut.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 92);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1053, 'et', 'vestlusring-mille-pinnalt-tarkab-uus-muusikateater',
   'Vestlusring: mille pinnalt tärkab uus muusikateater?', 92,
'muusikateatri järelkasv nii tegijate kui ka publiku kontekstis. Küsime, kes on need, kes täna muusikateatrit loovad ning milliste institutsioonide raames seda üldsegi teha saab? Millised on muusikateatri väljakutsed tänasel kultuurimaastikul ning milline on muusikateatri publik?

**Osalevad: Alisson Kruusmaa, Giacomo Veronesi, Gregor Kulla, Tuuli Lindeberg, Liisa Hõbepappel ja Kris Kuldkepp**

Vestlust juhib Aurora Ruus ja toimub inglise keeles.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1053 AND starts_at = '2026-04-11T17:30');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1053, 'en', 'panel-discussion-what-is-the-breeding-ground-for-new-music',
   'Panel Discussion: What is the Breeding Ground for New Music Theatre?', 93,
'The discussion focuses on the next generation of (contemporary) music theatre, both in terms of creators and audiences. Who are the people creating music theatre today, and within which institutions can it be brought to life? What are the current challenges for music theatre in today’s cultural landscape, and who is its audience?

Panelists: **Alisson Kruusmaa, Giacomo Veronesi, Gregor Kulla, Tuuli Lindeberg, Liisa Hõbepappel, Kris Kuldkepp**

The discussion is moderated by Aurora Ruus.

The event will be held in English.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1053 AND starts_at = '2026-04-11T17:30');

-- 1054: eccm.ee 88 and 89, 2026-04-12T15:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1054, '2026-04-12T15:00', NULL, NULL, 'Great Amber Hall, Liepaja', '',
   'https://www.bilesuparadize.lv/lv/event/165263', 'https://lielaisdzintars.lv/en/kalendars/pasakums/pagriezot-laiku-ensemble-for-new-music-tallinn', 'tuma', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_sohvi-viik-15-vaike-4.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 88);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1054, 'et', 'balti-muusika-paevad',
   'Balti Muusika Päevad', 88,
'Balti Muusika Päevad toimuvad 2026. aastal Liepajas ja Riias ning festivali temaatikaks on "Me elame eri aegadel" - mitte ainult tähelepanekuna, vaid ka üleskutsena tegutsemisele: eri ajad algavad hetkel, mil me muudame oma tempot ja väärtusi.

Eestit esindab festivalil Tallinna Uue Muusika Ansambel, kes oma kavaga „Pööramise aeg“ loob olukorra, kus iga kuulaja on kutsutud küsima: mida ma täna edasi valin, ja mida ma teadlikult teises suunas pööran?

Kavas:
**Age Veeroos** "Outlines of the Night" (2023)
**Anna Veismane** "The Poem. Milk" (2026, esiettekanne)
**Kristupas Bubnelis** "...please leave your message after the tone..." (2020)
**Evija Skuke** "laiks ir vilnis" (2026, esiettekanne)
**Jan Martin Smørdal** "All Play" (2014/rev 2016)

**Tallinna Uue Muusika Ansambel:**
Maria Lume (flöödid)
Soo-Young Lee (klarnetid)
Toomas Hendrik Ellervee (viiul)
Talvi Nurgamaa (vioola, viola d''amore)
Paul-Gunnar Loorand (tšello)
Madis Jürgens (kontrabass)
Arash Yazdani (dirigent)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1054 AND starts_at = '2026-04-12T15:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1054, 'en', 'baltic-music-days',
   'Baltic Music Days', 89,
'The Baltic Music Days will take place in Liepaja and Riga in 2026, and the theme of the festival is "We live in different times" - not only as an observation, but also as a call to action: different times begin the moment we change our pace and values.

Ensemble for New Music Tallinn is representing Estonia with its program "Turning the time". A program which creates a situation where each listener is invited to ask: what do I choose to do today - and what do I consciously turn in a different direction?

Program:

**Age Veeroos** "Outlines of the Night" (2023) - flutes, clarinet, violin, viola, double bass

**Anna Veismane** "The Poem. Milk" (2026, premiere) - alto flute, clarinet, viola d''amore, cello, double bass

**Kristupas Bubnelis** "...please leave your message after the tone..." (2020) - violin, cello and electronics

**Evija Skuke** "laiks ir vilnis" (2026, premiere) - flute, bass clarinet, violin, viola, cello, double bass

**Jan Martin Smørdal** "All Play" (2014/edited 2016) - flutes, clarinets, piano, violin, cello + video, stereotrack

**Ensemble for New Music Tallinn:**
Maria Lume (flutes)
Soo-Young Lee (clarinets)
Toomas Hendrik Ellervee (violin)
Talvi Nurgamaa (viola, viola d''amore)
Paul-Gunnar Loorand (cello)
Madis Jürgens (double bass)
Arash Yazdani (conductor)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1054 AND starts_at = '2026-04-12T15:00');

-- 1055: eccm.ee 90 and 91, 2026-04-12T18:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1055, '2026-04-12T18:00', NULL, NULL, 'Mustpeade maja Olavi saal', 'Pikk, Tallinn',
   'https://piletikeskus.ee/et/e/2pthk1', 'https://eccm.ee/', 'eccm', NULL, 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 90);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1055, 'et', 'ulgu-eesti-muusika-kontsert',
   'Ulgu-Eesti muusika kontsert', 90,
'Aegade jooksul on Eestist lahkunud palju inimesi, ka heliloojaid-muusikuid. Raudse eesriide aastail olid sidemed välismaailmaga haprad, väljaspool Eestit loodud Eesti päritolu autorite muusika siia ei jõudnud ja on siin suures osas tundmatu tänini. Valgeid laike aitab vähendatud tänane kontsert, kus Ulgu-Eesti muusikat erinevatest kümnenditest esitavad Eesti Nüüdismuusika Keskuse kollektiivid.

**Udo Kasemets** (1919 kuni 2014), “Lunharmonics. II kuu” kuuele siinusostsillaatorile (1990)

**Omar Mark Daniel** (s 1960), Trio nr 1 viiulile, klaverile ja tšellole: I osa (1999)

**Ilmar Laaban** (1921 kuni 2000), “Der Rhododendrongeist” kolmele häälele (“Rododendronivaim”, 1982)

**Jüri Reinvere** (s 1971), “Ricordanza” flöödile (“Mälestus”, 2012)
**Kristi Allik** (s 1952), “Machine Symphony” (“Masinasümfoonia”, katkend, 2000)
**Kris Kuldkepp** (s 1993), Improvisatsioon
**Elma Miller** (s 1954), “udok asem ets” koorile (1988)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1055 AND starts_at = '2026-04-12T18:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1055, 'en', 'estonian-music-abroad',
   'Estonian Music Abroad', 91,
'Over time, many people have left Estonia, including composers and musicians. During the years of the Iron Curtain, connections with the outside world were fragile; music created by authors of Estonian descent living abroad did not reach Estonia and remains largely unknown here to this day. Today’s concert helps to fill these gaps, as ensembles from the Estonian Centre of Contemporary Music perform music by the Estonian diaspora spanning several decades.

Programme:
**Udo Kasemets** (1919 to 2014), _Lunharmonics. II. Moon_ for six sine wave oscillators(1990)
**Omar Mark Daniel** (b. 1960), _Trio No. 1_ for violin, piano, cello: I mvt (1999)
**Ilmar Laaban** (1921 to 2000), _Der Rhododendrongeist_ for three voices (1982)
**Jüri Reinvere** (b. 1971), _Ricordanza_ for flute (2012)
**Kristi Allik** (b. 1952), _Machine Symphony_ (excerpt, 2000)
**Kris Kuldkepp** (b. 1993), _Improvisation_
**Elma Miller** (b. 1954), _udok asem ets_ for choir (1988)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1055 AND starts_at = '2026-04-12T18:00');

-- 1056: eccm.ee 95 and 94, 2026-04-12T20:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1056, '2026-04-12T20:00', NULL, NULL, 'ECCM', 'Pühavaimu 9, Tallinn',
   'https://piletikeskus.ee/et/e/ffc5fr', 'https://www.eestimuusikapaevad.ee/', 'eccm', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_12-04-vestlus-ruut.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 95);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1056, 'et', 'vestlusring-vabadus-piirid-ja-helid-eesti-nuudismuusika',
   'Vestlusring: vabadus, piirid ja helid: Eesti nüüdismuusika teekonnad maailmas', 95,
'Pärast Teist maailmasõda jagunes Euroopa muusikaline maailm kaheks. Ühel pool Nõukogude Liit, ideoloogia, tsensuur ja piirid. Teisel pool vaba Lääs, festivalid, stuudiod, eksperimendid ja rahvusvahelised võrgustikud.

Arutelu keskmes on aga tänapäev: kas Eesti noortel muusikutel on siin piisav institutsionaalne tugi, et oma loominguga järjepidevalt tegeleda, kunstiliselt areneda ja rahvusvahelisel areenil nähtavaks saada? Või viib nüüdismuusika loomulik ökosüsteem andekad noored paratamatult taas suurematesse kultuurikeskustesse?

Vestlusringis osalevad: **Anu Kivilo, Gregor Kulla, Kris Kuldkepp, Taavi Kerikmäe, Elo Masing, Olev Muska, Jüri Reinvere.**
Vestlus toimub inglise keeles.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1056 AND starts_at = '2026-04-12T20:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1056, 'en', 'panel-discussion-freedom-boundaries-and-sounds-the-paths-of',
   'Panel Discussion: Freedom, Boundaries, and Sounds: The Paths of Estonian Contemporary Music in the World', 94,
'After World War II, the European musical landscape was split in two. On one side, the Soviet Union, defined by ideology, censorship, and borders. On the other, the free West, a world of festivals, studios, experimentation, and international networks.

Today’s discussion, however, focuses on the present: do young Estonian musicians have sufficient institutional support to consistently pursue their craft, develop artistically, and gain visibility on the international stage? Or does the natural ecosystem of contemporary music inevitably draw talented youth back toward larger cultural hubs?

Panelists: **Anu Kivilo, Gregor Kulla, Kris Kuldkepp, Taavi Kerikmäe, Elo Masing, Olev Muska, Jüri Reinvere.**

The discussion will be held in English.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1056 AND starts_at = '2026-04-12T20:00');

-- 1057: eccm.ee 59 and 61, 2026-04-14T15:30
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1057, '2026-04-14T15:30', NULL, NULL, 'ECCM saal', 'Pikk 26, Tallinn',
   '', 'https://uuu.ee/', 'u', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_residentuur-26.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 59);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1057, 'et', 'residentuu-r-3-2026-04-14',
   'Residentuu:r 3', 59,
'**U:** jätkab **Reisdentuu:ride** sarjaga. 2026. a on Residentuu:ri teemaks "**Ülekanne. Kommunikatsioon. Meedia** ". Eesmärgiks on püüda laiemas mõttes vaadelda sõnumite-mõtete-ideede edasiandmist, tõlkimist ühest meediast teise, suhtlust ja kommunikatsiooni - printsiipe, mis on kogu kunstiloome aluseks. Ühtlasi esitab U: teemadega seotud valitud teoseid.

Kolmandas kohtumises on külaliseks režissöör, animatsioonikunstnik ja õppejõud **Ülo Pikkov**.

Sissepääs tasuta.

Piletid: TASUTA'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1057 AND starts_at = '2026-04-14T15:30');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1057, 'en', 'residentuu-r-3-2026-04-14',
   'Residentuu:r 3', 61,
'U: continues its **Residency** series. In 2026, the theme for the Residency is **''Transfer. Communication. Media''**. The goal is to examine the transmission of messages, thoughts, and ideas in a broader sense-the translation from one medium to another, interaction, and communication-principles that form the very foundation of all artistic creation. Additionally, U: will perform selected works related to these themes.

The guest for the third session is director and animation artist **Ülo Pikkov**.

**Free admission.**'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1057 AND starts_at = '2026-04-14T15:30');

-- 1058: eccm.ee 96, 2026-05-08T12:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1058, '2026-05-08T12:00', '2026-05-10T20:00', NULL, 'ECCM', 'Pühavaimu 9, Tallinn',
   '', 'http://eccm.ee/', 'ulysses', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_ulysse-logo-green.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 96);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1058, 'en', 'ulysses-journeys-for-live-electronics-composing-vol-2',
   'ULYSSES JOURNEYS FOR LIVE ELECTRONICS COMPOSING VOL 2.', 96,
'In Tallinn, Studio Tallinn 1965, by ensemble EMA [www.emamusic.ee](https://www.emamusic.ee/)
The call is open to April 25th 2026
Please upload Your proposal [here](https://drive.google.com/drive/u/1/folders/1FyEiLOA9JmMXWJ9WPcaJdKS9jhOIlRIG)

The participants are selected upon a description of their composition in progress they want to address during the practical workshop. The number of participants is limited to 6.

The description can be in the form of conception in text, excerpts of the work in progress composition etc

During the practical workshop ensemble EMA will give feedback to the piece in works from performers perspective. We will also help to develop its sound design, help to plan technical solutions, give feedback and advice in notation. A simple practical reading session by the ensemble of the works in progress is also planned. The practical working sessions with composers are open to observe by other participants of the workshop.

Drawing on material created during a one-week residency at the ECCM, the workshop will present work-in-progress excerpts that offer insight into the evolution of musical ideas. Through live demonstration and discussion, participants will engage directly with the creative process through dialogue and exchange of perspectives on composition and artistic development.

_**This event is part of the Ulysses Platform, co-funded by the European Union.**_'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1058 AND starts_at = '2026-05-08T12:00');

-- 1059: eccm.ee 102, 2026-05-09T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1059, '2026-05-09T19:00', NULL, NULL, 'ECCM saal', '',
   'https://fienta.com/et/baumann-pietila-soo-improtestil', 'https://improtest.ee/', 'improtest', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_improtest-090526.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 102);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1059, 'en', 'improtest-baumann-pietila-soo',
   'Improtest: Baumann / Pietilä / Soo', 102,
'**Franziska Baumann** is a multi-award-winning Swiss singer, improviser- composer and sound artist. As a vocal artist and performer, she draws from archaic, stylistically wide-ranging and experimental expressions of the human voice. As a pioneer of gestural live electronics, she creates original, moving, unique concert experiences beyond stylistic concepts.

Baumann has toured extensively in Europe, USA, Canada, South Africa, Australia, New Zealand, Egypt, Belarus, and South

Korea. She has collaborated with musicians such as Fred Frith, Jacques Demierre, Matthias Ziegler, Michel Wintsch, Lauren Newton, Hans Koch, Lucas Niggli, Julian Sartorius and many others.

[www.franziskabaumann.ch](http://www.franziskabaumann.ch/)

**MART SOO**

is an Estonian guitarist who has been active for over four decades. He has released more than 50 albums as leader and sideman and has performed in numerous concerts and festivals around the world. He is known for his unique and innovative playing style, which blends elements of jazz, rock, and electronic music.

[martsoo.ee](https://martsoo.ee/)

**ESA PIETILÄ**

is an internationally acclaimed saxophonist and composer. Though renowned for his extensive work in both contemporary classical and jazz, he transcends genre, creating music without limits. In any setting, he shows a keen interest in

combining composition and improvisation, and in mixing styles and instrumentation in surprising and original ways. He has also performed as soloist with a range of top orchestras and has collaborated with leading conductors and composers

including Esa-Pekka Salonen (conductor) and Magnus Lindberg (composer).

[www.esapietila.com](http://www.esapietila.com/)

Toetaja: Eesti Kultuurkapital
Partnerid: ECCM, Muusikalinn Tallinn

piletid: 15/10€

Improtest on rahvusvaheline vabaimprovisatsioonilise muusika kontsertsari, mis toimub aastast 2005. Sarja kuraatorid on Mart Soo ja Taavi Kerikmäe. Koostööpartnerid: ECCM, Eesti Kultuurkapital, Muusikalinn Tallinn, Tallinna Filharmoonia

[www.improtest.ee](http://www.improtest.ee/)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1059 AND starts_at = '2026-05-09T19:00');

-- 1060: eccm.ee 99 and 100, 2026-05-12T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1060, '2026-05-12T19:00', NULL, NULL, 'ECCM saal', '',
   'https://fienta.com/et/ansambel-u-kontsert', 'https://uuu.ee/j/kontserdid2', 'u', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_29122019-fb-19201000px-2.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 99);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1060, 'et', 'puutetundlikkus-puute-tundlikkus',
   'Puutetundlikkus / puute tundlikkus', 99,
'Kontsert pakub kuulamiseks valiku Euroopas tuntud, kuid Eestis vähe esitatud noorema põlvkonna heliloojate muusikat.
Kõik teosed kavas uurivad erineval moel muusika ja meelte suhteid.

Brigitta Muntendorf. Foto: Martin Rottenkolber

Kavas:

**Johannes Maria Staud** (1974) - “Lagrein” (2008) klarnetile, viiulile, tšellole ja klaverile
**Brigitta Muntendorf** (1982) - “Shivers on Speed” (2013) flöödile, klarnetile, klaverile, viiulile ja tšellole
**Justina Repečkaitė** (1989) - "Transduced" (2020) löökpillidele ja live-elektroonikale
**Kitty Xiao** (1989) - "In flesh" (2021) tšellole ja elektroonikale

Piletid (10/15/25 eurot) Fientas ja kohapeal'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1060 AND starts_at = '2026-05-12T19:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1060, 'en', 'touch-sensitivity-sensitivity-of-touch',
   'Touch Sensitivity / Sensitivity of Touch', 100,
'The concert features a selection of music by renowned European composers of the younger generation whose work is seldom performed in Estonia. Each piece in the program explores the intricate relationship between music and the senses in its own unique way.

Brigitta Muntendorf. Photo: Martin Rottenkolber

Program:

**Johannes Maria Staud** (1974) - “Lagrein” (2008) for clarinet, violin, cello ja piano
**Brigitta Muntendorf** (1982) - “Shivers on Speed” (2013) for flute, clarinet, violin, cello ja piano
**Justina Repečkaitė** (1989) - "Transduced" (2020) for percussion and live electronics
**Kitty Xiao** (1989) - "In flesh" (2021) for cello and tape

Tickets (10/15/25 eurot) on [Fienta](https://fienta.com/et/ansambel-u-kontsert) and on spot.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1060 AND starts_at = '2026-05-12T19:00');

