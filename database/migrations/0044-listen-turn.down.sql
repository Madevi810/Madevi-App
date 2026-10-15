-- 0044 (DOWN): rollback Giliran Dengar.
BEGIN;
DROP TRIGGER IF EXISTS listen_listeners_cap ON __SCHEMA__.listen_session_listeners;
DROP FUNCTION IF EXISTS __SCHEMA__.listen_listeners_cap();
DROP TRIGGER IF EXISTS listen_session_status_guard ON __SCHEMA__.listen_sessions;
DROP FUNCTION IF EXISTS __SCHEMA__.listen_session_status_guard();
DROP TABLE IF EXISTS __SCHEMA__.listen_session_listeners;
DROP TABLE IF EXISTS __SCHEMA__.listen_responses;
DROP TABLE IF EXISTS __SCHEMA__.listen_sessions;
COMMIT;
