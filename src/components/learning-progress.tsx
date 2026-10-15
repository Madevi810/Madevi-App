'use client';

import { useLanguage } from './theme-provider';

export function LearningProgress() {
  const { language } = useLanguage();
  const isId = language === 'id';

  // For now, always show empty state as per instruction "status belum ada jalur/materi bila kosong."
  return (
    <section className="account-panel learning-progress-panel">
      <h2>{isId ? 'Progres Pembelajaran Saya' : 'My Learning Progress'}</h2>
      <div className="account-empty-state">
        <p>
          {isId
            ? 'Belum ada jalur atau materi yang sedang dipelajari.'
            : 'No learning paths or materials in progress yet.'}
        </p>
      </div>
    </section>
  );
}
