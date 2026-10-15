-- 0026: Generalisasi Service Orders & PCB Brief (M-WEB-FOUNDATION)

BEGIN;

CREATE TABLE IF NOT EXISTS __SCHEMA__.service_catalog_items (
  id uuid PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('LAYOUT', 'CUSTOM_DESIGN', 'PCB_LAYOUT', 'UNDANGAN', 'LOGO')),
  title text NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  slug text NOT NULL UNIQUE,
  summary text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  preview_url text NOT NULL DEFAULT '',
  fixed_price numeric(15, 2) NOT NULL DEFAULT 0 CHECK (fixed_price >= 0),
  is_free boolean NOT NULL DEFAULT false,
  currency text NOT NULL DEFAULT 'IDR',
  license text NOT NULL DEFAULT 'MADEVI_PERSONAL',
  version text NOT NULL DEFAULT '1.0.0',
  status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  deliverable_formats text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS __SCHEMA__.service_orders (
  id uuid PRIMARY KEY,
  secret_token text NOT NULL UNIQUE,
  principal_id uuid REFERENCES __SCHEMA__.principals(id),
  kind text NOT NULL CHECK (kind IN ('LAYOUT', 'CUSTOM_DESIGN', 'PCB_LAYOUT', 'UNDANGAN', 'LOGO')),
  catalog_item_id uuid REFERENCES __SCHEMA__.service_catalog_items(id),
  brief_version integer NOT NULL DEFAULT 1 CHECK (brief_version >= 1),
  brief_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  price_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'PENDING_APPROVAL'
    CHECK (status IN ('PENDING_APPROVAL', 'APPROVED', 'IN_REVISION', 'COMPLETED', 'REJECTED', 'ARCHIVED')),
  revision_count integer NOT NULL DEFAULT 0 CHECK (revision_count >= 0),
  revision_limit integer NOT NULL DEFAULT 2 CHECK (revision_limit BETWEEN 0 AND 10),
  deliverables jsonb NOT NULL DEFAULT '[]'::jsonb,
  timeline jsonb NOT NULL DEFAULT '[]'::jsonb,
  token_expires_at timestamptz NULL,
  token_revoked_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at timestamptz NULL
);

-- Perbarui view antrean satu Admin
CREATE OR REPLACE VIEW __SCHEMA__.jasa_order_queue AS
SELECT
  o.id,
  'UNDANGAN'::TEXT AS kind,
  o.status,
  o.revision_count,
  o.revision_limit,
  o.schema_version,
  o.price_agreed,
  o.created_at,
  o.updated_at,
  o.completed_at,
  CASE
    WHEN o.status = 'IN_REVISION' AND o.updated_at < CURRENT_TIMESTAMP - INTERVAL '3 days' THEN 'HIGH'
    WHEN o.status = 'PENDING_APPROVAL' AND o.created_at < CURRENT_TIMESTAMP - INTERVAL '1 days' THEN 'MEDIUM'
    ELSE 'NORMAL'
  END AS urgency,
  CASE
    WHEN o.status IN ('PENDING_APPROVAL', 'APPROVED') THEN 'ADMIN'
    WHEN o.status = 'IN_REVISION' THEN 'USER'
    ELSE 'NONE'
  END AS waiting_on,
  o.public_slug
FROM __SCHEMA__.invitation_orders o
UNION ALL
SELECT
  o.id,
  'LOGO'::TEXT AS kind,
  o.status,
  o.revision_count,
  o.revision_limit,
  o.schema_version,
  o.price_agreed,
  o.created_at,
  o.updated_at,
  o.completed_at,
  CASE
    WHEN o.status = 'IN_REVISION' AND o.updated_at < CURRENT_TIMESTAMP - INTERVAL '3 days' THEN 'HIGH'
    WHEN o.status = 'PENDING_APPROVAL' AND o.created_at < CURRENT_TIMESTAMP - INTERVAL '1 days' THEN 'MEDIUM'
    ELSE 'NORMAL'
  END AS urgency,
  CASE
    WHEN o.status IN ('PENDING_APPROVAL', 'APPROVED') THEN 'ADMIN'
    WHEN o.status = 'IN_REVISION' THEN 'USER'
    ELSE 'NONE'
  END AS waiting_on,
  NULL::TEXT AS public_slug
FROM __SCHEMA__.logo_orders o
UNION ALL
SELECT
  s.id,
  s.kind::TEXT AS kind,
  s.status,
  s.revision_count,
  s.revision_limit,
  s.brief_version AS schema_version,
  (s.price_snapshot->>'snapshotPrice')::NUMERIC(15,2) AS price_agreed,
  s.created_at,
  s.updated_at,
  s.completed_at,
  CASE
    WHEN s.status = 'IN_REVISION' AND s.updated_at < CURRENT_TIMESTAMP - INTERVAL '3 days' THEN 'HIGH'
    WHEN s.status = 'PENDING_APPROVAL' AND s.created_at < CURRENT_TIMESTAMP - INTERVAL '1 days' THEN 'MEDIUM'
    ELSE 'NORMAL'
  END AS urgency,
  CASE
    WHEN s.status IN ('PENDING_APPROVAL', 'APPROVED') THEN 'ADMIN'
    WHEN s.status = 'IN_REVISION' THEN 'USER'
    ELSE 'NONE'
  END AS waiting_on,
  NULL::TEXT AS public_slug
FROM __SCHEMA__.service_orders s;

COMMIT;
