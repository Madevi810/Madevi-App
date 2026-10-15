'use client';

import { useEffect, useState, FormEvent } from 'react';
import { readCookie } from '@/lib/cookies';
import { useLanguage } from './theme-provider';

interface Contribution {
  id: string;
  title: string;
  description: string;
  sources: string;
  status: string;
  createdAt: string;
}


export function ContributionPage() {
  const { language } = useLanguage();
  const isId = language === 'id';

  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');

  async function loadData() {
    try {
      const res = await fetch('/api/v1/kontribusi');
      const json = await res.json();
      if (res.ok && json.data?.items) {
        setContributions(json.data.items);
      }
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage('');
    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch('/api/v1/kontribusi', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-csrf-token': readCookie('madevi_csrf') },
        body: JSON.stringify({
          title: form.get('title'),
          description: form.get('description'),
          sources: form.get('sources'),
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setMessage(isId ? 'Usulan berhasil dikirim.' : 'Proposal submitted successfully.');
        setFormOpen(false);
        loadData();
      } else {
        setMessage(json.error?.message ?? (isId ? 'Gagal mengirim.' : 'Failed to submit.'));
      }
    } catch {
      setMessage(isId ? 'Kesalahan jaringan.' : 'Network error.');
    }
    setPending(false);
  }

  return (
    <div className="page-shell contribution-page">
      <header className="contribution-page__header">
        <p className="eyebrow">KONTRIBUSI</p>
        <h1>{isId ? 'Kontribusi Saya' : 'My Contributions'}</h1>
        <p>
        {isId
          ? 'Usulan artikel/ide, dukungan, komentar, sumber, dan koreksi konten. '
          : 'Article/idea proposals, support, comments, sources, and content corrections. '}
        </p>
      </header>

      {formOpen ? (
        <form className="info-form contribution-form" onSubmit={submitForm}>
          <h2>{isId ? 'Formulir Usulan' : 'Proposal Form'}</h2>
          <label className="info-form__field">
            <span>{isId ? 'Judul/Topik' : 'Title/Topic'}</span>
            <input name="title" required maxLength={200} />
          </label>
          <label className="info-form__field">
            <span>{isId ? 'Isi Usulan/Ide' : 'Proposal Content'}</span>
            <textarea name="description" required rows={4} maxLength={5000} />
          </label>
          <label className="info-form__field">
            <span>{isId ? 'Sumber Referensi (URL)' : 'Sources (URL)'}</span>
            <input name="sources" />
          </label>
          <div className="contribution-form__actions">
            <button className="button" type="submit" disabled={pending}>
              {pending ? 'Mengirim...' : isId ? 'Kirim Usulan' : 'Submit'}
            </button>
            <button
              className="button button--secondary"
              type="button"
              onClick={() => setFormOpen(false)}
            >
              {isId ? 'Batal' : 'Cancel'}
            </button>
          </div>
          {message && <p className="info-form__status">{message}</p>}
        </form>
      ) : (
        <div className="actions contribution-page__actions">
          <button className="button" type="button" onClick={() => setFormOpen(true)}>
            {isId ? 'Mulai Usulan Baru' : 'Start New Proposal'}
          </button>
        </div>
      )}

      <section className="status-board contribution-page__board">
        <h2>{isId ? 'Daftar Kontribusi Anda' : 'Your Contributions'}</h2>
        {loading ? (
          <p>{isId ? 'Memuat data...' : 'Loading...'}</p>
        ) : contributions.length === 0 ? (
          <p>{isId ? 'Belum ada kontribusi.' : 'No contributions yet.'}</p>
        ) : (
          <div className="r5-version-table">
            {contributions.map((c) => (
              <div key={c.id} className="r5-version-row contribution-row">
                <div className="r5-version-row__main">
                  <strong>{c.title}</strong>
                  <span
                    className={`r5-badge ${c.status === 'PUBLISHED' ? 'r5-badge--clean' : c.status === 'REVIEW' ? 'r5-badge--warn' : ''}`}
                  >
                    {c.status}
                  </span>
                  <span className="r5-version-row__date">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="contribution-row__description">{c.description}</p>
                {c.sources && (
                  <p className="contribution-row__sources">
                    Sumber: {c.sources}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="contribution-history">
        <h2>{isId ? 'Arsip & Kredit' : 'Archive & Credits'}</h2>
        <p>
          {isId
            ? 'Kredit kreator dan arsip kontribusi tetap aman (Offline Database tersimpan) dan ditampilkan pada konten publik meskipun akun Anda dihapus atau diblokir.'
            : 'Creator credits and contribution archives remain safe (Offline Database) and visible on public content even if your account is deleted or banned.'}
        </p>
      </section>
    </div>
  );
}
