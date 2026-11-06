import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductBySlug } from "../lib/api";
import type { Product } from "../types";
import { formatPrice } from "../lib/format";
import { useCart } from "../store/cart";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";

export default function ProductDetail() {
  const { slug = "" } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const add = useCart((s) => s.add);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchProductBySlug(slug)
      .then((p) => {
        if (active) {
          setProduct(p);
          setSelectedVariantId(p?.variants[0]?.id ?? "");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    window.scrollTo(0, 0);
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    document.title = product
      ? `${product.name} (${product.brand}) | Carvex`
      : "Carvex | Detailing Vonixx Argentina";
  }, [product]);

  if (loading)
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-500">
        Cargando producto... si es la primera visita del día, el servidor puede tardar hasta 40
        segundos en despertar.
      </div>
    );

  if (!product)
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-500">
        <p>No encontramos ese producto.</p>
        <Link to="/catalogo" className="mt-3 inline-block font-semibold text-carvex-600 hover:underline">
          Ver catálogo →
        </Link>
      </div>
    );

  const related = product.related ?? [];
  // Guard: productos legacy sin variants usan price/size como único tamaño.
  const variants =
    product.variants && product.variants.length > 0 ? product.variants : [];
  const legacyVariant = {
    id: (product.size ?? "unico").toLowerCase().replace(/[^a-z0-9]+/g, "-") || "unico",
    size: product.size ?? "",
    price: product.price,
    originalPrice: product.originalPrice,
  };
  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ??
    variants[0] ??
    legacyVariant;

  if (!product || (!variants.length && !legacyVariant.price)) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-500">
        <p>No encontramos ese producto.</p>
        <Link to="/catalogo" className="mt-3 inline-block font-semibold text-carvex-600 hover:underline">
          Ver catálogo →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="text-sm text-slate-500">
        <Link to="/" className="hover:text-carvex-900">Inicio</Link> /{" "}
        <Link to="/catalogo" className="hover:text-carvex-900">Catálogo</Link> /{" "}
        <span className="text-carvex-900">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <ProductImage product={product} className="aspect-square w-full" />
        </div>

        <div>
          <span className="rounded-full bg-carvex-900 px-3 py-1 text-xs font-semibold text-white">
            {product.category.name}
          </span>
          <span className="ml-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            Venta a pedido · 3-7 días hábiles
          </span>

          <h1 className="mt-4 font-display text-3xl font-bold">{product.name}</h1>
          <p className="text-sm text-slate-500">{product.brand}</p>

          {/* Tamaño: botones (una sola card por producto, varios tamaños) */}
          {variants.length > 1 && (
            <fieldset className="mt-5">
              <legend className="text-sm text-slate-600">
                Volumen:{" "}
                <span className="font-semibold text-slate-900">{selectedVariant.size}</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-3" role="radiogroup" aria-label="Tamaños disponibles">
                {variants.map((variant) => {
                  const isActive = variant.id === selectedVariant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`min-w-[120px] rounded-xl border-2 px-4 py-3 text-center transition sm:min-w-[140px] ${
                        isActive
                          ? "border-carvex-900 bg-carvex-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-400"
                      }`}
                    >
                      <span className={`block text-sm font-bold ${isActive ? "text-carvex-900" : "text-slate-800"}`}>
                        {variant.size}
                      </span>
                      <span className="mt-0.5 block text-xs font-medium text-slate-500">
                        {formatPrice(variant.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-carvex-900">
              {formatPrice(selectedVariant.price)}
            </span>
            {selectedVariant.originalPrice && (
              <span className="text-lg text-slate-400 line-through">
                {formatPrice(selectedVariant.originalPrice)}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500">Precios en pesos argentinos (ARS), con IVA incluido.</p>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-slate-300">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2">−</button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2">+</button>
            </div>
            <button
              onClick={() => add(product, selectedVariant, qty)}
              className="flex-1 rounded-lg bg-carvex-900 py-3 font-semibold text-white hover:bg-carvex-800"
            >
              Agregar al carrito
            </button>
          </div>
          <Link
            to="/carrito"
            className="mt-3 block w-full rounded-lg border border-carvex-900 py-3 text-center font-semibold text-carvex-900 hover:bg-carvex-50"
          >
            Comprar ahora
          </Link>

          <div className="mt-8 space-y-6">
            <div>
              <h2 className="font-display font-semibold">Descripción</h2>
              <p className="mt-2 text-slate-700">{product.description}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <h2 className="font-display font-semibold">Modo de uso</h2>
              <p className="mt-2 text-sm text-slate-700">{product.usage}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5 text-sm text-slate-600">
              <p className="font-semibold text-carvex-900">¿Cómo se trabaja a pedido?</p>
              <p className="mt-1">
                Pedís por WhatsApp → confirmamos stock con nuestro distribuidor Vonixx y coordinamos el pago y el envío
                → despachamos en 3-7 días hábiles con seguimiento a todo el país.
              </p>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl font-bold">También te puede interesar</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
