import { describe, expect, it } from 'vitest';

import {
  ATURAN_JUMLAH_UMUM,
  DAFTAR_HEWAN_AQIQAH,
  DISCLAIMER_AQIQAH,
  HARI_SUNNAH,
  formatAqiqahTeks,
  hewanAqiqahDariId,
  hitungAqiqah,
  tanggalSunnah,
} from '@/services/aqiqah';

describe('daftar hewan & aturan umum aqiqah', () => {
  it('2 hewan: kambing & domba dengan bobot acuan', () => {
    expect(DAFTAR_HEWAN_AQIQAH.map((h) => h.id)).toEqual(['kambing', 'domba']);
    expect(hewanAqiqahDariId('kambing')!.bobotAcuanKg).toBe(30);
    expect(hewanAqiqahDariId('ayam')).toBeNull();
  });

  it('aturan umum: L=2 ekor, P=1 ekor', () => {
    expect(ATURAN_JUMLAH_UMUM).toEqual({ L: 2, P: 1 });
    expect(HARI_SUNNAH).toEqual([7, 14, 21]);
  });
});

describe('tanggalSunnah', () => {
  it('lahir 2026-01-01 → 7, 14, 21 Jan 2026', () => {
    const t = tanggalSunnah('2026-01-01');
    expect(t.map((x) => x.tanggal)).toEqual([
      '2026-01-07',
      '2026-01-14',
      '2026-01-21',
    ]);
    expect(t[0].hariKe).toBe(7);
  });

  it('tanggal lahir masa depan ditolak', () => {
    expect(() => tanggalSunnah('2999-01-01')).toThrow('masa depan');
  });

  it('tanggal tidak nyata ditolak', () => {
    expect(() => tanggalSunnah('2026-02-30')).toThrow('nyata');
    expect(() => tanggalSunnah('01-01-2026')).toThrow('YYYY-MM-DD');
  });
});

describe('hitungAqiqah — hitungan dasar', () => {
  it('anak laki-laki → 2 ekor kambing, daging 27 kg', () => {
    const h = hitungAqiqah({
      jenisKelamin: 'L',
      tanggalLahir: '2026-01-01',
      hewan: 'kambing',
    });
    expect(h.jumlahEkor).toBe(2);
    expect(h.estimasiDagingKg).toBe(27); // 2 × 30 × 0,45
    expect(h.timeline).toHaveLength(3);
    expect(h.totalBiayaRp).toBeNull(); // tanpa harga → tidak menebak
    expect(h.peringatan.some((p) => p.includes('belum mengisi harga'))).toBe(true);
  });

  it('anak perempuan → 1 ekor domba', () => {
    const h = hitungAqiqah({
      jenisKelamin: 'P',
      tanggalLahir: '2026-03-10',
      hewan: 'domba',
    });
    expect(h.jumlahEkor).toBe(1);
    expect(h.estimasiDagingKg).toBe(15.75); // 1 × 35 × 0,45
  });

  it('override jumlah ekor dihormati', () => {
    const h = hitungAqiqah({
      jenisKelamin: 'L',
      tanggalLahir: '2026-01-01',
      hewan: 'kambing',
      jumlahEkor: 1,
    });
    expect(h.jumlahEkor).toBe(1);
    expect(h.estimasiDagingKg).toBe(13.5);
  });

  it('total biaya hanya dari harga input user', () => {
    const h = hitungAqiqah({
      jenisKelamin: 'P',
      tanggalLahir: '2026-01-01',
      hewan: 'kambing',
      hargaPerEkorRp: 1500000,
      biayaMasakPerEkorRp: 300000,
    });
    expect(h.totalBiayaRp).toBe(1800000);
    expect(h.rincianBiaya).toHaveLength(2);
  });

  it('input invalid ditolak', () => {
    const dasar = { tanggalLahir: '2026-01-01', hewan: 'kambing' as const };
    expect(() => hitungAqiqah({ ...dasar, jenisKelamin: 'X' as never })).toThrow(
      'Jenis kelamin',
    );
    expect(() =>
      hitungAqiqah({ ...dasar, jenisKelamin: 'L', jumlahEkor: 0 }),
    ).toThrow('Jumlah ekor');
    expect(() =>
      hitungAqiqah({ ...dasar, jenisKelamin: 'L', hargaPerEkorRp: -1 }),
    ).toThrow('Harga per ekor');
  });
});

describe('formatAqiqahTeks', () => {
  it('memuat jadwal, daging, biaya, dan disclaimer', () => {
    const h = hitungAqiqah({
      jenisKelamin: 'L',
      tanggalLahir: '2026-01-01',
      hewan: 'kambing',
      hargaPerEkorRp: 1500000,
    });
    const teks = formatAqiqahTeks(h, 'Ahmad');
    expect(teks).toContain('Ahmad');
    expect(teks).toContain('2026-01-07');
    expect(teks).toContain('2 ekor Kambing');
    expect(teks).toContain('Rp3.000.000');
    expect(teks).toContain(DISCLAIMER_AQIQAH);
  });
});
