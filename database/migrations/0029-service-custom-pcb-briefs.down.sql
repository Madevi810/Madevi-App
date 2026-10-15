-- Rollback 0029: hapus tabel brief relasi Custom & PCB (L04).
-- Baris service_orders tidak dihapus; order yang sudah ada tetap dapat dibaca
-- sebagai brief_data JSON (kolom brief tetap ada di service_orders).

BEGIN;

DROP TABLE IF EXISTS __SCHEMA__.pcb_briefs;
DROP TABLE IF EXISTS __SCHEMA__.custom_briefs;

COMMIT;
