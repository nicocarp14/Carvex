import { Link } from "react-router-dom";
import type { Product } from "../types";
import { formatPrice } from "../lib/format";
import { useCart } from "../store/cart";
import ProductImage from "./ProductImage";

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

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Link to={`/producto/${product.slug}`} className="relative block aspect-square overflow-hidden">
        <ProductImage product={product} className="h-full w-full transition group-hover:scale-105" />
        {product.originalPrice && (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
            OFERTA
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-carvex-900/85 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
          {product.category.name}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-carvex-600">
          {product.brand} · {variantCount > 1
            ? `${variantCount} tamaños`
            : startingVariant.size}
        </p>
        <Link to={`/producto/${product.slug}`}>
          <h3 className="mt-1 font-display font-semibold leading-snug hover:text-carvex-600">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{product.description}</p>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-carvex-900">
            {variantCount > 1 ? "Desde " : ""}
            {formatPrice(startingVariant.price)}
          </span>
          {startingVariant.originalPrice && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(startingVariant.originalPrice)}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500">Venta a pedido · 3-7 días hábiles</p>

        {variantCount > 1 ? (
          <Link
            to={`/producto/${product.slug}`}
            className="mt-4 rounded-lg bg-carvex-900 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-carvex-800"
          >
            Elegir tamaño
          </Link>
        ) : (
          <button
            onClick={() => add(product, startingVariant)}
            className="mt-4 rounded-lg bg-carvex-900 py-2.5 text-sm font-semibold text-white transition hover:bg-carvex-800"
          >
            Agregar al carrito
          </button>
        )}
      </div>
    </article>
  );
}
