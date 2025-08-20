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
import { IUniversityReviewService } from "@/application/services/university-review.service.interface";
import { CreateUniversityReviewDto } from "@/application/dto/university/create-university-review.dto";
import { UpdateUniversityReviewDto } from "@/application/dto/university/update-university-review.dto";
import { UniversityReviewResponseDto } from "@/application/dto/university/university-review-response.dto";
import { ModerateUniversityReviewDto } from "@/application/dto/university/moderate-university-review.dto";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";

@Controller("university-reviews")
export class UniversityReviewController {
  constructor(
    @Inject("IUniversityReviewService")
    private readonly reviewService: IUniversityReviewService
  ) {}

  @Get(":id")
  @ApiTags("Review - Public")
  @ApiOperation({ summary: "Get review by ID" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Review ID",
  })
  @ApiResponse({
    status: 200,
    description: "Review details",
    type: UniversityReviewResponseDto,
  })
  @ApiResponse({ status: 404, description: "Review not found" })
  async getById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<UniversityReviewResponseDto> {
    return this.reviewService.findById(id);
  }

  @Get("/university/:universityId")
  @ApiTags("Review - Public")
  @ApiOperation({ summary: "Get all reviews for a specific university" })
  @ApiParam({
    name: "universityId",
    type: Number,
    description: "University ID",
  })
  @ApiResponse({
    status: 200,
    description: "List of reviews for the university",
    type: [UniversityReviewResponseDto],
  })
  async getByUniversity(
    @Param("universityId", ParseIntPipe) universityId: number
  ): Promise<UniversityReviewResponseDto[]> {
    return this.reviewService.findByUniversity(universityId);
  }

  @Get("/user/:userId")
  @ApiTags("Review - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get all reviews by a specific user (Super Admin only)",
  })
  @ApiParam({
    name: "userId",
    type: Number,
    description: "User ID",
  })
  @ApiResponse({
    status: 200,
    description: "List of reviews by the user",
    type: [UniversityReviewResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Requires Super Admin role",
  })
  async getByUser(
    @Param("userId", ParseIntPipe) userId: number
  ): Promise<UniversityReviewResponseDto[]> {
    return this.reviewService.findByUser(userId);
  }

  @Post()
  @ApiTags("Review - User")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Create a new university review (Student only)" })
  @ApiBody({
    type: CreateUniversityReviewDto,
    description: "Review data",
  })
  @ApiResponse({
    status: 201,
    description: "Review created successfully",
    type: UniversityReviewResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request - Invalid data" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Requires Student role",
  })
  async create(
    @Request() req,
    @Body() dto: CreateUniversityReviewDto
  ): Promise<UniversityReviewResponseDto> {
    return this.reviewService.create(req.user.id, dto);
  }

  @Patch(":id")
  @ApiTags("Review - User")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update a university review (Student only)" })
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
    description: "Review updated successfully",
    type: UniversityReviewResponseDto,
  })
  @ApiResponse({ status: 404, description: "Review not found" })
  @ApiResponse({ status: 400, description: "Bad request - Invalid data" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Requires Student role",
  })
  async update(
    @Request() req,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateUniversityReviewDto
  ): Promise<UniversityReviewResponseDto> {
    return this.reviewService.update(req.user.id, id, dto);
  }

  @Delete(":id")
  @ApiTags("Review - User")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Delete a university review (Student only)" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Review ID",
  })
  @ApiResponse({ status: 200, description: "Review deleted successfully" })
  @ApiResponse({ status: 404, description: "Review not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Requires Student role",
  })
  async delete(
    @Request() req,
    @Param("id", ParseIntPipe) id: number
  ): Promise<void> {
    return this.reviewService.delete(req.user.id, id);
  }

  // Moderate endpoint for admin, moderator, super_admin
  @Patch(":id/moderate")
  @ApiTags("Review - Moderator", "Review - Admin")
  @ApiOperation({
    summary: "Moderate a university review (Admin/Moderator only)",
  })
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
    description: "Review moderated successfully",
    type: UniversityReviewResponseDto,
  })
  @ApiResponse({ status: 404, description: "Review not found" })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid moderation data",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Requires Admin/Moderator role and permissions",
  })
  @ApiBearerAuth("JWT-auth")
  @RequirePermissions("review:moderate")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR)
  async moderate(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: ModerateUniversityReviewDto
  ): Promise<UniversityReviewResponseDto> {
    return this.reviewService.moderate(id, body.status);
  }
}
