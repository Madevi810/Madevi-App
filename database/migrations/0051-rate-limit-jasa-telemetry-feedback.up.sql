-- 0051: tambah aksi rate limit untuk order jasa, telemetry, dan feedback publik.
-- Temuan audit keamanan 2026-10-15 (P1): route pembuatan order jasa, telemetry,
-- dan feedback publik tidak punya rate limit sehingga rentan spam/DB bloat.
BEGIN;
ALTER TABLE __SCHEMA__.rate_limits_by_action
  DROP CONSTRAINT rate_limits_by_action_action_check;
ALTER TABLE __SCHEMA__.rate_limits_by_action
  ADD CONSTRAINT rate_limits_by_action_action_check CHECK (action IN (
    'general',
    'login',
    'login_account',
    'login_admin',
    'register',
    'recovery',
    'ai_conversation',
    'verify_contact',
    'upload',
    'tools_execute',
    'message_request',
    'payment_create',
    'jasa_order',
    'telemetry',
    'public_feedback'
  ));
COMMIT;
