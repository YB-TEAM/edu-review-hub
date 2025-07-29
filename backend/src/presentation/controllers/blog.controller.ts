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
import { RolesGuard } from "@/presentation/guards/role.guard";
import { Roles } from "@/presentation/decorators/roles.decorator";
import { RequirePermissions } from "@/presentation/decorators/permissions.decorator";
import { UserRole } from "@/infrastructure/database/entities/user.entity";
import { IBlogService } from "@/application/services/blog.service.interface";
import { CreateBlogDto } from "@/application/dto/blog/create-blog.dto";
import { UpdateBlogDto } from "@/application/dto/blog/update-blog.dto";
import { BlogResponseDto } from "@/application/dto/blog/blog-response.dto";
import { ModerateBlogDto } from "@/application/dto/blog/moderate-blog.dto";
import { BlogQueryDto } from "@/application/dto/blog/blog-query.dto";
import { PaginationDto } from "@/application/dto/pagination/pagination.dto";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiOperation,
  ApiResponse,
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

@ApiTags("Blog")
@Controller("blogs")
export class BlogController {
  constructor(
    @Inject("IBlogService")
    private readonly blogService: IBlogService
  ) {}

  @Get()
  @ApiOperation({
    summary: "Get all published blogs",
    description:
      "Retrieve all published blogs. This endpoint is public and does not require authentication.",
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
    name: "authorId",
    required: false,
    type: Number,
    description: "Filter by author ID",
  })
  @ApiOkResponse({
    description: "Blogs retrieved successfully",
    type: [BlogResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
  })
  async findAll(@Query() query: BlogQueryDto) {
    const { page, limit, authorId, search, tagIds } = query;
    const pagination = { page, limit };
    const filters = { authorId, search, tagIds };
    return this.blogService.findAll(null, pagination, filters);
  }

  @Get("my")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIVERSITY_REP, UserRole.STUDENT)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get my blogs",
    description: "Retrieve blogs created by the authenticated user",
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
  @ApiOkResponse({
    description: "User's blogs retrieved successfully",
    type: [BlogResponseDto],
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async getMyBlogs(@Request() req, @Query() pagination: PaginationDto) {
    return this.blogService.getMyBlogs(req.user.id, pagination);
  }

  @Get("pending")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get pending moderation blogs",
    description: "Retrieve blogs pending moderation (admin/moderator only)",
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
  @ApiOkResponse({
    description: "Pending blogs retrieved successfully",
    type: [BlogResponseDto],
  })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  async getPendingModeration(@Query() pagination: PaginationDto) {
    return this.blogService.getPendingModeration(pagination);
  }

  @Get("admin/all")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get all blogs (admin only)",
    description: "Retrieve all blogs with all statuses (admin/moderator only)",
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
    name: "status",
    required: false,
    enum: BlogStatus,
    description: "Filter by blog status",
  })
  @ApiQuery({
    name: "category",
    required: false,
    enum: BlogCategory,
    description: "Filter by blog category",
  })
  @ApiQuery({
    name: "authorId",
    required: false,
    type: Number,
    description: "Filter by author ID",
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search in title, content, and excerpt",
  })
  @ApiOkResponse({
    description: "All blogs retrieved successfully",
    type: [BlogResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin access required",
  })
  async getAllBlogsAdmin(@Request() req: any, @Query() query: BlogQueryDto) {
    const { page, limit, authorId, search, tagIds } = query;
    const pagination = { page, limit };
    const filters = { authorId, search, tagIds };
    return this.blogService.findAll(req.user, pagination, filters);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Get blog by ID",
    description:
      "Retrieve a specific blog by its ID. Regular users can only see published blogs.",
  })
  @ApiParam({ name: "id", type: Number, description: "Blog ID" })
  @ApiOkResponse({
    description: "Blog retrieved successfully",
    type: BlogResponseDto,
  })
  @ApiNotFoundResponse({ description: "Blog not found" })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Blog not accessible",
  })
  async findById(
    @Request() req: any,
    @Param("id", ParseIntPipe) id: number
  ): Promise<BlogResponseDto> {
    return this.blogService.findById(id, req.user);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIVERSITY_REP, UserRole.STUDENT)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Create new blog",
    description: "Create a new blog post (draft status)",
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
    const ip =
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.headers["x-forwarded-for"] ||
      "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";
    return this.blogService.create(dto, req.user.id, ip, userAgent);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIVERSITY_REP, UserRole.STUDENT)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Update blog",
    description: "Update an existing blog (author only)",
  })
  @ApiParam({ name: "id", type: Number, description: "Blog ID" })
  @ApiBody({ type: UpdateBlogDto, description: "Blog update data" })
  @ApiOkResponse({
    description: "Blog updated successfully",
    type: BlogResponseDto,
  })
  @ApiBadRequestResponse({ description: "Invalid blog data" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({
    description: "Insufficient permissions or not the author",
  })
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
  @ApiOkResponse({
    description: "Blog submitted for moderation",
    type: BlogResponseDto,
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({
    description: "Insufficient permissions or not the author",
  })
  @ApiNotFoundResponse({ description: "Blog not found" })
  async publish(
    @Request() req,
    @Param("id", ParseIntPipe) id: number
  ): Promise<BlogResponseDto> {
    return this.blogService.publish(id, req.user.id);
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

  @Patch(":id/moderate")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Moderate blog",
    description: "Moderate a blog (admin/moderator only)",
  })
  @ApiParam({ name: "id", type: Number, description: "Blog ID" })
  @ApiBody({ type: ModerateBlogDto, description: "Moderation data" })
  @ApiOkResponse({
    description: "Blog moderated successfully",
    type: BlogResponseDto,
  })
  @ApiBadRequestResponse({ description: "Invalid moderation data" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  @ApiNotFoundResponse({ description: "Blog not found" })
  async moderate(
    @Request() req,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: ModerateBlogDto
  ): Promise<BlogResponseDto> {
    return this.blogService.moderate(id, req.user.id, dto);
  }
}
