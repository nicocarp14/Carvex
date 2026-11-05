import type { PrismaClient } from "@prisma/client";

// Pedidos por WhatsApp: solo datos de contacto, sin dirección ni envío.
// El pago y el envío se coordinan con el cliente en el chat.

export type CreateOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{ slug: string; qty: number }>;
};

export function validateOrder(input: Partial<CreateOrderInput>): string[] {
  const errors: string[] = [];
  if (!input.customerName?.trim()) errors.push("customerName es requerido");
  if (!input.customerEmail?.includes("@")) errors.push("customerEmail inválido");
  if (!input.customerPhone?.trim()) errors.push("customerPhone es requerido");
  if (!Array.isArray(input.items) || input.items.length === 0)
    errors.push("Al menos un producto es requerido");
  if (input.items?.some((i) => !i.slug || !(i.qty >= 1)))
    errors.push("Cada ítem debe tener slug y qty >= 1");

  return errors;
}

export async function createOrder(prisma: PrismaClient, input: CreateOrderInput) {
  const slugs = input.items.map((i) => i.slug);
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    include: { category: true },
  });

  if (products.length !== slugs.length) {
    throw new Error("Alguno de los productos no existe");
  }

  const bySlug = new Map<string, { id: number; slug: string; price: number }>(
    products.map((p: { id: number; slug: string; price: number }) => [p.slug, p]),
  );

  // Sin envío calculado: el total es el subtotal.
  // Pago y envío se coordinan por WhatsApp.
  const subtotal = input.items.reduce((acc: number, it: { slug: string; qty: number }) => {
    const p = bySlug.get(it.slug);
    if (!p) throw new Error(`Producto no encontrado: ${it.slug}`);
    return acc + p.price * it.qty;
  }, 0);
  const total = subtotal;

  const order = await prisma.order.create({
    data: {
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      total,
      status: "PENDIENTE",
      items: {
        create: input.items.map((it: { slug: string; qty: number }) => {
          const p = bySlug.get(it.slug)!;
          return { productId: p.id, quantity: it.qty, price: p.price };
        }),
      },
    },
    include: { items: { include: { product: true } } },
  });

  return { order, subtotal };
}
