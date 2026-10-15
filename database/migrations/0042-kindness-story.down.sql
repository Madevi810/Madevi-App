-- 0042 (DOWN): rollback Peta Kebaikan + Dongeng Bareng.
BEGIN;
DROP TRIGGER IF EXISTS kindness_report_status_guard ON __SCHEMA__.kindness_report;
DROP FUNCTION IF EXISTS __SCHEMA__.kindness_report_status_guard();
DROP TABLE IF EXISTS __SCHEMA__.story_votes;
DROP TABLE IF EXISTS __SCHEMA__.story_chapters;
DROP TABLE IF EXISTS __SCHEMA__.story_threads;
DROP TABLE IF EXISTS __SCHEMA__.kindness_report;
COMMIT;
