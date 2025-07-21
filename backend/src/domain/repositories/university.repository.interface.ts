import { University } from "@/infrastructure/database/entities/university.entity";

export interface IUniversityRepository {
  findById(id: number): Promise<University | null>;
  findAll(options?: { skip?: number; take?: number }): Promise<University[]>;
  create(university: Partial<University>): Promise<University>;
  update(id: number, university: Partial<University>): Promise<University>;
  delete(id: number): Promise<void>;
}
