// @vitest-environment happy-dom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InvitationOrderForm } from '@/components/jasa/invitation-order-form';

vi.mock('@/components/jasa/use-current-user', () => ({
  useCurrentUser: () => ({ loggedIn: false, loading: false }),
}));

afterEach(() => cleanup());

describe('InvitationOrderForm IDs', () => {
  it('keeps field IDs unique when multiple forms are visible', () => {
    const { container } = render(
      <>
        <InvitationOrderForm isId templateName="Undangan custom" />
        <InvitationOrderForm isId templateId="template-1" templateName="Template terbit" />
      </>,
    );

    const fields = [...container.querySelectorAll('input[id], textarea[id]')];
    const ids = fields.map((field) => field.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toHaveLength(12);

    for (const label of [...container.querySelectorAll('label[for]')]) {
      const targetId = label.getAttribute('for');
      expect(targetId).not.toBeNull();
      expect(container.querySelector(`#${CSS.escape(targetId!)}`)).not.toBeNull();
    }
    expect(screen.getByText(/Undangan custom/)).not.toBeNull();
    expect(screen.getByText(/Template terbit/)).not.toBeNull();
  });
});
