import { ShopPage } from '@/components/shop-page';
import { PublicShell } from '@/components/public-shell';

export const dynamic = 'force-dynamic';

export default function BelanjaPage() {
  return (
    <PublicShell>
      <ShopPage />
    </PublicShell>
  );
}
