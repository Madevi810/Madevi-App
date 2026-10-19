-- Rollback migration 0054 (hanya untuk database uji, bukan produksi)
DROP TABLE IF EXISTS line_comments;
DROP TABLE IF EXISTS line_posts;
DROP TABLE IF EXISTS line_profiles;
DROP TABLE IF EXISTS user_streaks;
DROP TABLE IF EXISTS quiz_questions;
