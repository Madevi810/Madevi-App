-- 0043 (DOWN): rollback Bundel Ongkir Tetangga.
BEGIN;
DROP TABLE IF EXISTS __SCHEMA__.bundle_items;
DROP TABLE IF EXISTS __SCHEMA__.shipping_bundles;
COMMIT;
