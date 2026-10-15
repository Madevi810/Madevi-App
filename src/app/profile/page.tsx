import type { Metadata } from 'next';

import { ProfileShell } from '@/components/profile-shell';
import { PublicShell } from '@/components/public-shell';

export const metadata: Metadata = { title: 'Profil', robots: { index: false, follow: false } };

export default function ProfilePage() {
  return (
    <PublicShell>
      <div className="page-shell">
        <ProfileShell />
      </div>
    </PublicShell>
  );
}
