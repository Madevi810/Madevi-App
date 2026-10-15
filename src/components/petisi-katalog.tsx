'use client';

/**
 * PetisiKatalog — "Petisi Katalog" (INOVASI-20261014-1245 IDE 2, Shop).
 *
 * Pengguna mengusulkan produk afiliasi untuk masuk katalog Shop.
 * Usulan yang mencapai target vote diteruskan ke antrean moderasi
 * pemilik katalog.
 *
 * Semua aksi inline — DILARANG popup/modal (Prinsip UI Madevi).
 */

import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from './theme-provider';
import { PETITION_TARGET_VOTES } from '@/services/petition';

interface Petition {
  id: string;
  productName: string;
  link: string;
  category: string;
  reason: string;
  status: string;
  targetVotes: number;
  createdByName: string | null;
  closedAt: string | null;
  voteCount: number;
}

const STATUS_LABEL_ID: Record<string, string> = {
  MENUNGGU: 'Menunggu',
  DIKIRIM: 'Dikirim ke moderasi',
  DITOLAK: 'Tidak mencapai target',
};

export function PetisiKatalog() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [productName, setProductName] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPetitions = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/ebelanja/petitions?limit=50');
      if (!res.ok) throw new Error('Gagal memuat petisi');
      const json = await res.json();
      setPetitions(Array.isArray(json.data) ? json.data : []);
    } catch {
      setError(isId ? 'Gagal memuat petisi' : 'Failed to load petitions');
    }
  }, [isId]);

  useEffect(() => {
    void loadPetitions();
  }, [loadPetitions]);

  const createPetition = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/ebelanja/petitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, link, category, reason }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error?.message ?? 'Gagal membuat petisi');
      }
      setProductName('');
      setLink('');
      setCategory('');
      setReason('');
      await loadPetitions();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal membuat petisi');
    } finally {
      setBusy(false);
    }
  }, [productName, link, category, reason, loadPetitions]);

  const votePetition = useCallback(async (id: string) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/ebelanja/petitions/${id}/vote`, {
        method: 'POST',
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error?.message ?? 'Gagal vote');
      }
      await loadPetitions();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal vote');
    } finally {
      setBusy(false);
    }
  }, [loadPetitions]);

  const formatDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  };

  return (
    <section className="petisi" aria-labelledby="petisi-title">
      <h3 id="petisi-title">
        {isId ? 'Petisi Katalog' : 'Catalog Petition'}
      </h3>
      <p className="petisi__hint">
        {isId
          ? `Usulkan produk afiliasi untuk masuk katalog. Usulan yang mencapai ${PETITION_TARGET_VOTES} suara diteruskan ke moderasi pemilik. Link harus dari marketplace resmi.`
          : `Suggest an affiliate product for the catalog. Proposals reaching ${PETITION_TARGET_VOTES} votes go to owner moderation. Links must be from official marketplaces.`}
      </p>

      {error && (
        <p className="petisi__error" role="alert">
          {error}
        </p>
      )}

      {/* Form usulan — inline */}
      <div className="petisi__compose">
        <label htmlFor="petisi-name" className="sr-only">
          {isId ? 'Nama produk' : 'Product name'}
        </label>
        <input
          id="petisi-name"
          type="text"
          maxLength={120}
          placeholder={isId ? 'Nama produk' : 'Product name'}
          value={productName}
          onChange={(e) => { setProductName(e.target.value); }}
        />
        <label htmlFor="petisi-link" className="sr-only">
          {isId ? 'Link marketplace' : 'Marketplace link'}
        </label>
        <input
          id="petisi-link"
          type="url"
          placeholder="https://tokopedia.com/…"
          value={link}
          onChange={(e) => { setLink(e.target.value); }}
        />
        <label htmlFor="petisi-category" className="sr-only">
          {isId ? 'Kategori' : 'Category'}
        </label>
        <input
          id="petisi-category"
          type="text"
          maxLength={40}
          placeholder={isId ? 'Kategori' : 'Category'}
          value={category}
          onChange={(e) => { setCategory(e.target.value); }}
        />
        <label htmlFor="petisi-reason" className="sr-only">
          {isId ? 'Alasan' : 'Reason'}
        </label>
        <textarea
          id="petisi-reason"
          maxLength={500}
          placeholder={isId ? 'Mengapa produk ini layak masuk katalog? (minimal 10 karakter)' : 'Why does this product belong?'}
          value={reason}
          onChange={(e) => { setReason(e.target.value); }}
        />
        <button
          type="button"
          disabled={
            busy ||
            productName.trim().length < 3 ||
            link.trim().length === 0 ||
            category.trim().length < 2 ||
            reason.trim().length < 10
          }
          onClick={() => { void createPetition(); }}
        >
          {isId ? 'Kirim usulan' : 'Submit proposal'}
        </button>
      </div>

      <ul className="petisi__list">
        {petitions.map((p) => (
          <li key={p.id} className="petisi__item">
            <div className="petisi__head">
              <strong>{p.productName}</strong>
              <span className="petisi__status">
                {STATUS_LABEL_ID[p.status] ?? p.status}
              </span>
            </div>
            <p className="petisi__meta">
              {p.category} · {formatDomain(p.link)}
              {p.createdByName ? ` · ${p.createdByName}` : ''}
            </p>
            <p className="petisi__reason">{p.reason}</p>
            <p className="petisi__votes">
              {p.voteCount}/{p.targetVotes} {isId ? 'suara' : 'votes'}
            </p>
            <div className="petisi__bar" aria-hidden="true">
              <div
                className="petisi__bar-fill"
                style={{
                  width: `${Math.min(100, (p.voteCount / p.targetVotes) * 100)}%`,
                }}
              />
            </div>
            {p.status === 'MENUNGGU' && (
              <button
                type="button"
                className="petisi__vote-btn"
                disabled={busy}
                onClick={() => { void votePetition(p.id); }}
              >
                {isId ? 'Dukung' : 'Support'}
              </button>
            )}
            {p.status === 'MENUNGGU' && (
              <a
                href={p.link}
                target="_blank"
                rel="sponsored noreferrer noopener"
                className="petisi__link"
              >
                {isId ? 'Cek produk' : 'Check product'}
              </a>
            )}
          </li>
        ))}
        {petitions.length === 0 && (
          <li className="petisi__empty">
            {isId ? 'Belum ada usulan.' : 'No proposals yet.'}
          </li>
        )}
      </ul>
    </section>
  );
}
