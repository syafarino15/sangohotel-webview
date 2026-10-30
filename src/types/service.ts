export type ServiceId = 'rent' | 'food';

export type RentCategory = 'Bike' | 'Motorcycle' | 'Car';

export type FoodCategory = 'Main' | 'Side' | 'Dessert' | 'Drink';

export type PromoAction = ServiceId | 'booking';

export interface RentVehicle {
  id: string;
  name: string;
  category: RentCategory;
  description: string;
  pricePerDay: number;
  seats?: number;
  transmission?: string;
}

export interface FoodMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
}

export interface PromoBanner {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  image: string;
  action: PromoAction;
}

export interface ServiceOrder {
  code: string;
  service: ServiceId;
  hotelId: string;
  hotelName: string;
  itemLabel: string;
  quantity: number;
  unit: string;
  total: number;
}