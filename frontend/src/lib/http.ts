// Helper de fetch con timeout.
// Render free duerme el backend tras 15 minutos sin tráfico: la primera
// llamada del día puede tardar hasta ~50 segundos en despertarlo.
// Damos 60s y, si no responde, mostramos un mensaje claro en vez de
// dejar el navegador colgado.

const REQUEST_TIMEOUT_MS = 60_000;

export const TIMEOUT_MESSAGE =
  "El servidor tardó demasiado en responder. Reintentá en unos segundos.";

export async function fetchWithTimeout(
  input: string,
  init: RequestInit = {},
  timeoutMs = REQUEST_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (err) {
    if (controller.signal.aborted) throw new Error(TIMEOUT_MESSAGE);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
