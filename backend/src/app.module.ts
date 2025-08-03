import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "@/infrastructure/config/auth.module";
import { databaseConfig } from "@/infrastructure/config/database.config";
import { UniversityModule } from "@/infrastructure/config/university.module";
import { UniversityReviewModule } from "@/infrastructure/config/university-review.module";
import { UniversityReviewCriterionModule } from "@/infrastructure/config/university-review-criterion.module";
import { BlogModule } from "@/infrastructure/config/blog.module";
import { UploadModule } from "@/infrastructure/config/upload.module";
import { DashboardModule } from "@/infrastructure/config/dashboard.module";
import { SystemManagementModule } from "@/infrastructure/config/system-management.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    UniversityModule,
    UniversityReviewModule,
    UniversityReviewCriterionModule,
    BlogModule,
    UploadModule,
    DashboardModule,
    SystemManagementModule,
  ],
})
export class AppModule {}
