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
import { RequirePermissions } from "@/presentation/decorators/permissions.decorator";
import { UserRole } from "@/infrastructure/database/entities/user.entity";
import { IBlogService } from "@/application/services/blog.service.interface";
import { CreateBlogDto } from "@/application/dto/blog/create-blog.dto";
import { UpdateBlogDto } from "@/application/dto/blog/update-blog.dto";
import { BlogResponseDto } from "@/application/dto/blog/blog-response.dto";
import {
  ApproveBlogDto,
  RejectBlogDto,
  BanBlogDto,
  UnbanBlogDto,
} from "@/application/dto/blog/moderate-blog.dto";
import { BlogQueryDto } from "@/application/dto/blog/blog-query.dto";
import { BlogPublicQueryDto } from "@/application/dto/blog/blog-public-query.dto";
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

@Controller("blogs")
export class BlogController {
  constructor(
    @Inject("IBlogService")
    private readonly blogService: IBlogService
  ) {}

  @Get()
  @ApiTags("Blog - Public")
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get all approved blogs",
    description:
      "Retrieve all approved blogs. Authentication is optional - if provided, includes like status for the user.",
  })
  @ApiQuery({
    name: "page",
    required: true,
    type: Number,
    description: "Page number (>= 1)",
  })
  @ApiQuery({
    name: "limit",
    required: true,
    type: Number,
    description: "Items per page (>= 1)",
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
  @ApiResponse({
    status: 401,
    description:
      "Invalid JWT token (optional - request continues without authentication)",
  })
  async findAll(@Request() req: any, @Query() query: BlogPublicQueryDto) {
    const { page, limit, authorId, search, tagIds } = query;
    const pagination = { page, limit };
    const filters = { authorId, search, tagIds };
    return this.blogService.findAll(req.user, pagination, filters);
  }

  @Get("public/:id")
  @ApiTags("Blog - Public")
  @ApiOperation({
    summary: "Get public blog by ID",
    description:
      "Retrieve a specific approved blog by its ID. This endpoint is public and does not require authentication.",
  })
  @ApiParam({ name: "id", type: Number, description: "Blog ID" })
  @ApiOkResponse({
    description: "Blog retrieved successfully",
    type: BlogResponseDto,
  })
  @ApiNotFoundResponse({ description: "Blog not found" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Blog not approved or accessible",
  })
  async findByIdPublic(
    @Param("id", ParseIntPipe) id: number
  ): Promise<BlogResponseDto> {
    return this.blogService.findById(id, null); // null user = public access
  }

  @Get("my")
  @ApiTags("Blog - User")
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

  @Get("my-drafts")
  @ApiTags("Blog - User")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIVERSITY_REP, UserRole.STUDENT)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get my draft blogs",
    description: "Retrieve draft blogs created by the authenticated user",
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
    description: "User's draft blogs retrieved successfully",
    type: [BlogResponseDto],
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async getMyDrafts(@Request() req, @Query() pagination: PaginationDto) {
    return this.blogService.getMyDrafts(req.user.id, pagination);
  }

  @Get("pending")
  @ApiTags("Blog - Moderator", "Blog - Admin")
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
  @ApiTags("Blog - Admin", "Blog - Moderator")
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
    const { page, limit, status, category, authorId, search, tagIds } = query;
    const pagination = { page, limit };
    const filters = { status, category, authorId, search, tagIds };
    return this.blogService.findAll(req.user, pagination, filters);
  }

  @Get("admin/all-with-deleted")
  @ApiTags("Blog - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get all blogs including soft deleted (admin only)",
    description:
      "Retrieve all blogs including soft deleted ones (super admin only)",
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
    description: "All blogs including soft deleted retrieved successfully",
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
    description: "Forbidden - Super admin access required",
  })
  async getAllBlogsAdminWithDeleted(
    @Request() req: any,
    @Query() query: BlogQueryDto
  ) {
    const { page, limit, status, category, authorId, search, tagIds } = query;
    const pagination = { page, limit };
    const filters = { status, category, authorId, search, tagIds };
    return this.blogService.findAllWithDeleted(req.user, pagination, filters);
  }

  @Get(":id")
  @ApiTags("Blog - User")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get blog by ID",
    description:
      "Retrieve a specific blog by its ID. Admin/moderators can see all blogs, authors can see their own blogs, regular users can only see approved blogs.",
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

  @Get("admin/:id/with-deleted")
  @ApiTags("Blog - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get blog by ID including soft deleted (admin only)",
    description:
      "Retrieve a specific blog by its ID including soft deleted ones (admin only)",
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
    description: "Forbidden - Admin access required",
  })
  async findByIdWithDeleted(
    @Request() req: any,
    @Param("id", ParseIntPipe) id: number
  ): Promise<BlogResponseDto> {
    return this.blogService.findByIdWithDeleted(id, req.user);
  }

  @Post()
  @ApiTags("Blog - User")
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
  @ApiTags("Blog - User")
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
  @ApiTags("Blog - User")
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
  @ApiTags("Blog - User")
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
  @ApiTags("Blog - User")
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

  @Post(":id/restore")
  @ApiTags("Blog - User")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIVERSITY_REP, UserRole.STUDENT)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Restore deleted blog",
    description: "Restore a soft deleted blog (author only)",
  })
  @ApiParam({ name: "id", type: Number, description: "Blog ID" })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: "Blog restored successfully" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({
    description: "Insufficient permissions or not the author",
  })
  @ApiNotFoundResponse({ description: "Blog not found" })
  async restore(
    @Request() req,
    @Param("id", ParseIntPipe) id: number
  ): Promise<void> {
    return this.blogService.restore(id, req.user.id);
  }

  @Patch(":id/approve")
  @ApiTags("Blog - Moderator", "Blog - Admin")
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
  @ApiTags("Blog - Moderator", "Blog - Admin")
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
  @ApiTags("Blog - Moderator", "Blog - Admin")
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

  @Patch(":id/unban")
  @ApiTags("Blog - Moderator", "Blog - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Unban blog",
    description:
      "Lift ban from a blog and move it back to published state for re-moderation/approval",
  })
  @ApiParam({ name: "id", type: Number, description: "Blog ID" })
  @ApiBody({ type: UnbanBlogDto, description: "Unban data (optional reason)" })
  @ApiOkResponse({
    description: "Blog unbanned successfully",
    type: BlogResponseDto,
  })
  @ApiBadRequestResponse({ description: "Invalid unban request" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  @ApiNotFoundResponse({ description: "Blog not found" })
  async unban(
    @Request() req,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UnbanBlogDto
  ): Promise<BlogResponseDto> {
    return this.blogService.unban(id, req.user.id, dto);
  }
}
