import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RefreshToken } from "../entities/refresh-token.entity";

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repository: Repository<RefreshToken>
  ) {}

  async createAndSave(data: Partial<RefreshToken>): Promise<RefreshToken> {
    const token = this.repository.create(data);
    return this.repository.save(token);
  }

  async findByToken(token: string): Promise<RefreshToken | undefined> {
    return this.repository.findOne({
      where: { refresh_token: token, is_active: true },
    });
  }

  async deactivateToken(token: string): Promise<void> {
    await this.repository.update(
      { refresh_token: token },
      { is_active: false }
    );
  }

  async deactivateAllForUser(userId: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(RefreshToken)
      .set({ is_active: false })
      .where("user.id = :userId", { userId })
      .execute();
  }

  async findByUserAndDevice(
    userId: number,
    deviceId: string
  ): Promise<RefreshToken | undefined> {
    return this.repository.findOne({
      where: {
        user: { id: userId },
        device_id: deviceId,
        is_active: true,
      },
      relations: ["user"],
    });
  }

  async deactivateByUserAndDevice(
    userId: number,
    deviceId: string
  ): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(RefreshToken)
      .set({ is_active: false })
      .where("user.id = :userId AND device_id = :deviceId", {
        userId,
        deviceId,
      })
      .execute();
  }

  async save(data: Partial<RefreshToken>): Promise<RefreshToken> {
    return this.repository.save(data);
  }

  async update(id: number, data: Partial<RefreshToken>): Promise<void> {
    await this.repository.update(id, data);
  }

  async findOne(options: any): Promise<RefreshToken | undefined> {
    return this.repository.findOne(options);
  }
}
