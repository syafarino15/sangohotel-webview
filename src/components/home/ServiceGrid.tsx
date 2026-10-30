'use client';

import { BusFront, Car, Sparkles, UtensilsCrossed } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ServiceId } from '@/types/service';

interface ServiceGridProps {
  onSelect: (service: ServiceId) => void;
}

const SERVICES: Array<{ id: ServiceId; label: string; caption: string; icon: LucideIcon }> = [
  { id: 'rent', label: 'Rent', caption: 'Sewa kendaraan', icon: Car },
  { id: 'food', label: 'Food', caption: 'Pesan makanan', icon: UtensilsCrossed },
];

const COMING_SOON: Array<{ label: string; icon: LucideIcon }> = [
  { label: 'Spa', icon: Sparkles },
  { label: 'Transport', icon: BusFront },
];

export const ServiceGrid = ({ onSelect }: ServiceGridProps) => (
  <section className="rounded-2xl border border-slate-100 bg-white p-3 shadow-card">
    <div className="mb-2 flex items-center justify-between px-0.5">
      <h2 className="text-[13px] font-bold text-slate-900">Layanan Sango</h2>
      <span className="text-[10px] font-semibold text-slate-400">2 layanan aktif</span>
    </div>

    <div className="grid grid-cols-4 gap-2">
      {SERVICES.map(({ id, label, caption, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          aria-label={`${label} - ${caption}`}
          className="flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-1.5 active:bg-primary-surface"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-surface text-primary">
            <Icon size={22} />
          </span>
          <span className="text-[11px] font-bold leading-none text-slate-800">{label}</span>
        </button>
      ))}

      {COMING_SOON.map(({ label, icon: Icon }) => (
        <div
          key={label}
          aria-disabled="true"
          className="flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-1.5 opacity-55"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <Icon size={22} />
          </span>
          <span className="text-[11px] font-semibold leading-none text-slate-400">{label}</span>
          <span className="text-[9px] font-semibold text-slate-400">Segera</span>
        </div>
      ))}
    </div>
  </section>
);