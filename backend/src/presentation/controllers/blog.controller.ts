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
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { JwtAuthGuard } from "@/presentation/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "@/presentation/guards/optional-jwt-auth.guard";
import { RolesGuard } from "@/presentation/guards/role.guard";
import { Roles } from "@/presentation/decorators/roles.decorator";
import { UserRole } from "@/infrastructure/database/entities/user.entity";
import { IBlogService } from "@/application/services/blog.service.interface";
import { CreateBlogDto } from "@/application/dto/blog/create-blog.dto";
import { UpdateBlogDto } from "@/application/dto/blog/update-blog.dto";
import { BlogResponseDto } from "@/application/dto/blog/blog-response.dto";
import {
  ModerateBlogDto,
  ApproveBlogDto,
  RejectBlogDto,
  BanBlogDto,
} from "@/application/dto/blog/moderate-blog.dto";
import { BlogQueryDto } from "@/application/dto/blog/blog-query.dto";
import { PaginationDto } from "@/application/dto/pagination/pagination.dto";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";
import {
  BlogStatus,
  BlogCategory,
} from "@/infrastructure/database/entities/blog.entity";
import { PublishBlogDto } from "@/application/dto/blog/publish-blog.dto";

@ApiTags("Blog")
@Controller("blogs")
export class BlogController {
  constructor(
    @Inject("IBlogService")
    private readonly blogService: IBlogService
  ) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get all approved blogs",
    description: "Retrieve all approved blogs for public viewing",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number (default: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Items per page (default: 10)",
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search in title, content, and excerpt",
  })
  @ApiQuery({
    name: "category",
    required: false,
    enum: BlogCategory,
    description: "Filter by category",
  })
  @ApiOkResponse({
    description: "Blogs retrieved successfully",
    type: [BlogResponseDto],
  })
  async findAll(@Request() req: any, @Query() query: BlogQueryDto) {
    // Only show approved blogs to public
    query.status = BlogStatus.APPROVED;
    return this.blogService.findAll(req.user, query, query);
  }

  @Get("my-drafts")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIVERSITY_REP, UserRole.STUDENT)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get user's draft blogs",
    description: "Get current user's draft blogs",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
  })
  @ApiOkResponse({
    description: "Draft blogs retrieved successfully",
    type: [BlogResponseDto],
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  async getMyDrafts(@Request() req, @Query() pagination: PaginationDto) {
    return this.blogService.findMyDrafts(req.user.id, pagination);
  }

  @Get("moderation")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get blogs for moderation",
    description: "Get published blogs that need moderation (admin/moderator only)",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
  })
  @ApiOkResponse({
    description: "Blogs for moderation retrieved successfully",
    type: [BlogResponseDto],
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  async getModerationBlogs(@Request() req, @Query() pagination: PaginationDto) {
    return this.blogService.findForModeration(pagination);
  }

  @Get(":id")
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get blog by ID",
    description: "Get a specific blog by ID",
  })
  @ApiParam({ name: "id", type: Number, description: "Blog ID" })
  @ApiOkResponse({
    description: "Blog retrieved successfully",
    type: BlogResponseDto,
  })
  @ApiNotFoundResponse({ description: "Blog not found" })
  async findById(
    @Request() req: any,
    @Param("id", ParseIntPipe) id: number
  ): Promise<BlogResponseDto> {
    return this.blogService.findById(id, req.user?.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIVERSITY_REP, UserRole.STUDENT)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Create new blog",
    description: "Create a new blog (draft status)",
  })
  @ApiBody({ type: CreateBlogDto, description: "Blog data" })
  @ApiCreatedResponse({
    description: "Blog created successfully",
    type: BlogResponseDto,
  })
  @ApiBadRequestResponse({ description: "Invalid blog data" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  async create(
    @Request() req,
    @Body() dto: CreateBlogDto
  ): Promise<BlogResponseDto> {
    return this.blogService.create(dto, req.user.id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIVERSITY_REP, UserRole.STUDENT)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Update blog",
    description: "Update a blog (author only)",
  })
  @ApiParam({ name: "id", type: Number, description: "Blog ID" })
  @ApiBody({ type: UpdateBlogDto, description: "Update data" })
  @ApiOkResponse({
    description: "Blog updated successfully",
    type: BlogResponseDto,
  })
  @ApiBadRequestResponse({ description: "Invalid update data" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  @ApiNotFoundResponse({ description: "Blog not found" })
  async update(
    @Request() req,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateBlogDto
  ): Promise<BlogResponseDto> {
    return this.blogService.update(id, dto, req.user.id);
  }

  @Post(":id/publish")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIVERSITY_REP, UserRole.STUDENT)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Publish blog",
    description: "Submit blog for moderation (author only)",
  })
  @ApiParam({ name: "id", type: Number, description: "Blog ID" })
  @ApiBody({ type: PublishBlogDto, description: "Publish data" })
  @ApiOkResponse({
    description: "Blog submitted for moderation",
    type: BlogResponseDto,
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({
    description: "Insufficient permissions or not the author",
  })
  @ApiNotFoundResponse({ description: "Blog not found" })
  async publishBlog(
    @Request() req,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: PublishBlogDto
  ): Promise<BlogResponseDto> {
    return this.blogService.publishBlog(id, req.user.id, dto);
  }

  @Post(":id/like")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIVERSITY_REP, UserRole.STUDENT)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Like/Unlike blog",
    description: "Toggle like status for a blog",
  })
  @ApiParam({ name: "id", type: Number, description: "Blog ID" })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: "Like toggled successfully" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiNotFoundResponse({ description: "Blog not found" })
  async like(
    @Request() req,
    @Param("id", ParseIntPipe) id: number
  ): Promise<void> {
    const ip =
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.headers["x-forwarded-for"] ||
      "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";
    return this.blogService.like(id, req.user.id, ip, userAgent);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIVERSITY_REP, UserRole.STUDENT)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Delete blog",
    description: "Delete a blog (author only)",
  })
  @ApiParam({ name: "id", type: Number, description: "Blog ID" })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: "Blog deleted successfully" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({
    description: "Insufficient permissions or not the author",
  })
  @ApiNotFoundResponse({ description: "Blog not found" })
  async delete(
    @Request() req,
    @Param("id", ParseIntPipe) id: number
  ): Promise<void> {
    return this.blogService.delete(id, req.user.id);
  }

  @Patch(":id/approve")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Approve blog",
    description: "Approve a blog (admin/moderator only)",
  })
  @ApiParam({ name: "id", type: Number, description: "Blog ID" })
  @ApiBody({ type: ApproveBlogDto, description: "Approve data" })
  @ApiOkResponse({
    description: "Blog approved successfully",
    type: BlogResponseDto,
  })
  @ApiBadRequestResponse({ description: "Invalid approve data" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  @ApiNotFoundResponse({ description: "Blog not found" })
  async approve(
    @Request() req,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: ApproveBlogDto
  ): Promise<BlogResponseDto> {
    return this.blogService.approve(id, req.user.id, dto);
  }

  @Patch(":id/reject")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Reject blog",
    description: "Reject a blog (admin/moderator only)",
  })
  @ApiParam({ name: "id", type: Number, description: "Blog ID" })
  @ApiBody({ type: RejectBlogDto, description: "Reject data" })
  @ApiOkResponse({
    description: "Blog rejected successfully",
    type: BlogResponseDto,
  })
  @ApiBadRequestResponse({ description: "Invalid reject data" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  @ApiNotFoundResponse({ description: "Blog not found" })
  async reject(
    @Request() req,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: RejectBlogDto
  ): Promise<BlogResponseDto> {
    return this.blogService.reject(id, req.user.id, dto);
  }

  @Patch(":id/ban")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Ban blog",
    description: "Ban a blog (admin/moderator only)",
  })
  @ApiParam({ name: "id", type: Number, description: "Blog ID" })
  @ApiBody({ type: BanBlogDto, description: "Ban data" })
  @ApiOkResponse({
    description: "Blog banned successfully",
    type: BlogResponseDto,
  })
  @ApiBadRequestResponse({ description: "Invalid ban data" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  @ApiNotFoundResponse({ description: "Blog not found" })
  async ban(
    @Request() req,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: BanBlogDto
  ): Promise<BlogResponseDto> {
    return this.blogService.ban(id, req.user.id, dto);
  }
}
