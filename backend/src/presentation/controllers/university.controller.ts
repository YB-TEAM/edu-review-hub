import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  Inject,
  UseInterceptors,
  UploadedFile,
  Patch,
} from "@nestjs/common";
import {
  PaginationDto,
  UniversityListResponseDto,
  CreateUniversityDto,
  UpdateUniversityDto,
  CreateUniversityReviewDto,
  UpdateUniversityReviewDto,
  UniversityReviewResponseDto,
  ModerateUniversityReviewDto,
  CompareUniversitiesDto,
  CompareUniversitiesResponseDto,
  UniversityInsightsResponseDto,
  UniversityReportResponseDto,
} from "../../application/dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/role.guard";
import { Roles } from "../decorators/roles.decorator";
import { RequirePermissions } from "../decorators/permissions.decorator";
import { UserRole } from "../../infrastructure/database/entities/user.entity";
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiConsumes,
} from "@nestjs/swagger";
import { IUniversityService } from "../../application/services/university.service.interface";
import { UniversityImageService } from "../../application/services/university-image.service";
import {
  UniversityType,
  UniversityStatus,
} from "../../infrastructure/database/entities/university.entity";
import { ReviewStatus } from "../../infrastructure/database/entities/university-review.entity";
import { UniversityResponseDto } from "../../application/dto/university/university-response.dto";
import {
  UploadUniversityImageDto,
  UniversityImageResponseDto,
} from "../../application/dto/university/upload-university-image.dto";
import { ImageType } from "../../infrastructure/database/entities/university-image.entity";

@Controller("universities")
export class UniversityController {
  constructor(
    @Inject("IUniversityService")
    private readonly universityService: IUniversityService,
    private readonly universityImageService: UniversityImageService
  ) {}

  // Public APIs
  @Get()
  @ApiTags("University - Public")
  @ApiOperation({ summary: "Get all universities with pagination" })
  @ApiQuery({
    name: "type",
    enum: UniversityType,
    required: false,
    description: "University type (public/private/international/college)",
  })
  @ApiQuery({
    name: "location",
    type: String,
    required: false,
    description: "Location/Province",
  })
  @ApiQuery({
    name: "search",
    type: String,
    required: false,
    description: "Search by university name",
  })
  @ApiQuery({
    name: "page",
    type: Number,
    required: false,
    description: "Current page (default: 1)",
  })
  @ApiQuery({
    name: "limit",
    type: Number,
    required: false,
    description: "Items per page (default: 10)",
  })
  @ApiResponse({
    status: 200,
    description: "List of universities with detailed pagination information",
    type: UniversityListResponseDto,
  })
  async getAllUniversities(
    @Query()
    filters: PaginationDto & {
      type?: string;
      location?: string;
      search?: string;
    }
  ): Promise<UniversityListResponseDto> {
    const result = await this.universityService.getAllUniversities(filters);

    return {
      universities: result.universities,
      pagination: result.pagination,
    };
  }

  @Get("featured")
  @ApiTags("University - Public")
  @ApiOperation({
    summary: "Get featured universities",
    description:
      "Get universities marked as featured, sorted by rating and name",
  })
  @ApiResponse({
    status: 200,
    description: "Featured universities retrieved successfully",
    type: [UniversityResponseDto],
  })
  async getFeaturedUniversities() {
    return this.universityService.getFeaturedUniversities();
  }

  @Get("top-rated")
  @ApiTags("University - Public")
  @ApiOperation({
    summary: "Get top rated universities",
    description: "Get universities with highest ratings and review counts",
  })
  @ApiQuery({
    name: "limit",
    type: Number,
    required: false,
    description: "Number of universities to return (default: 10)",
  })
  @ApiResponse({
    status: 200,
    description: "Top rated universities retrieved successfully",
    type: [UniversityResponseDto],
  })
  async getTopRatedUniversities(@Query("limit") limit?: number) {
    return this.universityService.getTopRatedUniversities(limit);
  }

  @Get("search")
  @ApiTags("University - Public")
  @ApiOperation({
    summary: "Search universities",
    description:
      "Search universities by name, short name, English name, or description",
  })
  @ApiQuery({
    name: "q",
    type: String,
    required: true,
    description: "Search query",
  })
  @ApiResponse({
    status: 200,
    description: "Search results retrieved successfully",
    type: [UniversityResponseDto],
  })
  async searchUniversities(@Query("q") query: string) {
    return this.universityService.searchUniversities(query);
  }

  @Get("statistics")
  @ApiTags("University - Public")
  @ApiOperation({ summary: "Get university statistics" })
  @ApiResponse({
    status: 200,
    description: "University statistics",
    schema: {
      type: "object",
      properties: {
        totalUniversities: { type: "number" },
        totalReviews: { type: "number" },
        averageRating: { type: "number" },
        topTypes: { type: "array", items: { type: "string" } },
        topLocations: { type: "array", items: { type: "string" } },
      },
    },
  })
  async getUniversityStatistics() {
    return this.universityService.getUniversityStatistics();
  }

  @Get(":id")
  @ApiTags("University - Public")
  @ApiOperation({ summary: "Get university by ID" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "University ID",
  })
  @ApiResponse({
    status: 200,
    description: "University details",
    type: UniversityResponseDto,
  })
  @ApiResponse({ status: 404, description: "University not found" })
  async getUniversityById(@Param("id", ParseIntPipe) id: number) {
    return this.universityService.getUniversityById(id);
  }

  @Get(":id/reviews")
  @ApiTags("University - Public")
  @ApiOperation({ summary: "Get university reviews" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "University ID",
  })
  @ApiQuery({
    name: "status",
    enum: ReviewStatus,
    required: false,
    description: "Review status filter",
  })
  @ApiQuery({
    name: "page",
    type: Number,
    required: false,
    description: "Page number",
  })
  @ApiQuery({
    name: "limit",
    type: Number,
    required: false,
    description: "Items per page",
  })
  @ApiResponse({
    status: 200,
    description: "University reviews",
    schema: {
      type: "object",
      properties: {
        reviews: {
          type: "array",
          items: { $ref: "#/components/schemas/UniversityReviewResponseDto" },
        },
        total: { type: "number" },
      },
    },
  })
  async getUniversityReviews(
    @Param("id", ParseIntPipe) id: number,
    @Query() filters: any
  ) {
    return this.universityService.getUniversityReviews(id, filters);
  }

  @Get(":id/statistics")
  @ApiTags("University - Public")
  @ApiOperation({ summary: "Get university review statistics" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "University ID",
  })
  @ApiResponse({
    status: 200,
    description: "Review statistics",
    schema: {
      type: "object",
      properties: {
        totalReviews: { type: "number" },
        averageRating: { type: "number" },
        ratingDistribution: { type: "object" },
        reviewTrends: { type: "array" },
      },
    },
  })
  async getReviewStatistics(@Param("id", ParseIntPipe) id: number) {
    return this.universityService.getReviewStatistics(id);
  }

  @Get(":id/analytics")
  @ApiTags("University - Public")
  @ApiOperation({ summary: "Get university analytics" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "University ID",
  })
  @ApiResponse({
    status: 200,
    description: "University analytics",
    schema: {
      type: "object",
      properties: {
        viewCount: { type: "number" },
        reviewCount: { type: "number" },
        averageRating: { type: "number" },
        ratingTrends: { type: "array" },
        popularFeatures: { type: "array" },
      },
    },
  })
  async getUniversityAnalytics(@Param("id", ParseIntPipe) id: number) {
    return this.universityService.getUniversityAnalytics(id);
  }

  // Protected APIs (require authentication)
  @Post(":id/reviews")
  @ApiTags("University - User")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create university review" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "University ID",
  })
  @ApiBody({
    type: CreateUniversityReviewDto,
    description: "Review data",
  })
  @ApiResponse({
    status: 201,
    description: "Review created",
    type: UniversityReviewResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async createUniversityReview(
    @Param("id", ParseIntPipe) universityId: number,
    @Body() reviewData: CreateUniversityReviewDto,
    @Request() req: any
  ) {
    return this.universityService.createUniversityReview({
      ...reviewData,
      university_id: universityId,
      user_id: req.user.id,
    });
  }

  @Put("reviews/:id")
  @ApiTags("University - User")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update university review" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Review ID",
  })
  @ApiBody({
    type: UpdateUniversityReviewDto,
    description: "Updated review data",
  })
  @ApiResponse({
    status: 200,
    description: "Review updated",
    type: UniversityReviewResponseDto,
  })
  @ApiResponse({ status: 404, description: "Review not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async updateUniversityReview(
    @Param("id", ParseIntPipe) id: number,
    @Body() reviewData: UpdateUniversityReviewDto,
    @Request() req: any
  ) {
    return this.universityService.updateUniversityReview(id, reviewData);
  }

  @Delete("reviews/:id")
  @ApiTags("University - User")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete university review" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Review ID",
  })
  @ApiResponse({ status: 200, description: "Review deleted" })
  @ApiResponse({ status: 404, description: "Review not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async deleteUniversityReview(@Param("id", ParseIntPipe) id: number) {
    return this.universityService.deleteUniversityReview(id);
  }

  @Get("recommendations")
  @ApiTags("University - User")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get recommended universities" })
  @ApiResponse({
    status: 200,
    description: "Recommended universities",
    type: [UniversityResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getRecommendedUniversities(@Request() req: any) {
    return this.universityService.getRecommendedUniversities(req.user.id);
  }

  // Admin APIs
  @Post()
  @ApiTags("University - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @RequirePermissions("university:create")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create university (Admin only)" })
  @ApiBody({
    type: CreateUniversityDto,
    description: "University data",
  })
  @ApiResponse({
    status: 201,
    description: "University created",
    type: UniversityResponseDto,
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async createUniversity(@Body() universityData: CreateUniversityDto) {
    return this.universityService.createUniversity(universityData);
  }

  @Put(":id")
  @ApiTags("University - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @RequirePermissions("university:update")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update university (Admin only)" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "University ID",
  })
  @ApiBody({
    type: UpdateUniversityDto,
    description: "Updated university data",
  })
  @ApiResponse({
    status: 200,
    description: "University updated",
    type: UniversityResponseDto,
  })
  @ApiResponse({ status: 404, description: "University not found" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async updateUniversity(
    @Param("id", ParseIntPipe) id: number,
    @Body() universityData: UpdateUniversityDto
  ) {
    return this.universityService.updateUniversity(id, universityData);
  }

  @Delete(":id")
  @ApiTags("University - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @RequirePermissions("university:delete")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete university (Admin only)" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "University ID",
  })
  @ApiResponse({ status: 200, description: "University deleted" })
  @ApiResponse({ status: 404, description: "University not found" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async deleteUniversity(@Param("id", ParseIntPipe) id: number) {
    return this.universityService.deleteUniversity(id);
  }

  @Put(":id/status")
  @ApiTags("University - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @RequirePermissions("university:update")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update university status (Admin only)" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "University ID",
  })
  @ApiBody({
    description: "Status data",
    schema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: Object.values(UniversityStatus),
          description: "New university status",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Status updated",
    type: UniversityResponseDto,
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async updateUniversityStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status") status: UniversityStatus
  ) {
    return this.universityService.updateUniversityStatus(id, status);
  }

  @Put(":id/feature")
  @ApiTags("University - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @RequirePermissions("university:update")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Feature/unfeature university (Admin only)" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "University ID",
  })
  @ApiBody({
    description: "Feature data",
    schema: {
      type: "object",
      properties: {
        featured: {
          type: "boolean",
          description: "Whether to feature the university",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Feature status updated",
    type: UniversityResponseDto,
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async featureUniversity(
    @Param("id", ParseIntPipe) id: number,
    @Body("featured") featured: boolean
  ) {
    return this.universityService.featureUniversity(id, featured);
  }

  @Put(":id/verify")
  @ApiTags("University - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @RequirePermissions("university:update")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Verify university (Admin only)" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "University ID",
  })
  @ApiBody({
    description: "Verification data",
    schema: {
      type: "object",
      properties: {
        verified: {
          type: "boolean",
          description: "Whether to verify the university",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Verification status updated",
    type: UniversityResponseDto,
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async verifyUniversity(
    @Param("id", ParseIntPipe) id: number,
    @Body("verified") verified: boolean
  ) {
    return this.universityService.verifyUniversity(id, verified);
  }

  @Post("reviews/:id/moderate")
  @ApiTags("University - Moderator", "University - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @RequirePermissions("review:moderate")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Moderate review (Moderator/Admin only)" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Review ID",
  })
  @ApiBody({
    type: ModerateUniversityReviewDto,
    description: "Moderation data",
  })
  @ApiResponse({
    status: 200,
    description: "Review moderated",
    type: UniversityReviewResponseDto,
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async moderateReview(
    @Param("id", ParseIntPipe) id: number,
    @Body("status") status: ReviewStatus,
    @Request() req: any
  ) {
    return this.universityService.moderateReview(id, status, req.user.id);
  }

  @Post(":id/upload-image")
  @ApiTags("University - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @RequirePermissions("university:update")
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiOperation({
    summary: "Upload university image (Admin only)",
    description:
      "Upload image for university with metadata and type classification",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "University ID",
  })
  @ApiBody({ type: UploadUniversityImageDto })
  @ApiResponse({
    status: 201,
    description: "Image uploaded successfully",
    type: UniversityImageResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request - Invalid data" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "University not found" })
  @UseInterceptors(FileInterceptor("image"))
  async uploadUniversityImage(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadData: UploadUniversityImageDto,
    @Request() req: any
  ): Promise<UniversityImageResponseDto> {
    return this.universityImageService.uploadImage(
      id,
      file,
      uploadData,
      req.user.id,
      req.ip || req.headers["x-forwarded-for"] || "unknown",
      req.headers["user-agent"] || "unknown"
    );
  }

  @Post("compare")
  @ApiTags("University - Public")
  @ApiOperation({ summary: "Compare universities" })
  @ApiBody({ type: CompareUniversitiesDto })
  @ApiResponse({
    status: 200,
    description: "Comparison results",
    type: CompareUniversitiesResponseDto,
  })
  async compareUniversities(@Body() compareDto: CompareUniversitiesDto) {
    return this.universityService.compareUniversities(compareDto.universityIds);
  }

  @Get(":id/report/:type")
  @ApiTags("University - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @RequirePermissions("university:read")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Generate university report (Admin only)" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "University ID",
  })
  @ApiParam({
    name: "type",
    type: String,
    description: "Report type (e.g., 'reviews', 'analytics', 'performance')",
  })
  @ApiResponse({
    status: 200,
    description: "Report generated",
    type: UniversityReportResponseDto,
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async generateUniversityReport(
    @Param("id", ParseIntPipe) id: number,
    @Param("type") type: string
  ) {
    return this.universityService.generateUniversityReport(id, type);
  }

  @Get(":id/insights")
  @ApiTags("University - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @RequirePermissions("university:read")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get university insights (Admin only)" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "University ID",
  })
  @ApiResponse({
    status: 200,
    description: "University insights",
    type: UniversityInsightsResponseDto,
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getUniversityInsights(@Param("id", ParseIntPipe) id: number) {
    return this.universityService.getUniversityInsights(id);
  }

  // ===== UNIVERSITY IMAGE MANAGEMENT APIs =====

  @Get(":id/images")
  @ApiTags("University - Public")
  @ApiOperation({
    summary: "Get university images",
    description: "Get all images for a specific university",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "University ID",
  })
  @ApiQuery({
    name: "type",
    enum: ImageType,
    required: false,
    description: "Filter by image type",
  })
  @ApiResponse({
    status: 200,
    description: "University images retrieved successfully",
    type: [UniversityImageResponseDto],
  })
  @ApiResponse({ status: 404, description: "University not found" })
  async getUniversityImages(
    @Param("id", ParseIntPipe) id: number,
    @Query("type") imageType?: ImageType
  ): Promise<UniversityImageResponseDto[]> {
    if (imageType) {
      return this.universityImageService.getImagesByUniversityAndType(
        id,
        imageType
      );
    }
    return this.universityImageService.getImagesByUniversity(id);
  }

  @Get(":id/images/primary/:type")
  @ApiTags("University - Public")
  @ApiOperation({
    summary: "Get primary university image by type",
    description:
      "Get the primary image for a specific type (logo, banner, etc.)",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "University ID",
  })
  @ApiParam({
    name: "type",
    enum: ImageType,
    description: "Image type",
  })
  @ApiResponse({
    status: 200,
    description: "Primary image retrieved successfully",
    type: UniversityImageResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "University or primary image not found",
  })
  async getPrimaryUniversityImage(
    @Param("id", ParseIntPipe) id: number,
    @Param("type") imageType: ImageType
  ): Promise<UniversityImageResponseDto | null> {
    return this.universityImageService.getPrimaryImage(id, imageType);
  }

  @Patch(":id/images/:imageId")
  @ApiTags("University - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @RequirePermissions("university:update")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update university image metadata",
    description:
      "Update image title, description, alt text, sort order, or primary status",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "University ID",
  })
  @ApiParam({
    name: "imageId",
    type: Number,
    description: "Image ID",
  })
  @ApiBody({ type: UploadUniversityImageDto })
  @ApiResponse({
    status: 200,
    description: "Image updated successfully",
    type: UniversityImageResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request - Invalid data" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "University or image not found" })
  async updateUniversityImage(
    @Param("id", ParseIntPipe) id: number,
    @Param("imageId", ParseIntPipe) imageId: number,
    @Body() updateData: Partial<UploadUniversityImageDto>,
    @Request() req: any
  ): Promise<UniversityImageResponseDto> {
    return this.universityImageService.updateImage(
      imageId,
      updateData,
      req.user.id,
      req.ip || req.headers["x-forwarded-for"] || "unknown",
      req.headers["user-agent"] || "unknown"
    );
  }

  @Delete(":id/images/:imageId")
  @ApiTags("University - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @RequirePermissions("university:update")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete university image",
    description: "Delete image from university and Cloudinary",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "University ID",
  })
  @ApiParam({
    name: "imageId",
    type: Number,
    description: "Image ID",
  })
  @ApiResponse({
    status: 204,
    description: "Image deleted successfully",
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "University or image not found" })
  async deleteUniversityImage(
    @Param("id", ParseIntPipe) id: number,
    @Param("imageId", ParseIntPipe) imageId: number,
    @Request() req: any
  ): Promise<void> {
    await this.universityImageService.deleteImage(imageId, req.user.id);
  }

  @Post(":id/images/:imageId/set-primary")
  @ApiTags("University - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @RequirePermissions("university:update")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Set image as primary",
    description: "Set a specific image as primary for its type",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "University ID",
  })
  @ApiParam({
    name: "imageId",
    type: Number,
    description: "Image ID",
  })
  @ApiResponse({
    status: 200,
    description: "Image set as primary successfully",
  })
  @ApiResponse({ status: 400, description: "Bad request - Invalid data" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "University or image not found" })
  async setPrimaryImage(
    @Param("id", ParseIntPipe) id: number,
    @Param("imageId", ParseIntPipe) imageId: number,
    @Query("type") imageType: ImageType
  ): Promise<void> {
    await this.universityImageService.setPrimaryImage(id, imageType, imageId);
  }

  @Get(":id/images/stats")
  @ApiTags("University - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @RequirePermissions("university:read")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get university image statistics",
    description:
      "Get statistics about university images including counts by type and primary images",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "University ID",
  })
  @ApiResponse({
    status: 200,
    description: "Image statistics retrieved successfully",
    schema: {
      type: "object",
      properties: {
        totalImages: { type: "number" },
        imagesByType: { type: "object" },
        primaryImages: { type: "object" },
      },
    },
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "University not found" })
  async getUniversityImageStats(@Param("id", ParseIntPipe) id: number) {
    return this.universityImageService.getImageStats(id);
  }
}
