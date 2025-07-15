import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "@/infrastructure/config/auth.module";
import { databaseConfig } from "@/infrastructure/config/database.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
  ],
})
export class AppModule {}
