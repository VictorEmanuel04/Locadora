import type { Request, Response } from "express";
import { authenticateUser, registerUser } from "../services/authService.js";
import { isServiceError } from "../services/serviceError.js";

export async function register(request: Request, response: Response) {
  const { name, email, password } = request.body;

  try {
    const result = await registerUser({ name, email, password });
    return response.status(201).json({ data: result.user, token: result.token });
  } catch (error) {
    if (isServiceError(error) && error.code === "EMAIL_ALREADY_REGISTERED") {
      return response.status(409).json({ error: error.message });
    }
    throw error;
  }
}

export async function login(request: Request, response: Response) {
  const { email, password } = request.body;

  try {
    const result = await authenticateUser({ email, password });
    return response.json({ data: result.user, token: result.token });
  } catch (error) {
    if (isServiceError(error) && error.code === "INVALID_CREDENTIALS") {
      return response.status(401).json({ error: error.message });
    }
    throw error;
  }
}
