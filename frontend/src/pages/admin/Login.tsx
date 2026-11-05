import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { login } from "../../lib/adminApi";
import { useAuth } from "../../store/auth";

export default function AdminLogin() {
  const token = useAuth((s) => s.token);
  const setSession = useAuth((s) => s.setSession);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/admin" replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await login(email, password);
      setSession(data.token, data.user);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-carvex-900 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="font-display text-3xl font-bold tracking-tight text-white">CARVEX</p>
          <p className="mt-1 text-sm uppercase tracking-[0.3em] text-carvex-300">Panel de administración</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-white/10 bg-white p-6 shadow-xl sm:p-8"
        >
          <h1 className="font-display text-xl font-bold text-carvex-900">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-slate-500">Acceso exclusivo para administradores.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-carvex-500 focus:ring-2 focus:ring-carvex-200"
                placeholder="admin@carvex.com.ar"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-carvex-500 focus:ring-2 focus:ring-carvex-200"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-carvex-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-carvex-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <Link
            to="/"
            className="mt-4 block text-center text-sm font-medium text-slate-500 hover:text-carvex-900"
          >
            Volver a la tienda
          </Link>
        </form>
      </div>
    </div>
  );
}
