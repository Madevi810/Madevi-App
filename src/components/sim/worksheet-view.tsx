'use client';

import { useState } from 'react';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Worksheet } from '@/services/sim-worksheet';

export type WorksheetViewProps = {
  worksheet: Worksheet;
};

/**
 * C2: Tampilan worksheet — tujuan belajar + soal interaktif
 * dengan kunci jawaban tersembunyi (klik untuk buka).
 */
export function WorksheetView({ worksheet: w }: WorksheetViewProps) {
  const [terbuka, setTerbuka] = useState<boolean[]>(() => w.pertanyaan.map(() => false));
  const [jawabanUser, setJawabanUser] = useState<Record<number, string>>({});

  const toggle = (i: number) => setTerbuka((t) => t.map((v, j) => (j === i ? !v : v)));

  return (
    <Card variant="elevated">
      <CardHeader>
        <h3>📝 {w.judul}</h3>
      </CardHeader>
      <CardContent>
        <h4 style={{ fontSize: 14, marginBottom: 8 }}>🎯 Tujuan Belajar</h4>
        <ul style={{ fontSize: 14, margin: '0 0 16px', paddingLeft: 20 }}>
          {w.tujuanBelajar.map((t, i) => (
            <li key={i} style={{ marginBottom: 4 }}>{t}</li>
          ))}
        </ul>

        <h4 style={{ fontSize: 14, marginBottom: 8 }}>❓ Pertanyaan Eksplorasi</h4>
        {w.pertanyaan.map((s, i) => (
          <div
            key={i}
            style={{
              marginBottom: 12,
              padding: 12,
              border: '1px solid #e5e7eb',
              borderRadius: 8,
            }}
          >
            <p style={{ fontWeight: 600, margin: '0 0 8px', fontSize: 14 }}>
              {i + 1}. {s.pertanyaan}
            </p>
            {s.petunjuk && (
              <p style={{ fontSize: 13, color: '#0284c7', margin: '0 0 8px' }}>💡 {s.petunjuk}</p>
            )}
            <input
              type="text"
              placeholder="Tulis jawabanmu…"
              value={jawabanUser[i] ?? ''}
              onChange={(e) => setJawabanUser((j) => ({ ...j, [i]: e.target.value }))}
              style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6, marginBottom: 8 }}
              aria-label={`Jawaban pertanyaan ${i + 1}`}
            />
            <Button size="sm" variant="outline" onClick={() => toggle(i)}>
              {terbuka[i] ? 'Sembunyikan kunci' : 'Lihat kunci jawaban'}
            </Button>
            {terbuka[i] && (
              <div style={{ marginTop: 8, padding: 8, background: '#f0fdf4', borderRadius: 6 }}>
                <p style={{ fontSize: 13, margin: '0 0 4px' }}>
                  <Badge size="sm" variant="success">Kunci</Badge> {s.kunciJawaban}
                </p>
                <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>{s.pembahasan}</p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
