import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStats } from "../../lib/adminApi";
import { formatPrice } from "../../lib/format";
import type { AdminStats } from "../../types";

type Card = {
  label: string;
  value: string;
  hint?: string;
  to?: string;
  accent: string;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchStats()
      .then((data) => {
        if (active) setStats(data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Error al cargar estadísticas");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-500">Cargando dashboard...</p>;
  }

  if (error) {
    return (
      <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>
    );
  }

  if (!stats) return null;

  const cards: Card[] = [
    {
      label: "Pedidos pendientes",
      value: String(stats.pending),
      hint: "Esperando confirmación",
      to: "/admin/pedidos?status=PENDIENTE",
      accent: "border-amber-200 bg-amber-50",
    },
    {
      label: "En preparación",
      value: String(stats.inProgress),
      hint: "Confirmados + preparando",
      to: "/admin/pedidos?status=PREPARANDO",
      accent: "border-indigo-200 bg-indigo-50",
    },
    {
      label: "Enviados",
      value: String(stats.shipped),
      hint: "Despachados al cliente",
      to: "/admin/pedidos?status=ENVIADO",
      accent: "border-cyan-200 bg-cyan-50",
    },
    {
      label: "Facturado",
      value: formatPrice(stats.revenue),
      hint: "Sin pedidos cancelados",
      accent: "border-emerald-200 bg-emerald-50",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-carvex-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Resumen de la tienda Carvex.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const content = (
            <>
              <p className="text-sm font-medium text-slate-600">{card.label}</p>
              <p className="mt-2 font-display text-2xl font-bold text-carvex-900">{card.value}</p>
              {card.hint && <p className="mt-1 text-xs text-slate-500">{card.hint}</p>}
            </>
          );

          return card.to ? (
            <Link
              key={card.label}
              to={card.to}
              className={`rounded-xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${card.accent}`}
            >
              {content}
            </Link>
          ) : (
            <div key={card.label} className={`rounded-xl border p-4 ${card.accent}`}>
              {content}
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-600">Pedidos totales</p>
          <p className="mt-2 font-display text-2xl font-bold text-carvex-900">{stats.totalOrders}</p>
          <Link to="/admin/pedidos" className="mt-2 inline-block text-xs font-semibold text-carvex-600 hover:underline">
            Ver todos los pedidos →
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-600">Productos publicados</p>
          <p className="mt-2 font-display text-2xl font-bold text-carvex-900">{stats.products}</p>
          <Link to="/admin/productos" className="mt-2 inline-block text-xs font-semibold text-carvex-600 hover:underline">
            Gestionar productos →
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-600">Pedidos cancelados</p>
          <p className="mt-2 font-display text-2xl font-bold text-carvex-900">{stats.cancelled}</p>
          <Link to="/admin/pedidos?status=CANCELADO" className="mt-2 inline-block text-xs font-semibold text-carvex-600 hover:underline">
            Ver cancelados →
          </Link>
        </div>
      </div>
    </div>
  );
}
