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
} from "@nestjs/common";
import { JwtAuthGuard } from "@/presentation/guards/jwt-auth.guard";
import { RolesGuard } from "@/presentation/guards/role.guard";
import { Roles } from "@/presentation/decorators/roles.decorator";
import { UserRole } from "@/infrastructure/database/entities/user.entity";
import { IUniversityReviewCriterionService } from "@/application/services/university-review-criterion.service.interface";
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";

@Controller("university-review-criteria")
export class UniversityReviewCriterionController {
  constructor(
    @Inject("IUniversityReviewCriterionService")
    private readonly criterionService: IUniversityReviewCriterionService
  ) {}

  @Get()
  @ApiTags("Review Criteria - Public")
  @ApiOperation({ summary: "Get all review criteria" })
  @ApiResponse({
    status: 200,
    description: "List of all review criteria",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          description: { type: "string" },
          weight: { type: "number" },
          is_active: { type: "boolean" },
        },
      },
    },
  })
  async getAll() {
    return this.criterionService.findAll();
  }

  @Post()
  @ApiTags("Review Criteria - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Create new review criterion (Super Admin only)" })
  @ApiBody({
    description: "Criterion data",
    schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          example: "Chất lượng giảng dạy",
          description: "Criterion name",
        },
        description: {
          type: "string",
          example: "Đánh giá chất lượng giảng dạy của giảng viên",
          description: "Criterion description",
        },
      },
      required: ["name"],
    },
  })
  @ApiResponse({
    status: 201,
    description: "Criterion created successfully",
    schema: {
      type: "object",
      properties: {
        id: { type: "number" },
        name: { type: "string" },
        description: { type: "string" },
        weight: { type: "number" },
        is_active: { type: "boolean" },
        created_at: { type: "string" },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Requires Super Admin role",
  })
  async create(
    @Body("name") name: string,
    @Body("description") description?: string
  ) {
    return this.criterionService.create(name, description);
  }

  @Patch(":id")
  @ApiTags("Review Criteria - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update review criterion (Super Admin only)" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Criterion ID",
  })
  @ApiBody({
    description: "Updated criterion data",
    schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          example: "Chất lượng giảng dạy",
          description: "Updated criterion name",
        },
        description: {
          type: "string",
          example: "Đánh giá chất lượng giảng dạy của giảng viên",
          description: "Updated criterion description",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Criterion updated successfully",
    schema: {
      type: "object",
      properties: {
        id: { type: "number" },
        name: { type: "string" },
        description: { type: "string" },
        weight: { type: "number" },
        is_active: { type: "boolean" },
        updated_at: { type: "string" },
      },
    },
  })
  @ApiResponse({ status: 404, description: "Criterion not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Requires Super Admin role",
  })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body("name") name: string,
    @Body("description") description?: string
  ) {
    return this.criterionService.update(id, name, description);
  }

  @Delete(":id")
  @ApiTags("Review Criteria - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Delete review criterion (Super Admin only)" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Criterion ID",
  })
  @ApiResponse({ status: 200, description: "Criterion deleted successfully" })
  @ApiResponse({ status: 404, description: "Criterion not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Requires Super Admin role",
  })
  async delete(@Param("id", ParseIntPipe) id: number) {
    return this.criterionService.delete(id);
  }
}
