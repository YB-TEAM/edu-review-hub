import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blog } from "@/infrastructure/database/entities/blog.entity";
import { BlogController } from "@/presentation/controllers/blog.controller";
import { BlogService } from "@/application/services/blog.service";
import { BlogRepository } from "@/infrastructure/database/repositories/blog.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  controllers: [BlogController],
  providers: [
    { provide: "IBlogService", useClass: BlogService },
    { provide: "IBlogRepository", useClass: BlogRepository },
  ],
  exports: [
    { provide: "IBlogService", useClass: BlogService },
    { provide: "IBlogRepository", useClass: BlogRepository },
  ],
})
export class BlogModule {}
