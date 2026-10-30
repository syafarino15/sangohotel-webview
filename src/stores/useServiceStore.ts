'use client';

import { create } from 'zustand';
import { PAYMENT_WINDOW_SECONDS, TAX_RATE } from '@/lib/pricing';
import type { PaymentMethodId } from '@/types/booking';
import type {
  FulfilmentMethod,
  ServiceDraft,
  ServiceId,
  ServiceLineItem,
  ServicePayment,
  ServiceStep,
  ServiceTotals,
} from '@/types/service';

const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const makeReference = (service: ServiceId): string => {
  let code = '';
  for (let index = 0; index < 5; index += 1) {
    code += REFERENCE_ALPHABET[Math.floor(Math.random() * REFERENCE_ALPHABET.length)];
  }
  const prefix = service === 'rent' ? 'RNT' : 'FOD';
  return `${prefix}-${new Date().getFullYear()}-${code}`;
};

const emptyPayment: ServicePayment = {
  method: 'BCA_VA',
  status: 'IDLE',
  expiresAt: null,
  paidAt: null,
};

export const calculateTotals = (lines: ServiceLineItem[]): ServiceTotals => {
  const subtotal = lines.reduce((sum, line) => sum + line.qty * line.unitPrice, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  return { subtotal, tax, total: subtotal + tax };
};

interface ServiceStore {
  activeService: ServiceId | null;
  step: ServiceStep;
  draft: ServiceDraft | null;
  payment: ServicePayment;
  reference: string | null;

  openService: (service: ServiceId) => void;
  closeService: () => void;
  goToStep: (step: ServiceStep) => void;

  setHotel: (hotelId: string) => void;
  setFulfilment: (fulfilment: FulfilmentMethod) => void;
  setLines: (lines: ServiceLineItem[]) => void;
  setDays: (days: number) => void;
  setGuest: (patch: Partial<Pick<ServiceDraft, 'guestName' | 'guestPhone' | 'roomNumber' | 'notes'>>) => void;

  startCheckout: () => void;
  startPayment: () => void;
  confirmPayment: () => void;
  expirePayment: () => void;
  reset: () => void;
}

const initialDraft = (service: ServiceId): ServiceDraft => ({
  service,
  hotelId: '',
  fulfilment: 'pickup',
  lines: [],
  days: 1,
  guestName: '',
  guestPhone: '',
  roomNumber: '',
  notes: '',
});

export const useServiceStore = create<ServiceStore>((set, get) => ({
  activeService: null,
  step: 'select',
  draft: null,
  payment: emptyPayment,
  reference: null,

  openService: (service) =>
    set({
      activeService: service,
      step: 'select',
      draft: initialDraft(service),
      payment: emptyPayment,
      reference: null,
    }),

  closeService: () => set({ activeService: null, step: 'select', draft: null, payment: emptyPayment }),

  goToStep: (step) => set({ step }),

  setHotel: (hotelId) =>
    set((state) => (state.draft ? { draft: { ...state.draft, hotelId } } : state)),

  setFulfilment: (fulfilment) =>
    set((state) => (state.draft ? { draft: { ...state.draft, fulfilment } } : state)),

  setLines: (lines) => set((state) => (state.draft ? { draft: { ...state.draft, lines } } : state)),

  setDays: (days) =>
    set((state) =>
      state.draft ? { draft: { ...state.draft, days: Math.min(7, Math.max(1, days)) } } : state
    ),

  setGuest: (patch) => set((state) => (state.draft ? { draft: { ...state.draft, ...patch } } : state)),

  startCheckout: () => set({ step: 'checkout' }),

  startPayment: () => {
    const { draft, payment } = get();
    if (!draft || draft.lines.length === 0) {
      return;
    }
    set({
      step: 'payment',
      reference: makeReference(draft.service),
      payment: {
        ...payment,
        status: 'PENDING',
        expiresAt: Date.now() + PAYMENT_WINDOW_SECONDS * 1000,
        paidAt: null,
      },
    });
  },

  confirmPayment: () =>
    set((state) => ({
      step: 'receipt',
      payment: {
        ...state.payment,
        status: 'PAID',
        paidAt: new Date().toISOString(),
        expiresAt: null,
      },
    })),

  expirePayment: () =>
    set((state) => ({
      payment: { ...state.payment, status: 'EXPIRED', expiresAt: null },
    })),

  reset: () =>
    set({
      activeService: null,
      step: 'select',
      draft: null,
      payment: emptyPayment,
      reference: null,
    }),
}));

export const setServicePaymentMethod = (method: PaymentMethodId): void => {
  useServiceStore.setState((state) => ({ payment: { ...state.payment, method } }));
};
