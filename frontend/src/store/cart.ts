import { create } from "zustand";
import type { CartItem, Product } from "../types";

interface CartState {
  items: CartItem[];
  add: (product: Product, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
}

const load = (): CartItem[] => {
  try {
    const raw = localStorage.getItem("carvex-cart");
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

const save = (items: CartItem[]) => {
  try {
    localStorage.setItem("carvex-cart", JSON.stringify(items));
  } catch {
    /* noop */
  }
};

export const useCart = create<CartState>((set, get) => ({
  items: load(),
  add: (product, qty = 1) => {
    const items = get().items.slice();
    const idx = items.findIndex((i) => i.product.slug === product.slug);
    if (idx >= 0) items[idx] = { ...items[idx], qty: items[idx].qty + qty };
    else items.push({ product, qty });
    save(items);
    set({ items });
  },
  remove: (slug) => {
    const items = get().items.filter((i) => i.product.slug !== slug);
    save(items);
    set({ items });
  },
  setQty: (slug, qty) => {
    if (qty <= 0) return get().remove(slug);
    const items = get().items.map((i) => (i.product.slug === slug ? { ...i, qty } : i));
    save(items);
    set({ items });
  },
  clear: () => {
    save([]);
    set({ items: [] });
  },
  get total() {
    return get().items.reduce((acc, i) => acc + i.product.price * i.qty, 0);
  },
  get count() {
    return get().items.reduce((acc, i) => acc + i.qty, 0);
  },
}));
