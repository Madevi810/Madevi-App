'use client';

import { useCallback, useEffect, useState } from 'react';
import { readCookie } from '@/lib/cookies';

interface QuestionBank {
  id: string;
  articleId: string;
  language: string;
  version: number;
  status: string;
  questionCount: string | number;
}

export function QuestionBankEditor() {
  const [questions, setQuestions] = useState<QuestionBank[]>([]);
  const [articleId, setArticleId] = useState('');
  const [mcJson, setMcJson] = useState('[]');
  const [essayJson, setEssayJson] = useState('[]');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/v1/owner/question-banks?limit=50');
      const j = await r.json();
      setQuestions(j.data ?? []);
    } catch {
      setQuestions([]);
    }
  }, []);
  // The loader updates state from an asynchronous API response.
  useEffect(() => {
    load();
  }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    let mcQuestions: unknown;
    let essayQuestions: unknown;
    try {
      mcQuestions = JSON.parse(mcJson);
      essayQuestions = JSON.parse(essayJson);
    } catch {
      setMessage('JSON soal tidak valid.');
      return;
    }
    if (
      !articleId ||
      !Array.isArray(mcQuestions) ||
      !Array.isArray(essayQuestions) ||
      mcQuestions.length !== 20 ||
      essayQuestions.length !== 5
    ) {
      setMessage('Bank soal harus berisi articleId, 20 PG, dan 5 esai.');
      return;
    }
    const r = await fetch('/api/v1/owner/question-banks', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-csrf-token': readCookie('madevi_owner_csrf'),
      },
      body: JSON.stringify({
        articleId,
        language: 'id',
        translationReviewed: true,
        mcQuestions,
        essayQuestions,
      }),
    });
    const j = await r.json();
    setMessage(j.data ? 'Bank soal ditambahkan' : (j.error?.message ?? 'Gagal'));
    if (j.data) void load();
  }

  return (
    <div className="owner-panel">
      <h1>Bank Soal</h1>
      <form className="info-form" onSubmit={add}>
        <label className="info-form__field">
          <span>Article ID</span>
          <input
            value={articleId}
            onChange={(e) => setArticleId(e.target.value)}
            required
            placeholder="UUID artikel"
          />
        </label>
        <label className="info-form__field">
          <span>20 PG JSON</span>
          <textarea value={mcJson} onChange={(e) => setMcJson(e.target.value)} rows={6} required />
        </label>
        <label className="info-form__field">
          <span>5 esai JSON</span>
          <textarea
            value={essayJson}
            onChange={(e) => setEssayJson(e.target.value)}
            rows={6}
            required
          />
        </label>
        <button type="submit" className="button">
          Tambah Soal
        </button>
      </form>
      {message && <p className="info-form__status">{message}</p>}
      <table className="owner-table">
        <thead>
          <tr>
            <th>Artikel</th>
            <th>Bahasa</th>
            <th>Versi</th>
            <th>Status</th>
            <th>Soal</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id}>
              <td>{q.articleId}</td>
              <td>{q.language}</td>
              <td>{q.version}</td>
              <td>{q.status}</td>
              <td>{q.questionCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

