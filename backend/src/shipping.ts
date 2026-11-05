export type ShippingRule = { province: string; price: number; days: string };
export const SHIPPING: ShippingRule[] = [
  { province: "CABA", price: 3500, days: "1-2 días" },
  { province: "Buenos Aires", price: 4500, days: "2-4 días" },
  { province: "Córdoba", price: 5500, days: "3-5 días" },
  { province: "Santa Fe", price: 5500, days: "3-5 días" },
  { province: "Mendoza", price: 6500, days: "4-6 días" },
  { province: "Entré Ríos", price: 5500, days: "3-5 días" },
  { province: "Tucumán", price: 6500, days: "4-6 días" },
  { province: "Salta", price: 7500, days: "5-7 días" },
  { province: "Neuquén", price: 7500, days: "5-7 días" },
  { province: "Rio Negro", price: 7000, days: "5-7 días" },
  { province: "Chubut", price: 8000, days: "5-7 días" },
  { province: "Santa Cruz", price: 9000, days: "6-8 días" },
  { province: "Tierra del Fuego", price: 11000, days: "7-10 días" },
  { province: "Otra provincia", price: 6500, days: "3-7 días" },
];

export const shippingFor = (province: string) =>
  SHIPPING.find((s) => s.province === province) ?? SHIPPING[SHIPPING.length - 1];
