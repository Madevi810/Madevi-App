'use client';

import { useState } from 'react';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { RSVPConfig } from '@/services/undangan';

export type RsvpPlusProps = {
  config: RSVPConfig;
  namaTamu?: string;
  onSubmit: (jawaban: Record<string, string>, kehadiran: 'hadir' | 'tidak') => void;
};

/**
 * C1: RSVP+ — konfirmasi kehadiran + pertanyaan custom.
 * Diadopsi dari katsudoto (RSVP+), dibuat lebih baik: tanpa login tamu.
 */
export function RsvpPlus({ config, namaTamu, onSubmit }: RsvpPlusProps) {
  const [kehadiran, setKehadiran] = useState<'hadir' | 'tidak' | null>(null);
  const [jawaban, setJawaban] = useState<Record<string, string>>({});
  const [selesai, setSelesai] = useState(false);

  if (!config.aktif) return null;

  if (selesai) {
    return (
      <Card variant="elevated">
        <CardContent>
          <p style={{ margin: 0, textAlign: 'center' }}>
            {kehadiran === 'hadir'
              ? '🎉 Terima kasih! Kehadiran Anda sangat berarti bagi kami.'
              : '😢 Terima kasih atas doanya. Sampai jumpa di lain kesempatan.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const kirim = () => {
    if (!kehadiran) return;
    onSubmit(jawaban, kehadiran);
    setSelesai(true);
  };

  return (
    <Card>
      <CardHeader>
        <h3>Konfirmasi Kehadiran (RSVP)</h3>
        {namaTamu && <Badge size="sm">{namaTamu}</Badge>}
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <Button
            variant={kehadiran === 'hadir' ? 'default' : 'outline'}
            onClick={() => setKehadiran('hadir')}
          >
            ✅ Ya, saya hadir
          </Button>
          <Button
            variant={kehadiran === 'tidak' ? 'default' : 'outline'}
            onClick={() => setKehadiran('tidak')}
          >
            ❌ Berhalangan
          </Button>
        </div>

        {kehadiran === 'hadir' && config.pertanyaanCustom && config.pertanyaanCustom.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h4 style={{ fontSize: 14, marginBottom: 8 }}>Pertanyaan tambahan:</h4>
            {config.pertanyaanCustom.map((q) => (
              <div key={q.id} style={{ marginBottom: 12 }}>
                <label
                  htmlFor={`rsvp-${q.id}`}
                  style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4 }}
                >
                  {q.pertanyaan}
                </label>
                {q.tipe === 'pilihan' && q.opsi ? (
                  <select
                    id={`rsvp-${q.id}`}
                    value={jawaban[q.id] ?? ''}
                    onChange={(e) => setJawaban((j) => ({ ...j, [q.id]: e.target.value }))}
                    style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
                  >
                    <option value="">— Pilih —</option>
                    {q.opsi.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`rsvp-${q.id}`}
                    type="text"
                    value={jawaban[q.id] ?? ''}
                    onChange={(e) => setJawaban((j) => ({ ...j, [q.id]: e.target.value }))}
                    style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <Button onClick={kirim} disabled={!kehadiran}>
          Kirim Konfirmasi
        </Button>

        {config.deadline && (
          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
            Batas konfirmasi: {config.deadline}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
