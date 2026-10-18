'use client';

import { useState } from 'react';

import { ParamSlider } from '@/components/ui/param-slider';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { hukumOhm } from '@/services/sim-fisika';

/**
 * SimHukumOhm — pola PhET: slider tegangan & resistansi,
 * arus + daya + visual berubah real-time (multi-representasi sinkron).
 */
export function SimHukumOhm() {
  const [tegangan, setTegangan] = useState(12);
  const [resistansi, setResistansi] = useState(4);
  const h = hukumOhm(tegangan, resistansi);

  // Skala visual: lebar batang arus proporsional (maks 10A)
  const lebarArus = Math.min(100, (h.arusA / 10) * 100);
  const aman = h.dayaW <= 100;

  return (
    <Card>
      <CardHeader>
        <h3>Hukum Ohm — V = I × R</h3>
        <Badge variant={aman ? 'success' : 'warning'} size="sm">
          {aman ? 'Aman' : 'Daya besar!'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <ParamSlider label="Tegangan" value={tegangan} min={1} max={24} unit="V" onValueChange={setTegangan} />
            <ParamSlider label="Resistansi" value={resistansi} min={1} max={100} unit="Ω" onValueChange={setResistansi} />
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            {/* Representasi visual: batang arus */}
            <div aria-label="Visualisasi arus" style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, marginBottom: 4 }}>Arus mengalir:</div>
              <div style={{ height: 24, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${lebarArus}%`,
                    background: 'linear-gradient(90deg, #38bdf8, #0ea5e9)',
                    transition: 'width 0.15s',
                  }}
                />
              </div>
            </div>
            {/* Representasi angka */}
            <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px', fontSize: 14 }}>
              <dt>Tegangan (V)</dt><dd><strong>{h.teganganV} V</strong></dd>
              <dt>Arus (I)</dt><dd><strong>{h.arusA.toFixed(2)} A</strong></dd>
              <dt>Daya (P)</dt><dd><strong>{h.dayaW.toFixed(1)} W</strong></dd>
            </dl>
            {/* Representasi persamaan */}
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
              {h.teganganV} V = {h.arusA.toFixed(2)} A × {h.resistansiOhm} Ω
            </p>
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 12 }}>
          <strong>Coba pikirkan:</strong> apa yang terjadi pada arus jika resistansi digandakan?
          Mengapa lampu redup saat tegangan turun?
        </p>
      </CardContent>
    </Card>
  );
}
