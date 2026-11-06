-- seed-step11-sync-2026-11-06.sql: what changed on eccm.ee since the last full read
-- of 2026-10-07, read once each off its public pages on 2026-11-06 (the four list
-- pages, every event page in each language, the five menu pages; one request a
-- second, cached), compared with the local database. The shape is the archive's
-- (seed-step10-archive-2026.sql, its header): titles as eccm.ee writes them,
-- dashes written as commas and colons, e-mail addresses and phone numbers left
-- out, the Koduleht in website_url, credit lines in event_credit for the events
-- of seed-step4.sql and seed-step6.sql that keep them there.
--
-- Three new events, ids 1203 to 1205 in date order: Raadio Tallinn 1965 at Üle
-- Heli (iCagenda 160), the Kiwa book launch (158) and the COMP 2027 workshop
-- (159). Each id is in both lists with one body, so each is one text, in the
-- language of its body. The 2027 and 2028 Schönberg placeholders (74 to 80,
-- 152, 161 to 168) are left behind as decided.
--
-- Changed: Electro Funeral moved to 29.10; new pictures for Sound Plasma in
-- Berlin and in Tallinn, both AFEKT evenings, and both Schönberg evenings to
-- come; the Schönberg evenings' titles and texts; the Tallinn Sound Plasma's
-- programme and players; the Berlin players; the Scrapyard programme; the
-- AFEKT links; one English programme line in Tartu.
--
-- Gone from eccm.ee (404 by id): Barry Guy, Maya Homburger, Liudas Mockunas
-- (143 and 144) and Kuni kolm (128 and 129). They become drafts, not deleted.
--
-- The open calls page lost its only call (its article answers 404), so both
-- texts say there is none.
--
-- Nine pictures, the ic_large files the pages name, uploaded into the bucket
-- eccm-media-staging under media/{sha256}.{ext} the way src/media.mjs stores an
-- upload; width and height from sips, bytes from the file, schemes read with
-- public/scheme.mjs the way tools/scheme.mjs does.
--
-- Runs twice without harm: a media row only when its key is new, a scheme only
-- where none is, an event only when no text carries its legacy_id, and every
-- change only while the row still holds the value read here before, so an edit
-- made in the editor meanwhile is left alone. Apply after
-- seed-step10-archive-schemes.sql, and after the pictures are in the bucket.

INSERT OR IGNORE INTO media (key, width, height, bytes, alt_et, alt_en) VALUES
  -- ic_large_w900h600q100_enmtensemble21.jpeg
  ('media/b48ca2b2fb27ef9cdf8b68fbd64e7e676d1b47eecd275a7430aa6cd8a654b7d7.jpg', 899, 600, 270401,
   'Sound Plasma 10: Tallinna Uue Muusika Ansambli kontsert Berliinis',
   'Sound Plasma Berlin'),
  -- ic_large_w900h600q100_sound-plasma-2026-tallinn-1920x1005px-event-cover-photo.jpg
  ('media/428c90dacbf6456dc515365d6fd9b840c56fda3a7c8eea2f36876430a809db5f.jpg', 900, 471, 326767,
   'Sound Plasma 10',
   'Sound Plasma 10'),
  -- ic_large_w900h600q100_varjude-vahele-hajunud-heli.png
  ('media/8319a6246223d45cbf565d5dbacdcffd8fc157cf57d276395af766d5e3c19131.png', 900, 600, 1096807,
   'Schönbergi sari. OPUS MIRUM. Kai Kallastu (sopran), Andrus Kallastu (elektroonika)',
   'Schönberg series. OPUS MIRUM. Kai Kallastu (soprano), Andrus Kallastu (electronics)'),
  -- ic_large_w900h600q100_download.jpg
  ('media/fbdd50b07bc99171a7a91c5b2e31c7eb2a743a9138a7033d63b2da980c5ffb83.jpg', 900, 513, 518475,
   'Schönbergi sari. Performance etüüdid #9',
   'Schönberg series. Performance études #9'),
  -- ic_large_w900h600q100_screenshot-2026-10-13-at-19-29-01.png
  ('media/1f38ab807200883bc17b4d91441aa4da0b7997fbedf14f645f4f836a5dd7d546.png', 900, 473, 391405,
   'RITUAALID / Tallinna Uue Muusika Ansambel AFEKT festivalil',
   'RITUALS / Ensemble for New Music Tallinn at AFEKT festival'),
  -- ic_large_w900h600q100_screenshot-2026-10-13-at-19-27-14.png
  ('media/93ba7a71a1e5274d3120df55ce925671284d45dd111fecaba45f7364a88ca89f.png', 900, 474, 388141,
   'TUMA AFEKT festivalil Tartus',
   'Ensemble for New Music Tallinn at AFEKT festival in Tartu'),
  -- ic_large_w900h600q100_raadiostuudio.jpeg
  ('media/b01f4d437172650f937c72957e67e93f28705216201a70cc7541755d4e269989.jpg', 890, 600, 356485,
   'Raadio Tallinn 1965 Üle Heli Festivalil',
   'Raadio Tallinn 1965 Üle Heli Festivalil'),
  -- ic_large_w900h600q100_kiwa-raamatu-esitlus.png
  ('media/72669ad4c23de582412eea3231e45616eaab421e592a2855b95e132b61ce87f4.png', 900, 520, 987425,
   'Kiwa raamatu MILLIMULLIMALLIKAD esitlus',
   'Kiwa raamatu MILLIMULLIMALLIKAD esitlus'),
  -- ic_large_w900h600q100_comp-visuaal.jpg
  ('media/d614cb7710b222ffad15d69c261df2e8768c067d3e32a6ee9e813cdedfee198d.jpg', 900, 514, 481304,
   'Interdisciplinary Musical Composition Workshop COMP 2027',
   'Interdisciplinary Musical Composition Workshop COMP 2027');

-- the schemes, read by public/scheme.mjs in headless Chrome on 2026-11-06
UPDATE media SET scheme = '{"v":2,"detector":"derive 2026-09-27","mode":"dark","ground":"#411d12","ink":"#ffffff","ink2":"#c9c9c9","accent":"#b17260","btnFill":"#ffffff","onBtn":"#1a1a1a","notes":["the picture’s hue 37 at OKLCH lightness 0.28"],"readings":{"meanY":0.201,"meanC":0.0461,"cast":{"h":48,"C":0.0343},"top":[{"hex":"#555555","share":0.025},{"hex":"#666666","share":0.024},{"hex":"#222233","share":0.022}]},"computed_at":"2026-11-06T15:09:18Z"}', scheme_v = 2 WHERE key = 'media/d614cb7710b222ffad15d69c261df2e8768c067d3e32a6ee9e813cdedfee198d.jpg' AND scheme IS NULL;
UPDATE media SET scheme = '{"v":2,"detector":"derive 2026-09-27","mode":"light","ground":"#ededed","ink":"#1a1a1a","ink2":"#555555","accent":null,"btnFill":"#1a1a1a","onBtn":"#ffffff","notes":["a light grey, the picture has no hue","no accent, the picture is grey"],"readings":{"meanY":0.311,"meanC":0.0066,"cast":{"h":86,"C":0.0027},"top":[{"hex":"#cccccc","share":0.103},{"hex":"#bbbbbb","share":0.091},{"hex":"#666666","share":0.079}]},"computed_at":"2026-11-06T15:09:18Z"}', scheme_v = 2 WHERE key = 'media/fbdd50b07bc99171a7a91c5b2e31c7eb2a743a9138a7033d63b2da980c5ffb83.jpg' AND scheme IS NULL;
UPDATE media SET scheme = '{"v":2,"detector":"derive 2026-09-27","mode":"light","ground":"#f1e8ec","ink":"#1a1a1a","ink2":"#555555","accent":null,"btnFill":"#1a1a1a","onBtn":"#ffffff","notes":["a light grey with the picture’s faint cast, hue 350 at chroma 0.011","no accent, the picture is grey"],"readings":{"meanY":0.323,"meanC":0.0149,"cast":{"h":350,"C":0.011},"top":[{"hex":"#000000","share":0.266},{"hex":"#ffffff","share":0.164},{"hex":"#eeeeee","share":0.033}]},"computed_at":"2026-11-06T15:09:18Z"}', scheme_v = 2 WHERE key = 'media/b48ca2b2fb27ef9cdf8b68fbd64e7e676d1b47eecd275a7430aa6cd8a654b7d7.jpg' AND scheme IS NULL;
UPDATE media SET scheme = '{"v":2,"detector":"derive 2026-09-27","mode":"light","ground":"#f1f1f1","ink":"#1a1a1a","ink2":"#555555","accent":"#8e546e","btnFill":"#1a1a1a","onBtn":"#ffffff","notes":["the lightest big colour #dddddd taken most of the way to white, chroma capped at 0.02"],"readings":{"meanY":0.537,"meanC":0.0496,"cast":{"h":50,"C":0.023},"top":[{"hex":"#dddddd","share":0.043},{"hex":"#cccccc","share":0.042},{"hex":"#eeeeee","share":0.03}]},"computed_at":"2026-11-06T15:09:18Z"}', scheme_v = 2 WHERE key = 'media/72669ad4c23de582412eea3231e45616eaab421e592a2855b95e132b61ce87f4.png' AND scheme IS NULL;
UPDATE media SET scheme = '{"v":2,"detector":"derive 2026-09-27","mode":"dark","ground":"#262626","ink":"#ffffff","ink2":"#c9c9c9","accent":null,"btnFill":"#ffffff","onBtn":"#1a1a1a","notes":["a pure dark grey; none of the picture’s 4 hues is both strong and clean","no accent, the hue is too weak or too muddy for one"],"readings":{"meanY":0.148,"meanC":0.0489,"cast":{"h":51,"C":0.0452},"top":[{"hex":"#110000","share":0.138},{"hex":"#220000","share":0.052},{"hex":"#331111","share":0.033}]},"computed_at":"2026-11-06T15:09:18Z"}', scheme_v = 2 WHERE key = 'media/b01f4d437172650f937c72957e67e93f28705216201a70cc7541755d4e269989.jpg' AND scheme IS NULL;
UPDATE media SET scheme = '{"v":2,"detector":"derive 2026-09-27","mode":"dark","ground":"#421b1b","ink":"#ffffff","ink2":"#c9c9c9","accent":null,"btnFill":"#ffffff","onBtn":"#1a1a1a","notes":["the picture’s hue 22 at OKLCH lightness 0.28","no accent, the hue is too weak or too muddy for one"],"readings":{"meanY":0.155,"meanC":0.0183,"cast":{"h":20,"C":0.0178},"top":[{"hex":"#000000","share":0.426},{"hex":"#111111","share":0.051},{"hex":"#dddddd","share":0.045}]},"computed_at":"2026-11-06T15:09:18Z"}', scheme_v = 2 WHERE key = 'media/93ba7a71a1e5274d3120df55ce925671284d45dd111fecaba45f7364a88ca89f.png' AND scheme IS NULL;
UPDATE media SET scheme = '{"v":2,"detector":"derive 2026-09-27","mode":"dark","ground":"#421b1b","ink":"#ffffff","ink2":"#c9c9c9","accent":null,"btnFill":"#ffffff","onBtn":"#1a1a1a","notes":["the picture’s hue 22 at OKLCH lightness 0.28","no accent, the hue is too weak or too muddy for one"],"readings":{"meanY":0.156,"meanC":0.0183,"cast":{"h":20,"C":0.0178},"top":[{"hex":"#000000","share":0.42},{"hex":"#111111","share":0.054},{"hex":"#222222","share":0.045}]},"computed_at":"2026-11-06T15:09:18Z"}', scheme_v = 2 WHERE key = 'media/1f38ab807200883bc17b4d91441aa4da0b7997fbedf14f645f4f836a5dd7d546.png' AND scheme IS NULL;
UPDATE media SET scheme = '{"v":2,"detector":"derive 2026-09-27","mode":"light","ground":"#ededfc","ink":"#1a1a1a","ink2":"#555555","accent":"#047549","btnFill":"#1a1a1a","onBtn":"#ffffff","notes":["the lightest big colour #ccccee taken most of the way to white, chroma capped at 0.02"],"readings":{"meanY":0.45,"meanC":0.0649,"cast":{"h":155,"C":0.0293},"top":[{"hex":"#ccccee","share":0.105},{"hex":"#443333","share":0.023},{"hex":"#bbccee","share":0.021}]},"computed_at":"2026-11-06T15:09:18Z"}', scheme_v = 2 WHERE key = 'media/428c90dacbf6456dc515365d6fd9b840c56fda3a7c8eea2f36876430a809db5f.jpg' AND scheme IS NULL;
UPDATE media SET scheme = '{"v":2,"detector":"derive 2026-09-27","mode":"dark","ground":"#262626","ink":"#ffffff","ink2":"#c9c9c9","accent":null,"btnFill":"#ffffff","onBtn":"#1a1a1a","notes":["a pure dark grey; none of the picture’s 2 hues is both strong and clean","no accent, the hue is too weak or too muddy for one"],"readings":{"meanY":0.052,"meanC":0.0215,"cast":{"h":62,"C":0.0214},"top":[{"hex":"#111111","share":0.226},{"hex":"#221111","share":0.109},{"hex":"#222211","share":0.085}]},"computed_at":"2026-11-06T15:09:18Z"}', scheme_v = 2 WHERE key = 'media/8319a6246223d45cbf565d5dbacdcffd8fc157cf57d276395af766d5e3c19131.png' AND scheme IS NULL;


-- CHANGED EVENTS

-- 6, Improtest: Electro Funeral (iCagenda 141 and 142): 13.10 moved to 29.10, 19:00 as before
UPDATE event SET starts_at = '2026-10-29T19:00', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1
  WHERE id = 6 AND starts_at = '2026-10-13T19:00';

-- 4, Scrapyard (105 and 121), past: the programme eccm.ee added, the players as a credit line
UPDATE event_text SET body = rtrim(body) || '

Kavas:
**Hugo Morales Murguia** "Phobia"
III Fremitus
V Canción
**Diyar i San** "Encouragement"
**Hugo Morales Murguia** "Voltaic Routines" 38 instrumentaalmasinale ja kahele muusikule
Routine 1, Routine 2, Routine 3, 3B ja 3C
**Diyar i San** "Dancer"
**Bernhard Lang** "DW30 loops for Klaus Schulze" kolmele süntesaatorile'
  WHERE event_id = 4 AND lang = 'et' AND instr(body, 'Kavas:') = 0;
UPDATE event_text SET body = rtrim(body) || '

Program:
**Hugo Morales Murguia** "Phobia"
III Fremitus
V Canción
**Diyar i San** "Encouragement"
**Hugo Morales Murguia** "Voltaic Routines" 38 instrumental machines and 2 musicians
Routine 1, Routine 2, Routine 3, 3B and 3C
**Diyar i San** "Dancer"
**Bernhard Lang** "DW30 loops for Klaus Schulze" for 3 synthesizers'
  WHERE event_id = 4 AND lang = 'en' AND instr(body, 'Program:') = 0;
INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs)
  SELECT 4, 1, NULL, 'Tallinna Uue Muusika Ansambel', 'Ensemble for New Music Tallinn',
   '[{"name":"Talvi Hunt","note":{"et":"","en":""}},{"name":"Madis Jürgens","note":{"et":"","en":""}},{"name":"Paul-Gunnar Loorand","note":{"et":"","en":""}},{"name":"Karl Erik Laas","note":{"et":"heliinsener","en":"sound engineer"}},{"name":"Henry Kasch","note":{"et":"valgusdisain","en":"light design"}}]', '[]'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 4) AND NOT EXISTS (SELECT 1 FROM event_credit WHERE event_id = 4 AND label_et = 'Tallinna Uue Muusika Ansambel');

-- 9, Sound Plasma 10 in Berlin (131 and 123): the English title, the picture, the players
UPDATE event_text SET title = 'Sound Plasma Berlin'
  WHERE event_id = 9 AND lang = 'en' AND title = 'Sound Plasma 10 in Berlin';
-- the picture: germination.png to enmtensemble21.jpeg
UPDATE event SET image_id = (SELECT id FROM media WHERE key = 'media/b48ca2b2fb27ef9cdf8b68fbd64e7e676d1b47eecd275a7430aa6cd8a654b7d7.jpg'), updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1
  WHERE id = 9 AND image_id = (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_germination.png');
UPDATE event_credit SET people = '[{"name":"Toomas Hendrik Ellervee","note":{"et":"viiul","en":"violin"}},{"name":"Talvi Nurgamaa","note":{"et":"vioola","en":"viola"}},{"name":"Madis Jürgens","note":{"et":"kontrabass","en":"double bass"}},{"name":"Chiara Percivati","note":{"et":"klarnetid","en":"clarinets"}},{"name":"Talvi Hunt","note":{"et":"klaver","en":"piano"}},{"name":"Karl Erik Laas","note":{"et":"heliinsener","en":"sound engineer"}},{"name":"Arash Yazdani","note":{"et":"kunstiline juht ja dirigent","en":"artistic director and conductor"}}]'
  WHERE event_id = 9 AND label_et = 'Tallinna Uue Muusika Ansambel' AND instr(people, 'Soo-Young Lee') > 0;
UPDATE event_credit SET people = '[{"name":"Anne Davids","note":{"et":"flöödid","en":"flutes"}},{"name":"Benjamin Maneyrol","note":{"et":"klarnetid","en":"clarinets"}},{"name":"Marcel Degotte","note":{"et":"trompet","en":"trumpet"}},{"name":"Max Charue","note":{"et":"löökpillid","en":"percussion"}},{"name":"Aymeric de Villoutreys","note":{"et":"viiul","en":"violin"}},{"name":"Anne-Gabrielle Lia-Aragnouet","note":{"et":"tšello","en":"cello"}},{"name":"Marc Collet","note":{"et":"dirigent","en":"conductor"}}]', position = 3
  WHERE event_id = 9 AND label_et = 'Ensemble21' AND instr(people, 'Akiko Okawa') > 0;
INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs)
  SELECT 9, 2, NULL, 'Külalismuusikud', 'Guest musicians',
   '[{"name":"Artur Reinpõld","note":{"et":"metsasarv","en":"horn"}},{"name":"Weston Olencki","note":{"et":"tromboon","en":"trombone"}}]', '[]'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 9) AND NOT EXISTS (SELECT 1 FROM event_credit WHERE event_id = 9 AND label_et = 'Külalismuusikud');

-- 23, Sound Plasma 10 (122 and 130): the picture, the programme in both texts, the players as credit lines
-- the picture: sound-plasma-berlin-cover-vaike.png to sound-plasma-2026-tallinn-1920x1005px-event-cover-photo.jpg
UPDATE event SET image_id = (SELECT id FROM media WHERE key = 'media/428c90dacbf6456dc515365d6fd9b840c56fda3a7c8eea2f36876430a809db5f.jpg'), updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1
  WHERE id = 23 AND image_id = (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_sound-plasma-berlin-cover-vaike.png');
UPDATE event_text SET body = 'Kümnendat korda toimuva Sound Plasma näol on tegemist rahvusvahelisel muusikamaastikul ainulaadse alternatiivseid intonatsioone hõlmavale muusikale pühendunud kontserdisarjaga (varasemalt mini-festivaliga). Sound Plasma teeb eriliseks keskendumine piire nihutavatele helipraktikatele ning võime tuua kokku eksperimenteerimist hindavaid artiste ja publikut.

10. juubeliks kutsub Tallinna Uue Muusika Ansambel külla defunensemble''i, ühe tähtsama Soome nüüdismuusikakoosluse, kellega TUMA on teinud juba palju ühiseid koostööprojekte. Esiettekandele tulevad Lauri Jõelehe ja Arash Yazdani poolt spetsiaalselt TUMA-le komponeeritud uudisteosed, samuti Norra, Soome, Poola ning USA/Diné heliloojate looming.

Kavas:
**Øyvind Torvund** "Yes and no" (2025) _flöödile, klarnetile, klaverile, tšellole ja elektroonikale_
**Raven Chacon** "Round" (2007) _plaadimängijale ja esitajatele_
**Perttu Haapanen** "Doll Garden" (2013) _flöödile, klarnetile, klaverile, tšellole ja elektroonikale_
**Wojciech Błażejczyk** "Sympatheticality" (2026) _viola d''amorele, flöödile, klarnetile, viiulile, tšellole, kontrabassile ja klaverile_
**Lauri Jõeleht** "Equilibrium" (2026, esiettekanne) _flöödile, klarnetile, viiulile, vioolale, tšellole ja kontrabassile_
**Arash Yazdani** uudisteos (2026, esiettekanne) _flöödile, klarnetile, viiulile, vioolale, elektrikitarrile, basskitarrile, klahvpillidele ja löökpillidele_'
  WHERE event_id = 23 AND lang = 'et' AND instr(body, 'kava kinnitamisel') > 0;
UPDATE event_text SET body = 'Sound Plasma 10!

For Sound Plasma’s 10th anniversary, Ensemble for New Music Tallinn is organizing a joint concert with the great Finnish contemporary music group **defunensemble**.

The concert program includes new works written especially for ENMT by composers Lauri Jõeleht and Arash Yazdani, among others, as well as works of composers from Norway, Finland, Poland and USA/Diné.

Program:
**Øyvind Torvund** "Yes and no" (2025) _for flute, clarinet, piano, cello and electronics_
**Raven Chacon** "Round" (2007) _for turntable and performers_
**Perttu Haapanen** "Doll Garden" (2013) _for flute, clarinet, piano, cello and electronics_
**Wojciech Błażejczyk** "Sympatheticality" (2026) _for viola d''amore, flute, clarinet, violin, cello, double bass and piano_
**Lauri Jõeleht** "Equilibrium" (2026, world premiere) _for flute, clarinet, violin, viola, cello and double bass_
**Arash Yazdani** New Work (2026, world premiere) _for flute, clarinet, violin, viola, electric guitar, bass guitar, keyboards and drums_

Sound Plasma, which has been running since 2017, is distinguished by its focus on boundary-pushing sound practices and its ability to bring together artists and audiences who value experimentation. The concerts have so far experimented with ever-new, intriguing, non-conformist and irregular intonation systems, daring to explore completely new perspectives on microtonal music every year.

The cooperation between the Ensemble for New Music Tallinn and defunensemble has already been quite long-standing:

- In 2021, Fausto Romitelli’s masterpiece "Professor Bad Trip" was jointly premiered in Estonia and Finland.
- In 2022, the ensembles joined forces to premiere Enno Poppe’s great work "Rundfunk" in Estonia.
- The same work was performed with a joint ensemble in August 2023 at the Intsikurmu Festival and in September 2023 at the PianoEspoo Festival in Finland.'
  WHERE event_id = 23 AND lang = 'en' AND instr(body, 'works to be announced') > 0;
DELETE FROM event_credit WHERE event_id = 23 AND role_key = 'performers' AND people = '[]' AND instr(orgs, 'defunensemble') > 0;
INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs)
  SELECT 23, 1, NULL, 'defunensemble', 'defunensemble',
   '[{"name":"Hanna Kinnunen","note":{"et":"flöödid, objektid","en":"flutes, objects"}},{"name":"Mikko Raasakka","note":{"et":"klarnetid, objektid","en":"clarinets, objects"}},{"name":"Markus Hohti","note":{"et":"tšello, objektid","en":"cello, objects"}},{"name":"Sami Klemola","note":{"et":"objektid","en":"objects"}},{"name":"Anders Pohjola","note":{"et":"heliinsener","en":"sound design"}},{"name":"Timo Kurkikangas","note":{"et":"heliinsener","en":"sound design"}}]', '[]'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 23) AND NOT EXISTS (SELECT 1 FROM event_credit WHERE event_id = 23 AND label_et = 'defunensemble');
INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs)
  SELECT 23, 2, NULL, 'Külalisena', 'Visiting musician',
   '[{"name":"Talvi Hunt","note":{"et":"klaver","en":"piano"}}]', '[]'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 23) AND NOT EXISTS (SELECT 1 FROM event_credit WHERE event_id = 23 AND label_et = 'Külalisena');
INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs)
  SELECT 23, 3, NULL, 'Tallinna Uue Muusika Ansambel', 'Ensemble for New Music Tallinn',
   '[{"name":"Maria Lume","note":{"et":"flöödid","en":"flutes"}},{"name":"José Carlos Domíngues Almela","note":{"et":"klarnetid","en":"clarinets"}},{"name":"Toomas Hendrik Ellervee","note":{"et":"viiul","en":"violin"}},{"name":"Talvi Nurgamaa","note":{"et":"vioola, viola d''amore","en":"viola, viola d''amore"}},{"name":"Paul-Gunnar Loorand","note":{"et":"tšello, basskitarr","en":"cello, bass guitar"}},{"name":"Madis Jürgens","note":{"et":"kontrabass","en":"double bass"}},{"name":"Talvi Hunt","note":{"et":"klaver, klahvpillid","en":"piano, keyboards"}},{"name":"Ove-Kuth Soosaar","note":{"et":"elektrikitarr","en":"electric guitar"}},{"name":"Karl-Juhan Laanesaar","note":{"et":"löökpillid","en":"percussion"}},{"name":"Karl Erik Laas","note":{"et":"heliinsener","en":"sound design"}},{"name":"Arash Yazdani","note":{"et":"dirigent","en":"conductor"}}]', '[]'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 23) AND NOT EXISTS (SELECT 1 FROM event_credit WHERE event_id = 23 AND label_et = 'Tallinna Uue Muusika Ansambel');
INSERT INTO event_credit (event_id, position, role_key, label_et, label_en, people, orgs)
  SELECT 23, 4, NULL, 'Tehniline tugi', 'Performance patch',
   '[{"name":"Sander Saarmets","note":{"et":"","en":""}}]', '[]'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 23) AND NOT EXISTS (SELECT 1 FROM event_credit WHERE event_id = 23 AND label_et = 'Tehniline tugi');

-- 25, Schönbergi sari 19.11 (73, the one id in both lists, Estonian text): the title, the text, the picture
UPDATE event_text SET title = 'Schönbergi sari. OPUS MIRUM. Kai Kallastu (sopran), Andrus Kallastu (elektroonika)', body = 'Schönbergi sari. OPUS MIRUM
N 19.11.2026 kell 19.00 Eesti Nüüdismuusika Keskus (Pühavaimu 9, Tallinn)

KAVA

**Sohrab Uduman** (1962)
_Cassandra_ häälele ja fonogrammile 1992

**Hans-Gunter Lock** (*1974)
_Cassandra kaja_ fonogrammile 2010

**Sven Sosnitski** (1987)
_Kauge maa laul_ sopranile ja elektroonikale 2015 (tekst Lord Byron)

Kai Kallastu, sopran
Andrus Kallastu, elektroonika

Kassandra müüt on värvikas näide ühe naise ühiskonnaredelil langemisest ja tema isiksuse hajumisest. Trooja kuninga Priamose tütrest, kellesse on armunud jumal Apollon, saab Agamemnoni sõjatrofee, immigrant vastu tahtmist, kes peab ennustama häda ja hukatust kurtidele kõrvadele ning kes lõpuks mõrvatakse. Sohrab Udumani „Cassandra“ räägib Kassandrast kui rahva poolt vihatud õnnetusekuulutajast, kes ränkades tingimustes oma missiooni või õigemini programmi täites näib kaotavat sideme välismaailma ja iseendagagi.

Hans-Gunter Lock komponeeris linditeose Cassandra kaja Pärnu Ooperi palvel Suveaarial 2010 Sohrab Udumani teose Cassandra ja Jürg Wüttenbachi teose „Encore!“ vahemuusikana.

Sven Sosnitski teos Kauge Maa Laul põhineb peamiselt Inglise poeedi Lord Byroni poeemil Pimedus. Kauges tulevikus on meie kustuv päike elu maal võimatuks muutnud. Viimane inimene vaatab keset tühjust üles, et lausuda veel viimased sõnad.

Sopran Kai Kallastu omandas magistrikraadi klassikalise lauljana Helsingi Metropolia Ülikoolis Soomes ja on osalenud arvukates meistriklassides. Ta on esinenud kammerlaulja, suurvormisolisti ning muusikateatriartistina erinevates kollektiivides ja riikides. Tema repertuaar hõlmab teoseid renessansist nüüdismuusikani ning ta on olnud mitmete heliloojate eksperimentaalsete vokaalteoste esmaesitaja. Intensiivne loominguline töö seob teda oma abikaasa helilooja ja dirigendi Andrus Kallastuga, kellega koos ta on esitanud kümneid vokaalkavu. [kallastu.ee](http://www.kallastu.ee)

Helilooja ja dirigent Andrus Kallastu õppis Tallinna Konservatooriumis (praegune Eesti Muusika- ja Teatriakadeemia) ning Sibeliuse Akadeemias ning tegutseb alates aastast 2000 vabakutselisena. Mitmed Kallastu teosed kõnelevad huvist muusika ja erinevate kunstiliikide ühendamise ning performance’i vastu. Kallastu huvi interpreedi ja projektide kunstilise juhina on seotud tihti muusikateatriga. Lisaks traditsioonilisele muusikateatritegevusele on tema eesmärgiks arendada muusikateatri spetsiifilisi valdkondi: müsteeriumilaadset kiriklikku kompositsiooni ning visualiseeritud kontserti.

Koostööpartnerid
Eesti Arnold Schönbergi Ühing
OPUS MIRUM
Eesti Muusika- ja Teatriakadeemia
Tallinna Ülikooli Balti filmi, meedia ja kunstide instituut
Pärnu Ooper
Autorfest
Eesti Nüüdismuusika Keskus
Muusikalinn Tallinn
Kultuurkapital
Pärnu linn

Piletid
Tavapilet 20.00 eurot
Sooduspilet (ülalpeetavad ja pensionärid) 10.00 eurot
Õpilasepilet (õpilased ja üliõpilased) 5.00 eurot

[opusmirum.ee](https://opusmirum.ee/)
[schoenberg.ee](https://schoenberg.ee/)'
  WHERE event_id = 25 AND lang = 'et' AND title = 'Schönbergi sari' AND body = 'Schönbergi sari';
-- the picture: none to varjude-vahele-hajunud-heli.png
UPDATE event SET image_id = (SELECT id FROM media WHERE key = 'media/8319a6246223d45cbf565d5dbacdcffd8fc157cf57d276395af766d5e3c19131.png'), updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1
  WHERE id = 25 AND image_id IS NULL;

-- 28, Schönbergi sari 8.12 (153, the one id in both lists, Estonian text): the title, the text, the picture, and the venue
-- and address its text names, since the page has no place line
UPDATE event_text SET title = 'Schönbergi sari. Performance etüüdid #9', body = 'Schönbergi sari. Performance etüüdid #9
T 8.12.2026 kell 18.00
Eesti Nüüdismuusika Keskus (Pühavaimu 9, Tallinn).

TLÜ BFM Video, performance, heli- ja meediakunsti kursuse IKUMUMU ja Erasmus tudengite performantside õhtu.

Vastutav õppejõud Gerhard Lock, kaasjuhendajad Raul Keller, Aleksandra Šprotser.

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

Piletid
Tavapilet 20.00 eurot
Sooduspilet (ülalpeetavad ja pensionärid) 10.00 eurot
Õpilasepilet (õpilased ja üliõpilased) 5.00 eurot

[schoenberg.ee](https://schoenberg.ee/)'
  WHERE event_id = 28 AND lang = 'et' AND title = 'Schönbergi sari' AND body = 'Schönbergi sari';
-- the picture: none to download.jpg
UPDATE event SET image_id = (SELECT id FROM media WHERE key = 'media/fbdd50b07bc99171a7a91c5b2e31c7eb2a743a9138a7033d63b2da980c5ffb83.jpg'), venue = 'Eesti Nüüdismuusika Keskus', address = 'Pühavaimu 9, Tallinn', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1
  WHERE id = 28 AND image_id IS NULL AND venue = '';

-- 1201, RITUAALID at AFEKT (154 and 155), past: its own picture now, and the festival's page for it
-- the picture: sohvi-viik-11-pisike.jpg to screenshot-2026-10-13-at-19-29-01.png
UPDATE event SET image_id = (SELECT id FROM media WHERE key = 'media/1f38ab807200883bc17b4d91441aa4da0b7997fbedf14f645f4f836a5dd7d546.png'), website_url = 'https://festivalafekt.ee/afekt-2026-tallinn/', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1
  WHERE id = 1201 AND image_id = (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_sohvi-viik-11-pisike.jpg') AND website_url = 'https://festivalafekt.ee/';

-- 1202, TUMA AFEKT in Tartu (156 and 157), past: its own picture, the festival's page, the English programme in English
-- the picture: sohvi-viik-11-pisike.jpg to screenshot-2026-10-13-at-19-27-14.png
UPDATE event SET image_id = (SELECT id FROM media WHERE key = 'media/93ba7a71a1e5274d3120df55ce925671284d45dd111fecaba45f7364a88ca89f.png'), website_url = 'https://festivalafekt.ee/afekt-tartu/', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1
  WHERE id = 1202 AND image_id = (SELECT id FROM media WHERE key = 'ic_large_w900h600q100_sohvi-viik-11-pisike.jpg') AND website_url = '';
UPDATE event_text SET body = 'Each piece in the programme opens a different kind of aperture, spatial, emotional, technological, or cultural, and the full arc of the programme reflects our ensemble’s values: curiosity, risk, and sonic diversity.

As an ensemble, we’re drawn to music that creates openings, for the audience, for ourselves, and for sound itself.

This programme is both a reflection of who we are and an invitation: to step through into expanded states of listening.

**Program:**
**Jesper Nordin** ''''Calm like a bomb'''' (2000) for violin and electronics
**Justė Janulytė** "Psalms" (2008/2023) for viola d''amore and electronics
**Pascal Criton** "Hold" (2018) for string trio
**Arash Yazdani** "Gā Geriv" (2020) for flute and pre-recordings
**Tatjana Kozlova-Johannes** "Crasis" (2013) for flute, violin, viola and cello

**Ensemble for New Music Tallinn:**
Maria Lume (flutes)
Toomas Hendrik Ellervee (violin)
Talvi Nurgamaa (viola, viola d''amore)
Paul-Gunnar Loorand (cello)
Karl Erik Laas (sound engineer)'
  WHERE event_id = 1202 AND lang = 'en' AND instr(body, 'viiulile ja elektroonikale (2000)') > 0;

-- GONE FROM eccm.ee: drafts, so the editor can bring them back

UPDATE event SET status = 'draft', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1
  WHERE id = 10 AND status = 'published' AND EXISTS (SELECT 1 FROM event_text WHERE event_id = 10 AND lang = 'et' AND legacy_id = 144);
UPDATE event SET status = 'draft', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1
  WHERE id = 27 AND status = 'published' AND EXISTS (SELECT 1 FROM event_text WHERE event_id = 27 AND lang = 'et' AND legacy_id = 129);

-- NEW EVENTS

-- 1203: eccm.ee 160, 2026-10-23T14:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1203, '2026-10-23T14:00', '2026-10-25T18:00', NULL, 'Stuudio 1965', 'Pühavaimu 9, Tallinn',
   '', 'https://linktr.ee/radiotallinn1965', 'koostoo', (SELECT id FROM media WHERE key = 'media/b01f4d437172650f937c72957e67e93f28705216201a70cc7541755d4e269989.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 160);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1203, 'et', 'raadio-tallinn-1965-ule-heli-festivalil',
   'Raadio Tallinn 1965 Üle Heli Festivalil', 160,
'23. kuni 25.10 muutub Stuudio Tallinn 1965 radiofooniliseks sündmusruumiks, eetriks, mis luuakse osutuse ja tehnoloogiliste vahendite abil. Radiosfääriga liituva eetriruumi üks ots laieneb piiratud alal Nüüdismuusika Keskuses FM raadiosagedusele 107.3 Mhz ja teine veebivoogu. Kõik, mis stuudios toimub saab osaks raadioprogrammist ja kõik osalejad on osa Üle Heli Päevamenüüst.

Päevamenüü sisaldab, nagu nimigi ütleb, erinevaid palu, mis raadioeetrit punkteerivad. Sellisteks katkestusteks on vestlused, intervjuud, esitlused. Võimalikud on spontaansed lisandid, mis sünnivad kohapealsete elektrooniliste või akustilliste vahenditega, sest stuudio sisaldab generaatoreid, süntesaatoreid, filtreid ja kilomeetrite kaupa magnetlinti, mis aeg-ajalt võib üle helipeade libiseda. Nende vahendite abil on võimalik asjatundlikul huvilisel eetriga suhestuda.

Stuudio ukse taga seisavad statiividel kaks kõlarit, mis mängivad sees toimuvat raadioeetrit lisaks transistorraadiotele, mis on siin-seal üles seatud. Need on kuulajatele, kes eelistavad olla vastuvõtjad.

Raadio Tallinn 1965 laiendab meediaruumi omadel tingimustel, protsessina, mis on alles vormumas ning loeb oluliseks avatud voogu, sündmust, tegevust. Olles pöördunud tagasi ühte võimalikusesse, 60ndatel, kulgeb see paralleelselt, aeg-ajalt siin-seal olemasolevaga lõikudes, mis mõtestab nii olnut, olemasolevat ja olevaks saavat. See annab võimaluse pakkuda alternatiive, vajadusel vaielda ja argumenteerida, ühesõnaga, taasmõtestada seda, mis puudutab eksperimentaalsust, meediaruumi ja seda igavesti taastulevat: raadiot.

Raadio Tallinn 1965 on katsetamas rakendust nimega ‘Väin’, mille beetaversiooni saab alla laadida nii Android kui ka iOs mobiilsetele seadmetele. ‘Väin’ võimaldab kuulata RT65 live-veebivoogu, aga annab kasutajale võimaluse ka ise oma mobiiltelefonist helimaterjali üle kanda. Rakendus kujuneb vastavalt kasutajatelt saadud tagasisidele ning liidab kasutajate poolt üle kantud helid eetrisse, moduleerides neid live-ülekandes. Pühapäeval 25.10 toimub eksperimentaalne helikorje, kus alates kella 16:00st avatakse ‘Väina’ kanal, kus kõik rakenduses registreerunud saavad ümbritsevaid helisid voogu saata, mida töötleb ümber ‘Väina’ põhjas asuv aeglaselt pöörlev mootor, mis raadiolaineid moduleerib. Pühapäevane protsess aitab meil seda mootorit osalejate abiga häälestada.

Väina äppi saab omale laadida siit: [Android](https://play.google.com/apps/testing/org.eccm.radio65) ja [iOS via TestFlight](https://testflight.apple.com/join/62DWQybs)

Täpsem info rakenduse ja ‘Väina’ kohta on saadaval siin: [Kasutusjuhend](https://docs.google.com/document/d/1Pn0A8Bb8BAxHU6tWInYVM7N7stm5OZ7EL_5ww__VZ24/edit?tab=t.0)

Raadiot toimetavad Raul Keller, Tarmo Johannes, Andrus Laansalu, Kristjan Jansen, Maria Hansar, Anastasiia Dolgaia ja Mike Cole.

Vaata ka [linktr.ee/radiotallinn1965](https://linktr.ee/radiotallinn1965)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1203 AND starts_at = '2026-10-23T14:00');

-- 1204: eccm.ee 158, 2026-10-24T16:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1204, '2026-10-24T16:00', NULL, NULL, 'ECCM', 'Pühavaimu 9, Tallinn',
   '', 'https://eccm.ee', 'koostoo', (SELECT id FROM media WHERE key = 'media/72669ad4c23de582412eea3231e45616eaab421e592a2855b95e132b61ce87f4.png'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 158);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1204, 'et', 'kiwa-raamatu-millimullimallikad-esitlus',
   'Kiwa raamatu MILLIMULLIMALLIKAD esitlus', 158,
'Kirjastus ;paranoia avaldas Kiwa eksperimentaalse romaani „MILLIMULLIMALLIKAD“, mis on mõtteline järg tema auhinnatud esikromaanile „Kummiliimiallikad“. Raamatuesitlus toimub 24. oktoobril kl 16.00 Pühavaimu 9 Eesti Nüüdismuusika Keskuses. Esinevad Silvia Sosaar, Kaisa Selde ja ansambel Ratkiller. Toimub mullishow. Raamat müügil esitlushinnaga € 10.

„MILLIMULLIMALLIKAD“ ühendab spekulatiivse proosa, tehnopoeetika, absurdi, filosoofilise ulme ja postinternetliku esteetika. Teose tegevus toimub nihestatud aegruumis, kus erinevad ajastud, infokihid ja reaalsused eksisteerivad korraga ning inimeste teadvus on lagunevate tähenduste, digitaalsete varemete ja kujutluslike mälusüsteemide surve all.

Romaani kaudu avaneb maailm, kus kadunud subkultuurid, olematud bändid, katkised URL-id, kunstlikult genereeritud identiteedid ja „suured kiretud objektid“ moodustavad uue metafüüsilise keskkonna. Üks tegevusliin viib lugeja eraldatud internaatkooli ja selle ümbrusse, kus erinevad ajakihid näivad füüsiliselt kattuvat ning kus tegelased kogevad reaalsuse hajumist. Teine liin liigub teadvuse, mälu ja simulatsiooni piirialadel, käsitledes küsimusi identiteedist, eksistentsist, tähenduse kadumisest ja kujutlusvõime autonoomiast.

Romaani vormiline ülesehitus on fragmentaarne ja assotsiatiivne. Tekst liigub proosa, pseudoesseistika, sürrealistlike kirjelduste, sisemonoloogide, tehnilise keele, filosoofiliste kõrvalepõigete ja poeetiliste kujundite vahel.

Raamatu toimetaja on Roy Strider, kujundaja Tuuli Aule, kaanekujunduse autor on Mihkel Kleis. Raamatu väljaandmist toetas Kultuurkapital. „MILLIMULLIMALLIKAD“ on kirjastuse ;paranoia 62. ilmunud teos.'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1204 AND starts_at = '2026-10-24T16:00');

-- 1205: eccm.ee 159, 2027-07-30T20:00
INSERT OR IGNORE INTO event (id, starts_at, ends_at, duration_min, venue, address, ticket_url, website_url, category, image_id, status, publish_at)
  SELECT 1205, '2027-07-30T20:00', '2027-08-08T20:00', NULL, 'Pärnu Eliisabeti kirik, St. Elizabeth''s Church, Pärnu', 'Nikolai 22, Pärnu',
   '', 'https://schoenberg.ee/', 'schoenberg', (SELECT id FROM media WHERE key = 'media/d614cb7710b222ffad15d69c261df2e8768c067d3e32a6ee9e813cdedfee198d.jpg'), 'published', NULL
  WHERE NOT EXISTS (SELECT 1 FROM event_text WHERE legacy_id = 159);
INSERT OR IGNORE INTO event_text (event_id, lang, slug, title, legacy_id, body)
  SELECT 1205, 'en', 'interdisciplinary-musical-composition-workshop-comp-2027',
   'Interdisciplinary Musical Composition Workshop COMP 2027', 159,
'30.7. to 8.8.2027
Pärnu

In the interdisciplinary musical composition workshop creative people from different fields collaborate to create new works. Each participant would work on his own compositional project, but everyone would also try to create joint compositions together, exchange knowledge and experience, and perhaps learn something new.

The workshop schedule includes lectures, discussions, concerts and co-creation sessions. The workshop ends with a marathon concert.

Participation in the workshop is free. Each participant bears the costs related to himself and their interpreters (for example salaries, daily allowances, travel costs, accommodations and specific technical costs).

If you would like to participate, please write to the Estonian Arnold Schönberg Society. Please describe your creative work to date, the project you are planning for the workshop, and the performers you plan to bring to the workshop.

Collaboration
Eesti Arnold Schönbergi Ühing
Pärnu Loomeliit
Pärnu Ooper
Luuleraadio
Pärnu Eliisabeti kogudus
Pärnu linn
Kultuurkapital

[schoenberg.ee](https://www.schoenberg.ee/)'
  WHERE EXISTS (SELECT 1 FROM event WHERE id = 1205 AND starts_at = '2027-07-30T20:00');

-- PAGES

-- konkursid: the one open call, Ansambel U:'s Koosloome, left eccm.ee (the list reads empty, the article answers 404)
UPDATE page_text SET body = 'Avatud konkursse praegu ei ole.'
  WHERE page_id = (SELECT id FROM page WHERE key = 'konkursid') AND lang = 'et' AND instr(body, 'ansambel-u-koosloome-programm') > 0;
UPDATE page_text SET body = 'There are no open calls at the moment.'
  WHERE page_id = (SELECT id FROM page WHERE key = 'konkursid') AND lang = 'en' AND instr(body, 'ansambel-u-koosloome-opituba-2') > 0;
UPDATE page SET rev = rev + 1, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now')
  WHERE key = 'konkursid' AND updated_at < '2026-11-06' AND EXISTS (SELECT 1 FROM page_text WHERE page_id = page.id AND lang = 'et' AND body = 'Avatud konkursse praegu ei ole.');
