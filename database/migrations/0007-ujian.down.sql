-- Rollback migrasi 0007
DROP TABLE IF EXISTS __SCHEMA__.certificate_audits;
DROP TABLE IF EXISTS __SCHEMA__.certificates;
DROP TABLE IF EXISTS __SCHEMA__.grade_reviews;
DROP TABLE IF EXISTS __SCHEMA__.score_revisions;
DROP TABLE IF EXISTS __SCHEMA__.attempt_essay_answers;
DROP TABLE IF EXISTS __SCHEMA__.attempt_mc_answers;
DROP TABLE IF EXISTS __SCHEMA__.exam_capacity_control;
DROP TABLE IF EXISTS __SCHEMA__.exam_attempts;
DROP TABLE IF EXISTS __SCHEMA__.learning_progress;
DROP TABLE IF EXISTS __SCHEMA__.learning_cycles;
DROP TABLE IF EXISTS __SCHEMA__.learning_path_articles;
DROP TABLE IF EXISTS __SCHEMA__.learning_paths;
DROP INDEX IF EXISTS __SCHEMA__.questions_essay_bank_stem_unique_idx;
DROP INDEX IF EXISTS __SCHEMA__.questions_mc_bank_stem_unique_idx;
ALTER TABLE __SCHEMA__.questions_essay
  DROP COLUMN IF EXISTS difficulty,
  DROP COLUMN IF EXISTS source_id;
ALTER TABLE __SCHEMA__.questions_mc
  DROP COLUMN IF EXISTS difficulty,
  DROP COLUMN IF EXISTS source_id;
ALTER TABLE __SCHEMA__.question_banks
  DROP COLUMN IF EXISTS reviewed_at,
  DROP COLUMN IF EXISTS reviewed_by;
