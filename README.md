# Carvex

Ecommerce de productos **Vonixx** para comercios y entusiastas del detailing. Argentina, precios en ARS, pagos con **Mercado Pago**, venta **100% online y a pedido** (sin stock físico: el pedido se compra al proveedor tras la confirmación del pago).

## Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS + React Router + Zustand
- **Backend:** Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Pagos:** Mercado Pago Checkout Pro (Sprint 2)
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

No hay inventario. Flujo: cliente paga -> pedido `PENDIENTE` -> admin confirma con el distribuidor -> `PREPARANDO` -> `ENVIADO` (con tracking) -> `ENTREGADO`. La ficha muestra "Venta a pedido · Demora estimada: 3-7 días hábiles".

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

- **Sprint 4:** Mercado Pago real (hoy es demo)
- **Sprint 5:** Fotos reales, SEO, analytics
