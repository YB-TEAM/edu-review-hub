import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { University } from "@/infrastructure/database/entities/university.entity";
import { UniversityController } from "@/presentation/controllers/university.controller";
import { UniversityService } from "@/application/services/university.service";
import { UniversityRepository } from "@/infrastructure/database/repositories/university.repository";

@Module({
  imports: [TypeOrmModule.forFeature([University])],
  controllers: [UniversityController],
  providers: [
    { provide: "IUniversityService", useClass: UniversityService },
    { provide: "IUniversityRepository", useClass: UniversityRepository },
  ],
  exports: [
    { provide: "IUniversityService", useClass: UniversityService },
    { provide: "IUniversityRepository", useClass: UniversityRepository },
  ],
})
export class UniversityModule {}
