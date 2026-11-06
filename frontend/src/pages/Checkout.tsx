import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../store/cart";
import { formatPrice } from "../lib/format";
import { createOrder } from "../lib/api";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "../lib/whatsapp";
import ProductImage from "../components/ProductImage";

export default function Checkout() {
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const subtotal = items.reduce((a, i) => a + i.variant.price * i.qty, 0);

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });
  const [acceptOnOrder, setAcceptOnOrder] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ orderId: number; whatsappUrl: string } | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!acceptOnOrder) {
      setError("Tenés que aceptar la demora estimada a pedido para continuar.");
      return;
    }
    if (items.length === 0) {
      setError("Tu carrito está vacío.");
      return;
    }

    const whatsappWindow = window.open("about:blank", "_blank");
    setSending(true);
    try {
      // 1. El pedido queda registrado en la base (Neon) como PENDIENTE.
      const data = await createOrder({
        ...form,
        items: items.map((item) => ({
          slug: item.product.slug,
          variantId: item.variant.id,
          qty: item.qty,
        })),
      });

      const whatsappUrl = buildWhatsAppUrl(
        buildWhatsAppMessage({
          items,
          subtotal: data.subtotal,
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          customerPhone: form.customerPhone,
          orderId: data.order.id,
        }),
      );

      if (whatsappWindow && !whatsappWindow.closed) {
        whatsappWindow.opener = null;
        whatsappWindow.location.href = whatsappUrl;
      }

      setSuccess({ orderId: data.order.id, whatsappUrl });
      clear();
    } catch (err) {
      whatsappWindow?.close();
      setError(err instanceof Error ? err.message : "No se pudo crear el pedido");
    } finally {
      setSending(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
          ✓
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">
          ¡Pedido registrado!
        </h1>
        <p className="mt-3 text-slate-600">
          El pedido quedó registrado. En WhatsApp vas a encontrar el detalle para enviárnoslo y
          confirmar la compra. Coordinamos el pago y el envío por ese chat.
        </p>
        <a
          href={success.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
        >
          Abrir pedido en WhatsApp
        </a>
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
        <h1 className="font-display text-2xl font-bold">Checkout vacío</h1>
        <p className="mt-2 text-slate-600">Agregá productos desde el catálogo.</p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-carvex-500";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Checkout</h1>
      <p className="mt-1 text-slate-600">
        Venta a pedido · Te atendemos por WhatsApp · Envío a todo el país
      </p>

      <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 p-6">
            <h2 className="font-display font-semibold">Tus datos</h2>
            <p className="mt-1 text-sm text-slate-500">
              Solo necesitamos estos datos. La dirección y el envío los coordinamos por WhatsApp.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Nombre y apellido</label>
                <input
                  required
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className={inputCls}
                  placeholder="Juan Pérez"
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
                <label className="text-sm font-medium">Teléfono / WhatsApp</label>
                <input
                  required
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                  className={inputCls}
                  placeholder="3794-123456"
                />
              </div>
            </div>
          </section>

          <label className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
            <input
              type="checkbox"
              checked={acceptOnOrder}
              onChange={(e) => setAcceptOnOrder(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-carvex-900"
            />
            <span>
              Acepto que es <strong>venta a pedido</strong> con demora estimada de 3-7 días hábiles.
              Confirmamos stock con nuestro distribuidor Vonixx y coordinamos el pago por WhatsApp,
              sin pagar de inmediato.
            </span>
          </label>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={sending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-4 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {sending ? "Creando pedido..." : `Pedir por WhatsApp · ${formatPrice(subtotal)}`}
          </button>
          <p className="text-center text-xs text-slate-500">
            Al tocar el botón se crea el pedido y se abre WhatsApp con el detalle para que lo envíes.
            El pago y el envío se coordinan en ese chat.
          </p>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 p-6 lg:sticky lg:top-20">
          <h2 className="font-display font-semibold">Tu pedido</h2>
          <div className="mt-4 space-y-3">
            {items.map(({ product, variant, qty }) => (
              <div key={`${product.slug}:${variant.id}`} className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <ProductImage product={product} className="h-full w-full" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium leading-tight">{product.name}</p>
                  <p className="text-slate-500">
                    {variant.size ? `${variant.size} · ` : ""}
                    {qty} × {formatPrice(variant.price)}
                  </p>
                </div>
                <p className="text-sm font-semibold">{formatPrice(variant.price * qty)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Envío</span>
              <span>A coordinar</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
