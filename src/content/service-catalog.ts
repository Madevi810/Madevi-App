export type RuntimeServiceCatalogItem = {
  id: string;
  kind: 'LAYOUT';
  title: string;
  summary: string;
  price: number;
  currency: 'IDR';
  license: 'MADEVI_PERSONAL';
  revisionLimit: number;
  version: '1.0.0';
  status: 'PUBLISHED';
  previewMode: 'WATERMARKED_SAMPLE' | 'PUBLIC_SAMPLE';
};

/**
 * Runtime projection of the F01 registry — KONTRAK DESAIN STATIS, BUKAN status database.
 * L06: array ini tidak boleh menentukan availability/published state runtime.
 * Galeri wajib membaca API katalog terbit; fallback ini hanya contoh tata letak
 * berlabel CONTOH (preview-only, tidak dapat dipesan sebagai template terbit).
 * Harga di sini adalah nilai contoh single-source untuk preview; harga produksi
 * hanya dari registry Admin via API.
 */
export const RUNTIME_LAYOUT_CATALOG: readonly RuntimeServiceCatalogItem[] = [
  { id: 'layout-undangan-a', kind: 'LAYOUT', title: 'Layout Undangan A · Ringkas', summary: 'Satu halaman responsif untuk kebutuhan acara inti.', price: 0, currency: 'IDR', license: 'MADEVI_PERSONAL', revisionLimit: 1, version: '1.0.0', status: 'PUBLISHED', previewMode: 'PUBLIC_SAMPLE' },
  { id: 'layout-undangan-b', kind: 'LAYOUT', title: 'Layout Undangan B · Cerita', summary: 'Multi-section, galeri terbatas, dan RSVP placeholder.', price: 30000, currency: 'IDR', license: 'MADEVI_PERSONAL', revisionLimit: 2, version: '1.0.0', status: 'PUBLISHED', previewMode: 'WATERMARKED_SAMPLE' },
  { id: 'layout-undangan-c', kind: 'LAYOUT', title: 'Layout Undangan C · Interaktif', summary: 'Timeline acara, anchor navigation, dan konfigurasi tema.', price: 40000, currency: 'IDR', license: 'MADEVI_PERSONAL', revisionLimit: 2, version: '1.0.0', status: 'PUBLISHED', previewMode: 'WATERMARKED_SAMPLE' },
];
