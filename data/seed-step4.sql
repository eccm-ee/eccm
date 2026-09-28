-- seed-step4.sql: the other nine events of public/index.html, ids 2 to 10 in
-- the front page's order, each read once off its eccm.ee page on 2026-09-28
-- at the href the front page row carried (asked as "apply event views and
-- edits on all fronpage events"). The same shape as seed-step1.sql: the
-- shouting titles sentence-cased, the credit lines lifted out of the body
-- into event_credit, the source's dashes written as commas and colons, a
-- ticket link into ticket_url and the page's Koduleht into website_url, and
-- the Koduleht repeated as a link line at the end of the body since the event
-- page prints no website field. None of the nine has an English page on
-- eccm.ee: every language switch leads to the English site root, so eight are
-- Estonian only and fall back. The Schönberg page alone carries an English
-- text under a *** rule in its Estonian body, and that text is its en row
-- with no legacy_id, since no English page exists for it.
-- Decided here rather than read:
--   TUMA has no category key, so Scrapyard and Sound Plasma are 'koostoo'.
--   The festival starts at the page's own first date and time, 22.10.2026
--   15:51, which reads like an unedited default on eccm.ee and is left for
--   the editor to change from the form.
--   The Gestures 2 page is the same text as event 1's page 134 with the
--   names in the title changed, so its body and credits are seed-step1's.
--   "higedeaja" in the Surm page is written "hingedeaja".
--   The pictures are the ic_large files the pages name, fetched once each
--   into public/ and measured with sips; two of them are not 900 wide as
--   served (the Schönberg poster 455 by 600, the Improtest mark 720 by 493).
--   Improtest: Electro Funeral and Improtest: Barry Guy, Maya Homburger,
--   Liudas Mockunas have one line of text on eccm.ee, and that is their body.

INSERT INTO media (id, key, width, height, alt_et, alt_en) VALUES
  (2, 'ic_large_w900h600q100_chatgpt-image-sep-13-2026-10-27-27-am.png', 455, 600,
   'Kollaaž Tallinna siluetist vee kohal, sinakasroheline ja kuldne ketas ning helilaine',
   'A collage of the Tallinn skyline over water, a teal and a gold disc and a sound wave'),
  (3, 'ic_large_w900h600q100_morton-feldman.jpg', 900, 597,
   'Morton Feldman, mustvalge portree peegli ees',
   'Morton Feldman, a black and white portrait in front of a mirror'),
  (4, 'ic_large_w900h600q100_enmt-scrapyard-2-eriti-vaike-copy.jpg', 899, 600,
   'Viis esinejat sinises lavavalguses, käed laiali',
   'Five performers in blue stage light, arms spread'),
  (5, 'ic_large_w900h600q100_screenshot-2026-08-31-at-11-21-15.png', 900, 597,
   'Gestures/Situations, punane ketas kolme joone vahel',
   'Gestures/Situations, a red disc between three lines'),
  (6, 'ic_large_w900h600q100_improtest.jpg', 720, 493,
   'Improtesti märk, silm ja žilett',
   'The Improtest mark, an eye and a razor blade'),
  (7, 'ic_large_w900h600q100_screenshot-2026-09-04-at-09-40-01.png', 900, 596,
   'Koer mikrofoni ees stuudios, taga kitarrist ja naine',
   'A dog at a microphone in a studio, a guitarist and a woman behind it'),
  (8, 'ic_large_w900h600q100_u-ansambel-eccm-rida-tais-mv-150.jpg', 900, 578,
   'Ansambel U:, kuus muusikut mustas valge seina ees, mustvalge',
   'Ensemble U:, six musicians in black against a white wall, in black and white'),
  (9, 'ic_large_w900h600q100_germination.png', 900, 450,
   'Kaks kontserdifotot kõrvuti, flötist ja dirigent sinises valguses ning ansambel mustvalgelt',
   'Two concert photographs side by side, a flautist and a conductor in blue light and an ensemble in black and white');

INSERT INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at) VALUES
  (2, '2026-10-08T19:00', '2026-10-08T22:00', NULL, 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn',
   'https://fienta.com/et/schoenbergi-sari-W-EEnsemble', 'https://schoenberg.ee/', 'schoenberg', 2, 'published', NULL),
  (3, '2026-10-10T18:00', NULL, NULL, 'Arvo Pärdi Keskus', 'Kellasaju tee 3, Laulasmaa',
   '', 'https://www.arvopart.ee/arvo-pardi-keskus/sundmused/sundmus/morton-feldman-100-ansambel-u/', 'u', 3, 'published', NULL),
  (4, '2026-10-10T19:30', NULL, NULL, 'Kanuti Gildi SAAL', 'Pikk 20, Tallinn',
   '', 'https://saal.ee/', 'koostoo', 4, 'published', NULL),
  (5, '2026-10-11T19:00', NULL, 60, 'Eesti Nüüdismuusika Keskus', 'Pühavaimu 9, Tallinn',
   'https://fienta.com/et/gestuurid-situatsioonid-ilma-partituurita-kuulamine-marianna-liik-artjom-astrov-maryn-liis-ruutelmaa-200456', 'https://eccm.ee', 'ulysses', 5, 'published', NULL),
  (6, '2026-10-13T19:00', NULL, NULL, 'ECCM saal', 'Pühavaimu 9, Tallinn',
   '', 'https://www.improtest.ee', 'improtest', 6, 'published', NULL),
  (7, '2026-10-22T15:51', '2026-10-25T23:51', NULL, 'ECCM', 'Pühavaimu 9, Tallinn',
   '', 'https://www.ule-heli.ee/', 'eccm', 7, 'published', NULL),
  (8, '2026-11-03T19:00', NULL, NULL, 'ERR Uudistemaja 1. stuudio', 'Kreutzwaldi 14, Tallinn',
   '', 'https://uuu.ee', 'u', 8, 'published', NULL),
  (9, '2026-11-06T19:00', NULL, NULL, 'Startbahn-Genezarethkirche', 'Herrfurthplatz, 12049 Berlin',
   '', 'https://field-notes.berlin/en/kalender/ensemble-new-music-tallinn-ensemble21', 'koostoo', 9, 'published', NULL),
  (10, '2026-11-11T19:00', NULL, NULL, 'ECCM saal', 'Pühavaimu 9, Tallinn',
   '', 'https://www.improtest.ee', 'improtest', 6, 'published', NULL);

INSERT INTO event_text (event_id, lang, slug, title, legacy_id, body) VALUES
  (2, 'et', 'schonbergi-sari-written-experimental-ensemble-w-ee',
   'Schönbergi sari. Written & Experimental Ensemble (W&EE)', 72,
'Tere tulemast avastama uut ansamblit, kus kohtuvad komponeeritud muusika ja improvisatsioon ning kus nüüdismuusikast saab uudishimu, eksperimenteerimise ja kultuuridevahelise dialoogi platvorm.

2026 aastal Helsingis Heliä Viirakivi ja Gon Muruaga asutatud Written & Experimental Ensemble (W&EE) on uus Põhja- ja Baltimaade nüüdismuusika ansambel, mis keskendub oma helilooja-interpreetidest liikmete loodud muusikale. Ansambli kunstilises tegevuses kohtuvad nüüdismuusika, improvisatsioon, elektroonika, laiendatud tehnikad ja muusikute erinevad kultuurilised taustad.

Tallinna kontsert toob kokku Soomes ja Eestis tegutsevad heliloojad-interpreedid ning valmib koostöös Eesti Arnold Schönbergi Ühingu muusikutega. Koostöö tugevdab sidemeid Soome ja Eesti eksperimentaalse muusika kogukondade vahel ning loob uusi kohtumisi Põhja- ja Baltimaade nüüdismuusika väljal.

Kavas komponeeritud ja improviseeritud muusika akustiliste instrumentide, hääle, elektroonika ja heliinstallatsiooni piiridel.

Piletid
Tavapilet 20.00 eurot
Sooduspilet (ülalpeetavad ja pensionärid) 10.00 eurot
Õpilasepilet (õpilased ja üliõpilased) 5.00 eurot

[schoenberg.ee](https://schoenberg.ee/)'),
  (2, 'en', 'schonberg-series-written-experimental-ensemble-w-ee',
   'Schönberg series. Written & Experimental Ensemble (W&EE)', NULL,
'Welcome to discover a new ensemble where composition and improvisation meet, and where contemporary music becomes a platform for curiosity, experimentation and cultural exchange.

Founded in Helsinki in 2026 by Heliä Viirakivi and Gon Muruaga, Written & Experimental Ensemble (W&EE) is a new Nordic-Baltic contemporary music ensemble dedicated to music created by its composer-performer members. Its artistic practice brings together contemporary composition, improvisation, electronics, extended techniques and the diverse cultural backgrounds of its musicians.

The Tallinn concert brings together composer-performers working in Finland and Estonia and is created in collaboration with musicians of the Estonian Arnold Schönberg Society (Eesti Arnold Schönbergi Ühing). The collaboration strengthens connections between the Finnish and Estonian experimental music communities while creating new encounters across the Nordic-Baltic contemporary music scene.

The programme moves between written and improvised music, acoustic instruments, voice, electronics and sound installation.

Tickets
Regular ticket 20.00 euros
Concession (dependants and pensioners) 10.00 euros
Student ticket (pupils and students) 5.00 euros

[schoenberg.ee](https://schoenberg.ee/)'),
  (3, 'et', 'morton-feldman-100-for-philip-guston',
   'Morton Feldman 100: For Philip Guston', 109,
'**Tarmo Johannes** (flööt), **Taavi Kerikmäe** (klaver, celesta) ja **Vambola Krigul** (löökpillid) toovad kuulamiseks ühe Morton Feldmani viimase loomeperioodi ühe täht-teosega, mida elus esituses kuuleb harva.

Teose kestus on üle 4 tunni.

Kavas:
**Morton Feldman** (1926 kuni 1987) _For Philip Guston_ (1984) flöödile, klaverile/celestale ja löökpillidele

[arvopart.ee](https://www.arvopart.ee/arvo-pardi-keskus/sundmused/sundmus/morton-feldman-100-ansambel-u/)'),
  (4, 'et', 'scrapyard',
   'Scrapyard', 105,
'Tallinna Uue Muusika Ansambel (TUMA) on taaskord korraldamas põnevat ja erilist Scrapyardi seeria multimeediakontserti, kus tulevad ettekandele nüüdismuusikat ja erinevaid meediumeid ühendavad teosed. Scrapyard seeria sai alguse 2019. aastal ning tegemist on Lo-Fi muusikaetenduste sarjaga, mille eesmärk on kombineerida isetehtud instrumente ja esituse kontekstis ebatäiuslikuks peetavaid elemente (Lo-Fi muusikat) kaasaegse klassikalise muusikaga.

Etendusel kasutatakse erinevaid performance-kunsti, tehnoloogia ja meedia aspekte, mille tulemusena sünnib interdistsiplinaarne kogemus.

[saal.ee](https://saal.ee/)'),
  (5, 'et', 'gestuurid-situatsioonid-ilma-partituurita-kuulamine-liisa',
   'Gestuurid/situatsioonid: ilma partituurita kuulamine. Liisa Hõbepappel, Kenn-Erik Kannike, Liis Vares', 136,
'Gestuurid/situatsioonid: ilma partituurita kuulamine on sündinud soovist mõtestada praegust aegruumi ja selle vajadusi ning nihutades lühiaktsioonide žesti keskme heliloominguga seotud kogukonna konteksti. Selle tulemusel kutsub Eesti Nüüdismuusika Keskus igaks aktsiooniks kaks erinevat heliloomingu ja interpretatsiooniga tegelevat professionaalset loojat oma keskusesse ja annab neile vabad käed. Uue komponendina kutsutakse igasse gestuuri/situatsiooni ka kolmas kunstnik mõnest teisest praktikast või loomevaldkonnast, tuues protsessi teistsuguse pagasi, kehalisuse või ruumitaju. Kõikides aktsioonides on osalistele toeks dramaturg Alissa Šnaider. Kahte esimesse aktsiooni kaasatud heliloojad ja etenduskunstnikud on: Marianna Liik, Liisa Hõbepappel, Artjom Astrov, Kenn-Eerik Kannike, Liis Vares ja Maryn-Liis Rüütelmaa.

Avalik žest ei ole valmis teose esitlus ega klassikaline kontsert. See on kümnepäevase protsessi viimane hetk, võimalus olla tunnistajaks olukorrale, mis on tekkinud kolme osaleja koosmõjus ja mida ei saa korrata täpselt samal kujul.

Gestuurid/situatsioonid ei ole koostööformaat, vaid riskantne olukord. See loob situatsioone, kus heli ei ole komponeeritud, vaid tekib selle tagajärjel, et kehad püüavad kooskõlastada oma tegevust ilma kokkuleppeta.

Gestuurid/situatsioonid: kuulamine ilma partituurita pakub välja pigem probleemi kui formaadi.

See loob situatsioone, milles heli ei ole komponeeritud, vaid tekib tagajärjena kehade püüdlustele koordineeruda ilma kokkuleppeta.

Puudub partituur, ühine keel ja kohustus jõuda teoseni.

Projekt on üles ehitatud minimaalsele kolme osaleja kooslusele ning žestide kogumile, mis toimivad üleminekuoperaatoritena.

Neid žeste ei saa korrata ega optimeerida; need tähistavad pigem läve kui tegevusi.

Kuulamist käsitletakse seisundi, mitte oskusena.

Viivitus, arusaamatus, väsimus ja vaikus ei ole katkestused, vaid struktuursed elemendid, mis korraldavad kogu välja.

Olukord käivitatakse ning seejärel lastakse sellel autonoomselt areneda.

Koreograafia ei seisne heli ja liikumise organiseerimises, vaid koordineerimise enese ebastabiilsuses.

Tulemus ei ole etendus, vaid jääk, jälg sellest, et oldi kohal lahendamata probleemi sees.

Gestuurid/situatsioonid: kuulamine ilma partituurita ei püüa muusikat ümber defineerida.

See hoiab muusikalise keele peatatud olekus, et uurida tingimusi, milles heli saab üldse veel aset leida.

Gestuurid/situatsioonid toimib kaasaskantava struktuurina, mitte lokaalse väljendusvormina.

Iga iteratsioon aktiveerib sama probleemi erinevas kontekstis.

Projekt ei tõlgi kultuure, see asetab need surve alla.

## 5 gestuurist gestuuride/situatsioonideni

Tegemist on edasiarendusega elektron.art kunstisaalis toimunud „5 gestuuri“ aktsioonidele, mille raames kohtusid aastatel 2023 kuni 2025 kunstnike duod: Claudia Lepik, Maxim Mjödov, Sveta Grigorjeva, Mikhail Pashchuk, Raul Keller, Kärt Koppel, Laivi Suurväli, Krõõt Juurak, Marta Vaarik, Gregor Kulla, Jaan Evart, Hendrik Kaljujärv, Riina Maidre, Marto Mägi, Kymbali Williams, Liisamari Viik, Viktoria Martjanova, Maxim Nikanorov, Kitty Florentine, Grete Rattasepp ja Arolin Raudva. Kokku toimus 11 „5 gestuuri“ lühiaktsiooni, nendest viimane koostöös SAAL Biennaal festivaliga. Eelnevatest gestuuridest jäid kõlama küsimused, mis kanduvad edasi eelootavatesse gestuuridesse/situatsioonidesse. Milline žest on võimalik seal, kus vormid on ette määratud ja ressursid piiratud? Milliseid tingimusi on vaja, et võiks sündida midagi uut?

Toimunud aktsioonide põhjal sai selgeks, et sellest on kujunenud püsiv, kuid avatud žestide formaat. Hoitud vorm, mis võib ikka uuesti esile kerkida, kui tekib ruum, vajadus ja kuulaja.

## Alissa Šnaider

Alissa Šnaider on kunstnik, koreograaf, dramaturg ja kuraator, kes tegutseb nii etenduskunstide kui visuaalkunsti valdkonnas.

Tema looming hõlmab nii koreograafiat, lavastamist, fotograafiat kui ka kirjutamist. Oma praktikas käsitleb ta žesti mitte pelgalt väljendusvahendina, vaid tegevusena, mis konfigureerib tähelepanu, aja ja kehade vahelisi suhteid. Selle asemel, et luua kindlaid vorme, tekitab ta olukordi, milles kohalolu, viivitus, nihestatus ja haavatavus jäävad aktiivseteks seisunditeks.

Alissa on aktsioonidesarja „Gestuurid/situatsioonid“ algataja ning käesoleva versiooni puhul on tegemist algse gestuuride formaadi edasiarendusega, mille raames luuakse performatiivseid olukordi, mille keskmes on risk, mittekoordineeritud olek ja kuulamine. Projekt toimib teisaldatava struktuurina, mida aktiveerivad erinevad osalejate kooslused ja nende kontekstispetsiifilised žestid.

Tema visuaalne looming laiendab neid olukordi, käsitledes pilte pigem tegevuse jäägina kui kujutistena. Kirjutamine toimib tema loomingus väljendus- ja sekkumisvahendina, saates protsesse ilma neid stabiliseerimata.

Ta tegutseb rahvusvaheliselt nii kunsti-, kuraatori- kui ka dramaturgilistes kontekstides. [snaider.ee](https://www.snaider.ee/2)

Kaasrahastatud Euroopa Liidu poolt. Avaldatud seisukohad ja arvamused on ainult autorite omad ega pruugi kajastada Euroopa Liidu või Euroopa Hariduse ja Kultuuri Rakendusameti (EACEA) seisukohti ja arvamusi. Euroopa Liit ega EACEA nende eest ei vastuta.'),
  (6, 'et', 'improtest-electro-funeral',
   'Improtest: Electro Funeral', 141,
'Electro Funeral (EST)

[improtest.ee](https://www.improtest.ee)'),
  (7, 'et', '11-ule-heli-festival-heli-on-vaba',
   '11. Üle Heli festival „Heli on vaba“', 140,
'Üheteistkümnes helikunsti- ja muusikafestival Üle Heli keskendub žanrimääratluste asemel muusika ja heli tähendusele ning seostele erinevate kunstivaldkondadega.
Festivali üheks peamiseks eesmärgiks on helikunstnikele ja eksperimentaalmuusikutele oma ideede arendamiseks ja tutvustamiseks platvormi pakkumine.

[ule-heli.ee](https://www.ule-heli.ee/)'),
  (8, 'et', 'surm',
   'Surm', 114,
'U: hingedeaja kontsert, mis tegeleb lahkumise, surma, mälestustega.
Külaline: kinnitamisel

Kavas: A. Kallastu, B. Ferneyhough, J. Harvey, J. Sánchez-Verdú jt

[uuu.ee](https://uuu.ee)'),
  (9, 'et', 'sound-plasma-10-tallinna-uue-muusika-ansambli-kontsert',
   'Sound Plasma 10: Tallinna Uue Muusika Ansambli kontsert Berliinis', 131,
'Sound Plasma 10!

Sound Plasma naaseb oma 10. aastapäeva puhul Berliini.

Berliinis toimuval kontserdil ühendab Tallinna Uue Muusika Ansambel jõud Belgia nüüdismuusikaansambel Ensemble21-ga, mis on asutatud 1999. aastal. Ansambel on võlunud publikut oma detailsuse, spontaansuse ja entusiasmiga ning on sündinud vajadusest tutvustada kaasaegset muusikat alternatiivsest vaatenurgast.
Ühiselt ansamblite kogemusi ja kõlaesteetikat ühendades tekib küllusrikas helimaailm ning lisaks on ühiskontsert oluline kultuuripoliitika vaatepunktist, luues uusi võimalusi edasiseks koostööks.

Sound Plasma näol on tegemist 2017. aastast toimunud järjepideva ürituste sarjaga, mis on toonud publikuni pidevalt uusi suundi nüüdismuusika vallas ning saanud kindla koha Berliini kultuurikalendris. Sound Plasma teeb eriliseks keskendumine piire nihutavatele helipraktikatele ning võime tuua kokku eksperimenteerimist hindavaid artiste ja publikut.

Kavas:
**Madli Marje Gildemann** "Metanoia" (2025), tellitud Tallinna Uue Muusika Ansambli poolt, esitab ühendansambel
**Jean-Luc Hervé** "Germination" (2013), esitab ühendansambel
**Oren Boneh** "Widget Adjective" (2025), esitab Ensemble21
**Arash Yazdani** "Shimmering of White Phosphorus" (2024), esitab ühendansambel

[field-notes.berlin](https://field-notes.berlin/en/kalender/ensemble-new-music-tallinn-ensemble21)'),
  (10, 'et', 'improtest-barry-guy-maya-homburger-liudas-mockunas',
   'Improtest: Barry Guy, Maya Homburger, Liudas Mockunas', 144,
'Barry Guy, Maya Homburger, Liudas Mockunas (UK / SUI / LT)

[improtest.ee](https://www.improtest.ee)');

INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs) VALUES
  (2, 1, NULL, 'Heliloojad-interpreedid', 'Composer-performers',
   '[{"name":"Heliä Viirakivi","note":{"et":"sopran, flöödid, helilooming","en":"soprano, flutes, composition"}},{"name":"Gon Muruaga","note":{"et":"kitarrid, elektroonika, helilooming","en":"guitars, electronics, composition"}},{"name":"Robert Fleitz","note":{"et":"klaver, helilooming","en":"piano, composition"}},{"name":"Kristjan Kannukene","note":{"et":"vioola","en":"viola"}},{"name":"Andrus Kallastu","note":{"et":"helilooming, heliinstallatsioon","en":"composition, sound installation"}},{"name":"Kai Kallastu","note":{"et":"hääl","en":"voice"}},{"name":"Hans-Gunter Lock","note":{"et":"viiul, Benini trummid","en":"violin, Benin drums"}},{"name":"Gerhard Lock","note":{"et":"vioola","en":"viola"}}]', '[]'),
  (2, 2, 'collaboration', NULL, NULL, '[]',
   '[{"et":"Eesti Arnold Schönbergi Ühing","en":"Estonian Arnold Schönberg Society"},{"et":"Eesti Muusika- ja Teatriakadeemia","en":"Estonian Academy of Music and Theatre"},{"et":"Tallinna Ülikooli Balti filmi, meedia ja kunstide instituut","en":"Baltic Film, Media and Arts School of Tallinn University"},{"et":"Pärnu Ooper","en":"Pärnu Opera"},{"et":"Autorfest","en":"Autorfest"},{"et":"Eesti Nüüdismuusika Keskus","en":"Estonian Centre of Contemporary Music"},{"et":"Muusikalinn Tallinn","en":"Tallinn Music City"},{"et":"Kultuurkapital","en":"Estonian Cultural Endowment"},{"et":"Pärnu linn","en":"City of Pärnu"}]'),
  (3, 1, 'collaboration', NULL, NULL, '[]', '[{"et":"Arvo Pärdi Keskus","en":"Arvo Pärt Centre"}]'),
  (5, 1, 'artists', NULL, NULL, '[{"name":"Marianna Liik"},{"name":"Liisa Hõbepappel"},{"name":"Artjom Astrov"},{"name":"Kenn-Eerik Kannike"},{"name":"Liis Vares"},{"name":"Maryn-Liis Rüütelmaa"}]', '[]'),
  (5, 2, 'dramaturge', NULL, NULL, '[{"name":"Alissa Šnaider"}]', '[]'),
  (5, 3, 'graphic-design', NULL, NULL, '[{"name":"Jaan Evart"}]', '[]'),
  (5, 4, 'creative-communication', NULL, NULL, '[{"name":"Maria Solei Järvet"}]', '[]'),
  (5, 5, 'coproducer', NULL, NULL, '[{"name":"Maria Hansar"}]', '[{"et":"Eesti Nüüdismuusika Keskus","en":"Estonian Centre of Contemporary Music"}]'),
  (5, 6, 'project-manager', NULL, NULL, '[{"name":"Annika Üprus"}]', '[]'),
  (5, 7, 'supporters', NULL, NULL, '[]', '[{"et":"Eesti Kultuurkapital","en":"Estonian Cultural Endowment"},{"et":"Tallinna linn","en":"Tallinn"},{"et":"Ulysses platvorm","en":"Ulysses Platform, co-funded by the European Union"}]'),
  (9, 1, NULL, 'Tallinna Uue Muusika Ansambel', 'Ensemble for New Music Tallinn',
   '[{"name":"Soo-Young Lee","note":{"et":"klarnetid","en":"clarinets"}},{"name":"Toomas Hendrik Ellervee","note":{"et":"viiul","en":"violin"}},{"name":"Talvi Nurgamaa","note":{"et":"vioola","en":"viola"}},{"name":"Madis Jürgens","note":{"et":"kontrabass","en":"double bass"}},{"name":"Talvi Hunt","note":{"et":"klaver","en":"piano"}},{"name":"Toomas Vana","note":{"et":"tromboon","en":"trombone"}},{"name":"Karl Erik Laas","note":{"et":"heliinsener","en":"sound engineer"}},{"name":"Arash Yazdani","note":{"et":"kunstiline juht ja dirigent","en":"artistic director and conductor"}}]', '[]'),
  (9, 2, NULL, 'Ensemble21', 'Ensemble21',
   '[{"name":"Anne Davids","note":{"et":"flöödid","en":"flutes"}},{"name":"Benjamin Maneyrol","note":{"et":"klarnetid","en":"clarinets"}},{"name":"Andres Ruiz Gonzalez","note":{"et":"trompet","en":"trumpet"}},{"name":"Max Charue","note":{"et":"löökpillid","en":"percussion"}},{"name":"Akiko Okawa","note":{"et":"viiul","en":"violin"}},{"name":"Ian-Elfinn Rosiu","note":{"et":"tšello","en":"cello"}},{"name":"Marc Collet","note":{"et":"dirigent","en":"conductor"}}]', '[]');
