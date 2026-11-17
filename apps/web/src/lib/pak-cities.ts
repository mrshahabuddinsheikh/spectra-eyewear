export interface PakCity {
  name: string;
  province: string;
  deliveryDays: string;
}

export const PAK_CITIES: PakCity[] = [
  // Federal
  { name: 'Islamabad', province: 'ICT', deliveryDays: '24-48 Hours' },
  // Punjab Major
  { name: 'Lahore', province: 'Punjab', deliveryDays: '24-48 Hours' },
  { name: 'Rawalpindi', province: 'Punjab', deliveryDays: '24-48 Hours' },
  { name: 'Faisalabad', province: 'Punjab', deliveryDays: '2-3 Days' },
  { name: 'Multan', province: 'Punjab', deliveryDays: '2-3 Days' },
  { name: 'Gujranwala', province: 'Punjab', deliveryDays: '2-3 Days' },
  { name: 'Sialkot', province: 'Punjab', deliveryDays: '2-3 Days' },
  { name: 'Bahawalpur', province: 'Punjab', deliveryDays: '2-3 Days' },
  { name: 'Sargodha', province: 'Punjab', deliveryDays: '2-3 Days' },
  { name: 'Sheikhupura', province: 'Punjab', deliveryDays: '2-3 Days' },
  { name: 'Jhelum', province: 'Punjab', deliveryDays: '2-3 Days' },
  { name: 'Gujrat', province: 'Punjab', deliveryDays: '2-3 Days' },
  { name: 'Sahiwal', province: 'Punjab', deliveryDays: '2-3 Days' },
  { name: 'Kasur', province: 'Punjab', deliveryDays: '2-3 Days' },
  { name: 'Rahim Yar Khan', province: 'Punjab', deliveryDays: '3-4 Days' },
  { name: 'Okara', province: 'Punjab', deliveryDays: '2-3 Days' },
  // Sindh Major
  { name: 'Karachi', province: 'Sindh', deliveryDays: '24-48 Hours' },
  { name: 'Hyderabad', province: 'Sindh', deliveryDays: '2-3 Days' },
  { name: 'Sukkur', province: 'Sindh', deliveryDays: '2-3 Days' },
  { name: 'Larkana', province: 'Sindh', deliveryDays: '3-4 Days' },
  { name: 'Nawabshah', province: 'Sindh', deliveryDays: '3-4 Days' },
  { name: 'Mirpur Khas', province: 'Sindh', deliveryDays: '3-4 Days' },
  // KPK Major
  { name: 'Peshawar', province: 'KPK', deliveryDays: '2-3 Days' },
  { name: 'Abbottabad', province: 'KPK', deliveryDays: '2-3 Days' },
  { name: 'Mardan', province: 'KPK', deliveryDays: '2-3 Days' },
  { name: 'Swat', province: 'KPK', deliveryDays: '3-4 Days' },
  { name: 'Kohat', province: 'KPK', deliveryDays: '3-4 Days' },
  { name: 'Dera Ismail Khan', province: 'KPK', deliveryDays: '3-4 Days' },
  // Balochistan
  { name: 'Quetta', province: 'Balochistan', deliveryDays: '3-4 Days' },
  { name: 'Gwadar', province: 'Balochistan', deliveryDays: '4-5 Days' },
  { name: 'Turbat', province: 'Balochistan', deliveryDays: '4-5 Days' },
  { name: 'Hub', province: 'Balochistan', deliveryDays: '2-3 Days' },
  // AJK & Gilgit
  { name: 'Mirpur (AJK)', province: 'AJK', deliveryDays: '2-3 Days' },
  { name: 'Muzaffarabad', province: 'AJK', deliveryDays: '3-4 Days' },
  { name: 'Gilgit', province: 'GB', deliveryDays: '4-5 Days' },
  { name: 'Skardu', province: 'GB', deliveryDays: '4-5 Days' },
];

export const FREE_SHIPPING_THRESHOLD = 3000;
export const STANDARD_SHIPPING_FEE = 200;

export function calculateShippingFee(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}
