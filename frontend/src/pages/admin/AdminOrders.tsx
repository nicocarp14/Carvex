import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchOrders, updateOrder } from "../../lib/adminApi";
import { formatPrice } from "../../lib/format";
import { ORDER_STATUSES, formatDate, statusClasses, statusLabel } from "../../lib/adminUi";
import type { Order, OrderStatus } from "../../types";

export default function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") ?? "";

  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState(initialStatus);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = async (params: { status?: string; q?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrders(params);
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load({ status: status || undefined, q: q || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const onFilterStatus = (value: string) => {
    setStatus(value);
    const next = new URLSearchParams(searchParams);
    if (value) next.set("status", value);
    else next.delete("status");
    setSearchParams(next, { replace: true });
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load({ status: status || undefined, q: q || undefined });
  };

  const onChangeStatus = async (order: Order, next: OrderStatus) => {
    setUpdatingId(order.id);
    setError(null);
    try {
      const updated = await updateOrder(order.id, { status: next });
      setOrders((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cambiar el estado");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-carvex-900">Pedidos</h1>
          <p className="mt-1 text-sm text-slate-500">Gestioná el estado de cada pedido a pedido.</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          value={status}
          onChange={(e) => onFilterStatus(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-carvex-500 focus:ring-2 focus:ring-carvex-200"
        >
          <option value="">Todos los estados</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel[s]}
            </option>
          ))}
        </select>

        <form onSubmit={onSearch} className="flex flex-1 gap-2 sm:max-w-md">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, email o teléfono"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-carvex-500 focus:ring-2 focus:ring-carvex-200"
          />
          <button
            type="submit"
            className="rounded-lg bg-carvex-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-carvex-800"
          >
            Buscar
          </button>
        </form>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Pedido</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Cargando pedidos...
                </td>
              </tr>
            )}

            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No hay pedidos para mostrar.
                </td>
              </tr>
            )}

            {!loading &&
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-carvex-900">
                    #{order.id}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{order.customerName}</p>
                    <p className="text-xs text-slate-500">{order.customerEmail}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-800">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusClasses[order.status]}`}
                      >
                        {statusLabel[order.status]}
                      </span>
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => onChangeStatus(order, e.target.value as OrderStatus)}
                        aria-label={`Cambiar estado del pedido ${order.id}`}
                        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs outline-none focus:border-carvex-500 disabled:opacity-50"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {statusLabel[s]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <Link
                      to={`/admin/pedidos/${order.id}`}
                      className="font-semibold text-carvex-600 hover:underline"
                    >
                      Ver →
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
