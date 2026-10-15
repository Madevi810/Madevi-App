'use client';

import { useLanguage } from './theme-provider';

export function ExamsDashboard() {
  const { language } = useLanguage();
  const isId = language === 'id';

  return (
    <section className="account-panel exams-dashboard-panel">
      <h1>{isId ? 'Nilai & Ujian' : 'Grades & Exams'}</h1>
      <p className="account-panel__intro">
        {isId
          ? 'Riwayat nilai ujian dan sertifikasi dari jalur belajar Anda.'
          : 'Exam grades and certification history from your learning paths.'}
      </p>

      <div className="account-empty-state">
        <p>{isId ? 'Belum ada riwayat ujian.' : 'No exam history yet.'}</p>
      </div>
    </section>
  );
}
