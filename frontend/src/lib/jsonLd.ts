import type { Product } from "../types";

export function buildProductJsonLd(product: Product) {
  const baseUrl = "https://carvexcorrientes.vercel.app";
  const price = product.price;
  const image = product.imageUrl
    ? product.imageUrl.startsWith("http")
      ? product.imageUrl
      : `${baseUrl}${product.imageUrl.startsWith("/") ? "" : "/"}${product.imageUrl}`
    : `${baseUrl}/banner.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    category: product.category?.name,
    image,
    url: `${baseUrl}/producto/${product.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "ARS",
      price,
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/producto/${product.slug}`,
      seller: { "@type": "Organization", name: "Carvex" },
    },
  };
}
