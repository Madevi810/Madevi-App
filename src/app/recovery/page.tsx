import type { Metadata } from 'next';

import { RecoveryForm } from '@/components/recovery-form';
import { PublicShell } from '@/components/public-shell';

export const metadata: Metadata = {
  title: 'Pemulihan Akun',
  robots: { index: false, follow: false },
};

export default function RecoveryPage() {
  return (
    <PublicShell>
      <div className="page-shell">
        <RecoveryForm />
      </div>
    </PublicShell>
  );
}
