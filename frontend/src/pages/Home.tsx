import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../lib/api";
import type { Product, Category } from "../types";
import ProductCard from "../components/ProductCard";
import HeroBanner from "../components/HeroBanner";

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

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

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const t = term.trim();
    navigate(t ? `/catalogo?q=${encodeURIComponent(t)}` : "/catalogo");
  };

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

        {/* BUSCADOR DEL HOME */}
        <form onSubmit={onSearch} className="mt-6 flex gap-2">
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Buscá por nombre… (ej: Alumax, cera, pulimento)"
            aria-label="Buscar producto por nombre"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-carvex-900"
          />
          <button
            type="submit"
            className="whitespace-nowrap rounded-xl bg-carvex-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-carvex-800"
          >
            Buscar
          </button>
        </form>

        {/* CTA CATÁLOGO */}
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
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
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
