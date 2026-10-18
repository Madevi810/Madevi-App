import { describe, it, expect } from 'vitest';
import { validasiTutorial, ringkasanTutorial, type Tutorial } from '@/services/tutorial';

const tutorialValid: Tutorial = {
  id: 't1',
  slug: 'cara-ganti-bohlam',
  judul: 'Cara Mengganti Bohlam Lampu',
  kategori: 'perbaikan',
  tingkat: 'pemula',
  estimasiMenit: 15,
  masalah: 'Lampu mati dan ruangan gelap.',
  penjelasan: 'Bohlam putus karena filamen habis masa pakai.',
  persiapanAlat: ['Tangga', 'Bohlam baru', 'Sarung tangan'],
  langkah: [
    { judul: 'Matikan saklar', detail: 'Pastikan saklar dalam posisi mati.' },
    { judul: 'Lepas bohlam lama', detail: 'Putar berlawanan arah jarum jam.' },
  ],
  risiko: [{ risiko: 'Kesetrum', pencegahan: 'Matikan saklar dan MCB bila perlu.' }],
  penyelesaian: 'Lampu menyala kembali dengan bohlam baru.',
  tags: ['listrik', 'rumah'],
  dibuatPada: '2026-10-18',
  diperbaruiPada: '2026-10-18',
};

describe('validasi tutorial', () => {
  it('tutorial lengkap lolos tanpa masalah', () => {
    expect(validasiTutorial(tutorialValid)).toEqual([]);
  });

  it('menolak tutorial tanpa penyelesaian', () => {
    const t = { ...tutorialValid, penyelesaian: '' };
    expect(validasiTutorial(t).some((m) => m.includes('Penyelesaian WAJIB'))).toBe(true);
  });

  it('menolak tutorial tanpa langkah', () => {
    const t = { ...tutorialValid, langkah: [] };
    expect(validasiTutorial(t)).toContain('Belum ada langkah cara');
  });
});

describe('ringkasan tutorial', () => {
  it('memuat masalah dan penyelesaian', () => {
    const r = ringkasanTutorial(tutorialValid);
    expect(r).toContain('MASALAH:');
    expect(r).toContain('PENYELESAIAN:');
    expect(r).toContain('2 langkah');
  });
});
