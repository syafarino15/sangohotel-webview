import { describe, expect, it } from 'vitest';
import type { HistoryRecord } from '@/types/account';
import { generateRoomNumber, isStayActive, pickStayForDelivery } from './stay';

const baseRecord: HistoryRecord = {
  code: 'SNG-2026-AAAAA',
  kind: 'hotel',
  title: 'Superior Room',
  subtitle: 'Room Only · 2 malam',
  hotelName: 'Metro Park View Hotel Semarang',
  total: 1_380_000,
  createdAt: '2026-11-14T08:00:00.000Z',
  status: 'PAID',
  checkIn: '2026-11-14',
  checkOut: '2026-11-16',
  guestName: 'Rian Kusuma',
  guestPhone: '081234567890',
};

describe('nomor kamar simulasi', () => {
  it('stabil untuk kode yang sama', () => {
    expect(generateRoomNumber('SNG-2026-AAAAA')).toBe(generateRoomNumber('SNG-2026-AAAAA'));
  });

  it('berbeda antar kode reservasi', () => {
    const a = generateRoomNumber('SNG-2026-AAAAA');
    const b = generateRoomNumber('SNG-2026-BBBBB');
    expect(a).not.toBe(b);
  });

  it('berformat tiga digit', () => {
    expect(generateRoomNumber('SNG-2026-CCCCC')).toMatch(/^\d{3}$/);
  });
});

describe('isStayActive', () => {
  it('true bila tanggal hari ini di dalam rentang menginap', () => {
    expect(isStayActive(baseRecord, '2026-11-15')).toBe(true);
  });

  it('true pada hari check-in dan check-out', () => {
    expect(isStayActive(baseRecord, '2026-11-14')).toBe(true);
    expect(isStayActive(baseRecord, '2026-11-16')).toBe(true);
  });

  it('false bila di luar rentang', () => {
    expect(isStayActive(baseRecord, '2026-11-13')).toBe(false);
    expect(isStayActive(baseRecord, '2026-11-17')).toBe(false);
  });

  it('false bila tanggal tidak lengkap', () => {
    expect(isStayActive({ ...baseRecord, checkIn: undefined }, '2026-11-15')).toBe(false);
  });
});

describe('pickStayForDelivery', () => {
  const older: HistoryRecord = {
    ...baseRecord,
    code: 'SNG-2026-OLD01',
    checkIn: '2026-10-01',
    checkOut: '2026-10-03',
    createdAt: '2026-09-20T08:00:00.000Z',
  };

  it('memilih booking yang aktif hari ini', () => {
    const picked = pickStayForDelivery([older, baseRecord], new Date('2026-11-15T10:00:00'));
    expect(picked?.code).toBe('SNG-2026-AAAAA');
  });

  it('memakai booking terakhir bila tidak ada yang aktif', () => {
    const picked = pickStayForDelivery([older, baseRecord], new Date('2027-01-01T10:00:00'));
    expect(picked?.code).toBe('SNG-2026-AAAAA');
  });

  it('mengabaikan transaksi non-hotel', () => {
    const rent: HistoryRecord = {
      ...baseRecord,
      code: 'RNT-2026-XXXXX',
      kind: 'rent',
    };
    const picked = pickStayForDelivery([rent], new Date('2026-11-15T10:00:00'));
    expect(picked).toBeNull();
  });

  it('mengembalikan null bila belum ada booking hotel', () => {
    expect(pickStayForDelivery([], new Date())).toBeNull();
  });
});