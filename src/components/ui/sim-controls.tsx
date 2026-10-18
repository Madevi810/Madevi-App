'use client';

import { cn } from '@/lib/cn';
import { Button } from './button';

export type SimControlsProps = {
  playing: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onStep?: () => void;
  className?: string;
};

/**
 * SimControls — pola PhET: play/pause + reset (+ step opsional).
 * Satu komponen untuk semua simulasi.
 */
export function SimControls({ playing, onPlayPause, onReset, onStep, className }: SimControlsProps) {
  return (
    <div data-slot="sim-controls" className={cn('mdv-sim-controls', className)} role="group" aria-label="Kontrol simulasi">
      <Button
        type="button"
        size="sm"
        variant={playing ? 'secondary' : 'default'}
        onClick={onPlayPause}
        aria-label={playing ? 'Jeda' : 'Putar'}
      >
        {playing ? '⏸ Jeda' : '▶ Putar'}
      </Button>
      {onStep && (
        <Button type="button" size="sm" variant="outline" onClick={onStep} aria-label="Langkah">
          ⏭ Langkah
        </Button>
      )}
      <Button type="button" size="sm" variant="ghost" onClick={onReset} aria-label="Ulangi">
        ↺ Ulangi
      </Button>
    </div>
  );
}
