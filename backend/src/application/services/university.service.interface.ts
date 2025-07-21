import { CreateUniversityDto } from "../dto/university/create-university.dto";
import { UpdateUniversityDto } from "../dto/university/update-university.dto";
import { UniversityResponseDto } from "../dto/university/university-response.dto";
import { PaginationDto } from "../dto/pagination/pagination.dto";

export interface IUniversityService {
  findAll(pagination?: PaginationDto): Promise<UniversityResponseDto[]>;
  findById(id: number): Promise<UniversityResponseDto>;
  create(dto: CreateUniversityDto): Promise<UniversityResponseDto>;
  update(id: number, dto: UpdateUniversityDto): Promise<UniversityResponseDto>;
  delete(id: number): Promise<void>;
}
