DROP TABLE IF EXISTS __SCHEMA__.oauth_account_links;
DROP TABLE IF EXISTS __SCHEMA__.owner_inbox_items;
DROP TABLE IF EXISTS __SCHEMA__.account_data_requests;
DROP TABLE IF EXISTS __SCHEMA__.recovery_cases;
DROP TABLE IF EXISTS __SCHEMA__.terms_consents;
DROP TABLE IF EXISTS __SCHEMA__.mfa_challenges;
DROP TABLE IF EXISTS __SCHEMA__.mfa_factors;
DROP TABLE IF EXISTS __SCHEMA__.used_refresh_tokens;
DROP TABLE IF EXISTS __SCHEMA__.auth_sessions;
DROP TABLE IF EXISTS __SCHEMA__.owner_device_challenges;
DROP TABLE IF EXISTS __SCHEMA__.owner_devices;
DROP TABLE IF EXISTS __SCHEMA__.account_appeals;
DROP TABLE IF EXISTS __SCHEMA__.guardian_submissions;
DROP TABLE IF EXISTS __SCHEMA__.contact_verifications;
DROP TABLE IF EXISTS __SCHEMA__.account_credentials;

DROP INDEX IF EXISTS __SCHEMA__.principals_approval_cursor_idx;
DROP INDEX IF EXISTS __SCHEMA__.principals_phone_active_idx;
DROP INDEX IF EXISTS __SCHEMA__.principals_username_active_idx;
ALTER TABLE __SCHEMA__.principals DROP CONSTRAINT IF EXISTS principals_trial_window_check;
ALTER TABLE __SCHEMA__.principals DROP CONSTRAINT principals_entitlement_status_check;
ALTER TABLE __SCHEMA__.principals
  ADD CONSTRAINT principals_entitlement_status_check
  CHECK (entitlement_status IN ('NONE', 'TRIAL', 'PAID'));
ALTER TABLE __SCHEMA__.principals
  DROP COLUMN deletion_scheduled_at,
  DROP COLUMN terms_version_seen,
  DROP COLUMN trial_expires_at,
  DROP COLUMN trial_started_at,
  DROP COLUMN approval_decided_at,
  DROP COLUMN contact_verified_at,
  DROP COLUMN avatar_object_id,
  DROP COLUMN profile_description,
  DROP COLUMN education_status,
  DROP COLUMN city,
  DROP COLUMN birth_date,
  DROP COLUMN gender,
  DROP COLUMN full_name,
  DROP COLUMN phone,
  DROP COLUMN username;
