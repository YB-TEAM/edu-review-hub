import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blog } from "@/infrastructure/database/entities/blog.entity";
import { Tag } from "@/infrastructure/database/entities/tag.entity";
import { BlogLike } from "@/infrastructure/database/entities/blog-like.entity";

import { BlogController } from "@/presentation/controllers/blog.controller";
import { TagController } from "@/presentation/controllers/tag.controller";
import { ActivityController } from "@/presentation/controllers/activity.controller";
import { DeviceController } from "@/presentation/controllers/device.controller";
import { BlogService } from "@/application/services/blog.service";
import { TagService } from "@/application/services/tag.service";
import { BlogRepository } from "@/infrastructure/database/repositories/blog.repository";
import { TagRepository } from "@/infrastructure/database/repositories/tag.repository";
import { BlogLikeRepository } from "@/infrastructure/database/repositories/blog-like.repository";

import { AuthModule } from "./auth.module";
import { CloudinaryService } from "@/infrastructure/services/cloudinary.service";

@Module({
  imports: [TypeOrmModule.forFeature([Blog, Tag, BlogLike]), AuthModule],
  controllers: [
    BlogController,
    TagController,
    ActivityController,
    DeviceController,
  ],
  providers: [
    { provide: "IBlogService", useClass: BlogService },
    { provide: "IBlogRepository", useClass: BlogRepository },
    { provide: "ITagService", useClass: TagService },
    { provide: "ITagRepository", useClass: TagRepository },
    BlogLikeRepository,
    CloudinaryService,
  ],
  exports: [
    { provide: "IBlogService", useClass: BlogService },
    { provide: "IBlogRepository", useClass: BlogRepository },
    { provide: "ITagService", useClass: TagService },
    { provide: "ITagRepository", useClass: TagRepository },
  ],
})
export class BlogModule {}
