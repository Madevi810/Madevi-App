-- 0032: Hardening operasi Admin, backup manifest, dan konfirmasi batch (L07)
-- Pendekatan B rencana L07. Aditif saja; tidak mengubah migration historis.
-- Menambah operation_runs/items (preview/confirmation/idempotency/result),
-- metadata backup (manifest/scope/checksum/verification/restore inspection),
-- tanpa membuat tabel status backup paralel kedua.

BEGIN;

-- Operation runs: preview → confirmation kuat → execute → hasil per item → audit.
CREATE TABLE IF NOT EXISTS __SCHEMA__.admin_operation_runs (
  id uuid PRIMARY KEY,
  actor_principal_id uuid REFERENCES __SCHEMA__.principals(id) ON DELETE SET NULL,
  action text NOT NULL CHECK (length(action) BETWEEN 3 AND 120),
  filter_hash text NOT NULL CHECK (filter_hash ~ '^[0-9a-f]{16,128}$'),
  filter_version integer NOT NULL DEFAULT 1 CHECK (filter_version >= 1),
  confirmation_token text NOT NULL UNIQUE CHECK (length(confirmation_token) BETWEEN 8 AND 128),
  confirmation_expires_at timestamptz NOT NULL,
  idempotency_key text NOT NULL,
  status text NOT NULL DEFAULT 'PREVIEW' CHECK (status IN ('PREVIEW','CONFIRMED','EXECUTING','COMPLETED','PARTIAL','FAILED','CANCELLED','EXPIRED')),
  item_total integer NOT NULL DEFAULT 0 CHECK (item_total >= 0),
  item_succeeded integer NOT NULL DEFAULT 0 CHECK (item_succeeded >= 0),
  item_failed integer NOT NULL DEFAULT 0 CHECK (item_failed >= 0),
  request_id text,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (actor_principal_id, action, idempotency_key)
);

CREATE TABLE IF NOT EXISTS __SCHEMA__.admin_operation_items (
  id uuid PRIMARY KEY,
  run_id uuid NOT NULL REFERENCES __SCHEMA__.admin_operation_runs(id) ON DELETE CASCADE,
  target_type text NOT NULL,
  target_id text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','SUCCESS','FAILED','SKIPPED')),
  error_message text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS admin_operation_items_run_idx
  ON __SCHEMA__.admin_operation_items (run_id, status);

-- Metadata backup: manifest version, scope/exclusions, checksum/verification,
-- source schema, operation correlation, restore inspection — tanpa tabel status kedua.
ALTER TABLE __SCHEMA__.backup_logs
  ADD COLUMN IF NOT EXISTS manifest_version integer,
  ADD COLUMN IF NOT EXISTS scope_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS exclusions_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS aggregate_checksum text,
  ADD COLUMN IF NOT EXISTS operation_run_id uuid REFERENCES __SCHEMA__.admin_operation_runs(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS restore_inspection_json jsonb,
  ADD COLUMN IF NOT EXISTS restore_inspected_at timestamptz;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'backup_logs_aggregate_checksum_check') THEN
    ALTER TABLE __SCHEMA__.backup_logs
      ADD CONSTRAINT backup_logs_aggregate_checksum_check
      CHECK (aggregate_checksum IS NULL OR aggregate_checksum ~ '^[0-9a-f]{64}$');
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS backup_logs_operation_idx
  ON __SCHEMA__.backup_logs (operation_run_id)
  WHERE operation_run_id IS NOT NULL;

COMMIT;
