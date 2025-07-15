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

@ApiTags("Email Verification")
@Controller("email-verification")
export class EmailVerificationController {
  constructor(
    @Inject("IEmailVerificationService")
    private readonly emailVerificationService: IEmailVerificationService
  ) {}

  @Post("verify-email")
  @ApiOperation({ summary: "Verify email address" })
  @ApiBody({ type: VerifyEmailDto })
  @ApiResponse({
    status: 200,
    description: "Email verified successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid or expired token",
  })
  @ApiResponse({
    status: 404,
    description: "Token not found",
  })
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto
  ): Promise<{ message: string }> {
    await this.emailVerificationService.verifyEmail(verifyEmailDto.token);
    return { message: "Email verified successfully" };
  }

  @Post("resend-verification")
  @ApiOperation({ summary: "Resend email verification" })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: "Verification email sent",
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
    @Body() forgotPasswordDto: ForgotPasswordDto
  ): Promise<{ message: string }> {
    await this.emailVerificationService.resendVerification(
      forgotPasswordDto.email
    );
    return { message: "Verification email sent" };
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
  @ApiOperation({ summary: "Reset password with token" })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: "Password reset successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid or expired token",
  })
  @ApiResponse({
    status: 404,
    description: "Token not found",
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto
  ): Promise<{ message: string }> {
    await this.emailVerificationService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword
    );
    return { message: "Password reset successfully" };
  }

  @Post("change-email")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
  @ApiOperation({ summary: "Confirm email change with token" })
  @ApiBody({ type: VerifyEmailDto })
  @ApiResponse({
    status: 200,
    description: "Email changed successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid or expired token",
  })
  @ApiResponse({
    status: 404,
    description: "Token not found",
  })
  async confirmEmailChange(
    @Body() verifyEmailDto: VerifyEmailDto
  ): Promise<{ message: string }> {
    await this.emailVerificationService.confirmEmailChange(
      verifyEmailDto.token
    );
    return { message: "Email changed successfully" };
  }
}
