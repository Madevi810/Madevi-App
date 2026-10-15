-- ============================================================
-- 0024 DOWN: Rate limit PER AKSI — P17
-- ============================================================
-- PERINGATAN (sama 0021–0023): DOWN destruktif terhadap data baru.
-- Jalankan HANYA bila 0024 harus dibuang penuh. Forward-fix lebih aman.

BEGIN;

DROP TABLE IF EXISTS __SCHEMA__.rate_limits_by_action;

COMMIT;
