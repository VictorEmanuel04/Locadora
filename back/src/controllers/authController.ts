import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";

function signToken(user: { id: string; role: UserRole }) {
  const expiresIn = env.jwtExpiresIn as SignOptions["expiresIn"];

  return jwt.sign({ role: user.role }, env.jwtSecret, {
    subject: user.id,
    expiresIn
  });
}

export async function register(request: Request, response: Response) {
  const { name, email, password } = request.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return response.status(409).json({ error: "E-mail ja cadastrado." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });

  return response.status(201).json({
    data: user,
    token: signToken(user)
  });
}

export async function login(request: Request, response: Response) {
  const { email, password } = request.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return response.status(401).json({ error: "Credenciais invalidas." });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return response.status(401).json({ error: "Credenciais invalidas." });
  }

  return response.json({
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token: signToken(user)
  });
}
