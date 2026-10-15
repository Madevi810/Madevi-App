'use client';

/**
 * MessagesPage — pesan Madevi Line (L05 G-07).
 * Compose request ke anggota baru (people lookup), terima/tolak, cursor pesan,
 * arsip/keluar per pengguna, hapus/lapor/blokir/bisukan, retry idempoten, offline.
 */

import { useRouter } from 'next/navigation';
import { readCookie } from '@/lib/cookies';
import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from './theme-provider';

interface MsgRequest {
  id: string;
  senderId: string;
  body: string;
  status: string;
  senderName: string;
  senderUsername: string;
  createdAt: string;
}
interface Conversation {
  id: string;
  otherId: string;
  otherName: string;
  otherUsername: string;
  lastMessage: string | null;
  updatedAt: string | null;
  archived: boolean;
}
interface Message {
  id: string;
  body: string;
  sentAt: string;
  senderId: string;
  mine: boolean;
  status: string;
}
interface Person {
  id: string;
  displayName: string;
  username: string;
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

export function MessagesPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const isId = language === 'id';
  const [requests, setRequests] = useState<MsgRequest[]>([]);
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [msgCursor, setMsgCursor] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [sendKey, setSendKey] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [offline, setOffline] = useState(false);
  // Compose request baru
  const [lookup, setLookup] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [reqBody, setReqBody] = useState('');
  const [reqTarget, setReqTarget] = useState<Person | null>(null);

  const loadAll = useCallback(async () => {
    if (!navigator.onLine) {
      setOffline(true);
      return;
    }
    setOffline(false);
    try {
      const [rr, cr] = await Promise.all([
        fetch('/api/v1/social/message-requests?limit=50'),
        fetch('/api/v1/social/conversations'),
      ]);
      if (rr.status === 401 || cr.status === 401) {
        router.push('/auth');
        return;
      }
      const rj = await rr.json();
      const cj = await cr.json();
      setRequests(((rj.data ?? []) as MsgRequest[]).filter((r) => r.status === 'PENDING'));
      setConvs((cj.data ?? []) as Conversation[]);
    } catch {
      setOffline(true);
    }
  }, [router]);

  const loadMsgs = useCallback(
    async (convId: string, cursor?: string) => {
      const url = `/api/v1/social/conversations/${convId}/messages?limit=50${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`;
      const r = await fetch(url);
      if (r.status === 401) {
        router.push('/auth');
        return;
      }
      const j = await r.json();
      const items = ((j.data ?? []) as Message[]).map((m) => ({
        ...m,
        sentAt: m.sentAt ?? '',
      }));
      if (cursor) setMsgs((prev) => [...items, ...prev]);
      else setMsgs(items);
      setMsgCursor((j.page?.nextCursor ?? null) as string | null);
    },
    [router],
  );

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  function openConv(id: string) {
    setActiveConv(id);
    setMsgCursor(null);
    setSendKey(newKey());
    loadMsgs(id);
  }

  async function decide(id: string, decision: 'ACCEPT' | 'REJECT', becomeFriends: boolean) {
    setMessage('');
    const r = await fetch(`/api/v1/social/message-requests/${id}`, {
      method: 'POST',
      headers: csrfJson(),
      body: JSON.stringify({ decision, becomeFriends }),
    });
    const j = await r.json();
    if (j.data) {
      setMessage(isId ? 'Permintaan diputuskan.' : 'Request decided.');
      loadAll();
      if (j.data.conversationId) openConv(j.data.conversationId as string);
    } else {
      setMessage(j.error?.message ?? 'Gagal');
    }
  }

  async function lookupPeople(q: string) {
    setLookup(q);
    if (q.trim().length < 2) {
      setPeople([]);
      return;
    }
    try {
      const r = await fetch(`/api/v1/social/people?q=${encodeURIComponent(q.trim())}&limit=8`);
      const j = await r.json();
      setPeople(r.ok ? ((j.data ?? []) as Person[]) : []);
    } catch {
      setPeople([]);
    }
  }

  async function sendRequest() {
    if (!reqTarget || reqBody.trim().length < 1) return;
    const r = await fetch('/api/v1/social/message-requests', {
      method: 'POST',
      headers: csrfJson(),
      body: JSON.stringify({
        recipientId: reqTarget.id,
        body: reqBody.trim(),
        idempotencyKey: newKey(),
      }),
    });
    const j = await r.json();
    if (j.data || r.status === 202) {
      setMessage(isId ? 'Permintaan pesan terkirim.' : 'Message request sent.');
      setReqTarget(null);
      setReqBody('');
      setLookup('');
      setPeople([]);
      loadAll();
    } else setMessage(j.error?.message ?? 'Gagal');
  }

  async function send() {
    if (!text.trim() || !activeConv || sending) return;
    // L05 G-07: key stabil per draft agar retry tidak menggandakan pesan.
    const key = sendKey || newKey();
    if (!sendKey) setSendKey(key);
    setSending(true);
    const r = await fetch(`/api/v1/social/conversations/${activeConv}/messages`, {
      method: 'POST',
      headers: csrfJson(),
      body: JSON.stringify({ body: text.trim(), idempotencyKey: key }),
    });
    const j = await r.json();
    if (j.data || r.status === 202) {
      setText('');
      setSendKey(newKey());
      loadMsgs(activeConv);
    } else setMessage(j.error?.message ?? 'Gagal');
    setSending(false);
  }

  async function archiveCurrent(archived: boolean) {
    if (!activeConv) return;
    const r = await fetch(`/api/v1/social/conversations/${activeConv}/preference`, {
      method: 'PUT',
      headers: csrfJson(),
      body: JSON.stringify({ archived }),
    });
    if (r.ok) {
      setMessage(isId ? (archived ? 'Percakapan diarsipkan.' : 'Arsip dibuka.') : archived ? 'Conversation archived.' : 'Conversation unarchived.');
      loadAll();
    }
  }

  async function leaveCurrent() {
    if (!activeConv) return;
    const ok = window.confirm(
      isId
        ? 'Keluar percakapan? Riwayat pihak lain tidak dihapus.'
        : 'Leave conversation? The other party’s history is kept.',
    );
    if (!ok) return;
    const r = await fetch(`/api/v1/social/conversations/${activeConv}/preference`, {
      method: 'PUT',
      headers: csrfJson(),
      body: JSON.stringify({ leave: true }),
    });
    if (r.ok) {
      setActiveConv(null);
      setMsgs([]);
      loadAll();
    }
  }

  async function deleteMessage(id: string) {
    const r = await fetch(`/api/v1/social/messages/${id}`, {
      method: 'DELETE',
      headers: { 'x-csrf-token': readCookie('madevi_csrf') },
    });
    if (r.ok && activeConv) loadMsgs(activeConv);
  }

  async function reportMessage(id: string) {
    const reason = window.prompt(isId ? 'Alasan laporan (min 10 karakter):' : 'Report reason (min 10 chars):');
    if (!reason || reason.trim().length < 10) return;
    const r = await fetch(`/api/v1/social/messages/${id}/report`, {
      method: 'POST',
      headers: csrfJson(),
      body: JSON.stringify({ reason: reason.trim(), idempotencyKey: newKey() }),
    });
    const j = await r.json().catch(() => null);
    setMessage(r.ok ? (isId ? 'Pesan dilaporkan.' : 'Message reported.') : (j?.error?.message ?? 'Gagal'));
  }

  async function blockOther(otherId: string, otherName: string) {
    const ok = window.confirm(isId ? `Blokir ${otherName} dua arah?` : `Block ${otherName} both ways?`);
    if (!ok) return;
    const r = await fetch(`/api/v1/social/blocks/${otherId}`, {
      method: 'PUT',
      headers: { 'x-csrf-token': readCookie('madevi_csrf') },
    });
    if (r.ok) {
      setActiveConv(null);
      setMsgs([]);
      loadAll();
    }
  }

  async function muteOther(otherId: string) {
    const r = await fetch(`/api/v1/social/mutes/${otherId}`, {
      method: 'PUT',
      headers: { 'x-csrf-token': readCookie('madevi_csrf') },
    });
    if (r.ok) setMessage(isId ? 'Notifikasi/konten dibisukan.' : 'Notifications/content muted.');
  }

  const active = convs.find((c) => c.id === activeConv) ?? null;
  const visibleConvs = convs.filter((c) => showArchived || !c.archived);

  return (
    <div className="page-shell messages-page">
      <h1>{isId ? 'Pesan' : 'Messages'}</h1>
      {message && <p className="info-form__status">{message}</p>}
      {offline && <p role="alert">{isId ? 'Offline — coba lagi saat online.' : 'Offline — retry when online.'}</p>}
      <section aria-labelledby="compose-title" className="messages-compose">
        <h2 id="compose-title">{isId ? 'Pesan baru' : 'New message'}</h2>
        {!reqTarget ? (
          <>
            <input
              type="text"
              value={lookup}
              onChange={(e) => void lookupPeople(e.target.value)}
              placeholder={isId ? 'Cari nama/username (min 2 huruf)…' : 'Search name/username (2+ chars)…'}
              maxLength={64}
              aria-label={isId ? 'Cari anggota' : 'Find member'}
            />
            <ul>
              {people.map((p) => (
                <li key={p.id}>
                  <button type="button" onClick={() => setReqTarget(p)}>
                    {p.displayName} (@{p.username})
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div>
            <p>
              {isId ? 'Kepada' : 'To'}: <strong>{reqTarget.displayName}</strong> (@{reqTarget.username}){' '}
              <button type="button" onClick={() => setReqTarget(null)}>
                {isId ? 'Ganti' : 'Change'}
              </button>
            </p>
            <input
              type="text"
              value={reqBody}
              onChange={(e) => setReqBody(e.target.value)}
              placeholder={isId ? 'Teks permintaan (tanpa tautan)…' : 'Request text (no links)…'}
              maxLength={1000}
            />
            <button type="button" className="button button--small" onClick={() => void sendRequest()}>
              {isId ? 'Kirim permintaan' : 'Send request'}
            </button>
          </div>
        )}
      </section>
      {requests.length > 0 && (
        <section aria-labelledby="req-title">
          <h2 id="req-title">
            {isId ? 'Permintaan pesan (teks/emoji)' : 'Message requests (text/emoji)'}
          </h2>
          <ul className="messages-requests">
            {requests.map((req) => (
              <li key={req.id} className="messages-request">
                <strong>{req.senderName}</strong> <span>(@{req.senderUsername})</span>
                <p>{req.body}</p>
                <div className="messages-request__actions">
                  <button
                    type="button"
                    className="button button--small"
                    onClick={() => void decide(req.id, 'ACCEPT', false)}
                  >
                    {isId ? 'Terima' : 'Accept'}
                  </button>
                  <button
                    type="button"
                    className="button button--small button--secondary"
                    onClick={() => void decide(req.id, 'ACCEPT', true)}
                  >
                    {isId ? 'Terima + Teman' : 'Accept + Friend'}
                  </button>
                  <button
                    type="button"
                    className="button button--small button--secondary"
                    onClick={() => void decide(req.id, 'REJECT', false)}
                  >
                    {isId ? 'Tolak' : 'Reject'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
      <label className="messages-archive-toggle">
        <input
          type="checkbox"
          checked={showArchived}
          onChange={(e) => setShowArchived(e.target.checked)}
        />
        {isId ? 'Tampilkan arsip' : 'Show archived'}
      </label>
      <div className="messages-layout">
        <aside className="messages-list" aria-label={isId ? 'Percakapan' : 'Conversations'}>
          {visibleConvs.map((c) => (
            <button
              key={c.id}
              type="button"
              className={c.id === activeConv ? 'active' : ''}
              onClick={() => openConv(c.id)}
            >
              <strong>
                {c.otherName}
                {c.archived ? (isId ? ' (arsip)' : ' (archived)') : ''}
              </strong>
              <p>{c.lastMessage?.substring(0, 60) ?? ''}</p>
            </button>
          ))}
          {!visibleConvs.length && (
            <div className="line-empty">
              <p className="line-empty__title">{isId ? 'Belum ada percakapan' : 'No conversations'}</p>
              <p className="line-empty__hint">
                {isId
                  ? 'Cari teman lewat kolom di atas, lalu kirim permintaan pesan untuk memulai.'
                  : 'Find a friend with the search above, then send a message request to start.'}
              </p>
            </div>
          )}
        </aside>
        <section className="messages-chat">
          {activeConv && active ? (
            <>
              <div className="messages-chat__actions">
                <button type="button" className="button button--small button--secondary" onClick={() => void archiveCurrent(!active.archived)}>
                  {active.archived ? (isId ? 'Buka arsip' : 'Unarchive') : isId ? 'Arsipkan' : 'Archive'}
                </button>
                <button type="button" className="button button--small button--secondary" onClick={() => void leaveCurrent()}>
                  {isId ? 'Keluar' : 'Leave'}
                </button>
                <button type="button" className="button button--small button--secondary" onClick={() => void muteOther(active.otherId)}>
                  {isId ? 'Bisukan' : 'Mute'}
                </button>
                <button type="button" className="button button--small button--secondary" onClick={() => void blockOther(active.otherId, active.otherName)}>
                  {isId ? 'Blokir' : 'Block'}
                </button>
              </div>
              {msgCursor && (
                <button type="button" className="button button--small button--secondary" onClick={() => void loadMsgs(activeConv, msgCursor)}>
                  {isId ? 'Pesan lama' : 'Older messages'}
                </button>
              )}
              <div className="messages-msgs">
                {msgs.map((m) => (
                  <p key={m.id} className={`msg${m.mine ? ' msg--mine' : ''}`}>
                    <strong>{new Date(m.sentAt).toLocaleString()}:</strong> {m.body}{' '}
                    {m.mine && (
                      <>
                        <button type="button" className="button button--small button--secondary" onClick={() => void deleteMessage(m.id)}>
                          {isId ? 'Hapus' : 'Delete'}
                        </button>{' '}
                      </>
                    )}
                    {!m.mine && (
                      <button type="button" className="button button--small button--secondary" onClick={() => void reportMessage(m.id)}>
                        {isId ? 'Lapor' : 'Report'}
                      </button>
                    )}
                  </p>
                ))}
              </div>
              <div className="messages-input">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && void send()}
                  placeholder={isId ? 'Tulis pesan…' : 'Type a message…'}
                  maxLength={10000}
                />
                <button type="button" className="button" disabled={sending} onClick={() => void send()}>
                  {isId ? 'Kirim' : 'Send'}
                </button>
              </div>
            </>
          ) : (
            <div className="line-empty">
              <p className="line-empty__title">{isId ? 'Pilih percakapan' : 'Select a conversation'}</p>
              <p className="line-empty__hint">
                {isId
                  ? 'Pilih salah satu percakapan di daftar untuk membaca dan membalas pesan.'
                  : 'Pick a conversation from the list to read and reply.'}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
