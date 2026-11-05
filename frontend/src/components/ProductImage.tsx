import { useState } from "react";
import type { Product } from "../types";

// Placeholder premium: gradiente azul oscurito + iniciales del producto + brand.
// Cuando haya fotos reales, se usa p.imageUrl si viene de la API.
export default function ProductImage({ product, className = "" }: { product: Product; className?: string }) {
  const [imgError, setImgError] = useState(false);
  const initials = product.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (product.imageUrl && !imgError) {
    return (
      <img
        src={product.imageUrl}
        alt={product.name}
        className={`object-cover ${className}`}
        loading="lazy"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center bg-gradient-to-br from-carvex-900 via-carvex-800 to-carvex-600 text-white ${className}`}
      aria-label={product.name}
    >
      <span className="font-display text-4xl font-bold tracking-tight">{initials}</span>
      <span className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-carvex-200">
        {product.brand}
      </span>
      <span className="mt-2 rounded-full bg-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wider">
        Venta a pedido
      </span>
    </div>
  );
}
