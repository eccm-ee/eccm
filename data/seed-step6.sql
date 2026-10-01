-- seed-step6.sql: twenty more events and the members page, asked 2026-10-01 as
-- "in bg extend to more events, bring one more page in". Read once each off
-- eccm.ee the same day, one request at a time: the three pages of the Estonian
-- upcoming list and the nine of the English one, the last pages of both past
-- lists, every event page below in each language it has, and the menu pages
-- Kontakt, Liikmed and Residentuurid. The HTML stayed in the session's
-- scratchpad. The same shape as seed-step4.sql: shouting titles
-- sentence-cased, credit lines lifted into event_credit, the Koduleht into
-- website_url and repeated as the body's last line, the source's dashes
-- written as commas, colons and "kuni" or "to", Joomla's cloaked addresses and
-- every phone number left out.
--
-- Twenty events, ids 11 to 30 in date order: twelve past (14 May to 21 September
-- 2026) and eight to come (12 November to 29 December 2026). Twelve have an
-- English page of their own on eccm.ee, each a separate iCagenda id, and that
-- id is the en row's legacy_id. Eight are Estonian only: the Schönberg series
-- rows (one iCagenda id serves both languages and carries Estonian text), the
-- Ludensemble concert, the EMA workshop, Post Horn and JOY. Then the English
-- rows of events 4, 5, 6, 8, 9 and 10, whose English pages exist after all
-- (seed-step4.sql followed the language switch, which leads to the English
-- root; the English list names them).
--
-- Decided here rather than read:
--   TUMA, EMA ("EES") and Collaboration have no category key, so they are
--   'koostoo', as seed-step4.sql decided for TUMA.
--   One picture per event: where the English page shows a sibling file
--   (open-space-3 against open-space-4, sohvi-viik-11-vaike against -pisike),
--   the Estonian page's file is the one kept.
--   Addresses are written short, street and town, from the page's Aadress
--   line; ECCM saal is Pühavaimu 9, Tallinn as everywhere else.
--   Residentuu:r 4 is "ECCM saal" in Estonian and "Olavi Hall, House of the
--   Blackheads" in English; the Estonian is kept. Its English text says "third
--   session" of the fourth; written "fourth".
--   The Schönberg series lists eight more dates in 2027 whose pages carry
--   only the words "Schönbergi sari" and no picture; the two in 2026 are here
--   (ids 25 and 28) and the 2027 ones are not. Their slugs carry the date,
--   since one bare "schonbergi-sari" would name one concert of twelve.
--   U: vana-aasta kontsert starts 29.12.2026 23:42 on eccm.ee, kept as typed
--   like the festival's 15:51 in seed-step4.sql.
--   The Ludensemble ticket link loses its fbclid, the EMA Warsaw page's
--   broken last link (its text a URL, its href a composer's name) is dropped
--   for the Koduleht, typos in the English texts are mended (Consrt, cocnert,
--   yoth, he ensembled), and "Kavas" and "esiettkanne" inside an English text
--   are "Program" and "premiere".
--   The file runs twice without harm: an event is made only when no event
--   carries its Estonian legacy_id, a text or credit row only when its event
--   has the id and start written here and the row is not there yet, a media
--   or page row only when its key is new.
--
-- The pictures are the ic_large files the pages name, fetched once each into
-- public/ and measured with sips. Media rows have no fixed id (uploads have
-- taken ids on both databases) and events find theirs by key.
-- Apply after seed-step1.sql to seed-step5-schemes.sql, then
-- seed-step6-schemes.sql.


INSERT OR IGNORE INTO media (key, width, height, alt_et, alt_en) VALUES
  ('ic_large_w900h600q100_558d761d-3ef9-4d73-a3f1-27d3372b760d.png', 900, 600,
   'Versioonid, maal ringidest ja noolest sinises, punases ja kollases',
   'Versions, a painting of circles and an arrow in blue, red and yellow'),
  ('ic_large_w900h600q100_open-space.jpeg', 849, 600,
   'Open Space, muusikud seisavad valgel põrandal',
   'Open Space, musicians standing on a white floor'),
  ('ic_large_w900h600q100_residentuur-26.jpg', 900, 600,
   'Residentuu:r, valge U mustal, all sõnad Ülekanne. Kommunikatsioon. Meedia.',
   'Residentuu:r, a white U on black over the words Transfer. Communication. Media.'),
  ('ic_large_w900h600q100_screenshot-2026-05-27-at-14-23-04.png', 900, 468,
   'Post Horn, kaks muusikut punases valguses',
   'Post Horn, two musicians in red light'),
  ('ic_large_w900h600q100_joy2.jpeg', 851, 315,
   'JOY!, käsitsi kirjutatud partituur roosal',
   'JOY!, a handwritten score on pink'),
  ('ic_large_w900h600q100_schoenberg-kurtag-1422x2284.jpg', 900, 560,
   'V4 String Quartet oma pillidega',
   'The V4 String Quartet with their instruments'),
  ('ic_large_w900h600q100_ludens-grisey-riley-piletikeskus-1500x780px.jpg', 900, 468,
   'Ludensemble kontserdi plakat, 13. september',
   'Ludensemble’s concert poster, 13 September'),
  ('ic_large_w900h600q100_serge.jpg', 723, 600,
   'Analoogsüntesaatori juhtmed ja nupud',
   'The patch cables and knobs of an analogue synthesizer'),
  ('ic_large_w900h600q100_54943047942-c00f72f881-v.jpg', 800, 487,
   'EMA muusikud süntesaatorite taga',
   'EMA’s musicians at their synthesizers'),
  ('ic_large_w900h600q100_sohvi-viik-15-vaike-4.jpg', 900, 600,
   'Tallinna Uue Muusika Ansambli muusikud noolega särkides',
   'The musicians of Ensemble for New Music Tallinn in shirts with an arrow'),
  ('ic_large_w900h600q100_sound-plasma-berlin-cover-vaike.png', 800, 600,
   'Sound Plasma kiri kirjul taustal',
   'The words Sound Plasma on a bright pattern'),
  ('ic_large_w900h600q100_1-ansambel-u-fb-pais-2110-1640x924px.jpg', 900, 507,
   'Ansambel U: märk, valge U hallikasrohelisel',
   'Ansambel U:’s mark, a white U on grey green'),
  ('ic_large_w900h600q100_sohvi-viik-11-pisike.jpg', 899, 600,
   'Tallinna Uue Muusika Ansambli muusikud noolega särkides puitseina ees',
   'The musicians of Ensemble for New Music Tallinn in shirts with an arrow before a wooden wall'),
  ('ic_large_w900h600q100_enmt-pic-suur-3.jpg', 899, 600,
   'Muusikud sinises valguses',
   'Musicians in blue light'),
  ('ic_large_w900h600q100_open-space-4.jpeg', 849, 600,
   'Open Space, muusikud seisavad valgel põrandal',
   'Open Space, musicians standing on a white floor'),
  ('ic_large_w900h600q100_u-punane.jpg', 600, 396,
   'Ansambel U: muusikud punasel taustal',
   'The musicians of Ansambel U: against red');

-- 11: eccm.ee 70, 2026-05-14T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 11, '2026-05-14T19:00', '2026-05-14T22:00', NULL, 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn',
   'https://fienta.com/et/schoenbergi-sari-versioonid', 'https://schoenberg.ee/', 'schoenberg', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_558d761d-3ef9-4d73-a3f1-27d3372b760d.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 70);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 11, 'et', 'schonbergi-sari-versioonid',
   'Schönbergi sari. Versioonid', 70,
'Muusikaajalugu võiks vaadelda ka muusikalise materjali versioonide ajaloona. Kuigi muusikateos sünnib hetkes, ei püsi see kunagi muutumatuna, vaid jätkab oma elu tänu uute põlvkondade muutuvale arusaamisele muusika olemusest ja esituskonteksti uuenemisele. Repoo Ensemble ühendab kontserdiprojektis Versioonid Andrus Kallastu varaste jõuliste neoklassitsistlike teoste uustõlgendused Tatjana Kozlova-Johannese intiimselt filigraanse ja poeetilise helikeelega.

Kavas:
**Andrus Kallastu** (1967) _Nahakaupleja Pontus_, ballaad häälele ja klaverile (1989), versioon häälele ja kammeransamblile (2026)
**Tatjana Kozlova-Johannes** (1977) _Kirjad_ sopranile ja vioolale (2014), versioon sopranile ja tšellole (2025)
**Andrus Kallastu** _Tropus rhetoricus_ flöödile ja tšellole (2025, esiettekanne)
**Tatjana Kozlova-Johannes** _Vee killud_ sopranile, viiulile ja flöödile (2008), versioon sopranile, tšellole ja flöödile (2026)
**Andrus Kallastu** _Muusikat Tallinn Cameratale_ flöödile, viiulile ja kitarrile (1991), versioon flöödile, tšellole ja klaverile (2026)

_Nahakaupleja Pontus_ on tumedatooniline jutustus, mille seade kammeransamblile annab sellele täiendava dramaturgilise sügavuse: ansambli kõlavärvid tõstavad esile nimitegelase tragikoomilise karakteri ning tegevuskoha kõheda atmosfääri.

_Muusikat Tallinn Cameratale_, mis kuulub küll Kallastu varasemasse loominguperioodi, kannab endas helilooja 1990. aastate alguse esteetilisi otsinguid uue järele. Teos on üles ehitatud kontsentreeritud muusikalistele žestidele ja läbipaistvale tekstuurile. Selles on keskse tähendusega liikumine ja tasakaal eri kõlavärvide vahel.

Kallastu uus teos _Tropus rhetoricus_ flöödile ja tšellole avaneb kui kahe iseteadliku väitleja dialoog, täis keerukaid muusikalisi kalambuure, tantsulisi žeste ja intellektuaalset teravust.

Tatjana Kozlova-Johannese _Kirjades_ rullub lahti intiimne ja habras mikrodramaturgia, milles inimhääl ja instrument on justkui kaks varju, mis vahel sulanduvad üksteisega, vahel püsivad lahus. Algversioonist erinev tšello toob teosesse pehmema, tumedama värvi ja loob sellega teosele uue hingamise.

Kozlova-Johannese varasest loomingust pärit _Vee killud_ on otsekui heliline akvarell, milles õhtuvalguse värelus, virvendused ja voolamine peegelduvad õrnalt läbi niiskete puuvõrade.

## Kai Kallastu

Sopran Kai Kallastu omandas magistrikraadi klassikalise lauljana Helsingi Metropolia Ülikoolis Soomes ja on osalenud arvukates meistriklassides. Ta on esinenud kammerlaulja, suurvormisolisti ning muusikateatriartistina erinevates kollektiivides ja riikides. Tema repertuaar hõlmab teoseid renessansist nüüdismuusikani ning ta on olnud mitmete heliloojate eksperimentaalsete vokaalteoste esmaesitaja. Intensiivne loominguline töö seob teda oma abikaasa helilooja ja dirigendi Andrus Kallastuga, kellega koos ta on esitanud kümneid vokaalkavu.

## Leonora Palu

Leonora Palu on eesti flötist ja luuletaja, kes on andnud kontserte erinevate orkestri- ning kammermuusika kooslustega Eestis, Lätis, Leedus, Soomes, Rootsis, Venemaal, Poolas, Saksamaal, Austrias, Itaalias ja Jaapanis. Tema ansamblipartnereiks on olnud Age Juurikas, Irina Zahharenkova, Jorma Toots, Kristo Käo, Kirill Ogorodnikov, Repoo Ensemble, Hans Christian Aavik, Ines Maidre jpt. Palu on Pärnu Linnaorkestri esiflötist ning astub kollektiivi ees tihti üles ka solistina, viimati Malle Maltise flöödikontserdiga. Tihti esitab nüüdismuusikat ja on osalenud paljude eesti heliloojate teoste esiettekannetel. Vabaimprovisatsiooni viljeleva ansambli „Rooluulend“ koosseisus esines Leonora Palu koos Indrek Palu, Jaan Luulur Malini ja Roomet Jakapiga on andnud välja CD „Kuhu ma vajutan?“. Ta esineb regulaarselt kontsertsarjas „Heli ja Keel“, mis tutvustab eesti autorite heli- ja sõnakunsti. Leonora Palu on avaldanud muusikakriitikat ajakirjas Muusika ning kontserdiarvustusi ja arvamusartikleid kultuurilehes Sirp. Luuletajana on ta avaldanud kolm luulekogu ning tema luuletekstid on ilmunud ka ajakirjades Looming ja Vikerkaar. Aastal 2020 pälvis Leonora Palu Pärnu linna loomingupreemia tegevuse eest interpreedi, luuleautori ja kirjandusürituste korraldajana.

## Aare Tammesalu

Tšellist Aare Tammesalu tegutseb solisti ja kammermuusikuna, esitades nii klassikalist repertuaari kui ka nüüdismuusikat. Lisaks on ta aktiivne kontserdikorraldaja. Aare Tammesalu tegevust on tunnustatud Eesti Kultuurkapitali ja Eesti Muusikanõukogu aastapreemia, Eesti Teatriliidu žürii eripreemia ja Hendrik Krummi nimelise kultuuripreemiaga. 2023. aasta veebruaris andis Saaremaa vald Aare Tammesalule „Aasta tegu 2022“ auhinna Mustjala festivali korraldamise eest, 2023. aastal tunnustas EELK nõukogu teda „Aasta kirikusõbra“ tiitliga.

## Andrus Kallastu

Helilooja ja dirigent Andrus Kallastu õppis Tallinna Konservatooriumis (praegune Eesti Muusika- ja Teatriakadeemia) ning Sibeliuse Akadeemias ning tegutseb alates aastast 2000 vabakutselisena. Mitmed Kallastu teosed kõnelevad huvist muusika ja erinevate kunstiliikide ühendamise ning performance’i vastu. Kallastu huvi interpreedi ja projektide kunstilise juhina on seotud tihti muusikateatriga. Lisaks traditsioonilisele muusikateatritegevusele on tema eesmärgiks arendada muusikateatri spetsiifilisi valdkondi: müsteeriumilaadset kiriklikku kompositsiooni ning visualiseeritud kontserti.

Piletid
Tavapilet 20.00 eurot
Sooduspilet (ülalpeetavad ja pensionärid) 10.00 eurot
Õpilasepilet (õpilased ja üliõpilased) 5.00 eurot

[schoenberg.ee](https://schoenberg.ee/)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 11 AND starts_at = '2026-05-14T19:00');
INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs)
  SELECT 11, 1, NULL, 'Repoo Ensemble', 'Repoo Ensemble',
   '[{"name":"Kai Kallastu","note":{"et":"sopran","en":"soprano"}},{"name":"Leonora Palu","note":{"et":"flööt","en":"flute"}},{"name":"Aare Tammesalu","note":{"et":"tšello","en":"cello"}},{"name":"Andrus Kallastu","note":{"et":"klaver","en":"piano"}}]',
   '[]'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 11 AND starts_at = '2026-05-14T19:00') AND NOT EXISTS (SELECT 1 FROM event_credit WHERE event_id = 11 AND position = 1);
INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs)
  SELECT 11, 2, 'collaboration', NULL, NULL,
   '[]',
   '[{"et":"Eesti Arnold Schönbergi Ühing","en":"Estonian Arnold Schönberg Society"},{"et":"Eesti Muusika- ja Teatriakadeemia","en":"Estonian Academy of Music and Theatre"},{"et":"Tallinna Ülikooli Balti filmi, meedia ja kunstide instituut","en":"Baltic Film, Media and Arts School of Tallinn University"},{"et":"Pärnu Ooper","en":"Pärnu Opera"},{"et":"Autorfest","en":"Autorfest"},{"et":"Eesti Nüüdismuusika Keskus","en":"Estonian Centre of Contemporary Music"},{"et":"Muusikalinn Tallinn","en":"Tallinn Music City"},{"et":"Kultuurkapital","en":"Estonian Cultural Endowment"},{"et":"Pärnu linn","en":"City of Pärnu"}]'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 11 AND starts_at = '2026-05-14T19:00') AND NOT EXISTS (SELECT 1 FROM event_credit WHERE event_id = 11 AND position = 2);

-- 12: eccm.ee 97 and 98, 2026-05-16T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 12, '2026-05-16T19:00', NULL, NULL, 'ECCM saal', 'Pühavaimu 9, Tallinn',
   '', 'https://www.enmtallinn.com/', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_open-space.jpeg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 97);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 12, 'et', 'open-space-4',
   'Open Space #4', 97,
'Open Space kontserdisari toob ettekandele nii värskelt valminud uudisteosed kui ka krestomaatilised nüüdismuusika teosed, mida esitatakse Eestis pigem harva. Sari on algatatud Tallinna Uue Muusika Ansambli poolt ning selle eesmärk on soodustada mitmekesisema kaasaegse muusika kogukonna kasvamist ning suurendada kogukonna ühtsust.

Kavas:
**Kristupas Bubnelis** „...please leave your message after the tone...“ viiulile, tšellole ja elektroonikale (2020)
**Alireza Farajianhamedani** „Determined liberty“ flöödile (2020)
**Seyed Reza Kazazi** „Lower Sky IV“ viola d’amore’le (2026, esiettekanne)
**Simon Steen-Andersen** „Study for string instrument #1“ keelpillidele (2007)
**Guðmundur Steinn Gunnarsson** „Kvartett nr 17“ neljale esitajale (2022)
**Line Tjørnhøj** kaks osa teosest „enTmenschT“ (2018): _#throughbacks_ kahele esitajale ja _#joy_ neljale esitajale
**Katherine Emily Rumin** „Hällilaul“ viola d’amore’le ja live-elektroonikale (2026)

Sissepääs tasuta.

[enmtallinn.com](https://www.enmtallinn.com/)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 12 AND starts_at = '2026-05-16T19:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 12, 'en', 'open-space-4',
   'Open Space #4', 98,
'The Open Space concert series presents both newly composed works and classic contemporary music works that are rarely performed in Estonia. The series was initiated by the Ensemble for New Music Tallinn with the aim of fostering the growth of a more diverse contemporary music community and increasing community cohesion.

Program:
**Kristupas Bubnelis** "...please leave your message after the tone..." for violin, cello and electronics (2020)
**Alireza Farajianhamedani** "Determined liberty" for flute and flutist’s voice (2020)
**Seyed Reza Kazazi** "Lower Sky IV" for viola d’amore (2026, premiere)
**Simon Steen-Andersen** "Study for string instrument #1" for strings (2007)
**Guðmundur Steinn Gunnarsson** "Quartet nr 17" for four performers (2022)
**Line Tjørnhøj** two movements from "enTmenschT" (2018): _#throughbacks_ for two performers and _#joy_ for four performers
**Katherine Emily Rumin** "Lullaby" for viola d’amore and live electronics (2026)

Free entrance.

[enmtallinn.com](https://www.enmtallinn.com/)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 12 AND starts_at = '2026-05-16T19:00');
INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs)
  SELECT 12, 1, 'performers', NULL, NULL,
   '[{"name":"Nuria Díaz Fuentes","note":{"et":"külaline","en":"guest"}}]',
   '[{"et":"Tallinna Uue Muusika Ansambel","en":"Ensemble for New Music Tallinn"},{"et":"MUBA uue muusika ansambel","en":"MUBA new music ensemble"}]'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 12 AND starts_at = '2026-05-16T19:00') AND NOT EXISTS (SELECT 1 FROM event_credit WHERE event_id = 12 AND position = 1);

-- 13: eccm.ee 60 and 62, 2026-05-19T18:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 13, '2026-05-19T18:00', NULL, NULL, 'ECCM saal', 'Pühavaimu 9, Tallinn',
   '', 'https://uuu.ee', 'u', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_residentuur-26.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 60);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 13, 'et', 'residentuu-r-4',
   'Residentuu:r 4', 60,
'**U:** jätkab **Residentuu:ride** sarjaga. 2026. aastal on Residentuu:ri teemaks „**Ülekanne. Kommunikatsioon. Meedia**“. Eesmärgiks on püüda laiemas mõttes vaadelda sõnumite, mõtete ja ideede edasiandmist, tõlkimist ühest meediast teise, suhtlust ja kommunikatsiooni: printsiipe, mis on kogu kunstiloome aluseks. Ühtlasi esitab U: teemadega seotud valitud teoseid.

Neljandas kohtumises on külaliseks Ameerika helilooja **Scott L. Miller**, kes räägib heli-jalutuskäikudest ning ilusa ilma korral tehakse ka jalutuskäik Niguliste kiriku juurde.

Sissepääs tasuta.

[uuu.ee](https://uuu.ee)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 13 AND starts_at = '2026-05-19T18:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 13, 'en', 'residentuu-r-4',
   'Residentuu:r 4', 62,
'U: continues its **Residency** series. In 2026, the theme for the Residency is **Transfer. Communication. Media**. The goal is to examine the transmission of messages, thoughts, and ideas in a broader sense: the translation from one medium to another, interaction, and communication, principles that form the very foundation of all artistic creation. Additionally, U: will perform selected works related to these themes.

The guest for the fourth session is composer **Scott L. Miller**.

If the weather is beautiful, a walk to Niguliste church is part of the event.

**Free admission.**

[uuu.ee](https://uuu.ee)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 13 AND starts_at = '2026-05-19T18:00');

-- 14: eccm.ee 103, 2026-05-27T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 14, '2026-05-27T19:00', NULL, NULL, 'ECCM', 'Pühavaimu 9, Tallinn',
   'https://fienta.com/et/improtest-posthorn', 'https://improtest.ee', 'improtest', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_screenshot-2026-05-27-at-14-23-04.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 103);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 14, 'et', 'improtest-post-horn',
   'Improtest: Post Horn', 103,
'Improtest: Post Horn

Rohkem infot peagu. More info soon.

[facebook.com/PostHornNoise](https://www.facebook.com/PostHornNoise/)

[improtest.ee](https://improtest.ee)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 14 AND starts_at = '2026-05-27T19:00');

-- 15: eccm.ee 101, 2026-05-31T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 15, '2026-05-31T19:00', NULL, NULL, 'ECCM saal', 'Pühavaimu 9, Tallinn',
   '', '', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_joy2.jpeg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 101);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 15, 'et', 'joy-muba-uue-muusika-ansambli-kontsert',
   '„JOY!“ MUBA uue muusika ansambli kontsert', 101,
'Suvesse sisenemise rõõmus kava nüüdismuusikast.

Kavas:
**Perttu Haapanen** (1972) _Strophes II_ (2007/2009) vokaalansamblile, 7’
**Guðmundur Steinn Gunnarsson** (1982) _Kvartett nr 17_ neljale esitajale, 4’
**Karlheinz Stockhausen** (1928 kuni 2007) _Tierkreis_ (Sodiaak, 1974/1975): Kalad (Pisces), 5’
**Pauline Oliveros** (1932 kuni 2016) _Wind Horse_ (1990) mistahes instrumentidele või häältele
**Line Tjørnhøj** (1960) kaks osa teosest „enTmenschT“ (2018): _#throughbacks_ kahele esitajale (Indrek Koff, Myroslav Dykyi) ja _#joy_, 5’
**Julius Eastman** (1940 kuni 1990) _Stay on it_ (1973) häältele ja instrumentidele, 15’

Sissepääs tasuta.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 15 AND starts_at = '2026-05-31T19:00');
INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs)
  SELECT 15, 1, 'performers', NULL, NULL,
   '[{"name":"Iris Kallas","note":{"et":"hääl","en":"voice"}},{"name":"Simona Maria Reischl","note":{"et":"flööt","en":"flute"}},{"name":"Myroslav Dykyi","note":{"et":"oboe","en":"oboe"}},{"name":"Indrek Koff","note":{"et":"trompet","en":"trumpet"}},{"name":"Kadri Klanberg","note":{"et":"klaver","en":"piano"}}]',
   '[]'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 15 AND starts_at = '2026-05-31T19:00') AND NOT EXISTS (SELECT 1 FROM event_credit WHERE event_id = 15 AND position = 1);

-- 16: eccm.ee 107 and 108, 2026-09-08T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 16, '2026-09-08T19:00', NULL, NULL, 'ERR Uudistemaja 1. stuudio', 'Kreutzwaldi 14, Tallinn',
   '', 'https://uuu.ee', 'u', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_u-ansambel-eccm-rida-tais-mv-150.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 107);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 16, 'et', 'eesti-biofoonia',
   'Eesti / Biofoonia', 107,
'Ansambel U: kontsert toob kuulamiseks kava uuemast eesti muusikast (2023 kuni 2026) ning vaatleb nende seoseid inimese, looduse, helide, muusika, elu ja surma vahel.
Külaline: biosemiootik **Kalevi Kull**.

Kavas:
**Toivo Tulev** (1958) _Seven Mating Calls for Six Musicians_ (2026, esiettekanne) flöödile, klarnetile, klaverile, löökpillidele, viiulile ja tšellole
**Riho Esko Maimets** (1988) _Dimension_ (2026, esiettekanne) flöödile, klarnetile, klaverile, löökpillidele, viiulile ja tšellole
**Ryan Adams** (1993) _Sentimental Densities_ (2024) klaverile, tšellole ja flöödile
**Liina Sumera** (1988) _Pahoehoe / ʻAʻā_ (2025) ansamblile ja elektroonikale

Kontserdist toimub ülekanne Klassikaraadio eetris.

[uuu.ee](https://uuu.ee)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 16 AND starts_at = '2026-09-08T19:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 16, 'en', 'eesti-biofoonia',
   'Eesti / Biofoonia', 108,
'Ansambel U:’s concert presents a program of recent Estonian music (2023 to 2026) and explores its connection to the relationships between human, nature, sounds, music, life, and death.
Guest: biosemiotician **Kalevi Kull**.

Program:
**Toivo Tulev** (1958) _Seven Mating Calls for Six Musicians_ (2026, premiere) for flute, clarinet, piano, percussion, violin and cello
**Riho Esko Maimets** (1988) _Dimension_ (2026, premiere) for flute, clarinet, piano, percussion, violin and cello
**Ryan Adams** (1993) _Sentimental Densities_ (2024) for piano, alto flute and cello
**Liina Sumera** (1988) _Pahoehoe / ʻAʻā_ (2025) for ensemble and electronics

The concert is broadcast live on [Klassikaraadio](https://klassikaraadio.err.ee).

[uuu.ee](https://uuu.ee)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 16 AND starts_at = '2026-09-08T19:00');
INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs)
  SELECT 16, 1, 'collaboration', NULL, NULL,
   '[]',
   '[{"et":"ERR/Klassikaraadio","en":"ERR/Klassikaraadio"}]'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 16 AND starts_at = '2026-09-08T19:00') AND NOT EXISTS (SELECT 1 FROM event_credit WHERE event_id = 16 AND position = 1);

-- 17: eccm.ee 71, 2026-09-10T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 17, '2026-09-10T19:00', '2026-09-10T22:00', NULL, 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn',
   'https://fienta.com/et/schoenbergi-sari-kurtag-100', 'https://schoenberg.ee/', 'schoenberg', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_schoenberg-kurtag-1422x2284.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 71);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 17, 'et', 'schonbergi-sari-kurtag-100',
   'Schönbergi sari. Kurtág 100', 71,
'György Kurtági keelpillikvartetilooming.

Kavas:
**György Kurtág** (1926)
_Arioso: Hommage à Walter Levin 85, in Alban Bergs Manier_ (2009)
_Hommage à Mihály András: 12 microludes_ op. 13 (1977/78)
_6 moments musicaux_ op. 44 (2005)
_Clov’s Last Monologue (...a fragment...)_ (2016)
_Aus der Ferne III_ (1991), Hommage à Alfred Schlee 90
_Hommage à Jacob Obrecht_ (2004/05)
_Secreta: Funeral music in memoriam László Dobszay_ (2011)
_Quartetto_ op. 1 (1959)
_Aus der Ferne V_ (1999)
_Officium breve in memoriam Andreae Szervánszky_ op. 28 (1988/89)

V4 String Quartet on pühendunud Ungari muusikapärandi rikkuse uurimisele ja jagamisele rahvusvahelises kontekstis. 2026. aastal alustab ansambel eriprojektiga György Kurtági sajanda sünniaastapäeva tähistamiseks, esitades kõiki tema keelpillikvartetile kirjutatud teoseid. See algatus tähistab ühe 20. ja 21. sajandi mõjukaima helilooja pärandit, mõtiskledes samal ajal tema muusika ekspressiivse sügavuse, nüansirikkuse ja intellektuaalse ilu üle. Kvarteti jaoks pole see projekt mitte ainult kontsertide sari, vaid ka tähendusrikas kunstiline teekond, mis avaldab austust visionäärsele heliloojale, kelle looming inspireerib jätkuvalt muusikuid ja publikut kogu maailmas.

[v4stringquartet.com](https://www.v4stringquartet.com/)

Piletid
Tavapilet 20.00 eurot
Sooduspilet (ülalpeetavad ja pensionärid) 10.00 eurot
Õpilasepilet (õpilased ja üliõpilased) 5.00 eurot

[schoenberg.ee](https://schoenberg.ee/)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 17 AND starts_at = '2026-09-10T19:00');
INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs)
  SELECT 17, 1, NULL, 'V4 String Quartet', 'V4 String Quartet',
   '[{"name":"Miranda Liu","note":{"et":"1. viiul, Ungari","en":"first violin, Hungary"}},{"name":"Daniel Rumler","note":{"et":"2. viiul, Slovakkia","en":"second violin, Slovakia"}},{"name":"Tomáš Krejbich","note":{"et":"vioola, Tšehhi","en":"viola, Czechia"}},{"name":"Bartosz Koziak","note":{"et":"tšello, Poola","en":"cello, Poland"}}]',
   '[]'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 17 AND starts_at = '2026-09-10T19:00') AND NOT EXISTS (SELECT 1 FROM event_credit WHERE event_id = 17 AND position = 1);
INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs)
  SELECT 17, 2, 'collaboration', NULL, NULL,
   '[]',
   '[{"et":"Liszti Instituut. Tallinna Ungari Kultuuri Keskus","en":"Liszt Institute, Hungarian Cultural Centre Tallinn"},{"et":"Eesti Arnold Schönbergi Ühing","en":"Estonian Arnold Schönberg Society"},{"et":"Eesti Muusika- ja Teatriakadeemia","en":"Estonian Academy of Music and Theatre"},{"et":"Tallinna Ülikooli Balti filmi, meedia ja kunstide instituut","en":"Baltic Film, Media and Arts School of Tallinn University"},{"et":"Pärnu Ooper","en":"Pärnu Opera"},{"et":"Autorfest","en":"Autorfest"},{"et":"Eesti Nüüdismuusika Keskus","en":"Estonian Centre of Contemporary Music"},{"et":"Muusikalinn Tallinn","en":"Tallinn Music City"},{"et":"Kultuurkapital","en":"Estonian Cultural Endowment"},{"et":"Pärnu linn","en":"City of Pärnu"}]'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 17 AND starts_at = '2026-09-10T19:00') AND NOT EXISTS (SELECT 1 FROM event_credit WHERE event_id = 17 AND position = 2);

-- 18: eccm.ee 138, 2026-09-13T18:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 18, '2026-09-13T18:00', NULL, NULL, 'Arhitektuurikeskus / EKKM', 'Põhja pst 27a, Tallinn',
   'https://piletikeskus.ee/et/events?otsing=ludensemble', 'https://www.ludensemble.ee/', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_ludens-grisey-riley-piletikeskus-1500x780px.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 138);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 18, 'et', 'ludensemble-esitleb-gerard-grisey-vortex-temporum-ja-terry',
   'Ludensemble esitleb: Gérard Grisey „Vortex temporum“ ja Terry Riley „In C“', 138,
'Ludensemble astub Tallinna Arhitektuuribiennaali programmis üles kahe kontserdiga, mis uurivad muusika, ruumi ja aja vastastikuseid suhteid. Õhtu algab Kultuurikatla väikeses saalis Gérard Grisey monumentaalse teose „Vortex temporum“ ettekandega ning jätkub Eesti Kaasaegse Kunsti Muuseumis Terry Riley minimalistliku klassiku „In C“ ruumilise interpretatsiooniga. Kahe kontserdi vahel liigub publik ühest arhitektuursest keskkonnast teise, kogedes kaht täiesti erinevat viisi nüüdismuusika kuulamiseks.

Kell 18.00 kõlab Kultuurikatlas Gérard Grisey „Vortex temporum“ („Aja keeris“), aastatel 1994 kuni 1996 valminud spektraalmuusika tähtteos ja üks 20. sajandi kammermuusika olulisemaid teoseid. Flöödile, klarnetile, viiulile, vioolale, tšellole ja klaverile kirjutatud virtuoosne teos uurib aja kulgemist ja selle tajumist muusika kaudu. Grisey looming lähtub helide spektrist ning nende akustilistest omadustest, luues erakordselt rikkalikke kõlavärve ja pidevalt muutuvaid tekstuure. Erinevate rütmide, ajatasandite ja kõlaprotsesside kaudu kujuneb „Vortex temporum“ teoseks, kus aeg ise on üks peamisi muusikalisi materjale. Tallinna Arhitektuuribiennaalil sünnib „Vortex temporum“ ettekanne koostöös visuaalkunstnik Alyona Movkoga, kelle loodud ruumiline visuaalne lahendus täiendab teose arhitektuurset mõtlemist ning avab muusikale uue mõõtme.

Pärast lühikest pausi liigub publik Eesti Kaasaegse Kunsti Muuseumisse, kus kell 19.30 kõlab Terry Riley 1964. aastal valminud „In C“, teos, mida peetakse minimalistliku muusika alguspunktiks. Kompositsioon koosneb 53 lühikesest muusikalisest fragmendist, mida esitajad läbivad omas tempos, otsustades ise, kui kaua igal motiivil peatuda. Nii sünnib iga ettekanne kordumatul kujul ning kujuneb ühiselt muusikute omavahelises kuulamises. Ludensemble’i tõlgenduses laieneb „In C“ üle kogu Eesti Kaasaegse Kunsti Muuseumi. Muusikud paiknevad eri korrustel ja ruumides, ühendatuna üksnes kõrvaklappides kostva ühise pulsiga. Publik saab vabalt hoones liikuda, avastades muusikat pidevalt muutuvatest vaatenurkadest ning kujundades ise oma kuulamisteekonna.

2024. aastal loodud Ludensemble on nüüdismuusikale pühendunud kollektiiv, mille eesmärk on luua kontseptuaalseid kontserdikavu, siduda muusikat teiste kunstivormidega ning tellida, esitada ja levitada uut loomingut. Ansambli koosseis varieerub vastavalt projektile kammeransamblist kammerorkestrini. Esimeste tegevusaastate jooksul on Ludensemble toonud publiku ette Kirke Karja, Madli-Marje Gildemanni, Arnold Schönbergi, György Ligeti, Gérard Grisey, Frank Zappa ja paljude teiste heliloojate muusikat. 2026. aasta alguses ilmus plaadifirma Kairos alt ansambli debüütalbum „Dream Sequence of an Ancient Forest“, millel kõlab Madli-Marje Gildemanni looming.

[ludensemble.ee](https://www.ludensemble.ee/)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 18 AND starts_at = '2026-09-13T18:00');
INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs)
  SELECT 18, 1, 'performers', NULL, NULL,
   '[{"name":"Maria Luisk","note":{"et":"flööt","en":"flute"}},{"name":"Alexander Avramenko","note":{"et":"klarnet","en":"clarinet"}},{"name":"Kaija Lukas","note":{"et":"viiul","en":"violin"}},{"name":"Sandra Klimaitė","note":{"et":"vioola","en":"viola"}},{"name":"Theodor Sink","note":{"et":"tšello","en":"cello"}},{"name":"Kärt Ruubel","note":{"et":"klaver","en":"piano"}}]',
   '[{"et":"Ludensemble","en":"Ludensemble"}]'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 18 AND starts_at = '2026-09-13T18:00') AND NOT EXISTS (SELECT 1 FROM event_credit WHERE event_id = 18 AND position = 1);
INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs)
  SELECT 18, 2, 'conductor', NULL, NULL,
   '[{"name":"Kaspar Mänd"}]',
   '[]'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 18 AND starts_at = '2026-09-13T18:00') AND NOT EXISTS (SELECT 1 FROM event_credit WHERE event_id = 18 AND position = 2);

-- 19: eccm.ee 118, 2026-09-13T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 19, '2026-09-13T19:00', NULL, NULL, 'Stuudio 1965', 'Pühavaimu 9, Tallinn',
   '', 'https://estelmus.com', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_serge.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 118);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 19, 'et', 'ema-vanavanemate-paeva-opituba-analoogsuntesaator-alla-60',
   'EMA vanavanemate päeva õpituba „Analoogsüntesaator: alla 60 keelatud!“', 118,
'EMA õpituba vanavanematele, kuidas õppida mängima analoogsüntesaatoril poole tunniga.

Kohtade arv: 10.

[estelmus.com](https://estelmus.com)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 19 AND starts_at = '2026-09-13T19:00');

-- 20: eccm.ee 149 and 150, 2026-09-13T20:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 20, '2026-09-13T20:00', NULL, NULL, 'ECCM saal', 'Pühavaimu 9, Tallinn',
   '', 'https://estelmus.com', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_serge.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 149);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 20, 'et', 'ema-pika-tanava-festivalil-ajaloolise-elektroonilise-muusika',
   'EMA Pika tänava festivalil: ajaloolise elektroonilise muusika kontsert, vanavanemate eri', 149,
'EMA kontsert elektroonilisest muusikast vanavanemate noorusaegadest.

Kavas:
**Õie Olinda Sacherman** _Morse etüüdid_ (1950. aastate lõpp, 1960. aastate algus)
**Õie Olinda Sacherman** _Linnud_ (1950. aastate lõpp, 1960. aastate algus) magnetofonidele
**Włodzimierz Kotoński** _Aela_ (1970)
**Õie Olinda Sacherman** _Eestimaa rännakud_ (1950. aastate lõpp, 1960. aastate algus), elektrooniline süit
**Õie Olinda Sacherman** _Drossel Tore, Lained_ (1950. aastate lõpp, 1960. aastate algus) siinusgeneraatoritele

Sissepääs tasuta.

[estelmus.com](https://estelmus.com)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 20 AND starts_at = '2026-09-13T20:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 20, 'en', 'ema-at-pikk-street-festival-concert-of-historic-electronic',
   'EMA at Pikk Street festival: concert of historic electronic music, grandparents special', 150,
'EMA plays a program of electronic music from the youth of our grandparents.

Program:
**Õie Olinda Sacherman** _Morse etüüdid_ (late 1950s to early 1960s)
**Õie Olinda Sacherman** _Linnud_ (late 1950s to early 1960s) for live tape players
**Włodzimierz Kotoński** _Aela_ (1970)
**Õie Olinda Sacherman** _Eestimaa rännakud_ (late 1950s to early 1960s), electronic suite
**Õie Olinda Sacherman** _Drossel Tore, Lained_ (late 1950s to early 1960s) for sine-wave oscillators

Entrance free.

[estelmus.com](https://estelmus.com)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 20 AND starts_at = '2026-09-13T20:00');

-- 21: eccm.ee 147 and 148, 2026-09-21T17:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 21, '2026-09-21T17:00', NULL, NULL, 'Museum of Modern Art Warsaw, Kinomuzeum', 'Warszawa',
   '', 'https://warszawska-jesien.art.pl/en/2026/programme/programme/21-09/estonian-electronic-music', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_54943047942-c00f72f881-v.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 147);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 21, 'et', 'ema-varssavi-sugisel',
   'EMA Varssavi Sügisel', 147,
'EMA kontsert Varssavi Uue Kunsti Muuseumi kinosaalis, koostöös Poola Raadio Eksperimentaalstuudioga.

Kavas:
**Tatjana Kozlova-Johannes** _Aria_ (2021)
**Õie Olinda Sacherman** _Morse etüüdid_ (late 1950s to early 1960s)*
**Õie Olinda Sacherman** _Linnud_ (late 1950s to early 1960s)* for live tape players
**Włodzimierz Kotoński** _Aela_ (1970)
**Õie Olinda Sacherman** _Eestimaa rännakud_ (late 1950s to early 1960s), electronic suite
**Rauno Remme** _Altes Kind_ (2002)
**Õie Olinda Sacherman** _Drossel Tore, Lained_ (late 1950s to early 1960s)* for sine-wave oscillators

[warszawska-jesien.art.pl](https://warszawska-jesien.art.pl/en/2026/programme/programme/21-09/estonian-electronic-music)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 21 AND starts_at = '2026-09-21T17:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 21, 'en', 'ema-at-warsaw-autumn',
   'EMA at Warsaw Autumn', 148,
'Concert of the Estonian Electronic Music Society’s ensemble (EMA) at Warsaw Autumn, at the Museum of Modern Art in Warsaw, in collaboration with the Polish Radio Experimental Studio.

Program:
**Tatjana Kozlova-Johannes** _Aria_ (2021)
**Õie Olinda Sacherman** _Morse etüüdid_ (late 1950s to early 1960s)*
**Õie Olinda Sacherman** _Linnud_ (late 1950s to early 1960s)* for live tape players
**Włodzimierz Kotoński** _Aela_ (1970)
**Õie Olinda Sacherman** _Eestimaa rännakud_ (late 1950s to early 1960s), electronic suite
**Rauno Remme** _Altes Kind_ (2002)
**Õie Olinda Sacherman** _Drossel Tore, Lained_ (late 1950s to early 1960s)* for sine-wave oscillators

[warszawska-jesien.art.pl](https://warszawska-jesien.art.pl/en/2026/programme/programme/21-09/estonian-electronic-music)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 21 AND starts_at = '2026-09-21T17:00');
INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs)
  SELECT 21, 1, NULL, 'Korraldaja', 'Organiser',
   '[]',
   '[{"et":"Varssavi Uue Kunsti Muuseum","en":"Museum of Modern Art in Warsaw"}]'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 21 AND starts_at = '2026-09-21T17:00') AND NOT EXISTS (SELECT 1 FROM event_credit WHERE event_id = 21 AND position = 1);
INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs)
  SELECT 21, 2, 'collaboration', NULL, NULL,
   '[]',
   '[{"et":"Poola Raadio Eksperimentaalstuudio","en":"Polish Radio Experimental Studio"}]'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 21 AND starts_at = '2026-09-21T17:00') AND NOT EXISTS (SELECT 1 FROM event_credit WHERE event_id = 21 AND position = 2);

-- 22: eccm.ee 119 and 120, 2026-09-21T19:30
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 22, '2026-09-21T19:30', NULL, NULL, 'Witold Lutosławski Polish Radio Concert Studio', 'Modzelewskiego 59, Warszawa',
   '', 'https://warszawska-jesien.art.pl/en/2026/programme/programme/21-09/enmt', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_sohvi-viik-15-vaike-4.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 119);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 22, 'et', 'tallinna-uue-muusika-ansambel-varssavi-sugisel',
   'Tallinna Uue Muusika Ansambel Varssavi Sügisel', 119,
'Tallinna Uue Muusika Ansambel astub Varssavi Sügisel üles juba teistkordselt. Seekord põneva uue kavaga, mis ühendab ansambli torupilli ja viola d’amore’ga.

Mitmekesine kava koosneb esiettekannetest ja mitmetest hiljuti TUMA-le komponeeritud teostest.

Kavas:
**Liisa Hirsch** Liivi „Code“ (2025)
**Klaus Lang** „corium“ (2025)
**Jan Martin Smørdal** „All Play“ (2014, toimetatud 2016)

Vaheaeg

**Wojciech Błażejczyk** „Sympatheticality“ (2026, maailma esiettekanne)
**Arash Yazdani** „Sharveh“ (2025)

[warszawska-jesien.art.pl](https://warszawska-jesien.art.pl/en/2026/programme/programme/21-09/enmt)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 22 AND starts_at = '2026-09-21T19:30');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 22, 'en', 'ensemble-for-new-music-tallinn-at-warsaw-autumn-festival',
   'Ensemble for New Music Tallinn at Warsaw Autumn festival', 120,
'Ensemble for New Music Tallinn will perform at the Warsaw Autumn festival for the second time with an exciting new program, combining torupill (Estonian bagpipe) and viola d’amore with ensemble.

The diverse program will consist of premieres and recently composed works for ENMT.

Program:
**Liisa Hirsch** Liiv’s "Code" (2025)
**Klaus Lang** "corium" (2025)
**Jan Martin Smørdal** "All Play" (2014, edited 2016)

Intermission

**Wojciech Błażejczyk** "Sympatheticality" (2026, world premiere)
**Arash Yazdani** "Sharveh" (2025)

[warszawska-jesien.art.pl](https://warszawska-jesien.art.pl/en/2026/programme/programme/21-09/enmt)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 22 AND starts_at = '2026-09-21T19:30');

-- 23: eccm.ee 122 and 130, 2026-11-12T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 23, '2026-11-12T19:00', NULL, NULL, 'Mustpeade maja valge saal', 'Pikk 26, Tallinn',
   '', 'https://www.filharmoonia.ee/mustpeademaja', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_sound-plasma-berlin-cover-vaike.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 122);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 23, 'et', 'sound-plasma-10',
   'Sound Plasma 10', 122,
'Kümnendat korda toimuva Sound Plasma näol on tegemist rahvusvahelisel muusikamaastikul ainulaadse alternatiivseid intonatsioone hõlmavale muusikale pühendunud kontserdisarjaga (varasemalt mini-festivaliga), mille kaudu on harukordne võimalus tuua publikuni uuemaid kaasaegse muusika suundi ning spektraalsete ja tämbril põhinevate teoste paremik.

Sound Plasma teeb eriliseks keskendumine piire nihutavatele helipraktikatele ning võime tuua kokku eksperimenteerimist hindavaid artiste ja publikut.

Kavas:
Tallinna Uue Muusika Ansambel:
**Lauri Jõeleht** uudisteos (2026, esiettekanne)
**Arash Yazdani** uudisteos (2026, esiettekanne)
**Wojciech Błażejczyk** „Sympatheticality“ (2026, Eesti esiettekanne)

defunensemble:
kava kinnitamisel

[filharmoonia.ee](https://www.filharmoonia.ee/mustpeademaja)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 23 AND starts_at = '2026-11-12T19:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 23, 'en', 'sound-plasma-10',
   'Sound Plasma 10', 130,
'For Sound Plasma’s 10th anniversary, Ensemble for New Music Tallinn is organizing a joint concert with the great Finnish contemporary music group defunensemble.

The concert program includes new works written especially for ENMT by composers Lauri Jõeleht and Arash Yazdani, among others. Alongside ENMT, defunensemble will perform a couple of works from its exciting repertoire (works to be announced).

The cooperation between the Ensemble for New Music Tallinn and defunensemble has already been quite long-standing:

- In 2021, Fausto Romitelli’s masterpiece "Professor Bad Trip" was jointly premiered in Estonia and Finland.
- In 2022, the ensembles joined forces to premiere Enno Poppe’s great work "Rundfunk" in Estonia.
- The same work was performed with a joint ensemble in August 2023 at the Intsikurmu Festival and in September 2023 at the PianoEspoo Festival in Finland.

[filharmoonia.ee](https://www.filharmoonia.ee/mustpeademaja)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 23 AND starts_at = '2026-11-12T19:00');
INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs)
  SELECT 23, 1, 'performers', NULL, NULL,
   '[]',
   '[{"et":"Tallinna Uue Muusika Ansambel","en":"Ensemble for New Music Tallinn"},{"et":"defunensemble","en":"defunensemble"}]'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 23 AND starts_at = '2026-11-12T19:00') AND NOT EXISTS (SELECT 1 FROM event_credit WHERE event_id = 23 AND position = 1);

-- 24: eccm.ee 111 and 112, 2026-11-14T11:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 24, '2026-11-14T11:00', '2026-11-15T18:00', NULL, 'ECCM saal', 'Pühavaimu 9, Tallinn',
   '', 'https://uuu.ee', 'u', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_1-ansambel-u-fb-pais-2110-1640x924px.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 111);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 24, 'et', 'koosloome-opituba',
   'Koosloome õpituba', 111,
'Koosloome õpitoa mõte on uurida ja arendada koostöövormi, kus helilooja ja esitajad töötavad koos alates protsessi päris algusest kuni teose valmimise ja esiettekandeni.

Hooaja jooksul toimub kolm kohtumist. Esimeses tutvustatakse algideesid, arutatakse, peegeldatakse, improviseeritakse, kogutakse algmaterjali ja mõtteid.

Sari toimub võrgustiku [Ulysses](https://ulysses-platform.eu/ulysses-platform) raames.

Aktiivselt saavad osa võtta kolm noort heliloojat. Konkurss kuulutatakse välja septembris 2026.

Kõik töösessioonid on huvilistele avatud.

Järgnevad kohtumised toimuvad **20. ja 21. veebruaril 2027** ning **15. ja 16. mail 2027**.

Esimesel kohtumisel on külaliseks ansambliga U: sarnaselt töötanud helilooja **Liisa Hõbepappel**.

[uuu.ee](https://uuu.ee)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 24 AND starts_at = '2026-11-14T11:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 24, 'en', 'co-creation-workshop',
   'Co-creation workshop', 112,
'The idea behind the co-creation workshop is to explore and develop a collaborative model where the composer and performers work together from the very beginning of the process through to the completion and premiere of the work.

Three meetings will take place during the season. In the first one, initial ideas will be presented, discussed, reflected upon, and improvised on, gathering primary material and concepts.

The series takes place within the framework of the [Ulysses](https://ulysses-platform.eu/ulysses-platform) network.

Three young composers can participate actively. The call for applications will be announced in September 2026.

All working sessions are open to anyone interested.

The subsequent meetings will take place on **20 and 21 February 2027** and **15 and 16 May 2027**.

The guest at the first meeting is composer **Liisa Hõbepappel**, who has worked in a similar way with Ansambel U:.

[uuu.ee](https://uuu.ee)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 24 AND starts_at = '2026-11-14T11:00');

-- 25: eccm.ee 73, 2026-11-19T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 25, '2026-11-19T19:00', '2026-11-19T22:00', NULL, 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn',
   '', 'https://schoenberg.ee/', 'schoenberg', NULL, 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 73);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 25, 'et', 'schonbergi-sari-2026-11-19',
   'Schönbergi sari', 73,
'Schönbergi sari

[schoenberg.ee](https://schoenberg.ee/)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 25 AND starts_at = '2026-11-19T19:00');

-- 26: eccm.ee 125 and 124, 2026-11-28T19:30
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 26, '2026-11-28T19:30', NULL, NULL, 'St Paul’s Hall', 'Queensgate, Huddersfield',
   'https://hcmf.co.uk/events/?EventInstanceID=216401', 'https://hcmf.co.uk/programme/ensemble-for-new-music-tallinn/', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_sohvi-viik-11-pisike.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 125);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 26, 'et', 'tallinna-uue-muusika-ansambel-huddersfieldi-nuudismuusika',
   'Tallinna Uue Muusika Ansambel Huddersfieldi nüüdismuusika festivalil', 125,
'Tallinna Uue Muusika Ansambli kontserdikava toob kokku heliloojaid kogu Euroopast ja Põhja-Ameerikast, kellel kõigil on väga erinev lähenemine ja muusikaline keel: William Dougherty, Justina Repečkaitė, Liisa Hirschi ja dirigent-helilooja Arash Yazdani uued teosed kõlavad kõrvuti Pasquale Corrado teosega „Ozone“, luues rikkaliku ja mitmekesise helide ja ideede maastiku.

Kavas ühendab ansambel klassikalised instrumendid torupilliga, elava ja ekspressiivse rahvapilliga, mille eripärane tämber ja mikrotonaalsed võimalused inspireerivad uusi muusikalisi kohtumisi. Tulemuseks on kontsert, mis ühendab traditsiooni ja eksperimenteerimise, kohaliku pärandi ja rahvusvahelise kaasaegse praktika.

Kavas:
**William Dougherty** (USA, 1988) _empty cisterns and exhausted wells_ (2025), 15’, UK esiettekanne
**Pasquale Corrado** (Itaalia, 1979) _Ozone_ (2018), 10’
**Justina Repečkaitė** (Leedu, 1989) _Millefleur_ (2025), 10’, UK esiettekanne
**Liisa Hirsch** (Eesti, 1984) _Liiv’s “Code”_ (2025), 13’, UK esiettekanne
**Arash Yazdani** (Iraan, 1985) _Sharveh_ (2025), 15’, UK esiettekanne

[hcmf.co.uk](https://hcmf.co.uk/programme/ensemble-for-new-music-tallinn/)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 26 AND starts_at = '2026-11-28T19:30');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 26, 'en', 'ensemble-for-new-music-tallinn-at-huddersfield-contemporary',
   'Ensemble for New Music Tallinn at Huddersfield Contemporary Music Festival', 124,
'Winners of the Ernst von Siemens Music Foundation Ensemble Prize 2026, ENMT has earned an international reputation for its adventurous programming and commitment to new music. For this special project, the ensemble is joined by _torupill_ player **Katariin Raska**, exploring how an instrument rooted in Estonia’s rural and medieval traditions can open new possibilities within contemporary composition.

The programme brings together composers from across Europe and North America, each with a wildly different approach and musical language. New works by **William Dougherty**, **Justina Repečkaitė**, **Liisa Hirsch** and conductor-composer **Arash Yazdani** sit alongside **Pasquale Corrado**’s _Ozone_, creating a rich and varied landscape of sounds and ideas.

Across the programme, the _torupill_ emerges not as a historical curiosity but as a living, expressive instrument whose distinctive timbre and microtonal possibilities inspire fresh musical encounters. The result is a concert that connects tradition and experimentation, local heritage and international contemporary practice.

Program:
**William Dougherty** (USA, 1988) _empty cisterns and exhausted wells_ (2025), 15’, UK premiere
**Pasquale Corrado** (Italy, 1979) _Ozone_ (2018), 10’
**Justina Repečkaitė** (Lithuania, 1989) _Millefleur_ (2025), 10’, UK premiere
**Liisa Hirsch** (Estonia, 1984) _Liiv’s “Code”_ (2025), 13’, UK premiere
**Arash Yazdani** (Iran, 1985) _Sharveh_ (2025), 15’, UK premiere

[hcmf.co.uk](https://hcmf.co.uk/programme/ensemble-for-new-music-tallinn/)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 26 AND starts_at = '2026-11-28T19:30');
INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs)
  SELECT 26, 1, 'performers', NULL, NULL,
   '[{"name":"Katariin Raska","note":{"et":"torupill","en":"torupill (Estonian bagpipe)"}}]',
   '[{"et":"Tallinna Uue Muusika Ansambel","en":"Ensemble for New Music Tallinn"}]'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 26 AND starts_at = '2026-11-28T19:30') AND NOT EXISTS (SELECT 1 FROM event_credit WHERE event_id = 26 AND position = 1);
INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs)
  SELECT 26, 2, 'conductor', NULL, NULL,
   '[{"name":"Arash Yazdani"}]',
   '[]'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 26 AND starts_at = '2026-11-28T19:30') AND NOT EXISTS (SELECT 1 FROM event_credit WHERE event_id = 26 AND position = 2);

-- 27: eccm.ee 129 and 128, 2026-12-05T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 27, '2026-12-05T19:00', NULL, NULL, 'ECCM saal', 'Pühavaimu 9, Tallinn',
   '', '', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_enmt-pic-suur-3.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 129);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 27, 'et', 'uus-kontserdisari-up-to-three-kuni-kolm',
   'Uus kontserdisari: Up to Three / Kuni kolm', 129,
'Up to Three / Kuni kolm on uus kontsertide formaat, kus Tallinna Uue Muusika Ansambli muusikud astuvad üles väikestes koosseisudes ja kus ettekandele tulevad teosed on maksimaalselt kuni kolmele muusikule.

Up to Three kontserdiformaat annab võimaluse tuua lavalaudadele muusikute ja heliloojate töötubadest pärit uurimused ja eksperimendid. Esinejate ja heliloojate loomingulised grupeeringud katsetavad pikema ajavahemiku jooksul ühistes tööfaasides uusi ideid, keskendudes ansamblitöö praegustes projektides olulistele teemadele ning eksperimentidele. See uurimistöö rajab uut moodi loomingulise pinnase huvitavate kontseptsioonide katsetamisele ja uuenduslikele teostele, mida avalikult esitletakse ja arutatakse.

Kontserdiformaat Up to Three on mõeldud koostööks eelkõige professionaalsetele muusikutele ja heliloojatele. Samas, kui Tallinna Uue Muusika Ansambli korraldataval Open Space’i kontserdisarjas on rõhk haridusel ja nüüdismuusika heliloomingu tudengitel.

Sissepääs tasuta.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 27 AND starts_at = '2026-12-05T19:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 27, 'en', 'new-concert-series-up-to-three-kuni-kolm',
   'New concert series: Up to Three / Kuni kolm', 128,
'Up to Three / Kuni kolm is a new concert format, where musicians of the Ensemble for New Music Tallinn perform in small ensembles and where the works to be performed are for a maximum of three musicians.

The Up to Three concert format provides an opportunity to bring research and experiments from the workshops of musicians and composers to the stage. Creative groups of performers and composers test new ideas in joint work phases over a longer period of time, focusing on important themes and experiments in current projects of ensemble work. This research establishes a new kind of creative ground for testing interesting concepts and innovative works that are publicly presented and discussed.

The Up to Three concert format is intended for collaboration primarily for professional musicians and composers. At the same time, the Open Space concert series organized by the Ensemble for New Music Tallinn has an emphasis on education and students of contemporary music composition.

Free entrance.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 27 AND starts_at = '2026-12-05T19:00');

-- 28: eccm.ee 153, 2026-12-08T18:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 28, '2026-12-08T18:00', '2026-12-08T23:00', NULL, '', '',
   '', '', 'schoenberg', NULL, 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 153);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 28, 'et', 'schonbergi-sari-2026-12-08',
   'Schönbergi sari', 153,
'Schönbergi sari'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 28 AND starts_at = '2026-12-08T18:00');

-- 29: eccm.ee 127 and 126, 2026-12-12T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 29, '2026-12-12T19:00', NULL, NULL, 'ECCM saal', 'Pühavaimu 9, Tallinn',
   '', '', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_open-space-4.jpeg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 127);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 29, 'et', 'open-space-5',
   'Open Space #5', 127,
'Open Space kontserdisarja näol on tegemist ürituste sarjaga, kus on kavas nii värskelt valminud uudisteosed kui ka krestomaatilised nüüdismuusika teosed, mida esitatakse Eestis pigem harva. Sarja eesmärk on soodustada mitmekesisema kaasaegse muusika kogukonna kasvamist, suurendada kogukonna ühtsust ning tuua kuulajateni põnev ja väga vaheldusrikas valik teoseid.

Open Space kontserdisarja raames avame oma ansambli uksed kõigile heliloojatele ja interpreetidele, kaasaegse muusika harrastajatele, üliõpilastele ja professionaalidele, et nad saaksid kas üksi või Tallinna Uue Muusika Ansambli muusikutega esitada oma teoseid sundimatus õhkkonnas regulaarselt toimuvate kontsertide raames.

Sissepääs tasuta.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 29 AND starts_at = '2026-12-12T19:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 29, 'en', 'open-space-5',
   'Open Space #5', 126,
'The Open Space is a series of events that features both newly completed new works and classic contemporary music works that are rarely performed in Estonia. The aim of the series is to encourage the growth of a more diverse contemporary music community, increase community unity, and bring listeners an exciting and very varied selection of works.

As part of the Open Space concert series, Ensemble for New Music Tallinn is opening its doors to all composers and performers, contemporary music enthusiasts, students, and professionals, so that they can perform their works either alone or with musicians of ENMT in a relaxed atmosphere during regularly held concerts.

Free entrance.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 29 AND starts_at = '2026-12-12T19:00');

-- 30: eccm.ee 116 and 117, 2026-12-29T23:42
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 30, '2026-12-29T23:42', NULL, NULL, 'ECCM saal', 'Pühavaimu 9, Tallinn',
   '', 'https://uuu.ee', 'u', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_u-punane.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 116);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 30, 'et', 'u-vana-aasta-uue-muusika-kontsert',
   'U: vana-aasta uue muusika kontsert', 116,
'Pilguheit U: möödunud ja tulevale aastale.

[uuu.ee](https://uuu.ee)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 30 AND starts_at = '2026-12-29T23:42');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 30, 'en', 'u-s-end-of-the-year-new-music-concert',
   'U:’s end-of-the-year new music concert', 117,
'A look back and ahead at U:’s past and coming year.

[uuu.ee](https://uuu.ee)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 30 AND starts_at = '2026-12-29T23:42');

-- the English rows of events 4 to 10, which seed-step4.sql believed eccm.ee had not got
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 4, 'en', 'scrapyard',
   'Scrapyard', 121,
'Scrapyard is a performance series of Lo-Fi music shows, the aim of which is to have a mixture of DIY and Lo-Fi music with contemporary classical music.
During these events, we employ many different aspects of performance art, technology and media, which results in a complete interdisciplinary experience.

Ensemble for New Music Tallinn is bringing to the stage a choreographic ensemble of musicians and musical instruments with expanded capabilities. The concert program includes several highly effective and technically complex works.

[saal.ee](https://saal.ee/)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 4);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 6, 'en', 'improtest-electro-funeral',
   'Improtest: Electro Funeral', 142,
'Electro Funeral (EST)

[improtest.ee](https://www.improtest.ee)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 6);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 8, 'en', 'death',
   'Death', 115,
'U:’s All Souls’ season concert, addressing departure, death, and memories.
Guest: to be announced

Program: A. Kallastu, B. Ferneyhough, J. Harvey, J. Sánchez-Verdú and others

[uuu.ee](https://uuu.ee)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 8);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 9, 'en', 'sound-plasma-10-in-berlin',
   'Sound Plasma 10 in Berlin', 123,
'Sound Plasma 10!

Sound Plasma is going back to Berlin for its 10th anniversary.

On **6 November 2026** Ensemble for New Music Tallinn and Ensemble21 (Belgium) come together to create a vibrant and daring musical dialogue. This program brings together works by Madli Marje Gildemann, Oren Boneh, and Arash Yazdani, as well as Jean-Luc Hervé’s "Germination", a work that blends concert and sound installation to create a constantly evolving soundscape.

Through rich sonorities and instrumental combinations from both ensembles, the concert explores perpetually transforming universes: soundscapes that take root, grow, and flourish under the batons of Arash Yazdani and Marc Collet.

This collaboration between Brussels and Tallinn gives rise to a demanding and nuanced musical dialogue, rooted in a profound exploration of contemporary musical languages.

Program:
**Madli Marje Gildemann** "Metanoia" (2025)
**Oren Boneh** "Widget Adjective" (2025)
**Arash Yazdani** "Shimmering of White Phosphorus" (2024)
**Jean-Luc Hervé** "Germination" (2013)

**Sound Plasma** is a concert series and festival format dedicated to music with alternative intonation. It has been organized since 2017 and it has taken place annually in Berlin and Tallinn as a network of satellite mini-festivals.

[field-notes.berlin](https://field-notes.berlin/en/kalender/ensemble-new-music-tallinn-ensemble21)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 9);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 10, 'en', 'improtest-barry-guy-maya-homburger-liudas-mockunas',
   'Improtest: Barry Guy, Maya Homburger, Liudas Mockunas', 143,
'Barry Guy, Maya Homburger, Liudas Mockunas (UK / SUI / LT)

[improtest.ee](https://www.improtest.ee)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 10);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 5, 'en', 'gestures-situations-listening-without-a-score-liisa',
   'Gestures/situations: listening without a score. Liisa Hõbepappel, Kenn-Erik Kannike, Liis Vares', 137, body
  FROM event_text WHERE event_id = 1 AND lang = 'en' AND EXISTS (SELECT 1 FROM event WHERE id = 5);

-- the members page, under ECCM as on eccm.ee, and in no menu
INSERT OR IGNORE INTO page (key, parent_key, menu_order, status, publish_at) VALUES ('liikmed', 'eccm', 60, 'published', NULL);
INSERT OR IGNORE INTO page_text (page_id, lang, slug, title, legacy_path, body)
  SELECT id, 'et', 'liikmed', 'Eesti Nüüdismuusika Keskuse liikmed', '/index.php/et/eccm/liikmed',
'- [Ansambel U:](https://uuu.ee)
- [Eesti Arnold Schönbergi Ühing](https://www.schoenberg.ee/)
- [Eesti Elektroonilise Muusika Selts EMA](https://emamusic.ee/)
- [Eesti Heliloojate Liit](https://www.helilooja.ee/)
- [Improtest](https://www.improtest.ee/)
- [Ludensemble](https://www.ludensemble.ee/)
- [Tallinna Uue Muusika Ansambel TUMA](https://www.enmtallinn.com/)
- [Üle Heli Festival](https://www.ule-heli.ee/)
- YXUS ansambel'
  FROM page WHERE key = 'liikmed';
INSERT OR IGNORE INTO page_text (page_id, lang, slug, title, legacy_path, body)
  SELECT id, 'en', 'members', 'Members', '/index.php/en/eccm-new-eng/memeng',
'- [Ansambel U:](https://uuu.ee)
- [Estonian Arnold Schönberg Society](https://www.schoenberg.ee/)
- [Estonian Electronic Music Society EMA](https://emamusic.ee/)
- [Estonian Composers’ Union](https://www.helilooja.ee/)
- [Improtest](https://www.improtest.ee/)
- [Ludensemble](https://www.ludensemble.ee/)
- [Ensemble for New Music Tallinn TUMA](https://www.enmtallinn.com/)
- [Üle Heli Festival](https://www.ule-heli.ee/)
- YXUS ensemble'
  FROM page WHERE key = 'liikmed';

-- the two dated Schönberg placeholders (19 November, 8 December) carry the
-- series' own picture, the one Versioonid uses, rather than none (asked
-- 2026-10-01: "no image? reuse existing"); matched by key, only where empty
UPDATE event SET image_id = (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_558d761d-3ef9-4d73-a3f1-27d3372b760d.png')
  WHERE image_id IS NULL AND id IN (SELECT event_id FROM event_text WHERE lang = 'et' AND slug IN ('schonbergi-sari-2026-11-19', 'schonbergi-sari-2026-12-08'));
