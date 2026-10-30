import { describe, expect, it } from 'vitest';
import { FOOD_MENUS, PROMO_BANNERS, RENT_VEHICLES } from './serviceCatalog';

const allIds = [...RENT_VEHICLES, ...FOOD_MENUS, ...PROMO_BANNERS].map((item) => item.id);

describe('katalog layanan Sango', () => {
  it('memberi id unik untuk setiap item', () => {
    expect(new Set(allIds).size).toBe(allIds.length);
  });

  it('menyediakan kendaraan dan menu dengan harga di atas nol', () => {
    expect(RENT_VEHICLES.length).toBeGreaterThanOrEqual(6);
    expect(FOOD_MENUS.length).toBeGreaterThanOrEqual(8);
    expect(RENT_VEHICLES.every((vehicle) => vehicle.pricePerDay > 0)).toBe(true);
    expect(FOOD_MENUS.every((menu) => menu.price > 0)).toBe(true);
  });

  it('mencakup ketiga kategori kendaraan', () => {
    const categories = new Set(RENT_VEHICLES.map((vehicle) => vehicle.category));
    expect(categories).toEqual(new Set(['Bike', 'Motorcycle', 'Car']));
  });

  it('mengarahkan banner ke aksi yang valid dan memakai gambar yang diizinkan', () => {
    const validActions = ['booking', 'rent', 'food'];

    expect(PROMO_BANNERS).toHaveLength(3);
    expect(PROMO_BANNERS.every((banner) => validActions.includes(banner.action))).toBe(true);
    expect(
      PROMO_BANNERS.every((banner) =>
        banner.image.startsWith('https://images.unsplash.com/')
      )
    ).toBe(true);
  });

  it('memiliki satu banner untuk masing-masing layanan', () => {
    const serviceActions = PROMO_BANNERS.filter((banner) => banner.action !== 'booking').map(
      (banner) => banner.action
    );

    expect(new Set(serviceActions)).toEqual(new Set(['food', 'rent']));
  });
});