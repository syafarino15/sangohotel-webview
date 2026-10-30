import type { PaymentMethodId } from './booking';
import type { FulfilmentMethod, ServiceId, ServiceLineItem } from './service';

export interface MemberProfile {
  fullName: string;
  email: string;
  phone: string;
}

export type AppTab = 'home' | 'history' | 'vouchers' | 'account';

export type HistoryKind = 'hotel' | 'rent' | 'food';

export type HistoryStatus = 'PAID' | 'REQUESTED';

/**
 * Satu transaksi (hotel, sewa, atau makanan). Field opsional dipakai halaman
 * detail dan pembuatan PDF, sehingga record lama tetap kompatibel.
 */
export interface HistoryRecord {
  code: string;
  kind: HistoryKind;
  title: string;
  subtitle: string;
  hotelName: string;
  hotelAddress?: string;
  hotelPhone?: string;
  mapsUrl?: string;
  total: number;
  subtotal?: number;
  tax?: number;
  discount?: number;
  createdAt: string;
  status: HistoryStatus;

  // Hotel
  checkIn?: string;
  checkOut?: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  roomName?: string;
  packageName?: string;
  nights?: number;
  guests?: number;
  rooms?: number;
  roomNumber?: string;

  // Pembayaran (semua jenis)
  paymentMethod?: PaymentMethodId;
  paidAt?: string | null;

  // Layanan (sewa & makanan)
  service?: ServiceId;
  fulfilment?: FulfilmentMethod;
  lines?: ServiceLineItem[];
  days?: number;
  pickupNote?: string;
  qrValue?: string;
}
