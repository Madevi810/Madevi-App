'use client';

/**
 * CalmPostCard — Zona Tenang (INOVASI-0841 IDE 1).
 *
 * Varian kartu postingan anti-engagement: hanya judul/isi, penulis, dan waktu.
 * SEMUA elemen angka & aksi sosial disembunyikan (like, komentar, share, badge,
 * counter). Fungsi perlindungan TETAP ADA sebagai teks kecil netral.
 *
 * Desain: blok teks bersih dengan spasi lega; ketenangan datang dari ketiadaan
 * elemen, bukan tema baru. Tanpa popup, tanpa animasi menyela.
 */

import { useState } from 'react';
import { REPORT_CATEGORIES } from '@/server/moderation/blocked-words';
import { calmSupportLabel } from '@/services/calm-mode';

export interface CalmPost {
  id: string;
  body: string;
  authorName: string;
  authorUsername: string;
  createdAt: string;
  postType: 'KARYA' | 'CURHAT';
  reactionCount: number;
}

export interface CalmPostCardProps {
  post: CalmPost;
  isId: boolean;
  /** True bila pengirim semangat sudah tercatat (tampil sebagai teks netral). */
  supportSent?: boolean;
  /** Kirim semangat (versi tenang: tanpa counter, teks netral). */
  onSendSupport?: (postId: string) => void | Promise<void>;
  /** Laporkan — reuse pipeline moderasi INSTRUKSI-03. */
  onReport?: (postId: string, category: string, reason: string) => void | Promise<void>;
}

function calmInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function calmFormatDate(iso: string, isId: boolean): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(isId ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function CalmPostCard({
  post,
  isId,
  supportSent,
  onSendSupport,
  onReport,
}: CalmPostCardProps) {
  const [reportOpen, setReportOpen] = useState(false);
  const [reportCategory, setReportCategory] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [sending, setSending] = useState(false);

  async function handleReport() {
    if (!reportCategory || reportReason.trim().length < 10 || !onReport) return;
    setSending(true);
    try {
      await onReport(post.id, reportCategory, reportReason.trim());
      setReportOpen(false);
      setReportCategory('');
      setReportReason('');
    } finally {
      setSending(false);
    }
  }

  return (
    <article className="line-post line-post--calm">
      <div className="line-post__head">
        <span className="line-avatar" aria-hidden="true">
          {calmInitials(post.authorName)}
        </span>
        <div className="line-post__meta">
          <span className="line-post__author">{post.authorName}</span>
          <span className="line-post__time">
            @{post.authorUsername} · {calmFormatDate(post.createdAt, isId)}
          </span>
        </div>
      </div>

      <p className="line-post__body">{post.body}</p>

      {/* Dukungan: teks netral tanpa angka (bila sudah ada yang mengirim). */}
      {post.reactionCount > 0 && (
        <p className="line-calm__support" role="status">
          {calmSupportLabel(isId)}
        </p>
      )}

      {/* Aksi: teks kecil netral, fungsi perlindungan tidak hilang. */}
      <div className="line-calm__actions" role="group" aria-label={isId ? 'Aksi postingan' : 'Post actions'}>
        {onSendSupport && (
          <button
            type="button"
            className="line-calm__action"
            onClick={() => void onSendSupport(post.id)}
            aria-pressed={supportSent === true}
          >
            {supportSent
              ? isId
                ? 'Semangat telah dikirim'
                : 'Support sent'
              : isId
                ? 'Kirim semangat'
                : 'Send support'}
          </button>
        )}
        <button
          type="button"
          className="line-calm__action"
          onClick={() => setReportOpen((prev) => !prev)}
          aria-expanded={reportOpen}
        >
          {isId ? 'Laporkan' : 'Report'}
        </button>
      </div>

      {reportOpen && (
        <div className="line-calm__report">
          <label className="line-report__field">
            <span>{isId ? 'Kategori' : 'Category'}</span>
            <select
              value={reportCategory}
              onChange={(e) => setReportCategory(e.target.value)}
              aria-label={isId ? 'Kategori laporan' : 'Report category'}
            >
              <option value="">{isId ? 'Pilih kategori…' : 'Choose a category…'}</option>
              {REPORT_CATEGORIES.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {isId ? cat.labelId : cat.labelEn}
                </option>
              ))}
            </select>
          </label>
          <textarea
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            rows={2}
            maxLength={2000}
            placeholder={isId ? 'Alasan (min 10 karakter)…' : 'Reason (min 10 chars)…'}
            aria-label={isId ? 'Alasan laporan' : 'Report reason'}
          />
          <div>
            <button
              type="button"
              className="button button--small"
              onClick={() => void handleReport()}
              disabled={
                sending || !reportCategory || reportReason.trim().length < 10
              }
            >
              {isId ? 'Kirim laporan' : 'Send report'}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
