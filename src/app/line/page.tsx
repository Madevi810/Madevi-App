'use client';

import { useState } from 'react';

import { PublicShell } from '@/components/public-shell';
import { FeedLine } from '@/components/line/feed-line';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { PostinganLine } from '@/services/line';
import {
  ritualHariIni,
  ATURAN_KOMUNITAS,
  LEVEL_REPUTASI_LABEL,
  levelReputasi,
  pilihKaryaMingguan,
} from '@/services/line';

const CONTOH_POSTINGAN: PostinganLine[] = [
  {
    id: 'contoh-1',
    tipe: 'karya',
    penulisId: 'u1',
    penulisNama: 'Kreator Muda',
    judul: 'Lampu Tidur dari Botol Bekas',
    isi: 'Saya membuat lampu tidur dari botol plastik bekas + lampu LED USB. Total biaya Rp15.000! Tutorial lengkap menyusul.',
    tags: ['diy', 'ramah-lingkungan'],
    anonim: false,
    statusModerasi: 'disetujui',
    jumlahLaporan: 0,
    suka: 24,
    komentar: [],
    dibuatPada: '2026-10-18',
  },
  {
    id: 'contoh-2',
    tipe: 'curhat',
    penulisId: 'u2',
    penulisNama: 'Anonim',
    isi: 'Capek banget akhir-akhir ini. Kerjaan numpuk, istirahat kurang. Ada yang punya tips mengatur waktu?',
    tags: ['lelah', 'butuh-saran'],
    anonim: true,
    statusModerasi: 'disetujui',
    jumlahLaporan: 0,
    suka: 12,
    komentar: [],
    dibuatPada: '2026-10-18',
  },
];

/**
 * Landing Madevi Line: feed karya & curhat.
 */
export default function LineLandingPage() {
  const [tipe, setTipe] = useState<'semua' | 'karya' | 'curhat'>('semua');
  const [postingan, setPostingan] = useState<PostinganLine[]>(CONTOH_POSTINGAN);
  const [tampilAturan, setTampilAturan] = useState(false);

  const suka = (id: string) =>
    setPostingan((ps) => ps.map((p) => (p.id === id ? { ...p, suka: p.suka + 1 } : p)));

  const ritual = ritualHariIni();
  const karyaPilihan = pilihKaryaMingguan(
    postingan.filter((p) => p.tipe === 'karya').map((p) => ({ id: p.id, suka: p.suka })),
  );

  return (
    <PublicShell>
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 48px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: 8 }}>💬 Madevi Line</h1>
        <p style={{ color: '#6b7280', marginBottom: 16, maxWidth: '70ch' }}>
          Perkumpulan pengguna Madevi. Bagikan <strong>karya</strong> dan inovasimu,
          atau <strong>curhat</strong> dengan aman (bisa anonim). Saling dukung, tanpa perundungan.
        </p>

        {/* Ritual hari ini */}
        {ritual.length > 0 && (
          <Card style={{ marginBottom: 16, borderColor: '#bae6fd' }}>
            <CardContent>
              <Badge size="sm" variant="info" style={{ marginBottom: 8 }}>Ritual Hari Ini</Badge>
              {ritual.map((r) => (
                <div key={r.id}>
                  <strong>{r.judul}</strong>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>{r.deskripsi}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Karya pilihan mingguan */}
        {karyaPilihan && (
          <Card style={{ marginBottom: 16, borderColor: '#fde68a' }}>
            <CardContent>
              <Badge size="sm" variant="warning" style={{ marginBottom: 8 }}>
                ⭐ Karya Pilihan Minggu Ini
              </Badge>
              <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                {postingan.find((p) => p.id === karyaPilihan.postinganId)?.judul ??
                  'Belum ada karya minggu ini.'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Aturan komunitas */}
        <Card style={{ marginBottom: 16 }}>
          <CardContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: 14 }}>📜 Aturan Komunitas</strong>
              <Button size="sm" variant="ghost" onClick={() => setTampilAturan((v) => !v)}>
                {tampilAturan ? 'Sembunyikan' : 'Lihat'}
              </Button>
            </div>
            {tampilAturan && (
              <ol style={{ fontSize: 13, color: '#374151', paddingLeft: 20, margin: '8px 0 0' }}>
                {ATURAN_KOMUNITAS.map((a, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>{a}</li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <CardContent>
            <p style={{ margin: '0 0 8px', fontSize: 14, color: '#6b7280' }}>
              Ingin berbagi? Login untuk memposting karya atau curhat.
            </p>
            <Button size="sm">Masuk / Daftar</Button>
          </CardContent>
        </Card>

        <FeedLine postingan={postingan} tipeAktif={tipe} onTipeChange={setTipe} onSuka={suka} />

        <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 24, textAlign: 'center' }}>
          Level reputasimu: <Badge size="sm" variant="neutral">{LEVEL_REPUTASI_LABEL[levelReputasi(0)]}</Badge>
          {' '}— kumpulkan apresiasi untuk naik level.
        </p>
      </main>
    </PublicShell>
  );
}
