import { ActivityType } from "@/infrastructure/database/entities/user-activity.entity";

export interface IUserActivityService {
  logActivity(
    userId: number,
    activityType: ActivityType,
    description: string,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void>;

  logProfileActivity(
    userId: number,
    activityType: ActivityType,
    oldData?: any,
    newData?: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void>;

  getUserActivities(
    userId: number,
    limit?: number,
    offset?: number
  ): Promise<any[]>;
  getActivityCount(userId: number): Promise<number>;
  cleanupOldActivities(daysOld?: number): Promise<void>;
}
