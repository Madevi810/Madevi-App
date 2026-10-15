'use client';

/**
 * PcbOrderForm — form brief desain layout PCB (L04 AC3).
 * Dimensi, layer, komponen, tegangan/arus, clearance, target fabrikasi,
 * deliverable, dan disclaimer → POST /api/v1/jasa/pcb.
 * Jasa desain berdasarkan brief; BUKAN jaminan produksi/keamanan perangkat,
 * simulasi kelistrikan, atau sertifikasi.
 */

import { useState } from 'react';
import { csrfHeaders } from '../csrf-token';
import { PCB_SAFETY_DISCLAIMER } from '@/contracts/services';

const LAYERS = [1, 2, 4, 6, 8] as const;

const DELIVERABLES = [
  'GERBER_RS274X',
  'DRILL_NC',
  'BOM_CSV',
  'PICK_AND_PLACE',
  'STEP_3D',
  'SCHEMATIC_PRINT',
] as const;

const FLAG_KEYS = [
  'hasMainsVoltage',
  'hasLithiumBattery',
  'hasRfWireless',
  'hasHighCurrent',
  'isSafetyCritical',
] as const;

type FlagKey = (typeof FLAG_KEYS)[number];

const FLAG_LABEL: Record<FlagKey, { id: string; en: string }> = {
  hasMainsVoltage: { id: 'Tegangan mains/tinggi (≥50V)', en: 'Mains/high voltage (≥50V)' },
  hasLithiumBattery: { id: 'Baterai litium / charging', en: 'Lithium battery / charging' },
  hasRfWireless: { id: 'RF / nirkabel frekuensi tinggi', en: 'RF / high-frequency wireless' },
  hasHighCurrent: { id: 'Arus tinggi (>5A)', en: 'High current (>5A)' },
  isSafetyCritical: { id: 'Safety-critical (medis/otomotif/nyawa)', en: 'Safety-critical (medical/auto/life)' },
};

export function PcbOrderForm({ isId }: { isId: boolean }) {
  const [circuit, setCircuit] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [shape, setShape] = useState('RECTANGULAR');
  const [layers, setLayers] = useState<number>(2);
  const [maxVolt, setMaxVolt] = useState('');
  const [maxAmpere, setMaxAmpere] = useState('');
  const [fabHouse, setFabHouse] = useState('');
  const [flags, setFlags] = useState<Record<FlagKey, boolean>>({
    hasMainsVoltage: false,
    hasLithiumBattery: false,
    hasRfWireless: false,
    hasHighCurrent: false,
    isSafetyCritical: false,
  });
  const [deliverables, setDeliverables] = useState<string[]>(['GERBER_RS274X']);
  const [disclaimer, setDisclaimer] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ id: string; secret_token: string } | null>(null);

  function toggleDeliverable(d: string) {
    setDeliverables((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setResult(null);
    if (circuit.trim().length < 20) {
      setError(
        isId
          ? 'Deskripsi rangkaian minimal 20 karakter.'
          : 'Circuit description needs 20+ characters.',
      );
      return;
    }
    if (!deliverables.length) {
      setError(isId ? 'Pilih minimal satu deliverable.' : 'Select at least one deliverable.');
      return;
    }
    if (!disclaimer) {
      setError(isId ? 'Disclaimer wajib disetujui.' : 'You must accept the disclaimer.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/v1/jasa/pcb', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({
          fixedPrice: 0,
          brief: {
            circuitDescription: circuit.trim(),
            dimensions: { widthMm: Number(width), heightMm: Number(height), shape },
            layerCount: layers,
            operatingVoltage: { minVolt: 0, maxVolt: Number(maxVolt) || 0 },
            operatingCurrent: { maxAmpere: Number(maxAmpere) || 0 },
            mechanicalConstraints: { mountingHoles: false },
            manufacturing: fabHouse.trim() ? { targetFabHouse: fabHouse.trim() } : {},
            safetyFlags: flags,
            requestedDeliverables: deliverables,
            disclaimerAcknowledged: true,
          },
        }),
      });
      const json = (await res.json()) as {
        data?: { id: string; secret_token: string };
        error?: { message?: string };
      };
      if (!res.ok || !json.data) {
        setError(json.error?.message ?? (isId ? 'Gagal mengirim.' : 'Failed to submit.'));
        return;
      }
      setResult(json.data);
    } catch {
      setError(isId ? 'Gagal mengirim.' : 'Failed to submit.');
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    const privateUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}/jasa/order?token=${result.secret_token}&kind=PCB_LAYOUT`
        : `/jasa/order?token=${result.secret_token}&kind=PCB_LAYOUT`;
    return (
      <div className="rumus-result">
        <h3>{isId ? 'Brief PCB terkirim' : 'PCB brief submitted'}</h3>
        <p>
          {isId
            ? 'Status: Menunggu pemeriksaan Admin (kelayakan, revisi, serah-terima). Harga ditetapkan Madevi setelah brief diperiksa.'
            : 'Status: Pending Admin review (feasibility, revisions, handover). Madevi sets the price after reviewing the brief.'}
        </p>
        <h4>{isId ? 'Tautan private Anda (rahasia)' : 'Your private link (secret)'}</h4>
        <p className="invitation-link">
          <a href={privateUrl}>{privateUrl}</a>
        </p>
      </div>
    );
  }

  return (
    <form className="info-form pcb-order-form" onSubmit={submit}>
      <div className="pcb-order-form__emulator-tip">
        <p>{isId
          ? '💡 Punya ide rangkaian? Uji dulu di Emulator Sirkuit — cek apakah jalan dan aman sebelum pesan jasa desain.'
          : '💡 Have a circuit idea? Test it in the Circuit Emulator first — check if it works and is safe before ordering.'}</p>
        <a href="/alat-bantu/emulator" className="button button--secondary" target="_blank" rel="noopener">
          {isId ? 'Buka Emulator Sirkuit' : 'Open Circuit Emulator'}
        </a>
      </div>
      <label className="info-form__field">
        <span>{isId ? 'Deskripsi rangkaian + skematik yang dimiliki (min. 20 karakter)' : 'Circuit description + schematics you have (min. 20 characters)'}</span>
        <textarea value={circuit} onChange={(e) => setCircuit(e.currentTarget.value)} required minLength={20} maxLength={8000} />
      </label>
      <div className="info-form__field">
        <span>{isId ? 'Dimensi board (mm)' : 'Board dimensions (mm)'}</span>
        <div className="pcb-order-form__pair">
          <input
            value={width}
            onChange={(e) => setWidth(e.currentTarget.value)}
            type="number"
            min={1}
            step="any"
            required
            placeholder={isId ? 'Lebar' : 'Width'}
            aria-label={isId ? 'Lebar (mm)' : 'Width (mm)'}
          />
          <input
            value={height}
            onChange={(e) => setHeight(e.currentTarget.value)}
            type="number"
            min={1}
            step="any"
            required
            placeholder={isId ? 'Tinggi' : 'Height'}
            aria-label={isId ? 'Tinggi (mm)' : 'Height (mm)'}
          />
        </div>
      </div>
      <div className="info-form__field">
        <span>{isId ? 'Jumlah layer' : 'Layer count'}</span>
        <div className="capsule-group" role="group" aria-label="Layer">
          {LAYERS.map((l) => (
            <button
              key={l}
              type="button"
              className={`capsule-btn${layers === l ? ' capsule-btn--active' : ''}`}
              onClick={() => setLayers(l)}
              aria-pressed={layers === l}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <label className="info-form__field">
        <span>{isId ? 'Bentuk board' : 'Board shape'}</span>
        <select value={shape} onChange={(e) => setShape(e.currentTarget.value)}>
          <option value="RECTANGULAR">{isId ? 'Persegi' : 'Rectangular'}</option>
          <option value="CIRCULAR">{isId ? 'Lingkaran' : 'Circular'}</option>
          <option value="CUSTOM">{isId ? 'Kustom' : 'Custom'}</option>
        </select>
      </label>
      <div className="info-form__field">
        <span>{isId ? 'Tegangan/arus maksimum' : 'Maximum voltage/current'}</span>
        <div className="pcb-order-form__pair">
          <input
            value={maxVolt}
            onChange={(e) => setMaxVolt(e.currentTarget.value)}
            type="number"
            min={0}
            step="any"
            required
            placeholder="Vmax (V)"
            aria-label="Vmax (V)"
          />
          <input
            value={maxAmpere}
            onChange={(e) => setMaxAmpere(e.currentTarget.value)}
            type="number"
            min={0}
            step="any"
            required
            placeholder="Imax (A)"
            aria-label="Imax (A)"
          />
        </div>
      </div>
      <label className="info-form__field">
        <span>{isId ? 'Target fabrikasi (opsional)' : 'Target fab house (optional)'}</span>
        <input
          value={fabHouse}
          onChange={(e) => setFabHouse(e.currentTarget.value)}
          maxLength={120}
          placeholder="JLCPCB / PCBWay / Lokal"
        />
      </label>
      <fieldset className="info-form__field">
        <legend>{isId ? 'Batasan manufaktur & keselamatan' : 'Manufacturing & safety flags'}</legend>
        {FLAG_KEYS.map((k) => (
          <label key={k} className="pcb-order-form__check">
            <input
              type="checkbox"
              checked={flags[k]}
              onChange={(e) => setFlags((p) => ({ ...p, [k]: e.currentTarget.checked }))}
            />
            <span>{isId ? FLAG_LABEL[k].id : FLAG_LABEL[k].en}</span>
          </label>
        ))}
      </fieldset>
      <fieldset className="info-form__field">
        <legend>Deliverable</legend>
        {DELIVERABLES.map((d) => (
          <label key={d} className="pcb-order-form__check">
            <input
              type="checkbox"
              checked={deliverables.includes(d)}
              onChange={() => toggleDeliverable(d)}
            />
            <span>{d}</span>
          </label>
        ))}
      </fieldset>
      <label className="info-form__field pcb-order-form__safety">
        <input
          type="checkbox"
          checked={disclaimer}
          onChange={(e) => setDisclaimer(e.currentTarget.checked)}
          required
        />
        <span className="article-safety">{PCB_SAFETY_DISCLAIMER.text}</span>
      </label>
      {error && (
        <p className="info-form__status" role="alert">
          {error}
        </p>
      )}
      <button className="button" disabled={busy} type="submit">
        {busy ? (isId ? 'Mengirim…' : 'Sending…') : isId ? 'Kirim brief PCB' : 'Submit PCB brief'}
      </button>
    </form>
  );
}
