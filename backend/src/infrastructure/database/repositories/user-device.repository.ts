import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserDevice, DeviceType } from "../entities/user-device.entity";

@Injectable()
export class UserDeviceRepository {
  constructor(
    @InjectRepository(UserDevice)
    private readonly repository: Repository<UserDevice>
  ) {}

  async createOrUpdate(data: Partial<UserDevice>): Promise<UserDevice> {
    const existing = await this.repository.findOne({
      where: { userId: data.userId, deviceId: data.deviceId },
    });

    if (existing) {
      // Update existing device
      await this.repository.update(existing.id, {
        ...data,
        lastUsedAt: new Date(),
        updatedAt: new Date(),
      });
      return this.repository.findOne({ where: { id: existing.id } });
    } else {
      // Create new device
      const device = this.repository.create({
        ...data,
        lastUsedAt: new Date(),
      });
      return this.repository.save(device);
    }
  }

  async findByUserId(userId: number): Promise<UserDevice[]> {
    return this.repository.find({
      where: { userId },
      order: { lastUsedAt: "DESC" },
    });
  }

  async findByDeviceId(deviceId: string): Promise<UserDevice | undefined> {
    return this.repository.findOne({
      where: { deviceId },
    });
  }

  async updateLastUsed(deviceId: string): Promise<void> {
    await this.repository.update({ deviceId }, { lastUsedAt: new Date() });
  }

  async markAsTrusted(deviceId: string): Promise<void> {
    await this.repository.update({ deviceId }, { isTrusted: true });
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.repository.delete({ userId });
  }

  async deleteByDeviceId(deviceId: string): Promise<void> {
    await this.repository.delete({ deviceId });
  }

  async save(data: Partial<UserDevice>): Promise<UserDevice> {
    const device = this.repository.create(data);
    return this.repository.save(device);
  }

  async findOne(options: any): Promise<UserDevice | undefined> {
    return this.repository.findOne(options);
  }

  async findAll(
    limit: number,
    offset: number,
    filters?: { userId?: number; deviceType?: string }
  ): Promise<UserDevice[]> {
    const queryBuilder = this.repository
      .createQueryBuilder("device")
      .leftJoinAndSelect("device.user", "user")
      .orderBy("device.lastUsedAt", "DESC");

    if (filters?.userId) {
      queryBuilder.andWhere("device.userId = :userId", {
        userId: filters.userId,
      });
    }

    if (filters?.deviceType) {
      queryBuilder.andWhere("device.deviceType = :deviceType", {
        deviceType: filters.deviceType,
      });
    }

    queryBuilder.skip(offset).take(limit);
    return queryBuilder.getMany();
  }

  async getTotalCount(filters?: {
    userId?: number;
    deviceType?: string;
  }): Promise<number> {
    const queryBuilder = this.repository.createQueryBuilder("device");

    if (filters?.userId) {
      queryBuilder.andWhere("device.userId = :userId", {
        userId: filters.userId,
      });
    }

    if (filters?.deviceType) {
      queryBuilder.andWhere("device.deviceType = :deviceType", {
        deviceType: filters.deviceType,
      });
    }

    return queryBuilder.getCount();
  }
}
