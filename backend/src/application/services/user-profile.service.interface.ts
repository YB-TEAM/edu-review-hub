import { UpdateProfileDto } from "../dto/profile/update-profile.dto";
import { ProfileResponseDto } from "../dto/profile/profile-response.dto";
import { AdminUpdateUserDto } from "../dto/profile/admin-update-user.dto";
export interface IUserProfileService {
  getProfile(userId: number): Promise<ProfileResponseDto>;
  updateProfile(
    userId: number,
    dto: UpdateProfileDto,
    ipAddress?: string,
    userAgent?: string
  ): Promise<ProfileResponseDto>;
  adminUpdateUser(
    adminId: number,
    targetUserId: number,
    dto: AdminUpdateUserDto,
    ipAddress?: string,
    userAgent?: string
  ): Promise<ProfileResponseDto>;
  getAllUsers(): Promise<ProfileResponseDto[]>;
}
