import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { createOrder, validateOrder, type CreateOrderInput } from "./orders.js";
import { adminRouter } from "./admin.js";
import { withProductVariants } from "./productVariants.js";

// En desarrollo, Neon CLI escribe las URLs en la raíz del monorepo.
// backend/.env tiene prioridad si existe (por ejemplo, en producción).
dotenv.config({ path: "../.env.local" });
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT ?? 4000);
const allowedOrigins = (process.env.FRONTEND_URL ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Sin Origin: health checks, curl y llamadas servidor-a-servidor.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origen no permitido por CORS"));
    },
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "carvex-api" }));

// El envío se coordina por WhatsApp, ya no hay cálculo por provincia.

app.get("/api/categories", async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

app.get("/api/products", async (req, res, next) => {
  try {
    const { category, featured, q } = req.query as Record<string, string | undefined>;
    const products = await prisma.product.findMany({
      where: {
        ...(category ? { category: { slug: category } } : {}),
        ...(featured === "true" ? { featured: true } : {}),
        ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] } : {}),
      },
      include: { category: true },
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    });
    res.json(products.map(withProductVariants));
  } catch (err) {
    next(err);
  }
});

app.get("/api/products/:slug", async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        // productos relacionados misma categoría
      },
    });
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    const related = await prisma.product.findMany({
      where: { categoryId: product.categoryId, slug: { not: product.slug } },
      include: { category: true },
      take: 4,
    });

    res.json({
      ...withProductVariants(product),
      related: related.map(withProductVariants),
    });
  } catch (err) {
    next(err);
  }
});

// Pedidos — creados desde el checkout y confirmados por WhatsApp
app.post("/api/orders", async (req, res, next) => {
  try {
    const input = req.body as CreateOrderInput;
    const errors = validateOrder(input);
    if (errors.length) return res.status(400).json({ error: errors.join(", ") });

    const { order, subtotal } = await createOrder(prisma, input);

    return res.status(201).json({
      order,
      subtotal,
      message: "Pedido registrado. Coordinamos pago y envío por WhatsApp.",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error al crear pedido";
    return res.status(400).json({ error: msg });
  }
});

app.get("/api/orders/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "ID inválido" });
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });
    if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: withProductVariants(item.product),
      })),
    });
  } catch (err) {
    next(err);
  }
});

// Panel admin — auth + /admin/* (protegido con JWT)
app.use("/api", adminRouter(prisma));

// Error handler simple
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Error interno" });
});

app.listen(PORT, () => console.log(`Carvex API en http://localhost:${PORT}`));
