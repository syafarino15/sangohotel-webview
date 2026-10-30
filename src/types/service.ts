import type { PaymentMethodId } from './booking';

export type ServiceId = 'rent' | 'food';

export type RentCategory = 'Bike' | 'Motorcycle' | 'Car';

export type FoodCategory = 'Main' | 'Side' | 'Dessert' | 'Drink';

export type PromoAction = ServiceId | 'booking';

/** Ambil sendiri di hotel, atau diantar ke kamar tamu. */
export type FulfilmentMethod = 'pickup' | 'delivery';

export type ServiceStep = 'select' | 'checkout' | 'payment' | 'receipt';

export interface RentVehicle {
  id: string;
  name: string;
  category: RentCategory;
  description: string;
  pricePerDay: number;
  seats?: number;
  transmission?: string;
}

export interface FoodMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
}

export interface PromoBanner {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  image: string;
  action: PromoAction;
}

export interface ServiceLineItem {
  id: string;
  label: string;
  qty: number;
  unitPrice: number;
}

/** Data yang dikumpulkan di langkah pemesanan sebelum pembayaran. */
export interface ServiceDraft {
  service: ServiceId;
  hotelId: string;
  fulfilment: FulfilmentMethod;
  lines: ServiceLineItem[];
  days: number;
  guestName: string;
  guestPhone: string;
  roomNumber: string;
  notes: string;
}

export interface ServicePayment {
  method: PaymentMethodId;
  status: 'IDLE' | 'PENDING' | 'PAID' | 'EXPIRED';
  expiresAt: number | null;
  paidAt: string | null;
}

export interface ServiceTotals {
  subtotal: number;
  tax: number;
  total: number;
}
