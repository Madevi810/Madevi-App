-- Runtime content package metadata for F/M/A integration.
-- This file is intentionally not executed by the agent.
CREATE TABLE IF NOT EXISTS __SCHEMA__.runtime_content_packages (
  package_id text PRIMARY KEY CHECK (package_id ~ '^[a-z0-9][a-z0-9-]{2,120}$'),
  package_kind text NOT NULL CHECK (package_kind IN ('FEATURE_TEMPLATE','MENU','ARTICLE')),
  version text NOT NULL CHECK (version ~ '^[0-9]+\.[0-9]+\.[0-9]+$'),
  schema_version text NOT NULL,
  status text NOT NULL CHECK (status IN ('DRAFT','PUBLISHED','ARCHIVED')),
  access_level text NOT NULL CHECK (access_level IN ('PUBLIC','MEMBER','PLUS','PRO','LOVE','ADMIN')),
  source_ref text NOT NULL,
  license_ref text NOT NULL,
  checksum text CHECK (checksum IS NULL OR checksum ~ '^[0-9a-f]{64}$'),
  rollback_reference text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK ((status = 'PUBLISHED') = (published_at IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS runtime_content_packages_status_idx
  ON __SCHEMA__.runtime_content_packages (package_kind, status, updated_at DESC);
