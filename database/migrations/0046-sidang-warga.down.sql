-- 0046 (DOWN): rollback Sidang Warga.
BEGIN;
DROP TRIGGER IF EXISTS sidang_session_phase_guard ON __SCHEMA__.sidang_sessions;
DROP FUNCTION IF EXISTS __SCHEMA__.sidang_session_phase_guard();
DROP TABLE IF EXISTS __SCHEMA__.sidang_votes;
DROP TABLE IF EXISTS __SCHEMA__.sidang_arguments;
DROP TABLE IF EXISTS __SCHEMA__.sidang_sessions;
COMMIT;
