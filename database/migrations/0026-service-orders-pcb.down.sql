-- 0026 rollback: Kembalikan view antrean dan hapus tabel service_orders & service_catalog_items

BEGIN;

CREATE OR REPLACE VIEW __SCHEMA__.jasa_order_queue AS
SELECT
  o.id,
  'UNDANGAN'::TEXT AS kind,
  o.status,
  o.revision_count,
  o.revision_limit,
  o.schema_version,
  o.price_agreed,
  o.created_at,
  o.updated_at,
  o.completed_at,
  CASE
    WHEN o.status = 'IN_REVISION' AND o.updated_at < CURRENT_TIMESTAMP - INTERVAL '3 days' THEN 'HIGH'
    WHEN o.status = 'PENDING_APPROVAL' AND o.created_at < CURRENT_TIMESTAMP - INTERVAL '1 days' THEN 'MEDIUM'
    ELSE 'NORMAL'
  END AS urgency,
  CASE
    WHEN o.status IN ('PENDING_APPROVAL', 'APPROVED') THEN 'ADMIN'
    WHEN o.status = 'IN_REVISION' THEN 'USER'
    ELSE 'NONE'
  END AS waiting_on,
  o.public_slug
FROM __SCHEMA__.invitation_orders o
UNION ALL
SELECT
  o.id,
  'LOGO'::TEXT AS kind,
  o.status,
  o.revision_count,
  o.revision_limit,
  o.schema_version,
  o.price_agreed,
  o.created_at,
  o.updated_at,
  o.completed_at,
  CASE
    WHEN o.status = 'IN_REVISION' AND o.updated_at < CURRENT_TIMESTAMP - INTERVAL '3 days' THEN 'HIGH'
    WHEN o.status = 'PENDING_APPROVAL' AND o.created_at < CURRENT_TIMESTAMP - INTERVAL '1 days' THEN 'MEDIUM'
    ELSE 'NORMAL'
  END AS urgency,
  CASE
    WHEN o.status IN ('PENDING_APPROVAL', 'APPROVED') THEN 'ADMIN'
    WHEN o.status = 'IN_REVISION' THEN 'USER'
    ELSE 'NONE'
  END AS waiting_on,
  NULL::TEXT AS public_slug
FROM __SCHEMA__.logo_orders o;

DROP TABLE IF EXISTS __SCHEMA__.service_orders;
DROP TABLE IF EXISTS __SCHEMA__.service_catalog_items;

COMMIT;
