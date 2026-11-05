import { useEffect } from "react";
import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { ApiError, fetchMe } from "../../lib/adminApi";
import { useAuth } from "../../store/auth";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/pedidos", label: "Pedidos" },
  { to: "/admin/productos", label: "Productos" },
  { to: "/admin/categorias", label: "Categorías" },
];

const desktopLink = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-white/10 text-white" : "text-carvex-200 hover:bg-white/5 hover:text-white"
  }`;

const mobileLink = ({ isActive }: { isActive: boolean }) =>
  `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-carvex-900 text-white" : "text-slate-600 hover:bg-slate-100"
  }`;

export default function AdminLayout() {
  const token = useAuth((s) => s.token);
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();

  // Valida el token guardado contra el backend.
  useEffect(() => {
    if (!token) return;
    fetchMe().catch((err) => {
      if (err instanceof ApiError && err.status === 401) logout();
    });
  }, [token, logout]);

  if (!token) return <Navigate to="/admin/login" replace />;

  const onLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 flex-col bg-carvex-900 p-6 text-white md:flex">
        <Link to="/admin" className="block">
          <p className="font-display text-2xl font-bold tracking-tight">CARVEX</p>
          <p className="text-xs uppercase tracking-[0.25em] text-carvex-300">Panel</p>
        </Link>

        <nav className="mt-8 flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={desktopLink}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-3 border-t border-white/10 pt-4">
          <p className="truncate text-xs text-carvex-300" title={user?.email}>
            {user?.email ?? "Administrador"}
          </p>
          <Link to="/" className="block text-xs font-medium text-carvex-200 hover:text-white">
            Ver tienda ↗
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="w-full rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        {/* Barra superior móvil */}
        <header className="flex items-center justify-between bg-carvex-900 px-4 py-3 text-white md:hidden">
          <Link to="/admin">
            <p className="font-display text-lg font-bold tracking-tight">CARVEX</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-carvex-300">Panel</p>
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium transition hover:bg-white/10"
          >
            Salir
          </button>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 md:hidden">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={mobileLink}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
