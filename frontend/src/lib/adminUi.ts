import type { OrderStatus } from "../types";

export const ORDER_STATUSES: OrderStatus[] = [
  "PENDIENTE",
  "CONFIRMADO",
  "PREPARANDO",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
];

export const statusLabel: Record<OrderStatus, string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  PREPARANDO: "Preparando",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export const statusClasses: Record<OrderStatus, string> = {
  PENDIENTE: "bg-amber-100 text-amber-800",
  CONFIRMADO: "bg-blue-100 text-blue-800",
  PREPARANDO: "bg-indigo-100 text-indigo-800",
  ENVIADO: "bg-cyan-100 text-cyan-800",
  ENTREGADO: "bg-emerald-100 text-emerald-800",
  CANCELADO: "bg-rose-100 text-rose-800",
};

export const formatDate = (value: string) =>
  new Date(value).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
