-- Migrasi 0010: Pencarian global, indeks, kuota, dan riwayat AI.
-- Prompt 10 — Madevi Offline
-- Produk E-Belanja TIDAK masuk indeks global (memiliki search sendiri, Prompt 12).
-- AI memakai adapter SIMULASI berlabel; provider Online ditunda.

-- ============================================================
-- INDEKS PENCARIAN GLOBAL
-- ============================================================

CREATE TABLE __SCHEMA__.search_index_entries (
  id uuid PRIMARY KEY,
  entry_type text NOT NULL CHECK (entry_type IN ('MENU','ARTICLE','PROFILE','SOFTWARE','PAGE')),
  object_id uuid NOT NULL,
  title text NOT NULL CHECK (length(title) BETWEEN 1 AND 220),
  slug text NOT NULL,
  summary text NOT NULL DEFAULT '' CHECK (length(summary) <= 500),
  -- Konten yang boleh diindeks (judul artikel terbit; body terkunci TIDAK masuk).
  searchable_body text NOT NULL DEFAULT '' CHECK (length(searchable_body) <= 100000),
  -- Untuk filter entitlement: akses artikel publik/member (member terkunci hanya judul/snippet).
  access_level text NOT NULL DEFAULT 'PUBLIC' CHECK (access_level IN ('PUBLIC','MEMBER')),
  -- Kunci untuk sinkronisasi rebuild agar idempoten per objek.
  source_key text NOT NULL UNIQUE,
  language text NOT NULL DEFAULT 'id' CHECK (language IN ('id','en')),
  is_indexed boolean NOT NULL DEFAULT true,
  indexed_revision bigint NOT NULL DEFAULT 0 CHECK (indexed_revision >= 0),
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX search_index_type_cursor_idx
  ON __SCHEMA__.search_index_entries (entry_type, updated_at DESC, id DESC)
  WHERE is_indexed;

-- Tabel pekerjaan indeks (outbox-style) untuk publish/edit/archive/delete.
CREATE TABLE __SCHEMA__.search_index_jobs (
  id uuid PRIMARY KEY,
  entry_type text NOT NULL CHECK (entry_type IN ('MENU','ARTICLE','PROFILE','SOFTWARE','PAGE')),
  object_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('UPSERT','DELETE','REBUILD')),
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','LEASED','DONE','DEAD')),
  available_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  leased_until timestamptz,
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  last_error_code text,
  idempotency_key text NOT NULL UNIQUE,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX search_index_jobs_claim_idx
  ON __SCHEMA__.search_index_jobs (status, available_at, created_at);

-- Pemeriksaan konsistensi (laporan rebuild).
CREATE TABLE __SCHEMA__.search_consistency_runs (
  id uuid PRIMARY KEY,
  mode text NOT NULL CHECK (mode IN ('FULL_REBUILD','CONSISTENCY_REPORT')),
  total_entries integer NOT NULL DEFAULT 0 CHECK (total_entries >= 0),
  missing_entries integer NOT NULL DEFAULT 0 CHECK (missing_entries >= 0),
  stale_entries integer NOT NULL DEFAULT 0 CHECK (stale_entries >= 0),
  report jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at timestamptz
);

-- ============================================================
-- KUOTA DAN RIWAYAT AI ASISTEN
-- ============================================================

CREATE TABLE __SCHEMA__.ai_quota_days (
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  day_utc date NOT NULL,
  used_count integer NOT NULL DEFAULT 0 CHECK (used_count >= 0),
  saved_count integer NOT NULL DEFAULT 0 CHECK (saved_count >= 0),
  PRIMARY KEY (principal_id, day_utc)
);

-- Kuota guest: berpatokan sesi+rate-limit, bukan mengklaim satu manusia.
CREATE TABLE __SCHEMA__.ai_guest_usage (
  session_hash text NOT NULL,
  day_utc date NOT NULL,
  used_count integer NOT NULL DEFAULT 0 CHECK (used_count >= 0),
  PRIMARY KEY (session_hash, day_utc)
);

CREATE TABLE __SCHEMA__.ai_conversations (
  id uuid PRIMARY KEY,
  principal_id uuid REFERENCES __SCHEMA__.principals(id) ON DELETE CASCADE,
  -- Guest: non-null; login: null.
  session_hash text,
  title text NOT NULL DEFAULT 'Percakapan' CHECK (length(title) BETWEEN 1 AND 160),
  is_test boolean NOT NULL DEFAULT false,
  retention_until timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (principal_id IS NOT NULL OR session_hash IS NOT NULL)
);
CREATE INDEX ai_conversations_owner_cursor_idx
  ON __SCHEMA__.ai_conversations (principal_id, updated_at DESC, id DESC)
  WHERE principal_id IS NOT NULL;
CREATE INDEX ai_conversations_guest_cursor_idx
  ON __SCHEMA__.ai_conversations (session_hash, updated_at DESC, id DESC)
  WHERE session_hash IS NOT NULL;

CREATE TABLE __SCHEMA__.ai_messages (
  id uuid PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES __SCHEMA__.ai_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('USER','ASSISTANT','SYSTEM')),
  content text NOT NULL CHECK (length(content) BETWEEN 1 AND 12000),
  -- Daftar sumber artikel yang dipakai (id + judul + link), untuk ditampilkan.
  sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  -- Sinyal kualitas saja; tidak dipakai melatih model secara otomatis.
  quality_feedback jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX ai_messages_conversation_idx
  ON __SCHEMA__.ai_messages (conversation_id, created_at ASC, id ASC);

-- Pemetaan error / prompt-injection fixture untuk audit.
CREATE TABLE __SCHEMA__.ai_audit_events (
  id uuid PRIMARY KEY,
  principal_id uuid REFERENCES __SCHEMA__.principals(id),
  event_type text NOT NULL CHECK (event_type IN ('ASK','REJECTED','INJECTION_BLOCKED','QUOTA_EXCEEDED','GATE_BLOCKED','QUALITY_FEEDBACK')),
  reason text NOT NULL DEFAULT '',
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX ai_audit_events_actor_created_idx
  ON __SCHEMA__.ai_audit_events (principal_id, created_at DESC);

-- Adapter AI (mode layanan) — terpisah dari implementasi provider.
CREATE TABLE __SCHEMA__.ai_adapters (
  id uuid PRIMARY KEY,
  adapter_key text NOT NULL UNIQUE,
  mode text NOT NULL CHECK (mode IN ('SIMULASI','ONLINE_DEFERRED')),
  label text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO __SCHEMA__.ai_adapters (id,adapter_key,mode,label,is_active)
VALUES
  ('10000000-0000-4000-8000-000000000001','madevi_mock_ai','SIMULASI','SIMULASI—agen lokal deterministik, BUKAN model penjawab nyata',true);
