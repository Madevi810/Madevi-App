-- 0048 (DOWN): rollback Silsilah Karya.
BEGIN;
DROP FUNCTION IF EXISTS __SCHEMA__.refresh_karya_badges();
DROP TABLE IF EXISTS __SCHEMA__.karya_badges;
DROP TABLE IF EXISTS __SCHEMA__.karya_lineage;
ALTER TABLE __SCHEMA__.social_posts DROP COLUMN IF EXISTS parent_karya_id;
COMMIT;
