import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { IUniversityService } from "./university.service.interface";
import { IUniversityRepository } from "@/domain/repositories/university.repository.interface";
import { CreateUniversityDto } from "../dto/university/create-university.dto";
import { UpdateUniversityDto } from "../dto/university/update-university.dto";
import { UniversityResponseDto } from "../dto/university/university-response.dto";
import { PaginationDto } from "../dto/pagination/pagination.dto";

@Injectable()
export class UniversityService implements IUniversityService {
  constructor(
    @Inject("IUniversityRepository")
    private readonly universityRepository: IUniversityRepository
  ) {}

  async findAll(pagination?: PaginationDto): Promise<any> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;
    // Lấy tổng số trường
    const [universities, total] = await Promise.all([
      this.universityRepository.findAll({ skip, take: limit }),
      this.universityRepository.findAll().then((arr) => arr.length),
    ]);
    const data = universities.map((u) => this.toResponseDto(u));
    const limitPage = Math.ceil(total / limit);
    return {
      data,
      metadata: {
        pageSize: data.length,
        limitPage,
        currentPage: page,
        pageNumber: page,
        totalItems: total,
      },
    };
  }

  async findById(id: number): Promise<UniversityResponseDto> {
    const university = await this.universityRepository.findById(id);
    if (!university) throw new NotFoundException("University not found");
    return this.toResponseDto(university);
  }

  async create(dto: CreateUniversityDto): Promise<UniversityResponseDto> {
    const university = await this.universityRepository.create(dto);
    return this.toResponseDto(university);
  }

  async update(
    id: number,
    dto: UpdateUniversityDto
  ): Promise<UniversityResponseDto> {
    const university = await this.universityRepository.update(id, dto);
    if (!university) throw new NotFoundException("University not found");
    return this.toResponseDto(university);
  }

  async delete(id: number): Promise<void> {
    await this.universityRepository.delete(id);
  }

  private toResponseDto(u: any): UniversityResponseDto {
    return {
      id: u.id,
      name: u.name,
      location: u.location,
      description: u.description,
      logo_url: u.logo_url,
      created_at: u.created_at,
      updated_at: u.updated_at,
    };
  }
}
