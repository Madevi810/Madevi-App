CREATE TABLE __SCHEMA__.quota_accounts (
  principal_id uuid PRIMARY KEY REFERENCES __SCHEMA__.principals(id),
  limit_bytes bigint NOT NULL DEFAULT 500000000 CHECK (limit_bytes >= 0),
  used_bytes bigint NOT NULL DEFAULT 0 CHECK (used_bytes >= 0),
  reserved_bytes bigint NOT NULL DEFAULT 0 CHECK (reserved_bytes >= 0),
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  CHECK (used_bytes + reserved_bytes <= limit_bytes)
);

CREATE TABLE __SCHEMA__.quota_reservations (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  bytes bigint NOT NULL CHECK (bytes > 0),
  status text NOT NULL CHECK (status IN ('ACTIVE', 'COMMITTED', 'RELEASED', 'EXPIRED')),
  idempotency_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at timestamptz NOT NULL,
  completed_at timestamptz,
  UNIQUE (principal_id, idempotency_key)
);
CREATE INDEX quota_reservations_active_idx
  ON __SCHEMA__.quota_reservations (principal_id, expires_at)
  WHERE status = 'ACTIVE';

CREATE TABLE __SCHEMA__.storage_objects (
  id uuid PRIMARY KEY,
  owner_principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  reservation_id uuid NOT NULL UNIQUE REFERENCES __SCHEMA__.quota_reservations(id),
  storage_state text NOT NULL DEFAULT 'QUARANTINE' CHECK (storage_state IN ('QUARANTINE', 'ACTIVE', 'REJECTED', 'DELETED')),
  assessment_status text NOT NULL DEFAULT 'UNASSESSED' CHECK (assessment_status IN ('UNASSESSED', 'SAFE', 'UNSAFE')),
  relative_path text NOT NULL UNIQUE CHECK (relative_path ~ '^(quarantine|objects)/[0-9a-f-]{36}\\.bin$'),
  media_type text NOT NULL,
  size_bytes bigint NOT NULL CHECK (size_bytes > 0),
  sha256 char(64) NOT NULL,
  original_name text NOT NULL,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamptz,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  CHECK ((storage_state = 'DELETED') = (deleted_at IS NOT NULL))
);
CREATE INDEX storage_owner_cursor_idx
  ON __SCHEMA__.storage_objects (owner_principal_id, created_at DESC, id DESC)
  WHERE deleted_at IS NULL;

CREATE TABLE __SCHEMA__.audit_events (
  id uuid PRIMARY KEY,
  sequence_id bigint GENERATED ALWAYS AS IDENTITY UNIQUE,
  actor_principal_id uuid REFERENCES __SCHEMA__.principals(id),
  event_type text NOT NULL,
  object_type text NOT NULL,
  object_id uuid,
  request_id uuid,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_test boolean NOT NULL DEFAULT false,
  occurred_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX audit_cursor_idx ON __SCHEMA__.audit_events (occurred_at DESC, id DESC);
CREATE INDEX audit_actor_cursor_idx
  ON __SCHEMA__.audit_events (actor_principal_id, occurred_at DESC, id DESC);

CREATE TABLE __SCHEMA__.jobs (
  id uuid PRIMARY KEY,
  job_type text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'LEASED', 'DONE', 'DEAD')),
  available_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  leased_until timestamptz,
  lease_owner text,
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  max_attempts integer NOT NULL DEFAULT 5 CHECK (max_attempts BETWEEN 1 AND 50),
  last_error_code text,
  idempotency_key text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX jobs_claim_idx ON __SCHEMA__.jobs (status, available_at, created_at);

CREATE TABLE __SCHEMA__.notification_outbox (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  notification_type text NOT NULL,
  payload jsonb NOT NULL,
  transport_mode text NOT NULL DEFAULT 'MAILBOX_SIMULATION' CHECK (transport_mode = 'MAILBOX_SIMULATION'),
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'LEASED', 'DELIVERED', 'DEAD')),
  available_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  leased_until timestamptz,
  lease_owner text,
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  max_attempts integer NOT NULL DEFAULT 5 CHECK (max_attempts BETWEEN 1 AND 50),
  last_error_code text,
  idempotency_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  delivered_at timestamptz,
  UNIQUE (principal_id, notification_type, idempotency_key)
);
CREATE INDEX outbox_claim_idx
  ON __SCHEMA__.notification_outbox (status, available_at, created_at);

CREATE TABLE __SCHEMA__.owner_mailbox (
  id uuid PRIMARY KEY,
  outbox_id uuid NOT NULL UNIQUE REFERENCES __SCHEMA__.notification_outbox(id),
  recipient_principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  subject text NOT NULL,
  body_text text NOT NULL,
  simulation_label text NOT NULL DEFAULT 'SIMULASI—TIDAK DIKIRIM' CHECK (simulation_label = 'SIMULASI—TIDAK DIKIRIM'),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at timestamptz
);
CREATE INDEX mailbox_recipient_cursor_idx
  ON __SCHEMA__.owner_mailbox (recipient_principal_id, created_at DESC, id DESC);

CREATE TABLE __SCHEMA__.backup_runs (
  id uuid PRIMARY KEY,
  backup_code text NOT NULL UNIQUE,
  status text NOT NULL CHECK (status IN ('STARTED', 'COMPLETE', 'FAILED', 'RESTORED')),
  manifest_sha256 char(64),
  target_name text,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at timestamptz
);

