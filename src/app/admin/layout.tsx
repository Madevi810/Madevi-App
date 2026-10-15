import type { ReactNode } from 'react';

/**
 * L07: /admin diredirect ke /owner kanonis (D03); layout ini tidak lagi
 * merender UI — admin nyata ada di src/app/owner/layout.tsx (OwnerShell).
 * Redirect `next.config.ts` menangani semua `/admin/*`, jingga tidak ada
 * menu `/admin/*` yang dapat ditampilkan kepada pengguna.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
