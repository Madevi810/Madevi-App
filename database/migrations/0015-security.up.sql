-- Migrasi 0015: Security Hardening & Final QC
-- Prompt 15 — Madevi Offline

-- ==========================================
-- RATE LIMITS & ABUSE PREVENTION
-- ==========================================
CREATE TABLE __SCHEMA__.rate_limits (
  ip_address text PRIMARY KEY,
  request_count int NOT NULL DEFAULT 0,
  blocked_until timestamptz,
  last_request_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- SECURITY THREAT LOGS
-- ==========================================
CREATE TABLE __SCHEMA__.security_threat_logs (
  id uuid PRIMARY KEY,
  threat_type text NOT NULL CHECK (threat_type IN ('CSRF_ATTEMPT', 'SQLI_ATTEMPT', 'XSS_ATTEMPT', 'SSRF_ATTEMPT', 'PATH_TRAVERSAL', 'UNKNOWN')),
  ip_address text,
  principal_id uuid REFERENCES __SCHEMA__.principals(id),
  request_path text NOT NULL,
  request_payload text, -- Redacted
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX security_threat_logs_type_idx ON __SCHEMA__.security_threat_logs (threat_type, created_at DESC);

-- ==========================================
-- QUARANTINED FILES
-- ==========================================
CREATE TABLE __SCHEMA__.quarantined_files (
  id uuid PRIMARY KEY,
  original_file_id uuid NOT NULL,
  reason text NOT NULL,
  quarantined_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_by uuid REFERENCES __SCHEMA__.principals(id),
  review_status text NOT NULL DEFAULT 'PENDING' CHECK (review_status IN ('PENDING', 'RELEASED', 'DELETED')),
  reviewed_at timestamptz
);

