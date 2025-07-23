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
import { ApiBearerAuth, ApiTags, ApiBody } from "@nestjs/swagger";

@ApiTags("University Review")
@Controller("university-reviews")
export class UniversityReviewController {
  constructor(
    @Inject("IUniversityReviewService")
    private readonly reviewService: IUniversityReviewService
  ) {}

  @Get(":id")
  @RequirePermissions("review:read")
  async getById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<UniversityReviewResponseDto> {
    return this.reviewService.findById(id);
  }

  @Get("/university/:universityId")
  @RequirePermissions("review:read")
  async getByUniversity(
    @Param("universityId", ParseIntPipe) universityId: number
  ): Promise<UniversityReviewResponseDto[]> {
    return this.reviewService.findByUniversity(universityId);
  }

  @Get("/user/:userId")
  @RequirePermissions("review:read")
  async getByUser(
    @Param("userId", ParseIntPipe) userId: number
  ): Promise<UniversityReviewResponseDto[]> {
    return this.reviewService.findByUser(userId);
  }

  @Post()
  @RequirePermissions("review:create")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth("JWT-auth")
  @ApiBody({ type: CreateUniversityReviewDto })
  async create(
    @Request() req,
    @Body() dto: CreateUniversityReviewDto
  ): Promise<UniversityReviewResponseDto> {
    return this.reviewService.create(req.user.id, dto);
  }

  @Patch(":id")
  @RequirePermissions("review:update")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth("JWT-auth")
  @ApiBody({ type: UpdateUniversityReviewDto })
  async update(
    @Request() req,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateUniversityReviewDto
  ): Promise<UniversityReviewResponseDto> {
    return this.reviewService.update(req.user.id, id, dto);
  }

  @Delete(":id")
  @RequirePermissions("review:delete")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth("JWT-auth")
  async delete(
    @Request() req,
    @Param("id", ParseIntPipe) id: number
  ): Promise<void> {
    return this.reviewService.delete(req.user.id, id);
  }

  // Moderate endpoint for admin, moderator
  @Patch(":id/moderate")
  @RequirePermissions("review:moderate")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth("JWT-auth")
  async moderate(
    @Param("id", ParseIntPipe) id: number,
    @Body("status") status: string
  ): Promise<UniversityReviewResponseDto> {
    return this.reviewService.moderate(id, status);
  }
}
