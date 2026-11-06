import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../lib/api";
import type { Product, Category } from "../types";
import ProductCard from "../components/ProductCard";

type Sort = "featured" | "price-asc" | "price-desc" | "name";

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";
  const initialQ = searchParams.get("q") ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState(initialCategory);
  const [q, setQ] = useState(initialQ);
  const [sort, setSort] = useState<Sort>("featured");
  const [maxPrice, setMaxPrice] = useState(40000);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const categoryName = category
      ? categories.find((c) => c.slug === category)?.name
      : null;
    document.title = categoryName
      ? `${categoryName} | Catálogo Vonixx — Carvex`
      : "Catálogo Vonixx — Carvex";
  }, [category, categories]);

  useEffect(() => {
    setCategory(searchParams.get("category") ?? "");
    setQ(searchParams.get("q") ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      fetchCategories(),
      fetchProducts({ category: category || undefined, q: q || undefined }),
    ])
      .then(([cats, prods]) => {
        if (!active) return;
        setCategories(cats);
        setProducts(prods);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [category, q]);

  const visible = useMemo(() => {
    const f = products.filter((p) => p.price <= maxPrice);
    if (sort === "price-asc") return [...f].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...f].sort((a, b) => b.price - a.price);
    if (sort === "name") return [...f].sort((a, b) => a.name.localeCompare(b.name));
    return [...f].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [products, sort, maxPrice]);

  const upd = (next: string) => {
    setCategory(next);
    const sp = new URLSearchParams(searchParams);
    if (next) sp.set("category", next);
    else sp.delete("category");
    setSearchParams(sp, { replace: true });
  };

  // Ocultar categorías vacías para no llevar a páginas sin productos
  const visibleCategories = categories.filter((c) => (c._count?.products ?? 1) > 0);
  const activeFilters =
    (category ? 1 : 0) + (q ? 1 : 0) + (maxPrice < 40000 ? 1 : 0) + (sort !== "featured" ? 1 : 0);

  // ESC cierra el panel de filtros en mobile
  useEffect(() => {
    if (!filtersOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFiltersOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [filtersOpen]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Catálogo Vonixx</h1>
      <p className="mt-1 text-slate-600">
        {visible.length} producto{visible.length !== 1 && "s"} · Venta a pedido en toda Argentina
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* FILTROS — colapsable en mobile, siempre visible en desktop */}
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          aria-controls="catalog-filters"
          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold lg:hidden"
        >
          <span>
            Filtros{activeFilters ? ` (${activeFilters})` : ""}
          </span>
          <span aria-hidden="true">{filtersOpen ? "▲" : "▼"}</span>
        </button>
        <aside
          id="catalog-filters"
          className={`${filtersOpen ? "block" : "hidden"} h-fit rounded-2xl border border-slate-200 p-5 lg:sticky lg:top-20 lg:block`}
        >
          <label className="block text-sm font-semibold">Buscar</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Iron, cera, pulido..."
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-carvex-500"
          />

          <label className="mt-6 block text-sm font-semibold">Categoría</label>
          <div className="mt-2 space-y-1">
            <button
              onClick={() => upd("")}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${!category ? "bg-carvex-900 text-white" : "hover:bg-slate-100"}`}
            >
              Todas
            </button>
            {visibleCategories.map((c) => (
              <button
                key={c.slug}
                onClick={() => upd(c.slug)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${category === c.slug ? "bg-carvex-900 text-white" : "hover:bg-slate-100"}`}
              >
                <span>{c.name}</span>
                {c._count?.products != null ? (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${category === c.slug ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                    {c._count.products}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          <label className="mt-6 block text-sm font-semibold">Precio máximo</label>
          <input
            type="range"
            min={5000}
            max={40000}
            step={1000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="mt-2 w-full accent-carvex-900"
          />
          <p className="text-sm text-slate-600">Hasta ${maxPrice.toLocaleString("es-AR")}</p>

          <label className="mt-6 block text-sm font-semibold">Ordenar</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="featured">Destacados</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="name">Nombre A-Z</option>
          </select>
        </aside>

        {/* GRID */}
        <div>
          {loading ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
              Cargando productos... si es la primera visita del día, el servidor puede tardar hasta
              40 segundos en despertar.
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
              No encontramos productos con esos filtros. Probá ampliar el rango de precio.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
