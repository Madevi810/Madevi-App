-- ============================================================================
-- Migrasi 0021 DOWN — P05
--
-- PERINGATAN ROLLBACK (P05 logika ekstra): DOWN ini menghapus TABEL dan KOLOM
-- baru. Data yang sudah terisi di 0021 (ledger, reservation, access_events,
-- role_kind, tools_trial_*) akan HILANG.
--
-- P05 menyatakan: "Jika rollback menghapus data baru, gunakan forward-fix,
-- bukan down destruktif." Jadi urutan yang disarankan bila ada masalah:
--   1. JANGAN langsung jalankan DOWN.
--   2. Gunakan forward-fix: tulis migrasi 0022 yang mengoreksi data/schema
--      tanpa membuang hasil 0021.
--   3. Hanya jalankan DOWN bila 0021 benar-benar salah total dan belum ada
--      data produksi yang bergantung padanya (keputusan Admin).
--
-- DOWN disediakan untuk kelengkapan dan keadaan darurat, BUKAN rencana A.
-- Data legacy (0001–0020) tidak disentuh oleh DOWN ini.
-- ============================================================================

BEGIN;

-- 6. Hapus event audit akses.
DROP TABLE IF EXISTS __SCHEMA__.madevi_access_events;

-- 5. Kunci fitur wali (data payment_settings, non-destruktif: hanya baris baru).
DELETE FROM __SCHEMA__.payment_settings
WHERE key = 'REGISTRATION_GUARDIAN_REQUIRED';

-- 4. Hapus harga paket baru (BASE_PRICE lama tetap utuh).
DELETE FROM __SCHEMA__.payment_settings
WHERE key IN ('PLUS_PRICE', 'PRO_PRICE', 'UPGRADE_PLUS_TO_PRO');

-- 3. Hapus mekanisme trial Tools.
DROP TABLE IF EXISTS __SCHEMA__.tools_trial_reservations;

ALTER TABLE __SCHEMA__.principals
  DROP COLUMN IF EXISTS tools_trial_setup_at,
  DROP COLUMN IF EXISTS tools_trial_remaining,
  DROP COLUMN IF EXISTS tools_trial_total;

-- 2. Hapus entitlement ledger + status saat ini.
DROP TABLE IF EXISTS __SCHEMA__.principal_entitlement_current;
DROP TABLE IF EXISTS __SCHEMA__.entitlement_ledger;

-- 1. Hapus transisi role. role_kind DIHAPUS — jika sudah diisi (mis. oleh P06),
--    data itu hilang. Role lama (OWNER/MEMBER) tidak diubah, jadi aplikasi
--    kembali ke pemetaan sementara lama. Pertimbangkan forward-fix (0022)
--    bila role_kind sudah berisi data produksi.
DROP VIEW IF EXISTS __SCHEMA__.principals_role_view;

ALTER TABLE __SCHEMA__.principals
  DROP COLUMN IF EXISTS role_kind;

COMMIT;

-- Verifikasi pascamigration-down (dijalankan Admin):
--   1. SELECT to_regclass('__SCHEMA__.entitlement_ledger'),
--             to_regclass('__SCHEMA__.tools_trial_reservations'),
--             to_regclass('__SCHEMA__.madevi_access_events');
--      -> ketiganya NULL (dihapus).
--   2. SELECT count(*) FROM __SCHEMA__.payment_settings;
--      -> kembali ke 1 baris (BASE_PRICE=25000).
--   3. SELECT count(*) FROM __SCHEMA__.guardian_submissions;
--      -> jumlah tetap (DOWN tidak menyentuh data legacy).
--   4. SELECT trial_started_at IS NOT NULL AS trial_lama_ada
--      FROM __SCHEMA__.principals LIMIT 5;
--      -> kolom trial 30-hari lama tetap utuh.
