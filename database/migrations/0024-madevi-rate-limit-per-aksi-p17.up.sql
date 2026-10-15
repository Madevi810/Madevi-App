-- ============================================================
-- 0024: Rate limit PER AKSI — P17 (additive only, tabel baru)
-- ============================================================
-- P17: "Rate limit per aksi berisiko, bukan satu limit kasar."
--
-- `rate_limits` (0015) hanya punya PK ip_address → SEMUA aksi berbagi
-- satu bucket 100/IP. Itu melanggar P17: login butuh batas ketat, tapi
-- browse API sehat di 100+. Bucket tunggal memaksa pilihan kasar.
--
-- Tabel BARU (bukan ubah rate_limits) agar:
--   - data lama tidak tersentuh (04: additive)
--   - `checkRateLimit` lama tetap berfungsi (tidak ada regresi)
--   - per-action limit terpisah & jelas
--
-- Down tidak disarankan (lihat 0021–0023): forward-fix lebih aman.

BEGIN;

CREATE TABLE IF NOT EXISTS __SCHEMA__.rate_limits_by_action (
  ip_address text NOT NULL,
  -- P17: dimensi aksi. 'general' untuk compat konseptual.
  action text NOT NULL CHECK (action IN (
    'general',
    'login',
    'login_admin',
    'register',
    'recovery',
    'ai_conversation',
    'upload',
    'tools_execute',
    'message_request',
    'payment_create'
  )),
  request_count int NOT NULL DEFAULT 0,
  -- Mulai window hitung saat ini; reset bila sudah lewat window.
  window_started_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  blocked_until timestamptz,
  last_request_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (ip_address, action)
);

-- P17: batas per aksi (impact × exploitability):
--   login/login_admin  : brute-force        → ketat
--   register/recovery  : spam/bot abuse     → ketat
--   ai/upload/tools    : resource abuse     → sedang
--   payment_create     : replay abuse       → ketat
COMMENT ON TABLE __SCHEMA__.rate_limits_by_action IS
  'P17: rate limit per aksi berisiko. Lawan rate_limits (bucket tunggal IP).';

COMMIT;
