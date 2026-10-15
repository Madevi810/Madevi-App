'use client';

import { FeedbackForm } from './feedback-form';
import { PublicShell } from './public-shell';
import { useLanguage } from './theme-provider';

type InformationKind = 'about' | 'review' | 'terms' | 'privacy' | 'report' | 'help';

const COPY = {
  about: {
    id: {
      title: 'Tentang & FAQ',
      intro: 'Draf informasi — dokumen yang sedang disusun.',
      sections: [
        [
          'Tentang Madevi',
          'Madevi adalah platform lokal yang sedang dibangun bertahap untuk pendidikan, pengetahuan, dan layanan pendukung.',
        ],
        [
          'FAQ',
          'Pendaftaran tersedia pada Tahap 04. Artikel dan materi nyata baru masuk melalui tahap konten yang disetujui Admin.',
        ],
      ],
    },
    en: {
      title: 'About & FAQ',
      intro: 'Information draft — work in progress.',
      sections: [
        [
          'About Madevi',
          'Madevi is a local platform being built in stages for education, knowledge, and supporting services.',
        ],
        [
          'FAQ',
          'Registration becomes available in Stage 04. Real articles and materials only enter through the Admin-approved content stages.',
        ],
      ],
    },
  },
  review: {
    id: {
      title: 'Fitur Review',
      intro: 'Masukan publik — kirimkan pendapat Anda.',
      sections: [
        [
          'Kirim Ulasan Fitur',
          'Ulasan Anda akan dimasukkan ke antrean Owner Inbox lokal untuk diperiksa.',
        ],
      ],
    },
    en: {
      title: 'Feature Review',
      intro: 'Public feedback — submit your thoughts.',
      sections: [
        [
          'Send a Feature Review',
          'Feedback will be sent to the local Owner inbox for review.',
        ],
      ],
    },
  },
  terms: {
    id: {
      title: 'Ketentuan & Layanan',
      intro: 'Draf kebijakan — dokumen sedang disusun.',
      sections: [
        [
          'Penggunaan lokal',
          'Platform ini beroperasi secara lokal dan membutuhkan verifikasi/persetujuan Owner secara manual.',
        ],
        [
          'Konten',
          'Konten pendidikan nyata wajib melalui pemeriksaan hak serta persetujuan Admin pada tahapnya.',
        ],
        ['Perubahan', 'Ketentuan ini dapat berubah sewaktu-waktu oleh Owner.'],
      ],
    },
    en: {
      title: 'Terms & Services',
      intro: 'Policy draft — work in progress.',
      sections: [
        [
          'Local use',
          'The platform operates locally and requires manual verification/approval from the Owner.',
        ],
        [
          'Content',
          'Real educational content requires rights review and Admin approval in their respective stages.',
        ],
        ['Changes', 'These terms may change at any time by the Owner.'],
      ],
    },
  },
  privacy: {
    id: {
      title: 'Privasi',
      intro: 'Draf kebijakan — dokumen sedang disusun.',
      sections: [
        [
          'Data saat ini',
          'Segala informasi akun disimpan dalam database lokal. Kami tidak menggunakan analitik eksternal tanpa izin.',
        ],
        [
          'Kontrol mendatang',
          'Pengguna memiliki hak penuh atas akses, penghapusan, dan pengaturan data.',
        ],
      ],
    },
    en: {
      title: 'Privacy',
      intro: 'Policy draft — work in progress.',
      sections: [
        [
          'Current data',
          'Account information is stored in the local database. We do not use external analytics without consent.',
        ],
        [
          'Future controls',
          'Users have full rights over access, deletion, and data settings.',
        ],
      ],
    },
  },
  report: {
    id: {
      title: 'Laporkan Masalah',
      intro: 'Bantuan akun, permohonan akses, dan laporan teknis lokal.',
      sections: [
        [
          'Formulir Laporan',
          'Laporan akan dimasukkan ke antrean Owner Inbox lokal untuk segera ditangani.',
        ],
      ],
    },
    en: {
      title: 'Report a Problem',
      intro: 'Local account support, access assistance, and technical reporting.',
      sections: [
        [
          'Problem Report',
          'A report will be queued to the local Owner Inbox for immediate handling.',
        ],
      ],
    },
  },
  help: {
    id: {
      title: 'Bantuan',
      intro: 'Panduan memakai Madevi.',
      sections: [
        [
          'Tujuh Ruang',
          'Madevi punya tujuh ruang: Shop, Tools & Equipment, Services, Tutorial & Problem Solve, Explore & Learn, School, dan Line. Buka menu di kanan atas untuk berpindah ruang.',
        ],
        [
          'Akun dan Keamanan',
          'Masuk untuk menyimpan riwayat, menyimpan artikel, dan memakai fitur sosial. Semua data tersimpan lokal di perangkat ini.',
        ],
        [
          'Butuh Bantuan Lebih Lanjut',
          'Kirim laporan lewat halaman Laporkan Masalah, atau baca halaman Tentang dan Ketentuan.',
        ],
      ],
    },
    en: {
      title: 'Help',
      intro: 'Guide to using Madevi.',
      sections: [
        [
          'Seven Spaces',
          'Madevi has seven spaces: Shop, Tools & Equipment, Services, Tutorial & Problem Solve, Explore & Learn, School, and Line. Open the menu at the top right to switch spaces.',
        ],
        [
          'Account and Security',
          'Sign in to keep history, save articles, and use social features. All data is stored locally on this device.',
        ],
        [
          'Need More Help',
          'Send a report through the Report a Problem page, or read the About and Terms pages.',
        ],
      ],
    },
  },
} as const;

export function InformationPage({ kind }: { kind: InformationKind }) {
  const { language } = useLanguage();
  const copy = COPY[kind][language];
  return (
    <PublicShell>
      <div className="info-page">
        <div className="info-page__inner">
          <h1>{copy.title}</h1>
          <p className="info-page__draft-notice">{copy.intro}</p>
          {copy.sections.map(([title, body]) => (
            <section
              key={title}
              aria-labelledby={`${kind}-${title.replaceAll(' ', '-').toLowerCase()}`}
            >
              <h2 id={`${kind}-${title.replaceAll(' ', '-').toLowerCase()}`}>{title}</h2>
              <p>{body}</p>
            </section>
          ))}
          {kind === 'review' && <FeedbackForm kind="REVIEW" />}
          {kind === 'report' && <FeedbackForm kind="REPORT" />}
        </div>
      </div>
    </PublicShell>
  );
}
