-- seed-step10-archive-2024.sql: eccm.ee's past events of 2024 from 22 September, the first in its past list, read once each off its public
-- pages on 2026-10-07 (the four list pages and each event page, one request a second,
-- cached), plans/plan-eccm-migration.md "Import the archive". 16 events, 19 texts, 8 new pictures.
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
  ('ic_large_w900h600q100_saariaho-kontsert.jpeg', 899, 394,
   'Hommage à Kaija Saariaho',
   'Hommage à Kaija Saariaho'),
  ('ic_large_w900h600q100_ule-heli24.png', 900, 471,
   'Üle Heli 2024',
   'Üle Heli 2024'),
  ('ic_large_w900h600q100_lained-laiem.png', 900, 543,
   'DUOD I',
   'DUOS I'),
  ('ic_large_w900h600q100_screenshot-2024-10-25-at-13-06-41.png', 1040, 552,
   'Konverents "Tulevik läks meist mööda"',
   'Konverents "Tulevik läks meist mööda"'),
  ('ic_large_w900h600q100_drosseli-ringid-fb-banner.jpg', 900, 471,
   'EMA kontsert "Drosseli Ringid"',
   'EMA kontsert "Drosseli Ringid"'),
  ('ic_large_w900h600q100_screenshot-2024-11-05-at-16-22-09.png', 900, 461,
   'Robert Dick trio Improtestil',
   'Robert Dick trio Improtestil'),
  ('ic_large_w900h600q100_soundplasma.png', 900, 577,
   'Sound Plasma',
   'Sound Plasma'),
  ('ic_large_w900h600q100_screenshot-2024-11-21-at-12-42-14.png', 900, 598,
   'EKA, EMTA ja BFM Teaduskohvik',
   'EKA, EMTA ja BFM Teaduskohvik');

-- 1001: eccm.ee 13, 2024-09-22T18:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1001, '2024-09-22T18:00', NULL, NULL, 'ECCM', '',
   '', 'https://schoenberg.ee/', 'koostoo', NULL, 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 13);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1001, 'et', 'schoenberg-residency-helia-mailiis-viirakivi',
   'SCHOENBERG RESIDENCY. Heliä Mailiis Viirakivi', 13,
'Kavas Muruaga, Saariaho, Viirakivi

Esitavad:

Heliä Mailiis Viirakivi (hääl, flööt, elektroonika)
Kai Kallastu (sopran)
Leonora Palu (flööt)
Andrus Kallastu (klaver)
Gon Muruaga (kitarr, elektroonika)

Juba 2007. aastast pakub Eesti Arnold Schönbergi Ühing heliloojatele, interpreetidele ja muusikateadlastele võimalust teostada oma kunstilisi plaane ja arendada koostööd Eesti heliloojate, interpreetide ja teiste valdkondade loovisikutega Pärnus toimuvas loomingulises residentuuris Schoenberg Residency.

Sel aastal on Schoenberg-residendiks mitmekülgne Soome helilooja, laulja, flötist ja improvisaator Heliä Mailiis Viirakivi, kelle tegevus hõlmab nii kaasaegset klassikalist muusikat, eksperimentaalset nüüdismuusikat, kaasaegset improvisatsiooni kui ka valdkondadevahelisi kompositsioone. Viirakivi on omandanud muusikahariduse Soomes ja Eestis. Ta on olnud mitmete eksperimentaalsete nüüdismuusikateoste esmaesitaja, arendades selleks rahvusvahelist koostööd eri valdkondade loovisikutega. [www.heliamailiis.com/en](https://www.heliamailiis.com/en/)

Heliä loomeresidentuur lõpeb kontsertidega, millel kõlab nii tema enda kui ka teiste heliloojate looming. Esinejatena on lisaks kaasatud ka loomeresidentuuri perioodil Viirakiviga koostööd teinud interpreedid ja heliloojad.

Kontserdi kestus ca 1 tund.

Koostöös: Eesti Kultuurkapital, Pärnu linn, EELK Pärnu Eliisabeti kogudus, Eesti Nüüdismuusika Keskus, Pärnu Ooper, Eesti Arnold Schönbergi Ühing

Piletid: Sissepääs tasuta'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1001 AND starts_at = '2024-09-22T18:00');

-- 1002: eccm.ee 12, 2024-09-30T17:30
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1002, '2024-09-30T17:30', NULL, NULL, 'Mustpeade Maja Valge saal', '',
   '', '', 'eccm', NULL, 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 12);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1002, 'et', 'helena-tulve-uudisteose-vers-l-autre-clarte-avatud-proov',
   'Helena Tulve uudisteose "Vers l''autre clarté" avatud proov.', 12,
'Koostöös Tallinna Kammerorkestri, ansambel U: ja ansambli EMA muusikute ja dirigent Kaspar Männiga esitletakse tööprotsessi teosega, et avada uudisteose tagamaid. Proovis vestleme heliloojaga teosest, mängime lõike teosest ja otsime koos heliloojaga kõladetaile. Teos on pühendatud Kaija Saariaho mälestusele ja tuleb esiettekandele 5. oktoobril samas, Mustpeade majas kontserdil "Hommage a Kaija Saariaho".

Piletid: Sissepääs tasuta'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1002 AND starts_at = '2024-09-30T17:30');

-- 1003: eccm.ee 11, 2024-10-03T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1003, '2024-10-03T19:00', NULL, NULL, 'ECCM', '',
   '', '', 'improtest', NULL, 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 11);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1003, 'et', 'improtest-kristin-kuldkepp',
   'Improtest: Kristin Kuldkepp', 11,
'Kris Kuldkepp on Hamburgis resideeruv eksperimentaalse muusika esitaja ja etenduskunstnik. Tema muusikat on iseloomustatud kui sünergiat rikkalikke harmooniliste tekstuuride ja müramuusika vahel. Improtestil astub Kris üles akustilise soolokontrabassi programmiga, ühendades oma muusikalised juured klassikalises muusikas põnevate uute mängutehnikate ja -viisidega ning luues seeläbi ainulaadseid helimaailmu.

1. aastal asutas Kris koos eksperimentaalse muusika esitaja ja kuraatori Jeff Surakiga (Washington DC) duo Bad Groupy, mis uurib improviseeritud ja konstrueeritud helikunsti. Koos loovad nad kütkestavaid helistruktuure, mis vaidlustavad tavapäraseid arusaamu eksperimentaalsest muusikast.

Improtest on aastast 2005 toimuv rahvusvaheline improvisatsioonilise muusika sari mille kuraatorid on Mart Soo ja Taavi Kerikmäe

Partnerid:
Eesti Kultuurkapital, Eesti nüüdismuusika keskus, muusikalinn Tallinn'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1003 AND starts_at = '2024-10-03T19:00');

-- 1004: eccm.ee 2, 2024-10-05T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1004, '2024-10-05T19:00', NULL, NULL, 'Mustpeade maja valge saal', 'Pikk 26, Tallinn',
   'https://www.piletilevi.ee/est/piletid/muusika/klassika/hommage--kaija-saariaho-441698/', 'https://www.filharmoonia.ee/kontserdid/kontsert/1721-hommage-a-kaija-saariaho', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_saariaho-kontsert.jpeg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 2);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1004, 'et', 'hommage-a-kaija-saariaho',
   'Hommage à Kaija Saariaho', 2,
'Kontsert on pühendatud mullu lahkunud tunnustatud soome heliloojale Kaija Saariahole (14. X 1952 kuni 2. VI 2023), kes on mitmel puhul ka ise Eestis käinud ning eesti heliloojatega kontakti hoidnud ja mõttevahetusi pidanud. Kõigi ühiste mälestuste hoidmiseks ühendavad Tallinna Kammerorkester, Eesti Nüüdismuusika Keskus ja helilooja Helena Tulve jõud ning toovad Saariaho sünnipäevakuul kuulajate ette helilooja mälestuskontserdi.

„Muusika on sama vajalik ja salapärane nagu armastus. Elav muusika on ime, mis vajab vaikust, hoolt ja kuulamist.“ Kaija Saariaho

Esinevad:

**Jean-Baptiste Barrière** (elektroonika ja video)
**Maria Valdma** (sopran)
**Leho Karin** (tšello)
**ansambel U:**
**Eesti Elektroonilise Muusika Seltsi ansambel- EMA**
**Tallinna Kammerorkester**
dirigent **Kaspar Mänd**

Kavas:

**Jean-Baptiste Barrière** - „Contemplation“
**Kaija Saariaho**, „Miranda'' s lament“
**Kaija Saariaho**, „Petals“
**Helena Tulve**, "Vers l''autre clarté" (esiettekanne)
**Kaija Saariaho**, „Lichtbogen“

Kontsert algab lühikese vestlusega helilooja Jean-Baptiste Barrière’ga.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1004 AND starts_at = '2024-10-05T19:00');

-- 1005: eccm.ee 5, 2024-10-18T00:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1005, '2024-10-18T00:00', '2024-10-19T23:59', NULL, 'ECCM, Kanuti Gildi SAAL', '',
   'https://fienta.com/et/ule-heli-2024', 'https://www.ule-heli.ee/index.html', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_ule-heli24.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 5);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1005, 'et', 'ule-heli-2024',
   'Üle Heli 2024', 5,
'Helikunsti- ja muusikafestival Üle Heli 24 toimub 17.-20. oktoobril. Alates 2015.a. toimuv festival keskendub žanrimääratluste asemel muusika ja heli tähendusele ning seostele erinevate kunstivaldkondadega. Käesoleva aasta festivali teemaks on “heli ja kujutlus”, mille vahendusel vaatleme erinevate helide taga olevat kujutluspotentsiaali. Festivali erinevates formaatides sündmused kontsertitest kuni näituseni toimuvad seekord teineteise lähedal Kanuti Gildi SAALis ja keldriruumis ning Eesti Nüüdismuusika Keskuse ruumides Mustpeade maja keldrikorrusel.

Kavas Eesti Elektroonilise Muusika Seltsi Ansambel EMA, Küberstuudio, Kris Kuldkepp "Music for Tropical Storms, First Inversion", Timo Toots, Tencu, Aivar Tõnso, Lokaalraadio installatiivne keskkond (Raul Keller, Hello Upan, Katrin Essenson), Sten Saarits "Mitte segada", Kristjan Kannukene "9", Henri Hütt & Algorütmid "Meta-arheoloogiline aktsioon „Väljad"", Dilian, Juhan Vihterpal, Meisterjaan, Tõnis Koppel, John Grzinich "Ice Tectonics", Sofia Zaiceva, Mari-Liis Rebane, Jaanika Arum, Helen Västrik, John Chantler, Galaktlan ja teised

Festivali toetavad Kultuurkapital, Kultuuriministeerium ja Muusikalinn Tallinn
NB! Üksikpiletid alates 7.oktoobrist'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1005 AND starts_at = '2024-10-18T00:00');

-- 1006: eccm.ee 1 and 7, 2024-10-26T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1006, '2024-10-26T19:00', NULL, NULL, 'ECCM saal', 'Pühavaimu 9, Tallinn',
   'https://fienta.com/et/duod-i', 'https://tarmo.uuu.ee/duos', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_lained-laiem.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 1);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1006, 'et', 'duod-i',
   'DUOD I', 1,
'"DUOD" on Tarmo Johannese kureeritud sari muusikast flöödile ja veel ühele esitajale. Tarmo Johannese partneriteks on hooaja jooksul neli suurepärast interpreeti - Merje Roomere (viiul), Fie Schouten (bassklarnet, Holland), Iris Oja (hääl), Gunnhildur Einarsdottir (harf, Island/Saksamaa).

Esimesel kontserdil on partneriks **Merje Roomere** (viiul).

Kontserdid toimuvad koostöös Eesti Nüüdismuusika Keskusega ENMK saalis ning pakuvad kuulamiseks hoolega valitud tänapäevast kammermuusikat kõrgetasemelises esituses'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1006 AND starts_at = '2024-10-26T19:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1006, 'en', 'duos-i',
   'DUOS I', 7,
'The series "DUOS" is curated by Tarmo Johannes and features music for flute and one other performer. Throughout the season, Tarmo Johannes will collaborate with four outstanding musicians: Merje Roomere (violin), Fie Schouten (bass clarinet, Netherlands), Iris Oja (voice), and Gunnhildur Einarsdottir (harp, Iceland/Germany).

In the first concert the parter is **Merje Roomere** (violin).

Program:

**Franco Donatoni** - "Ciglio II" (1993) for flute and violin
**Tristan Murail** - "Unaswered questions" (1995) for solo flute
**Stefano Gervasoni** - "Due voci" (1991) for flute and violin
**Tatjana Kozlova-Johannes** - "Lovesong" (2010) for flute and violin
**Kaija Saariaho** - "Nocturne" (1994) vor solo violin
**Oscar Bianchi** - "De Rerum Natura" (2001) for flute and violin'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1006 AND starts_at = '2024-10-26T19:00');

-- 1007: eccm.ee 10, 2024-11-08T00:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1007, '2024-11-08T00:00', '2024-11-10T23:59', NULL, 'ECCM', '',
   '', '', 'eccm', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_screenshot-2024-10-25-at-13-06-41.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 10);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1007, 'et', 'konverents-tulevik-laks-meist-mooda',
   'Konverents "Tulevik läks meist mööda"', 10,
'Konverentsi ja sellega seotud kontsertprogrammi fookuses on analoogtehnoloogial põhinevate helimasinate agentsus.

Nagu Nüüdismuusika keskuse konverentsidel traditsiooniks, tõmbame paralleele teiste kultuurivaldkondadega, vaatame kuidas mõjutas küberneetika Nõukogude Eesti kunsti ja arhitektuuri, mida võib oksüdeerunud tehnoloogia kohta välja lugeda teadusulmest ja millised on loomevaldkonna praktikad, ootused ja hirmud seoses tänase tipptehnoloogiaga. Mineviku ja tuleviku utoopiate põimumise teemadel kutsume koos küberpungi põlvkonna praktikutega debateerima nii tehisintellekti-optimiste kui -kriitikuid, innovatsiooni apologeete ja tehnoloogiate ajaloo mõtestajaid.

Ajakava
**Reede, 8. November**
**17.00 Näituse "Primaarid" avamine ja vestlusring**
**Kaarel Kurismaa, Kiwa, Härmo Härm, Margo Kõlar, Taavi Kerikmäe**
**19.00** Kontsert **"Drosseli Ringid"** Mustpeade Maja Valges saalis
**Kavas Õie-Olinda Sachermann ja Sven Grünbergi muusika ajastu instrumentidel.**
Esitaja: Eesti elektroonilise muusika seltsi ansambel EMA
**21.00 Robert Dick Trio, Eesti Nüüdismuusika keskuse saalis, Pühavaimu 9**
**Laupäev, 9. november**
Konverents Nüüdismuusika keskuse saalis
**(inglise keeles)**
**10.00** Taavi Kerikmäe **Õie-Olinda Sachermani fenomen**

**10.30** Mikko Ojanen **Stuudio utoopiad ja düstoopiad : Erkki Kurenniemi ja elektronmuusika stuudiod 1960nsdatel**

**11.00** Nina Stener Jørgensen **Torni võim: Nicolas Schöfferi Küberneetikat ja Osalusarhitektuurist 1970ndatel**

**11.30** Tarmo Johannes **T****t****- Early Interactive Works of Udo Kasemets**
**12.00 Erica Synths presents:** **Elektor Formant system for Tallinn 1965**
**12.15** Vestlusring
**16.00 Hainbachi** töötuba (eraldi piletiga)
**19.00 Kasemets - Kurenniemi kontsert Nüüdismuusika keskuse saalis**
**DND Dialogue - DIM duo Mikko Ojanen /Jari Suominen**
**Kontsert-installatsioon Udo Kasemets - Eesti Elektroonilise Muusika Ansambel EMA**
**Pühapäev 10. november**
**Konverents Nüüdismuusika keskuse saalis**
**11.00** Jaagup Irve **Loomeinimene ja Masinloome**
**11.30** Kristjan Jansen
**Virtuaalsete etenduskunstide ja muusikainstallatsioonide taaselustamine**
**12.00** Tõnis Kahu
**12.30** kohvipaus
**13.00** Andrus Laansalu **AJA MÜRA [Kui muusikat ei ole kuulda, kas ta siis on olemas?]**
**13.30** Jaak Tomberg **Alternatiivajalugude lepitav otstarve**
**14.00** Vestlusring
**15.00** Konverentsi LÕPP'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1007 AND starts_at = '2024-11-08T00:00');

-- 1008: eccm.ee 15, 2024-11-08T17:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1008, '2024-11-08T17:00', NULL, NULL, 'ECCM', '',
   'https://fienta.com/et/tallinn-1965-tulevik-laks-meist-mooda', 'https://eccm.ee', 'eccm', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_screenshot-2024-10-25-at-13-06-41.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 15);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1008, 'et', 'naitus-primaarid-ja-vestlusring',
   'Näitus "Primaarid" ja vestlusring', 15,
'Primaarid on näitus esimestest. Välja on toodud masinad ja instrumendid, mis on olnud teerajajaks: aidanud luua enneolematuid kõlavälju, täiesti uusi muusikastiile, uusi mõtlemisviise helist. Nad kannavad endas elegantset instrumendiehitusdisaini, aga veelgi olulisemana- määratut potentsiaali, sest nende agentsus on avatud vormiga. Näituse avamisel mängivad Kaarel Kurismaa ja Kiwa ja instrumentide teemal vestlevad Margo Kõlar, Taavi Kerikmäe ja Mikko Ojanen.

Näitusel on eksponeeritud ligi 15 pilli, millest enamust olete te varem näinud vaid fotodelt või väga kaugelt.

- Buchla 100 on 1960ndatel Don Buchla loodud süntesaator, mille tellijaks oli California Tape Music
Center. Sellisel Buchla süsteemil on loodud näiteks Morton Subotnicku album "Silver Apples of the
Moon" (1967).
Igor Zubkovi String Exiter on Tallinnas Taavi Kerikmäe tellimusel ehitatud eksperimentaalne
elektromagnet, millega mängitakse muusikainstrumentide metallkeeltel.

- Springer Tempophon on 1950ndatel loodud seade, mis võimaldab salvestuse kiirust muuta ilma selle
helikõrgust mõjutamata, samuti võimaldab see muuta helikõrgust, jättes kiiruse samaks. Springeri
Tempophoni kasutati Stanley Kubricku 1968. aastal loodud filmis "2001: A Space Odyssey" AI
süsteemi HAL 900 hääle modifitseerimiseks. Eksponeeritud Tempophon pärineb Bukaresti raadio
stuudiost.

- Serge modulaarne süntesaator (Serge modular synthesizer) on Serge Tcherepnini poolt 1970ndate
alguses disainitud süntesaator. Eksponeeritud süntesaator on varase generatsiooni nn Paperface
variant, mis pärineb 1970ndate aastate keskpaigast. Süntesaator kuulus algselt USA heliloojale
Michael Manionile, kes on töötanud ka Karlheinz Stockhauseni assistendina.

- Hohner electronium on instrumendidisaineri René Seyboldi loodud lampidega süntesaator ja selle
juurde kuuluv võimendi, mida Hohner tootis alates 1950. aastast. Sellist instrumenti kasutas
Stockhauseni grupp niisuguste teoste nagu Pole, Kurzwellen jne ettekannetel 1960ndatel aastatel.

- BEAG AKX-200 lindikaja (BEAG tape delay) on 1970ndatel aastatel Ungaris toodetud seade. Näitusel
eksponeeritud kajamasinat kasutas Sven Grünberg oma 1970ndate ja 1980ndate aastate
elektroonilises loomes, sh "Hukkunud alpinisti hotelli" filmile muusika loomiseks.

- Clavioline on 1950ndatest pärit lampidaga süntesaator, millest on loodud arvukalt versioone. Sellist
instrumenti kasutas Sven Grünberg oma legendaarsetel albumitel "Hingus" ja "OM".

- Retakord on võimendi ja kõlariga elektriorel, mida toodeti raadiotehases Punane RET aastatel
1965 kuni 1975. Tegemist oli Nõukogude Liidu esimese tööstuslikult toodetud mitmehäälse
elektrioreliga. Oreli disain ja tehniline lahendus põhinesid Heino Kalmo loomingul.

- Teremin (Theremin) on üks varaseimaid elektroonilise muusika instrumente. Selle lõi 1920ndatel
aastatel Leon Teremin. Eksponeeritud instrument on Bob Moogi 1996. aastal loodud mudel
Etherwave.

- Alesis HR 16 trummimasin on 1980ndatest pärit seade, millel Sven Grünberg on loonud animafilmi
"Naksitrallid" (1984) rütmiträkid.
- Vaharullisalvestaja ja -mängija on üks varaseimad helisalvestusseadmeid, mis arendati välja 19.
sajandi lõpus. Eksponeeritud seade on pärit 20. sajandi algusest, arvatavalt mõnest postijaamast.

- Brüel & Kjaer 1022 on 1960ndatest pärit laboratoorne lampidega ostsillaator, mida kasutasid oma
varases elektroonilises loomes olulised elektroonilise muusika stuudiod Milanos ja Kölnis, samuti
BBC-s.

- Härmo Härmi loodud modulaarsüntesaator pärineb 1970ndate lõpust. Härm ehitas selle Kaarel
Kurismaale.

Erkki Kurenniemi elektroonilised muusikainstrumendid
Soome elektroonilise muusika pioneer Erkki Kurenniemi (1941 kuni 2017) kavandas ja ehitas aastatel
1964 kuni 1975 kümme ainulaadset elektroonilist muusikariista. Kurenniemi püüdis oma
instrumentidega lahendada tolle aja keskset probleemi, aeganõudval lindimanipulatsioonil põhinev
stuudiotöö oli kohmakas. Kurenniemi idee oli asendada see automatiseeritud ja algoritmiliste
kompositsiooni- ja muusikaloomeprotsessidega. Tema arvutipõhine lähenemine uue muusika
loomisele oli inspireeritud Columbia-Princetoni Elektroonilise Muusika Keskusest ja ka Rootsis
Stockholmis asuva Elektronmusikstudioni varajastest disainiideedest. Kurenniemi ehitas oma
varased "digitaalsed" süntesaatorid mikrokiipe kasutades ja arendas oma instrumentide jaoks välja
mälumoodulid. Need olid 1960ndate aastate elektroonilise muusikariista jaoks päris ootamatud
tehnilised lahendused.
Näitusel on esindatud kaks Kurenniemi pilli, mida saab kuulata laupäevaõhtusel kontserdil. DICO
(1969. aasta originaalinstrumendi põhiliidese koopia) on 12-astmeline sekventser-süntesaator, mille
Kurenniemi ehitas Soome heliloojale Osmo Lindemanile. Instrumendi programmeerimiseks
puudutatakse maandusega ühendatud metalltihvte, lülitades neile vastavaid kahendkoodi kümmet

bitti sisse või välja. DIMI-A (1970) on kahe heligeneraatoriga 256-astmeline sekventser-süntesaator.
Instrumendi programmeerimiseks puudutakse metallplaate kahe puutepliiatsiga.
[vimeo.com/80931815](https://vimeo.com/80931815)

Piletid: Üritus on tasuta. 910.11 on näitus on avatud konverentsi külalistele: [fienta.com/et/tallinn-1965-tulevik-laks-meist-mooda](https://fienta.com/et/tallinn-1965-tulevik-laks-meist-mooda)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1008 AND starts_at = '2024-11-08T17:00');

-- 1009: eccm.ee 14, 2024-11-08T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1009, '2024-11-08T19:00', NULL, NULL, 'Mustpeade Maja', '',
   'https://fienta.com/et/ema-kontsert-drosseli-ringid', 'https://eccm.ee', 'eccm', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_drosseli-ringid-fb-banner.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 14);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1009, 'et', 'ema-kontsert-drosseli-ringid',
   'EMA kontsert "Drosseli Ringid"', 14,
'Esitusele tuleb arvatavalt esimese Eesti elektroonilise muusika naishelilooja Õie-Olinda Sachermanni (1915-..) taasavastatud elektroakustilised kompositsioonid 1950-60 ndatest aastatest ja Sven Grünbergi muusika oma ajastu instrumentidel. EMA on toonud lavale Grünbergi varase elektroonilise muusika elustades legendaarsed stuudiosalvestused elusas ettekandes.

Sachermanni kohta on väga vähe informatsiooni, pole teada, kus Sacherman töötatas, aga arvatavasti oli tal ligipääs Eesti Raadio tehnikale, millest annab tunnistust toona kasutusel olnud drossel-võnkekringide eriline kõla. Kompositsioonide esitajaks on Eesti elektroonilise muusika seltsi ansambel EMA.

Kontsert toimub Eesti Nüüdimsuusika Keskuse iga aastase konverentsi raames, mis sel aastal, pealkiraja all "Tulevik läks meist mööda", räägib tehnoloogilisest innovartsioonist, täpsemalt ja eestikeelsemalt, muusikariistadest. arutleme instrumentide rolli üle muusika aga ka laiemalt kunsti loomisel.

Piletid: Kontserdi piletid [fienta.com/et/ema-kontsert-drosseli-ringid](https://fienta.com/et/ema-kontsert-drosseli-ringid) 15/25 ja kohapeal 20/30'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1009 AND starts_at = '2024-11-08T19:00');

-- 1010: eccm.ee 18, 2024-11-08T21:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1010, '2024-11-08T21:00', NULL, NULL, 'Eesti Nüüdismuusika keskus', '',
   'https://fienta.com/et/robert-dick-trio-improtestil?c82119d45cc0c537da4b63b99ebad23c', 'https://eccm.ee', 'improtest', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_screenshot-2024-11-05-at-16-22-09.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 18);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1010, 'et', 'robert-dick-trio-improtestil',
   'Robert Dick trio Improtestil', 18,
'Robert Dick Scandinavian Trio koosseisus Niels Præstholm ja Christian Windfeld.

Trios kohtuvad maailma üks viljakamaid flöödimängijaid Robert Dick ja kaks Taani juhtivat improviseerijat. Nende muusikat võib kirjeldada kui ainulaadset helide ja rütmide sulamit. Kaasaegse flöödimuusika liidrina maailmas tuntud Robert Dick kehastab renessansikunstniku ideaali. Ühtviisi sügavate juurtega klassikalises ja uues muusikas ning vabas improvisatsioonis ja uues jazzis, on ta end tõestanud artistina, kes mitte ainult ei valda suurepäraselt pilli, vaid on selle ka ümber defineerinud. Roberti muusika kannab endas nägemust pidevast muutumisest ja otsingutest. Ta ammutab ideid džässitraditsioonist, maailmamuusikast ,(eriti India ja Aafrika), elektroonilisest muusikast ning loodushelidest. Tema loomingu tunnusteks on struktuuri selgus ja uskumatult lai tämbriline mitmekesisus.

Robert Dick Scandinavian Trio koosseisus Niels Præstholm ja Christian Windfeld.
Trios kohtuvad maailma üks viljakamaid flöödimängijaid Robert Dick ja kaks Taani juhtivat improviseerijat.

Nende muusikat võib kirjeldada kui ainulaadset helide ja rütmide sulamit. Kaasaegse flöödimuusika liidrina maailmas tuntud Robert Dick kehastab renessansikunstniku ideaali. Ühtviisi sügavate juurtega klassikalises ja uues muusikas ning vabas improvisatsioonis ja uues jazzis, on ta end tõestanud artistina, kes mitte ainult ei valda suurepäraselt pilli, vaid on selle ka ümber defineerinud. Roberti muusika kannab endas nägemust pidevast muutumisest ja otsingutest. Ta ammutab ideid džässitraditsioonist, maailmamuusikast ,(eriti India ja Aafrika), elektroonilisest muusikast ning loodushelidest. Tema loomingu tunnusteks on struktuuri selgus ja uskumatult lai tämbriline mitmekesisus.

Bassist Niels Præstholm on Taani ja rahvusvahelise džässi- ja improvisatsioonilise muusika veteran. Lõpetas 1990. aastal Kopenhaagenis Rütmimuusika Konservatooriumi. Præstholm on pälvinud mitmeid tunnustusi nii heliloojana kui ka oma ansamblite juhina ning paljude artistide ansamblikaaslasena. Improviseerija ja heliloojana on Præstholm oma ansamblitega Embla ja Gyroscope String Trio tuntud põhjamaise jazzi eelkäijana. Præstholm on tuuritanud rahvusvaheliselt ja salvestanud koos selliste artistidega nagu Michael Gregory Jackson, Django Bates, Kresten Osgood, Mart Soo, John Tchicai, Butch Lacy ja paljud, paljud teised. Lisateavet leiate veebisaidilt [www.nielspraestholm](http://www.nielspraestholm/)

Christian Windfeld on Taani improvisaator, helilooja, löökpillimängija,lõpetanud Taanis Aarhusi Kuningliku Muusikaakadeemias.

Alates 19. eluaastast on ta olnud väga tegev, tuuritades kõikjal Euroopas, Põhja-Ameerikas ja Austraalias ning elanud Stockholmis, New Yorgis ja Berliinis. Windfeldil on minimalistlik, kuid väga väljendusrikas lähenemine löökpillidele, vähendades sageli oma võimalusi, et keskenduda vaid ühele ühikule trummisetist, nt.soolotrummile, et uurida kõiki pakutavaid võimalusi.

[www.christianwindfeld.com](http://www.christianwindfeld.com/)

Bassist Niels Præstholm is a veteran in Danish and international jazz and improvised music. Graduate from the Rhytmic Music Conservatory in Copenhagen in 1990. Præstholm has received multiple honors, both as a composer and a leader of his own ensembles and as a sideman for

numerous artists. As a improviser and composer Præstholm has a reputation as a forerunner in Scandinavian jazz

with his ensembles Embla and Gyroscope String Trio. Præstholm has toured internationally and recorded with artists like Michael Gregory Jackson, Django Bates, Kresten Osgood, Mart Soo, John Tchicai, Butch Lacy, and many, many more. Read more on [www.nielspraestholm.dk](http://www.nielspraestholm.dk/)

Christian Windfeld is a Danish Improviser, Composer, Percussionist and educated soloist from The Royal Academy of Music in Aarhus, Denmark. Since the age of 19 he has build an international career touring all over Europe, North America and Australia and lived in Stockholm, New York and Berlin. Windfeld has a minimalist but highly expressive approach to the percussive instruments often reducing his set-up to focus on just one instrument e.g. the snare drum to explore its full potential aiming to transcend the general perception of its capabilities.

[www.christianwindfeld.com](http://www.christianwindfeld.com/)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1010 AND starts_at = '2024-11-08T21:00');

-- 1011: eccm.ee 16, 2024-11-09T16:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1011, '2024-11-09T16:00', NULL, NULL, 'ECCM', '',
   'https://fienta.com/et/tallinn-1965-tulevik-laks-meist-mooda-108790', 'https://eccm.ee', 'eccm', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_screenshot-2024-10-25-at-13-06-41.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 16);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1011, 'en', 'hainbachi-lindiloikamise-tootuba',
   'Hainbachi lindilõikamise töötuba', 16,
'Hainbach is a German [experimental](https://en.wikipedia.org/wiki/Experimental_music) [electronic music](https://en.wikipedia.org/wiki/Electronic_music) [composer](https://en.wikipedia.org/wiki/Composer) and [video creator.](https://en.wikipedia.org/wiki/Video_creator)He has become known internationally for his [ambient](https://en.wikipedia.org/wiki/Ambient_music) recordings and experimental music techniques on his [YouTube](https://en.wikipedia.org/wiki/YouTube) channel. [Pitchfork](https://en.wikipedia.org/wiki/Pitchfork_(website)) described Hainbach''s channel as "a treasure trove of clips with titles like ''How to Make Music With a Vintage Piano Tuner'' and ''Playing Live With Nuclear Instruments and Unknown Synths.

Tickets: Piletite arv piratud : [fienta.com/et/tallinn-1965-tulevik-laks-meist-mooda-108790](https://fienta.com/et/tallinn-1965-tulevik-laks-meist-mooda-108790)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1011 AND starts_at = '2024-11-09T16:00');

-- 1012: eccm.ee 17, 2024-11-09T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1012, '2024-11-09T19:00', NULL, NULL, 'ECCM', '',
   '', 'https://eccm.ee', 'eccm', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_screenshot-2024-10-25-at-13-06-41.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 17);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1012, 'et', 'kasemets-ja-kurenniemi',
   'Kasemets ja Kurenniemi', 17,
'Kontsert-installatsioon Udo Kasemets: Tt - tribute to Buckminster Fuller, Marshall McLuhan, John Cage" (1968)

Esinevad: Eesti Elektroonilise Muusika Ansambel EMA ja Mikko Ojanen.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1012 AND starts_at = '2024-11-09T19:00');

-- 1013: eccm.ee 19, 2024-11-14T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1013, '2024-11-14T19:00', NULL, NULL, 'ECCM', '',
   '', '', 'tuma', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_soundplasma.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 19);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1013, 'et', 'sound-plasma',
   'Sound Plasma', 19,
'Tallinna Uue Muusika Ansambel ja EMTA tudengid'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1013 AND starts_at = '2024-11-14T19:00');

-- 1014: eccm.ee 133 and 132, 2024-11-23T19:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1014, '2024-11-23T19:00', NULL, NULL, 'ECCM', 'Pühavaimu 9, Tallinn',
   '', 'https://tarmo.uuu.ee/duos-eng', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_lained-laiem.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 133);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1014, 'et', 'duod-ii',
   'DUOD II', 133,
'"DUOD" on Tarmo Johannese kureeritud sari muusikast flöödile ja veel ühele esitajale.

Sarja teisel kontserdil on partneriks **Fie Schouten** (klarnet, bassklarnet, bassethorn, Holland)

Kontsert on pühendatud Tarmo ja Fie õpetajatele **Harrie Starreveld** ja **Harry Sparnaay**.

Kavas:

**Giacinto Scelsi** (1905-1988) "Ko Lho" (1966) flöödile ja klarnetile
**Betsy Jolas** (1926) "Lovemusic" (2005) flöödile ja bassklarentile
**Helena Tulve** (1972) "Feathers Falling" (2024) bassflöödile
**Emre Dündar** (1972) "Uptalk" (2021) bassflöödile ja bassklarnetile
**Guus Janssen** (1951) "...van horen zingen..." (2020) bassethornile
**Fabio Nieder** (1957) "Duale B" (1990) alt-/bassflöödile ja bassethornile/bassklarnetile'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1014 AND starts_at = '2024-11-23T19:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1014, 'en', 'duos-ii',
   'DUOS II', 132,
'The series "DUOS" is curated by Tarmo Johannes and features music for flute and one other performer.

In the second concert the parter is **Fie Schouten** (bass clarinet, Netherlands)

The concert is dedicated to the teachers of Tarmo and Fie **Harrie Starreveld** ja **Harry Sparnaay**.

Program:

**Giacinto Scelsi** (1905-1988) "Ko Lho" (1966) for flute and clarinet
**Betsy Jolas** (1926) "Lovemusic" (2005) for flute and bass clarinet
**Helena Tulve** (1972) "Feathers Falling" (2024) for solo bass flute
**Emre Dündar** (1972) "Uptalk" (2021) for bass flute and bass clarinet
**Guus Janssen** (1951) "...van horen zingen..." (2020) for bassethorn
**Fabio Nieder** (1957) "Duale B" (1990) for alto/bass flute and bassethorn/bass clarinet'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1014 AND starts_at = '2024-11-23T19:00');

-- 1015: eccm.ee 20, 2024-12-05T18:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1015, '2024-12-05T18:00', NULL, NULL, '', '',
   'https://docs.google.com/forms/d/e/1FAIpQLSc9fgsA5gH-lNsxH_8L1mztF6YRnioVPtiLLa_FC9-y5pSlyg/viewform', '', 'koostoo', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_screenshot-2024-11-21-at-12-42-14.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 20);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1015, 'et', 'eka-emta-ja-bfm-teaduskohvik',
   'EKA, EMTA ja BFM Teaduskohvik', 20,
'**Jätkame loovuurimuslike praktikate tutvustamist, seekord fookusega uurimistulemuste rakendustel.**

Oma käimasolevaid projekte tutvustavad ja vestlusringis osalevad Toomas Siitan, Taavi Kerikmäe (EMTA), Taavet Jansen (EKA), Michael Keerdo-Dawson (TLÜ BFM), Ekke Västrik (EMTA), Katrin Kabun (EKA); vestlust modereerib muusikateadlane ja dirigent Toomas Siitan (EMTA).

Lisaks vestlusringile tutvustab Toomas Siitan projekti “Cembal d’amouri taassünd” põnevat ja Eestiga seotud tausta. Seejärel saabki kuulata 18. sajandi jooniste järgi valminud iseäralikku instrumenti _cembal d’amour_ (eesti k armastuse klavikord). Esinevad Taavi Kerikmäe ja Anna-Liisa Eller (kannel).

Pakume teed-kohvi ja suupisteid.

Piletid: Sissepöös tasuta: palume registreeruda hiljemalt 3. detsembril: [docs.google.com/forms/d/e/1FAIpQLSc9fgsA5gH-lNsxH_8L1mztF6YRnioVPtiLLa_FC9-y5pSlyg/viewform](https://docs.google.com/forms/d/e/1FAIpQLSc9fgsA5gH-lNsxH_8L1mztF6YRnioVPtiLLa_FC9-y5pSlyg/viewform)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1015 AND starts_at = '2024-12-05T18:00');

-- 1016: eccm.ee 8 and 9, 2024-12-29T18:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1016, '2024-12-29T18:00', NULL, NULL, 'ECCM saal', '',
   '', 'https://uuu.ee/', 'u', (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_u-punane.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 8);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1016, 'et', 'u-vana-aasta-uue-muusika-kontsert-2024-12-29',
   'U: vana-aasta uue muusika kontsert', 8,
'U: vana-aasta uue muusika konsert, vaatega möödunud ja tulevale aastale.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1016 AND starts_at = '2024-12-29T18:00');
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1016, 'en', 'u-end-of-the-year-concert',
   'U: end-of-the-year-concert', 9,
'Ensemble U:''s end of the year new music concert.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1016 AND starts_at = '2024-12-29T18:00');

