'use client';

import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export const QuantityStepper = ({
  value,
  onChange,
  min = 1,
  max = 99,
  label = 'jumlah',
}: QuantityStepperProps) => (
  <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white">
    <button
      type="button"
      aria-label={`Kurangi ${label}`}
      disabled={value <= min}
      onClick={() => onChange(value - 1)}
      className="flex h-11 w-10 items-center justify-center rounded-l-xl text-slate-600 active:bg-slate-100 disabled:opacity-40"
    >
      <Minus size={15} />
    </button>
    <span
      aria-live="polite"
      className="min-w-[26px] text-center text-[13px] font-bold text-slate-900"
    >
      {value}
    </span>
    <button
      type="button"
      aria-label={`Tambah ${label}`}
      disabled={value >= max}
      onClick={() => onChange(value + 1)}
      className="flex h-11 w-10 items-center justify-center rounded-r-xl text-slate-600 active:bg-slate-100 disabled:opacity-40"
    >
      <Plus size={15} />
    </button>
  </div>
);