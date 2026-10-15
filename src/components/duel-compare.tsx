'use client';

/**
 * DuelCompare — "Duel Produk" (INOVASI-20261014-1045 IDE 2, Shop).
 *
 * Komparasi head-to-head dua produk afiliasi: kartu pro/kontra per
 * produk diisi komunitas + vote produk pilihan (dengan alasan).
 *
 * Semua aksi inline — DILARANG popup/modal (Prinsip UI Madevi).
 */

import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from './theme-provider';

interface DuelProduct {
  id: string;
  title: string;
  originalPrice: number;
  currency: string;
  externalUrl: string;
  isWinner: boolean;
  voteCount: number;
  proCount: number;
  contraCount: number;
}

interface Duel {
  id: string;
  title: string;
  status: string;
  endsAt: string;
  products: [DuelProduct, DuelProduct];
  myVote: string | null;
}

const DUEL_VOTE_REASON_MIN = 30;
const DUEL_POINT_MIN = 20;

export function DuelCompare() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [duels, setDuels] = useState<Duel[]>([]);
  const [selected, setSelected] = useState<Duel | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pointSide, setPointSide] = useState<'PRO' | 'KONTRA'>('PRO');
  const [pointBody, setPointBody] = useState('');
  const [voteReason, setVoteReason] = useState('');

  const loadDuels = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/ebelanja/duels?limit=20');
      if (!res.ok) throw new Error('Gagal memuat duel');
      const json = await res.json();
      setDuels(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      setError(isId ? 'Gagal memuat duel' : 'Failed to load duels');
    }
  }, [isId]);

  useEffect(() => {
    void loadDuels();
  }, [loadDuels]);

  const loadDetail = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/v1/ebelanja/duels/${id}`);
      if (!res.ok) throw new Error('Gagal memuat detail');
      const json = await res.json();
      setSelected(json.data ?? null);
    } catch (e) {
      setError(isId ? 'Gagal memuat detail duel' : 'Failed to load duel detail');
    }
  }, [isId]);

  const addPoint = useCallback(async (productId: string) => {
    if (!selected) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/ebelanja/duels/${selected.id}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, side: pointSide, body: pointBody }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error?.message ?? 'Gagal menambah poin');
      }
      setPointBody('');
      await loadDetail(selected.id);
      await loadDuels();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menambah poin');
    } finally {
      setBusy(false);
    }
  }, [selected, pointSide, pointBody, loadDetail, loadDuels]);

  const castVote = useCallback(async (productId: string) => {
    if (!selected) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/ebelanja/duels/${selected.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chosenProductId: productId, reason: voteReason }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error?.message ?? 'Gagal vote');
      }
      setVoteReason('');
      await loadDetail(selected.id);
      await loadDuels();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal vote');
    } finally {
      setBusy(false);
    }
  }, [selected, voteReason, loadDetail, loadDuels]);

  const formatPrice = (price: number, currency: string) => {
    try {
      return new Intl.NumberFormat(isId ? 'id-ID' : 'en-US', {
        style: 'currency',
        currency,
      }).format(price);
    } catch {
      return `${price}`;
    }
  };

  return (
    <section className="duel-compare" aria-labelledby="duel-compare-title">
      <h3 id="duel-compare-title">
        {isId ? 'Duel Produk' : 'Product Duel'}
      </h3>
      <p className="duel-compare__hint">
        {isId
          ? 'Bandingkan dua produk serupa. Lihat kartu pro/kontra dari komunitas, lalu pilih produkmu dengan alasan.'
          : 'Compare two similar products. See pro/contra cards from the community, then pick yours with a reason.'}
      </p>

      {error && (
        <p className="duel-compare__error" role="alert">
          {error}
        </p>
      )}

      <ul className="duel-compare__list">
        {duels.map((d) => (
          <li key={d.id} className="duel-compare__item">
            <button
              type="button"
              onClick={() => void loadDetail(d.id)}
              aria-expanded={selected?.id === d.id}
            >
              <span className="duel-compare__title">{d.title}</span>
              <span className="duel-compare__meta">
                {d.products[0]?.title} vs {d.products[1]?.title}
                {' · '}
                {d.status}
              </span>
            </button>
          </li>
        ))}
        {duels.length === 0 && (
          <li className="duel-compare__empty">
            {isId ? 'Belum ada duel.' : 'No duels yet.'}
          </li>
        )}
      </ul>

      {selected && (
        <div className="duel-compare__detail">
          <h4>{selected.title}</h4>
          <div className="duel-compare__grid">
            {selected.products.map((p) => (
              <article
                key={p.id}
                className={`duel-compare__card${p.isWinner ? ' duel-compare__card--winner' : ''}`}
              >
                <h5>
                  {p.title}
                  {p.isWinner && (
                    <span className="duel-compare__winner-badge">
                      {isId ? 'Pemenang' : 'Winner'}
                    </span>
                  )}
                </h5>
                <p className="duel-compare__price">
                  {formatPrice(p.originalPrice, p.currency)}
                </p>
                <p className="duel-compare__votes">
                  {isId ? 'Suara' : 'Votes'}: {p.voteCount}
                </p>
                <div className="duel-compare__points">
                  <p className="duel-compare__points-row">
                    <strong>Pro</strong> {p.proCount}
                  </p>
                  <p className="duel-compare__points-row">
                    <strong>Kontra</strong> {p.contraCount}
                  </p>
                </div>
                <a
                  href={p.externalUrl}
                  target="_blank"
                  rel="sponsored noreferrer noopener"
                  className="duel-compare__cta"
                >
                  {isId ? 'Lihat di marketplace' : 'View at marketplace'}
                </a>
                <button
                  type="button"
                  className="duel-compare__vote-btn"
                  disabled={busy || selected.status === 'SELESAI' || Boolean(selected.myVote) || voteReason.trim().length < DUEL_VOTE_REASON_MIN}
                  onClick={() => void castVote(p.id)}
                >
                  {selected.myVote === p.id
                    ? isId ? 'Pilihanmu' : 'Your pick'
                    : isId ? 'Pilih produk ini' : 'Pick this product'}
                </button>
              </article>
            ))}
          </div>

          {/* Form vote — inline */}
          {selected.status !== 'SELESAI' && !selected.myVote && (
            <div className="duel-compare__compose">
              <label htmlFor="duel-vote-reason" className="sr-only">
                {isId ? 'Alasan vote (minimal 30 karakter)' : 'Vote reason (min 30 chars)'}
              </label>
              <input
                id="duel-vote-reason"
                type="text"
                maxLength={500}
                placeholder={
                  isId
                    ? 'Mengapa kamu memilih produk ini? (minimal 30 karakter)'
                    : 'Why do you pick this product? (min 30 characters)'
                }
                value={voteReason}
                onChange={(e) => setVoteReason(e.target.value)}
              />
            </div>
          )}

          {/* Form pro/kontra — inline */}
          {selected.status !== 'SELESAI' && (
            <div className="duel-compare__compose">
              <label htmlFor="duel-point-side" className="sr-only">
                {isId ? 'Sisi' : 'Side'}
              </label>
              <select
                id="duel-point-side"
                value={pointSide}
                onChange={(e) => setPointSide(e.target.value as 'PRO' | 'KONTRA')}
              >
                <option value="PRO">{isId ? 'Pro' : 'Pro'}</option>
                <option value="KONTRA">{isId ? 'Kontra' : 'Contra'}</option>
              </select>
              <label htmlFor="duel-point-body" className="sr-only">
                {isId ? 'Isi kartu' : 'Card body'}
              </label>
              <input
                id="duel-point-body"
                type="text"
                maxLength={200}
                placeholder={
                  isId
                    ? 'Tulis pro/kontra (minimal 20 karakter)…'
                    : 'Write pro/contra (min 20 characters)…'
                }
                value={pointBody}
                onChange={(e) => setPointBody(e.target.value)}
              />
              <button
                type="button"
                disabled={busy || pointBody.trim().length < DUEL_POINT_MIN}
                onClick={() => { void addPoint(selected.products[0]?.id ?? ''); }}
              >
                {isId ? 'Tambah ke produk A' : 'Add to product A'}
              </button>
              <button
                type="button"
                disabled={busy || pointBody.trim().length < DUEL_POINT_MIN}
                onClick={() => { void addPoint(selected.products[1]?.id ?? ''); }}
              >
                {isId ? 'Tambah ke produk B' : 'Add to product B'}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
