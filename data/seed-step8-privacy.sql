-- seed-step8-privacy.sql: the privacy notice, /et/andmekaitse
-- (Andmekaitsetingimused, the word of Andmekaitse Inspektsioon's guide
-- "Isikuandmete töötleja üldjuhend", chapter 10) and /en/privacy, a text page
-- like those of seed-step3.sql. ECCM had no privacy text, so this is a draft
-- written 2026-10-07 from what the site does (the newsletter, the contact
-- form, the theme in the browser's storage, the YouTube
-- player that loads on a click), in the order of comparable organisations'
-- notices, for ECCM to approve or rewrite at /edit/pages. The page's id is
-- whatever is free, so the file does not collide with pages added elsewhere;
-- run it once.

INSERT INTO page (key, menu_order, status) VALUES ('privacy', 90, 'published');

INSERT INTO page_text (page_id, lang, slug, title, body) VALUES
  ((SELECT id FROM page WHERE key = 'privacy'), 'et', 'andmekaitse', 'Andmekaitsetingimused',
'Siin on kirjas, milliseid isikuandmeid ECCM-i veebileht kogub, miks ja kui kaua neid hoiame ning kuidas saad oma andmete üle ise otsustada.

## 1. Kes me oleme

Andmete vastutav töötleja on MTÜ Eesti Nüüdismuusika Keskus (ECCM), registrikood 80603988, Herne 11A, 10135 Tallinn. Kõigis andmekaitse küsimustes kirjuta aadressile info@eccm.ee.

## 2. Uudiskiri

Kui liitud uudiskirjaga, hoiame sinu e-posti aadressi, valitud keelt ning liitumise ja kinnitamise aega. Aadressi kasutame ainult ECCM-i kava ja uudiste saatmiseks.

Alus on sinu nõusolek. Liitumine käib kahes sammus: pärast vormi saatmist saadame sulle kirja ja tellimus hakkab kehtima alles siis, kui avad selles oleva lingi. Kinnitamata aadressile uudiskirja ei saadeta.

Hoiame aadressi seni, kuni lahkud. Iga kirja lõpus on link, millega saad ühe klõpsuga lahkuda, ja pärast seda me sulle enam kirju ei saada. Lahkuda saad ka siis, kui kirjutad aadressile info@eccm.ee.

## 3. Kontaktivorm

Kontaktivormiga saadad meile oma nime, e-posti aadressi ja sõnumi. Salvestame need ja saadame meie postkasti info@eccm.ee, et saaksime sulle vastata. Liiga paljude saatmiste piiramiseks hoiame ka sinu IP-aadressi räsi. See on ühesuunaline kood, millest aadressi tagasi ei saa, ja sellega loeme ainult, mitu sõnumit on ühelt aadressilt tunni jooksul saadetud.

Alus on meie õigustatud huvi vastata sulle, kui oled meie poole pöördunud. Veebilehe andmebaasist kustutame sõnumi ühe aasta pärast. Postkasti jõudnud kirja hoiame nii kaua, kui see on vastamiseks ja asja ajamiseks vajalik.

## 4. Teenusepakkujad

Veebileht töötab Cloudflare''i teenustel: majutus, andmebaas, failide hoidmine ja e-kirjade saatmine. Cloudflare on meie volitatud töötleja ja töötleb andmeid ainult meie jaoks, [Cloudflare''i andmetöötluse lisa](https://www.cloudflare.com/cloudflare-customer-dpa/) alusel. Cloudflare logib päringuid (näiteks IP-aadress, aeg ja avatud leht) turvalisuse ja vigade leidmise jaoks ning hoiab neid lühikest aega. Kontaktivormil kontrollib Cloudflare Turnstile, et saatja on inimene.

Cloudflare võib andmeid töödelda ka väljaspool Euroopa Liitu, sealhulgas Ameerika Ühendriikides. Selline edastamine toimub ELi ja USA andmekaitseraamistiku (EU-US Data Privacy Framework) ning Euroopa Komisjoni tüüptingimuste alusel.

Mõnel lehel on YouTube''i video. Enne klõpsu näed ainult pilti, mis tuleb meie enda serverist, ja YouTube''ist ei laadita midagi. Kui klõpsad, laaditakse video aadressilt youtube-nocookie.com ja sellest hetkest kehtivad [Google''i privaatsustingimused](https://policies.google.com/privacy).

Muid kolmandaid osapooli lehel ei ole: kirjatüübid ja pildid tulevad meie enda serverist.

## 5. Küpsised ja brauseri mälu

Veebileht ei kasuta küpsiseid. Ainus asi, mida brauserisse salvestame, on sinu valitud teema (hele või tume). See jääb sinu brauseri enda mällu ega jõua meieni. Külastusi me ei loe ning analüütikat ega reklaami jälgimist ei kasuta.

## 6. Sinu õigused

Sul on õigus küsida, milliseid andmeid sinu kohta hoiame, ja saada neist koopia. Sul on õigus lasta valed andmed parandada ja oma andmed kustutada. Sul on õigus esitada vastuväide töötlemisele, mis põhineb meie õigustatud huvil. Nõusoleku saad igal ajal tagasi võtta, ja see ei muuda varasemat töötlemist ebaseaduslikuks.

Kirjuta aadressile info@eccm.ee ja vastame ühe kuu jooksul. Kui leiad, et oleme sinu andmeid töödelnud valesti, võid pöörduda [Andmekaitse Inspektsiooni](https://www.aki.ee/) poole.

Viimati muudetud 7. oktoober 2026.'),
  ((SELECT id FROM page WHERE key = 'privacy'), 'en', 'privacy', 'Privacy',
'This page says what personal data the ECCM website collects, why and for how long we keep it, and how you stay in control of it.

## 1. Who we are

The controller of your data is MTÜ Eesti Nüüdismuusika Keskus (Estonian Centre of Contemporary Music, ECCM), registry code 80603988, Herne 11A, 10135 Tallinn, Estonia. For any question about your data, write to info@eccm.ee.

## 2. Newsletter

When you subscribe to the newsletter we keep your email address, the language you chose and when you subscribed and confirmed. We use the address only to send you the ECCM programme and news.

The basis is your consent. Subscribing takes two steps: after you send the form we email you, and the subscription starts only when you open the link in that email. Nothing is sent to an address that has not been confirmed.

We keep the address until you leave. Every letter ends with a link that unsubscribes you in one click, and after that we send you nothing more. You can also leave by writing to info@eccm.ee.

## 3. Contact form

With the contact form you send us your name, email address and message. We store them and send them to our mailbox info@eccm.ee so that we can answer you. To limit repeated sending we also keep a hash of your IP address. It is a one-way code from which the address cannot be recovered, and we use it only to count how many messages came from one address in the last hour.

The basis is our legitimate interest in answering you when you contact us. The message is deleted from the website''s database after one year. The copy in our mailbox is kept as long as we need it to answer and deal with your matter.

## 4. Service providers

The website runs on Cloudflare''s services: hosting, the database, file storage and sending email. Cloudflare is our processor and handles the data only on our behalf, under [Cloudflare''s Data Processing Addendum](https://www.cloudflare.com/cloudflare-customer-dpa/). Cloudflare logs requests (such as the IP address, the time and the page opened) for security and to find faults, and keeps them for a short time. On the contact form, Cloudflare Turnstile checks that the sender is a person.

Cloudflare may process data outside the European Union, including in the United States. Such transfers rely on the EU-US Data Privacy Framework and the European Commission''s standard contractual clauses.

Some pages show a YouTube video. Before you click it you see only a picture served from our own server, and nothing is loaded from YouTube. When you click, the video loads from youtube-nocookie.com and from then on [Google''s privacy policy](https://policies.google.com/privacy) applies.

There are no other third parties on the site: fonts and pictures come from our own server.

## 5. Cookies and browser storage

The website sets no cookies. The only thing we keep in your browser is the theme you pick (light or dark). It stays in your browser''s own storage and never reaches us. We do not count visits and use no analytics or advertising tracking.

## 6. Your rights

You have the right to ask what data we hold about you and to get a copy of it. You have the right to have wrong data corrected and your data deleted. You have the right to object to processing based on our legitimate interest. You can withdraw your consent at any time, which does not make earlier processing unlawful.

Write to info@eccm.ee and we will answer within one month. If you think we have handled your data wrongly, you can complain to the Estonian [Data Protection Inspectorate](https://www.aki.ee/en) (Andmekaitse Inspektsioon).

Last changed 7 October 2026.');
