import { Link, NavLink } from "react-router-dom";
import { useCart } from "../store/cart";

const linkCls = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm font-medium transition-colors ${isActive ? "text-carvex-900" : "text-slate-500 hover:text-carvex-900"}`;

export default function Header() {
  const count = useCart((s) => s.items.reduce((a, i) => a + i.qty, 0));

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <img src="/logoiso.webp" alt="Carvex" className="h-12 w-auto object-contain md:h-16" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={linkCls}>
            Inicio
          </NavLink>
          <NavLink to="/catalogo" className={linkCls}>
            Catálogo
          </NavLink>
          <NavLink to="/como-trabajamos" className={linkCls}>
            Cómo trabajamos
          </NavLink>
        </nav>

        <Link
          to="/carrito"
          className="relative flex items-center gap-2 rounded-lg bg-carvex-900 px-4 py-2 text-sm font-semibold text-white hover:bg-carvex-800"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Carrito
          {count > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-carvex-500 px-1 text-xs font-bold text-white">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
