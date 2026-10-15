import type { Metadata } from 'next';

import { OwnerLoginForm } from '@/components/owner-login-form';

export const metadata: Metadata = {
  title: 'Login Admin',
  robots: { index: false, follow: false },
};

export default function OwnerLoginPage() {
  return (
    <main id="main-content" className="page-shell">
      <OwnerLoginForm />
    </main>
  );
}
