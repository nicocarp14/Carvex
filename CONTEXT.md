# Proyecto Carvex — Contexto completo para continuar

## Qué es
Ecommerce de productos Vonixx (detailing) en Argentina.
- Solo Vonixx, venta a pedido (sin stock), precios en ARS.
- Deploy: Vercel (frontend) + Render (backend: carvex-api.onrender.com) + Neon (Postgres).
- Monorepo npm workspaces: frontend/ (React + Vite + TS + Tailwind + Zustand) y backend/ (Express + Prisma + PostgreSQL).
- Rama main, repo: https://github.com/nicocarp14/Carvex.git

## Estado general
- [x] Sprint 1: tienda pública (Home, Catálogo, Producto, Carrito, Cómo funciona).
- [x] Sprint 2: backend + pedidos (mock Mercado Pago).
- [x] Sprint 3: panel /admin (JWT, Dashboard, Pedidos, CRUD Productos/Categorías).
- [x] Keepalive de Render con GitHub Actions (cada 5 min) — .github/workflows/keepalive.yml existe y el workflow está activo en GitHub.
- [ ] Cerrar plan WhatsApp (ver abajo) y desplegar.

## Reglas absolutas
- NO tocar frontend/src/components/Header.tsx ni HeroBanner.tsx (el usuario los edita).
- NO agregar campo stock en ningún lado. Venta a pedido.
- Diseño azul oscurito #0a1628 / blanco. UI y comentarios en español argentino.
- Recordatorio: el usuario es de Argentina, ARS, WhatsApp.

## Último commit
61548c4 cambie el banner denuevo
(antes: 62d9531 keepalive de Render y mejoras de carga — ya pusheado a GitHub)

## TRABAJO ACTUAL: PLAN WHATSAPP (en curso, sin commitear)
El cambio principal: sacar Mercado Pago. El checkout ahora es solo:
- Nombre, Email, Teléfono + checkbox "Acepto la demora estimada a pedido"
- Botón verde "Pedir por WhatsApp"
- Al enviar: se crea el pedido en Neon como PENDIENTE y se abre WhatsApp con el mensaje armado.
- Número WhatsApp: 5493794949990 (formato internacional sin +).
- Pago y envío se coordinan en el chat, sin pagar de una.

### Archivos YA modificados (quedan en working tree, sin commitear)
1. frontend/src/lib/whatsapp.ts (nuevo) — buildWhatsAppMessage + openWhatsApp, default 5493794949990, se puede sobreescribir con VITE_WHATSAPP_NUMBER.
2. frontend/src/pages/Checkout.tsx — formulario solo Nombre/Email/Teléfono + checkbox. Botón "Pedir por WhatsApp" (verde, ícono oficial). Sin dirección, sin provincia, sin envío, sin Mercado Pago. En el success dice "¡Pedido #N registrado!" y explica que se abrió WhatsApp. Nota en el submit: "Al tocar el botón se crea el pedido y se abre WhatsApp".
3. frontend/src/lib/api.real.ts — CreateOrderPayload simplified (sin address/city/province/postalCode, sin fetchShipping, respuesta sin shipping).
4. frontend/src/lib/api.ts — sin fetchShipping.
5. frontend/src/types.ts — Order sin address/city/province/postalCode.
6. backend/src/orders.ts — validación y creación solo con nombre/email/teléfono/items, total = subtotal, sin shippingFor.
7. backend/src/index.ts — sin SHIPPING ni /api/shipping, POST /api/orders responde {order, subtotal, message} sin mock MP.
8. backend/prisma/schema.prisma — Order sin address/city/province/postalCode, paymentId pasa a "referencia de pago acordado por WhatsApp", PENDIENTE pasa a "pedido recibido por WhatsApp".
9. frontend/src/pages/Home.tsx — pasos 1 y 2 actualizados a "pedís por WhatsApp".
10. frontend/src/pages/HowItWorks.tsx — todo el texto sin Mercado Pago, con coordinación por WhatsApp.
11. frontend/src/pages/admin/AdminOrderDetail.tsx — sin sección Envío, nueva sección "Coordinación" (Canal: WhatsApp, Estado del pago: a coordinar, referencia si hay paymentId, transportista/seguimiento si existen). Subtotal del pedido + "Envío: A coordinar por WhatsApp".
12. frontend/src/pages/admin/AdminOrders.tsx — agregado teléfono en la celda del cliente.

### Documentado en KEEPALIVE.md (no tocar)
- El keepalive usa /api/health de Render. Si cambia la URL, actualizar KEEPALIVE.md, .github/workflows/keepalive.yml, scripts/keepalive.mjs, VITE_API_URL en Vercel y FRONTEND_URL en Render.

## PENDIENTES (orden sugerido)
1. **Variables de frontend**: crear frontend/.env y frontend/.env.example con (ejemplo):
   VITE_API_URL=https://carvex-api.onrender.com
   VITE_WHATSAPP_NUMBER=5493794949990
   (Recordatorio: en Vercel también hay que definir VITE_API_URL y VITE_WHATSAPP_NUMBER y redeployar.)
2. **Migración en Neon**: prisma migrate dev --name whatsapp-only (o db push si ya es migrationless). El schema cambió: se eliminan las 4 columnas address/city/province/postalCode de orders. OJO: en este entorno, la migración se trabó porque había procesos Node bloqueando Prisma (EPERM en node_modules/.prisma/client). Solución conocida: matar todos los node antes de migrar. `Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force`.
3. **Prisma generate** de nuevo con el schema nuevo.
4. **Levantar backend** (npm run dev:backend) y **frontend** (npm run dev:frontend).
5. **Probar el flujo completo en local**: crear pedido sin dirección → se crea en Neon como PENDIENTE (total = subtotal) → se abre WhatsApp al 5493794949990 con el mensaje armado (productos, subtotal, nombre, email, teléfono, nota de envío a coordinar).
6. **Probar admin /admin/pedidos y /admin/pedidos/:id** con el pedido nuevo.
7. **Commit y push a main**. Vercel redeploya solo.
8. **Verificar en producción**: https://carvexcorrientes.vercel.app — checkout por WhatsApp funciona y el pedido queda en Neon + en /admin.
9. **UptimeRobot**: el usuario lo dejó en 13 min. Recomendar 5 min (Render duerme a los 15).

## Comandos útiles
cd C:\Users\Usuario\Desktop\nico\carvex
npm run dev:backend      # backend en :4000
npm run dev:frontend     # frontend en :5173
npm run build            # build completo
npm run seed             # productos + admin (cuidado: pisa productos editados desde admin)
npm run keepalive        # ping manual a Render

## Acceso (si lo necesitás)
- Admin login: /admin/login
- Email: admin@carvex.com.ar
- Clave: carvex1234
- Backend: https://carvex-api.onrender.com/api/health da {"ok":true}

## Banners/imágenes (el usuario los edita)
- frontend/public/banner.jpg (3264×1018, ratio 3.21:1) — cambiar banner en HeroBanner.tsx a block h-auto w-full (ya aplicado, no romper).
- frontend/vite.config.ts tiene watch ignorando **/public/** para evitar EBUSY en Windows al editar banner.jpg. No sacar.