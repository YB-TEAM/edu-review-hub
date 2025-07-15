import {
  UserActivity,
  ActivityType,
} from "@/infrastructure/database/entities/user-activity.entity";

export interface IUserActivityRepository {
  create(activity: Partial<UserActivity>): Promise<UserActivity>;
  findByUserId(
    userId: number,
    limit?: number,
    offset?: number
  ): Promise<UserActivity[]>;
  findByActivityType(
    activityType: ActivityType,
    limit?: number,
    offset?: number
  ): Promise<UserActivity[]>;
  findByUserIdAndActivityType(
    userId: number,
    activityType: ActivityType,
    limit?: number,
    offset?: number
  ): Promise<UserActivity[]>;
  getActivityCount(userId: number): Promise<number>;
  deleteOldActivities(daysOld: number): Promise<void>;
}
