-- 0049 (DOWN): rollback Petisi Katalog.
BEGIN;
DROP TRIGGER IF EXISTS petition_votes_insert_sync ON __SCHEMA__.petition_votes;
DROP TRIGGER IF EXISTS petition_votes_delete_sync ON __SCHEMA__.petition_votes;
DROP FUNCTION IF EXISTS __SCHEMA__.petition_votes_count_sync();
DROP TRIGGER IF EXISTS catalog_petitions_status_guard ON __SCHEMA__.catalog_petitions;
DROP FUNCTION IF EXISTS __SCHEMA__.catalog_petitions_status_guard();
DROP TABLE IF EXISTS __SCHEMA__.petition_votes;
DROP TABLE IF EXISTS __SCHEMA__.catalog_petitions;
COMMIT;
