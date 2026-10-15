'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { useLanguage } from './theme-provider';
import { InvitationGallery } from './jasa/invitation-gallery';
import { CustomOrderForm } from './jasa/custom-order-form';
import { PcbOrderForm } from './jasa/pcb-order-form';
import { LogoServicePanel } from './jasa/logo-service-panel';

type JasaTab = 'LAYOUTS' | 'CUSTOM' | 'PCB' | 'LOGO' | 'UNDANGAN';

type ServicePath = {
  id: JasaTab;
  index: string;
  label: string;
  labelEn: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  workflow: string[];
  workflowEn: string[];
  priceNote: string;
  priceNoteEn: string;
};

const SERVICE_PATHS: ServicePath[] = [
  {
    id: 'LAYOUTS',
    index: '01',
    label: 'Madevi Layouts',
    labelEn: 'Madevi Layouts',
    title: 'Pilih layout yang sudah diterbitkan',
    titleEn: 'Choose a published layout',
    description: 'Telusuri template undangan yang tersedia, periksa format serta harga yang tercantum, lalu kirim detail acara untuk ditinjau.',
    descriptionEn: 'Browse available invitation templates, review their listed formats and prices, then submit event details for review.',
    workflow: ['Pilih layout', 'Periksa detail', 'Kirim data acara'],
    workflowEn: ['Choose a layout', 'Review details', 'Send event details'],
    priceNote: 'Mulai dari Rp30rb',
    priceNoteEn: 'From Rp30k',
  },
  {
    id: 'CUSTOM',
    index: '02',
    label: 'Desain Kustom',
    labelEn: 'Custom Design',
    title: 'Susun brief proyek',
    titleEn: 'Build a project brief',
    description: 'Jelaskan kebutuhan desain Anda dengan cukup rinci agar ruang lingkup, harga, dan jadwal dapat direview sebelum ada kesepakatan.',
    descriptionEn: 'Describe the design need clearly enough for scope, price, and timing to be reviewed before any agreement is made.',
    workflow: ['Isi brief', 'Review kebutuhan', 'Terima penawaran'],
    workflowEn: ['Write the brief', 'Review the need', 'Receive a quote'],
    priceNote: 'Harga setelah review',
    priceNoteEn: 'Priced after review',
  },
  {
    id: 'PCB',
    index: '03',
    label: 'Layout PCB',
    labelEn: 'PCB Layout',
    title: 'Ajukan kebutuhan layout PCB',
    titleEn: 'Request a PCB layout',
    description: 'Kirim skematik dan batas manufaktur. Kelayakan serta kebutuhan keselamatan direview sebelum penawaran pengerjaan dibuat.',
    descriptionEn: 'Send the schematic and manufacturing constraints. Feasibility and safety requirements are reviewed before a production quote is created.',
    workflow: ['Kirim skematik', 'Review manufaktur', 'Setujui penawaran'],
    workflowEn: ['Send schematic', 'Manufacturing review', 'Approve quote'],
    priceNote: 'Harga setelah review',
    priceNoteEn: 'Priced after review',
  },
  {
    id: 'LOGO',
    index: '04',
    label: 'Desain Logo',
    labelEn: 'Logo Design',
    title: 'Pesan desain logo profesional',
    titleEn: 'Order a professional logo',
    description: 'Logo vektor profesional + paket brand. Ceritakan usaha Anda, terima konsep, revisi hingga cocok.',
    descriptionEn: 'Professional vector logo + brand package. Tell us about your business, receive concepts, revise until perfect.',
    workflow: ['Isi brief brand', 'Terima konsep', 'Revisi & final'],
    workflowEn: ['Write brand brief', 'Receive concepts', 'Revise & finalize'],
    priceNote: 'Harga setelah review',
    priceNoteEn: 'Priced after review',
  },
  {
    id: 'UNDANGAN',
    index: '05',
    label: 'Undangan Digital',
    labelEn: 'Digital Invitation',
    title: 'Buat undangan pernikahan digital',
    titleEn: 'Create a digital wedding invitation',
    description: 'Pilih template, isi detail acara, dapatkan URL publik + PDF cetak. Satu paket berisi 2 template desain.',
    descriptionEn: 'Choose a template, fill event details, get a public URL + printable PDF. One package includes 2 design templates.',
    workflow: ['Pilih template', 'Isi detail acara', 'Terima URL + PDF'],
    workflowEn: ['Choose template', 'Fill event details', 'Receive URL + PDF'],
    priceNote: 'Mulai dari Rp30rb',
    priceNoteEn: 'From Rp30k',
  },
];

function ServicePathIcon({ path }: { path: JasaTab }) {
  if (path === 'CUSTOM') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m14.5 5.5 4 4M4 20l3.6-.8L19 7.8a2.8 2.8 0 0 0-4-4L3.6 15.2 4 20Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m13.5 5.3 5.2 5.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (path === 'PCB') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M9 2v3m6-3v3M9 19v3m6-3h3M2 9h3m-3 6h3m14-6h3m-3 6h3M9 9h6v6H9z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (path === 'LOGO') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 7v10M8.5 9.5 12 7l3.5 2.5M8.5 14.5 12 17l3.5-2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (path === 'UNDANGAN') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="m4 8 8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3.5h8.3L19 8.2V20a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20V5a1.5 1.5 0 0 1 1-1.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 3.5V9h5M8.5 13h7m-7 3.5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function JasaPage() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTab = searchParams?.get('tab')?.toUpperCase();
  const activeTab: JasaTab =
    requestedTab === 'CUSTOM' || requestedTab === 'PCB' || requestedTab === 'LAYOUTS' || requestedTab === 'LOGO' || requestedTab === 'UNDANGAN'
      ? requestedTab
      : 'LAYOUTS';
  const activeService = SERVICE_PATHS.find((path) => path.id === activeTab) ?? SERVICE_PATHS[0];

  function setServiceTab(tab: JasaTab) {
    if (tab === activeTab) return;
    router.push(`/jasa?tab=${tab.toLowerCase()}`, { scroll: false });
  }

  return (
    <div className="page-shell jasa-page">

      <div className="jasa-page__content">
        <header className="jasa-page__intro jasa-page__intro--compact">
          <div className="jasa-page__intro-copy">
            <p className="eyebrow jasa-page__eyebrow">MADEVI SERVICES</p>
            <h1>{isId ? 'Ruang kerja untuk memulai pesanan' : 'A workspace to start an order'}</h1>
            <p className="jasa-page__intro-description">
              {isId
                ? 'Pilih jalur yang sesuai. Template, brief, dan kebutuhan teknis dipisahkan agar tiap pesanan dimulai dengan informasi yang tepat.'
                : 'Choose the relevant path. Templates, briefs, and technical needs stay separate so every order starts with the right information.'}
            </p>
          </div>
          <p className="jasa-page__operating-note" role="note">
            {isId
              ? 'Harga dan jadwal ditetapkan setelah review. Tidak ada checkout otomatis di ruang ini.'
              : 'Price and timing are set after review. This space has no automatic checkout.'}
          </p>
        </header>

        <section className="services-workbench" aria-label={isId ? 'Ruang kerja layanan' : 'Service workspace'}>
          <nav className="services-workbench__navigator" aria-label={isId ? 'Pilih jalur layanan' : 'Choose a service path'}>
            <div className="services-workbench__navigator-heading">
              <p className="eyebrow">{isId ? 'Jalur layanan' : 'Service paths'}</p>
              <p>{isId ? 'Lima layanan, lima alur yang berbeda.' : 'Five services, five distinct workflows.'}</p>
            </div>
            <div className="services-workbench__path-list">
              {SERVICE_PATHS.map((path) => {
                const selected = path.id === activeTab;
                return (
                  <button
                    key={path.id}
                    type="button"
                    className={`services-workbench__path${selected ? ' services-workbench__path--active' : ''}`}
                    onClick={() => setServiceTab(path.id)}
                    aria-pressed={selected}
                  >
                    <span className="services-workbench__path-index" aria-hidden="true">{path.index}</span>
                    <span className="services-workbench__path-icon"><ServicePathIcon path={path.id} /></span>
                    <span className="services-workbench__path-copy">
                      <strong>{isId ? path.label : path.labelEn}</strong>
                      <span>{isId ? path.description : path.descriptionEn}</span>
                    </span>
                    <svg className="services-workbench__path-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h13m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                );
              })}
            </div>
          </nav>

          <section className="services-workbench__panel" aria-labelledby="service-workspace-title">
            <header className="services-workbench__panel-heading">
              <p className="eyebrow">{activeService.index} · {isId ? activeService.label : activeService.labelEn}</p>
              <h2 id="service-workspace-title">{isId ? activeService.title : activeService.titleEn}</h2>
              <p>{isId ? activeService.description : activeService.descriptionEn}</p>
              <p className="services-workbench__price-note">
                <strong>{isId ? activeService.priceNote : activeService.priceNoteEn}</strong>
              </p>
              <ol className="services-workbench__steps" aria-label={isId ? 'Tahapan layanan' : 'Service steps'}>
                {(isId ? activeService.workflow : activeService.workflowEn).map((step, index) => (
                  <li key={step}><span aria-hidden="true">{index + 1}</span>{step}</li>
                ))}
              </ol>
            </header>

            {activeTab === 'LAYOUTS' && <InvitationGallery isId={isId} />}
            {activeTab === 'CUSTOM' && <CustomOrderForm isId={isId} />}
            {activeTab === 'PCB' && <PcbOrderForm isId={isId} />}
            {activeTab === 'LOGO' && <LogoServicePanel isId={isId} />}
            {activeTab === 'UNDANGAN' && <InvitationGallery isId={isId} />}
          </section>
        </section>
      </div>
    </div>
  );
}
