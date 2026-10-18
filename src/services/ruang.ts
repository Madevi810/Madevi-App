/**
 * Data 7 ruang Madevi — satu sumber kebenaran untuk kartu ruang.
 * Selaras dengan MADEVI_SPACES di contracts/navigation.
 */
import type { RuangInfo } from '@/components/ruang/ruang-card';

export const DAFTAR_RUANG: RuangInfo[] = [
  {
    slug: 'jelajahi-pengetahuan',
    nama: 'Explore & Learn',
    deskripsi: 'Peta konsep dan artikel pengetahuan yang bisa ditelusuri dari akar sampai daun.',
    href: '/ruang/jelajahi-pengetahuan',
    ikon: '🧭',
    warna: 'blue-gray',
    labelKonten: 'artikel',
  },
  {
    slug: 'tutorial-problem-solve',
    nama: 'Tutorial & Problem Solve',
    deskripsi: 'Panduan praktis: masalah → cara → penyelesaian. Semua masalah ada solusinya.',
    href: '/ruang/tutorial-problem-solve',
    ikon: '🛠️',
    warna: 'practical-amber',
    labelKonten: 'tutorial',
  },
  {
    slug: 'tools-equipment',
    nama: 'Tools & Equipment',
    deskripsi: 'Kalkulator, konverter, generator, dan simulasi interaktif — gratis.',
    href: '/ruang/tools-equipment',
    ikon: '🧰',
    warna: 'green',
    labelKonten: 'tools',
  },
  {
    slug: 'madevi-services',
    nama: 'Madevi Services',
    deskripsi: 'Jasa digital: undangan, desain, dan layanan profesional lainnya.',
    href: '/ruang/madevi-services',
    ikon: '💼',
    warna: 'purple',
    labelKonten: 'jasa',
  },
  {
    slug: 'madevi-school',
    nama: 'Madevi School',
    deskripsi: 'Sekolah digital: jenjang, kelas, materi, latihan, dan ujian.',
    href: '/ruang/madevi-school',
    ikon: '🎓',
    warna: 'indigo',
    labelKonten: 'materi',
  },
  {
    slug: 'madevi-line',
    nama: 'Madevi Line',
    deskripsi: 'Komunitas: berbagi karya dan curhat bersama dalam ruang yang aman.',
    href: '/ruang/madevi-line',
    ikon: '💬',
    warna: 'pink',
    labelKonten: 'postingan',
  },
  {
    slug: 'shop',
    nama: 'Shop',
    deskripsi: 'Katalog afiliasi: barang pilihan dengan link marketplace resmi.',
    href: '/ruang/shop',
    ikon: '🛒',
    warna: 'orange',
    labelKonten: 'produk',
  },
];

export function ruangBySlug(slug: string): RuangInfo | undefined {
  return DAFTAR_RUANG.find((r) => r.slug === slug);
}
