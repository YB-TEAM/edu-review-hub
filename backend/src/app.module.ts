import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "@/infrastructure/config/auth.module";
import { databaseConfig } from "@/infrastructure/config/database.config";
import { UniversityModule } from "@/infrastructure/config/university.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    UniversityModule,
  ],
})
export class AppModule {}
