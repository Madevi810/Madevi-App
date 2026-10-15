-- Migrasi 0013: Admin Admin Lengkap
-- Prompt 13 — Madevi Offline

-- ==========================================
-- ADMIN SESSIONS
-- ==========================================
CREATE TABLE __SCHEMA__.admin_sessions (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id) ON DELETE CASCADE,
  device_id uuid NOT NULL, -- references registered device
  token_hash text NOT NULL UNIQUE,
  is_reauth_verified boolean NOT NULL DEFAULT false,
  last_active_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at timestamptz NOT NULL, -- Idle max 1 hr
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX admin_sessions_token_idx ON __SCHEMA__.admin_sessions (token_hash);

-- ==========================================
-- ADMIN AUDIT LOGS (Append-Only)
-- ==========================================
CREATE TABLE __SCHEMA__.admin_audit_logs (
  id uuid PRIMARY KEY,
  principal_id uuid REFERENCES __SCHEMA__.principals(id) ON DELETE SET NULL,
  device_id uuid,
  action text NOT NULL,
  target_resource text NOT NULL,
  target_id uuid,
  reason text NOT NULL DEFAULT '',
  before_state jsonb,
  after_state jsonb,
  result text NOT NULL CHECK (result IN ('SUCCESS', 'FAILURE', 'DENIED')),
  request_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX admin_audit_logs_principal_idx ON __SCHEMA__.admin_audit_logs (principal_id);
CREATE INDEX admin_audit_logs_created_idx ON __SCHEMA__.admin_audit_logs (created_at DESC);

-- ==========================================
-- DASHBOARD ALERTS (Materi yang perlu ditangani)
-- ==========================================
CREATE TABLE __SCHEMA__.admin_alerts (
  id uuid PRIMARY KEY,
  category text NOT NULL CHECK (category IN ('PENDAFTARAN', 'BANDING', 'WALI', 'PEMULIHAN', 'HAPUS', 'LAPORAN', 'ESAI', 'FILE_RISIKO', 'EMAIL_GAGAL', 'BACKUP_GAGAL')),
  severity text NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  reference_id text NOT NULL, -- UUID atau ID string
  message text NOT NULL,
  is_resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at timestamptz
);

