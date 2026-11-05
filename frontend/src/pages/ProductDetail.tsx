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
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);

  useEffect(() => {
    fetchProductBySlug(slug).then(setProduct);
    window.scrollTo(0, 0);
  }, [slug]);

  if (!product)
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-500">Cargando producto...</div>
    );

  const related = product.related ?? [];

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
          <p className="text-sm text-slate-500">
            {product.brand} · {product.size ?? ""}
          </p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-carvex-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
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
              onClick={() => add(product, qty)}
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
                Pagás con Mercado Pago → confirmamos el pedido con nuestro distribuidor Vonixx → despachamos en
                3-7 días hábiles con seguimiento a todo el país.
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
