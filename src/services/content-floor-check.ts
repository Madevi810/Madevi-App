/**
 * Content floor check (Fase 3.4, Bagian 10 Perintah Utama).
 *
 * GAGAL bila ada kategori, daftar, atau halaman tanpa isi bermakna
 * atau di bawah lantai minimum Bagian 10.
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

/** Lantai Bagian 10 */
export const LANTAI = {
  ruang: 7,
  exploreKategori: 10,
  exploreSubPerKategori: 3,
  exploreArtikelPerSub: 5,
  tutorial: 60,
  schoolProgram: 6,
  schoolPelajaranPerProgram: 8,
  tools: 56,
  services: 12,
  lineProfil: 30,
} as const;

/**
 * Cek lantai level kode (tanpa database).
 * Untuk konten DB, gunakan contentFloorCheckDB().
 */
export function contentFloorCheck(): FloorCheckResult {
  const temuan: string[] = [];

  // 1. Tepat 7 ruang
  if (DAFTAR_RUANG.length !== LANTAI.ruang) {
    temuan.push(`Ruang harus tepat ${LANTAI.ruang}, ditemukan ${DAFTAR_RUANG.length}`);
  }
  for (const r of DAFTAR_RUANG) {
    if (!r.nama || !r.deskripsi || !r.href) {
      temuan.push(`Ruang ${r.slug} tidak lengkap (nama/deskripsi/href)`);
    }
  }

  // 2. Tools ≥ 56
  if (ALL_TOOLS.length < LANTAI.tools) {
    temuan.push(`Tools: ${ALL_TOOLS.length}/${LANTAI.tools} (kurang ${LANTAI.tools - ALL_TOOLS.length})`);
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

export interface FloorCheckDBInput {
  artikelPublished: number;
  kategoriExplore: number;
  tutorialCount: number;
  programSchool: number;
  layananCount: number;
  profilLine: number;
}

/**
 * Cek lantai level database.
 * Panggil dengan hasil query nyata ke Supabase.
 */
export function contentFloorCheckDB(d: FloorCheckDBInput): FloorCheckResult {
  const temuan: string[] = [];

  if (d.kategoriExplore < LANTAI.exploreKategori) {
    temuan.push(`Kategori Explore: ${d.kategoriExplore}/${LANTAI.exploreKategori}`);
  }
  // 10 kategori × 3 sub × 5 artikel = 150
  const minArtikel = LANTAI.exploreKategori * LANTAI.exploreSubPerKategori * LANTAI.exploreArtikelPerSub;
  if (d.artikelPublished < minArtikel) {
    temuan.push(`Artikel published: ${d.artikelPublished}/${minArtikel}`);
  }
  if (d.tutorialCount < LANTAI.tutorial) {
    temuan.push(`Tutorial: ${d.tutorialCount}/${LANTAI.tutorial}`);
  }
  if (d.programSchool < LANTAI.schoolProgram) {
    temuan.push(`Program School: ${d.programSchool}/${LANTAI.schoolProgram}`);
  }
  if (d.layananCount < LANTAI.services) {
    temuan.push(`Layanan: ${d.layananCount}/${LANTAI.services}`);
  }
  if (d.profilLine < LANTAI.lineProfil) {
    temuan.push(`Profil Line: ${d.profilLine}/${LANTAI.lineProfil}`);
  }

  return { lulus: temuan.length === 0, temuan };
}
