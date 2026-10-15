'use client';

import { useEffect, useState } from 'react';

type Row = Record<string, unknown>;

export function OwnerDataPanel({
  title,
  endpoint,
  empty,
}: {
  title: string;
  endpoint: string;
  empty: string;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch(endpoint, { cache: 'no-store' })
      .then(async (response) => {
        const payload = (await response.json()) as { data?: unknown; error?: { message?: string } };
        if (!response.ok) throw new Error(payload.error?.message ?? `HTTP ${response.status}`);
        const data = Array.isArray(payload.data)
          ? payload.data
          : payload.data && typeof payload.data === 'object'
            ? [payload.data]
            : [];
        if (active) setRows(data as Row[]);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Gagal memuat data');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [endpoint]);

  const columns = rows.length ? Object.keys(rows[0]).slice(0, 6) : [];
  return (
    <main className="page-shell" id="main-content">
      <section className="owner-panel" aria-live="polite">
        <h1>{title}</h1>
        {loading && <p className="status-line">Memuat data Admin…</p>}
        {error && (
          <p className="info-form__status" role="alert">
            {error}
          </p>
        )}
        {!loading && !error && !rows.length && <p>{empty}</p>}
        {!loading && !error && rows.length > 0 && (
          <div className="owner-table-wrap">
            <table className="owner-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={String(row.id ?? index)}>
                    {columns.map((column) => (
                      <td key={column}>{formatCell(row[column])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function formatCell(value: unknown) {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
