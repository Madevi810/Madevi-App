-- ============================================================
-- 0023: Backup manifest, verifikasi, retensi — P16 (additive only)
-- ============================================================
-- Perubahan hanya MENAMBAH kolom; tidak mengubah/menghapus (04).
-- Tujuan: menutup celah P16 yang ditemukan saat audit:
--   1. Backup tanpa manifest        → manifest JSONB (daftar file, ukuran, checksum)
--   2. Tanpa schema version         → schema_version (deteksi mismatch saat restore)
--   3. Tidak ada hasil verifikasi   → verified_at + verification_result
--                                     (P16: "Backup yang belum pernah diverifikasi
--                                      restore dianggap belum terbukti.")
--   4. Tidak ada retensi            → retention_until (kebijakan data pribadi)
--   5. Tidak membedakan sumber      → source_kind (SOURCE/DB/STORAGE/EXPORT)
--
-- Down tidak disarankan (lihat 0021/0022): forward-fix lebih aman.

BEGIN;

ALTER TABLE __SCHEMA__.backup_logs
  ADD COLUMN IF NOT EXISTS manifest JSONB NULL,
  ADD COLUMN IF NOT EXISTS schema_version INTEGER NULL,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS verification_result TEXT NULL
    CHECK (verification_result IS NULL OR verification_result IN ('OK', 'MISMATCH', 'MISSING', 'ERROR')),
  ADD COLUMN IF NOT EXISTS retention_until TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS source_kind TEXT NULL
    CHECK (source_kind IS NULL OR source_kind IN ('SOURCE', 'DB', 'STORAGE', 'EXPORT'));

-- Indeks: cari backup berhasil terbaru per jenis (dashboard operasi).
CREATE INDEX IF NOT EXISTS backup_logs_kind_completed_idx
  ON __SCHEMA__.backup_logs (source_kind, completed_at DESC)
  WHERE status = 'SUCCESS';

COMMENT ON COLUMN __SCHEMA__.backup_logs.manifest IS
  'P16: manifest backup — daftar file, ukuran, checksum per file, jumlah baris tabel kunci.';
COMMENT ON COLUMN __SCHEMA__.backup_logs.schema_version IS
  'P16: nomor migrasi tertinggi saat backup dibuat; restore menolak mismatch.';
COMMENT ON COLUMN __SCHEMA__.backup_logs.verified_at IS
  'P16: kapan backup terakhir diverifikasi (restore uji atau checksum ulang). NULL = belum terbukti.';
COMMENT ON COLUMN __SCHEMA__.backup_logs.retention_until IS
  'P16: retensi backup data pribadi; purge setelah tanggal ini sesuai kebijakan.';

COMMIT;
