'use client';

import { useEffect, useState } from 'react';

type RuntimePackage = {
  packageId: string;
  packageKind: string;
  version: string;
  schemaVersion: string;
  status: string;
  accessLevel?: string;
  sourceRef: string;
  licenseRef?: string;
  checksum: string | null;
  rollbackReference?: string;
  publishedAt?: string | null;
};

type SourceClassification = 'AVAILABLE' | 'UNAVAILABLE';
type ApiState = 'fixture' | 'loading' | 'available' | 'empty' | 'error';

/**
 * This is deliberately an allow-list of manifests inspected under
 * database/seeds/taxonomy/packages. A sourceRef is AVAILABLE only when its referenced
 * manifest is known to exist locally; no path is inferred from the ref.
 */
const VERIFIED_LOCAL_MANIFESTS: Record<string, string> = {
  'Menu/Export/menu-pilot-explore-import-v1.json':
    'database/seeds/taxonomy/packages/taxonomy/madevi-explore-pilot-v1.json',
};

function classifySource(sourceRef: string): {
  status: SourceClassification;
  localManifest?: string;
} {
  const localManifest = VERIFIED_LOCAL_MANIFESTS[sourceRef];
  return localManifest
    ? { status: 'AVAILABLE', localManifest }
    : { status: 'UNAVAILABLE' };
}

const DRAFT_PACKAGES: RuntimePackage[] = [
  { packageId: 'madevi-feature-template-runtime-v1', packageKind: 'FEATURE_TEMPLATE', version: '1.0.0', schemaVersion: 'feature-template.runtime.v1', status: 'DRAFT', sourceRef: 'Fitur-Template/Export/feature-template-draft-manifest-v1.json', checksum: null },
  { packageId: 'madevi-menu-runtime-v1', packageKind: 'MENU', version: '1.0.0', schemaVersion: 'menu.export.v1', status: 'DRAFT', sourceRef: 'Menu/Export/menu-canonical-v1-manifest.json', checksum: null },
  { packageId: 'madevi-article-starters-v1', packageKind: 'ARTICLE', version: '1.0.0', schemaVersion: 'article.export-index.v1', status: 'DRAFT', sourceRef: 'Artikel/Export/article-batches-index-v1.json', checksum: null },
];

/**
 * L06: panel Admin membaca tabel runtime_content_packages yang sama dengan
 * runtime menu (DTO metadata/storage sama). Draft tidak dipromosikan di sini;
 * promosi hanya L08/Admin. Baris tidak valid dilaporkan, bukan disembunyikan.
 */
export function FeaturePackagePanel() {
  const [packages, setPackages] = useState<RuntimePackage[]>(DRAFT_PACKAGES);
  const [invalid, setInvalid] = useState<Array<{ packageId: string; reason: string }>>([]);
  const [apiState, setApiState] = useState<ApiState>('fixture');
  useEffect(() => {
    setApiState('loading');
    fetch('/api/v1/owner/content-packages')
      .then((response) => {
        if (!response.ok) throw new Error(`content-packages HTTP ${response.status}`);
        return response.json();
      })
      .then((body) => {
        if (!body?.data) throw new Error('content-packages response missing data');
        // Bentuk baru L06: { packages, invalid }. Bentuk lama: array langsung.
        if (Array.isArray(body.data)) {
          setPackages(body.data);
          setInvalid([]);
          setApiState(body.data.length === 0 ? 'empty' : 'available');
        } else if (Array.isArray(body.data.packages)) {
          setPackages(body.data.packages);
          setInvalid(Array.isArray(body.data.invalid) ? body.data.invalid : []);
          setApiState(body.data.packages.length === 0 ? 'empty' : 'available');
        } else {
          throw new Error('content-packages data has invalid shape');
        }
      })
      .catch(() => setApiState('error'));
  }, []);
  return <section className="owner-dashboard" aria-labelledby="package-heading">
    <h1 id="package-heading">Paket Konten Runtime</h1>
    <p>Preview status paket runtime. Paket draft tetap terlihat dan tidak dipromosikan otomatis.</p>
    {apiState === 'fixture' && <p role="status">Menampilkan fixture DRAFT; storage sedang dibaca.</p>}
    {apiState === 'loading' && <p role="status">Membaca storage paket…</p>}
    {apiState === 'error' && <p role="alert">Storage paket tidak dapat dibaca. Fixture DRAFT tetap ditampilkan; status storage tidak diketahui.</p>}
    {apiState === 'empty' && <p role="status">Storage paket terbaca, tetapi belum memiliki paket.</p>}
    <div className="article-card-grid">{packages.map((item) => <article className="article-card" key={item.packageId}>
      {(() => {
        const source = classifySource(item.sourceRef);
        return <>
          <h2>{item.packageKind}</h2><p><strong>{item.packageId}</strong> · v{item.version}</p>
      <p>Status: <strong>{item.status}</strong>{item.status !== 'PUBLISHED' ? ' · DRAFT tidak aktif di menu runtime' : ''}</p><p>Schema: {item.schemaVersion}</p>
          <p>Checksum: {item.checksum ?? 'belum dibuat'}</p>
          <p className="article-meta">Referensi sumber: {item.sourceRef}</p>
          <p>Sumber lokal: <strong>{source.status}</strong>{source.localManifest ? ` · ${source.localManifest}` : ' · manifest lokal tidak tersedia'}</p>
        </>;
      })()}
    </article>)}</div>
    {invalid.length > 0 && (
      <div role="alert" aria-label="Paket tidak valid">
        <h2>INVALID — paket tidak valid ({invalid.length})</h2>
        <ul>
          {invalid.map((row) => (
            <li key={row.packageId}><strong>{row.packageId}</strong>: {row.reason}</li>
          ))}
        </ul>
      </div>
    )}
  </section>;
}
