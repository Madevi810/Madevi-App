'use client';

import { useState } from 'react';

import { ParamSlider } from '@/components/ui/param-slider';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { hitungPH, kategoriPH } from '@/services/sim-fisika';

/**
 * SimPH — pola PhET: slider konsentrasi → warna + nilai pH berubah real-time.
 */
const WARNA_PH = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#a3e635', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef',
];

export function SimPH() {
  // Slider: eksponen konsentrasi H+ (10^-eksponen mol/L)
  const [eksponen, setEksponen] = useState(7);
  const konsentrasi = Math.pow(10, -eksponen);
  const ph = hitungPH(konsentrasi);
  const kategori = kategoriPH(ph);
  const warnaIdx = Math.min(14, Math.max(0, Math.round(ph)));

  return (
    <Card>
      <CardHeader>
        <h3>Skala pH Larutan</h3>
        <Badge variant={ph < 7 ? 'danger' : ph === 7 ? 'success' : 'info'} size="sm">{kategori}</Badge>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <ParamSlider label="Konsentrasi H⁺ (10^-x mol/L)" value={eksponen} min={0} max={14} step={0.5} decimals={1} onValueChange={setEksponen} />
            {/* Skala pH visual */}
            <div style={{ display: 'flex', marginTop: 12, borderRadius: 6, overflow: 'hidden' }} aria-hidden>
              {WARNA_PH.map((w, i) => (
                <div key={i} style={{ flex: 1, height: 20, background: w, opacity: i === warnaIdx ? 1 : 0.35 }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6b7280' }}>
              <span>0 asam</span><span>7 netral</span><span>14 basa</span>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div
              style={{
                height: 120,
                borderRadius: 12,
                background: WARNA_PH[warnaIdx],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              role="img"
              aria-label={`Larutan pH ${ph}`}
            >
              <span style={{ fontSize: 40, fontWeight: 800, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                {ph}
              </span>
            </div>
            <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px', fontSize: 14, marginTop: 8 }}>
              <dt>Konsentrasi H⁺</dt><dd><strong>10<sup>-{eksponen}</sup> mol/L</strong></dd>
              <dt>Kategori</dt><dd><strong>{kategori}</strong></dd>
            </dl>
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 12 }}>
          <strong>Coba pikirkan:</strong> mengapa pH memakai skala logaritma?
          Berapa kali lebih asam larutan pH 3 dibanding pH 5?
        </p>
      </CardContent>
    </Card>
  );
}
