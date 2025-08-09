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
import { ApiTags, ApiBearerAuth, ApiBody } from "@nestjs/swagger";

@Controller("university-review-criteria")
export class UniversityReviewCriterionController {
  constructor(
    @Inject("IUniversityReviewCriterionService")
    private readonly criterionService: IUniversityReviewCriterionService
  ) {}

  @Get()
  @ApiTags("Review - Public")
  async getAll() {
    return this.criterionService.findAll();
  }

  @Post()
  @ApiTags("Review - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiBody({
    schema: {
      properties: { name: { type: "string" }, description: { type: "string" } },
    },
  })
  async create(
    @Body("name") name: string,
    @Body("description") description?: string
  ) {
    return this.criterionService.create(name, description);
  }

  @Patch(":id")
  @ApiTags("Review - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiBody({
    schema: {
      properties: { name: { type: "string" }, description: { type: "string" } },
    },
  })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body("name") name: string,
    @Body("description") description?: string
  ) {
    return this.criterionService.update(id, name, description);
  }

  @Delete(":id")
  @ApiTags("Review - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth("JWT-auth")
  async delete(@Param("id", ParseIntPipe) id: number) {
    return this.criterionService.delete(id);
  }
}
