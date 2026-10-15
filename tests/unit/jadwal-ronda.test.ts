import { describe, expect, it } from 'vitest';

import {
  JADWAL_RONDA_TIERS,
  buatJadwal,
  cekBatasJadwal,
  formatJadwalTeks,
  tierDariId,
  tukarJadwal,
  type JadwalRondaInput,
} from '@/services/jadwal-ronda';

const WARGA4 = ['Andi', 'Budi', 'Cici', 'Dedi'].map((nama) => ({ nama }));

function inputDasar(ubah?: Partial<JadwalRondaInput>): JadwalRondaInput {
  return {
    tanggalMulai: '2026-10-19',
    jumlahHari: 4,
    orangPerMalam: 1,
    warga: WARGA4,
    ...ubah,
  };
}

describe('jadwal-ronda', () => {
  it('tier HEMAT Rp10rb, 1 jadwal/bln, maks 31 hari & 30 warga', () => {
    const t = tierDariId('HEMAT')!;
    expect(t.hargaRp).toBe(10000);
    expect(t.batasJadwalPerBulan).toBe(1);
    expect(t.maksHariPerJadwal).toBe(31);
    expect(t.maksWarga).toBe(30);
  });

  it('tier PRO Rp50rb, 12 jadwal/bln', () => {
    const t = tierDariId('PRO')!;
    expect(t.hargaRp).toBe(50000);
    expect(t.batasJadwalPerBulan).toBe(12);
    expect(JADWAL_RONDA_TIERS).toHaveLength(2);
  });

  it('tier tidak dikenal → null', () => {
    expect(tierDariId('SULTAN')).toBeNull();
  });

  it('cekBatasJadwal: HEMAT habis setelah 1 jadwal', () => {
    const t = tierDariId('HEMAT')!;
    expect(cekBatasJadwal(t, 0)).toEqual({ boleh: true, sisa: 1 });
    expect(cekBatasJadwal(t, 1).boleh).toBe(false);
  });

  it('4 warga, 4 malam, 1/malam → tiap warga tepat 1 shift', () => {
    const h = buatJadwal(inputDasar());
    expect(h.malam).toHaveLength(4);
    expect(h.malam[0].tanggal).toBe('2026-10-19');
    expect(h.malam[0].hari).toBe('Senin');
    for (const b of h.beban) expect(b.totalShift).toBe(1);
    expect(h.catatan).toHaveLength(0);
  });

  it('deterministik: input sama → hasil sama', () => {
    const a = buatJadwal(inputDasar({ jumlahHari: 7, orangPerMalam: 2 }));
    const b = buatJadwal(inputDasar({ jumlahHari: 7, orangPerMalam: 2 }));
    expect(a).toEqual(b);
  });

  it('7 warga 7 malam adil: tiap warga 1 shift', () => {
    const warga = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((nama) => ({ nama }));
    const h = buatJadwal(inputDasar({ jumlahHari: 7, warga }));
    for (const b of h.beban) expect(b.totalShift).toBe(1);
  });

  it('hari libur dihormati: Andi libur Minggu tidak jaga 2026-10-25', () => {
    const warga = [
      { nama: 'Andi', liburHari: [0] },
      { nama: 'Budi' },
      { nama: 'Cici' },
      { nama: 'Dedi' },
    ];
    const h = buatJadwal(inputDasar({ jumlahHari: 7, warga }));
    const minggu = h.malam.find((m) => m.tanggal === '2026-10-25')!;
    expect(minggu.hari).toBe('Minggu');
    expect(minggu.petugas).not.toContain('Andi');
  });

  it('warga yang libur semua hari dilaporkan di catatan', () => {
    const warga = [
      { nama: 'Andi', liburHari: [0, 1, 2, 3, 4, 5, 6] },
      { nama: 'Budi' },
      { nama: 'Cici' },
    ];
    const h = buatJadwal(inputDasar({ jumlahHari: 2, warga }));
    expect(h.catatan.join(' ')).toContain('Andi');
    expect(h.beban.find((b) => b.nama === 'Andi')!.totalShift).toBe(0);
  });

  it('nama duplikat (abaikan kapital/spasi) ditolak', () => {
    const warga = [{ nama: 'Budi' }, { nama: ' budi ' }];
    expect(() => buatJadwal(inputDasar({ warga }))).toThrow(/duplikat/i);
  });

  it('nama kosong ditolak', () => {
    expect(() =>
      buatJadwal(inputDasar({ warga: [{ nama: '   ' }] })),
    ).toThrow(/kosong/i);
  });

  it('format tanggal salah ditolak', () => {
    expect(() => buatJadwal(inputDasar({ tanggalMulai: '19-10-2026' }))).toThrow(
      /YYYY-MM-DD/,
    );
  });

  it('tanggal tidak valid (30 Feb) ditolak', () => {
    expect(() => buatJadwal(inputDasar({ tanggalMulai: '2026-02-30' }))).toThrow(
      /tidak valid/,
    );
  });

  it('warga kurang dari petugas/malam ditolak', () => {
    expect(() => buatJadwal(inputDasar({ orangPerMalam: 5 }))).toThrow(
      /kurang/,
    );
  });

  it('HEMAT menolak jadwal 32 hari', () => {
    expect(() => buatJadwal(inputDasar({ jumlahHari: 32 }))).toThrow(
      /31 hari/,
    );
  });

  it('malam tanpa warga tersedia (semua libur) ditolak dengan jelas', () => {
    const warga = [
      { nama: 'Andi', liburHari: [0] },
      { nama: 'Budi', liburHari: [0] },
    ];
    expect(() =>
      buatJadwal(
        inputDasar({ tanggalMulai: '2026-10-25', jumlahHari: 1, warga }),
      ),
    ).toThrow(/hanya 0 warga tersedia/);
  });

  it('tukarJadwal menukar petugas & memperbarui beban', () => {
    const h = buatJadwal(inputDasar());
    const namaA = h.malam[0].petugas[0];
    const namaB = h.malam[1].petugas[0];
    const t = tukarJadwal(h, 0, namaA, 1, namaB);
    expect(t.malam[0].petugas).toContain(namaB);
    expect(t.malam[1].petugas).toContain(namaA);
    // Beban tetap: tiap nama masih 1 shift.
    for (const b of t.beban) expect(b.totalShift).toBe(1);
    // Hasil lama tidak berubah (immutable).
    expect(h.malam[0].petugas).toContain(namaA);
  });

  it('tukarJadwal indeks malam invalid ditolak', () => {
    const h = buatJadwal(inputDasar());
    expect(() => tukarJadwal(h, 9, 'Andi', 0, 'Budi')).toThrow(/tidak valid/);
  });

  it('formatJadwalTeks memuat judul, tanggal, dan nama', () => {
    const h = buatJadwal(inputDasar({ namaWilayah: 'RT 05' }));
    const teks = formatJadwalTeks(h);
    expect(teks).toContain('JADWAL RONDA');
    expect(teks).toContain('RT 05');
    expect(teks).toContain('2026-10-19');
    expect(teks).toContain('Andi');
  });
});
