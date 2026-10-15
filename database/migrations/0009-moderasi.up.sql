-- Migrasi 0009: engine moderasi lokal, kasus, restriction, strike, dan banding.
-- Tidak menyimpan secret dan tidak mengklaim scanner arsip/software penuh (Prompt 11).

CREATE TABLE __SCHEMA__.moderation_rulesets (
  id uuid PRIMARY KEY,
  engine_name text NOT NULL,
  engine_version text NOT NULL,
  signature_version text NOT NULL,
  language_support text[] NOT NULL DEFAULT ARRAY['id','en']::text[],
  supported_inputs text[] NOT NULL DEFAULT ARRAY['TEXT','URL','FILE_HEADER']::text[],
  resource_limits jsonb NOT NULL,
  limitations text NOT NULL,
  active boolean NOT NULL DEFAULT false,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (engine_name, engine_version, signature_version)
);
CREATE UNIQUE INDEX moderation_rulesets_one_active_idx
  ON __SCHEMA__.moderation_rulesets (active) WHERE active;

INSERT INTO __SCHEMA__.moderation_rulesets
  (id,engine_name,engine_version,signature_version,resource_limits,limitations,active)
VALUES
  ('09000000-0000-4000-8000-000000000001','MADEVI_LOCAL_RULE_ENGINE','1.0.0','2026-09-09',
   '{"textBytes":65536,"fileHeaderBytes":8192,"timeoutMs":250,"archiveEntries":0,"networkFetch":false}',
   'Rules lokal terbatas; tidak menjamin semua bahaya. Arsip/encrypted/unknown dan error selalu UNASSESSED. Scanner file penuh dilanjutkan Prompt 11.',true);

ALTER TABLE __SCHEMA__.social_blocks
  ADD COLUMN source_case_id uuid;

CREATE TABLE __SCHEMA__.moderation_assessments (
  id uuid PRIMARY KEY,
  target_type text NOT NULL CHECK (target_type IN
    ('SOCIAL_POST','SOCIAL_COMMENT','DIRECT_MESSAGE','ARTICLE_SUGGESTION','ARTICLE_CORRECTION','PUBLIC_FEEDBACK','STORAGE_OBJECT')),
  target_id uuid NOT NULL,
  subject_principal_id uuid REFERENCES __SCHEMA__.principals(id),
  input_kind text NOT NULL CHECK (input_kind IN ('TEXT','URL','FILE_HEADER','COMPOSITE')),
  decision text NOT NULL CHECK (decision IN ('SAFE','UNSAFE','UNASSESSED')),
  risk_level text NOT NULL CHECK (risk_level IN ('LOW','MEDIUM','HIGH','UNKNOWN')),
  category text NOT NULL CHECK (category IN
    ('NONE','MALWARE','EXECUTABLE','MIME_MISMATCH','ARCHIVE_UNSUPPORTED','ADULT_SEXUAL','VIOLENCE','CHILD_EXPLOITATION','THREAT','CRIME','GROOMING','SPAM','PHISHING','SCAM','PERSONAL_DATA','DANGEROUS_URL','UNSUPPORTED','ENGINE_ERROR')),
  confidence numeric(5,4) NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  reason text NOT NULL,
  context_sha256 char(64) NOT NULL,
  engine_name text NOT NULL,
  engine_version text NOT NULL,
  signature_version text NOT NULL,
  duration_ms integer NOT NULL CHECK (duration_ms >= 0),
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX moderation_assessments_target_idx
  ON __SCHEMA__.moderation_assessments (target_type,target_id,created_at DESC,id DESC);

CREATE TABLE __SCHEMA__.moderation_cases (
  id uuid PRIMARY KEY,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  subject_principal_id uuid REFERENCES __SCHEMA__.principals(id),
  assessment_id uuid NOT NULL REFERENCES __SCHEMA__.moderation_assessments(id),
  risk_level text NOT NULL CHECK (risk_level IN ('MEDIUM','HIGH','UNKNOWN')),
  category text NOT NULL,
  status text NOT NULL DEFAULT 'OPEN'
    CHECK (status IN ('OPEN','IN_REVIEW','ACTIONED','CLEARED','RESTORED')),
  report_count integer NOT NULL DEFAULT 0 CHECK (report_count >= 0),
  safe_preview jsonb NOT NULL DEFAULT '{}'::jsonb,
  critical_policy_pending boolean NOT NULL DEFAULT false,
  owner_principal_id uuid REFERENCES __SCHEMA__.principals(id),
  owner_reason text,
  decided_at timestamptz,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE __SCHEMA__.social_blocks
  ADD CONSTRAINT social_blocks_source_case_fk
  FOREIGN KEY (source_case_id) REFERENCES __SCHEMA__.moderation_cases(id) ON DELETE CASCADE;
CREATE UNIQUE INDEX moderation_cases_one_active_target_idx
  ON __SCHEMA__.moderation_cases (target_type,target_id)
  WHERE status IN ('OPEN','IN_REVIEW');
CREATE INDEX moderation_cases_queue_idx
  ON __SCHEMA__.moderation_cases (risk_level DESC,report_count DESC,created_at,id)
  WHERE status IN ('OPEN','IN_REVIEW');

CREATE TABLE __SCHEMA__.moderation_case_evidence (
  id uuid PRIMARY KEY,
  case_id uuid NOT NULL REFERENCES __SCHEMA__.moderation_cases(id) ON DELETE CASCADE,
  evidence_type text NOT NULL CHECK (evidence_type IN ('TEXT','URL_METADATA','FILE_METADATA','MESSAGE_REPORT')),
  encrypted_or_redacted_payload jsonb NOT NULL,
  content_sha256 char(64) NOT NULL,
  expires_at timestamptz NOT NULL,
  last_access_reason text,
  last_accessed_by uuid REFERENCES __SCHEMA__.principals(id),
  last_accessed_at timestamptz,
  purged_at timestamptz,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX moderation_case_evidence_expiry_idx
  ON __SCHEMA__.moderation_case_evidence (expires_at) WHERE purged_at IS NULL;

CREATE TABLE __SCHEMA__.social_restrictions (
  principal_id uuid PRIMARY KEY REFERENCES __SCHEMA__.principals(id),
  restriction_type text NOT NULL CHECK (restriction_type IN ('SAFETY_HOLD','MUTE_7D','MUTE_30D','PERMANENT_BLOCK')),
  source_case_id uuid REFERENCES __SCHEMA__.moderation_cases(id),
  starts_at timestamptz NOT NULL,
  expires_at timestamptz,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','EXPIRED','OVERTURNED')),
  reason text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK ((restriction_type='PERMANENT_BLOCK' OR restriction_type='SAFETY_HOLD') OR expires_at IS NOT NULL)
);

CREATE TABLE __SCHEMA__.moderation_strikes (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  case_id uuid NOT NULL UNIQUE REFERENCES __SCHEMA__.moderation_cases(id),
  ordinal_in_window smallint NOT NULL CHECK (ordinal_in_window BETWEEN 1 AND 3),
  sanction text NOT NULL CHECK (sanction IN ('MUTE_7D','MUTE_30D','PERMANENT_BLOCK')),
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','EXPIRED','OVERTURNED')),
  imposed_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  imposed_at timestamptz NOT NULL,
  expires_at timestamptz,
  reason text NOT NULL,
  is_test boolean NOT NULL DEFAULT false,
  CHECK ((sanction='PERMANENT_BLOCK')=(expires_at IS NULL))
);
CREATE INDEX moderation_strikes_window_idx
  ON __SCHEMA__.moderation_strikes (principal_id,imposed_at DESC) WHERE status='ACTIVE';

CREATE TABLE __SCHEMA__.moderation_appeals (
  id uuid PRIMARY KEY,
  case_id uuid NOT NULL REFERENCES __SCHEMA__.moderation_cases(id),
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  reason text NOT NULL CHECK (length(reason) BETWEEN 10 AND 2000),
  idempotency_key text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING','IN_REVIEW','ACCEPTED','MODIFIED','REJECTED')),
  owner_principal_id uuid REFERENCES __SCHEMA__.principals(id),
  owner_reason text,
  decided_at timestamptz,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (principal_id,idempotency_key)
);
CREATE INDEX moderation_appeals_queue_idx
  ON __SCHEMA__.moderation_appeals (status,created_at,id);

ALTER TABLE __SCHEMA__.article_suggestions
  ADD COLUMN moderation_status text NOT NULL DEFAULT 'UNASSESSED'
    CHECK (moderation_status IN ('UNASSESSED','SAFE','UNSAFE')),
  ADD COLUMN moderation_reason text NOT NULL DEFAULT '';
ALTER TABLE __SCHEMA__.article_corrections
  ADD COLUMN moderation_status text NOT NULL DEFAULT 'UNASSESSED'
    CHECK (moderation_status IN ('UNASSESSED','SAFE','UNSAFE')),
  ADD COLUMN moderation_reason text NOT NULL DEFAULT '';
