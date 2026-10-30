'use client';

import { useMemo, useState } from 'react';
import { Bike, Car, CheckCircle2, Gauge } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StickyActionBar } from '@/components/ui/StickyActionBar';
import { HOTELS } from '@/data/hotels';
import { RENT_VEHICLES } from '@/data/serviceCatalog';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { useServiceStore } from '@/stores/useServiceStore';
import type { RentCategory } from '@/types/service';
import { QuantityStepper } from './QuantityStepper';
import { ServiceHotelSelect } from './ServiceHotelSelect';

const CATEGORY_ICONS: Record<RentCategory, LucideIcon> = {
  Bike: Bike,
  Motorcycle: Gauge,
  Car: Car,
};

const FILTERS: Array<{ id: RentCategory | 'all'; label: string }> = [
  { id: 'all', label: 'Semua' },
  { id: 'Bike', label: 'Sepeda' },
  { id: 'Motorcycle', label: 'Motor' },
  { id: 'Car', label: 'Mobil' },
];

export const RentService = () => {
  const draft = useServiceStore((state) => state.draft);
  const setHotel = useServiceStore((state) => state.setHotel);
  const setLines = useServiceStore((state) => state.setLines);
  const setDays = useServiceStore((state) => state.setDays);
  const startCheckout = useServiceStore((state) => state.startCheckout);

  const [filter, setFilter] = useState<RentCategory | 'all'>('all');

  const vehicles = useMemo(
    () => (filter === 'all' ? RENT_VEHICLES : RENT_VEHICLES.filter((v) => v.category === filter)),
    [filter]
  );

  const hotelId = draft?.hotelId || HOTELS[0].hotel.id;
  const days = draft?.days ?? 1;
  const vehicleId = draft?.lines[0]?.id ?? null;
  const selected = RENT_VEHICLES.find((vehicle) => vehicle.id === vehicleId) ?? null;
  const total = selected ? selected.pricePerDay * days : 0;

  const handleSelectVehicle = (id: string) => {
    const vehicle = RENT_VEHICLES.find((item) => item.id === id);
    if (!vehicle) {
      return;
    }
    setLines([{ id: vehicle.id, label: vehicle.name, qty: 1, unitPrice: vehicle.pricePerDay }]);
  };

  return (
    <>
      <div className="flex-1 space-y-2.5 px-3 pb-4 pt-2.5">
        <ServiceHotelSelect
          value={hotelId}
          onChange={setHotel}
          label="Lokasi pengambilan kendaraan"
        />

        <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              aria-pressed={filter === item.id}
              className={cn(
                'min-h-[44px] shrink-0 rounded-full border px-3 text-[12px] font-semibold transition-colors',
                filter === item.id
                  ? 'border-primary bg-primary text-sango-ink'
                  : 'border-slate-200 bg-white text-slate-600'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {vehicles.map((vehicle) => {
            const Icon = CATEGORY_ICONS[vehicle.category];
            const active = vehicle.id === vehicleId;
            return (
              <button
                key={vehicle.id}
                type="button"
                onClick={() => handleSelectVehicle(vehicle.id)}
                aria-pressed={active}
                className={cn(
                  'flex w-full items-start gap-2.5 rounded-2xl border p-3 text-left shadow-card transition-colors',
                  active ? 'border-primary bg-primary-surface/70' : 'border-slate-100 bg-white'
                )}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-white text-primary">
                  <Icon size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-bold text-slate-900">{vehicle.name}</span>
                  <span className="mt-0.5 block text-[11px] leading-relaxed text-slate-500">
                    {vehicle.description}
                  </span>
                  <span className="mt-1 block text-[13px] font-bold text-primary">
                    {formatCurrency(vehicle.pricePerDay)}
                    <span className="text-[10px] font-semibold text-slate-400"> /hari</span>
                  </span>
                </span>
                {active ? <CheckCircle2 size={18} className="mt-1 shrink-0 text-primary" /> : null}
              </button>
            );
          })}
        </div>

        <section className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3 shadow-card">
          <div>
            <p className="text-[12px] font-bold text-slate-900">Durasi sewa</p>
            <p className="text-[10px] text-slate-500">Maksimal 7 hari per permintaan</p>
          </div>
          <QuantityStepper value={days} onChange={setDays} min={1} max={7} label="hari" />
        </section>
      </div>

      <StickyActionBar>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Total sewa
            </p>
            <p className="text-[17px] font-bold text-primary">{formatCurrency(total)}</p>
          </div>
          <Button
            variant="action"
            size="md"
            disabled={!selected}
            onClick={startCheckout}
            className="shrink-0"
          >
            Lanjut Pesan
          </Button>
        </div>
      </StickyActionBar>
    </>
  );
};