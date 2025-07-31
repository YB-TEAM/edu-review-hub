import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRole } from "../entities/user-role.entity";
import { IUserRoleRepository } from "@/domain/repositories/user-role.repository.interface";

@Injectable()
export class UserRoleRepository implements IUserRoleRepository {
  constructor(
    @InjectRepository(UserRole)
    private readonly repository: Repository<UserRole>
  ) {}

  create(data: Partial<UserRole>): UserRole {
    return this.repository.create(data);
  }

  async save(userRole: UserRole): Promise<UserRole> {
    return this.repository.save(userRole);
  }

  async findByUserId(userId: number): Promise<UserRole[]> {
    return this.repository.find({
      where: { user_id: userId },
      relations: ["role", "role.permissions"],
    });
  }

  async findByUserIdAndRoleId(
    userId: number,
    roleId: number
  ): Promise<UserRole | null> {
    return this.repository.findOne({
      where: { user_id: userId, role_id: roleId },
    });
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.repository.delete({ user_id: userId });
  }
}
