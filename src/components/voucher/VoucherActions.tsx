'use client';

import { useState } from 'react';
import { Download, Home, MessageCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { buildWhatsAppUrl } from '@/services/voucher.service';
import { buildHotelRecord } from '@/services/transaction.service';
import { downloadReceiptPdf } from '@/services/receipt.service';
import { useBookingStore } from '@/stores/useBookingStore';
import type { Booking } from '@/types/booking';

export const VoucherActions = ({ booking }: { booking: Booking }) => {
  const showToast = useBookingStore((state) => state.showToast);
  const startNewBooking = useBookingStore((state) => state.startNewBooking);
  const goToStep = useBookingStore((state) => state.goToStep);
  const payment = useBookingStore((state) => state.payment);
  const [downloading, setDownloading] = useState(false);

  const handleWhatsApp = () => {
    window.open(buildWhatsAppUrl(booking), '_blank', 'noopener,noreferrer');
    showToast('Voucher dibuka di WhatsApp.', 'success');
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadReceiptPdf(buildHotelRecord(booking, payment.paidAt));
      showToast('Bukti pembayaran diunduh sebagai PDF.', 'success');
    } catch {
      showToast('Gagal membuat PDF. Coba lagi.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleSearchAgain = () => {
    startNewBooking();
    showToast('Kembali ke daftar hotel untuk pemesanan baru.', 'info');
  };

  const handleGoHome = () => {
    goToStep(1);
    showToast('Kembali ke halaman utama.', 'info');
  };

  return (
    <div className="space-y-2">
      <Button variant="whatsapp" size="lg" fullWidth onClick={handleWhatsApp}>
        <MessageCircle size={17} /> Kirim Voucher ke WhatsApp
      </Button>
      <Button
        variant="outline"
        size="lg"
        fullWidth
        isLoading={downloading}
        onClick={handleDownload}
      >
        <Download size={17} /> Download Bukti Pembayaran (PDF)
      </Button>
      <Button variant="primary" size="lg" fullWidth onClick={handleSearchAgain}>
        <Search size={17} /> Cari Hotel Lain
      </Button>
      <Button variant="ghost" size="lg" fullWidth onClick={handleGoHome}>
        <Home size={17} /> Kembali ke Halaman Utama
      </Button>
    </div>
  );
};