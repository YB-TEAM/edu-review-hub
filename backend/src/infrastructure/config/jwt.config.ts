import { JwtModuleOptions } from "@nestjs/jwt";
import { config } from "dotenv";

config();

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || "your-super-secret-jwt-key-here",
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
};
