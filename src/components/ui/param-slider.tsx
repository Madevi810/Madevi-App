'use client';

import type { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export type ParamSliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> & {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  decimals?: number;
  onValueChange: (value: number) => void;
};

/**
 * ParamSlider — pola PhET: slider + nilai real-time.
 * Satu komponen untuk semua simulasi; jangan buat slider custom per sim.
 */
export function ParamSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  decimals = 0,
  onValueChange,
  className,
  ...props
}: ParamSliderProps) {
  const display = value.toFixed(decimals);
  return (
    <div data-slot="param-slider" className={cn('mdv-param-slider', className)}>
      <div className="mdv-param-slider__header">
        <label className="mdv-param-slider__label">{label}</label>
        <output className="mdv-param-slider__value">
          {display}
          {unit ? ` ${unit}` : ''}
        </output>
      </div>
      <input
        type="range"
        className="mdv-param-slider__input"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValueChange(Number(e.target.value))}
        aria-label={label}
        {...props}
      />
    </div>
  );
}
