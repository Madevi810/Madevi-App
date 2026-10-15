import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth-card';
import { PublicShell } from '@/components/public-shell';

export const metadata: Metadata = { title: 'Daftar / Login' };
export default function AuthPage() {
  return (
    <PublicShell>
      <div className="page-shell">
        <AuthCard />
      </div>
    </PublicShell>
  );
}
