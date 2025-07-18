import { UserProfile } from "@/infrastructure/database/entities/user-profile.entity";

export interface IUserProfileRepository {
  findByUserId(userId: number): Promise<UserProfile | null>;
  create(profile: Partial<UserProfile>): Promise<UserProfile>;
  update(id: number, profile: Partial<UserProfile>): Promise<UserProfile>;
  delete(id: number): Promise<void>;
  findAll(): Promise<UserProfile[]>;
}
