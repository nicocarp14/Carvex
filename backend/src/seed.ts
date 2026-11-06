import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { categories, products } from "./data/products.js";
import { hashPassword } from "./auth.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Carvex seed — cargando categorías y productos Vonixx...");

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    });
  }

  const cats = await prisma.category.findMany();
  const catBySlug = new Map<string, number>(cats.map((c: { slug: string; id: number }) => [c.slug, c.id]));

  for (const p of products) {
    const categoryId = catBySlug.get(p.categorySlug);
    if (!categoryId) throw new Error(`Categoría no encontrada: ${p.categorySlug}`);

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        categoryId,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        size: p.size,
        featured: p.featured ?? false,
        description: p.description,
        usage: p.usage,
        imageUrl: `/images/${p.slug}.jpg`,
      },
      create: {
        name: p.name,
        slug: p.slug,
        brand: "Vonixx",
        categoryId,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        size: p.size,
        featured: p.featured ?? false,
        description: p.description,
        usage: p.usage,
        imageUrl: `/images/${p.slug}.jpg`,
      },
    });
  }

  // Limpiar categorías legacy si quedaron vacías tras migrar a las nuevas (6)
  await prisma.category.deleteMany({
    where: { slug: { in: ["proteccion", "pulido"] }, products: { none: {} } },
  });

  const count = await prisma.product.count();
  console.log(`Seed OK — ${count} productos en la base.`);

  // Usuario administrador del panel (/admin).
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@carvex.com.ar").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "carvex1234";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: await hashPassword(adminPassword) },
    create: {
      email: adminEmail,
      password: await hashPassword(adminPassword),
      name: "Administrador Carvex",
    },
  });
  console.log(`Admin OK — ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
