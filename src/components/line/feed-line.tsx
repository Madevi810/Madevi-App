'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import type { PostinganLine } from '@/services/line';
import { TIPE_POSTINGAN_LABEL, PESAN_DARURAT_CURHAT, praModerasi } from '@/services/line';

export type FeedLineProps = {
  postingan: PostinganLine[];
  tipeAktif: 'semua' | 'karya' | 'curhat';
  onTipeChange: (t: 'semua' | 'karya' | 'curhat') => void;
  onSuka: (id: string) => void;
};

/**
 * Feed Madevi Line: satu pola konsisten untuk karya & curhat.
 * Curhat anonim didukung; deteksi krisis menampilkan pesan bantuan.
 */
export function FeedLine({ postingan, tipeAktif, onTipeChange, onSuka }: FeedLineProps) {
  const tampil = postingan.filter(
    (p) => tipeAktif === 'semua' || p.tipe === tipeAktif,
  );

  return (
    <div>
      {/* Tab tipe */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }} role="tablist" aria-label="Jenis postingan">
        {(['semua', 'karya', 'curhat'] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tipeAktif === t}
            onClick={() => onTipeChange(t)}
            style={{
              padding: '8px 16px',
              borderRadius: 9999,
              border: '1px solid #d1d5db',
              background: tipeAktif === t ? '#0ea5e9' : '#fff',
              color: tipeAktif === t ? '#fff' : '#374151',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {t === 'semua' ? 'Semua' : t === 'karya' ? '🎨 Karya' : '💬 Curhat'}
          </button>
        ))}
      </div>

      {tampil.length === 0 ? (
        <EmptyState
          icon={tipeAktif === 'curhat' ? '💬' : '🎨'}
          title="Belum ada postingan"
          description={
            tipeAktif === 'curhat'
              ? 'Ruang aman untuk bercerita. Jadilah yang pertama berbagi.'
              : 'Bagikan karya, ide, atau inovasimu ke seluruh pengguna.'
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tampil.map((p) => {
            const mod = praModerasi(p.isi);
            return (
              <Card key={p.id}>
                <CardContent>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                    <Badge size="sm" variant={p.tipe === 'karya' ? 'info' : 'warning'}>
                      {TIPE_POSTINGAN_LABEL[p.tipe]}
                    </Badge>
                    <span style={{ fontSize: 13, color: '#6b7280' }}>
                      {p.anonim ? '🕵️ Anonim' : p.penulisNama}
                    </span>
                  </div>
                  {p.judul && <h3 style={{ margin: '0 0 8px' }}>{p.judul}</h3>}
                  <p style={{ margin: '0 0 8px', lineHeight: 1.6 }}>{p.isi}</p>
                  {mod.darurat && (
                    <p
                      style={{
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 13,
                        margin: '8px 0',
                      }}
                    >
                      {PESAN_DARURAT_CURHAT}
                    </p>
                  )}
                  {p.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                      {p.tags.map((t) => (
                        <Badge key={t} size="sm" variant="neutral">#{t}</Badge>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 12, fontSize: 13, color: '#6b7280' }}>
                    <button
                      onClick={() => onSuka(p.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}
                      aria-label={`Suka postingan (${p.suka})`}
                    >
                      ❤️ {p.suka}
                    </button>
                    <span>💬 {p.komentar.length} komentar</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
