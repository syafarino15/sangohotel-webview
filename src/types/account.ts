export interface MemberProfile {
  fullName: string;
  email: string;
  phone: string;
}

export type AppTab = 'home' | 'history' | 'vouchers' | 'account';

export type HistoryKind = 'hotel' | 'rent' | 'food';

export type HistoryStatus = 'PAID' | 'REQUESTED';

export interface HistoryRecord {
  code: string;
  kind: HistoryKind;
  title: string;
  subtitle: string;
  hotelName: string;
  total: number;
  createdAt: string;
  status: HistoryStatus;
  checkIn?: string;
  checkOut?: string;
  guestName?: string;
}