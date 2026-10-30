'use client';

import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { HOTELS } from '@/data/hotels';
import { useServiceStore } from '@/stores/useServiceStore';
import type { ServiceId, ServiceStep } from '@/types/service';
import { FoodService } from './FoodService';
import { RentService } from './RentService';
import { ServiceCheckout } from './ServiceCheckout';
import { ServicePayment } from './ServicePayment';
import { ServiceReceipt } from './ServiceReceipt';

const TITLES: Record<ServiceId, Record<ServiceStep, { title: string; subtitle: string }>> = {
  rent: {
    select: { title: 'Sewa Kendaraan', subtitle: 'Sepeda, motor, dan mobil hotel' },
    checkout: { title: 'Rincian Sewa', subtitle: 'Metode penyerahan dan data tamu' },
    payment: { title: 'Pembayaran', subtitle: 'Selesaikan pembayaran sewa' },
    receipt: { title: 'Bukti Sewa', subtitle: 'QR klaim kendaraan' },
  },
  food: {
    select: { title: 'Pesan Makanan', subtitle: 'Dapur hotel, antar ke kamar' },
    checkout: { title: 'Rincian Pesanan', subtitle: 'Metode pengambilan dan data tamu' },
    payment: { title: 'Pembayaran', subtitle: 'Selesaikan pembayaran pesanan' },
    receipt: { title: 'Bukti Pesanan', subtitle: 'Tunjukkan QR saat mengambil pesanan' },
  },
};

const PREVIOUS: Record<ServiceStep, ServiceStep | null> = {
  select: null,
  checkout: 'select',
  payment: 'checkout',
  receipt: null,
};

export const ServiceScreen = () => {
  const activeService = useServiceStore((state) => state.activeService);
  const step = useServiceStore((state) => state.step);
  const draft = useServiceStore((state) => state.draft);
  const closeService = useServiceStore((state) => state.closeService);
  const goToStep = useServiceStore((state) => state.goToStep);
  const setHotel = useServiceStore((state) => state.setHotel);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeService, step]);

  useEffect(() => {
    if (draft && !draft.hotelId) {
      setHotel(HOTELS[0].hotel.id);
    }
  }, [draft, setHotel]);

  if (!activeService) {
    return null;
  }

  const copy = TITLES[activeService][step];
  const previous = PREVIOUS[step];

  return (
    <div className="flex flex-1 flex-col bg-canvas">
      <div className="sticky top-0 z-30">
        <Header
          title={copy.title}
          subtitle={copy.subtitle}
          onBack={previous ? () => goToStep(previous) : closeService}
        />
      </div>

      {step === 'select' ? (
        activeService === 'rent' ? (
          <RentService />
        ) : (
          <FoodService />
        )
      ) : null}
      {step === 'checkout' ? <ServiceCheckout /> : null}
      {step === 'payment' ? <ServicePayment /> : null}
      {step === 'receipt' ? <ServiceReceipt /> : null}
    </div>
  );
};