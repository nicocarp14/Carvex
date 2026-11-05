export interface Category {
  id: number;
  name: string;
  slug: string;
  _count?: { products: number };
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  brand: string;
  price: number; // ARS
  originalPrice: number | null;
  imageUrl: string;
  description: string;
  usage: string;
  size: string | null;
  variants: ProductVariant[];
  featured: boolean;
  category: Category;
  related?: Product[];
}

export interface ProductVariant {
  id: string;
  size: string;
  price: number;
  originalPrice: number | null;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  qty: number;
}

// ---------- Panel admin ----------

export type OrderStatus =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "PREPARANDO"
  | "ENVIADO"
  | "ENTREGADO"
  | "CANCELADO";

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  variantSize: string | null;
  product: Product;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  status: OrderStatus;
  paymentId: string | null;
  trackingCode: string | null;
  carrier: string | null;
  notes: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string | null;
}

export interface AdminStats {
  pending: number;
  inProgress: number;
  shipped: number;
  cancelled: number;
  revenue: number;
  totalOrders: number;
  products: number;
}
