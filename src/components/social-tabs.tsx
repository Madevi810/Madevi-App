'use client';

/**
 * Tab Madevi Line berbasis source of truth server (L05 G-06/G-10).
 * Empty state hanya dari respons API yang berhasil + CTA aman.
 *
 * REDESIGN 13 Okt 2026: hanya visual. Logika & API tidak diubah.
 */

import { useCallback, useEffect, useState } from 'react';
import { readCookie } from '@/lib/cookies';
import { useLanguage } from './theme-provider';


const csrf = () => ({ 'x-csrf-token': readCookie('madevi_csrf') });

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PostIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function TabSkeleton() {
  return (
    <div className="line-shell" aria-hidden="true">
      {[0, 1].map((i) => (
        <div key={i} className="line-skeleton">
          <span className="line-skeleton__line" style={{ width: '60%' }} />
          <span className="line-skeleton__line" style={{ width: '85%' }} />
        </div>
      ))}
    </div>
  );
}

interface Friend {
  id: string;
  displayName: string;
  username: string;
  friendsSince: string;
}

export function FriendsTab() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/v1/social/friends');
      const j = await r.json();
      if (!r.ok) throw new Error(j.error?.message ?? 'Gagal memuat teman.');
      setFriends(j.data ?? []);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Gagal memuat teman.');
      setFriends([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(id: string, name: string) {
    const ok = window.confirm(
      isId ? `Hapus pertemanan dengan ${name}?` : `Remove friendship with ${name}?`,
    );
    if (!ok) return;
    const r = await fetch('/api/v1/social/friends', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json', ...csrf() },
      body: JSON.stringify({ friendId: id }),
    });
    if (r.ok) setFriends((list) => (list ?? []).filter((f) => f.id !== id));
    else {
      const j = await r.json().catch(() => null);
      setMessage(j?.error?.message ?? 'Gagal');
    }
  }

  if (friends === null) return <TabSkeleton />;

  return (
    <div className="line-shell">
      {message && <p className="line-status line-status--error" role="alert">{message}</p>}
      {friends.length === 0 ? (
        <div className="line-empty">
          <span className="line-empty__art" aria-hidden="true"><UsersIcon /></span>
          <p className="line-empty__title">{isId ? 'Belum ada teman' : 'No friends yet'}</p>
          <p className="line-empty__hint">
            {isId
              ? 'Terima permintaan pesan dengan opsi Teman, atau kirim permintaan pesan baru dari profil seseorang.'
              : 'Accept a message request as friend, or send a new message request from someone’s profile.'}
          </p>
        </div>
      ) : (
        <ul className="line-list">
          {friends.map((f) => (
            <li key={f.id} className="line-row">
              <span className="line-avatar" aria-hidden="true">{initials(f.displayName)}</span>
              <div className="line-row__main">
                <span className="line-row__title">{f.displayName}</span>
                <span className="line-row__sub">
                  @{f.username}
                  {f.friendsSince
                    ? ` · ${isId ? 'berteman sejak' : 'friends since'} ${new Date(f.friendsSince).toLocaleDateString()}`
                    : ''}
                </span>
              </div>
              <div className="line-row__actions">
                <a className="button button--small button--secondary" href={`/profil/${f.username}`}>
                  {isId ? 'Profil' : 'Profile'}
                </a>
                <button
                  type="button"
                  className="button button--small button--secondary"
                  onClick={() => void remove(f.id, f.displayName)}
                >
                  {isId ? 'Hapus' : 'Remove'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface MyPost {
  id: string;
  body: string;
  createdAt: string;
  status: string;
  commentCount: number;
  reactionCount: number;
}

export function MyPostsTab() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [posts, setPosts] = useState<MyPost[] | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const load = useCallback(async (cursor?: string) => {
    try {
      const url = `/api/v1/social/me/posts?limit=20${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`;
      const r = await fetch(url);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error?.message ?? 'Gagal memuat postingan.');
      setPosts((prev) => (cursor ? [...(prev ?? []), ...(j.data ?? [])] : (j.data ?? [])));
      setNextCursor(j.page?.nextCursor ?? null);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Gagal memuat postingan.');
      if (!cursor) setPosts([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function cancel(id: string) {
    const ok = window.confirm(isId ? 'Batalkan/hapus posting ini?' : 'Cancel/delete this post?');
    if (!ok) return;
    const r = await fetch(`/api/v1/social/posts/${id}`, {
      method: 'DELETE',
      headers: { ...csrf() },
    });
    if (r.ok) setPosts((list) => (list ?? []).filter((p) => p.id !== id));
    else {
      const j = await r.json().catch(() => null);
      setMessage(j?.error?.message ?? 'Gagal');
    }
  }

  if (posts === null) return <TabSkeleton />;

  return (
    <div className="line-shell">
      {message && <p className="line-status line-status--error" role="alert">{message}</p>}
      {posts.length === 0 ? (
        <div className="line-empty">
          <span className="line-empty__art" aria-hidden="true"><PostIcon /></span>
          <p className="line-empty__title">{isId ? 'Belum ada postingan' : 'No posts yet'}</p>
          <p className="line-empty__hint">
            {isId ? 'Tulis postingan pertama dari tab Feed.' : 'Write your first post from the Feed tab.'}
          </p>
        </div>
      ) : (
        <>
          {posts.map((p) => (
            <article key={p.id} className="line-post">
              <p className="line-post__body">{p.body}</p>
              <div className="line-post__head">
                <span className="line-post__time">
                  {new Date(p.createdAt).toLocaleDateString()} · {p.commentCount}{' '}
                  {isId ? 'komentar' : 'comments'} · {p.reactionCount} {isId ? 'reaksi' : 'reactions'}
                </span>
                <span className={`line-badge ${p.status === 'PUBLISHED' ? 'line-badge--safe' : 'line-badge--muted'}`}>
                  {p.status}
                </span>
              </div>
              {p.status !== 'PUBLISHED' && (
                <div className="line-report">
                  <p className="line-post__time" style={{ margin: 0 }}>
                    {isId
                      ? 'Menunggu aman (moderasi/scan). Batalkan bila tidak jadi tayang.'
                      : 'Pending safety (moderation/scan). Cancel if you no longer want it published.'}
                  </p>
                  <div>
                    <button
                      type="button"
                      className="button button--small button--secondary"
                      onClick={() => void cancel(p.id)}
                    >
                      {isId ? 'Batalkan' : 'Cancel'}
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
          {nextCursor && (
            <button type="button" className="button button--secondary line-center" onClick={() => void load(nextCursor)}>
              {isId ? 'Muat lagi' : 'Load more'}
            </button>
          )}
        </>
      )}
    </div>
  );
}

interface NotificationItem {
  id: string;
  type: string;
  summary: string;
  read: boolean;
  createdAt: string;
}

export function NotificationsTab() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [items, setItems] = useState<NotificationItem[] | null>(null);
  const [unread, setUnread] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const load = useCallback(async (cursor?: string) => {
    const url = `/api/v1/social/notifications?limit=20${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`;
    const r = await fetch(url);
    const j = await r.json();
    if (!r.ok) {
      if (!cursor) setItems([]);
      return;
    }
    setItems((prev) => (cursor ? [...(prev ?? []), ...((j.data?.items ?? []) as NotificationItem[])] : ((j.data?.items ?? []) as NotificationItem[])));
    setUnread(Number(j.data?.unread ?? 0));
    setNextCursor(j.page?.nextCursor ?? null);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function markAll() {
    const r = await fetch('/api/v1/social/notifications/read', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...csrf() },
      body: JSON.stringify({}),
    });
    if (r.ok) {
      setItems((list) => (list ?? []).map((n) => ({ ...n, read: true })));
      setUnread(0);
    }
  }

  if (items === null) return <TabSkeleton />;

  return (
    <div className="line-shell">
      {unread > 0 && (
        <div>
          <button type="button" className="button button--small button--secondary" onClick={() => void markAll()}>
            {isId ? `Tandai ${unread} dibaca` : `Mark ${unread} read`}
          </button>
        </div>
      )}
      {items.length === 0 ? (
        <div className="line-empty">
          <span className="line-empty__art" aria-hidden="true"><BellIcon /></span>
          <p className="line-empty__title">{isId ? 'Belum ada notifikasi' : 'No notifications'}</p>
          <p className="line-empty__hint">
            {isId
              ? 'Aktivitas yang menyebut Anda akan muncul di sini.'
              : 'Activity mentioning you will appear here.'}
          </p>
        </div>
      ) : (
        <>
          <ul className="line-list">
            {items.map((n) => (
              <li key={n.id} className={`line-row${n.read ? '' : ' line-row--unread'}`}>
                <div className="line-row__main">
                  <span className="line-row__title">{n.type}</span>
                  <span className="line-row__sub">{n.summary}</span>
                </div>
                <span className="line-post__time">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
          {nextCursor && (
            <button type="button" className="button button--secondary line-center" onClick={() => void load(nextCursor)}>
              {isId ? 'Muat lagi' : 'Load more'}
            </button>
          )}
        </>
      )}
    </div>
  );
}
