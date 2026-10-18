/**
 * Content floor check (Fase A4, Aturan #11).
 *
 * GAGAL bila ada kategori, daftar, atau halaman tanpa isi bermakna.
 * Dijalankan sebagai bagian dari TEST setiap item.
 */
import { DAFTAR_RUANG } from '@/services/ruang';
import { TEMPLATE_UNDANGAN } from '@/services/undangan-template';
import { KATEGORI_TUTORIAL_LABEL } from '@/services/tutorial';
import { JENJANG_LABEL } from '@/services/school';
import { ALL_TOOLS } from '@/services/tools-registry-data';
import { FALLBACK_CATEGORIES } from '@/content/explore-fallback';
import { ATURAN_KOMUNITAS } from '@/services/line';

export interface FloorCheckResult {
  lulus: boolean;
  temuan: string[];
}

export function contentFloorCheck(): FloorCheckResult {
  const temuan: string[] = [];

  // 1. Tepat 7 ruang
  if (DAFTAR_RUANG.length !== 7) {
    temuan.push(`Ruang harus tepat 7, ditemukan ${DAFTAR_RUANG.length}`);
  }
  for (const r of DAFTAR_RUANG) {
    if (!r.nama || !r.deskripsi || !r.href) {
      temuan.push(`Ruang ${r.slug} tidak lengkap (nama/deskripsi/href)`);
    }
  }

  // 2. Tools tidak kosong
  if (ALL_TOOLS.length === 0) {
    temuan.push('Tidak ada tools terdaftar');
  }

  // 3. Template undangan tidak kosong
  if (TEMPLATE_UNDANGAN.length === 0) {
    temuan.push('Tidak ada template undangan');
  }

  // 4. Kategori tutorial tidak kosong
  if (Object.keys(KATEGORI_TUTORIAL_LABEL).length === 0) {
    temuan.push('Tidak ada kategori tutorial');
  }

  // 5. Jenjang school tidak kosong
  if (Object.keys(JENJANG_LABEL).length === 0) {
    temuan.push('Tidak ada jenjang school');
  }

  // 6. Fallback Explore tidak kosong
  if (FALLBACK_CATEGORIES.length === 0) {
    temuan.push('Tidak ada data fallback Explore');
  }

  // 7. Aturan komunitas Line ada
  if (ATURAN_KOMUNITAS.length === 0) {
    temuan.push('Tidak ada aturan komunitas Line');
  }

  return { lulus: temuan.length === 0, temuan };
}
