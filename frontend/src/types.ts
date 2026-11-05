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
  featured: boolean;
  category: Category;
  related?: Product[];
}

export interface CartItem {
  product: Product;
  qty: number;
}
