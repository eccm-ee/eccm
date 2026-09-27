-- seed-step1.sql: session 1, the Gestures event in Estonian, typed by hand
-- from eccm.ee's event 134 as public/event.html already carries it (the
-- capitals title sentence-cased, the credit lines lifted out of the body,
-- "Kestus: 60 min" into duration_min, the one em dash in the source a comma).
-- The slug is the title's first sentence, ASCII, which is what the URL plan's
-- rule would give a person; the editor can change it later and the old path
-- then goes to the redirect table.

INSERT INTO role (key, label_et, label_en, sort) VALUES
  ('artists',                'Kunstnikud',           'Participating artists',  10),
  ('performers',             'Esinejad',             'Performers',             20),
  ('composer',               'Helilooja',            'Composer',               30),
  ('conductor',              'Dirigent',             'Conductor',              40),
  ('dramaturge',             'Dramaturg',            'Dramaturge',             50),
  ('graphic-design',         'Graafiline disain',    'Graphic design',         60),
  ('creative-communication', 'Loovkommunikatsioon',  'Creative communication', 70),
  ('coproducer',             'Kaasprodutsent',       'Coproducer',             80),
  ('project-manager',        'Projektijuht',         'Project manager',        90),
  ('collaboration',          'Koostöös',             'In collaboration with',  100),
  ('supporters',             'Toetajad',             'Supporters',             110);

INSERT INTO media (id, key, width, height, alt_et, alt_en) VALUES
  (1, 'ic_large_w900h600q100_gestures-situations-small.jpg', 900, 599,
   'Gestuurid/situatsioonid, sarja graafika mustas ja punases',
   'Gestures/Situations, the series’ graphic in black and red');

INSERT INTO event (id, starts_at, duration_min, venue, address, ticket_url, category, image_id, status, publish_at) VALUES
  (1, '2026-09-30T19:00', 60, 'ECCM saal', 'Pühavaimu 9, Tallinn',
   'https://fienta.com/et/gestuurid-situatsioonid-ilma-partituurita-kuulamine-marianna-liik-artjom-astrov-maryn-liis-ruutelmaa',
   'ulysses', 1, 'published', '2026-09-01T12:00');

INSERT INTO event_text (event_id, lang, slug, title, legacy_id, body) VALUES
  (1, 'et', 'gestuurid-situatsioonid-ilma-partituurita-kuulamine',
   'Gestuurid/situatsioonid: ilma partituurita kuulamine. Marianna Liik, Artjom Astrov, Maryn-Liis Rüütelmaa', 134,
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

Kaasrahastatud Euroopa Liidu poolt. Avaldatud seisukohad ja arvamused on ainult autorite omad ega pruugi kajastada Euroopa Liidu või Euroopa Hariduse ja Kultuuri Rakendusameti (EACEA) seisukohti ja arvamusi. Euroopa Liit ega EACEA nende eest ei vastuta.');

INSERT INTO event_credit (event_id, position, role_key, people, orgs) VALUES
  (1, 1, 'artists', '[{"name":"Marianna Liik"},{"name":"Liisa Hõbepappel"},{"name":"Artjom Astrov"},{"name":"Kenn-Eerik Kannike"},{"name":"Liis Vares"},{"name":"Maryn-Liis Rüütelmaa"}]', '[]'),
  (1, 2, 'dramaturge', '[{"name":"Alissa Šnaider"}]', '[]'),
  (1, 3, 'graphic-design', '[{"name":"Jaan Evart"}]', '[]'),
  (1, 4, 'creative-communication', '[{"name":"Maria Solei Järvet"}]', '[]'),
  (1, 5, 'coproducer', '[{"name":"Maria Hansar"}]', '[{"et":"Eesti Nüüdismuusika Keskus","en":"Estonian Centre of Contemporary Music"}]'),
  (1, 6, 'project-manager', '[{"name":"Annika Üprus"}]', '[]'),
  (1, 7, 'supporters', '[]', '[{"et":"Eesti Kultuurkapital","en":"Estonian Cultural Endowment"},{"et":"Tallinna linn","en":"Tallinn"},{"et":"Ulysses platvorm","en":"Ulysses Platform, co-funded by the European Union"}]');
