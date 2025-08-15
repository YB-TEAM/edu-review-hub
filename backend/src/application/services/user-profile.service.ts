import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { IUserProfileRepository } from "@/domain/repositories/user-profile.repository.interface";
import { IUserRepository } from "@/domain/repositories/user.repository.interface";
import { IUserActivityService } from "./user-activity.service.interface";
import { UpdateProfileDto } from "../dto/profile/update-profile.dto";
import { ProfileResponseDto } from "../dto/profile/profile-response.dto";
import { AdminUpdateUserDto } from "../dto/profile/admin-update-user.dto";
import { IUserProfileService } from "./user-profile.service.interface";
import { ActivityType } from "@/infrastructure/database/entities/user-activity.entity";
import { UserRole } from "@/infrastructure/database/entities/user.entity";

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

  // Utility function to check if user has a role
  private hasRole(user: any, roleName: string): boolean {
    return (
      Array.isArray(user.roles) &&
      user.roles.some((role) => role.name === roleName)
    );
  }

  async getProfile(userId: number): Promise<ProfileResponseDto> {
    const profile = await this.userProfileRepository.findByUserId(userId);
    if (!profile) throw new NotFoundException("Profile not found");
    
    // Lấy thêm user data để có accountType
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException("User not found");
    
    // Kết hợp profile và user data
    const profileWithAccountType = {
      ...profile,
      accountType: user.accountType
    };
    
    return profileWithAccountType as unknown as ProfileResponseDto;
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
      const user = await this.userRepository.findById(userId);

      profile = await this.userProfileRepository.create({
        ...updateData,
        userId,
        displayName: updateData.displayName || user.username,
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

    // Lấy thêm user data để có accountType
    const user = await this.userRepository.findById(userId);
    
    // Kết hợp profile và user data
    const profileWithAccountType = {
      ...profile,
      accountType: user?.accountType || 'student'
    };

    return profileWithAccountType as unknown as ProfileResponseDto;
  }

  async adminUpdateUser(
    adminId: number,
    targetUserId: number,
    dto: AdminUpdateUserDto,
    ipAddress?: string,
    userAgent?: string
  ): Promise<ProfileResponseDto> {
    // Kiểm tra quyền admin

    // Kiểm tra người dùng target
    const targetUser = await this.userRepository.findById(targetUserId);
    if (!targetUser) {
      throw new NotFoundException("User not found");
    }

    // Kiểm tra username unique nếu có thay đổi username (BR27)
    if (dto.displayName && dto.displayName !== targetUser.username) {
      const existingUser = await this.userRepository.findByUsername(
        dto.displayName
      );
      if (existingUser) {
        throw new ConflictException("Username already exists");
      }
    }

    // Cập nhật thông tin user
    const userUpdateData: any = {};
    if (dto.displayName) userUpdateData.username = dto.displayName;
    if (Object.keys(userUpdateData).length > 0) {
      await this.userRepository.update(targetUserId, userUpdateData);
    }

    // Cập nhật profile nếu có
    let profile = await this.userProfileRepository.findByUserId(targetUserId);
    const oldData = profile ? { ...profile } : null;

    const profileUpdateData: any = {};
    if (dto.firstName) profileUpdateData.firstName = dto.firstName;
    if (dto.lastName) profileUpdateData.lastName = dto.lastName;
    if (dto.firstName || dto.lastName) {
      // Compose displayName from firstName and lastName if provided, else fallback to existing
      const firstName = dto.firstName || (profile ? profile.firstName : "");
      const lastName = dto.lastName || (profile ? profile.lastName : "");
      profileUpdateData.displayName = `${firstName} ${lastName}`.trim();
    }
    if (dto.displayName) profileUpdateData.displayName = dto.displayName;

    if (!profile && Object.keys(profileUpdateData).length > 0) {
      profile = await this.userProfileRepository.create({
        ...profileUpdateData,
        userId: targetUserId,
      });

      // Ghi log tạo profile bởi admin
      await this.userActivityService.logProfileActivity(
        targetUserId,
        ActivityType.PROFILE_CREATED,
        null,
        profile,
        ipAddress,
        userAgent
      );
    } else if (profile && Object.keys(profileUpdateData).length > 0) {
      profile = await this.userProfileRepository.update(
        profile.id,
        profileUpdateData
      );

      // Ghi log cập nhật profile bởi admin
      await this.userActivityService.logProfileActivity(
        targetUserId,
        ActivityType.PROFILE_UPDATED,
        oldData,
        profile,
        ipAddress,
        userAgent
      );
    }

    // Trả về profile đã cập nhật hoặc tạo profile mới nếu chưa có
    if (!profile) {
      profile = await this.userProfileRepository.create({
        userId: targetUserId,
        displayName: dto.displayName || "",
        firstName: dto.firstName || "",
        lastName: dto.lastName || "",
      });
    }

    // Lấy thêm user data để có accountType
    const user = await this.userRepository.findById(targetUserId);
    
    // Kết hợp profile và user data
    const profileWithAccountType = {
      ...profile,
      accountType: user?.accountType || 'student'
    };

    return profileWithAccountType as unknown as ProfileResponseDto;
  }

  async getAllUsers(): Promise<ProfileResponseDto[]> {
    const profiles = await this.userProfileRepository.findAll();
    
    // Lấy thêm user data để có accountType cho mỗi profile
    const profilesWithAccountType = await Promise.all(
      profiles.map(async (profile) => {
        const user = await this.userRepository.findById(profile.userId);
        return {
          ...profile,
          accountType: user?.accountType || 'student' // fallback to student if user not found
        };
      })
    );
    
    return profilesWithAccountType as unknown as ProfileResponseDto[];
  }
}
