import type { Request, Response } from "express";

export function healthCheck(_request: Request, response: Response) {
  return response.json({
    status: "ok",
    service: "CineLoc API"
  });
}
