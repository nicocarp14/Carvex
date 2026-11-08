import { useEffect } from "react";
import { Link } from "react-router-dom";

const INSTAGRAM_USER = "carvexcorrientes";
const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_USER}`;

// Elfsight → Instagram Feed → @carvexcorrientes
// ID tomado del Embed Code de Elfsight (Embed Code, no Share Link).
// Si se redefine VITE_ELFSIGHT_WIDGET_ID en Vercel, ese override manda.
const WIDGET_ID =
  (import.meta.env.VITE_ELFSIGHT_WIDGET_ID as string | undefined) ??
  "8caaa921-8267-4b28-97b5-45f0647c6763";

export default function InstagramFeed() {
  useEffect(() => {
    if (!WIDGET_ID) return;
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.defer = true;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold">Seguinos en Instagram</h2>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-sm font-semibold text-carvex-600 hover:underline"
          >
            @{INSTAGRAM_USER} →
          </a>
        </div>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-full border border-carvex-900 px-5 py-2.5 text-sm font-semibold text-carvex-900 hover:bg-carvex-900 hover:text-white sm:inline-block"
        >
          Ver perfil
        </a>
      </div>

      {WIDGET_ID ? (
        <div className="mt-6">
          <div className={`elfsight-app-${WIDGET_ID}`} data-elfsight-app-id={WIDGET_ID} />
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <p className="font-display text-lg font-semibold">@carvexcorrientes</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            Conectá el widget de Elfsight con <strong>@carvexcorrientes</strong> para ver las últimas publicaciones acá.
            La sección ya está lista — solo falta el ID del widget.
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-carvex-900 px-6 py-3 text-sm font-bold text-white hover:bg-carvex-800"
          >
            Ir a Instagram →
          </a>
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          to="/catalogo"
          className="inline-block rounded-full bg-carvex-900 px-8 py-3 text-sm font-bold text-white transition hover:bg-carvex-800"
        >
          Ver catálogo completo →
        </Link>
      </div>
    </section>
  );
}
