'use client';

import { useEffect } from 'react';
import { Mail, Phone, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HistoryRecord } from '@/types/account';

interface DeliveryDetailsProps {
  stay: HistoryRecord | null;
  isMember: boolean;
  guestName: string;
  guestPhone: string;
  roomNumber: string;
  onChange: (patch: { guestName?: string; guestPhone?: string; roomNumber?: string }) => void;
}

const inputClass = (hasError: boolean): string =>
  cn(
    'w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2',
    hasError
      ? 'border-red-400 focus:ring-red-100'
      : 'border-slate-200 focus:border-primary focus:ring-primary/15'
  );

export const DeliveryDetails = ({
  stay,
  isMember,
  guestName,
  guestPhone,
  roomNumber,
  onChange,
}: DeliveryDetailsProps) => {
  useEffect(() => {
    if (stay) {
      onChange({
        guestName: stay.guestName ?? guestName,
        guestPhone: stay.guestPhone ?? guestPhone,
        roomNumber: stay.roomNumber ?? roomNumber,
      });
    }
    // Autofill hanya saat data kamar yang terdeteksi berubah.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stay?.code]);

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-card">
      <header className="mb-2.5">
        <h2 className="text-[14px] font-bold text-slate-900">Data Pengantaran</h2>
        <p className="text-[11px] text-slate-500">
          {stay
            ? 'Terisi otomatis dari pesanan kamar Anda'
            : isMember
              ? 'Lengkapi data kamar agar pesanan sampai ke tempat yang benar'
              : 'Masukkan data pemesanan kamar Anda'}
        </p>
      </header>

      <div className="space-y-3">
        <label className="block">
          <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-slate-600">
            <User size={12} /> Nama Tamu
          </span>
          <input
            value={guestName}
            onChange={(event) => onChange({ guestName: event.target.value })}
            placeholder="Nama sesuai identitas"
            autoComplete="name"
            className={inputClass(false)}
          />
        </label>

        <label className="block">
          <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-slate-600">
            <Phone size={12} /> No. WhatsApp
          </span>
          <input
            value={guestPhone}
            onChange={(event) => onChange({ guestPhone: event.target.value })}
            placeholder="081234567890"
            inputMode="tel"
            autoComplete="tel"
            className={inputClass(false)}
          />
        </label>

        <label className="block">
          <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-slate-600">
            <Mail size={12} /> Nomor Kamar
          </span>
          <input
            value={roomNumber}
            onChange={(event) => onChange({ roomNumber: event.target.value })}
            placeholder="Contoh: 512"
            inputMode="numeric"
            className={inputClass(false)}
          />
          <span className="mt-1 block text-[10px] text-slate-400">
            Nomor kamar tertera pada e-voucher atau dapat ditanyakan ke resepsionis.
          </span>
        </label>
      </div>
    </section>
  );
};