import { create } from "zustand";
import type { CartItem, Product, ProductVariant } from "../types";

interface CartState {
  items: CartItem[];
  add: (product: Product, variant: ProductVariant, qty?: number) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
}

export const cartItemKey = (item: Pick<CartItem, "product" | "variant">) =>
  `${item.product.slug}:${item.variant.id}`;

const load = (): CartItem[] => {
  try {
    const raw = localStorage.getItem("carvex-cart");
    if (!raw) return [];

    const stored = JSON.parse(raw) as Array<Partial<CartItem> & { product: Product }>;
    return stored.map(({ product, variant, qty }) => {
      const variants = product.variants ?? [];
      const selectedVariant =
        variant ??
        variants[0] ?? {
          id: (product.size ?? "unico").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          size: product.size ?? "",
          price: product.price,
          originalPrice: product.originalPrice,
        };
      return {
        product: { ...product, variants: variants.length ? variants : [selectedVariant] },
        variant: selectedVariant,
        qty: qty ?? 1,
      };
    });
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
  add: (product, variant, qty = 1) => {
    const items = get().items.slice();
    const key = `${product.slug}:${variant.id}`;
    const idx = items.findIndex((item) => cartItemKey(item) === key);
    if (idx >= 0) items[idx] = { ...items[idx], qty: items[idx].qty + qty };
    else items.push({ product, variant, qty });
    save(items);
    set({ items });
  },
  remove: (key) => {
    const items = get().items.filter((item) => cartItemKey(item) !== key);
    save(items);
    set({ items });
  },
  setQty: (key, qty) => {
    if (qty <= 0) return get().remove(key);
    const items = get().items.map((item) =>
      cartItemKey(item) === key ? { ...item, qty } : item,
    );
    save(items);
    set({ items });
  },
  clear: () => {
    save([]);
    set({ items: [] });
  },
  get total() {
    return get().items.reduce((acc, item) => acc + item.variant.price * item.qty, 0);
  },
  get count() {
    return get().items.reduce((acc, i) => acc + i.qty, 0);
  },
}));
