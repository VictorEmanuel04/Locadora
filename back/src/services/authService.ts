import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { ServiceError } from "./serviceError.js";

type Credentials = {
  email: string;
  password: string;
};

type RegistrationData = Credentials & {
  name: string;
};

function signToken(user: { id: string; role: UserRole }) {
  const expiresIn = env.jwtExpiresIn as SignOptions["expiresIn"];

  return jwt.sign({ role: user.role }, env.jwtSecret, {
    subject: user.id,
    expiresIn
  });
}

export async function registerUser({ name, email, password }: RegistrationData) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ServiceError("EMAIL_ALREADY_REGISTERED", "E-mail ja cadastrado.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: { id: true, name: true, email: true, role: true }
  });

  return { user, token: signToken(user) };
}

export async function authenticateUser({ email, password }: Credentials) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ServiceError("INVALID_CREDENTIALS", "Credenciais invalidas.");
  }

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token: signToken(user)
  };
}
