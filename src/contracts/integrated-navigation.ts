import { MADEVI_SPACES } from './navigation';

/** Canonical runtime menu seed. Domain packages may extend this only via L08. */
export const INTEGRATED_NAVIGATION = MADEVI_SPACES.map((space) => ({
  id: space.id,
  parentId: space.parentId,
  kind: space.kind,
  label: space.name,
  slug: space.slug,
  status: space.status,
  sortOrder: space.sortOrder,
  accessLevel: space.accessLevel,
  sourceRef: space.sourceRef,
  schemaVersion: space.schemaVersion,
  href: space.href,
  aliases: space.aliases,
  group: space.group,
  colorTheme: space.colorTheme,
}));

export function integratedNavigationBySlug(slug: string) {
  return INTEGRATED_NAVIGATION.find((node) => node.slug === slug) ?? null;
}
