'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/theme-provider';

type PricingStatus = 'FIXED' | 'QUOTE_PENDING' | 'QUOTED';

interface PrivateServiceOrder {
  id: string;
  kind: 'CUSTOM_DESIGN' | 'PCB_LAYOUT' | 'LAYOUT' | 'UNDANGAN' | 'LOGO';
  status: string;
  revisionCount: number;
  revisionLimit: number;
  priceSnapshot: {
    serviceTitle: string;
    snapshotPrice: number;
    currency: 'IDR';
    pricingStatus: PricingStatus;
  };
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

const STATUS: Record<string, { id: string; en: string }> = {
  PENDING_APPROVAL: { id: 'Brief sedang diperiksa Admin', en: 'Brief is under Admin review' },
  APPROVED: { id: 'Penawaran disetujui dan masuk antrean', en: 'Quote approved and queued' },
  IN_REVISION: { id: 'Sedang dalam revisi', en: 'In revision' },
  COMPLETED: { id: 'Selesai', en: 'Completed' },
  REJECTED: { id: 'Tidak dapat diproses', en: 'Cannot be processed' },
  ARCHIVED: { id: 'Diarsipkan', en: 'Archived' },
};

function kindLabel(kind: PrivateServiceOrder['kind'], isId: boolean) {
  const labels: Record<PrivateServiceOrder['kind'], { id: string; en: string }> = {
    CUSTOM_DESIGN: { id: 'Desain custom', en: 'Custom design' },
    PCB_LAYOUT: { id: 'Desain layout PCB', en: 'PCB layout design' },
    LAYOUT: { id: 'Layout Madevi', en: 'Madevi layout' },
    UNDANGAN: { id: 'Undangan', en: 'Invitation' },
    LOGO: { id: 'Logo & banner', en: 'Logo & banner' },
  };
  return isId ? labels[kind].id : labels[kind].en;
}

export function PrivateServiceOrderViewer({ token }: { token?: string }) {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [order, setOrder] = useState<PrivateServiceOrder | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading');

  useEffect(() => {
    if (!token) {
      setState('missing');
      return;
    }
    let active = true;
    fetch(`/api/v1/jasa/order/${encodeURIComponent(token)}`, { cache: 'no-store' })
      .then(async (response) => ({ response, body: await response.json() }))
      .then(({ response, body }) => {
        if (!active) return;
        if (!response.ok || !body?.data) {
          setState('missing');
          return;
        }
        setOrder(body.data as PrivateServiceOrder);
        setState('ready');
      })
      .catch(() => {
        if (active) setState('missing');
      });
    return () => {
      active = false;
    };
  }, [token]);

  if (state === 'loading') {
    return (
      <p className="private-order__state">
        {isId ? 'Memuat status pesanan…' : 'Loading order status…'}
      </p>
    );
  }

  if (!order) {
    return (
      <section className="private-order__state private-order__state--empty">
        <h1>{isId ? 'Akses private tidak ditemukan' : 'Private access was not found'}</h1>
        <p>
          {isId
            ? 'Gunakan tautan rahasia yang dikirim Madevi. Tautan yang dicabut atau kedaluwarsa tidak dapat dibuka.'
            : 'Use the secret link sent by Madevi. Revoked or expired links cannot be opened.'}
        </p>
      </section>
    );
  }

  const status = STATUS[order.status] ?? { id: order.status, en: order.status };
  const isQuotePending = order.priceSnapshot.pricingStatus === 'QUOTE_PENDING';
  const formattedPrice = new Intl.NumberFormat(isId ? 'id-ID' : 'en-US', {
    style: 'currency',
    currency: order.priceSnapshot.currency,
    maximumFractionDigits: 0,
  }).format(order.priceSnapshot.snapshotPrice);

  return (
    <article className="private-order">
      <p className="eyebrow">{kindLabel(order.kind, isId)}</p>
      <h1>{order.priceSnapshot.serviceTitle || kindLabel(order.kind, isId)}</h1>
      <dl className="private-order__details">
        <div>
          <dt>{isId ? 'Status' : 'Status'}</dt>
          <dd>{isId ? status.id : status.en}</dd>
        </div>
        <div>
          <dt>{isId ? 'Harga' : 'Price'}</dt>
          <dd>
            {isQuotePending
              ? isId
                ? 'Menunggu penawaran Madevi'
                : 'Awaiting Madevi quote'
              : formattedPrice}
          </dd>
        </div>
        <div>
          <dt>{isId ? 'Revisi' : 'Revisions'}</dt>
          <dd>
            {order.revisionCount}/{order.revisionLimit}
          </dd>
        </div>
      </dl>
      <p className="private-order__note">
        {isQuotePending
          ? isId
            ? 'Tidak ada tagihan saat ini. Madevi akan mengirim penawaran berisi harga, scope, revisi, dan hasil untuk Anda setujui sebelum pengerjaan dimulai.'
            : 'There is no charge yet. Madevi will send a quote with price, scope, revisions, and deliverables for your approval before work begins.'
          : isId
            ? 'Harga yang tampil adalah penawaran yang telah dicatat. Perubahan ruang lingkup memerlukan penawaran baru dan persetujuan Anda.'
            : 'The displayed price is the recorded quote. A scope change requires a new quote and your approval.'}
      </p>
    </article>
  );
}
