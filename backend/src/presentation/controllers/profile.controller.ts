import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
  UploadedFile,
  Post,
  HttpCode,
  HttpStatus,
  Inject,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@/presentation/guards/jwt-auth.guard";
import { IUserProfileService } from "@/application/services/user-profile.service.interface";
import { UpdateProfileDto } from "@/application/dto/profile/update-profile.dto";
import { ProfileResponseDto } from "@/application/dto/profile/profile-response.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "@/infrastructure/services/cloudinary.service";

@ApiTags("User Profile")
@Controller("profile")
export class ProfileController {
  constructor(
    @Inject("IUserProfileService")
    private readonly userProfileService: IUserProfileService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async getMe(@Request() req): Promise<ProfileResponseDto> {
    return this.userProfileService.getProfile(req.user.id);
  }

  @Put("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update current user profile" })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async updateMe(
    @Request() req,
    @Body() dto: UpdateProfileDto
  ): Promise<ProfileResponseDto> {
    return this.userProfileService.updateProfile(
      req.user.id,
      dto,
      req.ip,
      req.headers["user-agent"]
    );
  }

  @Delete("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete current user profile" })
  @ApiResponse({ status: 200, description: "Profile deleted" })
  async deleteMe(@Request() req): Promise<{ message: string }> {
    await this.userProfileService.deleteProfile(
      req.user.id,
      req.ip,
      req.headers["user-agent"]
    );
    return { message: "Profile deleted" };
  }

  @Post("me/avatar")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Upload avatar for current user (Cloudinary)" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: { file: { type: "string", format: "binary" } },
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  async uploadAvatar(
    @Request() req,
    @UploadedFile() file: any
  ): Promise<{ avatarUrl: string }> {
    // Lấy profile hiện tại để lấy avatar cũ
    const profile = await this.userProfileService.getProfile(req.user.id);
    const oldAvatarUrl = profile?.avatarUrl;
    let oldPublicId: string | undefined;
    if (oldAvatarUrl) {
      // Cloudinary url dạng: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<folder>/<public_id>.<ext>
      // Tách public_id từ url
      const match = oldAvatarUrl.match(/\/upload\/.*?\/(.*)\.[a-zA-Z0-9]+$/);
      if (match && match[1]) {
        oldPublicId = match[1];
      }
    }
    // Xóa ảnh cũ nếu có
    if (oldPublicId) {
      await this.cloudinaryService.deleteImage(oldPublicId);
    }
    // Upload ảnh mới vào folder "avatars"
    const result = await this.cloudinaryService.uploadImage(file, "avatars");
    await this.userProfileService.updateProfile(req.user.id, {
      avatarUrl: result.secure_url,
    });
    return { avatarUrl: result.secure_url };
  }
}
