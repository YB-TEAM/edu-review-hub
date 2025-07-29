import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThan } from "typeorm";
import { UserActivity, ActivityType } from "../entities/user-activity.entity";
import { IUserActivityRepository } from "@/domain/repositories/user-activity.repository.interface";

@Injectable()
export class UserActivityRepository implements IUserActivityRepository {
  constructor(
    @InjectRepository(UserActivity)
    private readonly userActivityRepository: Repository<UserActivity>
  ) {}

  async create(activity: Partial<UserActivity>): Promise<UserActivity> {
    const newActivity = this.userActivityRepository.create(activity);
    return this.userActivityRepository.save(newActivity);
  }

  async findByUserId(
    userId: number,
    limit: number = 50,
    offset: number = 0
  ): Promise<UserActivity[]> {
    return this.userActivityRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
      take: limit,
      skip: offset,
    });
  }

  async findByActivityType(
    activityType: ActivityType,
    limit: number = 50,
    offset: number = 0
  ): Promise<UserActivity[]> {
    return this.userActivityRepository.find({
      where: { activityType },
      order: { createdAt: "DESC" },
      take: limit,
      skip: offset,
    });
  }

  async findByUserIdAndActivityType(
    userId: number,
    activityType: ActivityType,
    limit: number = 50,
    offset: number = 0
  ): Promise<UserActivity[]> {
    return this.userActivityRepository.find({
      where: { userId, activityType },
      order: { createdAt: "DESC" },
      take: limit,
      skip: offset,
    });
  }

  async getActivityCount(userId: number): Promise<number> {
    return this.userActivityRepository.count({
      where: { userId },
    });
  }

  async deleteOldActivities(daysOld: number): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    await this.userActivityRepository.delete({
      createdAt: LessThan(cutoffDate),
    });
  }

  async findAll(
    limit: number,
    offset: number,
    filters?: { userId?: number; activityType?: string }
  ): Promise<UserActivity[]> {
    const queryBuilder = this.userActivityRepository
      .createQueryBuilder("activity")
      .leftJoinAndSelect("activity.user", "user")
      .orderBy("activity.createdAt", "DESC");

    if (filters?.userId) {
      queryBuilder.andWhere("activity.userId = :userId", {
        userId: filters.userId,
      });
    }

    if (filters?.activityType) {
      queryBuilder.andWhere("activity.activityType = :activityType", {
        activityType: filters.activityType,
      });
    }

    queryBuilder.skip(offset).take(limit);
    return queryBuilder.getMany();
  }

  async getTotalCount(filters?: {
    userId?: number;
    activityType?: string;
  }): Promise<number> {
    const queryBuilder =
      this.userActivityRepository.createQueryBuilder("activity");

    if (filters?.userId) {
      queryBuilder.andWhere("activity.userId = :userId", {
        userId: filters.userId,
      });
    }

    if (filters?.activityType) {
      queryBuilder.andWhere("activity.activityType = :activityType", {
        activityType: filters.activityType,
      });
    }

    return queryBuilder.getCount();
  }
}
