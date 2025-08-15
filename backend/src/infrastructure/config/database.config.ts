import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { config } from "dotenv";

config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "edu_review_hub",
  entities: ["dist/infrastructure/database/entities/**/*.entity.js"],
  migrations: ["dist/infrastructure/database/migrations/**/*.js"],
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  autoLoadEntities: true,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : false,
  extra: {
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            rejectUnauthorized: false,
          }
        : false,
  },
};
