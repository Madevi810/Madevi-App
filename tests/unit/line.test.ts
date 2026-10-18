import { describe, it, expect } from 'vitest';
import {
  praModerasi, validasiPostingan, PESAN_DARURAT_CURHAT,
  levelReputasi, ritualHariIni, bolehPosting, tentukanSanksi, pilihKaryaMingguan,
  ATURAN_KOMUNITAS,
} from '@/services/line';

describe('pra-moderasi', () => {
  it('postingan normal tidak perlu tinjau', () => {
    expect(praModerasi('Hari ini saya membuat kue yang enak!').perluTinjau).toBe(false);
  });

  it('indikasi krisis memicu darurat + pesan bantuan', () => {
    const h = praModerasi('Aku pengen mati rasanya');
    expect(h.perluTinjau).toBe(true);
    expect(h.darurat).toBe(true);
    expect(PESAN_DARURAT_CURHAT).toContain('119');
  });
});

describe('validasi postingan', () => {
  it('isi kosong ditolak', () => {
    expect(validasiPostingan({ isi: '', tipe: 'karya' })).toContain('Isi postingan belum diisi');
  });

  it('isi terlalu panjang ditolak', () => {
    expect(validasiPostingan({ isi: 'x'.repeat(5001), tipe: 'curhat' }).length).toBeGreaterThan(0);
  });

  it('postingan valid lolos', () => {
    expect(validasiPostingan({ isi: 'Halo dunia', tipe: 'karya' })).toEqual([]);
  });
});

describe('reputasi apresiasi', () => {
  it('skor 0 = pemula', () => {
    expect(levelReputasi(0)).toBe('pemula');
  });

  it('skor 50 = kontributor', () => {
    expect(levelReputasi(50)).toBe('kontributor');
  });

  it('skor 500 = legenda', () => {
    expect(levelReputasi(500)).toBe('legenda');
  });
});

describe('ritual mingguan', () => {
  it('senin = ritual karya', () => {
    // 2026-10-19 adalah Senin
    const r = ritualHariIni(new Date(2026, 9, 19));
    expect(r.some((x) => x.id === 'karya-senin')).toBe(true);
  });

  it('jumat = ritual curhat', () => {
    // 2026-10-23 adalah Jumat
    const r = ritualHariIni(new Date(2026, 9, 23));
    expect(r.some((x) => x.id === 'curhat-jumat')).toBe(true);
  });

  it('rabu = tidak ada ritual', () => {
    expect(ritualHariIni(new Date(2026, 9, 21))).toEqual([]);
  });
});

describe('gerbang partisipasi', () => {
  it('belum setuju aturan = tidak boleh posting', () => {
    expect(bolehPosting(false, 100).boleh).toBe(false);
  });

  it('akun baru < 24 jam = tidak boleh posting', () => {
    const h = bolehPosting(true, 5);
    expect(h.boleh).toBe(false);
    expect(h.alasan).toContain('24 jam');
  });

  it('member lama + setuju = boleh', () => {
    expect(bolehPosting(true, 100).boleh).toBe(true);
  });
});

describe('tangga sanksi', () => {
  it('pelanggaran berat langsung banned', () => {
    expect(tentukanSanksi(1, true).sanksi).toBe('banned');
  });

  it('pelanggaran 1 = peringatan', () => {
    expect(tentukanSanksi(1, false).sanksi).toBe('peringatan');
  });

  it('pelanggaran 4 = banned', () => {
    expect(tentukanSanksi(4, false).sanksi).toBe('banned');
  });
});

describe('karya pilihan mingguan', () => {
  it('pilih skor tertinggi bila admin tidak memilih', () => {
    const k = pilihKaryaMingguan([
      { id: 'a', suka: 10 },
      { id: 'b', suka: 30 },
    ]);
    expect(k?.postinganId).toBe('b');
    expect(k?.dipilihAdmin).toBe(false);
  });

  it('pilihan admin mengalahkan skor', () => {
    const k = pilihKaryaMingguan(
      [{ id: 'a', suka: 10 }, { id: 'b', suka: 30 }],
      'a',
      'Kualitas lebih baik',
    );
    expect(k?.postinganId).toBe('a');
    expect(k?.dipilihAdmin).toBe(true);
  });

  it('tanpa kandidat = null', () => {
    expect(pilihKaryaMingguan([])).toBeNull();
  });
});

describe('aturan komunitas', () => {
  it('ada 7 aturan', () => {
    expect(ATURAN_KOMUNITAS).toHaveLength(7);
  });
});
