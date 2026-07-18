import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { env } from "../config/env.js";

type JwtPayload = {
  sub: string;
  role: UserRole;
};

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ error: "Token nao informado." });
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return response.status(401).json({ error: "Formato de token inválido." });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
    request.user = {
      id: decoded.sub,
      role: decoded.role
    };

    return next();
  } catch {
    return response.status(401).json({ error: "Token invalido ou expirado." });
  }
}

export function ensureAdmin(request: Request, response: Response, next: NextFunction) {
  if (request.user?.role !== UserRole.ADMIN) {
    return response.status(403).json({ error: "Acesso restrito a administradores." });
  }

  return next();
}
