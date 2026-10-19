import { describe, expect, it } from 'vitest';

import {
  CircuitModelError,
  createSampleCircuit,
  solveCircuit,
  validateCircuit,
  type Circuit,
} from '@/lib/emulator/circuit-model';

describe('circuit DC steady-state MNA', () => {
  it('solves the 9 V source and 1 kΩ sample to 9 mA', () => {
    const result = solveCircuit(createSampleCircuit());
    expect(result.nodeVoltages['source-positive']).toBeCloseTo(9, 10);
    expect(result.nodeVoltages['load-top']).toBeCloseTo(9, 10);
    expect(result.branches.find((branch) => branch.componentId === 'load-1k')?.currentAmps).toBeCloseTo(0.009, 10);
    expect(result.branches.find((branch) => branch.componentId === 'supply-9v')?.currentAmps).toBeCloseTo(0.009, 10);
  });

  it('solves a series resistor divider with equal branch current', () => {
    const circuit: Circuit = {
      version: 1,
      nodes: [
        { id: 'g', x: 100, y: 350, ground: true },
        { id: 'p', x: 100, y: 80, ground: false },
        { id: 'm', x: 450, y: 80, ground: false },
      ],
      components: [
        { id: 'v', type: 'SOURCE', positive: 'p', negative: 'g', volts: 12 },
        { id: 'r1', type: 'RESISTOR', a: 'p', b: 'm', ohms: 1_000 },
        { id: 'r2', type: 'RESISTOR', a: 'm', b: 'g', ohms: 2_000 },
      ],
      wires: [],
    };
    const result = solveCircuit(circuit);
    expect(result.nodeVoltages.m).toBeCloseTo(8, 10);
    expect(result.branches.find((branch) => branch.componentId === 'r1')?.currentAmps).toBeCloseTo(0.004, 10);
    expect(result.branches.find((branch) => branch.componentId === 'r2')?.currentAmps).toBeCloseTo(0.004, 10);
  });

  it('reports deterministic currents for two parallel resistors', () => {
    const circuit: Circuit = {
      version: 1,
      nodes: [
        { id: 'g', x: 100, y: 350, ground: true },
        { id: 'p', x: 100, y: 80, ground: false },
        { id: 'a', x: 400, y: 80, ground: false },
        { id: 'b', x: 650, y: 80, ground: false },
      ],
      components: [
        { id: 'v', type: 'SOURCE', positive: 'p', negative: 'g', volts: 12 },
        { id: 'r1', type: 'RESISTOR', a: 'a', b: 'g', ohms: 1_000 },
        { id: 'r2', type: 'RESISTOR', a: 'b', b: 'g', ohms: 2_000 },
      ],
      wires: [
        { id: 'wire-a', from: 'p', to: 'a' },
        { id: 'wire-b', from: 'p', to: 'b' },
      ],
    };
    const result = solveCircuit(circuit);
    expect(result.branches.find((branch) => branch.componentId === 'r1')?.currentAmps).toBeCloseTo(0.012, 10);
    expect(result.branches.find((branch) => branch.componentId === 'r2')?.currentAmps).toBeCloseTo(0.006, 10);
    expect(result.branches.find((branch) => branch.componentId === 'v')?.currentAmps).toBeCloseTo(0.018, 10);
  });

  it('treats a capacitor as open circuit at DC steady state', () => {
    const circuit: Circuit = {
      version: 1,
      nodes: [
        { id: 'g', x: 100, y: 350, ground: true },
        { id: 'p', x: 100, y: 80, ground: false },
      ],
      components: [
        { id: 'v', type: 'SOURCE', positive: 'p', negative: 'g', volts: 5 },
        { id: 'c', type: 'CAPACITOR', a: 'p', b: 'g', farads: 0.000001 },
      ],
      wires: [],
    };
    const result = solveCircuit(circuit);
    expect(result.branches.find((branch) => branch.componentId === 'c')).toMatchObject({ voltage: 5, currentAmps: 0 });
  });

  it('treats a closed ideal switch as connected and its branch current as indeterminate', () => {
    const circuit: Circuit = {
      version: 1,
      nodes: [
        { id: 'g', x: 100, y: 350, ground: true },
        { id: 'p', x: 100, y: 80, ground: false },
        { id: 'load', x: 450, y: 80, ground: false },
      ],
      components: [
        { id: 'v', type: 'SOURCE', positive: 'p', negative: 'g', volts: 6 },
        { id: 's', type: 'SWITCH', a: 'p', b: 'load', closed: true },
        { id: 'r', type: 'RESISTOR', a: 'load', b: 'g', ohms: 2_000 },
      ],
      wires: [],
    };
    const result = solveCircuit(circuit);
    expect(result.nodeVoltages.load).toBeCloseTo(6, 10);
    expect(result.branches.find((branch) => branch.componentId === 's')).toMatchObject({ currentAmps: null, currentMeaning: 'INDETERMINATE' });
    expect(result.branches.find((branch) => branch.componentId === 'r')?.currentAmps).toBeCloseTo(0.003, 10);
  });

  it('rejects a resistor island that has no ground or voltage reference', () => {
    const floating: Circuit = {
      version: 1,
      nodes: [
        { id: 'g', x: 100, y: 350, ground: true },
        { id: 'a', x: 300, y: 90, ground: false },
        { id: 'b', x: 600, y: 90, ground: false },
      ],
      components: [{ id: 'r', type: 'RESISTOR', a: 'a', b: 'b', ohms: 1_000 }],
      wires: [],
    };
    expect(() => solveCircuit(floating)).toThrowError(expect.objectContaining({ code: 'SINGULAR_CIRCUIT' }));
  });

  it('rejects missing ground and contradictory ideal voltage constraints', () => {
    const missingGround = createSampleCircuit();
    missingGround.nodes[0]!.ground = false;
    expect(() => validateCircuit(missingGround)).toThrowError(expect.objectContaining({ code: 'GROUND_REQUIRED' }));

    const shortedSource = createSampleCircuit();
    shortedSource.wires.push({ id: 'short', from: 'source-positive', to: 'gnd' });
    expect(() => solveCircuit(shortedSource)).toThrowError(expect.objectContaining({ code: 'SINGULAR_CIRCUIT' }));
  });

  it('rejects out-of-range source, non-positive resistance, and oversized collections', () => {
    const overVoltage = createSampleCircuit();
    (overVoltage.components[0] as { volts: number }).volts = 25;
    expect(() => validateCircuit(overVoltage)).toThrowError(CircuitModelError);

    const invalidResistance = createSampleCircuit();
    (invalidResistance.components[1] as { ohms: number }).ohms = 0;
    expect(() => validateCircuit(invalidResistance)).toThrowError(CircuitModelError);

    const oversized = createSampleCircuit();
    oversized.wires = Array.from({ length: 257 }, (_, index) => ({ id: `w${index}`, from: 'gnd', to: 'source-positive' }));
    expect(() => validateCircuit(oversized)).toThrowError(CircuitModelError);
  });
});
