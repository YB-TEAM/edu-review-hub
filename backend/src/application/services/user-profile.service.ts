import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { IUserProfileRepository } from "@/domain/repositories/user-profile.repository.interface";
import { IUserRepository } from "@/domain/repositories/user.repository.interface";
import { IUserActivityService } from "./user-activity.service.interface";
import { UpdateProfileDto } from "../dto/profile/update-profile.dto";
import { ProfileResponseDto } from "../dto/profile/profile-response.dto";
import { IUserProfileService } from "./user-profile.service.interface";
import { ActivityType } from "@/infrastructure/database/entities/user-activity.entity";

@Injectable()
export class UserProfileService implements IUserProfileService {
  constructor(
    @Inject("IUserProfileRepository")
    private readonly userProfileRepository: IUserProfileRepository,
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    @Inject("IUserActivityService")
    private readonly userActivityService: IUserActivityService
  ) {}

  async getProfile(userId: number): Promise<ProfileResponseDto> {
    const profile = await this.userProfileRepository.findByUserId(userId);
    if (!profile) throw new NotFoundException("Profile not found");
    return profile as unknown as ProfileResponseDto;
  }

  async updateProfile(
    userId: number,
    dto: UpdateProfileDto,
    ipAddress?: string,
    userAgent?: string
  ): Promise<ProfileResponseDto> {
    let profile = await this.userProfileRepository.findByUserId(userId);
    const oldData = profile ? { ...profile } : null;

    // Chuyển dateOfBirth sang Date nếu có
    const updateData: any = { ...dto };
    if (dto.dateOfBirth) {
      updateData.dateOfBirth = new Date(dto.dateOfBirth);
    }

    if (!profile) {
      profile = await this.userProfileRepository.create({
        ...updateData,
        userId,
      });

      // Ghi log tạo profile
      await this.userActivityService.logProfileActivity(
        userId,
        ActivityType.PROFILE_CREATED,
        null,
        profile,
        ipAddress,
        userAgent
      );
    } else {
      profile = await this.userProfileRepository.update(profile.id, updateData);

      // Ghi log cập nhật profile
      await this.userActivityService.logProfileActivity(
        userId,
        ActivityType.PROFILE_UPDATED,
        oldData,
        profile,
        ipAddress,
        userAgent
      );
    }

    return profile as unknown as ProfileResponseDto;
  }

  async deleteProfile(
    userId: number,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    const profile = await this.userProfileRepository.findByUserId(userId);
    if (profile) {
      const oldData = { ...profile };
      await this.userProfileRepository.delete(profile.id);

      // Ghi log xóa profile
      await this.userActivityService.logProfileActivity(
        userId,
        ActivityType.PROFILE_DELETED,
        oldData,
        null,
        ipAddress,
        userAgent
      );
    }
  }
}
