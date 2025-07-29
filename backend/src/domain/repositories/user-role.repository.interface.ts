import { UserRole } from "@/infrastructure/database/entities/user-role.entity";

export interface IUserRoleRepository {
  create(data: Partial<UserRole>): UserRole;
  save(userRole: UserRole): Promise<UserRole>;
  findByUserId(userId: number): Promise<UserRole[]>;
  findByUserIdAndRoleId(
    userId: number,
    roleId: number
  ): Promise<UserRole | null>;
  deleteByUserId(userId: number): Promise<void>;
}
