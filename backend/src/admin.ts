import { Router } from "express";
import type { PrismaClient, OrderStatus } from "@prisma/client";
import { findAdminByEmail, requireAuth, signToken, verifyPassword } from "./auth.js";

const ORDER_STATUSES = [
  "PENDIENTE",
  "CONFIRMADO",
  "PREPARANDO",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
] as const;

export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const isPositiveInt = (n: unknown): n is number =>
  typeof n === "number" && Number.isInteger(n) && n > 0;

export function adminRouter(prisma: PrismaClient) {
  const router = Router();

  // ---------- Auth ----------
  router.post("/auth/login", async (req, res, next) => {
    try {
      const { email, password } = (req.body ?? {}) as { email?: string; password?: string };
      if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña son requeridos" });
      }

      const user = await findAdminByEmail(prisma, email);
      if (!user || !(await verifyPassword(password, user.password))) {
        return res.status(401).json({ error: "Credenciales incorrectas" });
      }

      const token = signToken({ sub: user.id, email: user.email });
      return res.json({
        token,
        user: { id: user.id, email: user.email, name: user.name },
      });
    } catch (err) {
      next(err);
    }
  });

  router.get("/auth/me", requireAuth, async (req, res, next) => {
    try {
      const admin = (req as typeof req & { admin: { sub: number } }).admin;
      const user = await prisma.user.findUnique({
        where: { id: admin.sub },
        select: { id: true, email: true, name: true },
      });
      if (!user) return res.status(401).json({ error: "Usuario no encontrado" });
      res.json({ user });
    } catch (err) {
      next(err);
    }
  });

  // A partir de acá, todo /admin requiere token.
  // Se limita la ruta para no bloquear endpoints públicos que pasen por este router.
  router.use("/admin", requireAuth);

  // ---------- Dashboard ----------
  router.get("/admin/stats", async (_req, res, next) => {
    try {
      const [pending, inProgress, delivered, cancelled, revenue, totalOrders, products] =
        await Promise.all([
          prisma.order.count({ where: { status: "PENDIENTE" } }),
          prisma.order.count({ where: { status: { in: ["CONFIRMADO", "PREPARANDO"] } } }),
          prisma.order.count({ where: { status: "ENVIADO" } }),
          prisma.order.count({ where: { status: "CANCELADO" } }),
          prisma.order.aggregate({
            where: { status: { not: "CANCELADO" } },
            _sum: { total: true },
          }),
          prisma.order.count(),
          prisma.product.count(),
        ]);

      res.json({
        pending,
        inProgress,
        shipped: delivered,
        cancelled,
        revenue: revenue._sum.total ?? 0,
        totalOrders,
        products,
      });
    } catch (err) {
      next(err);
    }
  });

  // ---------- Pedidos ----------
  router.get("/admin/orders", async (req, res, next) => {
    try {
      const { status, q } = req.query as Record<string, string | undefined>;
      const where: Record<string, unknown> = {};

      if (status && (ORDER_STATUSES as readonly string[]).includes(status)) {
        where.status = status;
      }
      if (q?.trim()) {
        const term = q.trim();
        where.OR = [
          { customerName: { contains: term, mode: "insensitive" } },
          { customerEmail: { contains: term, mode: "insensitive" } },
          { customerPhone: { contains: term, mode: "insensitive" } },
        ];
      }

      const orders = await prisma.order.findMany({
        where,
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
        take: 200,
      });

      res.json(orders);
    } catch (err) {
      next(err);
    }
  });

  router.get("/admin/orders/:id", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!isPositiveInt(id)) return res.status(400).json({ error: "ID inválido" });

      const order = await prisma.order.findUnique({
        where: { id },
        include: { items: { include: { product: true } } },
      });
      if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
      res.json(order);
    } catch (err) {
      next(err);
    }
  });

  router.patch("/admin/orders/:id", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!isPositiveInt(id)) return res.status(400).json({ error: "ID inválido" });

      const { status, trackingCode, carrier, notes } = (req.body ?? {}) as {
        status?: string;
        trackingCode?: string | null;
        carrier?: string | null;
        notes?: string | null;
      };

      if (status && !(ORDER_STATUSES as readonly string[]).includes(status)) {
        return res.status(400).json({ error: "Estado inválido" });
      }

      const order = await prisma.order.update({
        where: { id },
        data: {
          ...(status ? { status: status as OrderStatus } : {}),
          ...(trackingCode !== undefined ? { trackingCode: trackingCode || null } : {}),
          ...(carrier !== undefined ? { carrier: carrier || null } : {}),
          ...(notes !== undefined ? { notes: notes || null } : {}),
        },
        include: { items: { include: { product: true } } },
      });

      res.json(order);
    } catch (err) {
      next(err);
    }
  });

  // ---------- Productos ----------
  router.get("/admin/products", async (_req, res, next) => {
    try {
      const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { name: "asc" },
      });
      res.json(products);
    } catch (err) {
      next(err);
    }
  });

  const parseProduct = (body: Record<string, unknown>) => {
    const name = String(body.name ?? "").trim();
    const price = Number(body.price);
    const categoryId = Number(body.categoryId);
    const description = String(body.description ?? "").trim();
    const usage = String(body.usage ?? "").trim();
    const errors: string[] = [];

    if (name.length < 2) errors.push("El nombre es obligatorio");
    if (!Number.isInteger(price) || price <= 0) errors.push("El precio debe ser un entero mayor a 0");
    if (!isPositiveInt(categoryId)) errors.push("La categoría es obligatoria");
    if (!description) errors.push("La descripción es obligatoria");
    if (!usage) errors.push("El modo de uso es obligatorio");

    const originalPriceRaw = body.originalPrice;
    const originalPrice =
      originalPriceRaw === null || originalPriceRaw === undefined || originalPriceRaw === ""
        ? null
        : Number(originalPriceRaw);

    if (originalPrice !== null && (!Number.isInteger(originalPrice) || originalPrice <= 0)) {
      errors.push("El precio anterior debe ser un entero mayor a 0");
    }

    return {
      errors,
      data: {
        name,
        price,
        originalPrice,
        categoryId,
        description,
        usage,
        size: body.size ? String(body.size).trim() || null : null,
        imageUrl: body.imageUrl ? String(body.imageUrl).trim() : "",
        featured: Boolean(body.featured),
      },
    };
  };

  router.post("/admin/products", async (req, res, next) => {
    try {
      const { errors, data } = parseProduct((req.body ?? {}) as Record<string, unknown>);
      if (errors.length) return res.status(400).json({ error: errors.join(". ") });

      const slug = String((req.body as Record<string, unknown>).slug ?? "").trim() || slugify(data.name);
      const exists = await prisma.product.findUnique({ where: { slug } });
      if (exists) return res.status(409).json({ error: "Ya existe un producto con ese nombre/slug" });

      const product = await prisma.product.create({
        data: { ...data, slug, brand: "Vonixx", imageUrl: data.imageUrl || `/images/${slug}.jpg` },
        include: { category: true },
      });

      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  });

  router.put("/admin/products/:id", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!isPositiveInt(id)) return res.status(400).json({ error: "ID inválido" });

      const { errors, data } = parseProduct((req.body ?? {}) as Record<string, unknown>);
      if (errors.length) return res.status(400).json({ error: errors.join(". ") });

      const current = await prisma.product.findUnique({ where: { id } });
      if (!current) return res.status(404).json({ error: "Producto no encontrado" });

      const slug = String((req.body as Record<string, unknown>).slug ?? "").trim() || current.slug;

      const conflict = await prisma.product.findFirst({
        where: { slug, id: { not: id } },
      });
      if (conflict) return res.status(409).json({ error: "Ya existe otro producto con ese slug" });

      const product = await prisma.product.update({
        where: { id },
        data: {
          ...data,
          slug,
          imageUrl: data.imageUrl || `/images/${slug}.jpg`,
        },
        include: { category: true },
      });

      res.json(product);
    } catch (err) {
      next(err);
    }
  });

  router.delete("/admin/products/:id", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!isPositiveInt(id)) return res.status(400).json({ error: "ID inválido" });

      const used = await prisma.orderItem.count({ where: { productId: id } });
      if (used > 0) {
        return res.status(409).json({
          error: "No se puede borrar: el producto aparece en pedidos existentes. Editá sus datos en su lugar.",
        });
      }

      await prisma.product.delete({ where: { id } });
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  // ---------- Categorías ----------
  router.get("/admin/categories", async (_req, res, next) => {
    try {
      const categories = await prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" },
      });
      res.json(categories);
    } catch (err) {
      next(err);
    }
  });

  router.post("/admin/categories", async (req, res, next) => {
    try {
      const name = String((req.body ?? {}).name ?? "").trim();
      if (name.length < 2) return res.status(400).json({ error: "El nombre es obligatorio" });

      const slug = String((req.body as Record<string, unknown>).slug ?? "").trim() || slugify(name);

      const conflict = await prisma.category.findFirst({
        where: { OR: [{ name }, { slug }] },
      });
      if (conflict) {
        return res.status(409).json({ error: "Ya existe una categoría con ese nombre o slug" });
      }

      const category = await prisma.category.create({ data: { name, slug } });
      res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  });

  router.put("/admin/categories/:id", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!isPositiveInt(id)) return res.status(400).json({ error: "ID inválido" });

      const name = String((req.body ?? {}).name ?? "").trim();
      if (name.length < 2) return res.status(400).json({ error: "El nombre es obligatorio" });

      const current = await prisma.category.findUnique({ where: { id } });
      if (!current) return res.status(404).json({ error: "Categoría no encontrada" });

      const slug = String((req.body as Record<string, unknown>).slug ?? "").trim() || current.slug;

      const conflict = await prisma.category.findFirst({
        where: { id: { not: id }, OR: [{ name }, { slug }] },
      });
      if (conflict) {
        return res.status(409).json({ error: "Ya existe otra categoría con ese nombre o slug" });
      }

      const category = await prisma.category.update({ where: { id }, data: { name, slug } });
      res.json(category);
    } catch (err) {
      next(err);
    }
  });

  router.delete("/admin/categories/:id", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!isPositiveInt(id)) return res.status(400).json({ error: "ID inválido" });

      const count = await prisma.product.count({ where: { categoryId: id } });
      if (count > 0) {
        return res.status(409).json({
          error: `No se puede borrar: tiene ${count} producto(s) asociado(s).`,
        });
      }

      await prisma.category.delete({ where: { id } });
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
