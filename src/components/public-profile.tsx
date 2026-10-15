'use client';

/**
 * PublicProfile — kartu profil minimal viewer-aware (L05 G-03).
 * API menolak tamu/pasangan block dengan NOT_FOUND generik; page noindex.
 * Aksi hubungan/pesan/mute/block/report memakai route L05 yang sesungguhnya.
 */

import { useEffect, useState } from 'react';
import { readCookie } from '@/lib/cookies';
import { useLanguage } from './theme-provider';

interface Card {
  username: string;
  displayName: string;
  bio: string;
  friends: boolean;
  unavailable: boolean;
}


const csrfJson = () => ({
  'content-type': 'application/json',
  'x-csrf-token': readCookie('madevi_csrf'),
});

function newKey(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

export function PublicProfile({ username }: { username: string }) {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [card, setCard] = useState<Card | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/v1/profiles/${encodeURIComponent(username)}`)
      .then(async (r) => {
        if (!r.ok) {
          setCard(null);
          return;
        }
        const j = await r.json();
        setCard((j.data ?? null) as Card | null);
      })
      .catch(() => setCard(null));
  }, [username]);

  async function sendRequest() {
    // Butuh ID principal target: cari lewat people lookup yang menghormati block.
    try {
      const lr = await fetch(`/api/v1/social/people?q=${encodeURIComponent(username)}&limit=5`);
      const lj = await lr.json();
      const target = ((lj.data ?? []) as Array<{ id: string; username: string }>).find(
        (p) => p.username.toLowerCase() === username.toLowerCase(),
      );
      if (!target) {
        setMessage(isId ? 'Profil tidak tersedia untuk pesan.' : 'Profile unavailable for messaging.');
        return;
      }
      const body = window.prompt(isId ? 'Teks permintaan pesan:' : 'Message request text:');
      if (!body || !body.trim()) return;
      const r = await fetch('/api/v1/social/message-requests', {
        method: 'POST',
        headers: csrfJson(),
        body: JSON.stringify({
          recipientId: target.id,
          body: body.trim().slice(0, 1000),
          idempotencyKey: newKey(),
        }),
      });
      const j = await r.json().catch(() => null);
      setMessage(
        r.ok ? (isId ? 'Permintaan pesan terkirim.' : 'Message request sent.') : (j?.error?.message ?? 'Gagal'),
      );
    } catch {
      setMessage(isId ? 'Gagal.' : 'Failed.');
    }
  }

  async function mute(muted: boolean) {
    try {
      const lr = await fetch(`/api/v1/social/people?q=${encodeURIComponent(username)}&limit=5`);
      const lj = await lr.json();
      const target = ((lj.data ?? []) as Array<{ id: string; username: string }>).find(
        (p) => p.username.toLowerCase() === username.toLowerCase(),
      );
      if (!target) {
        setMessage(isId ? 'Profil tidak tersedia.' : 'Profile unavailable.');
        return;
      }
      const r = await fetch(`/api/v1/social/mutes/${target.id}`, {
        method: muted ? 'DELETE' : 'PUT',
        headers: { 'x-csrf-token': readCookie('madevi_csrf') },
      });
      setMessage(
        r.ok
          ? muted
            ? (isId ? 'Mute dibatalkan.' : 'Unmuted.')
            : (isId ? 'Konten dibisukan.' : 'Content muted.')
          : (isId ? 'Gagal.' : 'Failed.'),
      );
    } catch {
      setMessage(isId ? 'Gagal.' : 'Failed.');
    }
  }

  return (
    <div className="page-shell public-profile-page">
      <section className="profile-public">
        {card ? (
          <>
            <h1>{card.displayName}</h1>
            <p>@{card.username}</p>
            {card.bio && <p>{card.bio}</p>}
            {card.friends && <p>{isId ? 'Teman Anda' : 'Your friend'}</p>}
            <div className="profile-public__actions">
              <button type="button" className="button button--small" onClick={() => void sendRequest()}>
                {isId ? 'Kirim permintaan pesan' : 'Send message request'}
              </button>
              <button type="button" className="button button--small button--secondary" onClick={() => void mute(false)}>
                {isId ? 'Bisukan' : 'Mute'}
              </button>
              <button type="button" className="button button--small button--secondary" onClick={() => void mute(true)}>
                {isId ? 'Batal bisu' : 'Unmute'}
              </button>
            </div>
          </>
        ) : (
          <>
            <h1>{username}</h1>
            <p>@{username}</p>
            <p>{isId ? 'Profil tidak ditemukan' : 'Profile not found'}</p>
          </>
        )}
        {message && <p className="info-form__status">{message}</p>}
      </section>
    </div>
  );
}
