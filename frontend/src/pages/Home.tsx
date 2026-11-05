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
    Promise.all([fetchProducts({ featured: true }), fetchCategories()])
      .then(([productos, cats]) => {
        setFeatured(productos);
        setCategories(cats);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* BANNER */}
      <HeroBanner />

      {/* CATEGORÍAS */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Comprá por categoría</h2>
            <p className="text-slate-600">Lavado, protección, pulido, interior y exterior.</p>
          </div>
          <Link to="/catalogo" className="hidden text-sm font-semibold text-carvex-600 hover:underline md:block">
            Ver todo →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
          {loading ? (
            <p className="col-span-full text-sm text-slate-500">Cargando categorías...</p>
          ) : (
            categories.map((c) => (
            <Link
              key={c.slug}
              to={`/catalogo?category=${c.slug}`}
              className="rounded-2xl bg-carvex-900 p-5 text-white transition hover:bg-carvex-800"
            >
              <p className="font-display font-semibold">{c.name}</p>
              <p className="mt-1 text-xs text-carvex-200">{c._count?.products ?? ""}</p>
              <p className="mt-6 text-sm font-semibold text-carvex-300">Explorar →</p>
            </Link>
            ))
          )}
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
            { n: "1", t: "Comprás y pagás", d: "Elegís tus productos Vonixx y pagás con Mercado Pago. Recibís la confirmación al instante." },
            { n: "2", t: "Confirmamos stock", d: "Hacemos el pedido a nuestro distribuidor oficial. Te avisamos por WhatsApp/email la fecha estimada." },
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
