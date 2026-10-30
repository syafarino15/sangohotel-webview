'use client';

import { MapPin } from 'lucide-react';
import { HOTELS } from '@/data/hotels';
import { cn } from '@/lib/utils';

interface ServiceHotelSelectProps {
  value: string;
  onChange: (hotelId: string) => void;
  label: string;
}

export const ServiceHotelSelect = ({ value, onChange, label }: ServiceHotelSelectProps) => (
  <section className="rounded-2xl border border-slate-100 bg-white p-3 shadow-card">
    <p className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
      <MapPin size={11} /> {label}
    </p>
    <div className="no-scrollbar -mx-1 mt-2 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
      {HOTELS.map(({ hotel }) => (
        <button
          key={hotel.id}
          type="button"
          onClick={() => onChange(hotel.id)}
          aria-pressed={value === hotel.id}
          className={cn(
            'min-h-[44px] shrink-0 rounded-xl border px-2.5 py-1.5 text-left text-[11px] font-semibold leading-tight transition-colors',
            value === hotel.id
              ? 'border-primary bg-primary-surface text-primary-dark'
              : 'border-slate-200 bg-white text-slate-600'
          )}
        >
          {hotel.name}
        </button>
      ))}
    </div>
  </section>
);