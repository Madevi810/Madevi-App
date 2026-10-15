-- Migrasi 0012: E-Belanja, Pembayaran Simulasi, Akses Seumur Hidup
-- Prompt 12 — Madevi Offline

-- ==========================================
-- E-BELANJA
-- ==========================================

CREATE TABLE __SCHEMA__.ebelanja_partners (
  id uuid PRIMARY KEY,
  domain text NOT NULL UNIQUE,
  name text NOT NULL,
  contract_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE __SCHEMA__.ebelanja_products (
  id uuid PRIMARY KEY,
  partner_id uuid NOT NULL REFERENCES __SCHEMA__.ebelanja_partners(id),
  title text NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  slug text NOT NULL UNIQUE,
  image_url text NOT NULL DEFAULT '',
  original_price numeric(15, 2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'IDR',
  stock_status text NOT NULL DEFAULT 'IN_STOCK' CHECK (stock_status IN ('IN_STOCK', 'OUT_OF_STOCK', 'UNKNOWN')),
  brand text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  subcategory text NOT NULL DEFAULT '',
  condition text NOT NULL DEFAULT 'NEW',
  source_description text NOT NULL DEFAULT '',
  owner_description text NOT NULL DEFAULT '',
  external_url text NOT NULL,
  last_checked_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lifecycle_status text NOT NULL DEFAULT 'DRAFT' CHECK (lifecycle_status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  is_test boolean NOT NULL DEFAULT false,
  views_count bigint NOT NULL DEFAULT 0,
  clicks_count bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ebelanja_products_status_idx ON __SCHEMA__.ebelanja_products (lifecycle_status);
CREATE INDEX ebelanja_products_category_idx ON __SCHEMA__.ebelanja_products (category, subcategory);

CREATE TABLE __SCHEMA__.ebelanja_saved_products (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES __SCHEMA__.ebelanja_products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(principal_id, product_id)
);

-- ==========================================
-- INBOX OWNER
-- ==========================================
CREATE TABLE __SCHEMA__.owner_inbox (
  id uuid PRIMARY KEY,
  sender_principal_id uuid REFERENCES __SCHEMA__.principals(id) ON DELETE SET NULL,
  sender_email text,
  sender_name text,
  category text NOT NULL CHECK (category IN ('TANYA_PRODUK', 'KERJA_SAMA', 'BANDING_KODE', 'UMUM', 'BALASAN')),
  reference_id uuid, -- Bisa product_id, order_id, dsb.
  subject text NOT NULL,
  content text NOT NULL,
  internal_notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'IN_PROGRESS', 'WAITING_SENDER', 'DONE', 'CLOSED')),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- PEMBAYARAN SIMULASI & KODE AKSES
-- ==========================================
CREATE TABLE __SCHEMA__.payment_promos (
  id uuid PRIMARY KEY,
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL CHECK (discount_type IN ('PERCENT', 'NOMINAL')),
  discount_value numeric(15, 2) NOT NULL,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  max_uses bigint NOT NULL DEFAULT 0, -- 0 = unlimited
  current_uses bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE __SCHEMA__.payment_orders (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  base_price numeric(15, 2) NOT NULL,
  promo_id uuid REFERENCES __SCHEMA__.payment_promos(id),
  discount_amount numeric(15, 2) NOT NULL DEFAULT 0,
  final_price numeric(15, 2) NOT NULL,
  status text NOT NULL DEFAULT 'CREATED' CHECK (status IN ('CREATED', 'PENDING', 'PAID', 'FAILED', 'EXPIRED', 'REVIEW', 'FROZEN')),
  provider_event_id text UNIQUE,
  is_simulation boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE __SCHEMA__.payment_codes (
  id uuid PRIMARY KEY,
  code_hash text NOT NULL UNIQUE,
  code_type text NOT NULL CHECK (code_type IN ('AKSES', 'BANTUAN')),
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  order_id uuid REFERENCES __SCHEMA__.payment_orders(id),
  status text NOT NULL DEFAULT 'ISSUED' CHECK (status IN ('ISSUED', 'REDEEMED', 'EXPIRED', 'REVOKED')),
  issued_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at timestamptz NOT NULL,
  redeemed_at timestamptz,
  private_reason text NOT NULL DEFAULT '' -- Untuk BANTUAN
);

CREATE TABLE __SCHEMA__.entitlements (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id) UNIQUE,
  has_lifetime_access boolean NOT NULL DEFAULT false,
  access_granted_at timestamptz,
  trial_started_at timestamptz,
  is_frozen boolean NOT NULL DEFAULT false
);

