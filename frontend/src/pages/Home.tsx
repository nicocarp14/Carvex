import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../lib/api";
import type { Product, Category } from "../types";
import ProductCard from "../components/ProductCard";
import HeroBanner from "../components/HeroBanner";

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Carvex | Detailing Vonixx Argentina";
    Promise.all([fetchProducts({ featured: true }), fetchCategories()])
      .then(([productos, cats]) => {
        setFeatured(productos);
        setCategories(cats);
      })
      .finally(() => setLoading(false));
  }, []);

  // Solo categorías con productos para no llevar a vacíos (ej: Interior 0)
  const visibleCategories = categories
    .filter((c) => (c._count?.products ?? 1) > 0)
    .sort((a, b) => (b._count?.products ?? 0) - (a._count?.products ?? 0));
  const totalProducts = categories.reduce((acc, c) => acc + (c._count?.products ?? 0), 0);

  return (
    <div>
      {/* BANNER */}
      <HeroBanner />

      {/* QUÉ BUSCÁS HOY? + CTA CATÁLOGO (A + C) */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-display text-2xl font-bold">¿Qué buscás hoy?</h2>
        <p className="mt-1 text-slate-600">
          Productos Vonixx originales por tipo de tarea — a pedido, con seguimiento, a todo el país.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {loading ? (
            <p className="text-sm text-slate-500">Cargando categorías...</p>
          ) : (
            visibleCategories.map((c) => (
              <Link
                key={c.slug}
                to={`/catalogo?category=${c.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-carvex-900 hover:bg-carvex-900 hover:text-white"
              >
                {c.name}
                {c._count?.products != null ? (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 [a:hover>&]:bg-white/20 [a:hover>&]:text-white">
                    {c._count.products}
                  </span>
                ) : null}
              </Link>
            ))
          )}
        </div>
        <div className="mt-8 flex flex-col gap-6 rounded-3xl bg-carvex-900 p-8 text-white md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <h3 className="font-display text-xl font-bold md:text-2xl">
              Explorá todo el catálogo Vonixx — {totalProducts} productos
            </h3>
            <p className="mt-2 text-sm text-carvex-200">
              100% originales · Envío en 3–7 días · Pedido por WhatsApp
            </p>
          </div>
          <Link
            to="/catalogo"
            className="whitespace-nowrap rounded-full bg-white px-6 py-3 text-sm font-bold text-carvex-900 transition hover:bg-slate-100"
          >
            Ver catálogo completo →
          </Link>
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="font-display text-2xl font-bold">Más vendidos Vonixx</h2>
          <p className="text-slate-600">Los elegidos por detailers profesionales.</p>
          {loading ? (
            <p className="mt-6 text-sm text-slate-500">
              Cargando productos... si es la primera visita del día, el servidor puede tardar hasta
              40 segundos en despertar.
            </p>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.slice(0, 8).map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-display text-2xl font-bold">Venta a pedido, simple</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            { n: "1", t: "Elegís y pedís por WhatsApp", d: "Elegís tus productos Vonixx, completás nombre, email y teléfono, y el pedido te llega por WhatsApp." },
            { n: "2", t: "Confirmamos stock", d: "Hacemos el pedido a nuestro distribuidor oficial. Te avisamos por WhatsApp la fecha estimada y coordinamos el pago." },
            { n: "3", t: "Despachamos", d: "En 3-7 días hábiles sale tu paquete con código de seguimiento a todo el país." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-slate-200 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-carvex-900 font-display font-bold text-white">
                {s.n}
              </span>
              <h3 className="mt-4 font-display font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
