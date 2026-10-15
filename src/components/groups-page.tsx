'use client';

/**
 * GroupsPage — grup Madevi Line (L05 G-08).
 * Direktori minimal + jumlah anggota nyata; detail/membership/leave hanya
 * untuk konteks yang sah; isi grup tidak bocor dari direktori.
 */

import { useRouter } from 'next/navigation';
import { readCookie } from '@/lib/cookies';
import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from './theme-provider';

interface Group {
  id: string;
  businessCode: string;
  name: string;
  description: string;
  status: string;
  memberCount: number;
  membershipStatus: 'ACTIVE' | 'PENDING' | 'REJECTED' | 'REMOVED' | null;
  managedByMe: boolean;
}

interface Member {
  id: string;
  status: string;
  displayName: string;
  username: string;
}


const csrfJson = () => ({
  'content-type': 'application/json',
  'x-csrf-token': readCookie('madevi_csrf'),
});

export function GroupsPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const isId = language === 'id';
  const [groups, setGroups] = useState<Group[]>([]);
  const [detail, setDetail] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[] | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/v1/groups?limit=50');
      const j = await r.json();
      setGroups((j.data ?? []) as Group[]);
    } catch {
      setMessage(isId ? 'Gagal memuat daftar grup.' : 'Failed to load groups.');
    } finally {
      setLoading(false);
    }
  }, [isId]);

  useEffect(() => {
    load();
  }, [load]);

  async function propose(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    const r = await fetch('/api/v1/groups', {
      method: 'POST',
      headers: csrfJson(),
      body: JSON.stringify({ name: name.trim(), description: description.trim() }),
    });
    if (r.status === 401) {
      router.push('/auth');
      return;
    }
    const j = await r.json();
    if (j.data || r.status === 202) {
      setName('');
      setDescription('');
      setMessage(
        isId
          ? 'Usulan grup terkirim — menunggu persetujuan Admin.'
          : 'Group proposal sent — awaiting Admin approval.',
      );
      load();
    } else {
      setMessage(j.error?.message ?? 'Gagal');
    }
  }

  async function openDetail(id: string) {
    setMembers(null);
    const r = await fetch(`/api/v1/groups/${id}`);
    const j = await r.json();
    if (!r.ok) {
      setMessage(j.error?.message ?? 'Gagal');
      return;
    }
    setDetail(j.data as Group);
    if ((j.data as Group).membershipStatus === 'ACTIVE') {
      try {
        const mr = await fetch(`/api/v1/groups/${id}/members`);
        const mj = await mr.json();
        if (mr.ok) setMembers((mj.data ?? []) as Member[]);
      } catch {
        /* anggota opsional */
      }
    }
  }

  async function join(id: string) {
    setMessage('');
    const r = await fetch(`/api/v1/groups/${id}/join`, {
      method: 'POST',
      headers: { 'x-csrf-token': readCookie('madevi_csrf') },
    });
    if (r.status === 401) {
      router.push('/auth');
      return;
    }
    const j = await r.json();
    setMessage(
      j.data || r.status === 202
        ? isId
          ? 'Permintaan bergabung terkirim.'
          : 'Join request sent.'
        : (j.error?.message ?? 'Gagal'),
    );
    load();
  }

  async function leave(id: string) {
    const ok = window.confirm(isId ? 'Keluar dari grup ini?' : 'Leave this group?');
    if (!ok) return;
    const r = await fetch(`/api/v1/groups/${id}/leave`, {
      method: 'POST',
      headers: { 'x-csrf-token': readCookie('madevi_csrf') },
    });
    const j = await r.json().catch(() => null);
    if (r.ok) {
      setDetail(null);
      setMembers(null);
      load();
    } else setMessage(j?.error?.message ?? 'Gagal');
  }

  return (
    <div className="page-shell groups-page">
      <h1>{isId ? 'Grup' : 'Groups'}</h1>
      <form className="info-form line-proposal" onSubmit={propose}>
        <h2>{isId ? 'Usulkan grup publik' : 'Propose a public group'}</h2>
        <label className="info-form__field">
          <span>{isId ? 'Nama' : 'Name'}</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={3}
            maxLength={160}
          />
        </label>
        <label className="info-form__field">
          <span>{isId ? 'Deskripsi' : 'Description'}</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={2000}
          />
        </label>
        <button type="submit" className="button">
          {isId ? 'Kirim usulan' : 'Submit proposal'}
        </button>
      </form>
      {message && <p className="info-form__status">{message}</p>}
      {detail && (
        <section className="group-detail" aria-label={detail.name}>
          <h2>{detail.name}</h2>
          <p>{detail.description}</p>
          <p>
            {detail.memberCount} {isId ? 'anggota' : 'members'}
            {detail.membershipStatus
              ? ` · ${isId ? 'Status saya' : 'My status'}: ${detail.membershipStatus}`
              : ''}
          </p>
          <div className="line-actions">
            {detail.membershipStatus === 'ACTIVE' && (
              <button type="button" className="button button--small button--secondary" onClick={() => void leave(detail.id)}>
                {isId ? 'Keluar grup' : 'Leave group'}
              </button>
            )}
            {(detail.membershipStatus === null || detail.membershipStatus === 'REMOVED' || detail.membershipStatus === 'REJECTED') && (
              <button type="button" className="button button--small" onClick={() => void join(detail.id)}>
                {isId ? 'Minta bergabung' : 'Request to join'}
              </button>
            )}
            <button type="button" className="button button--small button--secondary" onClick={() => setDetail(null)}>
              {isId ? 'Tutup' : 'Close'}
            </button>
          </div>
          {members && (
            <ul className="group-members">
              {members.map((m) => (
                <li key={m.id}>
                  {m.displayName} (@{m.username})
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
      <div className="groups-grid card-grid">
        {loading ? (
          [0, 1, 2].map((i) => (
            <div key={i} className="card" aria-hidden="true" style={{ padding: '1.125rem', display: 'grid', gap: '0.5rem' }}>
              <span className="skeleton" style={{ width: '60%' }} />
              <span className="skeleton" style={{ width: '90%' }} />
              <span className="skeleton" style={{ width: '40%' }} />
            </div>
          ))
        ) : (
          groups.map((g) => (
          <div key={g.id} className="group-card card">
            <h2 className="group-card__name">{g.name}</h2>
            <p className="group-card__desc">{g.description}</p>
            <p className="group-card__count">
              {g.memberCount} {isId ? 'anggota' : 'members'}
            </p>
            <div className="line-actions">
              <button type="button" className="button button--small button--secondary" onClick={() => void openDetail(g.id)}>
                {isId ? 'Detail' : 'Details'}
              </button>
              <button type="button" className="button button--small" onClick={() => void join(g.id)}>
                {isId ? 'Minta bergabung' : 'Request to join'}
              </button>
            </div>
          </div>
          ))
        )}
        {!loading && !groups.length && (
          <div className="line-empty">
            <p className="line-empty__title">{isId ? 'Belum ada grup' : 'No groups yet'}</p>
            <p className="line-empty__hint">
              {isId
                ? 'Usulkan grup publik pertama lewat formulir di atas — Admin akan meninjau.'
                : 'Propose the first public group with the form above — Admin will review it.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
