'use client';

/**
 * SocialFeed — feed kronologis Madevi Line (L05).
 * Konsumsi DTO kanonis camelCase + cursor; hapus hanya milik sendiri;
 * save PUT/DELETE; report enum POST; block/mute per author; rollback optimistik.
 *
 * REDESIGN 13 Okt 2026: hanya visual. Logika & API tidak diubah.
 */

import { useRouter } from 'next/navigation';
import { readCookie } from '@/lib/cookies';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from './theme-provider';
import { CrisisHelpCard } from './crisis-help-card';
import { CalmPostCard } from './calm-post-card';
import { useCalmMode } from './use-calm-mode';
import { REPORT_CATEGORIES } from '@/server/moderation/blocked-words';

/* ---------- Ikon inline (tanpa emoji) ---------- */
function PaletteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="13.5" cy="6.5" r=".8" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".8" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".8" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".8" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.84-.44-1.13-.26-.29-.43-.68-.43-1.12A1.68 1.68 0 0 1 14.46 16.3h2.2A5.34 5.34 0 0 0 22 11c0-4.97-4.5-9-10-9z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function LikeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function MuteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function BlockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.9" y1="4.9" x2="19.1" y2="19.1" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(iso: string, isId: boolean): string {
  try {
    const d = new Date(iso);
    const now = Date.now();
    const diff = now - d.getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return isId ? 'baru saja' : 'just now';
    if (min < 60) return isId ? `${min} mnt lalu` : `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return isId ? `${hr} jam lalu` : `${hr}h ago`;
    const day = Math.floor(hr / 24);
    if (day < 7) return isId ? `${day} hari lalu` : `${day}d ago`;
    return d.toLocaleDateString(isId ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

interface Post {
  id: string;
  body: string;
  linkUrl: string | null;
  groupId: string | null;
  authorId: string;
  authorName: string;
  authorUsername: string;
  createdAt: string;
  status: string;
  postType: 'KARYA' | 'CURHAT';
  attachmentCount: number;
  commentCount: number;
  reactionCount: number;
  myReaction: string | null;
  isSaved: boolean;
  mine: boolean;
}

interface CommentRow {
  id: string;
  body: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  createdAt: string;
  mine: boolean;
}


function memberHeaders(): Record<string, string> {
  return { 'content-type': 'application/json', 'x-csrf-token': readCookie('madevi_csrf') };
}

function newKey(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

export function SocialFeed() {
  const router = useRouter();
  const { language } = useLanguage();
  const isId = language === 'id';
  const calmMode = useCalmMode();
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState('');
  const [body, setBody] = useState('');
  const [postType, setPostType] = useState<'KARYA' | 'CURHAT'>('KARYA');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, CommentRow[]>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [reportFor, setReportFor] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportKey, setReportKey] = useState('');
  const [reportCategory, setReportCategory] = useState<string>('');
  const [quota, setQuota] = useState<{
    limitBytes: number;
    usedBytes: number;
    reservedBytes: number;
    availableBytes: number;
    warning: boolean;
    full: boolean;
  } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(
    async (cursor?: string) => {
      if (!navigator.onLine) {
        setOffline(true);
        setLoading(false);
        setLoadingMore(false);
        return;
      }
      setOffline(false);
      if (cursor) setLoadingMore(true);
      else setLoading(true);
      setError('');
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const url = `/api/v1/social/posts?limit=20${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`;
        const r = await fetch(url, { signal: controller.signal });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error?.message ?? 'Gagal memuat feed.');
        const items = (j.data ?? []) as Post[];
        const next = (j.page?.nextCursor ?? null) as string | null;
        setPosts((prev) => (cursor ? [...prev, ...items] : items));
        setNextCursor(next);
      } catch (e) {
        if ((e as Error).name === 'AbortError') return;
        setError(e instanceof Error ? e.message : 'Gagal memuat feed.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
      try {
        const quotaResponse = await fetch('/api/v1/social/quota');
        const quotaJson = await quotaResponse.json();
        if (quotaResponse.ok) setQuota(quotaJson.data ?? null);
      } catch {
        /* quota opsional */
      }
    },
    [],
  );

  useEffect(() => {
    void load();
    return () => abortRef.current?.abort();
  }, [load]);

  function needLogin(status: number): boolean {
    if (status === 401) {
      router.push('/auth');
      return true;
    }
    return false;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if ((!body.trim() && !file) || sending) return;
    setSending(true);
    setMessage('');
    let attachmentId: string | undefined;
    if (file) {
      setUploading(true);
      const form = new FormData();
      form.append('file', file);
      const upload = await fetch('/api/v1/social/uploads', {
        method: 'POST',
        headers: { 'x-csrf-token': readCookie('madevi_csrf'), 'idempotency-key': newKey() },
        body: form,
      });
      const uploaded = await upload.json();
      setUploading(false);
      if (!upload.ok || !uploaded.data?.id) {
        setMessage(uploaded.error?.message ?? 'Upload media gagal.');
        setSending(false);
        return;
      }
      attachmentId = uploaded.data.id;
    }
    const r = await fetch('/api/v1/social/posts', {
      method: 'POST',
      headers: memberHeaders(),
      body: JSON.stringify({
        body: body.trim(),
        postType,
        attachmentIds: attachmentId ? [attachmentId] : undefined,
      }),
    });
    if (needLogin(r.status)) return;
    const j = await r.json();
    if (j.data) {
      setBody('');
      setFile(null);
      void load();
      setMessage(
        isId
          ? 'Posting terkirim. Post dengan lampiran menunggu aman (karantina) sebelum tampil di feed.'
          : 'Posted. Posts with attachments stay pending (quarantined) until safe.',
      );
    } else setMessage(j.error?.message ?? 'Gagal');
    setSending(false);
  }

  async function react(postId: string, type: string) {
    const prev = posts;
    const target = prev.find((p) => p.id === postId);
    if (!target) return;
    const nextReaction = target.myReaction === type ? null : type;
    const delta = (target.myReaction ? -1 : 0) + (nextReaction ? 1 : 0);
    setPosts((list) =>
      list.map((p) =>
        p.id === postId
          ? { ...p, myReaction: nextReaction, reactionCount: p.reactionCount + delta }
          : p,
      ),
    );
    const r = await fetch(`/api/v1/social/posts/${postId}/reaction`, {
      method: nextReaction === null ? 'DELETE' : 'PUT',
      headers: memberHeaders(),
      body: nextReaction === null ? undefined : JSON.stringify({ reaction: nextReaction }),
    });
    if (needLogin(r.status)) {
      setPosts(prev);
      return;
    }
    if (!r.ok) setPosts(prev);
  }

  async function toggleSave(postId: string) {
    const prev = posts;
    const target = prev.find((p) => p.id === postId);
    if (!target) return;
    const next = !target.isSaved;
    setPosts((list) => list.map((p) => (p.id === postId ? { ...p, isSaved: next } : p)));
    const r = await fetch(`/api/v1/social/posts/${postId}/save`, {
      method: next ? 'PUT' : 'DELETE',
      headers: { 'x-csrf-token': readCookie('madevi_csrf') },
    });
    if (needLogin(r.status)) {
      setPosts(prev);
      return;
    }
    if (!r.ok) setPosts(prev);
  }

  async function toggleComments(postId: string) {
    if (openComments === postId) {
      setOpenComments(null);
      return;
    }
    setOpenComments(postId);
    try {
      const r = await fetch(`/api/v1/social/posts/${postId}/comments?limit=50`);
      const j = await r.json();
      setComments((prev) => ({ ...prev, [postId]: (j.data ?? []) as CommentRow[] }));
    } catch {
      /* abaikan; tampilkan daftar kosong */
    }
  }

  async function sendComment(postId: string) {
    const text = (commentDrafts[postId] ?? '').trim();
    if (!text) return;
    const r = await fetch(`/api/v1/social/posts/${postId}/comments`, {
      method: 'POST',
      headers: memberHeaders(),
      body: JSON.stringify({ body: text }),
    });
    if (needLogin(r.status)) return;
    const j = await r.json();
    if (j.data || r.status === 202) {
      setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
      const cr = await fetch(`/api/v1/social/posts/${postId}/comments?limit=50`);
      const cj = await cr.json();
      setComments((prev) => ({ ...prev, [postId]: (cj.data ?? []) as CommentRow[] }));
      void load();
    } else {
      setMessage(j.error?.message ?? 'Gagal');
    }
  }

  async function removePost(postId: string) {
    const ok = window.confirm(isId ? 'Hapus posting milik sendiri?' : 'Delete your own post?');
    if (!ok) return;
    const r = await fetch(`/api/v1/social/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'x-csrf-token': readCookie('madevi_csrf') },
    });
    if (needLogin(r.status)) return;
    if (r.ok) setPosts((list) => list.filter((p) => p.id !== postId));
    else {
      const j = await r.json().catch(() => null);
      setMessage(j?.error?.message ?? 'Gagal');
    }
  }

  async function sendReport(
    postId: string,
    overrideCategory?: string,
    overrideReason?: string,
  ) {
    const category = overrideCategory ?? reportCategory;
    const reason = overrideReason ?? reportReason;
    if (!category) {
      setMessage(isId ? 'Pilih kategori laporan dulu.' : 'Choose a report category first.');
      return;
    }
    if (reason.trim().length < 10) {
      setMessage(
        isId ? 'Alasan lapor minimal 10 karakter.' : 'Report reason needs at least 10 characters.',
      );
      return;
    }
    const key = reportKey || newKey();
    if (!reportKey) setReportKey(key);
    const r = await fetch('/api/v1/social/reports', {
      method: 'POST',
      headers: memberHeaders(),
      body: JSON.stringify({
        objectType: 'POST',
        objectId: postId,
        reason: reason.trim(),
        category,
        idempotencyKey: key,
      }),
    });
    if (needLogin(r.status)) return;
    const j = await r.json();
    if (j.data || r.status === 202) {
      setReportFor(null);
      setReportReason('');
      setReportKey('');
      setReportCategory('');
      setMessage(isId ? 'Laporan terkirim ke moderasi.' : 'Report sent to moderation.');
    } else {
      setMessage(j.error?.message ?? 'Gagal');
    }
  }

  async function blockAuthor(authorId: string, authorName: string) {
    const ok = window.confirm(
      isId
        ? `Blokir ${authorName}? Feed, pesan, dan grup mereka tidak akan terlihat.`
        : `Block ${authorName}? Their feed, messages, and groups will be hidden.`,
    );
    if (!ok) return;
    const r = await fetch(`/api/v1/social/blocks/${authorId}`, {
      method: 'PUT',
      headers: { 'x-csrf-token': readCookie('madevi_csrf') },
    });
    const j = await r.json().catch(() => null);
    if (r.ok) {
      setPosts((list) => list.filter((p) => p.authorId !== authorId));
      setMessage(isId ? 'Pengguna diblokir dua arah.' : 'User blocked both ways.');
    } else setMessage(j?.error?.message ?? 'Gagal');
  }

  async function muteAuthor(authorId: string) {
    const r = await fetch(`/api/v1/social/mutes/${authorId}`, {
      method: 'PUT',
      headers: { 'x-csrf-token': readCookie('madevi_csrf') },
    });
    const j = await r.json().catch(() => null);
    if (r.ok) {
      setPosts((list) => list.filter((p) => p.authorId !== authorId));
      setMessage(isId ? 'Konten disembunyikan (mute).' : 'Content hidden (muted).');
    } else setMessage(j?.error?.message ?? 'Gagal');
  }

  return (
    <div className="line-shell">
      {/* Composer */}
      <form className="line-composer" onSubmit={submit} aria-label={isId ? 'Buat postingan' : 'Create post'}>
        <div className="line-composer__types" role="radiogroup" aria-label={isId ? 'Jenis postingan' : 'Post type'}>
          <label className="line-composer__type">
            <input
              type="radio"
              name="postType"
              checked={postType === 'KARYA'}
              onChange={() => setPostType('KARYA')}
            />
            <PaletteIcon />
            <span className="line-composer__type-text">
              <strong>{isId ? 'Sosial Karya' : 'Karya'}</strong>
              <small>{isId ? 'ide, karya, inovasi' : 'ideas, works'}</small>
            </span>
          </label>
          <label className="line-composer__type">
            <input
              type="radio"
              name="postType"
              checked={postType === 'CURHAT'}
              onChange={() => setPostType('CURHAT')}
            />
            <HeartIcon />
            <span className="line-composer__type-text">
              <strong>{isId ? 'Sosial Curhat' : 'Curhat'}</strong>
              <small>{isId ? 'isi hati, masalah' : 'feelings, problems'}</small>
            </span>
          </label>
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={5000}
          placeholder={
            postType === 'KARYA'
              ? isId ? 'Bagikan ide atau karya Anda…' : 'Share your idea or work…'
              : isId ? 'Ceritakan apa yang Anda rasakan…' : 'Share what you feel…'
          }
          rows={3}
          aria-label={isId ? 'Isi postingan' : 'Post content'}
        />
        <div className="line-composer__foot">
          <label className="line-composer__attach">
            <input
              type="file"
              accept="image/*,video/*,.pdf,.txt,.doc,.docx,.odt"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              aria-label={isId ? 'Lampiran media' : 'Media attachment'}
            />
            <ImageIcon />
            <span>{file ? file.name : isId ? 'Lampirkan' : 'Attach'}</span>
          </label>
          {quota && (
            <p className="line-composer__quota">
              {Math.round(quota.usedBytes / 1048576)} / {Math.round(quota.limitBytes / 1048576)} MB
              {quota.warning && !quota.full ? (isId ? ' · hampir penuh' : ' · almost full') : ''}
              {quota.full ? (isId ? ' · penuh' : ' · full') : ''}
            </p>
          )}
          <button
            type="submit"
            className="button line-composer__submit"
            disabled={sending || uploading || Boolean(quota?.full && file)}
          >
            {sending || uploading ? '…' : isId ? 'Kirim' : 'Post'}
          </button>
        </div>
      </form>

      {message && <p className="line-status" role="status">{message}</p>}
      {offline && (
        <p className="line-status line-status--error" role="alert">
          {isId ? 'Offline — periksa koneksi lalu muat ulang.' : 'Offline — check connection, then retry.'}
        </p>
      )}
      {error && (
        <p className="line-status line-status--error" role="alert">
          {error}{' '}
          <button type="button" className="button button--small" onClick={() => void load()}>
            {isId ? 'Coba lagi' : 'Retry'}
          </button>
        </p>
      )}

      {/* Feed */}
      <div aria-live="polite">
        {loading ? (
          <>
            {[0, 1, 2].map((i) => (
              <div key={i} className="line-skeleton" aria-hidden="true">
                <div className="line-skeleton__line--head">
                  <span className="line-skeleton__avatar" />
                  <span className="line-skeleton__line" style={{ width: '40%' }} />
                </div>
                <span className="line-skeleton__line" style={{ width: '95%' }} />
                <span className="line-skeleton__line" style={{ width: '70%' }} />
              </div>
            ))}
          </>
        ) : (
          posts.map((p) =>
            calmMode?.calmMode === true ? (
              <CalmPostCard
                key={p.id}
                post={{
                  id: p.id,
                  body: p.body,
                  authorName: p.authorName,
                  authorUsername: p.authorUsername,
                  createdAt: p.createdAt,
                  postType: p.postType,
                  reactionCount: p.reactionCount,
                }}
                isId={isId}
                supportSent={p.myReaction === 'LIKE'}
                onSendSupport={(postId) => void react(postId, 'LIKE')}
                onReport={(postId, category, reason) =>
                  void sendReport(postId, category, reason)
                }
              />
            ) : (
              <article key={p.id} className="line-post">
              <div className="line-post__head">
                <span className="line-avatar" aria-hidden="true">{initials(p.authorName)}</span>
                <div className="line-post__meta">
                  <span className="line-post__author">{p.authorName}</span>
                  <span className="line-post__time">
                    @{p.authorUsername} · {formatDate(p.createdAt, isId)}
                    {p.attachmentCount > 0 && ` · ${p.attachmentCount} ${isId ? 'lampiran' : 'attachments'}`}
                  </span>
                </div>
                <span className={`line-badge line-badge--${p.postType.toLowerCase()}`}>
                  {p.postType === 'KARYA' ? <PaletteIcon /> : <HeartIcon />}
                  {p.postType === 'KARYA' ? (isId ? 'Karya' : 'Karya') : isId ? 'Curhat' : 'Curhat'}
                </span>
              </div>

              <p className="line-post__body">{p.body}</p>

              {p.postType === 'CURHAT' && <CrisisHelpCard body={p.body} isId={isId} />}

              <div className="line-actions" role="group" aria-label={isId ? 'Aksi postingan' : 'Post actions'}>
                <button
                  type="button"
                  className={`line-action${p.myReaction === 'LIKE' ? ' line-action--active' : ''}`}
                  onClick={() => void react(p.id, 'LIKE')}
                  aria-pressed={p.myReaction === 'LIKE'}
                  aria-label={`${isId ? 'Suka' : 'Like'} (${p.reactionCount})`}
                >
                  <LikeIcon />
                  <span className="line-action__count">{p.reactionCount}</span>
                </button>
                <button
                  type="button"
                  className="line-action"
                  onClick={() => void toggleComments(p.id)}
                  aria-expanded={openComments === p.id}
                  aria-label={`${isId ? 'Komentar' : 'Comments'} (${p.commentCount})`}
                >
                  <CommentIcon />
                  <span className="line-action__count">{p.commentCount}</span>
                </button>
                <button
                  type="button"
                  className={`line-action${p.isSaved ? ' line-action--active' : ''}`}
                  onClick={() => void toggleSave(p.id)}
                  aria-pressed={p.isSaved}
                >
                  <SaveIcon />
                  <span>{p.isSaved ? (isId ? 'Tersimpan' : 'Saved') : isId ? 'Simpan' : 'Save'}</span>
                </button>
                <button
                  type="button"
                  className="line-action"
                  onClick={() => {
                    setReportFor(reportFor === p.id ? null : p.id);
                    setReportReason('');
                    setReportKey('');
                    setReportCategory('');
                  }}
                  aria-expanded={reportFor === p.id}
                >
                  <FlagIcon />
                  <span>{isId ? 'Lapor' : 'Report'}</span>
                </button>
                {p.mine ? (
                  <button
                    type="button"
                    className="line-action line-action--danger"
                    onClick={() => void removePost(p.id)}
                  >
                    <TrashIcon />
                    <span>{isId ? 'Hapus' : 'Delete'}</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="line-action"
                      onClick={() => void muteAuthor(p.authorId)}
                    >
                      <MuteIcon />
                      <span>{isId ? 'Bisukan' : 'Mute'}</span>
                    </button>
                    <button
                      type="button"
                      className="line-action line-action--danger"
                      onClick={() => void blockAuthor(p.authorId, p.authorName)}
                    >
                      <BlockIcon />
                      <span>{isId ? 'Blokir' : 'Block'}</span>
                    </button>
                  </>
                )}
              </div>

              {reportFor === p.id && (
                <div className="line-report">
                  <p className="line-report__title">
                    {isId ? 'Laporkan postingan ini' : 'Report this post'}
                  </p>
                  <label className="line-report__field">
                    <span>{isId ? 'Kategori' : 'Category'}</span>
                    <select
                      value={reportCategory}
                      onChange={(e) => setReportCategory(e.target.value)}
                      aria-label={isId ? 'Kategori laporan' : 'Report category'}
                    >
                      <option value="">
                        {isId ? 'Pilih kategori…' : 'Choose a category…'}
                      </option>
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
                      onClick={() => void sendReport(p.id)}
                    >
                      {isId ? 'Kirim laporan' : 'Send report'}
                    </button>
                  </div>
                </div>
              )}

              {openComments === p.id && (
                <div className="line-comments">
                  {(comments[p.id] ?? []).map((c) => (
                    <div key={c.id} className="line-comment">
                      <span className="line-avatar line-avatar--sm" aria-hidden="true">
                        {initials(c.authorName)}
                      </span>
                      <div className="line-comment__body">
                        <div className="line-comment__head">
                          <span className="line-comment__author">{c.authorName}</span>
                          <span className="line-comment__time">{formatDate(c.createdAt, isId)}</span>
                        </div>
                        <p className="line-comment__text">{c.body}</p>
                      </div>
                    </div>
                  ))}
                  <div className="line-comment__form">
                    <input
                      type="text"
                      value={commentDrafts[p.id] ?? ''}
                      onChange={(e) =>
                        setCommentDrafts((prev) => ({ ...prev, [p.id]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === 'Enter' && void sendComment(p.id)}
                      placeholder={isId ? 'Tulis komentar…' : 'Write a comment…'}
                      maxLength={5000}
                      aria-label={isId ? 'Tulis komentar' : 'Write a comment'}
                    />
                    <button
                      type="button"
                      className="button button--small"
                      onClick={() => void sendComment(p.id)}
                      aria-label={isId ? 'Kirim komentar' : 'Send comment'}
                    >
                      <SendIcon />
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))
        )}

        {!loading && !posts.length && !error && (
          <div className="line-empty">
            <span className="line-empty__art" aria-hidden="true">
              <CommentIcon />
            </span>
            <p className="line-empty__title">{isId ? 'Feed masih sepi' : 'Quiet feed'}</p>
            <p className="line-empty__hint">
              {isId
                ? 'Belum ada postingan. Bagikan ide, karya, atau cerita pertama Anda — komunitas menanti.'
                : 'No posts yet. Share your first idea, work, or story — the community awaits.'}
            </p>
          </div>
        )}

        {nextCursor && !loading && (
          <button
            type="button"
            className="button button--secondary line-center"
            disabled={loadingMore}
            onClick={() => void load(nextCursor)}
          >
            {loadingMore ? '…' : isId ? 'Muat lagi' : 'Load more'}
          </button>
        )}
      </div>
    </div>
  );
}
