import { describe, expect, it } from 'vitest';

import {
  AMBANG_SEIMBANG_PERSEN,
  DISCLAIMER_UMROH,
  KOMPONEN_BIAYA_UMROH,
  UMROH_TIERS,
  analisisSensitivitas,
  buatRencanaUmroh,
  checklistPersiapan,
  formatRencanaTeks,
  formatRp,
  komponenUmrohDariId,
  tierUmrohDariId,
  timelineTabungan,
  type RencanaUmrohInput,
} from '@/services/rencana-umroh';

function inputDasar(over: Partial<RencanaUmrohInput> = {}): RencanaUmrohInput {
  return {
    namaRencana: 'Umroh Keluarga 2027',
    tierId: 'HEMAT',
    jumlahJemaah: 2,
    durasiHari: 12,
    komponen: KOMPONEN_BIAYA_UMROH.map((k, i) => ({
      id: k.id,
      nilaiRp: (i + 1) * 1_000_000,
    })),
    hargaPaketTravelRp: 60_000_000,
    ...over,
  };
}

describe('UMROH_TIERS', () => {
  it('2 tier dalam band aturan: HEMAT 10–50rb, PRO 50–150rb', () => {
    const hemat = tierUmrohDariId('HEMAT')!;
    const pro = tierUmrohDariId('PRO')!;
    expect(hemat.hargaRp).toBeGreaterThanOrEqual(10_000);
    expect(hemat.hargaRp).toBeLessThanOrEqual(50_000);
    expect(pro.hargaRp).toBeGreaterThan(50_000);
    expect(pro.hargaRp).toBeLessThanOrEqual(150_000);
    expect(hemat.maksJemaah).toBe(4);
    expect(pro.maksJemaah).toBe(12);
  });

  it('tier tak dikenal → null', () => {
    expect(tierUmrohDariId('SULTAN')).toBeNull();
  });
});

describe('KOMPONEN_BIAYA_UMROH', () => {
  it('10 komponen, id unik', () => {
    expect(KOMPONEN_BIAYA_UMROH).toHaveLength(10);
    const ids = KOMPONEN_BIAYA_UMROH.map((k) => k.id);
    expect(new Set(ids).size).toBe(10);
    expect(komponenUmrohDariId('tiket-pp')!.nama).toContain('Tiket');
    expect(komponenUmrohDariId('ngawur')).toBeNull();
  });
});

describe('buatRencanaUmroh — hitungan', () => {
  it('total = Σ komponen × jemaah', () => {
    const r = buatRencanaUmroh(inputDasar());
    // Σ 1jt..10jt = 55jt per jemaah
    expect(r.perJemaahMandiriRp).toBe(55_000_000);
    expect(r.totalMandiriRp).toBe(110_000_000);
    expect(r.totalTravelRp).toBe(120_000_000);
    expect(r.selisihRp).toBe(-10_000_000);
  });

  it('verdict MANDIRI_LEBIH_HEMAT bila selisih ≥ 5%', () => {
    const r = buatRencanaUmroh(inputDasar());
    // selisih 10jt dari 120jt = 8,3% ≥ 5%
    expect(r.selisihPersen).toBeCloseTo(8.3, 1);
    expect(r.verdict).toBe('MANDIRI_LEBIH_HEMAT');
  });

  it('verdict TRAVEL_LEBIH_HEMAT bila travel jauh lebih murah', () => {
    const r = buatRencanaUmroh(
      inputDasar({ hargaPaketTravelRp: 40_000_000 }),
    );
    // mandiri 110jt vs travel 80jt → selisih 30jt = 37,5%
    expect(r.verdict).toBe('TRAVEL_LEBIH_HEMAT');
  });

  it('verdict SEIMBANG bila selisih < 5%', () => {
    const r = buatRencanaUmroh(
      inputDasar({ hargaPaketTravelRp: 57_000_000 }),
    );
    // mandiri 110jt vs travel 114jt → selisih 4jt = 3,5% < 5%
    expect(r.selisihPersen).toBeLessThan(AMBANG_SEIMBANG_PERSEN);
    expect(r.verdict).toBe('SEIMBANG');
  });

  it('komponen tak diisi → Rp0 + peringatan', () => {
    const r = buatRencanaUmroh(inputDasar({ komponen: [] }));
    expect(r.perJemaahMandiriRp).toBe(0);
    expect(r.peringatan.length).toBe(10);
    expect(r.peringatan[0]).toContain('Rp0');
  });

  it('deterministik: 2x hasil identik', () => {
    const a = buatRencanaUmroh(inputDasar());
    const b = buatRencanaUmroh(inputDasar());
    expect(a).toEqual(b);
  });

  it('catatan risiko & langkah terisi', () => {
    const r = buatRencanaUmroh(inputDasar());
    expect(r.catatanRisiko.length).toBeGreaterThanOrEqual(4);
    expect(r.langkah.length).toBeGreaterThanOrEqual(4);
  });
});

describe('buatRencanaUmroh — validasi', () => {
  it('nama kosong ditolak', () => {
    expect(() => buatRencanaUmroh(inputDasar({ namaRencana: '  ' }))).toThrow(
      'Nama rencana wajib diisi',
    );
  });

  it('jemaah > maks tier HEMAT (4) ditolak', () => {
    expect(() => buatRencanaUmroh(inputDasar({ jumlahJemaah: 5 }))).toThrow(
      'maksimal 4 jemaah',
    );
  });

  it('jemaah 5 lolos di tier PRO', () => {
    const r = buatRencanaUmroh(inputDasar({ tierId: 'PRO', jumlahJemaah: 5 }));
    expect(r.jumlahJemaah).toBe(5);
  });

  it('harga travel 0 ditolak', () => {
    expect(() => buatRencanaUmroh(inputDasar({ hargaPaketTravelRp: 0 }))).toThrow(
      'Harga paket travel',
    );
  });

  it('komponen tak dikenal ditolak', () => {
    expect(() =>
      buatRencanaUmroh(inputDasar({ komponen: [{ id: 'ngawur', nilaiRp: 1 }] })),
    ).toThrow('tidak dikenal');
  });

  it('nilai negatif ditolak; duplikat ditolak', () => {
    expect(() =>
      buatRencanaUmroh(
        inputDasar({ komponen: [{ id: 'tiket-pp', nilaiRp: -5 }] }),
      ),
    ).toThrow('≥ 0');
    expect(() =>
      buatRencanaUmroh(
        inputDasar({
          komponen: [
            { id: 'tiket-pp', nilaiRp: 1 },
            { id: 'tiket-pp', nilaiRp: 2 },
          ],
        }),
      ),
    ).toThrow('dua kali');
  });

  it('durasi di luar 7–40 hari ditolak', () => {
    expect(() => buatRencanaUmroh(inputDasar({ durasiHari: 5 }))).toThrow('7–40');
  });
});

describe('timelineTabungan', () => {
  it('120jt / 10jt per bulan dari 2026-01 → 12 bulan, lunas 2026-12', () => {
    const j = timelineTabungan(120_000_000, 10_000_000, '2026-01');
    expect(j.jumlahBulan).toBe(12);
    expect(j.bulanLunas).toBe('2026-12');
    expect(j.jadwal).toHaveLength(12);
    expect(j.jadwal[11].terkumpulRp).toBe(120_000_000);
  });

  it('pembulatan ke atas: 100jt / 30jt → 4 bulan (setoran terakhir 10jt)', () => {
    const j = timelineTabungan(100_000_000, 30_000_000, '2026-11');
    expect(j.jumlahBulan).toBe(4);
    expect(j.jadwal[3].setoranRp).toBe(10_000_000);
    expect(j.bulanLunas).toBe('2027-02');
  });

  it('setoran 0 / format bulan salah ditolak', () => {
    expect(() => timelineTabungan(100, 0, '2026-01')).toThrow('Setoran');
    expect(() => timelineTabungan(100, 10, '2026-13')).toThrow('Bulan tidak valid');
    expect(() => timelineTabungan(100, 10, 'Januari')).toThrow('YYYY-MM');
  });
});

describe('checklistPersiapan', () => {
  it('40 item, 4 kategori, 12 inti', () => {
    const list = checklistPersiapan();
    expect(list).toHaveLength(40);
    const kategori = new Set(list.map((c) => c.kategori));
    expect(kategori.size).toBe(4);
    expect(list.filter((c) => c.inti)).toHaveLength(12);
  });
});

describe('analisisSensitivitas', () => {
  it('rentang ±10% dari total mandiri', () => {
    const r = buatRencanaUmroh(inputDasar());
    const s = analisisSensitivitas(r);
    expect(s.minRp).toBe(Math.round(110_000_000 * 0.9));
    expect(s.maksRp).toBe(Math.round(110_000_000 * 1.1));
  });
});

describe('formatRencanaTeks & formatRp', () => {
  it('laporan memuat perbandingan, verdict, disclaimer', () => {
    const r = buatRencanaUmroh(inputDasar());
    const teks = formatRencanaTeks(r);
    expect(teks).toContain('UMROHKU');
    expect(teks).toContain('UMROH MANDIRI LEBIH HEMAT');
    expect(teks).toContain('Tiket pesawat PP');
    expect(teks).toContain(DISCLAIMER_UMROH);
  });

  it('formatRp: pemisah ribuan titik', () => {
    expect(formatRp(25000)).toBe('Rp25.000');
    expect(formatRp(110000000)).toBe('Rp110.000.000');
  });
});
