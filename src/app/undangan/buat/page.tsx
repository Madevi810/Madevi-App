import { PublicShell } from '@/components/public-shell';
import { UndanganBuilder } from '@/components/undangan/undangan-builder';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Buat Undangan Digital — Madevi',
  description: 'Buat undangan pernikahan digital: pilih template, isi data, pratinjau live, terbitkan.',
};

/**
 * Halaman builder undangan: 6 langkah + pratinjau live.
 */
export default function BuatUndanganPage() {
  return (
    <PublicShell>
      <UndanganBuilder />
    </PublicShell>
  );
}
