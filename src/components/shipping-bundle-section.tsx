'use client';

/**
 * ShippingBundleSection — "Bundel Ongkir Tetangga" (INOVASI-20261014-0940 IDE 2).
 *
 * Patungan ongkir sekota: user satu kota mengelompokkan item wishlist afiliasi
 * ke satu "bundel" (maks 5 orang), estimasi ongkir dibagi rata. Tiap orang
 * tetap checkout sendiri lewat link marketplace masing-masing — tidak ada
 * uang yang lewat Madevi (murni koordinasi).
 *
* Angka hemat = SIMULASI dari tabel tarif statis admin; SELALU diberi label
 * "estimasi simulasi — angka pasti mengikuti marketplace".
 *
 * Semua aksi inline (bentuk, gabung, keluar, filter kota) — tanpa popup.
 */

import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from './theme-provider';
import { BUNDLE_CITIES } from '@/services/bundle';

interface BundleItem {
  id: string;
  userId: string;
  userName: string | null;
  /** True bila item ini milik viewer yang login. */
  mine: boolean;
  product: { name: string; price: number; link: string };
}

interface BundleRow {
  id: string;
  city: string;
  status: string;
  slotMaks: number;
  memberCount: number;
  savingPerMember: number;
  createdByMe: boolean;
  createdAt: string;
  items: BundleItem[];
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

function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function ShippingBundleSection() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [bundles, setBundles] = useState<BundleRow[]>([]);
  const [cityFilter, setCityFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form bentuk bundel
  const [formOpen, setFormOpen] = useState(false);
  const [fCity, setFCity] = useState('');
  const [fName, setFName] = useState('');
  const [fPrice, setFPrice] = useState('');
  const [fLink, setFLink] = useState('');
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  // Form inline gabung bundel (per kartu)
  const [joiningBundleId, setJoiningBundleId] = useState<string | null>(null);
  const [joinName, setJoinName] = useState('');
  const [joinLink, setJoinLink] = useState('');
  const [joinSending, setJoinSending] = useState(false);
  const [joinError, setJoinError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const url = new URL('/api/v1/ebelanja/bundles', window.location.origin);
      if (cityFilter) url.searchParams.set('city', cityFilter);
      const res = await fetch(url.toString(), { cache: 'no-store' });
      const json = await res.json();
      setBundles(json.data ?? []);
    } catch {
      setError(isId ? 'Gagal memuat bundel.' : 'Failed to load bundles.');
    }
    setLoading(false);
  }, [isId, cityFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function createBundle() {
    setMessage('');
    if (!fCity) {
      setMessage(isId ? 'Pilih kota.' : 'Choose a city.');
      return;
    }
    if (fName.trim().length < 2) {
      setMessage(isId ? 'Nama item minimal 2 karakter.' : 'Item name needs at least 2 characters.');
      return;
    }
    if (!fLink.trim()) {
      setMessage(isId ? 'Link marketplace wajib.' : 'Marketplace link is required.');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/v1/ebelanja/bundles', {
        method: 'POST',
        headers: memberHeaders(),
        body: JSON.stringify({
          city: fCity,
          item: {
            name: fName.trim(),
            price: Number(fPrice) || 0,
            link: fLink.trim(),
          },
        }),
      });
      if (res.status === 401 || res.status === 403) {
        setMessage(isId ? 'Masuk sebagai member untuk membuat bundel.' : 'Sign in as member to create a bundle.');
        return;
      }
      const json = await res.json();
      if (res.ok) {
        setFormOpen(false);
        setFCity('');
        setFName('');
        setFPrice('');
        setFLink('');
        void load();
      } else {
        setMessage(json.error?.message ?? (isId ? 'Gagal' : 'Failed'));
      }
    } catch {
      setMessage(isId ? 'Gagal membuat bundel.' : 'Failed to create bundle.');
    }
    setCreating(false);
  }

  async function joinBundle(bundleId: string) {
    // Form inline di kartu: minta link + nama item yang ingin dibeli.
    setJoiningBundleId(bundleId);
    setJoinLink('');
    setJoinName('');
    setJoinError('');
  }

  async function submitJoin(bundleId: string) {
    setJoinError('');
    if (joinName.trim().length < 2) {
      setJoinError(isId ? 'Nama item minimal 2 karakter.' : 'Item name needs at least 2 characters.');
      return;
    }
    if (!joinLink.trim()) {
      setJoinError(isId ? 'Link marketplace wajib.' : 'Marketplace link is required.');
      return;
    }
    setJoinSending(true);
    try {
      const res = await fetch(`/api/v1/ebelanja/bundles/${bundleId}/join`, {
        method: 'POST',
        headers: memberHeaders(),
        body: JSON.stringify({ item: { name: joinName.trim(), price: 0, link: joinLink.trim() } }),
      });
      if (res.status === 401 || res.status === 403) {
        setJoinError(isId ? 'Masuk sebagai member untuk bergabung.' : 'Sign in as member to join.');
        return;
      }
      const json = await res.json();
      if (res.ok) {
        setJoiningBundleId(null);
        void load();
      } else {
        setJoinError(json.error?.message ?? (isId ? 'Gagal' : 'Failed'));
      }
    } catch {
      setJoinError(isId ? 'Gagal bergabung.' : 'Failed to join.');
    }
    setJoinSending(false);
  }

  async function leaveBundle(bundleId: string) {
    try {
      const res = await fetch(`/api/v1/ebelanja/bundles/${bundleId}/leave`, {
        method: 'DELETE',
        headers: memberHeaders(),
      });
      if (res.ok) void load();
    } catch {
      /* gagal keluar — tetap */
    }
  }

  return (
    <section className="bundle">
      <div className="bundle__intro">
        <h2>{isId ? 'Bundel Ongkir Tetangga' : 'Neighbor Shipping Bundle'}</h2>
        <p>
          {isId
            ? 'Patungan ongkir dengan member satu kota. Maks 5 orang per bundel — estimasi ongkir dibagi rata.'
            : 'Split shipping with members in your city. Max 5 people per bundle — shipping estimate split evenly.'}
        </p>
        <button
          type="button"
          className="button"
          onClick={() => setFormOpen((prev) => !prev)}
          aria-expanded={formOpen}
        >
          {formOpen ? (isId ? 'Tutup form' : 'Close form') : isId ? 'Bentuk Bundel' : 'Form a Bundle'}
        </button>
      </div>

      {formOpen && (
        <form
          className="bundle__form"
          onSubmit={(e) => {
            e.preventDefault();
            void createBundle();
          }}
        >
          <label className="bundle__field">
            <span>{isId ? 'Kota' : 'City'}</span>
            <select value={fCity} onChange={(e) => setFCity(e.target.value)} required>
              <option value="">{isId ? 'Pilih kota…' : 'Choose city…'}</option>
              {BUNDLE_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>
          <label className="bundle__field">
            <span>{isId ? 'Item Anda (nama)' : 'Your item (name)'}</span>
            <input
              type="text"
              value={fName}
              onChange={(e) => setFName(e.target.value)}
              maxLength={200}
              required
            />
          </label>
          <label className="bundle__field">
            <span>{isId ? 'Harga (opsional)' : 'Price (optional)'}</span>
            <input
              type="number"
              min={0}
              value={fPrice}
              onChange={(e) => setFPrice(e.target.value)}
            />
          </label>
          <label className="bundle__field">
            <span>{isId ? 'Link marketplace' : 'Marketplace link'}</span>
            <input
              type="url"
              value={fLink}
              onChange={(e) => setFLink(e.target.value)}
              required
            />
          </label>
          {message && (
            <p className="bundle__message" role="status">
              {message}
            </p>
          )}
          <button type="submit" className="button" disabled={creating}>
            {creating ? (isId ? 'Membuat…' : 'Creating…') : isId ? 'Buat bundel' : 'Create bundle'}
          </button>
        </form>
      )}

      <div className="bundle__filter">
        <label>
          <span>{isId ? 'Filter kota' : 'Filter by city'}</span>
          <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
            <option value="">{isId ? 'Semua kota' : 'All cities'}</option>
            {BUNDLE_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p className="bundle__empty">{isId ? 'Memuat…' : 'Loading…'}</p>
      ) : error ? (
        <p className="bundle__empty">{error}</p>
      ) : bundles.length === 0 ? (
        <p className="bundle__empty">
          {isId
            ? 'Belum ada bundel terbuka. Bentuk bundel pertama!'
            : 'No open bundles yet. Form the first one!'}
        </p>
      ) : (
        <div className="bundle__grid">
          {bundles.map((b) => {
            const joined = b.items.some((i) => i.mine);
            return (
              <article key={b.id} className="bundle__card">
                <header className="bundle__card-head">
                  <h3>{b.city}</h3>
                  <span className={`chip bundle__status bundle__status--${b.status.toLowerCase()}`}>
                    {b.status === 'TERBUKA'
                      ? isId
                        ? 'Terbuka'
                        : 'Open'
                      : b.status === 'PENUH'
                        ? isId
                          ? 'Penuh'
                          : 'Full'
                        : isId
                          ? 'Ditutup'
                          : 'Closed'}
                  </span>
                </header>
                <p className="bundle__slots">
                  {b.memberCount}/{b.slotMaks} {isId ? 'slot terisi' : 'slots filled'}
                </p>
                <p className="bundle__saving">
                  {isId ? 'Estimasi hemat' : 'Est. saving'}{' '}
                  <strong>{formatRupiah(b.savingPerMember)}</strong>
                  <span className="bundle__saving-note">
                    {isId ? '/orang · simulasi' : '/person · simulated'}
                  </span>
                </p>
                <ul className="bundle__items">
                  {b.items.map((i) => (
                    <li key={i.id}>
                      <a
                        href={i.product.link}
                        target="_blank"
                        rel="sponsored nofollow noopener"
                      >
                        {i.product.name}
                      </a>
                      <span className="bundle__item-meta">
                        {i.product.price > 0 ? formatRupiah(i.product.price) : ''}{' '}
                        {isId ? 'oleh' : 'by'} {i.userName ?? (isId ? 'Member' : 'Member')}
                      </span>
                    </li>
                  ))}
                </ul>
                {b.status === 'TERBUKA' && !joined && (
                  <>
                    <button
                      type="button"
                      className="button button--small"
                      onClick={() => void joinBundle(b.id)}
                      aria-expanded={joiningBundleId === b.id}
                    >
                      {isId ? 'Gabung Bundel' : 'Join Bundle'}
                    </button>
                    {joiningBundleId === b.id && (
                      <form
                        className="bundle__join-form"
                        onSubmit={(e) => {
                          e.preventDefault();
                          void submitJoin(b.id);
                        }}
                      >
                        <label className="bundle__field">
                          <span>{isId ? 'Item Anda (nama)' : 'Your item (name)'}</span>
                          <input
                            type="text"
                            value={joinName}
                            onChange={(e) => setJoinName(e.target.value)}
                            maxLength={200}
                            required
                          />
                        </label>
                        <label className="bundle__field">
                          <span>{isId ? 'Link marketplace' : 'Marketplace link'}</span>
                          <input
                            type="url"
                            value={joinLink}
                            onChange={(e) => setJoinLink(e.target.value)}
                            required
                          />
                        </label>
                        {joinError && (
                          <p className="bundle__message" role="status">
                            {joinError}
                          </p>
                        )}
                        <button type="submit" className="button button--small" disabled={joinSending}>
                          {joinSending ? (isId ? 'Mengirim…' : 'Sending…') : isId ? 'Gabung' : 'Join'}
                        </button>
                      </form>
                    )}
                  </>
                )}
                {joined && b.status !== 'PENUH' && (
                  <button
                    type="button"
                    className="button button--small"
                    onClick={() => void leaveBundle(b.id)}
                  >
                    {isId ? 'Keluar' : 'Leave'}
                  </button>
                )}
                <p className="bundle__note">
                  {isId
                    ? 'Estimasi simulasi — angka pasti mengikuti marketplace. Checkout tetap di marketplace masing-masing.'
                    : 'Simulated estimate — actual cost follows the marketplace. Checkout remains at each marketplace.'}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
