'use client';

/**
 * InvitationOnline — halaman undangan final (Prompt 06)
 * Hanya render bila order APPROVED/COMPLETED. Tanpa data -> status netral.
 * Dukungan dua output: Online interaktif + tombol Printable (window.print).
 */

import { INVITATION_TEMPLATE_COLORS } from '@/lib/theme-values';

interface OrderRow {
  id: string;
  groom_name: string;
  bride_name: string;
  event_date: string | Date | null;
  venue: string;
  city: string;
  note: string;
  package_format: string;
  template_name?: string;
  template_layout?: unknown;
}

interface TemplateLayout {
  design?: string;
  colors?: { primary?: string; accent?: string };
}

function getTemplateDesign(layout: unknown): TemplateLayout {
  if (layout && typeof layout === 'object') {
    const l = layout as TemplateLayout;
    return { design: l.design, colors: l.colors };
  }
  return {};
}

function formatDate(value: string | Date | null, isId: boolean): string {
  if (!value) return '';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(isId ? 'id-ID' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export function InvitationOnline({
  order,
  isId = true,
}: {
  order: OrderRow | null;
  isId?: boolean;
}) {
  if (!order) {
    return (
      <div className="r1-empty">
        <p className="r1-empty-title">
          {isId ? 'Undangan belum tersedia.' : 'Invitation is not available yet.'}
        </p>
        <p className="r1-empty-hint">
          {isId
            ? 'Tautan ini akan aktif setelah Admin menyetujui dan menyelesaikan undangan.'
            : 'This link activates after the Admin approves and completes the invitation.'}
        </p>
      </div>
    );
  }

  const dateLabel = formatDate(order.event_date, isId);
  const showPrint = order.package_format === 'PRINT' || order.package_format === 'BOTH';
  const template = getTemplateDesign(order.template_layout);
  const isModern = template.design === 'modern-minimalis';
  const fallback = isModern ? INVITATION_TEMPLATE_COLORS.modern : INVITATION_TEMPLATE_COLORS.classic;
  const primary = template.colors?.primary || fallback.primary;
  const accent = template.colors?.accent || fallback.accent;

  return (
    <article className={`invitation-online${isModern ? ' invitation-online--modern' : ' invitation-online--classic'}`}>
      <div className="invitation-online__frame" style={{ ['--inv-primary' as string]: primary, ['--inv-accent' as string]: accent }}>
        {!isModern && (
          <div className="invitation-online__ornament" aria-hidden="true">❦</div>
        )}
        <p className="invitation-online__kicker">
          {order.template_name || (isId ? 'Undangan Pernikahan' : 'Wedding Invitation')}
        </p>
        <h1 className="invitation-online__names">
          {order.groom_name} <span aria-hidden="true">&amp;</span> {order.bride_name}
        </h1>
        {dateLabel && <p className="invitation-online__date">{dateLabel}</p>}
        {(order.venue || order.city) && (
          <p className="invitation-online__venue">
            {[order.venue, order.city].filter(Boolean).join(', ')}
          </p>
        )}
        {order.note && <p className="invitation-online__note">{order.note}</p>}
        {!isModern && (
          <div className="invitation-online__ornament" aria-hidden="true">❦</div>
        )}

        {showPrint && (
          <button
            type="button"
            className="button button--secondary button--small"
            onClick={() => window.print()}
          >
            {isId ? 'Unduh / Cetak PDF' : 'Download / Print PDF'}
          </button>
        )}
        <p className="invitation-online__hint">
          {isId
            ? 'Gunakan tombol di atas, lalu pilih "Simpan sebagai PDF" di dialog cetak.'
            : 'Use the button above, then choose "Save as PDF" in the print dialog.'}
        </p>
      </div>
    </article>
  );
}
