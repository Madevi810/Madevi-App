/**
 * Daftar kata/frasa terlarang untuk filter otomatis Madevi Line.
 *
 * KONSEP: ini adalah KONFIGURASI, bukan kode. Admin/Owner mengedit file ini
 * untuk menyesuaikan cakupan filter tanpa menyentuh logika engine. Dipakai
 * oleh `LocalModerationEngine` (lihat `src/services/moderation.ts`).
 *
 * Kategori mengikuti visi Ade: pornografi, pengancaman, kekerasan, pelecehan,
 * dan SARA kasar. Semua entri dilewatkan normalisasi yang sama dengan teks
 * input (NFKC + lower + trim) sebelum dicocokkan, jadi cukup tulis bentuk
 * huruf kecilnya saja.
 *
 * Aturan penambahan:
 * - Frasa lebih baik dari kata tunggal (mengurangi false positive).
 * - Varian ejaan umum (baik/baek, g/g', dsb.) dicatat eksplisit.
 * - Jangan masukkan kata yang lazim dalam konteks edukasi/medis tanpa
 *   pengecualian — engine sudah punya jalur educational context.
 */

export type BlockedWordCategory =
  /** Pornografi / konten seksual eksplisit */
  | 'PORNOGRAFI'
  /** Pengancaman tindakan terhadap orang lain */
  | 'ANCAMAN'
  /** Kekerasan fisik, penyiksaan, aksi kejam */
  | 'KEKERASAN'
  /** Pelecehan, hinaan identitas, body-shaming, pelecehan seksual */
  | 'PELECEHAN'
  /** SARA kasar: hinaan suku/agama/ras/gender/orientasi */
  | 'SARA';

export interface BlockedWordEntry {
  category: BlockedWordCategory;
  /** Frasa dalam huruf kecil; dicocokkan sebagai substring setelah normalisasi. */
  pattern: string;
}

export const BLOCKED_WORDS: readonly BlockedWordEntry[] = [
  // ---------- PORNOGRAFI ----------
  { category: 'PORNOGRAFI', pattern: 'pornografi' },
  { category: 'PORNOGRAFI', pattern: 'pornography' },
  { category: 'PORNOGRAFI', pattern: 'porn' },
  { category: 'PORNOGRAFI', pattern: 'bokep' },
  { category: 'PORNOGRAFI', pattern: 'video porno' },
  { category: 'PORNOGRAFI', pattern: 'konten seksual eksplisit' },
  { category: 'PORNOGRAFI', pattern: 'explicit sexual content' },
  { category: 'PORNOGRAFI', pattern: 'hubungan badan' },
  { category: 'PORNOGRAFI', pattern: 'ml sama' },
  { category: 'PORNOGRAFI', pattern: 'ngewe' },
  { category: 'PORNOGRAFI', pattern: 'sex tape' },
  { category: 'PORNOGRAFI', pattern: 'nude pic' },
  { category: 'PORNOGRAFI', pattern: 'kirim foto bugil' },
  { category: 'PORNOGRAFI', pattern: 'jasa escort' },
  { category: 'PORNOGRAFI', pattern: 'escort service' },
  { category: 'PORNOGRAFI', pattern: 'pijat plus plus' },
  { category: 'PORNOGRAFI', pattern: 'pemerkosaan' },
  { category: 'PORNOGRAFI', pattern: 'rape' },

  // ---------- ANCAMAN ----------
  { category: 'ANCAMAN', pattern: 'akan membunuh' },
  { category: 'ANCAMAN', pattern: 'akan kubunuh' },
  { category: 'ANCAMAN', pattern: 'ingin membunuh' },
  { category: 'ANCAMAN', pattern: 'akan mengebom' },
  { category: 'ANCAMAN', pattern: 'akan saya gebuk' },
  { category: 'ANCAMAN', pattern: 'akan saya pukuli' },
  { category: 'ANCAMAN', pattern: 'kamu akan mati' },
  { category: 'ANCAMAN', pattern: 'kamu akan saya habisi' },
  { category: 'ANCAMAN', pattern: 'ingin menghabisi' },
  { category: 'ANCAMAN', pattern: 'pantau terus rumahmu' },
  { category: 'ANCAMAN', pattern: 'saya tahu alamatmu' },
  { category: 'ANCAMAN', pattern: 'akan saya datangi' },
  { category: 'ANCAMAN', pattern: 'siap-siap saja' },
  { category: 'ANCAMAN', pattern: 'ingin membom' },
  { category: 'ANCAMAN', pattern: 'rencanakan penyerangan' },
  { category: 'ANCAMAN', pattern: 'kirim orang ke rumahmu' },
  { category: 'ANCAMAN', pattern: 'akan saya bacok' },
  { category: 'ANCAMAN', pattern: 'akan saya tikam' },
  { category: 'ANCAMAN', pattern: 'akan saya dor' },
  { category: 'ANCAMAN', pattern: 'bakar rumahmu' },

  // ---------- KEKERASAN ----------
  { category: 'KEKERASAN', pattern: 'cara menyiksa' },
  { category: 'KEKERASAN', pattern: 'tutorial menyiksa' },
  { category: 'KEKERASAN', pattern: 'cara memukuli' },
  { category: 'KEKERASAN', pattern: 'cara menculik' },
  { category: 'KEKERASAN', pattern: 'cara merakit bom' },
  { category: 'KEKERASAN', pattern: 'resep bahan peledak' },
  { category: 'KEKERASAN', pattern: 'how to make a bomb' },
  { category: 'KEKERASAN', pattern: 'merencanakan penembakan' },
  { category: 'KEKERASAN', pattern: 'cara membuat senjata api' },
  { category: 'KEKERASAN', pattern: 'jual senjata api ilegal' },
  { category: 'KEKERASAN', pattern: 'jual tajam ilegal' },
  { category: 'KEKERASAN', pattern: 'gegabah lawan polisi' },
  { category: 'KEKERASAN', pattern: 'karungkus' },
  { category: 'KEKERASAN', pattern: 'penganiayaan' },
  { category: 'KEKERASAN', pattern: 'penyiksaan' },
  { category: 'KEKERASAN', pattern: 'pemukulan' },
  { category: 'KEKERASAN', pattern: 'pertarungan jalanan' },
  { category: 'KEKERASAN', pattern: 'tawuran pelajar' },

  // ---------- PELECEHAN ----------
  { category: 'PELECEHAN', pattern: 'pelacur' },
  { category: 'PELECEHAN', pattern: 'jalang' },
  { category: 'PELECEHAN', pattern: 'bitch' },
  { category: 'PELECEHAN', pattern: 'whore' },
  { category: 'PELECEHAN', pattern: 'slut' },
  { category: 'PELECEHAN', pattern: 'bodoh banget' },
  { category: 'PELECEHAN', pattern: 'goblok' },
  { category: 'PELECEHAN', pattern: 'goblog' },
  { category: 'PELECEHAN', pattern: 'idiot' },
  { category: 'PELECEHAN', pattern: 'motherfucker' },
  { category: 'PELECEHAN', pattern: 'fuck you' },
  { category: 'PELECEHAN', pattern: 'kimak' },
  { category: 'PELECEHAN', pattern: 'kampret' },
  { category: 'PELECEHAN', pattern: 'bangsat' },
  { category: 'PELECEHAN', pattern: 'anjing' },
  { category: 'PELECEHAN', pattern: 'anjg' },
  { category: 'PELECEHAN', pattern: 'kontol' },
  { category: 'PELECEHAN', pattern: 'memek' },
  { category: 'PELECEHAN', pattern: 'pepek' },
  { category: 'PELECEHAN', pattern: 'titit' },
  { category: 'PELECEHAN', pattern: 'ngentot' },
  { category: 'PELECEHAN', pattern: 'ngntot' },
  { category: 'PELECEHAN', pattern: 'pantek' },
  { category: 'PELECEHAN', pattern: 'pantat' },
  { category: 'PELECEHAN', pattern: 'masturbasi' },
  { category: 'PELECEHAN', pattern: 'ngocok' },
  { category: 'PELECEHAN', pattern: 'coli' },
  { category: 'PELECEHAN', pattern: 'body shaming' },
  { category: 'PELECEHAN', pattern: 'gemuk banget sih lo' },
  { category: 'PELECEHAN', pattern: 'kurus banget sih lo' },
  { category: 'PELECEHAN', pattern: 'muka lo jelek' },
  { category: 'PELECEHAN', pattern: 'cantik kok jahat' },
  { category: 'PELECEHAN', pattern: 'pelecehan seksual' },
  { category: 'PELECEHAN', pattern: 'sexual harassment' },
  { category: 'PELECEHAN', pattern: 'catcall' },
  { category: 'PELECEHAN', pattern: 'ngesex paksa' },
  { category: 'PELECEHAN', pattern: 'tidur sama aku' },
  { category: 'PELECEHAN', pattern: 'kirim foto kamu' },
  { category: 'PELECEHAN', pattern: 'kirimin foto' },
  { category: 'PELECEHAN', pattern: 'tunjukin dada' },
  { category: 'PELECEHAN', pattern: 'buka baju' },

  // ---------- SARA (suku/agama/ras/gender/orientasi) ----------
  { category: 'SARA', pattern: 'cina anjing' },
  { category: 'SARA', pattern: 'cina bodoh' },
  { category: 'SARA', pattern: 'cina kampung' },
  { category: 'SARA', pattern: 'chink' },
  { category: 'SARA', pattern: 'nigger' },
  { category: 'SARA', pattern: 'nigga' },
  { category: 'SARA', pattern: 'hitam anjing' },
  { category: 'SARA', pattern: 'kafir' },
  { category: 'SARA', pattern: 'kapir' },
  { category: 'SARA', pattern: 'infidel' },
  { category: 'SARA', pattern: 'muslim terorist' },
  { category: 'SARA', pattern: 'muslim bodoh' },
  { category: 'SARA', pattern: 'kristen anjing' },
  { category: 'SARA', pattern: 'yahudi anjing' },
  { category: 'SARA', pattern: 'hindu anjing' },
  { category: 'SARA', pattern: 'buddha anjing' },
  { category: 'SARA', pattern: 'indonesia anjing' },
  { category: 'SARA', pattern: 'pribumi asli' },
  { category: 'SARA', pattern: 'asing pendatang' },
  { category: 'SARA', pattern: 'faggot' },
  { category: 'SARA', pattern: 'fag' },
  { category: 'SARA', pattern: 'homo' },
  { category: 'SARA', pattern: 'banci' },
  { category: 'SARA', pattern: 'bencong' },
  { category: 'SARA', pattern: 'waria anjing' },
  { category: 'SARA', pattern: 'transgender anjing' },
  { category: 'SARA', pattern: 'lgbt anjing' },
  { category: 'SARA', pattern: 'sesat' },
  { category: 'SARA', pattern: 'ajaran sesat' },
  { category: 'SARA', pattern: 'kafir kayak' },
];

/**
 * Daftar indikasi krisis untuk Sosial Curhat (INSTRUKSI-03 item #4).
 *
 * Jika postingan curhat mengandung salah satu frasa ini, kartu bantuan
 * krisis ditampilkan otomatis di bawah postingan dan konten ditahan untuk
 * moderasi sebelum tampil menonjol.
 */
export const CRISIS_INDICATORS: readonly string[] = [
  'bunuh diri',
  'ingin bunuh diri',
  'mau bunuh diri',
  'berpikir bunuh diri',
  'renyut bunuh diri',
  'menyakiti diri',
  'melukai diri',
  'memotong pergelangan',
  'memotong tangan',
  'berpisah rasa sakit',
  'mengakhiri hidup',
  'mengakhiri semuanya',
  'menyerah hidup',
  'tidak ingin hidup',
  'lebih baik mati',
  'lebih baik hilang',
  'tidak ada yang peduli',
  'semua lebih baik tanpa aku',
  'beban keluarga',
  'kamu tidak akan melihatku lagi',
  'pamit terakhir',
  'surat perpisahan',
  'menenggak obat',
  'meminum obat berlebih',
  'overdosis',
  'gantung diri',
  'loncat dari',
  'campakkan diri',
  'berakhir saja',
  'menyerah saja',
  'hilang dari dunia',
  'dunia lebih baik tanpa aku',
  'kirim doa terakhir',
  'mau pergi jauh',
  'melepaskan semua',

  // ---------- English indicators ----------
  'kill myself',
  'want to kill myself',
  'thinking about suicide',
  'suicide',
  'hurt myself',
  'cutting myself',
  'cut my wrist',
  'end my life',
  'end it all',
  'end everything',
  'give up on life',
  "don't want to live",
  'better off dead',
  'better off without me',
  'nobody cares',
  'nobody cares about me',
  'burden to my family',
  "you won't see me again",
  'final goodbye',
  'goodbye forever',
  'suicide note',
  'overdose',
  'take all my pills',
  'hang myself',
  'jump off',
  'just end it',
  'world is better without me',
  'i want to disappear',
  'i want to die',
];

/**
 * Sumber daya bantuan krisis untuk kartu dukungan otomatis.
 * Nomor 119 ext 8 adalah hotline Kemenkes (sebagaimana diminta INSTRUKSI-03).
 */
export const CRISIS_HELP = {
  hotlineId: '119 ext 8',
  hotlineLabel: 'Halte Kesehatan Jiwa Kemenkes (gratis 24 jam)',
  messageId:
    'Kamu tidak sendirian. Apa pun yang kamu rasakan sekarang berat, dan kamu pantas didengarkan oleh orang yang terlatih. Hubungi hotline di atas — mereka siap mendengarkan tanpa menghakimi. Kalau kamu dalam bahaya sekarang, hubungi 119 atau datang ke fasilitas kesehatan terdekat.',
  messageEn:
    'You are not alone. Whatever you are feeling right now is heavy, and you deserve to be heard by someone trained. Call the hotline above — they are ready to listen without judgment. If you are in immediate danger, call 119 or go to the nearest health facility.',
} as const;

/**
 * Batas rate perlindungan (INSTRUKSI-03 item #6). Simulasi — mudah diubah.
 */
export const LINE_RATE_LIMITS = {
  /** Maksimum postingan baru per principal per jam. */
  postsPerHour: 10,
  /** Maksimum komentar baru per principal per jam. */
  commentsPerHour: 30,
} as const;

/**
 * Kategori laporan untuk tombol "Laporkan" (INSTRUKSI-03 item #2).
 *
 * `key` disimpan di `social_reports.reason_category` (lihat LINE-PROTECT-002).
 * `labelId`/`labelEn` dipakai UI; urutan = urutan tampil di form.
 */
export const REPORT_CATEGORIES: readonly {
  key: string;
  labelId: string;
  labelEn: string;
}[] = [
  { key: 'PORNOGRAFI', labelId: 'Pornografi', labelEn: 'Pornography' },
  { key: 'ANCAMAN', labelId: 'Ancaman', labelEn: 'Threat' },
  { key: 'KEKERASAN', labelId: 'Kekerasan', labelEn: 'Violence' },
  { key: 'PELECEHAN', labelId: 'Pelecehan', labelEn: 'Harassment' },
  { key: 'SARA', labelId: 'SARA (suku/agama/ras)', labelEn: 'Hate speech' },
  { key: 'SPAM', labelId: 'Spam', labelEn: 'Spam' },
  { key: 'LAINNYA', labelId: 'Lainnya', labelEn: 'Other' },
];

/**
 * Normalisasi yang sama dipakai engine: NFKC + lower + trim.
 * Dipakai baik untuk input teks maupun entri daftar ini.
 */
export function normalizeForMatching(text: string): string {
  return text.normalize('NFKC').trim().toLocaleLowerCase('id-ID');
}

/**
 * Cari entri terlarang pertama yang cocok dengan teks.
 * Mengembalikan null bila aman.
 *
 * Dicocokkan substring (bukan word-boundary) karena banyak entri berupa frasa
 * panjang dan ejaan informal bisa menempel pada kata lain. Penulis daftar
 * bertanggung jawab memilih frasa yang cukup spesifik.
 */
export function findBlockedWord(
  text: string,
): { category: BlockedWordCategory; pattern: string } | null {
  const normalized = normalizeForMatching(text);
  if (!normalized) return null;
  for (const entry of BLOCKED_WORDS) {
    if (normalized.includes(entry.pattern)) {
      return { category: entry.category, pattern: entry.pattern };
    }
  }
  return null;
}

/**
 * Deteksi indikasi krisis pada teks postingan curhat.
 */
export function findCrisisIndicator(text: string): string | null {
  const normalized = normalizeForMatching(text);
  if (!normalized) return null;
  for (const indicator of CRISIS_INDICATORS) {
    if (normalized.includes(indicator)) return indicator;
  }
  return null;
}
