'use client';

import { useState, useEffect, useRef } from 'react';

import { ParamSlider } from '@/components/ui/param-slider';
import { SimControls } from '@/components/ui/sim-controls';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { pegasOsilasi, posisiPegas } from '@/services/sim-fisika';

/**
 * SimPegas — pola PhET: drag beban + slider massa & konstanta,
 * animasi osilasi + periode real-time.
 */
export function SimPegas() {
  const [massa, setMassa] = useState(1);
  const [konstanta, setKonstanta] = useState(40);
  const [playing, setPlaying] = useState(true);
  const [waktu, setWaktu] = useState(0);
  const rafRef = useRef<number>(0);

  const h = pegasOsilasi(massa, konstanta);
  const amplitudo = 50; // px
  const posisi = posisiPegas(amplitudo, h.periodeS, waktu);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setWaktu((w) => w + dt);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  const reset = () => { setWaktu(0); setPlaying(true); };

  // Gambar: langit-langit, pegas (zigzag sederhana), beban
  const topY = 20;
  const restY = 100;
  const bebanY = restY + posisi;
  const zigzag = Array.from({ length: 8 }, (_, i) => {
    const y = topY + ((bebanY - topY) * (i + 1)) / 9;
    const x = 100 + (i % 2 === 0 ? -18 : 18);
    return `${x},${y}`;
  }).join(' ');

  return (
    <Card>
      <CardHeader>
        <h3>Pegas & Osilasi — T = 2π√(m/k)</h3>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <ParamSlider label="Massa beban" value={massa} min={0.1} max={5} step={0.1} unit="kg" decimals={1} onValueChange={setMassa} />
            <ParamSlider label="Konstanta pegas" value={konstanta} min={5} max={200} unit="N/m" onValueChange={setKonstanta} />
            <SimControls playing={playing} onPlayPause={() => setPlaying((p) => !p)} onReset={reset} />
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <svg viewBox="0 0 200 220" width="100%" style={{ background: '#f9fafb', borderRadius: 8, maxHeight: 240 }} role="img" aria-label="Animasi pegas">
              <rect x={70} y={8} width={60} height={8} fill="#6b7280" />
              <polyline points={`100,${topY} ${zigzag} 100,${bebanY}`} fill="none" stroke="#0ea5e9" strokeWidth={2} />
              <rect x={75} y={bebanY} width={50} height={30} rx={4} fill="#f59e0b" />
              <text x={100} y={bebanY + 20} textAnchor="middle" fontSize={10} fill="#fff">{massa} kg</text>
            </svg>
            <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px', fontSize: 14, marginTop: 8 }}>
              <dt>Periode (T)</dt><dd><strong>{h.periodeS} s</strong></dd>
              <dt>Frekuensi (f)</dt><dd><strong>{h.frekuensiHz} Hz</strong></dd>
            </dl>
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 12 }}>
          <strong>Coba pikirkan:</strong> apa yang terjadi pada periode jika massa digandakan?
          Jika pegas diganti yang lebih kaku?
        </p>
      </CardContent>
    </Card>
  );
}
