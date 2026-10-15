'use client';

/**
 * CrisisHelpCard — kartu bantuan otomatis untuk Sosial Curhat (INSTRUKSI-03 #4).
 *
 * Perilaku:
 * - HANYA dirender jika `findCrisisIndicator(body)` cocok. Bila postingan
 *   curhat tidak mengandung indikasi krisis, kartu tidak muncul (tidak boleh
 *   menyela user dengan pesan krisis pada curhat biasa).
 * - Menampilkan hotline 119 ext 8 (Kemenkes) + pesan dukungan, dengan
 *   bahasa mengikuti `isId`.
 * - Post yang memicu kartu ini sudah dikarantina engine di sisi server
 *   (lihat `LocalModerationEngine` → status UNASSESSED/HIGH), jadi konten
 *   tidak tampil menonjol sebelum moderasi. Kartu ini adalah lapisan UI yang
 *   tidak bergantung pada status karantina: jika konten somehow terlihat,
 *   kartu pendamping tetap muncul.
 *
 * Bukan modal/popup: muncul inline di bawah postingan, hanya atas aksi tidak
 * langsung user (mereka yang memposting/membaca konten kurhat) — sesuai
 * prinsip UI "semua yang tampil harus atas aksi user".
 */

import { CRISIS_HELP, findCrisisIndicator } from '@/server/moderation/blocked-words';

function HeartHandIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20.5S3.8 15.4 3.8 9.9A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 8.2 2.6c0 5.5-8.2 10.6-8.2 10.6Z" />
      <path d="M12 7.3v13.2" strokeDasharray="2 2.6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 16.9v2.6a1.9 1.9 0 0 1-2 1.9 18 18 0 0 1-7.9-2.8 17.6 17.6 0 0 1-5.5-5.5A18 18 0 0 1 2.8 5.2 1.9 1.9 0 0 1 4.7 3.2h2.6a1.9 1.9 0 0 1 1.9 1.6c.1 1 .4 1.9.7 2.8a1.9 1.9 0 0 1-.4 2L8.1 11a15 15 0 0 0 4.9 4.9l1.4-1.4a1.9 1.9 0 0 1 2-.4c.9.3 1.8.6 2.8.7a1.9 1.9 0 0 1 1.6 1.7Z" />
    </svg>
  );
}

export function CrisisHelpCard({ body, isId }: { body: string; isId: boolean }) {
  const indicator = findCrisisIndicator(body);
  if (!indicator) return null;

  return (
    <aside className="line-crisis-card" role="note" aria-label={isId ? 'Bantuan krisis' : 'Crisis support'}>
      <div className="line-crisis-card__head">
        <span className="line-crisis-card__icon" aria-hidden="true">
          <HeartHandIcon />
        </span>
        <strong>{isId ? 'Kamu tidak sendirian' : 'You are not alone'}</strong>
      </div>
      <p className="line-crisis-card__message">
        {isId ? CRISIS_HELP.messageId : CRISIS_HELP.messageEn}
      </p>
      <p className="line-crisis-card__hotline">
        <PhoneIcon />
        <a href="tel:119">
          <strong>{CRISIS_HELP.hotlineId}</strong>
          <span>{isId ? CRISIS_HELP.hotlineLabel : 'Kemenkes mental health hotline (free, 24h)'}</span>
        </a>
      </p>
      <p className="line-crisis-card__note">
        {isId
          ? 'Konten ini sedang ditinjau oleh moderator sebelum tampil publik.'
          : 'This content is being reviewed by a moderator before it appears publicly.'}
      </p>
    </aside>
  );
}
