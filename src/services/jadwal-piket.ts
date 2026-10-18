/**
 * jadwal-piket.ts — Generator Jadwal Piket Ronda/Kelas
 * Bagi daftar nama ke hari-hari secara bergiliran dan adil.
 */

export interface HasilPiket {
  jadwal: Array<{ hari: string; nama: string[] }>;
  totalOrang: number;
  totalHari: number;
}

const HARI_ID = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export function buatJadwalPiket(
  namaList: string[],
  hariList: string[] = HARI_ID.slice(0, 5),
  orangPerHari = 1,
): HasilPiket {
  const nama = namaList.map((n) => n.trim()).filter((n) => n.length > 0);
  if (nama.length === 0) throw new Error('Daftar nama tidak boleh kosong');
  if (nama.length > 200) throw new Error('Maksimal 200 orang');
  const hari = hariList.map((h) => h.trim()).filter((h) => h.length > 0);
  if (hari.length === 0) throw new Error('Daftar hari tidak boleh kosong');
  if (orangPerHari < 1 || orangPerHari > nama.length) {
    throw new Error('Orang per hari harus 1 sampai jumlah orang');
  }

  // Acak ringan deterministik per hari ini? Tidak — gunakan urutan apa adanya
  // agar adil dan dapat diprediksi; pengguna bisa mengacak manual.
  const jadwal = hari.map((h, i) => {
    const petugas: string[] = [];
    for (let k = 0; k < orangPerHari; k++) {
      petugas.push(nama[(i * orangPerHari + k) % nama.length]);
    }
    return { hari: h, nama: petugas };
  });

  return { jadwal, totalOrang: nama.length, totalHari: hari.length };
}

export function formatPiketTeks(hasil: HasilPiket): string {
  const lines = ['=== JADWAL PIKET ===', `Peserta: ${hasil.totalOrang} orang | Hari: ${hasil.totalHari}`, '---'];
  for (const j of hasil.jadwal) {
    lines.push(`${j.hari}: ${j.nama.join(', ')}`);
  }
  return lines.join('\n');
}
