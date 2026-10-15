import { PublicShell } from '@/components/public-shell';
import { InvitationOnline } from '@/components/jasa/invitation-online';
import { getDatabaseClients } from '@/db/client';
import { quotedSchema } from '@/db/schema-name';

export const dynamic = 'force-dynamic';

/**
 * Halaman online final undangan — slug bersih, mis.
 * /undangan/ade-devi-121026 (kontrak). Hanya order APPROVED/COMPLETED.
 */
export default async function InvitationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pool = getDatabaseClients().pool;
  const schema = quotedSchema(process.env.MADEVI_DB_SCHEMA ?? 'madevi');

  const result = await pool.query(
    `SELECT o.*, t.name AS template_name, t.layout AS template_layout
       FROM ${schema}.invitation_orders o
       LEFT JOIN ${schema}.invitation_templates t ON t.id = o.template_id
      WHERE o.public_slug = $1 AND o.status IN ('APPROVED', 'COMPLETED')`,
    [slug],
  );
  const order = result.rows[0] ?? null;

  return (
    <PublicShell>
      <div className="page-shell">
        <InvitationOnline order={order} />
      </div>
    </PublicShell>
  );
}
