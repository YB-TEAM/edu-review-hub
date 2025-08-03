import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from '../../presentation/controllers/dashboard.controller';
import { DashboardService } from '../../application/services/dashboard.service';
import { User } from '../database/entities/user.entity';
import { Blog } from '../database/entities/blog.entity';
import { UniversityReview } from '../database/entities/university-review.entity';
import { University } from '../database/entities/university.entity';
import { UserActivity } from '../database/entities/user-activity.entity';
import { UserDevice } from '../database/entities/user-device.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Blog,
      UniversityReview,
      University,
      UserActivity,
      UserDevice,
    ]),
  ],
  controllers: [DashboardController],
  providers: [
    {
      provide: 'IDashboardService',
      useClass: DashboardService,
    },
  ],
  exports: ['IDashboardService'],
})
export class DashboardModule {} 