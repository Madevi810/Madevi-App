-- Rollback 0050: kembalikan CHECK aksi rate limit ke daftar 0024.
BEGIN;
ALTER TABLE __SCHEMA__.rate_limits_by_action
  DROP CONSTRAINT rate_limits_by_action_action_check;
ALTER TABLE __SCHEMA__.rate_limits_by_action
  ADD CONSTRAINT rate_limits_by_action_action_check CHECK (action IN (
    'general',
    'login',
    'login_admin',
    'register',
    'recovery',
    'ai_conversation',
    'upload',
    'tools_execute',
    'message_request',
    'payment_create'
  ));
COMMIT;
