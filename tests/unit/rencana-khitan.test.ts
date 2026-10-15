import { describe, expect, it } from 'vitest';

import {
  DISCLAIMER_KHITAN,
  KHITAN_TIERS,
  KOMPONEN_BIAYA_KHITAN,
  RUNDOWN_KHITAN,
  analisisSensitivitasTamu,
  buatRencanaKhitan,
  checklistKhitan,
  formatKhitanTeks,
  komponenKhitanDariId,
  tierKhitanDariId,
  timelineMundur,
  type InputRencanaKhitan,
} from '@/services/rencana-khitan';

function tanggalMasaDepan(hariKe: number): string {
  const d = new Date();
  d.setDate(d.getDate() + hariKe);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function inputAcuan(): InputRencanaKhitan {
  return {
    namaAnak: 'Ahmad',
    tanggalAcara: tanggalMasaDepan(60),
    tierId: 'hemat',
    jumlahTamu: 100,
    komponen: [
      { id: 'tenda-dekorasi', nilaiRp: 3000000 },
      { id: 'konsumsi', nilaiRp: 5000000 },
      { id: 'hiburan', nilaiRp: 1500000 },
      { id: 'dokumentasi', nilaiRp: 1000000 },
    ],
  };
}

describe('KHITAN_TIERS', () => {
  it('2 tier dalam band aturan 10–50rb / 50–150rb', () => {
    expect(KHITAN_TIERS).toHaveLength(2);
    const hemat = tierKhitanDariId('hemat')!;
    const pro = tierKhitanDariId('pro')!;
    expect(hemat.hargaRp).toBeGreaterThanOrEqual(10000);
    expect(hemat.hargaRp).toBeLessThanOrEqual(50000);
    expect(pro.hargaRp).toBeGreaterThan(50000);
    expect(pro.hargaRp).toBeLessThanOrEqual(150000);
    expect(hemat.maksTamu).toBe(150);
    expect(pro.maksTamu).toBe(500);
  });

  it('tier tak dikenal → null', () => {
    expect(tierKhitanDariId('sultan')).toBeNull();
  });
});

describe('KOMPONEN_BIAYA_KHITAN & RUNDOWN_KHITAN', () => {
  it('9 komponen, id unik', () => {
    expect(KOMPONEN_BIAYA_KHITAN).toHaveLength(9);
    const ids = KOMPONEN_BIAYA_KHITAN.map((k) => k.id);
    expect(new Set(ids).size).toBe(9);
    expect(komponenKhitanDariId('konsumsi')!.nama).toBe('Konsumsi Tamu');
    expect(komponenKhitanDariId('tidak-ada')).toBeNull();
  });

  it('rundown 8 susunan berurutan', () => {
    expect(RUNDOWN_KHITAN).toHaveLength(8);
    expect(RUNDOWN_KHITAN.map((s) => s.tahap)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(RUNDOWN_KHITAN[4].nama).toBe('Tausiyah');
  });
});

describe('buatRencanaKhitan', () => {
  it('total = jumlah komponen; per tamu = total / tamu', () => {
    const r = buatRencanaKhitan(inputAcuan());
    expect(r.totalBiayaRp).toBe(3000000 + 5000000 + 1500000 + 1000000);
    expect(r.biayaPerTamuRp).toBe(r.totalBiayaRp / 100);
    expect(r.langkah.length).toBeGreaterThan(0);
  });

  it('tamu > 150 pada HEMAT ditolak; lolos pada PRO', () => {
    expect(() => buatRencanaKhitan({ ...inputAcuan(), jumlahTamu: 151 })).toThrow();
    const r = buatRencanaKhitan({ ...inputAcuan(), tierId: 'pro', jumlahTamu: 400 });
    expect(r.jumlahTamu).toBe(400);
  });

  it('tanggal kemarin ditolak; format salah ditolak', () => {
    expect(() => buatRencanaKhitan({ ...inputAcuan(), tanggalAcara: '2020-01-01' })).toThrow();
    expect(() => buatRencanaKhitan({ ...inputAcuan(), tanggalAcara: '60 hari lagi' })).toThrow();
  });

  it('komponen tak dikenal, duplikat, negatif ditolak', () => {
    expect(() =>
      buatRencanaKhitan({ ...inputAcuan(), komponen: [{ id: 'kembang-api', nilaiRp: 1000 }] }),
    ).toThrow();
    expect(() =>
      buatRencanaKhitan({
        ...inputAcuan(),
        komponen: [
          { id: 'konsumsi', nilaiRp: 1000 },
          { id: 'konsumsi', nilaiRp: 2000 },
        ],
      }),
    ).toThrow();
    expect(() =>
      buatRencanaKhitan({ ...inputAcuan(), komponen: [{ id: 'konsumsi', nilaiRp: -500 }] }),
    ).toThrow();
  });

  it('nama kosong & tier tak dikenal ditolak', () => {
    expect(() => buatRencanaKhitan({ ...inputAcuan(), namaAnak: '  ' })).toThrow();
    expect(() => buatRencanaKhitan({ ...inputAcuan(), tierId: 'gratis' })).toThrow();
  });
});

describe('checklistKhitan', () => {
  it('32 item, 12 inti', () => {
    const c = checklistKhitan();
    expect(c).toHaveLength(32);
    expect(c.filter((x) => x.inti)).toHaveLength(12);
    const kategori = new Set(c.map((x) => x.kategori));
    expect(kategori.size).toBe(4);
  });
});

describe('timelineMundur', () => {
  it('7 tonggak; H-30 tepat 30 hari sebelum acara', () => {
    const tgl = tanggalMasaDepan(60);
    const t = timelineMundur(tgl);
    expect(t).toHaveLength(7);
    expect(t[0].kode).toBe('H-30');
    expect(t[6].kode).toBe('H-0');
    expect(t[6].tanggal).toBe(tgl);
    const acara = new Date(tgl + 'T00:00:00');
    const h30 = new Date(t[0].tanggal + 'T00:00:00');
    const selisihHari = Math.round((acara.getTime() - h30.getTime()) / 86400000);
    expect(selisihHari).toBe(30);
    for (const tonggak of t) expect(tonggak.tugas.length).toBeGreaterThan(0);
  });

  it('format salah ditolak', () => {
    expect(() => timelineMundur('besok')).toThrow();
  });
});

describe('analisisSensitivitasTamu', () => {
  it('hanya komponen konsumsi yang diskalakan; komponen lain tetap', () => {
    const r = buatRencanaKhitan(inputAcuan());
    const hasil = analisisSensitivitasTamu(r, inputAcuan().komponen);
    expect(hasil).toHaveLength(2);
    const [kurang, lebih] = hasil;
    expect(kurang.jumlahTamu).toBe(80);
    expect(lebih.jumlahTamu).toBe(120);
    // tetap = 3jt + 1,5jt + 1jt = 5,5jt; konsumsi 5jt × 0,8 = 4jt → 9,5jt
    expect(kurang.totalBiayaRp).toBe(5500000 + 4000000);
    expect(lebih.totalBiayaRp).toBe(5500000 + 6000000);
    expect(kurang.selisihRp).toBe(kurang.totalBiayaRp - r.totalBiayaRp);
  });
});

describe('formatKhitanTeks', () => {
  it('memuat nama anak, total, rundown, disclaimer', () => {
    const teks = formatKhitanTeks(buatRencanaKhitan(inputAcuan()));
    expect(teks).toContain('KHITANKU');
    expect(teks).toContain('Ahmad');
    expect(teks).toContain('Tausiyah');
    expect(teks).toContain(DISCLAIMER_KHITAN.slice(0, 40));
  });
});
