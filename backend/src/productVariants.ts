import type { Prisma } from "@prisma/client";

export type ProductVariant = {
  id: string;
  size: string;
  price: number;
  originalPrice: number | null;
};

type ProductWithVariants = {
  slug: string;
  price: number;
  originalPrice: number | null;
  size: string | null;
  variants: Prisma.JsonValue;
};

const isJsonObject = (value: Prisma.JsonValue): value is Prisma.JsonObject =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const variantIdForSize = (size: string) =>
  size
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "unico";

export function getProductVariants(product: ProductWithVariants): ProductVariant[] {
  if (Array.isArray(product.variants)) {
    const variants = product.variants.flatMap((value): ProductVariant[] => {
      if (!isJsonObject(value)) return [];
      const { id, size, price, originalPrice } = value;
      if (
        typeof id !== "string" ||
        typeof size !== "string" ||
        typeof price !== "number" ||
        !Number.isInteger(price) ||
        price <= 0 ||
        (originalPrice !== null &&
          originalPrice !== undefined &&
          (typeof originalPrice !== "number" ||
            !Number.isInteger(originalPrice) ||
            originalPrice <= 0))
      ) {
        return [];
      }

      return [{ id, size, price, originalPrice: typeof originalPrice === "number" ? originalPrice : null }];
    });

    if (variants.length > 0) return variants;
  }

  return [
    {
      id: variantIdForSize(product.size ?? "Único"),
      size: product.size ?? "",
      price: product.price,
      originalPrice: product.originalPrice,
    },
  ];
}

export function withProductVariants<T extends ProductWithVariants>(product: T) {
  const variants = getProductVariants(product);
  const cheapest = variants.reduce((lowest, variant) =>
    variant.price < lowest.price ? variant : lowest,
  );

  return {
    ...product,
    variants,
    price: cheapest.price,
    originalPrice: cheapest.originalPrice,
    size: variants.length === 1 ? variants[0].size || null : null,
  };
}
