import { JasaPage } from '@/components/jasa-page';
import { PublicShell } from '@/components/public-shell';

export const dynamic = 'force-dynamic';

export default function JasaIndexPage() {
  return (
    <PublicShell>
      <JasaPage />
    </PublicShell>
  );
}
