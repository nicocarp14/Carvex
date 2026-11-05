import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-carvex-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold text-white">Carvex</p>
          <p className="mt-2 text-sm">
            Productos Vonixx para detailing. Venta a pedido a todo el país. El pago y el envío se coordinan por WhatsApp.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">Tienda</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/catalogo" className="hover:text-white">Catálogo</Link></li>
            <li><Link to="/catalogo?featured=true" className="hover:text-white">Destacados</Link></li>
            <li><Link to="/como-trabajamos" className="hover:text-white">Cómo trabajamos a pedido</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Ayuda</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Envíos a toda Argentina</li>
            <li>Demora estimada: 3-7 días hábiles</li>
            <li>Pago y envío a coordinar por WhatsApp</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Contacto</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Atención por WhatsApp al hacer tu pedido</li>
            <li>hola@carvex.com.ar</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Carvex · Productos originales Vonixx
      </div>
    </footer>
  );
}
