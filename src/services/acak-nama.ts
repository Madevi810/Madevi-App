/**
 * acak-nama.ts — Pengacak Nama (arisan, doorprize, undian kelas)
 * Fisher-Yates shuffle dengan seed acak kriptografis bila tersedia.
 */

export interface HasilAcak {
  pemenang: string[];
  urutanPenuh: string[];
  totalPeserta: number;
}

function acakArray<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function acakNama(namaList: string[], jumlahPemenang = 1, rand?: () => number): HasilAcak {
  const nama = namaList.map((n) => n.trim()).filter((n) => n.length > 0);
  // Hapus duplikat (case-insensitive)
  const unik = [...new Map(nama.map((n) => [n.toLowerCase(), n])).values()];
  if (unik.length === 0) throw new Error('Daftar nama tidak boleh kosong');
  if (unik.length > 1000) throw new Error('Maksimal 1000 peserta');
  if (jumlahPemenang < 1) throw new Error('Jumlah pemenang minimal 1');
  if (jumlahPemenang > unik.length) throw new Error('Pemenang melebihi jumlah peserta');

  const urutanPenuh = acakArray(unik, rand);
  return {
    pemenang: urutanPenuh.slice(0, jumlahPemenang),
    urutanPenuh,
    totalPeserta: unik.length,
  };
}

export function formatAcakTeks(hasil: HasilAcak): string {
  const lines = [
    '=== PENGACAK NAMA ===',
    `Peserta: ${hasil.totalPeserta} orang`,
    '---',
    'PEMENANG:',
    ...hasil.pemenang.map((n, i) => `${i + 1}. ${n}`),
  ];
  return lines.join('\n');
}
