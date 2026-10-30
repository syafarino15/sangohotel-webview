# Sango Hotels Webview — Mobile Booking Engine

Frontend booking engine untuk **Sango Hotel Management** (direct booking, mobile webview). Next.js 15 App Router, TypeScript strict, Tailwind CSS, Zustand, Lucide. Berjalan penuh dengan mock data — tanpa backend.

Proyek ini adalah salinan dari `webview-frontend` (Stayin / Alfa Teve) yang di-rebrand dan di-retema untuk Sango Group.

## Perintah Terminal

```bash
# 1. Install dependencies
npm install

# 2. Typecheck (harus 0 error)
npx tsc --noEmit

# 3. Jalankan development server
npm run dev
# buka http://localhost:3000

# 4. Unit test (Vitest)
npm test

# 5. Build produksi
npm run build
npm start
```

## Properti

Katalog ada di `src/data/hotelCatalog.ts` (satu file, mudah diganti saat data asli tersedia):

| Hotel | Kota | Bintang |
| --- | --- | --- |
| Metro Park View Hotel Semarang | Semarang | 4 |
| Manhattan Hotel Jakarta | Jakarta | 5 |
| Merlynn Park Hotel Jakarta | Jakarta | 5 |
| Sunlake Waterfront Resort & Convention | Jakarta | 4 |

Harga, ketersediaan, dan tipe kamar adalah **data contoh** untuk demo.

## Palet Warna

Mengikuti brand Sango Hotel Management (charcoal, emas, krem):

| Warna | Hex | Token Tailwind | Pemakaian |
| --- | --- | --- | --- |
| Charcoal | `#100B07` | `sango-ink` | Header, tombol aksi utama |
| Emas | `#A67C2E` | `primary` | Tombol primary, ikon, harga, step aktif |
| Emas pekat | `#5B4318` | `primary-dark` | Teks di atas latar krem |
| Krem | `#F7F0E5` | `primary-surface` / `sango-cream` | Latar badge, panel info |
| Aksen emas terang | `#D9BD69` | `sango-gold` | Aksen dekoratif |
| Krem halaman | `#FBF8F2` | `canvas` | Latar aplikasi |

Catatan:
- Teks di atas tombol emas memakai `text-sango-ink` (bukan putih) agar kontras terbaca.
- Skala `slate` di-remap ke netral hangat (`stone`) supaya tidak ada rona biru.
- Font mengikuti website Sango: **DM Sans** lewat `next/font`.
- `themeColor` browser ada di `src/app/layout.tsx` (`#100B07`).

## Deploy (Netlify)

`netlify.toml` sudah mengatur `npm run build` + plugin Next.js. Hubungkan repo ke Netlify, lalu setiap push ke `main` akan auto-deploy.

### Badge "Powered by Netlify"

Sama seperti proyek asal: Netlify menyuntik iframe `#nl-badge-frame` (197×64, fixed kanan bawah, z-index maksimum). Di layar ponsel badge itu menutupi tombol aksi, jadi layout menyesuaikan diri:

- `src/hooks/useHostBottomOffset.ts` mengukur badge dan menghasilkan `--host-bottom-offset`.
- Variabel itu dipasang di `src/app/page.tsx` dan diwarisi ke elemen `fixed`.
- Hanya tombol **Filter** yang tetap floating; bar aksi lain mengalir normal dengan padding bawah tambahan.
- Toast tampil di atas layar (`pt-[calc(env(safe-area-inset-top,0px)+64px)]`).

Badge tidak disembunyikan karena paket gratis Netlify mewajibkan badge tampil.

## Struktur

```
src/
├── app/            layout.tsx (frame 480px, safe-area, DM Sans), page.tsx (orkestrasi step)
├── components/     Header, DateGuestPickerModal, RoomCard, RoomDetailModal,
│                   CheckoutSection, PaymentSection, VoucherSection
│   ├── ui/         Button, Badge, BottomSheet, Skeleton, ToastHost, StickyActionBar
│   ├── hotels/     HotelsScreen, HotelList, HotelCard, HotelFilterButton, CityFilterSheet
│   ├── search/     SearchSummaryBar, HotelSearchBar, CalendarGrid, GuestCounter
│   ├── room/       RoomImageCarousel, RoomPackageOption, RoomPolicies, PackageSelector
│   ├── checkout/   GuestForm, SpecialRequestChips, PriceBreakdown
│   ├── payment/    PaymentCountdownBanner, PaymentMethodList, VirtualAccountPanel, QrisPanel
│   ├── voucher/    MockQrCode, VoucherDetails, VoucherActions
│   ├── rooms/      RoomsScreen, RoomList, HotelInfoCard
│   └── common/     StepProgress
├── data/           hotelCatalog.ts (4 hotel Sango), hotels.ts, mockData.ts
├── types/          booking.ts, bridge.ts
├── lib/            formatters, date, pricing, validation, hotelFilter, utils
├── stores/         useBookingStore.ts
├── hooks/          useCountdown, useHostContext, useHostBottomOffset, useWebviewBack
└── services/       bridge.service.ts, voucher.service.ts
```

## Alur 6 Layar

1. Daftar hotel + pencarian + filter kota (Semarang / Jakarta)
2. Detail hotel & pilih tipe kamar
3. Bottom sheet detail kamar & paket (room only / sarapan)
4. Rincian pemesanan (data tamu, permintaan khusus, rincian biaya)
5. Pembayaran (VA BCA/Mandiri, QRIS, kartu) dengan hitung mundur 15 menit
6. E-voucher + kirim WhatsApp + unduh ringkasan

## Bridge Webview

`src/services/bridge.service.ts` mencoba berurutan: `AlfaTeveBridge` → `AndroidBridge` → iOS `webkit.messageHandlers.AlfaTeveBridge` → `window.parent.postMessage`. Nama handler sengaja dipertahankan agar tetap kompatibel bila nanti di-embed di aplikasi host; tombol penutup di voucher mengirim `{ action: 'close_webview' }` ke parent.