-- seed-step12-english.sql: the English side of every published event, and the faults of the same kind met on the
-- Estonian side (asked 2026-11-06: "english data is a mess. can you fix it?"). eccm.ee’s English pages were read
-- once each that day (every event in its two English lists, one request a second, cached) and compared with the
-- local database: eccm.ee has English for the events that already had it here, and for Dream Sequence of an
-- Ancient Forest, which comes from its English page; every other event’s English page carries the Estonian text,
-- so its English here is a translation, faithful to the Estonian, names, works and places kept, for ECCM to
-- review. The eight events with only an English text get an Estonian one the same way, COMP 2027 among them,
-- which is why it was missing from the Estonian lists. The texts are in the shape of the earlier seeds: markdown,
-- dashes written as commas and colons, ranges as "to" and "kuni".
--
-- The venue in English sits on the English text row, event_text.venue (migrations/0012_venue_per_language.sql),
-- and an empty one falls back to event.venue; apply that migration first.
--
-- Runs twice without harm: a text only where its event has none in that language, every change only while the
-- row still holds the value read here, a venue only where none is typed. Apply after seed-step11-sync-2026-11-06.sql.

-- 1. Data faults, each guarded by the value read here before.
-- 28, Schönbergi sari 8.12: step 11 set its venue and picture only where it had no picture, and staging had the
-- placeholder Schönberg picture, so neither landed there (local was right). The same for the picture of 25, 19.11.
UPDATE event SET venue = 'Eesti Nüüdismuusika Keskus', address = 'Pühavaimu 9, Tallinn', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1
  WHERE id = 28 AND venue = '' AND address = '';
UPDATE event SET image_id = (SELECT id FROM media WHERE key = 'media/fbdd50b07bc99171a7a91c5b2e31c7eb2a743a9138a7033d63b2da980c5ffb83.jpg'), updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1
  WHERE id = 28 AND (image_id IS NULL OR image_id = (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_558d761d-3ef9-4d73-a3f1-27d3372b760d.png')) AND (SELECT id FROM media WHERE key = 'media/fbdd50b07bc99171a7a91c5b2e31c7eb2a743a9138a7033d63b2da980c5ffb83.jpg') IS NOT NULL;
UPDATE event SET image_id = (SELECT id FROM media WHERE key = 'media/8319a6246223d45cbf565d5dbacdcffd8fc157cf57d276395af766d5e3c19131.png'), updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1
  WHERE id = 25 AND (image_id IS NULL OR image_id = (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_558d761d-3ef9-4d73-a3f1-27d3372b760d.png')) AND (SELECT id FROM media WHERE key = 'media/8319a6246223d45cbf565d5dbacdcffd8fc157cf57d276395af766d5e3c19131.png') IS NOT NULL;
-- 1205, COMP 2027: both languages in one venue, eccm.ee writes them with a dash between
UPDATE event SET venue = 'Pärnu Eliisabeti kirik', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1 WHERE id = 1205 AND venue = 'Pärnu Eliisabeti kirik, St. Elizabeth''s Church, Pärnu';
-- 1057, Residentuu:r 3, 2026: Pikk 26 is the House of the Blackheads, and eccm.ee’s English page says Olavi Hall
UPDATE event SET venue = 'Mustpeade maja Olavi saal', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1 WHERE id = 1057 AND venue = 'ECCM saal';
-- 1041, Residentuu:r 1, 2026: the English name was in the Estonian column
UPDATE event SET venue = 'Mustpeade maja Olavi saal', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1 WHERE id = 1041 AND venue = 'Olavi Hall, House of the Blackheads';
-- 1046, DUOS V: a letter missing
UPDATE event SET venue = 'Tallinna Muusika- ja Balletikool, suur kammersaal', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1 WHERE id = 1046 AND venue = 'Tallinna Muusika ja Balletiool, suur kammersaal';
-- 1045, the address was in the venue as well as the address
UPDATE event SET venue = 'Eesti Nüüdismuusika Keskus, Mustpeade maja', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1 WHERE id = 1045 AND venue = 'Eesti Nüüdismuusika Keskus (Mustpeade maja, Pikk 26, Tallinn)';
-- 1035, the address was in the venue
UPDATE event SET venue = 'Mustpeade maja', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1 WHERE id = 1035 AND venue = 'Mustpeade maja Pikk 26';
-- 1017, the capital
UPDATE event SET venue = 'Eesti Nüüdismuusika Keskus', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1 WHERE id = 1017 AND venue = 'Eesti Nüüdismuusika keskus';
-- 1010, the capital
UPDATE event SET venue = 'Eesti Nüüdismuusika Keskus', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1 WHERE id = 1010 AND venue = 'Eesti Nüüdismuusika keskus';
-- 1036, no venue; its text names the place
UPDATE event SET venue = 'Eesti Nüüdismuusika Keskus, Mustpeade maja', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1 WHERE id = 1036 AND venue = '';
-- 1037, no venue; its text names Draakoni galerii, at Pikk 18
UPDATE event SET venue = 'Draakoni galerii', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1 WHERE id = 1037 AND venue = '';
-- 1033, no venue; its text names the place
UPDATE event SET venue = 'Eesti Nüüdismuusika Keskus', address = 'Pühavaimu 9, Tallinn', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1 WHERE id = 1033 AND venue = '' AND address = '';
-- 1030, no venue; its text names the studio
UPDATE event SET venue = 'Stuudio Tallinn 1965', address = 'Pühavaimu 9, Tallinn', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1 WHERE id = 1030 AND venue = '' AND address = '';

-- 2. Openings that repeat the title or say only when and where, in both languages; the page prints those above
-- the text. Each is cut only while the text still opens with exactly what was read here.
UPDATE event_text SET body = substr(body, 104) WHERE event_id = 25 AND lang = 'et' AND substr(body, 1, 103) = 'Schönbergi sari. OPUS MIRUM
N 19.11.2026 kell 19.00 Eesti Nüüdismuusika Keskus (Pühavaimu 9, Tallinn)

';
UPDATE event_text SET body = substr(body, 116) WHERE event_id = 28 AND lang = 'et' AND substr(body, 1, 115) = 'Schönbergi sari. Performance etüüdid #9
T 8.12.2026 kell 18.00
Eesti Nüüdismuusika Keskus (Pühavaimu 9, Tallinn).

';
UPDATE event_text SET body = substr(body, 19) WHERE event_id = 9 AND lang = 'et' AND substr(body, 1, 18) = 'Sound Plasma 10!

';
UPDATE event_text SET body = substr(body, 19) WHERE event_id = 9 AND lang = 'en' AND substr(body, 1, 18) = 'Sound Plasma 10!

';
UPDATE event_text SET body = substr(body, 19) WHERE event_id = 23 AND lang = 'en' AND substr(body, 1, 18) = 'Sound Plasma 10!

';
UPDATE event_text SET body = substr(body, 23) WHERE event_id = 14 AND lang = 'et' AND substr(body, 1, 22) = 'Improtest: Post Horn

';
UPDATE event_text SET body = substr(body, 232) WHERE event_id = 1052 AND lang = 'et' AND substr(body, 1, 231) = 'Schönbergi sari
N 9.4.2026 kell 19.00
Eesti Nüüdismuusika Keskus ([Pühavaimu 9, Tallinn, Estonia](https://www.bing.com/maps/default.aspx?v=2&pc=FACEBK&mid=8100&where1=P%C3%BChavaimu+9%2C+Tallinn%2C+Estonia&FORM=FBKPL1&mkt=en-GB))

';
UPDATE event_text SET body = substr(body, 102) WHERE event_id = 1045 AND lang = 'et' AND substr(body, 1, 101) = 'Schönbergi sari
N 5.3.2026 kell 19.00
Eesti Nüüdismuusika Keskus (Mustpeade maja, Pikk 26, Tallinn)

';
UPDATE event_text SET body = substr(body, 103) WHERE event_id = 1036 AND lang = 'et' AND substr(body, 1, 102) = 'Schönbergi sari
N 11.9.2025 kell 19.00
Eesti Nüüdismuusika Keskus (Mustpeade maja, Pikk 26, Tallinn)

';
UPDATE event_text SET body = substr(body, 90) WHERE event_id = 1033 AND lang = 'et' AND substr(body, 1, 89) = 'Schönbergi sari
N 15.5.2025 kell 20.00
Eesti Nüüdismuusika Keskus (Pühavaimu 9, Tallinn)
';
UPDATE event_text SET body = substr(body, 24) WHERE event_id = 1020 AND lang = 'et' AND substr(body, 1, 23) = '**URR-45: Defitsiit**

';
UPDATE event_text SET body = substr(body, 15) WHERE event_id = 1043 AND lang = 'et' AND substr(body, 1, 14) = 'tencu/samson

';
UPDATE event_text SET body = substr(body, 52) WHERE event_id = 1030 AND lang = 'et' AND substr(body, 1, 51) = '“Stuudio Tallinn 1965”
Eesti Nüüdismuusika Keskus

';
UPDATE event_text SET body = substr(body, 26) WHERE event_id = 1205 AND lang = 'en' AND substr(body, 1, 25) = '30.7. to 8.8.2027
Pärnu

';

-- 3. Estonian left in English texts, and English titles in Estonian, replaced only where the old words still stand.
UPDATE event_text SET body = replace(body, 'cello ja piano', 'cello and piano') WHERE event_id = 1060 AND lang = 'en' AND instr(body, 'cello ja piano') > 0;
UPDATE event_text SET body = replace(body, '10/15/25 eurot', '10/15/25 euros') WHERE event_id = 1060 AND lang = 'en' AND instr(body, '10/15/25 eurot') > 0;
UPDATE event_text SET body = replace(body, '**Harrie Starreveld** ja **Harry Sparnaay**', '**Harrie Starreveld** and **Harry Sparnaay**') WHERE event_id = 1014 AND lang = 'en' AND instr(body, '**Harrie Starreveld** ja **Harry Sparnaay**') > 0;
UPDATE event_text SET body = replace(body, 'Improtest on rahvusvaheline vabaimprovisatsioonilise muusika kontsertsari, mis toimub aastast 2005. Sarja kuraatorid on Mart Soo ja Taavi Kerikmäe. Koostööpartnerid: ECCM, Eesti Kultuurkapital, Muusikalinn Tallinn, Tallinna Filharmoonia', 'Improtest is an international concert series of freely improvised music, held since 2005. The series is curated by Mart Soo and Taavi Kerikmäe. Partners: ECCM, Cultural Endowment of Estonia, Tallinn Music City, Tallinn Philharmonic Society') WHERE event_id = 1059 AND lang = 'en' AND instr(body, 'Improtest on rahvusvaheline vabaimprovisatsioonilise muusika kontsertsari, mis toimub aastast 2005. Sarja kuraatorid on Mart Soo ja Taavi Kerikmäe. Koostööpartnerid: ECCM, Eesti Kultuurkapital, Muusikalinn Tallinn, Tallinna Filharmoonia') > 0;
UPDATE event_text SET body = replace(body, 'and South

Korea.', 'and South Korea.') WHERE event_id = 1059 AND lang = 'en' AND instr(body, 'and South

Korea.') > 0;
UPDATE event_text SET body = replace(body, 'interest in

combining', 'interest in combining') WHERE event_id = 1059 AND lang = 'en' AND instr(body, 'interest in

combining') > 0;
UPDATE event_text SET body = replace(body, 'composers

including', 'composers including') WHERE event_id = 1059 AND lang = 'en' AND instr(body, 'composers

including') > 0;
UPDATE event_text SET body = replace(body, 'Toetaja: Eesti Kultuurkapital
Partnerid: ECCM, Muusikalinn Tallinn

piletid: 15/10€', 'Supported by: Cultural Endowment of Estonia
Partners: ECCM, Tallinn Music City

Tickets: 15/10€') WHERE event_id = 1059 AND lang = 'en' AND instr(body, 'Toetaja: Eesti Kultuurkapital
Partnerid: ECCM, Muusikalinn Tallinn

piletid: 15/10€') > 0;
UPDATE event_text SET title = replace(title, 'Phil Minton / Kriton Beyer Improtestil', 'Phil Minton / Kriton Beyer at Improtest') WHERE event_id = 1051 AND lang = 'en' AND instr(title, 'Phil Minton / Kriton Beyer Improtestil') > 0;
UPDATE event_text SET title = replace(title, 'Devaux/ Girard-Charest/ Kerikmäe Improtestil', 'Devaux/ Girard-Charest/ Kerikmäe at Improtest') WHERE event_id = 1025 AND lang = 'en' AND instr(title, 'Devaux/ Girard-Charest/ Kerikmäe Improtestil') > 0;
UPDATE event_text SET title = replace(title, 'Hainbachi lindilõikamise töötuba', 'Hainbach’s tape-cutting workshop') WHERE event_id = 1011 AND lang = 'en' AND instr(title, 'Hainbachi lindilõikamise töötuba') > 0;
UPDATE event_text SET title = replace(title, 'DUOD IV', 'DUOS IV') WHERE event_id = 1028 AND lang = 'en' AND instr(title, 'DUOD IV') > 0;
UPDATE event_text SET body = replace(body, '**"DUOD"**', '**"DUOS"**') WHERE event_id = 1028 AND lang = 'en' AND instr(body, '**"DUOD"**') > 0;
UPDATE event_text SET title = replace(title, 'DUOD III', 'DUOS III') WHERE event_id = 1021 AND lang = 'en' AND instr(title, 'DUOD III') > 0;
UPDATE event_text SET body = replace(body, '**"DUOD"**', '**"DUOS"**') WHERE event_id = 1021 AND lang = 'en' AND instr(body, '**"DUOD"**') > 0;

-- 4. The missing language. Translated faithfully from the other text unless marked eccm.ee; the slug by the
-- editor’s rule; legacy_id the iCagenda id the event already has, since eccm.ee’s English page for it carried
-- the Estonian text, unless that id is taken in this language. The old English address of an event that had no
-- English text, /en/events/{its Estonian slug}, answers 301 to the new one (src/index.mjs).
-- 1205, 2027-07-30, translated from the English
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1205, 'et', 'interdistsiplinaarne-heliloomingu-tootuba-comp-2027', 'Interdistsiplinaarne heliloomingu töötuba COMP 2027', 'Interdistsiplinaarses heliloomingu töötoas teevad eri valdkondade loovisikud koostööd, et luua uusi teoseid. Iga osaleja töötab oma kompositsiooniprojekti kallal, kuid kõik püüavad luua ka ühiseid teoseid, vahetada teadmisi ja kogemusi ning ehk midagi uut õppida.

Töötoa kavas on loengud, arutelud, kontserdid ja ühisloome sessioonid. Töötuba lõpeb maratonkontserdiga.

Töötoas osalemine on tasuta. Iga osaleja kannab enda ja oma interpreetidega seotud kulud (näiteks palgad, päevarahad, sõidukulud, majutus ja spetsiifilised tehnilised kulud).

Kui soovite osaleda, kirjutage palun Eesti Arnold Schönbergi Ühingule. Kirjeldage oma senist loomingut, töötoaks kavandatavat projekti ning esitajaid, keda plaanite töötuppa kaasa võtta.

Koostöös
Eesti Arnold Schönbergi Ühing
Pärnu Loomeliit
Pärnu Ooper
Luuleraadio
Pärnu Eliisabeti kogudus
Pärnu linn
Kultuurkapital

[schoenberg.ee](https://www.schoenberg.ee/)', (SELECT 159 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 159))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1205 AND starts_at = '2027-07-30T20:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1205 AND lang = 'et')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND slug = 'interdistsiplinaarne-heliloomingu-tootuba-comp-2027');
-- 28, 2026-12-08, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 28, 'en', 'schonberg-series-performance-etudes-9', 'Schönberg series. Performance études #9', 'An evening of performances by IKUMUMU students of the Video, Performance, Sound and Media Art course at Tallinn University''s Baltic Film, Media and Arts School (BFM) and by Erasmus students.

Lecturer in charge Gerhard Lock, co-supervisors Raul Keller and Aleksandra Šprotser.

Partners
Estonian Arnold Schönberg Society
Estonian Academy of Music and Theatre
Tallinn University Baltic Film, Media and Arts School
Pärnu Opera
Autorfest
Estonian Centre of Contemporary Music (ECCM)
Tallinn Music City
Cultural Endowment of Estonia
City of Pärnu

Tickets
Regular ticket 20.00 euros
Concession ticket (dependants and pensioners) 10.00 euros
Student ticket (pupils and students) 5.00 euros

[schoenberg.ee](https://schoenberg.ee/)', (SELECT 153 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 153))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 28 AND starts_at = '2026-12-08T18:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 28 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'schonberg-series-performance-etudes-9');
-- 25, 2026-11-19, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 25, 'en', 'schonberg-series-opus-mirum-kai-kallastu-soprano-andrus', 'Schönberg series. OPUS MIRUM. Kai Kallastu (soprano), Andrus Kallastu (electronics)', 'PROGRAMME

**Sohrab Uduman** (1962)
_Cassandra_ for voice and tape 1992

**Hans-Gunter Lock** (*1974)
_Cassandra kaja_ for tape 2010

**Sven Sosnitski** (1987)
_Kauge maa laul_ for soprano and electronics 2015 (text by Lord Byron)

Kai Kallastu, soprano
Andrus Kallastu, electronics

The myth of Cassandra is a vivid example of a woman''s fall down the social ladder and of the dissolution of her personality. The daughter of Priam, King of Troy, loved by the god Apollo, becomes Agamemnon''s trophy of war, an immigrant against her will, who must prophesy disaster and ruin to deaf ears and who is finally murdered. Sohrab Uduman''s “Cassandra” tells of Cassandra as a prophet of misfortune hated by the people, who, carrying out her mission, or rather her programme, in harsh conditions, seems to lose her connection with the outside world and even with herself.

Hans-Gunter Lock composed the tape work Cassandra kaja at the request of Pärnu Opera for Suveaaria 2010, as interlude music between Sohrab Uduman''s Cassandra and Jürg Wüttenbach''s “Encore!”.

Sven Sosnitski''s Kauge Maa Laul is based mainly on the English poet Lord Byron''s poem Darkness. In the distant future our dying sun has made life on earth impossible. The last human being looks up in the midst of the void to speak a few last words.

Soprano Kai Kallastu earned a master''s degree as a classical singer at Metropolia University in Helsinki, Finland, and has taken part in numerous masterclasses. She has performed as a chamber singer, a soloist in large-scale works and a music theatre artist with various ensembles and in various countries. Her repertoire ranges from the Renaissance to contemporary music, and she has given the first performances of experimental vocal works by several composers. Intensive creative work connects her with her husband, the composer and conductor Andrus Kallastu, with whom she has performed dozens of vocal programmes. [kallastu.ee](http://www.kallastu.ee)

Composer and conductor Andrus Kallastu studied at the Tallinn Conservatoire (now the Estonian Academy of Music and Theatre) and at the Sibelius Academy, and has worked freelance since 2000. Several of Kallastu''s works speak of an interest in combining music with other art forms and in performance. Kallastu''s interest as a performer and as artistic director of projects is often connected with music theatre. Besides traditional music theatre work, his aim is to develop specific areas of music theatre: mystery-like church composition and the visualised concert.

Partners
Estonian Arnold Schönberg Society
OPUS MIRUM
Estonian Academy of Music and Theatre
Baltic Film, Media and Arts School of Tallinn University
Pärnu Opera
Autorfest
Estonian Centre of Contemporary Music (ECCM)
Tallinn Music City
Cultural Endowment of Estonia
City of Pärnu

Tickets
Regular ticket 20.00 euros
Concession ticket (dependants and pensioners) 10.00 euros
Student ticket (pupils and students) 5.00 euros

[opusmirum.ee](https://opusmirum.ee/)
[schoenberg.ee](https://schoenberg.ee/)', (SELECT 73 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 73))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 25 AND starts_at = '2026-11-19T19:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 25 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'schonberg-series-opus-mirum-kai-kallastu-soprano-andrus');
-- 1204, 2026-10-24, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1204, 'en', 'launch-of-kiwa-s-book-millimullimallikad', 'Launch of Kiwa''s book MILLIMULLIMALLIKAD', 'The publisher ;paranoia has published Kiwa''s experimental novel “MILLIMULLIMALLIKAD”, a notional sequel to his award-winning debut novel “Kummiliimiallikad”. The book launch takes place on 24 October at 16:00 at the Estonian Centre of Contemporary Music (ECCM), Pühavaimu 9. Performers: Silvia Sosaar, Kaisa Selde and the band Ratkiller. There will be a bubble show. The book is on sale at a launch price of €10.

“MILLIMULLIMALLIKAD” brings together speculative prose, technopoetics, the absurd, philosophical science fiction and a post-internet aesthetic. The novel is set in a dislocated space-time where different eras, layers of information and realities exist at once, and where human consciousness is under pressure from disintegrating meanings, digital ruins and imaginary memory systems.

The novel opens onto a world where vanished subcultures, non-existent bands, broken URLs, artificially generated identities and “great passionless objects” form a new metaphysical environment. One storyline takes the reader to an isolated boarding school and its surroundings, where different layers of time seem to overlap physically and where the characters experience reality dissolving. Another moves along the borderlands of consciousness, memory and simulation, dealing with questions of identity, existence, the loss of meaning and the autonomy of the imagination.

The novel''s form is fragmentary and associative. The text moves between prose, pseudo-essay, surrealist description, interior monologue, technical language, philosophical digressions and poetic imagery.

The book was edited by Roy Strider and designed by Tuuli Aule, and the cover design is by Mihkel Kleis. Its publication was supported by the Cultural Endowment of Estonia. “MILLIMULLIMALLIKAD” is the 62nd title published by ;paranoia.', (SELECT 158 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 158))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1204 AND starts_at = '2026-10-24T16:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1204 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'launch-of-kiwa-s-book-millimullimallikad');
-- 1203, 2026-10-23, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1203, 'en', 'raadio-tallinn-1965-at-ule-heli-festival', 'Raadio Tallinn 1965 at Üle Heli Festival', 'From 23 to 25 October Studio Tallinn 1965 becomes a radiophonic event space, an ether created through reference and technological means. One end of this ether space, joining the radiosphere, extends within a limited area around the Estonian Centre of Contemporary Music on the FM frequency 107.3 MHz, and the other to a web stream. Everything that happens in the studio becomes part of the radio programme, and all participants are part of the Üle Heli Daily Menu.

The Daily Menu, as the name says, contains various pieces that punctuate the radio broadcast. Such interruptions are conversations, interviews and presentations. Spontaneous additions are possible, arising from the electronic or acoustic means on site, as the studio contains generators, synthesisers, filters and kilometres of magnetic tape that may from time to time slide over the sound heads. With these means a knowledgeable enthusiast can relate to the ether.

Outside the studio door two loudspeakers stand on stands, playing the radio broadcast from inside, in addition to the transistor radios set up here and there. These are for listeners who prefer to be receivers.

Raadio Tallinn 1965 expands the media space on its own terms, as a process still taking shape, and considers the open stream, the event and the action to be what matters. Having turned back to one possibility, in the 60s, it runs in parallel, crossing what exists here and there from time to time, giving meaning to what has been, what is and what is becoming. This gives the opportunity to offer alternatives, to dispute and argue when needed, in a word, to rethink what concerns experimentality, media space and that eternally returning thing: radio.

Raadio Tallinn 1965 is testing an app called ‘Väin’, whose beta version can be downloaded for both Android and iOS mobile devices. ‘Väin’ lets you listen to the RT65 live web stream, but also gives the user the chance to transmit sound material from their own mobile phone. The app takes shape according to feedback from users and adds the sounds transmitted by users to the broadcast, modulating them in the live transmission. On Sunday 25 October there is an experimental sound collection: from 16:00 the ‘Väin’ channel opens, where everyone registered in the app can send the sounds around them to the stream, to be reworked by the slowly rotating motor at the bottom of ‘Väin’, which modulates the radio waves. Sunday''s process helps us tune this motor with the participants'' help.

You can download the Väin app here: [Android](https://play.google.com/apps/testing/org.eccm.radio65) and [iOS via TestFlight](https://testflight.apple.com/join/62DWQybs)

More information about the app and ‘Väin’ is available here: [User guide](https://docs.google.com/document/d/1Pn0A8Bb8BAxHU6tWInYVM7N7stm5OZ7EL_5ww__VZ24/edit?tab=t.0)

The radio is run by Raul Keller, Tarmo Johannes, Andrus Laansalu, Kristjan Jansen, Maria Hansar, Anastasiia Dolgaia and Mike Cole.

See also [linktr.ee/radiotallinn1965](https://linktr.ee/radiotallinn1965)', (SELECT 160 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 160))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1203 AND starts_at = '2026-10-23T14:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1203 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'raadio-tallinn-1965-at-ule-heli-festival');
-- 7, 2026-10-22, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 7, 'en', '11th-ule-heli-festival-heli-on-vaba', '11th Üle Heli festival “Heli on vaba”', 'The eleventh Üle Heli festival of sound art and music focuses not on genre definitions but on the meaning of music and sound and their connections with other fields of art.
One of the festival''s main aims is to offer sound artists and experimental musicians a platform for developing and presenting their ideas.', (SELECT 140 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 140))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 7 AND starts_at = '2026-10-22T00:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 7 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = '11th-ule-heli-festival-heli-on-vaba');
-- 19, 2026-09-13, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 19, 'en', 'ema-grandparents-day-workshop-analogue-synthesiser-forbidden', 'EMA grandparents’ day workshop “Analogue synthesiser: forbidden under 60!”', 'An EMA workshop for grandparents on learning to play an analogue synthesiser in half an hour.

Number of places: 10.', (SELECT 118 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 118))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 19 AND starts_at = '2026-09-13T19:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 19 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'ema-grandparents-day-workshop-analogue-synthesiser-forbidden');
-- 18, 2026-09-13, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 18, 'en', 'ludensemble-presents-gerard-grisey-vortex-temporum-and-terry', 'Ludensemble presents: Gérard Grisey “Vortex temporum” and Terry Riley “In C”', 'Ludensemble appears in the programme of the Tallinn Architecture Biennale with two concerts that explore the relationships between music, space and time. The evening begins in the small hall of Kultuurikatel with Gérard Grisey''s monumental “Vortex temporum” and continues at the Estonian Museum of Contemporary Art with a spatial interpretation of Terry Riley''s minimalist classic “In C”. Between the two concerts the audience moves from one architectural setting to another, experiencing two entirely different ways of listening to contemporary music.

At 18:00 Kultuurikatel hears Gérard Grisey''s “Vortex temporum” (“Vortex of Time”), a landmark of spectral music completed in 1994 to 1996 and one of the most important chamber works of the 20th century. Written for flute, clarinet, violin, viola, cello and piano, the virtuosic work explores the passing of time and how we perceive it through music. Grisey''s music starts from the spectrum of sounds and their acoustic properties, creating exceptionally rich timbres and constantly shifting textures. Through different rhythms, layers of time and sound processes, “Vortex temporum” becomes a work in which time itself is one of the main musical materials. At the Tallinn Architecture Biennale the performance of “Vortex temporum” is created together with visual artist Alyona Movko, whose spatial visual design complements the architectural thinking of the work and opens a new dimension for the music.

After a short break the audience moves to the Estonian Museum of Contemporary Art, where at 19:30 Terry Riley''s “In C” of 1964 is performed, a work regarded as the starting point of minimalist music. The composition consists of 53 short musical fragments that the performers move through at their own pace, deciding for themselves how long to stay on each motif. So every performance takes a unique shape and is formed jointly as the musicians listen to one another. In Ludensemble''s interpretation “In C” spreads across the whole of the Estonian Museum of Contemporary Art. The musicians are placed on different floors and in different rooms, connected only by a shared pulse heard through headphones. The audience can move freely through the building, discovering the music from constantly changing perspectives and shaping their own listening journey.

Founded in 2024, Ludensemble is an ensemble devoted to contemporary music whose aim is to create conceptual concert programmes, to connect music with other art forms, and to commission, perform and spread new work. The ensemble''s line-up varies from project to project, from chamber ensemble to chamber orchestra. In its first years Ludensemble has brought to audiences the music of Kirke Karja, Madli-Marje Gildemann, Arnold Schönberg, György Ligeti, Gérard Grisey, Frank Zappa and many other composers. At the start of 2026 the label Kairos released the ensemble''s debut album “Dream Sequence of an Ancient Forest”, featuring the music of Madli-Marje Gildemann.', (SELECT 138 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 138))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 18 AND starts_at = '2026-09-13T18:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 18 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'ludensemble-presents-gerard-grisey-vortex-temporum-and-terry');
-- 17, 2026-09-10, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 17, 'en', 'schonberg-series-kurtag-100', 'Schönberg series. Kurtág 100', 'The string quartet works of György Kurtág.

Programme:
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

The V4 String Quartet is dedicated to exploring the richness of Hungary''s musical heritage and sharing it in an international context. In 2026 the ensemble begins a special project marking the centenary of György Kurtág''s birth, performing all of his works for string quartet. The initiative celebrates the legacy of one of the most influential composers of the 20th and 21st centuries, while reflecting on the expressive depth, richness of nuance and intellectual beauty of his music. For the quartet the project is not just a series of concerts but a meaningful artistic journey, paying tribute to a visionary composer whose work continues to inspire musicians and audiences around the world.

[v4stringquartet.com](https://www.v4stringquartet.com/)

Tickets
Regular ticket 20.00 euros
Concession ticket (dependants and pensioners) 10.00 euros
Student ticket (pupils and students) 5.00 euros', (SELECT 71 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 71))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 17 AND starts_at = '2026-09-10T19:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 17 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'schonberg-series-kurtag-100');
-- 15, 2026-05-31, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 15, 'en', 'joy-muba-new-music-ensemble-concert', '“JOY!” MUBA New Music Ensemble concert', 'A joyful programme of contemporary music for stepping into summer.

Programme:
**Perttu Haapanen** (1972) _Strophes II_ (2007/2009) for vocal ensemble, 7’
**Guðmundur Steinn Gunnarsson** (1982) _Kvartett nr 17_ for four performers, 4’
**Karlheinz Stockhausen** (1928 to 2007) _Tierkreis_ (Zodiac, 1974/1975): Pisces, 5’
**Pauline Oliveros** (1932 to 2016) _Wind Horse_ (1990) for any instruments or voices
**Line Tjørnhøj** (1960) two parts of “enTmenschT” (2018): _#throughbacks_ for two performers (Indrek Koff, Myroslav Dykyi) and _#joy_, 5’
**Julius Eastman** (1940 to 1990) _Stay on it_ (1973) for voices and instruments, 15’

Admission free.', (SELECT 101 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 101))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 15 AND starts_at = '2026-05-31T19:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 15 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'joy-muba-new-music-ensemble-concert');
-- 14, 2026-05-27, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 14, 'en', 'improtest-post-horn', 'Improtest: Post Horn', 'More info soon.

[facebook.com/PostHornNoise](https://www.facebook.com/PostHornNoise/)', (SELECT 103 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 103))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 14 AND starts_at = '2026-05-27T19:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 14 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'improtest-post-horn');
-- 11, 2026-05-14, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 11, 'en', 'schonberg-series-versions', 'Schönberg series. Versions', 'The history of music could also be seen as a history of versions of musical material. Although a musical work is born in a moment, it never stays unchanged: it lives on through each new generation''s changing understanding of what music is and through the renewal of the context in which it is performed. In the concert project Versions, Repoo Ensemble brings together new interpretations of Andrus Kallastu''s early, forceful neoclassical works and the intimately filigree, poetic musical language of Tatjana Kozlova-Johannes.

Programme:
**Andrus Kallastu** (1967) _Nahakaupleja Pontus_, ballad for voice and piano (1989), version for voice and chamber ensemble (2026)
**Tatjana Kozlova-Johannes** (1977) _Kirjad_ for soprano and viola (2014), version for soprano and cello (2025)
**Andrus Kallastu** _Tropus rhetoricus_ for flute and cello (2025, premiere)
**Tatjana Kozlova-Johannes** _Vee killud_ for soprano, violin and flute (2008), version for soprano, cello and flute (2026)
**Andrus Kallastu** _Muusikat Tallinn Cameratale_ for flute, violin and guitar (1991), version for flute, cello and piano (2026)

_Nahakaupleja Pontus_ is a dark-toned tale, and its arrangement for chamber ensemble gives it further dramatic depth: the ensemble''s timbres bring out the tragicomic character of the title figure and the eerie atmosphere of the place where it unfolds.

_Muusikat Tallinn Cameratale_, although it belongs to Kallastu''s earlier period, carries the composer''s aesthetic search for the new in the early 1990s. The work is built on concentrated musical gestures and a transparent texture. Movement and balance between different timbres are central to it.

Kallastu''s new work _Tropus rhetoricus_ for flute and cello unfolds as a dialogue between two self-assured debaters, full of intricate musical puns, dance-like gestures and intellectual sharpness.

In Tatjana Kozlova-Johannes''s _Kirjad_ an intimate and fragile micro-drama unfolds, in which the human voice and the instrument are like two shadows that sometimes merge and sometimes stay apart. The cello, in place of the original version''s viola, brings a softer, darker colour to the work and so gives it new breath.

_Vee killud_, from Kozlova-Johannes''s early work, is like an aquarelle in sound, in which the flicker, shimmer and flow of evening light are gently reflected through damp treetops.

## Kai Kallastu

Soprano Kai Kallastu earned a master''s degree as a classical singer at Metropolia University of Applied Sciences in Helsinki, Finland, and has taken part in numerous masterclasses. She has performed as a chamber singer, as a soloist in large-scale works and as a music theatre artist with various ensembles and in various countries. Her repertoire ranges from the Renaissance to contemporary music, and she has given the first performances of experimental vocal works by several composers. Intensive creative work links her with her husband, the composer and conductor Andrus Kallastu, with whom she has performed dozens of vocal programmes.

## Leonora Palu

Leonora Palu is an Estonian flautist and poet who has given concerts with various orchestral and chamber music line-ups in Estonia, Latvia, Lithuania, Finland, Sweden, Russia, Poland, Germany, Austria, Italy and Japan. Her ensemble partners have included Age Juurikas, Irina Zahharenkova, Jorma Toots, Kristo Käo, Kirill Ogorodnikov, Repoo Ensemble, Hans Christian Aavik, Ines Maidre and many others. Palu is principal flute of the Pärnu City Orchestra and often appears as a soloist with it, most recently in Malle Maltis''s flute concerto. She frequently performs contemporary music and has taken part in the premieres of works by many Estonian composers. As a member of the free improvisation ensemble “Rooluulend”, Leonora Palu has performed with Indrek Palu, Jaan Luulur Malin and Roomet Jakapi, and has released the CD “Kuhu ma vajutan?”. She performs regularly in the concert series “Heli ja Keel”, which presents the music and literary art of Estonian authors. Leonora Palu has published music criticism in the magazine Muusika, and concert reviews and opinion pieces in the cultural weekly Sirp. As a poet she has published three collections, and her poems have also appeared in the magazines Looming and Vikerkaar. In 2020 Leonora Palu received the City of Pärnu creative award for her work as a performer, poet and organiser of literary events.

## Aare Tammesalu

Cellist Aare Tammesalu works as a soloist and chamber musician, performing both the classical repertoire and contemporary music. He is also an active concert organiser. His work has been recognised with the annual awards of the Cultural Endowment of Estonia and the Estonian Music Council, a special jury prize of the Estonian Theatre Union and the Hendrik Krumm cultural award. In February 2023 Saaremaa Rural Municipality gave Aare Tammesalu the “Deed of the Year 2022” award for organising the Mustjala festival, and in 2023 the council of the Estonian Evangelical Lutheran Church honoured him with the title “Friend of the Church of the Year”.

## Andrus Kallastu

Composer and conductor Andrus Kallastu studied at the Tallinn Conservatory (now the Estonian Academy of Music and Theatre) and at the Sibelius Academy, and has worked freelance since 2000. Several of Kallastu''s works speak of an interest in combining music with other art forms and in performance. As a performer and artistic director of projects, Kallastu''s interest is often tied to music theatre. Besides traditional music theatre work, his aim is to develop specific areas of music theatre: mystery-like sacred composition and the visualised concert.

Tickets
Regular ticket 20.00 euros
Concession ticket (dependants and pensioners) 10.00 euros
Student ticket (pupils and students) 5.00 euros', (SELECT 70 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 70))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 11 AND starts_at = '2026-05-14T19:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 11 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'schonberg-series-versions');
-- 1059, 2026-05-09, translated from the English
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1059, 'et', 'improtest-baumann-pietila-soo', 'Improtest: Baumann / Pietilä / Soo', '**Franziska Baumann** on mitme auhinnaga pärjatud Šveitsi laulja, improvisaator-helilooja ja helikunstnik. Vokaalartisti ja esinejana ammutab ta inimhääle arhailistest, stiililiselt mitmekesistest ja eksperimentaalsetest väljendusviisidest. Žestipõhise live-elektroonika teerajajana loob ta originaalseid, liigutavaid ja ainulaadseid kontserdielamusi väljaspool stiilikategooriaid.

Baumann on teinud ulatuslikke kontsertreise Euroopas, USA-s, Kanadas, Lõuna-Aafrikas, Austraalias, Uus-Meremaal, Egiptuses, Valgevenes ja Lõuna-Koreas. Ta on teinud koostööd selliste muusikutega nagu Fred Frith, Jacques Demierre, Matthias Ziegler, Michel Wintsch, Lauren Newton, Hans Koch, Lucas Niggli, Julian Sartorius ja paljud teised.

[www.franziskabaumann.ch](http://www.franziskabaumann.ch/)

**MART SOO**

on Eesti kitarrist, kes on tegutsenud üle nelja aastakümne. Ta on välja andnud üle 50 albumi nii ansamblijuhi kui ka kaasmuusikuna ning esinenud arvukatel kontsertidel ja festivalidel üle maailma. Ta on tuntud oma omanäolise ja uuendusliku mängustiili poolest, mis ühendab džässi, roki ja elektroonilise muusika elemente.

[martsoo.ee](https://martsoo.ee/)

**ESA PIETILÄ**

on rahvusvaheliselt tunnustatud saksofonist ja helilooja. Kuigi ta on tuntud oma ulatusliku tegevuse poolest nii nüüdisaegse klassikalise muusika kui ka džässi vallas, ületab ta žanripiire, luues piirideta muusikat. Igas koosseisus ilmneb tema terav huvi ühendada kompositsiooni ja improvisatsiooni ning segada stiile ja instrumente üllatavalt ja omanäoliselt. Ta on esinenud solistina ka mitme tipporkestriga ning teinud koostööd juhtivate dirigentide ja heliloojatega, sealhulgas Esa-Pekka Salonen (dirigent) ja Magnus Lindberg (helilooja).

[www.esapietila.com](http://www.esapietila.com/)

Toetaja: Eesti Kultuurkapital
Partnerid: ECCM, Muusikalinn Tallinn piletid: 15/10€

Improtest on rahvusvaheline vabaimprovisatsioonilise muusika kontsertsari, mis toimub aastast 2005. Sarja kuraatorid on Mart Soo ja Taavi Kerikmäe. Koostööpartnerid: ECCM, Eesti Kultuurkapital, Muusikalinn Tallinn, Tallinna Filharmoonia

[www.improtest.ee](http://www.improtest.ee/)', (SELECT 102 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 102))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1059 AND starts_at = '2026-05-09T19:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1059 AND lang = 'et')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND slug = 'improtest-baumann-pietila-soo');
-- 1058, 2026-05-08, translated from the English
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1058, 'et', 'ulysses-journeys-for-live-electronics-composing-vol-2', 'ULYSSES JOURNEYS FOR LIVE ELECTRONICS COMPOSING VOL 2.', 'Tallinnas, Stuudio Tallinn 1965, ansambel EMA [www.emamusic.ee](https://www.emamusic.ee/)
Taotlusvoor on avatud kuni 25.4.2026
Palun laadige oma ettepanek üles [siin](https://drive.google.com/drive/u/1/folders/1FyEiLOA9JmMXWJ9WPcaJdKS9jhOIlRIG)

Osalejad valitakse nende pooleli oleva teose kirjelduse põhjal, millega nad soovivad praktilises töötoas tegeleda. Osalejate arv on piiratud kuuega.

Kirjeldus võib olla teose kontseptsioon tekstina, katkendid valmivast kompositsioonist jne

Praktilises töötoas annab ansambel EMA valmivale teosele tagasisidet esitaja vaatenurgast. Aitame arendada ka teose helikujundust, planeerida tehnilisi lahendusi ning anname tagasisidet ja nõu noodikirja osas. Kavas on ka lihtne praktiline lugemissessioon, kus ansambel mängib valmivad teosed läbi. Heliloojatega peetavaid praktilisi töösessioone saavad jälgida ka teised töötoas osalejad.

Tuginedes materjalile, mis on loodud nädalase residentuuri jooksul Eesti Nüüdismuusika Keskuses, esitletakse töötoas katkendeid valmivatest teostest, mis annavad ülevaate muusikaliste ideede arengust. Elava demonstratsiooni ja arutelu kaudu saavad osalejad vahetult osa loomeprotsessist, vahetades mõtteid ja vaatenurki kompositsiooni ja kunstilise arengu teemal.

_**See sündmus on osa Ulysses Platformist, mida kaasrahastab Euroopa Liit.**_', (SELECT 96 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 96))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1058 AND starts_at = '2026-05-08T12:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1058 AND lang = 'et')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND slug = 'ulysses-journeys-for-live-electronics-composing-vol-2');
-- 1052, 2026-04-09, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1052, 'en', 'schonberg-series-live-electronics-hans-gunter-lock-andrus', 'Schönberg series. LIVE ELECTRONICS. Hans-Gunter Lock, Andrus Kallastu', 'Hans-Gunter Lock (violin, percussion, electronics)
Andrus Kallastu (piano, percussion, electronics)

LIVE ELECTRONICS is a direct dialogue between acoustic instruments and electronics. The composers Hans-Gunter Lock and Andrus Kallastu create a soundscape in real time in which structure is interwoven with improvisation. The concert focuses on the birth of sounds in the moment, on transformation and on space, making for a live, unrepeatable and risky listening experience.

Hans-Gunter Lock (1974) was born in Halle an der Saale, Germany. He has lived and worked in Estonia since 2000. His output consists mainly of electronic and electroacoustic music, chamber works and film music. In his work he has repeatedly turned to the synthesis of the arts, exploring ways of combining light, video, text, movement and sound, and the use of interactive means. Experimental pursuits also have a firm place in his work, and he has collaborated widely with performance and multimedia artists.

Andrus Kallastu (1967) studied at the Tallinn Conservatory and the Sibelius Academy and works as a freelance composer and conductor. His output can be divided into two periods, before and after 1991. The works of the first period are marked by a free atonal language, motoric, often ostinato rhythm and a neoclassical approach to sound; those of the second by serial texture, field technique, non-pulsing rhythm and a sound that probes the borders between musical tone and noise. Several of Kallastu’s works show an interest in combining music with other art forms and in performance.

Partners
Estonian Arnold Schönberg Society
Estonian Academy of Music and Theatre
Baltic Film, Media and Arts School of Tallinn University
Pärnu Opera
Autorfest
Estonian Centre of Contemporary Music (ECCM)
Tallinn Music City
Cultural Endowment of Estonia
City of Pärnu

Tickets [fienta.com/et/schonbergi-sari-laivelektroonika-260409](https://fienta.com/et/schonbergi-sari-laivelektroonika-260409)
Regular ticket 20.00 euros
Concession ticket (dependants and pensioners) 10.00 euros
Student ticket (university students) 5.00 euros

[schoenberg.ee](https://schoenberg.ee/)', (SELECT 69 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 69))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1052 AND starts_at = '2026-04-09T19:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1052 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'schonberg-series-live-electronics-hans-gunter-lock-andrus');
-- 1051, 2026-03-27, translated from the English
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1051, 'et', 'phil-minton-kriton-beyer-improtestil', 'Phil Minton / Kriton Beyer Improtestil', 'MINTON-BEYER DUO näib kui hääle fenomeni uurimus kahe erineva instrumendiga: inimhääle ja daksofoniga.

Phil Minton, ehk tuntuim vokaalkunstnik vabaimprovisatsioonis, on tuntud oma tähelepanuväärsete laiendatud vokaaltehnikate poolest, mis hõlmavad kogu inimväljenduse spektrit: lihtsast hingamisest pomina, porina ja sosinani, vilistamisest, röhitsemisest ja korisemisest karjumise ja oigamiseni, kiledatest kõrgustest mürisevate madalateni, kõik on osa tema sõnavarast. Ja kõik tema häälevõimed käivad alati käsikäes erakordse, ainulaadse kohalolu ja täiesti filtreerimata väljendusega.

Kriton Beyer omakorda kasutab oma veel üsna tundmatut instrumenti, daksofoni, äärmiselt häälelaadsel viisil, imiteerides sageli inimeste ja loomade hääli ning kõnemustreid, mis näivad olevat instrumendi olemusse ja iseloomu sisse ehitatud. Võrreldes teiste instrumentidega tundub daksofonil olevat väga lihtne imiteerida loomade häälitsusi ja hääli, linnulaulust kuni eri loomaliikide röhkimise, möirgamise, kraaksumise, krooksumise, lobisemise, kudrutamise ja siristamiseni. Kõike seda on Kriton Beyer põhjalikult uurinud ja praktiliselt järele proovinud liikidevahelises suhtluses oma daksofoniga kui instrumendiga ning see on kuuldavalt läbi töötatud ka selle duo muusikalises dialoogis.', (SELECT 87 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 87))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1051 AND starts_at = '2026-03-27T19:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1051 AND lang = 'et')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND slug = 'phil-minton-kriton-beyer-improtestil');
-- 1050, 2026-03-22, translated from the English
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1050, 'et', 'ulysses-journeys', 'ULYSSES JOURNEYS', 'ULYSSES JOURNEYS FOR LIVE ELECTRONICS COMPOSING VOL 1., korraldavad Stuudio Tallinn 1965, Erica Synth ja ansambel EMA

Live-elektroonikast on saanud kogu maailmas (mitte ainult) noorema põlvkonna muusikute jaoks oluline musitseerimise tööriist. See on aidanud muusika tegemist demokratiseerida, võimaldades ka ilma klassikalise interpreedi- või heliloojahariduseta inimestel jõuda eri žanrites lavale. See on palju kaasa aidanud ka „hübriidsete“ esitaja-heliloojate rühma tekkimisele nii põrandaaluses eksperimentaalmuusikas kui ka „klassikalises“ nüüdismuusikas. Ometi ei ole nüüdismuusikas live-elektroonikaga esitajatele ja eriti live-elektroonika ansamblitele komponeerimine klassikalise haridusega heliloojate seas veel kuigi levinud. Peamiselt tuleneb see teatud konservatiivsest mõtteviisist mõnes konservatooriumis, aga eelkõige ka kvalifitseeritud õpetajate nappusest selles valdkonnas ning hea teadmistebaasi ja kogemuse puudumisest nii live-elektrooniliste teostega töötamisel kui ka esituspraktikas. EMA juhitud ja Erica Synthsiga koostöös toimuv õpituba on mõeldud heliloojatele, kes soovivad süveneda live-elektroonika ansamblile komponeerimisse; osalema on oodatud nii varasema kogemuseta heliloojad kui ka need, kellel on selles valdkonnas juba mõningane kogemus.

„Tallinn 1965“ on avatud eksperimentaalne multifunktsionaalne analoogmuusika stuudio. Lisaks tänapäevasele helitehnikale on töös ka aastakümnete tagused analoogseadmed nii helide salvestamiseks (professionaalsed vanaaegsed stuudiomagnetofonid) kui ka muusika loomiseks (klassikalised ostsillaatorid, filtrid, kajamasinad). Läheneme muusikale konkreetsete artefaktide ja tehnoloogiliste kihtide kaudu, mis ulatuvad riistvarast tarkvaraprotsessideni ja on olnud osa aja ja mälu ringlusest, mis tingib nii teadmisi kui ka tajusid ja aistinguid.

Tunnustatud ansambel EMA (Eesti Elektroonilise Muusika Seltsi ansambel) loodi 2017. aastal ning sellesse kuulub praegu viis erineva klassikalise haridusega (kompositsioon, eri interpretatsioonierialad) muusikut, kellel on ka taust mitmesugustelt eksperimentaalmuusika skeenedelt. Ansambel on aktiivselt esitanud ja loonud live-elektroonilisi teoseid ning juhendanud mitmeid õpitube, mis käsitlevad sellega seotud küsimusi, sealhulgas elektroonilise muusika notatsiooni, tehnilisi seadistusi, helisünteesi jms. [www.emamusic.ee](https://www.emamusic.ee/)

**Õpitoa teemad**

-Live-elektrooniline instrument. Mis see on? Kuidas seda defineerida, kuidas klassifitseerida?

-Helidisain kui üks elektroonikaga töötamise võtmeküsimusi. Kuidas leida heliloojal ja esitajal ühine keel, kui komponeeritakse „tundmatule“ standardiseerimata instrumentaariumile

- Erinevad notatsioonivõimalused live-elektroonilise esitusega teostele

-Tehnilised takistused elektrooniliste seadistustega töötamisel. Mäppimise võimalused, väljakutsed

- Esitajate sünkroniseerimine reaalajas. Eri metronoomide võimalused, Vclicki rakendus

**Ajakava**
**P 22.3.2026**
**1. sessioon. 16.00 kuni 19.00**

Sissejuhatus. Live-elektrooniline instrument. Mis see on? Kuidas seda defineerida, kuidas klassifitseerida? Eri esitusseadmete eripärad.

Helidisain kui üks elektroonikaga töötamise võtmeküsimusi. Kuidas leida heliloojal ja esitajal ühine keel, kui komponeeritakse „tundmatule“ standardiseerimata instrumentaariumile.

**2. sessioon. 10.00 kuni 13.00**

Eelmise sessiooni teemade jätk. Erinevad notatsioonivõimalused live-elektroonilise esitusega teostele.

**3. sessioon. 15.00 kuni 18.00**

Tehnilised takistused elektrooniliste seadistustega töötamisel. Mäppimise võimalused, väljakutsed. Esitajate sünkroniseerimine reaalajas. Eri metronoomide võimalused, Vclicki rakendus

**T 24.3.2026**
**4. sessioon. 10.00 kuni 13.00**
Partituuride analüüs, kokkuvõtted, ajurünnak ümarlauas
**ULYSSES JOURNEYS FOR LIVE ELECTRONICS COMPOSING VOL 2.**
Õpituba toimub 8. kuni 10. mail 2026 Eesti Nüüdismuusika Keskuses Tallinnas, Stuudios Tallinn 1965.

See õpituba on praktiline laboratoorium koos ansambliga EMA (Eesti Elektroonilise Muusika Seltsi ansambel), kus arendatakse osalejate kaasa toodud materjali. Kuus osalejat valitakse avatud konkursiga. Osalejad esitlevad oma esialgseid ideid, visandeid ja kontseptsioone, et käsitleda kontseptsiooni, helidisaini ja instrumentatsiooni küsimusi.

_**Sündmus on osa Euroopa Liidu kaasrahastatud platvormist Ulysses Platform.**_', (SELECT 81 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 81))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1050 AND starts_at = '2026-03-22T00:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1050 AND lang = 'et')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND slug = 'ulysses-journeys');
-- 1049, 2026-03-14, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1049, 'en', 'scrapyard-2026-03-14', 'SCRAPYARD', 'In 2020 Ensemble for New Music Tallinn founded a special concert series called “Scrapyard”, devoted to lo-fi music.

This exciting and unusual multimedia concert in the Scrapyard series presents works that combine contemporary music with different media, in which gesture and movement play an important part. This does not stop at a conceptual manifestation: the movement also shows itself concretely in the changing sound world that results from it.', (SELECT 85 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 85))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1049 AND starts_at = '2026-03-14T19:30')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1049 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'scrapyard-2026-03-14');
-- 1045, 2026-03-05, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1045, 'en', 'schonberg-series-paradigms-lecture-concert-and-discussion', 'Schönberg series. PARADIGMS. Lecture, concert and discussion. Leo Semlek “Muusikastiilide perioodsüsteem”', 'Programme: Leo Semlek “Muusikastiilide perioodsüsteem” (1990)

The Schönberg Society''s trio of tuners, Juhatus:
Gerhard Lock
Andrus Kallastu
Hans-Gunter Lock

Partners
Estonian Arnold Schönberg Society
Tallinn Music and Ballet School MUBA
Pärnu Music School
Estonian Academy of Music and Theatre
Tallinn University Baltic Film, Media and Arts School
Port Artur
Pärnu City Gallery
Pärnu Opera
Autorfest
MASSIA creative residency
Pärnu Central Library
Estonian Centre of Contemporary Music (ECCM)
Tallinn Music City
Cultural Endowment of Estonia
City of Pärnu

Tickets [fienta.com/et/schonbergi-sari-paradigmad-semlek](https://fienta.com/et/schonbergi-sari-paradigmad-semlek)
Regular ticket 20.00 euros
Concession ticket (dependants and pensioners) 10.00 euros
Student pass (university students) 5.00 euros

[schoenberg.ee](https://schoenberg.ee/)', (SELECT 65 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 65))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1045 AND starts_at = '2026-03-05T19:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1045 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'schonberg-series-paradigms-lecture-concert-and-discussion');
-- 1043, 2026-02-20, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1043, 'en', 'tencu-samson-at-improtest', 'Tencu/ Samson at Improtest', 'Improvisation on modular synthesiser and saxophone grows into an electroacoustic soundscape that wavers on the border between chaos and restrained noise. Yurii Samson is a poet and a bus driver. Tencu is a video and sound artist.

[tencusamson.bandcamp.com](https://tencusamson.bandcamp.com/)

Tickets: 10/8€

Improtest is an international concert series of freely improvised music, held since 2005. The series is curated by Mart Soo and Taavi Kerikmäe. Partners: ECCM, Cultural Endowment of Estonia, Tallinn Music City, Tallinn Philharmonic Society

[www.improtest.ee](http://www.improtest.ee/)

Tickets: 8€/10€', (SELECT 82 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 82))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1043 AND starts_at = '2026-02-20T19:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1043 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'tencu-samson-at-improtest');
-- 1042, 2026-02-16, eccm.ee’s English page
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1042, 'en', 'dream-sequence-of-an-ancient-forest', 'Dream Sequence of an Ancient Forest', 'Ludensemble presents the album Dream Sequence of an Ancient Forest, featuring music by composer Madli Marje Gildemann, released in January 2026.

The album brings together works inspired by biological processes, the hidden rhythms of nature, and mythological imagination. Its music draws from the secret life of plants, nocturnal rhythms of the natural world, and the dreamlike realm of the forest, while also engaging with the human-made world and its mythological meanings.

The album presentation concert Dream Sequence of an Ancient Forest invites the listener to slow down and immerse themselves in music as a space where the natural and the human worlds intertwine.

Kadri-Ann Sumera (piano), Madli Marje Gildemann (piano), Taniel Kirikal (overtone singing), Raido Lill (throat singing)

Ludensemble: Maria Luisk (flute), Alexandr Avramenko (clarinet), Kaija Lukas (violin), Elisabeth Härmand (violin), Sandra Klimaitė (viola), Theodor Sink (cello), Regina Udod, Madis Jürgens (double bass), Kärt Ruubel (piano), Maarja Nuut, Tiit Joamets (percussion)
Conductor: Kaspar Mänd

Madli Marje Gildemann’s music is inspired and shaped by her interest in biological processes and natural phenomena. It emerges from an effort to make these processes perceptible through sound, creating distinctive sonic landscapes. She has written music for ensembles such as Klangforum Wien, the Adelphi String Quartet, Pärnu City Orchestra, Ensemble for New Music Tallinn, Ensemble 21, Estonian Percussion Group, The Mondrian Ensemble, Ensemble Synaesthesis, Sinfonietta Rīga, Tallinn Chamber Orchestra, the Estonian National Symphony Orchestra, and Ensemble U:, among many others.

In 2022, Gildemann was awarded second prize in the under-30 category at the International Rostrum of Composers in Palermo, Sicily, for her work _Transpiration_. In 2023, she received the ISCM Young Composer Award in Cape Town, South Africa, for _Osmosis_, which was performed at the ISCM World New Music Days. That same year, _Transpiration_ was nominated for the Prince Pierre of Monaco Music Award. In 2024, she received the LHV New Composition Award (Special Prize) for _Nocturnal Migrants_, one of Estonia’s most significant contemporary music honors, recognizing world premieres of exceptional artistic quality with international potential.

Gildemann’s music has been performed at numerous festivals, including ORF Musikprotokoll, the Lucerne Festival, Bern Music Festival, Estonian Music Days, Baltic Music Days, ISCM World New Music Days (in Estonia and South Africa), the Huddersfield Contemporary Music Festival, Al(t)chemie Festival, Classical:NEXT Showcase, and the Afekt Festival.', (SELECT 67 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 67))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1042 AND starts_at = '2026-02-16T00:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1042 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'dream-sequence-of-an-ancient-forest');
-- 1040, 2025-12-13, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1040, 'en', 'ule-heli-25-ansambel-u-stratifikatsioonid-and', 'Üle Heli 25 / ANSAMBEL U: "STRATIFIKATSIOONID" and HELIPORTATSIOON', '**18:00 ANSAMBEL U: "STRATIFIKATSIOONID"** in the White Hall

Ansambel U:''s concert "Stratifikatsioonid" deals with stratifications, depositions, branchings, solidifications, dispersals and perceptions. Each work is connected to a physical phenomenon, material or state of transition.

**Programme:**
Malin Bång "Structures of Molten Light" (2011)
Viktoria Grahv "Jäälill601512" (2025, premiere)
Liina Sumera ""Pāhoehoe / ʻAʻā"" (2025, premiere)
Ülo Krigul "Nehalennia dunings" (2025, premiere)
Peter Ablinger "Kyrie nach Machaut" (1983/2022)

**19:30 HELIPORTATSIOON** in various rooms of the House of the Blackheads

Part II of Üle Heli 25 closes with the labyrinthine Heliportatsioon, organised together with the Estonian Centre of Contemporary Music (ECCM). Besides travelling in sound between eras and realities, the many nooks of the House of the Blackheads let you do the same in space.

**Programme:**
Presentation by the Estonian Electronic Music Society ensemble "EMA"
Tarmo Johannes, Toomas Siitan, Anna-Liisa Eller, Taavi Kerikmäe, Hans-Gunter Lock, Helena Tuuling "detour : ümberminek"
Varm & Correia, presentation of "Hiiumaa" (visuals by Tencu)
Raul Keller''s installation ‘Segaja / Jammer’

CoPeCo Collective (Mara Hebel, Mattia Giustetto, Alberto Piazza, Hugo Coelho, Kenn-Eerik Kannike, Kristýna Švihálková, Xu Dong, Martina Copello and Theodore Parker)

Aivar Tõnso "Lummafooria" for a dis-speaker system
lighting design Rene Manivald Tamm

**More information:**
[www.ule-heli.ee](http://www.ule-heli.ee/)
[www.facebook.com/events/1349780166615262](https://www.facebook.com/events/1349780166615262)
[www.facebook.com/events/1984676808993019](https://www.facebook.com/events/1984676808993019)

Tickets: Ansambel U: "Stratifikatsioonid" 10/12/15 [fienta.com/et/ule-heli-25-ansambel-u-stratifikatsioonid](https://fienta.com/et/ule-heli-25-ansambel-u-stratifikatsioonid) Heliportatsioon 10/12/15 [fienta.com/et/ule-heli-25-heliportatsioon](https://fienta.com/et/ule-heli-25-heliportatsioon) Day ticket 15/20 [fienta.com/et/ule-heli-25-mustpeade-majas](https://fienta.com/et/ule-heli-25-mustpeade-majas)', (SELECT 50 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 50))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1040 AND starts_at = '2025-12-13T00:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1040 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'ule-heli-25-ansambel-u-stratifikatsioonid-and');
-- 1039, 2025-10-25, translated from the English
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1039, 'et', 'synth-diy-tallinn', 'Synth DIY Tallinn', 'Elektrooniline muusika on kunstilise ja teadusliku loomingu ainulaadne segu, mis loob helisid, mis on olnud osa meie elust peaaegu üldise elektrivarustuse algusest peale. Igal etapil (teleharmonium, Hammond, Musique Concrète, mono- ja polüfoonilised süntesaatorid…) on olnud oma visionäär, kellel oli „jalg mõlemas leeris” ja tung luua midagi enneolematut. Süntesaatorite massikaubaks muutumisega viimase 40 aasta jooksul on modulaarsüntesaatorid uuesti avastatud kui üks viis jätkuvalt luua midagi, mida pole varem kuuldud, nagu näitab tänapäeval saadaval olevate moodulite tohutu valik. Sellegipoolest põleb individuaalne loomingulisus ka täna, erinevate viisidega muusika loomisega suhestuda, seda kogeda ja jagada. See soov nõuab eksperimenteerimist ja prototüüpide ehitamist ning tervet DIY-skeenet. Seepärast korraldame süntesaatorite DIY-ürituse Tallinnas, linnas, mis on kuulus oma tehnilise loovuse poolest, nii et võime isegi näha järgmist Stockhausenit, Moogi või Cianit. Koostöös Liivateraga toimub kokkusaamine kõigile, keda huvitavad omatehtud elektroonilised instrumendid.

Kui sul on midagi näidata, anna meile teada, et saaksime tagada kõigile piisavalt laudu, ja too see kaasa.
Kui oled uudishimulik, tule vaata, mida teised teevad, vestle, saa inspiratsiooni, inspireeri teisi....

Algajatele toimub Erica Synthsi juhendatav töötuba, mis aitab hästi alustada, kuid vajalik on registreerumine (aadress flaieril).

Küsimuste jaoks toimub paneelarutelu Erica Synthsi, Neil J (Cesyg, Sound Semi) ja minuga.
Toimub loterii DIY-teemaliste auhindadega

Õhtul toimub „open mic”, kus igaüks saab oma loominguga teha (lühikese) etteaste (kuid anna oma huvist teada Uus ajakava

10.30 Uksed avatakse
11.00 Moodulite ehitamise töötuba
14.30 DIY-elektroonika ja süntesaatorite ehitamise sessioon
19.00 Kontsert

Moodulite ehitamise sessioonis ehitatakse nüüd Liivatera pakutav VCO kalibraator ja häälestaja ning mõned kohad on veel vabad ette)

UUENDUS
Uus ajakava

10.30 Uksed avatakse
11.00 Moodulite ehitamise töötuba
14.30 DIY-elektroonika ja süntesaatorite ehitamise sessioon
19.00 Kontsert', (SELECT 49 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 49))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1039 AND starts_at = '2025-10-25T10:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1039 AND lang = 'et')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND slug = 'synth-diy-tallinn');
-- 1038, 2025-09-14, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1038, 'en', 'pimenagemine', 'Pimenägemine', 'Author: **Karl Ristikivi**

Director: **Ott Aardam**

Read by: **Lembit Peterson**, **Laura Peterson-Aardam**, **Helvin Kaljula**, **Marius Peterson**, **Tarmo** **Song**, **Ott Aardam** and **Abram Aardam**

Sound: **Taavi Kerikmäe**

Premiere on Sunday 14 September 2025 at 20:30 at the House of the Blackheads

**Karl Ristikivi**''s radio play **“Pimenägemine”** was written in Swedish in the 1950s under the pseudonym **Kent Jansson**. For some reason Ristikivi considered it important to hide behind a pseudonym. The central character of “Pimenägemine” is a man who hides in darkness. He cannot see. His eyes are fine, but he cannot see. Or does he not want to see, or is he unable to?

Ristikivi asks whether the bare, harsh truth is what saves the world, or whether truth without love is so devastating that it is healthier to hide from it. You can listen your way into these themes together with Karl Ristikivi, the actors of Theatrum and the sound design created by Taavi Kerikmäe.

**Theatrum''s “Kuulamised” series** was created to listen to different texts together. Listening together, you always hear something in a text that you would not hear alone.

This time we have taken “Kuulamised” one step further. It is a kind of listening experiment in which the audience''s eyes are covered. Only listening remains. And if you listen very sharply, you may also see.

**The radio play “Pimenägemine”** comes to the stage as part of the **Pikk Street Festival**.

Supported by: **City of Tallinn**, **Cultural Endowment of Estonia**, **Estonian Centre of Contemporary Music (ECCM)**, **Karl Ristikivi Society**

Organiser of the event:

SA Theatrum
Vene 14, Tallinn 10123
reg. no: 90008956', (SELECT 48 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 48))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1038 AND starts_at = '2025-09-14T20:30')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1038 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'pimenagemine');
-- 1037, 2025-09-14, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1037, 'en', 'vanamuusika-ampsud-pikk-street-festival', 'Vanamuusika Ampsud. Pikk Street Festival.', 'Vanamuusika Ampsud is a series of mini-concerts with Tuuli Lindeberg, an internationally acclaimed soprano in early and contemporary music. Appearing with Lindeberg are Anna-Liisa Eller and Taavi Kerikmäe.

On the programme: at 16:00 a mini-concert of medieval music, at 17:00 a mini-concert of Renaissance music, at 19:00 a mini-concert of Baroque music. The musicians introduce the music chosen for the concerts and its connections with Estonia in English. You can hear various clavichords, the clavicymbalum, the arpanetta, various plucked instruments and of course Tuuli’s ringing soprano. You can also see the exhibition by Hedi Jaansoo and Juliana Lindenhofer at Draakoni galerii.

The concert takes place as part of the Pikk Street Festival. Partner: Draakoni galerii', (SELECT 47 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 47))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1037 AND starts_at = '2025-09-14T16:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1037 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'vanamuusika-ampsud-pikk-street-festival');
-- 1036, 2025-09-11, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1036, 'en', 'schonberg-series-midnight-songs-eriko-takahashi-piano', 'Schönberg series. Midnight Songs. Eriko Takahashi (piano)', 'Estonian, Finnish and Japanese piano music of the 20th and 21st centuries. Works by Arvo Pärt, Urmas Sisask, Helena Tulve, Toshi Ichiyanagi, Akira Kobayashi, Somei Sato, Kai Nieminen, Selim Palmgren and Ari Romppanen.

Eriko Takahashi (piano, Japan)
The concert will be followed by a discussion.
Tickets 20/10/5

PROGRAMME
Urmas Sisask (1960 to 2022)
Aquarius (dream) from “Starry Sky Cycle op. 10” (1980 to 1987)

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

Toshi Ichiyanagi (1933 to 2022)
Cloud Atlas VIII “Cloud in the Distance” (1989)

Akira Kobayashi (*1960)
Glass Swan (2000)

Somei Sato (*1947)
Pieta (2024)

Ari Romppanen (*1974)
Erakis (2016 to 2017)

Urmas Sisask (1960 to 2022)
Lyre (happiness) from “Starry Sky Cycle op. 10” (1980 to 1987)

Eriko Takahashi (piano)

“Midnight Songs”, Estonian, Finnish and Japanese piano music of the 20th and 21st centuries. Works by Arvo Pärt, Urmas Sisask, Helena Tulve, Toshi Ichiyanagi, Akira Kobayashi, Somei Sato, Kai Nieminen, Selim Palmgren and Ari Romppanen.

Born in Yokohama, Japan, the pianist Eriko Takahashi has a strong interest in lesser-known or forgotten works and in contemporary music. She has worked with a number of composers, given first performances of their works, and has had works dedicated to her.

At the age of 11 she performed with Roland Bader and Capella Cracoviensis in a concert in Tokyo. In 2013 she appeared in the Benjamin Britten anniversary concert at the Brucknerhaus in Linz, Austria. In 2023 and 2024 she performed at the Joensuu Music Festival in Finland. She has released two CDs: “Musique Variée” (2019) and “Nordic Visions, Finnish Piano Music” (2025, ALM Records).

Since 2020 she has been a member of the Japan Finland Contemporary Music Society in Tokyo. Since 2024 she has taught piano at Japan Women’s University in Tokyo.

After graduating from the Toho Gakuen School of Music in Tokyo, Takahashi studied piano and chamber music at the Anton Bruckner Private University in Linz. She also studied contemporary music at the University of Music and Performing Arts Graz. She has won prizes at piano competitions such as “Cittá di Barletta” in Italy, “Premio Accademia Giovani” in Rome and the Julian Cochran Piano Competition in Warsaw. In 2015 she was awarded a scholarship by the Rotary Club Wels in Austria.

She was a member of the jury at the international piano competitions “Clavis St. Petersburg 2017” and “Japan Classical Music Competition 2023”.

In cooperation with
Estonian Arnold Schönberg Society
Estonian Centre of Contemporary Music (ECCM)
EELC St Elizabeth’s Congregation, Pärnu
EELC Tartu University and St John’s Congregation
Pärnu Opera
Autorfest

Supported by
City of Pärnu
City of Tartu
City of Tallinn
Cultural Endowment of Estonia
Ministry of Culture

[erikotakahashi.com](https://erikotakahashi.com/)
[schoenberg.ee](https://schoenberg.ee/)', (SELECT 46 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 46))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1036 AND starts_at = '2025-09-11T19:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1036 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'schonberg-series-midnight-songs-eriko-takahashi-piano');
-- 1035, 2025-08-29, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1035, 'en', 'tallinn-1965-school-reunion-at-culture-night', 'Tallinn 1965 School Reunion at Culture Night', 'Ideally, a school means a sense of belonging according to an internally recognised logic. This logic can often be recognised by others too, those who belong to other schools or to none at all. One possible underlying pattern for this school reunion is “a school of fish”: fish swim together in a coordinated way, with some inner synchronisation. But these here are not similar fish. They simply understand each other’s logics and are willing to share them for a little while.

18:00 Ansambel EMA / Mikko Ojanen / Jari Suominen “Elektra”
18:30 Raul Keller, installation ‘Segaja / Jammer’
19:00 Aivar Tõnso ‘Ebakõlarid’
20:00 Roberto Becerra / Matas Samulionis
Jesper Pedersen
Theodor Parker
21:00 Conversation: the performers + Girts Ozolins, Anna Fisere
22:00 Tarmo Johannes, interactive ‘Mustrimäng’

Artists:
JESPER PEDERSEN [ISL]

A Reykjavík-based composer, sound artist and live electronics performer who has created electroacoustic music and sound art works for acoustic instruments and experimental home-made instruments. His works often use experimental animated or graphic notation that explores spatial and performative concepts of sound. In recent years Pedersen has focused on the modular synthesiser and live electronics. He approaches sound through improvisation and listening, explores abstract sound, texture, noise and drone, and has collaborated widely with other musicians.

ROBERTO BECERRA [MEX,LT] is a multidisciplinary artist, technology enthusiast and engineer. He is a co-founder of the Vilnius creative space “Ideas Block” and the cultural platform “Arttice”. Roberto also works as a programmer, lecturer and project manager at the Lithuanian Academy of Music and Theatre.

MATAS SAMULIONIS [LT] is a musician, composer, producer and researcher dedicated to exploring the meeting points of acoustic and electronic music. He is a skilled improviser who combines traditional and avant-garde musical principles to create innovative and experimental compositions and live performances. With an academic background in jazz saxophone (BA) and contemporary improvisation (MA), Matas combines his expertise with a range of electronic instruments and approaches. At the core of his work is free improvisation, with an emphasis on form and control as essential means of documenting and refining an artistic whole.', (SELECT 45 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 45))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1035 AND starts_at = '2025-08-29T18:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1035 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'tallinn-1965-school-reunion-at-culture-night');
-- 1034, 2025-05-17, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1034, 'en', 'mette-mari-kaljas-karl-jogi-stan-callewaert-on-the-potential', 'Mette Mari Kaljas / Karl Jõgi / Stan Callewaert: on the potential for collaboration between graphic designer and composer', 'On Saturday 17 May 2025 at 17:00, Mette Mari Kaljas presents her bachelor''s project. The graduation project of Mette Mari Kaljas, a graphic design student at the Estonian Academy of Arts, deals with graphic notation and explores the potential for collaboration between graphic designer and composer in creating score graphics. A work for violin and double bass, created in collaboration with Karl Jõgi and Stan Callewaert, will be performed, followed by a discussion.', (SELECT 43 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 43))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1034 AND starts_at = '2025-05-17T16:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1034 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'mette-mari-kaljas-karl-jogi-stan-callewaert-on-the-potential');
-- 1033, 2025-05-15, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1033, 'en', 'schonberg-series-remix-3-andrus-kallastu-composer-s-concert', 'Schönberg series REMIX 3 Andrus Kallastu composer''s concert', 'Tickets 20/10/5
[fienta.com/et/schonbergi-sari-remix3-andrus-kallastu-autorikontsert](https://fienta.com/et/schonbergi-sari-remix3-andrus-kallastu-autorikontsert)

PROGRAMME

Andrus Kallastu (1967)

Kolm momenti, instrumental theatre for chamber ensemble (2025, premiere)
1. Purjekad | Sailboats
2. Vahvlipeer | Waffle fart
3. Blékété

Roomet Jakap''s Three Lectures on Philosophy
Lectiones, recitative for voice and chamber ensemble (2019)
Descartes
Spinoza
Leibniz

Disputationes, sonata for chamber ensemble (2019)
Descartes. Allegro elastico
Spinoza. Andante rigoroso
Leibniz. Vivace

Repoo Ensemble
Kai Kallastu, voice, sound objects
Leonora Palu, flute
Aare Tammesalu, cello
Jorma Toots, piano
Andrus Kallastu, conductor, electronics

The conceptual concert programme Remix 3 presents works by Andrus Kallastu in moment form. Kolm momenti is a transcription into notation of three particular sound materials. Roomet Jakap''s Three Lectures on Philosophy deals with the basic units of the metaphysical structure of the world, or substances, by examining the positions of three early modern philosophers. The dualism of René Descartes, the monism of Baruch Spinoza and the pluralism of Gottfried Wilhelm Leibniz are opened up here from new angles, addressing contemporary people in their rootlessness and superficial perception. The starting point for presenting the views of all three philosophers is a historiographical and contextualising reconstruction, to which a detailed unpacking and analysis of the arguments is added. Attention is paid to the sonic aspects of these positions and arguments, which philosophical research so far has generally ignored. The lectures are followed by a musical disputation in three movements in the form of an early sonata.

The concepts of the moment and moment form were introduced by Karlheinz Stockhausen in connection with his work Kontakte (1958 to 60). For Stockhausen a moment is any formal unit of a musical work that is recognisable by a certain unmistakable character. A moment can be an indivisible figure, a structure with clear components, or a mixture of the two. A moment can be static or dynamic, or a combination of the two. A moment can be of any length. Moment form is a compositional approach to music in which narrative is deliberately avoided. In works in moment form the moments are connected non-linearly. If the system of moments is exhausted with a certain number of possibilities, the form is closed. If the sequence of moments is unfinished, the form is open. Moment form does not necessarily rule out processes perceived as goal-directed. The moments simply do not take part in a directed narrative arc. Moment form is not directed towards a climax and lacks the introductory, rising, transitional and fading stages usual in a climactic form. Nor is moment form defined as a curve of development spanning the whole duration of the work. On the contrary, moment form reaches maximum intensity at once, and that level is kept until the end of the work. In a work in moment form a dynamic minimum or maximum may be expected at any moment, and the direction of the work''s development is unpredictable. Moment form has, as it were, always already begun and goes on forever. In moment form there is everything or nothing at once. Now-moments cannot be seen as the consequence of the moments before them or as preparation for the moments to come. Nor are moments something a person could rely on. Moments are rather independent, able to exist on their own. In moment form a moment is not a point on a timeline or a span of measured duration. Moment form focuses on the present, in which every moment drives vertical wedges, as it were, through the horizontal, bringing about the absence of time, eternity. Eternity does not begin at the end of time but exists at every moment in time. A work in moment form seeks, as it were, to abolish time, or more precisely the sense of temporal duration. Although a work in moment form may cease after a certain time, both its beginning and its end often remain open for the listener.

In cooperation with
Estonian Arnold Schönberg Society
Estonian Centre of Contemporary Music (ECCM)
EELC Pärnu St. Elizabeth''s Congregation
EELC Tartu University and St. John''s Congregation
Pärnu Opera
Autorfest

Supported by
City of Pärnu
City of Tartu
City of Tallinn
Cultural Endowment of Estonia
Ministry of Culture

[www.kallastu.ee](https://www.kallastu.ee/)
[schoenberg.ee](https://schoenberg.ee/)', (SELECT 44 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 44))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1033 AND starts_at = '2025-05-15T20:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1033 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'schonberg-series-remix-3-andrus-kallastu-composer-s-concert');
-- 1032, 2025-05-15, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1032, 'en', 'viktoria-grahv-book-of-glagolitic-dreams', 'Viktoria Grahv. Book of Glagolitic Dreams', 'Viktoria Grahv. “Book of Glagolitic Dreams” (premiere)

Evelyn Kanepi (voice), Anastassia Danilenko (voice), Brigitta-Selestine Petropavlova (piano), Anna-Helena Inno (viola), David-Ovid Komlev (accordion)

“Book of Glagolitic Dreams” is written for two singers, piano, accordion, viola, tape and video. The work deals with the themes of loneliness and isolation. An important part of the piece is formed by 13 texts that reveal the nature of loneliness through various everyday objects. The texts are written in the medieval Glagolitic alphabet.

The concert is part of COMMUTE#7, the Estonian Academy of Music and Theatre''s festival of sound, visuals and music technology, subtitled “Well-being”. The festival runs from 8 to 16 May and this year focuses on mental health.

_The work is in Russian, with Estonian subtitles._

_The festival is organised by the Estonian Academy of Music and Theatre, with support from the Cultural Endowment of Estonia and the City of Tallinn._', (SELECT 40 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 40))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1032 AND starts_at = '2025-05-15T17:30')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1032 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'viktoria-grahv-book-of-glagolitic-dreams');
-- 1030, 2025-04-28, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1030, 'en', 'studio-tallinn-1965-emp-2025', 'Studio Tallinn 1965: EMP 2025', '18:00: A debate on the ecosystem of contemporary music.

19:30: Ekke Västrik presents a work being created in the “Studio Tallinn 1965” residency, in which he uses historical studio technology in live performance. Central to it is musical notation as a means of discovering new soundscapes and ways of presentation. It is also Västrik’s final creative work for his doctoral studies. The work was commissioned by the Üle Heli festival and will be performed in full in autumn 2025.

21:00: Tape Disco. Musicians of the Estonian Electronic Music Society ensemble (EMA) choose music from the obscure tape collection of “Studio Tallinn 1965”.

Admission free!', (SELECT 39 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 39))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1030 AND starts_at = '2025-04-28T18:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1030 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'studio-tallinn-1965-emp-2025');
-- 1029, 2025-04-14, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1029, 'en', 'seeds', 'SEEDS', 'The Centre of Contemporary Music''s new series “SEEDS” creates a space for performers and composers who are starting out on the path of the professional contemporary musician. This time we hear work by electroacoustic music students of the Estonian Academy of Music and Theatre.

Programme:

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

Tickets: free concert', (SELECT 38 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 38))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1029 AND starts_at = '2025-04-14T18:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1029 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'seeds');
-- 1027, 2025-04-10, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1027, 'en', 'schonberg-series-yellow-wasabi', 'Schönberg series. Yellow Wasabi', 'Yellow Wasabi was born in 1999 in Canton, China. She has played the Chinese harp, the guzheng, since childhood, and holds a bachelor’s degree in ecology and a master’s degree in neuroscience from Université Paris-Saclay in France. Influenced by her father, a professor of physics, and her mother, a professor of fine arts, she believes that science and art are connected. She has chosen to use biology and new media for the artistic exploration of a dynamically changing world.

Yellow Wasabi has discovered experimental music, especially harsh noise. In her work she combines the guzheng with Max/MSP, renewing her performances with biometric modules, microscopes, motion sensors and interactive 3D projections generated by artificial intelligence. For her, unbearable noise is the sonification of the trivial things of life.

Yellow Wasabi wants to wake people up by pushing their physical limits and reconnecting their bodies with the environment. For her, art is a fossil of human perception. She wants to turn the struggle of life into a joyful vitality and to bring people happiness through science and the arts.

With the support of the Council of Europe, French national arts foundations and private foundations, Yellow Wasabi has performed in China, France, Belgium, the Netherlands, Germany, Poland, Latvia, Lithuania, Estonia, Finland, Switzerland and Greece. She is active on the European and Asian experimental music scene, in contemporary art galleries and at scientific congresses. As a young scientist she has been artist in residence in a number of European and national projects.

In cooperation with
Estonian Arnold Schönberg Society
Estonian Centre of Contemporary Music (ECCM)
EELC St Elizabeth’s Congregation, Pärnu
EELC Tartu University and St John’s Congregation
Pärnu Opera
Autorfest

Supported by
City of Pärnu
City of Tartu
City of Tallinn
Cultural Endowment of Estonia
Ministry of Culture
Culture Moves Europe

[www.yellowwasabi.net](https://www.yellowwasabi.net/)
[schoenberg.ee](https://schoenberg.ee/)

Tickets: 20/10/5', (SELECT 37 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 37))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1027 AND starts_at = '2025-04-10T19:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1027 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'schonberg-series-yellow-wasabi');
-- 1025, 2025-03-12, translated from the English
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1025, 'et', 'devaux-girard-charest-kerikmae-improtestil', 'Devaux/ Girard-Charest/ Kerikmäe Improtestil', 'Sylvain Devaux on oboemängija, improvisaator ja helilooja. Uuele muusikale pühendunult on ta l''Itineraire''i liige ning teeb koostööd selliste ansamblitega nagu l''Instant Donné, l''ensemble Intercontemporain või Ictus. [www.sylvaindevaux.com](http://www.sylvaindevaux.com/)

Émilie Girard-Charest on tšellist, helilooja ja improvisaator, kes on pühendunud uuele muusikale. Kammermuusikuna on ta osalenud enam kui kuuekümne uue teose esiettekandel, tehes koostööd selliste heliloojatega nagu Malcolm Gldstein, Thomas Nicholson, Kasper T. Toeplitz jt

Taavi Kerikmäe on muusik, kes tegutseb uue, eksperimentaalse ja vanamuusika vallas. Ta esineb erinevatel klahvpillidel ja elektroonikal.', (SELECT 36 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 36))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1025 AND starts_at = '2025-03-12T20:30')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1025 AND lang = 'et')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND slug = 'devaux-girard-charest-kerikmae-improtestil');
-- 1023, 2025-03-07, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1023, 'en', 'hetkfest', 'HETKfEST', 'HETKfEST is a new festival devoted to instant composition, the art of improvisation.

Programme:
Friday 7 March
19:00 avaHETK (tickets [on Fienta](https://fienta.com/et/hetk1) 12/7)
Paul Beaudoin
Bósons duo
DongBin Lee
KriHeAn
Saturday 8 March
12:00 teatriHETK (tickets [on Fienta](https://fienta.com/et/teatrihetk) 10/5)
A performance in the dark by Nähtamatu Teater
14:00 elamusHETK (free)
Maggie Nicols workshop
registration link: [forms.gle/7UeQh1uVJs5WjJMLA](https://forms.gle/7UeQh1uVJs5WjJMLA)
20:30 kõrgHETK (tickets [on Fienta](https://fienta.com/et/hetk1-120091) 12/7)
Maggie Nicols
Rooluulend
Roosna&Flak
Sunday 9 March
14:00 ansambliHETK (free)
HETKfEST ensemble workshop, open to musicians/dancers/poets/actors/+
registration link:[forms.gle/omJbaZxUUT55aBAP8](https://forms.gle/omJbaZxUUT55aBAP8)
17:00 lõppHETK
HETKfEST ensemble concert (tickets [on Fienta](https://fienta.com/et/hetk1-120092) 10/5)', (SELECT 34 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 34))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1023 AND starts_at = '2025-03-07T00:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1023 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'hetkfest');
-- 1022, 2025-02-28, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1022, 'en', 'kirke-karja-at-improtest', 'Kirke Karja at Improtest', 'Kirke Karja (1989) is a pianist and composer. Her main musical outlet is the international trio Karja/Renard/Wandinger, with which she has in recent years performed at many international jazz festivals, including Jazzfest Berlin, Vossa Jazz, Punkt, Jazzahead and Südtirol Jazzfest; numerous tours have taken the trio to Finland, Norway, the Netherlands, France, Germany, Italy, Switzerland, Hungary, Poland and Canada. Currently on stage is the Estonian Drama Theatre production "Solist", in which she plays Käbi Laretei. As a composer, Kirke has written music for both chamber ensembles and orchestras. In 2022 she completed a piano concerto written especially for the Pärnu City Orchestra, conductor Kaspar Mänd and pianist Sten Heinoja. Kirke herself also performed the same piano concerto in Canada in June 2023 with the Hamilton Philharmonic. In 2024 she completed "Murenemine", a long work in several movements for the new chamber music ensemble Ludensemble.

Improtest is an international concert series of improvised music, held since 2005 and curated by Mart Soo and Taavi Kerikmäe.

Tickets: 10/8€ at Fientas and at the door', (SELECT 35 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 35))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1022 AND starts_at = '2025-02-28T19:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1022 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'kirke-karja-at-improtest');
-- 1020, 2025-02-12, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1020, 'en', 'urr-45-defitsiit', 'URR-45: Defitsiit', 'Programme:

**Tom Johnson** (1939 to 2024) - _Maximum Efficiency_ (1985) for three performers
**Frederic Rzewski** (1938 to 2021) - _Love of Money_ (1993) for voice and piano
**Jüri Reinvere** (1971) - _Ööpilt magava Cupidoga_ (2023) for flute, clarinet, percussion, piano, violin and cello
**Frederic Rzewski** (1938 to 2021) - _Coming Together_ (1971) for narrator* and instruments

The concert will be streamed on the [elektron.art](https://elektron.art/) platform.', (SELECT 29 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 29))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1020 AND starts_at = '2025-02-12T19:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1020 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'urr-45-defitsiit');
-- 1017, 2025-01-17, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1017, 'en', 'villem-jahu-at-improtest', 'Villem Jahu at Improtest', 'Villem Jahu is a visual and sound artist, synthesist and free improviser who focuses on a more abstract sound language and on live performance, mainly on self-built electronic instruments.

In recent years Villem Jahu has been actively performing in concerts in Estonia as well as in Germany, the UK, Portugal, Italy, Spain and elsewhere. He has made sound waves together with, among others, Katariin Raska, Juhan Vihterpal, Roomet Jakap, Erik Alalooga, Riho Kall, Siim Kuusemäe and Meelis Salujärv.

[villemjahu.com](http://villemjahu.com/)

Improtest is a series of freely improvised music running since 2005, curated by Mart Soo and Taavi Kerikmäe. The concert series'' partners are the Estonian Centre of Contemporary Music (ECCM) and Tallinn Music City. The series is supported by the Cultural Endowment of Estonia

Tickets: Tickets on Fienta and at the door 10/8€', (SELECT 33 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 33))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1017 AND starts_at = '2025-01-17T19:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1017 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'villem-jahu-at-improtest');
-- 1015, 2024-12-05, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1015, 'en', 'eka-emta-and-bfm-science-cafe', 'EKA, EMTA and BFM Science Café', '**We continue to introduce creative research practices, this time with a focus on applying research results.**

Presenting their ongoing projects and taking part in the discussion are Toomas Siitan, Taavi Kerikmäe (EMTA), Taavet Jansen (EKA), Michael Keerdo-Dawson (TLÜ BFM), Ekke Västrik (EMTA) and Katrin Kabun (EKA); the discussion is moderated by the musicologist and conductor Toomas Siitan (EMTA).

Alongside the discussion, Toomas Siitan introduces the fascinating background, linked to Estonia, of the project “The Rebirth of the Cembal d’amour”. After that you can hear the unusual instrument itself, the _cembal d’amour_ (literally “clavichord of love”), built from 18th-century drawings. Performers: Taavi Kerikmäe and Anna-Liisa Eller (kannel).

Tea, coffee and snacks will be served.

Tickets: Admission free. Please register by Tuesday 3 December 2024: [docs.google.com/forms/d/e/1FAIpQLSc9fgsA5gH-lNsxH_8L1mztF6YRnioVPtiLLa_FC9-y5pSlyg/viewform](https://docs.google.com/forms/d/e/1FAIpQLSc9fgsA5gH-lNsxH_8L1mztF6YRnioVPtiLLa_FC9-y5pSlyg/viewform)', (SELECT 20 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 20))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1015 AND starts_at = '2024-12-05T18:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1015 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'eka-emta-and-bfm-science-cafe');
-- 1013, 2024-11-14, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1013, 'en', 'sound-plasma', 'Sound Plasma', 'Ensemble for New Music Tallinn and students of the Estonian Academy of Music and Theatre (EMTA)', (SELECT 19 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 19))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1013 AND starts_at = '2024-11-14T19:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1013 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'sound-plasma');
-- 1012, 2024-11-09, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1012, 'en', 'kasemets-and-kurenniemi', 'Kasemets and Kurenniemi', 'Concert installation: Udo Kasemets, “Tt - tribute to Buckminster Fuller, Marshall McLuhan, John Cage” (1968)

Performers: the Estonian Electronic Music Ensemble EMA and Mikko Ojanen.', (SELECT 17 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 17))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1012 AND starts_at = '2024-11-09T19:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1012 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'kasemets-and-kurenniemi');
-- 1011, 2024-11-09, translated from the English
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1011, 'et', 'hainbachi-lindiloikamise-tootuba', 'Hainbachi lindilõikamise töötuba', 'Hainbach on saksa [eksperimentaalse](https://en.wikipedia.org/wiki/Experimental_music) [elektroonilise muusika](https://en.wikipedia.org/wiki/Electronic_music) [helilooja](https://en.wikipedia.org/wiki/Composer) ja [videolooja.](https://en.wikipedia.org/wiki/Video_creator)Ta on saanud rahvusvaheliselt tuntuks oma [YouTube](https://en.wikipedia.org/wiki/YouTube)''i kanalil avaldatud [ambient](https://en.wikipedia.org/wiki/Ambient_music)-salvestuste ja eksperimentaalse muusika võtetega. [Pitchfork](https://en.wikipedia.org/wiki/Pitchfork_(website)) kirjeldas Hainbachi kanalit kui "aardelaegast klippidega, mille pealkirjad on näiteks ''How to Make Music With a Vintage Piano Tuner'' ja ''Playing Live With Nuclear Instruments and Unknown Synths.

Piletid: Piletite arv piiratud: [fienta.com/et/tallinn-1965-tulevik-laks-meist-mooda-108790](https://fienta.com/et/tallinn-1965-tulevik-laks-meist-mooda-108790)', (SELECT 16 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND legacy_id = 16))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1011 AND starts_at = '2024-11-09T16:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1011 AND lang = 'et')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'et' AND slug = 'hainbachi-lindiloikamise-tootuba');
-- 1010, 2024-11-08, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1010, 'en', 'robert-dick-trio-at-improtest', 'Robert Dick trio at Improtest', 'Robert Dick Scandinavian Trio with Niels Præstholm and Christian Windfeld.

The trio brings together Robert Dick, one of the world''s most prolific flute players, and two leading Danish improvisers. Their music can be described as a unique fusion of sounds and rhythms. Known around the world as a leader of contemporary flute music, Robert Dick embodies the ideal of the Renaissance artist. Equally deeply rooted in classical and new music and in free improvisation and new jazz, he has proven himself an artist who has not only mastered his instrument superbly but has also redefined it. Robert''s music carries a vision of constant change and searching. He draws ideas from the jazz tradition, world music (especially Indian and African), electronic music and the sounds of nature. His work is marked by clarity of structure and an incredibly wide variety of timbre.

Bassist Niels Præstholm is a veteran of Danish and international jazz and improvised music. He graduated from the Rhythmic Music Conservatory in Copenhagen in 1990. Præstholm has received many honours, both as a composer and as the leader of his own ensembles, and as a sideman with many artists. As an improviser and composer, Præstholm is known with his ensembles Embla and Gyroscope String Trio as a forerunner of Nordic jazz. Præstholm has toured internationally and recorded with artists such as Michael Gregory Jackson, Django Bates, Kresten Osgood, Mart Soo, John Tchicai, Butch Lacy and many, many others. Find out more on the website [www.nielspraestholm.dk](http://www.nielspraestholm.dk/)

Christian Windfeld is a Danish improviser, composer and percussionist, a graduate of the Royal Academy of Music in Aarhus, Denmark.

Since the age of 19 he has been very active, touring all over Europe, North America and Australia, and has lived in Stockholm, New York and Berlin. Windfeld has a minimalist but highly expressive approach to percussion, often reducing his means to focus on just one unit of the drum kit, e.g. the snare drum, to explore all the possibilities it offers.

[www.christianwindfeld.com](http://www.christianwindfeld.com/)', (SELECT 18 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 18))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1010 AND starts_at = '2024-11-08T21:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1010 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'robert-dick-trio-at-improtest');
-- 1009, 2024-11-08, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1009, 'en', 'ema-concert-drosseli-ringid', 'EMA concert “Drosseli Ringid”', 'The programme brings the rediscovered electroacoustic compositions from the 1950s and 1960s by Õie-Olinda Sachermann (born 1915), presumably the first Estonian woman composer of electronic music, and music by Sven Grünberg on instruments of its era. EMA has brought Grünberg’s early electronic music to the stage, bringing the legendary studio recordings to life in live performance.

Very little is known about Sachermann. It is not known where Sachermann worked, but she presumably had access to Estonian Radio’s equipment, as the distinctive sound of the choke-coil oscillating circuits in use at the time bears witness. The compositions are performed by EMA, the ensemble of the Estonian Electronic Music Society.

The concert takes place as part of the annual conference of the Estonian Centre of Contemporary Music (ECCM), which this year, under the title “Tulevik läks meist mööda” (The Future Passed Us By), deals with technological innovation, or more precisely and in plainer words, with musical instruments. We will discuss the role of instruments in making music and, more broadly, in making art.

Tickets: concert tickets [fienta.com/et/ema-kontsert-drosseli-ringid](https://fienta.com/et/ema-kontsert-drosseli-ringid) 15/25 and at the door 20/30', (SELECT 14 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 14))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1009 AND starts_at = '2024-11-08T19:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1009 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'ema-concert-drosseli-ringid');
-- 1008, 2024-11-08, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1008, 'en', 'exhibition-primaarid-and-panel-discussion', 'Exhibition “Primaarid” and panel discussion', 'Primaarid is an exhibition of firsts. On show are machines and instruments that have been pioneers: they helped create unprecedented sound fields, entirely new musical styles and new ways of thinking about sound. They carry elegant instrument design, but more importantly an undetermined potential, because their agency is open in form. At the opening of the exhibition Kaarel Kurismaa and Kiwa will play, and Margo Kõlar, Taavi Kerikmäe and Mikko Ojanen will talk about the instruments.

The exhibition shows almost 15 instruments, most of which you have previously seen only in photographs or from very far away.

- Buchla 100 is a synthesiser created by Don Buchla in the 1960s, commissioned by the California Tape Music Center. Morton Subotnick''s album “Silver Apples of the Moon” (1967), for example, was made on such a Buchla system.
Igor Zubkov''s String Exiter is an experimental electromagnet built in Tallinn, commissioned by Taavi Kerikmäe, used to play the metal strings of musical instruments.

- Springer Tempophon is a device made in the 1950s that makes it possible to change the speed of a recording without affecting its pitch, and also to change the pitch while keeping the speed the same. The Springer Tempophon was used in Stanley Kubrick''s 1968 film “2001: A Space Odyssey” to modify the voice of the AI system HAL 900. The Tempophon on show comes from a studio of Bucharest radio.

- The Serge modular synthesizer is a synthesiser designed by Serge Tcherepnin in the early 1970s. The synthesiser on show is an early generation, so-called Paperface version, dating from the mid-1970s. The synthesiser originally belonged to the American composer Michael Manion, who also worked as an assistant to Karlheinz Stockhausen.

- The Hohner electronium is a valve synthesiser with its accompanying amplifier, created by the instrument designer René Seybold and produced by Hohner from 1950. Stockhausen''s group used such an instrument in performances of works such as Pole and Kurzwellen in the 1960s.

- The BEAG AKX-200 tape delay is a device produced in Hungary in the 1970s. The echo machine on show was used by Sven Grünberg in his electronic work of the 1970s and 1980s, including the music for the film “Hukkunud alpinisti hotell”.

- The Clavioline is a valve synthesiser from the 1950s, made in numerous versions. Sven Grünberg used such an instrument on his legendary albums “Hingus” and “OM”.

- The Retakord is an electric organ with an amplifier and loudspeaker, produced at the Punane RET radio factory from 1965 to 1975. It was the first industrially produced polyphonic electric organ in the Soviet Union. The organ''s design and technical solution were based on the work of Heino Kalmo.

- The theremin (Teremin) is one of the earliest electronic music instruments. It was created in the 1920s by Leon Theremin. The instrument on show is the Etherwave model created by Bob Moog in 1996.

- The Alesis HR 16 drum machine is a device from the 1980s on which Sven Grünberg made the rhythm tracks for the animated film “Naksitrallid” (1984).
- The wax cylinder recorder and player is one of the earliest sound recording devices, developed at the end of the 19th century. The device on show dates from the early 20th century, probably from a post office.

- The Brüel & Kjaer 1022 is a laboratory valve oscillator from the 1960s, used in their early electronic work by the important electronic music studios in Milan and Cologne, and also at the BBC.

- The modular synthesiser made by Härmo Härm dates from the late 1970s. Härm built it for Kaarel Kurismaa.

Erkki Kurenniemi''s electronic musical instruments
The Finnish electronic music pioneer Erkki Kurenniemi (1941 to 2017) designed and built ten unique electronic musical instruments from 1964 to 1975. With his instruments Kurenniemi sought to solve a central problem of the time: studio work based on time-consuming tape manipulation was cumbersome. Kurenniemi''s idea was to replace it with automated and algorithmic processes of composition and music making. His computer-based approach to making new music was inspired by the Columbia-Princeton Electronic Music Center and by the early design ideas of the Elektronmusikstudion in Stockholm, Sweden. Kurenniemi built his early “digital” synthesisers using microchips and developed memory modules for his instruments. These were quite unexpected technical solutions for an electronic musical instrument of the 1960s.
The exhibition includes two of Kurenniemi''s instruments, which can be heard at the Saturday evening concert. DICO (a copy of the main interface of the original 1969 instrument) is a 12-step sequencer-synthesiser that Kurenniemi built for the Finnish composer Osmo Lindeman. The instrument is programmed by touching grounded metal pins, switching the corresponding ten bits of binary code on or off.

DIMI-A (1970) is a 256-step sequencer-synthesiser with two sound generators. The instrument is programmed by touching metal plates with two styluses.
[vimeo.com/80931815](https://vimeo.com/80931815)

Tickets: the event is free. On 9 and 10 November the exhibition is open to conference guests: [fienta.com/et/tallinn-1965-tulevik-laks-meist-mooda](https://fienta.com/et/tallinn-1965-tulevik-laks-meist-mooda)', (SELECT 15 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 15))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1008 AND starts_at = '2024-11-08T17:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1008 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'exhibition-primaarid-and-panel-discussion');
-- 1007, 2024-11-08, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1007, 'en', 'conference-the-future-passed-us-by', 'Conference "The Future Passed Us By"', 'The conference and its accompanying concert programme focus on the agency of sound machines based on analogue technology.

As is the tradition at ECCM conferences, we draw parallels with other cultural fields: we look at how cybernetics influenced the art and architecture of Soviet Estonia, what science fiction has to say about oxidised technology, and what the practices, expectations and fears of the creative field are in relation to today''s cutting-edge technology. On the intertwining of past and future utopias, we invite AI optimists and critics, apologists of innovation and interpreters of the history of technology to debate together with practitioners of the cyberpunk generation.

Schedule
**Friday 8 November**
**17:00 Opening of the exhibition "Primaarid" and discussion**
**Kaarel Kurismaa, Kiwa, Härmo Härm, Margo Kõlar, Taavi Kerikmäe**
**19:00** Concert **"Drosseli Ringid"** in the White Hall of the House of the Blackheads
**Programme: music by Õie-Olinda Sachermann and Sven Grünberg on period instruments.**
Performed by: EMA, the ensemble of the Estonian Electronic Music Society
**21:00 Robert Dick Trio, in the ECCM hall, Pühavaimu 9**
**Saturday 9 November**
Conference in the ECCM hall
**(in English)**
**10:00** Taavi Kerikmäe **The Õie-Olinda Sachermann phenomenon**

**10:30** Mikko Ojanen **Studio utopias and dystopias: Erkki Kurenniemi and electronic music studios in the 1960s**

**11:00** Nina Stener Jørgensen **The Power of the Tower: Nicolas Schöffer''s Cybernetics and Participatory Architecture in the 1970s**

**11:30** Tarmo Johannes **T****t****- Early Interactive Works of Udo Kasemets**
**12:00 Erica Synths presents:** **Elektor Formant system for Tallinn 1965**
**12:15** Discussion
**16:00 Hainbach** workshop (separate ticket)
**19:00 Kasemets - Kurenniemi concert in the ECCM hall**
**DND Dialogue - DIM duo Mikko Ojanen /Jari Suominen**
**Concert-installation Udo Kasemets - Estonian Electronic Music Ensemble EMA**
**Sunday 10 November**
**Conference in the ECCM hall**
**11:00** Jaagup Irve **The Creative Person and Machine Creation**
**11:30** Kristjan Jansen
**Reviving Virtual Performing Arts and Music Installations**
**12:00** Tõnis Kahu
**12:30** coffee break
**13:00** Andrus Laansalu **THE NOISE OF TIME [If music cannot be heard, does it exist?]**
**13:30** Jaak Tomberg **The Reconciling Purpose of Alternative Histories**
**14:00** Discussion
**15:00** END of the conference', (SELECT 10 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 10))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1007 AND starts_at = '2024-11-08T00:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1007 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'conference-the-future-passed-us-by');
-- 1005, 2024-10-18, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1005, 'en', 'ule-heli-2024', 'Üle Heli 2024', 'The sound art and music festival Üle Heli 24 takes place from 17 to 20 October. Held since 2015, the festival focuses not on genre definitions but on the meaning of music and sound and their connections with other fields of art. This year''s festival theme is “sound and imagination”, through which we look at the imaginative potential behind different sounds. The festival''s events, in formats ranging from concerts to an exhibition, take place this time close to one another, in Kanuti Gildi SAAL and its basement and in the rooms of the Estonian Centre of Contemporary Music (ECCM) on the basement floor of the House of the Blackheads.

Programme: the Estonian Electronic Music Society ensemble EMA, Küberstuudio, Kris Kuldkepp "Music for Tropical Storms, First Inversion", Timo Toots, Tencu, Aivar Tõnso, the installation environment of Lokaalraadio (Raul Keller, Hello Upan, Katrin Essenson), Sten Saarits "Mitte segada", Kristjan Kannukene "9", Henri Hütt & Algorütmid "Meta-arheoloogiline aktsioon „Väljad"", Dilian, Juhan Vihterpal, Meisterjaan, Tõnis Koppel, John Grzinich "Ice Tectonics", Sofia Zaiceva, Mari-Liis Rebane, Jaanika Arum, Helen Västrik, John Chantler, Galaktlan and others

The festival is supported by the Cultural Endowment of Estonia, the Ministry of Culture and Tallinn Music City
NB! Single tickets on sale from 7 October', (SELECT 5 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 5))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1005 AND starts_at = '2024-10-18T00:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1005 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'ule-heli-2024');
-- 1004, 2024-10-05, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1004, 'en', 'hommage-a-kaija-saariaho', 'Hommage à Kaija Saariaho', 'The concert is dedicated to the acclaimed Finnish composer Kaija Saariaho (14 October 1952 to 2 June 2023), who died last year, who visited Estonia on several occasions herself and kept in contact and exchanged ideas with Estonian composers. To keep all the shared memories, the Tallinn Chamber Orchestra, the Estonian Centre of Contemporary Music (ECCM) and the composer Helena Tulve join forces to bring a memorial concert for the composer to listeners in the month of Saariaho''s birthday.

“Music is as necessary and mysterious as love. Live music is a miracle that needs silence, care and listening.” Kaija Saariaho

Performers:

**Jean-Baptiste Barrière** (electronics and video)
**Maria Valdma** (soprano)
**Leho Karin** (cello)
**Ansambel U:**
**the Estonian Electronic Music Society''s ensemble EMA**
**Tallinn Chamber Orchestra**
conductor **Kaspar Mänd**

Programme:

**Jean-Baptiste Barrière** - “Contemplation”
**Kaija Saariaho**, “Miranda'' s lament”
**Kaija Saariaho**, “Petals”
**Helena Tulve**, "Vers l''autre clarté" (premiere)
**Kaija Saariaho**, “Lichtbogen”

The concert begins with a short conversation with the composer Jean-Baptiste Barrière.', (SELECT 2 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 2))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1004 AND starts_at = '2024-10-05T19:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1004 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'hommage-a-kaija-saariaho');
-- 1003, 2024-10-03, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1003, 'en', 'improtest-kristin-kuldkepp', 'Improtest: Kristin Kuldkepp', 'Kris Kuldkepp is a Hamburg-based performer of experimental music and a performance artist. Her music has been described as a synergy between rich harmonic textures and noise music. At Improtest Kris performs a programme for acoustic solo double bass, combining her musical roots in classical music with exciting new playing techniques and approaches, and thereby creating unique sound worlds.

Kris also founded, together with the experimental music performer and curator Jeff Surak (Washington DC), the duo Bad Groupy, which explores improvised and constructed sound art. Together they create captivating sound structures that challenge conventional notions of experimental music.

Improtest is an international series of improvised music held since 2005, curated by Mart Soo and Taavi Kerikmäe

Partners:
Cultural Endowment of Estonia, Estonian Centre of Contemporary Music (ECCM), Tallinn Music City', (SELECT 11 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 11))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1003 AND starts_at = '2024-10-03T19:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1003 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'improtest-kristin-kuldkepp');
-- 1002, 2024-09-30, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1002, 'en', 'open-rehearsal-of-helena-tulve-s-new-work-vers-l-autre', 'Open rehearsal of Helena Tulve''s new work "Vers l''autre clarté".', 'Together with musicians of the Tallinn Chamber Orchestra, Ansambel U: and ensemble EMA and conductor Kaspar Mänd, the working process on the piece is presented to open up the background of the new work. At the rehearsal we talk with the composer about the work, play passages from it and search for details of sound together with the composer. The work is dedicated to the memory of Kaija Saariaho and will be premiered on 5 October in the same place, the House of the Blackheads, at the concert "Hommage a Kaija Saariaho".

Tickets: Admission free', (SELECT 12 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 12))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1002 AND starts_at = '2024-09-30T17:30')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1002 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'open-rehearsal-of-helena-tulve-s-new-work-vers-l-autre');
-- 1001, 2024-09-22, translated from the Estonian
INSERT INTO event_text (event_id, lang, slug, title, body, legacy_id)
  SELECT 1001, 'en', 'schoenberg-residency-helia-mailiis-viirakivi', 'SCHOENBERG RESIDENCY. Heliä Mailiis Viirakivi', 'Programme: Muruaga, Saariaho, Viirakivi

Performers:

Heliä Mailiis Viirakivi (voice, flute, electronics)
Kai Kallastu (soprano)
Leonora Palu (flute)
Andrus Kallastu (piano)
Gon Muruaga (guitar, electronics)

Since 2007 the Estonian Arnold Schönberg Society has offered composers, performers and musicologists the chance to carry out their artistic plans and to develop collaboration with Estonian composers, performers and creative people from other fields at Schoenberg Residency, a creative residency in Pärnu.

This year''s Schoenberg resident is the versatile Finnish composer, singer, flautist and improviser Heliä Mailiis Viirakivi, whose work spans contemporary classical music, experimental new music, contemporary improvisation and interdisciplinary compositions. Viirakivi studied music in Finland and Estonia. She has given the first performances of a number of experimental new works, developing international collaboration with creative people from different fields to do so. [www.heliamailiis.com/en](https://www.heliamailiis.com/en/)

Heliä''s creative residency ends with concerts featuring both her own music and works by other composers. The performers also include musicians and composers who have worked with Viirakivi during the residency.

The concert lasts about 1 hour.

In cooperation with: Cultural Endowment of Estonia, City of Pärnu, EELC Pärnu St. Elizabeth''s Congregation, Estonian Centre of Contemporary Music (ECCM), Pärnu Opera, Estonian Arnold Schönberg Society

Tickets: Admission free', (SELECT 13 WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND legacy_id = 13))
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1001 AND starts_at = '2024-09-22T18:00')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE event_id = 1001 AND lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM event_text WHERE lang = 'en' AND slug = 'schoenberg-residency-helia-mailiis-viirakivi');

-- The Tallinn 1965 text page had no English, so /en/tallinn-1965 showed the Estonian under a line saying so;
-- eccm.ee’s English page for it asks for a login. Translated from the Estonian.
INSERT INTO page_text (page_id, lang, slug, title, body, legacy_path)
  SELECT id, 'en', 'tallinn-1965', 'Tallinn 1965', 'Tallinn 1965 is a studio that could have stood in Estonia beside the studios in Paris, Cologne, Milan and elsewhere that shaped the cultural field of the whole Western world. Opening the studio in 2024 sets free a path of development that history never took. A future that did not come gets a new chance to come true. Sometimes historical processes and phenomena have to be created retrospectively in the place where they should have been, but where, for political, economic or social reasons, they never were. Looking back at history, one can see an intense empty space. New technological means and a new technological understanding of processes that never came about, and of physical devices and objects that never reached reality, make it possible to play that unrealised reality through again, and to look anew at technology and what it allows, its utopias and its visions of the future.

Studio 1965 extends the notion of composition to the making of new instruments and technological solutions. A unique instrument with its own specific sound parameters is a work in itself, and the potential music it holds (which may never yet have come out) is already a creation of its own. This idea is still little known, and communicating and explaining it takes a lot of work, which is one of the focuses of Studio 1965. Secondly, sound processing technologies are mixed, in effect from the wax cylinder to AI. Studio 1965 works in a time when there are no longer clear lines dividing technologies. Historical technologies are contemporary and as current as the newest breakthrough technologies.

[Residencies](https://eccm.ee/index.php/et/tallinn-1965/residentuurid)', NULL FROM page
  WHERE key = 'tallinn-1965' AND NOT EXISTS (SELECT 1 FROM page_text t WHERE t.page_id = page.id AND t.lang = 'en')
    AND NOT EXISTS (SELECT 1 FROM page_text WHERE lang = 'en' AND slug = 'tallinn-1965');

-- 5. The venue in English on every English text, where none is typed yet, from the Estonian venue the event has.
UPDATE event_text SET venue = 'ECCM hall' WHERE lang = 'en' AND (venue IS NULL OR venue = '') AND event_id IN (SELECT id FROM event WHERE venue = 'ECCM saal');
UPDATE event_text SET venue = 'Estonian Centre of Contemporary Music' WHERE lang = 'en' AND (venue IS NULL OR venue = '') AND event_id IN (SELECT id FROM event WHERE venue = 'Eesti Nüüdismuusika Keskus');
UPDATE event_text SET venue = 'Estonian Centre of Contemporary Music, House of the Blackheads' WHERE lang = 'en' AND (venue IS NULL OR venue = '') AND event_id IN (SELECT id FROM event WHERE venue = 'Eesti Nüüdismuusika Keskus, Mustpeade maja');
UPDATE event_text SET venue = 'House of the Blackheads, White Hall' WHERE lang = 'en' AND (venue IS NULL OR venue = '') AND event_id IN (SELECT id FROM event WHERE venue = 'Mustpeade maja valge saal');
UPDATE event_text SET venue = 'House of the Blackheads, White Hall' WHERE lang = 'en' AND (venue IS NULL OR venue = '') AND event_id IN (SELECT id FROM event WHERE venue = 'Mustpeade maja Valge saal');
UPDATE event_text SET venue = 'House of the Blackheads, White Hall' WHERE lang = 'en' AND (venue IS NULL OR venue = '') AND event_id IN (SELECT id FROM event WHERE venue = 'Mustpeade Maja Valge saal');
UPDATE event_text SET venue = 'House of the Blackheads, Olavi Hall' WHERE lang = 'en' AND (venue IS NULL OR venue = '') AND event_id IN (SELECT id FROM event WHERE venue = 'Mustpeade maja Olavi saal');
UPDATE event_text SET venue = 'House of the Blackheads, White and Olavi Halls' WHERE lang = 'en' AND (venue IS NULL OR venue = '') AND event_id IN (SELECT id FROM event WHERE venue = 'Mustpeade maja Valge ja Olavi saal');
UPDATE event_text SET venue = 'House of the Blackheads, Brotherhood Hall' WHERE lang = 'en' AND (venue IS NULL OR venue = '') AND event_id IN (SELECT id FROM event WHERE venue = 'Mustpeade Maja Vennaste saal');
UPDATE event_text SET venue = 'House of the Blackheads' WHERE lang = 'en' AND (venue IS NULL OR venue = '') AND event_id IN (SELECT id FROM event WHERE venue = 'Mustpeade Maja');
UPDATE event_text SET venue = 'House of the Blackheads' WHERE lang = 'en' AND (venue IS NULL OR venue = '') AND event_id IN (SELECT id FROM event WHERE venue = 'Mustpeade maja');
UPDATE event_text SET venue = '1st Studio of the ERR Newshouse' WHERE lang = 'en' AND (venue IS NULL OR venue = '') AND event_id IN (SELECT id FROM event WHERE venue = 'ERR Uudistemaja 1. stuudio');
UPDATE event_text SET venue = 'Tartu City History Museum' WHERE lang = 'en' AND (venue IS NULL OR venue = '') AND event_id IN (SELECT id FROM event WHERE venue = 'Tartu Linnamuuseum');
UPDATE event_text SET venue = 'Studio 1965' WHERE lang = 'en' AND (venue IS NULL OR venue = '') AND event_id IN (SELECT id FROM event WHERE venue = 'Stuudio 1965');
UPDATE event_text SET venue = 'Studio Tallinn 1965' WHERE lang = 'en' AND (venue IS NULL OR venue = '') AND event_id IN (SELECT id FROM event WHERE venue = 'Stuudio Tallinn 1965');
UPDATE event_text SET venue = 'Arvo Pärt Centre' WHERE lang = 'en' AND (venue IS NULL OR venue = '') AND event_id IN (SELECT id FROM event WHERE venue = 'Arvo Pärdi Keskus');
UPDATE event_text SET venue = 'Estonian Centre for Architecture / EKKM' WHERE lang = 'en' AND (venue IS NULL OR venue = '') AND event_id IN (SELECT id FROM event WHERE venue = 'Arhitektuurikeskus / EKKM');
UPDATE event_text SET venue = 'Estonia Concert Hall café' WHERE lang = 'en' AND (venue IS NULL OR venue = '') AND event_id IN (SELECT id FROM event WHERE venue = 'Estonia kontserdisaali kohvik');
UPDATE event_text SET venue = 'Tallinn College of Music and Ballet, large chamber hall' WHERE lang = 'en' AND (venue IS NULL OR venue = '') AND event_id IN (SELECT id FROM event WHERE venue = 'Tallinna Muusika- ja Balletikool, suur kammersaal');
UPDATE event_text SET venue = 'Draakoni Gallery' WHERE lang = 'en' AND (venue IS NULL OR venue = '') AND event_id IN (SELECT id FROM event WHERE venue = 'Draakoni galerii');
UPDATE event_text SET venue = 'St Elizabeth’s Church, Pärnu' WHERE lang = 'en' AND (venue IS NULL OR venue = '') AND event_id IN (SELECT id FROM event WHERE venue = 'Pärnu Eliisabeti kirik');
