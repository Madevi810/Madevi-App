'use client';

import { useState } from 'react';
import { readCookie } from '@/lib/cookies';

const pageKeys = ['ABOUT', 'FAQ', 'TERMS', 'PRIVACY', 'REVIEW'] as const;

export function SitePageEditor() {
  const [pageKey, setPageKey] = useState<(typeof pageKeys)[number]>('ABOUT');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  async function save(event: { preventDefault: () => void }, status: 'DRAFT' | 'PUBLISHED') {
    event.preventDefault();
    const response = await fetch('/api/v1/owner/site-pages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-csrf-token': readCookie('madevi_owner_csrf'),
      },
      body: JSON.stringify({ pageKey, title, content, status, language: 'id' }),
    });
    const json = await response.json();
    setMessage(
      json.data
        ? status === 'DRAFT'
          ? 'Draf halaman situs tersimpan.'
          : 'Halaman situs diterbitkan.'
        : (json.error?.message ?? 'Halaman tidak dapat disimpan.'),
    );
  }

  return (
    <form className="info-form" onSubmit={(event) => save(event, 'DRAFT')}>
      <p className="info-form__notice">
        Editor halaman situs terpisah dari artikel pembelajaran; halaman ini tidak memerlukan bank
        soal.
      </p>
      <div className="info-form__field">
        <span>Jenis halaman</span>
        <div className="capsule-group" role="group" aria-label="Jenis halaman">
          {pageKeys.map((key) => (
            <button
              key={key}
              type="button"
              className={`capsule-btn${pageKey === key ? ' capsule-btn--active' : ''}`}
              onClick={() => setPageKey(key)}
              aria-pressed={pageKey === key}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
      <label className="info-form__field">
        <span>Judul</span>
        <input required value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>
      <label className="info-form__field">
        <span>Isi teks aman</span>
        <textarea
          required
          rows={10}
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
      </label>
      <div className="welcome-card__actions">
        <button className="button" type="submit">
          Simpan draf
        </button>
        <button
          className="button button--secondary"
          type="button"
          onClick={(event) => save(event, 'PUBLISHED')}
        >
          Terbitkan halaman
        </button>
      </div>
      {message && <p className="info-form__status">{message}</p>}
    </form>
  );
}

