import { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  fetchAdminCategories,
  fetchAdminProducts,
  updateProduct,
  type ProductInput,
} from "../../lib/adminApi";
import { formatPrice } from "../../lib/format";
import type { Category, Product } from "../../types";

type FormState = {
  name: string;
  slug: string;
  price: string;
  originalPrice: string;
  categoryId: string;
  size: string;
  imageUrl: string;
  description: string;
  usage: string;
  featured: boolean;
};

const emptyForm: FormState = {
  name: "",
  slug: "",
  price: "",
  originalPrice: "",
  categoryId: "",
  size: "",
  imageUrl: "",
  description: "",
  usage: "",
  featured: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productList, categoryList] = await Promise.all([
        fetchAdminProducts(),
        fetchAdminCategories(),
      ]);
      setProducts(productList);
      setCategories(categoryList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyForm, categoryId: categories[0] ? String(categories[0].id) : "" });
    setFormOpen(true);
    setError(null);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      slug: product.slug,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : "",
      categoryId: String(product.category.id),
      size: product.size ?? "",
      imageUrl: product.imageUrl ?? "",
      description: product.description,
      usage: product.usage,
      featured: product.featured,
    });
    setFormOpen(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload: ProductInput = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      price: Number(form.price),
      originalPrice: form.originalPrice.trim() ? Number(form.originalPrice) : null,
      categoryId: Number(form.categoryId),
      description: form.description.trim(),
      usage: form.usage.trim(),
      size: form.size.trim() || null,
      imageUrl: form.imageUrl.trim() || undefined,
      featured: form.featured,
    };

    setSaving(true);
    try {
      if (editing) await updateProduct(editing.id, payload);
      else await createProduct(payload);
      closeForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el producto");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (product: Product) => {
    if (!window.confirm(`¿Borrar el producto "${product.name}"?`)) return;
    setError(null);
    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo borrar el producto");
    }
  };

  const inputCls =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-carvex-500 focus:ring-2 focus:ring-carvex-200";

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-carvex-900">Productos</h1>
          <p className="mt-1 text-sm text-slate-500">Cargá, editá y organizá el catálogo Vonixx.</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="rounded-lg bg-carvex-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-carvex-800"
        >
          + Nuevo producto
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>
      )}

      {formOpen && (
        <form onSubmit={onSubmit} className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-carvex-900">
              {editing ? `Editar: ${editing.name}` : "Nuevo producto"}
            </h2>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Nombre *</label>
              <input
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className={inputCls}
                placeholder="Ej: Iron Remover"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Categoría *</label>
              <select
                required
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                className={inputCls}
              >
                <option value="">Elegí una categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Precio (ARS) *</label>
              <input
                required
                type="number"
                min={1}
                step={1}
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className={inputCls}
                placeholder="25000"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Precio anterior</label>
              <input
                type="number"
                min={1}
                step={1}
                value={form.originalPrice}
                onChange={(e) => set("originalPrice", e.target.value)}
                className={inputCls}
                placeholder="Opcional"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Tamaño</label>
              <input
                value={form.size}
                onChange={(e) => set("size", e.target.value)}
                className={inputCls}
                placeholder="Ej: 500ml"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                className={inputCls}
                placeholder="Se genera solo si lo dejás vacío"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Imagen (URL)</label>
              <input
                value={form.imageUrl}
                onChange={(e) => set("imageUrl", e.target.value)}
                className={inputCls}
                placeholder="/images/producto.jpg (opcional)"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1 block text-sm font-medium text-slate-700">Descripción *</label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                className={inputCls}
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1 block text-sm font-medium text-slate-700">Modo de uso *</label>
              <textarea
                required
                rows={3}
                value={form.usage}
                onChange={(e) => set("usage", e.target.value)}
                className={inputCls}
              />
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-carvex-600 focus:ring-carvex-500"
              />
              Producto destacado en la home
            </label>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-carvex-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-carvex-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear producto"}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Destacado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  Cargando productos...
                </td>
              </tr>
            )}

            {!loading && products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No hay productos cargados.
                </td>
              </tr>
            )}

            {!loading &&
              products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{product.category?.name ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <p className="font-semibold text-slate-800">{formatPrice(product.price)}</p>
                    {product.originalPrice && (
                      <p className="text-xs text-slate-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {product.featured ? (
                      <span className="rounded-full bg-carvex-50 px-2 py-0.5 text-xs font-semibold text-carvex-700">
                        Sí
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">No</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(product)}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(product)}
                        className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                      >
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
