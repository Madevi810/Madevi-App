'use client';

import Link from 'next/link';

import { useLanguage } from './theme-provider';

/**
 * Halaman lama /brosur-sekolah dipertahankan agar tautan lama tidak rusak.
 * Ia bukan lagi pintu untuk menampilkan struktur/materi School kepada akun
 * belum berhak: pilihan School hanya diberikan setelah server memverifikasi
 * Pro atau Love di navigator utama.
 */
export function SchoolBrochure() {
  const { language } = useLanguage();
  const isId = language === 'id';

  return (
    <div className="page-shell school-brochure page-container">
      <nav className="taxonomy-breadcrumb" aria-label={isId ? 'Navigasi' : 'Breadcrumb'}>
        <Link href="/">{isId ? 'Beranda' : 'Home'}</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">Madevi School</span>
      </nav>

      <section className="r1-access-gate school-brochure__access" aria-labelledby="school-brochure-title">
        <p className="eyebrow">MADEVI SCHOOL</p>
        <h1 id="school-brochure-title">
          {isId ? 'Fitur School terkunci' : 'School features are locked'}
        </h1>
        <p>
          {isId
            ? 'Jenjang, materi, progres, ujian, dan sertifikat dibuka setelah langganan dikonfirmasi atau bantuan akses disetujui.'
            : 'Levels, materials, progress, exams, and certificates open after membership is confirmed or access assistance is approved.'}
        </p>
        <div className="r1-access-gate__actions">
          <Link href="/auth?package=PRO" className="button">
            {isId ? 'Aktifkan akses School' : 'Activate School access'}
          </Link>
          <Link href="/laporkan-masalah?topic=ACCESS" className="button button--outline">
            {isId ? 'Ajukan bantuan akses' : 'Request access assistance'}
          </Link>
        </div>
      </section>
    </div>
  );
}
