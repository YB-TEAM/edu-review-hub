import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Inject,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { IEmailVerificationService } from "@/application/services/email-verification.service.interface";
import { ForgotPasswordDto } from "@/application/dto/auth/forgot-password.dto";
import { ResetPasswordDto } from "@/application/dto/auth/reset-password.dto";
import { VerifyEmailDto } from "@/application/dto/auth/verify-email.dto";
import { JwtAuthGuard } from "@/presentation/guards/jwt-auth.guard";
import { IsString, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyOtpDto {
  @ApiProperty({
    description: "Mã OTP 6 số để xác thực email",
    example: "123456",
  })
  @IsString()
  otp: string;

  @ApiProperty({
    description: "Email cần xác thực",
    example: "student@example.com",
  })
  @IsEmail()
  email: string;
}

export class ResendVerificationDto {
  @ApiProperty({
    description: "Email cần gửi lại mã xác thực",
    example: "student@example.com",
  })
  @IsEmail()
  email: string;
}

export class ResetPasswordWithOtpDto {
  @ApiProperty({
    description: "Mã OTP 6 số để reset password",
    example: "123456",
  })
  @IsString()
  otp: string;

  @ApiProperty({
    description: "Email của tài khoản",
    example: "student@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Mật khẩu mới",
    example: "newpassword123",
  })
  @IsString()
  newPassword: string;
}

@ApiTags("Email Verification")
@Controller("email-verification")
export class EmailVerificationController {
  constructor(
    @Inject("IEmailVerificationService")
    private readonly emailVerificationService: IEmailVerificationService
  ) {}

  @Post("verify-email")
  @ApiOperation({
    summary: "Verify email address with OTP",
    description: "Xác thực email bằng mã OTP 6 số được gửi qua email",
  })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({
    status: 200,
    description: "Email verified successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid or expired code",
  })
  @ApiResponse({
    status: 404,
    description: "Code not found",
  })
  async verifyEmail(
    @Body() verifyOtpDto: VerifyOtpDto
  ): Promise<{ message: string }> {
    await this.emailVerificationService.verifyEmail(
      verifyOtpDto.otp,
      verifyOtpDto.email
    );
    return { message: "Email verified successfully" };
  }

  @Post("resend-verification")
  @ApiOperation({
    summary: "Resend email verification",
    description:
      "Gửi lại mã OTP xác thực email nếu chưa nhận được hoặc mã đã hết hạn",
  })
  @ApiBody({ type: ResendVerificationDto })
  @ApiResponse({
    status: 200,
    description: "Verification email sent successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Email already verified",
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  async resendVerification(
    @Body() resendVerificationDto: ResendVerificationDto
  ): Promise<{ message: string }> {
    await this.emailVerificationService.resendVerification(
      resendVerificationDto.email
    );
    return { message: "Verification email sent successfully" };
  }

  @Post("forgot-password")
  @ApiOperation({ summary: "Send password reset email" })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: "Password reset email sent",
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto
  ): Promise<{ message: string }> {
    await this.emailVerificationService.sendPasswordReset(
      forgotPasswordDto.email
    );
    return { message: "Password reset email sent" };
  }

  @Post("reset-password")
  @ApiOperation({ summary: "Reset password with OTP" })
  @ApiBody({ type: ResetPasswordWithOtpDto })
  @ApiResponse({
    status: 200,
    description: "Password reset successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid or expired code",
  })
  @ApiResponse({
    status: 404,
    description: "Code not found",
  })
  async resetPassword(
    @Body() resetPasswordWithOtpDto: ResetPasswordWithOtpDto
  ): Promise<{ message: string }> {
    await this.emailVerificationService.resetPassword(
      resetPasswordWithOtpDto.otp,
      resetPasswordWithOtpDto.email,
      resetPasswordWithOtpDto.newPassword
    );
    return { message: "Password reset successfully" };
  }

  @Post("change-email")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Request email change" })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: "Email change confirmation sent",
  })
  async changeEmail(
    @Request() req,
    @Body() forgotPasswordDto: ForgotPasswordDto
  ): Promise<{ message: string }> {
    await this.emailVerificationService.sendEmailChangeConfirmation(
      req.user.id,
      forgotPasswordDto.email,
      req.user.username
    );
    return { message: "Email change confirmation sent" };
  }

  @Post("confirm-email-change")
  @ApiOperation({ summary: "Confirm email change with OTP" })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({
    status: 200,
    description: "Email changed successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid or expired code",
  })
  @ApiResponse({
    status: 404,
    description: "Code not found",
  })
  async confirmEmailChange(
    @Body() verifyOtpDto: VerifyOtpDto
  ): Promise<{ message: string }> {
    await this.emailVerificationService.confirmEmailChange(
      verifyOtpDto.otp,
      verifyOtpDto.email
    );
    return { message: "Email changed successfully" };
  }
}
