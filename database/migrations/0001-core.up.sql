CREATE SCHEMA IF NOT EXISTS __SCHEMA__;

CREATE TABLE __SCHEMA__.principals (
  id uuid PRIMARY KEY,
  business_code text NOT NULL UNIQUE CHECK (business_code ~ '^[A-Z0-9_-]{3,64}$'),
  kind text NOT NULL CHECK (kind IN ('OWNER', 'MEMBER', 'SERVICE')),
  role text NOT NULL CHECK (role IN ('OWNER', 'MEMBER', 'SERVICE')),
  approval_status text NOT NULL CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
  entitlement_status text NOT NULL CHECK (entitlement_status IN ('NONE', 'TRIAL', 'PAID')),
  social_status text NOT NULL CHECK (social_status IN ('ENABLED', 'RESTRICTED', 'DISABLED')),
  display_name text NOT NULL CHECK (length(display_name) BETWEEN 1 AND 120),
  email text,
  is_test boolean NOT NULL DEFAULT false,
  lifecycle_status text NOT NULL DEFAULT 'ACTIVE' CHECK (lifecycle_status IN ('ACTIVE', 'SUSPENDED', 'DELETED')),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by uuid REFERENCES __SCHEMA__.principals(id),
  updated_by uuid REFERENCES __SCHEMA__.principals(id),
  deleted_at timestamptz,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  CHECK ((lifecycle_status = 'DELETED') = (deleted_at IS NOT NULL))
);

CREATE UNIQUE INDEX principals_email_active_idx
  ON __SCHEMA__.principals (lower(email))
  WHERE email IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX principals_status_created_idx
  ON __SCHEMA__.principals (lifecycle_status, created_at DESC, id DESC);

CREATE SEQUENCE __SCHEMA__.api_record_code_seq START WITH 1;

CREATE TABLE __SCHEMA__.api_records (
  id uuid PRIMARY KEY,
  business_code text NOT NULL UNIQUE DEFAULT
    ('TEST-REC-' || lpad(nextval('__SCHEMA__.api_record_code_seq')::text, 6, '0'))
    CHECK (business_code ~ '^TEST-REC-[0-9]{6}$'),
  owner_principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  label text NOT NULL CHECK (length(label) BETWEEN 1 AND 160),
  visibility text NOT NULL CHECK (visibility IN ('OWNER_ONLY', 'OWNER_ADMIN')),
  is_test boolean NOT NULL DEFAULT true CHECK (is_test),
  lifecycle_status text NOT NULL DEFAULT 'ACTIVE' CHECK (lifecycle_status IN ('ACTIVE', 'ARCHIVED', 'DELETED')),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  updated_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  deleted_at timestamptz,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  CHECK ((lifecycle_status = 'DELETED') = (deleted_at IS NOT NULL))
);
CREATE INDEX api_records_owner_cursor_idx
  ON __SCHEMA__.api_records (owner_principal_id, created_at DESC, id DESC)
  WHERE deleted_at IS NULL;

CREATE TABLE __SCHEMA__.fixture_articles (
  id uuid PRIMARY KEY,
  business_code text NOT NULL UNIQUE,
  title text NOT NULL,
  body text NOT NULL DEFAULT '' CHECK (body = ''),
  status text NOT NULL DEFAULT 'TEST_EMPTY' CHECK (status = 'TEST_EMPTY'),
  is_test boolean NOT NULL DEFAULT true CHECK (is_test),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  version bigint NOT NULL DEFAULT 1
);

CREATE TABLE __SCHEMA__.fixture_products (
  id uuid PRIMARY KEY,
  business_code text NOT NULL UNIQUE,
  name text NOT NULL,
  price_minor bigint NOT NULL CHECK (price_minor >= 0),
  currency char(3) NOT NULL DEFAULT 'IDR',
  status text NOT NULL DEFAULT 'TEST_ONLY' CHECK (status = 'TEST_ONLY'),
  is_test boolean NOT NULL DEFAULT true CHECK (is_test),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  version bigint NOT NULL DEFAULT 1
);

CREATE TABLE __SCHEMA__.fixture_activities (
  id uuid PRIMARY KEY,
  business_code text NOT NULL UNIQUE,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  activity_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_test boolean NOT NULL DEFAULT true CHECK (is_test),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE __SCHEMA__.idempotency_records (
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  operation text NOT NULL,
  idempotency_key text NOT NULL,
  payload_hash char(64) NOT NULL,
  response_status integer,
  response_body jsonb,
  state text NOT NULL DEFAULT 'STARTED' CHECK (state IN ('STARTED', 'COMPLETED')),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at timestamptz NOT NULL,
  PRIMARY KEY (principal_id, operation, idempotency_key)
);
CREATE INDEX idempotency_expiry_idx ON __SCHEMA__.idempotency_records (expires_at);

CREATE TABLE __SCHEMA__.api_rate_limits (
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  bucket text NOT NULL,
  window_started_at timestamptz NOT NULL,
  request_count integer NOT NULL CHECK (request_count >= 0),
  PRIMARY KEY (principal_id, bucket)
);
