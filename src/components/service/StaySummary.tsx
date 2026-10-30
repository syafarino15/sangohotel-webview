'use client';

import { BedDouble, CheckCircle2, MapPin } from 'lucide-react';
import { formatDateShort } from '@/lib/formatters';
import type { HistoryRecord } from '@/types/account';

interface StaySummaryProps {
  stay: HistoryRecord;
}

export const StaySummary = ({ stay }: StaySummaryProps) => (
  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5">
    <p className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
      <CheckCircle2 size={12} /> Pesanan kamar ditemukan
    </p>
    <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-900">
      <BedDouble size={12} /> {stay.hotelName}
      {stay.roomNumber ? ` · Kamar ${stay.roomNumber}` : ''}
    </p>
    {stay.checkIn && stay.checkOut ? (
      <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-emerald-700">
        <MapPin size={10} />
        {formatDateShort(stay.checkIn)} - {formatDateShort(stay.checkOut)}
      </p>
    ) : null}
  </div>
);