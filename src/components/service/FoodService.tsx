'use client';

import { useMemo, useState } from 'react';
import { Coffee, IceCream, Salad, UtensilsCrossed } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StickyActionBar } from '@/components/ui/StickyActionBar';
import { HOTELS } from '@/data/hotels';
import { FOOD_MENUS } from '@/data/serviceCatalog';
import { formatCurrency } from '@/lib/formatters';
import type { FoodCategory, ServiceOrder } from '@/types/service';
import { QuantityStepper } from './QuantityStepper';
import { ServiceHotelSelect } from './ServiceHotelSelect';
import { ServiceSuccessSheet } from './ServiceSuccessSheet';

const CATEGORY_ICONS: Record<FoodCategory, LucideIcon> = {
  Main: UtensilsCrossed,
  Side: Salad,
  Dessert: IceCream,
  Drink: Coffee,
};

const makeCode = (): string => `FOD-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

export const FoodService = () => {
  const [hotelId, setHotelId] = useState(HOTELS[0].hotel.id);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [order, setOrder] = useState<ServiceOrder | null>(null);

  const hotel = HOTELS.find(({ hotel }) => hotel.id === hotelId)?.hotel ?? HOTELS[0].hotel;
  const { itemCount, total } = useMemo(
    () =>
      FOOD_MENUS.reduce(
        (acc, item) => {
          const qty = quantities[item.id] ?? 0;
          return {
            itemCount: acc.itemCount + qty,
            total: acc.total + qty * item.price,
          };
        },
        { itemCount: 0, total: 0 }
      ),
    [quantities]
  );

  const handleSubmit = () => {
    if (itemCount === 0) {
      return;
    }
    const chosen = FOOD_MENUS.filter((item) => (quantities[item.id] ?? 0) > 0);
    setOrder({
      code: makeCode(),
      service: 'food',
      hotelId: hotel.id,
      hotelName: hotel.name,
      itemLabel: chosen.length === 1 ? chosen[0].name : `${chosen.length} jenis menu`,
      quantity: itemCount,
      unit: 'Jumlah item',
      total,
    });
  };

  return (
    <>
      <div className="flex-1 space-y-2.5 px-3 pb-4 pt-2.5">
        <ServiceHotelSelect
          value={hotelId}
          onChange={(id) => setHotelId(id)}
          label="Dapur hotel"
        />

        <div className="space-y-2">
          {FOOD_MENUS.map((item) => {
            const Icon = CATEGORY_ICONS[item.category];
            const qty = quantities[item.id] ?? 0;
            return (
              <section
                key={item.id}
                className="flex items-start gap-2.5 rounded-2xl border border-slate-100 bg-white p-3 shadow-card"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-surface text-primary">
                  <Icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-slate-900">{item.name}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                  <p className="mt-1 text-[13px] font-bold text-primary">
                    {formatCurrency(item.price)}
                  </p>
                </div>
                <QuantityStepper
                  value={qty}
                  min={0}
                  max={10}
                  label={item.name}
                  onChange={(next) =>
                    setQuantities((current) => ({ ...current, [item.id]: next }))
                  }
                />
              </section>
            );
          })}
        </div>

        <p className="pb-1 text-center text-[10px] leading-relaxed text-slate-400">
          Pesanan diantar ke kamar atau lobby hotel. Pembayaran dilakukan langsung ke hotel.
        </p>
      </div>

      <StickyActionBar>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              {itemCount} item
            </p>
            <p className="text-[17px] font-bold text-primary">{formatCurrency(total)}</p>
          </div>
          <Button variant="action" size="md" disabled={itemCount === 0} onClick={handleSubmit}>
            Kirim Pesanan
          </Button>
        </div>
      </StickyActionBar>

      <ServiceSuccessSheet order={order} onClose={() => setOrder(null)} />
    </>
  );
};