import type { Product, Category } from "../types";
import { fetchWithTimeout } from "./http";

// En desarrollo queda vacío y Vite usa el proxy /api → localhost:4000.
// En Vercel definir VITE_API_URL=https://tu-api.onrender.com
const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const apiUrl = (path: string) => `${API_URL}${path}`;

export type CreateOrderPayload = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{ slug: string; qty: number }>;
};

export const fetchProducts = async (params?: {
  category?: string;
  featured?: boolean;
  q?: string;
}): Promise<Product[]> => {
  const qs = new URLSearchParams();
  if (params?.category) qs.set("category", params.category);
  if (params?.featured) qs.set("featured", "true");
  if (params?.q) qs.set("q", params.q);
  const res = await fetchWithTimeout(apiUrl(`/api/products?${qs.toString()}`));
  if (!res.ok) throw new Error("No se pudieron cargar los productos");
  return (await res.json()) as Product[];
};

export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  const res = await fetchWithTimeout(apiUrl(`/api/products/${slug}`));
  if (!res.ok) return null;
  return (await res.json()) as Product;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetchWithTimeout(apiUrl("/api/categories"));
  if (!res.ok) throw new Error("No se pudieron cargar las categorías");
  return (await res.json()) as Category[];
};

export const createOrder = async (payload: CreateOrderPayload) => {
  const res = await fetchWithTimeout(apiUrl("/api/orders"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "No se pudo crear el pedido");
  return data as {
    order: {
      id: number;
      status: string;
      total: number;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      createdAt: string;
    };
    subtotal: number;
    message?: string;
  };
};
