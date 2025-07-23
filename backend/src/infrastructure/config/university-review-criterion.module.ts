import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UniversityReviewCriterion } from "@/infrastructure/database/entities/university-review-criterion.entity";
import { UniversityReviewCriterionController } from "@/presentation/controllers/university-review-criterion.controller";
import { UniversityReviewCriterionService } from "@/application/services/university-review-criterion.service";
import { UniversityReviewCriterionRepository } from "@/infrastructure/database/repositories/university-review-criterion.repository";

@Module({
  imports: [TypeOrmModule.forFeature([UniversityReviewCriterion])],
  controllers: [UniversityReviewCriterionController],
  providers: [
    {
      provide: "IUniversityReviewCriterionService",
      useClass: UniversityReviewCriterionService,
    },
    {
      provide: "IUniversityReviewCriterionRepository",
      useClass: UniversityReviewCriterionRepository,
    },
  ],
  exports: [
    {
      provide: "IUniversityReviewCriterionService",
      useClass: UniversityReviewCriterionService,
    },
    {
      provide: "IUniversityReviewCriterionRepository",
      useClass: UniversityReviewCriterionRepository,
    },
  ],
})
export class UniversityReviewCriterionModule {}
