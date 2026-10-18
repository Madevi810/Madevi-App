/**
 * Data fallback Explore & Learn — tampil saat database tidak terjangkau
 * (mis. preview Vercel). Sama tebalnya dengan data asli, bukan halaman kosong.
 * Aturan #11: tidak pernah tampil halaman kosong atau galat mentah.
 */

export interface FallbackNode {
  id: string;
  name: string;
  slug: string;
  path: string;
  level: string;
  description: string;
  childrenCount: number;
  articlesCount: number;
}

export const FALLBACK_CATEGORIES: FallbackNode[] = [
  {
    id: 'fallback-sains',
    name: 'Sains Alam',
    slug: 'sains-alam',
    path: '/sains-alam',
    level: 'CATEGORY',
    description: 'Fisika, kimia, biologi, dan ilmu bumi — dari konsep dasar sampai penerapan.',
    childrenCount: 12,
    articlesCount: 145,
  },
  {
    id: 'fallback-teknologi',
    name: 'Teknologi Digital',
    slug: 'teknologi-digital',
    path: '/teknologi-digital',
    level: 'CATEGORY',
    description: 'Komputer, internet, AI, dan keamanan digital untuk kehidupan sehari-hari.',
    childrenCount: 10,
    articlesCount: 128,
  },
  {
    id: 'fallback-bahasa',
    name: 'Bahasa & Komunikasi',
    slug: 'bahasa-komunikasi',
    path: '/bahasa-komunikasi',
    level: 'CATEGORY',
    description: 'Bahasa Indonesia, bahasa Inggris, dan keterampilan komunikasi efektif.',
    childrenCount: 8,
    articlesCount: 96,
  },
  {
    id: 'fallback-matematika',
    name: 'Matematika',
    slug: 'matematika',
    path: '/matematika',
    level: 'CATEGORY',
    description: 'Dari aritmetika dasar sampai statistika terapan.',
    childrenCount: 9,
    articlesCount: 87,
  },
  {
    id: 'fallback-sejarah',
    name: 'Sejarah & Budaya',
    slug: 'sejarah-budaya',
    path: '/sejarah-budaya',
    level: 'CATEGORY',
    description: 'Sejarah Indonesia dan dunia, budaya, dan peradaban.',
    childrenCount: 7,
    articlesCount: 74,
  },
  {
    id: 'fallback-kesehatan',
    name: 'Kesehatan',
    slug: 'kesehatan',
    path: '/kesehatan',
    level: 'CATEGORY',
    description: 'Kesehatan tubuh, mental, gizi, dan gaya hidup sehat.',
    childrenCount: 8,
    articlesCount: 92,
  },
];

export const FALLBACK_LABEL_ID = 'Mode demo — data contoh';
export const FALLBACK_LABEL_EN = 'Demo mode — sample data';
