'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { csrfHeaders } from './csrf-token';
import {
  SIMULATED_PAYMENT_METHODS,
  SIMULATED_PAYMENT_METHOD_LABELS,
  type SimulatedPaymentMethod,
} from '@/contracts/simulation';

type OrderSummary = {
  id: string;
  packageKind: string | null;
  basePrice: number;
  discountAmount: number;
  finalPrice: number;
  status: string;
  isSimulation: boolean;
};

type JsonResult = {
  data?: Record<string, any>;
  error?: { message?: string };
};

async function postJson(url: string, body: Record<string, unknown>): Promise<JsonResult> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...csrfHeaders() },
      body: JSON.stringify(body),
    });
    return (await response.json()) as JsonResult;
  } catch {
    return { error: { message: 'Layanan lokal tidak dapat dijangkau.' } };
  }
}

function rupiah(n: number): string {
  return `Rp${Number(n).toLocaleString('id-ID')}`;
}

/**
 * Halaman pembayaran Mode Simulasi.
 *
 * Alur: ringkasan order -> pilih metode tiruan -> klik "Bayar" ->
 * pembayaran langsung dinyatakan sukses (PAID) -> kode akses diterbitkan ->
 * member me-redeem untuk mengaktifkan paket.
 *
 * JUJUR: badge SIMULASI selalu tampil; tidak ada uang nyata yang bergerak;
 * tidak ada gateway yang dihubungi.
 */
export function PaymentSimulator({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [loadError, setLoadError] = useState('');
  const [method, setMethod] = useState<SimulatedPaymentMethod>('QRIS');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [paidCode, setPaidCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/v1/payment/orders/${encodeURIComponent(orderId)}/pay-simulated`,
          { headers: { ...csrfHeaders() } },
        );
        const json = (await res.json()) as JsonResult;
        if (cancelled) return;
        if (!json.data) {
          setLoadError(json.error?.message ?? 'Order tidak ditemukan.');
          return;
        }
        const d = json.data.data ?? json.data;
        setOrder(d as OrderSummary);
        if ((d as OrderSummary).status === 'PAID') {
          setMessage('Order ini sudah dibayar.');
        }
      } catch {
        if (!cancelled) setLoadError('Layanan lokal tidak dapat dijangkau.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  async function pay() {
    if (!order || order.status === 'PAID') return;
    setPending(true);
    setMessage('');
    const result = await postJson(
      `/api/v1/payment/orders/${encodeURIComponent(orderId)}/pay-simulated`,
      { method },
    );
    setPending(false);
    if (!result.data) {
      setMessage(result.error?.message ?? 'Pembayaran simulasi gagal.');
      return;
    }
    const d = result.data.data ?? result.data;
    if (d.code) setPaidCode(String(d.code));
    setOrder((prev) => (prev ? { ...prev, status: 'PAID' } : prev));
    setMessage(
      `Pembayaran ${SIMULATED_PAYMENT_METHOD_LABELS[method]} berhasil (SIMULASI). Kode akses telah diterbitkan.`,
    );
  }

  async function redeem() {
    if (!paidCode) return;
    setRedeeming(true);
    setMessage('');
    const result = await postJson('/api/v1/payment/redeem', { code: paidCode });
    setRedeeming(false);
    if (!result.data) {
      setMessage(result.error?.message ?? 'Redeem kode gagal.');
      return;
    }
    setMessage('Paket aktif! Mengalihkan ke profil…');
    router.push('/profile');
    router.refresh();
  }

  return (
    <Card asChild variant="floating" className="payment-simulator">
      <section aria-labelledby="pay-title">
        <div className="auth-card__heading">
          <p className="eyebrow">PEMBAYARAN</p>
          <h1 id="pay-title">Bayar Paket</h1>
          <p>
            <strong>Mode SIMULASI</strong> — meniru payment gateway. Tidak ada uang
            nyata yang bergerak dan tidak ada gateway yang dihubungi.
          </p>
        </div>

        {loadError ? (
          <p role="alert">{loadError}</p>
        ) : !order ? (
          <p>Memuat order…</p>
        ) : (
          <>
            <dl>
              <div>
                <dt>Paket</dt>
                <dd>{order.packageKind ?? '-'}</dd>
              </div>
              <div>
                <dt>Total bayar</dt>
                <dd>{rupiah(order.finalPrice)}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{order.status}</dd>
              </div>
            </dl>

            {order.status !== 'PAID' ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void pay();
                }}
              >
                <fieldset>
                  <legend>Metode pembayaran (tiruan)</legend>
                  {SIMULATED_PAYMENT_METHODS.map((m) => (
                    <label key={m}>
                      <input
                        type="radio"
                        name="method"
                        value={m}
                        checked={method === m}
                        onChange={() => setMethod(m)}
                      />
                      {SIMULATED_PAYMENT_METHOD_LABELS[m]}
                    </label>
                  ))}
                </fieldset>
                <Button className="button" type="submit" disabled={pending}>
                  {pending ? 'Memproses…' : `Bayar ${rupiah(order.finalPrice)} (Simulasi)`}
                </Button>
              </form>
            ) : (
              paidCode && (
                <div>
                  <p>Kode akses Anda (SIMULASI — hanya tampil sekali):</p>
                  <code>{paidCode}</code>
                  <Button
                    className="button"
                    type="button"
                    disabled={redeeming}
                    onClick={() => void redeem()}
                  >
                    {redeeming ? 'Mengaktifkan…' : 'Aktifkan Paket'}
                  </Button>
                </div>
              )
            )}

            {message && <p role="status">{message}</p>}
          </>
        )}
      </section>
    </Card>
  );
}
