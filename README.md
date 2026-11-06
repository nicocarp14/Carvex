# Carvex

Ecommerce de productos **Vonixx** para comercios y entusiastas del detailing en Argentina. Precios en ARS, venta **100% online y a pedido** (sin stock físico: el pedido se compra al proveedor tras coordinarlo por WhatsApp).

## Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS + React Router + Zustand
- **Backend:** Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Checkout:** WhatsApp (se crea el pedido en Neon y se abre el chat con el detalle; pago y envío se coordinan ahí)
- **Diseño:** azul oscurito (`#0a1628` / `#0d1b2e`) y blanco, acento azul eléctrico

## Monorepo

```
carvex/
  frontend/   # Tienda pública + panel /admin
  backend/    # API REST + Prisma
```

## Sprint 1 (este commit)

- Base del monorepo y sistema de diseño azul/blanco
- Home, Catálogo con filtros, Ficha de producto, Carrito (Zustand + localStorage)
- Catálogo seed de 25 productos Vonixx reales con descripción + modo de uso
- Backend: modelo Prisma **sin `stock`** (venta a pedido), endpoint `GET /api/products`, seed reutilizable

## Cómo correr

```bash
# Frontend
npm install
npm run dev:frontend        # http://localhost:5173

# Backend (requiere DATABASE_URL en backend/.env)
npm run dev:backend         # http://localhost:4000
npm run seed                # carga los 25 Vonixx
```

## Modelo a pedido

No hay inventario. Flujo: cliente pide por WhatsApp -> pedido `PENDIENTE` -> admin confirma con el distribuidor -> `PREPARANDO` -> `ENVIADO` (con tracking) -> `ENTREGADO`. La ficha muestra "Venta a pedido · Demora estimada: 3-7 días hábiles". Un producto puede tener varios tamaños en una sola card; el precio de la card es el más bajo ("Desde").

## Deploy

- **Frontend:** Vercel (`VITE_API_URL` apunta al backend)
- **Backend:** Render (`FRONTEND_URL`, `DATABASE_URL`, `JWT_SECRET`)
- **Base:** Neon Postgres

Render free duerme el backend a los 15 minutos. El repo incluye un keepalive
automático para evitarlo: ver [`KEEPALIVE.md`](./KEEPALIVE.md).

## Panel admin

- URL: `/admin/login`
- Usuario: se crea con `npm run seed` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`)
- Detalle: ver [`SPRINT3.md`](./SPRINT3.md)

## Próximos sprints

- **Sprint 4:** Recrear los 5 productos con las fotos de `frontend/public/productos/` (Alumax con 2-3 tamaños en 1 producto, resto con 1 tamaño)
- **Sprint 5:** SEO, analytics

## Seguridad (IMPORTANTE)

El repo antes contenía un `CONTEXT.md` con credenciales. Ya se sacó del repo y de `.gitignore`, pero **el historial de Git lo conserva** en commits viejos (repo público). Por eso hay que rotar:

1. **Cambiar `ADMIN_PASSWORD`**: en `backend/.env` local poner una clave nueva y correr `npm run seed`. En Render, cambiar `ADMIN_PASSWORD` y redeployar.
2. **Cambiar `JWT_SECRET`**: generar uno largo y aleatorio, ponerlo en Render (`JWT_SECRET`) y en local si lo usás. Al cambiarlo se invalidan todas las sesiones del panel.
3. **Variables en producción**: `ADMIN_EMAIL` / `ADMIN_PASSWORD` solo se usan al correr el seed. `JWT_SECRET` es lo que firma los tokens del panel.

No commitees archivos con credenciales (`CONTEXT.md`, `.env`, `.env.local`).
