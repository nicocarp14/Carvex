import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchOrder, updateOrder } from "../../lib/adminApi";
import { formatPrice } from "../../lib/format";
import { ORDER_STATUSES, formatDate, statusClasses, statusLabel } from "../../lib/adminUi";
import type { Order, OrderStatus } from "../../types";

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<OrderStatus>("PENDIENTE");
  const [trackingCode, setTrackingCode] = useState("");
  const [carrier, setCarrier] = useState("");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    fetchOrder(id)
      .then((data) => {
        if (!active) return;
        setOrder(data);
        setStatus(data.status);
        setTrackingCode(data.trackingCode ?? "");
        setCarrier(data.carrier ?? "");
        setNotes(data.notes ?? "");
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "No se pudo cargar el pedido");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await updateOrder(order.id, {
        status,
        trackingCode: trackingCode.trim() || null,
        carrier: carrier.trim() || null,
        notes: notes.trim() || null,
      });
      setOrder(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-slate-500">Cargando pedido...</p>;

  if (error && !order) {
    return (
      <div>
        <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>
        <Link to="/admin/pedidos" className="mt-4 inline-block text-sm font-semibold text-carvex-600 hover:underline">
          ← Volver a pedidos
        </Link>
      </div>
    );
  }

  if (!order) return null;

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/admin/pedidos" className="text-sm font-medium text-slate-500 hover:text-carvex-900">
            ← Volver a pedidos
          </Link>
          <h1 className="mt-1 font-display text-2xl font-bold text-carvex-900">Pedido #{order.id}</h1>
          <p className="mt-1 text-sm text-slate-500">Creado el {formatDate(order.createdAt)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusClasses[order.status]}`}>
          {statusLabel[order.status]}
        </span>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Items */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <h2 className="border-b border-slate-200 px-4 py-3 font-display text-base font-bold text-carvex-900">
              Productos
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-2">Producto</th>
                    <th className="px-4 py-2">Cantidad</th>
                    <th className="px-4 py-2">Precio</th>
                    <th className="px-4 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{item.product.name}</p>
                        <p className="text-xs text-slate-500">
                          {item.product.brand} {item.product.size ? `· ${item.product.size}` : ""}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{item.quantity}</td>
                      <td className="px-4 py-3 text-slate-600">{formatPrice(item.price)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-800">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-1 border-t border-slate-200 px-4 py-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Envío</span>
                <span>A coordinar por WhatsApp</span>
              </div>
              <div className="flex justify-between text-base font-bold text-carvex-900">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </section>

          {/* Gestión */}
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="font-display text-base font-bold text-carvex-900">Gestión del pedido</h2>
            <form onSubmit={onSave} className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="status" className="mb-1 block text-sm font-medium text-slate-700">
                  Estado
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-carvex-500 focus:ring-2 focus:ring-carvex-200"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {statusLabel[s]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="carrier" className="mb-1 block text-sm font-medium text-slate-700">
                  Transportista
                </label>
                <input
                  id="carrier"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="Ej: Andreani"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-carvex-500 focus:ring-2 focus:ring-carvex-200"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="tracking" className="mb-1 block text-sm font-medium text-slate-700">
                  Código de seguimiento
                </label>
                <input
                  id="tracking"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="Ej: AR123456789"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-carvex-500 focus:ring-2 focus:ring-carvex-200"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="notes" className="mb-1 block text-sm font-medium text-slate-700">
                  Nota interna
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Notas visibles solo para el admin"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-carvex-500 focus:ring-2 focus:ring-carvex-200"
                />
              </div>

              <div className="flex items-center gap-3 sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-carvex-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-carvex-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
                {saved && <span className="text-sm font-medium text-emerald-600">Guardado ✓</span>}
              </div>
            </form>
          </section>
        </div>

        {/* Datos del cliente */}
        <div className="space-y-5">
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="font-display text-base font-bold text-carvex-900">Cliente</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Nombre</dt>
                <dd className="font-medium text-slate-800">{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Email</dt>
                <dd className="break-all text-slate-800">{order.customerEmail}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Teléfono</dt>
                <dd className="text-slate-800">{order.customerPhone}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="font-display text-base font-bold text-carvex-900">Coordinación</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Canal</dt>
                <dd className="text-slate-800">WhatsApp</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Estado del pago</dt>
                <dd className="text-slate-800">A coordinar con el cliente</dd>
              </div>
              {order.paymentId && (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Referencia</dt>
                  <dd className="break-all text-slate-800">{order.paymentId}</dd>
                </div>
              )}
              {order.carrier && (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Transportista</dt>
                  <dd className="text-slate-800">{order.carrier}</dd>
                </div>
              )}
              {order.trackingCode && (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Seguimiento</dt>
                  <dd className="break-all font-mono text-slate-800">{order.trackingCode}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
