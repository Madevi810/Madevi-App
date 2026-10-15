import * as SelectPrimitive from '@radix-ui/react-select';
import { cva, type VariantProps } from 'class-variance-authority';
import type { SelectProps as SelectPrimitiveProps } from '@radix-ui/react-select';
import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

const dropdownVariants = cva('mdv-dropdown', {
  variants: {
    size: {
      default: 'mdv-dropdown--default',
      sm: 'mdv-dropdown--sm',
      lg: 'mdv-dropdown--lg',
    },
  },
  defaultVariants: { size: 'default' },
});

export type DropdownProps = SelectPrimitiveProps &
  VariantProps<typeof dropdownVariants>;

export const Dropdown = SelectPrimitive.Root;

export const DropdownTrigger = SelectPrimitive.Trigger;

export const DropdownValue = SelectPrimitive.Value;

export const DropdownContent = SelectPrimitive.Content;

export const DropdownViewport = SelectPrimitive.Viewport;

export const DropdownItem = SelectPrimitive.Item;

export const DropdownSeparator = SelectPrimitive.Separator;

export const DropdownLabel = SelectPrimitive.Label;

export { dropdownVariants };