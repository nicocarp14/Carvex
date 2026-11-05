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
  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ?? product.variants[0];
  if (!selectedVariant) return null;

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

          {product.variants.length > 1 && (
            <div className="mt-4">
              <label htmlFor="product-variant" className="mb-1 block text-sm font-medium">
                Presentación
              </label>
              <select
                id="product-variant"
                value={selectedVariant.id}
                onChange={(event) => setSelectedVariantId(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-carvex-500 sm:max-w-xs"
              >
                {product.variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.size} · {formatPrice(variant.price)}
                  </option>
                ))}
              </select>
            </div>
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
