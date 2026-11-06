-- Pedidos por WhatsApp: sin dirección ni envío automático.
-- El pago y el envío se coordinan en el chat.
ALTER TABLE "Order" DROP COLUMN IF EXISTS address;
ALTER TABLE "Order" DROP COLUMN IF EXISTS city;
ALTER TABLE "Order" DROP COLUMN IF EXISTS province;
ALTER TABLE "Order" DROP COLUMN IF EXISTS "postalCode";
