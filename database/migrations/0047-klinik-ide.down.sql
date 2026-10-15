-- 0047 (DOWN): rollback Klinik Ide.
BEGIN;
DROP TRIGGER IF EXISTS clinic_session_phase_guard ON __SCHEMA__.clinic_sessions;
DROP FUNCTION IF EXISTS __SCHEMA__.clinic_session_phase_guard();
DROP TABLE IF EXISTS __SCHEMA__.clinic_votes;
DROP TABLE IF EXISTS __SCHEMA__.clinic_feedback;
DROP TABLE IF EXISTS __SCHEMA__.clinic_sessions;
COMMIT;
