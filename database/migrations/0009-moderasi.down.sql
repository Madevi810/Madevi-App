ALTER TABLE IF EXISTS __SCHEMA__.article_corrections
  DROP COLUMN IF EXISTS moderation_reason,
  DROP COLUMN IF EXISTS moderation_status;
ALTER TABLE IF EXISTS __SCHEMA__.article_suggestions
  DROP COLUMN IF EXISTS moderation_reason,
  DROP COLUMN IF EXISTS moderation_status;
DROP TABLE IF EXISTS __SCHEMA__.moderation_appeals;
DROP TABLE IF EXISTS __SCHEMA__.moderation_strikes;
DROP TABLE IF EXISTS __SCHEMA__.social_restrictions;
ALTER TABLE IF EXISTS __SCHEMA__.social_blocks DROP CONSTRAINT IF EXISTS social_blocks_source_case_fk;
ALTER TABLE IF EXISTS __SCHEMA__.social_blocks DROP COLUMN IF EXISTS source_case_id;
DROP TABLE IF EXISTS __SCHEMA__.moderation_case_evidence;
DROP TABLE IF EXISTS __SCHEMA__.moderation_cases;
DROP TABLE IF EXISTS __SCHEMA__.moderation_assessments;
DROP TABLE IF EXISTS __SCHEMA__.moderation_rulesets;
ALTER TABLE IF EXISTS __SCHEMA__.article_suggestions
  DROP COLUMN IF EXISTS moderation_reason,
  DROP COLUMN IF EXISTS moderation_status;
ALTER TABLE IF EXISTS __SCHEMA__.article_corrections
  DROP COLUMN IF EXISTS moderation_reason,
  DROP COLUMN IF EXISTS moderation_status;
