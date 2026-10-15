/**
 * ============================================================
 * Content guardrails — P09 Madevi Explore
 * ============================================================
 *
 * Guardrail P09:
 *  - Konten kesehatan/psikologi TIDAK mendiagnosis.
 *  - Agama dan konflik disajikan berimbang berdasarkan sumber.
 *  - Tutorial berisiko punya level bahaya, alat pelindung (APD), dan batas
 *    profesional.
 *
 * Klasifikasi (`contentKind`) datang dari data artikel (pak Menu/Artikel
 * terpisah — P09 lulus: template siap menerima tanpa hard-code taxonomy).
 * `null` = tidak butuh disclaimer; jangan menebak kategori dari teks.
 *
 * Pesan ini muncul di UI sebagai banner; teks disimpan di SATU tempat agar
 * mudah diaudit dan tidak menyimpang antar halaman.
 */

export type ContentKind =
  'HEALTH' | 'PSYCHOLOGY' | 'RELIGION' | 'CONFLICT' | 'RISKY_TUTORIAL' | 'FINANCE';

export interface GuardrailDisclaimer {
  /** Tone netral, tidak menyalahkan pembaca. */
  titleId: string;
  titleEn: string;
  bodyId: string;
  bodyEn: string;
  /** Ikon emoji untuk pengguna non-visual; dibunggu aria-hidden. */
  icon: string;
}

const HEALTH_DISCLAIMER: GuardrailDisclaimer = {
  icon: '🩺',
  titleId: 'Informasi kesehatan, bukan diagnosis',
  titleEn: 'Health information, not a diagnosis',
  bodyId:
    'Konten ini bersifat umum dan tidak menggantikan diagnosa atau konsultasi ' +
    'dengan tenaga kesehatan profesional. Untuk keputusan kesehatan, hubungi ' +
    'dokter atau layanan kesehatan terdekat.',
  bodyEn:
    'This content is general and does not replace a diagnosis or consultation ' +
    'with a qualified health professional. For health decisions, contact a ' +
    'doctor or nearby health service.',
};

const PSYCHOLOGY_DISCLAIMER: GuardrailDisclaimer = {
  icon: '🧠',
  titleId: 'Informasi psikologis, bukan diagnosis',
  titleEn: 'Psychological information, not a diagnosis',
  bodyId:
    'Konten ini menjelaskan konsep secara umum dan tidak dapat digunakan ' +
    'untuk mendiagnosis diri sendiri atau orang lain. Jika Anda kesulitan, ' +
    'carilah psikolog atau konselor profesional.',
  bodyEn:
    'This content explains concepts generally and cannot be used to diagnose ' +
    'yourself or others. If you are struggling, please seek a professional ' +
    'psychologist or counselor.',
};

const RELIGION_DISCLAIMER: GuardrailDisclaimer = {
  icon: '⚖️',
  titleId: 'Disajikan berimbang berdasarkan sumber',
  titleEn: 'Presented in balance based on sources',
  bodyId:
    'Konten keagamaan disajikan untuk memahami, bukan meyakinkan. Setiap ' +
    'klaim dicantumkan sumbernya; pandangan resmi suatu kelompok ' +
    'dilaporkan apa adanya. Baca dari perspektif pemeluknya sebelum ' +
    'membentuk pendapat.',
  bodyEn:
    'Religious content is presented to inform, not to convince. Every claim ' +
    'cites its source; a group’s official view is reported as-is. Read from ' +
    'the believer’s perspective before forming an opinion.',
};

const CONFLICT_DISCLAIMER: GuardrailDisclaimer = {
  icon: '🕊️',
  titleId: 'Konten konflik — multi perspektif',
  titleEn: 'Conflict content — multiple perspectives',
  bodyId:
    'Bersengketa? Konten ini melaporkan beberapa sudut pandang yang ' +
    'bersaing dengan sumber masing-masing. Tidak ada satu narasi yang ' +
    'diutamakan. Periksa klaim tiap pihak sebelum menyimpulkan.',
  bodyEn:
    'In dispute? This content reports several competing viewpoints with ' +
    'their own sources. No single narrative is favored. Verify each party’s ' +
    'claims before concluding.',
};

const RISKY_TUTORIAL_DISCLAIMER: GuardrailDisclaimer = {
  icon: '⚠️',
  titleId: 'Tutorial berisiko — baca peringatan',
  titleEn: 'Risky tutorial — read the warning',
  bodyId:
    'Tutorial ini membawa risiko cedera atau kerusakan. Kenali level bahaya, ' +
    'gunakan alat pelindung diri (APD) yang sesuai, dan tahu batas ' +
    'kompetensi Anda. Jika ragu, serahkan pada profesional.',
  bodyEn:
    'This tutorial carries a risk of injury or damage. Know the danger ' +
    'level, use appropriate personal protective equipment (PPE), and know ' +
    'your competence limits. If unsure, hire a professional.',
};

const FINANCE_DISCLAIMER: GuardrailDisclaimer = {
  icon: '💰',
  titleId: 'Informasi finansial, bukan nasihat investasi',
  titleEn: 'Financial information, not investment advice',
  bodyId:
    'Hasil kalkulasi ini bersifat umum dan tidak mempertimbangkan kondisi ' +
    'keuangan pribadi Anda. Bukan ajakan atau rekomendasi membeli produk ' +
    'keuangan apa pun. Untuk keputusan finansial, konsultasikan dengan ' +
    'penasihat keuangan terlisensi.',
  bodyEn:
    'This calculation is general and does not consider your personal ' +
    'financial situation. It is not an offer or recommendation to buy any ' +
    'financial product. For financial decisions, consult a licensed advisor.',
};

const DISCLAIMERS: Record<ContentKind, GuardrailDisclaimer> = {
  HEALTH: HEALTH_DISCLAIMER,
  PSYCHOLOGY: PSYCHOLOGY_DISCLAIMER,
  RELIGION: RELIGION_DISCLAIMER,
  CONFLICT: CONFLICT_DISCLAIMER,
  RISKY_TUTORIAL: RISKY_TUTORIAL_DISCLAIMER,
  FINANCE: FINANCE_DISCLAIMER,
};

/** Level bahaya tutorial (P09: "tutorial berisiko memiliki level bahaya"). */
export type DangerLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';

export const DANGER_LABELS: Record<DangerLevel, { id: string; en: string }> = {
  LOW: { id: 'Risiko rendah', en: 'Low risk' },
  MEDIUM: { id: 'Risiko sedang', en: 'Medium risk' },
  HIGH: { id: 'Risiko tinggi', en: 'High risk' },
  EXTREME: { id: 'Risiko sangat tinggi', en: 'Extreme risk' },
};

/** Alat pelindung diri standar (P09: "alat pelindung"). */
export const DEFAULT_PPE: { id: string; en: string }[] = [
  { id: 'Pelindung mata', en: 'Eye protection' },
  { id: 'Sarung tangan', en: 'Gloves' },
  { id: 'Pakaian tertutup', en: 'Covered clothing' },
];

/**
 * Ambil disclaimer untuk sebuah artikel. `null` bila tidak relevan —
 * pemanggil tidak boleh menebak `contentKind` dari teks.
 */
export function guardrailFor(kind: ContentKind | null | undefined): GuardrailDisclaimer | null {
  if (!kind) return null;
  return DISCLAIMERS[kind] ?? null;
}

/**
 * Batas profesional (P09: "batas profesional"). TRUE bila level bahaya
 * melewati ambang di mana hanya profesional yang seharusnya melakukannya.
 */
export function requiresProfessional(danger: DangerLevel | null | undefined): boolean {
  return danger === 'HIGH' || danger === 'EXTREME';
}
