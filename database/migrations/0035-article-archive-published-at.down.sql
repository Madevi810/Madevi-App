-- Rollback 0035: kembalikan CHECK kaku (arsip artikel terbit gagal lagi).

BEGIN;

ALTER TABLE __SCHEMA__.articles DROP CONSTRAINT IF EXISTS articles_published_at_check;
ALTER TABLE __SCHEMA__.articles
  ADD CONSTRAINT articles_check
    CHECK ((status = 'PUBLISHED') = (published_at IS NOT NULL));

COMMIT;
