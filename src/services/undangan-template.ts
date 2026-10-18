/**
 * Katalog template undangan Madevi.
 * 2 template per paket sesuai visi Ade; tiap template beda karakter kuat.
 */
import type { KategoriTemplate } from './undangan';

export interface TemplateUndangan {
  id: string;
  nama: string;
  kategori: KategoriTemplate;
  deskripsi: string;
  warnaDefault: string;
  fontDefault: string;
  previewEmoji: string;
}

export const KATEGORI_LABEL: Record<KategoriTemplate, string> = {
  adat: 'Adat',
  floral: 'Floral',
  minimalis: 'Minimalis',
  nature: 'Nature',
  vintage: 'Vintage',
  fairytale: 'Fairytale',
};

export const TEMPLATE_UNDANGAN: TemplateUndangan[] = [
  {
    id: 'jawa-klasik',
    nama: 'Jawa Klasik',
    kategori: 'adat',
    deskripsi: 'Nuansa tradisional Jawa: batik parang, warna emas dan coklat tua yang anggun.',
    warnaDefault: '#8B6914',
    fontDefault: 'serif',
    previewEmoji: '🏵️',
  },
  {
    id: 'minang-songket',
    nama: 'Minang Songket',
    kategori: 'adat',
    deskripsi: 'Motif songket Minangkabau dengan aksen merah marun dan emas.',
    warnaDefault: '#9B1B30',
    fontDefault: 'serif',
    previewEmoji: '🧵',
  },
  {
    id: 'floral-pastel',
    nama: 'Floral Pastel',
    kategori: 'floral',
    deskripsi: 'Bunga-bunga lembut warna pastel, romantis dan manis.',
    warnaDefault: '#E8A0BF',
    fontDefault: 'serif',
    previewEmoji: '🌸',
  },
  {
    id: 'floral-bold',
    nama: 'Floral Bold',
    kategori: 'floral',
    deskripsi: 'Floral dengan warna berani dan kontras tinggi, modern.',
    warnaDefault: '#C2375F',
    fontDefault: 'sans-serif',
    previewEmoji: '🌺',
  },
  {
    id: 'minimal-putih',
    nama: 'Minimalis Putih',
    kategori: 'minimalis',
    deskripsi: 'Bersih dan elegan: dominan putih dengan aksen tipis.',
    warnaDefault: '#4A5568',
    fontDefault: 'sans-serif',
    previewEmoji: '⬜',
  },
  {
    id: 'minimal-hitam',
    nama: 'Minimalis Hitam',
    kategori: 'minimalis',
    deskripsi: 'Mewah dan dramatis: hitam pekat dengan teks emas.',
    warnaDefault: '#D4AF37',
    fontDefault: 'serif',
    previewEmoji: '⬛',
  },
  {
    id: 'hutan-hijau',
    nama: 'Hutan Hijau',
    kategori: 'nature',
    deskripsi: 'Dedaunan tropis yang segar, cocok untuk acara outdoor.',
    warnaDefault: '#2F7D32',
    fontDefault: 'serif',
    previewEmoji: '🌿',
  },
  {
    id: 'pantai-biru',
    nama: 'Pantai Biru',
    kategori: 'nature',
    deskripsi: 'Nuansa pantai: biru laut dan pasir yang menenangkan.',
    warnaDefault: '#0288D1',
    fontDefault: 'sans-serif',
    previewEmoji: '🌊',
  },
  {
    id: 'vintage-kraft',
    nama: 'Vintage Kraft',
    kategori: 'vintage',
    deskripsi: 'Kertas kraft dengan sentuhan retro yang hangat.',
    warnaDefault: '#8D6E63',
    fontDefault: 'serif',
    previewEmoji: '📜',
  },
  {
    id: 'vintage-cream',
    nama: 'Vintage Cream',
    kategori: 'vintage',
    deskripsi: 'Krem lembut dengan ornamen klasik Eropa.',
    warnaDefault: '#A68B5B',
    fontDefault: 'serif',
    previewEmoji: '🕰️',
  },
  {
    id: 'dongeng-istana',
    nama: 'Dongeng Istana',
    kategori: 'fairytale',
    deskripsi: 'Bak negeri dongeng: ungu magis dengan kilau bintang.',
    warnaDefault: '#7B1FA2',
    fontDefault: 'serif',
    previewEmoji: '✨',
  },
  {
    id: 'dongeng-hutan',
    nama: 'Dongeng Hutan',
    kategori: 'fairytale',
    deskripsi: 'Hutan ajaib dengan cahaya kunang-kunang.',
    warnaDefault: '#558B2F',
    fontDefault: 'serif',
    previewEmoji: '🧚',
  },
];

export function templateById(id: string): TemplateUndangan | undefined {
  return TEMPLATE_UNDANGAN.find((t) => t.id === id);
}

export function templateByKategori(kategori: KategoriTemplate): TemplateUndangan[] {
  return TEMPLATE_UNDANGAN.filter((t) => t.kategori === kategori);
}
