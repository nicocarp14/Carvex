import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { categories, products } from "./data/products.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Carvex seed — cargando categorías y productos Vonixx...");

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
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

  const count = await prisma.product.count();
  console.log(`Seed OK — ${count} productos en la base.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
