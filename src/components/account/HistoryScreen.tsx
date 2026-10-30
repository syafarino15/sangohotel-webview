'use client';

import { BedDouble, Car, ChevronRight, ReceiptText, UtensilsCrossed } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Header } from '@/components/Header';
import { formatCurrency, formatDateShort } from '@/lib/formatters';
import { useSessionStore } from '@/stores/useSessionStore';
import type { HistoryKind } from '@/types/account';
import { cn } from '@/lib/utils';

const KIND_META: Record<HistoryKind, { label: string; icon: LucideIcon }> = {
  hotel: { label: 'Hotel', icon: BedDouble },
  rent: { label: 'Rent', icon: Car },
  food: { label: 'Food', icon: UtensilsCrossed },
};

interface HistoryScreenProps {
  onOpen: (code: string) => void;
}

export const HistoryScreen = ({ onOpen }: HistoryScreenProps) => {
  const history = useSessionStore((state) => state.history);

  return (
    <div className="flex flex-1 flex-col bg-canvas">
      <div className="sticky top-0 z-30">
        <Header title="Riwayat" subtitle="Semua transaksi Anda" />
      </div>

      <div className="flex-1 space-y-2.5 px-3 pb-[calc(5rem+env(safe-area-inset-bottom,0px)+var(--host-bottom-offset,0px))] pt-2.5">
        {history.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-card">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <ReceiptText size={22} />
            </span>
            <p className="text-[13px] font-bold text-slate-800">Belum ada transaksi</p>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Pemesanan hotel, sewa kendaraan, dan pesanan makanan akan muncul di sini.
            </p>
          </div>
        ) : (
          history.map((record) => {
            const meta = KIND_META[record.kind];
            const Icon = meta.icon;
            const paid = record.status === 'PAID';

            return (
              <button
                key={record.code}
                type="button"
                onClick={() => onOpen(record.code)}
                className="w-full rounded-2xl border border-slate-100 bg-white p-3 text-left shadow-card active:bg-slate-50"
              >
                <div className="flex items-start gap-2.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-surface text-primary">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13px] font-bold leading-snug text-slate-900">
                        {record.title}
                      </p>
                      <span
                        className={cn(
                          'shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                          paid
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-action-soft text-action-ink'
                        )}
                      >
                        {paid ? 'Lunas' : 'Menunggu'}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                      {record.subtitle}
                    </p>
                    <p className="text-[11px] text-slate-500">{record.hotelName}</p>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-slate-400">
                        {meta.label} · {formatDateShort(record.createdAt.slice(0, 10))}
                      </span>
                      <span className="flex items-center gap-1 text-[13px] font-bold text-primary">
                        {formatCurrency(record.total)}
                        <ChevronRight size={14} className="text-slate-300" />
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};