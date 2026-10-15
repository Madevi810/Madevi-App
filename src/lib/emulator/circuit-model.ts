export const CIRCUIT_CANVAS_WIDTH = 900;
export const CIRCUIT_CANVAS_HEIGHT = 480;
export const MAX_CIRCUIT_NODES = 64;
export const MAX_CIRCUIT_COMPONENTS = 64;
export const MAX_CIRCUIT_WIRES = 256;
export const MAX_CIRCUIT_JSON_BYTES = 256 * 1024;
export const MAX_SOURCE_VOLTS = 24;
export const MIN_RESISTANCE_OHMS = 0.1;
export const MAX_RESISTANCE_OHMS = 100_000_000;
export const MIN_CAPACITANCE_FARADS = 1e-12;
export const MAX_CAPACITANCE_FARADS = 1_000;

export interface CircuitNode {
  id: string;
  x: number;
  y: number;
  ground: boolean;
}

export interface ResistorComponent {
  id: string;
  type: 'RESISTOR';
  a: string;
  b: string;
  ohms: number;
}

export interface SourceComponent {
  id: string;
  type: 'SOURCE';
  positive: string;
  negative: string;
  volts: number;
}

export interface CapacitorComponent {
  id: string;
  type: 'CAPACITOR';
  a: string;
  b: string;
  farads: number;
}

export interface SwitchComponent {
  id: string;
  type: 'SWITCH';
  a: string;
  b: string;
  closed: boolean;
}

export type CircuitComponent =
  | ResistorComponent
  | SourceComponent
  | CapacitorComponent
  | SwitchComponent;

export interface CircuitWire {
  id: string;
  from: string;
  to: string;
}

export interface Circuit {
  version: 1;
  nodes: CircuitNode[];
  components: CircuitComponent[];
  wires: CircuitWire[];
}

export interface CircuitBranchResult {
  componentId: string;
  type: CircuitComponent['type'];
  voltage: number;
  /** Null for an ideal closed switch because its current is not uniquely determined. */
  currentAmps: number | null;
  currentMeaning: 'A_TO_B' | 'DELIVERED_FROM_POSITIVE' | 'INDETERMINATE';
}

export interface CircuitSolution {
  nodeVoltages: Record<string, number>;
  branches: CircuitBranchResult[];
}

export type CircuitErrorCode = 'INVALID_INPUT' | 'GROUND_REQUIRED' | 'SINGULAR_CIRCUIT';

export class CircuitModelError extends Error {
  constructor(
    readonly code: CircuitErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'CircuitModelError';
  }
}

function invalid(message: string): never {
  throw new CircuitModelError('INVALID_INPUT', message);
}

function asRecord(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return invalid(`${label} harus berupa objek.`);
  }
  return value as Record<string, unknown>;
}

function onlyKeys(record: Record<string, unknown>, allowed: readonly string[], label: string) {
  if (Object.keys(record).some((key) => !allowed.includes(key))) {
    invalid(`${label} memiliki field yang tidak dikenal.`);
  }
}

function readId(value: unknown, label: string): string {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]{1,64}$/.test(value)) {
    return invalid(`${label} tidak valid.`);
  }
  return value;
}

function readFinite(value: unknown, label: string, minimum: number, maximum: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < minimum || value > maximum) {
    return invalid(`${label} harus angka finite antara ${minimum} dan ${maximum}.`);
  }
  return value;
}

function readNodeReference(value: unknown, label: string, nodeIds: Set<string>): string {
  const id = readId(value, label);
  if (!nodeIds.has(id)) return invalid(`${label} menunjuk node yang tidak ada.`);
  return id;
}

/** Validate and normalize untrusted editor or persisted JSON before using it. */
export function validateCircuit(value: unknown): Circuit {
  const record = asRecord(value, 'Skema');
  onlyKeys(record, ['version', 'nodes', 'components', 'wires'], 'Skema');
  if (record.version !== 1) return invalid('Versi skema tidak didukung.');
  if (!Array.isArray(record.nodes) || !Array.isArray(record.components) || !Array.isArray(record.wires)) {
    return invalid('Node, komponen, dan kabel harus berupa daftar.');
  }
  if (record.nodes.length < 1 || record.nodes.length > MAX_CIRCUIT_NODES) {
    return invalid(`Jumlah node harus 1–${MAX_CIRCUIT_NODES}.`);
  }
  if (record.components.length > MAX_CIRCUIT_COMPONENTS) {
    return invalid(`Komponen melebihi batas ${MAX_CIRCUIT_COMPONENTS}.`);
  }
  if (record.wires.length > MAX_CIRCUIT_WIRES) {
    return invalid(`Kabel melebihi batas ${MAX_CIRCUIT_WIRES}.`);
  }

  const nodeIds = new Set<string>();
  const nodes = record.nodes.map((raw, index): CircuitNode => {
    const node = asRecord(raw, `Node ${index + 1}`);
    onlyKeys(node, ['id', 'x', 'y', 'ground'], `Node ${index + 1}`);
    const id = readId(node.id, `ID node ${index + 1}`);
    if (nodeIds.has(id)) return invalid(`ID node ${id} berulang.`);
    nodeIds.add(id);
    if (typeof node.ground !== 'boolean') return invalid(`Status ground node ${id} tidak valid.`);
    return {
      id,
      x: readFinite(node.x, `Posisi X node ${id}`, 24, CIRCUIT_CANVAS_WIDTH - 24),
      y: readFinite(node.y, `Posisi Y node ${id}`, 24, CIRCUIT_CANVAS_HEIGHT - 24),
      ground: node.ground,
    };
  });
  if (nodes.filter((node) => node.ground).length !== 1) {
    throw new CircuitModelError('GROUND_REQUIRED', 'Tandai tepat satu node sebagai ground (referensi 0 V).');
  }

  const componentIds = new Set<string>();
  const components = record.components.map((raw, index): CircuitComponent => {
    const component = asRecord(raw, `Komponen ${index + 1}`);
    const id = readId(component.id, `ID komponen ${index + 1}`);
    if (componentIds.has(id)) return invalid(`ID komponen ${id} berulang.`);
    componentIds.add(id);
    const type = component.type;
    if (type === 'RESISTOR') {
      onlyKeys(component, ['id', 'type', 'a', 'b', 'ohms'], `Resistor ${id}`);
      const a = readNodeReference(component.a, `Terminal A resistor ${id}`, nodeIds);
      const b = readNodeReference(component.b, `Terminal B resistor ${id}`, nodeIds);
      if (a === b) return invalid(`Terminal resistor ${id} harus memakai node berbeda.`);
      return {
        id,
        type,
        a,
        b,
        ohms: readFinite(component.ohms, `Resistansi ${id}`, MIN_RESISTANCE_OHMS, MAX_RESISTANCE_OHMS),
      };
    }
    if (type === 'SOURCE') {
      onlyKeys(component, ['id', 'type', 'positive', 'negative', 'volts'], `Sumber ${id}`);
      const positive = readNodeReference(component.positive, `Terminal + sumber ${id}`, nodeIds);
      const negative = readNodeReference(component.negative, `Terminal - sumber ${id}`, nodeIds);
      if (positive === negative) return invalid(`Terminal sumber ${id} harus memakai node berbeda.`);
      return {
        id,
        type,
        positive,
        negative,
        volts: readFinite(component.volts, `Tegangan sumber ${id}`, 0, MAX_SOURCE_VOLTS),
      };
    }
    if (type === 'CAPACITOR') {
      onlyKeys(component, ['id', 'type', 'a', 'b', 'farads'], `Kapasitor ${id}`);
      const a = readNodeReference(component.a, `Terminal A kapasitor ${id}`, nodeIds);
      const b = readNodeReference(component.b, `Terminal B kapasitor ${id}`, nodeIds);
      if (a === b) return invalid(`Terminal kapasitor ${id} harus memakai node berbeda.`);
      return {
        id,
        type,
        a,
        b,
        farads: readFinite(component.farads, `Kapasitansi ${id}`, MIN_CAPACITANCE_FARADS, MAX_CAPACITANCE_FARADS),
      };
    }
    if (type === 'SWITCH') {
      onlyKeys(component, ['id', 'type', 'a', 'b', 'closed'], `Sakelar ${id}`);
      const a = readNodeReference(component.a, `Terminal A sakelar ${id}`, nodeIds);
      const b = readNodeReference(component.b, `Terminal B sakelar ${id}`, nodeIds);
      if (a === b) return invalid(`Terminal sakelar ${id} harus memakai node berbeda.`);
      if (typeof component.closed !== 'boolean') return invalid(`Status sakelar ${id} tidak valid.`);
      return { id, type, a, b, closed: component.closed };
    }
    return invalid(`Jenis komponen ${String(type)} tidak didukung.`);
  });

  const wireIds = new Set<string>();
  const wirePairs = new Set<string>();
  const wires = record.wires.map((raw, index): CircuitWire => {
    const wire = asRecord(raw, `Kabel ${index + 1}`);
    onlyKeys(wire, ['id', 'from', 'to'], `Kabel ${index + 1}`);
    const id = readId(wire.id, `ID kabel ${index + 1}`);
    if (wireIds.has(id)) return invalid(`ID kabel ${id} berulang.`);
    wireIds.add(id);
    const from = readNodeReference(wire.from, `Ujung awal kabel ${id}`, nodeIds);
    const to = readNodeReference(wire.to, `Ujung akhir kabel ${id}`, nodeIds);
    if (from === to) return invalid(`Kabel ${id} harus menghubungkan dua node berbeda.`);
    const pair = [from, to].sort().join('\u0000');
    if (wirePairs.has(pair)) return invalid(`Kabel antara ${from} dan ${to} sudah ada.`);
    wirePairs.add(pair);
    return { id, from, to };
  });

  const circuit: Circuit = { version: 1, nodes, components, wires };
  let serialized: string;
  try {
    serialized = JSON.stringify(circuit);
  } catch {
    return invalid('Skema tidak dapat diserialisasi.');
  }
  if (new TextEncoder().encode(serialized).byteLength > MAX_CIRCUIT_JSON_BYTES) {
    return invalid(`Ukuran skema melebihi ${MAX_CIRCUIT_JSON_BYTES} byte.`);
  }
  return circuit;
}

export function createEmptyCircuit(): Circuit {
  return {
    version: 1,
    nodes: [{ id: 'gnd', x: 450, y: 370, ground: true }],
    components: [],
    wires: [],
  };
}

export function createSampleCircuit(): Circuit {
  return {
    version: 1,
    nodes: [
      { id: 'gnd', x: 180, y: 350, ground: true },
      { id: 'source-positive', x: 180, y: 90, ground: false },
      { id: 'load-top', x: 580, y: 90, ground: false },
    ],
    components: [
      {
        id: 'supply-9v',
        type: 'SOURCE',
        positive: 'source-positive',
        negative: 'gnd',
        volts: 9,
      },
      { id: 'load-1k', type: 'RESISTOR', a: 'load-top', b: 'gnd', ohms: 1_000 },
    ],
    wires: [{ id: 'top-wire', from: 'source-positive', to: 'load-top' }],
  };
}

function gaussianElimination(matrix: number[][], rhs: number[]): number[] {
  const size = rhs.length;
  if (size === 0) return [];
  for (let column = 0; column < size; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < size; row += 1) {
      if (Math.abs(matrix[row][column]) > Math.abs(matrix[pivot][column])) pivot = row;
    }
    if (Math.abs(matrix[pivot][column]) < 1e-14) {
      throw new CircuitModelError(
        'SINGULAR_CIRCUIT',
        'Rangkaian belum dapat dihitung: ada node mengambang, jalur terbuka, atau sumber tegangan yang bertentangan.',
      );
    }
    [matrix[pivot], matrix[column]] = [matrix[column], matrix[pivot]];
    [rhs[pivot], rhs[column]] = [rhs[column], rhs[pivot]];

    const pivotValue = matrix[column][column];
    for (let j = column; j < size; j += 1) matrix[column][j] /= pivotValue;
    rhs[column] /= pivotValue;

    for (let row = 0; row < size; row += 1) {
      if (row === column) continue;
      const factor = matrix[row][column];
      if (factor === 0) continue;
      for (let j = column; j < size; j += 1) matrix[row][j] -= factor * matrix[column][j];
      rhs[row] -= factor * rhs[column];
    }
  }
  if (rhs.some((value) => !Number.isFinite(value))) {
    throw new CircuitModelError('SINGULAR_CIRCUIT', 'Hasil perhitungan tidak finite; periksa kembali skema.');
  }
  return rhs;
}

/** Solve ideal linear DC steady-state with modified nodal analysis. */
export function solveCircuit(input: unknown): CircuitSolution {
  const circuit = validateCircuit(input);
  const parent = new Map<string, string>(circuit.nodes.map((node) => [node.id, node.id]));
  const find = (id: string): string => {
    const current = parent.get(id);
    if (!current) throw new CircuitModelError('INVALID_INPUT', `Node ${id} tidak ditemukan.`);
    if (current === id) return id;
    const representative = find(current);
    parent.set(id, representative);
    return representative;
  };
  const union = (a: string, b: string) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) parent.set(rootB, rootA);
  };

  for (const wire of circuit.wires) union(wire.from, wire.to);
  for (const component of circuit.components) {
    if (component.type === 'SWITCH' && component.closed) union(component.a, component.b);
  }

  const groundNode = circuit.nodes.find((node) => node.ground);
  if (!groundNode) {
    throw new CircuitModelError('GROUND_REQUIRED', 'Tandai satu node ground sebagai referensi 0 V.');
  }
  const groundRoot = find(groundNode.id);
  const roots = [...new Set(circuit.nodes.map((node) => find(node.id)))];
  const voltageRoots = roots.filter((id) => id !== groundRoot);
  const voltageIndex = new Map(voltageRoots.map((id, index) => [id, index]));
  const sources = circuit.components.filter((component): component is SourceComponent => component.type === 'SOURCE');
  const dimension = voltageRoots.length + sources.length;
  const matrix = Array.from({ length: dimension }, () => Array<number>(dimension).fill(0));
  const rightHandSide = Array<number>(dimension).fill(0);
  const indexForNode = (id: string) => voltageIndex.get(find(id));

  const stampConductance = (a: string, b: string, conductance: number) => {
    const indexA = indexForNode(a);
    const indexB = indexForNode(b);
    if (indexA !== undefined) matrix[indexA][indexA] += conductance;
    if (indexB !== undefined) matrix[indexB][indexB] += conductance;
    if (indexA !== undefined && indexB !== undefined) {
      matrix[indexA][indexB] -= conductance;
      matrix[indexB][indexA] -= conductance;
    }
  };

  for (const component of circuit.components) {
    if (component.type === 'RESISTOR') {
      stampConductance(component.a, component.b, 1 / component.ohms);
    } else if (component.type === 'SOURCE') {
      const positiveIndex = indexForNode(component.positive);
      const negativeIndex = indexForNode(component.negative);
      if (find(component.positive) === find(component.negative)) {
        throw new CircuitModelError(
          'SINGULAR_CIRCUIT',
          `Sumber ${component.id} terhubung ke node yang sama; lepaskan short atau sumber yang bertentangan.`,
        );
      }
      const sourceIndex = voltageRoots.length + sources.indexOf(component);
      if (positiveIndex !== undefined) {
        matrix[positiveIndex][sourceIndex] += 1;
        matrix[sourceIndex][positiveIndex] += 1;
      }
      if (negativeIndex !== undefined) {
        matrix[negativeIndex][sourceIndex] -= 1;
        matrix[sourceIndex][negativeIndex] -= 1;
      }
      rightHandSide[sourceIndex] = component.volts;
    }
    // Ideal capacitor is open circuit at DC steady state; its voltage is still
    // reported from solved node voltages. The editor makes no transient claim.
  }

  const values = gaussianElimination(matrix, rightHandSide);
  const voltageAt = (nodeId: string) => {
    const index = indexForNode(nodeId);
    return index === undefined ? 0 : values[index];
  };
  const nodeVoltages = Object.fromEntries(
    circuit.nodes.map((node) => [node.id, voltageAt(node.id)]),
  );

  const sourceIndices = new Map(sources.map((source, index) => [source.id, index]));
  const branches = circuit.components.map((component): CircuitBranchResult => {
    if (component.type === 'SOURCE') {
      const sourceIndex = sourceIndices.get(component.id) ?? 0;
      return {
        componentId: component.id,
        type: component.type,
        voltage: voltageAt(component.positive) - voltageAt(component.negative),
        // MNA current is positive from + to -, so negate it to show delivered current.
        currentAmps: -values[voltageRoots.length + sourceIndex],
        currentMeaning: 'DELIVERED_FROM_POSITIVE',
      };
    }
    if (component.type === 'RESISTOR') {
      const voltage = voltageAt(component.a) - voltageAt(component.b);
      return {
        componentId: component.id,
        type: component.type,
        voltage,
        currentAmps: voltage / component.ohms,
        currentMeaning: 'A_TO_B',
      };
    }
    if (component.type === 'CAPACITOR') {
      return {
        componentId: component.id,
        type: component.type,
        voltage: voltageAt(component.a) - voltageAt(component.b),
        currentAmps: 0,
        currentMeaning: 'A_TO_B',
      };
    }
    if (component.closed) {
      return {
        componentId: component.id,
        type: component.type,
        voltage: voltageAt(component.a) - voltageAt(component.b),
        currentAmps: null,
        currentMeaning: 'INDETERMINATE',
      };
    }
    return {
      componentId: component.id,
      type: component.type,
      voltage: voltageAt(component.a) - voltageAt(component.b),
      currentAmps: 0,
      currentMeaning: 'A_TO_B',
    };
  });

  if (
    Object.values(nodeVoltages).some((voltage) => !Number.isFinite(voltage)) ||
    branches.some((branch) => !Number.isFinite(branch.voltage) ||
      (branch.currentAmps !== null && !Number.isFinite(branch.currentAmps)))
  ) {
    throw new CircuitModelError('SINGULAR_CIRCUIT', 'Hasil perhitungan tidak finite; periksa kembali skema.');
  }
  return { nodeVoltages, branches };
}
