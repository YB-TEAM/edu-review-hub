import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserSession } from "../entities/user-session.entity";

@Injectable()
export class UserSessionRepository {
  constructor(
    @InjectRepository(UserSession)
    private readonly repository: Repository<UserSession>
  ) {}

  async createAndSave(data: Partial<UserSession>): Promise<UserSession> {
    const session = this.repository.create(data);
    return this.repository.save(session);
  }

  async findBySessionToken(
    sessionToken: string
  ): Promise<UserSession | undefined> {
    return this.repository.findOne({
      where: { sessionToken },
    });
  }

  async findByUserId(userId: number): Promise<UserSession[]> {
    return this.repository.find({
      where: { userId },
    });
  }

  async deactivateSession(sessionToken: string): Promise<void> {
    await this.repository.update({ sessionToken }, { isActive: false });
  }

  async deactivateAllForUser(userId: number): Promise<void> {
    await this.repository.update({ userId }, { isActive: false });
  }

  async updateLastActivity(sessionToken: string): Promise<void> {
    await this.repository.update(
      { sessionToken },
      { lastActivityAt: new Date() }
    );
  }

  async findActiveSessionsByUser(userId: number): Promise<UserSession[]> {
    return this.repository.find({
      where: { userId, isActive: true },
    });
  }

  async save(data: Partial<UserSession>): Promise<UserSession> {
    const session = this.repository.create(data);
    return this.repository.save(session);
  }

  async findOne(options: any): Promise<UserSession | undefined> {
    return this.repository.findOne(options);
  }
}
