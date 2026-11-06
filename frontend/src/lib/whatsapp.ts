import type { CartItem } from "../types";

// Número de WhatsApp de Carvex (formato internacional sin +, ej: 5491123456789).
// Se puede sobreescribir con VITE_WHATSAPP_NUMBER en Vercel.
const WHATSAPP_NUMBER =
  (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? "5493794949990";

export const buildWhatsAppMessage = (opts: {
  items: CartItem[];
  subtotal: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderId: number;
}) => {
  const { items, subtotal, customerName, customerEmail, customerPhone, orderId } = opts;

  const lines: string[] = [];
  lines.push(`Hola Carvex, quiero hacer un pedido (Nº ${orderId}):`);
  lines.push("");
  lines.push("Productos:");
  for (const { product, variant, qty } of items) {
    const price = variant.price * qty;
    const size = variant.size ? ` (${variant.size})` : "";
    lines.push(`• ${qty}x ${product.name}${size} — $${price.toLocaleString("es-AR")}`);
  }
  lines.push("");
  lines.push(`Subtotal: $${subtotal.toLocaleString("es-AR")}`);
  lines.push(`Total: $${subtotal.toLocaleString("es-AR")}`);
  lines.push("");
  lines.push("Mis datos:");
  lines.push(`Nombre: ${customerName}`);
  lines.push(`Email: ${customerEmail}`);
  lines.push(`Teléfono: ${customerPhone}`);
  lines.push("");
  return lines.join("\n");
};

export const buildWhatsAppUrl = (message: string) => {
  const number = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};
