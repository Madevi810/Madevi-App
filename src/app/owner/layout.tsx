import type { ReactNode } from 'react';

import { OwnerShell } from '@/components/owner-shell';

/**
 * L07: /owner adalah alias kompatibel ke canonical /admin.
 * Login, cookie, noindex, dan deep link dipertahankan; API legacy tetap
 * tersedia sampai migrasi deprecation diumumkan Admin. Jangan menghapus
 * alias berdasarkan persentase (L09 mengaudit ulang sebelum deprecation).
 */
export default function OwnerLayout({ children }: { children: ReactNode }) {
  return <OwnerShell>{children}</OwnerShell>;
}
