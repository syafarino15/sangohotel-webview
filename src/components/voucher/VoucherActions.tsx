'use client';

import { useState } from 'react';
import { Download, MessageCircle, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { closeWebview } from '@/services/bridge.service';
import { buildWhatsAppUrl } from '@/services/voucher.service';
import { buildHotelRecord } from '@/services/transaction.service';
import { downloadReceiptPdf } from '@/services/receipt.service';
import { useBookingStore } from '@/stores/useBookingStore';
import type { Booking } from '@/types/booking';

export const VoucherActions = ({ booking }: { booking: Booking }) => {
  const showToast = useBookingStore((state) => state.showToast);
  const startNewBooking = useBookingStore((state) => state.startNewBooking);
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

  const handleClose = () => {
    const target = closeWebview();
    if (target === 'browser') {
      showToast('Pratinjau browser: event close_webview dikirim ke parent.', 'info');
    }
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
      <Button variant="ghost" size="lg" fullWidth onClick={handleClose}>
        <X size={17} /> Tutup Halaman
      </Button>
    </div>
  );
};