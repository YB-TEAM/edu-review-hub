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
} from "@nestjs/common";
import {
  PaginationDto,
  UniversityListResponseDto,
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
import {
  UniversityType,
  UniversityStatus,
} from "../../infrastructure/database/entities/university.entity";
import { ReviewStatus } from "../../infrastructure/database/entities/university-review.entity";

@Controller("universities")
export class UniversityController {
  constructor(
    @Inject("IUniversityService")
    private readonly universityService: IUniversityService
  ) {}

  // Public APIs
  @Get()
  @ApiTags("University - Public")
  @ApiOperation({ summary: "Get all universities with pagination" })
  @ApiQuery({
    name: "type",
    enum: UniversityType,
    required: false,
    description: "University type (public/private)",
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
  @ApiOperation({ summary: "Get featured universities" })
  @ApiResponse({ status: 200, description: "List of featured universities" })
  async getFeaturedUniversities() {
    return this.universityService.getFeaturedUniversities();
  }

  @Get("top-rated")
  @ApiTags("University - Public")
  @ApiOperation({ summary: "Get top rated universities" })
  @ApiQuery({ name: "limit", type: Number, required: false })
  @ApiResponse({ status: 200, description: "List of top rated universities" })
  async getTopRatedUniversities(@Query("limit") limit?: number) {
    return this.universityService.getTopRatedUniversities(limit);
  }

  @Get("search")
  @ApiTags("University - Public")
  @ApiOperation({ summary: "Search universities" })
  @ApiQuery({ name: "q", type: String, required: true })
  @ApiResponse({ status: 200, description: "Search results" })
  async searchUniversities(@Query("q") query: string) {
    return this.universityService.searchUniversities(query);
  }

  @Get("statistics")
  @ApiTags("University - Public")
  @ApiOperation({ summary: "Get university statistics" })
  @ApiResponse({ status: 200, description: "University statistics" })
  async getUniversityStatistics() {
    return this.universityService.getUniversityStatistics();
  }

  @Get(":id")
  @ApiTags("University - Public")
  @ApiOperation({ summary: "Get university by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "University details" })
  @ApiResponse({ status: 404, description: "University not found" })
  async getUniversityById(@Param("id", ParseIntPipe) id: number) {
    return this.universityService.getUniversityById(id);
  }

  @Get(":id/reviews")
  @ApiTags("University - Public")
  @ApiOperation({ summary: "Get university reviews" })
  @ApiParam({ name: "id", type: Number })
  @ApiQuery({ name: "status", enum: ReviewStatus, required: false })
  @ApiQuery({ name: "page", type: Number, required: false })
  @ApiQuery({ name: "limit", type: Number, required: false })
  @ApiResponse({ status: 200, description: "University reviews" })
  async getUniversityReviews(
    @Param("id", ParseIntPipe) id: number,
    @Query() filters: any
  ) {
    return this.universityService.getUniversityReviews(id, filters);
  }

  @Get(":id/statistics")
  @ApiTags("University - Public")
  @ApiOperation({ summary: "Get university review statistics" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Review statistics" })
  async getReviewStatistics(@Param("id", ParseIntPipe) id: number) {
    return this.universityService.getReviewStatistics(id);
  }

  @Get(":id/analytics")
  @ApiTags("University - Public")
  @ApiOperation({ summary: "Get university analytics" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "University analytics" })
  async getUniversityAnalytics(@Param("id", ParseIntPipe) id: number) {
    return this.universityService.getUniversityAnalytics(id);
  }

  // Protected APIs (require authentication)
  @Post(":id/reviews")
  @ApiTags("University - User")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create university review" })
  @ApiParam({ name: "id", type: Number })
  @ApiBody({ description: "Review data" })
  @ApiResponse({ status: 201, description: "Review created" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async createUniversityReview(
    @Param("id", ParseIntPipe) universityId: number,
    @Body() reviewData: any,
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
  @ApiParam({ name: "id", type: Number })
  @ApiBody({ description: "Updated review data" })
  @ApiResponse({ status: 200, description: "Review updated" })
  @ApiResponse({ status: 404, description: "Review not found" })
  async updateUniversityReview(
    @Param("id", ParseIntPipe) id: number,
    @Body() reviewData: any,
    @Request() req: any
  ) {
    return this.universityService.updateUniversityReview(id, reviewData);
  }

  @Delete("reviews/:id")
  @ApiTags("University - User")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete university review" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Review deleted" })
  @ApiResponse({ status: 404, description: "Review not found" })
  async deleteUniversityReview(@Param("id", ParseIntPipe) id: number) {
    return this.universityService.deleteUniversityReview(id);
  }

  @Get("recommendations")
  @ApiTags("University - User")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get recommended universities" })
  @ApiResponse({ status: 200, description: "Recommended universities" })
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
  @ApiBody({ description: "University data" })
  @ApiResponse({ status: 201, description: "University created" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async createUniversity(@Body() universityData: any) {
    return this.universityService.createUniversity(universityData);
  }

  @Put(":id")
  @ApiTags("University - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @RequirePermissions("university:update")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update university (Admin only)" })
  @ApiParam({ name: "id", type: Number })
  @ApiBody({ description: "Updated university data" })
  @ApiResponse({ status: 200, description: "University updated" })
  @ApiResponse({ status: 404, description: "University not found" })
  async updateUniversity(
    @Param("id", ParseIntPipe) id: number,
    @Body() universityData: any
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
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "University deleted" })
  @ApiResponse({ status: 404, description: "University not found" })
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
  @ApiParam({ name: "id", type: Number })
  @ApiBody({ description: "Status data" })
  @ApiResponse({ status: 200, description: "Status updated" })
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
  @ApiParam({ name: "id", type: Number })
  @ApiBody({ description: "Feature data" })
  @ApiResponse({ status: 200, description: "Feature status updated" })
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
  @ApiParam({ name: "id", type: Number })
  @ApiBody({ description: "Verification data" })
  @ApiResponse({ status: 200, description: "Verification status updated" })
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
  @ApiParam({ name: "id", type: Number })
  @ApiBody({ description: "Moderation data" })
  @ApiResponse({ status: 200, description: "Review moderated" })
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
  @ApiOperation({ summary: "Upload university image (Admin only)" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Image uploaded" })
  @UseInterceptors(FileInterceptor("image"))
  async uploadUniversityImage(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() file: any
  ) {
    return this.universityService.uploadUniversityImage(id, file);
  }

  @Post("compare")
  @ApiOperation({ summary: "Compare universities" })
  @ApiBody({ description: "University IDs to compare" })
  @ApiResponse({ status: 200, description: "Comparison results" })
  async compareUniversities(@Body("universityIds") universityIds: number[]) {
    return this.universityService.compareUniversities(universityIds);
  }

  @Get(":id/report/:type")
  @ApiTags("University - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @RequirePermissions("university:read")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Generate university report (Admin only)" })
  @ApiParam({ name: "id", type: Number })
  @ApiParam({ name: "type", type: String })
  @ApiResponse({ status: 200, description: "Report generated" })
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
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "University insights" })
  async getUniversityInsights(@Param("id", ParseIntPipe) id: number) {
    return this.universityService.getUniversityInsights(id);
  }
}
