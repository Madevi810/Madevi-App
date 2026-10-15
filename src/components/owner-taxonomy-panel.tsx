'use client';

import { useEffect, useState } from 'react';
import { readCookie } from '@/lib/cookies';

interface TaxonomyRow {
  id: string;
  name: string;
  slug: string;
  path?: string;
  level?: string;
  childCount?: number;
  status?: string;
  version?: number;
}

export function OwnerTaxonomyPanel() {
  const [rows, setRows] = useState<TaxonomyRow[]>([]);
  const [revision, setRevision] = useState<number | null>(null);
  const [selected, setSelected] = useState<TaxonomyRow | null>(null);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<
    Array<{ id: string; revision: number; action: string; createdAt: string }>
  >([]);
  const [pending, setPending] = useState(false);

  async function load() {
    setMessage('');
    try {
      const [treeResponse, summaryResponse, historyResponse] = await Promise.all([
        fetch('/api/v1/taxonomy?limit=100'),
        fetch('/api/v1/owner/taxonomy'),
        fetch('/api/v1/owner/taxonomy/history?limit=10'),
      ]);
      const tree = await treeResponse.json();
      const summary = await summaryResponse.json();
      const historyResult = await historyResponse.json();
      if (!treeResponse.ok || !summaryResponse.ok || !historyResponse.ok)
        throw new Error('Sesi Admin diperlukan untuk mengelola taxonomy.');
      setRows(tree.data?.children ?? []);
      setRevision(summary.data?.activeRevision ?? null);
      setHistory(historyResult.data?.items ?? []);
    } catch (error) {
      setRows([]);
      setMessage(error instanceof Error ? error.message : 'Taxonomy gagal dimuat.');
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, []);

  async function mutate(action: 'ARCHIVE' | 'RESTORE' | 'REORDER' | 'EDIT') {
    if (!selected || revision === null) return;
    setPending(true);
    setMessage('');
    try {
      const response = await fetch(`/api/v1/owner/taxonomy/nodes/${selected.id}`, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': readCookie('madevi_owner_csrf'),
        },
        body: JSON.stringify({
          action,
          expectedRevision: revision,
          confirmedImpact: true,
          sortOrder: action === 'REORDER' ? 0 : undefined,
          name: action === 'EDIT' ? selected.name : undefined,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? 'Perubahan taxonomy ditolak.');
      setSelected(null);
      await load();
      setMessage('Perubahan dibuat sebagai revisi baru.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Perubahan taxonomy gagal.');
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="owner-panel">
      <h1>Taxonomy Admin</h1>
      <p>
        Revisi aktif: {revision ?? 'tidak tersedia'}. Perubahan selalu membuat revisi baru dan
        memerlukan konfirmasi dampak.
      </p>
      <table className="owner-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Path</th>
            <th>Level</th>
            <th>Anak</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.path ?? row.slug}</td>
              <td>{row.level ?? '-'}</td>
              <td>{row.childCount ?? 0}</td>
              <td>{row.status ?? '-'}</td>
              <td>
                <button
                  type="button"
                  className="button button--small"
                  onClick={() => setSelected(row)}
                >
                  Kelola
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <div className="owner-actions" role="group" aria-label="Aksi taxonomy">
          <strong>{selected.name}</strong>
          <button
            type="button"
            className="button button--small"
            disabled={pending}
            onClick={() => void mutate(selected.status === 'ARCHIVED' ? 'RESTORE' : 'ARCHIVE')}
          >
            {selected.status === 'ARCHIVED' ? 'Pulihkan' : 'Arsipkan'}
          </button>
          <button
            type="button"
            className="button button--small"
            disabled={pending}
            onClick={() => void mutate('REORDER')}
          >
            Jadikan urutan pertama
          </button>
          <button
            type="button"
            className="button button--secondary button--small"
            onClick={() => setSelected(null)}
          >
            Batal
          </button>
        </div>
      )}
      {message && <p role="status">{message}</p>}
      {history.length > 0 && (
        <details className="owner-history">
          <summary>Riwayat perubahan struktur</summary>
          <ul>
            {history.map((item) => (
              <li key={item.id}>
                Revisi {item.revision}: {item.action} (
                {new Date(item.createdAt).toLocaleString('id-ID')})
              </li>
            ))}
          </ul>
        </details>
      )}
      {!rows.length && !message && <p>Belum ada data taxonomy.</p>}
    </section>
  );
}

export function Component() {
  return <OwnerTaxonomyPanel />;
}
