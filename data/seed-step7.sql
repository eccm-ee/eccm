-- seed-step7.sql: the data half of 2026-10-03's "eventpage fixes" and
-- "seeded rows", after migrations/0006_tuma.sql. Runs twice without harm.
--
-- TUMA's eight events take the new series key: Scrapyard (4), Sound Plasma
-- 10 in Berlin (9), Open Space #4 (12), TUMA at Warsaw Autumn (22), Sound
-- Plasma 10 (23), TUMA at Huddersfield (26), Up to Three (27) and Open
-- Space #5 (29), every one whose text names the ensemble as its maker.
UPDATE event SET category = 'tuma', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now')
  WHERE id IN (4, 9, 12, 22, 23, 26, 27, 29) AND category = 'koostoo';

-- The Üle Heli festival is four days with no hour given: eccm.ee still prints
-- 22.10.2026 15:51 to 25.10.2026 23:51, which is its form's default and not a
-- time. 00:00 means the day alone, and the page prints 22.–25. oktoober 2026.
UPDATE event SET starts_at = '2026-10-22T00:00', ends_at = '2026-10-25T23:59', updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now')
  WHERE id = 7 AND starts_at = '2026-10-22T15:51';

-- The second Gestures evening's slugs were cut at 60 characters inside a
-- name ("-liisa"); they take the editor's own rule for a taken slug, the
-- first evening's with the date after it.
UPDATE event_text SET slug = 'gestuurid-situatsioonid-ilma-partituurita-kuulamine-2026-10-11'
  WHERE event_id = 5 AND lang = 'et' AND slug = 'gestuurid-situatsioonid-ilma-partituurita-kuulamine-liisa';
UPDATE event_text SET slug = 'gestures-situations-listening-without-a-score-2026-10-11'
  WHERE event_id = 5 AND lang = 'en' AND slug = 'gestures-situations-listening-without-a-score-liisa';

-- The event page prints website_url as Koduleht now, so the link line the
-- seeds repeated at the end of every body goes, where it is exactly that line.
UPDATE event_text SET body = substr(body, 1, length(body) - length(char(10) || char(10) || '[eccm.ee](https://eccm.ee)'))
  WHERE event_id IN (SELECT id FROM event WHERE website_url = 'https://eccm.ee') AND substr(body, -length(char(10) || char(10) || '[eccm.ee](https://eccm.ee)')) = char(10) || char(10) || '[eccm.ee](https://eccm.ee)';
UPDATE event_text SET body = substr(body, 1, length(body) - length(char(10) || char(10) || '[estelmus.com](https://estelmus.com)'))
  WHERE event_id IN (SELECT id FROM event WHERE website_url = 'https://estelmus.com') AND substr(body, -length(char(10) || char(10) || '[estelmus.com](https://estelmus.com)')) = char(10) || char(10) || '[estelmus.com](https://estelmus.com)';
UPDATE event_text SET body = substr(body, 1, length(body) - length(char(10) || char(10) || '[field-notes.berlin](https://field-notes.berlin/en/kalender/ensemble-new-music-tallinn-ensemble21)'))
  WHERE event_id IN (SELECT id FROM event WHERE website_url = 'https://field-notes.berlin/en/kalender/ensemble-new-music-tallinn-ensemble21') AND substr(body, -length(char(10) || char(10) || '[field-notes.berlin](https://field-notes.berlin/en/kalender/ensemble-new-music-tallinn-ensemble21)')) = char(10) || char(10) || '[field-notes.berlin](https://field-notes.berlin/en/kalender/ensemble-new-music-tallinn-ensemble21)';
UPDATE event_text SET body = substr(body, 1, length(body) - length(char(10) || char(10) || '[hcmf.co.uk](https://hcmf.co.uk/programme/ensemble-for-new-music-tallinn/)'))
  WHERE event_id IN (SELECT id FROM event WHERE website_url = 'https://hcmf.co.uk/programme/ensemble-for-new-music-tallinn/') AND substr(body, -length(char(10) || char(10) || '[hcmf.co.uk](https://hcmf.co.uk/programme/ensemble-for-new-music-tallinn/)')) = char(10) || char(10) || '[hcmf.co.uk](https://hcmf.co.uk/programme/ensemble-for-new-music-tallinn/)';
UPDATE event_text SET body = substr(body, 1, length(body) - length(char(10) || char(10) || '[improtest.ee](https://improtest.ee)'))
  WHERE event_id IN (SELECT id FROM event WHERE website_url = 'https://improtest.ee') AND substr(body, -length(char(10) || char(10) || '[improtest.ee](https://improtest.ee)')) = char(10) || char(10) || '[improtest.ee](https://improtest.ee)';
UPDATE event_text SET body = substr(body, 1, length(body) - length(char(10) || char(10) || '[saal.ee](https://saal.ee/)'))
  WHERE event_id IN (SELECT id FROM event WHERE website_url = 'https://saal.ee/') AND substr(body, -length(char(10) || char(10) || '[saal.ee](https://saal.ee/)')) = char(10) || char(10) || '[saal.ee](https://saal.ee/)';
UPDATE event_text SET body = substr(body, 1, length(body) - length(char(10) || char(10) || '[schoenberg.ee](https://schoenberg.ee/)'))
  WHERE event_id IN (SELECT id FROM event WHERE website_url = 'https://schoenberg.ee/') AND substr(body, -length(char(10) || char(10) || '[schoenberg.ee](https://schoenberg.ee/)')) = char(10) || char(10) || '[schoenberg.ee](https://schoenberg.ee/)';
UPDATE event_text SET body = substr(body, 1, length(body) - length(char(10) || char(10) || '[uuu.ee](https://uuu.ee)'))
  WHERE event_id IN (SELECT id FROM event WHERE website_url = 'https://uuu.ee') AND substr(body, -length(char(10) || char(10) || '[uuu.ee](https://uuu.ee)')) = char(10) || char(10) || '[uuu.ee](https://uuu.ee)';
UPDATE event_text SET body = substr(body, 1, length(body) - length(char(10) || char(10) || '[warszawska-jesien.art.pl](https://warszawska-jesien.art.pl/en/2026/programme/programme/21-09/enmt)'))
  WHERE event_id IN (SELECT id FROM event WHERE website_url = 'https://warszawska-jesien.art.pl/en/2026/programme/programme/21-09/enmt') AND substr(body, -length(char(10) || char(10) || '[warszawska-jesien.art.pl](https://warszawska-jesien.art.pl/en/2026/programme/programme/21-09/enmt)')) = char(10) || char(10) || '[warszawska-jesien.art.pl](https://warszawska-jesien.art.pl/en/2026/programme/programme/21-09/enmt)';
UPDATE event_text SET body = substr(body, 1, length(body) - length(char(10) || char(10) || '[warszawska-jesien.art.pl](https://warszawska-jesien.art.pl/en/2026/programme/programme/21-09/estonian-electronic-music)'))
  WHERE event_id IN (SELECT id FROM event WHERE website_url = 'https://warszawska-jesien.art.pl/en/2026/programme/programme/21-09/estonian-electronic-music') AND substr(body, -length(char(10) || char(10) || '[warszawska-jesien.art.pl](https://warszawska-jesien.art.pl/en/2026/programme/programme/21-09/estonian-electronic-music)')) = char(10) || char(10) || '[warszawska-jesien.art.pl](https://warszawska-jesien.art.pl/en/2026/programme/programme/21-09/estonian-electronic-music)';
UPDATE event_text SET body = substr(body, 1, length(body) - length(char(10) || char(10) || '[arvopart.ee](https://www.arvopart.ee/arvo-pardi-keskus/sundmused/sundmus/morton-feldman-100-ansambel-u/)'))
  WHERE event_id IN (SELECT id FROM event WHERE website_url = 'https://www.arvopart.ee/arvo-pardi-keskus/sundmused/sundmus/morton-feldman-100-ansambel-u/') AND substr(body, -length(char(10) || char(10) || '[arvopart.ee](https://www.arvopart.ee/arvo-pardi-keskus/sundmused/sundmus/morton-feldman-100-ansambel-u/)')) = char(10) || char(10) || '[arvopart.ee](https://www.arvopart.ee/arvo-pardi-keskus/sundmused/sundmus/morton-feldman-100-ansambel-u/)';
UPDATE event_text SET body = substr(body, 1, length(body) - length(char(10) || char(10) || '[enmtallinn.com](https://www.enmtallinn.com/)'))
  WHERE event_id IN (SELECT id FROM event WHERE website_url = 'https://www.enmtallinn.com/') AND substr(body, -length(char(10) || char(10) || '[enmtallinn.com](https://www.enmtallinn.com/)')) = char(10) || char(10) || '[enmtallinn.com](https://www.enmtallinn.com/)';
UPDATE event_text SET body = substr(body, 1, length(body) - length(char(10) || char(10) || '[filharmoonia.ee](https://www.filharmoonia.ee/mustpeademaja)'))
  WHERE event_id IN (SELECT id FROM event WHERE website_url = 'https://www.filharmoonia.ee/mustpeademaja') AND substr(body, -length(char(10) || char(10) || '[filharmoonia.ee](https://www.filharmoonia.ee/mustpeademaja)')) = char(10) || char(10) || '[filharmoonia.ee](https://www.filharmoonia.ee/mustpeademaja)';
UPDATE event_text SET body = substr(body, 1, length(body) - length(char(10) || char(10) || '[improtest.ee](https://www.improtest.ee)'))
  WHERE event_id IN (SELECT id FROM event WHERE website_url = 'https://www.improtest.ee') AND substr(body, -length(char(10) || char(10) || '[improtest.ee](https://www.improtest.ee)')) = char(10) || char(10) || '[improtest.ee](https://www.improtest.ee)';
UPDATE event_text SET body = substr(body, 1, length(body) - length(char(10) || char(10) || '[ludensemble.ee](https://www.ludensemble.ee/)'))
  WHERE event_id IN (SELECT id FROM event WHERE website_url = 'https://www.ludensemble.ee/') AND substr(body, -length(char(10) || char(10) || '[ludensemble.ee](https://www.ludensemble.ee/)')) = char(10) || char(10) || '[ludensemble.ee](https://www.ludensemble.ee/)';
UPDATE event_text SET body = substr(body, 1, length(body) - length(char(10) || char(10) || '[ule-heli.ee](https://www.ule-heli.ee/)'))
  WHERE event_id IN (SELECT id FROM event WHERE website_url = 'https://www.ule-heli.ee/') AND substr(body, -length(char(10) || char(10) || '[ule-heli.ee](https://www.ule-heli.ee/)')) = char(10) || char(10) || '[ule-heli.ee](https://www.ule-heli.ee/)';
