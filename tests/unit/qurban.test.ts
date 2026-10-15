import { describe, expect, it } from 'vitest';

import {
  DAFTAR_HEWAN,
  PEMBAGIAN_SEPERTIGA,
  formatQurbanTeks,
  hewanDariId,
  hitungQurban,
} from '@/services/qurban';

describe('daftar hewan qurban', () => {
  it('5 jenis hewan dengan rendemen & maks patungan', () => {
    expect(DAFTAR_HEWAN.map((h) => h.id)).toEqual([
      'sapi',
      'kerbau',
      'kambing',
      'domba',
      'unta',
    ]);
    expect(hewanDariId('sapi')!.maksPatungan).toBe(7);
    expect(hewanDariId('kambing')!.maksPatungan).toBe(1);
  });

  it('hewan tak dikenal → null', () => {
    expect(hewanDariId('ayam')).toBeNull();
  });

  it('pembagian default = sepertiga', () => {
    expect(PEMBAGIAN_SEPERTIGA.shohibul).toBeCloseTo(1 / 3);
    expect(PEMBAGIAN_SEPERTIGA.fakirMiskin).toBeCloseTo(1 / 3);
    expect(PEMBAGIAN_SEPERTIGA.kerabat).toBeCloseTo(1 / 3);
  });
});

describe('hitungQurban — hitungan dasar', () => {
  it('1 sapi 350 kg rendemen 50% → 175 kg, sepertiga ≈ 58,33 kg', () => {
    const h = hitungQurban({ hewan: 'sapi', jumlahHewan: 1 });
    expect(h.totalDagingKg).toBe(175);
    expect(h.alokasi[0].dagingKg).toBeCloseTo(58.33, 2);
    expect(h.alokasi[1].dagingKg).toBeCloseTo(58.33, 2);
    expect(h.alokasi[2].dagingKg).toBeCloseTo(58.33, 2);
  });

  it('2 kambing 30 kg rendemen 45% → 27 kg', () => {
    const h = hitungQurban({ hewan: 'kambing', jumlahHewan: 2 });
    expect(h.totalDagingKg).toBe(27);
  });

  it('bobot & rendemen kustom dipakai', () => {
    const h = hitungQurban({
      hewan: 'sapi',
      jumlahHewan: 1,
      bobotKg: 400,
      rendemen: 0.52,
    });
    expect(h.totalDagingKg).toBe(208);
  });

  it('rasio kustom 50/30/20', () => {
    const h = hitungQurban({
      hewan: 'kambing',
      jumlahHewan: 1,
      rasio: { shohibul: 0.5, fakirMiskin: 0.3, kerabat: 0.2 },
    });
    expect(h.alokasi[0].dagingKg).toBeCloseTo(6.75, 2);
    expect(h.peringatan.some((p) => p.includes('SEPERTIGA'))).toBe(false);
  });

  it('berat per paket dihitung bila jumlah paket diisi', () => {
    const h = hitungQurban({
      hewan: 'sapi',
      jumlahHewan: 1,
      paketFakirMiskin: 50,
    });
    const fakir = h.alokasi[1];
    expect(fakir.jumlahPaket).toBe(50);
    expect(fakir.beratPerPaketKg).toBeCloseTo(58.33 / 50, 2);
  });
});

describe('hitungQurban — validasi', () => {
  it('hewan tak dikenal → error', () => {
    expect(() =>
      hitungQurban({ hewan: 'bebek' as never, jumlahHewan: 1 }),
    ).toThrow('tidak dikenal');
  });

  it('patungan sapi 8 orang per ekor → error (maks 7)', () => {
    expect(() =>
      hitungQurban({ hewan: 'sapi', jumlahHewan: 1, jumlahShohibul: 8 }),
    ).toThrow('maksimal 7 orang per ekor');
  });

  it('patungan sapi 14 orang untuk 2 ekor → lolos', () => {
    const h = hitungQurban({
      hewan: 'sapi',
      jumlahHewan: 2,
      jumlahShohibul: 14,
    });
    expect(h.totalDagingKg).toBe(350);
  });

  it('total rasio 90% → error', () => {
    expect(() =>
      hitungQurban({
        hewan: 'kambing',
        jumlahHewan: 1,
        rasio: { shohibul: 0.5, fakirMiskin: 0.3, kerabat: 0.1 },
      }),
    ).toThrow('harus 100%');
  });

  it('jumlah hewan 0 → error', () => {
    expect(() => hitungQurban({ hewan: 'sapi', jumlahHewan: 0 })).toThrow(
      'bilangan bulat > 0',
    );
  });
});

describe('formatQurbanTeks', () => {
  it('ringkasan memuat total, alokasi, dan catatan', () => {
    const teks = formatQurbanTeks(
      hitungQurban({ hewan: 'sapi', jumlahHewan: 1, paketFakirMiskin: 50 }),
    );
    expect(teks).toContain('QURBANKU');
    expect(teks).toContain('Total daging: 175 kg');
    expect(teks).toContain('Fakir miskin');
    expect(teks).toContain('50 paket');
    expect(teks).toContain('SEPERTIGA');
  });
});
