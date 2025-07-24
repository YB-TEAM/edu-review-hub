import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
  Inject,
} from "@nestjs/common";
import { JwtAuthGuard } from "@/presentation/guards/jwt-auth.guard";
import { RolesGuard } from "@/presentation/guards/role.guard";
import { Roles } from "@/presentation/decorators/roles.decorator";
import { RequirePermissions } from "@/presentation/decorators/permissions.decorator";
import { UserRole } from "@/infrastructure/database/entities/user.entity";
import { IBlogService } from "@/application/services/blog.service.interface";
import { CreateBlogDto } from "@/application/dto/blog/create-blog.dto";
import { UpdateBlogDto } from "@/application/dto/blog/update-blog.dto";
import { BlogResponseDto } from "@/application/dto/blog/blog-response.dto";
import { ModerateBlogDto } from "@/application/dto/blog/moderate-blog.dto";
import { ApiBearerAuth, ApiTags, ApiBody, ApiParam } from "@nestjs/swagger";

@ApiTags("Blog")
@Controller("blogs")
export class BlogController {
  constructor(
    @Inject("IBlogService")
    private readonly blogService: IBlogService
  ) {}

  @Get()
  @RequirePermissions("blog:read")
  async findAll(): Promise<BlogResponseDto[]> {
    return this.blogService.findAll();
  }

  @Get(":id")
  @RequirePermissions("blog:read")
  @ApiParam({ name: "id", type: Number, description: "Blog ID" })
  async findById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<BlogResponseDto> {
    return this.blogService.findById(id);
  }

  @Post()
  @RequirePermissions("blog:create")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIVERSITY_REP, UserRole.STUDENT)
  @ApiBearerAuth("JWT-auth")
  @ApiBody({ type: CreateBlogDto, description: "Blog data" })
  async create(
    @Request() req,
    @Body() dto: CreateBlogDto
  ): Promise<BlogResponseDto> {
    return this.blogService.create(dto, req.user.id);
  }

  @Patch(":id")
  @RequirePermissions("blog:update")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIVERSITY_REP, UserRole.STUDENT)
  @ApiBearerAuth("JWT-auth")
  @ApiParam({ name: "id", type: Number, description: "Blog ID" })
  @ApiBody({ type: UpdateBlogDto, description: "Blog update data" })
  async update(
    @Request() req,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateBlogDto
  ): Promise<BlogResponseDto> {
    return this.blogService.update(id, dto, req.user.id);
  }

  @Delete(":id")
  @RequirePermissions("blog:delete")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIVERSITY_REP, UserRole.STUDENT)
  @ApiBearerAuth("JWT-auth")
  @ApiParam({ name: "id", type: Number, description: "Blog ID" })
  async delete(
    @Request() req,
    @Param("id", ParseIntPipe) id: number
  ): Promise<void> {
    return this.blogService.delete(id, req.user.id);
  }

  @Patch(":id/moderate")
  @RequirePermissions("blog:moderate")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth("JWT-auth")
  @ApiParam({ name: "id", type: Number, description: "Blog ID" })
  @ApiBody({ type: ModerateBlogDto, description: "Moderation data" })
  async moderate(
    @Request() req,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: ModerateBlogDto
  ): Promise<BlogResponseDto> {
    return this.blogService.moderate(id, req.user.id, dto);
  }
}
