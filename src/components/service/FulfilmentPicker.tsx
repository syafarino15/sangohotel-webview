'use client';

import { MapPin, Bike, Store } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FulfilmentMethod, ServiceId } from '@/types/service';

interface FulfilmentPickerProps {
  service: ServiceId;
  value: FulfilmentMethod;
  onChange: (method: FulfilmentMethod) => void;
}

const buildOptions = (service: ServiceId): Array<{
  id: FulfilmentMethod;
  label: string;
  description: string;
  icon: LucideIcon;
}> => [
  {
    id: 'pickup',
    label: 'Ambil Sendiri',
    description:
      service === 'food'
        ? 'Ambil pesanan di restoran hotel'
        : 'Ambil kendaraan di meja concierge hotel',
    icon: Store,
  },
  {
    id: 'delivery',
    label: service === 'food' ? 'Diantar ke Kamar' : 'Kunci Diantar ke Kamar',
    description:
      service === 'food'
        ? 'Pesanan diantar langsung ke kamar Anda'
        : 'Kunci kendaraan diantar ke kamar Anda',
    icon: Bike,
  },
];

export const FulfilmentPicker = ({ service, value, onChange }: FulfilmentPickerProps) => (
  <section className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-card">
    <h2 className="text-[14px] font-bold text-slate-900">
      Metode {service === 'food' ? 'Pengambilan' : 'Penyerahan'}
    </h2>
    <p className="mt-0.5 text-[11px] text-slate-500">Pilih cara Anda menerima pesanan</p>

    <div className="mt-2.5 space-y-1.5">
      {buildOptions(service).map(({ id, label, description, icon: Icon }) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-pressed={active}
            className={cn(
              'flex min-h-[56px] w-full items-center gap-2.5 rounded-xl border p-2.5 text-left transition-colors',
              active ? 'border-primary bg-primary-surface' : 'border-slate-200 bg-white active:bg-slate-50'
            )}
          >
            <span
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                active ? 'bg-white text-primary' : 'bg-slate-100 text-slate-500'
              )}
            >
              <Icon size={17} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold text-slate-900">{label}</span>
              <span className="block text-[11px] leading-snug text-slate-500">{description}</span>
            </span>
            <span
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                active ? 'border-primary bg-primary' : 'border-slate-300'
              )}
            >
              {active ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
            </span>
          </button>
        );
      })}
    </div>

    {value === 'pickup' ? (
      <p className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 text-[10px] leading-relaxed text-slate-500">
        <MapPin size={11} className="mt-0.5 shrink-0" />
        Petunjuk lokasi akan ditampilkan di halaman bukti pemesanan.
      </p>
    ) : null}
  </section>
);