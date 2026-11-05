import { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  fetchAdminCategories,
  updateCategory,
} from "../../lib/adminApi";
import type { Category } from "../../types";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setCategories(await fetchAdminCategories());
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las categorías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreating(true);
    try {
      await createCategory({ name: name.trim(), slug: slug.trim() || undefined });
      setName("");
      setSlug("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la categoría");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditSlug(category.slug);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditSlug("");
  };

  const onSave = async (id: number) => {
    setError(null);
    setSavingId(id);
    try {
      await updateCategory(id, { name: editName.trim(), slug: editSlug.trim() || undefined });
      cancelEdit();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la categoría");
    } finally {
      setSavingId(null);
    }
  };

  const onDelete = async (category: Category) => {
    if (!window.confirm(`¿Borrar la categoría "${category.name}"?`)) return;
    setError(null);
    try {
      await deleteCategory(category.id);
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo borrar la categoría");
    }
  };

  const inputCls =
    "rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-carvex-500 focus:ring-2 focus:ring-carvex-200";

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-carvex-900">Categorías</h1>
        <p className="mt-1 text-sm text-slate-500">Agrupá los productos del catálogo.</p>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>
      )}

      <form onSubmit={onCreate} className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="font-display text-base font-bold text-carvex-900">Nueva categoría</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre (Ej: Lavado)"
            className={`${inputCls} min-w-[180px] flex-1`}
          />
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Slug (opcional)"
            className={`${inputCls} min-w-[160px] flex-1`}
          />
          <button
            type="submit"
            disabled={creating}
            className="rounded-lg bg-carvex-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-carvex-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? "Creando..." : "Crear"}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Productos</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  Cargando categorías...
                </td>
              </tr>
            )}

            {!loading && categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No hay categorías cargadas.
                </td>
              </tr>
            )}

            {!loading &&
              categories.map((category) => {
                const isEditing = editingId === category.id;

                return (
                  <tr key={category.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className={`${inputCls} w-full min-w-[160px]`}
                        />
                      ) : (
                        <p className="font-medium text-slate-800">{category.name}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          className={`${inputCls} w-full min-w-[140px]`}
                        />
                      ) : (
                        <span className="font-mono text-xs text-slate-500">{category.slug}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{category._count?.products ?? 0}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => onSave(category.id)}
                              disabled={savingId === category.id}
                              className="rounded-lg bg-carvex-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-carvex-800 disabled:opacity-60"
                            >
                              {savingId === category.id ? "Guardando..." : "Guardar"}
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => startEdit(category)}
                              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => onDelete(category)}
                              className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                            >
                              Borrar
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        No se puede borrar una categoría que tenga productos asociados.
      </p>
    </div>
  );
}
