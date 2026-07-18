import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET deve ser definido no arquivo de ambiente.");
}

export const env = {
  port: Number(process.env.PORT ?? 3333),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  rentalDurationDays: Number(process.env.RENTAL_DURATION_DAYS ?? 7),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173"
};
