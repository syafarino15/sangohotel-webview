'use client';

import { useEffect } from 'react';
import { CheckCircle2, ClipboardCopy, MapPin, Navigation, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MockQrCode } from '@/components/voucher/MockQrCode';
import { HOTELS } from '@/data/hotels';
import { formatCurrency, formatDateShort } from '@/lib/formatters';
import { useBookingStore } from '@/stores/useBookingStore';
import { calculateTotals, useServiceStore } from '@/stores/useServiceStore';
import { useSessionStore } from '@/stores/useSessionStore';
import { buildServiceRecord } from '@/services/transaction.service';
import { downloadReceiptPdf } from '@/services/receipt.service';

export const ServiceReceipt = () => {
  const draft = useServiceStore((state) => state.draft);
  const payment = useServiceStore((state) => state.payment);
  const reference = useServiceStore((state) => state.reference);
  const reset = useServiceStore((state) => state.reset);
  const showToast = useBookingStore((state) => state.showToast);
  const addHistory = useSessionStore((state) => state.addHistory);

  const hotel = draft
    ? HOTELS.find(({ hotel }) => hotel.id === draft.hotelId)?.hotel ?? HOTELS[0].hotel
    : null;

  useEffect(() => {
    if (!draft || !reference || !hotel) {
      return;
    }
    addHistory(
      buildServiceRecord({
        draft,
        hotel,
        reference,
        payment,
        totals: calculateTotals(draft.lines),
      })
    );
  }, [addHistory, draft, hotel, payment, reference]);

  if (!draft || !reference || !hotel) {
    return null;
  }

  const totals = calculateTotals(draft.lines);
  const record = buildServiceRecord({ draft, hotel, reference, payment, totals });
  const isRent = draft.service === 'rent';
  const isDelivery = draft.fulfilment === 'delivery';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      showToast('Kode booking disalin.', 'success');
    } catch {
      showToast(`Kode booking: ${reference}`, 'info');
    }
  };

  const handleDownload = async () => {
    try {
      await downloadReceiptPdf(record);
      showToast('Bukti pembayaran diunduh sebagai PDF.', 'success');
    } catch {
      showToast('Gagal membuat PDF. Coba lagi.', 'error');
    }
  };

  return (
    <div className="flex-1 space-y-2.5 px-3 pb-[calc(2rem+var(--host-bottom-offset,0px))] pt-2.5">
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5">
        <div className="flex items-start gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
            <CheckCircle2 size={22} />
          </span>
          <div>
            <p className="text-[15px] font-bold text-emerald-800">
              Pembayaran Berhasil
            </p>
            <p className="text-[11px] font-semibold text-emerald-700">
              {isRent ? 'Sewa kendaraan' : 'Pesanan makanan'} · Lunas
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-emerald-700">
              {isDelivery
                ? 'Pesanan diantar ke kamar Anda oleh tim hotel.'
                : isRent
                  ? 'Tunjukkan QR di bawah ke petugas saat mengambil kendaraan.'
                  : 'Tunjukkan QR di bawah saat mengambil pesanan di restoran.'}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-card">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Kode Booking
            </p>
            <p className="truncate font-mono text-[17px] font-bold tracking-wide text-slate-900">
              {reference}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-1 rounded-lg bg-primary-surface px-2.5 text-[11px] font-bold text-primary active:bg-primary/15"
          >
            <ClipboardCopy size={14} /> Salin
          </button>
        </div>

        {isRent ? (
          <div className="mt-3 flex flex-col items-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-3">
            <MockQrCode value={record.qrValue ?? reference} size={188} label="QR klaim kendaraan" />
            <p className="mt-2 flex items-center gap-1 text-center text-[10px] font-semibold text-slate-500">
              <ShieldCheck size={11} className="text-emerald-600" />
              Petugas memindai QR saat kendaraan diambil dan dikembalikan
            </p>
          </div>
        ) : null}
      </section>

      {!isDelivery ? (
        <section className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-card">
          <h2 className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
            <MapPin size={14} className="text-primary" />
            {isRent ? 'Lokasi Ambil Kendaraan' : 'Lokasi Ambil Pesanan'}
          </h2>
          <p className="mt-1 text-[12px] font-semibold text-slate-800">{hotel.name}</p>
          <p className="text-[11px] leading-relaxed text-slate-500">
            {hotel.address}, {hotel.city}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
            {isRent
              ? 'Menuju meja concierge di lobby hotel. Tunjukkan QR dan identitas Anda.'
              : 'Menuju restoran hotel. Tunjukkan QR pesanan Anda ke pramusaji.'}
          </p>
          <a
            href={hotel.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2.5 flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary-surface text-[12px] font-bold text-primary active:bg-primary/10"
          >
            <Navigation size={13} /> Buka Petunjuk Arah
          </a>
        </section>
      ) : (
        <section className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-card">
          <h2 className="text-[13px] font-bold text-slate-900">Diantar ke Kamar</h2>
          <dl className="mt-2 space-y-1.5 text-[11px]">
            <div className="flex items-start justify-between gap-3">
              <dt className="text-slate-500">Hotel</dt>
              <dd className="text-right font-semibold text-slate-800">{hotel.name}</dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-slate-500">Nomor Kamar</dt>
              <dd className="text-right font-semibold text-slate-800">{draft.roomNumber}</dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-slate-500">Nama Tamu</dt>
              <dd className="text-right font-semibold text-slate-800">{draft.guestName}</dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-slate-500">No. WhatsApp</dt>
              <dd className="text-right font-semibold text-slate-800">{draft.guestPhone}</dd>
            </div>
          </dl>
        </section>
      )}

      <section className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-card">
        <h2 className="text-[13px] font-bold text-slate-900">Rincian Pembayaran</h2>
        <dl className="mt-2 space-y-1.5 text-[12px]">
          {draft.lines.map((line) => (
            <div key={line.id} className="flex items-start justify-between gap-3">
              <dt className="min-w-0 text-slate-600">
                {line.label} <span className="text-slate-400">× {line.qty}</span>
              </dt>
              <dd className="shrink-0 font-semibold text-slate-900">
                {formatCurrency(line.qty * line.unitPrice)}
              </dd>
            </div>
          ))}
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-600">Pajak & biaya layanan (10%)</dt>
            <dd className="font-semibold text-slate-900">{formatCurrency(totals.tax)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-2">
            <dt className="font-bold text-slate-900">Total</dt>
            <dd className="text-[15px] font-bold text-primary">{formatCurrency(totals.total)}</dd>
          </div>
        </dl>
        <p className="mt-1.5 text-[10px] text-slate-400">
          Dibayar {formatDateShort((payment.paidAt ?? record.createdAt).slice(0, 10))} · LUNAS
        </p>
      </section>

      <div className="space-y-2 pt-1">
        <Button variant="outline" size="lg" fullWidth onClick={handleDownload}>
          Download Bukti Pembayaran (PDF)
        </Button>
        <Button size="lg" fullWidth onClick={reset}>
          Kembali ke Beranda
        </Button>
      </div>

      <p className="pb-2 text-center text-[10px] leading-relaxed text-slate-400">
        Bukti ini diterbitkan oleh Sango Hotels untuk {hotel.name}.
        <br />
        Butuh bantuan? Hubungi {hotel.phone}
      </p>
    </div>
  );
};