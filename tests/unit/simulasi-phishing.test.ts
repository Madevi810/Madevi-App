import { describe, expect, it } from 'vitest';

import {
  DISCLAIMER_PHISHING,
  LABEL_SIMULASI,
  PHISHING_TIERS,
  TEMPLATE_SKEMA,
  buatKampanye,
  catatRespons,
  formatLaporanTeks,
  hitungSkor,
  materiEdukasi,
  templateDariId,
  tierPhishingDariId,
  trenGelombang,
  type KampanyeInput,
} from '@/services/simulasi-phishing';

function inputDasar(ubah?: Partial<KampanyeInput>): KampanyeInput {
  return {
    namaKampanye: 'Latihan Q4 Toko Berkah',
    templateId: 'paket-ekspedisi',
    tierId: 'HEMAT',
    daftarPenerima: [
      { nama: 'Budi', peran: 'Kasir' },
      { nama: 'Siti', peran: 'Admin' },
      { nama: 'Agus' },
    ],
    tanggalMulai: '2026-11-01',
    ...ubah,
  };
}

describe('tier & template', () => {
  it('2 tier dalam band aturan (HEMAT 10–50rb, PRO 50–150rb)', () => {
    expect(PHISHING_TIERS.map((t) => t.id)).toEqual(['HEMAT', 'PRO']);
    const hemat = tierPhishingDariId('HEMAT')!;
    const pro = tierPhishingDariId('PRO')!;
    expect(hemat.hargaRp).toBe(35000);
    expect(pro.hargaRp).toBe(120000);
    expect(hemat.hargaRp).toBeGreaterThanOrEqual(10000);
    expect(hemat.hargaRp).toBeLessThanOrEqual(50000);
    expect(pro.hargaRp).toBeGreaterThan(50000);
    expect(pro.hargaRp).toBeLessThanOrEqual(150000);
  });

  it('4 template skenario lokal dengan domain contoh.invalid', () => {
    expect(TEMPLATE_SKEMA.map((t) => t.id)).toEqual([
      'paket-ekspedisi',
      'tagihan-pln',
      'akun-diblokir',
      'undian-berhadiah',
    ]);
    for (const t of TEMPLATE_SKEMA) {
      expect(t.teksContoh).toContain('contoh.invalid');
      expect(t.teksContoh).toContain(LABEL_SIMULASI);
      expect(t.ciriPhishing.length).toBeGreaterThan(0);
    }
    expect(templateDariId('paket-ekspedisi')!.kanal).toBe('SMS');
    expect(templateDariId('tidak-ada')).toBeNull();
    expect(tierPhishingDariId('VIP')).toBeNull();
  });
});

describe('buatKampanye — validasi', () => {
  it('kampanye valid terbentuk', () => {
    const k = buatKampanye(inputDasar());
    expect(k.namaKampanye).toBe('Latihan Q4 Toko Berkah');
    expect(k.template.id).toBe('paket-ekspedisi');
    expect(k.tier.id).toBe('HEMAT');
    expect(k.gelombangKe).toBe(1);
    expect(k.respons).toEqual([]);
  });

  it('nama kampanye kosong ditolak', () => {
    expect(() => buatKampanye(inputDasar({ namaKampanye: '  ' }))).toThrow(
      'wajib diisi',
    );
  });

  it('template tak dikenal ditolak', () => {
    expect(() => buatKampanye(inputDasar({ templateId: 'x' }))).toThrow(
      'tidak dikenal',
    );
  });

  it('penerima >25 pada HEMAT ditolak', () => {
    const banyak = Array.from({ length: 26 }, (_, i) => ({
      nama: `Karyawan ${i + 1}`,
    }));
    expect(() =>
      buatKampanye(inputDasar({ daftarPenerima: banyak })),
    ).toThrow('maksimal 25 penerima');
  });

  it('gelombang 2 pada HEMAT ditolak, PRO boleh sampai 3', () => {
    expect(() => buatKampanye(inputDasar({ gelombangKe: 2 }))).toThrow(
      'butuh tier PRO',
    );
    const k = buatKampanye(
      inputDasar({ tierId: 'PRO', gelombangKe: 3 }),
    );
    expect(k.gelombangKe).toBe(3);
    expect(() =>
      buatKampanye(inputDasar({ tierId: 'PRO', gelombangKe: 4 })),
    ).toThrow('maksimal 3 gelombang');
  });

  it('nama penerima duplikat ditolak', () => {
    expect(() =>
      buatKampanye(
        inputDasar({
          daftarPenerima: [{ nama: 'Budi' }, { nama: 'budi' }],
        }),
      ),
    ).toThrow('duplikat');
  });

  it('tanggal tidak nyata ditolak', () => {
    expect(() =>
      buatKampanye(inputDasar({ tanggalMulai: '2026-02-30' })),
    ).toThrow('bukan tanggal yang nyata');
  });
});

describe('catatRespons & hitungSkor', () => {
  it('semua LAPOR → skor 100 grade A', () => {
    let k = buatKampanye(inputDasar());
    k = catatRespons(k, 'Budi', 'LAPOR');
    k = catatRespons(k, 'Siti', 'LAPOR');
    k = catatRespons(k, 'Agus', 'LAPOR');
    const s = hitungSkor(k);
    expect(s.skor).toBe(100);
    expect(s.grade).toBe('A');
    expect(s.jumlahLapor).toBe(3);
  });

  it('semua KLIK → skor 0', () => {
    let k = buatKampanye(inputDasar());
    k = catatRespons(k, 'Budi', 'KLIK');
    k = catatRespons(k, 'Siti', 'KLIK');
    k = catatRespons(k, 'Agus', 'KLIK');
    const s = hitungSkor(k);
    expect(s.skor).toBe(0);
    expect(s.grade).toBe('D');
  });

  it('campuran: LAPOR+ABAIKAN+KLIK → skor sesuai rumus', () => {
    let k = buatKampanye(inputDasar());
    k = catatRespons(k, 'Budi', 'LAPOR'); // 100
    k = catatRespons(k, 'Siti', 'ABAIKAN'); // 50
    k = catatRespons(k, 'Agus', 'KLIK'); // 0
    const s = hitungSkor(k);
    expect(s.skor).toBe(50);
    expect(s.grade).toBe('C');
  });

  it('penerima tak dikenal ditolak', () => {
    const k = buatKampanye(inputDasar());
    expect(() => catatRespons(k, 'Joko', 'KLIK')).toThrow('bukan penerima');
  });

  it('respons ganda menimpa (immutable)', () => {
    let k = buatKampanye(inputDasar());
    k = catatRespons(k, 'Budi', 'KLIK');
    const k2 = catatRespons(k, 'Budi', 'LAPOR');
    expect(hitungSkor(k2).jumlahLapor).toBe(1);
    expect(hitungSkor(k2).jumlahKlik).toBe(0);
    // kampanye lama tidak berubah
    expect(hitungSkor(k).jumlahKlik).toBe(1);
  });

  it('belum dicatat dihitung 0 + ada langkah peringatan', () => {
    const k = buatKampanye(inputDasar());
    const s = hitungSkor(k);
    expect(s.belumDicatat).toBe(3);
    expect(s.skor).toBe(0);
    expect(s.langkah.some((l) => l.includes('belum dicatat'))).toBe(true);
  });
});

describe('trenGelombang & materiEdukasi', () => {
  it('tren menghitung delta antar-gelombang', () => {
    const tren = trenGelombang([
      { gelombangKe: 2, skor: 60 },
      { gelombangKe: 1, skor: 40 },
      { gelombangKe: 3, skor: 85 },
    ]);
    expect(tren.map((t) => t.gelombangKe)).toEqual([1, 2, 3]);
    expect(tren[0].delta).toBeNull();
    expect(tren[1].delta).toBe(20);
    expect(tren[2].delta).toBe(25);
  });

  it('5 materi edukasi tersedia', () => {
    const m = materiEdukasi();
    expect(m).toHaveLength(5);
    expect(m[0].judul).toContain('ciri phishing');
  });
});

describe('formatLaporanTeks', () => {
  it('laporan memuat label SIMULASI, skor, dan disclaimer', () => {
    let k = buatKampanye(inputDasar());
    k = catatRespons(k, 'Budi', 'LAPOR');
    const teks = formatLaporanTeks(k);
    expect(teks).toContain(LABEL_SIMULASI);
    expect(teks).toContain('SKOR KESADARAN');
    expect(teks).toContain('Budi: LAPOR');
    expect(teks).toContain(DISCLAIMER_PHISHING.slice(0, 40));
  });
});
