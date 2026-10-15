import { redirect } from 'next/navigation';

/**
 * D03: /admin surface diredirect ke /owner kanonis (lihat next.config.ts).
 * Halaman ini hanya fallback bila redirect config tertinggal; jangan tambah
 * UI di sini — route Admin nyata ada di src/app/owner/*.
 */
export default function AdminPage() {
  redirect('/owner');
}
