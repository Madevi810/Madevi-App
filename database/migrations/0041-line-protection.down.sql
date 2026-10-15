-- 0041 down: rollback LINE-PROTECT.
-- Hapus dalam urutan kebalik dari up (constraint → column → index).

ALTER TABLE __SCHEMA__.social_comments
  DROP CONSTRAINT IF EXISTS social_comments_is_anonymous_check;

ALTER TABLE __SCHEMA__.social_comments
  DROP COLUMN IF EXISTS is_anonymous;

ALTER TABLE __SCHEMA__.social_posts
  DROP CONSTRAINT IF EXISTS social_posts_anonymous_scope_check;

ALTER TABLE __SCHEMA__.social_posts
  DROP COLUMN IF EXISTS is_anonymous;

DROP INDEX IF EXISTS __SCHEMA__.social_reports_reason_category_idx;

ALTER TABLE __SCHEMA__.social_reports
  DROP CONSTRAINT IF EXISTS social_reports_reason_category_check;

ALTER TABLE __SCHEMA__.social_reports
  DROP COLUMN IF EXISTS reason_category;

ALTER TABLE __SCHEMA__.social_posts
  DROP CONSTRAINT IF EXISTS social_posts_post_type_check;

ALTER TABLE __SCHEMA__.social_posts
  DROP COLUMN IF EXISTS post_type;
