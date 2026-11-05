import { Link } from "react-router-dom";

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">Cómo trabaja Carvex</h1>
      <p className="mt-3 text-slate-600">
        Trabajamos en modo <strong>a pedido</strong>: no guardamos stock físico. Comprás, pagás y nosotros
        traemos tu producto Vonixx original del distribuidor.
      </p>

      <div className="mt-8 space-y-6">
        {[
          {
            t: "1. Elegí y pagá con Mercado Pago",
            d: "Carrito, checkout y pago seguro. Pagás en pesos (ARS) con tarjeta, débito o dinero en cuenta.",
          },
          {
            t: "2. Confirmamos con el distribuidor",
            d: "Tras tu pago hacemos el pedido al distribuidor oficial Vonixx. Te contactamos por WhatsApp/email con la fecha estimada de llegada.",
          },
          {
            t: "3. Preparación y envío",
            d: "Al recibir el producto lo preparamos y despachamos en 24-48h con código de seguimiento a tu dirección en toda Argentina.",
          },
          {
            t: "4. Recibís y disfrutás",
            d: "Plazos totales de 3-7 días hábiles desde la confirmación del pago. Todos los productos originales con garantía Vonixx.",
          },
        ].map((s) => (
          <div key={s.t} className="rounded-2xl border border-slate-200 p-6">
            <h2 className="font-display font-semibold">{s.t}</h2>
            <p className="mt-2 text-slate-600">{s.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-carvex-900 p-6 text-white">
        <h2 className="font-display font-semibold">¿Por qué a pedido?</h2>
        <p className="mt-2 text-slate-300">
          Nos permite ofrecerte todo el catálogo Vonixx sin que pagues sobrecostos de stock, con garantía de
          originalidad y precios justos en ARS.
        </p>
      </div>

      <Link to="/catalogo" className="mt-8 inline-block rounded-lg bg-carvex-900 px-6 py-3 font-semibold text-white">
        Empezar a comprar
      </Link>
    </div>
  );
}
