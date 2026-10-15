/**
 * PhishingKu — simulasi phishing edukasi untuk UMKM (engine Services berbayar).
 *
 * Simulasi phishing yang ada (LOGIQUE/Caniphish, KnowBe4) semuanya segmen
 * korporat/enterprise — mahal dan rumit untuk warung, toko, atau UMKM 5–50
 * karyawan. Engine ini: pemilik usaha menyusun kampanye dari template
 * skenario lokal → SIMULASI pengiriman terjadwal → pemilik mencatat respons
 * tiap karyawan secara manual (KLIK / LAPOR / ABAIKAN) → skor kesadaran +
 * materi edukasi + laporan.
 *
 * Kejujuran & keamanan (aturan konten Madevi):
 *  - SEMUA "pengiriman" adalah SIMULASI berlabel jujur (aturan #17) — engine
 *    TIDAK mengirim pesan nyata, TIDAK memakai tracking pixel, TIDAK
 *    menghubungi siapa pun. Respons dicatat manual oleh pemilik usaha.
 *  - Template memakai domain contoh yang tidak bisa disalahgunakan
 *    (contoh.invalid) dan berlabel SIMULASI — tidak bisa dipakai menyerang
 *    beneran.
 *  - Tidak ada data pribadi nyata yang disimpan engine; semua pemrosesan
 *    lokal dan deterministik; tidak ada koneksi eksternal.
 */

export interface PhishingTier {
  id: 'HEMAT' | 'PRO';
  nama: string;
  hargaRp: number;
  /** Maksimal penerima per kampanye. */
  maksPenerima: number;
  /** Maksimal nomor gelombang dalam satu rangkaian kampanye. */
  maksGelombang: number;
  sertifikat: boolean;
  trenAntarGelombang: boolean;
  deskripsi: string;
}

export const PHISHING_TIERS: PhishingTier[] = [
  {
    id: 'HEMAT',
    nama: 'Hemat',
    hargaRp: 35000,
    maksPenerima: 25,
    maksGelombang: 1,
    sertifikat: false,
    trenAntarGelombang: false,
    deskripsi:
      '1 template skenario, sampai 25 karyawan, 1 gelombang, laporan dasar.',
  },
  {
    id: 'PRO',
    nama: 'Pro',
    hargaRp: 120000,
    maksPenerima: 200,
    maksGelombang: 3,
    sertifikat: true,
    trenAntarGelombang: true,
    deskripsi:
      'Bebas pilih template, sampai 200 karyawan, sampai 3 gelombang, ' +
      'tren antar-gelombang, sertifikat kesadaran.',
  },
];

export function tierPhishingDariId(id: string): PhishingTier | null {
  return PHISHING_TIERS.find((t) => t.id === id) ?? null;
}

export type KanalPhishing = 'SMS' | 'EMAIL' | 'WA';
export type KesulitanSkenario = 'MUDAH' | 'SEDANG' | 'SULIT';

export interface TemplatePhishing {
  id: string;
  nama: string;
  kanal: KanalPhishing;
  kesulitan: KesulitanSkenario;
  /** Ciri-ciri phishing yang harus dikenali karyawan dari skenario ini. */
  ciriPhishing: string[];
  /** Contoh pesan — domain contoh.invalid + label SIMULASI. */
  teksContoh: string;
}

export const LABEL_SIMULASI = '[SIMULASI EDUKASI — bukan pesan phishing sungguhan]';

export const TEMPLATE_SKEMA: TemplatePhishing[] = [
  {
    id: 'paket-ekspedisi',
    nama: 'Paket Ekspedisi Tertahan',
    kanal: 'SMS',
    kesulitan: 'MUDAH',
    ciriPhishing: [
      'Nomor pengirim tidak dikenal / bukan nomor resmi ekspedisi.',
      'Mendesak: "segera klik" / "batas hari ini".',
      'Link memakai domain aneh (di sini: contoh.invalid).',
      'Meminta data pribadi / pembayaran untuk "melepas" paket.',
    ],
    teksContoh:
      `${LABEL_SIMULASI}\n` +
      'PAKET Anda tertahan di gudang! Segera konfirmasi: ' +
      'https://ekspedisi-contoh.invalid/lacak/8182 — batas HARI INI atau ' +
      'paket dikembalikan.',
  },
  {
    id: 'tagihan-pln',
    nama: 'Tagihan Listrik Palsu',
    kanal: 'EMAIL',
    kesulitan: 'SEDANG',
    ciriPhishing: [
      'Alamat pengirim mirip tapi bukan domain resmi (pln-contoh.invalid).',
      'Lampiran "tagihan.pdf" yang sebenarnya program/exe tersamar.',
      'Ancaman pemutusan agar korban panik dan terburu-buru.',
      'Tidak ada nomor pelanggan yang cocok dengan milik Anda.',
    ],
    teksContoh:
      `${LABEL_SIMULASI}\n` +
      'Dari: tagihan@pln-contoh.invalid\n' +
      'Subjek: TAGIHAN LISTRIK MENUNGGAK — PEMUTUSAN 24 JAM\n' +
      'Buka lampiran tagihan.pdf dan bayar via link berikut: ' +
      'https://pln-contoh.invalid/bayar/9912',
  },
  {
    id: 'akun-diblokir',
    nama: 'Akun Bank Diblokir',
    kanal: 'WA',
    kesulitan: 'SEDANG',
    ciriPhishing: [
      'Mengaku dari bank tapi nomor WA pribadi, bukan centang resmi.',
      'Meminta OTP / PIN / password — bank asli TIDAK PERNAH meminta ini.',
      'Link verifikasi memakai domain contoh.invalid.',
      'Bahasa mendesak: "akun diblokir permanen".',
    ],
    teksContoh:
      `${LABEL_SIMULASI}\n` +
      'BANK: Akun Anda DIBLOKIR permanen karena aktivitas mencurigakan. ' +
      'Verifikasi SEKARANG: https://bank-contoh.invalid/verif — kirim juga ' +
      'kode OTP yang masuk ke SMS Anda.',
  },
  {
    id: 'undian-berhadiah',
    nama: 'Undian Berhadiah',
    kanal: 'EMAIL',
    kesulitan: 'SULIT',
    ciriPhishing: [
      'Hadiah besar tanpa pernah ikut undian — terlalu bagus jadi benar.',
      'Diminta "biaya admin" dulu sebelum hadiah cair.',
      'Desain email meniru brand besar dengan domain contoh.invalid.',
      'Tidak ada kontak resmi yang bisa diverifikasi.',
    ],
    teksContoh:
      `${LABEL_SIMULASI}\n` +
      'SELAMAT! Anda memenangkan Undian Nasional Rp50.000.000. Klaim hadiah: ' +
      'https://undian-contoh.invalid/klaim — cukup bayar biaya admin ' +
      'Rp150.000 terlebih dahulu.',
  },
];

export function templateDariId(id: string): TemplatePhishing | null {
  return TEMPLATE_SKEMA.find((t) => t.id === id) ?? null;
}

export type ResponsPhishing = 'KLIK' | 'LAPOR' | 'ABAIKAN';

export interface PenerimaSimulasi {
  nama: string;
  peran?: string;
}

export interface ResponsTercatat {
  nama: string;
  respons: ResponsPhishing;
}

export interface KampanyeInput {
  namaKampanye: string;
  templateId: string;
  tierId: string;
  daftarPenerima: PenerimaSimulasi[];
  /** Nomor gelombang (default 1). */
  gelombangKe?: number;
  /** Tanggal mulai simulasi, format YYYY-MM-DD. */
  tanggalMulai: string;
}

export interface KampanyePhishing {
  namaKampanye: string;
  template: TemplatePhishing;
  tier: PhishingTier;
  penerima: PenerimaSimulasi[];
  gelombangKe: number;
  tanggalMulai: string;
  respons: ResponsTercatat[];
}

/** Validasi tanggal YYYY-MM-DD nyata (termasuk kabisat). */
function parseTanggal(nama: string, iso: string): void {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) {
    throw new Error(`${nama} harus format YYYY-MM-DD (contoh: 2026-10-20).`);
  }
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  if (
    d.getUTCFullYear() !== Number(m[1]) ||
    d.getUTCMonth() !== Number(m[2]) - 1 ||
    d.getUTCDate() !== Number(m[3])
  ) {
    throw new Error(`${nama} "${iso}" bukan tanggal yang nyata.`);
  }
}

/**
 * Menyusun kampanye simulasi. Melempar Error berbahasa Indonesia bila
 * validasi gagal (termasuk batas tier).
 */
export function buatKampanye(input: KampanyeInput): KampanyePhishing {
  const namaKampanye = input.namaKampanye.trim();
  if (!namaKampanye) {
    throw new Error('Nama kampanye wajib diisi.');
  }
  const template = templateDariId(input.templateId);
  if (!template) {
    throw new Error(
      `Template "${input.templateId}" tidak dikenal. Pilih: ` +
        TEMPLATE_SKEMA.map((t) => t.id).join(', ') + '.',
    );
  }
  const tier = tierPhishingDariId(input.tierId);
  if (!tier) {
    throw new Error(`Tier "${input.tierId}" tidak dikenal (HEMAT/PRO).`);
  }
  if (!Array.isArray(input.daftarPenerima) || input.daftarPenerima.length === 0) {
    throw new Error('Daftar penerima wajib diisi (minimal 1 karyawan).');
  }
  if (input.daftarPenerima.length > tier.maksPenerima) {
    throw new Error(
      `Tier ${tier.nama} maksimal ${tier.maksPenerima} penerima — ` +
        `Anda mengisi ${input.daftarPenerima.length}.`,
    );
  }
  const namaUnik = new Set<string>();
  for (const p of input.daftarPenerima) {
    const nama = p.nama.trim();
    if (!nama) {
      throw new Error('Nama penerima tidak boleh kosong.');
    }
    const kunci = nama.toLowerCase();
    if (namaUnik.has(kunci)) {
      throw new Error(`Nama penerima "${p.nama}" duplikat.`);
    }
    namaUnik.add(kunci);
  }
  const gelombangKe = input.gelombangKe ?? 1;
  if (!Number.isInteger(gelombangKe) || gelombangKe < 1) {
    throw new Error('Gelombang harus bilangan bulat ≥ 1.');
  }
  if (gelombangKe > tier.maksGelombang) {
    throw new Error(
      `Tier ${tier.nama} maksimal ${tier.maksGelombang} gelombang — ` +
        `gelombang ${gelombangKe} butuh tier PRO.`,
    );
  }
  parseTanggal('Tanggal mulai', input.tanggalMulai);

  return {
    namaKampanye,
    template,
    tier,
    penerima: input.daftarPenerima.map((p) => ({
      nama: p.nama.trim(),
      peran: p.peran?.trim() || undefined,
    })),
    gelombangKe,
    tanggalMulai: input.tanggalMulai,
    respons: [],
  };
}

/**
 * Mencatat respons seorang penerima (dicatat MANUAL oleh pemilik usaha —
 * simulasi, tanpa pengiriman nyata). Mengembalikan kampanye baru
 * (immutable); respons ganda untuk nama yang sama menimpa yang lama.
 */
export function catatRespons(
  kampanye: KampanyePhishing,
  nama: string,
  respons: ResponsPhishing,
): KampanyePhishing {
  const kunci = nama.trim().toLowerCase();
  const ada = kampanye.penerima.some(
    (p) => p.nama.toLowerCase() === kunci,
  );
  if (!ada) {
    throw new Error(
      `"${nama}" bukan penerima kampanye "${kampanye.namaKampanye}".`,
    );
  }
  if (respons !== 'KLIK' && respons !== 'LAPOR' && respons !== 'ABAIKAN') {
    throw new Error('Respons harus KLIK, LAPOR, atau ABAIKAN.');
  }
  const namaAsli =
    kampanye.penerima.find((p) => p.nama.toLowerCase() === kunci)!.nama;
  const responsBaru = kampanye.respons.filter(
    (r) => r.nama.toLowerCase() !== kunci,
  );
  responsBaru.push({ nama: namaAsli, respons });
  return { ...kampanye, respons: responsBaru };
}

export interface SkorPerPenerima {
  nama: string;
  respons: ResponsPhishing | null;
  /** KLIK=0, ABAIKAN=50, LAPOR=100, belum dicatat=0. */
  nilai: number;
}

export interface SkorKesadaran {
  totalPenerima: number;
  sudahMerespons: number;
  jumlahKlik: number;
  jumlahLapor: number;
  jumlahAbaikan: number;
  belumDicatat: number;
  /** 0–100: LAPOR=100, ABAIKAN=50, KLIK=0, belum dicatat=0. */
  skor: number;
  grade: 'A' | 'B' | 'C' | 'D';
  perPenerima: SkorPerPenerima[];
  langkah: string[];
}

export function skorKeGradeKesadaran(skor: number): 'A' | 'B' | 'C' | 'D' {
  if (skor >= 80) return 'A';
  if (skor >= 60) return 'B';
  if (skor >= 40) return 'C';
  return 'D';
}

/** Menghitung skor kesadaran dari respons yang tercatat. */
export function hitungSkor(kampanye: KampanyePhishing): SkorKesadaran {
  const peta = new Map<string, ResponsPhishing>();
  for (const r of kampanye.respons) {
    peta.set(r.nama.toLowerCase(), r.respons);
  }
  const nilaiDari = (r: ResponsPhishing | null): number =>
    r === 'LAPOR' ? 100 : r === 'ABAIKAN' ? 50 : 0;

  const perPenerima: SkorPerPenerima[] = kampanye.penerima.map((p) => {
    const respons = peta.get(p.nama.toLowerCase()) ?? null;
    return { nama: p.nama, respons, nilai: nilaiDari(respons) };
  });

  const total = perPenerima.length;
  const jumlahKlik = perPenerima.filter((p) => p.respons === 'KLIK').length;
  const jumlahLapor = perPenerima.filter((p) => p.respons === 'LAPOR').length;
  const jumlahAbaikan = perPenerima.filter((p) => p.respons === 'ABAIKAN').length;
  const belumDicatat = perPenerima.filter((p) => p.respons === null).length;
  const totalNilai = perPenerima.reduce((a, p) => a + p.nilai, 0);
  const skor = total === 0 ? 0 : Math.round((totalNilai / total) * 100) / 100;

  const langkah: string[] = [
    `Rumus: (LAPOR×100 + ABAIKAN×50 + KLIK×0 + belum dicatat×0) / ${total} penerima.`,
    `LAPOR ${jumlahLapor}, ABAIKAN ${jumlahAbaikan}, KLIK ${jumlahKlik}` +
      (belumDicatat > 0 ? `, belum dicatat ${belumDicatat} (dihitung 0)` : '') +
      ` → skor ${skor}.`,
  ];
  if (belumDicatat > 0) {
    langkah.push(
      'Catat respons semua penerima agar skor mencerminkan kondisi nyata.',
    );
  }
  if (jumlahKlik > 0) {
    langkah.push(
      `${jumlahKlik} karyawan "terjebak" — prioritaskan materi edukasi ` +
        `"${kampanye.template.nama}" untuk mereka.`,
    );
  }

  return {
    totalPenerima: total,
    sudahMerespons: total - belumDicatat,
    jumlahKlik,
    jumlahLapor,
    jumlahAbaikan,
    belumDicatat,
    skor,
    grade: skorKeGradeKesadaran(skor),
    perPenerima,
    langkah,
  };
}

export interface TrenGelombang {
  gelombangKe: number;
  skor: number;
  /** Selisih vs gelombang sebelumnya (null untuk gelombang pertama). */
  delta: number | null;
}

/**
 * Tren skor antar-gelombang (fitur tier PRO). Input boleh tidak urut —
 * diurutkan berdasarkan gelombangKe.
 */
export function trenGelombang(
  riwayat: { gelombangKe: number; skor: number }[],
): TrenGelombang[] {
  const urut = [...riwayat].sort((a, b) => a.gelombangKe - b.gelombangKe);
  return urut.map((r, i) => ({
    gelombangKe: r.gelombangKe,
    skor: r.skor,
    delta: i === 0 ? null : Math.round((r.skor - urut[i - 1].skor) * 100) / 100,
  }));
}

export interface MateriEdukasi {
  judul: string;
  isi: string;
}

export function materiEdukasi(): MateriEdukasi[] {
  return [
    {
      judul: '1. Kenali ciri phishing',
      isi:
        'Phishing selalu punya pola: pengirim asing/mirip-asli, bahasa ' +
        'mendesak ("segera!", "batas hari ini"), link aneh, dan permintaan ' +
        'data sensitif. Latih mata untuk memeriksa keempatnya sebelum ' +
        'bereaksi.',
    },
    {
      judul: '2. Cek pengirim asli',
      isi:
        'Jangan percaya nama tampilan. Periksa alamat email/nomor pengirim ' +
        'karakter per karakter — penipu memakai domain mirip ' +
        '(pln-contoh.invalid vs domain resmi).',
    },
    {
      judul: '3. Jangan klik karena panik',
      isi:
        'Rasa panik dan terburu-buru adalah senjata utama penipu. Pesan ' +
        'mendesak justru alasan untuk BERHENTI: tutup pesan, tarik napas, ' +
        'verifikasi lewat jalur lain.',
    },
    {
      judul: '4. Verifikasi via kanal resmi',
      isi:
        'Ada tagihan/masalah akun? Jangan klik link di pesan. Buka aplikasi ' +
        'resmi atau hubungi nomor layanan resmi yang Anda simpan sendiri — ' +
        'bukan nomor dari pesan mencurigakan.',
    },
    {
      judul: '5. Laporkan, jangan diam',
      isi:
        'Menerima pesan mencurigakan = prestasi bila dilaporkan. Segera ' +
        'teruskan ke atasan/owner agar pola serangan tercatat dan karyawan ' +
        'lain waspada. Tidak ada hukuman untuk yang melapor.',
    },
  ];
}

export const DISCLAIMER_PHISHING =
  'PhishingKu adalah SIMULASI EDUKASI: tidak ada pesan nyata yang dikirim, ' +
  'tidak ada link aktif yang disebar, dan template memakai domain contoh ' +
  'yang tidak bisa disalahgunakan. Tujuannya melatih kewaspadaan, bukan ' +
  'menjebak karyawan. Sampaikan ke peserta bahwa ini latihan setelah ' +
  'kampanye selesai.';

/** Laporan kampanye siap salin. */
export function formatLaporanTeks(kampanye: KampanyePhishing): string {
  const skor = hitungSkor(kampanye);
  const baris: string[] = [];
  baris.push(`${LABEL_SIMULASI}`);
  baris.push(`LAPORAN SIMULASI PHISHING — ${kampanye.namaKampanye}`);
  baris.push(
    `Skenario: ${kampanye.template.nama} (via ${kampanye.template.kanal}, ` +
      `kesulitan ${kampanye.template.kesulitan}) | Gelombang ${kampanye.gelombangKe} ` +
      `| Mulai ${kampanye.tanggalMulai} | Tier ${kampanye.tier.nama}`,
  );
  baris.push('');
  baris.push(
    `SKOR KESADARAN: ${skor.skor}/100 — Grade ${skor.grade} ` +
      `(${skor.totalPenerima} penerima)`,
  );
  baris.push(
    `LAPOR ${skor.jumlahLapor} | ABAIKAN ${skor.jumlahAbaikan} | ` +
      `KLIK ${skor.jumlahKlik}` +
      (skor.belumDicatat > 0 ? ` | BELUM DICATAT ${skor.belumDicatat}` : ''),
  );
  baris.push('');
  baris.push('RINCIAN PER PENERIMA:');
  for (const p of skor.perPenerima) {
    baris.push(`- ${p.nama}: ${p.respons ?? 'belum dicatat'} (${p.nilai})`);
  }
  baris.push('');
  baris.push('CIRI PHISHING YANG DILATIHKAN SKENARIO INI:');
  for (const c of kampanye.template.ciriPhishing) {
    baris.push(`- ${c}`);
  }
  baris.push('');
  baris.push('MATERI EDUKASI UNTUK KARYAWAN:');
  for (const m of materiEdukasi()) {
    baris.push(`- ${m.judul}: ${m.isi}`);
  }
  baris.push('');
  baris.push('Catatan: ' + DISCLAIMER_PHISHING);
  return baris.join('\n');
}
