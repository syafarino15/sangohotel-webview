'use client';

import { useEffect, useMemo } from 'react';
import { Coffee, IceCream, Salad, UtensilsCrossed } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StickyActionBar } from '@/components/ui/StickyActionBar';
import { HOTELS } from '@/data/hotels';
import { FOOD_MENUS } from '@/data/serviceCatalog';
import { formatCurrency } from '@/lib/formatters';
import { useServiceStore } from '@/stores/useServiceStore';
import type { FoodCategory } from '@/types/service';
import { QuantityStepper } from './QuantityStepper';
import { ServiceHotelSelect } from './ServiceHotelSelect';

const CATEGORY_ICONS: Record<FoodCategory, LucideIcon> = {
  Main: UtensilsCrossed,
  Side: Salad,
  Dessert: IceCream,
  Drink: Coffee,
};

export const FoodService = () => {
  const draft = useServiceStore((state) => state.draft);
  const setHotel = useServiceStore((state) => state.setHotel);
  const setLines = useServiceStore((state) => state.setLines);
  const startCheckout = useServiceStore((state) => state.startCheckout);

  const quantities = useMemo(() => {
    const map: Record<string, number> = {};
    draft?.lines.forEach((line) => {
      map[line.id] = line.qty;
    });
    return map;
  }, [draft?.lines]);

  useEffect(() => {
    if (draft && !draft.hotelId) {
      setHotel(HOTELS[0].hotel.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft?.hotelId]);

  const hotelId = draft?.hotelId || HOTELS[0].hotel.id;

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

  const handleQuantity = (itemId: string, next: number) => {
    const menu = FOOD_MENUS.find((item) => item.id === itemId);
    if (!menu) {
      return;
    }
    const merged = FOOD_MENUS.filter((item) => {
      const qty = item.id === itemId ? next : quantities[item.id] ?? 0;
      return qty > 0;
    }).map((item) => ({
      id: item.id,
      label: item.name,
      qty: item.id === itemId ? next : quantities[item.id] ?? 0,
      unitPrice: item.price,
    }));

    setLines(merged);
  };

  return (
    <>
      <div className="flex-1 space-y-2.5 px-3 pb-4 pt-2.5">
        <ServiceHotelSelect value={hotelId} onChange={setHotel} label="Dapur hotel" />

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
                  onChange={(next) => handleQuantity(item.id, next)}
                />
              </section>
            );
          })}
        </div>

        <p className="pb-1 text-center text-[10px] leading-relaxed text-slate-400">
          Pesanan dapat diambil di restoran atau diantar ke kamar. Pilih saat pemesanan.
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
          <Button
            variant="action"
            size="md"
            disabled={itemCount === 0}
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