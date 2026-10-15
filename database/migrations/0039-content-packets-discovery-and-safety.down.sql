-- Rollback 0039 menghapus hanya struktur metadata yang belum ada sebelumnya.
-- Jika kategori koreksi baru telah dipakai, constraint lama akan menolak rollback
-- dan transaksi dibatalkan; data tidak dibuang diam-diam.

ALTER TABLE __SCHEMA__.article_corrections
  DROP CONSTRAINT IF EXISTS article_corrections_issue_type_check;

ALTER TABLE __SCHEMA__.article_corrections
  ADD CONSTRAINT article_corrections_issue_type_check
  CHECK (issue_type IN ('FACTUAL', 'TYPO', 'OUTDATED', 'BROKEN_LINK', 'OTHER'));

DROP TABLE IF EXISTS __SCHEMA__.article_aliases;
DROP TABLE IF EXISTS __SCHEMA__.article_review_records;
DROP TABLE IF EXISTS __SCHEMA__.article_safety_profiles;
DROP TABLE IF EXISTS __SCHEMA__.article_claim_evidence;
DROP TABLE IF EXISTS __SCHEMA__.article_claims;
DROP TABLE IF EXISTS __SCHEMA__.content_relations;
DROP TABLE IF EXISTS __SCHEMA__.article_facet_assignments;
DROP TABLE IF EXISTS __SCHEMA__.content_facet_values;
DROP TABLE IF EXISTS __SCHEMA__.content_facet_definitions;
DROP TABLE IF EXISTS __SCHEMA__.content_packets;
DROP TABLE IF EXISTS __SCHEMA__.content_families;

ALTER TABLE __SCHEMA__.article_sources
  DROP CONSTRAINT IF EXISTS article_sources_article_id_id_key;

ALTER TABLE __SCHEMA__.article_blocks
  DROP CONSTRAINT IF EXISTS article_blocks_article_id_id_key;
