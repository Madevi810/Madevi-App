/**
 * Verifikasi perlindungan Madevi Line (INSTRUKSI-03).
 *
 * Level unit murni — tidak butuh database atau server (sesuai INSTRUKSI-02):
 *   1. Filter kata terlarang dari file konfigurasi
 *   2. Deteksi krisis Sosial Curhat
 *   3. Normalisasi pencocokan
 *   4. Kategori laporan
 *   5. Batas rate (konstanta)
 *   6. Komponen CrisisHelpCard render kondisional
 */

import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import {
  BLOCKED_WORDS,
  CRISIS_HELP,
  CRISIS_INDICATORS,
  LINE_RATE_LIMITS,
  REPORT_CATEGORIES,
  findBlockedWord,
  findCrisisIndicator,
  normalizeForMatching,
} from '@/server/moderation/blocked-words';

describe('INSTRUKSI-03 item #1 — filter kata terlarang', () => {
  it('menahan postingan yang mengandung kata pornografi', () => {
    const hit = findBlockedWord('Ini video porno gratis');
    expect(hit).not.toBeNull();
    expect(hit!.category).toBe('PORNOGRAFI');
  });

  it('menahan ancaman dalam bahasa Indonesia', () => {
    const hit = findBlockedWord('Kamu akan saya habisi besok');
    expect(hit).not.toBeNull();
    expect(hit!.category).toBe('ANCAMAN');
  });

  it('menahan instruksi kekerasan', () => {
    const hit = findBlockedWord('Saya mencari cara merakit bom');
    expect(hit).not.toBeNull();
    expect(hit!.category).toBe('KEKERASAN');
  });

  it('menahan pelecehan', () => {
    const hit = findBlockedWord('Kamu itu bodoh banget sih lo');
    expect(hit).not.toBeNull();
    expect(hit!.category).toBe('PELECEHAN');
  });

  it('menahan SARA kasar', () => {
    const hit = findBlockedWord('Dasar kafir, pulang saja');
    expect(hit).not.toBeNull();
    expect(hit!.category).toBe('SARA');
  });

  it('mendeteksi ejaan alay setelah normalisasi', () => {
    // NFKC + lower harusnya menangkap varian huruf besar/kecil campuran.
    const hit = findBlockedWord('BOKEP terbaru nih');
    expect(hit).not.toBeNull();
  });

  it('membiarkan teks yang aman', () => {
    expect(findBlockedWord('Hari ini belajar matematika di sekolah')).toBeNull();
    expect(findBlockedWord('')).toBeNull();
    expect(findBlockedWord('   ')).toBeNull();
  });

  it('membiarkan diskusi edukasi tentang kekerasan sejarah', () => {
    // Filter kata tidak memblokir diskusi akademik — engine membedakan via
    // educational context. Filter kata hanya frasa spesifik.
    expect(findBlockedWord('Pembahasan sejarah Perang Dunia di kelas')).toBeNull();
  });

  it('setiap entri daftar memiliki kategori yang valid & pattern non-kosong', () => {
    expect(BLOCKED_WORDS.length).toBeGreaterThan(50);
    for (const entry of BLOCKED_WORDS) {
      expect(entry.pattern.length).toBeGreaterThan(0);
      expect([
        'PORNOGRAFI',
        'ANCAMAN',
        'KEKERASAN',
        'PELECEHAN',
        'SARA',
      ]).toContain(entry.category);
      // Pattern harus lowercase (dicocokkan setelah normalisasi lower).
      expect(entry.pattern).toBe(entry.pattern.toLowerCase());
    }
  });
});

describe('INSTRUKSI-03 item #4 — deteksi krisis Sosial Curhat', () => {
  it('mendeteksi indikasi bunuh diri', () => {
    expect(findCrisisIndicator('Aku ingin bunuh diri malam ini')).not.toBeNull();
    expect(findCrisisIndicator('Aku mau mengakhiri hidupku')).not.toBeNull();
  });

  it('mendeteksi indikasi menyakiti diri', () => {
    expect(findCrisisIndicator('Aku selalu ingin melukai diri sendiri')).not.toBeNull();
  });

  it('mendeteksi putus asa / beban', () => {
    expect(findCrisisIndicator('Semua lebih baik tanpa aku')).not.toBeNull();
    expect(findCrisisIndicator('Aku merasa beban keluarga')).not.toBeNull();
  });

  it('membiarkan curhat biasa tanpa indikasi krisis', () => {
    expect(findCrisisIndicator('Hari ini aku sedih karena diomeli bos')).toBeNull();
    expect(findCrisisIndicator('')).toBeNull();
  });

  it('sumber daya bantuan memuat hotline Kemenkes 119 ext 8', () => {
    expect(CRISIS_HELP.hotlineId).toContain('119');
    expect(CRISIS_HELP.hotlineId).toContain('ext 8');
    expect(CRISIS_HELP.messageId.length).toBeGreaterThan(50);
    expect(CRISIS_HELP.messageEn.length).toBeGreaterThan(50);
  });

  it('setiap indikator krisis adalah frasa lowercase non-kosong', () => {
    expect(CRISIS_INDICATORS.length).toBeGreaterThan(20);
    for (const indicator of CRISIS_INDICATORS) {
      expect(indicator.length).toBeGreaterThan(2);
      expect(indicator).toBe(indicator.toLowerCase());
    }
  });
});

describe('INSTRUKSI-03 item #2 — kategori laporan', () => {
  it('menyediakan 6 kategori sesuai instruksi', () => {
    const keys = REPORT_CATEGORIES.map((c) => c.key);
    expect(keys).toContain('PORNOGRAFI');
    expect(keys).toContain('ANCAMAN');
    expect(keys).toContain('KEKERASAN');
    expect(keys).toContain('PELECEHAN');
    expect(keys).toContain('SPAM');
    expect(keys).toContain('LAINNYA');
  });

  it('setiap kategori punya label ID dan EN', () => {
    for (const cat of REPORT_CATEGORIES) {
      expect(cat.key.length).toBeGreaterThan(0);
      expect(cat.labelId.length).toBeGreaterThan(0);
      expect(cat.labelEn.length).toBeGreaterThan(0);
    }
  });
});

describe('INSTRUKSI-03 item #6 — batas rate', () => {
  it('mengikuti angka dari instruksi: 10 postingan/jam, 30 komen/jam', () => {
    expect(LINE_RATE_LIMITS.postsPerHour).toBe(10);
    expect(LINE_RATE_LIMITS.commentsPerHour).toBe(30);
  });
});

describe('normalisasi pencocokan', () => {
  it('NFKC + lower + trim', () => {
    expect(normalizeForMatching('  Halo Dunia  ')).toBe('halo dunia');
    // Karakter kompatibilitas NFKC (fullwidth → normal).
    expect(normalizeForMatching('Ｐｏｒｎｏ')).toBe('porno');
  });
});

describe('INSTRUKSI-03 item #4 — CrisisHelpCard render', () => {
  // renderToStaticMarkup butuh komponen; import dinamis agar tidak membebani
  // test file lain yang tidak peduli React.
  it('render kartu bantuan saat indikasi krisis ada', async () => {
    const { CrisisHelpCard } = await import('@/components/crisis-help-card');
    const html = renderToStaticMarkup(
      createElement(CrisisHelpCard, {
        body: 'Aku ingin bunuh diri malam ini',
        isId: true,
      }),
    );
    expect(html).toContain('119');
    expect(html).toContain('ext 8');
    expect(html).toContain('Kamu tidak sendirian');
    expect(html).toContain('Kemenkes');
  });

  it('tidak render kartu untuk curhat biasa', async () => {
    const { CrisisHelpCard } = await import('@/components/crisis-help-card');
    const html = renderToStaticMarkup(
      createElement(CrisisHelpCard, {
        body: 'Hari ini lelah sekali kerja',
        isId: true,
      }),
    );
    expect(html).toBe('');
  });

  it('render label EN saat isId false', async () => {
    const { CrisisHelpCard } = await import('@/components/crisis-help-card');
    const html = renderToStaticMarkup(
      createElement(CrisisHelpCard, {
        body: 'I want to end my life tonight',
        isId: false,
      }),
    );
    expect(html).toContain('You are not alone');
  });
});
