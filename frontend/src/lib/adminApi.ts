import { useAuth } from "../store/auth";
import { fetchWithTimeout } from "./http";
import type {
  AdminStats,
  AdminUser,
  Category,
  Order,
  OrderStatus,
  Product,
  ProductVariant,
} from "../types";

// En desarrollo queda vacío y Vite usa el proxy /api → localhost:4000.
// En Vercel definir VITE_API_URL=https://tu-api.onrender.com
const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const apiUrl = (path: string) => `${API_URL}${path}`;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = useAuth.getState().token;

  const res = await fetchWithTimeout(apiUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Token vencido o inválido: cerramos la sesión local.
    if (res.status === 401 && path !== "/api/auth/login") {
      useAuth.getState().logout();
    }
    const message = (data as { error?: string }).error ?? "Error de conexión";
    throw new ApiError(message, res.status);
  }

  return data as T;
}

// ---------- Auth ----------
export const login = (email: string, password: string) =>
  request<{ token: string; user: AdminUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const fetchMe = () => request<{ user: AdminUser }>("/api/auth/me");

// ---------- Dashboard ----------
export const fetchStats = () => request<AdminStats>("/api/admin/stats");

// ---------- Pedidos ----------
export const fetchOrders = (params?: { status?: string; q?: string }) => {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.q) qs.set("q", params.q);
  return request<Order[]>(`/api/admin/orders?${qs.toString()}`);
};

export const fetchOrder = (id: number | string) => request<Order>(`/api/admin/orders/${id}`);

export const updateOrder = (
  id: number | string,
  data: {
    status?: OrderStatus;
    trackingCode?: string | null;
    carrier?: string | null;
    notes?: string | null;
  },
) => request<Order>(`/api/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify(data) });

// ---------- Productos ----------
export type ProductInput = {
  name: string;
  slug?: string;
  categoryId: number;
  description: string;
  usage: string;
  variants: ProductVariant[];
  imageUrl?: string;
  featured: boolean;
};

export const fetchAdminProducts = () => request<Product[]>("/api/admin/products");

export const createProduct = (data: ProductInput) =>
  request<Product>("/api/admin/products", { method: "POST", body: JSON.stringify(data) });

export const updateProduct = (id: number, data: ProductInput) =>
  request<Product>(`/api/admin/products/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteProduct = (id: number) =>
  request<{ ok: true }>(`/api/admin/products/${id}`, { method: "DELETE" });

// ---------- Categorías ----------
export const fetchAdminCategories = () => request<Category[]>("/api/admin/categories");

export const createCategory = (data: { name: string; slug?: string }) =>
  request<Category>("/api/admin/categories", { method: "POST", body: JSON.stringify(data) });

export const updateCategory = (id: number, data: { name: string; slug?: string }) =>
  request<Category>(`/api/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteCategory = (id: number) =>
  request<{ ok: true }>(`/api/admin/categories/${id}`, { method: "DELETE" });
