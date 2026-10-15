'use client';

import { useCallback, useEffect, useState } from 'react';
import { readCookie } from '@/lib/cookies';
import { useLanguage } from './theme-provider';

interface CaseRow {
  id: string;
  riskLevel: string;
  category: string;
  createdAt: string;
  targetType: string;
  reportCount: number;
  reportCategoryLabels?: string | null;
}

const DECISIONS = ['CLEAR', 'CONFIRM_GENERAL', 'CONFIRM_CRITICAL', 'KEEP_QUARANTINED'] as const;
const SANCTIONS = ['NONE', 'MUTE_7D', 'MUTE_30D', 'PERMANENT_BLOCK'] as const;

/** Sanksi yang memerlukan konfirmasi teks eksplisit sebelum POST dikirim. */
const HEAVY_SANCTIONS: ReadonlySet<string> = new Set(['MUTE_30D', 'PERMANENT_BLOCK']);


export function OwnerModerationPanel() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadError, setLoadError] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [decision, setDecision] = useState<string>('CLEAR');
  const [sanction, setSanction] = useState<string>('NONE');
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoadState('loading');
    setLoadError('');
    try {
      const r = await fetch('/api/v1/owner/moderation/cases?limit=50');
      const j = await r.json();
      if (!r.ok) throw new Error(j.error?.message ?? `HTTP ${r.status}`);
      setCases(j.data ?? []);
      setLoadState('ready');
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err));
      setLoadState('error');
    }
  }, []);

  // The loader updates state from an asynchronous API response.
  useEffect(() => {
    load();
  }, [load]);

  /**
   * Sanksi berat (MUTE_30D / PERMANENT_BLOCK) memerlukan Admin mengetik ulang
   * nama sanksi secara eksplisit sebelum POST dikirim — mencegah klik tidak sengaja.
   */
  const needsConfirm = HEAVY_SANCTIONS.has(sanction);
  const confirmExpected = sanction.toLowerCase();
  const confirmReady = !needsConfirm || confirmText.trim().toLowerCase() === confirmExpected;

  async function decide(id: string) {
    if (reason.trim().length < 10) {
      setMessage(isId ? 'Alasan minimal 10 karakter.' : 'Reason needs at least 10 characters.');
      return;
    }
    if (!confirmReady) {
      setMessage(
        isId
          ? `Ketik "${confirmExpected}" untuk mengonfirmasi sanksi berat.`
          : `Type "${confirmExpected}" to confirm the heavy sanction.`,
      );
      return;
    }
    setSubmitting(true);
    setMessage('');
    try {
      const r = await fetch(`/api/v1/owner/moderation/cases/${id}/decision`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': readCookie('madevi_owner_csrf'),
        },
        body: JSON.stringify({ decision, reason: reason.trim(), criticalSanction: sanction }),
      });
      const j = await r.json();
      if (j.data) {
        setOpenId(null);
        setReason('');
        setConfirmText('');
        setMessage(isId ? 'Keputusan tersimpan + audit.' : 'Decision saved + audited.');
        load();
      } else {
        setMessage(j.error?.message ?? (isId ? 'Gagal menyimpan keputusan.' : 'Failed to save decision.'));
      }
    } finally {
      setSubmitting(false);
    }
  }

  function openCase(id: string) {
    setOpenId(openId === id ? null : id);
    setReason('');
    setConfirmText('');
    setDecision('CLEAR');
    setSanction('NONE');
    setMessage('');
  }

  return (
    <main id="main-content" className="owner-panel">
      <h1>{isId ? 'Moderasi' : 'Moderation'}</h1>

      {/* Loading state */}
      {loadState === 'loading' && (
        <p className="status-line" aria-live="polite">
          {isId ? 'Memuat kasus moderasi…' : 'Loading moderation cases…'}
        </p>
      )}

      {/* Error state dengan tombol retry */}
      {loadState === 'error' && (
        <div role="alert" className="owner-panel__error">
          <p className="info-form__status">
            {isId ? `Gagal memuat: ${loadError}` : `Failed to load: ${loadError}`}
          </p>
          <button type="button" className="button button--small" onClick={() => void load()}>
            {isId ? 'Coba lagi' : 'Retry'}
          </button>
        </div>
      )}

      {/* Pesan aksi */}
      {message && (
        <p className="info-form__status" role="alert">
          {message}
        </p>
      )}

      {/* Empty state */}
      {loadState === 'ready' && !cases.length && (
        <p>{isId ? 'Tidak ada kasus moderasi aktif.' : 'No active moderation cases.'}</p>
      )}

      {/* Tabel dibungkus wrapper untuk scroll horizontal di layar sempit */}
      {loadState === 'ready' && cases.length > 0 && (
        <div className="owner-table-wrap">
          <table className="owner-table">
            <thead>
              <tr>
                <th>{isId ? 'Tipe' : 'Type'}</th>
                <th>{isId ? 'Kategori' : 'Category'}</th>
                <th>{isId ? 'Risiko' : 'Risk'}</th>
                <th>{isId ? 'Laporan' : 'Reports'}</th>
                <th>{isId ? 'Kategori laporan' : 'Report category'}</th>
                <th>{isId ? 'Tanggal' : 'Date'}</th>
                <th>{isId ? 'Aksi' : 'Action'}</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id}>
                  <td>{c.targetType}</td>
                  <td>{c.category}</td>
                  <td>{c.riskLevel}</td>
                  <td>{c.reportCount}</td>
                  <td>{c.reportCategoryLabels || '—'}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      type="button"
                      className="button button--small"
                      aria-expanded={openId === c.id}
                      onClick={() => openCase(c.id)}
                    >
                      {isId ? 'Putuskan' : 'Decide'}
                    </button>
                    {openId === c.id && (
                      <div className="owner-decide" role="region" aria-label={isId ? 'Form keputusan moderasi' : 'Moderation decision form'}>
                        <div
                          className="capsule-group"
                          role="group"
                          aria-label={isId ? 'Keputusan' : 'Decision'}
                        >
                          {DECISIONS.map((d) => (
                            <button
                              key={d}
                              type="button"
                              className={`capsule-btn${decision === d ? ' capsule-btn--active' : ''}`}
                              onClick={() => setDecision(d)}
                              aria-pressed={decision === d}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                        <div
                          className="capsule-group"
                          role="group"
                          aria-label={isId ? 'Sanksi' : 'Sanction'}
                        >
                          {SANCTIONS.map((s) => (
                            <button
                              key={s}
                              type="button"
                              className={`capsule-btn${sanction === s ? ' capsule-btn--active' : ''}`}
                              onClick={() => { setSanction(s); setConfirmText(''); }}
                              aria-pressed={sanction === s}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                        <label className="owner-decide__label">
                          <span>{isId ? 'Alasan (min 10 karakter)' : 'Reason (min 10 chars)'}</span>
                          <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder={isId ? 'Alasan keputusan…' : 'Decision reason…'}
                            maxLength={1000}
                          />
                        </label>
                        {/* Konfirmasi eksplisit untuk sanksi berat */}
                        {needsConfirm && (
                          <label className="owner-decide__label owner-decide__label--confirm">
                            <span>
                              {isId
                                ? `Sanksi berat dipilih. Ketik "${confirmExpected}" untuk mengonfirmasi:`
                                : `Heavy sanction selected. Type "${confirmExpected}" to confirm:`}
                            </span>
                            <input
                              type="text"
                              value={confirmText}
                              onChange={(e) => setConfirmText(e.target.value)}
                              placeholder={confirmExpected}
                              autoComplete="off"
                            />
                          </label>
                        )}
                        <button
                          type="button"
                          className="button button--small"
                          onClick={() => void decide(c.id)}
                          disabled={submitting || !confirmReady}
                          aria-disabled={submitting || !confirmReady}
                        >
                          {submitting
                            ? (isId ? 'Menyimpan…' : 'Saving…')
                            : (isId ? 'Kirim Keputusan' : 'Submit Decision')}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
