-- 0012_venue_per_language.sql: the venue in each text's language (asked
-- 2026-11-06: "english data is a mess"), so an English page says "ECCM hall"
-- where the Estonian one says "ECCM saal". NULL or empty falls back to
-- event.venue, which stays the Estonian name and the only one the editor
-- requires; the address is one string for both languages.
ALTER TABLE event_text ADD COLUMN venue TEXT;
