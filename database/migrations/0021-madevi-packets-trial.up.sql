-- ============================================================================
-- Migrasi 0021 — P05: kontrak paket Madevi, trial Tools 5x, transisi role.
-- Dipasang SETELAH 0020-madevi-on-theme. Tidak mengubah 0001–0020.
--
-- Tujuan kontrak (01-KEPUTUSAN-AKTIF-MADEVI, 05-KONTRAK-AKSES):
--   1. Role aplikasi target ADMIN | USER; nilai legacy OWNER/MEMBER dipetakan
--      via kolom role_kind baru (transisi, tanpa menghapus nilai lama).
--   2. Entitlement ledger append-only untuk FREE / PLUS / PRO / LOVE.
--   3. Counter trial Tools global = 5, reservation/commit/release idempotent.
--   4. Harga paket dipindahkan dari UI hard-code ke payment_settings.
--   5. Pendaftaran tidak lagi memerlukan data wali; data legacy
--      guardian_submissions tetap utuh dan hanya tidak lagi menjadi
--      pra-syarat pendaftaran baru.
--   6. Event audit untuk perubahan akses, grant Love, pembayaran, trial, Admin.
--
-- Aturan P05: migration ditulis, TIDAK DIJALANKAN oleh agent. Hanya Admin.
-- Semua perubahan bersifat aditif; kolom/tabel lama tidak dihapus agar rollback
-- aman dan data lama tidak hilang.
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Transisi role: OWNER -> ADMIN, MEMBER -> USER
-- ---------------------------------------------------------------------------
-- role_kind adalah nilai APLIKASI (ADMIN|USER) yang dipakai untuk otorisasi
-- dan tampilan. Kolom fisik `role` lama (OWNER|MEMBER|SERVICE) tetap agar data
-- tidak rusak; 01 mengizinkan pemetaan sementara selama tidak tampil ke user.
ALTER TABLE __SCHEMA__.principals
  ADD COLUMN IF NOT EXISTS role_kind text
    CHECK (role_kind IN ('ADMIN', 'USER'));

-- View transisi: role_kind kosong diturunkan dari role lama. Aplikasi membaca
-- role_kind terlebih dahulu, sehingga istilah legacy tidak bocor ke UI.
CREATE OR REPLACE VIEW __SCHEMA__.principals_role_view AS
SELECT
  id,
  COALESCE(role_kind, CASE role WHEN 'OWNER' THEN 'ADMIN' ELSE 'USER' END) AS role_kind,
  role AS role_legacy,
  kind,
  approval_status,
  entitlement_status,
  lifecycle_status
FROM __SCHEMA__.principals
WHERE deleted_at IS NULL;

-- ---------------------------------------------------------------------------
-- 2. Entitlement ledger append-only (FREE / PLUS / PRO / LOVE)
-- ---------------------------------------------------------------------------
-- Riwayat tunggal: hanya INSERT. Tidak ada UPDATE/DELETE baris committed
-- (dilindungi juga di lapis service, P06/P07).
CREATE TABLE __SCHEMA__.entitlement_ledger (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  entitlement text NOT NULL CHECK (entitlement IN ('FREE', 'PLUS', 'PRO', 'LOVE')),
  change_kind text NOT NULL CHECK (
    change_kind IN ('INITIAL_FREE', 'PURCHASE', 'UPGRADE', 'GRANT_LOVE', 'REVOKED')
  ),
  source text NOT NULL CHECK (source IN ('SYSTEM', 'PAYMENT', 'ADMIN_MANUAL')),
  -- Untuk PURCHASE/UPGRADE: rujukan order pembayaran (audit append-only).
  payment_order_id uuid,
  amount_minor bigint CHECK (amount_minor IS NULL OR amount_minor >= 0),
  currency char(3) NOT NULL DEFAULT 'IDR',
  reason text NOT NULL DEFAULT '' CHECK (length(reason) <= 500),
  granted_by uuid REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Grant LOVE hanya boleh oleh Admin manual (01: bantuan akses manual).
  CHECK (change_kind <> 'GRANT_LOVE' OR source = 'ADMIN_MANUAL')
);

CREATE INDEX entitlement_ledger_principal_idx
  ON __SCHEMA__.entitlement_ledger (principal_id, created_at DESC);

CREATE INDEX entitlement_ledger_payment_idx
  ON __SCHEMA__.entitlement_ledger (payment_order_id)
  WHERE payment_order_id IS NOT NULL;

-- Entitlement AKTIF saat ini (satu baris per principal; ledger = riwayat).
CREATE TABLE __SCHEMA__.principal_entitlement_current (
  principal_id uuid PRIMARY KEY REFERENCES __SCHEMA__.principals(id),
  entitlement text NOT NULL CHECK (entitlement IN ('FREE', 'PLUS', 'PRO', 'LOVE')),
  ledger_entry_id uuid NOT NULL REFERENCES __SCHEMA__.entitlement_ledger(id),
  -- LOVE: pembatasan khusus Admin yang tercatat (default setara PRO).
  love_restriction_note text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- 3. Trial Tools global: 5 eksekusi berhasil, reservation/commit/release
-- ---------------------------------------------------------------------------
-- Mengganti trial 30-hari (trial_started_at/trial_expires_at). Kolom lama tetap
-- untuk data legacy; service membaca tools_trial_remaining.
ALTER TABLE __SCHEMA__.principals
  ADD COLUMN IF NOT EXISTS tools_trial_total integer NOT NULL DEFAULT 5
    CHECK (tools_trial_total >= 0),
  ADD COLUMN IF NOT EXISTS tools_trial_remaining integer
    CHECK (tools_trial_remaining IS NULL OR tools_trial_remaining >= 0),
  ADD COLUMN IF NOT EXISTS tools_trial_setup_at timestamptz;

-- Reservation idempoten: idempotency_key unik per principal+operation, sehingga
-- refresh/retry tidak mengurangi counter dua kali (05: atomik + idempoten).
CREATE TABLE __SCHEMA__.tools_trial_reservations (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  idempotency_key text NOT NULL,
  tool_kind text NOT NULL CHECK (length(tool_kind) BETWEEN 1 AND 64),
  status text NOT NULL DEFAULT 'RESERVED'
    CHECK (status IN ('RESERVED', 'COMMITTED', 'RELEASED')),
  reserved_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  committed_at timestamptz,
  released_at timestamptz,
  UNIQUE (principal_id, idempotency_key)
);

CREATE INDEX tools_trial_reservations_pending_idx
  ON __SCHEMA__.tools_trial_reservations (principal_id, status)
  WHERE status = 'RESERVED';

-- ---------------------------------------------------------------------------
-- 4. Harga paket ke payment_settings (menggantikan BASE_PRICE tunggal)
-- ---------------------------------------------------------------------------
-- 01: Plus Rp25.000, Pro Rp75.000, upgrade Plus->Pro Rp50.000.
-- BASE_PRICE lama tetap (tidak dihapus) untuk kompatibilitas data lama.
INSERT INTO __SCHEMA__.payment_settings (key, amount) VALUES
  ('PLUS_PRICE', 25000),
  ('PRO_PRICE', 75000),
  ('UPGRADE_PLUS_TO_PRO', 50000)
ON CONFLICT (key) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 5. Pendaftaran tanpa wali
-- ---------------------------------------------------------------------------
-- 01: pendaftaran tidak meminta data wali. guardian_submissions lama TIDAK
-- dihapus; kolom ini hanya mencatat bahwa alur baru non-wali aktif sehingga
-- service bisa berhenti memerlukannya. Kebijakan retensi data lama = Admin.
INSERT INTO __SCHEMA__.payment_settings (key, amount) VALUES
  ('REGISTRATION_GUARDIAN_REQUIRED', 0)
ON CONFLICT (key) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 6. Event audit untuk perubahan material (01/06)
-- ---------------------------------------------------------------------------
-- Sama pola dengan tabel audit lain: append-only, actor + aksi + target.
CREATE TABLE __SCHEMA__.madevi_access_events (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  event_kind text NOT NULL CHECK (
    event_kind IN (
      'ENTITLEMENT_CHANGED',
      'LOVE_GRANTED',
      'PAYMENT_COMPLETED',
      'TRIAL_CONSUMED',
      'TRIAL_REFUNDED',
      'ADMIN_ACTION'
    )
  ),
  -- Detail bebas JSON, tapi tidak boleh memuat kredensial (validasi di service).
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  performed_by uuid REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX madevi_access_events_principal_idx
  ON __SCHEMA__.madevi_access_events (principal_id, created_at DESC);

CREATE INDEX madevi_access_events_kind_idx
  ON __SCHEMA__.madevi_access_events (event_kind, created_at DESC);

COMMIT;

-- Verifikasi pascamigrasi (dijalankan Admin, bukan agent):
--   1. SELECT role_kind, count(*) FROM __SCHEMA__.principals_role_view GROUP BY 1;
--      -> harus menghasilkan ADMIN/USER, bukan OWNER/MEMBER.
--   2. SELECT key, amount FROM __SCHEMA__.payment_settings ORDER BY key;
--      -> PLUS_PRICE=25000, PRO_PRICE=75000, UPGRADE_PLUS_TO_PRO=50000,
--         BASE_PRICE=25000 (lama, tetap).
--   3. SELECT tools_trial_total, tools_trial_remaining FROM __SCHEMA__.principals
--      LIMIT 5; -> total 5, remaining NULL (belum disetup) atau 0..5.
--   4. SELECT to_regclass('__SCHEMA__.entitlement_ledger') AS a,
--             to_regclass('__SCHEMA__.tools_trial_reservations') AS b,
--             to_regclass('__SCHEMA__.madevi_access_events') AS c;
--      -> ketiganya tidak NULL.
--   5. Konfirmasi guardian_submissions MASIH ADA (tidak dihapus):
--      SELECT count(*) FROM __SCHEMA__.guardian_submissions;
