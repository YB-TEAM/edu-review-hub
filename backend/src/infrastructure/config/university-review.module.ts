import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UniversityReview } from "@/infrastructure/database/entities/university-review.entity";
import { UniversityReviewScore } from "@/infrastructure/database/entities/university-review-score.entity";
import { UniversityReviewController } from "@/presentation/controllers/university-review.controller";
import { UniversityReviewService } from "@/application/services/university-review.service";
import { UniversityReviewRepository } from "@/infrastructure/database/repositories/university-review.repository";
import { UniversityReviewCriterionModule } from "./university-review-criterion.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UniversityReview, UniversityReviewScore]),
    UniversityReviewCriterionModule,
  ],
  controllers: [UniversityReviewController],
  providers: [
    { provide: "IUniversityReviewService", useClass: UniversityReviewService },
    {
      provide: "IUniversityReviewRepository",
      useClass: UniversityReviewRepository,
    },
  ],
  exports: [
    { provide: "IUniversityReviewService", useClass: UniversityReviewService },
    {
      provide: "IUniversityReviewRepository",
      useClass: UniversityReviewRepository,
    },
  ],
})
export class UniversityReviewModule {}
