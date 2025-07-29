import { UserDevice } from "@/infrastructure/database/entities/user-device.entity";

export interface IUserDeviceRepository {
  createOrUpdate(data: Partial<UserDevice>): Promise<UserDevice>;
  findByUserId(userId: number): Promise<UserDevice[]>;
  findByDeviceId(deviceId: string): Promise<UserDevice | undefined>;
  findAll(
    limit: number,
    offset: number,
    filters?: { userId?: number; deviceType?: string }
  ): Promise<UserDevice[]>;
  getTotalCount(filters?: {
    userId?: number;
    deviceType?: string;
  }): Promise<number>;
  deleteByUserId(userId: number): Promise<void>;
  deleteByDeviceId(deviceId: string): Promise<void>;
}
