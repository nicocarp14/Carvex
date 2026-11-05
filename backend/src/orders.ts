import type { PrismaClient } from "@prisma/client";
import { getProductVariants } from "./productVariants.js";

// Pedidos por WhatsApp: solo datos de contacto, sin dirección ni envío.
// El pago y el envío se coordinan con el cliente en el chat.

export type CreateOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{ slug: string; variantId?: string; qty: number }>;
};

export function validateOrder(input: Partial<CreateOrderInput>): string[] {
  const errors: string[] = [];
  if (!input.customerName?.trim()) errors.push("customerName es requerido");
  if (!input.customerEmail?.includes("@")) errors.push("customerEmail inválido");
  if (!input.customerPhone?.trim()) errors.push("customerPhone es requerido");
  if (!Array.isArray(input.items) || input.items.length === 0)
    errors.push("Al menos un producto es requerido");
  if (
    input.items?.some(
      (i) =>
        !i.slug ||
        !Number.isInteger(i.qty) ||
        i.qty < 1 ||
        (i.variantId !== undefined && typeof i.variantId !== "string"),
    )
  )
    errors.push("Cada ítem debe tener slug y qty >= 1");

  return errors;
}

export async function createOrder(prisma: PrismaClient, input: CreateOrderInput) {
  const slugs = [...new Set(input.items.map((i) => i.slug))];
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    include: { category: true },
  });

  if (products.length !== slugs.length) {
    throw new Error("Alguno de los productos no existe");
  }

  const bySlug = new Map(products.map((product) => [product.slug, product]));

  const selectedItems = input.items.map((item) => {
    const product = bySlug.get(item.slug);
    if (!product) throw new Error(`Producto no encontrado: ${item.slug}`);
    const variants = getProductVariants(product);
    const variant = item.variantId
      ? variants.find((candidate) => candidate.id === item.variantId)
      : variants[0];
    if (!variant) throw new Error(`Presentación no encontrada para ${product.name}`);
    return { product, variant, quantity: item.qty };
  });

  // Sin envío calculado: el total es la suma de las presentaciones elegidas.
  const subtotal = selectedItems.reduce(
    (acc, item) => acc + item.variant.price * item.quantity,
    0,
  );
  const total = subtotal;

  const order = await prisma.order.create({
    data: {
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      total,
      status: "PENDIENTE",
      items: {
        create: selectedItems.map(({ product, variant, quantity }) => ({
          productId: product.id,
          quantity,
          price: variant.price,
          variantSize: variant.size || null,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  return { order, subtotal };
}
