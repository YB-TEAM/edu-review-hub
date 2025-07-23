import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Inject,
  ParseIntPipe,
  Patch,
  Query,
} from "@nestjs/common";
import { JwtAuthGuard } from "@/presentation/guards/jwt-auth.guard";
import { RolesGuard } from "@/presentation/guards/role.guard";
import { Roles } from "@/presentation/decorators/roles.decorator";
import { RequirePermissions } from "@/presentation/decorators/permissions.decorator";
import { UserRole } from "@/infrastructure/database/entities/user.entity";
import { IUniversityService } from "@/application/services/university.service.interface";
import { CreateUniversityDto } from "@/application/dto/university/create-university.dto";
import { UpdateUniversityDto } from "@/application/dto/university/update-university.dto";
import { UniversityResponseDto } from "@/application/dto/university/university-response.dto";
import { ApiBearerAuth, ApiTags, ApiBody } from "@nestjs/swagger";
import { PaginationDto } from "@/application/dto/pagination/pagination.dto";

@ApiTags("University")
@Controller("universities")
export class UniversityController {
  constructor(
    @Inject("IUniversityService")
    private readonly universityService: IUniversityService
  ) {}

  @Get()
  @RequirePermissions("university:read")
  async findAll(
    @Query() pagination: PaginationDto
  ): Promise<UniversityResponseDto[]> {
    return this.universityService.findAll(pagination);
  }

  @Get(":id")
  @RequirePermissions("university:read")
  async findById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<UniversityResponseDto> {
    return this.universityService.findById(id);
  }

  @Post()
  @RequirePermissions("university:create")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiBody({ type: CreateUniversityDto })
  async create(
    @Body() dto: CreateUniversityDto
  ): Promise<UniversityResponseDto> {
    return this.universityService.create(dto);
  }

  @Patch(":id")
  @RequirePermissions("university:update")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiBody({ type: UpdateUniversityDto })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateUniversityDto
  ): Promise<UniversityResponseDto> {
    return this.universityService.update(id, dto);
  }

  @Delete(":id")
  @RequirePermissions("university:delete")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth("JWT-auth")
  async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.universityService.delete(id);
  }
}
