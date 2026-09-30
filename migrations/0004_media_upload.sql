-- 0004_media_upload.sql: the column the upload needs on media, asked
-- 2026-09-30 as "implement image upload". bytes is the stored file's length,
-- which the RSS enclosure requires (plans/plan-eccm-urls-sitemap-rss.md
-- section 6) and the upload knows; NULL for the seeded pictures under
-- public/, whose length the feed leaves out. An upload's key is
-- media/{sha256}.{ext} in the R2 bucket, served at /{key} by the Worker
-- (plans/plan-eccm-images.md section 4), so a re-upload of the same bytes
-- is the same row and keeps its scheme (plans/plan-eccm-cms-step-1.md
-- section 2, rule 5).
ALTER TABLE media ADD COLUMN bytes INTEGER;
