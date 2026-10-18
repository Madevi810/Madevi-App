'use client';

import { useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import type { TamuUndangan } from '@/services/undangan';
import { buatLinkPersonal, buatLinkWA, templatePesanUndangan } from '@/services/undangan';

export type KelolaTamuProps = {
  slug: string;
  namaMempelai: string;
  tamuAwal: TamuUndangan[];
  onTamuChange: (tamu: TamuUndangan[]) => void;
};

/**
 * Manajemen tamu: tambah manual, filter grup/status, broadcast WA,
 * tandai check-in. Pola katsudoto, dibuat lebih ringan untuk HP.
 */
export function KelolaTamu({ slug, namaMempelai, tamuAwal, onTamuChange }: KelolaTamuProps) {
  const [tamu, setTamu] = useState<TamuUndangan[]>(tamuAwal);
  const [nama, setNama] = useState('');
  const [wa, setWa] = useState('');
  const [grup, setGrup] = useState('');
  const [filter, setFilter] = useState<'semua' | 'belum' | 'hadir' | 'tidak'>('semua');

  const update = (baru: TamuUndangan[]) => {
    setTamu(baru);
    onTamuChange(baru);
  };

  const tambah = () => {
    const n = nama.trim();
    if (!n) return;
    update([
      ...tamu,
      {
        id: `t-${Date.now()}`,
        nama: n,
        nomorWA: wa.trim() || undefined,
        grup: grup.trim() || undefined,
        pax: 1,
        statusRSVP: 'belum',
        sudahCheckin: false,
      },
    ]);
    setNama('');
    setWa('');
    setGrup('');
  };

  const tampil = tamu.filter((t) => filter === 'semua' || t.statusRSVP === filter);
  const statistik = {
    total: tamu.length,
    hadir: tamu.filter((t) => t.statusRSVP === 'hadir').length,
    tidak: tamu.filter((t) => t.statusRSVP === 'tidak').length,
    checkin: tamu.filter((t) => t.sudahCheckin).length,
  };

  const kirimSemua = () => {
    const yangAdaWA = tamu.filter((t) => t.nomorWA);
    for (const t of yangAdaWA) {
      const link = `${window.location.origin}${buatLinkPersonal(slug, t.nama)}`;
      const pesan = templatePesanUndangan(t.nama, namaMempelai, link);
      window.open(buatLinkWA(t.nomorWA!, pesan), '_blank');
    }
  };

  /**
   * C4: Export daftar tamu ke CSV (dibuka di Excel).
   * Pembeda dari katsudoto: gratis, satu klik, langsung dari browser.
   */
  const exportCSV = () => {
    const header = 'Nama;Nomor WA;Grup;RSVP;Check-in';
    const baris = tamu.map((t) =>
      [t.nama, t.nomorWA ?? '', t.grup ?? '', t.statusRSVP, t.sudahCheckin ? 'Ya' : ''].join(';'),
    );
    const csv = '\uFEFF' + [header, ...baris].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `daftar-tamu-${slug}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <Badge>👥 {statistik.total} tamu</Badge>
        <Badge variant="success">✅ {statistik.hadir} hadir</Badge>
        <Badge variant="danger">❌ {statistik.tidak} tidak</Badge>
        <Badge variant="info">🎟 {statistik.checkin} check-in</Badge>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Button size="sm" variant="outline" onClick={exportCSV}>
          📥 Export ke Excel (CSV)
        </Button>
      </div>

      {/* Form tambah */}
      <Card>
        <CardContent>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input
              placeholder="Nama tamu"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              style={{ flex: 2, minWidth: 140, padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
            />
            <input
              placeholder="No. WA (opsional)"
              value={wa}
              onChange={(e) => setWa(e.target.value)}
              style={{ flex: 1, minWidth: 120, padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
            />
            <input
              placeholder="Grup (opsional)"
              value={grup}
              onChange={(e) => setGrup(e.target.value)}
              style={{ flex: 1, minWidth: 100, padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
            />
            <Button size="sm" onClick={tambah}>＋ Tambah</Button>
          </div>
          {tamu.some((t) => t.nomorWA) && (
            <Button size="sm" variant="outline" onClick={kirimSemua} style={{ marginTop: 8 }}>
              📤 Kirim undangan via WA ke semua
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
        {(['semua', 'belum', 'hadir', 'tidak'] as const).map((f) => (
          <Button key={f} size="sm" variant={filter === f ? 'default' : 'ghost'} onClick={() => setFilter(f)}>
            {f === 'semua' ? 'Semua' : f === 'belum' ? 'Belum jawab' : f === 'hadir' ? 'Hadir' : 'Tidak'}
          </Button>
        ))}
      </div>

      {/* Daftar */}
      {tampil.length === 0 ? (
        <EmptyState icon="📭" title="Belum ada tamu" description="Tambahkan tamu undangan lewat form di atas." size="sm" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tampil.map((t) => (
            <Card key={t.id}>
              <CardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <div>
                    <strong>{t.nama}</strong>
                    {t.grup && <Badge size="sm" style={{ marginLeft: 8 }}>{t.grup}</Badge>}
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                      RSVP: {t.statusRSVP === 'belum' ? '⏳ belum jawab' : t.statusRSVP === 'hadir' ? '✅ hadir' : '❌ tidak'}
                      {' • '}Check-in: {t.sudahCheckin ? '🎟 sudah' : '—'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        update(tamu.map((x) => (x.id === t.id ? { ...x, sudahCheckin: !x.sudahCheckin } : x)))
                      }
                    >
                      {t.sudahCheckin ? 'Batalkan check-in' : 'Check-in'}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => update(tamu.filter((x) => x.id !== t.id))}>
                      🗑
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
