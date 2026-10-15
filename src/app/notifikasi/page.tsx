'use client';

import { useCallback, useEffect, useState } from 'react';
import { readCookie } from '@/lib/cookies';

import { PublicShell } from '@/components/public-shell';
import { useLanguage } from '@/components/theme-provider';

type NotifItem = {
  id: string;
  type: string;
  summary: string;
  read: boolean;
  createdAt: string;
};

const COPY = {
  id: {
    title: 'Notifikasi',
    loginNeeded: 'Masuk untuk melihat notifikasi.',
    empty: 'Belum ada notifikasi.',
    markAll: 'Tandai semua dibaca',
    markOne: 'Tandai dibaca',
    loading: 'Memuat…',
    failed: 'Gagal memuat notifikasi. Coba lagi.',
    retry: 'Coba lagi',
  },
  en: {
    title: 'Notifications',
    loginNeeded: 'Sign in to view notifications.',
    empty: 'No notifications yet.',
    markAll: 'Mark all as read',
    markOne: 'Mark as read',
    loading: 'Loading…',
    failed: 'Failed to load notifications. Try again.',
    retry: 'Retry',
  },
} as const;


export default function NotifikasiPage() {
  const { language } = useLanguage();
  const copy = COPY[language];
  const [items, setItems] = useState<NotifItem[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'unauth' | 'error'>('loading');

  const load = useCallback(async () => {
    setState('loading');
    try {
      const res = await fetch('/api/v1/social/notifications?limit=30', {
        credentials: 'same-origin',
      });
      if (res.status === 401) {
        setState('unauth');
        return;
      }
      if (!res.ok) throw new Error('bad');
      const json = (await res.json()) as { data?: { items?: NotifItem[] } };
      setItems(json.data?.items ?? []);
      setState('ready');
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function markRead(ids?: string[]) {
    try {
      const res = await fetch('/api/v1/social/notifications/read', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': readCookie('madevi_csrf'),
        },
        body: JSON.stringify(ids ? { ids } : {}),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((n) => (ids && !ids.includes(n.id) ? n : { ...n, read: true })),
        );
      }
    } catch {
      /* abaikan: state lokal tidak diubah */
    }
  }

  return (
    <PublicShell>
      <div className="info-page">
        <div className="info-page__inner">
          <h1>{copy.title}</h1>
          {state === 'loading' && <p>{copy.loading}</p>}
          {state === 'unauth' && <p>{copy.loginNeeded}</p>}
          {state === 'error' && (
            <p>
              {copy.failed}{' '}
              <button type="button" className="art-ctl" onClick={() => void load()}>
                {copy.retry}
              </button>
            </p>
          )}
          {state === 'ready' && (
            <>
              {items.some((n) => !n.read) && (
                <p>
                  <button type="button" className="art-ctl" onClick={() => void markRead()}>
                    {copy.markAll}
                  </button>
                </p>
              )}
              {items.length === 0 ? (
                <p>{copy.empty}</p>
              ) : (
                <ul className="notif-list">
                  {items.map((n) => (
                    <li key={n.id} className={`notif-item${n.read ? '' : ' notif-item--unread'}`}>
                      <p className="notif-item__summary">{n.summary}</p>
                      <p className="notif-item__meta">
                        <time dateTime={n.createdAt}>
                          {new Date(n.createdAt).toLocaleString(
                            language === 'id' ? 'id-ID' : 'en-US',
                          )}
                        </time>
                        {!n.read && (
                          <button
                            type="button"
                            className="notif-item__mark"
                            onClick={() => void markRead([n.id])}
                          >
                            {copy.markOne}
                          </button>
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </PublicShell>
  );
}
