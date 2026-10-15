import { NextRequest, NextResponse } from 'next/server';
import { errorMessage, isDependencyUnavailable } from '@/api/error-message';
import { getPool } from '@/db/pool';
import { quotedSchema } from '@/db/schema-name';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!UUID.test(id)) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_FAILED', message: 'ID produk tidak valid' } },
        { status: 400 },
      );
    }
    const pool = await getPool();
    // P12: tampilkan partner/domain (sumber produk) di detail.
    // P07: SELECT eksplisit, bukan `SELECT *` — cegah field privat ikut bocor.
    const result = await pool.query(
      `SELECT p.id, p.title, p.slug, p.image_url, p.original_price, p.currency,
              p.stock_status, p.brand, p.category, p.subcategory, p.condition,
              p.source_description, p.owner_description, p.external_url,
              p.last_checked_at,
              m.name AS partner_name, m.domain AS partner_domain,
              COALESCE(media.items, '[]'::json) AS media
         FROM ${quotedSchema()}.ebelanja_products p
         LEFT JOIN ${quotedSchema()}.ebelanja_partners m ON m.id = p.partner_id
         LEFT JOIN LATERAL (
           SELECT json_agg(
             json_build_object(
               'id', product_media.id,
               'imageUrl', product_media.image_url,
               'altText', product_media.alt_text,
               'sortOrder', product_media.sort_order
             ) ORDER BY product_media.sort_order ASC
           ) AS items
             FROM ${quotedSchema()}.ebelanja_product_media product_media
            WHERE product_media.product_id = p.id
         ) media ON true
        WHERE p.id = $1 AND p.lifecycle_status = $2`,
      [id, 'PUBLISHED'],
    );
    if (!result.rows[0])
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Produk tidak ditemukan' } },
        { status: 404 },
      );
    return NextResponse.json({ data: result.rows[0] });
  } catch (e: unknown) {
    if (isDependencyUnavailable(e)) {
      return NextResponse.json(
        {
          error: {
            code: 'DEPENDENCY_UNAVAILABLE',
            message: 'Layanan lokal sementara tidak tersedia',
          },
        },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: errorMessage(e) } },
      { status: 500 },
    );
  }
}
