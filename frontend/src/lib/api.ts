import type { Product, Category } from "../types";
import { productsFallback, categoriesFallback } from "../data/fallback";
import * as real from "./api.real";

export const fetchProducts = async (params?: {
  category?: string;
  featured?: boolean;
  q?: string;
}): Promise<Product[]> => {
  try {
    const data = await real.fetchProducts(params);
    return data.length ? data : filterFallback(params);
  } catch {
    return filterFallback(params);
  }
};

const filterFallback = (params?: {
  category?: string;
  featured?: boolean;
  q?: string;
}): Product[] => {
  return productsFallback.filter((p) => {
    if (params?.category && p.category.slug !== params.category) return false;
    if (params?.featured && !p.featured) return false;
    if (params?.q) {
      const q = params.q.toLowerCase();
      const hay = `${p.name} ${p.description}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
};

export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    return await real.fetchProductBySlug(slug);
  } catch {
    const found = productsFallback.find((p) => p.slug === slug) ?? null;
    if (found) return { ...found, related: productsFallback.filter((p) => p.category.slug === found.category.slug && p.slug !== slug).slice(0, 4) };
    return null;
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const data = await real.fetchCategories();
    return data.length ? data : categoriesFallback;
  } catch {
    return categoriesFallback;
  }
};

export { createOrder } from "./api.real";
export type { CreateOrderPayload } from "./api.real";
