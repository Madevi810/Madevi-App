import {
  CircuitModelError,
  solveCircuit,
  type CircuitSolution,
} from '@/lib/emulator/circuit-model';

interface SolveRequest {
  requestId: number;
  circuit: unknown;
}

interface SolveResponse {
  requestId: number;
  solution?: CircuitSolution;
  error?: { code: string; message: string };
}

const workerScope = self as unknown as {
  addEventListener(type: 'message', listener: (event: MessageEvent<SolveRequest>) => void): void;
  postMessage(message: SolveResponse): void;
};

workerScope.addEventListener('message', (event) => {
  const { requestId, circuit } = event.data;
  let response: SolveResponse;
  try {
    response = { requestId, solution: solveCircuit(circuit) };
  } catch (error) {
    response = {
      requestId,
      error: {
        code: error instanceof CircuitModelError ? error.code : 'SOLVER_ERROR',
        message: error instanceof Error ? error.message : 'Perhitungan tidak dapat diselesaikan.',
      },
    };
  }
  workerScope.postMessage(response);
});
