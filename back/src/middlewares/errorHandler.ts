import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error(error);

  const statusCode = Number(error.statusCode ?? 500);
  const message = statusCode === 500 ? "Erro interno do servidor." : error.message;

  response.status(statusCode).json({
    error: message
  });
};
