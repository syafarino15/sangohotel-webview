import type { FoodMenuItem, PromoBanner, RentVehicle } from '@/types/service';

const image = (id: string): string =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=75`;

/** Data contoh layanan tambahan Sango (harga & ketersediaan fiktif). */
export const RENT_VEHICLES: RentVehicle[] = [
  {
    id: 'RV-BIKE-01',
    name: 'Sepeda Kota',
    category: 'Bike',
    description: 'Sepeda santai untuk keliling area hotel dan kota tua.',
    pricePerDay: 35_000,
  },
  {
    id: 'RV-BIKE-02',
    name: 'Sepeda Listrik',
    category: 'Bike',
    description: 'Bantuan pedal, nyaman untuk jarak menengah.',
    pricePerDay: 75_000,
  },
  {
    id: 'RV-MTR-01',
    name: 'Motor Matic 110cc',
    category: 'Motorcycle',
    description: 'Lincah di jalan kota, sudah termasuk 2 helm.',
    pricePerDay: 90_000,
    transmission: 'Otomatis',
  },
  {
    id: 'RV-MTR-02',
    name: 'Motor Sport 150cc',
    category: 'Motorcycle',
    description: 'Tenaga lebih untuk perjalanan keluar kota.',
    pricePerDay: 140_000,
    transmission: 'Manual',
  },
  {
    id: 'RV-CAR-01',
    name: 'City Car',
    category: 'Car',
    description: 'Lepas kunci, irit, cocok untuk berdua.',
    pricePerDay: 350_000,
    seats: 5,
    transmission: 'Otomatis',
  },
  {
    id: 'RV-CAR-02',
    name: 'MPV 7 Kursi',
    category: 'Car',
    description: 'Ruang lega untuk keluarga atau rombongan kecil.',
    pricePerDay: 550_000,
    seats: 7,
    transmission: 'Otomatis',
  },
];

export const FOOD_MENUS: FoodMenuItem[] = [
  {
    id: 'FD-01',
    name: 'Nasi Goreng Sango',
    description: 'Nasi goreng kampung, telur mata sapi, dan kerupuk.',
    price: 65_000,
    category: 'Main',
  },
  {
    id: 'FD-02',
    name: 'Sate Ayam Madura',
    description: 'Sepuluh tusuk sate ayam, bumbu kacang, dan lontong.',
    price: 78_000,
    category: 'Main',
  },
  {
    id: 'FD-03',
    name: 'Soto Betawi',
    description: 'Kuah santan, daging sapi empuk, dan emping.',
    price: 72_000,
    category: 'Main',
  },
  {
    id: 'FD-04',
    name: 'Gado-Gado',
    description: 'Sayur segar dengan bumbu kacang dan lontong.',
    price: 55_000,
    category: 'Side',
  },
  {
    id: 'FD-05',
    name: 'Lumpia Semarang',
    description: 'Isi rebung dan ayam, disajikan dengan saus tauco.',
    price: 45_000,
    category: 'Side',
  },
  {
    id: 'FD-06',
    name: 'Es Pisang Ijo',
    description: 'Pisang, bubur sumsum, dan sirup merah.',
    price: 40_000,
    category: 'Dessert',
  },
  {
    id: 'FD-07',
    name: 'Pandan Cake',
    description: 'Bolu pandan lembut dengan kelapa serut.',
    price: 42_000,
    category: 'Dessert',
  },
  {
    id: 'FD-08',
    name: 'Kopi Tubruk Sango',
    description: 'Kopi robusta lokal, diseduh tradisional.',
    price: 28_000,
    category: 'Drink',
  },
];

export const PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'BN-BOOKING',
    eyebrow: 'Direct Booking',
    title: 'Harga terbaik hanya di sini',
    description: 'Pesan langsung ke Sango, tanpa biaya perantara.',
    ctaLabel: 'Cari Hotel',
    image: image('photo-1584132967334-10e028bd69f7'),
    action: 'booking',
  },
  {
    id: 'BN-FOOD',
    eyebrow: 'Sango Dining',
    title: 'Menu khas hotel, antar ke kamar',
    description: 'Pesan makanan favorit dari dapur hotel.',
    ctaLabel: 'Pesan Makanan',
    image: image('photo-1551882547-ff40c63fe5fa'),
    action: 'food',
  },
  {
    id: 'BN-RENT',
    eyebrow: 'Sango Rent',
    title: 'Sewa sepeda, motor, atau mobil',
    description: 'Jelajahi kota dengan kendaraan dari hotel.',
    ctaLabel: 'Sewa Kendaraan',
    image: image('photo-1542314831-068cd1dbfeeb'),
    action: 'rent',
  },
];