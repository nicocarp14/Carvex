import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../store/cart";
import { formatPrice } from "../lib/format";
import { fetchShipping, createOrder, type ShippingOption } from "../lib/api";
import ProductImage from "../components/ProductImage";

export default function Checkout() {
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const subtotal = items.reduce((a, i) => a + i.product.price * i.qty, 0);

  const [shipping, setShipping] = useState<ShippingOption[]>([]);
  const [province, setProvince] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [acceptOnOrder, setacceptOnOrder] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<number | null>(null);

  useEffect(() => {
    fetchShipping()
      .then(setShipping)
      .catch(() =>
        setShipping([
          { province: "CABA", price: 3500, days: "1-2 dÃ­as" },
          { province: "Buenos Aires", price: 4500, days: "2-4 dÃ­as" },
          { province: "Otra provincia", price: 6500, days: "3-7 dÃ­as" },
        ]),
      );
  }, []);

  const ship = useMemo(
    () => shipping.find((s) => s.province === province) ?? { price: 0, days: "" },
    [shipping, province],
  );
  const total = subtotal + ship.price;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!acceptOnOrder) {
      setError("TenÃ©s que aceptar la demora estimada a pedido para continuar.");
      return;
    }
    if (items.length === 0) {
      setError("Tu carrito estÃ¡ vacÃ­o.");
      return;
    }
    setSending(true);
    try {
      const data = await createOrder({
        ...form,
        province,
        items: items.map((i) => ({ slug: i.product.slug, qty: i.qty })),
      });
      setSuccess(data.order.id);
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el pedido");
    } finally {
      setSending(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">âœ“</div>
        <h1 className="mt-6 font-display text-3xl font-bold">Â¡Pedido #{success} creado!</h1>
        <p className="mt-3 text-slate-600">
          Pago simulado con Ã©xito. Estamos en modo demo â€” en producciÃ³n acÃ¡ irÃ­a Mercado Pago Checkout Pro.
          Te contactaremos para confirmar con nuestro distribuidor Vonixx.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/catalogo" className="rounded-lg bg-carvex-900 px-6 py-3 font-semibold text-white">
            Seguir comprando
          </Link>
          <button onClick={() => navigate("/")} className="rounded-lg border px-6 py-3 font-semibold">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Checkout vacÃ­o</h1>
        <p className="mt-2 text-slate-600">AgregÃ¡ productos desde el catÃ¡logo.</p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-carvex-500";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Checkout</h1>
      <p className="mt-1 text-slate-600">Venta a pedido Â· PagÃ¡s con Mercado Pago (demo) Â· EnvÃ­o a todo el paÃ­s</p>

      <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 p-6">
            <h2 className="font-display font-semibold">Datos del comprador</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Nombre y apellido</label>
                <input
                  required
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className={inputCls}
                  placeholder="Juan PÃ©rez"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  className={inputCls}
                  placeholder="juan@mail.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium">TelÃ©fono / WhatsApp</label>
                <input
                  required
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                  className={inputCls}
                  placeholder="11 1234-5678"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">DirecciÃ³n</label>
                <input
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className={inputCls}
                  placeholder="Calle 123 456, Piso 2 Depto B"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Ciudad</label>
                <input
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className={inputCls}
                  placeholder="La Plata"
                />
              </div>
              <div>
                <label className="text-sm font-medium">CÃ³digo postal</label>
                <input
                  required
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  className={inputCls}
                  placeholder="1900"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Provincia (para calcular envÃ­o)</label>
                <select
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className={inputCls}
                >
                  <option value="">SeleccionÃ¡ provincia</option>
                  {shipping.map((s) => (
                    <option key={s.province} value={s.province}>
                      {s.province} â€” {formatPrice(s.price)} Â· {s.days}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <label className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
            <input
              type="checkbox"
              checked={acceptOnOrder}
              onChange={(e) => setacceptOnOrder(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-carvex-900"
            />
            <span>
              Acepto que es <strong>venta a pedido</strong> con demora estimada de 3-7 dÃ­as hÃ¡biles desde la
              confirmaciÃ³n del pago (compramos a nuestro distribuidor Vonixx tras tu compra).
            </span>
          </label>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">{error}</div>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-lg bg-carvex-900 py-4 font-semibold text-white disabled:opacity-60 hover:bg-carvex-800"
          >
            {sending ? "Creando pedido..." : `Pagar con Mercado Pago Â· ${formatPrice(total)}`}
          </button>
          <p className="text-center text-xs text-slate-500">
            Demo: el pago es simulado. En producciÃ³n se redirige a Mercado Pago Checkout Pro.
          </p>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 p-6 lg:sticky lg:top-20">
          <h2 className="font-display font-semibold">Tu pedido</h2>
          <div className="mt-4 space-y-3">
            {items.map(({ product, qty }) => (
              <div key={product.slug} className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <ProductImage product={product} className="h-full w-full" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium leading-tight">{product.name}</p>
                  <p className="text-slate-500">{qty} Ã— {formatPrice(product.price)}</p>
                </div>
                <p className="text-sm font-semibold">{formatPrice(product.price * qty)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>EnvÃ­o</span><span>{ship.price ? formatPrice(ship.price) : "â€”"}</span></div>
            <div className="flex justify-between font-bold"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
        </aside>
      </form>
    </div>
  );
}

