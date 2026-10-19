'use client';

import { useState } from 'react';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { tanyaKonsep, type ModeTanya } from '@/services/tanya-konsep';

export type TanyaKonsepProps = {
  modeAwal?: ModeTanya;
};

/**
 * C3: UI "Tanya Konsep" — ketik soal, dapat penjelasan + soal mirip.
 * Mode bimbingan: anti-nyontek saat ujian.
 */
export function TanyaKonsep({ modeAwal = 'normal' }: TanyaKonsepProps) {
  const [pertanyaan, setPertanyaan] = useState('');
  const [mode] = useState<ModeTanya>(modeAwal);
  const [hasil, setHasil] = useState<ReturnType<typeof tanyaKonsep> | null>(null);

  const tanya = () => {
    if (!pertanyaan.trim()) return;
    setHasil(tanyaKonsep(pertanyaan, mode));
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>❓ Tanya Konsep</h3>
          <Badge size="sm" variant={mode === 'bimbingan' ? 'warning' : 'info'}>
            {mode === 'bimbingan' ? '🛡️ Mode Bimbingan' : 'Mode Normal'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            type="text"
            placeholder="Ketik soal atau konsep… (mis. pecahan senilai)"
            value={pertanyaan}
            onChange={(e) => setPertanyaan(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && tanya()}
            style={{ flex: 1, padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
            aria-label="Pertanyaan konsep"
          />
          <Button size="sm" onClick={tanya}>Tanya</Button>
        </div>

        {hasil && (
          <div>
            {hasil.peringatan && (
              <p style={{ fontSize: 13, color: '#b45309', margin: '0 0 8px' }}>{hasil.peringatan}</p>
            )}
            <h4 style={{ margin: '0 0 4px' }}>{hasil.konsep}</h4>
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>{hasil.penjelasan}</p>
            {hasil.langkahPetunjuk.length > 0 && (
              <>
                <h4 style={{ fontSize: 14, margin: '12px 0 4px' }}>👣 Langkah:</h4>
                <ol style={{ fontSize: 14, paddingLeft: 20, margin: 0 }}>
                  {hasil.langkahPetunjuk.map((l, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>{l}</li>
                  ))}
                </ol>
              </>
            )}
            {hasil.soalMirip.length > 0 && (
              <>
                <h4 style={{ fontSize: 14, margin: '12px 0 4px' }}>📝 Coba soal mirip:</h4>
                <ul style={{ fontSize: 14, paddingLeft: 20, margin: 0 }}>
                  {hasil.soalMirip.map((s, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>{s}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
