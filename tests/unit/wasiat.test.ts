import { describe, expect, it } from 'vitest';

import {
  WASIAT_TIERS,
  cekBatasDokumen,
  formatWasiatTeks,
  susunWasiat,
  tierDariId,
  type WasiatInput,
} from '@/services/wasiat';

function inputDasar(over: Partial<WasiatInput> = {}): WasiatInput {
  return {
    namaPewasiat: 'H. Ahmad Sulaiman',
    kotaSurat: 'Yogyakarta',
    tanggalSurat: '15 Oktober 2026',
    ahliWaris: [
      { nama: 'Fatimah', hubungan: 'istri', porsiPersen: 25 },
      { nama: 'Budi', hubungan: 'anak', porsiPersen: 50 },
      { nama: 'Siti', hubungan: 'anak', porsiPersen: 25 },
    ],
    harta: [
      { jenis: 'Tanah', deskripsi: 'Sawah 2000 m2 di Sleman', estimasiNilaiRp: 200000000 },
      { jenis: 'Tabungan', deskripsi: 'Tabungan bank', estimasiNilaiRp: 50000000 },
    ],
    wasiatKhusus: [],
    saksi: [
      { nama: 'Pak RT 05', identitas: 'KTP 3401001122334455' },
      { nama: 'Ustaz Hadi', identitas: 'KTP 3401009988776655' },
    ],
    ...over,
  };
}

describe('tier harga jasa', () => {
  it('2 tier: HEMAT 25rb (rentang 10-50rb), PRO 99rb (rentang 50-150rb)', () => {
    expect(WASIAT_TIERS.map((t) => t.id)).toEqual(['HEMAT', 'PRO']);
    const hemat = tierDariId('HEMAT')!;
    const pro = tierDariId('PRO')!;
    expect(hemat.hargaRp).toBeGreaterThanOrEqual(10000);
    expect(hemat.hargaRp).toBeLessThanOrEqual(50000);
    expect(pro.hargaRp).toBeGreaterThanOrEqual(50000);
    expect(pro.hargaRp).toBeLessThanOrEqual(150000);
  });

  it('tier tak dikenal → null', () => {
    expect(tierDariId('SULTAN')).toBeNull();
  });
});

describe('susunWasiat — validasi', () => {
  it('input valid → draf jadi, total harta 250jt', () => {
    const d = susunWasiat(inputDasar());
    expect(d.totalEstimasiHartaRp).toBe(250000000);
    expect(d.peringatan).toEqual([]);
    expect(d.langkah.length).toBeGreaterThan(0);
  });

  it('nama pewasiat kosong → error', () => {
    expect(() => susunWasiat(inputDasar({ namaPewasiat: '  ' }))).toThrow(
      'Nama pewasiat wajib diisi',
    );
  });

  it('tanpa ahli waris → error', () => {
    expect(() => susunWasiat(inputDasar({ ahliWaris: [] }))).toThrow(
      'Minimal 1 ahli waris',
    );
  });

  it('total porsi 90% → error', () => {
    expect(() =>
      susunWasiat(
        inputDasar({
          ahliWaris: [
            { nama: 'Fatimah', hubungan: 'istri', porsiPersen: 40 },
            { nama: 'Budi', hubungan: 'anak', porsiPersen: 50 },
          ],
        }),
      ),
    ).toThrow('harus 100%');
  });

  it('wasiat khusus non-ahli-waris 100jt dari harta 250jt (> 1/3) → error', () => {
    expect(() =>
      susunWasiat(
        inputDasar({
          wasiatKhusus: [
            {
              penerima: 'Pondok Pesantren Al-Ikhlas',
              uraian: 'Wakaf tunai',
              nilaiRp: 100000000,
              untukAhliWaris: false,
            },
          ],
        }),
      ),
    ).toThrow('melebihi batas aturan umum');
  });

  it('wasiat khusus non-ahli-waris 50jt dari harta 250jt (< 1/3) → lolos', () => {
    const d = susunWasiat(
      inputDasar({
        wasiatKhusus: [
          {
            penerima: 'Pondok Pesantren Al-Ikhlas',
            uraian: 'Wakaf tunai',
            nilaiRp: 50000000,
            untukAhliWaris: false,
          },
        ],
      }),
    );
    expect(d.totalWasiatKhususNonAhliWarisRp).toBe(50000000);
  });

  it('wasiat khusus untuk ahli waris tidak kena batas 1/3', () => {
    const d = susunWasiat(
      inputDasar({
        wasiatKhusus: [
          {
            penerima: 'Budi',
            uraian: 'Motor kesayangan',
            nilaiRp: 200000000,
            untukAhliWaris: true,
          },
        ],
      }),
    );
    expect(d.totalWasiatKhususNonAhliWarisRp).toBe(0);
  });

  it('1 saksi → peringatan, bukan error', () => {
    const d = susunWasiat(
      inputDasar({ saksi: [{ nama: 'Pak RT', identitas: 'KTP 1' }] }),
    );
    expect(d.peringatan.length).toBe(1);
    expect(d.peringatan[0]).toContain('minimal 2 orang saksi');
  });

  it('tanpa estimasi nilai harta → total null, batas 1/3 tidak dihitung', () => {
    const d = susunWasiat(
      inputDasar({
        harta: [{ jenis: 'Rumah', deskripsi: 'Rumah tinggal' }],
      }),
    );
    expect(d.totalEstimasiHartaRp).toBeNull();
  });
});

describe('cekBatasDokumen', () => {
  it('HEMAT: 1 dokumen/bulan — 0 dipakai boleh, 1 dipakai habis', () => {
    expect(cekBatasDokumen('HEMAT', 0)).toMatchObject({ boleh: true, sisa: 1 });
    expect(cekBatasDokumen('HEMAT', 1)).toMatchObject({ boleh: false, sisa: 0 });
  });

  it('PRO: tanpa batas', () => {
    expect(cekBatasDokumen('PRO', 99).boleh).toBe(true);
  });

  it('tier tak dikenal → error', () => {
    expect(() => cekBatasDokumen('X', 0)).toThrow('tidak dikenal');
  });
});

describe('formatWasiatTeks', () => {
  it('memuat pasal bernomor, tanda tangan, dan disclaimer', () => {
    const teks = formatWasiatTeks(susunWasiat(inputDasar()));
    expect(teks).toContain('SURAT WASIAT');
    expect(teks).toContain('H. Ahmad Sulaiman');
    expect(teks).toContain('1. DAFTAR AHLI WARIS');
    expect(teks).toContain('2. DAFTAR HARTA');
    expect(teks).toContain('3. SAKSI');
    expect(teks).toContain('DISCLAIMER');
    expect(teks).toContain('BUKAN pengganti notaris/pengacara');
  });
});
