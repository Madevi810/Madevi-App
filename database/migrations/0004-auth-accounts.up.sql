ALTER TABLE __SCHEMA__.principals
  ADD COLUMN username text,
  ADD COLUMN phone text,
  ADD COLUMN full_name text,
  ADD COLUMN gender text CHECK (gender IN ('PEREMPUAN', 'LAKI_LAKI', 'LAINNYA')),
  ADD COLUMN birth_date date,
  ADD COLUMN city text,
  ADD COLUMN education_status text,
  ADD COLUMN profile_description text NOT NULL DEFAULT '',
  ADD COLUMN avatar_object_id uuid REFERENCES __SCHEMA__.storage_objects(id),
  ADD COLUMN contact_verified_at timestamptz,
  ADD COLUMN approval_decided_at timestamptz,
  ADD COLUMN trial_started_at timestamptz,
  ADD COLUMN trial_expires_at timestamptz,
  ADD COLUMN terms_version_seen text,
  ADD COLUMN deletion_scheduled_at timestamptz;

CREATE UNIQUE INDEX principals_username_active_idx
  ON __SCHEMA__.principals (lower(username))
  WHERE username IS NOT NULL AND deleted_at IS NULL;
CREATE UNIQUE INDEX principals_phone_active_idx
  ON __SCHEMA__.principals (phone)
  WHERE phone IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX principals_approval_cursor_idx
  ON __SCHEMA__.principals (approval_status, created_at DESC, id DESC)
  WHERE deleted_at IS NULL;

ALTER TABLE __SCHEMA__.principals DROP CONSTRAINT principals_entitlement_status_check;
ALTER TABLE __SCHEMA__.principals
  ADD CONSTRAINT principals_entitlement_status_check
  CHECK (entitlement_status IN ('NONE', 'TRIAL', 'PAID', 'EDUCATION'));
ALTER TABLE __SCHEMA__.principals
  ADD CONSTRAINT principals_trial_window_check
  CHECK (
    (trial_started_at IS NULL AND trial_expires_at IS NULL)
    OR (trial_started_at IS NOT NULL AND trial_expires_at = trial_started_at + INTERVAL '30 days')
  );

CREATE TABLE __SCHEMA__.account_credentials (
  principal_id uuid PRIMARY KEY REFERENCES __SCHEMA__.principals(id) ON DELETE CASCADE,
  password_hash text NOT NULL CHECK (password_hash LIKE 'scrypt$%'),
  password_changed_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  failed_attempts integer NOT NULL DEFAULT 0 CHECK (failed_attempts >= 0),
  locked_until timestamptz,
  recovery_code_hash char(64),
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE __SCHEMA__.contact_verifications (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id) ON DELETE CASCADE,
  contact_kind text NOT NULL CHECK (contact_kind IN ('EMAIL', 'PHONE')),
  contact_value text NOT NULL,
  code_hash char(64) NOT NULL,
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts BETWEEN 0 AND 10),
  expires_at timestamptz NOT NULL,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX contact_verifications_pending_idx
  ON __SCHEMA__.contact_verifications (principal_id, expires_at DESC)
  WHERE verified_at IS NULL;

CREATE TABLE __SCHEMA__.guardian_submissions (
  principal_id uuid PRIMARY KEY REFERENCES __SCHEMA__.principals(id) ON DELETE CASCADE,
  guardian_name text,
  relationship text CHECK (relationship IN ('AYAH', 'IBU', 'SAUDARA', 'LAIN_SAH')),
  guardian_birth_date date,
  guardian_city text,
  photo_object_id uuid REFERENCES __SCHEMA__.storage_objects(id),
  no_guardian_reason text,
  review_status text NOT NULL DEFAULT 'PENDING'
    CHECK (review_status IN ('PENDING', 'SIMULATION_ONLY', 'REJECTED')),
  purge_after timestamptz,
  CHECK (
    (no_guardian_reason IS NOT NULL AND guardian_name IS NULL AND photo_object_id IS NULL)
    OR
    (no_guardian_reason IS NULL AND guardian_name IS NOT NULL AND relationship IS NOT NULL
      AND guardian_birth_date IS NOT NULL AND guardian_city IS NOT NULL AND photo_object_id IS NOT NULL)
  )
);

CREATE TABLE __SCHEMA__.account_appeals (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id) ON DELETE CASCADE,
  appeal_kind text NOT NULL CHECK (appeal_kind IN ('REGISTRATION', 'NO_GUARDIAN', 'RECOVERY')),
  reason text NOT NULL CHECK (length(reason) BETWEEN 20 AND 2000),
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  decision_note text,
  decided_by uuid REFERENCES __SCHEMA__.principals(id),
  decided_at timestamptz,
  retry_after timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX account_appeals_status_idx
  ON __SCHEMA__.account_appeals (status, created_at DESC, id DESC);

CREATE TABLE __SCHEMA__.owner_devices (
  id uuid PRIMARY KEY,
  owner_principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id) ON DELETE CASCADE,
  device_label text NOT NULL CHECK (length(device_label) BETWEEN 3 AND 120),
  public_key_pem text NOT NULL CHECK (length(public_key_pem) BETWEEN 80 AND 1000),
  public_key_sha256 char(64) NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'PENDING_EMAIL'
    CHECK (status IN ('PENDING_EMAIL', 'ACTIVE', 'REVOKED')),
  verified_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK ((status = 'REVOKED') = (revoked_at IS NOT NULL))
);

CREATE TABLE __SCHEMA__.owner_device_challenges (
  id uuid PRIMARY KEY,
  device_id uuid NOT NULL REFERENCES __SCHEMA__.owner_devices(id) ON DELETE CASCADE,
  challenge_hash char(64) NOT NULL,
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX owner_device_challenges_pending_idx
  ON __SCHEMA__.owner_device_challenges (device_id, expires_at DESC)
  WHERE consumed_at IS NULL;

CREATE TABLE __SCHEMA__.auth_sessions (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id) ON DELETE CASCADE,
  audience text NOT NULL CHECK (audience IN ('MEMBER', 'OWNER')),
  refresh_token_hash char(64) NOT NULL UNIQUE,
  csrf_token_hash char(64) NOT NULL,
  owner_device_id uuid REFERENCES __SCHEMA__.owner_devices(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_activity_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  refresh_expires_at timestamptz NOT NULL,
  absolute_expires_at timestamptz NOT NULL,
  rotated_at timestamptz,
  revoked_at timestamptz,
  revoked_reason text,
  CHECK ((audience = 'OWNER') = (owner_device_id IS NOT NULL)),
  CHECK (refresh_expires_at <= absolute_expires_at)
);
CREATE INDEX auth_sessions_principal_active_idx
  ON __SCHEMA__.auth_sessions (principal_id, created_at DESC)
  WHERE revoked_at IS NULL;

CREATE TABLE __SCHEMA__.used_refresh_tokens (
  token_hash char(64) PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES __SCHEMA__.auth_sessions(id) ON DELETE CASCADE,
  used_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE __SCHEMA__.mfa_factors (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id) ON DELETE CASCADE,
  factor_kind text NOT NULL CHECK (factor_kind IN ('EMAIL', 'SMS_DEFERRED', 'WHATSAPP_DEFERRED')),
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'DISABLED')),
  destination_hint text NOT NULL,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX mfa_one_active_kind_idx
  ON __SCHEMA__.mfa_factors (principal_id, factor_kind)
  WHERE status = 'ACTIVE';

CREATE TABLE __SCHEMA__.mfa_challenges (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id) ON DELETE CASCADE,
  purpose text NOT NULL CHECK (purpose IN ('LOGIN', 'RECOVERY', 'ENABLE_FACTOR')),
  code_hash char(64) NOT NULL,
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts BETWEEN 0 AND 10),
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE __SCHEMA__.terms_consents (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id) ON DELETE CASCADE,
  terms_version text NOT NULL,
  context text NOT NULL CHECK (context = 'FIRST_LOCKED_ARTICLE'),
  accepted_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (principal_id, context)
);

CREATE TABLE __SCHEMA__.recovery_cases (
  id uuid PRIMARY KEY,
  principal_id uuid REFERENCES __SCHEMA__.principals(id) ON DELETE CASCADE,
  public_reference text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'PROOF_VERIFIED', 'APPROVED', 'REJECTED', 'COMPLETE')),
  proof_kind text CHECK (proof_kind IN ('VERIFIED_CONTACT', 'ACTIVE_DEVICE', 'RECOVERY_CODE')),
  proof_verified_at timestamptz,
  owner_principal_id uuid REFERENCES __SCHEMA__.principals(id),
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE __SCHEMA__.account_data_requests (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id) ON DELETE CASCADE,
  request_kind text NOT NULL CHECK (request_kind IN ('EXPORT', 'DELETE')),
  status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'APPROVED', 'AVAILABLE', 'SCHEDULED', 'COMPLETE', 'REJECTED')),
  download_token_hash char(64),
  download_expires_at timestamptz,
  approved_by uuid REFERENCES __SCHEMA__.principals(id),
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX account_data_requests_status_idx
  ON __SCHEMA__.account_data_requests (request_kind, status, created_at DESC);

CREATE TABLE __SCHEMA__.owner_inbox_items (
  id uuid PRIMARY KEY,
  sender_principal_id uuid REFERENCES __SCHEMA__.principals(id) ON DELETE SET NULL,
  item_kind text NOT NULL CHECK (
    item_kind IN ('REGISTRATION_REVIEW', 'APPEAL', 'RECOVERY', 'REPORT', 'EXPORT', 'DELETE')
  ),
  subject text NOT NULL CHECK (length(subject) BETWEEN 3 AND 180),
  body_text text NOT NULL CHECK (length(body_text) BETWEEN 1 AND 4000),
  status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_REVIEW', 'RESOLVED')),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at timestamptz
);
CREATE INDEX owner_inbox_open_cursor_idx
  ON __SCHEMA__.owner_inbox_items (status, created_at DESC, id DESC);

CREATE TABLE __SCHEMA__.oauth_account_links (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider = 'GOOGLE'),
  provider_subject text NOT NULL,
  provider_email_verified boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'DEFERRED' CHECK (status IN ('DEFERRED', 'ACTIVE', 'REVOKED')),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (provider, provider_subject)
);
