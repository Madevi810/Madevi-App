'use client';

/**
 * StoryWeave — "Dongeng Bareng" (INOVASI-20261014-0940 IDE 1).
 *
 * Cerita fiksi bersambung bergiliran: utas cerita, ajuan bab (maks 300 kata),
 * voting, kanonisasi mingguan. Tampilan seperti buku digital sederhana:
 * tipografi serif untuk isi cerita, pemisah bab angka romawi.
 *
 * Semua aksi inline (vote, ajukan, filter) — DILARANG popup/modal.
 * Anonimitas pengaju bab opsional? Tidak: ide #0940 menyatakan opsional
 * hanya untuk identitas penulis; di sini penulis ditampilkan (badge inline
 * "Penulis Bab Pekan Ini" tetap fitur kanonisasi).
 */

import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from './theme-provider';
import { STORY_GENRES } from '@/services/story';

interface StoryThread {
  id: string;
  title: string;
  synopsis: string;
  genre: string;
  authorName: string;
  status: string;
  canonChapterCount: number;
  createdAt: string;
  /** True bila viewer adalah pembuat utas. */
  mine: boolean;
}

interface StoryChapter {
  id: string;
  authorName: string;
  body: string;
  voteCount: number;
  isCanon: boolean;
  status: string;
  weekNumber: number;
  myVote: boolean;
}

interface ThreadDetail {
  thread: StoryThread;
  canonChapters: StoryChapter[];
  pendingChapters: StoryChapter[];
}

function genreLabel(key: string, isId: boolean): string {
  const genre = STORY_GENRES.find((g) => g.key === key);
  return genre ? (isId ? genre.labelId : genre.labelEn) : key;
}

function memberHeaders(): Record<string, string> {
  if (typeof document === 'undefined') return { 'content-type': 'application/json' };
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('madevi_csrf='));
  return {
    'content-type': 'application/json',
    'x-csrf-token': match ? match.split('=')[1] : '',
  };
}

/** Angka romawi untuk pemisah bab (gaya buku). */
function toRoman(num: number): string {
  const map: Array<[number, string]> = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let n = num;
  let out = '';
  for (const [value, symbol] of map) {
    while (n >= value) {
      out += symbol;
      n -= value;
    }
  }
  return out || 'I';
}

export function StoryWeave() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [threads, setThreads] = useState<StoryThread[]>([]);
  const [genreFilter, setGenreFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [openThreadId, setOpenThreadId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ThreadDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Form: utas baru
  const [newOpen, setNewOpen] = useState(false);
  const [fTitle, setFTitle] = useState('');
  const [fSynopsis, setFSynopsis] = useState('');
  const [fGenre, setFGenre] = useState('');
  const [creating, setCreating] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  // Form: ajuan bab
  const [chapterBody, setChapterBody] = useState('');
  const [submittingChapter, setSubmittingChapter] = useState(false);
  const [chapterMessage, setChapterMessage] = useState('');

  const loadThreads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const url = new URL('/api/v1/line/stories', window.location.origin);
      if (genreFilter) url.searchParams.set('genre', genreFilter);
      const res = await fetch(url.toString());
      const json = await res.json();
      setThreads(json.data ?? []);
    } catch {
      setError(isId ? 'Gagal memuat cerita.' : 'Failed to load stories.');
    }
    setLoading(false);
  }, [isId, genreFilter]);

  const loadDetail = useCallback(async (threadId: string) => {
    setDetailLoading(true);
    setChapterMessage('');
    try {
      const res = await fetch(`/api/v1/line/stories/${threadId}`);
      const json = await res.json();
      setDetail(json.data ?? null);
    } catch {
      setDetail(null);
    }
    setDetailLoading(false);
  }, []);

  useEffect(() => {
    void loadThreads();
  }, [loadThreads]);

  useEffect(() => {
    if (openThreadId) void loadDetail(openThreadId);
  }, [openThreadId, loadDetail]);

  async function createThread() {
    setFormMessage('');
    if (fTitle.trim().length < 3) {
      setFormMessage(isId ? 'Judul minimal 3 karakter.' : 'Title needs at least 3 characters.');
      return;
    }
    if (fSynopsis.trim().length < 10) {
      setFormMessage(isId ? 'Sinopsis minimal 10 karakter.' : 'Synopsis needs at least 10 characters.');
      return;
    }
    if (!fGenre) {
      setFormMessage(isId ? 'Pilih genre.' : 'Choose a genre.');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/v1/line/stories', {
        method: 'POST',
        headers: memberHeaders(),
        body: JSON.stringify({ title: fTitle.trim(), synopsis: fSynopsis.trim(), genre: fGenre }),
      });
      if (res.status === 401 || res.status === 403) {
        setFormMessage(isId ? 'Masuk sebagai member untuk membuat utas.' : 'Sign in as member to create a thread.');
        return;
      }
      const json = await res.json();
      if (res.ok) {
        setNewOpen(false);
        setFTitle('');
        setFSynopsis('');
        setFGenre('');
        void loadThreads();
      } else {
        setFormMessage(json.error?.message ?? (isId ? 'Gagal' : 'Failed'));
      }
    } catch {
      setFormMessage(isId ? 'Gagal membuat utas.' : 'Failed to create thread.');
    }
    setCreating(false);
  }

  async function submitChapter() {
    if (!openThreadId) return;
    setChapterMessage('');
    const words = chapterBody.trim().split(/\s+/).filter(Boolean).length;
    if (words < 10 || words > 300) {
      setChapterMessage(
        isId ? `Bab antara 10 dan 300 kata (sekarang ${words} kata).` : `Chapter must be 10–300 words (now ${words}).`,
      );
      return;
    }
    setSubmittingChapter(true);
    try {
      const res = await fetch(`/api/v1/line/stories/${openThreadId}/chapters`, {
        method: 'POST',
        headers: memberHeaders(),
        body: JSON.stringify({ body: chapterBody.trim() }),
      });
      if (res.status === 401 || res.status === 403) {
        setChapterMessage(isId ? 'Masuk sebagai member untuk mengajukan bab.' : 'Sign in as member to submit a chapter.');
        return;
      }
      const json = await res.json();
      if (res.ok) {
        setChapterBody('');
        setChapterMessage(isId ? 'Bab diajukan! Tunggu kanonisasi pekan ini.' : 'Chapter submitted! Await this week’s canonization.');
        void loadDetail(openThreadId);
      } else {
        setChapterMessage(json.error?.message ?? (isId ? 'Gagal' : 'Failed'));
      }
    } catch {
      setChapterMessage(isId ? 'Gagal mengajukan bab.' : 'Failed to submit chapter.');
    }
    setSubmittingChapter(false);
  }

  async function voteChapter(chapterId: string) {
    if (!openThreadId) return;
    try {
      const res = await fetch(`/api/v1/line/chapters/${chapterId}/vote`, {
        method: 'POST',
        headers: memberHeaders(),
      });
      if (res.ok) void loadDetail(openThreadId);
    } catch {
      /* vote gagal — tetap di state saat ini */
    }
  }

  async function closeThread() {
    if (!openThreadId) return;
    try {
      const res = await fetch(`/api/v1/line/stories/${openThreadId}`, {
        method: 'PATCH',
        headers: memberHeaders(),
        body: JSON.stringify({ action: 'close' }),
      });
      if (res.ok) {
        void loadDetail(openThreadId);
        void loadThreads();
      }
    } catch {
      /* gagal tutup — tetap */
    }
  }

  // ------- Tampilan detail utas -------
  if (openThreadId && detail) {
    return (
      <div className="story">
        <button
          type="button"
          className="story__back"
          onClick={() => {
            setOpenThreadId(null);
            setDetail(null);
          }}
        >
          {isId ? '← Kembali ke daftar' : '← Back to list'}
        </button>
        <div className="story__book">
          <header className="story__book-head">
            <span className="chip">{genreLabel(detail.thread.genre, isId)}</span>
            <h2>{detail.thread.title}</h2>
            <p className="story__synopsis">{detail.thread.synopsis}</p>
            <p className="story__byline">
              {isId ? 'oleh' : 'by'} {detail.thread.authorName} ·{' '}
              {detail.canonChapters.length} {isId ? 'bab kanon' : 'canon chapters'}
              {detail.thread.status === 'SELESAI' && ` · ${isId ? 'Selesai' : 'Finished'}`}
            </p>
          </header>

          {detailLoading ? (
            <p className="story__empty">{isId ? 'Memuat…' : 'Loading…'}</p>
          ) : (
            <>
              {detail.canonChapters.map((ch, idx) => (
                <section key={ch.id} className="story__chapter story__chapter--canon">
                  <h3 className="story__chapter-num">Bab {toRoman(idx + 1)}</h3>
                  <p className="story__chapter-body">{ch.body}</p>
                  <p className="story__chapter-byline">
                    {isId ? 'oleh' : 'by'} {ch.authorName}
                  </p>
                </section>
              ))}

              <div className="story__pending">
                <h3 className="story__pending-head">
                  {isId ? 'Ajuan pekan berjalan' : 'This week’s submissions'}
                </h3>
                {detail.pendingChapters.length === 0 ? (
                  <p className="story__empty">
                    {isId
                      ? 'Belum ada ajian pekan ini. Jadilah yang pertama.'
                      : 'No submissions this week yet. Be the first.'}
                  </p>
                ) : (
                  detail.pendingChapters.map((ch) => (
                    <article key={ch.id} className="story__chapter story__chapter--pending">
                      <p className="story__chapter-body">{ch.body}</p>
                      <div className="story__vote-row">
                        <span className="story__byline">
                          {isId ? 'oleh' : 'by'} {ch.authorName}
                        </span>
                        <button
                          type="button"
                          className={`button button--small${ch.myVote ? ' button--active' : ''}`}
                          onClick={() => void voteChapter(ch.id)}
                          aria-pressed={ch.myVote}
                        >
                          {ch.myVote
                            ? isId
                              ? 'Vote Anda tercatat'
                              : 'Your vote is recorded'
                            : isId
                              ? 'Vote'
                              : 'Vote'}{' '}
                          ({ch.voteCount})
                        </button>
                      </div>
                    </article>
                  ))
                )}

                {detail.thread.status === 'TERBUKA' && (
                  <form
                    className="story__submit-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void submitChapter();
                    }}
                  >
                    <label className="story__field">
                      <span>
                        {isId ? 'Ajukan Bab Saya (10–300 kata)' : 'Submit my chapter (10–300 words)'}
                      </span>
                      <textarea
                        value={chapterBody}
                        onChange={(e) => setChapterBody(e.target.value)}
                        rows={4}
                        maxLength={2400}
                        placeholder={isId ? 'Tulis bab lanjutan…' : 'Write the next chapter…'}
                      />
                    </label>
                    {chapterMessage && (
                      <p className="story__message" role="status">
                        {chapterMessage}
                      </p>
                    )}
                    <button type="submit" className="button" disabled={submittingChapter}>
                      {submittingChapter ? (isId ? 'Mengirim…' : 'Sending…') : isId ? 'Ajukan' : 'Submit'}
                    </button>
                  </form>
                )}

                {detail.thread.mine && detail.thread.status === 'TERBUKA' && (
                  <button
                    type="button"
                    className="button button--small"
                    onClick={() => void closeThread()}
                  >
                    {isId ? 'Tutup utas' : 'Close thread'}
                  </button>
                )}

                {!detail.thread.mine && detail.thread.status === 'TERBUKA' && (
                  <p className="story__note">
                    {isId
                      ? 'Kanonisasi otomatis setiap pekan: bab dengan vote terbanyak menjadi kanon.'
                      : 'Weekly canonization: the most-voted chapter becomes canon.'}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ------- Tampilan daftar utas -------
  return (
    <div className="story">
      <div className="story__intro">
        <h2>{isId ? 'Dongeng Bareng' : 'Story Weave'}</h2>
        <p>
          {isId
            ? 'Cerita bersambung bergiliran. Ajukan bab, voting bab terbaik, dan bab paling banyak divote otomatis jadi kanon tiap pekan.'
            : 'Round-robin collaborative fiction. Submit chapters, vote for the best, and the top-voted chapter becomes canon each week.'}
        </p>
        <button
          type="button"
          className="button"
          onClick={() => setNewOpen((prev) => !prev)}
          aria-expanded={newOpen}
        >
          {newOpen ? (isId ? 'Tutup form' : 'Close form') : isId ? 'Buka Utas Cerita' : 'Start a Story'}
        </button>
      </div>

      {newOpen && (
        <form
          className="story__new-form"
          onSubmit={(e) => {
            e.preventDefault();
            void createThread();
          }}
        >
          <label className="story__field">
            <span>{isId ? 'Judul' : 'Title'}</span>
            <input
              type="text"
              value={fTitle}
              onChange={(e) => setFTitle(e.target.value)}
              maxLength={120}
              required
            />
          </label>
          <label className="story__field">
            <span>{isId ? 'Sinopsis (10–500 karakter)' : 'Synopsis (10–500 chars)'}</span>
            <textarea
              value={fSynopsis}
              onChange={(e) => setFSynopsis(e.target.value)}
              rows={3}
              maxLength={500}
              required
            />
          </label>
          <label className="story__field">
            <span>{isId ? 'Genre' : 'Genre'}</span>
            <select value={fGenre} onChange={(e) => setFGenre(e.target.value)} required>
              <option value="">{isId ? 'Pilih genre…' : 'Choose genre…'}</option>
              {STORY_GENRES.map((g) => (
                <option key={g.key} value={g.key}>
                  {isId ? g.labelId : g.labelEn}
                </option>
              ))}
            </select>
          </label>
          {formMessage && (
            <p className="story__message" role="status">
              {formMessage}
            </p>
          )}
          <button type="submit" className="button" disabled={creating}>
            {creating ? (isId ? 'Membuat…' : 'Creating…') : isId ? 'Buat utas' : 'Create thread'}
          </button>
        </form>
      )}

      <div className="story__filter">
        <label>
          <span>{isId ? 'Filter genre' : 'Filter by genre'}</span>
          <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
            <option value="">{isId ? 'Semua genre' : 'All genres'}</option>
            {STORY_GENRES.map((g) => (
              <option key={g.key} value={g.key}>
                {isId ? g.labelId : g.labelEn}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p className="story__empty">{isId ? 'Memuat…' : 'Loading…'}</p>
      ) : error ? (
        <p className="story__empty">{error}</p>
      ) : threads.length === 0 ? (
        <p className="story__empty">
          {isId
            ? 'Belum ada utas cerita. Buka utas pertama!'
            : 'No story threads yet. Start the first one!'}
        </p>
      ) : (
        <div className="story__grid">
          {threads.map((t) => (
            <article
              key={t.id}
              className="story__card"
              onClick={() => setOpenThreadId(t.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setOpenThreadId(t.id);
              }}
            >
              <span className="chip">{genreLabel(t.genre, isId)}</span>
              <h3>{t.title}</h3>
              <p>{t.synopsis}</p>
              <p className="story__byline">
                {t.canonChapterCount} {isId ? 'bab kanon' : 'canon chapters'} ·{' '}
                {t.status === 'SELESAI'
                  ? isId
                    ? 'Selesai'
                    : 'Finished'
                  : isId
                    ? 'Terbuka'
                    : 'Open'}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
