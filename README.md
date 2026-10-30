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

## Landing & Sesi

Saat pertama dibuka, webview menampilkan **landing page 3 slide fullscreen** (`components/landing/LandingScreen.tsx`). Slider berbasis state (bukan scroll): bisa digeser (swipe), diketuk indikatornya, atau dipindah dengan tombol panah keyboard. Ada tombol "Lewati" di kanan atas. Di slide terakhir pengguna memilih:

- **Masuk sebagai Member** — sheet berisi nama, email, WhatsApp (`MemberLoginSheet`). Data dipakai untuk mengisi otomatis formulir pemesanan.
- **Lanjut sebagai Guest** — langsung masuk beranda; data pemesan diisi manual.

Sesi disimpan di `localStorage` dengan kunci `sango-session` (`stores/useSessionStore.ts`). Yang disimpan hanya `member` dan `history`; `entered` dan tab aktif sengaja tidak disimpan, sehingga **landing page selalu tampil setiap aplikasi dibuka**. Bila profil member sudah tersimpan, slide terakhir menampilkan nama pemilik akun dan tombolnya berubah menjadi "Lanjut sebagai Member" (tanpa mengisi form lagi).

## Navigasi Aplikasi

Header beranda menampilkan **logo Sango** (bukan tombol kembali); tombol kembali hanya muncul di halaman dalam (daftar kamar, pemesanan, pembayaran, layanan).

Bottom tab bar 4 tab (`components/nav/BottomTabBar.tsx`):

| Tab | Isi |
| --- | --- |
| Beranda | Carousel promo, layanan, daftar hotel, dan seluruh alur booking |
| Riwayat | Semua transaksi (hotel, rent, food), terbaru di atas |
| Voucher | Khusus pemesanan hotel: kode, kamar, tanggal, tamu, total |
| Akun | Profil member (atau tombol masuk), jumlah transaksi, keluar |

Tab bar disembunyikan saat berada di alur booking (checkout/pembayaran/voucher) dan saat layanan Rent/Food dibuka. Tombol Filter dinaikkan otomatis di atas tab bar.

Riwayat terisi otomatis: booking hotel dicatat saat e-voucher terbit (`status: PAID`), sedangkan sewa kendaraan dan pesanan makanan dicatat saat permintaan dikirim (`status: REQUESTED`). Pencatatan memakai kode transaksi sebagai kunci agar tidak dobel.

## Beranda

Urutan beranda (`src/components/hotels/HotelsScreen.tsx`):

1. Header + kolom pencarian + ringkasan tanggal (sticky).
2. **Hero carousel** (`home/HeroCarousel.tsx`) — 3 slide promo, auto-slide 5 detik, bisa digeser, dot bisa diketuk, dan berhenti otomatis bila pengguna menyentuh atau mengaktifkan `prefers-reduced-motion`.
3. **Menu layanan** (`home/ServiceGrid.tsx`) — grid 4 kolom: Rent & Food aktif, Spa & Transport bertanda "Segera".
4. Daftar hotel.

## Layanan Rent & Food

Data contoh ada di `src/data/serviceCatalog.ts`:

- `RENT_VEHICLES` — 6 kendaraan (2 sepeda, 2 motor, 2 mobil) dengan harga per hari.
- `FOOD_MENUS` — 8 menu khas hotel.
- `PROMO_BANNERS` — 3 banner promo.

Layar dibuka lewat state `activeService` di store (bukan step booking, agar alur kamar tidak terganggu). Setiap layanan punya pilihan hotel, perhitungan total, dan sheet konfirmasi dengan kode permintaan (`RNT-…` / `FOD-…`). Pembayaran belum disimulasikan — di luar cakupan tahap ini.

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
- Foto landing page, banner promo, dan logo diambil langsung dari aset HD `sangohotelmanagement.com`. Host itu sudah didaftarkan di `images.remotePatterns` (`next.config.mjs`) bersama `images.unsplash.com`; menambah host gambar baru wajib didaftarkan dulu atau build akan gagal.
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
│   ├── landing/    LandingScreen, MemberLoginSheet
│   ├── nav/        BottomTabBar
│   ├── account/    HistoryScreen, VoucherListScreen, AccountScreen
│   ├── home/       HeroCarousel, ServiceGrid
│   ├── service/    ServiceScreen, RentService, FoodService, QuantityStepper,
│                   ServiceHotelSelect, ServiceSuccessSheet
│   ├── ui/         Button, Badge, BottomSheet, Skeleton, ToastHost, StickyActionBar
│   ├── hotels/     HotelsScreen, HotelList, HotelCard, HotelFilterButton, CityFilterSheet
│   ├── search/     SearchSummaryBar, HotelSearchBar, CalendarGrid, GuestCounter
│   ├── room/       RoomImageCarousel, RoomPackageOption, RoomPolicies, PackageSelector
│   ├── checkout/   GuestForm, SpecialRequestChips, PriceBreakdown
│   ├── payment/    PaymentCountdownBanner, PaymentMethodList, VirtualAccountPanel, QrisPanel
│   ├── voucher/    MockQrCode, VoucherDetails, VoucherActions
│   ├── rooms/      RoomsScreen, RoomList, HotelInfoCard
│   └── common/     StepProgress
├── data/           hotelCatalog.ts (4 hotel Sango), serviceCatalog.ts, hotels.ts, mockData.ts
├── types/          booking.ts, service.ts, account.ts, bridge.ts
├── lib/            formatters, date, pricing, validation, hotelFilter, utils
├── hooks/          useCountdown, useHostContext, useHostBottomOffset, useWebviewBack
├── stores/         useBookingStore.ts, useSessionStore.ts (persist localStorage)
└── services/       bridge.service.ts, voucher.service.ts
```

## Alur 6 Layar

1. Beranda: carousel promo, layanan Rent & Food, daftar hotel + pencarian + filter kota
2. Detail hotel & pilih tipe kamar
3. Bottom sheet detail kamar & paket (room only / sarapan)
4. Rincian pemesanan (data tamu, permintaan khusus, rincian biaya)
5. Pembayaran (VA BCA/Mandiri, QRIS, kartu) dengan hitung mundur 15 menit
6. E-voucher + kirim WhatsApp + unduh ringkasan

## Bridge Webview

`src/services/bridge.service.ts` mencoba berurutan: `AlfaTeveBridge` → `AndroidBridge` → iOS `webkit.messageHandlers.AlfaTeveBridge` → `window.parent.postMessage`. Nama handler sengaja dipertahankan agar tetap kompatibel bila nanti di-embed di aplikasi host; tombol penutup di voucher mengirim `{ action: 'close_webview' }` ke parent.