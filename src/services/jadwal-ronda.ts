/**
 * Jadwal Ronda — penjadwal siskamling/poskamling otomatis (engine jasa berbayar).
 *
 * Ketua RT/RW biasanya menyusun jadwal ronda manual di kertas/Word: siapa jaga
 * malam apa, siapa libur hari apa. Engine ini menghasilkan pembagian giliran
 * yang adil dan deterministik dari daftar warga + hari libur masing-masing.
 *
 * Kejujuran data (aturan konten Madevi):
 *  - Semua nama warga & hari libur berasal dari user — engine tidak mengarang.
 *  - Nama duplikat (abaikan huruf besar/kecil & spasi) DITOLAK, bukan digabung.
 *  - Pembagian memakai greedy adil yang deterministik: tiap malam dipilih warga
 *    dengan total shift paling sedikit yang tidak libur hari itu (seri → urutan
 *    input). Hasil yang sama selalu keluar dari input yang sama.
 *  - Warga yang tidak pernah kebagian shift (mis. libur semua hari) dilaporkan
 *    di `catatan`, bukan disembunyikan.
 *  - Tidak ada koneksi eksternal. Semua pemrosesan lokal.
 */

/** Tier harga jasa — HEMAT Rp10rb–50rb, PRO Rp50rb–150rb (aturan inovasi 43). */
export interface JadwalRondaTier {
  id: 'HEMAT' | 'PRO';
  nama: string;
  hargaRp: number;
  /** Batas jadwal yang boleh dibuat per bulan; -1 = tanpa batas. */
  batasJadwalPerBulan: number;
  maksHariPerJadwal: number;
  maksWarga: number;
  fitur: string[];
}

export const JADWAL_RONDA_TIERS: JadwalRondaTier[] = [
  {
    id: 'HEMAT',
    nama: 'Paket Hemat',
    hargaRp: 10000,
    batasJadwalPerBulan: 1,
    maksHariPerJadwal: 31,
    maksWarga: 30,
    fitur: [
      '1 jadwal ronda per bulan',
      'Maksimal 31 hari & 30 warga per jadwal',
      'Pembagian giliran adil otomatis',
      'Hari libur per warga dihormati',
    ],
  },
  {
    id: 'PRO',
    nama: 'Paket Pro',
    hargaRp: 50000,
    batasJadwalPerBulan: 12,
    maksHariPerJadwal: 366,
    maksWarga: 200,
    fitur: [
      'Semua fitur Paket Hemat',
      '12 jadwal per bulan, tiap jadwal s.d. 1 tahun',
      'Maksimal 200 warga per jadwal',
      'Tukar jadwal antar malam',
      'Format teks siap cetak / tempel di grup',
    ],
  },
];

export function tierDariId(id: string): JadwalRondaTier | null {
  return JADWAL_RONDA_TIERS.find((t) => t.id === id) ?? null;
}

/** 0 = Minggu, 1 = Senin, …, 6 = Sabtu (mengikuti Date.getUTCDay). */
export const NAMA_HARI = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
] as const;

export interface WargaRonda {
  nama: string;
  /** Hari (0–6) di mana warga ini tidak bisa ronda. Opsional. */
  liburHari?: number[];
}

export interface JadwalRondaInput {
  /** Nama wilayah/RT, opsional — hanya untuk label cetak. */
  namaWilayah?: string;
  /** Tanggal mulai jadwal, format YYYY-MM-DD. */
  tanggalMulai: string;
  /** Jumlah malam yang dijadwalkan (1–366). */
  jumlahHari: number;
  /** Jumlah petugas tiap malam (>= 1). */
  orangPerMalam: number;
  warga: WargaRonda[];
}

export interface MalamRonda {
  /** Tanggal malam itu, format YYYY-MM-DD. */
  tanggal: string;
  hari: (typeof NAMA_HARI)[number];
  petugas: string[];
}

export interface BebanWarga {
  nama: string;
  totalShift: number;
}

export interface JadwalRondaHasil {
  wilayah: string;
  tanggalMulai: string;
  jumlahHari: number;
  orangPerMalam: number;
  malam: MalamRonda[];
  beban: BebanWarga[];
  catatan: string[];
}

/** Batas pemakaian tier: bolehkah user membuat jadwal lagi bulan ini? */
export function cekBatasJadwal(
  tier: JadwalRondaTier,
  jadwalBulanIni: number,
): { boleh: boolean; sisa: number } {
  if (tier.batasJadwalPerBulan < 0) return { boleh: true, sisa: -1 };
  const sisa = tier.batasJadwalPerBulan - jadwalBulanIni;
  return { boleh: sisa > 0, sisa: Math.max(0, sisa) };
}

function parseTanggal(iso: string): { y: number; m: number; d: number } {
  const cocok = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!cocok) throw new Error('Format tanggal mulai harus YYYY-MM-DD.');
  const y = Number(cocok[1]);
  const m = Number(cocok[2]);
  const d = Number(cocok[3]);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== m - 1 ||
    dt.getUTCDate() !== d
  ) {
    throw new Error(`Tanggal mulai tidak valid: ${iso}.`);
  }
  return { y, m, d };
}

function tambahHari(y: number, m: number, d: number, n: number): string {
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dt.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function hariKe(tanggalIso: string): number {
  const { y, m, d } = parseTanggal(tanggalIso);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

function validasiInput(input: JadwalRondaInput, tier: JadwalRondaTier): void {
  if (!Number.isInteger(input.jumlahHari) || input.jumlahHari < 1) {
    throw new Error('Jumlah hari minimal 1.');
  }
  if (input.jumlahHari > tier.maksHariPerJadwal) {
    throw new Error(
      `Paket ${tier.nama} maksimal ${tier.maksHariPerJadwal} hari per jadwal.`,
    );
  }
  if (!Number.isInteger(input.orangPerMalam) || input.orangPerMalam < 1) {
    throw new Error('Petugas per malam minimal 1 orang.');
  }
  if (!Array.isArray(input.warga) || input.warga.length === 0) {
    throw new Error('Daftar warga tidak boleh kosong.');
  }
  if (input.warga.length > tier.maksWarga) {
    throw new Error(
      `Paket ${tier.nama} maksimal ${tier.maksWarga} warga per jadwal.`,
    );
  }
  const terlihat = new Set<string>();
  for (const w of input.warga) {
    const nama = (w.nama ?? '').trim();
    if (!nama) throw new Error('Nama warga tidak boleh kosong.');
    const kunci = nama.toLowerCase();
    if (terlihat.has(kunci)) {
      throw new Error(`Nama warga duplikat: "${nama}".`);
    }
    terlihat.add(kunci);
    for (const h of w.liburHari ?? []) {
      if (!Number.isInteger(h) || h < 0 || h > 6) {
        throw new Error(`Hari libur "${w.nama}" harus 0–6 (0=Minggu).`);
      }
    }
  }
  if (input.warga.length < input.orangPerMalam) {
    throw new Error(
      'Jumlah warga kurang dari petugas yang dibutuhkan per malam.',
    );
  }
  // tanggalMulai divalidasi di sini agar error keluar sebelum jadwal dibuat.
  parseTanggal(input.tanggalMulai);
}

/**
 * Membuat jadwal ronda yang adil & deterministik.
 *
 * Tiap malam: urutkan warga by (totalShift naik, urutan input naik), lewati
 * yang libur hari itu, ambil N pertama sebagai petugas malam itu.
 */
export function buatJadwal(
  input: JadwalRondaInput,
  tierId: string = 'HEMAT',
): JadwalRondaHasil {
  const tier = tierDariId(tierId);
  if (!tier) throw new Error(`Tier tidak dikenal: ${tierId}.`);
  validasiInput(input, tier);

  const { y, m, d } = parseTanggal(input.tanggalMulai);
  const warga = input.warga.map((w, i) => ({
    nama: w.nama.trim(),
    libur: new Set(w.liburHari ?? []),
    urutan: i,
    shift: 0,
  }));

  const malam: MalamRonda[] = [];
  const catatan: string[] = [];

  for (let n = 0; n < input.jumlahHari; n++) {
    const tanggal = tambahHari(y, m, d, n);
    const hariIdx = hariKe(tanggal);
    const kandidat = warga
      .filter((w) => !w.libur.has(hariIdx))
      .sort((a, b) => a.shift - b.shift || a.urutan - b.urutan);
    if (kandidat.length < input.orangPerMalam) {
      throw new Error(
        `Malam ${tanggal} (${NAMA_HARI[hariIdx]}): hanya ${kandidat.length} warga ` +
          `tersedia, butuh ${input.orangPerMalam}. Kurangi hari libur atau tambah warga.`,
      );
    }
    const petugas = kandidat.slice(0, input.orangPerMalam);
    for (const p of petugas) p.shift += 1;
    malam.push({
      tanggal,
      hari: NAMA_HARI[hariIdx],
      petugas: petugas.map((p) => p.nama),
    });
  }

  const nolShift = warga.filter((w) => w.shift === 0).map((w) => w.nama);
  if (nolShift.length > 0) {
    catatan.push(
      `Tidak kebagian shift: ${nolShift.join(', ')} (mungkin libur di semua hari jadwal).`,
    );
  }
  const maks = Math.max(...warga.map((w) => w.shift));
  const min = Math.min(...warga.map((w) => w.shift));
  if (maks - min > 1) {
    catatan.push(
      'Pembagian kurang merata karena banyak hari libur — pertimbangkan tambah warga.',
    );
  }

  return {
    wilayah: (input.namaWilayah ?? '').trim(),
    tanggalMulai: input.tanggalMulai,
    jumlahHari: input.jumlahHari,
    orangPerMalam: input.orangPerMalam,
    malam,
    beban: warga.map((w) => ({ nama: w.nama, totalShift: w.shift })),
    catatan,
  };
}

/**
 * Menukar petugas antar dua malam (fitur PRO). Mengembalikan hasil baru;
 * hasil lama tidak diubah.
 */
export function tukarJadwal(
  hasil: JadwalRondaHasil,
  malamA: number,
  namaA: string,
  malamB: number,
  namaB: string,
): JadwalRondaHasil {
  const a = hasil.malam[malamA];
  const b = hasil.malam[malamB];
  if (!a) throw new Error(`Indeks malam A tidak valid: ${malamA}.`);
  if (!b) throw new Error(`Indeks malam B tidak valid: ${malamB}.`);
  if (!a.petugas.includes(namaA)) {
    throw new Error(`"${namaA}" tidak bertugas pada malam ${a.tanggal}.`);
  }
  if (!b.petugas.includes(namaB)) {
    throw new Error(`"${namaB}" tidak bertugas pada malam ${b.tanggal}.`);
  }
  if (malamA === malamB && namaA === namaB) return hasil;

  const malamBaru = hasil.malam.map((mm, i) => {
    if (i === malamA) {
      return { ...mm, petugas: mm.petugas.map((p) => (p === namaA ? namaB : p)) };
    }
    if (i === malamB) {
      return { ...mm, petugas: mm.petugas.map((p) => (p === namaB ? namaA : p)) };
    }
    return mm;
  });
  const hitung = new Map<string, number>();
  for (const mm of malamBaru) {
    for (const p of mm.petugas) hitung.set(p, (hitung.get(p) ?? 0) + 1);
  }
  return {
    ...hasil,
    malam: malamBaru,
    beban: [...hitung.entries()].map(([nama, totalShift]) => ({
      nama,
      totalShift,
    })),
  };
}

/** Format teks siap cetak / tempel ke grup WhatsApp. */
export function formatJadwalTeks(hasil: JadwalRondaHasil): string {
  const baris: string[] = [];
  baris.push('JADWAL RONDA');
  if (hasil.wilayah) baris.push(hasil.wilayah);
  baris.push(
    `${hasil.tanggalMulai} — ${hasil.jumlahHari} malam, ${hasil.orangPerMalam} petugas/malam`,
  );
  baris.push('='.repeat(32));
  for (const mm of hasil.malam) {
    baris.push(`${mm.tanggal} (${mm.hari}): ${mm.petugas.join(', ')}`);
  }
  baris.push('='.repeat(32));
  baris.push('Beban shift:');
  for (const b of hasil.beban) {
    baris.push(`- ${b.nama}: ${b.totalShift}x`);
  }
  for (const c of hasil.catatan) baris.push(`Catatan: ${c}`);
  return baris.join('\n');
}
