'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useLanguage } from './theme-provider';
import { RumusPanel } from './jasa/rumus-panel';
import { PdfPanel } from './jasa/pdf-panel';
import { CareerPanel } from './jasa/career-panel';
import { CircuitEmulator } from './circuit-emulator';

type Tab = 'RUMUS' | 'PDF' | 'KARIER' | 'EMULATOR';
type ToolGroupId = 'CALCULATION' | 'DOCUMENTS' | 'GENERATORS' | 'CIRCUITS';

type ToolGroup = {
  id: ToolGroupId;
  labelId: string;
  labelEn: string;
  detailId: string;
  detailEn: string;
};

type ToolWorkspace = {
  id: string;
  tab: Tab;
  groupId: ToolGroupId;
  labelId: string;
  labelEn: string;
  detailId: string;
  detailEn: string;
  workspaceId: string;
  workspaceEn: string;
};

const TOOL_GROUPS: ToolGroup[] = [
  {
    id: 'CALCULATION',
    labelId: 'Hitung & Rumus',
    labelEn: 'Calculations & Formulas',
    detailId: 'Kalkulator deterministik untuk nilai, satuan, dan langkah hitung.',
    detailEn: 'Deterministic calculators for values, units, and working steps.',
  },
  {
    id: 'DOCUMENTS',
    labelId: 'Dokumen & Berkas',
    labelEn: 'Documents & Files',
    detailId: 'Olah berkas lokal tanpa unggahan ke layanan luar.',
    detailEn: 'Process local files without an external upload service.',
  },
  {
    id: 'GENERATORS',
    labelId: 'Generator',
    labelEn: 'Generators',
    detailId: 'Bangun hasil baru dari data yang Anda isi sendiri.',
    detailEn: 'Build a new result from details you provide yourself.',
  },
  {
    id: 'CIRCUITS',
    labelId: 'Elektronika',
    labelEn: 'Electronics',
    detailId: 'Rangkai sirkuit DC ideal untuk pembelajaran.',
    detailEn: 'Build ideal DC circuits for learning.',
  },
];

const TOOL_WORKSPACES: ToolWorkspace[] = [
  {
    id: 'rumus',
    tab: 'RUMUS',
    groupId: 'CALCULATION',
    labelId: 'Kalkulator Rumus',
    labelEn: 'Calculations & Formulas',
    detailId: 'Hitung dari nilai Anda, lalu periksa hasil beserta langkahnya.',
    detailEn: 'Calculate from your values, then review the result and its working.',
    workspaceId: 'Pilih formula, masukkan nilai, lalu periksa hasil dan langkah hitungnya sebelum menyimpan.',
    workspaceEn: 'Choose a formula, enter the values, then review the result and its working before saving.',
  },
  {
    id: 'pdf',
    tab: 'PDF',
    groupId: 'DOCUMENTS',
    labelId: 'PDF',
    labelEn: 'Documents & PDF',
    detailId: 'Periksa, gabungkan, pisahkan, putar, susun ulang, atau optimalkan PDF.',
    detailEn: 'Inspect, merge, split, rotate, reorder, or optimize PDF files.',
    workspaceId: 'File diproses sesuai operasi yang dipilih. Hasil baru dibuat setelah proses selesai.',
    workspaceEn: 'Files are processed only for the operation you choose. Output is created after processing finishes.',
  },
  {
    id: 'career',
    tab: 'KARIER',
    groupId: 'GENERATORS',
    labelId: 'Dokumen Karier',
    labelEn: 'Career Documents',
    detailId: 'Susun CV, surat lamaran, atau portofolio lalu ekspor atau simpan privat.',
    detailEn: 'Build a CV, cover letter, or portfolio, then export or save it privately.',
    workspaceId: 'Pilih jenis dan gaya dokumen, isi data Anda, lalu tinjau hasil hidup sebelum mengekspor.',
    workspaceEn: 'Choose a document type and style, enter your details, then review the live result before exporting.',
  },
  {
    id: 'emulator',
    tab: 'EMULATOR',
    groupId: 'CIRCUITS',
    labelId: 'Emulator Sirkuit DC',
    labelEn: 'DC Circuit Emulator',
    detailId: 'Rangkai dan hitung kondisi tunak rangkaian DC linear.',
    detailEn: 'Build and solve linear DC steady-state circuits.',
    workspaceId: 'Kanvas rangkaian, komponen ideal, serta hasil tegangan dan arus pendidikan.',
    workspaceEn: 'Circuit canvas, ideal components, and educational voltage/current results.',
  },
];

function ToolWorkspaceIcon({ tab }: { tab: Tab }) {
  if (tab === 'EMULATOR') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 12h5m8 0h5M8 8v8m8-8v8M10 6h4v12h-4z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (tab === 'PDF') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 3.5h7.6L19 7.9V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 20V5a1.5 1.5 0 0 1 1-1.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M14 3.5V9h5M9 14h6m-6 3h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (tab === 'KARIER') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 20.5V6.7A1.7 1.7 0 0 1 6.7 5h3.1l1.5 1.8h6A1.7 1.7 0 0 1 19 8.5v12H5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M8.5 12h7m-7 3.5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 5.5h14M5 18.5h14M8 5.5v13m8-13v13M4 9h4m8 0h4m-12 6h4m4 0h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="m11.1 11.1 1.8 1.8m0-1.8-1.8 1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ToolGroupIcon({ groupId }: { groupId: ToolGroupId }) {
  if (groupId === 'CIRCUITS') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 12h4m10 0h4M7 8v8m10-8v8M9 6h6v12H9z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (groupId === 'DOCUMENTS') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 3.5h8l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M14 3.5v4h4M9 12h6m-6 3h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (groupId === 'GENERATORS') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 18.5 12 5l7 13.5M7.2 14h9.6M9.2 18.5h5.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m17.2 4.2.4 1.2 1.2.4-1.2.4-.4 1.2-.4-1.2-1.2-.4 1.2-.4.4-1.2Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 5.5h14M5 18.5h14M8 5.5v13m8-13v13M4 9h4m8 0h4m-12 6h4m4 0h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="m11.1 11.1 1.8 1.8m0-1.8-1.8 1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function DropdownChevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m7 9.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UtilitiesPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const isId = language === 'id';

  const requestedTab = searchParams?.get('tab')?.toUpperCase();
  const isEmulatorRoute = pathname === '/alat-bantu/emulator';
  const activeTab: Tab = isEmulatorRoute
    ? 'EMULATOR'
    : requestedTab === 'PDF' || requestedTab === 'KARIER' || requestedTab === 'RUMUS'
      ? requestedTab
      : 'RUMUS';
  const activeWorkspace = TOOL_WORKSPACES.find((workspace) => workspace.tab === activeTab) ?? TOOL_WORKSPACES[0];
  const [selectedGroupId, setSelectedGroupId] = useState<ToolGroupId>(activeWorkspace.groupId);
  const [openSelector, setOpenSelector] = useState<'GROUPS' | 'TOOLS' | null>(null);
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedGroupId(activeWorkspace.groupId);
    setOpenSelector(null);
  }, [activeWorkspace.groupId]);

  useEffect(() => {
    function closeOnOutsidePointer(event: PointerEvent) {
      if (!selectorRef.current?.contains(event.target as Node)) setOpenSelector(null);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpenSelector(null);
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const selectedGroup = TOOL_GROUPS.find((group) => group.id === selectedGroupId) ?? TOOL_GROUPS[0];
  const selectedGroupTools = TOOL_WORKSPACES.filter((workspace) => workspace.groupId === selectedGroup.id);
  const selectedTool = activeWorkspace.groupId === selectedGroup.id
    ? selectedGroupTools.find((workspace) => workspace.tab === activeTab) ?? null
    : null;
  const activeGroup = TOOL_GROUPS.find((group) => group.id === activeWorkspace.groupId) ?? TOOL_GROUPS[0];
  function setToolsTab(tab: Tab) {
    if (tab === activeTab) return;
    if (tab === 'EMULATOR') {
      router.push('/alat-bantu/emulator', { scroll: false });
      return;
    }
    router.push(`/alat-bantu?tab=${tab.toLowerCase()}`, { scroll: false });
  }

  return (
    <div className="page-shell utilities-page">

      {isEmulatorRoute ? (
        <>
          <CircuitEmulator />
        </>
      ) : (
        <>
          <header className="utilities-page__header utilities-page__header--compact">
            <div>
              <p className="eyebrow">MADEVI TOOLS</p>
              <h1>{isId ? 'Alat bantu untuk pekerjaan nyata' : 'Utilities for practical work'}</h1>
              <p className="utilities-page__sub">
                {isId
                  ? 'Pilih kelompok alat, lalu pilih alat yang benar-benar tersedia. Setiap workspace menjelaskan apa yang diproses dan kapan hasil dapat disimpan.'
                  : 'Choose a tool group, then an available tool. Every workspace states what it processes and when a result can be saved.'}
              </p>
            </div>
          </header>

          <section className="tools-workbench" aria-label={isId ? 'Ruang kerja alat bantu' : 'Tools workspace'}>
            <div ref={selectorRef} className="tools-workbench__selector-bar" role="group" aria-label={isId ? 'Pemilih alat bantu' : 'Tools selector'}>
              <div className="tools-workbench__selector">
                <button
                  type="button"
                  className={`tools-workbench__selector-button${openSelector === 'GROUPS' ? ' tools-workbench__selector-button--open' : ''}`}
                  onClick={() => setOpenSelector((current) => current === 'GROUPS' ? null : 'GROUPS')}
                  aria-expanded={openSelector === 'GROUPS'}
                  aria-haspopup="true"
                  aria-controls="tools-groups-menu"
                >
                  <span className="tools-workbench__selector-icon"><ToolGroupIcon groupId={selectedGroup.id} /></span>
                  <span className="tools-workbench__selector-copy">
                    <small>{isId ? 'Kelompok alat' : 'Tool group'}</small>
                    <strong>{isId ? selectedGroup.labelId : selectedGroup.labelEn}</strong>
                  </span>
                  <span className="tools-workbench__selector-chevron"><DropdownChevron /></span>
                </button>

                <div id="tools-groups-menu" className="tools-workbench__selector-menu" role="group" hidden={openSelector !== 'GROUPS'} aria-label={isId ? 'Pilih kelompok alat' : 'Choose a tool group'}>
                  <p>{isId ? 'Pilih kelompok alat' : 'Choose a tool group'}</p>
                  {TOOL_GROUPS.map((group) => {
                    const selected = group.id === selectedGroup.id;
                    return (
                      <button
                        key={group.id}
                        type="button"
                        className={`tools-workbench__selector-option${selected ? ' tools-workbench__selector-option--selected' : ''}`}
                        onClick={() => {
                          setSelectedGroupId(group.id);
                          setOpenSelector('TOOLS');
                        }}
                        aria-pressed={selected}
                      >
                        <span className="tools-workbench__selector-option-icon"><ToolGroupIcon groupId={group.id} /></span>
                        <span>
                          <strong>{isId ? group.labelId : group.labelEn}</strong>
                          <small>{isId ? group.detailId : group.detailEn}</small>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="tools-workbench__selector">
                <button
                  type="button"
                  className={`tools-workbench__selector-button${openSelector === 'TOOLS' ? ' tools-workbench__selector-button--open' : ''}`}
                  onClick={() => setOpenSelector((current) => current === 'TOOLS' ? null : 'TOOLS')}
                  aria-expanded={openSelector === 'TOOLS'}
                  aria-haspopup="true"
                  aria-controls="tools-options-menu"
                >
                  <span className="tools-workbench__selector-icon">
                    {selectedTool
                      ? <ToolWorkspaceIcon tab={selectedTool.tab} />
                      : <ToolGroupIcon groupId={selectedGroup.id} />}
                  </span>
                  <span className="tools-workbench__selector-copy">
                    <small>{isId ? 'Pilihan alat' : 'Tool choice'}</small>
                    <strong>
                      {selectedTool
                        ? (isId ? selectedTool.labelId : selectedTool.labelEn)
                        : (isId ? 'Pilih alat' : 'Choose a tool')}
                    </strong>
                  </span>
                  <span className="tools-workbench__selector-chevron"><DropdownChevron /></span>
                </button>

                <div id="tools-options-menu" className="tools-workbench__selector-menu" role="group" hidden={openSelector !== 'TOOLS'} aria-label={isId ? `Pilih alat dalam ${selectedGroup.labelId}` : `Choose a tool in ${selectedGroup.labelEn}`}>
                  <p>{isId ? `Alat tersedia: ${selectedGroup.labelId}` : `Available tools: ${selectedGroup.labelEn}`}</p>
                  {selectedGroupTools.map((workspace) => {
                    const selected = workspace.tab === activeTab;
                    return (
                      <button
                        key={workspace.id}
                        type="button"
                        className={`tools-workbench__selector-option${selected ? ' tools-workbench__selector-option--selected' : ''}`}
                        onClick={() => {
                          setToolsTab(workspace.tab);
                          setOpenSelector(null);
                        }}
                        aria-current={selected ? 'page' : undefined}
                      >
                        <span className="tools-workbench__selector-option-icon"><ToolWorkspaceIcon tab={workspace.tab} /></span>
                        <span>
                          <strong>{isId ? workspace.labelId : workspace.labelEn}</strong>
                          <small>{isId ? workspace.detailId : workspace.detailEn}</small>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <section className="tools-workbench__panel" aria-labelledby="tools-workspace-title">
              <header className="tools-workbench__panel-heading">
                <p className="eyebrow">
                  {isId
                    ? `${activeGroup.labelId} · ruang aktif`
                    : `${activeGroup.labelEn} · active workspace`}
                </p>
                <h2 id="tools-workspace-title">{isId ? activeWorkspace.labelId : activeWorkspace.labelEn}</h2>
                <p>{isId ? activeWorkspace.workspaceId : activeWorkspace.workspaceEn}</p>
              </header>
              {activeTab === 'RUMUS' && <RumusPanel isId={isId} />}
              {activeTab === 'PDF' && <PdfPanel isId={isId} />}
              {activeTab === 'KARIER' && <CareerPanel isId={isId} />}
            </section>
          </section>
        </>
      )}
    </div>
  );
}