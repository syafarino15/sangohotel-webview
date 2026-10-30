'use client';

import { useMemo } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StickyActionBar } from '@/components/ui/StickyActionBar';
import { PaymentCountdownBanner } from '@/components/payment/PaymentCountdownBanner';
import { PaymentExpiredDialog } from '@/components/payment/PaymentExpiredDialog';
import { PaymentMethodList } from '@/components/payment/PaymentMethodList';
import { CreditCardPanel } from '@/components/payment/CreditCardPanel';
import { QrisPanel } from '@/components/payment/QrisPanel';
import { VirtualAccountPanel } from '@/components/payment/VirtualAccountPanel';
import { HOTELS } from '@/data/hotels';
import { getPaymentMethod } from '@/data/mockData';
import { formatCurrency } from '@/lib/formatters';
import { useCountdown } from '@/hooks/useCountdown';
import { useBookingStore } from '@/stores/useBookingStore';
import { calculateTotals, setServicePaymentMethod, useServiceStore } from '@/stores/useServiceStore';
import type { ServiceId } from '@/types/service';

const COPY: Record<ServiceId, { title: string; noun: string }> = {
  rent: { title: 'Pembayaran Sewa', noun: 'kendaraan' },
  food: { title: 'Pembayaran Makanan', noun: 'pesanan' },
};

export const ServicePayment = () => {
  const draft = useServiceStore((state) => state.draft);
  const payment = useServiceStore((state) => state.payment);
  const reference = useServiceStore((state) => state.reference);
  const confirmPayment = useServiceStore((state) => state.confirmPayment);
  const expirePayment = useServiceStore((state) => state.expirePayment);
  const reset = useServiceStore((state) => state.reset);
  const showToast = useBookingStore((state) => state.showToast);

  const { label } = useCountdown(payment.expiresAt, expirePayment);
  const totals = useMemo(() => calculateTotals(draft?.lines ?? []), [draft?.lines]);
  const hotel = HOTELS.find(({ hotel }) => hotel.id === draft?.hotelId)?.hotel ?? HOTELS[0].hotel;
  const method = getPaymentMethod(payment.method);
  const expired = payment.status === 'EXPIRED';

  if (!draft || !reference) {
    return null;
  }

  return (
    <>
      <PaymentCountdownBanner
        label={label}
        expired={expired}
        subject={draft.service === 'rent' ? 'kendaraan Anda' : 'pesanan Anda'}
      />

      <div className="flex-1 space-y-2.5 px-3 pb-4 pt-2.5">
        <section className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-card">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Kode Booking
              </p>
              <p className="truncate font-mono text-[15px] font-bold tracking-wide text-slate-900">
                {reference}
              </p>
            </div>
            <span
              className={
                expired
                  ? 'shrink-0 rounded-md bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-600'
                  : 'shrink-0 rounded-md bg-action-soft px-1.5 py-0.5 text-[10px] font-semibold text-action-ink'
              }
            >
              {expired ? 'Kedaluwarsa' : 'Menunggu Pembayaran'}
            </span>
          </div>

          <dl className="mt-2.5 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <dt className="text-slate-400">Layanan</dt>
              <dd className="font-semibold text-slate-900">{COPY[draft.service].title}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Metode</dt>
              <dd className="font-semibold text-slate-900">
                {draft.fulfilment === 'delivery' ? 'Diantar ke kamar' : 'Ambil sendiri'}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-slate-400">Hotel</dt>
              <dd className="font-semibold text-slate-900">{hotel.name}</dd>
            </div>
          </dl>
        </section>

        <PaymentMethodList selected={payment.method} onSelect={setServicePaymentMethod} />

        {payment.method === 'BCA_VA' || payment.method === 'MANDIRI_VA' ? (
          <VirtualAccountPanel
            method={method}
            amount={totals.total}
            onCopy={(message) => showToast(message, 'success')}
          />
        ) : null}
        {payment.method === 'QRIS' ? (
          <QrisPanel method={method} amount={totals.total} reference={reference} />
        ) : null}
        {payment.method === 'CREDIT_CARD' ? <CreditCardPanel method={method} /> : null}

        <p className="flex items-center justify-center gap-1 pb-1 text-[10px] text-slate-400">
          <ShieldCheck size={11} /> Transaksi dilindungi enkripsi Sango SecurePay
        </p>
      </div>

      <StickyActionBar>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-500">Total Pembayaran</p>
            <p className="truncate text-[17px] font-bold text-primary">
              {formatCurrency(totals.total)}
            </p>
          </div>
          <Button
            variant="action"
            size="lg"
            className="shrink-0"
            onClick={confirmPayment}
            disabled={expired}
          >
            Saya Sudah Bayar
          </Button>
        </div>
        <p className="mt-1.5 text-center text-[9px] text-slate-400">
          Tombol simulasi: pembayaran dianggap sukses.
        </p>
      </StickyActionBar>

      <PaymentExpiredDialog
        open={expired}
        onRestart={reset}
        title="Waktu Pembayaran Habis"
        description={`Batas waktu pembayaran ${COPY[draft.service].noun} telah berakhir.`}
        actionLabel="Kembali ke Beranda"
      />
    </>
  );
};