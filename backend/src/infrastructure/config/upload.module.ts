import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UploadController } from "@/presentation/controllers/upload.controller";
import { UploadService } from "@/application/services/upload.service";
import { CloudinaryService } from "@/infrastructure/services/cloudinary.service";
import { AuthModule } from "./auth.module";
import { JwtAuthGuard } from "@/presentation/guards/jwt-auth.guard";
import { PermissionGuard } from "@/presentation/guards/permission.guard";
import { UserActivity } from "@/infrastructure/database/entities/user-activity.entity";
import { UserActivityRepository } from "@/infrastructure/database/repositories/user-activity.repository";
import { UploadedFile } from "@/infrastructure/database/entities/uploaded-file.entity";
import { UploadedFileRepository } from "@/infrastructure/database/repositories/uploaded-file.repository";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserActivity, UploadedFile])],
  controllers: [UploadController],
  providers: [
    UploadService,
    CloudinaryService,
    JwtAuthGuard,
    PermissionGuard,
    UserActivityRepository,
    UploadedFileRepository,
    {
      provide: "IUploadService",
      useClass: UploadService,
    },
    {
      provide: "IUserActivityRepository",
      useClass: UserActivityRepository,
    },
    {
      provide: "IUploadedFileRepository",
      useClass: UploadedFileRepository,
    },
  ],
  exports: [
    UploadService,
    CloudinaryService,
    {
      provide: "IUploadService",
      useClass: UploadService,
    },
  ],
})
export class UploadModule {}
