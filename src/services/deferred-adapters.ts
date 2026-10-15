import { ApiError } from '@/api/errors';
import type { AiAdapter, PaymentAdapter, ProductSourceAdapter } from '@/contracts/services';

function unavailable(name: string): never {
  throw new ApiError('DEPENDENCY_UNAVAILABLE', `${name} belum tersedia pada mode Offline 02`);
}

export class DeferredPaymentAdapter implements PaymentAdapter {
  readonly mode = 'NOT_IMPLEMENTED' as const;
  async createOrder(input: unknown): Promise<never> {
    void input;
    return unavailable('Payment adapter');
  }
}

export class DeferredProductSourceAdapter implements ProductSourceAdapter {
  readonly mode = 'NOT_IMPLEMENTED' as const;
  async refresh(input: unknown): Promise<never> {
    void input;
    return unavailable('Product source adapter');
  }
}

export class DeferredAiAdapter implements AiAdapter {
  readonly mode = 'NOT_IMPLEMENTED' as const;
  async answer(input: unknown): Promise<never> {
    void input;
    return unavailable('AI adapter');
  }
}
