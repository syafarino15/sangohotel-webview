import { generateRoomNumber } from '@/lib/stay';
import type { HistoryRecord } from '@/types/account';
import type { Booking } from '@/types/booking';
import type { Hotel } from '@/types/booking';
import type { ServiceDraft, ServicePayment, ServiceTotals } from '@/types/service';

export const buildHotelRecord = (booking: Booking, paidAt: string | null): HistoryRecord => {
  const guestName = booking.guest.bookingForOther
    ? booking.guest.guestName
    : booking.guest.fullName;

  return {
    code: booking.reference,
    kind: 'hotel',
    title: booking.roomName,
    subtitle: `${booking.packageName} · ${booking.nights} malam`,
    hotelName: booking.hotel.name,
    hotelAddress: `${booking.hotel.address}, ${booking.hotel.city}`,
    hotelPhone: booking.hotel.phone,
    mapsUrl: booking.hotel.mapsUrl,
    total: booking.pricing.total,
    subtotal: booking.pricing.roomTotal,
    tax: booking.pricing.tax,
    discount: booking.pricing.discount,
    createdAt: booking.createdAt,
    status: 'PAID',
    checkIn: booking.search.checkIn,
    checkOut: booking.search.checkOut,
    guestName,
    guestPhone: booking.guest.phone,
    guestEmail: booking.guest.email,
    roomName: booking.roomName,
    packageName: booking.packageName,
    nights: booking.nights,
    guests: booking.search.guests,
    rooms: booking.search.rooms,
    roomNumber: generateRoomNumber(booking.reference),
    paymentMethod: booking.method,
    paidAt,
    qrValue: `SANGO|${booking.reference}|${booking.hotel.id}|${booking.search.checkIn}|${booking.search.checkOut}`,
  };
};

export const buildServiceRecord = ({
  draft,
  hotel,
  reference,
  payment,
  totals,
}: {
  draft: ServiceDraft;
  hotel: Hotel;
  reference: string;
  payment: ServicePayment;
  totals: ServiceTotals;
}): HistoryRecord => {
  const isRent = draft.service === 'rent';
  const primary = draft.lines[0];
  const title = isRent
    ? primary?.label ?? 'Sewa kendaraan'
    : draft.lines.length === 1
      ? primary?.label ?? 'Pesanan makanan'
      : `${draft.lines.length} jenis menu`;

  const subtitle = isRent
    ? `${draft.days} hari · ${draft.fulfilment === 'delivery' ? 'diantar ke kamar' : 'ambil sendiri'}`
    : `${draft.lines.reduce((sum, line) => sum + line.qty, 0)} item · ${
        draft.fulfilment === 'delivery' ? 'diantar ke kamar' : 'ambil sendiri'
      }`;

  return {
    code: reference,
    kind: draft.service,
    service: draft.service,
    title,
    subtitle,
    hotelName: hotel.name,
    hotelAddress: `${hotel.address}, ${hotel.city}`,
    hotelPhone: hotel.phone,
    mapsUrl: hotel.mapsUrl,
    total: totals.total,
    subtotal: totals.subtotal,
    tax: totals.tax,
    createdAt: new Date().toISOString(),
    status: payment.status === 'PAID' ? 'PAID' : 'REQUESTED',
    guestName: draft.guestName,
    guestPhone: draft.guestPhone,
    roomNumber: draft.fulfilment === 'delivery' ? draft.roomNumber : undefined,
    fulfilment: draft.fulfilment,
    lines: draft.lines,
    days: isRent ? draft.days : undefined,
    paymentMethod: payment.method,
    paidAt: payment.paidAt,
    pickupNote: isRent
      ? 'Ambil kendaraan di meja concierge hotel, tunjukkan QR pemesanan.'
      : 'Ambil pesanan di restoran hotel, tunjukkan QR pemesanan.',
    qrValue: isRent ? `SANGO-RENT|${reference}|${hotel.id}|${draft.days}` : undefined,
  };
};
