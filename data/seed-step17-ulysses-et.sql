-- seed-step17-ulysses-et.sql: the Ulysses page in Estonian, and its English text without the line the EU emblem
-- under it already says, asked 2026-11-13 ("go" on both). eccm.ee had the page in English only (Joomla article 55),
-- so the Estonian text is a translation of it, for ECCM to read through; its last paragraph links the Estonian
-- Koosloome page of seed-step16-koosloome-page.sql.
--
-- Runs twice without harm: the line goes only while it is there, the Estonian text only when there is none.
-- Apply after seed-step16-koosloome-page.sql.

UPDATE page_text SET body = replace(body, '

Co-funded by the European Union.

', '

')
  WHERE page_id = (SELECT id FROM page WHERE key = 'ulysses') AND lang = 'en' AND instr(body, '

Co-funded by the European Union.

') > 0;

INSERT OR IGNORE INTO page_text (page_id, lang, slug, title, legacy_path, body)
  SELECT id, 'et', 'ulysses', 'Ulysses', NULL,
'**Uhkusega osa Ulyssesest**

**ULYSSES platvorm toetab nüüdismuusika noori loojaid ja esitajaid üle Euroopa.**

Alates 2025. aastast kuulume Ulyssesesse, mis on üks Euroopa olulisemaid nüüdismuusika võrgustikke. Enam kui kümne aasta pikkusele koostööle tuginev võrgustik ühendab Euroopa juhtivaid festivale, ansambleid ja akadeemiaid, nende seas IRCAM, Gaudeamus ja Varssavi Sügis. Ulysses toetab noori heliloojaid ja interpreete teel õpingutest professionaalse karjäärini ning seda kaasrahastab Euroopa Liit.

Võrgustikku kuulumine ühendab meid tähelepanuväärse kunstnike ja institutsioonide kogukonnaga üle kogu mandri ning avab uusi võimalusi koostööks, kontsertreisideks ja kunstiliseks vahetuseks. Ootame põnevusega kõike, mida see partnerlus toob meie kunstnikele, publikule ja Euroopa nüüdismuusika tulevikule.

[U: koosloome programm](/et/koosloome-programm), kolm heliloojate ja ansambli kohtumist sel hooajal, on osa ECCM-i tegevusest Ulyssese võrgustikus.'
  FROM page WHERE key = 'ulysses';
