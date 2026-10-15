'use client';

/**
 * KindnessMap — "Peta Kebaikan" (INOVASI-20261014-0841 IDE 2).
 *
 * Papan kebaikan tingkat KOTA: member melaporkan perbuatan baik kecil yang
 * terjadi di dunia nyata; laporan tayang sebagai pin di peta Indonesia
 * per kota — tanpa alamat detail, tanpa nama pelaku bila ingin anonim.
 *
 * Semua aksi inline (form, filter kota, pin) — DILARANG popup/modal.
 * Peta SVG sederhana tanpa library peta eksternal.
 */

import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from './theme-provider';
import {
  KINDNESS_CATEGORIES,
  KINDNESS_CITIES,
  kindnessReporterLabel,
} from '@/contracts/social';

interface KindnessItem {
  id: string;
  title: string;
  story: string;
  city: string;
  category: string;
  isAnonymous: boolean;
  reporterName: string | null;
  photoUrl: string | null;
  createdAt: string;
}

interface CityCount {
  city: string;
  count: number;
}

/** Koordinat approx untuk 10 kota besar (peta SVG sederhana, skala 0–1). */
const CITY_PINS: Record<string, { x: number; y: number }> = {
  Medan: { x: 0.31, y: 0.2 },
  Padang: { x: 0.28, y: 0.42 },
  Palembang: { x: 0.36, y: 0.55 },
  Jakarta: { x: 0.24, y: 0.72 },
  Bandung: { x: 0.27, y: 0.75 },
  Semarang: { x: 0.35, y: 0.72 },
  Yogyakarta: { x: 0.38, y: 0.78 },
  Surabaya: { x: 0.46, y: 0.74 },
  Denpasar: { x: 0.5, y: 0.82 },
  Makassar: { x: 0.63, y: 0.65 },
  Manado: { x: 0.72, y: 0.28 },
  Ambon: { x: 0.78, y: 0.45 },
  Jayapura: { x: 0.92, y: 0.4 },
  Banjarmasin: { x: 0.55, y: 0.62 },
  Samarinda: { x: 0.6, y: 0.5 },
  Pontianak: { x: 0.47, y: 0.58 },
  Palu: { x: 0.6, y: 0.52 },
  Kupang: { x: 0.68, y: 0.85 },
  Gorontalo: { x: 0.66, y: 0.35 },
  Mataram: { x: 0.52, y: 0.84 },
};

function categoryLabel(key: string, isId: boolean): string {
  const cat = KINDNESS_CATEGORIES.find((c) => c.key === key);
  return cat ? (isId ? cat.labelId : cat.labelEn) : key;
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

export function KindnessMap() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [items, setItems] = useState<KindnessItem[]>([]);
  const [cityCounts, setCityCounts] = useState<CityCount[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [fTitle, setFTitle] = useState('');
  const [fStory, setFStory] = useState('');
  const [fCity, setFCity] = useState('');
  const [fCategory, setFCategory] = useState('');
  const [fAnonymous, setFAnonymous] = useState(false);
  const [sending, setSending] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const url = new URL('/api/v1/line/kindness', window.location.origin);
      url.searchParams.set('limit', '20');
      if (selectedCity) url.searchParams.set('city', selectedCity);
      const res = await fetch(url.toString());
      const json = await res.json();
      setItems(json.data?.items ?? []);
    } catch {
      setError(isId ? 'Gagal memuat peta kebaikan.' : 'Failed to load kindness map.');
    }
    try {
      const res = await fetch('/api/v1/line/kindness/cities');
      const json = await res.json();
      setCityCounts(json.data ?? []);
    } catch {
      setCityCounts([]);
    }
    setLoading(false);
  }, [isId, selectedCity]);

  useEffect(() => {
    void load();
  }, [load]);

  async function submitReport() {
    setFormMessage('');
    if (fTitle.trim().length < 3) {
      setFormMessage(isId ? 'Judul minimal 3 karakter.' : 'Title needs at least 3 characters.');
      return;
    }
    if (fStory.trim().length < 10) {
      setFormMessage(isId ? 'Cerita minimal 10 karakter.' : 'Story needs at least 10 characters.');
      return;
    }
    if (!fCity || !fCategory) {
      setFormMessage(isId ? 'Pilih kota dan kategori.' : 'Choose city and category.');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/v1/line/kindness', {
        method: 'POST',
        headers: memberHeaders(),
        body: JSON.stringify({
          title: fTitle.trim(),
          story: fStory.trim(),
          city: fCity,
          category: fCategory,
          isAnonymous: fAnonymous,
        }),
      });
      if (res.status === 401 || res.status === 403) {
        setFormMessage(isId ? 'Masuk sebagai member untuk melaporkan.' : 'Sign in as member to report.');
        return;
      }
      const json = await res.json();
      if (res.ok || res.status === 202) {
        setFormMessage(
          isId
            ? 'Laporan masuk antrean moderasi. Terima kasih!'
            : 'Report queued for review. Thank you!',
        );
        setFormOpen(false);
        setFTitle('');
        setFStory('');
        setFCity('');
        setFCategory('');
        setFAnonymous(false);
        void load();
      } else {
        setFormMessage(json.error?.message ?? (isId ? 'Gagal' : 'Failed'));
      }
    } catch {
      setFormMessage(isId ? 'Gagal mengirim laporan.' : 'Failed to submit report.');
    }
    setSending(false);
  }

  return (
    <div className="kindness">
      <div className="kindness__intro">
        <h2>{isId ? 'Peta Kebaikan' : 'Kindness Map'}</h2>
        <p>
          {isId
            ? 'Kebaikan nyata yang terjadi di kota Anda. Dilaporkan member, diverifikasi admin sebelum tayang.'
            : 'Real kindness in your city. Reported by members, verified by admins before publishing.'}
        </p>
        <button
          type="button"
          className="button"
          onClick={() => setFormOpen((prev) => !prev)}
          aria-expanded={formOpen}
        >
          {formOpen
            ? isId
              ? 'Tutup form'
              : 'Close form'
            : isId
              ? 'Laporkan Kebaikan'
              : 'Report a kindness'}
        </button>
      </div>

      {formOpen && (
        <form
          className="kindness__form"
          onSubmit={(e) => {
            e.preventDefault();
            void submitReport();
          }}
        >
          <label className="kindness__field">
            <span>{isId ? 'Judul' : 'Title'}</span>
            <input
              type="text"
              value={fTitle}
              onChange={(e) => setFTitle(e.target.value)}
              maxLength={120}
              required
            />
          </label>
          <label className="kindness__field">
            <span>{isId ? 'Cerita singkat (maks 500 karakter)' : 'Short story (max 500 chars)'}</span>
            <textarea
              value={fStory}
              onChange={(e) => setFStory(e.target.value)}
              rows={3}
              maxLength={500}
              required
            />
            <small>{fStory.length}/500</small>
          </label>
          <div className="kindness__form-row">
            <label className="kindness__field">
              <span>{isId ? 'Kota' : 'City'}</span>
              <select
                value={fCity}
                onChange={(e) => setFCity(e.target.value)}
                required
              >
                <option value="">{isId ? 'Pilih kota…' : 'Choose city…'}</option>
                {KINDNESS_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>
            <label className="kindness__field">
              <span>{isId ? 'Kategori' : 'Category'}</span>
              <select
                value={fCategory}
                onChange={(e) => setFCategory(e.target.value)}
                required
              >
                <option value="">{isId ? 'Pilih kategori…' : 'Choose category…'}</option>
                {KINDNESS_CATEGORIES.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {isId ? cat.labelId : cat.labelEn}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="kindness__check">
            <input
              type="checkbox"
              checked={fAnonymous}
              onChange={(e) => setFAnonymous(e.target.checked)}
            />
            <span>
              {isId ? 'Laporkan sebagai anonim' : 'Report anonymously'}
            </span>
          </label>
          {formMessage && (
            <p className="kindness__message" role="status">
              {formMessage}
            </p>
          )}
          <button type="submit" className="button" disabled={sending}>
            {sending
              ? isId
                ? 'Mengirim…'
                : 'Sending…'
              : isId
                ? 'Kirim laporan'
                : 'Send report'}
          </button>
        </form>
      )}

      <div className="kindness__filter">
        <label>
          <span>{isId ? 'Filter kota' : 'Filter by city'}</span>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            <option value="">{isId ? 'Semua kota' : 'All cities'}</option>
            {KINDNESS_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="kindness__layout">
        <div className="kindness__map" role="img" aria-label={isId ? 'Peta kebaikan Indonesia' : 'Indonesia kindness map'}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {Object.entries(CITY_PINS).map(([city, pos]) => {
              const count =
                cityCounts.find((c) => c.city === city)?.count ?? 0;
              if (count === 0) return null;
              const r = Math.min(1.2 + count * 0.15, 3);
              return (
                <circle
                  key={city}
                  cx={pos.x * 100}
                  cy={pos.y * 100}
                  r={r}
                  className="kindness__pin"
                >
                  <title>{`${city}: ${count}`}</title>
                </circle>
              );
            })}
          </svg>
          <ul className="kindness__city-list">
            {cityCounts.length === 0 ? (
              <li>{isId ? 'Belum ada kebaikan tayang bulan ini.' : 'No kindness published this month.'}</li>
            ) : (
              cityCounts.map((c) => (
                <li key={c.city}>
                  <button
                    type="button"
                    className="kindness__city-btn"
                    onClick={() => setSelectedCity(c.city)}
                    aria-pressed={selectedCity === c.city}
                  >
                    {c.city} — {c.count} {isId ? 'kebaikan' : 'kindness'}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="kindness__list">
          {loading ? (
            <p className="kindness__empty">{isId ? 'Memuat…' : 'Loading…'}</p>
          ) : error ? (
            <p className="kindness__empty">{error}</p>
          ) : items.length === 0 ? (
            <p className="kindness__empty">
              {isId
                ? 'Belum ada laporan kebaikan yang tayang di sini.'
                : 'No approved kindness reports here yet.'}
            </p>
          ) : (
            items.map((item) => (
              <article key={item.id} className="kindness__card">
                <h3>{item.title}</h3>
                <div className="kindness__card-meta">
                  <span className="chip">{categoryLabel(item.category, isId)}</span>
                  <span>{item.city}</span>
                  <span>
                    {isId ? 'oleh' : 'by'}{' '}
                    {kindnessReporterLabel({
                      isAnonymous: item.isAnonymous,
                      reporterName: item.reporterName,
                      city: item.city,
                    })}
                  </span>
                </div>
                <p>{item.story}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
