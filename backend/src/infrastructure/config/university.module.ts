import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversityController } from '../../presentation/controllers/university.controller';
import { UniversityService } from '../../application/services/university.service';
import { University } from '../database/entities/university.entity';
import { UniversityReview } from '../database/entities/university-review.entity';
import { UniversityReviewCriterion } from '../database/entities/university-review-criterion.entity';
import { UniversityReviewScore } from '../database/entities/university-review-score.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      University,
      UniversityReview,
      UniversityReviewCriterion,
      UniversityReviewScore,
    ]),
  ],
  controllers: [UniversityController],
  providers: [
    {
      provide: 'IUniversityService',
      useClass: UniversityService,
    },
  ],
  exports: ['IUniversityService'],
})
export class UniversityModule {}
