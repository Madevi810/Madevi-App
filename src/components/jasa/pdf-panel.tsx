'use client';

/**
 * PdfPanel — Dokumen & PDF (Prompt 06)
 * Alur: upload -> pilih operasi -> konfigurasi -> proses -> unduh.
 * Semua pemrosesan di server (pdf-lib). Guest hanya unduh saat itu;
 * login bisa simpan privat (metadata hasil).
 */

import { useEffect, useRef, useState } from 'react';
import { csrfHeaders } from '../csrf-token';
import { useCurrentUser } from './use-current-user';

type Operation = 'INFO' | 'MERGE' | 'SPLIT' | 'ROTATE' | 'REORDER' | 'DELETE_PAGES' | 'COMPRESS';

interface DroppedFile {
  name: string;
  size: number;
  data: ArrayBuffer;
}

export function PdfPanel({ isId }: { isId: boolean }) {
  const { loggedIn } = useCurrentUser();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<DroppedFile[]>([]);
  const [operation, setOperation] = useState<Operation>('INFO');
  const [pageInput, setPageInput] = useState('');
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [downloadName, setDownloadName] = useState('');
  const [splitOutputs, setSplitOutputs] = useState<Array<{ name: string; url: string }>>([]);
  const [info, setInfo] = useState<{ pages: number; encrypted: boolean } | null>(null);
  const [saved, setSaved] = useState(false);
  const outputUrls = useRef<string[]>([]);

  function clearOutputs() {
    outputUrls.current.forEach((url) => URL.revokeObjectURL(url));
    outputUrls.current = [];
    setDownloadUrl('');
    setDownloadName('');
    setSplitOutputs([]);
    setInfo(null);
    setSaved(false);
  }

  useEffect(() => () => {
    outputUrls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function pickFiles(list: FileList | null) {
    if (!list) return;
    const arr = Array.from(list).filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'),
    );
    if (arr.length === 0) {
      setError(isId ? 'Hanya file PDF.' : 'PDF files only.');
      return;
    }
    setError('');
    Promise.all(
      arr.map(async (f) => ({ name: f.name, size: f.size, data: await f.arrayBuffer() })),
    ).then((dropped) => setFiles((prev) => [...prev, ...dropped]));
  }

  function reset() {
    setFiles([]);
    setPageInput('');
    setError('');
    clearOutputs();
  }

  async function process() {
    setError('');
    clearOutputs();
    if (files.length === 0) {
      setError(isId ? 'Unggah minimal 1 PDF.' : 'Upload at least 1 PDF.');
      return;
    }
    if (operation === 'MERGE' && files.length < 2) {
      setError(isId ? 'Gabung membutuhkan setidaknya 2 PDF.' : 'Merge requires at least 2 PDF files.');
      return;
    }
    if (
      (operation === 'ROTATE' || operation === 'DELETE_PAGES' || operation === 'REORDER') &&
      !pageInput.trim()
    ) {
      setError(
        operation === 'REORDER'
          ? isId
            ? 'Masukkan urutan halaman baru.'
            : 'Enter the new page order.'
          : isId
            ? 'Masukkan nomor halaman yang akan diproses.'
            : 'Enter the page numbers to process.',
      );
      return;
    }
    setBusy(true);
    try {
      const form = new FormData();
      form.append('operation', operation);
      files.forEach((f, i) => form.append(`file${i}`, new Blob([f.data]), f.name));
      if (operation === 'ROTATE' || operation === 'DELETE_PAGES') form.append('pages', pageInput);
      if (operation === 'ROTATE') form.append('angle', String(angle));
      if (operation === 'REORDER') form.append('order', pageInput);
      // L03: key idempoten unik per percobaan agar refresh/retry ganda tidak
      // mengurangi trial dua kali.
      form.append('idempotencyKey', crypto.randomUUID());

      const res = await fetch('/api/v1/pdf/process', {
        method: 'POST',
        headers: csrfHeaders(),
        body: form,
      });
      const json = (await res.json()) as {
        data?: {
          outputName?: string;
          outputBase64?: string;
          outputs?: Array<{ name: string; base64: string }>;
          info?: { pages: number; encrypted: boolean };
        };
        error?: { code?: string; message?: string };
      };
      if (!res.ok || !json.data) {
        if (
          json.error?.code === 'TRIAL_EXHAUSTED' ||
          json.error?.code === 'PACKAGE_INSUFFICIENT'
        ) {
          setError(
            isId
              ? 'Akses untuk memproses berkas ini belum tersedia. Gunakan Langganan di sidebar atau ajukan bantuan melalui Laporkan Masalah.'
              : 'Access to process this file is not available yet. Use Membership in the sidebar or request help through Report Issue.',
          );
          return;
        }
        if (json.error?.code === 'AUTHENTICATION_REQUIRED') {
          setError(
            isId
              ? 'Masuk dengan akun Madevi untuk memproses PDF.'
              : 'Sign in with a Madevi account to process a PDF.',
          );
          return;
        }
        setError(json.error?.message ?? (isId ? 'Pemrosesan gagal.' : 'Processing failed.'));
        return;
      }
      const d = json.data;
      if (d.info) setInfo(d.info);
      if (d.outputBase64) {
        const bytes = Uint8Array.from(atob(d.outputBase64), (c) => c.charCodeAt(0));
        const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
        outputUrls.current.push(url);
        setDownloadUrl(url);
        setDownloadName(d.outputName ?? 'hasil.pdf');
      }
      if (d.outputs && d.outputs.length) {
        const outputs = d.outputs.map((o) => {
          const url = URL.createObjectURL(
            new Blob([Uint8Array.from(atob(o.base64), (c) => c.charCodeAt(0))], {
              type: 'application/pdf',
            }),
          );
          outputUrls.current.push(url);
          return {
            name: o.name,
            url,
          };
        });
        setSplitOutputs(outputs);
      }
    } catch {
      setError(isId ? 'Gagal memproses.' : 'Failed to process.');
    } finally {
      setBusy(false);
    }
  }

  async function saveMeta() {
    if (!loggedIn) return;
    try {
      const res = await fetch('/api/v1/utilities/workspace', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({
          kind: 'PDF',
          title: files[0]?.name ?? 'PDF job',
          input: { operation, fileCount: files.length, pages: pageInput, angle },
          result: { info },
          isPrivate: true,
        }),
      });
      if (!res.ok) throw new Error('workspace save failed');
      setSaved(true);
    } catch {
      setError(isId ? 'Metadata hasil tidak dapat disimpan.' : 'Result metadata could not be saved.');
    }
  }

  const needsPages =
    operation === 'ROTATE' || operation === 'DELETE_PAGES' || operation === 'REORDER';

  return (
    <div className="pdf-panel">
      <input
        ref={inputRef}
        className="pdf-panel__input"
        type="file"
        accept="application/pdf,.pdf"
        multiple
        onChange={(e) => pickFiles(e.target.files)}
      />
      <button
        type="button"
        className="pdf-panel__drop"
        onClick={() => inputRef.current?.click()}
        aria-describedby="pdf-upload-hint"
      >
        <span className="pdf-panel__drop-title">{isId ? 'Pilih file PDF' : 'Choose PDF files'}</span>
        <span id="pdf-upload-hint" className="pdf-panel__hint">
          {isId ? '(Untuk MERGE, unggah 2 PDF atau lebih)' : '(For MERGE, upload 2 or more PDFs)'}
        </span>
      </button>

      {files.length > 0 && (
        <ul className="pdf-panel__files">
          {files.map((f, i) => (
            <li key={i}>
              <span>{f.name}</span>
              <button
                type="button"
                className="button button--small button--secondary"
                onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                aria-label={isId ? `Hapus ${f.name}` : `Remove ${f.name}`}
              >
                {isId ? 'Hapus' : 'Remove'}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="pdf-panel__ops">
        <strong>{isId ? 'Operasi:' : 'Operation:'}</strong>
        <div
          className="capsule-group"
          role="group"
          aria-label={isId ? 'Operasi PDF' : 'PDF operation'}
        >
          {(
            [
              ['INFO', isId ? 'Info' : 'Info'],
              ['MERGE', isId ? 'Gabung' : 'Merge'],
              ['SPLIT', isId ? 'Pisah per halaman' : 'Split per page'],
              ['ROTATE', isId ? 'Rotasi' : 'Rotate'],
              ['DELETE_PAGES', isId ? 'Hapus halaman' : 'Delete pages'],
              ['REORDER', isId ? 'Susun ulang' : 'Reorder'],
              ['COMPRESS', isId ? 'Optimasi' : 'Optimize'],
            ] as const
          ).map(([op, label]) => (
            <button
              key={op}
              type="button"
              className={`capsule-btn${operation === op ? ' capsule-btn--active' : ''}`}
              onClick={() => {
                setOperation(op);
                setError('');
              }}
              aria-pressed={operation === op}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {needsPages && (
        <label className="info-form__field">
          <span>
            {operation === 'REORDER'
              ? isId
                ? 'Urutan baru (cth: 3,1,2) — harus mencakup semua halaman'
                : 'New order (e.g. 3,1,2) — must include every page'
              : isId
                ? 'Nomor halaman (cth: 1,3,5)'
                : 'Page numbers (e.g. 1,3,5)'}
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            placeholder="1,2,3"
          />
        </label>
      )}

      {operation === 'ROTATE' && (
        <div className="pdf-panel__ops">
          <strong>{isId ? 'Sudut:' : 'Angle:'}</strong>
          <div
            className="capsule-group"
            role="group"
            aria-label={isId ? 'Sudut rotasi' : 'Rotation angle'}
          >
            {([90, 180, 270] as const).map((a) => (
              <button
                key={a}
                type="button"
                className={`capsule-btn${angle === a ? ' capsule-btn--active' : ''}`}
                onClick={() => setAngle(a)}
                aria-pressed={angle === a}
              >
                {a}°
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pdf-panel__actions">
        <button type="button" className="button" onClick={() => void process()} disabled={busy}>
          {busy ? (isId ? 'Memproses…' : 'Processing…') : isId ? 'Proses' : 'Process'}
        </button>
        <button type="button" className="button button--secondary" onClick={reset}>
          {isId ? 'Reset' : 'Reset'}
        </button>
      </div>

      {error && (
        <p className="r5-software-detail__msg--error" role="alert">
          {error}
        </p>
      )}

      {info && (
        <div className="rumus-result" aria-live="polite">
          <h3>{isId ? 'Info dokumen' : 'Document info'}</h3>
          <p>{isId ? `Jumlah halaman: ${info.pages}` : `Pages: ${info.pages}`}</p>
          <p>
            {isId
              ? `Terenkripsi: ${info.encrypted ? 'Ya' : 'Tidak'}`
              : `Encrypted: ${info.encrypted ? 'Yes' : 'No'}`}
          </p>
        </div>
      )}

      {downloadUrl && (
        <div className="pdf-panel__result" aria-live="polite">
          <a className="button" href={downloadUrl} download={downloadName}>
            {isId ? 'Unduh' : 'Download'} {downloadName}
          </a>
          {loggedIn && (
            <button
              type="button"
              className="button button--small button--secondary"
              onClick={() => void saveMeta()}
            >
              {isId ? 'Simpan metadata ke workspace' : 'Save metadata to workspace'}
            </button>
          )}
        </div>
      )}

      {splitOutputs.length > 0 && (
        <div className="pdf-panel__result" aria-live="polite">
          <h3>{isId ? 'Hasil pecahan' : 'Split results'}</h3>
          <ul className="pdf-panel__files">
            {splitOutputs.map((o, i) => (
              <li key={i}>
                <a href={o.url} download={o.name}>
                  {isId ? 'Unduh' : 'Download'} {o.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {saved && (
        <p className="r5-software-detail__msg" role="status">
          {isId ? 'Metadata hasil tersimpan di workspace privat.' : 'Result metadata is saved to your private workspace.'}
        </p>
      )}

      {!loggedIn && (
        <p className="pdf-panel__hint">
          {isId
            ? 'Guest: pemeriksaan info PDF dapat dilakukan di sini. Masuk dengan akun Madevi untuk memproses berkas.'
            : 'Guest: PDF information can be inspected here. Sign in with a Madevi account to process files.'}
        </p>
      )}
    </div>
  );
}
