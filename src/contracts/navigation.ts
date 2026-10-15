/**
 * Kontrak Ruang Resmi Madevi.
 * Sumber kebenaran tunggal untuk urutan ruang, tautan, tema warna, dan deskripsi.
 */

export type SpacePresentationKey = 'explore' | 'tutorial' | 'school' | 'line' | 'services' | 'shop' | 'tools';

export interface SpaceContract {
  id: string;
  parentId: null;
  key: string;
  order: number;
  sortOrder: number;
  name: string;
  nameId: string;
  nameEn: string;
  href: string;
  slug: string;
  group: 'CORE' | 'TOOLS';
  colorTheme: string;
  /** Kunci presentasi header per ruang (L02 G-02-01). Bertipe terbatas, bukan string CSS bebas. */
  presentationKey: SpacePresentationKey;
  descriptionId: string;
  descriptionEn: string;
  /** Metadata canonical yang dipakai loader Menu/Artikel saat integrasi. */
  schemaVersion: 'menu.v1';
  kind: 'SPACE';
  status: 'ACTIVE';
  accessLevel: 'PUBLIC';
  sourceRef: string;
  aliases: readonly string[];
}

export const NAVIGATION_SCHEMA_VERSION = 'menu.v1' as const;

export const MADEVI_SPACES: readonly SpaceContract[] = [
  {
    id: 'space-explore',
    parentId: null,
    key: 'explore-learn',
    order: 1,
    sortOrder: 10,
    name: 'Explore & Learn',
    nameId: 'Explore & Learn',
    nameEn: 'Explore & Learn',
    href: '/ruang/jelajahi-pengetahuan',
    slug: 'jelajahi-pengetahuan',
    group: 'CORE',
    colorTheme: 'blue-gray',
    presentationKey: 'explore',
    descriptionId: 'Peta konsep, studi, dan hubungan pengetahuan yang dapat ditelusuri.',
    descriptionEn: 'A navigable map of concepts, studies, and knowledge relationships.',
    schemaVersion: NAVIGATION_SCHEMA_VERSION,
    kind: 'SPACE',
    status: 'ACTIVE',
    accessLevel: 'PUBLIC',
    sourceRef: 'madevi.navigation.v1',
    aliases: [],
  },
  {
    id: 'space-tutorial-problem-solve',
    parentId: null,
    key: 'tutorial-problem-solve',
    order: 2,
    sortOrder: 15,
    name: 'Tutorial & Problem Solve',
    nameId: 'Tutorial & Problem Solve',
    nameEn: 'Tutorial & Problem Solve',
    href: '/ruang/tutorial-problem-solve',
    slug: 'tutorial-problem-solve',
    group: 'CORE',
    colorTheme: 'practical-amber',
    presentationKey: 'tutorial',
    descriptionId: 'Panduan praktis untuk memperbaiki, membuat, dan menangani kebutuhan sehari-hari dengan aman.',
    descriptionEn: 'Practical guides for repairing, making, and handling everyday needs safely.',
    schemaVersion: NAVIGATION_SCHEMA_VERSION,
    kind: 'SPACE',
    status: 'ACTIVE',
    accessLevel: 'PUBLIC',
    sourceRef: 'madevi.navigation.v1',
    aliases: ['tutorial', 'problem-solve'],
  },
  {
    id: 'space-school',
    parentId: null,
    key: 'madevi-school',
    order: 3,
    sortOrder: 20,
    name: 'Madevi School',
    nameId: 'Madevi School',
    nameEn: 'Madevi School',
    href: '/ruang/pendidikan-sekolah',
    slug: 'pendidikan-sekolah',
    group: 'CORE',
    colorTheme: 'academic-blue',
    presentationKey: 'school',
    descriptionId: 'Kurikulum pendidikan terstruktur dari jenjang PAUD hingga Perguruan Tinggi.',
    descriptionEn: 'Structured academic curriculum from early childhood to higher education.',
    schemaVersion: NAVIGATION_SCHEMA_VERSION,
    kind: 'SPACE',
    status: 'ACTIVE',
    accessLevel: 'PUBLIC',
    sourceRef: 'madevi.navigation.v1',
    aliases: ['sekolah', '/ruang/sekolah'],
  },
  {
    id: 'space-line',
    parentId: null,
    key: 'madevi-line',
    order: 4,
    sortOrder: 30,
    name: 'Madevi Line',
    nameId: 'Madevi Line',
    nameEn: 'Madevi Line',
    href: '/sosial',
    slug: 'sosial',
    group: 'CORE',
    colorTheme: 'calm-blue',
    presentationKey: 'line',
    descriptionId: 'Ruang komunikasi sosial mandiri dengan kendali privasi dan keselamatan.',
    descriptionEn: 'Independent social space with conservative privacy and safety controls.',
    schemaVersion: NAVIGATION_SCHEMA_VERSION,
    kind: 'SPACE',
    status: 'ACTIVE',
    accessLevel: 'PUBLIC',
    sourceRef: 'madevi.navigation.v1',
    aliases: [],
  },
  {
    id: 'space-services',
    parentId: null,
    key: 'madevi-services',
    order: 5,
    sortOrder: 40,
    name: 'Madevi Services',
    nameId: 'Madevi Services',
    nameEn: 'Madevi Services',
    href: '/jasa',
    slug: 'jasa',
    group: 'CORE',
    colorTheme: 'navy-blue',
    presentationKey: 'services',
    descriptionId: 'Layanan template layout harga tetap dan jasa desain pesanan terverifikasi.',
    descriptionEn: 'Fixed-price layout templates and verified custom design services.',
    schemaVersion: NAVIGATION_SCHEMA_VERSION,
    kind: 'SPACE',
    status: 'ACTIVE',
    accessLevel: 'PUBLIC',
    sourceRef: 'madevi.navigation.v1',
    aliases: [],
  },
  {
    id: 'space-shop',
    parentId: null,
    key: 'madevi-shop',
    order: 6,
    sortOrder: 50,
    name: 'Madevi Shop',
    nameId: 'Madevi Shop',
    nameEn: 'Madevi Shop',
    href: '/belanja',
    slug: 'belanja',
    group: 'CORE',
    colorTheme: 'slate-blue',
    presentationKey: 'shop',
    descriptionId: 'Katalog kurasi produk mitra dan peralatan dengan tautan transparan.',
    descriptionEn: 'Curated partner products and equipment with transparent links.',
    schemaVersion: NAVIGATION_SCHEMA_VERSION,
    kind: 'SPACE',
    status: 'ACTIVE',
    accessLevel: 'PUBLIC',
    sourceRef: 'madevi.navigation.v1',
    aliases: [],
  },
  {
    id: 'space-tools',
    parentId: null,
    key: 'tools-equipment',
    order: 7,
    sortOrder: 70,
    name: 'Tools & Equipment',
    nameId: 'Tools & Equipment',
    nameEn: 'Tools & Equipment',
    href: '/alat-bantu',
    slug: 'alat-bantu',
    group: 'TOOLS',
    colorTheme: 'blue-teal',
    presentationKey: 'tools',
    descriptionId: 'Alat bantu komputasi rumus, pengolah dokumen PDF, dan instrumen karier.',
    descriptionEn: 'Formula calculation tools, PDF document utilities, and career instruments.',
    schemaVersion: NAVIGATION_SCHEMA_VERSION,
    kind: 'SPACE',
    status: 'ACTIVE',
    accessLevel: 'PUBLIC',
    sourceRef: 'madevi.navigation.v1',
    aliases: [],
  },
] as const;

export const SPACE_BY_SLUG: Record<string, SpaceContract> = Object.fromEntries(
  MADEVI_SPACES.map((space) => [space.slug, space]),
);

export const SPACE_BY_HREF: Record<string, SpaceContract> = Object.fromEntries(
  MADEVI_SPACES.map((space) => [space.href, space]),
);

/** Resolve a canonical slug or an explicitly registered legacy alias. */
export function resolveSpaceSlug(value: string): SpaceContract | null {
  const normalized = value.replace(/^\/+|\/+$/g, '');
  return (
    SPACE_BY_SLUG[normalized] ??
    MADEVI_SPACES.find((space) =>
      space.aliases.some((alias) => alias.replace(/^\/+|\/+$/g, '') === normalized),
    ) ??
    null
  );
}

/**
 * Resolve presentasi ruang dari pathname (L02 G-02-01).
 * Mendukung href langsung (`/sosial`, `/jasa`, `/belanja`, `/alat-bantu`),
 * `/ruang/<slug>` beserta alias terdaftar. Mengembalikan null untuk non-ruang.
 */
export function resolveSpaceFromPath(pathname: string): SpaceContract | null {
  const clean = pathname.split('?')[0].split('#')[0];
  if (SPACE_BY_HREF[clean]) return SPACE_BY_HREF[clean] ?? null;
  const ruangMatch = clean.match(/^\/ruang\/([^/]+)/);
  if (ruangMatch?.[1]) return resolveSpaceSlug(ruangMatch[1]);
  return null;
}
