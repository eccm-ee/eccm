-- seed-step3.sql: the five pages the menu names, read once each off eccm.ee
-- on 2026-09-28 (the Estonian and English menu URLs of src/render/chrome.mjs,
-- and https://eccm.ee/nan/), converted by hand to the markdown subset
-- src/render/md.mjs renders and cut to the public text: no phone number, no
-- cloaked address of a person (info@eccm.ee stays, the NAN page prints it),
-- no logo pictures, no embedded video (a link to it instead), the source's
-- dashes written as full stops, commas and colons by this repository's rule.
-- One row per page, one text row per language THAT EXISTS ON eccm.ee:
--   eccm          et and en, two different texts and not a translation
--   tallinn-1965  et only; the English menu URL answers Joomla's login page
--   nan           en only; the page is English and not Joomla
--   ulysses       en only; the Estonian page carries the same English text
--   konkursid     et and en (open-calls); each is the listing page's intro
--                 and links to the full article on eccm.ee, which was not read
-- A route in a language with no row shows the other language's text under
-- the visitor's chrome with one line saying so (src/render/page.mjs).
-- The page and page_text tables are migrations/0001_step1.sql; nothing here
-- needs a column they do not have.

INSERT INTO page (id, key, menu_order, status, publish_at) VALUES
  (1, 'eccm', 10, 'published', NULL),
  (2, 'tallinn-1965', 20, 'published', NULL),
  (3, 'nan', 30, 'published', NULL),
  (4, 'ulysses', 40, 'published', NULL),
  (5, 'konkursid', 50, 'published', NULL);

INSERT INTO page_text (page_id, lang, slug, title, legacy_path, body) VALUES
  (1, 'et', 'eccm', 'Eesti Nüüdismuusika Keskus', '/index.php/et/eccm',
'MTÜ Eesti Nüüdismuusikakeskus loodi 2021 ja selle eesmärgiks on nüüdismuusikaalane arendustegevus. Keskus ühendab Eesti olulisemaid nüüdismuusika valdkonna organisatsioone ja üksusi: Eesti Heliloojate Liit MTÜ; Eesti Elektroonilise Muusika Selts; MTÜ Ansambel U; MTÜ Tallinna Uue Muusika Ansambel; YXUS Ühing MTÜ; MTÜ Improtest; Eesti Arnold Schönbergi Ühing MTÜ. Eesti Nüüdismuusika keskus on UNESCO muusikalinn Tallinn programmi partner. Keskusest on kujunenud oluline platvorm ning tugi nüüdismuusika valdkonna uuenemiseks ja arenguks. Keskus pakub nüüdis- ja eksperimentaalmuusika valdkonnas tegutsevatele professionaalsetele, vabakutselistele muusikutele esmakordselt pärast taasiseseisvumist püsivaid, tasuta proovi- ja esinemisruume. Keskus on oluline igapäevane töökeskkond nüüdismuusika kollektiividele (ansambel U:, TUMA, EMA). Keskus pakub mitteformaalset õpet nüüdis- ja elektronmuusika valdkonnas kooliõpilastele; viib läbi seminare ja töötubasid täiskasvanutele ja täiendõpet valdkonna professionaalidele.

Keskus aitab kaasa Eesti nüüdismuusika autorite, artistide ja kollektiivide rahvusvahelisustumisele, loob kontakte, parandab professionaalide võimalusi rahvusvahelises kultuurielus osalemiseks. Kevadel allkirjastasime koostöölepingu Euroopa olulisima nüüdismuusika festivaliga Huddersfield Contemporary Music Festival (HCMF), 3. aastase Eesti fookusprogrammi käivitamiseks.

Keskuse tegevjuht on Taavi Kerikmäe, arendusjuht on Maria Hansar.

Kontakt: info@eccm.ee

[facebook.com/eestinyydismuusikakeskus](https://www.facebook.com/eestinyydismuusikakeskus)'),
  (1, 'en', 'eccm', 'Estonian Centre of Contemporary Music', '/index.php/en/eccm-new-eng',
'Founded last year, the Estonian Centre for Contemporary Music moved its activities to the House of The Blackheads.

"The Estonian Centre for Contemporary Music is an excellent addition to House of The Blackheads, which is already home to the Tallinn Philharmonic and Tallinn Chamber Orchestra. It will bring even more concerts and musicians to the house, giving music lovers even more reasons to visit," said Kaarel Oja, Deputy Mayor of Tallinn. "Enriching the activities of the House of the Blackheads and supporting specialised music centres are both important activities for Tallinn as a music city, and it was a sympathetic way to combine them in this case."

Estonia is creating world-class contemporary music, with an impressive diversity of dedicated performers and ensembles. The Estonian Centre for Contemporary Music aims to co-ordinate and develop contemporary and experimental music activities, and to organise creative residencies for composers, performers and musicologists. The longer-term aim of the Centre is also to increase Tallinn''s attractiveness to the international contemporary music scene.

"The Estonian Contemporary Music Centre will bring together key organisations in the new music landscape and help to stimulate the professional contemporary music creation and performance discourse through lectures, concerts, workshops and public discussions," said **Taavi Kerikmäe**, composer and board member of the Estonian Contemporary Music Centre.

The positive effects of the move to the House of Blackheads are also visible in a short time. Last week, from 10 to 11 November, the Tallinn New Music Ensemble presented Sound Plasma, a festival of microtonal music, and this weekend, from 18 to 19 November, the Tallinn Philharmonic Orchestra will be joined in the programme of the children''s and youth music festival Big Bang by Ansambel U:, currently the most active and well-known new music ensemble in Estonia.

Contact: info@eccm.ee'),
  (2, 'et', 'tallinn-1965', 'Tallinn 1965', '/index.php/et/tallinn-1965',
'Tallinn 1965 on stuudio, mis oleks võinud Eestis asuda kõrvuti kogu läänemaailma kultuurivälja oluliselt mõjutanud stuudiotega Pariisis, Kölnis, Milanos ja mujal. Stuudio avamine aastal 2024 on ajaloo ühe realiseerumata arengutee vabastamine. Tulevik, mida ei tulnud, saab uue võimaluse realiseerumiseks. Mõnikord tuleb ajaloolised protsessid ja nähtused tagasiulatuvalt luua sinna, kus nad oleks pidanud olema, aga kus nad jäid mingitel poliitilistel, majanduslikel või sotsiaalsetel põhjustel olemata. Ajalukku vaadates võib näha intensiivset tühja kohta. Uued tehnoloogilised vahendid ja uus tehnoloogiline arusaam realiseerumata jäänud protsessidest, aga ka füüsilistest seadmetest ja objektidest, mis kunagi tegelikkusesse kohale ei jõudnud, annavad võimaluse see konkretiseerumata tegelikkus uuesti läbi mängida, vaadata uue pilguga tehnoloogiat ja selle lubatavusi, utoopiaid ja tulevikuvisioone.

Stuudio 1965 laiendab heliloomingu mõiste ka uute instrumentide loomise ja tehnoloogiliste lahenduste valdkonda. Spetsiifiliste heliparameetritega unikaalne instrument on ise teos, temas sisalduv potentsiaalne muusika (mis ei pruugi olla veel kunagi esile tulnud) on juba iseenesest looming. See kontseptsioon on siiski piisavalt vähetuntud ja selle kommunikeerimise ja selgitamisega tuleb teha palju tööd, mis ongi üks Stuudio 1965 fookustest. Teiseks toimub helitöötlus-tehnoloogiate miksimine sisuliselt vaharullist AI-ni. Stuudio 1965 tegutseb ajas, kus pole enam selgeid tehnoloogiaid eraldavaid piirjooni. Ajaloolised tehnoloogiad on samaaegsed ja samaväärselt aktualiseeritud kui kõige uuemad läbimurdelised tehnoloogiad.

[Residentuurid](https://eccm.ee/index.php/et/tallinn-1965/residentuurid)'),
  (3, 'en', 'nan', 'Nordic Analog Network', '/nan/',
'A Nordic-Baltic network bringing together universities, artist-run spaces, residencies, and private technology companies, increasing the societal impact of creative technologies through sustainable institutional collaboration in the ecosystem of experimental electronic music. Nordic-Baltic Mobility Programme for Culture, 2024 to 2026.

## What is NAN?

Nordic Analog Network (NAN) is a Nordic-Baltic network that brings together different stakeholders, universities, artist-run spaces, residencies, and private technology companies, aiming to increase the societal impact of creative technologies by identifying and developing new sustainable ways of institutional collaboration in the vast ecosystem of experimental electronic music.

The contemporary and experimental music scene is crossing the borders of narrowly defined musical styles and conventional interpretations, moving outside of the established, the obvious, and the genre-defined. NAN brings together multiple perspectives on electronic music-making as it is understood in the 21st century.

We focus on research-based technological innovation in instrument building, bringing to the limelight forgotten music and sound technologies, valuing their particularities, forgotten possibilities, and new potentials, and promoting the sustainable use of technology by giving it a new life on musical scenes.

NAN places a focus on green consumption, preservation, use, and development of cultural heritage, and promotes a circular economy by giving obsolete cultural heritage a new life. All confirmed activities have been realised as described in the original application, with new collaborations formed at local, national, Nordic, Baltic, and international levels.

"Radical innovation in experimental electronic music has consistently originated in independent, open-access organisations rather than in academic institutions, and the two sectors play structurally complementary rather than competitive roles." NAN Research Report, 2025.

Six core partners, twelve extended partners, nine countries, three major productions, more than sixty years of history reconnected, and 3,500 Ulysses Platform members.

## What happened

**7 to 9 January 2025, Helsinki. Network launch at the University of Helsinki.** The inaugural meeting at the UHMRL introduced partners to the DIMI instrument collection by Erkki Kurenniemi. It established the research framework and set the agenda for heritage preservation, academic collaboration, and future joint activities.

**13 to 15 March 2025, Riga. Workshop at Erica Synths.** A hands-on workshop on modular synthesis, sustainable instrument production, and DIY culture. It brought academic partners, independent organisations, and industry into direct exchange.

**Spring 2025, several cities. Nordic festival networking.** NAN members attended Dark Music Days (Reykjavík), Time of Music (Viitasaari), and Ultima Festival (Oslo), meeting curators, researchers, and artists and expanding the network''s international reach.

**31 August 2025, Tallinn. School Reunion at Studio Tallinn 1965.** A temporary "school" event combining performances, installations, and discussions. Ensemble EMA presented Elektra; Raul Keller showed Jammer; speakers included Roberto Becerra, Matas Samulionis, and Jesper Pedersen (IS). Moderated by Girts Ozolins and Taavi Kerikmäe.

**25 October 2025, Tallinn. Synth DIY workshop.** Organised with Liivatera OÜ. It brought together instrument builders, engineers, students, and enthusiasts, with module-building sessions, panel discussions, and a concert of participant-built instruments.

**October to November 2025, Huddersfield. hcmf// 2025, EMA performs Sachermann.** Ensemble EMA performed the forgotten electroacoustic works of Õie-Olinda Sachermann at the Huddersfield Contemporary Music Festival, using the technology of the 1950s and 1960s on one of Europe''s most prestigious contemporary music stages.

**20 to 24 March 2026, Riga. Concluding network meeting.** The final gathering evaluated outcomes, presented research results, formulated policy recommendations, and developed future cooperation models. The project was formally completed on 25 March 2026.

## Who makes NAN

**Core partners**

**ECCM, Estonia.** Network coordinator and lead applicant. Manages Studio Tallinn 1965, an open experimental analog studio combining professional tape recorders, classical oscillators, filters, and echo machines with modern equipment. Taavi Kerikmäe, Maria Hansar, eccm.ee.

**EES and Ensemble EMA, Estonia.** Workshop organiser and heritage documentation. Ensemble EMA, founded in 2017, five musicians with diverse backgrounds, co-leads the Ulysses Journeys for Live Electronics Composing workshop series. Tarmo Johannes.

**KMH Stockholm, Sweden.** Academic methodology and research. Founded in 1771; holds Sweden''s national mandate for electroacoustic composition. KMH students regularly work at EMS, bridging academia and independent infrastructure. Henrik Frisk, kmh.se.

**UHMRL Helsinki, Finland.** Academic research, history and methodology. Founded in 1962 by Erkki Kurenniemi; holds the world''s only working collection of original DIMI instruments, including the DIMI-6000, DIMI-A, and Dimix. Mikko Ojanen, helsinki.fi.

**Erica Synths, Latvia.** Industry partner and residency studio. An international manufacturer of modular synthesisers; provides a fully equipped residency studio in Riga and a circular economy instrument-sharing platform. Girts Ozolins, ericasynths.lv.

**Inkonst and Intonal, Sweden.** Residency and festival platform. Home of the Intonal Festival (Malmö), one of the Nordic region''s leading avant-garde sound art platforms. A founding member of the NERDS network. Ulf Erikson, inkonst.com.

**Extended partners**

**Iceland University of the Arts, Iceland.** Iceland connection and festival outreach, including through Dark Music Days, Reykjavík. Jesper Pedersen, lhi.is.

**LMTA Vilnius, Lithuania.** Live electronics composition and pedagogy. Roberto Becerra''s LIVE SPACE curriculum contributed directly to NAN workshops at Studio Tallinn 1965. Matas Samulionis, Roberto Becerra, lmta.lt.

**Aalto University, Finland.** Research and engineering. Connects Jari Suominen''s Sound in New Media programme to NAN''s instrument-building work and the Erica Synths collaboration. Antti Ikonen, aalto.fi.

**MH Lübeck, Germany.** Electroacoustic composition and instrument development. Kris Kuldkepp bridges Baltic artistic heritage and German academic infrastructure. Kris Kuldkepp, mh-luebeck.de.

**Notam Oslo, Norway.** Open studio infrastructure and Nordic-Baltic networks. Founded in 1993; studio access around the clock for hundreds of artists annually. notam.no.

**JVLMA Riga, Latvia.** Academic connection in Riga. Latvia''s principal music higher education institution; also a Ulysses Platform member. Anna Fisere, jvlma.lv.

**Üle Heli Festival, Estonia.** Estonian experimental platform and NERDS connection. A member of ECCM and NERDS since 2025. Collaborates with Skaņu Mežs through joint Tallinn Music Week showcases. Aivar Tõnso, ule-heli.ee.

**Skaņu Mežs, Latvia.** Baltic experimental platform and NERDS connection. Riga''s premier festival for adventurous music since 2003; described by The Wire as the most important experimental music festival in the Baltic states. skanumezs.lv.

## What NAN built

**Infrastructure: Studio Tallinn 1965, a permanent platform.** Established not as a one-off project but as a reusable platform for Estonian experimental music internationally, modelled on EMS Stockholm and Notam Oslo, designed to accumulate identity and critical mass over decades.

**Production: the Elektra co-production.** A live-electronic staging of Strauss''s Elektra developed with ECCM, Erica Synths, the UHMRL DIMI Studio, the Estonian National Opera, and hcmf//. It uses Kurenniemi''s original instruments and replicas alongside ensemble EMA''s live electronics practice.

**Heritage: DIMI instrument replication.** Working replicas of Kurenniemi''s DIMI instruments built by Jari Suominen for placement at EMS Stockholm and Studio Tallinn 1965. A physical distribution of embodied instrument knowledge that ensures the tradition survives institutional contraction.

**Networks: Ulysses Platform membership.** ECCM''s membership in the IRCAM-coordinated Ulysses Platform since 2025 connects NAN''s work to 3,500 members across European academies, ensembles, and festivals, the highest tier of institutional legitimacy in European contemporary music.

**Performance: EMA at hcmf// 2025.** Ensemble EMA performed the forgotten electroacoustic works of Õie-Olinda Sachermann using the technology of the 1950s and 1960s at the UK''s largest festival of new and experimental music, a direct result of NAN''s work.

**Education: new generations of the avant-garde.** A Niilo Helander Foundation-funded project bringing early-career composers and instrument builders into direct contact with UHMRL''s collections. The triangle of UHMRL, Aalto and Erica Synths transmits knowledge across institutional boundaries.

**Dissemination**

**Ulysses and IRCAM, European institutional.** 3,500 members across European academies, summer schools, ensembles, and festivals. NAN''s ideas travel through several institutional vectors at once: via JVLMA in Riga, Ultima Oslo through Notam, and Time of Music (Viitasaari).

**hcmf// Huddersfield, international visibility.** A three-year partnership between ECCM and hcmf//, 2025 to 2027. The UK''s largest festival of new and experimental music provides major international public visibility and critical prestige. Its Artistic Director travelled to Tallinn to research the Estonian scene NAN helped build.

**NERDS network, the Nordic-Baltic circuit.** Two parallel NAN channels: Inkonst (a founding NERDS member) and Üle Heli (joined 2025). Together with Skaņu Mežs, they form the horizontal curatorial circuit through which experimental music reaches live audiences. NERDS doubled to 14 members in 2025 with a showcase at Berlin''s CTM festival.

## Research and policy recommendations

NAN produced a full research report examining the structural relationship between independent organisations and academic institutions in Nordic-Baltic experimental music. A working paper has been completed; a peer-reviewed cultural policy journal submission is in preparation.

**For cultural ministries and state agencies**

**1. Establish permanent structural funding for independent music technology centres.** Estonia, Latvia, and Lithuania each lack a permanently funded national centre for electronic music and sound art equivalent to EMS or Notam. Cultural funding frameworks should include a dedicated structural funding line for independent organisations operating at the intersection of technology, sound art, and experimental music: multi-year, core-funded rather than project-based, designed to support open-access studio infrastructure, artist residencies, and knowledge exchange. The Nordic model demonstrates that state funding at arm''s length from government, through arts councils or performing arts agencies, is the most effective structural arrangement.

**2. Commission systematic documentation of Baltic electronic music history.** The histories of electronic music in Estonia, Latvia, and Lithuania under Soviet conditions have not yet been systematically documented and made available as a living resource for contemporary practitioners. Ministries should commission and fund this documentation work through partnerships between academic institutions and independent organisations. The University of Helsinki''s work on Kurenniemi is the model: patient, rigorous scholarship that turns obscure inventors into recoverable traditions.

**For Nordic-Baltic funding bodies**

**3. Develop a structural funding instrument for cross-border independent music organisations.** A new funding instrument, perhaps developed jointly by the Nordic Council of Ministers and the Baltic ministerial framework, should support permanent cross-border infrastructure: shared studio access, reciprocal residency rights, pooled equipment maintenance, and sustained organisational capacity rather than isolated projects. This is the missing layer between the national structural funding that Nordic institutions like EMS enjoy and the project-by-project existence of Baltic equivalents.

**4. Weight structural network impact heavily in evaluation criteria.** Short-term network funding of the kind that supported NAN''s initial phase has an outsized return on investment in a field where the primary obstacle is not talent or ambition but connectivity and coordination. The connections forged through NAN, between UHMRL and Erica Synths, between ECCM and KMH, between ensemble EMA and hcmf//, would not have existed without dedicated network funding. Structural impact of this kind should be weighted heavily in evaluation criteria.

**For academic music institutions**

**5. Formalise partnerships with independent organisations.** Baltic music academies should develop formal partnership frameworks with independent organisations: agreements that give independent organisations access to academic resources in exchange for access to studio infrastructure, practitioner knowledge, and experimental programming space. The NAN model, in which KMH and UHMRL contribute methodological frameworks while Erica Synths and ECCM provide hands-on infrastructure, is a template for this kind of structured interdependence.

**6. Invest in documentation and transmission of regional electronic music heritage.** The University of Helsinki''s work on Kurenniemi''s instruments demonstrates the value of academically rigorous attention to regional history. Baltic music academies should develop equivalent research programmes focused on their own histories: the Soviet-era studios, the improvised instruments, the composers and engineers who worked in the margins of official cultural structures, and the exiled avant-garde whose contributions have been absorbed into Swedish and Canadian cultural history.

**7. Accept the academy''s role as transmitter, not initiator, of experimental innovation.** The most generative contribution academic music institutions can make to experimental electronic music is to serve as its memory, methodological conscience, and bridge to wider publics and policy structures, not to claim leadership of innovation. This requires an honest internal reckoning with the structural limits of academisation, and active support for the independent organisations that perform the laboratory function the academy cannot.

**For network practitioners**

**8. Build toward permanence: from network to institution.** NAN''s long-term ambition should be to generate the conditions for something more permanent: a shared Nordic-Baltic resource centre for experimental electronic music that outlasts any single project cycle, whether a jointly operated studio space, a shared residency programme, a distributed instrument library, or a research consortium. The specific form matters less than the commitment to permanence as a strategic goal, and to the funding advocacy required to achieve it.

Supported by the Nordic-Baltic Mobility Programme for Culture. Contact: info@eccm.ee.'),
  (4, 'en', 'ulysses', 'Ulysses Network', '/index.php/en/ulysses-eng',
'**Proud to be part of Ulysses**

**The ULYSSES Platform supports emerging contemporary music artists throughout Europe.**

Since 2025, we are part of Ulysses, one of Europe''s most significant networks for contemporary music. Built on more than a decade of collaboration among leading European festivals, ensembles, and academies, including IRCAM, Gaudeamus, Warsaw Autumn, and many others, Ulysses supports emerging composers and performers as they move from training into professional careers, and is co-funded by the European Union.

Being part of this network connects us with an outstanding community of artists and institutions across the continent, opening new doors for collaboration, touring, and artistic exchange. We''re excited for everything this partnership will bring: for our artists, our audiences, and the future of contemporary music in Europe.

Co-funded by the European Union.'),
  (5, 'et', 'konkursid', 'Konkursid', '/index.php/et/konkursid',
'## Kandideeri Ansambel U: koosloome programmi

**Mis?**

Koosloome programmi mõte on uurida ja arendada nüüdismuusika loomisel koostöövormi, kus helilooja ja esitajad on “ühes paadis” alates protsessi algfaasist kuni teose valmimise ja esiettekandeni. Olulisel kohal on teineteise tundmaõppimine, arutelud, peegeldamine ja tagasiside, improvisatsioon, eksperimendid.

[Video: On Co-creation workshop by ensemble U:, Ulysses Platform](https://www.youtube.com/watch?v=mVOqdOrmB8E)

[Kandideeri](https://form.jotform.com/262584600245051)

[Loe veel: Kandideeri Ansambel U: koosloome programmi](https://eccm.ee/index.php/et/konkursid/ansambel-u-koosloome-programm)'),
  (5, 'en', 'open-calls', 'Open calls', '/index.php/en/open-calls',
'## Open call: Ensemble U:’s Co-Creation Workshop

**What?**

The aim of the Co-Creation Workshop is to explore and develop a collaborative model in contemporary music creation, where the composer and performers are "in the same boat" from the very beginning of the process until the completion and premiere of the work. Getting to know one another, discussions, reflection, feedback, improvisation, and experimentation all play a crucial role.

[Video: On Co-creation workshop by ensemble U:, Ulysses Platform](https://www.youtube.com/watch?v=mVOqdOrmB8E)

[Apply](https://form.jotform.com/262584600245051)

[Read more: Open call: Ensemble U:’s Co-Creation Workshop](https://eccm.ee/index.php/en/open-calls/ansambel-u-koosloome-opituba-2)');
