-- Rollback 0034: kembalikan CHECK 90-menit kaku dan hapus kebijakan.
-- Hanya aman bila tidak ada attempt dengan durasi non-90-menit.

BEGIN;

ALTER TABLE __SCHEMA__.exam_attempts DROP CONSTRAINT IF EXISTS exam_attempts_deadline_check;
ALTER TABLE __SCHEMA__.exam_attempts
  ADD CONSTRAINT exam_attempts_check
    CHECK (deadline_at = started_at + INTERVAL '90 minutes') NOT VALID;
ALTER TABLE __SCHEMA__.exam_attempts VALIDATE CONSTRAINT exam_attempts_check;
ALTER TABLE __SCHEMA__.exam_attempts DROP COLUMN IF EXISTS policy_version;
DROP TABLE IF EXISTS __SCHEMA__.assessment_policies;

COMMIT;
