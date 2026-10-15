-- Jangan buang workspace emulator saat rollback. Jika data sudah ada, transaksi gagal aman.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
      FROM __SCHEMA__.utilities_workspaces
     WHERE kind = 'EMULATOR'
  ) THEN
    RAISE EXCEPTION 'Rollback 0040 ditolak: utilities_workspaces masih berisi kind EMULATOR';
  END IF;
END $$;

ALTER TABLE __SCHEMA__.utilities_workspaces
  DROP CONSTRAINT IF EXISTS utilities_workspaces_kind_check;

ALTER TABLE __SCHEMA__.utilities_workspaces
  ADD CONSTRAINT utilities_workspaces_kind_check
  CHECK (kind IN ('RUMUS', 'PDF', 'CV', 'PORTOFOLIO', 'IMAGE'));
