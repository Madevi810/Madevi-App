'use client';

import { useState, useEffect, useRef } from 'react';

import { ParamSlider } from '@/components/ui/param-slider';
import { SimControls } from '@/components/ui/sim-controls';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

/**
 * SimBandul — pola PhET: slider panjang tali & sudut awal,
 * animasi ayunan + periode real-time. T = 2π√(L/g).
 */
export function SimBandul() {
  const [panjang, setPanjang] = useState(1); // meter
  const [sudutAwal, setSudutAwal] = useState(20); // derajat
  const [playing, setPlaying] = useState(true);
  const [waktu, setWaktu] = useState(0);

  const g = 9.8;
  const periode = 2 * Math.PI * Math.sqrt(panjang / g);
  const omega = (2 * Math.PI) / periode;
  const theta = (sudutAwal * Math.PI) / 180;
  const sudutSekarang = theta * Math.cos(omega * waktu);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setWaktu((w) => w + dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const reset = () => { setWaktu(0); setPlaying(true); };

  // Gambar: titik gantung (100,20), tali panjang skala px
  const skala = 120; // px per meter
  const x0 = 100; const y0 = 20;
  const x1 = x0 + skala * panjang * Math.sin(sudutSekarang);
  const y1 = y0 + skala * panjang * Math.cos(sudutSekarang);

  return (
    <Card>
      <CardHeader>
        <h3>Bandul Sederhana — T = 2π√(L/g)</h3>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <ParamSlider label="Panjang tali" value={panjang} min={0.2} max={2} step={0.1} unit="m" decimals={1} onValueChange={setPanjang} />
            <ParamSlider label="Sudut awal" value={sudutAwal} min={5} max={45} unit="°" onValueChange={setSudutAwal} />
            <SimControls playing={playing} onPlayPause={() => setPlaying((p) => !p)} onReset={reset} />
            <p style={{ fontSize: 14, marginTop: 8 }}>
              Periode: <strong>{periode.toFixed(2)} detik</strong>
            </p>
            <p style={{ fontSize: 13, color: '#6b7280' }}>
              Coba: panjang tali digandakan → periode naik √2 kali. Sudut kecil tidak mengubah periode (isokronisme).
            </p>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <svg viewBox="0 0 200 180" style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8 }}>
              <line x1={60} y1={y0} x2={140} y2={y0} stroke="#9ca3af" strokeWidth={4} />
              <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="#374151" strokeWidth={2} />
              <circle cx={x1} cy={y1} r={12} fill="#0ea5e9" />
              <circle cx={x0} cy={y0} r={3} fill="#374151" />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
