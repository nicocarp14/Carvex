# Sprint 2 — Backend real + Pedidos + Checkout

## Qué se agregó

**Backend (`backend/`)**
- `GET /api/shipping` — cálculo de envío por provincia
- `POST /api/orders` — crea pedido + ítems con snapshot de precio, valida datos (sin stock, a pedido)
- `GET /api/orders/:id` — detalle de pedido
- `src/shipping.ts` — tabla de envío AR (CABA $3.500 → Tierra del Fuego $11.000)
- `src/orders.ts` — validación y creación transaccional de pedidos

**Frontend (`frontend/`)**
- `src/lib/api.real.ts` — cliente real a `/api` (sin fallback obligatorio)
- `src/lib/api.ts` — intenta real y cae a fallback local si el backend no está levantado (útil en dev)
- `src/pages/Checkout.tsx` — formulario completo, select de provincia, cálculo en vivo, aceptación "a pedido", pago Mercado Pago mock
- `src/pages/Cart.tsx` — botón "Ir a pagar" → `/checkout`

## Cómo probarlo

### 1. Base de datos gratis en Neon (5 min)

1. Andá a https://neon.tech → **Create Project** → `carvex` → Region US East
2. Copiá el *Connection string*
3. Creá `backend/.env`:

```env
DATABASE_URL="postgresql://usuario:pass@ep-xxxx.us-east-2.aws.neon.tech/carvex?sslmode=require"
PORT=4000
FRONTEND_URL=http://localhost:5173
```

### 2. Migrar + seed

```bash
npm --prefix backend run prisma:push
npm --prefix backend run seed
# o: npm --prefix backend run prisma:migrate
```

Eso carga los **25 productos Vonixx** en la DB.

### 3. Levantar todo

```bash
# Terminal 1
npm run dev:backend   # http://localhost:4000

# Terminal 2
npm run dev:frontend  # http://localhost:5173
```

Flujo de prueba:
1. `/catalogo` → agregás productos (ya vienen de la DB)
2. `/carrito` → **Ir a pagar**
3. `/checkout` → completás datos, elegís provincia (se calcula el envío), aceptás a pedido, **Pagar con Mercado Pago** (mock) → Pedido # creado

## Próximos pasos (Sprint 3)

- Panel `/admin` con login JWT
- CRUD productos/categorías (agregar Vonixx nuevo)
- Gestión de pedidos: cambiar estado (Pendiente → Confirmado → Preparando → Enviado + tracking)
- Mercado Pago real: crear preferencia + webhook
