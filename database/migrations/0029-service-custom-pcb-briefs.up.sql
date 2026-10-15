-- 0029: Brief relasi Custom & PCB untuk service_orders (L04)
-- Pendekatan B rencana L04: antrean tunggal di service_orders, brief type-safe
-- di tabel relasi. Tidak mengubah migration historis.

BEGIN;

CREATE TABLE IF NOT EXISTS __SCHEMA__.custom_briefs (
  id uuid PRIMARY KEY,
  order_id uuid NOT NULL UNIQUE REFERENCES __SCHEMA__.service_orders(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('UNDANGAN_CUSTOM', 'LOGO_CUSTOM', 'CV_PORTFOLIO', 'LAYOUT_CUSTOM', 'LAINNYA')),
  title text NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  description text NOT NULL CHECK (length(description) BETWEEN 20 AND 8000),
  reference_urls text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS __SCHEMA__.pcb_briefs (
  id uuid PRIMARY KEY,
  order_id uuid NOT NULL UNIQUE REFERENCES __SCHEMA__.service_orders(id) ON DELETE CASCADE,
  width_mm numeric(10, 2) NOT NULL CHECK (width_mm > 0),
  height_mm numeric(10, 2) NOT NULL CHECK (height_mm > 0),
  shape text NOT NULL DEFAULT 'RECTANGULAR' CHECK (shape IN ('RECTANGULAR', 'CIRCULAR', 'CUSTOM')),
  layer_count int NOT NULL CHECK (layer_count IN (1, 2, 4, 6, 8)),
  component_count_est int NULL CHECK (component_count_est IS NULL OR component_count_est >= 0),
  critical_footprints text[] NOT NULL DEFAULT '{}',
  max_volt numeric(12, 3) NOT NULL,
  max_ampere numeric(12, 3) NOT NULL,
  target_fab_house text NOT NULL DEFAULT '',
  safety_flags jsonb NOT NULL DEFAULT '{}'::jsonb,
  manufacturing jsonb NOT NULL DEFAULT '{}'::jsonb,
  input_files jsonb NOT NULL DEFAULT '[]'::jsonb,
  deliverables text[] NOT NULL DEFAULT '{}',
  risk_level text NOT NULL DEFAULT 'LOW' CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'EXTREME')),
  disclaimer_version text NOT NULL DEFAULT '1.0.0',
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS custom_briefs_order_idx ON __SCHEMA__.custom_briefs (order_id);
CREATE INDEX IF NOT EXISTS pcb_briefs_order_idx ON __SCHEMA__.pcb_briefs (order_id);

COMMIT;
