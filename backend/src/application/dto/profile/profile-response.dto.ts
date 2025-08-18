import { ApiProperty } from "@nestjs/swagger";

export class ProfileResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() userId: number;
  @ApiProperty() firstName?: string;
  @ApiProperty() lastName?: string;
  @ApiProperty() displayName?: string;
  @ApiProperty() avatarUrl?: string;
  @ApiProperty() coverImageUrl?: string;
  @ApiProperty() bio?: string;
  @ApiProperty() dateOfBirth?: string;
  @ApiProperty() gender?: string;
  @ApiProperty() country?: string;
  @ApiProperty() city?: string;
  @ApiProperty() address?: string;
  @ApiProperty() timezone?: string;
  @ApiProperty() language?: string;
  @ApiProperty() universityName?: string;
  @ApiProperty() major?: string;
  @ApiProperty() graduationYear?: number;
  @ApiProperty() studentId?: string;
  @ApiProperty() isStudentVerified?: boolean;
  @ApiProperty() privacySettings?: any;
  @ApiProperty() notificationSettings?: any;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
  @ApiProperty({ 
    enum: ["student", "university_rep", "admin", "moderator", "super_admin"],
    description: "User account type/role"
  }) 
  accountType: string;
}
