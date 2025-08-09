import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  Inject,
  Request,
  Query,
} from "@nestjs/common";
import { JwtAuthGuard } from "@/presentation/guards/jwt-auth.guard";
import { RolesGuard } from "@/presentation/guards/role.guard";
import { Roles } from "@/presentation/decorators/roles.decorator";
import { RequirePermissions } from "@/presentation/decorators/permissions.decorator";
import { UserRole } from "@/infrastructure/database/entities/user.entity";
import { ITagService } from "@/application/services/tag.service.interface";
import { CreateTagDto } from "@/application/dto/tag/create-tag.dto";
import { UpdateTagDto } from "@/application/dto/tag/update-tag.dto";
import { TagResponseDto } from "@/application/dto/tag/tag-response.dto";
import { TagQueryDto } from "@/application/dto/tag/tag-query.dto";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiQuery,
  getSchemaPath,
} from "@nestjs/swagger";

@Controller("tags")
export class TagController {
  constructor(
    @Inject("ITagService")
    private readonly tagService: ITagService
  ) {}

  @Get()
  @ApiTags("Tag - Public")
  @RequirePermissions("tag:read")
  @ApiOperation({
    summary: "Get tags (paginated)",
    description: "Retrieve active tags with pagination and optional search",
  })
  @ApiQuery({ name: "page", required: false, type: Number, description: "Page number (default: 1)" })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Items per page (default: 20)" })
  @ApiQuery({ name: "search", required: false, type: String, description: "Search by tag name" })
  @ApiOkResponse({
    description: "Tags retrieved successfully",
    schema: {
      type: "object",
      properties: {
        data: { type: "array", items: { $ref: getSchemaPath(TagResponseDto) } },
        metadata: {
          type: "object",
          properties: {
            totalItems: { type: "number" },
            pageSize: { type: "number" },
            currentPage: { type: "number" },
            totalPages: { type: "number" },
          },
        },
      },
    },
  })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  async findAll(@Query() query: TagQueryDto): Promise<{ data: TagResponseDto[]; metadata: any }> {
    const { page, limit, search } = query;
    return this.tagService.findAllPaginated({ page, limit }, { search });
  }

  @Get(":id")
  @ApiTags("Tag - Public")
  @RequirePermissions("tag:read")
  @ApiOperation({
    summary: "Get tag by ID",
    description: "Retrieve a specific tag by its ID",
  })
  @ApiParam({ name: "id", type: Number, description: "Tag ID" })
  @ApiOkResponse({
    description: "Tag retrieved successfully",
    type: TagResponseDto,
  })
  @ApiNotFoundResponse({ description: "Tag not found" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  async findById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<TagResponseDto> {
    return this.tagService.findById(id);
  }

  @Post()
  @ApiTags("Tag - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Create new tag",
    description: "Create a new tag (admin only)",
  })
  @ApiBody({ type: CreateTagDto, description: "Tag data" })
  @ApiCreatedResponse({
    description: "Tag created successfully",
    type: TagResponseDto,
  })
  @ApiBadRequestResponse({ description: "Invalid tag data" })
  @ApiConflictResponse({ description: "Tag name already exists" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  async create(
    @Body() dto: CreateTagDto,
    @Request() req
  ): Promise<TagResponseDto> {
    const ip =
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.headers["x-forwarded-for"] ||
      "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";
    return this.tagService.create(dto, req.user.id, ip, userAgent);
  }

  @Patch(":id")
  @ApiTags("Tag - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Update tag",
    description: "Update an existing tag (admin only)",
  })
  @ApiParam({ name: "id", type: Number, description: "Tag ID" })
  @ApiBody({ type: UpdateTagDto, description: "Tag update data" })
  @ApiOkResponse({
    description: "Tag updated successfully",
    type: TagResponseDto,
  })
  @ApiBadRequestResponse({ description: "Invalid tag data" })
  @ApiConflictResponse({ description: "Tag name already exists" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  @ApiNotFoundResponse({ description: "Tag not found" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateTagDto,
    @Request() req
  ): Promise<TagResponseDto> {
    const ip =
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.headers["x-forwarded-for"] ||
      "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";
    return this.tagService.update(id, dto, req.user.id, ip, userAgent);
  }

  @Delete(":id")
  @ApiTags("Tag - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Delete tag",
    description: "Delete a tag (admin only, only if not used by any blog)",
  })
  @ApiParam({ name: "id", type: Number, description: "Tag ID" })
  @ApiOkResponse({ description: "Tag deleted successfully" })
  @ApiConflictResponse({ description: "Tag is being used by blogs" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  @ApiNotFoundResponse({ description: "Tag not found" })
  async delete(
    @Param("id", ParseIntPipe) id: number,
    @Request() req
  ): Promise<void> {
    const ip =
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.headers["x-forwarded-for"] ||
      "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";
    return this.tagService.delete(id, req.user.id, ip, userAgent);
  }
}
