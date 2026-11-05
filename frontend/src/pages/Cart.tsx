import { Link } from "react-router-dom";
import { useCart } from "../store/cart";
import { formatPrice } from "../lib/format";
import ProductImage from "../components/ProductImage";

export default function Cart() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const total = items.reduce((a, i) => a + i.product.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="mt-2 text-slate-600">Explorá el catálogo Vonixx y aprovechá las ofertas a pedido.</p>
        <Link to="/catalogo" className="mt-6 inline-block rounded-lg bg-carvex-900 px-6 py-3 font-semibold text-white">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Carrito</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map(({ product, qty }) => (
            <article key={product.slug} className="flex gap-4 rounded-2xl border border-slate-200 p-4">
              <Link to={`/producto/${product.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                <ProductImage product={product} className="h-full w-full" />
              </Link>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-carvex-600">{product.category.name}</p>
                <Link to={`/producto/${product.slug}`} className="font-display font-semibold hover:text-carvex-600">
                  {product.name}
                </Link>
                <p className="text-sm text-slate-500">{product.size} · Venta a pedido</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-slate-300">
                    <button onClick={() => setQty(product.slug, qty - 1)} className="px-3 py-1">−</button>
                    <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                    <button onClick={() => setQty(product.slug, qty + 1)} className="px-3 py-1">+</button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(product.price * qty)}</p>
                    <button onClick={() => remove(product.slug)} className="text-xs text-red-600 hover:underline">
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
          <button onClick={clear} className="text-sm text-slate-500 hover:text-red-600">
            Vaciar carrito
          </button>
        </div>

        <aside className="h-fit rounded-2xl bg-carvex-900 p-6 text-white lg:sticky lg:top-20">
          <h2 className="font-display font-semibold">Resumen</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-300">Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Envío</span>
              <span>A calcular</span>
            </div>
            <div className="border-t border-white/10 pt-3 text-base font-bold">
              <div className="flex justify-between">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
          <p className="mt-4 rounded-lg bg-white/10 p-3 text-xs leading-relaxed text-slate-200">
            Venta a pedido · Demora estimada 3-7 días hábiles. El envío se calcula por provincia en el checkout.
          </p>
          <Link
            to="/checkout"
            className="mt-4 block w-full rounded-lg bg-white py-3 text-center font-semibold text-carvex-900 hover:bg-carvex-50"
          >
            Ir a pagar
          </Link>
          <Link to="/catalogo" className="mt-3 block text-center text-sm text-carvex-200 hover:text-white">
            Seguir comprando
          </Link>
        </aside>
      </div>
    </div>
  );
}
