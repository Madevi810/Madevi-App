'use client';

/**
 * R5SoftwareDetail — Detail software satu item sesuai kontrak R5.
 *
 * Section accordion: Fungsi & Penggunaan, Instalasi, Spesifikasi/Rumus,
 * Contoh & Gambar, Troubleshooting, Riwayat Versi, Sumber/Lisensi/Keamanan.
 *
 * Unduh: hanya user login (server mengembalikan 401 jika belum login).
 * Scan: jika bukan CLEAN, tampil peringatan merah, unduh dinonaktifkan.
 */

import { useRouter } from 'next/navigation';
import { readCookie } from '@/lib/cookies';
import { useEffect, useState } from 'react';
import { useLanguage } from './theme-provider';

interface Software {
  id: string;
  name: string;
  slug: string;
  developer: string;
  official_site: string | null;
  license_info: string | null;
  description: string | null;
  tool_url: string | null;
  type: string | null;
  thumbnail_url: string | null;
  usage_guide: string | null;
  specs: string | null;
  examples: string | null;
  troubleshooting: string | null;
  security_notes: string | null;
  /** Keselamatan R5: level atau teks peringatan (data Admin). */
  safety_level?: string | null;
  safety_warning?: string | null;
  /** Pemisah dua jenis halaman akhir R5: panduan alat vs detail software. */
  content_kind?: string | null;
}

interface VersionRow {
  id: string;
  version: string;
  release_date: string | null;
  changelog: string | null;
  requirements_system: string | null;
  scan_status: string;
  size_bytes: string | number | null;
}


function formatBytes(bytes: string | number | null): string {
  if (bytes == null) return '';
  const n = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
  if (isNaN(n) || n <= 0) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/* ===== Accordion Section ===== */
function AccordionSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="r5-accordion">
      <button
        type="button"
        className={`r5-accordion__header${open ? ' r5-accordion__header--open' : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((p) => !p)}
      >
        <span>{title}</span>
        <span className="r5-accordion__chevron" aria-hidden="true">
          {open ? '▾' : '›'}
        </span>
      </button>
      {open && <div className="r5-accordion__body">{children}</div>}
    </div>
  );
}

/* ===== R5SoftwareDetail ===== */
export function R5SoftwareDetail({ softwareId }: { softwareId: string }) {
  const router = useRouter();
  const { language } = useLanguage();
  const isId = language === 'id';

  const [sw, setSw] = useState<Software | null>(null);
  const [versions, setVersions] = useState<VersionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dlMsg, setDlMsg] = useState('');
  const [error, setError] = useState('');
  const [reportOpen, setReportOpen] = useState(false);
  const [reportDescription, setReportDescription] = useState('');
  const [reportStatus, setReportStatus] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    void (async () => {
      try {
        /* Ambil data software */
        const res = await fetch(`/api/v1/software/${softwareId}`);
        if (!res.ok) throw new Error(isId ? 'Software tidak ditemukan.' : 'Software not found.');
        const j = (await res.json()) as { data?: Software };
        const data = j.data ?? null;
        setSw(data);

        /* Ambil versi */
        if (data) {
          const vRes = await fetch(`/api/v1/software/versions/${data.id}`);
          if (vRes.ok) {
            const vj = (await vRes.json()) as { data?: { items?: VersionRow[] } };
            setVersions(vj.data?.items ?? []);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : isId ? 'Gagal memuat.' : 'Failed to load.');
      } finally {
        setLoading(false);
      }
    })();
  }, [softwareId, isId]);

  async function download(versionId: string) {
    setDlMsg('');
    try {
      const r = await fetch(`/api/v1/software/versions/${versionId}/download`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-csrf-token': readCookie('madevi_csrf') },
      });
      if (r.status === 401) {
        router.push('/auth');
        return;
      }
      const j = (await r.json()) as { data?: unknown; error?: { message?: string } };
      if (r.ok && j.data) {
        setDlMsg(
          isId
            ? 'Unduhan siap. Pemeriksaan lokal berkas: CLEAN.'
            : 'Download ready. Local file check: CLEAN.',
        );
      } else {
        setDlMsg(j.error?.message ?? (isId ? 'Unduhan gagal.' : 'Download failed.'));
      }
    } catch {
      setDlMsg(isId ? 'Gagal (jaringan).' : 'Failed (network).');
    }
  }

  async function reportMalware() {
    if (!sw || reportDescription.trim().length < 10) {
      setReportStatus(
        isId
          ? 'Jelaskan laporan minimal 10 karakter.'
          : 'Describe the report in at least 10 characters.',
      );
      return;
    }
    try {
      const response = await fetch(`/api/v1/software/${encodeURIComponent(sw.slug)}/report`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-csrf-token': readCookie('madevi_csrf') },
        body: JSON.stringify({
          softwareId: sw.id,
          kind: 'MALWARE',
          description: reportDescription.trim(),
        }),
      });
      if (response.status === 401) {
        router.push('/auth');
        return;
      }
      const json = (await response.json()) as { error?: { message?: string } };
      setReportStatus(
        response.ok
          ? isId
            ? 'Laporan dikirim; Admin dapat menonaktifkan unduhan berisiko tinggi.'
            : 'Report sent; the Admin can disable high-risk downloads.'
          : (json.error?.message ??
              (isId ? 'Laporan belum dikirim.' : 'Report was not submitted.')),
      );
    } catch {
      setReportStatus(isId ? 'Laporan belum dapat dikirim.' : 'Report could not be submitted.');
    }
  }

  if (loading)
    return (
      <p className="rnav__status">
        {isId ? 'Memuat detail software…' : 'Loading software details…'}
      </p>
    );
  if (error)
    return (
      <p className="rnav__status" role="status">
        {isId
          ? 'Detail alat menunggu data yang disetujui Admin.'
          : 'This tool detail is waiting for approved Admin data.'}
      </p>
    );
  if (!sw) return null;

  const latestVersion = versions.find((v) => v.scan_status === 'CLEAN') ?? versions[0];

  return (
    <div className="r5-software-detail">
      {/* Header: nama, developer, tipe */}
      <div className="r5-software-detail__header">
        {sw.thumbnail_url && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={sw.thumbnail_url} alt={sw.name} className="r5-software-detail__thumb" />
        )}
        <div className="r5-software-detail__meta">
          <h1 className="r5-software-detail__name">{sw.name}</h1>
          {sw.developer && (
            <p className="r5-software-detail__dev">
              <span className="r5-software-detail__dev-label">{isId ? 'Pengembang' : 'Developer'}</span>
              <span className="r5-software-detail__dev-name">{sw.developer}</span>
            </p>
          )}
          <div className="r5-software-detail__badges">
            {sw.type && <span className="r5-badge">{sw.type}</span>}
            {latestVersion && (
              <span
                className={`r5-badge ${latestVersion.scan_status === 'CLEAN' ? 'r5-badge--clean' : 'r5-badge--warn'}`}
              >
                v{latestVersion.version} · {latestVersion.scan_status}
              </span>
            )}
          </div>
          {sw.description && <p className="r5-software-detail__summary">{sw.description}</p>}
        </div>
      </div>

      {/* Blok keselamatan — wajib di atas bagian langkah (scope P04-E) */}
      {(sw.safety_level || sw.safety_warning) && (
        <div className="r5-safety" role="alert">
          <h2 className="r5-safety__title">
            ⚠️ {isId ? 'Peringatan Keselamatan' : 'Safety Warning'}
            {sw.safety_level && <span className="r5-badge r5-badge--warn"> {sw.safety_level}</span>}
          </h2>
          {sw.safety_warning && <p className="r5-safety__text">{sw.safety_warning}</p>}
          <ul className="r5-safety__list">
            <li>
              {isId
                ? 'Batas usia/kompetensi dan APD yang diperlukan.'
                : 'Age/competence limits and required PPE.'}
            </li>
            <li>
              {isId
                ? 'Risiko utama dan kondisi darurat.'
                : 'Main hazards and emergency conditions.'}
            </li>
            <li>
              {isId
                ? 'Kapan harus menyerahkan pekerjaan ke tenaga berwenang.'
                : 'When to hand the job to a qualified professional.'}
            </li>
          </ul>
        </div>
      )}

      {/* Aksi utama */}
      <div className="r5-software-detail__actions">
        {sw.tool_url && (
          <a href={sw.tool_url} target="_blank" rel="noopener noreferrer" className="button">
            {isId ? '▶ Buka Alat' : '▶ Open Tool'}
          </a>
        )}
        {sw.official_site && (
          <a
            href={sw.official_site}
            target="_blank"
            rel="noopener noreferrer"
            className="button button--secondary"
          >
            {isId ? '🌐 Buka Situs Resmi' : '🌐 Official Site'}
          </a>
        )}
        {latestVersion && (
          <button
            type="button"
            className={`button${latestVersion.scan_status !== 'CLEAN' ? ' button--secondary' : ''}`}
            disabled={latestVersion.scan_status !== 'CLEAN'}
            onClick={() => void download(latestVersion.id)}
            title={
              latestVersion.scan_status !== 'CLEAN'
                ? isId
                  ? 'File dalam karantina, tidak dapat diunduh'
                  : 'File quarantined, cannot download'
                : undefined
            }
          >
            📥 {isId ? 'Unduh' : 'Download'}
            {latestVersion.size_bytes ? ` (${formatBytes(latestVersion.size_bytes)})` : ''}
          </button>
        )}
      </div>

      {/* Pesan unduh / peringatan */}
      {dlMsg && (
        <p
          className={`r5-software-detail__msg${dlMsg.includes('siap') || dlMsg.includes('ready') ? '' : ' r5-software-detail__msg--error'}`}
        >
          {dlMsg}
        </p>
      )}
      {latestVersion && latestVersion.scan_status !== 'CLEAN' && (
        <p className="r5-software-detail__warn" role="alert">
          ⚠️{' '}
          {isId
            ? 'File ini sedang dalam karantina dan tidak dapat diunduh. Laporan malware berisiko tinggi menonaktifkan unduhan sementara.'
            : 'This file is quarantined and cannot be downloaded. High-risk malware reports temporarily disable downloads.'}
        </p>
      )}

      <div className="r5-report">
        <button
          type="button"
          className="button button--small button--secondary"
          onClick={() => setReportOpen((open) => !open)}
        >
          {isId ? 'Laporkan risiko malware' : 'Report malware risk'}
        </button>
        {reportOpen && (
          <div className="r5-report__form">
            <textarea
              value={reportDescription}
              onChange={(event) => setReportDescription(event.target.value)}
              maxLength={2000}
              rows={3}
              placeholder={isId ? 'Jelaskan risiko yang ditemukan…' : 'Describe the risk found…'}
            />
            <button
              type="button"
              className="button button--small"
              onClick={() => void reportMalware()}
            >
              {isId ? 'Kirim laporan' : 'Submit report'}
            </button>
            {reportStatus && <p className="r5-report__status">{reportStatus}</p>}
          </div>
        )}
      </div>

      {/* Accordion Sections */}
      <div className="r5-accordion-list">
        {sw.usage_guide && (
          <AccordionSection title={isId ? 'Fungsi & Penggunaan' : 'Function & Usage'}>
            <p className="r5-accordion__text">{sw.usage_guide}</p>
          </AccordionSection>
        )}

        <AccordionSection title={isId ? 'Instalasi' : 'Installation'}>
          <p className="r5-accordion__text">
            {isId
              ? 'Panduan instalasi akan tersedia setelah Admin menerbitkan konten detail software ini.'
              : 'Installation guide will be available after the Admin publishes this software detail.'}
          </p>
        </AccordionSection>

        {sw.specs && (
          <AccordionSection title={isId ? 'Spesifikasi & Rumus' : 'Specifications & Formulas'}>
            <p className="r5-accordion__text">{sw.specs}</p>
          </AccordionSection>
        )}

        {sw.examples && (
          <AccordionSection title={isId ? 'Contoh & Gambar' : 'Examples & Images'}>
            <p className="r5-accordion__text">{sw.examples}</p>
          </AccordionSection>
        )}

        {sw.troubleshooting && (
          <AccordionSection title={isId ? 'Troubleshooting' : 'Troubleshooting'}>
            <p className="r5-accordion__text">{sw.troubleshooting}</p>
          </AccordionSection>
        )}

        <AccordionSection title={isId ? 'Riwayat Versi' : 'Version History'}>
          {versions.length === 0 ? (
            <p className="r5-accordion__text">
              {isId ? 'Belum ada versi tersedia.' : 'No versions available yet.'}
            </p>
          ) : (
            <div className="r5-version-table">
              {versions.map((v) => (
                <div key={v.id} className="r5-version-row">
                  <div className="r5-version-row__main">
                    <strong>v{v.version}</strong>
                    {v.release_date && (
                      <span className="r5-version-row__date">
                        {new Date(v.release_date).toLocaleDateString()}
                      </span>
                    )}
                    <span
                      className={`r5-badge ${v.scan_status === 'CLEAN' ? 'r5-badge--clean' : 'r5-badge--warn'}`}
                    >
                      {v.scan_status}
                    </span>
                    {v.size_bytes && (
                      <span className="r5-version-row__size">{formatBytes(v.size_bytes)}</span>
                    )}
                  </div>
                  {v.requirements_system && (
                    <p className="r5-version-row__req">
                      {isId ? 'Kebutuhan:' : 'Requirements:'} {v.requirements_system}
                    </p>
                  )}
                  {v.changelog && <p className="r5-version-row__changelog">{v.changelog}</p>}
                  <div className="r5-version-row__action">
                    {v.scan_status === 'CLEAN' ? (
                      <button
                        type="button"
                        className="button button--small"
                        onClick={() => void download(v.id)}
                      >
                        📥 {isId ? 'Unduh versi ini' : 'Download this version'}
                      </button>
                    ) : (
                      <span className="r5-version-row__blocked">
                        🔒 {isId ? 'Tidak dapat diunduh' : 'Cannot download'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </AccordionSection>

        <AccordionSection
          title={isId ? 'Sumber, Lisensi & Keamanan' : 'Source, License & Security'}
        >
          <div className="r5-accordion__text">
            {sw.license_info && (
              <p>
                <strong>{isId ? 'Lisensi:' : 'License:'}</strong> {sw.license_info}
              </p>
            )}
            {sw.security_notes && (
              <p>
                <strong>{isId ? 'Keamanan:' : 'Security:'}</strong> {sw.security_notes}
              </p>
            )}
            {sw.official_site && (
              <p>
                <strong>{isId ? 'Sumber resmi:' : 'Official source:'}</strong>{' '}
                <a href={sw.official_site} target="_blank" rel="noopener noreferrer nofollow">
                  {sw.official_site}
                </a>
              </p>
            )}
            {!sw.license_info && !sw.security_notes && (
              <p className="r5-accordion__note">
                {isId
                  ? 'Informasi lisensi dan keamanan akan ditambahkan oleh Admin.'
                  : 'License and security information will be added by the Admin.'}
              </p>
            )}
          </div>
        </AccordionSection>
      </div>
    </div>
  );
}
