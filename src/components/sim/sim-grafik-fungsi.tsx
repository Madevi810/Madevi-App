'use client';

import { useState } from 'react';

import { ParamSlider } from '@/components/ui/param-slider';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { analisisKuadrat } from '@/services/sim-fisika';

/**
 * SimGrafikFungsi — pola PhET: slider a, b, c → kurva berubah langsung
 * + titik puncak & akar ditandai.
 */
export function SimGrafikFungsi() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(-4);
  const h = analisisKuadrat(a, b, c);

  const W = 320;
  const Ht = 200;
  const xMin = -6;
  const xMax = 6;
  const yMin = -8;
  const yMax = 8;
  const px = (x: number) => ((x - xMin) / (xMax - xMin)) * W;
  const py = (y: number) => Ht - ((y - yMin) / (yMax - yMin)) * Ht;

  const pts: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const x = xMin + ((xMax - xMin) * i) / 80;
    const y = a * x * x + b * x + c;
    if (y >= yMin - 2 && y <= yMax + 2) pts.push(`${px(x)},${py(Math.max(yMin, Math.min(yMax, y)))}`);
  }

  return (
    <Card>
      <CardHeader>
        <h3>Grafik Fungsi Kuadrat — y = ax² + bx + c</h3>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <ParamSlider label="a" value={a} min={-3} max={3} step={0.5} decimals={1} onValueChange={(v) => setA(v === 0 ? 0.5 : v)} />
            <ParamSlider label="b" value={b} min={-6} max={6} step={0.5} decimals={1} onValueChange={setB} />
            <ParamSlider label="c" value={c} min={-8} max={8} step={0.5} decimals={1} onValueChange={setC} />
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <svg viewBox={`0 0 ${W} ${Ht}`} width="100%" style={{ background: '#f9fafb', borderRadius: 8 }} role="img" aria-label="Grafik fungsi kuadrat">
              <line x1={0} y1={py(0)} x2={W} y2={py(0)} stroke="#9ca3af" strokeWidth={1} />
              <line x1={px(0)} y1={0} x2={px(0)} y2={Ht} stroke="#9ca3af" strokeWidth={1} />
              <polyline points={pts.join(' ')} fill="none" stroke="#0ea5e9" strokeWidth={2.5} />
              <circle cx={px(h.titikPuncak.x)} cy={py(h.titikPuncak.y)} r={5} fill="#ef4444" />
              {h.akarReal.map((akar, i) => (
                <circle key={i} cx={px(akar)} cy={py(0)} r={4} fill="#10b981" />
              ))}
            </svg>
            <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px', fontSize: 14, marginTop: 8 }}>
              <dt>Diskriminan</dt><dd><strong>{h.diskriminan}</strong></dd>
              <dt>Akar real</dt><dd><strong>{h.akarReal.length > 0 ? h.akarReal.join(', ') : 'tidak ada'}</strong></dd>
              <dt>Titik puncak</dt><dd><strong>({h.titikPuncak.x}, {h.titikPuncak.y})</strong></dd>
            </dl>
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 12 }}>
          <strong>Coba pikirkan:</strong> apa pengaruh tanda a terhadap arah parabola?
          Kapan grafik tidak memotong sumbu-x?
        </p>
      </CardContent>
    </Card>
  );
}
