#!/usr/bin/env node
// Keepalive manual para el backend de Render.
//
// Uso:
//   npm run keepalive
//   KEEPALIVE_URL=https://otra-api.onrender.com/api/health npm run keepalive
//
// Dejalo corriendo en una terminal mientras trabajás. El workflow de GitHub
// Actions (.github/workflows/keepalive.yml) hace lo mismo de forma automática.

const url = process.env.KEEPALIVE_URL ?? "https://carvex-api.onrender.com/api/health";
const intervalMinutes = Number(process.env.KEEPALIVE_INTERVAL_MINUTES ?? 5);
const intervalMs = Math.max(1, intervalMinutes) * 60_000;

async function ping() {
  const started = Date.now();
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
    const ms = Date.now() - started;
    if (res.ok) {
      console.log(`[${new Date().toLocaleTimeString("es-AR")}] OK ${res.status} (${ms} ms)`);
    } else {
      console.warn(`[${new Date().toLocaleTimeString("es-AR")}] HTTP ${res.status} (${ms} ms)`);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[${new Date().toLocaleTimeString("es-AR")}] Error: ${msg}`);
  }
}

console.log(`Keepalive → ${url} cada ${intervalMinutes} min. Ctrl+C para salir.`);
await ping();

// Modo de prueba: un solo ping y sale.
if (process.env.KEEPALIVE_ONCE === "1") process.exit(0);

setInterval(ping, intervalMs);
