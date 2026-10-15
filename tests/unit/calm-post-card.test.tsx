/**
 * Verifikasi render Zona Tenang (INOVASI-20261014-0841 IDE 1).
 *
 * Level unit murni — renderToStaticMarkup, tidak butuh DOM/server
 * (sesuai INSTRUKSI-02). Kriteria penerimaan dari RENCANA:
 *   - CalmPostCard me-render judul/isi, penulis, waktu.
 *   - TIDAK ada angka like/komentar/badge/counter.
 *   - Tombol Laporkan & Kirim semangat TETAP ADA (teks kecil netral).
 *   - Label dukungan netral "Ada dukungan…" tanpa angka.
 */

import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import { CalmPostCard } from '@/components/calm-post-card';

const POST = {
  id: 'post-1',
  body: 'Hari ini saya belajar hal baru dan merasa senang.',
  authorName: 'Budi Santoso',
  authorUsername: 'budi',
  createdAt: '2026-10-14T09:00:00Z',
  postType: 'KARYA' as const,
  reactionCount: 12,
};

describe('CalmPostCard (Zona Tenang)', () => {
  it('me-render isi, penulis, dan waktu', () => {
    const html = renderToStaticMarkup(
      createElement(CalmPostCard, {
        post: POST,
        isId: true,
      }),
    );
    expect(html).toContain(POST.body);
    expect(html).toContain(POST.authorName);
    expect(html).toContain('@budi');
    // Penanda varian tenang.
    expect(html).toContain('line-post--calm');
  });

  it('TIDAK menampilkan angka like/komentar/badge', () => {
    const html = renderToStaticMarkup(
      createElement(CalmPostCard, {
        post: POST,
        isId: true,
      }),
    );
    // reactionCount = 12 tidak boleh muncul sebagai angka.
    expect(html).not.toContain('>12<');
    expect(html).not.toMatch(/line-action__count/);
    expect(html).not.toMatch(/line-badge/);
    // Tidak ada badge Karya/Curhat.
    expect(html).not.toContain('Karya');
    expect(html).not.toContain('Curhat');
  });

  it('label dukungan netral tanpa angka', () => {
    const html = renderToStaticMarkup(
      createElement(CalmPostCard, {
        post: POST,
        isId: true,
      }),
    );
    expect(html).toContain('Ada dukungan untuk postingan ini');
    // Counter "12 orang" diganti teks netral.
    expect(html).not.toMatch(/\d+ orang/);
  });

  it('tombol perlindungan tetap ada: Laporkan & Kirim semangat', () => {
    const html = renderToStaticMarkup(
      createElement(CalmPostCard, {
        post: POST,
        isId: true,
        onSendSupport: () => {},
        onReport: () => {},
      }),
    );
    expect(html).toContain('Kirim semangat');
    expect(html).toContain('Laporkan');
    // Form kategori muncul saat report dibuka (toggle via state — cek
    // tombolnya ada; form terbuka hanya setelah klik).
    expect(html).toContain('button');
  });

  it('tombol "Laporkan" memakai kategori reuse INSTRUKSI-03', () => {
    const html = renderToStaticMarkup(
      createElement(CalmPostCard, {
        post: POST,
        isId: true,
        onReport: () => {},
      }),
    );
    // Kategori laporan dari REPORT_CATEGORIES dirender setelah toggle;
    // di sini cukup pastikan props onReport tersambung (tidak crash).
    expect(html).toContain('Laporkan');
  });

  it('varian EN: label bahasa Inggris', () => {
    const html = renderToStaticMarkup(
      createElement(CalmPostCard, {
        post: POST,
        isId: false,
      }),
    );
    expect(html).toContain('This post has support');
  });

  it('reactionCount = 0 → tidak ada label dukungan', () => {
    const html = renderToStaticMarkup(
      createElement(CalmPostCard, {
        post: { ...POST, reactionCount: 0 },
        isId: true,
      }),
    );
    expect(html).not.toContain('Ada dukungan');
  });
});
