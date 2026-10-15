'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from './theme-provider';

interface LearningPathItem {
  id: string;
  name: string;
  description: string | null;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  minimum_score: number;
  estimated_hours: number | null;
  articleCount: number;
}

export function LearningPathsIndex() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [paths, setPaths] = useState<LearningPathItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    fetch('/api/v1/learning-paths')
      .then(async (res) => {
        if (!res.ok) {
          // L03 AC4: server gate menolak tamu/Free. Tampilkan brosur sebagai
          // konsekuensi UI, bukan membuka data penuh.
          const body = await res.json().catch(() => null);
          const code = body?.error?.code;
          if (
            code === 'PACKAGE_INSUFFICIENT' ||
            code === 'AUTHENTICATION_REQUIRED' ||
            code === 'ACCESS_DENIED'
          ) {
            setLocked(true);
            setPaths([]);
            setError('');
            return;
          }
          throw new Error(
            isId ? 'Gagal memuat daftar jalur belajar.' : 'Failed to load learning paths.',
          );
        }
        const json = await res.json();
        setPaths(Array.isArray(json.data) ? json.data : []);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : isId ? 'Gagal memuat data.' : 'Failed to load data.',
        );
      })
      .finally(() => setLoading(false));
  }, [isId]);

  const difficultyLabel = (diff: string) => {
    switch (diff) {
      case 'BEGINNER':
        return isId ? 'Pemula' : 'Beginner';
      case 'INTERMEDIATE':
        return isId ? 'Menengah' : 'Intermediate';
      case 'ADVANCED':
        return isId ? 'Lanjutan' : 'Advanced';
      default:
        return diff;
    }
  };

  return (
    <div className="page-shell learning-hub page-container">
      <nav className="taxonomy-breadcrumb" aria-label={isId ? 'Navigasi' : 'Breadcrumb'}>
        <Link href="/">{isId ? 'Beranda' : 'Home'}</Link> /{' '}
        <span>{isId ? 'Pusat Pembelajaran & Ujian' : 'Learning & Exam Center'}</span>
      </nav>

      <header className="learning-hub__header">
        <p className="eyebrow">MADEVI SCHOOL</p>
        <h1>
          <span className="learning-hub__heading-icon" aria-hidden="true"><LearningGlyph name="school" /></span>
          {isId ? 'Pusat Pembelajaran & Ujian' : 'Learning & Exam Center'}
        </h1>
        <p>
          {isId
            ? 'Pilih jalur belajar terstruktur untuk mendalami materi sains, teknologi, dan literasi. Persyaratan materi, estimasi waktu, serta nilai minimum ditampilkan pada jalur yang Anda pilih.'
            : 'Choose a structured path to study science, technology, and literacy. Material requirements, estimated time, and minimum scores are shown on the path you select.'}
        </p>
      </header>

      {/* Aturan detail diambil dari jalur/attempt, bukan janji global yang hardcode. */}
      <section className="learning-hub__guidelines">
        <h2>
          <span className="learning-hub__heading-icon" aria-hidden="true"><LearningGlyph name="guide" /></span>
          {isId ? 'Cara menggunakan Madevi School' : 'Using Madevi School'}
        </h2>
        <div className="learning-hub__guideline-grid">
          <div className="learning-hub__guideline">
            <strong><LearningGlyph name="books" />{isId ? 'Mulai dari jalur' : 'Start with a path'}</strong>
            <p>
              {isId
                ? 'Pilih jalur yang sesuai agar materi, progres, dan ujian tetap berada dalam konteks yang sama.'
                : 'Choose a path so materials, progress, and assessments stay in one coherent context.'}
            </p>
          </div>
          <div className="learning-hub__guideline">
            <strong><LearningGlyph name="paper" />{isId ? 'Baca syarat tiap jalur' : 'Read each path’s requirements'}</strong>
            <p>
              {isId
                ? 'Jumlah materi, estimasi waktu, dan nilai minimum dapat berbeda; informasi ini ditampilkan sebelum Anda masuk.'
                : 'Material count, estimated time, and minimum score can differ; they are shown before you enter.'}
            </p>
          </div>
          <div className="learning-hub__guideline">
            <strong><LearningGlyph name="time" />{isId ? 'Ikuti status server' : 'Follow the server status'}</strong>
            <p>
              {isId
                ? 'Saat ada penilaian, waktu dan status attempt ditentukan server agar progres tetap konsisten di semua perangkat.'
                : 'When an assessment is available, the server controls its timing and attempt state so progress remains consistent across devices.'}
            </p>
          </div>
        </div>
      </section>

      {/* List of Learning Paths */}
      <section className="learning-hub__catalog">
        <h2>
          <span className="learning-hub__heading-icon" aria-hidden="true"><LearningGlyph name="books" /></span>
          {isId ? 'Jalur Belajar Tersedia' : 'Available Learning Paths'}
        </h2>

        {loading ? (
          <div className="card-grid" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="card" style={{ padding: '1.25rem', display: 'grid', gap: '0.6rem' }}>
                <span className="skeleton" style={{ width: '40%' }} />
                <span className="skeleton" style={{ width: '85%', minHeight: '1.5rem' }} />
                <span className="skeleton" style={{ width: '70%' }} />
                <span className="skeleton" style={{ width: '50%' }} />
              </div>
            ))}
          </div>
        ) : locked ? (
          <section className="r1-access-gate" aria-labelledby="learning-access-title">
            <p className="eyebrow">MADEVI SCHOOL</p>
            <h2 id="learning-access-title">
              {isId ? 'Fitur School terkunci' : 'School features are locked'}
            </h2>
            <p>
              {isId
                ? 'Jalur, materi, progres, dan ujian dibuka setelah langganan dikonfirmasi atau bantuan akses disetujui.'
                : 'Paths, materials, progress, and exams open after membership is confirmed or access assistance is approved.'}
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
        ) : error ? (
          <p className="learning-hub__state learning-hub__state--error" role="alert">
            {error}
          </p>
        ) : paths.length === 0 ? (
          <div className="line-empty">
            <p className="line-empty__title">
              {isId ? 'Belum ada jalur belajar' : 'No learning paths yet'}
            </p>
            <p className="line-empty__hint">
              {isId
                ? 'Jalur belajar terstruktur akan ditambahkan Admin sesuai kurikulum.'
                : 'Structured learning paths will be added by Admin per curriculum.'}
            </p>
          </div>
        ) : (
          <div className="learning-hub__path-grid card-grid">
            {paths.map((path) => (
              <article key={path.id} className="learning-hub__path-card card">
                <div>
                  <div className="learning-hub__path-meta">
                    <span className="learning-hub__difficulty">
                      {difficultyLabel(path.difficulty)}
                    </span>
                    <span className="learning-hub__count">
                      <LearningGlyph name="book" />{path.articleCount} {isId ? 'materi' : 'articles'}
                    </span>
                  </div>

                  <h3>{path.name}</h3>

                  {path.description && (
                    <p className="learning-hub__path-description">
                      {path.description}
                    </p>
                  )}
                </div>

                <div className="learning-hub__path-footer">
                  <div className="learning-hub__path-requirements">
                    <span>
                      {isId ? 'Minimal kelulusan' : 'Pass mark'}:{' '}
                      <strong>{path.minimum_score}</strong>
                    </span>
                    {path.estimated_hours && (
                      <span>
                        <LearningGlyph name="time" />~{path.estimated_hours} {isId ? 'jam' : 'hours'}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/belajar/${path.id}`}
                    className="button button--primary learning-hub__path-action"
                  >
                    {isId ? 'Buka Jalur Belajar →' : 'Open Learning Path →'}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

type LearningGlyphName = 'school' | 'guide' | 'time' | 'paper' | 'lock' | 'award' | 'books' | 'book';

function LearningGlyph({ name }: { name: LearningGlyphName }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (name) {
    case 'school':
      return <svg {...common} width="24" height="24"><path d="m3 10 9-5 9 5-9 5-9-5Z" /><path d="M7 12.2V16c2.8 2.2 7.2 2.2 10 0v-3.8M21 10v5" /></svg>;
    case 'guide':
      return <svg {...common}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" /></svg>;
    case 'time':
      return <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></svg>;
    case 'paper':
      return <svg {...common}><path d="M6 3h9l3 3v15H6z" /><path d="M15 3v4h4M9 12h6M9 16h4" /></svg>;
    case 'lock':
      return <svg {...common}><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" /></svg>;
    case 'award':
      return <svg {...common}><circle cx="12" cy="9" r="5" /><path d="m8.5 13-1 7 4.5-2 4.5 2-1-7" /></svg>;
    case 'books':
      return <svg {...common}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v16H6.5A2.5 2.5 0 0 0 4 21V5.5ZM20 5.5A2.5 2.5 0 0 0 17.5 3H12v16h5.5A2.5 2.5 0 0 1 20 21V5.5Z" /></svg>;
    case 'book':
      return <svg {...common}><path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H19v19H7.5A2.5 2.5 0 0 1 5 18.5v-14Z" /><path d="M8 6h7M8 10h7" /></svg>;
  }
}
