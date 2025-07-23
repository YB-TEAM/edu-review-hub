import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { University } from "../entities/university.entity";
import { IUniversityRepository } from "@/domain/repositories/university.repository.interface";

@Injectable()
export class UniversityRepository implements IUniversityRepository {
  constructor(
    @InjectRepository(University)
    private readonly universityRepository: Repository<University>
  ) {}

  async findById(id: number): Promise<University | null> {
    return this.universityRepository.findOne({ where: { id } });
  }

  async findAll(options?: {
    skip?: number;
    take?: number;
  }): Promise<University[]> {
    return this.universityRepository.find({
      skip: options?.skip,
      take: options?.take,
    });
  }

  async create(university: Partial<University>): Promise<University> {
    const newUniversity = this.universityRepository.create(university);
    return this.universityRepository.save(newUniversity);
  }

  async update(
    id: number,
    university: Partial<University>
  ): Promise<University> {
    await this.universityRepository.update(id, university);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.universityRepository.delete(id);
  }
}
