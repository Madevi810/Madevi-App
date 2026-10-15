-- 0051 down: kembalikan CHECK ke 12 aksi semula.
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
