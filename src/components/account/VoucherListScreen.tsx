'use client';

import { useMemo } from 'react';
import { ChevronRight, Ticket } from 'lucide-react';
import { Header } from '@/components/Header';
import { formatCurrency, formatDateWithDay } from '@/lib/formatters';
import { useSessionStore } from '@/stores/useSessionStore';

interface VoucherListScreenProps {
  onOpen: (code: string) => void;
}

export const VoucherListScreen = ({ onOpen }: VoucherListScreenProps) => {
  const history = useSessionStore((state) => state.history);
  const vouchers = useMemo(
    () => history.filter((record) => record.kind === 'hotel'),
    [history]
  );

  return (
    <div className="flex flex-1 flex-col bg-canvas">
      <div className="sticky top-0 z-30">
        <Header title="Voucher" subtitle="E-voucher pemesanan hotel" />
      </div>

      <div className="flex-1 space-y-2.5 px-3 pb-[calc(5rem+env(safe-area-inset-bottom,0px)+var(--host-bottom-offset,0px))] pt-2.5">
        {vouchers.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-card">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Ticket size={22} />
            </span>
            <p className="text-[13px] font-bold text-slate-800">Belum ada voucher</p>
            <p className="text-[11px] leading-relaxed text-slate-500">
              E-voucher terbit otomatis setelah pembayaran kamar dikonfirmasi.
            </p>
          </div>
        ) : (
          vouchers.map((voucher) => (
            <button
              key={voucher.code}
              type="button"
              onClick={() => onOpen(voucher.code)}
              className="w-full overflow-hidden rounded-2xl border border-slate-100 bg-white text-left shadow-card active:bg-slate-50"
            >
              <div className="flex items-center justify-between gap-2 border-b border-dashed border-slate-200 px-3.5 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-bold text-slate-900">
                    {voucher.hotelName}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    E-Voucher
                  </p>
                </div>
                <span className="shrink-0 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Lunas
                </span>
              </div>

              <div className="space-y-2 px-3.5 py-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Kode Reservasi
                  </p>
                  <p className="font-mono text-[15px] font-bold tracking-wide text-slate-900">
                    {voucher.code}
                  </p>
                </div>

                <dl className="space-y-1 text-[11px]">
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-slate-500">Menginap</dt>
                    <dd className="text-right font-semibold text-slate-800">
                      {voucher.title}
                    </dd>
                  </div>
                  {voucher.checkIn && voucher.checkOut ? (
                    <div className="flex items-start justify-between gap-3">
                      <dt className="text-slate-500">Tanggal</dt>
                      <dd className="text-right font-semibold text-slate-800">
                        {formatDateWithDay(voucher.checkIn)} - {formatDateWithDay(voucher.checkOut)}
                      </dd>
                    </div>
                  ) : null}
                  {voucher.guestName ? (
                    <div className="flex items-start justify-between gap-3">
                      <dt className="text-slate-500">Tamu</dt>
                      <dd className="text-right font-semibold text-slate-800">
                        {voucher.guestName}
                      </dd>
                    </div>
                  ) : null}
                </dl>

                <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2">
                  <span className="text-[11px] font-bold text-slate-900">Total</span>
                  <span className="flex items-center gap-1 text-[15px] font-bold text-primary">
                    {formatCurrency(voucher.total)}
                    <ChevronRight size={14} className="text-slate-300" />
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};