-- Migrasi 0014: Email, Backup, Observabilitas, Operasi
-- Prompt 14 — Madevi Offline

-- ==========================================
-- EMAIL OUTBOX
-- ==========================================
CREATE TABLE __SCHEMA__.email_outbox (
  id uuid PRIMARY KEY,
  idempotency_key text UNIQUE,
  recipient_email text NOT NULL,
  template_id text NOT NULL,
  template_data jsonb NOT NULL,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'FAILED', 'BOUNCED')),
  retry_count int NOT NULL DEFAULT 0,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sent_at timestamptz
);

CREATE INDEX email_outbox_status_idx ON __SCHEMA__.email_outbox (status, retry_count);

-- ==========================================
-- BACKUP LOGS
-- ==========================================
CREATE TABLE __SCHEMA__.backup_logs (
  id uuid PRIMARY KEY,
  status text NOT NULL CHECK (status IN ('IN_PROGRESS', 'SUCCESS', 'FAILED')),
  backup_type text NOT NULL CHECK (backup_type IN ('FULL', 'DB_ONLY', 'STORAGE_ONLY')),
  file_path text,
  file_hash text,
  size_bytes bigint,
  error_message text,
  started_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at timestamptz
);

-- ==========================================
-- USER ACTIVITY LOGS (Terperinci, Retensi 1 Tahun)
-- ==========================================
CREATE TABLE __SCHEMA__.user_activity_logs (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id) ON DELETE CASCADE,
  action text NOT NULL,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX user_activity_logs_principal_idx ON __SCHEMA__.user_activity_logs (principal_id, created_at DESC);
CREATE INDEX user_activity_logs_cleanup_idx ON __SCHEMA__.user_activity_logs (created_at);

-- ==========================================
-- DELETION LEDGER (Soft-delete & Purge)
-- ==========================================
CREATE TABLE __SCHEMA__.deletion_ledger (
  id uuid PRIMARY KEY,
  resource_type text NOT NULL,
  resource_id uuid NOT NULL,
  deleted_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  purge_status text NOT NULL DEFAULT 'PENDING' CHECK (purge_status IN ('PENDING', 'PURGED')),
  purged_at timestamptz
);

CREATE INDEX deletion_ledger_purge_idx ON __SCHEMA__.deletion_ledger (purge_status, deleted_at);

