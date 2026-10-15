'use client';

/**
 * R1PendidikanNavigator — P04-A (Revisi-promt4.md)
 *
 * JALUR PEMBELAJARAN:
 *   2 kapsul → popup 6 Jenjang (+ Jalur Kesetaraan/Kursus/Pelatihan)
 *   → popup tutup otomatis → grid Jenis Sekolah/Unit INLINE (3 kolom)
 *   → kartu unit → accordion INLINE panel 4 tombol
 *   (Pengenalan · Aturan · Persiapan · Belajar)
 *   → Belajar → daftar Kelas/Program INLINE
 *   → kelas → popup kecil Pilih Semester (hanya bila berlaku)
 *   → semester → ROUTE halaman belajar
 *
 * JALUR UJIAN:
 *   → unit → Kelas/Program → popup Mata Pelajaran → popup Jenis Ujian
 *   → ROUTE halaman ujian
 *
 * Aturan scope yang ditegakkan:
 *  - Tidak ada <select> native.
 *  - Popup awal (jenjang) wajib tutup otomatis setelah pilihan diambil.
 *  - Tidak ada refresh/route change sebelum halaman akhir (belajar/ujian).
 *  - Pilihan tingkat lanjut accordion inline + breadcrumb; popup kecil hanya
 *    untuk keputusan pendek (semester, mapel, jenis ujian).
 *  - Data struktural (jenjang/unit/kelas) adalah pemetaan scope wajib,
 *    bukan konten artikel. Konten materi/soal tetap menunggu data Admin.
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useLanguage } from './theme-provider';

/* ============================================================ Tipe data */

type Bilingual = { id: string; en: string };

interface SchoolUnit extends Bilingual {
  /** id stabil untuk kebutuhan React key & pelacakan */
  key: string;
  /** daftar kelas/program; kosong = unit berjenjang tanpa kelas tetap */
  classes?: string[];
  /** true bila unit berbasis semester (tinggi/ profesi) sehingga popup
   *  Pilih Semester tidak ditambahkan (sudah tertanam di label kelas) */
  semesterBased?: boolean;
}

export interface JenjangDef extends Bilingual {
  key: string;
  units: SchoolUnit[];
}

/* ============================================================ Data struktural scope P04-A
 *
 * Pemetaan ini bersumber dari tabel "Jenjang → Jenis/unit" dan
 * "Jalur Pembelajaran" di Revisi-promt4.md P04-A. Ia adalah kerangka
 * navigasi wajib, bukan artikel/fakta yang harus diverifikasi Admin.
 */

export const JENJANG_LIST: JenjangDef[] = [
  {
    key: 'paud',
    id: 'Pendidikan Anak Usia Dini',
    en: 'Early Childhood Education',
    units: [
      {
        key: 'tpa',
        id: 'TPA',
        en: 'TPA',
        classes: ['Kelompok Bermain', 'Kelompok A', 'Kelompok B'],
      },
      {
        key: 'kb',
        id: 'Kelompok Bermain',
        en: 'Kelompok Bermain',
        classes: ['Usia 2–3', 'Usia 3–4'],
      },
      { key: 'sps', id: 'SPS/PAUD', en: 'SPS/PAUD', classes: ['Kelompok A', 'Kelompok B'] },
      { key: 'tk', id: 'TK', en: 'TK', classes: ['TK A', 'TK B'] },
      { key: 'ra', id: 'RA', en: 'RA', classes: ['RA A', 'RA B'] },
    ],
  },
  {
    key: 'dasar',
    id: 'Pendidikan Dasar',
    en: 'Primary Education',
    units: [
      {
        key: 'sd',
        id: 'SD',
        en: 'SD',
        classes: ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'],
      },
      {
        key: 'mi',
        id: 'MI',
        en: 'MI',
        classes: ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'],
      },
      {
        key: 'paket-a',
        id: 'Paket A / Jalur Setara',
        en: 'Paket A / Equivalent',
        classes: ['Tingkat Dasar', 'Tingkat Lanjut'],
      },
    ],
  },
  {
    key: 'menengah-pertama',
    id: 'Pendidikan Menengah Pertama',
    en: 'Junior Secondary',
    units: [
      { key: 'smp', id: 'SMP', en: 'SMP', classes: ['Kelas 7', 'Kelas 8', 'Kelas 9'] },
      { key: 'mts', id: 'MTs', en: 'MTs', classes: ['Kelas 7', 'Kelas 8', 'Kelas 9'] },
      {
        key: 'paket-b',
        id: 'Paket B / Jalur Setara',
        en: 'Paket B / Equivalent',
        classes: ['Tingkat I', 'Tingkat II', 'Tingkat III'],
      },
    ],
  },
  {
    key: 'menengah-atas',
    id: 'Pendidikan Menengah Atas',
    en: 'Senior Secondary',
    units: [
      { key: 'sma', id: 'SMA', en: 'SMA', classes: ['Kelas 10', 'Kelas 11', 'Kelas 12'] },
      { key: 'smk', id: 'SMK', en: 'SMK', classes: ['Kelas 10', 'Kelas 11', 'Kelas 12'] },
      { key: 'ma', id: 'MA', en: 'MA', classes: ['Kelas 10', 'Kelas 11', 'Kelas 12'] },
      { key: 'mak', id: 'MAK', en: 'MAK', classes: ['Kelas 10', 'Kelas 11', 'Kelas 12'] },
      {
        key: 'paket-c',
        id: 'Paket C / Jalur Setara',
        en: 'Paket C / Equivalent',
        classes: ['Tingkat I', 'Tingkat II', 'Tingkat III'],
      },
    ],
  },
  {
    key: 'tinggi',
    id: 'Pendidikan Tinggi',
    en: 'Higher Education',
    units: [
      {
        key: 'd123',
        id: 'D1/D2/D3',
        en: 'D1/D2/D3',
        semesterBased: true,
        classes: ['Semester 1–2', 'Semester 3–4', 'Semester 5–6'],
      },
      {
        key: 'd4',
        id: 'D4 / Sarjana Terapan',
        en: 'D4 / Applied Bachelor',
        semesterBased: true,
        classes: [
          'Semester 1',
          'Semester 2',
          'Semester 3',
          'Semester 4',
          'Semester 5',
          'Semester 6',
          'Semester 7',
          'Semester 8',
        ],
      },
      {
        key: 's1',
        id: 'S1 / Sarjana',
        en: 'S1 / Bachelor',
        semesterBased: true,
        classes: [
          'Semester 1',
          'Semester 2',
          'Semester 3',
          'Semester 4',
          'Semester 5',
          'Semester 6',
          'Semester 7',
          'Semester 8',
        ],
      },
      {
        key: 'pt-umum',
        id: 'Perguruan Tinggi Umum/Keagamaan',
        en: 'General/Religious University',
        semesterBased: true,
        classes: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'],
      },
    ],
  },
  {
    key: 'spesialis',
    id: 'Pendidikan Spesialis dan Subspesialis',
    en: 'Specialist & Subspecialist',
    units: [
      {
        key: 'profesi',
        id: 'Profesi',
        en: 'Professional',
        semesterBased: true,
        classes: ['Tahap 1', 'Tahap 2'],
      },
      {
        key: 'sp1',
        id: 'Spesialis 1',
        en: 'Specialist 1',
        semesterBased: true,
        classes: ['Tahap 1', 'Tahap 2', 'Tahap 3'],
      },
      {
        key: 'sp2',
        id: 'Spesialis 2',
        en: 'Specialist 2',
        semesterBased: true,
        classes: ['Tahap 1', 'Tahap 2'],
      },
      {
        key: 'subsp',
        id: 'Subspesialis',
        en: 'Subspecialist',
        semesterBased: true,
        classes: ['Tahap 1', 'Tahap 2'],
      },
    ],
  },
];

const NONFORMAL: JenjangDef = {
  key: 'nonformal',
  id: 'Jalur Kesetaraan, Kursus, dan Pelatihan',
  en: 'Equivalency, Courses & Training',
  units: [
    {
      key: 'kesetaraan',
      id: 'Kesetaraan',
      en: 'Equivalency',
      classes: ['Paket A', 'Paket B', 'Paket C'],
    },
    {
      key: 'kursus',
      id: 'Kursus',
      en: 'Short Course',
      classes: ['Tingkat Dasar', 'Tingkat Lanjut'],
    },
    {
      key: 'pelatihan',
      id: 'Pelatihan',
      en: 'Training',
      classes: ['Tingkat Dasar', 'Tingkat Lanjut'],
    },
  ],
};

const SCHOOL_PANELS: Bilingual[] = [
  { id: 'Pengenalan', en: 'Introduction' },
  { id: 'Aturan', en: 'Rules' },
  { id: 'Persiapan', en: 'Preparation' },
  { id: 'Belajar', en: 'Study' },
];

const SEMESTERS = ['Semester 1', 'Semester 2'];

/** Jenis ujian yang tampil hanya jika relevan per jenjang (data-driven). */
const EXAM_TYPES: Bilingual[] = [
  { id: 'Diagnostik / Penempatan', en: 'Diagnostic / Placement' },
  { id: 'Penilaian Awal Semester', en: 'Beginning-of-Semester' },
  { id: 'Penilaian Tengah Semester', en: 'Mid-Semester' },
  { id: 'Penilaian Akhir Semester', en: 'End-of-Semester' },
  { id: 'Akhir Tahun / Kenaikan Kelas', en: 'End-of-Year' },
  { id: 'Ujian Sekolah', en: 'School Exam' },
];

/** Tujuh pilihan mata pelajaran Agama sesuai scope P04-A (tetap, produk nasional). */
const AGAMA_OPTIONS: Bilingual[] = [
  { id: 'Islam', en: 'Islam' },
  { id: 'Kristen Protestan', en: 'Protestant Christianity' },
  { id: 'Katolik', en: 'Catholic Christianity' },
  { id: 'Hindu', en: 'Hinduism' },
  { id: 'Buddha', en: 'Buddhism' },
  { id: 'Konghucu', en: 'Confucianism' },
  { id: 'Kepercayaan terhadap Tuhan Yang Maha Esa', en: 'Belief in the One and Only God' },
];

/** Ciri label mapel Agama (bukan nama teologi; hanya pencocokan label). */
const AGAMA_KEYS = ['agama', 'religi', 'budi pekerti'];
/** Ciri label Muatan Lokal / Bahasa Daerah. */
const BAHASA_KEYS = [
  'muatan lokal',
  'bahasa daerah',
  'bahasa jawa',
  'bahasa madura',
  'bahasa sunda',
  'bahasa bali',
];

/** Bahasa daerah per wilayah. Daftar tetap hanya sebagai contoh yang sudah
 *  didefinisikan scope (Jawa Timur). Wilayah/bahasa lain menunggu data Admin. */
const BAHASA_DAERAH: Record<string, Bilingual[]> = {
  'jawa timur': [
    { id: 'Bahasa Jawa', en: 'Javanese' },
    { id: 'Bahasa Madura', en: 'Madurese' },
  ],
};

/** Slugify label → path aman URL (lowercase, hyphen). */
function toSlug(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* ============================================================ Popup shell
 *
 * Popup pusat layar dengan backdrop, tombol Tutup, focus trap sederhana,
 * dan Escape untuk menutup. Dipakai untuk semua popup pendek R1.
 */

type PopupKind = 'jenjang' | 'semester' | 'mapel' | 'exam' | 'agama' | 'bahasa';

interface PopupState {
  kind: PopupKind;
  /** kelas aktif untuk popup semester / mapel */
  kelas?: string;
  /** semester aktif untuk popup mapel / exam / agama / bahasa */
  semester?: string;
  /** mata pelajaran aktif untuk popup exam / agama / bahasa */
  mapel?: string;
}

interface SchoolProfileData {
  current_entitlement?: 'FREE' | 'PLUS' | 'PRO' | 'LOVE';
}

function PopupShell({
  title,
  onClose,
  isId,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  isId: boolean;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  /* fokus tombol tutup saat popup muncul (a11y) */
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  return (
    <div
      ref={backdropRef}
      className="r1-popup-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div className={`r1-popup${wide ? ' r1-popup--wide' : ''}`}>
        <div className="r1-popup__header">
          <h2 className="r1-popup__title">{title}</h2>
          <button
            ref={closeBtnRef}
            type="button"
            className="r1-popup__close"
            onClick={onClose}
            aria-label={isId ? 'Tutup' : 'Close'}
          >
            ✕
          </button>
        </div>
        <div className="r1-popup__body">{children}</div>
      </div>
    </div>
  );
}

/* ============================================================ Komponen utama */

export function R1PendidikanNavigator({ fullSlug }: { fullSlug: string }) {
  const { language } = useLanguage();
  const isId = language === 'id';
  const router = useRouter();

  /* --- state navigasi (semua inline, tidak ada route change) --- */
  const [mode, setMode] = useState<'PEMBELAJARAN' | 'UJIAN' | null>(null);
  const [activeJenjang, setActiveJenjang] = useState<JenjangDef | null>(null);
  const [openUnitKey, setOpenUnitKey] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  /** kelas/program yang dipilih (sementara, sebelum semester) */
  const [popup, setPopup] = useState<PopupState | null>(null);
  /** search navigator kecil */
  const [query, setQuery] = useState('');
  // UI School sengaja fail-closed. Endpoint materi/ujian tetap menjadi
  // penegak otorisasi final di server, tetapi navigator tidak boleh memberi
  // kesan akses sebelum tier kanonis sudah terbaca.
  const [schoolAccess, setSchoolAccess] = useState<'CHECKING' | 'GRANTED' | 'LOCKED'>('CHECKING');

  useEffect(() => {
    let active = true;
    fetch('/api/v1/profile', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { data?: SchoolProfileData } | null) => {
        if (!active) return;
        const tier = body?.data?.current_entitlement;
        // Kontrak School hanya membuka materi untuk Pro atau hibah Love.
        setSchoolAccess(tier === 'PRO' || tier === 'LOVE' ? 'GRANTED' : 'LOCKED');
      })
      .catch(() => {
        if (active) setSchoolAccess('LOCKED');
      });
    return () => {
      active = false;
    };
  }, []);

  const isAtRoot =
    !fullSlug || fullSlug === 'pendidikan-sekolah' || fullSlug === 'pendidikan-sekolah/';

  const t = (bi: Bilingual) => (isId ? bi.id : bi.en);

  /* -------- aksi -------- */

  function handleCapsule(m: 'PEMBELAJARAN' | 'UJIAN') {
    setMode(m);
    setPopup({ kind: 'jenjang' });
  }

  /** Pilih jenjang → popup TUTUP OTOMATIS, halaman R1 berubah konteks */
  const handleJenjangPick = useCallback((j: JenjangDef) => {
    setActiveJenjang(j);
    setOpenUnitKey(null);
    setActivePanel(null);
    setPopup(null); // wajib tutup otomatis
  }, []);

  /** Pintasan dashboard: langsung ke jenjang dalam jalur pembelajaran.
   *  Mencapai state yang sama seperti alur kapsul → popup (mode + jenjang aktif). */
  function quickJenjang(j: JenjangDef) {
    setMode('PEMBELAJARAN');
    handleJenjangPick(j);
  }

  /** Ikon SVG per jenjang (visual saja, tidak mengubah data). */
  function JenjangIcon({ jenjangKey }: { jenjangKey: string }) {
    const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true } as const;
    switch (jenjangKey) {
      case 'paud':
        return (<svg {...common}><circle cx="12" cy="9" r="5.2" stroke="currentColor" strokeWidth="1.7" /><path d="M4.5 20c1.2-3.4 4.1-5 7.5-5s6.3 1.6 7.5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>);
      case 'dasar':
        return (<svg {...common}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4.5A1.5 1.5 0 0 0 18.5 3h-12A2.5 2.5 0 0 0 4 5.5v14Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22h12a1.5 1.5 0 0 0 1.5-1.5V17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>);
      case 'menengah-pertama':
        return (<svg {...common}><path d="m12 3 9 5-9 5-9-5 9-5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="m6.5 10.5-2 1.1v4.9l7.5 4.1 7.5-4.1v-4.9l-2-1.1" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>);
      case 'menengah-atas':
        return (<svg {...common}><path d="M3 9.5 12 4l9 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M5.5 11v8.5h13V11" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M9.5 19.5v-5h5v5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>);
      case 'tinggi':
        return (<svg {...common}><path d="M12 4 2.8 8.8 12 13.6l7.4-3.9V15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M6.5 11.5V16c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="M21.5 8.8V15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>);
      case 'spesialis':
        return (<svg {...common}><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" /><path d="M12 8v4l2.8 1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="m9 3.5 1.2 1.5L12 3.5l1.8 1.5L15 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>);
      default:
        return (<svg {...common}><rect x="4" y="4" width="16" height="16" rx="3.5" stroke="currentColor" strokeWidth="1.7" /><path d="M9 12.2l2.2 2.2 4-4.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>);
    }
  }

  function toggleUnit(unitKey: string) {
    setOpenUnitKey((prev) => (prev === unitKey ? null : unitKey));
    setActivePanel(null);
  }

  function handlePanelClick(panel: Bilingual) {
    const name = t(panel);
    if (name === t(SCHOOL_PANELS[3])) {
      // Belajar → tampilkan daftar kelas inline di panel yang sama
      setActivePanel(name);
    } else {
      setActivePanel((prev) => (prev === name ? null : name));
    }
  }

  /** Kelas diklik → popup semester (pembelajaran) atau popup semester (ujian,
   *  karena jalur ujian juga memerlukan Semester/Tahap sebelum Mata Pelajaran) */
  function handleKelasPick(kelas: string) {
    setPopup({ kind: 'semester', kelas });
  }

  function handleSemesterPick(semester: string) {
    if (!popup?.kelas || !activeJenjang || !openUnitKey) return;
    const unit = activeJenjang.units.find((u) => u.key === openUnitKey);
    if (!unit) return;
    if (mode === 'UJIAN') {
      // Lanjut ke popup Mata Pelajaran (bukan route)
      setPopup({ kind: 'mapel', kelas: popup.kelas, semester });
      return;
    }
    setPopup(null);
    // ROUTE akhir: halaman belajar
    const path = [
      'belajar',
      toSlug(activeJenjang.id),
      toSlug(unit.id),
      toSlug(popup.kelas),
      toSlug(semester),
    ].join('--');
    router.push(`/${path}`);
  }

  /** Mapel dipilih → bila Agama, tampilkan picker agama; bila Muatan Lokal,
   *  tampilkan picker bahasa daerah; selainnya lanjut jenis ujian. */
  function handleMapelPick(subject: string) {
    if (AGAMA_KEYS.some((k) => subject.toLowerCase().includes(k))) {
      setPopup({ kind: 'agama', kelas: popup?.kelas, semester: popup?.semester, mapel: subject });
      return;
    }
    if (BAHASA_KEYS.some((k) => subject.toLowerCase().includes(k))) {
      setPopup({ kind: 'bahasa', kelas: popup?.kelas, semester: popup?.semester, mapel: subject });
      return;
    }
    setPopup({ kind: 'exam', kelas: popup?.kelas, semester: popup?.semester, mapel: subject });
  }

  function handleExamTypePick(examType: string) {
    if (!popup?.kelas || !activeJenjang || !openUnitKey) return;
    const unit = activeJenjang.units.find((u) => u.key === openUnitKey);
    if (!unit) return;
    setPopup(null);
    // ROUTE akhir: halaman ujian. Attempt hanya bisa dibuat dari paket ujian
    // yang diterbitkan Admin; bila belum ada, ExamsDashboard menampilkan
    // status netral. Konteks pilihan dibawa sebagai query (best-effort).
    const ctx = [
      toSlug(activeJenjang.id),
      toSlug(unit.id),
      toSlug(popup.kelas ?? ''),
      popup?.semester ? toSlug(popup.semester) : '',
      popup?.mapel ? toSlug(popup.mapel) : '',
      toSlug(examType),
    ]
      .filter(Boolean)
      .join('--');
    router.push(`/ujian?konteks=${encodeURIComponent(ctx)}`);
  }

  /** Pilihan agama/bahasa selesai → lanjut ke jenis ujian. */
  function handleVariantPick(variant: string) {
    setPopup((prev) =>
      prev ? { ...prev, kind: 'exam', mapel: `${prev.mapel ?? ''} ${variant}`.trim() } : prev,
    );
  }

  /* -------- render -------- */

  if (schoolAccess !== 'GRANTED') {
    const isChecking = schoolAccess === 'CHECKING';
    return (
      <div className="r1-navigator r1-navigator--locked">
        <nav className="taxonomy-breadcrumb" aria-label={isId ? 'Navigasi' : 'Breadcrumb'}>
          <Link href="/">{isId ? 'Beranda' : 'Home'}</Link>
          <span aria-hidden="true"> / </span>
          <span className="taxonomy-breadcrumb__current" aria-current="page">
            Madevi School
          </span>
        </nav>
        <section className="r1-access-gate" aria-labelledby="school-access-title">
          <p className="eyebrow">MADEVI SCHOOL</p>
          <h1 id="school-access-title">
            {isChecking
              ? isId
                ? 'Memeriksa akses School'
                : 'Checking School access'
              : isId
                ? 'Fitur School terkunci'
                : 'School features are locked'}
          </h1>
          <p>
            {isChecking
              ? isId
                ? 'Pilihan sekolah akan muncul hanya setelah hak akses dari server terverifikasi.'
                : 'School choices appear only after the server verifies access.'
              : isId
                ? 'Jenjang, materi, dan ujian dibuka setelah langganan dikonfirmasi atau bantuan akses disetujui.'
                : 'Levels, materials, and exams open after membership is confirmed or access assistance is approved.'}
          </p>
          {!isChecking && (
            <div className="r1-access-gate__actions">
              <Link href="/auth?package=PRO" className="button">
                {isId ? 'Aktifkan akses School' : 'Activate School access'}
              </Link>
              <Link href="/laporkan-masalah?topic=ACCESS" className="button button--outline">
                {isId ? 'Ajukan bantuan akses' : 'Request access assistance'}
              </Link>
            </div>
          )}
        </section>
      </div>
    );
  }

  /* Halaman dalam (slug deep) — materi/ujian area; R1 root navigator
   * hanya bertanggung jawab pada halaman R1 sendiri. */
  if (!isAtRoot) {
    return (
      <div className="r1-navigator">
        <nav className="taxonomy-breadcrumb" aria-label={isId ? 'Navigasi' : 'Breadcrumb'}>
          <Link href="/">{isId ? 'Beranda' : 'Home'}</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/ruang/pendidikan-sekolah">
            Madevi School
          </Link>
        </nav>
        <div className="r1-empty">
          <span className="r1-empty-icon" aria-hidden="true">
            📖
          </span>
          <p className="r1-empty-title">
            {isId ? 'Halaman pembelajaran sedang disiapkan.' : 'Learning page is being prepared.'}
          </p>
          <p className="r1-empty-hint">
            {isId
              ? 'Konten materi akan tersedia setelah Admin menambahkan kurikulum resmi.'
              : 'Curriculum content will be available after Admin adds official data.'}
          </p>
          <Link href="/ruang/pendidikan-sekolah" className="r1-empty-back">
            {isId ? '← Kembali ke Madevi School' : '← Back to Madevi School'}
          </Link>
        </div>
      </div>
    );
  }

  const unitList = activeJenjang ? activeJenjang.units : [];
  const filteredUnits = query.trim()
    ? unitList.filter((u) => t(u).toLowerCase().includes(query.trim().toLowerCase()))
    : unitList;

  return (
    <div className="r1-navigator page-container">
      {/* Breadcrumb konteks */}
      <nav className="taxonomy-breadcrumb" aria-label={isId ? 'Navigasi' : 'Breadcrumb'}>
        <Link href="/">{isId ? 'Beranda' : 'Home'}</Link>
        <span aria-hidden="true"> / </span>
        {activeJenjang ? (
          <>
            <button
              type="button"
              className="r1-bc-btn"
              onClick={() => {
                setActiveJenjang(null);
                setOpenUnitKey(null);
                setActivePanel(null);
                setMode(null);
              }}
            >
              Madevi School
            </button>
            <span aria-hidden="true"> / </span>
            <span className="taxonomy-breadcrumb__current" aria-current="page">
              {t(activeJenjang)}
            </span>
          </>
        ) : (
          <span className="taxonomy-breadcrumb__current" aria-current="page">
            Madevi School
          </span>
        )}
      </nav>

      {/* Bar judul + search navigator kecil (A3) */}
      <div className="r1-nav-bar">
        <h1 className="r1-nav-bar__title">Madevi School</h1>
        {activeJenjang && (
          <div className="r1-search-wrap">
            <input
              type="search"
              className="r1-search-input"
              placeholder={isId ? 'Cari sekolah/unit…' : 'Search school/unit…'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={isId ? 'Cari sekolah atau unit' : 'Search school or unit'}
            />
          </div>
        )}
      </div>

      {/* Dua kapsul utama (tampil saat belum pilih jalur) */}
      {!mode && (
        <div
          className="r1-main-capsules"
          role="group"
          aria-label={isId ? 'Pilih jalur' : 'Select path'}
        >
          <button
            type="button"
            className="r1-main-capsule"
            onClick={() => handleCapsule('PEMBELAJARAN')}
          >
            {isId ? 'Pembelajaran' : 'Study'}
          </button>
          <button type="button" className="r1-main-capsule" onClick={() => handleCapsule('UJIAN')}>
            {isId ? 'Ujian Pendidikan' : 'Education Exam'}
          </button>
        </div>
      )}

      {/* Pengenalan School hanya tampil setelah hak server terbukti. Pengguna
       * tanpa hak berhenti di gerbang akses di atas, tanpa pilihan materi. */}
      {!mode && (
        <div className="r1-brochure-teaser">
          <h2 className="r1-brochure-teaser__title">
            {isId ? 'Baru di Madevi School?' : 'New to Madevi School?'}
          </h2>
          <p className="r1-brochure-teaser__text">
            {isId
              ? 'Lihat jenjang, cara belajar, contoh materi, dan format ujian bersertifikat dalam brosur pengantar.'
              : 'See levels, how to learn, sample material, and the certified exam format in the intro brochure.'}
          </p>
          <div className="r1-brochure-teaser__actions">
            <Link href="/brosur-sekolah" className="r1-brochure-teaser__link">
              {isId ? 'Baca brosur →' : 'Read brochure →'}
            </Link>
          </div>
        </div>
      )}

      {/* Dashboard jenjang: gambaran sekolah sekilas, pintasan ke jalur pembelajaran */}
      {!mode && (
        <section className="tps-jenjang-dashboard" aria-labelledby="tps-jenjang-title">
          <div className="tps-jenjang-dashboard__heading">
            <div>
              <p className="tps-section-label">{isId ? 'JENJANG PENDIDIKAN' : 'EDUCATION LEVELS'}</p>
              <h2 id="tps-jenjang-title">{isId ? 'Mulai dari jenjang yang sesuai' : 'Start at the right level'}</h2>
              <p className="tps-jenjang-dashboard__desc">
                {isId
                  ? 'Setiap kartu membuka jalur pembelajaran untuk jenjang tersebut.'
                  : 'Each card opens the study path for that level.'}
              </p>
            </div>
          </div>
          <div className="tps-jenjang-grid">
            {[...JENJANG_LIST, NONFORMAL].map((jenjang) => (
              <button
                key={jenjang.key}
                type="button"
                className="tps-jenjang-card"
                onClick={() => quickJenjang(jenjang)}
              >
                <span className="tps-jenjang-card__icon" aria-hidden="true">
                  <JenjangIcon jenjangKey={jenjang.key} />
                </span>
                <span className="tps-jenjang-card__copy">
                  <strong>{t(jenjang)}</strong>
                  <span className="tps-jenjang-card__meta">
                    {jenjang.units.length} {isId ? 'unit' : 'units'}
                    {' · '}
                    {jenjang.units.reduce((n, u) => n + (u.classes?.length ?? 0), 0)} {isId ? 'kelas' : 'classes'}
                  </span>
                </span>
                <span className="tps-jenjang-card__arrow" aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Context bar: ganti jenjang */}
      {mode && activeJenjang && (
        <div className="r1-context-bar">
          <span className="r1-context-bar__label">
            {mode === 'PEMBELAJARAN' ? (isId ? 'Pembelajaran' : 'Study') : isId ? 'Ujian' : 'Exam'}
            {' · '}
            <strong>{t(activeJenjang)}</strong>
          </span>
          <button
            type="button"
            className="r1-context-bar__change"
            onClick={() => setPopup({ kind: 'jenjang' })}
          >
            {isId ? 'Ganti Jenjang' : 'Change Level'}
          </button>
        </div>
      )}

      {/* Grid Jenis Sekolah/Unit INLINE 3 kolom */}
      {mode && activeJenjang && (
        <div className="r1-school-section">
          <p className="r1-section-label">
            {isId ? 'Pilih Sekolah / Unit:' : 'Select School / Unit:'}
          </p>

          {filteredUnits.length === 0 ? (
            <div className="r1-empty">
              <p className="r1-empty-title">
                {isId ? 'Tidak ada unit yang cocok.' : 'No matching unit.'}
              </p>
              <p className="r1-empty-hint">
                {isId ? 'Coba kata kunci lain.' : 'Try a different keyword.'}
              </p>
            </div>
          ) : (
            <div className="r1-unit-grid">
              {filteredUnits.map((unit) => {
                const label = t(unit);
                const classCount = unit.classes?.length ?? 0;
                const isOpen = openUnitKey === unit.key;
                return (
                  <div key={unit.key} className={`r1-unit-card tps-unit-card${isOpen ? ' tps-unit-card--open' : ''}`}>
                    <button
                      type="button"
                      className="r1-unit-card__btn tps-unit-card__btn"
                      aria-expanded={isOpen}
                      onClick={() => toggleUnit(unit.key)}
                    >
                      <span className="tps-unit-card__top">
                        <span className="tps-badge tps-badge--jenjang">{activeJenjang ? t(activeJenjang) : ''}</span>
                        {classCount > 0 && (
                          <span className="tps-unit-card__count">
                            {classCount} {isId ? 'kelas' : 'classes'}
                          </span>
                        )}
                      </span>
                      <span className="tps-unit-card__main">
                        <span className="r1-unit-card__label tps-unit-card__label">{label}</span>
                        <span className="r1-unit-card__chevron tps-unit-card__chevron" aria-hidden="true">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </span>
                    </button>

                    {/* Accordion panel inline di dalam kartu unit */}
                    {openUnitKey === unit.key && (
                      <div className="r1-unit-card__panel">
                        <div className="r1-panels-row">
                          {SCHOOL_PANELS.map((panel) => (
                            <button
                              key={panel.id}
                              type="button"
                              className={`r1-panel-btn${
                                activePanel === t(panel) ? ' r1-panel-btn--active' : ''
                              }`}
                              onClick={() => handlePanelClick(panel)}
                            >
                              {t(panel)}
                            </button>
                          ))}
                        </div>

                        {/* Detail Pengenalan/Aturan/Persiapan (menunggu data Admin) */}
                        {activePanel && activePanel !== t(SCHOOL_PANELS[3]) && (
                          <div className="r1-panel-detail">
                            <p className="r1-panel-detail__text">
                              {isId
                                ? `Data ${activePanel} untuk ${label} akan tersedia setelah Admin menambahkan konten resmi.`
                                : `${activePanel} content for ${label} will be available after Admin adds official content.`}
                            </p>
                          </div>
                        )}

                        {/* Daftar Kelas/Program INLINE setelah Belajar dipilih */}
                        {activePanel === t(SCHOOL_PANELS[3]) && (
                          <div className="r1-kelas-list">
                            {(unit.classes ?? []).length === 0 ? (
                              <p className="r1-panel-detail__text">
                                {isId
                                  ? 'Daftar kelas/program akan ditambahkan Admin.'
                                  : 'Class/program list will be added by Admin.'}
                              </p>
                            ) : (
                              (unit.classes ?? []).map((kelas, kelasIndex) => (
                                <button
                                  key={kelas}
                                  type="button"
                                  className="r1-list-row tps-class-card"
                                  onClick={() => handleKelasPick(kelas)}
                                >
                                  <span className="tps-class-card__index" aria-hidden="true">
                                    {String(kelasIndex + 1).padStart(2, '0')}
                                  </span>
                                  <span className="tps-class-card__copy">
                                    <strong>{kelas}</strong>
                                    <span className="tps-class-card__meta">
                                      <span className="tps-badge tps-badge--jenjang">{label}</span>
                                    </span>
                                  </span>
                                  <span
                                    className="tps-progress"
                                    role="img"
                                    aria-label={isId ? 'Progres belajar: belum dimulai' : 'Study progress: not started'}
                                  >
                                    <span className="tps-progress__track">
                                      <span className="tps-progress__fill" style={{ width: '0%' }} />
                                    </span>
                                  </span>
                                  <span className="r1-list-row__chevron tps-class-card__chevron" aria-hidden="true">
                                    {mode === 'UJIAN' ? '→' : '›'}
                                  </span>
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============ POPUP JENJANG ============ */}
      {popup?.kind === 'jenjang' && (
        <PopupShell
          title={isId ? 'Pilih Jenjang Pendidikan' : 'Select Education Level'}
          onClose={() => setPopup(null)}
          isId={isId}
        >
          <div className="r1-jenjang-grid">
            {JENJANG_LIST.map((j, i) => (
              <button
                key={j.key}
                type="button"
                className="r1-jenjang-card-btn"
                onClick={() => handleJenjangPick(j)}
              >
                <span className="r1-jenjang-card-btn__num" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="r1-jenjang-card-btn__label">{t(j)}</span>
              </button>
            ))}
          </div>
          <div className="r1-jenjang-nonformal">
            <button
              type="button"
              className="r1-jenjang-nonformal__btn"
              onClick={() => handleJenjangPick(NONFORMAL)}
            >
              {isId
                ? 'Jalur Kesetaraan, Kursus, dan Pelatihan →'
                : 'Equivalency, Courses & Training →'}
            </button>
          </div>
        </PopupShell>
      )}

      {/* ============ POPUP SEMESTER (hanya pembelajaran, unit non-semester) ============ */}
      {popup?.kind === 'semester' && (
        <PopupShell
          title={isId ? `Pilih Semester — ${popup.kelas}` : `Select Semester — ${popup.kelas}`}
          onClose={() => setPopup(null)}
          isId={isId}
        >
          <div className="r1-semester-choices">
            {SEMESTERS.map((sem) => (
              <button
                key={sem}
                type="button"
                className="r1-semester-btn"
                onClick={() => handleSemesterPick(sem)}
              >
                {sem}
              </button>
            ))}
          </div>
        </PopupShell>
      )}

      {/* ============ POPUP MATA PELAJARAN (jalur ujian) ============ */}
      {popup?.kind === 'mapel' && (
        <PopupShell
          title={isId ? `Pilih Mata Pelajaran — ${popup.kelas}` : `Select Subject — ${popup.kelas}`}
          onClose={() => setPopup(null)}
          isId={isId}
          wide
        >
          <p className="r1-popup-note">
            {isId
              ? `Mata pelajaran tersedia sesuai kurikulum sekolah ini${popup.semester ? ` · ${popup.semester}` : ''}. Daftar resmi ditambahkan Admin.`
              : `Subjects follow this school curriculum${popup.semester ? ` · ${popup.semester}` : ''}. The official list is added by Admin.`}
          </p>
          <SubjectPicker isId={isId} onPick={(subject) => handleMapelPick(subject)} />
        </PopupShell>
      )}

      {/* ============ POPUP PILIHAN AGAMA (mapel Agama) ============ */}
      {popup?.kind === 'agama' && (
        <PopupShell
          title={isId ? `Pilih Agama — ${popup.mapel}` : `Select Religion — ${popup.mapel}`}
          onClose={() => setPopup(null)}
          isId={isId}
        >
          <p className="r1-popup-note">
            {isId
              ? 'Pilihan agama untuk pelajaran sekolah. Pendalaman teologi/ sejarah agama ada di R3.'
              : 'Religion choice for school subject. Theology/ history depth is in R3.'}
          </p>
          <div className="r1-exam-list">
            {AGAMA_OPTIONS.map((a) => (
              <button
                key={a.id}
                type="button"
                className="r1-list-row"
                onClick={() => handleVariantPick(t(a))}
              >
                <span>{t(a)}</span>
                <span className="r1-list-row__chevron" aria-hidden="true">
                  →
                </span>
              </button>
            ))}
          </div>
        </PopupShell>
      )}

      {/* ============ POPUP PILIHAN BAHASA DAERAH (Muatan Lokal) ============ */}
      {popup?.kind === 'bahasa' && (
        <PopupShell
          title={
            isId
              ? `Pilih Bahasa Daerah — ${popup.mapel}`
              : `Select Regional Language — ${popup.mapel}`
          }
          onClose={() => setPopup(null)}
          isId={isId}
        >
          <RegionalLanguagePicker isId={isId} onPick={(lang) => handleVariantPick(lang)} />
        </PopupShell>
      )}

      {/* ============ POPUP JENIS UJIAN ============ */}
      {popup?.kind === 'exam' && (
        <PopupShell
          title={isId ? 'Pilih Jenis Ujian' : 'Select Exam Type'}
          onClose={() => setPopup(null)}
          isId={isId}
          wide
        >
          <div className="r1-exam-list">
            {EXAM_TYPES.map((ex) => (
              <button
                key={ex.id}
                type="button"
                className="r1-list-row"
                onClick={() => handleExamTypePick(t(ex))}
              >
                <span>{t(ex)}</span>
                <span className="r1-list-row__chevron" aria-hidden="true">
                  →
                </span>
              </button>
            ))}
          </div>
          <p className="r1-popup-note">
            {isId
              ? 'PAUD/TK/RA memakai penilaian perkembangan/portofolio; jenis ujian tampil hanya jika relevan.'
              : 'PAUD/TK/RA use development/portfolio assessment; exam types appear only when relevant.'}
          </p>
        </PopupShell>
      )}
    </div>
  );
}

/* ============================================================ Pemilih mata pelajaran
 *
 * Mengambil mata pelajaran dari API kurikulum bila tersedia; jika belum
 * ada data Admin, menampilkan empty state netral (tidak mengarang mapel).
 */

interface SubjectRow {
  id: string;
  name: string;
}

function SubjectPicker({ isId, onPick }: { isId: boolean; onPick: (subject: string) => void }) {
  const [subjects, setSubjects] = useState<SubjectRow[] | null>(null);
  const [error, setError] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/v1/learning-paths?limit=100');
        if (!res.ok) {
          // L03 AC4: gate server menolak tamu/Free. Bedakan terkunci dari kosong
          // agar UI tidak mengaku "belum ada" padahal akses ditolak.
          const body = await res.json().catch(() => null);
          const code = (body as { error?: { code?: string } } | null)?.error?.code;
          if (
            code === 'PACKAGE_INSUFFICIENT' ||
            code === 'AUTHENTICATION_REQUIRED' ||
            code === 'ACCESS_DENIED'
          ) {
            if (!active) return;
            setLocked(true);
            setSubjects([]);
            return;
          }
          throw new Error('not_found');
        }
        const json = (await res.json()) as { data?: Array<{ id: string; name: string }> };
        if (!active) return;
        setSubjects(json.data ?? []);
      } catch {
        if (!active) return;
        setError(true);
        setSubjects([]);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (subjects === null) {
    return (
      <div className="skeleton-row" aria-hidden="true">
        <span className="skeleton" style={{ width: '70%' }} />
        <span className="skeleton" style={{ width: '90%' }} />
        <span className="skeleton" style={{ width: '55%' }} />
      </div>
    );
  }

  if (locked) {
    return (
      <div className="r1-empty r1-empty--in-popup">
        <p className="r1-empty-title">
          {isId ? 'Mata pelajaran terkunci untuk paket Anda.' : 'Subjects are locked for your plan.'}
        </p>
        <p className="r1-empty-hint">
          {isId
            ? 'Lihat brosur pengantar atau pilih paket Pro/Love untuk membuka materi penuh.'
            : 'See the intro brochure or choose Pro/Love to unlock full material.'}
        </p>
      </div>
    );
  }

  if (error || subjects.length === 0) {
    return (
      <div className="r1-empty r1-empty--in-popup">
        <p className="r1-empty-title">{isId ? 'Belum ada mata pelajaran.' : 'No subjects yet.'}</p>
        <p className="r1-empty-hint">
          {isId
            ? 'Daftar mata pelajaran resmi akan ditambahkan Admin sesuai kurikulum.'
            : 'The official subject list will be added by Admin per curriculum.'}
        </p>
      </div>
    );
  }

  return (
    <div className="r1-exam-list">
      {subjects.map((s) => (
        <button key={s.id} type="button" className="r1-list-row" onClick={() => onPick(s.name)}>
          <span>{s.name}</span>
          <span className="r1-list-row__chevron" aria-hidden="true">
            →
          </span>
        </button>
      ))}
    </div>
  );
}

/* ============================================================ Pemilih bahasa daerah
 *
 * Bahasa daerah mengikuti wilayah/konfigurasi sekolah. Bila wilayah belum
 * punya data bahasa, tampilkan empty state netral — jangan mendaftar
 * seluruh bahasa daerah nasional tanpa konteks (aturan scope P04-A).
 */

function RegionalLanguagePicker({
  isId,
  onPick,
}: {
  isId: boolean;
  onPick: (lang: string) => void;
}) {
  const [region, setRegion] = useState('');
  const [langs, setLangs] = useState<Bilingual[] | null>(null);

  /* Terjemahan lokal — menghormati isId (BUG LAMA: t2 selalu kembali bi.id). */
  const t = (bi: Bilingual) => (isId ? bi.id : bi.en);

  /* Wilayah tersedia mengikuti konfigurasi Admin; sementara hanya contoh
   * Jawa Timur yang didefinisikan scope. Daftar wilayah menunggu data Admin. */
  const availableRegions = Object.keys(BAHASA_DAERAH);

  useEffect(() => {
    if (!region) {
      setLangs(null);
      return;
    }
    setLangs(BAHASA_DAERAH[region] ?? []);
  }, [region]);

  return (
    <div className="rnav-az-wrap">
      <input
        type="search"
        className="rnav-az-search"
        placeholder={isId ? 'Cari wilayah sekolah…' : 'Search school region…'}
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        aria-label={isId ? 'Wilayah' : 'Region'}
      />
      {availableRegions.length > 0 && (
        <div className="r1-exam-list">
          {availableRegions
            .filter((r) => r.includes(region.trim().toLowerCase()))
            .map((r) => (
              <button key={r} type="button" className="r1-list-row" onClick={() => setRegion(r)}>
                <span className="r1-region-name">{r}</span>
                <span className="r1-list-row__chevron" aria-hidden="true">
                  ›
                </span>
              </button>
            ))}
        </div>
      )}
      {region &&
        langs !== null &&
        (langs.length > 0 ? (
          <div className="r1-exam-list">
            {langs.map((l) => (
              <button key={l.id} type="button" className="r1-list-row" onClick={() => onPick(t(l))}>
                <span>{t(l)}</span>
                <span className="r1-list-row__chevron" aria-hidden="true">
                  →
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="r1-empty r1-empty--in-popup">
            <p className="r1-empty-title">
              {isId ? 'Belum ada bahasa untuk wilayah ini.' : 'No language for this region yet.'}
            </p>
            <p className="r1-empty-hint">
              {isId
                ? 'Bahasa daerah menunggu konfigurasi sekolah dari Admin.'
                : 'Regional language waits for Admin school configuration.'}
            </p>
          </div>
        ))}
      {availableRegions.length === 0 && (
        <div className="r1-empty r1-empty--in-popup">
          <p className="r1-empty-title">
            {isId ? 'Belum ada wilayah terkonfigurasi.' : 'No configured region yet.'}
          </p>
          <p className="r1-empty-hint">
            {isId
              ? 'Bahasa daerah menunggu konfigurasi sekolah dari Admin.'
              : 'Regional language waits for Admin school configuration.'}
          </p>
        </div>
      )}
    </div>
  );
}
