import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserProfile } from "../entities/user-profile.entity";
import { IUserProfileRepository } from "@/domain/repositories/user-profile.repository.interface";

@Injectable()
export class UserProfileRepository implements IUserProfileRepository {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>
  ) {}

  async findByUserId(userId: number): Promise<UserProfile | null> {
    return this.userProfileRepository.findOne({ where: { userId } });
  }

  async create(profile: Partial<UserProfile>): Promise<UserProfile> {
    const newProfile = this.userProfileRepository.create(profile);
    return this.userProfileRepository.save(newProfile);
  }

  async update(
    id: number,
    profile: Partial<UserProfile>
  ): Promise<UserProfile> {
    await this.userProfileRepository.update(id, profile);
    return this.userProfileRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.userProfileRepository.delete(id);
  }
}
