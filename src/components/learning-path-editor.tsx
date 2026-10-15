'use client';

import { useState } from 'react';
import { readCookie } from '@/lib/cookies';
import type { FormEvent } from 'react';

export function LearningPathEditor() {
  const [name, setName] = useState('');
  const [businessCode, setBusinessCode] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('BEGINNER');
  const [articleIds, setArticleIds] = useState('');
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch('/api/v1/owner/learning-paths', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-csrf-token': readCookie('madevi_owner_csrf'),
      },
      body: JSON.stringify({
        businessCode,
        name,
        description,
        difficulty,
        articles: articleIds
          .split(/\r?\n/)
          .map((articleId) => articleId.trim())
          .filter(Boolean)
          .map((articleId, position) => ({ articleId, position, isExamRequired: true })),
      }),
    });
    const json = await response.json();
    setMessage(
      json.data ? 'Jalur belajar tersimpan.' : (json.error?.message ?? 'Gagal menyimpan jalur.'),
    );
  }

  return (
    <form className="info-form" onSubmit={submit}>
      <label className="info-form__field">
        <span>Nama jalur</span>
        <input value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <label className="info-form__field">
        <span>Kode jalur</span>
        <input
          value={businessCode}
          onChange={(event) => setBusinessCode(event.target.value.toUpperCase())}
          required
          pattern="[A-Z0-9_-]{3,80}"
        />
      </label>
      <label className="info-form__field">
        <span>Deskripsi</span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
        />
      </label>
      <div className="info-form__field">
        <span>Tingkat</span>
        <div className="capsule-group" role="group" aria-label="Tingkat">
          {(
            [
              ['BEGINNER', 'Pemula'],
              ['INTERMEDIATE', 'Menengah'],
              ['ADVANCED', 'Lanjutan'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`capsule-btn${difficulty === value ? ' capsule-btn--active' : ''}`}
              onClick={() => setDifficulty(value)}
              aria-pressed={difficulty === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <label className="info-form__field">
        <span>ID artikel, satu per baris</span>
        <textarea
          value={articleIds}
          onChange={(event) => setArticleIds(event.target.value)}
          rows={5}
          required
        />
      </label>
      <button type="submit" className="button">
        Simpan jalur
      </button>
      {message && <p className="info-form__status">{message}</p>}
    </form>
  );
}

export function Component() {
  return <LearningPathEditor />;
}
