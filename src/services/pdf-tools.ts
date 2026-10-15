/**
 * PDF Tools Service — Dokumen & PDF (Prompt 06)
 *
 * Memakai pdf-lib (server-side, Node). Tidak ada koneksi eksternal:
 * berkas diproses dari bytes yang diunggah, hasil dikembalikan sebagai buffer.
 *
 * Kontrak: upload -> konfigurasi -> proses -> unduh.
 * Login-only boleh simpan privat; guest hanya unduh saat itu.
 */

import { PDFDocument, degrees, StandardFonts } from 'pdf-lib';

export type PdfOperation =
  'MERGE' | 'SPLIT' | 'ROTATE' | 'REORDER' | 'DELETE_PAGES' | 'COMPRESS' | 'INFO';

export interface PdfJobResult {
  operation: PdfOperation;
  /** Untuk operasi tunggal-output: bytes hasil. */
  output?: Uint8Array;
  outputName: string;
  /** Untuk SPLIT: banyak output. */
  outputs?: Array<{ name: string; bytes: Uint8Array }>;
  info?: {
    pages: number;
    title?: string;
    author?: string;
    creator?: string;
    encrypted: boolean;
  };
}

function toUint8Array(data: Uint8Array): Uint8Array {
  return data;
}

export class PdfToolsService {
  /** Info dokumen: jumlah halaman, metadata, status enkripsi. */
  async info(bytes: Uint8Array): Promise<PdfJobResult> {
    const doc = await PDFDocument.load(toUint8Array(bytes), { ignoreEncryption: true });
    return {
      operation: 'INFO',
      outputName: 'info',
      info: {
        pages: doc.getPageCount(),
        title: doc.getTitle() || undefined,
        author: doc.getAuthor() || undefined,
        creator: doc.getCreator() || undefined,
        encrypted: doc.isEncrypted,
      },
    };
  }

  /** Gabung beberapa PDF jadi satu, urutan sesuai array input. */
  async merge(files: Array<{ name: string; bytes: Uint8Array }>): Promise<PdfJobResult> {
    if (files.length < 2) throw new Error('MERGE butuh minimal 2 berkas PDF.');
    const out = await PDFDocument.create();
    for (const file of files) {
      const src = await PDFDocument.load(toUint8Array(file.bytes), { ignoreEncryption: true });
      const pages = await out.copyPages(src, src.getPageIndices());
      for (const page of pages) out.addPage(page);
    }
    const output = await out.save();
    return { operation: 'MERGE', output, outputName: 'gabungan.pdf' };
  }

  /** Pecah PDF per halaman → banyak file. */
  async split(bytes: Uint8Array, baseName: string): Promise<PdfJobResult> {
    const src = await PDFDocument.load(toUint8Array(bytes), { ignoreEncryption: true });
    const total = src.getPageCount();
    const outputs: PdfJobResult['outputs'] = [];
    const stem = (baseName || 'dokumen').replace(/\.pdf$/i, '');
    for (let i = 0; i < total; i++) {
      const single = await PDFDocument.create();
      const [page] = await single.copyPages(src, [i]);
      single.addPage(page);
      const out = await single.save();
      outputs.push({ name: `${stem}-halaman-${i + 1}.pdf`, bytes: out });
    }
    return { operation: 'SPLIT', outputName: stem, outputs };
  }

  /** Rotasi halaman tertentu (90/180/270 searah jarum jam). */
  async rotate(bytes: Uint8Array, pages: number[], angle: 90 | 180 | 270): Promise<PdfJobResult> {
    const doc = await PDFDocument.load(toUint8Array(bytes), { ignoreEncryption: true });
    const total = doc.getPageCount();
    const list = pages.filter((p) => Number.isInteger(p) && p >= 1 && p <= total);
    if (list.length === 0) throw new Error('Nomor halaman tidak valid.');
    const allPages = doc.getPages();
    for (const p of list) {
      const page = allPages[p - 1];
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + angle) % 360));
    }
    const output = await doc.save();
    return { operation: 'ROTATE', output, outputName: 'dirotasi.pdf' };
  }

  /** Susun ulang urutan halaman berdasarkan array indeks baru (1-based). */
  async reorder(bytes: Uint8Array, newOrder: number[]): Promise<PdfJobResult> {
    const src = await PDFDocument.load(toUint8Array(bytes), { ignoreEncryption: true });
    const total = src.getPageCount();
    const order = newOrder.filter((p) => Number.isInteger(p) && p >= 1 && p <= total);
    if (order.length !== total)
      throw new Error('Urutan baru harus mencakup semua halaman tepat sekali.');
    const out = await PDFDocument.create();
    const copied = await out.copyPages(
      src,
      order.map((p) => p - 1),
    );
    for (const page of copied) out.addPage(page);
    const output = await out.save();
    return { operation: 'REORDER', output, outputName: 'disusun-ulang.pdf' };
  }

  /** Hapus halaman tertentu. */
  async deletePages(bytes: Uint8Array, pagesToDelete: number[]): Promise<PdfJobResult> {
    const src = await PDFDocument.load(toUint8Array(bytes), { ignoreEncryption: true });
    const total = src.getPageCount();
    const remove = new Set(
      pagesToDelete.filter((p) => Number.isInteger(p) && p >= 1 && p <= total),
    );
    const keep = [];
    for (let i = 1; i <= total; i++) if (!remove.has(i)) keep.push(i);
    if (keep.length === 0) throw new Error('Tidak boleh menghapus semua halaman.');
    const out = await PDFDocument.create();
    const copied = await out.copyPages(
      src,
      keep.map((p) => p - 1),
    );
    for (const page of copied) out.addPage(page);
    const output = await out.save();
    return { operation: 'DELETE_PAGES', output, outputName: 'dihapus-halaman.pdf' };
  }

  /**
   * Kompres / optimasi: tulis ulang tanpa metadata lengkap dan dengan
   * objek dialokasikan ulat (pdf-lib menggunakan object streams saat save
   * dengan useObjectStreams). Ini optimasi struktur, bukan kompresi gambar.
   */
  async compress(bytes: Uint8Array): Promise<PdfJobResult> {
    const src = await PDFDocument.load(toUint8Array(bytes), { ignoreEncryption: true });
    const out = await PDFDocument.create();
    const copied = await out.copyPages(src, src.getPageIndices());
    for (const page of copied) out.addPage(page);
    const output = await out.save({ useObjectStreams: true });
    return {
      operation: 'COMPRESS',
      output,
      outputName: 'dioptimasi.pdf',
      info: { pages: out.getPageCount(), encrypted: false },
    };
  }
}

/** Utilitas format ukuran untuk UI. */
export function formatBytes(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(n) / Math.log(1024)));
  return `${(n / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export { StandardFonts, PDFDocument };
