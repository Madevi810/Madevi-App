'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

import { csrfHeaders } from '@/components/csrf-token';
import { useCurrentUser } from '@/components/jasa/use-current-user';
import { useLanguage } from '@/components/theme-provider';
import {
  CIRCUIT_CANVAS_HEIGHT,
  CIRCUIT_CANVAS_WIDTH,
  MAX_CAPACITANCE_FARADS,
  MAX_CIRCUIT_COMPONENTS,
  MAX_CIRCUIT_NODES,
  MAX_CIRCUIT_WIRES,
  MAX_RESISTANCE_OHMS,
  MAX_SOURCE_VOLTS,
  MIN_CAPACITANCE_FARADS,
  MIN_RESISTANCE_OHMS,
  createEmptyCircuit,
  createSampleCircuit,
  validateCircuit,
  type Circuit,
  type CircuitBranchResult,
  type CircuitComponent,
  type CircuitNode,
  type CircuitSolution,
  type CircuitWire,
} from '@/lib/emulator/circuit-model';

import styles from './circuit-emulator.module.css';

type Selection =
  | { kind: 'component'; id: string }
  | { kind: 'node'; id: string }
  | { kind: 'wire'; id: string }
  | null;

type WorkerResponse = {
  requestId: number;
  solution?: CircuitSolution;
  error?: { code: string; message: string };
};

type SavedWorkspace = { id: string; title: string; updated_at?: string };
type CircuitHistory = { past: Circuit[]; future: Circuit[] };
const TYPE_LABELS = {
  RESISTOR: { id: 'Resistor', en: 'Resistor' },
  SOURCE: { id: 'Sumber DC', en: 'DC source' },
  CAPACITOR: { id: 'Kapasitor', en: 'Capacitor' },
  SWITCH: { id: 'Sakelar', en: 'Switch' },
} as const;

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

/*
 * EMULATOR-001 checkpoint handoff — Agent 5 Control: Agent 1 recommendation
 * approved. Agent 2 is authorized to add one accessible live announcement
 * region covering selection, wire mode, undo/redo, and delete actions in this
 * component (CSS module changes are optional). Existing file lock applies;
 * do not create another lock or modify INDEX, guardrails, or QA items.
 */

function findNode(circuit: Circuit, id: string) {
  return circuit.nodes.find((node) => node.id === id);
}

function pruneUnusedNodes(circuit: Circuit): Circuit {
  const used = new Set<string>();
  for (const component of circuit.components) {
    if (component.type === 'SOURCE') {
      used.add(component.positive);
      used.add(component.negative);
    } else {
      used.add(component.a);
      used.add(component.b);
    }
  }
  for (const wire of circuit.wires) {
    used.add(wire.from);
    used.add(wire.to);
  }
  return { ...circuit, nodes: circuit.nodes.filter((node) => node.ground || used.has(node.id)) };
}

function formatNumber(value: number, maximumFractionDigits = 5) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits }).format(value);
}

function formatCurrent(value: number | null) {
  if (value === null) return '— (tidak unik)';
  const absolute = Math.abs(value);
  if (absolute >= 1) return `${formatNumber(value)} A`;
  if (absolute >= 1e-3) return `${formatNumber(value * 1e3)} mA`;
  if (absolute >= 1e-6) return `${formatNumber(value * 1e6)} µA`;
  return `${formatNumber(value * 1e9)} nA`;
}

function formatVoltage(value: number) {
  return `${formatNumber(value)} V`;
}

function branchDirection(branch: CircuitBranchResult, isId: boolean) {
  if (branch.currentMeaning === 'DELIVERED_FROM_POSITIVE') {
    return isId ? 'disalurkan dari + ke −' : 'delivered from + to −';
  }
  if (branch.currentMeaning === 'INDETERMINATE') {
    return isId ? 'arus sakelar ideal tidak terdefinisi' : 'ideal switch current is indeterminate';
  }
  return isId ? 'arah terminal A → B' : 'terminal direction A → B';
}

function componentPoints(a: CircuitNode, b: CircuitNode) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.max(Math.hypot(dx, dy), 1);
  const nx = -dy / length;
  const ny = dx / length;
  return (t: number, offset = 0) => ({
    x: a.x + dx * t + nx * offset,
    y: a.y + dy * t + ny * offset,
  });
}

export function CircuitEmulator() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const { loggedIn, loading: authLoading } = useCurrentUser();
  const [circuit, setCircuit] = useState<Circuit>(() => createSampleCircuit());
  const [circuitRevision, setCircuitRevision] = useState(0);
  const [solvedRevision, setSolvedRevision] = useState(-1);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [workspaceBusy, setWorkspaceBusy] = useState(false);
  const [selection, setSelection] = useState<Selection>(null);
  const [wireMode, setWireMode] = useState(false);
  const [wireStart, setWireStart] = useState<string | null>(null);
  const [solution, setSolution] = useState<CircuitSolution | null>(null);
  const [solverError, setSolverError] = useState('');
  const [autoCalculate, setAutoCalculate] = useState(false);
  const [dirty, setDirty] = useState(true);
  const [workspaceTitle, setWorkspaceTitle] = useState(isId ? 'Rangkaian DC baru' : 'New DC circuit');
  const [savedWorkspaces, setSavedWorkspaces] = useState<SavedWorkspace[]>([]);
  const [activeSavedId, setActiveSavedId] = useState('');
  const [workspaceStatus, setWorkspaceStatus] = useState('');
  const [numericDrafts, setNumericDrafts] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<CircuitHistory>({ past: [], future: [] });
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  const circuitRef = useRef(circuit);
  const workerRef = useRef<Worker | null>(null);
  const workerRequestsRef = useRef(new Map<number, (response: WorkerResponse) => void>());
  const workerSequenceRef = useRef(0);
  const dragRef = useRef<{ nodeId: string; pointerId: number } | null>(null);
  const revisionRef = useRef(0);
  const autoTimerRef = useRef<number | null>(null);
  const workspaceBusyRef = useRef(false);
  const aliveRef = useRef(true);
  const canvasRef = useRef<SVGSVGElement | null>(null);

  function announce(message: string) {
    setLiveAnnouncement(message);
  }

  function announceSelection(next: Selection) {
    if (!next) {
      announce(isId ? 'Pilihan dibatalkan.' : 'Selection cleared.');
      return;
    }
    if (next.kind === 'component') {
      const component = circuitRef.current.components.find((item) => item.id === next.id);
      const label = component ? TYPE_LABELS[component.type][isId ? 'id' : 'en'] : (isId ? 'Komponen' : 'Component');
      announce(isId ? `${label} dipilih.` : `${label} selected.`);
      return;
    }
    if (next.kind === 'wire') {
      announce(isId ? 'Kabel dipilih.' : 'Wire selected.');
      return;
    }
    announce(isId ? 'Terminal dipilih.' : 'Terminal selected.');
  }

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      if (autoTimerRef.current !== null) window.clearTimeout(autoTimerRef.current);
      workerRequestsRef.current.forEach((resolve) => resolve({
        requestId: -1,
        error: { code: 'WORKER_CLOSED', message: 'Perhitungan dihentikan.' },
      }));
      workerRequestsRef.current.clear();
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      setSavedWorkspaces([]);
      setActiveSavedId('');
      return;
    }
    let active = true;
    setWorkspaceStatus(isId ? 'Memuat skema tersimpan…' : 'Loading saved circuits…');
    fetch('/api/v1/utilities/workspace?kind=EMULATOR', { cache: 'no-store' })
      .then(async (response) => {
        const json = (await response.json()) as {
          data?: Array<{ id?: string; title?: string; updated_at?: string }>;
          error?: { message?: string };
        };
        if (!response.ok || !Array.isArray(json.data)) {
          throw new Error(json.error?.message ?? 'Saved circuits are unavailable.');
        }
        if (!active) return;
        setSavedWorkspaces(json.data.filter((item): item is { id: string; title: string; updated_at?: string } =>
          typeof item.id === 'string' && typeof item.title === 'string',
        ));
        setWorkspaceStatus('');
      })
      .catch(() => {
        if (active) setWorkspaceStatus(isId ? 'Daftar skema tersimpan belum dapat dimuat.' : 'Saved circuits could not be loaded.');
      });
    return () => {
      active = false;
    };
  }, [loggedIn, isId]);

  function commitCircuit(next: Circuit, recordHistory = true) {
    if (recordHistory) {
      setHistory((current) => ({
        past: [...current.past.slice(-49), circuitRef.current],
        future: [],
      }));
    }
    circuitRef.current = next;
    revisionRef.current += 1;
    setCircuit(next);
    setCircuitRevision((revision) => revision + 1);
    setSolution(null);
    setDirty(true);
    setSolverError('');
  }

  function updateCircuit(update: (current: Circuit) => Circuit) {
    if (busyRef.current || workspaceBusyRef.current) return;
    commitCircuit(update(circuitRef.current));
  }

  function restoreHistory(next: Circuit, nextHistory: CircuitHistory) {
    circuitRef.current = next;
    revisionRef.current += 1;
    setCircuit(next);
    setCircuitRevision((revision) => revision + 1);
    setSolution(null);
    setSolvedRevision(-1);
    setDirty(true);
    setSolverError('');
    setSelection(null);
    setWireMode(false);
    setWireStart(null);
    setHistory(nextHistory);
    setWorkspaceStatus(isId ? 'Perubahan dipulihkan secara lokal.' : 'Local change restored.');
  }

  function undoCircuit() {
    if (busyRef.current || workspaceBusyRef.current || history.past.length === 0) return;
    const previous = history.past[history.past.length - 1];
    restoreHistory(previous, {
      past: history.past.slice(0, -1),
      future: [circuitRef.current, ...history.future].slice(0, 50),
    });
    announce(isId ? 'Perubahan terakhir dibatalkan.' : 'Last change undone.');
  }

  function redoCircuit() {
    if (busyRef.current || workspaceBusyRef.current || history.future.length === 0) return;
    const next = history.future[0];
    restoreHistory(next, {
      past: [...history.past, circuitRef.current].slice(-50),
      future: history.future.slice(1),
    });
    announce(isId ? 'Perubahan dipulihkan.' : 'Change redone.');
  }

  function beginWorkspaceOperation() {
    if (busyRef.current || workspaceBusyRef.current) return false;
    workspaceBusyRef.current = true;
    setWorkspaceBusy(true);
    return true;
  }

  function endWorkspaceOperation() {
    workspaceBusyRef.current = false;
    setWorkspaceBusy(false);
  }

  function getWorker() {
    if (workerRef.current) return workerRef.current;
    const worker = new Worker(new URL('../workers/circuit-solver.worker.ts', import.meta.url), { type: 'module' });
    worker.addEventListener('message', (event: MessageEvent<WorkerResponse>) => {
      const response = event.data;
      const resolve = workerRequestsRef.current.get(response.requestId);
      if (!resolve) return;
      workerRequestsRef.current.delete(response.requestId);
      resolve(response);
    });
    worker.addEventListener('error', () => {
      workerRequestsRef.current.forEach((resolve, requestId) => resolve({
        requestId,
        error: { code: 'WORKER_ERROR', message: 'Solver worker tidak dapat menjalankan perhitungan.' },
      }));
      workerRequestsRef.current.clear();
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
    });
    workerRef.current = worker;
    return worker;
  }

  function solveInWorker(input: Circuit): Promise<WorkerResponse> {
    const worker = getWorker();
    const requestId = ++workerSequenceRef.current;
    return new Promise((resolve) => {
      workerRequestsRef.current.set(requestId, resolve);
      try {
        worker.postMessage({ requestId, circuit: input });
      } catch (error) {
        workerRequestsRef.current.delete(requestId);
        resolve({
          requestId,
          error: {
            code: 'WORKER_SEND_ERROR',
            message: error instanceof Error ? error.message : 'Solver worker tidak dapat menerima rangkaian.',
          },
        });
      }
    });
  }

  async function solveCurrentCircuit(snapshot: Circuit = circuitRef.current) {
    if (busyRef.current || workspaceBusyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setSolverError('');
    const startRevision = revisionRef.current;
    try {
      const response = await solveInWorker(snapshot);
      if (!aliveRef.current) return;
      if (response.error || !response.solution) {
        throw new Error(response.error?.message ?? (isId ? 'Rangkaian belum dapat dihitung.' : 'This circuit could not be solved.'));
      }
      setAutoCalculate(true);
      setSolution(startRevision === revisionRef.current ? response.solution : null);
      setSolvedRevision(startRevision);
    } catch (error) {
      if (!aliveRef.current) return;
      setSolvedRevision(startRevision);
      if (startRevision === revisionRef.current) {
        setSolverError(error instanceof Error ? error.message : (isId ? 'Simulasi gagal.' : 'Simulation failed.'));
      }
    } finally {
      busyRef.current = false;
      if (aliveRef.current) setBusy(false);
    }
  }

  useEffect(() => {
    if (!autoCalculate || busy || workspaceBusy || solvedRevision >= circuitRevision) return;
    autoTimerRef.current = window.setTimeout(() => {
      void solveCurrentCircuit(circuitRef.current);
    }, 120);
    return () => {
      if (autoTimerRef.current !== null) window.clearTimeout(autoTimerRef.current);
    };
  }, [autoCalculate, busy, workspaceBusy, circuitRevision, solvedRevision]);

  useEffect(() => {
    function handleHistoryShortcut(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isEditable = target?.tagName === 'INPUT'
        || target?.tagName === 'TEXTAREA'
        || target?.tagName === 'SELECT'
        || target?.isContentEditable;
      if (isEditable) return;
      if (event.ctrlKey || event.metaKey) {
        if (event.key.toLowerCase() !== 'z') return;
        event.preventDefault();
        if (event.shiftKey) redoCircuit();
        else undoCircuit();
        return;
      }
      if ((event.key === 'Delete' || event.key === 'Backspace')
        && target?.closest('[role="application"]')
        && (selection?.kind === 'component' || selection?.kind === 'wire')) {
        event.preventDefault();
        removeSelection();
      }
    }
    window.addEventListener('keydown', handleHistoryShortcut);
    return () => window.removeEventListener('keydown', handleHistoryShortcut);
  }, [history, busy, workspaceBusy, selection]);

  function addComponent(type: CircuitComponent['type']) {
    if (busyRef.current || workspaceBusyRef.current) return;
    const current = circuitRef.current;
    if (current.components.length >= MAX_CIRCUIT_COMPONENTS || current.nodes.length + 2 > MAX_CIRCUIT_NODES) {
      setSolverError(isId ? 'Batas skema tercapai (maksimum 64 komponen dan node).' : 'Circuit limit reached (64 components and nodes maximum).');
      return;
    }
    const offset = current.components.length % 12;
    const column = offset % 3;
    const row = Math.floor(offset / 3);
    const x = 90 + column * 250;
    const y = 92 + row * 86;
    const a = makeId('node');
    const b = makeId('node');
    const id = makeId(type.toLowerCase());
    const nodes: CircuitNode[] = [
      { id: a, x, y, ground: false },
      { id: b, x: x + 150, y, ground: false },
    ];
    let component: CircuitComponent;
    if (type === 'SOURCE') component = { id, type, positive: a, negative: b, volts: 9 };
    else if (type === 'RESISTOR') component = { id, type, a, b, ohms: 1_000 };
    else if (type === 'CAPACITOR') component = { id, type, a, b, farads: 1e-6 };
    else component = { id, type, a, b, closed: false };
    updateCircuit((currentCircuit) => ({
      ...currentCircuit,
      nodes: [...currentCircuit.nodes, ...nodes],
      components: [...currentCircuit.components, component],
    }));
    setSelection({ kind: 'component', id });
    announceSelection({ kind: 'component', id });
    setWireMode(false);
    setWireStart(null);
  }

  function connectNodes(first: string, second: string) {
    if (busyRef.current || workspaceBusyRef.current) return;
    const current = circuitRef.current;
    if (first === second) {
      setSolverError(isId ? 'Pilih terminal yang berbeda.' : 'Choose two different terminals.');
      setWireStart(null);
      return;
    }
    if (current.wires.some((wire) =>
      (wire.from === first && wire.to === second) || (wire.from === second && wire.to === first),
    )) {
      setSolverError(isId ? 'Kabel antara kedua terminal sudah ada.' : 'A wire already connects those terminals.');
      setWireStart(null);
      return;
    }
    if (current.wires.length >= MAX_CIRCUIT_WIRES) {
      setSolverError(isId ? 'Batas kabel tercapai (maksimum 256).' : 'Wire limit reached (256 maximum).');
      setWireStart(null);
      return;
    }
    const wire: CircuitWire = { id: makeId('wire'), from: first, to: second };
    updateCircuit((next) => ({ ...next, wires: [...next.wires, wire] }));
    setSelection({ kind: 'wire', id: wire.id });
    announce(isId ? 'Kabel dibuat dan dipilih.' : 'Wire created and selected.');
    setWireStart(null);
  }

  function activateNode(nodeId: string) {
    if (busyRef.current || workspaceBusyRef.current) return;
    if (!wireMode) {
      setSelection({ kind: 'node', id: nodeId });
      announceSelection({ kind: 'node', id: nodeId });
      return;
    }
    if (!wireStart) {
      setWireStart(nodeId);
      announce(isId ? 'Terminal pertama dipilih.' : 'First terminal selected.');
      setSolverError('');
      return;
    }
    connectNodes(wireStart, nodeId);
  }

  function handleCanvasPointerDown(event: ReactPointerEvent<SVGSVGElement>) {
    if (wireMode || busyRef.current || workspaceBusyRef.current) return;
    const target = event.target as SVGElement;
    const nodeId = target.closest<SVGGElement>('[data-node-id]')?.dataset.nodeId;
    if (!nodeId) return;
    event.preventDefault();
    const next = { kind: 'node' as const, id: nodeId };
    setSelection(next);
    dragRef.current = { nodeId, pointerId: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleCanvasPointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(24, Math.min(CIRCUIT_CANVAS_WIDTH - 24, ((event.clientX - bounds.left) / bounds.width) * CIRCUIT_CANVAS_WIDTH));
    const y = Math.max(24, Math.min(CIRCUIT_CANVAS_HEIGHT - 24, ((event.clientY - bounds.top) / bounds.height) * CIRCUIT_CANVAS_HEIGHT));
    updateCircuit((current) => ({
      ...current,
      nodes: current.nodes.map((node) => node.id === drag.nodeId ? { ...node, x, y } : node),
    }));
  }

  function stopCanvasDrag(event: ReactPointerEvent<SVGSVGElement>) {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
  }

  function removeSelection() {
    const currentSelection = selection;
    if (!currentSelection) return;
    if (currentSelection.kind === 'component') {
      updateCircuit((current) => pruneUnusedNodes({
        ...current,
        components: current.components.filter((component) => component.id !== currentSelection.id),
      }));
    } else if (currentSelection.kind === 'wire') {
      updateCircuit((current) => pruneUnusedNodes({
        ...current,
        wires: current.wires.filter((wire) => wire.id !== currentSelection.id),
      }));
    } else return;
    setSelection(null);
    announce(currentSelection.kind === 'component'
      ? (isId ? 'Komponen dihapus.' : 'Component deleted.')
      : (isId ? 'Kabel dihapus.' : 'Wire deleted.'));
    window.requestAnimationFrame(() => {
      if (aliveRef.current) canvasRef.current?.focus({ preventScroll: true });
    });
  }

  function setGround(nodeId: string, checked: boolean) {
    updateCircuit((current) => ({
      ...current,
      nodes: current.nodes.map((node) => ({ ...node, ground: checked && node.id === nodeId })),
    }));
  }

  function updateComponent(componentId: string, update: (component: CircuitComponent) => CircuitComponent) {
    updateCircuit((current) => ({
      ...current,
      components: current.components.map((component) => component.id === componentId ? update(component) : component),
    }));
  }

  function editNumber(component: CircuitComponent, field: 'ohms' | 'volts' | 'farads', raw: string, minimum: number, maximum: number) {
    const key = `${component.id}:${field}`;
    setNumericDrafts((current) => ({ ...current, [key]: raw }));
    if (!raw.trim()) return;
    const value = Number(raw);
    if (!Number.isFinite(value) || value < minimum || value > maximum) return;
    updateComponent(component.id, (current) => {
      if (current.type === 'RESISTOR' && field === 'ohms') return { ...current, ohms: value };
      if (current.type === 'SOURCE' && field === 'volts') return { ...current, volts: value };
      if (current.type === 'CAPACITOR' && field === 'farads') return { ...current, farads: value };
      return current;
    });
  }

  function finishNumberEdit(component: CircuitComponent, field: 'ohms' | 'volts' | 'farads') {
    setNumericDrafts((current) => {
      const next = { ...current };
      delete next[`${component.id}:${field}`];
      return next;
    });
  }

  async function loadSavedWorkspace(id: string) {
    if (busyRef.current || workspaceBusyRef.current) return;
    if (!id) {
      setActiveSavedId('');
      return;
    }
    if (!beginWorkspaceOperation()) return;
    setWorkspaceStatus(isId ? 'Memuat skema…' : 'Loading circuit…');
    try {
      const response = await fetch(`/api/v1/utilities/workspace/${encodeURIComponent(id)}`, { cache: 'no-store' });
      const json = (await response.json()) as {
        data?: { id: string; title: string; circuit: unknown };
        error?: { message?: string };
      };
      if (!response.ok || !json.data?.circuit) throw new Error(json.error?.message ?? 'Workspace could not be loaded.');
      const next = validateCircuit(json.data.circuit);
      circuitRef.current = next;
      revisionRef.current += 1;
      setCircuit(next);
      setCircuitRevision((revision) => revision + 1);
      setWorkspaceTitle(json.data.title);
      setSelection(null);
      setSolution(null);
      setSolvedRevision(-1);
      setAutoCalculate(false);
      setDirty(false);
      setActiveSavedId(id);
      setHistory({ past: [], future: [] });
      setWorkspaceStatus(isId ? 'Skema berhasil dimuat.' : 'Circuit loaded.');
    } catch (error) {
      setWorkspaceStatus(error instanceof Error ? error.message : (isId ? 'Skema gagal dimuat.' : 'Circuit could not be loaded.'));
    } finally {
      endWorkspaceOperation();
    }
  }

  async function saveWorkspace() {
    if (busyRef.current || workspaceBusyRef.current) return;
    if (!loggedIn) {
      setWorkspaceStatus(isId ? 'Masuk untuk menyimpan skema secara privat.' : 'Sign in to save a private circuit.');
      return;
    }
    const title = workspaceTitle.trim();
    if (!title || title.length > 200) {
      setWorkspaceStatus(isId ? 'Judul harus berisi 1–200 karakter.' : 'Title must contain 1–200 characters.');
      return;
    }
    let validated: Circuit;
    const saveRevision = revisionRef.current;
    try {
      validated = validateCircuit(circuitRef.current);
    } catch (error) {
      setWorkspaceStatus(error instanceof Error ? error.message : (isId ? 'Skema tidak valid.' : 'Circuit is invalid.'));
      return;
    }
    if (!beginWorkspaceOperation()) return;
    setWorkspaceStatus('');
    try {
      const response = await fetch('/api/v1/utilities/workspace', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({ kind: 'EMULATOR', title, input: { circuit: validated }, result: {}, isPrivate: true }),
      });
      const json = (await response.json()) as { data?: { id?: string }; error?: { message?: string } };
      if (!response.ok || !json.data?.id) {
        throw new Error(json.error?.message ?? (isId ? 'Skema gagal disimpan.' : 'Circuit could not be saved.'));
      }
      setActiveSavedId(json.data.id);
      setDirty(saveRevision !== revisionRef.current);
      setSavedWorkspaces((items) => [{ id: json.data!.id!, title }, ...items.filter((item) => item.id !== json.data!.id)]);
      setWorkspaceStatus(isId ? 'Skema disimpan secara privat.' : 'Circuit saved privately.');
    } catch (error) {
      setWorkspaceStatus(error instanceof Error ? error.message : (isId ? 'Gagal menyimpan skema.' : 'Circuit could not be saved.'));
    } finally {
      endWorkspaceOperation();
    }
  }

  async function deleteWorkspace() {
    if (busyRef.current || workspaceBusyRef.current) return;
    if (!activeSavedId) return;
    const confirmed = window.confirm(isId
      ? 'Hapus skema tersimpan ini? Tindakan ini tidak dapat dibatalkan.'
      : 'Delete this saved circuit? This cannot be undone.');
    if (!confirmed) return;
    if (!beginWorkspaceOperation()) return;
    try {
      const response = await fetch(`/api/v1/utilities/workspace/${encodeURIComponent(activeSavedId)}?kind=EMULATOR`, {
        method: 'DELETE',
        headers: { ...csrfHeaders() },
      });
      const json = (await response.json()) as { data?: { deleted?: boolean }; error?: { message?: string } };
      if (!response.ok || !json.data?.deleted) throw new Error(json.error?.message ?? 'Circuit could not be deleted.');
      setSavedWorkspaces((items) => items.filter((item) => item.id !== activeSavedId));
      setActiveSavedId('');
      setDirty(true);
      setWorkspaceStatus(isId ? 'Skema tersimpan dihapus.' : 'Saved circuit deleted.');
    } catch (error) {
      setWorkspaceStatus(error instanceof Error ? error.message : (isId ? 'Skema gagal dihapus.' : 'Circuit could not be deleted.'));
    } finally {
      endWorkspaceOperation();
    }
  }

  function startNewCircuit(sample: boolean) {
    if (busyRef.current || workspaceBusyRef.current) return;
    const next = sample ? createSampleCircuit() : createEmptyCircuit();
    commitCircuit(next);
    setSelection(null);
    setWireMode(false);
    setWireStart(null);
    setSolution(null);
    setSolvedRevision(-1);
    setSolverError('');
    setAutoCalculate(false);
    setDirty(true);
    setWorkspaceTitle(sample
      ? (isId ? 'Contoh: sumber 9 V dan resistor 1 kΩ' : 'Example: 9 V source and 1 kΩ resistor')
      : (isId ? 'Rangkaian DC baru' : 'New DC circuit'));
    setActiveSavedId('');
    setNumericDrafts({});
    setHistory({ past: [], future: [] });
  }

  const selectedComponent = selection?.kind === 'component'
    ? circuit.components.find((component) => component.id === selection.id) ?? null
    : null;
  const selectedNode = selection?.kind === 'node'
    ? findNode(circuit, selection.id) ?? null
    : null;
  const selectedWire = selection?.kind === 'wire'
    ? circuit.wires.find((wire) => wire.id === selection.id) ?? null
    : null;

  function renderComponent(component: CircuitComponent) {
    const a = findNode(circuit, component.type === 'SOURCE' ? component.positive : component.a);
    const b = findNode(circuit, component.type === 'SOURCE' ? component.negative : component.b);
    if (!a || !b) return null;
    const point = componentPoints(a, b);
    const selected = selection?.kind === 'component' && selection.id === component.id;
    const label = component.type === 'RESISTOR'
      ? `R · ${formatNumber(component.ohms, 2)} Ω`
      : component.type === 'SOURCE'
        ? `DC · ${formatNumber(component.volts, 2)} V`
        : component.type === 'CAPACITOR'
          ? `C · ${formatNumber(component.farads, 4)} F`
          : (component.closed ? (isId ? 'Sakelar tertutup' : 'Switch closed') : (isId ? 'Sakelar terbuka' : 'Switch open'));
    const title = `${TYPE_LABELS[component.type][isId ? 'id' : 'en']} — ${label}`;
    const symbolClass = selected ? `${styles.symbol} ${styles.symbolSelected}` : styles.symbol;
    const middleA = point(0.42);
    const middleB = point(0.58);
    return (
      <g
        key={component.id}
        className={styles.component}
        role="button"
        tabIndex={0}
        aria-label={title}
        aria-pressed={selected}
         onClick={(event) => {
           event.stopPropagation();
           const next = { kind: 'component' as const, id: component.id };
           setSelection(next);
           announceSelection(next);
         }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
             const next = { kind: 'component' as const, id: component.id };
             setSelection(next);
             announceSelection(next);
          }
        }}
      >
        <title>{title}</title>
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={styles.lead} />
        {component.type === 'RESISTOR' && (() => {
          const points = Array.from({ length: 9 }, (_, index) => {
            const offset = index === 0 || index === 8 ? 0 : index % 2 ? -10 : 10;
            const p = point(0.38 + index * 0.03, offset);
            return `${p.x},${p.y}`;
          });
          return <polyline points={points.join(' ')} className={symbolClass} />;
        })()}
        {component.type === 'SOURCE' && <>
          <circle cx={(a.x + b.x) / 2} cy={(a.y + b.y) / 2} r="18" className={styles.sourceCircle} />
          <text x={middleA.x} y={middleA.y - 11} className={styles.polarity}>+</text>
          <text x={middleB.x} y={middleB.y - 11} className={styles.polarity}>−</text>
        </>}
        {component.type === 'CAPACITOR' && [0.47, 0.53].map((t) => {
          const normal = point(t, 14);
          const opposite = point(t, -14);
          return <line key={t} x1={normal.x} y1={normal.y} x2={opposite.x} y2={opposite.y} className={symbolClass} />;
        })}
        {component.type === 'SWITCH' && <>
          <circle cx={middleA.x} cy={middleA.y} r="3.5" className={styles.switchContact} />
          <circle cx={middleB.x} cy={middleB.y} r="3.5" className={styles.switchContact} />
          {component.closed
            ? <line x1={middleA.x} y1={middleA.y} x2={middleB.x} y2={middleB.y} className={symbolClass} />
            : <line x1={middleA.x} y1={middleA.y} x2={point(0.55, 12).x} y2={point(0.55, 12).y} className={symbolClass} />}
        </>}
        <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 23} className={styles.componentLabel} textAnchor="middle">{label}</text>
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={styles.componentHitArea} />
      </g>
    );
  }

  return (
    <section className={styles.emulator} aria-labelledby="circuit-emulator-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{isId ? 'TOOLS · ELEKTRONIKA DASAR' : 'TOOLS · BASIC ELECTRONICS'}</p>
          <h1 id="circuit-emulator-title">{isId ? 'Emulator Sirkuit DC' : 'DC Circuit Emulator'}</h1>
          <p>{isId
            ? 'Rangkai komponen ideal dan amati tegangan serta arus pada kondisi tunak DC.'
            : 'Connect ideal components and inspect voltage and current at DC steady state.'}</p>
        </div>
         <div className={styles.statusPill}>
          {busy ? (isId ? 'Menghitung…' : 'Calculating…') : (isId ? 'Solver lokal · Web Worker' : 'Local solver · Web Worker')}
        </div>
      </header>

      <div className={styles.disclaimer} role="note">
        <strong>{isId ? 'Model edukasi ideal.' : 'Ideal educational model.'}</strong>{' '}
        {isId
          ? 'Hanya rangkaian linear DC kondisi tunak. Bukan alat uji hardware atau panduan keselamatan listrik nyata; tidak memodelkan transien, panas, atau kerusakan komponen.'
          : 'Linear DC steady-state only. Not a hardware test or real-world electrical safety guide; transients, heat, and component failure are not modeled.'}
      </div>

      <div className={styles.workspaceBar}>
        <div className={styles.workspaceName}>
          <label htmlFor="emulator-workspace-title">{isId ? 'Nama skema' : 'Circuit name'}</label>
          <input id="emulator-workspace-title" value={workspaceTitle} maxLength={200}
            onChange={(event) => { setWorkspaceTitle(event.currentTarget.value); setDirty(true); }} />
        </div>
        <div className={styles.savedControls}>
          <label className={styles.srOnly} htmlFor="saved-circuit-select">{isId ? 'Muat skema privat' : 'Load private circuit'}</label>
          <select id="saved-circuit-select" value={activeSavedId}
            onChange={(event) => void loadSavedWorkspace(event.currentTarget.value)}
            disabled={!loggedIn || busy || savedWorkspaces.length === 0}>
            <option value="">{isId ? 'Skema tersimpan…' : 'Saved circuits…'}</option>
            {savedWorkspaces.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
          <button className="button button--secondary" type="button" onClick={() => void saveWorkspace()} disabled={!loggedIn || busy}>
            {isId ? 'Simpan privat' : 'Save privately'}
          </button>
          <button className="button button--secondary" type="button" onClick={() => void deleteWorkspace()} disabled={!loggedIn || !activeSavedId || busy}>
            {isId ? 'Hapus' : 'Delete'}
          </button>
        </div>
      </div>

      {(!loggedIn || authLoading) && <p className={styles.accessNotice}>
        {authLoading
          ? (isId ? 'Memeriksa status akun…' : 'Checking account status…')
          : <>{isId ? 'Masuk diperlukan hanya untuk menyimpan atau mengelola skema privat. Simulasi tetap berjalan lokal tanpa akun. ' : 'Sign in only to save or manage private circuits. Simulation still runs locally without an account. '}<a href="/auth">{isId ? 'Masuk / Daftar' : 'Sign in / Register'}</a></>}
      </p>}
      {workspaceStatus && <p className={styles.inlineStatus}>{workspaceStatus}</p>}

      <div className={styles.workspaceLayout}>
        <aside className={styles.toolbox} aria-label={isId ? 'Komponen sirkuit' : 'Circuit components'}>
          <h2>{isId ? 'Komponen' : 'Components'}</h2>
          <p>{isId ? 'Pilih untuk menambahkan sepasang terminal.' : 'Choose to add a pair of terminals.'}</p>
          <button type="button" className={styles.toolboxButton} onClick={() => addComponent('RESISTOR')}>
            <span className={styles.toolboxGlyph}>R</span><span>Resistor<small>0.1 Ω – 100 MΩ</small></span>
          </button>
          <button type="button" className={styles.toolboxButton} onClick={() => addComponent('SOURCE')}>
            <span className={styles.toolboxGlyph}>±</span><span>{isId ? 'Sumber DC' : 'DC source'}<small>0–24 V</small></span>
          </button>
          <button type="button" className={styles.toolboxButton} onClick={() => addComponent('CAPACITOR')}>
            <span className={styles.toolboxGlyph}>‖</span><span>{isId ? 'Kapasitor' : 'Capacitor'}<small>{isId ? 'DC tunak: terbuka' : 'DC steady-state: open'}</small></span>
          </button>
          <button type="button" className={styles.toolboxButton} onClick={() => addComponent('SWITCH')}>
            <span className={styles.toolboxGlyph}>⌁</span><span>{isId ? 'Sakelar' : 'Switch'}<small>{isId ? 'Ideal · buka/tutup' : 'Ideal · open/closed'}</small></span>
          </button>
           <button type="button" className={`button ${wireMode ? '' : 'button--secondary'} ${styles.wireButton}`}
             aria-pressed={wireMode}
             onClick={() => {
               const next = !wireMode;
               setWireMode(next);
               announce(next
                 ? (isId ? 'Mode sambung aktif.' : 'Wire mode on.')
                 : (isId ? 'Mode sambung dibatalkan.' : 'Wire mode cancelled.'));
               setWireStart(null);
               setSolverError('');
             }}>
            {wireMode ? (isId ? 'Batal sambung' : 'Cancel wire') : (isId ? 'Hubungkan terminal' : 'Connect terminals')}
          </button>
          {wireMode && <p className={styles.hint}>{isId ? 'Pilih dua titik terminal pada gambar.' : 'Select two terminal dots on the canvas.'}</p>}
          <div className={styles.toolboxDivider} />
          <button type="button" className="button button--secondary" onClick={() => startNewCircuit(false)}>{isId ? 'Rangkaian kosong' : 'Empty circuit'}</button>
          <button type="button" className="button button--secondary" onClick={() => startNewCircuit(true)}>{isId ? 'Muat contoh 9 V' : 'Load 9 V sample'}</button>
        </aside>

        <div className={styles.canvasColumn}>
          <div className={styles.canvasToolbar}>
            <span>{isId ? 'Kanvas skema' : 'Circuit canvas'}</span>
            <span>{circuit.components.length} / 64 {isId ? 'komponen' : 'components'} · {circuit.wires.length} / 256 {isId ? 'kabel' : 'wires'}</span>
          </div>
          <div className={styles.canvasFrame}>
             <svg ref={canvasRef} className={styles.canvas} viewBox={`0 0 ${CIRCUIT_CANVAS_WIDTH} ${CIRCUIT_CANVAS_HEIGHT}`}
              preserveAspectRatio="none" role="application" tabIndex={0}
              aria-label={isId ? 'Kanvas rangkaian. Seret titik terminal untuk memindahkan; pilih komponen untuk mengedit.' : 'Circuit canvas. Drag terminal dots to move; select a component to edit.'}
              onPointerDown={handleCanvasPointerDown} onPointerMove={handleCanvasPointerMove}
              onPointerUp={stopCanvasDrag} onPointerCancel={stopCanvasDrag}
               onClick={(event) => {
                 if ((event.target as SVGElement).tagName === 'svg') {
                   setSelection(null);
                   announceSelection(null);
                 }
               }}>
              <defs>
                <pattern id="circuit-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" className={styles.gridDot} />
                </pattern>
              </defs>
              <rect width={CIRCUIT_CANVAS_WIDTH} height={CIRCUIT_CANVAS_HEIGHT} fill="url(#circuit-grid)" />
              {circuit.wires.map((wire) => {
                const from = findNode(circuit, wire.from);
                const to = findNode(circuit, wire.to);
                if (!from || !to) return null;
                const selected = selection?.kind === 'wire' && selection.id === wire.id;
                return <g key={wire.id} role="button" tabIndex={0}
                  aria-label={isId ? 'Kabel; pilih untuk menghapus' : 'Wire; select to delete'}
                   onClick={(event) => {
                     event.stopPropagation();
                     const next = { kind: 'wire' as const, id: wire.id };
                     setSelection(next);
                     announceSelection(next);
                   }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                       const next = { kind: 'wire' as const, id: wire.id };
                       setSelection(next);
                       announceSelection(next);
                    }
                  }}>
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    className={`${styles.wire} ${selected ? styles.wireSelected : ''}`} />
                </g>;
              })}
              {circuit.components.map(renderComponent)}
              {circuit.nodes.map((node) => {
                const selected = selection?.kind === 'node' && selection.id === node.id;
                return <g key={node.id} className={styles.node} data-node-id={node.id} role="button" tabIndex={0}
                  aria-label={node.ground ? (isId ? 'Terminal ground' : 'Ground terminal') : (isId ? `Terminal ${node.id}` : `Terminal ${node.id}`)}
                   onClick={(event) => { event.stopPropagation(); activateNode(node.id); }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      activateNode(node.id);
                    }
                  }}>
                  <circle cx={node.x} cy={node.y} r="16" className={styles.nodeHitArea} />
                  <circle cx={node.x} cy={node.y} r="6" className={`${styles.nodeDot} ${node.ground ? styles.groundNode : ''} ${selected || wireStart === node.id ? styles.nodeSelected : ''}`} />
                  {node.ground && <text x={node.x + 10} y={node.y + 21} className={styles.groundLabel}>GND</text>}
                  {wireStart === node.id && <circle cx={node.x} cy={node.y} r="11" className={styles.wireStartRing} />}
                  <title>{`${isId ? 'Terminal' : 'Terminal'} ${node.id}${node.ground ? ' · GND' : ''}`}</title>
                </g>;
              })}
              {circuit.components.length === 0 && <text x={CIRCUIT_CANVAS_WIDTH / 2} y={CIRCUIT_CANVAS_HEIGHT / 2 - 18}
                textAnchor="middle" className={styles.emptyLabel}>
                {isId ? 'Pilih komponen di panel kiri untuk memulai.' : 'Choose a component in the left panel to begin.'}
              </text>}
            </svg>
          </div>
          <div className={styles.canvasActions}>
            <button type="button" className="button" onClick={() => void solveCurrentCircuit(circuitRef.current)} disabled={busy}>
              {busy ? (isId ? 'Menghitung…' : 'Calculating…') : (isId ? 'Simulasikan rangkaian' : 'Simulate circuit')}
            </button>
            <div className={styles.historyControls} aria-label={isId ? 'Riwayat perubahan' : 'Change history'}>
               <button type="button" className="button button--secondary" onClick={undoCircuit}
                disabled={busy || workspaceBusy || history.past.length === 0}
                title={isId ? 'Batalkan perubahan terakhir (Ctrl/Cmd+Z)' : 'Undo last change (Ctrl/Cmd+Z)'}>
                {isId ? 'Urungkan' : 'Undo'}
              </button>
              <button type="button" className="button button--secondary" onClick={redoCircuit}
                disabled={busy || workspaceBusy || history.future.length === 0}
                title={isId ? 'Ulangi perubahan (Ctrl/Cmd+Shift+Z)' : 'Redo change (Ctrl/Cmd+Shift+Z)'}>
                {isId ? 'Ulangi' : 'Redo'}
              </button>
            </div>
            <span>{dirty ? (isId ? 'Ada perubahan belum disimpan' : 'Unsaved changes') : (isId ? 'Skema tersimpan' : 'Circuit saved')}</span>

           </div>
           <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">{liveAnnouncement}</p>
           {solverError && <p className={styles.error} role="alert">{solverError}</p>}
          <p className={styles.hint}>{isId
             ? 'Seret terminal untuk mengatur layout. Klik dua terminal setelah mengaktifkan Hubungkan terminal; pilih komponen atau kabel untuk menghapusnya dengan tombol Hapus.'
             : 'Drag terminal dots to arrange the layout. Select two terminal dots in wire mode; select a component or wire and press Delete to remove it.'}</p>
        </div>

        <aside className={styles.inspector} aria-label={isId ? 'Properti dan hasil' : 'Properties and results'}>
          <div className={styles.inspectorSection}>
            <h2>{isId ? 'Properti pilihan' : 'Selection properties'}</h2>
            {selectedComponent && <div className={styles.propertyForm}>
              <p className={styles.selectedType}>{TYPE_LABELS[selectedComponent.type][isId ? 'id' : 'en']}</p>
              {selectedComponent.type === 'RESISTOR' && <label>{isId ? 'Resistansi (Ω)' : 'Resistance (Ω)'}
                <input type="number" min={MIN_RESISTANCE_OHMS} max={MAX_RESISTANCE_OHMS} step="any"
                  value={numericDrafts[`${selectedComponent.id}:ohms`] ?? String(selectedComponent.ohms)}
                  onChange={(event) => editNumber(selectedComponent, 'ohms', event.currentTarget.value, MIN_RESISTANCE_OHMS, MAX_RESISTANCE_OHMS)}
                  onBlur={() => finishNumberEdit(selectedComponent, 'ohms')} />
                <small>0.1 Ω – 100 MΩ</small>
              </label>}
              {selectedComponent.type === 'SOURCE' && <label>{isId ? 'Tegangan sumber (V)' : 'Source voltage (V)'}
                <input type="number" min="0" max={MAX_SOURCE_VOLTS} step="any"
                  value={numericDrafts[`${selectedComponent.id}:volts`] ?? String(selectedComponent.volts)}
                  onChange={(event) => editNumber(selectedComponent, 'volts', event.currentTarget.value, 0, MAX_SOURCE_VOLTS)}
                  onBlur={() => finishNumberEdit(selectedComponent, 'volts')} />
                <small>0–24 V DC</small>
              </label>}
              {selectedComponent.type === 'CAPACITOR' && <label>{isId ? 'Kapasitansi (F)' : 'Capacitance (F)'}
                <input type="number" min={MIN_CAPACITANCE_FARADS} max={MAX_CAPACITANCE_FARADS} step="any"
                  value={numericDrafts[`${selectedComponent.id}:farads`] ?? String(selectedComponent.farads)}
                  onChange={(event) => editNumber(selectedComponent, 'farads', event.currentTarget.value, MIN_CAPACITANCE_FARADS, MAX_CAPACITANCE_FARADS)}
                  onBlur={() => finishNumberEdit(selectedComponent, 'farads')} />
                <small>{isId ? 'DC tunak: arus 0 A; transien tidak dihitung.' : 'DC steady-state: 0 A; transients are not modeled.'}</small>
              </label>}
              {selectedComponent.type === 'SWITCH' && <label className={styles.checkLabel}>
                <input type="checkbox" checked={selectedComponent.closed}
                  onChange={(event) => updateComponent(selectedComponent.id, (component) => component.type === 'SWITCH'
                    ? { ...component, closed: event.currentTarget.checked }
                    : component)} />
                {isId ? 'Sakelar tertutup' : 'Switch closed'}
              </label>}
              <button type="button" className="button button--secondary" onClick={removeSelection}>{isId ? 'Hapus komponen' : 'Delete component'}</button>
            </div>}
            {selectedNode && <div className={styles.propertyForm}>
              <p>{isId ? `Terminal ${selectedNode.id}` : `Terminal ${selectedNode.id}`}</p>
              <label className={styles.checkLabel}>
                <input type="checkbox" checked={selectedNode.ground} onChange={(event) => setGround(selectedNode.id, event.currentTarget.checked)} />
                {isId ? 'Jadikan ground (0 V)' : 'Set as ground (0 V)'}
              </label>
              <small>{isId ? 'Tandai tepat satu ground sebelum menghitung.' : 'Mark exactly one ground before solving.'}</small>
            </div>}
            {selectedWire && <div className={styles.propertyForm}>
              <p>{isId ? 'Kabel terpilih' : 'Selected wire'}</p>
              <button type="button" className="button button--secondary" onClick={removeSelection}>{isId ? 'Hapus kabel' : 'Delete wire'}</button>
            </div>}
            {!selection && <p className={styles.muted}>{isId
              ? 'Pilih resistor, sumber, kapasitor, sakelar, kabel, atau terminal.'
              : 'Select a resistor, source, capacitor, switch, wire, or terminal.'}</p>}
          </div>

          <div className={styles.inspectorSection}>
            <h2>{isId ? 'Hasil perhitungan' : 'Simulation results'}</h2>
            {!solution && <p className={styles.muted}>{isId
              ? 'Jalankan simulasi untuk melihat tegangan node dan arus cabang.'
              : 'Run the simulation to inspect node voltage and branch current.'}</p>}
            {solution && <>
              <h3>{isId ? 'Tegangan node' : 'Node voltages'}</h3>
              <div className={styles.resultList}>
                {Object.entries(solution.nodeVoltages).map(([nodeId, voltage]) => <div key={nodeId}>
                  <span>{nodeId}{findNode(circuit, nodeId)?.ground ? ' · GND' : ''}</span><strong>{formatVoltage(voltage)}</strong>
                </div>)}
              </div>
              <h3>{isId ? 'Tegangan & arus komponen' : 'Component voltage & current'}</h3>
              <div className={styles.branchList}>
                {solution.branches.map((branch) => <article key={branch.componentId}>
                  <strong>{TYPE_LABELS[branch.type][isId ? 'id' : 'en']} · {branch.componentId.slice(0, 18)}</strong>
                  <span>{isId ? 'Tegangan' : 'Voltage'}: {formatVoltage(branch.voltage)}</span>
                  <span>{isId ? 'Arus' : 'Current'}: {formatCurrent(branch.currentAmps)}</span>
                  <small>{branchDirection(branch, isId)}</small>
                </article>)}
              </div>
              <p className={styles.resultDisclaimer}>{isId
                ? 'Model DC ideal untuk pendidikan; bukan instrumen pengukuran atau instruksi keselamatan.'
                : 'Ideal DC educational model; not a measurement instrument or safety instruction.'}</p>
            </>}
          </div>
        </aside>
      </div>
    </section>
  );
}
