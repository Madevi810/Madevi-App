'use client';

import { useLanguage } from '@/components/theme-provider';
import { InvitationGallery } from '@/components/jasa/invitation-gallery';
import { InvitationOrderForm } from '@/components/jasa/invitation-order-form';

export function StandaloneInvitationOrder() {
  const { language } = useLanguage();
  const isId = language === 'id';

  return (
    <div className="page-shell jasa-page">
      <header className="jasa-page__intro jasa-page__intro--compact">
        <div className="jasa-page__intro-copy">
          <p className="eyebrow jasa-page__eyebrow">MADEVI SERVICES · INVITATION</p>
          <h1>{isId ? 'Pesan Undangan Baru' : 'Order a New Invitation'}</h1>
          <p className="jasa-page__intro-description">
            {isId
              ? 'Pilih template yang telah diterbitkan atau kirim brief undangan custom. Detail pesanan ditinjau sebelum disepakati.'
              : 'Choose a published template or send a custom invitation brief. Order details are reviewed before anything is agreed.'}
          </p>
        </div>
        <p className="jasa-page__operating-note" role="note">
          {isId
            ? 'Harga dan jadwal ditetapkan setelah review. Tidak ada checkout otomatis di halaman ini.'
            : 'Price and timing are set after review. There is no automatic checkout on this page.'}
        </p>
      </header>

      <section className="services-workbench__panel" aria-labelledby="invitation-order-title">
        <header className="services-workbench__panel-heading">
          <p className="eyebrow">{isId ? 'FORM PESANAN' : 'ORDER FORM'}</p>
          <h2 id="invitation-order-title">
            {isId ? 'Pilih template atau brief custom' : 'Choose a template or a custom brief'}
          </h2>
          <p>
            {isId
              ? 'Template contoh hanya untuk pratinjau dan tidak dapat dipesan. Data acara digunakan untuk meninjau permintaan Anda.'
              : 'Example templates are preview-only and cannot be ordered. Event details are used to review your request.'}
          </p>
        </header>
        <InvitationGallery isId={isId} />
      </section>

      <section
        className="services-workbench__panel invitation-gallery__custom"
        aria-labelledby="custom-brief-title"
      >
        <header className="services-workbench__panel-heading">
          <p className="eyebrow">{isId ? 'BRIEF CUSTOM' : 'CUSTOM BRIEF'}</p>
          <h2 id="custom-brief-title">
            {isId ? 'Punya konsep sendiri?' : 'Have your own concept?'}
          </h2>
          <p>
            {isId
              ? 'Ceritakan kebutuhan undangan Anda. Ruang lingkup dan penawaran ditinjau sebelum disepakati.'
              : 'Describe your invitation needs. Scope and a quote are reviewed before anything is agreed.'}
          </p>
        </header>
        <InvitationOrderForm
          isId={isId}
          templateName={isId ? 'Undangan custom' : 'Custom invitation'}
          templateLabel={isId ? 'Jenis pesanan' : 'Order type'}
        />
      </section>
    </div>
  );
}
