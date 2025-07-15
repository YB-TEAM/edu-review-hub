import { Injectable, Inject } from "@nestjs/common";
import { IUserActivityRepository } from "@/domain/repositories/user-activity.repository.interface";
import { IUserActivityService } from "./user-activity.service.interface";
import { ActivityType } from "@/infrastructure/database/entities/user-activity.entity";

@Injectable()
export class UserActivityService implements IUserActivityService {
  constructor(
    @Inject("IUserActivityRepository")
    private readonly userActivityRepository: IUserActivityRepository
  ) {}

  async logActivity(
    userId: number,
    activityType: ActivityType,
    description: string,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.userActivityRepository.create({
      userId,
      activityType,
      description,
      metadata,
      ipAddress,
      userAgent,
    });
  }

  async logProfileActivity(
    userId: number,
    activityType: ActivityType,
    oldData?: any,
    newData?: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    let description = "";
    let metadata: Record<string, any> = {};

    switch (activityType) {
      case ActivityType.PROFILE_CREATED:
        description = "Tạo hồ sơ cá nhân mới";
        metadata = { newData };
        break;

      case ActivityType.PROFILE_UPDATED:
        description = "Cập nhật hồ sơ cá nhân";
        metadata = {
          oldData: this.sanitizeProfileData(oldData),
          newData: this.sanitizeProfileData(newData),
          changedFields: this.getChangedFields(oldData, newData),
        };
        break;

      case ActivityType.PROFILE_DELETED:
        description = "Xóa hồ sơ cá nhân";
        metadata = { oldData: this.sanitizeProfileData(oldData) };
        break;

      case ActivityType.AVATAR_UPLOADED:
        description = "Tải lên ảnh đại diện mới";
        metadata = {
          oldAvatar: oldData?.avatarUrl,
          newAvatar: newData?.avatarUrl,
        };
        break;

      case ActivityType.AVATAR_DELETED:
        description = "Xóa ảnh đại diện";
        metadata = { oldAvatar: oldData?.avatarUrl };
        break;

      default:
        description = "Thao tác hồ sơ cá nhân";
        metadata = { oldData, newData };
    }

    await this.logActivity(
      userId,
      activityType,
      description,
      metadata,
      ipAddress,
      userAgent
    );
  }

  async getUserActivities(
    userId: number,
    limit: number = 50,
    offset: number = 0
  ): Promise<any[]> {
    const activities = await this.userActivityRepository.findByUserId(
      userId,
      limit,
      offset
    );
    return activities.map((activity) => ({
      id: activity.id,
      activityType: activity.activityType,
      description: activity.description,
      metadata: activity.metadata,
      ipAddress: activity.ipAddress,
      userAgent: activity.userAgent,
      createdAt: activity.createdAt,
    }));
  }

  async getActivityCount(userId: number): Promise<number> {
    return this.userActivityRepository.getActivityCount(userId);
  }

  async cleanupOldActivities(daysOld: number = 365): Promise<void> {
    await this.userActivityRepository.deleteOldActivities(daysOld);
  }

  private sanitizeProfileData(data: any): any {
    if (!data) return null;

    // Loại bỏ thông tin nhạy cảm
    const sanitized = { ...data };
    delete sanitized.passwordHash;
    delete sanitized.password;
    delete sanitized.token;
    delete sanitized.refreshToken;

    return sanitized;
  }

  private getChangedFields(oldData: any, newData: any): string[] {
    if (!oldData || !newData) return [];

    const changedFields: string[] = [];
    const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);

    for (const key of allKeys) {
      if (oldData[key] !== newData[key]) {
        changedFields.push(key);
      }
    }

    return changedFields;
  }
}
