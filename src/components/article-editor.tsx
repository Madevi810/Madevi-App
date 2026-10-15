'use client';

import { useState } from 'react';
import { readCookie } from '@/lib/cookies';
import type { FormEvent } from 'react';

type ApiResult<T> = { data?: T; error?: { message?: string } };
type Draft = { id: string };

export function ArticleEditor() {
  const [articleId, setArticleId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [taxonomyNodeId, setTaxonomyNodeId] = useState('');
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [creatorName, setCreatorName] = useState('');
  const [accessLevel, setAccessLevel] = useState<'PUBLIC' | 'MEMBER'>('MEMBER');
  const [isIndexed, setIndexed] = useState(true);
  const [ownerNotes, setOwnerNotes] = useState('');
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceOrg, setSourceOrg] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [isTest, setIsTest] = useState(false);

  const csrf = () => readCookie('madevi_owner_csrf');
  const metadata = () => ({
    title,
    slug,
    summary,
    taxonomyNodeId: taxonomyNodeId || undefined,
    language,
    creatorName: creatorName || undefined,
    accessLevel,
    isIndexed,
    ownerNotes,
    isTest,
  });

  async function request<T>(url: string, method: 'POST' | 'PATCH' | 'PUT', body?: unknown) {
    const response = await fetch(url, {
      method,
      headers: { 'content-type': 'application/json', 'x-csrf-token': csrf() },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await response.json()) as ApiResult<T>;
    if (!response.ok || !json.data)
      throw new Error(json.error?.message ?? 'Permintaan tidak dapat diproses.');
    return json.data;
  }

  /** Simpan metadata dan satu blok paragraf aman pada posisi nol. */
  async function saveDraft(): Promise<string> {
    if (!title.trim() || !slug.trim() || !body.trim()) {
      throw new Error('Judul, slug, dan blok materi wajib diisi.');
    }
    setSaving(true);
    try {
      let id = articleId;
      if (!id) {
        const draft = await request<Draft>('/api/v1/articles', 'POST', { ...metadata(), body });
        id = draft.id;
        setArticleId(id);
      } else {
        await request<Draft>(`/api/v1/articles/${id}`, 'PATCH', metadata());
        await request(`/api/v1/articles/${id}/blocks`, 'POST', {
          blockType: 'PARAGRAPH',
          position: 0,
          content: { text: body.trim() },
        });
      }
      return id;
    } finally {
      setSaving(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await saveDraft();
      setMessage('Draf artikel tersimpan; belum dikirim atau diterbitkan.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal menyimpan draf.');
    }
  }

  async function autoSave() {
    try {
      await saveDraft();
      setMessage('Autosave draf berhasil.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Autosave gagal.');
    }
  }

  async function checkAndSend() {
    try {
      const id = await saveDraft();
      const result = await request<{ passed: boolean; issues: string[] }>(
        `/api/v1/articles/${id}/status`,
        'PUT',
      );
      setMessage(
        result.passed
          ? 'Pemeriksaan lulus; draf dikirim ke status menunggu persetujuan Admin.'
          : `Pemeriksaan belum lulus: ${result.issues.join(' ')}`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Pemeriksaan gagal.');
    }
  }

  async function addPrimarySource() {
    try {
      if (!sourceTitle.trim() || !sourceOrg.trim()) {
        throw new Error('Judul dan penulis/lembaga sumber wajib diisi.');
      }
      const id = await saveDraft();
      await request(`/api/v1/articles/${id}/sources`, 'POST', {
        position: 0,
        title: sourceTitle.trim(),
        authorOrOrg: sourceOrg.trim(),
        publisher: sourceOrg.trim(),
        url: sourceUrl.trim() || null,
        sourceType: 'OFFICIAL_DOC',
        isPrimary: true,
      });
      setMessage(
        'Sumber utama tersimpan. Bank soal tervalidasi tetap diperlukan sebelum artikel dapat lulus.',
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Sumber tidak dapat disimpan.');
    }
  }

  async function preview() {
    try {
      const id = await saveDraft();
      window.open(`/artikel/${id}`, '_blank', 'noopener,noreferrer');
      setMessage('Pratinjau draf dibuka pada tab baru untuk sesi Admin ini.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Pratinjau tidak dapat dibuka.');
    }
  }

  return (
    <form className="info-form" onSubmit={submit}>
      <p className="info-form__notice">
        Pembuatan draf artikel: penempatan wajib pada node J aktif. Form ini menyimpan sebagai draf, tidak langsung menerbitkan.
      </p>
      <label className="info-form__field">
        <span>Penempatan J</span>
        <input
          value={taxonomyNodeId}
          onChange={(event) => setTaxonomyNodeId(event.target.value)}
          placeholder="UUID node J aktif"
          required
        />
      </label>
      <label className="info-form__field">
        <span>Judul</span>
        <input value={title} onChange={(event) => setTitle(event.target.value)} required />
      </label>
      <label className="info-form__field">
        <span>Slug</span>
        <input
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          required
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
        />
      </label>
      <label className="info-form__field">
        <span>Ringkasan</span>
        <textarea value={summary} onChange={(event) => setSummary(event.target.value)} rows={3} />
      </label>
      <div className="info-form__field">
        <span>Bahasa resmi</span>
        <div className="capsule-group" role="group" aria-label="Bahasa resmi">
          {(['id', 'en'] as const).map((lg) => (
            <button
              key={lg}
              type="button"
              className={`capsule-btn${language === lg ? ' capsule-btn--active' : ''}`}
              onClick={() => setLanguage(lg)}
              aria-pressed={language === lg}
            >
              {lg === 'id' ? 'Indonesia' : 'English'}
            </button>
          ))}
        </div>
      </div>
      <label className="info-form__field">
        <span>Creator</span>
        <input value={creatorName} onChange={(event) => setCreatorName(event.target.value)} />
      </label>
      <div className="info-form__field">
        <span>Akses</span>
        <div className="capsule-group" role="group" aria-label="Akses">
          {(['PUBLIC', 'MEMBER'] as const).map((lv) => (
            <button
              key={lv}
              type="button"
              className={`capsule-btn${accessLevel === lv ? ' capsule-btn--active' : ''}`}
              onClick={() => setAccessLevel(lv)}
              aria-pressed={accessLevel === lv}
            >
              {lv === 'PUBLIC' ? 'Publik' : 'Member'}
            </button>
          ))}
        </div>
      </div>
      <label className="info-form__field">
        <span>
          <input
            type="checkbox"
            checked={isIndexed}
            onChange={(event) => setIndexed(event.target.checked)}
          />{' '}
          Izinkan indeks internal
        </span>
      </label>
      <label className="info-form__field">
        <span>
          <input
            type="checkbox"
            checked={isTest}
            onChange={(event) => setIsTest(event.target.checked)}
          />{' '}
          Tandai sebagai data uji/fiktif
        </span>
      </label>
      <label className="info-form__field">
        <span>Blok materi (paragraf aman)</span>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={10}
          required
        />
      </label>
      <fieldset className="auth-card__minor">
        <legend>Sumber utama</legend>
        <label className="info-form__field">
          <span>Judul sumber</span>
          <input value={sourceTitle} onChange={(event) => setSourceTitle(event.target.value)} />
        </label>
        <label className="info-form__field">
          <span>Penulis/lembaga</span>
          <input value={sourceOrg} onChange={(event) => setSourceOrg(event.target.value)} />
        </label>
        <label className="info-form__field">
          <span>URL sumber</span>
          <input
            type="url"
            value={sourceUrl}
            onChange={(event) => setSourceUrl(event.target.value)}
          />
        </label>
        <button
          type="button"
          className="button button--secondary"
          onClick={addPrimarySource}
          disabled={saving}
        >
          Tambahkan sumber utama
        </button>
      </fieldset>
      <fieldset className="auth-card__minor">
        <legend>Media, relasi, dan bank soal</legend>
        <p className="info-form__notice">
          Media masuk karantina; relasi artikel dan bank soal dikelola pada editor domain
          masing-masing. Tidak ada HTML/JavaScript aktif yang dapat dimasukkan melalui blok ini.
        </p>
      </fieldset>
      <label className="info-form__field">
        <span>Catatan Admin</span>
        <textarea
          value={ownerNotes}
          onChange={(event) => setOwnerNotes(event.target.value)}
          rows={3}
        />
      </label>
      <div className="welcome-card__actions">
        <button
          type="button"
          className="button button--secondary"
          onClick={autoSave}
          disabled={saving}
        >
          Autosave draf
        </button>
        <button
          type="button"
          className="button button--secondary"
          onClick={checkAndSend}
          disabled={saving}
        >
          Periksa
        </button>
        <button
          type="button"
          className="button button--secondary"
          onClick={preview}
          disabled={saving}
        >
          Pratinjau
        </button>
        <button
          type="button"
          className="button button--secondary"
          onClick={checkAndSend}
          disabled={saving}
        >
          Kirim untuk Persetujuan
        </button>
      </div>
      <button type="submit" className="button" disabled={saving}>
        {saving ? 'Menyimpan…' : 'Simpan draf'}
      </button>
      {message && <p className="info-form__status">{message}</p>}
    </form>
  );
}

export function Component() {
  return <ArticleEditor />;
}
