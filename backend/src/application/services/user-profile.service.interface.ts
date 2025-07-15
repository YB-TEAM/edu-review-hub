import { UpdateProfileDto } from "../dto/profile/update-profile.dto";
import { ProfileResponseDto } from "../dto/profile/profile-response.dto";

export interface IUserProfileService {
  getProfile(userId: number): Promise<ProfileResponseDto>;
  updateProfile(
    userId: number,
    dto: UpdateProfileDto,
    ipAddress?: string,
    userAgent?: string
  ): Promise<ProfileResponseDto>;
  deleteProfile(
    userId: number,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void>;
}
