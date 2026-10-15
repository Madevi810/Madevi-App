-- 0050: perbaiki CHECK aksi rate limit — sinkron dengan ACTION_RATE_LIMITS (security.ts).
-- Bug P0 (temuan audit 2026-10-15): aksi 'login_account' dan 'verify_contact' dipakai
-- SecurityService.checkActionRateLimit tetapi tidak ada di CHECK constraint (0024),
-- sehingga setiap login / verifikasi OTP melempar CHECK violation -> HTTP 500.
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
    'payment_create'
  ));
COMMIT;
