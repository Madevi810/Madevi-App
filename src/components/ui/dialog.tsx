import { Slot } from '@radix-ui/react-slot';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import type { DialogProps as DialogPrimitiveProps } from '@radix-ui/react-dialog';
import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

const dialogVariants = cva('mdv-dialog', {
  variants: {
    size: {
      default: 'mdv-dialog--default',
      sm: 'mdv-dialog--sm',
      lg: 'mdv-dialog--lg',
      xl: 'mdv-dialog--xl',
      full: 'mdv-dialog--full',
    },
  },
  defaultVariants: { size: 'default' },
});

export type DialogProps = DialogPrimitiveProps &
  VariantProps<typeof dialogVariants>;

export const Dialog = DialogPrimitive.Root;

export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogPortal = DialogPrimitive.Portal;

export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = DialogPrimitive.Overlay;

export const DialogContent = DialogPrimitive.Content;

export const DialogTitle = DialogPrimitive.Title;

export const DialogDescription = DialogPrimitive.Description;

export { dialogVariants };