import type { HistoryRecord } from '@/types/account';

const toIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const hash = (value: string): number => {
  let result = 0;
  for (let index = 0; index < value.length; index += 1) {
    result = (result * 31 + value.charCodeAt(index)) >>> 0;
  }
  return result;
};

/**
 * Nomor kamar contoh yang stabil untuk satu kode reservasi.
 * Hotel sungguhan menentukannya saat check-in; ini hanya untuk demo alur antar kamar.
 */
export const generateRoomNumber = (code: string): string => {
  const seed = hash(code);
  const floor = 3 + (seed % 10);
  const unit = 1 + ((seed >>> 8) % 24);
  return `${floor}${`${unit}`.padStart(2, '0')}`;
};

export const isStayActive = (record: HistoryRecord, todayIso: string): boolean => {
  if (!record.checkIn || !record.checkOut) {
    return false;
  }
  return record.checkIn <= todayIso && todayIso <= record.checkOut;
};

/**
 * Booking hotel yang sedang berlangsung hari ini; bila tidak ada, pakai booking
 * hotel terakhir agar tamu tetap mendapat data kamar yang bisa dikoreksi.
 */
export const pickStayForDelivery = (
  history: HistoryRecord[],
  today: Date = new Date()
): HistoryRecord | null => {
  const stays = history.filter(
    (record) => record.kind === 'hotel' && record.status === 'PAID'
  );

  if (stays.length === 0) {
    return null;
  }

  const todayIso = toIsoDate(today);
  const active = stays.find((record) => isStayActive(record, todayIso));

  if (active) {
    return active;
  }

  return stays.reduce((latest, record) =>
    record.createdAt > latest.createdAt ? record : latest
  );
};

export const describeStay = (record: HistoryRecord | null): string => {
  if (!record) {
    return '';
  }
  const room = record.roomNumber ? `Kamar ${record.roomNumber}` : record.roomName ?? 'Kamar';
  return `${record.hotelName} · ${room}`;
};
