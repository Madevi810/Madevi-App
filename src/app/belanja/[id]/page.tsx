import { ProductDetailPage } from '@/components/product-detail';
import { PublicShell } from '@/components/public-shell';

export const dynamic = 'force-dynamic';

export default async function BelanjaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PublicShell>
      <ProductDetailPage id={id} />
    </PublicShell>
  );
}
