import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../types";
import { formatPrice } from "../lib/format";
import { useCart } from "../store/cart";
import { flyToCart } from "../lib/flyToCart";
import { trackAddToCart } from "../lib/analytics";
import ProductImage from "./ProductImage";

type Props = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
};

function cheapestVariant(product: Product) {
  return product.variants.reduce((lowest, v) => (v.price < lowest.price ? v : lowest));
}

export default function VariantModal({ product, open, onClose }: Props) {
  const add = useCart((s) => s.add);
  const [selectedId, setSelectedId] = useState("");
  const [added, setAdded] = useState(false);

  // Reset al abrir: por defecto la más barata (igual que ProductCard)
  useEffect(() => {
    if (open && product) {
      setAdded(false);
      setSelectedId(cheapestVariant(product).id);
    }
  }, [open, product]);

  // ESC cierra + bloquea scroll de fondo
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open || !product) return null;

  const selected =
    product.variants.find((v) => v.id === selectedId) ?? cheapestVariant(product);

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    add(product, selected, 1);
    trackAddToCart({ productSlug: product.slug, price: selected.price, quantity: 1 });
    flyToCart(e.currentTarget);
    setAdded(true);
    window.setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Elegí tamaño — ${product.name}`}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg animate-fade-up rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
              <ProductImage product={product} className="h-full w-full" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-carvex-600">
                {product.brand}
              </p>
              <h3 className="font-display text-lg font-bold leading-tight">
                {product.name}
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                {product.variants.length} tamaños · Venta a pedido
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            autoFocus
            aria-label="Cerrar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
          >
            ✕
          </button>
        </div>

        {/* Variantes */}
        <fieldset className="mt-5">
          <legend className="text-sm text-slate-600">
            Volumen:{" "}
            <span className="font-semibold text-slate-900">{selected.size}</span>
          </legend>
          <div className="mt-3 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Tamaños disponibles">
            {product.variants.map((v) => {
              const active = v.id === selected.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSelectedId(v.id)}
                  className={`rounded-xl border-2 px-3 py-3 text-center transition ${
                    active
                      ? "border-carvex-900 bg-carvex-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-400"
                  }`}
                >
                  <span className={`block text-sm font-bold ${active ? "text-carvex-900" : "text-slate-800"}`}>
                    {v.size}
                  </span>
                  <span className="mt-0.5 block text-xs font-medium text-slate-500">
                    {formatPrice(v.price)}
                    {v.originalPrice ? (
                      <span className="line-through text-slate-400"> · {formatPrice(v.originalPrice)}</span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Precio + CTA */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-2xl font-bold text-carvex-900">
            {formatPrice(selected.price)}
          </div>
          <p className="text-xs text-slate-500">ARS con IVA incluido</p>
        </div>

        <button
          onClick={handleAdd}
          className={`mt-4 w-full rounded-lg py-3 font-semibold text-white transition ${
            added ? "bg-emerald-600" : "bg-carvex-900 hover:bg-carvex-800"
          }`}
        >
          {added ? "✓ Agregado" : "Agregar al carrito"}
        </button>
        <Link
          to={`/producto/${product.slug}`}
          onClick={onClose}
          className="mt-3 block text-center text-sm font-semibold text-carvex-600 hover:underline"
        >
          Ver detalle completo →
        </Link>
      </div>
    </div>
  );
}
