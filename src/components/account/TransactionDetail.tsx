'use client';

import { useState } from 'react';
import {
  BedDouble,
  Car,
  CheckCircle2,
  Download,
  MapPin,
  Navigation,
  ReceiptText,
  ShieldCheck,
  UtensilsCrossed,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { MockQrCode } from '@/components/voucher/MockQrCode';
import { getPaymentMethod } from '@/data/mockData';
import { formatCurrency, formatDateShort, formatDateWithDay } from '@/lib/formatters';
import { useBookingStore } from '@/stores/useBookingStore';
import { downloadReceiptPdf } from '@/services/receipt.service';
import type { HistoryKind, HistoryRecord } from '@/types/account';
import { cn } from '@/lib/utils';

const KIND_META: Record<HistoryKind, { label: string; icon: LucideIcon }> = {
  hotel: { label: 'Reservasi Kamar', icon: BedDouble },
  rent: { label: 'Sewa Kendaraan', icon: Car },
  food: { label: 'Pesanan Makanan', icon: UtensilsCrossed },
};

interface TransactionDetailProps {
  record: HistoryRecord;
  onBack: () => void;
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-3">
    <dt className="text-slate-500">{label}</dt>
    <dd className="text-right font-semibold text-slate-800">{value}</dd>
  </div>
);

export const TransactionDetail = ({ record, onBack }: TransactionDetailProps) => {
  const showToast = useBookingStore((state) => state.showToast);
  const [downloading, setDownloading] = useState(false);

  const meta = KIND_META[record.kind];
  const Icon = meta.icon;
  const paid = record.status === 'PAID';
  const method = record.paymentMethod ? getPaymentMethod(record.paymentMethod) : null;
  const isDelivery = record.fulfilment === 'delivery';

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadReceiptPdf(record);
      showToast('Bukti pembayaran diunduh sebagai PDF.', 'success');
    } catch {
      showToast('Gagal membuat PDF. Coba lagi.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-canvas">
      <div className="sticky top-0 z-30">
        <Header title="Detail Transaksi" subtitle={record.code} onBack={onBack} />
      </div>

      <div className="flex-1 space-y-2.5 px-3 pb-[calc(2rem+var(--host-bottom-offset,0px))] pt-2.5">
        <section
          className={cn(
            'rounded-2xl border p-3.5',
            paid ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-action-soft'
          )}
        >
          <div className="flex items-start gap-2.5">
            <span
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white',
                paid ? 'bg-emerald-500' : 'bg-primary'
              )}
            >
              {paid ? <CheckCircle2 size={20} /> : <ReceiptText size={20} />}
            </span>
            <div className="min-w-0">
              <p
                className={cn(
                  'text-[14px] font-bold',
                  paid ? 'text-emerald-800' : 'text-primary-dark'
                )}
              >
                {paid ? 'Pembayaran Lunas' : 'Menunggu Konfirmasi'}
              </p>
              <p
                className={cn(
                  'flex items-center gap-1 text-[11px] font-semibold',
                  paid ? 'text-emerald-700' : 'text-primary-dark/80'
                )}
              >
                <Icon size={11} /> {meta.label}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-card">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Kode Transaksi
              </p>
              <p className="truncate font-mono text-[16px] font-bold tracking-wide text-slate-900">
                {record.code}
              </p>
            </div>
            <span className="shrink-0 text-[10px] font-semibold text-slate-400">
              {formatDateShort(record.createdAt.slice(0, 10))}
            </span>
          </div>

          {record.qrValue ? (
            <div className="mt-3 flex flex-col items-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-3">
              <MockQrCode value={record.qrValue} size={176} label="QR klaim kendaraan" />
              <p className="mt-2 flex items-center gap-1 text-center text-[10px] font-semibold text-slate-500">
                <ShieldCheck size={11} className="text-emerald-600" />
                {record.kind === 'rent'
                  ? 'Pindai QR saat kendaraan diambil dan dikembalikan'
                  : 'Pindai QR untuk verifikasi pesanan'}
              </p>
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-card">
          <h2 className="text-[13px] font-bold text-slate-900">{record.title}</h2>
          <p className="text-[11px] text-slate-500">{record.subtitle}</p>

          <dl className="mt-2.5 space-y-1.5 text-[11px]">
            <Row label="Hotel" value={record.hotelName} />
            {record.hotelAddress ? <Row label="Alamat" value={record.hotelAddress} /> : null}
            {record.checkIn ? (
              <Row label="Check-in" value={formatDateWithDay(record.checkIn)} />
            ) : null}
            {record.checkOut ? (
              <Row label="Check-out" value={formatDateWithDay(record.checkOut)} />
            ) : null}
            {record.roomName ? <Row label="Kamar" value={record.roomName} /> : null}
            {record.roomNumber ? <Row label="Nomor Kamar" value={record.roomNumber} /> : null}
            {record.days ? <Row label="Durasi" value={`${record.days} hari`} /> : null}
            {record.fulfilment ? (
              <Row label="Metode" value={isDelivery ? 'Diantar ke kamar' : 'Ambil sendiri'} />
            ) : null}
            {record.guestName ? <Row label="Nama Tamu" value={record.guestName} /> : null}
            {record.guestPhone ? <Row label="No. WhatsApp" value={record.guestPhone} /> : null}
          </dl>
        </section>

        {record.lines && record.lines.length > 0 ? (
          <section className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-card">
            <h2 className="text-[13px] font-bold text-slate-900">Rincian</h2>
            <ul className="mt-2 space-y-1.5 text-[12px]">
              {record.lines.map((line) => (
                <li key={line.id} className="flex items-start justify-between gap-3">
                  <span className="min-w-0 text-slate-600">
                    {line.label} <span className="text-slate-400">× {line.qty}</span>
                  </span>
                  <span className="shrink-0 font-semibold text-slate-900">
                    {formatCurrency(line.qty * line.unitPrice)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {record.fulfilment === 'pickup' && record.mapsUrl ? (
          <section className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-card">
            <h2 className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
              <MapPin size={14} className="text-primary" /> Lokasi Pengambilan
            </h2>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
              {record.pickupNote ?? 'Ambil pesanan di hotel, tunjukkan QR pemesanan.'}
            </p>
            <a
              href={record.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2.5 flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary-surface text-[12px] font-bold text-primary active:bg-primary/10"
            >
              <Navigation size={13} /> Buka Petunjuk Arah
            </a>
          </section>
        ) : null}

        <section className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-card">
          <h2 className="text-[13px] font-bold text-slate-900">Pembayaran</h2>
          <dl className="mt-2 space-y-1.5 text-[12px]">
            <Row label="Metode" value={method ? method.name : 'Virtual Account'} />
            <Row label="Status" value={paid ? 'Lunas' : 'Menunggu konfirmasi'} />
            {record.subtotal !== undefined ? (
              <Row label="Subtotal" value={formatCurrency(record.subtotal)} />
            ) : null}
            {record.tax ? <Row label="Pajak & layanan" value={formatCurrency(record.tax)} /> : null}
            {record.discount ? (
              <Row label="Diskon promo" value={`- ${formatCurrency(record.discount)}`} />
            ) : null}
          </dl>
          <div className="mt-2 flex items-center justify-between border-t border-dashed border-slate-200 pt-2">
            <span className="text-[12px] font-bold text-slate-900">Total</span>
            <span className="text-[16px] font-bold text-primary">
              {formatCurrency(record.total)}
            </span>
          </div>
        </section>

        <Button
          variant="outline"
          size="lg"
          fullWidth
          isLoading={downloading}
          onClick={handleDownload}
        >
          <Download size={16} /> Download Bukti (PDF)
        </Button>
      </div>
    </div>
  );
};