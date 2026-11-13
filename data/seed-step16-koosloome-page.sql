-- seed-step16-koosloome-page.sql: the Co-Creation programme of ensemble U:, its own page under Ulysses, asked
-- 2026-11-13 after an ECCM editor missed it ("Tarmo tegi Ulysses alla alamkategooria"): on eccm.ee it was the one
-- article, 59 in Estonian and 60 in English, of the submenu Ulysses, Uudised / Ulysses News (Joomla categories 48
-- and 49), read from the Joomla database of the full backup of 2026-11-13 09:21. The owner chose a page of its own
-- linked from the Ulysses page, with no second menu level, so it is in no menu, the way liikmed is under eccm.
--
-- The text is the articles' in their order. Mended: erakorduselt, löökpillikd, Reflektesioonid, Ajakva,
-- Nüüdimuusika, a stray bold, the schedule's times written whole (11.00-12.30 for "11-12.30", 13.00-14.30 for
-- "13.-14.30") and the English ones with full stops as the Estonian; dashes written as colons and commas. The
-- English "What?" paragraph is split where the Estonian one is. src/redirects.mjs sends the submenu's two old
-- addresses here.
--
-- Runs twice without harm: the page only when no page has its key, the texts only once, and the link on the
-- Ulysses page only while that page's text does not name this one. Apply after seed-step15-sync-2026-11-13.sql.

INSERT OR IGNORE INTO page (key, parent_key, menu_order, status, publish_at) VALUES ('koosloome', 'ulysses', 10, 'published', NULL);

INSERT OR IGNORE INTO page_text (page_id, lang, slug, title, legacy_path, body)
  SELECT id, 'et', 'koosloome-programm', 'U: koosloome programm', '/index.php/et/ulysses/ulysses-uudised',
'**Mis?**

Koosloome programmi mõte on uurida ja arendada nüüdismuusika loomisel koostöövormi, kus helilooja ja esitajad on “ühes paadis” alates protsessi algfaasist kuni teose valmimise ja esiettekandeni. Olulisel kohal on teineteise tundmaõppimine, arutelud, peegeldamine ja tagasiside, improvisatsioon, eksperimendid.

Hooaja jooksul toimub kolm kohtumist. Esimeses tutvustatakse algideesid, arutatakse, peegeldatakse, improviseeritakse, kogutakse algmaterjali ja mõtteid.

Teisel kohtumisel oodatakse heliloojatelt esmast materjali. Julgustatud on erinevad lähenemised partituurile: see võib olla traditsiooniliselt noteeritud, teksti-, graafiline, video-, tegevus- vm partituur. Töötatakse edasi valminud materjaliga, ansambel mängib, antakse tagasisidet, arutatakse, otsitakse lahendusi.

Kolmandaks kohtumiseks oodatakse heliloojatelt valminud teoseid, toimuvad proovid, detailide täpsustamine, viimaste lahenduste otsimine. Kolmanda sessiooni lõpus toimub avalik kontsert.

Iga kohtumise juurde on kutsutud ka külaline, kes peegeldab protsessi oma vaatenurgast.

**Miks?**

Selle lähenemise soov on astuda välja nüüdismuusikas levinud “tootmisliinist” tellimus, partituur, proov, esiettekanne, unustus, et luua helilooja ja esitajate vahele palju tihedamad suhted, võimaldada üheskoos veedetud aega, õppida üksteiselt, hägustada rollide piirid ning tekitada olukordi, kus pole päris selge, kes ja kus on autor.

**Kes?**

Projekti viib läbi [ansambel U:](https://www.uuu.ee), Eesti üks juhtivaid nüüdismuusika ansambleid. Ansamblisse kuuluvad **Tarmo Johannes** (flööt), **Helena Tuuling** (klarnet), **Vambola Krigul** (löökpillid), **Taavi Kerikmäe** (klaver, süntesaator), **Merje Roomere** (viiul) ja **Levi-Danel Mägila** (tšello).
U:-le on omane küsida küsimusi, otsida uut, toetuda vanale, katsetada, julgeda eksida.

Iga sessiooni juurde on kutsutud ka üks külaline, kes tutvustab oma kogemusi ning aitab peegeldada tööprotsessi. Esimesel kohtumisel on selleks helilooja **Liisa Hõbepappel**, kes on ansambliga sarnasel moel varem töötanud.

**Kellele?**

Projektist saavad aktiivselt osa võtta kolm noort heliloojat Euroopast (Ukraina k.a), kes on sündinud 1.01.1991 või hiljem.

U:/ECCM kuulutas välja konkursi, mille vastu oli huvi erakordselt suur: kokku laekus üle Euroopa 55 avaldust.

Paraku saab selle projekti raames piisavalt rahulikult töötada vaid kolmega. Valituks osutusid:
**Parham Behzad** (IR/AT)
**Sofus Preisel** (DK)
**Żaneta Rydzewska** (PL)

Kuulama ja jälgima on oodatud kõik huvilised.

**Millal?**

Töösessioonid toimuvad

**I sessioon, 14.-15.11.2026**

Ajakava:
**L 14.11**
11.00 Tervitus, Liisa Hõbepappeli sissejuhatus
12.00-13.00 Helilooja I sessioon
13.30-14.30 Helilooja II
16.00-17.00 Helilooja III
17.00-18.00 Reflektsioonid
**P 15.11**
11.00-12.30 Helilooja III
13.00-14.30 Helilooja II
15.30-17.00 Helilooja I
17.15-18.00 Reflektsioonid

**II sessioon, 20.-21.02.2027**

**III sessioon, 15.-16.05.2027**

Projekti lõppkontsert, kus kantakse ette valminud teosed, toimub 16. mail 2027.

**Kus?**

Eesti Nüüdismuusika Keskuses, Pühavaimu 9, Tallinn

**Kontakt**

[u@uuu.ee](mailto:u@uuu.ee)

Sari toimub võrgustiku [Ulysses](https://ulysses-platform.eu/ulysses-platform) raames, mida kaasrahastab Euroopa Liit.'
  FROM page WHERE key = 'koosloome';

INSERT OR IGNORE INTO page_text (page_id, lang, slug, title, legacy_path, body)
  SELECT id, 'en', 'co-creation-programme', 'Ensemble U:’s Co-Creation Workshop', '/index.php/en/ulysses-eng/ulysses-uudised-eng',
'**What?**

The idea behind the co-creation programme is to explore and develop a collaborative model in contemporary music creation, where the composer and the performers are “in the same boat” from the initial phase of the process all the way to the completion and premiere of the piece. Key emphasis is placed on getting to know one another, discussions, reflection and feedback, improvisation, and experimentation.

There will be three sessions over the course of the season. During the first session, initial ideas are introduced, discussed, reflected upon and improvised, and initial material and thoughts are gathered.

In the second session, composers are expected to present initial material. Diverse approaches to the score are encouraged: it can be traditionally notated, text-, graphic-, video- or action-based, or another type of score. Work continues with the generated material; the ensemble plays, feedback is given, discussions take place, and solutions are sought.

For the third session, composers are expected to present finished works, followed by rehearsals, refining details, and searching for final solutions. At the end of the third session, a public concert will be held.

A guest practitioner is also invited to each session to reflect on the process from their perspective.

**Why?**

The intention of this approach is to step away from the assembly line common in contemporary music, commission, score, rehearsal, premiere, oblivion, in order to establish much closer relationships between the composer and performers, allow quality time spent together, learn from one another, blur role boundaries, and create situations where it is not entirely clear who and where the author is.

**Who?**

The project is conducted by [Ensemble U:](https://www.uuu.ee), one of Estonia’s leading contemporary music ensembles. The ensemble features **Tarmo Johannes** (flute), **Helena Tuuling** (clarinet), **Vambola Krigul** (percussion), **Taavi Kerikmäe** (piano, synthesizer), **Merje Roomere** (violin) and **Levi-Danel Mägila** (cello). It is characteristic of U: to ask questions, search for the new, lean on the old, experiment, and dare to make mistakes.

A guest is also invited to each session to share their experiences and help reflect on the working process. For the first meeting, this will be composer **Liisa Hõbepappel**, who has previously worked with the ensemble in a similar manner.

**For whom?**

Three young composers from Europe (including Ukraine) born on 1 January 1991 or later take an active part in the project. U:/ECCM announced a call for applications, which generated exceptionally high interest: a total of 55 applications were submitted from across Europe.

Unfortunately, within the scope of this project, it is only possible to work at a sufficiently focused pace with three participants. The selected composers are:
**Parham Behzad** (IR/AT)
**Sofus Preisel** (DK)
**Żaneta Rydzewska** (PL)

All interested listeners and observers are welcome to attend.

**When?**

Work sessions will take place:

**Session I, 14-15.11.2026**

Schedule:
**Sat 14.11**
11.00 Welcome, introduction by Liisa Hõbepappel
12.00-13.00 Composer 1 session
13.30-14.30 Composer 2
16.00-17.00 Composer 3
17.00-18.00 Reflections
**Sun 15.11**
11.00-12.30 Composer 3
13.00-14.30 Composer 2
15.30-17.00 Composer 1
17.15-18.00 Reflections

**Session II, 20-21.02.2027**

**Session III, 15-16.05.2027**

The final concert of the project, presenting the completed works, takes place on 16 May 2027.

**Where?**

Estonian Centre for Contemporary Music, Pühavaimu 9, Tallinn

**Contact**

[u@uuu.ee](mailto:u@uuu.ee)

The series takes place within the framework of the [Ulysses](https://ulysses-platform.eu/ulysses-platform) network, co-funded by the European Union.'
  FROM page WHERE key = 'koosloome';

-- the link on the Ulysses page, whose one text is English and serves both languages
UPDATE page_text SET body = body || '

[Ensemble U:’s Co-Creation Workshop](/en/co-creation-programme), three meetings of composers and the ensemble this season, is part of Ulysses at ECCM.'
  WHERE page_id = (SELECT id FROM page WHERE key = 'ulysses') AND lang = 'en' AND instr(body, '/en/co-creation-programme') = 0;
