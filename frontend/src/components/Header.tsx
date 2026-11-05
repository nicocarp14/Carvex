import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCart } from "../store/cart";

const linkCls = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm font-medium transition-colors ${isActive ? "text-carvex-900" : "text-slate-500 hover:text-carvex-900"}`;

const mobileLinkCls = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
    isActive ? "bg-carvex-50 text-carvex-900" : "text-slate-700 hover:bg-slate-50"
  }`;

const links = [
  { to: "/", label: "Inicio", end: true },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/como-funciona", label: "Cómo funciona" },
];

export default function Header() {
  const count = useCart((s) => s.items.reduce((a, i) => a + i.qty, 0));
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Cierra el menú al navegar a otra ruta.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <img src="/logoiso.webp" alt="Carvex" className="h-12 w-auto object-contain md:h-16" />
        </Link>

        {/* Navegación desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkCls}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Carrito */}
          <Link
            to="/carrito"
            aria-label={`Carrito${count > 0 ? `, ${count} productos` : ""}`}
            className="relative flex items-center gap-2 rounded-lg bg-carvex-900 px-3 py-2 text-sm font-semibold text-white hover:bg-carvex-800 md:px-4"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="hidden md:inline">Carrito</span>
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-carvex-500 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {/* Hamburguesa (solo móvil) */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-carvex-900 transition hover:bg-slate-50 md:hidden"
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menú desplegable móvil */}
      {open && (
        <nav id="mobile-menu" className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 md:hidden">
          <div className="space-y-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={mobileLinkCls}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
