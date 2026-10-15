-- Rollback migrasi 0006: hapus semua tabel Prompt 06 secara aman
-- Urutan terbalik dari pembuatan untuk menghormati foreign key

DROP TABLE IF EXISTS __SCHEMA__.article_auto_checks;
DROP TABLE IF EXISTS __SCHEMA__.site_page_blocks;
DROP TABLE IF EXISTS __SCHEMA__.site_pages;
DROP TABLE IF EXISTS __SCHEMA__.article_relations;
DROP TABLE IF EXISTS __SCHEMA__.article_corrections;
DROP TABLE IF EXISTS __SCHEMA__.suggestion_supports;
DROP TABLE IF EXISTS __SCHEMA__.article_suggestions;
DROP TABLE IF EXISTS __SCHEMA__.questions_essay;
DROP TABLE IF EXISTS __SCHEMA__.questions_mc;
DROP TABLE IF EXISTS __SCHEMA__.question_banks;
DROP TABLE IF EXISTS __SCHEMA__.article_sources;
DROP TABLE IF EXISTS __SCHEMA__.article_revisions;
DROP TABLE IF EXISTS __SCHEMA__.article_blocks;
DROP TABLE IF EXISTS __SCHEMA__.articles;
