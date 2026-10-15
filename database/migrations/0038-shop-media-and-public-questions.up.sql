-- Media produk dan tanya-jawab publik Madevi Shop.
-- Pertanyaan hanya tampil setelah dijawab Owner; identitas pengirim tidak dipublikasikan.

CREATE TABLE IF NOT EXISTS __SCHEMA__.ebelanja_product_media (
  id uuid PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES __SCHEMA__.ebelanja_products(id) ON DELETE CASCADE,
  image_url text NOT NULL CHECK (length(trim(image_url)) BETWEEN 1 AND 2000),
  alt_text text NOT NULL DEFAULT '' CHECK (length(alt_text) <= 240),
  sort_order integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (product_id, image_url),
  UNIQUE (product_id, sort_order)
);

CREATE INDEX IF NOT EXISTS ebelanja_product_media_product_sort_idx
  ON __SCHEMA__.ebelanja_product_media (product_id, sort_order);

-- Produk lama tetap memperoleh satu foto utama tanpa membuat data tampilan palsu.
INSERT INTO __SCHEMA__.ebelanja_product_media (id, product_id, image_url, alt_text, sort_order)
SELECT p.id, p.id, p.image_url, p.title, 0
  FROM __SCHEMA__.ebelanja_products p
 WHERE trim(p.image_url) <> ''
ON CONFLICT (product_id, image_url) DO NOTHING;

CREATE TABLE IF NOT EXISTS __SCHEMA__.ebelanja_product_questions (
  id uuid PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES __SCHEMA__.ebelanja_products(id) ON DELETE CASCADE,
  principal_id uuid REFERENCES __SCHEMA__.principals(id) ON DELETE SET NULL,
  author_label text NOT NULL DEFAULT 'Pengguna Madevi' CHECK (length(author_label) BETWEEN 1 AND 80),
  question_text text NOT NULL CHECK (length(trim(question_text)) BETWEEN 10 AND 1000),
  normalized_text text NOT NULL CHECK (length(normalized_text) BETWEEN 10 AND 1200),
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ANSWERED', 'HIDDEN')),
  answer_text text NOT NULL DEFAULT '' CHECK (length(answer_text) <= 4000),
  answered_by uuid REFERENCES __SCHEMA__.principals(id) ON DELETE SET NULL,
  answered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (product_id, normalized_text),
  CHECK (
    (status = 'ANSWERED' AND length(trim(answer_text)) >= 2 AND answered_at IS NOT NULL)
    OR status IN ('PENDING', 'HIDDEN')
  )
);

CREATE INDEX IF NOT EXISTS ebelanja_product_questions_public_idx
  ON __SCHEMA__.ebelanja_product_questions (product_id, status, answered_at DESC);

CREATE INDEX IF NOT EXISTS ebelanja_product_questions_owner_idx
  ON __SCHEMA__.ebelanja_product_questions (status, created_at DESC);
