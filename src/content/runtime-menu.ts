import { MADEVI_SPACES } from '@/contracts/navigation';

export type RuntimeMenuNode = {
  id: string;
  parentId: string | null;
  kind: 'SPACE' | 'DOMAIN' | 'MENU';
  label: string;
  slug: string;
  href: string | null;
  status: 'ACTIVE' | 'PROPOSED';
  accessLevel: 'PUBLIC';
  sortOrder: number;
  sourceRef: string;
};

/**
 * Tujuh node ruang diproyeksikan dari `MADEVI_SPACES` (L02 G-02-02).
 * Node non-SPACE tetap registry terpisah dan bukan content package L08.
 * Bentuk respons `/api/v1/runtime-menu` dipertahankan: id, sortOrder, href, status, urutan.
 *
 * L06: RUNTIME_MENU_NODES adalah proyeksi kontrak statis untuk kompatibilitas
 * UI lama. Status runtime yang benar dibaca dari API `/api/v1/runtime-menu`
 * → RuntimeContentPackageService → runtime_content_packages. Array ini tidak
 * boleh dipakai sebagai bukti status database/package.
 */
const PROJECTED_SPACE_NODES: readonly RuntimeMenuNode[] = MADEVI_SPACES.map((space) => ({
  id: space.id,
  parentId: space.parentId,
  kind: space.kind,
  label: space.name,
  slug: space.slug,
  href: space.href,
  status: space.status,
  accessLevel: space.accessLevel,
  sortOrder: space.sortOrder,
  sourceRef: 'M00-M08',
}));

const SECONDARY_NODES: readonly RuntimeMenuNode[] = [
  { id: 'explore-science', parentId: 'space-explore', kind: 'DOMAIN', label: 'Sains & Alam', slug: 'sains-alam', href: '/ruang/jelajahi-pengetahuan', status: 'ACTIVE', accessLevel: 'PUBLIC', sortOrder: 10, sourceRef: 'A03-starter' },
  { id: 'school-brochure', parentId: 'space-school', kind: 'MENU', label: 'Brosur Program', slug: 'brosur-program', href: '/brosur-sekolah', status: 'ACTIVE', accessLevel: 'PUBLIC', sortOrder: 10, sourceRef: 'A02-starter' },
];

export const RUNTIME_MENU_NODES: readonly RuntimeMenuNode[] = [
  ...PROJECTED_SPACE_NODES,
  ...SECONDARY_NODES,
];

export function runtimeMenuNode(id: string) { return RUNTIME_MENU_NODES.find((node) => node.id === id) ?? null; }
