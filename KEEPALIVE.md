# Keepalive del backend

Render (plan free) duerme el servicio tras **15 minutos sin tráfico**. La primera
visita del día tarda entre **30 y 50 segundos** en despertarlo.

El keepalive le pega cada 5 minutos a `GET /api/health` para que nunca llegue a
dormirse. Ese endpoint no toca la base de datos, así que no consume Neon.

```
URL: https://carvex-api.onrender.com/api/health
```

## Opción 1 (implementada): GitHub Actions

Archivo: `.github/workflows/keepalive.yml`

- Se ejecuta automáticamente **cada 5 minutos**.
- El repo es público, así que los minutos de Actions son gratis.
- Si Render está dormido, reintenta hasta 3 veces (el primer request lo despierta).
- También se puede disparar a mano desde **Actions → Keepalive API → Run workflow**.

### Cómo activarlo

Solo hay que subir el workflow a la rama `main`:

```bash
git add .github/workflows/keepalive.yml
git commit -m "keepalive para Render"
git push
```

Después, en GitHub → pestaña **Actions** → **Keepalive API**, deberías ver una
corrida cada ~5 minutos en verde.

### Limitaciones

- GitHub puede demorar el cron algunos minutos en horarios de mucha carga.
- GitHub desactiva los workflows programados después de **60 días sin actividad**
  en el repo. Cualquier commit los reactiva.

## Opción 2 (recomendada como respaldo): UptimeRobot

Más puntual que el cron de GitHub. Gratis y sin tarjeta.

1. Crear cuenta en https://uptimerobot.com
2. **Add New Monitor**
   - Type: `HTTP(s)`
   - Name: `Carvex API`
   - URL: `https://carvex-api.onrender.com/api/health`
   - Interval: `5 minutes`
3. Guardar.

Bonus: te manda un mail si el backend se cae.

> Se pueden tener las dos opciones al mismo tiempo. No se estorban.

## Opción 3: manual, desde tu PC

```bash
npm run keepalive
```

Pinguea cada 5 minutos mientras la terminal esté abierta. Sirve para probar:

```bash
KEEPALIVE_URL=https://carvex-api.onrender.com/api/health npm run keepalive
```

## Consumo del plan free de Render

- Plan free: **750 horas/mes**.
- Keepalive 24/7: **~720 horas/mes**.
- Solo Carvex está en Render, así que entra justo.
- Si algún día sumás otro servicio en Render, apagá el keepalive unas horas al día
  o pasá Carvex a Render pago (USD 7/mes).

## Si cambia la URL del backend

Actualizá la URL en:

1. `.github/workflows/keepalive.yml`
2. `scripts/keepalive.mjs` (valor por defecto)
3. `KEEPALIVE.md`
4. `VITE_API_URL` en Vercel
5. `FRONTEND_URL` en Render

## Verificación

```bash
# 1. El health responde
curl https://carvex-api.onrender.com/api/health
# → {"ok":true,"service":"carvex-api"}

# 2. La tienda carga productos al instante
#    https://carvexcorrientes.vercel.app

# 3. Esperá 20 minutos sin entrar y recargá:
#    debe seguir rápido (no se durmió)
```
