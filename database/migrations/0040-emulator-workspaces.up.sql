-- 0040: workspace emulator rangkaian edukasi; data skema disimpan sebagai JSONB privat.
-- Runtime solver tetap di browser/Next.js Web Worker; migration ini hanya memperluas kind.
ALTER TABLE __SCHEMA__.utilities_workspaces
  DROP CONSTRAINT IF EXISTS utilities_workspaces_kind_check;

ALTER TABLE __SCHEMA__.utilities_workspaces
  ADD CONSTRAINT utilities_workspaces_kind_check
  CHECK (kind IN ('RUMUS', 'PDF', 'CV', 'PORTOFOLIO', 'IMAGE', 'EMULATOR'));
