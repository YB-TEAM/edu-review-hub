import { EntityRepository, Repository } from "typeorm";
import { RefreshToken } from "../entities/refresh-token.entity";

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {
  async createAndSave(data: Partial<RefreshToken>): Promise<RefreshToken> {
    const token = this.create(data);
    return this.save(token);
  }

  async findByToken(token: string): Promise<RefreshToken | undefined> {
    return this.findOne({ where: { refresh_token: token, is_active: true } });
  }

  async deactivateToken(token: string): Promise<void> {
    await this.update({ refresh_token: token }, { is_active: false });
  }

  async deactivateAllForUser(userId: number): Promise<void> {
    await this.update({ user: { id: userId } }, { is_active: false });
  }

  async findByUserAndDevice(userId: number, deviceId: string): Promise<RefreshToken | undefined> {
    return this.findOne({ where: { user: { id: userId }, device_id: deviceId, is_active: true } });
  }

  async deactivateByUserAndDevice(userId: number, deviceId: string): Promise<void> {
    await this.update({ user: { id: userId }, device_id: deviceId }, { is_active: false });
  }
} 