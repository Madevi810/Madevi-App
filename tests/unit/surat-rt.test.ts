import { describe, expect, it } from 'vitest';

import {
  JENIS_SURAT,
  SURAT_RT_TIERS,
  bangunSurat,
  bulanRomawi,
  cekBatasSurat,
  formatNomorSurat,
  formatTanggalId,
  jenisSuratDariId,
  tierDariId,
  validasiNik,
  type DataPemohon,
  type OpsiSurat,
} from '@/services/surat-rt';

const PEMOHON: DataPemohon = {
  nama: 'Budi Santoso',
  nik: '3275010101900001',
  tempatLahir: 'Bandung',
  tanggalLahir: '1990-01-01',
  jenisKelamin: 'L',
  pekerjaan: 'Wiraswasta',
  alamat: 'Jl. Mawar No. 10',
  rt: '05',
  rw: '02',
  kelurahan: 'Sukamaju',
  kecamatan: 'Cibeunying',
  kota: 'Kota Bandung',
};

const OPSI: OpsiSurat = {
  nomorUrut: 7,
  tanggalSurat: '2026-10-15',
  namaKetuaRt: 'H. Ahmad',
};

describe('surat-rt: tier harga', () => {
  it('dua tier sesuai aturan: HEMAT 10–50rb, PRO 50–150rb', () => {
    const hemat = tierDariId('HEMAT');
    const pro = tierDariId('PRO');
    expect(hemat?.hargaRp).toBe(15000);
    expect(pro?.hargaRp).toBe(75000);
    expect(hemat!.hargaRp).toBeGreaterThanOrEqual(10000);
    expect(hemat!.hargaRp).toBeLessThanOrEqual(50000);
    expect(pro!.hargaRp).toBeGreaterThanOrEqual(50000);
    expect(pro!.hargaRp).toBeLessThanOrEqual(150000);
    expect(SURAT_RT_TIERS).toHaveLength(2);
  });

  it('tier asing mengembalikan null', () => {
    expect(tierDariId('SULTAN')).toBeNull();
  });

  it('empat jenis surat terdaftar', () => {
    expect(JENIS_SURAT).toHaveLength(4);
    expect(jenisSuratDariId('DOMISILI')?.kodeNomor).toBe('SKD');
    expect(jenisSuratDariId('ngawur')).toBeNull();
  });
});

describe('surat-rt: validasi & format', () => {
  it('NIK 16 digit lolos, selain itu ditolak', () => {
    expect(() => validasiNik('3275010101900001')).not.toThrow();
    expect(() => validasiNik('123')).toThrow('16 digit');
    expect(() => validasiNik('327501010190000a')).toThrow('16 digit');
  });

  it('format tanggal Indonesia', () => {
    expect(formatTanggalId('2026-10-15')).toBe('15 Oktober 2026');
    expect(() => formatTanggalId('15-10-2026')).toThrow('YYYY-MM-DD');
    expect(() => formatTanggalId('2026-02-30')).toThrow('valid');
  });

  it('bulan romawi 1–12', () => {
    expect(bulanRomawi(10)).toBe('X');
    expect(bulanRomawi(1)).toBe('I');
    expect(() => bulanRomawi(13)).toThrow('1–12');
  });

  it('nomor surat format resmi', () => {
    expect(formatNomorSurat(7, 'SKD', '05', '02', '2026-10-15')).toBe(
      '007/SKD/RT.05/RW.02/X/2026',
    );
  });

  it('nomor urut wajib dari user, tidak dikarang', () => {
    expect(() => formatNomorSurat(0, 'SKD', '05', '02', '2026-10-15')).toThrow('bilangan bulat');
  });
});

describe('surat-rt: bangun surat', () => {
  it('surat domisili memuat data pemohon & nomor', () => {
    const s = bangunSurat('DOMISILI', PEMOHON, { jenis: 'DOMISILI', sejakTahun: 2015 }, OPSI);
    expect(s.judul).toContain('DOMISILI');
    expect(s.nomor).toBe('007/SKD/RT.05/RW.02/X/2026');
    expect(s.paragraf.join('\n')).toContain('Budi Santoso');
    expect(s.paragraf.join('\n')).toContain('2015');
    expect(s.kop).toContain('RT 05 / RW 02');
    expect(s.namaKetuaRt).toBe('H. Ahmad');
  });

  it('surat usaha memuat nama & bidang usaha', () => {
    const s = bangunSurat(
      'USAHA',
      PEMOHON,
      { jenis: 'USAHA', namaUsaha: 'Warung Berkah', bidangUsaha: 'kuliner', alamatUsaha: 'Jl. Mawar No. 10' },
      OPSI,
    );
    expect(s.nomor).toContain('/SKU/');
    expect(s.paragraf.join('\n')).toContain('Warung Berkah');
  });

  it('surat pengantar KTP menyebut keperluan', () => {
    const s = bangunSurat(
      'PENGANTAR_KTP',
      PEMOHON,
      { jenis: 'PENGANTAR_KTP', keperluan: 'baru' },
      OPSI,
    );
    expect(s.paragraf.join('\n')).toContain('pembuatan KTP baru');
  });

  it('surat kelahiran memuat data anak', () => {
    const s = bangunSurat(
      'KELAHIRAN',
      PEMOHON,
      {
        jenis: 'KELAHIRAN',
        namaAnak: 'Dewi Lestari',
        tanggalLahirAnak: '2026-09-20',
        jamLahir: '08:30',
        jenisKelaminAnak: 'P',
        namaAyah: 'Budi Santoso',
        namaIbu: 'Siti Aminah',
      },
      OPSI,
    );
    expect(s.nomor).toContain('/SKL/');
    expect(s.paragraf.join('\n')).toContain('Dewi Lestari');
  });

  it('menolak data kosong — tidak ada karangan', () => {
    expect(() =>
      bangunSurat('DOMISILI', { ...PEMOHON, nama: '' }, { jenis: 'DOMISILI', sejakTahun: 2015 }, OPSI),
    ).toThrow('wajib diisi');
    expect(() =>
      bangunSurat('DOMISILI', { ...PEMOHON, nik: '123' }, { jenis: 'DOMISILI', sejakTahun: 2015 }, OPSI),
    ).toThrow('16 digit');
  });

  it('menolak data tambahan yang tidak cocok', () => {
    expect(() =>
      bangunSurat('DOMISILI', PEMOHON, { jenis: 'USAHA', namaUsaha: 'x', bidangUsaha: 'y', alamatUsaha: 'z' }, OPSI),
    ).toThrow('tidak cocok');
  });

  it('kop custom dipakai bila diisi (tier PRO)', () => {
    const s = bangunSurat('DOMISILI', PEMOHON, { jenis: 'DOMISILI', sejakTahun: 2015 }, {
      ...OPSI,
      kopCustom: 'RT 05 RW 02 — Maju Bersama',
    });
    expect(s.kop).toBe('RT 05 RW 02 — Maju Bersama');
  });
});

describe('surat-rt: batas surat tier', () => {
  it('HEMAT boleh sampai 10 surat per bulan', () => {
    expect(cekBatasSurat('HEMAT', 9).boleh).toBe(true);
    const penuh = cekBatasSurat('HEMAT', 10);
    expect(penuh.boleh).toBe(false);
    expect(penuh.perluUpgrade).toBe(true);
  });

  it('PRO tanpa batas', () => {
    expect(cekBatasSurat('PRO', 999).boleh).toBe(true);
  });

  it('tier asing melempar error', () => {
    expect(() => cekBatasSurat('GRATIS', 1)).toThrow('tidak dikenal');
  });
});
