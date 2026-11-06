import { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../types";
import { formatPrice } from "../lib/format";
import { useCart } from "../store/cart";
import { flyToCart } from "../lib/flyToCart";
import { trackAddToCart } from "../lib/analytics";
import ProductImage from "./ProductImage";
import VariantModal from "./VariantModal";

export default function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  // Guard: si variants viene vacío, se usa price/size legacy como única variante.
  const variants = product.variants && product.variants.length > 0 ? product.variants : [];
  const startingVariant = variants.length > 0
    ? variants.reduce((lowest, variant) =>
        variant.price < lowest.price ? variant : lowest,
      )
    : {
        id: (product.size ?? "unico").toLowerCase().replace(/[^a-z0-9]+/g, "-") || "unico",
        size: product.size ?? "",
        price: product.price,
        originalPrice: product.originalPrice,
      };
  const variantCount = variants.length > 0 ? variants.length : 1;
  const [added, setAdded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    add(product, startingVariant);
    trackAddToCart({ productSlug: product.slug, price: startingVariant.price, quantity: 1 });
    flyToCart(e.currentTarget);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Link to={`/producto/${product.slug}`} className="relative block aspect-square overflow-hidden">
        <ProductImage product={product} className="h-full w-full transition group-hover:scale-105" />
        {product.originalPrice && (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
            OFERTA
          </span>
        )}
        <span className="absolute right-2 top-2 rounded-full bg-carvex-900/85 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur sm:right-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
          {product.category.name}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-carvex-600 sm:text-xs">
          {product.brand} · {variantCount > 1
            ? `${variantCount} tamaños`
            : startingVariant.size}
        </p>
        <Link to={`/producto/${product.slug}`}>
          <h3 className="mt-1 font-display text-sm font-semibold leading-snug hover:text-carvex-600 sm:text-base">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 hidden text-sm text-slate-600 sm:line-clamp-2">{product.description}</p>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2">
          <span className="text-base font-bold text-carvex-900 sm:text-lg">
            {variantCount > 1 ? "Desde " : ""}
            {formatPrice(startingVariant.price)}
          </span>
          {startingVariant.originalPrice && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(startingVariant.originalPrice)}
            </span>
          )}
        </div>
        <p className="mt-1 hidden text-xs text-slate-500 sm:block">Venta a pedido · 3-7 días hábiles</p>

        {variantCount > 1 ? (
          <>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-3 rounded-lg bg-carvex-900 py-2.5 text-xs font-semibold text-white transition hover:bg-carvex-800 sm:mt-4 sm:text-sm"
            >
              <span className="sm:hidden">Elegir tamaño</span>
              <span className="hidden sm:inline">Elegir tamaño</span>
            </button>
            <VariantModal
              product={product}
              open={modalOpen}
              onClose={() => setModalOpen(false)}
            />
          </>
        ) : (
          <button
            onClick={handleAdd}
            className={`mt-3 rounded-lg py-2.5 text-xs font-semibold text-white transition sm:mt-4 sm:text-sm ${added ? "bg-emerald-600" : "bg-carvex-900 hover:bg-carvex-800"}`}
          >
            <span className="sm:hidden">{added ? "✓" : "Agregar"}</span>
            <span className="hidden sm:inline">{added ? "✓ Agregado" : "Agregar al carrito"}</span>
          </button>
        )}
      </div>
    </article>
  );
}
