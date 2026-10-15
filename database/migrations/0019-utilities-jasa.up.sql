-- Migrasi 0019: Alat Bantu (Rumus/PDF/Karier) + Jasa (Undangan Nikah, Logo/Banner)
-- Prompt 06 — Madevi Offline

-- ==========================================
-- UTILITIES: WORKSPACE (simpan privat login-only)
-- ==========================================

CREATE TABLE __SCHEMA__.utilities_workspaces (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('RUMUS', 'PDF', 'CV', 'PORTOFOLIO', 'IMAGE')),
  title text NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  -- Payload hasil (input + output) sebagai JSON. Hasil deterministik dirandom ulang
  -- dari input, bukan disimpan mentah, agar bisa direproduksi.
  input jsonb NOT NULL DEFAULT '{}',
  result jsonb NOT NULL DEFAULT '{}',
  is_private boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX utilities_workspaces_principal_idx ON __SCHEMA__.utilities_workspaces (principal_id, kind);
CREATE INDEX utilities_workspaces_private_idx ON __SCHEMA__.utilities_workspaces (principal_id, is_private);

-- ==========================================
-- JASA: UNDANGAN NIKAH
-- ==========================================

CREATE TABLE __SCHEMA__.invitation_templates (
  id uuid PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
  description text NOT NULL DEFAULT '',
  -- 'ONLINE' interaktif, 'PRINT' fisik, 'BOTH'
  formats text[] NOT NULL DEFAULT '{ONLINE}',
  price_starts_from numeric(15, 2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'IDR',
  cover_image_url text NOT NULL DEFAULT '',
  preview_url text NOT NULL DEFAULT '',
  layout jsonb NOT NULL DEFAULT '{}',
  lifecycle_status text NOT NULL DEFAULT 'DRAFT' CHECK (lifecycle_status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  sort_order int NOT NULL DEFAULT 0,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX invitation_templates_status_idx ON __SCHEMA__.invitation_templates (lifecycle_status, sort_order);

CREATE TABLE __SCHEMA__.invitation_orders (
  id uuid PRIMARY KEY,
  -- Tautan acak rahasia, tidak terindeks (kontrak)
  secret_token text NOT NULL UNIQUE,
  template_id uuid REFERENCES __SCHEMA__.invitation_templates(id) ON DELETE SET NULL,
  principal_id uuid REFERENCES __SCHEMA__.principals(id) ON DELETE SET NULL,
  -- Data pasangan (form private setelah persetujuan)
  groom_name text NOT NULL DEFAULT '',
  bride_name text NOT NULL DEFAULT '',
  event_date timestamptz,
  venue text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  package_format text NOT NULL DEFAULT 'ONLINE' CHECK (package_format IN ('ONLINE', 'PRINT', 'BOTH')),
  -- Slug bersih untuk halaman online final, mis. /undangan/ade-devi-121026
  public_slug text UNIQUE,
  status text NOT NULL DEFAULT 'PENDING_APPROVAL' CHECK (status IN (
    'PENDING_APPROVAL', 'APPROVED', 'IN_REVISION', 'COMPLETED', 'REJECTED', 'ARCHIVED'
  )),
  price_agreed numeric(15, 2),
  revision_count int NOT NULL DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX invitation_orders_status_idx ON __SCHEMA__.invitation_orders (status);
CREATE INDEX invitation_orders_principal_idx ON __SCHEMA__.invitation_orders (principal_id);
CREATE INDEX invitation_orders_secret_idx ON __SCHEMA__.invitation_orders (secret_token);

-- ==========================================
-- JASA: LOGO / BANNER
-- ==========================================

CREATE TABLE __SCHEMA__.logo_orders (
  id uuid PRIMARY KEY,
  secret_token text NOT NULL UNIQUE,
  principal_id uuid REFERENCES __SCHEMA__.principals(id) ON DELETE SET NULL,
  kind text NOT NULL DEFAULT 'LOGO' CHECK (kind IN ('LOGO', 'BANNER')),
  title text NOT NULL DEFAULT '',
  width_px int,
  height_px int,
  primary_color text NOT NULL DEFAULT '',
  style_note text NOT NULL DEFAULT '',
  reference_url text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'PENDING_APPROVAL' CHECK (status IN (
    'PENDING_APPROVAL', 'APPROVED', 'IN_REVISION', 'COMPLETED', 'REJECTED', 'ARCHIVED'
  )),
  price_agreed numeric(15, 2),
  revision_count int NOT NULL DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX logo_orders_status_idx ON __SCHEMA__.logo_orders (status);
CREATE INDEX logo_orders_principal_idx ON __SCHEMA__.logo_orders (principal_id);
