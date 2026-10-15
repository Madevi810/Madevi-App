/**
 * Runtime-facing shape for L04/F01-F05 catalog packages.
 * Only records transformed and approved by L08 may be passed to UI loaders.
 */
export const FEATURE_REGISTRY_SCHEMA = 'feature-template.runtime.v1' as const;

export type FeatureRegistryKind = 'LAYOUT' | 'CUSTOM_SERVICE' | 'PCB_LAYOUT' | 'TOOL' | 'SHOP';
export type FeaturePublicationStatus = 'DRAFT' | 'PROPOSED' | 'PUBLISHED' | 'ARCHIVED';

export interface FeatureRegistryItem {
  id: string;
  packageId: string;
  kind: FeatureRegistryKind;
  title: string;
  summary: string;
  version: string;
  status: FeaturePublicationStatus;
  accessLevel: 'PUBLIC' | 'MEMBER' | 'PLUS' | 'PRO' | 'LOVE';
  price?: { currency: 'IDR'; amount: number; model: 'FREE' | 'FIXED_UNIT' | 'QUOTE' };
  previewRef: string;
  licenseRef: string;
  sourceRef: string;
}

/** Runtime must never render draft/proposed records as published catalog items. */
export function publishedFeatureItems(items: readonly FeatureRegistryItem[]) {
  return items.filter((item) => item.status === 'PUBLISHED');
}

export const FEATURE_REGISTRY_IMPORT_RULE =
  'Load only from an L08-approved manifest; never read Draft-HTML or Export directly at runtime.';
