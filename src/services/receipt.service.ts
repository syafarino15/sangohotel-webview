import { getPaymentMethod } from '@/data/mockData';
import { formatCurrency, formatDateShort, formatDateWithDay } from '@/lib/formatters';
import { QR_GRID, buildQrMatrix } from '@/lib/qrMatrix';
import type { HistoryRecord } from '@/types/account';

const CHARCOAL: [number, number, number] = [16, 11, 7];
const GOLD: [number, number, number] = [166, 124, 46];
const CREAM: [number, number, number] = [247, 240, 229];
const INK: [number, number, number] = [28, 24, 19];
const MUTED: [number, number, number] = [122, 113, 100];
const LINE: [number, number, number] = [231, 226, 217];

const KIND_LABEL: Record<HistoryRecord['kind'], string> = {
  hotel: 'Reservasi Kamar',
  rent: 'Sewa Kendaraan',
  food: 'Pesanan Makanan',
};

const PAGE_WIDTH = 210;
const MARGIN = 14;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

interface Row {
  label: string;
  value: string;
}

const buildInfoRows = (record: HistoryRecord): Row[] => {
  const rows: Row[] = [
    { label: 'Kode Transaksi', value: record.code },
    { label: 'Tanggal', value: formatDateShort(record.createdAt.slice(0, 10)) },
    { label: 'Hotel', value: record.hotelName },
  ];

  if (record.hotelAddress) {
    rows.push({ label: 'Alamat', value: record.hotelAddress });
  }

  if (record.kind === 'hotel') {
    if (record.checkIn) {
      rows.push({ label: 'Check-in', value: formatDateWithDay(record.checkIn) });
    }
    if (record.checkOut) {
      rows.push({ label: 'Check-out', value: formatDateWithDay(record.checkOut) });
    }
    if (record.roomName) {
      rows.push({
        label: 'Kamar',
        value: record.packageName ? `${record.roomName} - ${record.packageName}` : record.roomName,
      });
    }
    if (record.roomNumber) {
      rows.push({ label: 'Nomor Kamar', value: record.roomNumber });
    }
    if (record.guests) {
      rows.push({
        label: 'Jumlah',
        value: `${record.guests} tamu - ${record.rooms ?? 1} kamar - ${record.nights ?? 1} malam`,
      });
    }
  }

  if (record.kind === 'rent' && record.days) {
    rows.push({ label: 'Durasi Sewa', value: `${record.days} hari` });
  }

  if (record.fulfilment) {
    rows.push({
      label: 'Metode',
      value: record.fulfilment === 'delivery' ? 'Diantar ke kamar' : 'Ambil sendiri',
    });
  }

  if (record.roomNumber && record.kind !== 'hotel') {
    rows.push({ label: 'Nomor Kamar', value: record.roomNumber });
  }

  if (record.guestName) {
    rows.push({ label: 'Nama Tamu', value: record.guestName });
  }
  if (record.guestPhone) {
    rows.push({ label: 'No. WhatsApp', value: record.guestPhone });
  }

  return rows;
};

const drawHeader = (doc: import('jspdf').jsPDF, record: HistoryRecord) => {
  doc.setFillColor(...CHARCOAL);
  doc.rect(0, 0, PAGE_WIDTH, 34, 'F');

  doc.setFillColor(...GOLD);
  doc.rect(0, 34, PAGE_WIDTH, 1.6, 'F');

  doc.setTextColor(...CREAM);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text('SANGO HOTELS', MARGIN, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(217, 189, 105);
  doc.text('BUKTI PEMBAYARAN', MARGIN, 21);

  doc.setFontSize(8);
  doc.setTextColor(...CREAM);
  doc.text('Sango Hotel Management', MARGIN, 27);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(record.code, PAGE_WIDTH - MARGIN, 16, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(KIND_LABEL[record.kind], PAGE_WIDTH - MARGIN, 22, { align: 'right' });
};

const drawStatusPill = (doc: import('jspdf').jsPDF, record: HistoryRecord, y: number) => {
  const paid = record.status === 'PAID';
  const label = paid ? 'LUNAS' : 'MENUNGGU KONFIRMASI';
  const width = doc.getTextWidth(label) + 8;
  const pillFill: [number, number, number] = paid ? [225, 245, 235] : [241, 228, 196];
  const pillText: [number, number, number] = paid ? [28, 107, 79] : [91, 67, 24];

  doc.setFillColor(...pillFill);
  doc.roundedRect(MARGIN, y, width, 7, 1.6, 1.6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...pillText);
  doc.text(label, MARGIN + 4, y + 4.8);

  return y + 12;
};

const drawInfoGrid = (doc: import('jspdf').jsPDF, rows: Row[], startY: number) => {
  let y = startY;
  const columnGap = 8;
  const columnWidth = (CONTENT_WIDTH - columnGap) / 2;

  rows.forEach((row, index) => {
    const column = index % 2;
    const x = MARGIN + column * (columnWidth + columnGap);

    if (column === 0 && index > 0) {
      y += 11;
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(row.label.toUpperCase(), x, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...INK);
    const lines = doc.splitTextToSize(row.value, columnWidth);
    doc.text(lines[0], x, y + 5);
  });

  return y + 13;
};

const drawItems = (doc: import('jspdf').jsPDF, record: HistoryRecord, startY: number) => {
  let y = startY;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...INK);
  doc.text('Rincian', MARGIN, y);
  y += 5;

  doc.setFillColor(250, 249, 247);
  doc.rect(MARGIN, y, CONTENT_WIDTH, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text('ITEM', MARGIN + 3, y + 5.2);
  doc.text('QTY', MARGIN + CONTENT_WIDTH - 52, y + 5.2, { align: 'right' });
  doc.text('HARGA', MARGIN + CONTENT_WIDTH - 3, y + 5.2, { align: 'right' });
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  if (record.lines && record.lines.length > 0) {
    record.lines.forEach((line) => {
      const label = doc.splitTextToSize(line.label, CONTENT_WIDTH - 70);
      doc.setTextColor(...INK);
      doc.text(label, MARGIN + 3, y + 5.5);
      doc.text(`${line.qty}`, MARGIN + CONTENT_WIDTH - 52, y + 5.5, { align: 'right' });
      doc.text(formatCurrency(line.qty * line.unitPrice), MARGIN + CONTENT_WIDTH - 3, y + 5.5, {
        align: 'right',
      });
      y += Math.max(8, label.length * 4.6 + 3);

      doc.setDrawColor(...LINE);
      doc.setLineWidth(0.2);
      doc.line(MARGIN, y, MARGIN + CONTENT_WIDTH, y);
    });
  } else {
    const label = doc.splitTextToSize(record.title, CONTENT_WIDTH - 70);
    doc.setTextColor(...INK);
    doc.text(label, MARGIN + 3, y + 5.5);
    doc.text('1', MARGIN + CONTENT_WIDTH - 52, y + 5.5, { align: 'right' });
    doc.text(formatCurrency(record.subtotal ?? record.total), MARGIN + CONTENT_WIDTH - 3, y + 5.5, {
      align: 'right',
    });
    y += Math.max(8, label.length * 4.6 + 3);
  }

  return y + 4;
};

const drawTotals = (doc: import('jspdf').jsPDF, record: HistoryRecord, startY: number) => {
  let y = startY;
  const labelX = MARGIN + CONTENT_WIDTH - 70;
  const valueX = MARGIN + CONTENT_WIDTH - 3;

  const subtotal = record.subtotal ?? record.total;
  const tax = record.tax ?? 0;

  const line = (label: string, value: string, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(bold ? 10.5 : 8.5);
    doc.setTextColor(...(bold ? INK : MUTED));
    doc.text(label, labelX, y);
    doc.setTextColor(...(bold ? INK : INK));
    doc.text(value, valueX, y, { align: 'right' });
    y += bold ? 7 : 5.5;
  };

  line('Subtotal', formatCurrency(subtotal));
  if (tax > 0) {
    line('Pajak & biaya layanan', formatCurrency(tax));
  }
  if (record.discount) {
    line('Diskon promo', `- ${formatCurrency(record.discount)}`);
  }

  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.3);
  doc.line(labelX, y - 2, valueX, y - 2);
  y += 3;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text('TOTAL BAYAR', labelX, y);
  doc.setTextColor(...GOLD);
  doc.setFontSize(13);
  doc.text(formatCurrency(record.total), valueX, y, { align: 'right' });

  return y + 10;
};

const drawQr = (doc: import('jspdf').jsPDF, record: HistoryRecord, startY: number) => {
  if (!record.qrValue) {
    return startY;
  }

  const matrix = buildQrMatrix(record.qrValue);
  const size = 34;
  const module = size / QR_GRID;
  const x = MARGIN;
  let y = startY;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...LINE);
  doc.roundedRect(x - 2, y - 2, size + 4, size + 4, 2, 2, 'FD');

  doc.setFillColor(...INK);
  matrix.forEach((row, rowIndex) => {
    row.forEach((filled, colIndex) => {
      if (filled) {
        doc.rect(x + colIndex * module, y + rowIndex * module, module, module, 'F');
      }
    });
  });

  const textX = x + size + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...INK);
  doc.text('Tunjukkan QR ini ke petugas hotel', textX, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  const note = doc.splitTextToSize(
    record.kind === 'rent'
      ? 'Petugas memindai QR saat kendaraan diambil dan saat dikembalikan.'
      : 'Petugas memindai QR untuk memverifikasi pesanan Anda.',
    CONTENT_WIDTH - size - 12
  );
  doc.text(note, textX, y + 13);

  y += size + 8;
  return y;
};

const drawPaymentInfo = (doc: import('jspdf').jsPDF, record: HistoryRecord, startY: number) => {
  let y = startY;
  const method = record.paymentMethod ? getPaymentMethod(record.paymentMethod) : null;

  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, MARGIN + CONTENT_WIDTH, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text('METODE PEMBAYARAN', MARGIN, y);
  doc.text('STATUS', MARGIN + CONTENT_WIDTH, y, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...INK);
  doc.text(method ? method.name : 'Virtual Account', MARGIN, y + 5);
  doc.setTextColor(...GOLD);
  doc.text(record.status === 'PAID' ? 'LUNAS' : 'MENUNGGU', MARGIN + CONTENT_WIDTH, y + 5, {
    align: 'right',
  });

  if (record.paidAt) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(`Dibayar pada ${formatDateShort(record.paidAt.slice(0, 10))}`, MARGIN, y + 10);
  }

  return y + 16;
};

const drawFooter = (doc: import('jspdf').jsPDF, record: HistoryRecord) => {
  const y = 272;

  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, MARGIN + CONTENT_WIDTH, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text(
    `Dokumen ini diterbitkan otomatis oleh Sango Hotels pada ${formatDateShort(
      new Date().toISOString().slice(0, 10)
    )}.`,
    MARGIN,
    y + 5
  );
  if (record.hotelPhone) {
    doc.text(`Butuh bantuan? Hubungi ${record.hotelPhone}.`, MARGIN, y + 9);
  }
  doc.text('Terima kasih telah memesan langsung melalui Sango.', MARGIN, y + 13);
};

export const buildReceiptPdf = async (record: HistoryRecord): Promise<import('jspdf').jsPDF> => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  drawHeader(doc, record);

  let y = 46;
  y = drawStatusPill(doc, record, y);
  y = drawInfoGrid(doc, buildInfoRows(record), y);
  y = drawItems(doc, record, y);
  y = drawTotals(doc, record, y);

  if (record.qrValue) {
    y = drawQr(doc, record, y);
  }

  drawPaymentInfo(doc, record, Math.min(y, 236));
  drawFooter(doc, record);

  return doc;
};

export const downloadReceiptPdf = async (record: HistoryRecord): Promise<void> => {
  const doc = await buildReceiptPdf(record);
  doc.save(`Sango-Bukti-${record.code}.pdf`);
};
