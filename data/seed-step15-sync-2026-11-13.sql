-- seed-step15-sync-2026-11-13.sql: what changed on eccm.ee since step 13 of 2026-11-09, read once each off its
-- public pages on 2026-11-13 (the upcoming lists in both languages, every event page from 23.10 on in each
-- language, the menu pages; one request a second, through www.eccm.ee), compared with staging. The shape is step
-- 13's: titles as eccm.ee writes them, dashes written as commas and colons, the English venue on event_text.venue.
--
-- Changed: Koosloome õpituba on 14.11 (iCagenda 111 and 112, event 24). The call it announced is decided, so both
-- texts now name the three composers chosen out of 55 applications, the guest who reflects on each meeting, and
-- the weekend's schedule, in eccm.ee's order. The typos are mended (erakorduselt, Reflektesioonid, Scheduler), the
-- schedule's times written whole (13.00-14.30 for "13.-14.30"), and the English text's second sentence about
-- Liisa Hõbepappel, which repeats the first, is left out.
--
-- Unchanged: every other event, its date, time, venue, links and picture, and the menu pages. No new events (no
-- iCagenda id on eccm.ee is missing from staging but the 2027 and 2028 Schönberg placeholders, left behind as
-- decided, and 171 to 175 answer 404). The open calls page still has none. Barry Guy, Maya Homburger, Liudas
-- Mockunas (143 and 144) and Kuni kolm (128 and 129) still answer 404 and stay drafts.
--
-- Runs twice without harm: each text only while it still holds step 11's sentence about the call to come, and the
-- rev only once, so an edit made in the editor meanwhile is left alone. Apply after seed-step14-improtest-mark.sql.

-- CHANGED EVENTS

-- 24, Koosloome õpituba (111 and 112), 14.11: the chosen composers, the guest, the schedule
UPDATE event_text SET body = 'Koosloome õpitoa mõte on uurida ja arendada koostöövormi, kus helilooja ja esitajad töötavad koos alates protsessi päris algusest kuni teose valmimise ja esiettekandeni.

U:/ECCM kuulutas välja konkursi noortele heliloojatele, kes soovivad programmis osaleda. Huvi oli erakordselt suur: kokku laekus üle Euroopa 55 avaldust.

Paraku saab selle projekti raames piisavalt rahulikult töötada vaid kolmega. Valituks osutusid:
**Parham Behzad** (IR/AT)
**Sofus Preisel** (DK)
**Żaneta Rydzewska** (PL)

Iga kohtumise juurde on kutsutud ka külaline, kes peegeldab protsessi oma vaatenurgast. Esimesel korral on selleks **Liisa Hõbepappel**, kes on ansambliga sarnasel moel töötanud.

Hooaja jooksul toimub kolm kohtumist. Esimeses tutvustatakse algideesid, arutatakse, peegeldatakse, improviseeritakse, kogutakse algmaterjali ja mõtteid.

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

Järgnevad kohtumised toimuvad **20. ja 21. veebruaril 2027** ning **15. ja 16. mail 2027**. Kõik töösessioonid on huvilistele avatud.

Sari toimub võrgustiku [Ulysses](https://ulysses-platform.eu/ulysses-platform) raames.'
  WHERE event_id = 24 AND lang = 'et' AND instr(body, 'Konkurss kuulutatakse välja septembris 2026') > 0;
UPDATE event_text SET body = 'The idea behind the co-creation workshop is to explore and develop a collaborative model where the composer and performers work together from the very beginning of the process through to the completion and premiere of the work.

U:/ECCM announced a call for applications for young composers wishing to participate in the program. The interest was exceptionally high: a total of 55 applications were submitted from across Europe.

Unfortunately, within the scope of this project, it is only possible to work at a sufficiently focused pace with three participants. The selected composers are:
**Parham Behzad** (IR/AT)
**Sofus Preisel** (DK)
**Żaneta Rydzewska** (PL)

A guest is invited to each session to reflect on the process from their perspective. For the first edition, this will be **Liisa Hõbepappel**, who has previously worked with the ensemble in a similar manner.

Three meetings will take place during the season. In the first one, initial ideas will be presented, discussed, reflected upon, and improvised on, gathering primary material and concepts.

Schedule:
**Sa 14.11**
11.00 Welcome, introduction by Liisa Hõbepappel
12.00-13.00 Session of Composer 1
13.30-14.30 Composer 2
16.00-17.00 Composer 3
17.00-18.00 Reflections
**Su 15.11**
11.00-12.30 Composer 3
13.00-14.30 Composer 2
15.30-17.00 Composer 1
17.15-18.00 Reflections, discussion

All working sessions are open to anyone interested. The subsequent meetings will take place on **20 and 21 February 2027** and **15 and 16 May 2027**.

The series takes place within the framework of the [Ulysses](https://ulysses-platform.eu/ulysses-platform) network.'
  WHERE event_id = 24 AND lang = 'en' AND instr(body, 'The call for applications will be announced in September 2026') > 0;
UPDATE event SET updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'), rev = rev + 1
  WHERE id = 24 AND updated_at < '2026-11-13'
    AND EXISTS (SELECT 1 FROM event_text WHERE event_id = 24 AND lang = 'et' AND instr(body, 'Parham Behzad') > 0);
