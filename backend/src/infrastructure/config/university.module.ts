import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UniversityController } from "../../presentation/controllers/university.controller";
import { UniversityService } from "../../application/services/university.service";
import { UniversityImageService } from "../../application/services/university-image.service";
import { UniversityImageRepository } from "../database/repositories/university-image.repository";
import { CloudinaryService } from "../services/cloudinary.service";
import { University } from "../database/entities/university.entity";
import { UniversityImage } from "../database/entities/university-image.entity";
import { UniversityReview } from "../database/entities/university-review.entity";
import { UniversityReviewCriterion } from "../database/entities/university-review-criterion.entity";
import { UniversityReviewScore } from "../database/entities/university-review-score.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      University,
      UniversityImage,
      UniversityReview,
      UniversityReviewCriterion,
      UniversityReviewScore,
    ]),
  ],
  controllers: [UniversityController],
  providers: [
    {
      provide: "IUniversityService",
      useClass: UniversityService,
    },
    UniversityImageService,
    UniversityImageRepository,
    CloudinaryService,
  ],
  exports: [
    "IUniversityService",
    UniversityImageService,
    UniversityImageRepository,
    CloudinaryService,
  ],
})
export class UniversityModule {}
