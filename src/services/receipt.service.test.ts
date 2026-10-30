import { describe, expect, it } from 'vitest';
import { buildReceiptPdf } from './receipt.service';
import { buildHotelRecord, buildServiceRecord } from './transaction.service';
import { HOTELS } from '@/data/hotelCatalog';
import type { Booking } from '@/types/booking';
import type { ServiceDraft, ServicePayment } from '@/types/service';

const listing = HOTELS[0];
const room = listing.rooms[0];
const roomPackage = room.packages[0];

const booking: Booking = {
  reference: 'SNG-2026-TEST1',
  hotel: listing.hotel,
  roomId: room.id,
  roomName: room.name,
  packageId: roomPackage.id,
  packageName: roomPackage.name,
  includesBreakfast: roomPackage.includesBreakfast,
  search: { checkIn: '2026-11-14', checkOut: '2026-11-16', guests: 2, rooms: 1 },
  nights: 2,
  guest: {
    fullName: 'Rian Kusuma',
    email: 'rian@example.com',
    phone: '081234567890',
    bookingForOther: false,
    guestName: '',
    specialRequests: [],
    notes: '',
  },
  pricing: {
    pricePerNight: 650_000,
    nights: 2,
    rooms: 1,
    roomTotal: 1_300_000,
    tax: 130_000,
    discount: 50_000,
    total: 1_380_000,
  },
  method: 'BCA_VA',
  createdAt: '2026-11-14T08:00:00.000Z',
};

const paidPayment: ServicePayment = {
  method: 'BCA_VA',
  status: 'PAID',
  expiresAt: null,
  paidAt: '2026-11-14T08:10:00.000Z',
};

const rentDraft: ServiceDraft = {
  service: 'rent',
  hotelId: listing.hotel.id,
  fulfilment: 'pickup',
  lines: [{ id: 'RV-CAR-01', label: 'City Car', qty: 1, unitPrice: 350_000 }],
  days: 2,
  guestName: 'Rian Kusuma',
  guestPhone: '081234567890',
  roomNumber: '',
  notes: '',
};

const totals = { subtotal: 700_000, tax: 70_000, total: 770_000 };

const isPdf = (output: string): boolean => output.startsWith('%PDF-');

describe('pembuat PDF bukti pembayaran', () => {
  it('menghasilkan berkas PDF untuk reservasi hotel', async () => {
    const record = buildHotelRecord(booking, paidPayment.paidAt);
    const doc = await buildReceiptPdf(record);

    expect(isPdf(doc.output())).toBe(true);
    expect(record.qrValue).toContain(booking.reference);
    expect(record.roomNumber).toMatch(/^\d{3}$/);
  });

  it('menghasilkan PDF untuk sewa kendaraan beserta QR klaim', async () => {
    const record = buildServiceRecord({
      draft: rentDraft,
      hotel: listing.hotel,
      reference: 'RNT-2026-TEST1',
      payment: paidPayment,
      totals,
    });
    const doc = await buildReceiptPdf(record);

    expect(isPdf(doc.output())).toBe(true);
    expect(record.qrValue).toContain('SANGO-RENT');
    expect(record.status).toBe('PAID');
    expect(record.lines).toHaveLength(1);
  });

  it('menghasilkan PDF untuk pesanan makanan', async () => {
    const record = buildServiceRecord({
      draft: {
        ...rentDraft,
        service: 'food',
        fulfilment: 'delivery',
        roomNumber: '512',
        lines: [
          { id: 'FD-01', label: 'Nasi Goreng Sango', qty: 2, unitPrice: 65_000 },
          { id: 'FD-08', label: 'Kopi Tubruk Sango', qty: 1, unitPrice: 28_000 },
        ],
      },
      hotel: listing.hotel,
      reference: 'FOD-2026-TEST1',
      payment: paidPayment,
      totals,
    });
    const doc = await buildReceiptPdf(record);

    expect(isPdf(doc.output())).toBe(true);
    expect(record.kind).toBe('food');
    expect(record.roomNumber).toBe('512');
    expect(record.qrValue).toBeUndefined();
  });
});

describe('buildHotelRecord', () => {
  it('menyimpan data yang dibutuhkan halaman detail dan PDF', () => {
    const record = buildHotelRecord(booking, paidPayment.paidAt);

    expect(record.kind).toBe('hotel');
    expect(record.status).toBe('PAID');
    expect(record.paymentMethod).toBe('BCA_VA');
    expect(record.subtotal).toBe(1_300_000);
    expect(record.tax).toBe(130_000);
    expect(record.guestName).toBe('Rian Kusuma');
    expect(record.hotelPhone).toBe(listing.hotel.phone);
  });
});

describe('buildServiceRecord', () => {
  it('menandai pesanan belum dibayar sebagai REQUESTED', () => {
    const record = buildServiceRecord({
      draft: rentDraft,
      hotel: listing.hotel,
      reference: 'RNT-2026-PEND1',
      payment: { ...paidPayment, status: 'PENDING', paidAt: null },
      totals,
    });

    expect(record.status).toBe('REQUESTED');
  });

  it('hanya menyimpan nomor kamar untuk pengantaran', () => {
    const pickup = buildServiceRecord({
      draft: { ...rentDraft, roomNumber: '512', fulfilment: 'pickup' },
      hotel: listing.hotel,
      reference: 'RNT-2026-PICK1',
      payment: paidPayment,
      totals,
    });

    expect(pickup.roomNumber).toBeUndefined();
    expect(pickup.fulfilment).toBe('pickup');
  });
});