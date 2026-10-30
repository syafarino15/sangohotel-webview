'use client';

import { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { StickyActionBar } from '@/components/ui/StickyActionBar';
import { HOTELS } from '@/data/hotels';
import { formatCurrency } from '@/lib/formatters';
import { pickStayForDelivery } from '@/lib/stay';
import { useBookingStore } from '@/stores/useBookingStore';
import { calculateTotals, useServiceStore } from '@/stores/useServiceStore';
import { useSessionStore } from '@/stores/useSessionStore';
import { DeliveryDetails } from './DeliveryDetails';
import { FulfilmentPicker } from './FulfilmentPicker';
import { StaySummary } from './StaySummary';

export const ServiceCheckout = () => {
  const draft = useServiceStore((state) => state.draft);
  const setFulfilment = useServiceStore((state) => state.setFulfilment);
  const setGuest = useServiceStore((state) => state.setGuest);
  const startPayment = useServiceStore((state) => state.startPayment);
  const showToast = useBookingStore((state) => state.showToast);

  const member = useSessionStore((state) => state.member);
  const history = useSessionStore((state) => state.history);

  const hotel = useMemo(
    () => HOTELS.find(({ hotel }) => hotel.id === draft?.hotelId)?.hotel ?? HOTELS[0].hotel,
    [draft?.hotelId]
  );
  const stay = useMemo(() => pickStayForDelivery(history), [history]);
  const totals = useMemo(() => calculateTotals(draft?.lines ?? []), [draft?.lines]);

  useEffect(() => {
    if (!draft || draft.fulfilment !== 'delivery') {
      return;
    }
    if (draft.guestName || draft.guestPhone || draft.roomNumber) {
      return;
    }
    if (member) {
      setGuest({ guestName: member.fullName, guestPhone: member.phone });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft?.fulfilment]);

  if (!draft) {
    return null;
  }

  const needsDeliveryData =
    draft.fulfilment === 'delivery' &&
    (!draft.guestName.trim() || !draft.guestPhone.trim() || !draft.roomNumber.trim());

  const handleContinue = () => {
    if (needsDeliveryData) {
      showToast('Lengkapi nama, WhatsApp, dan nomor kamar.', 'error');
      return;
    }
    startPayment();
  };

  return (
    <>
      <div className="flex-1 space-y-2.5 px-3 pb-4 pt-2.5">
        <FulfilmentPicker
          service={draft.service}
          value={draft.fulfilment}
          onChange={setFulfilment}
        />

        {draft.fulfilment === 'delivery' ? (
          <>
            {stay ? <StaySummary stay={stay} /> : null}
            <DeliveryDetails
              stay={stay}
              isMember={Boolean(member)}
              guestName={draft.guestName}
              guestPhone={draft.guestPhone}
              roomNumber={draft.roomNumber}
              onChange={(patch) => setGuest(patch)}
            />
          </>
        ) : null}

        <section className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-card">
          <h2 className="text-[14px] font-bold text-slate-900">Ringkasan Pesanan</h2>
          <ul className="mt-2 space-y-1.5">
            {draft.lines.map((line) => (
              <li key={line.id} className="flex items-start justify-between gap-3 text-[12px]">
                <span className="min-w-0 text-slate-600">
                  {line.label}
                  <span className="text-slate-400"> × {line.qty}</span>
                </span>
                <span className="shrink-0 font-semibold text-slate-900">
                  {formatCurrency(line.qty * line.unitPrice)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-slate-500">{hotel.name}</p>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-card">
          <dl className="space-y-1.5 text-[12px]">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-600">Subtotal</dt>
              <dd className="font-semibold text-slate-900">{formatCurrency(totals.subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-600">Pajak & biaya layanan (10%)</dt>
              <dd className="font-semibold text-slate-900">{formatCurrency(totals.tax)}</dd>
            </div>
          </dl>
          <div className="mt-2 flex items-center justify-between border-t border-dashed border-slate-200 pt-2">
            <span className="text-[13px] font-bold text-slate-900">Total Pembayaran</span>
            <span className="text-[17px] font-bold text-primary">
              {formatCurrency(totals.total)}
            </span>
          </div>
        </section>
      </div>

      <StickyActionBar>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-500">Total</p>
            <p className="truncate text-[17px] font-bold text-primary">
              {formatCurrency(totals.total)}
            </p>
          </div>
          <Button
            variant="action"
            size="lg"
            className="shrink-0"
            onClick={handleContinue}
            disabled={draft.lines.length === 0}
          >
            Lanjut Bayar
          </Button>
        </div>
      </StickyActionBar>
    </>
  );
};