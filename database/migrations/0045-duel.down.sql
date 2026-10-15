-- 0045 (DOWN): rollback Duel Produk.
BEGIN;
DROP TRIGGER IF EXISTS product_duels_status_guard ON __SCHEMA__.product_duels;
DROP FUNCTION IF EXISTS __SCHEMA__.product_duels_status_guard();
DROP TABLE IF EXISTS __SCHEMA__.duel_votes;
DROP TABLE IF EXISTS __SCHEMA__.duel_points;
DROP TABLE IF EXISTS __SCHEMA__.product_duels;
COMMIT;
