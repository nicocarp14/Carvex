import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export type AdminPayload = { sub: number; email: string };

const TOKEN_TTL = "7d";

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.length >= 16) return secret;

  // En producción, si falta el secreto, se genera uno por proceso:
  // las sesiones se invalidan al reiniciar. Configurá JWT_SECRET en Render.
  if (!globalThis.__carvexJwtSecret) {
    globalThis.__carvexJwtSecret = crypto.randomUUID() + crypto.randomUUID();
    console.warn(
      "[auth] JWT_SECRET no configurado. Se usa un secreto temporal; las sesiones expiran al reiniciar.",
    );
  }
  return globalThis.__carvexJwtSecret;
}

declare global {
  // eslint-disable-next-line no-var
  var __carvexJwtSecret: string | undefined;
}

export const hashPassword = (plain: string) => bcrypt.hash(plain, 10);
export const verifyPassword = (plain: string, hash: string) => bcrypt.compare(plain, hash);

export const signToken = (payload: AdminPayload) =>
  jwt.sign(payload, getSecret(), { expiresIn: TOKEN_TTL });

export const verifyToken = (token: string): AdminPayload | null => {
  try {
    const decoded = jwt.verify(token, getSecret());
    if (typeof decoded === "string" || typeof decoded.sub !== "number") return null;
    return { sub: decoded.sub, email: String(decoded.email ?? "") };
  } catch {
    return null;
  }
};

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Token requerido" });

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: "Sesión inválida o expirada" });

  (req as Request & { admin?: AdminPayload }).admin = payload;
  next();
}

export async function findAdminByEmail(prisma: PrismaClient, email: string) {
  return prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
}
