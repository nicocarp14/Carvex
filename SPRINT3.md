# Sprint 3 — Panel de administración

## Qué se agregó

**Backend (`backend/`)**
- `src/auth.ts` — hash bcrypt, JWT (7 días) y middleware `requireAuth`
- `src/admin.ts` — router con login + endpoints privados
- `POST /api/auth/login` — devuelve token y usuario
- `GET /api/auth/me` — valida la sesión
- `GET /api/admin/stats` — métricas del dashboard
- `GET /api/admin/orders` — pedidos con filtro por estado y búsqueda
- `GET /api/admin/orders/:id` — detalle
- `PATCH /api/admin/orders/:id` — estado, transportista, tracking y nota interna
- `GET|POST /api/admin/products` y `PUT|DELETE /api/admin/products/:id`
- `GET|POST /api/admin/categories` y `PUT|DELETE /api/admin/categories/:id`
- `src/seed.ts` — crea/actualiza el usuario admin

**Frontend (`frontend/`)**
- `src/store/auth.ts` — sesión en localStorage (Zustand)
- `src/lib/adminApi.ts` — cliente del panel con `Authorization: Bearer`
- `src/pages/admin/` — Login, Layout, Dashboard, Pedidos, Detalle de pedido, Productos, Categorías
- Rutas: `/admin/login`, `/admin`, `/admin/pedidos`, `/admin/pedidos/:id`, `/admin/productos`, `/admin/categorias`
- El header/footer público no se muestra dentro del panel

## Acceso

```txt
URL:      http://localhost:5173/admin/login
Email:    admin@carvex.com.ar
Password: carvex1234
```

Se pueden cambiar con `ADMIN_EMAIL` y `ADMIN_PASSWORD` antes de correr el seed.

## Variables de entorno

En `backend/.env` (desarrollo):

```env
JWT_SECRET=un-secreto-largo-y-aleatorio
ADMIN_EMAIL=admin@carvex.com.ar
ADMIN_PASSWORD=una-clave-segura
```

En Render (producción) solo hace falta `JWT_SECRET`.
`ADMIN_EMAIL` y `ADMIN_PASSWORD` se usan únicamente al correr el seed.
El seed ya se ejecutó contra la base de Neon, así que el admin existe en producción.

## Cómo crear el admin

```bash
npm run seed
```

El seed también vuelve a dejar los 25 productos Vonixx con sus datos originales.
Si ya editaste productos desde el panel, no corras el seed sin querer.

## Seguridad

- Las contraseñas se guardan con bcrypt (nunca en texto plano).
- El token vence a los 7 días.
- Si el backend responde 401, el frontend cierra la sesión automáticamente.
- Los endpoints públicos (`/api/products`, `/api/orders`, etc.) siguen sin token.
