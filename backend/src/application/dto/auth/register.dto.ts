import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AccountType } from "@/infrastructure/database/entities/user.entity";

export class RegisterDto {
  @ApiProperty({ description: "Username for the account" })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({ description: "Email address" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Password for the account" })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @ApiPropertyOptional({ description: "Phone number" })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({
    description: "Account type",
    enum: AccountType,
    default: AccountType.STUDENT,
  })
  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType = AccountType.STUDENT;

  @ApiPropertyOptional({ description: "Device ID" })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiPropertyOptional({ description: "IP address" })
  @IsOptional()
  @IsString()
  ip?: string;

  @ApiPropertyOptional({ description: "User agent" })
  @IsOptional()
  @IsString()
  userAgent?: string;
}
