'use client';

/**
 * RumusPanel — Perhitungan & Rumus (Prompt 06)
 * Deterministik: input -> API compute -> nilai + langkah pengerjaan.
 * Simpan privat (login) atau unduh hasil.
 *
 * REDESIGN: pola kalkulator konsisten — kategori tabs → daftar formula →
 * input besar → tombol hitung → hasil prominent + langkah.
 */

import { useEffect, useState } from 'react';
import { csrfHeaders } from '../csrf-token';
import { useCurrentUser } from './use-current-user';

interface FormulaVariable {
  key: string;
  label: string;
  unit?: string;
}
interface FormulaDef {
  id: string;
  category: 'MATH' | 'PHYSICS' | 'FINANCE';
  name: string;
  description: string;
  variables: FormulaVariable[];
}
interface ComputeResult {
  value: number;
  unit?: string;
  steps: string[];
}

const CATEGORY_LABEL: Record<string, { id: string; en: string }> = {
  MATH: { id: 'Matematika', en: 'Mathematics' },
  PHYSICS: { id: 'Fisika', en: 'Physics' },
  FINANCE: { id: 'Keuangan', en: 'Finance' },
};

export function RumusPanel({ isId }: { isId: boolean }) {
  const { loggedIn } = useCurrentUser();
  const [formulas, setFormulas] = useState<FormulaDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('MATH');
  const [activeFormula, setActiveFormula] = useState<FormulaDef | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ComputeResult | null>(null);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setLoadError('');
        const res = await fetch('/api/v1/utilities/rumus', { cache: 'no-store' });
        const json = (await res.json()) as { data?: FormulaDef[] };
        if (!res.ok || !Array.isArray(json.data)) throw new Error('formula list unavailable');
        if (!active) return;
        setFormulas(json.data);
        const first = json.data.find((f) => f.category === 'MATH') ?? json.data[0];
        setActiveFormula(first ?? null);
        if (first) setActiveCategory(first.category);
      } catch {
        if (active) setLoadError(isId ? 'Daftar rumus tidak dapat dimuat.' : 'The formula list could not be loaded.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isId, reloadKey]);

  const visibleFormulas = formulas.filter((f) => f.category === activeCategory);
  const availableCategories = Object.keys(CATEGORY_LABEL).filter((category) =>
    formulas.some((formula) => formula.category === category),
  );

  async function compute() {
    setError('');
    setResult(null);
    setSaved(false);
    setCopied(false);
    if (!activeFormula) return;
    const missingValue = activeFormula.variables.find((variable) => {
      const value = values[variable.key]?.trim();
      return !value || !Number.isFinite(Number(value));
    });
    if (missingValue) {
      setError(
        isId
          ? `Masukkan nilai numerik untuk ${missingValue.label}.`
          : `Enter a numeric value for ${missingValue.label}.`,
      );
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/v1/utilities/rumus', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...csrfHeaders() },
        // L03: key idempoten unik per percobaan agar refresh/retry ganda
        // tidak mengurangi trial dua kali.
        body: JSON.stringify({
          formulaId: activeFormula.id,
          values,
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      const json = (await res.json()) as {
        data?: ComputeResult;
        error?: { code?: string; message?: string };
      };
      if (!res.ok || !json.data) {
        if (
          json.error?.code === 'TRIAL_EXHAUSTED' ||
          json.error?.code === 'PACKAGE_INSUFFICIENT'
        ) {
          setError(
            isId
              ? 'Akses untuk menjalankan alat ini belum tersedia. Gunakan Langganan di sidebar atau ajukan bantuan melalui Laporkan Masalah.'
              : 'Access to run this tool is not available yet. Use Membership in the sidebar or request help through Report Issue.',
          );
          return;
        }
        if (json.error?.code === 'AUTHENTICATION_REQUIRED') {
          setError(
            isId
              ? 'Masuk dengan akun Madevi untuk menjalankan perhitungan.'
              : 'Sign in with a Madevi account to run a calculation.',
          );
          return;
        }
        setError(json.error?.message ?? (isId ? 'Input tidak valid.' : 'Invalid input.'));
        return;
      }
      setResult(json.data);
    } catch {
      setError(isId ? 'Gagal menghitung.' : 'Failed to compute.');
    } finally {
      setBusy(false);
    }
  }

  function resetCalculation() {
    setValues({});
    setResult(null);
    setSaved(false);
    setCopied(false);
    setError('');
  }

  async function copyResult() {
    if (!activeFormula || !result || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(
        `${activeFormula.name}\n${isId ? 'Hasil' : 'Result'}: ${formatResult(result.value, result.unit, isId)}\n${result.steps.join('\n')}`,
      );
      setCopied(true);
    } catch {
      setError(isId ? 'Hasil tidak dapat disalin.' : 'The result could not be copied.');
    }
  }

  async function savePrivate() {
    if (!loggedIn) {
      setError(
        isId ? 'Login diperlukan untuk simpan privat.' : 'Login required to save privately.',
      );
      return;
    }
    if (!activeFormula || !result) return;
    setError('');
    try {
      const res = await fetch('/api/v1/utilities/workspace', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({
          kind: 'RUMUS',
          title: activeFormula.name,
          input: { formulaId: activeFormula.id, values },
          result: result,
          isPrivate: true,
        }),
      });
      if (!res.ok) throw new Error('save failed');
      setSaved(true);
    } catch {
      setError(isId ? 'Gagal menyimpan.' : 'Failed to save.');
    }
  }

  if (loading) {
    return (
      <div className="calc">
        <div className="calc__empty" aria-busy="true">
          <strong>{isId ? 'Memuat rumus…' : 'Loading formulas…'}</strong>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="calc">
        <div className="calc__empty" role="alert">
          <strong>{loadError}</strong>
          <p>{isId ? 'Periksa koneksi lalu coba lagi.' : 'Check your connection and try again.'}</p>
          <div className="calc__actions">
            <button type="button" className="calc__btn-secondary" onClick={() => setReloadKey((key) => key + 1)}>
              {isId ? 'Muat ulang daftar' : 'Reload list'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (formulas.length === 0) {
    return (
      <div className="calc">
        <div className="calc__empty">
          <strong>{isId ? 'Belum ada rumus.' : 'No formulas yet.'}</strong>
          <p>{isId ? 'Daftar rumus akan ditambahkan oleh Admin.' : 'The formula list will be added by the Admin.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="calc">
      <div className="calc__tabs" role="tablist" aria-label={isId ? 'Kategori rumus' : 'Formula categories'}>
        {availableCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat}
            className={`calc__tab${activeCategory === cat ? ' calc__tab--active' : ''}`}
            onClick={() => {
              setActiveCategory(cat);
              const first = formulas.find((f) => f.category === cat);
              setActiveFormula(first ?? null);
              resetCalculation();
            }}
          >
            {isId ? CATEGORY_LABEL[cat].id : CATEGORY_LABEL[cat].en}
          </button>
        ))}
      </div>

      <div className="calc__layout">
        <aside className="calc__list" aria-label={isId ? 'Daftar rumus' : 'Formula list'}>
          <p className="calc__list-label">
            {isId ? CATEGORY_LABEL[activeCategory]?.id ?? '' : CATEGORY_LABEL[activeCategory]?.en ?? ''}
          </p>
          {visibleFormulas.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`calc__item${activeFormula?.id === f.id ? ' calc__item--active' : ''}`}
              onClick={() => {
                setActiveFormula(f);
                resetCalculation();
              }}
              aria-current={activeFormula?.id === f.id ? 'true' : undefined}
            >
              <span>{f.name}</span>
              <span className="calc__item-chevron" aria-hidden="true">›</span>
            </button>
          ))}
        </aside>

        <section className="calc__workspace" aria-live="polite">
          {activeFormula ? (
            <>
              <div>
                <h3>{activeFormula.name}</h3>
                <p className="calc__desc">{activeFormula.description}</p>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void compute();
                }}
              >
                <div className="calc__fields">
                  {activeFormula.variables.map((v) => (
                    <label key={v.key} className="calc__field">
                      <span>
                        {v.label}
                        {v.unit ? <small> · {v.unit}</small> : null}
                      </span>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="any"
                        value={values[v.key] ?? ''}
                        onChange={(e) => setValues((prev) => ({ ...prev, [v.key]: e.target.value }))}
                        placeholder="0"
                        required
                        aria-label={v.unit ? `${v.label} (${v.unit})` : v.label}
                      />
                    </label>
                  ))}
                </div>

                <div className="calc__actions" style={{ marginTop: 'var(--pr-space-4)' }}>
                  <button type="submit" className="calc__btn-primary" disabled={busy}>
                    {busy ? (isId ? 'Menghitung…' : 'Computing…') : isId ? 'Hitung' : 'Compute'}
                  </button>
                  <button type="button" className="calc__btn-secondary" onClick={resetCalculation} disabled={busy}>
                    {isId ? 'Bersihkan' : 'Clear'}
                  </button>
                </div>
              </form>

              {error && (
                <p className="calc__msg calc__msg--error" role="alert">
                  {error}
                </p>
              )}
              {saved && (
                <p className="calc__msg calc__msg--success" role="status">
                  {isId ? 'Tersimpan ke workspace privat.' : 'Saved to private workspace.'}
                </p>
              )}

              {result && (
                <div className="calc__result">
                  <p className="calc__result-label">{isId ? 'Hasil' : 'Result'}</p>
                  <p className="calc__result-value">
                    {formatResult(result.value, result.unit, isId)}
                  </p>
                  {result.steps.length > 0 && (
                    <>
                      <p className="calc__steps-label">{isId ? 'Langkah pengerjaan' : 'Working steps'}</p>
                      <ol className="calc__steps">
                        {result.steps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </>
                  )}
                  <div className="calc__result-actions">
                    <button
                      type="button"
                      className="calc__btn-secondary"
                      onClick={() => void copyResult()}
                    >
                      {copied ? (isId ? 'Tersalin ✓' : 'Copied ✓') : isId ? 'Salin hasil' : 'Copy result'}
                    </button>
                    <button
                      type="button"
                      className="calc__btn-secondary"
                      onClick={() => void savePrivate()}
                      disabled={!loggedIn}
                      title={!loggedIn ? (isId ? 'Login untuk simpan' : 'Login to save') : undefined}
                    >
                      {isId ? 'Simpan privat' : 'Save private'}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="calc__empty">
              <strong>{isId ? 'Pilih rumus.' : 'Select a formula.'}</strong>
              <p>{isId ? 'Pilih dari daftar di samping.' : 'Choose from the list.'}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function formatResult(value: number, unit: string | undefined, isId: boolean) {
  const rendered = Number.isFinite(value)
    ? new Intl.NumberFormat(isId ? 'id-ID' : 'en-US', { maximumFractionDigits: 4 }).format(value)
    : isId
      ? 'Tidak terdefinisi'
      : 'Undefined';
  return unit ? `${rendered} ${unit}` : rendered;
}
