'use client';

import { CheckCircle2 } from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/formatters';
import type { ServiceOrder } from '@/types/service';

interface ServiceSuccessSheetProps {
  order: ServiceOrder | null;
  onClose: () => void;
}

export const ServiceSuccessSheet = ({ order, onClose }: ServiceSuccessSheetProps) => (
  <BottomSheet
    open={Boolean(order)}
    onClose={onClose}
    title="Permintaan terkirim"
    subtitle="Tim hotel akan menghubungi Anda untuk konfirmasi."
    footer={
      <Button fullWidth onClick={onClose}>
        Selesai
      </Button>
    }
  >
    {order ? (
      <div className="space-y-3 pb-2">
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <p className="text-[11px] font-semibold leading-relaxed text-emerald-800">
            Pesanan {order.code} diterima {order.hotelName}.
          </p>
        </div>

        <dl className="space-y-2 text-[12px]">
          <div className="flex items-start justify-between gap-3">
            <dt className="text-slate-500">Item</dt>
            <dd className="text-right font-semibold text-slate-900">{order.itemLabel}</dd>
          </div>
          <div className="flex items-start justify-between gap-3">
            <dt className="text-slate-500">{order.unit}</dt>
            <dd className="font-semibold text-slate-900">{order.quantity}</dd>
          </div>
          <div className="flex items-start justify-between gap-3 border-t border-dashed border-slate-200 pt-2">
            <dt className="font-bold text-slate-900">Total</dt>
            <dd className="text-[15px] font-bold text-primary">{formatCurrency(order.total)}</dd>
          </div>
        </dl>
      </div>
    ) : null}
  </BottomSheet>
);