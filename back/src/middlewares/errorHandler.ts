import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error(error);

  const prismaError = error as { code?: string; statusCode?: number; message?: string };
  const statusCode = prismaError.code === "P2025" ? 404 : Number(prismaError.statusCode ?? 500);
  const message = statusCode === 500 ? "Erro interno do servidor." : error.message;

  response.status(statusCode).json({
    error: message
  });
};
