'use client';

import { useState } from 'react';

import { ParamSlider } from '@/components/ui/param-slider';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { gerakParabola } from '@/services/sim-fisika';

/**
 * SimParabola — pola PhET: slider sudut & kecepatan,
 * lintasan + angka berubah real-time.
 */
export function SimParabola() {
  const [kecepatan, setKecepatan] = useState(20);
  const [sudut, setSudut] = useState(45);
  const h = gerakParabola(kecepatan, sudut);

  // Gambar lintasan di SVG (skala otomatis)
  const W = 320;
  const Ht = 180;
  const pad = 10;
  const sx = h.jarakMaksM > 0 ? (W - pad * 2) / h.jarakMaksM : 1;
  const sy = h.tinggiMaksM > 0 ? (Ht - pad * 2) / h.tinggiMaksM : 1;
  const points = h.lintasan
    .map((p) => `${pad + p.x * sx},${Ht - pad - p.y * sy}`)
    .join(' ');

  return (
    <Card>
      <CardHeader>
        <h3>Gerak Parabola</h3>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <ParamSlider label="Kecepatan awal" value={kecepatan} min={1} max={50} unit="m/s" onValueChange={setKecepatan} />
            <ParamSlider label="Sudut" value={sudut} min={0} max={90} unit="°" onValueChange={setSudut} />
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <svg viewBox={`0 0 ${W} ${Ht}`} width="100%" style={{ background: '#f9fafb', borderRadius: 8 }} role="img" aria-label="Lintasan parabola">
              <line x1={pad} y1={Ht - pad} x2={W - pad} y2={Ht - pad} stroke="#9ca3af" strokeWidth={1} />
              <polyline points={points} fill="none" stroke="#0ea5e9" strokeWidth={2.5} />
              <circle cx={pad} cy={Ht - pad} r={4} fill="#ef4444" />
            </svg>
            <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px', fontSize: 14, marginTop: 8 }}>
              <dt>Jarak maks</dt><dd><strong>{h.jarakMaksM} m</strong></dd>
              <dt>Tinggi maks</dt><dd><strong>{h.tinggiMaksM} m</strong></dd>
              <dt>Waktu total</dt><dd><strong>{h.waktuTotalS} s</strong></dd>
            </dl>
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 12 }}>
          <strong>Coba pikirkan:</strong> sudut berapa yang memberi jarak terjauh?
          Mengapa 30° dan 60° menghasilkan jarak yang sama?
        </p>
      </CardContent>
    </Card>
  );
}
