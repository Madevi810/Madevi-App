-- Migrasi 0006: Artikel, Sumber, Kuis Data, Usulan, Koreksi, Halaman Situs
-- Prompt 06 — Madevi Offline
-- Tidak ada artikel produksi; semua data adalah fixture/contoh.

-- ============================================================
-- ARTIKEL
-- ============================================================

CREATE TABLE __SCHEMA__.articles (
  id uuid PRIMARY KEY,
  business_code text NOT NULL UNIQUE
    CHECK (business_code ~ '^[A-Z0-9_-]{3,80}$'),

  -- Penempatan taksonomi: node_id stabil lintas revisi (tanpa FK karena
  -- taxonomy_nodes berkunci komposit (revision_id, node_id); validasi di lapisan aplikasi)
  taxonomy_node_id uuid,

  -- Metadata
  title text NOT NULL CHECK (length(title) BETWEEN 3 AND 200),
  slug text NOT NULL CHECK (slug ~ '^[a-z0-9-]{3,200}$'),
  summary text NOT NULL DEFAULT '' CHECK (length(summary) <= 500),
  language text NOT NULL DEFAULT 'id' CHECK (language IN ('id', 'en')),
  reading_minutes smallint NOT NULL DEFAULT 5 CHECK (reading_minutes BETWEEN 1 AND 300),

  -- Creator (nama ditampilkan di halaman)
  creator_name text CHECK (length(creator_name) <= 120),
  creator_principal_id uuid REFERENCES __SCHEMA__.principals(id),

  -- Akses
  access_level text NOT NULL DEFAULT 'MEMBER'
    CHECK (access_level IN ('PUBLIC', 'MEMBER')),
  is_indexed boolean NOT NULL DEFAULT true,

  -- Lifecycle: DRAFT→AUTO_CHECK→AWAITING_OWNER→NEEDS_REVISION→APPROVED→SCHEDULED→PUBLISHED→ARCHIVED→TRASH
  status text NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN (
      'DRAFT','AUTO_CHECK','AWAITING_OWNER','NEEDS_REVISION',
      'APPROVED','SCHEDULED','PUBLISHED','ARCHIVED','TRASH'
    )),
  published_at timestamptz,
  scheduled_at timestamptz,
  archived_at timestamptz,
  trash_at timestamptz,
  -- Batas retensi K-24 (30 hari) dihitung service saat trash (trash_at + 30 hari).
  -- Kolom biasa (bukan GENERATED): timestamptz + interval tidak immutable sehingga
  -- ditolak PostgreSQL sebagai generated column.
  purge_after timestamptz,

  -- Catatan Admin
  owner_notes text NOT NULL DEFAULT '',

  -- Atribusi
  attribution_type text NOT NULL DEFAULT 'DEVELOPED_BY'
    CHECK (attribution_type IN ('DEVELOPED_BY', 'COMPILED_FROM', 'COLLABORATED')),

  -- Versi dan audit
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  is_test boolean NOT NULL DEFAULT false,
  created_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  updated_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Constraint konsistensi lifecycle
  CHECK (
    (status = 'PUBLISHED') = (published_at IS NOT NULL)
  ),
  CHECK (
    (status IN ('TRASH')) = (trash_at IS NOT NULL)
  ),
  CHECK (
    status != 'SCHEDULED' OR scheduled_at IS NOT NULL
  )
);

CREATE INDEX articles_taxonomy_idx
  ON __SCHEMA__.articles (taxonomy_node_id)
  WHERE taxonomy_node_id IS NOT NULL AND status != 'TRASH';

CREATE INDEX articles_status_cursor_idx
  ON __SCHEMA__.articles (status, published_at DESC NULLS LAST, id DESC);

CREATE UNIQUE INDEX articles_slug_published_idx
  ON __SCHEMA__.articles (slug)
  WHERE status = 'PUBLISHED';

-- ============================================================
-- BLOK KONTEN ARTIKEL (body aman, terurut)
-- ============================================================

CREATE TABLE __SCHEMA__.article_blocks (
  id uuid PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES __SCHEMA__.articles(id) ON DELETE CASCADE,
  -- Blok aman: heading/paragraph/list/image/table/formula/code/quote/note/warning/example/step/video/link
  block_type text NOT NULL CHECK (block_type IN (
    'HEADING','PARAGRAPH','LIST','IMAGE','TABLE','FORMULA',
    'CODE','QUOTE','NOTE','WARNING','EXAMPLE','STEP','VIDEO','LINK'
  )),
  position integer NOT NULL CHECK (position >= 0),
  -- Konten tersanitasi di server sebelum disimpan; tidak ada HTML aktif
  content jsonb NOT NULL DEFAULT '{}',
  -- Untuk IMAGE/VIDEO: referensi ke storage object (karantina sampai scanner selesai)
  storage_object_id uuid REFERENCES __SCHEMA__.storage_objects(id),
  -- Caption aman untuk media
  caption text CHECK (length(caption) <= 300),
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (article_id, position)
);

CREATE INDEX article_blocks_article_pos_idx
  ON __SCHEMA__.article_blocks (article_id, position);

-- ============================================================
-- DRAF REVISI ARTIKEL
-- Edit artikel terbit membuat draf revisi; artikel aktif stabil sampai Admin menyetujui.
-- ============================================================

CREATE TABLE __SCHEMA__.article_revisions (
  id uuid PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES __SCHEMA__.articles(id) ON DELETE CASCADE,
  -- Snapshot metadata saat draf dibuat
  title_draft text NOT NULL,
  summary_draft text NOT NULL DEFAULT '',
  owner_notes_draft text NOT NULL DEFAULT '',
  -- Status draf revisi
  status text NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN ('DRAFT','AWAITING_OWNER','APPROVED','REJECTED','SUPERSEDED')),
  revision_notes text NOT NULL DEFAULT '',
  created_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX article_revisions_article_idx
  ON __SCHEMA__.article_revisions (article_id, created_at DESC);

-- ============================================================
-- SUMBER DAN ATRIBUSI
-- ============================================================

CREATE TABLE __SCHEMA__.article_sources (
  id uuid PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES __SCHEMA__.articles(id) ON DELETE CASCADE,
  position integer NOT NULL CHECK (position >= 0),

  -- Metadata sumber wajib
  title text NOT NULL CHECK (length(title) BETWEEN 2 AND 300),
  author_or_org text NOT NULL CHECK (length(author_or_org) BETWEEN 1 AND 300),
  publisher text NOT NULL DEFAULT '' CHECK (length(publisher) <= 200),
  publication_date date,
  accessed_date date,

  -- Identifikasi sumber
  url text CHECK (url ~ '^https?://'),
  isbn text CHECK (isbn ~ '^(97[89]-?)?[0-9-]{9,17}$' OR isbn IS NULL),
  doi text,
  document_number text,

  -- Bagian klaim dan lisensi
  section_reference text NOT NULL DEFAULT '',
  media_license text NOT NULL DEFAULT '',

  -- Tipe sumber
  source_type text NOT NULL DEFAULT 'WEBSITE'
    CHECK (source_type IN (
      'INSTITUTION','STANDARD','JOURNAL','BOOK','UNIVERSITY',
      'OFFICIAL_DOC','WEBSITE','OTHER'
    )),

  -- Status link
  link_status text NOT NULL DEFAULT 'ACTIVE'
    CHECK (link_status IN ('ACTIVE','DEAD','PAYWALLED','PENDING_REVIEW')),

  is_primary boolean NOT NULL DEFAULT false,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (article_id, position)
);

CREATE INDEX article_sources_article_idx
  ON __SCHEMA__.article_sources (article_id, position);

-- ============================================================
-- BANK SOAL (KUIS DATA) — mesin ujian aktif di Prompt 07
-- ============================================================

CREATE TABLE __SCHEMA__.question_banks (
  id uuid PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES __SCHEMA__.articles(id) ON DELETE CASCADE,
  language text NOT NULL DEFAULT 'id' CHECK (language IN ('id', 'en')),
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  -- Status validasi bank soal
  status text NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN ('DRAFT','VALIDATED','SUPERSEDED')),
  validated_at timestamptz,
  is_test boolean NOT NULL DEFAULT false,
  created_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (article_id, language, version)
);

-- Soal pilihan ganda (20 per bank)
CREATE TABLE __SCHEMA__.questions_mc (
  id uuid PRIMARY KEY,
  bank_id uuid NOT NULL REFERENCES __SCHEMA__.question_banks(id) ON DELETE CASCADE,
  position smallint NOT NULL CHECK (position BETWEEN 1 AND 20),
  stem text NOT NULL CHECK (length(stem) BETWEEN 10 AND 1000),
  -- Pilihan A-D dalam jsonb: [{key:"A",text:"..."}, ...]
  options jsonb NOT NULL,
  correct_key text NOT NULL CHECK (correct_key IN ('A','B','C','D')),
  explanation text NOT NULL DEFAULT '',
  is_test boolean NOT NULL DEFAULT false,
  UNIQUE (bank_id, position)
);

-- Soal esai (5 per bank)
CREATE TABLE __SCHEMA__.questions_essay (
  id uuid PRIMARY KEY,
  bank_id uuid NOT NULL REFERENCES __SCHEMA__.question_banks(id) ON DELETE CASCADE,
  position smallint NOT NULL CHECK (position BETWEEN 1 AND 5),
  stem text NOT NULL CHECK (length(stem) BETWEEN 10 AND 2000),
  rubric text NOT NULL DEFAULT '' CHECK (length(rubric) <= 2000),
  max_score smallint NOT NULL DEFAULT 8 CHECK (max_score BETWEEN 1 AND 8),
  is_test boolean NOT NULL DEFAULT false,
  UNIQUE (bank_id, position)
);

-- ============================================================
-- USULAN TOPIK DARI PENGGUNA LOGIN
-- ============================================================

CREATE TABLE __SCHEMA__.article_suggestions (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  topic text NOT NULL CHECK (length(topic) BETWEEN 5 AND 200),
  reason text NOT NULL CHECK (length(reason) BETWEEN 10 AND 1000),
  sources_note text NOT NULL DEFAULT '' CHECK (length(sources_note) <= 500),
  status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING','UNDER_REVIEW','ACCEPTED','REJECTED')),
  owner_decision_note text NOT NULL DEFAULT '',
  support_count integer NOT NULL DEFAULT 0 CHECK (support_count >= 0),
  idempotency_key text NOT NULL UNIQUE,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX article_suggestions_status_idx
  ON __SCHEMA__.article_suggestions (status, created_at DESC);

-- Dukungan pengguna untuk usulan
CREATE TABLE __SCHEMA__.suggestion_supports (
  suggestion_id uuid NOT NULL REFERENCES __SCHEMA__.article_suggestions(id) ON DELETE CASCADE,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (suggestion_id, principal_id)
);

-- ============================================================
-- KOREKSI ARTIKEL DARI PENGGUNA LOGIN
-- ============================================================

CREATE TABLE __SCHEMA__.article_corrections (
  id uuid PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES __SCHEMA__.articles(id) ON DELETE CASCADE,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  -- Lokasi masalah di artikel
  location_hint text NOT NULL CHECK (length(location_hint) BETWEEN 3 AND 300),
  issue_type text NOT NULL
    CHECK (issue_type IN ('FACTUAL','TYPO','OUTDATED','BROKEN_LINK','OTHER')),
  description text NOT NULL CHECK (length(description) BETWEEN 10 AND 2000),
  suggestion text NOT NULL DEFAULT '' CHECK (length(suggestion) <= 2000),
  source_reference text NOT NULL DEFAULT '' CHECK (length(source_reference) <= 500),
  status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING','UNDER_REVIEW','ACCEPTED','REJECTED')),
  owner_decision_note text NOT NULL DEFAULT '',
  idempotency_key text NOT NULL UNIQUE,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX article_corrections_article_status_idx
  ON __SCHEMA__.article_corrections (article_id, status, created_at DESC);

-- ============================================================
-- ARTIKEL TERKAIT (relasi antar artikel)
-- ============================================================

CREATE TABLE __SCHEMA__.article_relations (
  article_id uuid NOT NULL REFERENCES __SCHEMA__.articles(id) ON DELETE CASCADE,
  related_article_id uuid NOT NULL REFERENCES __SCHEMA__.articles(id) ON DELETE CASCADE,
  relation_type text NOT NULL DEFAULT 'RELATED'
    CHECK (relation_type IN ('RELATED','PREREQUISITE','SEQUEL')),
  position smallint NOT NULL DEFAULT 0,
  PRIMARY KEY (article_id, related_article_id),
  CHECK (article_id != related_article_id)
);

-- ============================================================
-- HALAMAN SITUS (Tentang, FAQ, Ketentuan, Privasi, Review)
-- Editor terpisah dari artikel pendidikan; tidak memerlukan kuis.
-- ============================================================

CREATE TABLE __SCHEMA__.site_pages (
  id uuid PRIMARY KEY,
  page_key text NOT NULL UNIQUE
    CHECK (page_key IN ('ABOUT','FAQ','TERMS','PRIVACY','REVIEW')),
  title text NOT NULL CHECK (length(title) BETWEEN 2 AND 200),
  language text NOT NULL DEFAULT 'id' CHECK (language IN ('id', 'en')),
  status text NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN ('DRAFT','PUBLISHED')),
  published_at timestamptz,
  is_test boolean NOT NULL DEFAULT false,
  created_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  updated_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK ((status = 'PUBLISHED') = (published_at IS NOT NULL))
);

CREATE TABLE __SCHEMA__.site_page_blocks (
  id uuid PRIMARY KEY,
  page_id uuid NOT NULL REFERENCES __SCHEMA__.site_pages(id) ON DELETE CASCADE,
  block_type text NOT NULL CHECK (block_type IN (
    'HEADING','PARAGRAPH','LIST','NOTE','WARNING','TABLE','LINK'
  )),
  position integer NOT NULL CHECK (position >= 0),
  content jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (page_id, position)
);

-- ============================================================
-- AUTO CHECK LOG (hasil pemeriksaan otomatis sebelum ke Admin)
-- ============================================================

CREATE TABLE __SCHEMA__.article_auto_checks (
  id uuid PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES __SCHEMA__.articles(id) ON DELETE CASCADE,
  checked_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  passed boolean NOT NULL,
  issues jsonb NOT NULL DEFAULT '[]',
  -- Pemeriksaan: minimal 1 sumber, minimal 1 blok, bank soal valid, tidak ada link mati
  check_source_ok boolean NOT NULL DEFAULT false,
  check_blocks_ok boolean NOT NULL DEFAULT false,
  check_quiz_ok boolean NOT NULL DEFAULT false,
  check_links_ok boolean NOT NULL DEFAULT false
);

CREATE INDEX article_auto_checks_article_idx
  ON __SCHEMA__.article_auto_checks (article_id, checked_at DESC);
