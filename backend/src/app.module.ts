import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommandRunnerModule } from "nest-commander";

import { AuthModule } from "@/infrastructure/config/auth.module";
import { databaseConfig } from "@/infrastructure/config/database.config";
import { UniversityModule } from "@/infrastructure/config/university.module";
import { UniversityReviewModule } from "@/infrastructure/config/university-review.module";
import { UniversityReviewCriterionModule } from "@/infrastructure/config/university-review-criterion.module";
import { BlogModule } from "@/infrastructure/config/blog.module";
import { UploadModule } from "@/infrastructure/config/upload.module";
import { DashboardModule } from "@/infrastructure/config/dashboard.module";
import { SystemManagementModule } from "@/infrastructure/config/system-management.module";
import { HealthController } from "@/presentation/controllers/health.controller";
import { CleanupOrphanedImagesCommand } from "@/infrastructure/commands/cleanup-orphaned-images.command";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRoot(databaseConfig),
    CommandRunnerModule,
    AuthModule,
    UniversityModule,
    UniversityReviewModule,
    UniversityReviewCriterionModule,
    BlogModule,
    UploadModule,
    DashboardModule,
    SystemManagementModule,
  ],
  controllers: [HealthController],
  providers: [CleanupOrphanedImagesCommand],
})
export class AppModule {}
