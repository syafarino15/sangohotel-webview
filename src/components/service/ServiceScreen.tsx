'use client';

import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { useBookingStore } from '@/stores/useBookingStore';
import type { ServiceId } from '@/types/service';
import { FoodService } from './FoodService';
import { RentService } from './RentService';

const COPY: Record<ServiceId, { title: string; subtitle: string }> = {
  rent: { title: 'Sewa Kendaraan', subtitle: 'Sepeda, motor, dan mobil hotel' },
  food: { title: 'Pesan Makanan', subtitle: 'Dapur hotel, antar ke kamar' },
};

export const ServiceScreen = () => {
  const activeService = useBookingStore((state) => state.activeService);
  const closeService = useBookingStore((state) => state.closeService);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeService]);

  if (!activeService) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col bg-canvas">
      <div className="sticky top-0 z-30">
        <Header
          title={COPY[activeService].title}
          subtitle={COPY[activeService].subtitle}
          onBack={closeService}
        />
      </div>

      {activeService === 'rent' ? <RentService /> : <FoodService />}
    </div>
  );
};