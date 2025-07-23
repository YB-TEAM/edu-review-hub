import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { IEmailVerificationService } from "./email-verification.service.interface";
import { IEmailService } from "./email.service.interface";
import { IUserRepository } from "@/domain/repositories/user.repository.interface";
import { IEmailVerificationRepository } from "@/domain/repositories/email-verification.repository.interface";
import {
  EmailVerificationType,
  EmailVerificationStatus,
} from "@/infrastructure/database/entities/email-verification.entity";

@Injectable()
export class EmailVerificationService implements IEmailVerificationService {
  constructor(
    @Inject("IEmailService")
    private readonly emailService: IEmailService,
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    @Inject("IEmailVerificationRepository")
    private readonly emailVerificationRepository: IEmailVerificationRepository,
    private readonly jwtService: JwtService
  ) {}

  async sendEmailVerification(
    userId: number,
    email: string,
    username: string
  ): Promise<void> {
    // Invalidate any existing verification tokens
    await this.emailVerificationRepository.invalidateByUserId(
      userId,
      EmailVerificationType.EMAIL_VERIFICATION
    );

    // Generate OTP 6 số
    const otp = this.generateOtp();

    // Create verification record
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

    await this.emailVerificationRepository.create({
      userId,
      email,
      otp,
      type: EmailVerificationType.EMAIL_VERIFICATION,
      status: EmailVerificationStatus.PENDING,
      expiresAt,
    });

    // Send email (gửi OTP)
    await this.emailService.sendEmailVerification(email, otp, username);
  }

  async verifyEmail(otp: string, email: string): Promise<boolean> {
    const verification = await this.emailVerificationRepository.findByOtpAndEmail(
      otp,
      email
    );

    if (!verification) {
      throw new NotFoundException("Invalid verification code");
    }

    if (verification.status !== EmailVerificationStatus.PENDING) {
      throw new BadRequestException("Code has already been used or expired");
    }

    if (verification.expiresAt < new Date()) {
      await this.emailVerificationRepository.update(verification.id, {
        status: EmailVerificationStatus.EXPIRED,
      });
      throw new BadRequestException("Verification code has expired");
    }

    if (verification.type !== EmailVerificationType.EMAIL_VERIFICATION) {
      throw new BadRequestException("Invalid code type");
    }

    // Update verification status
    await this.emailVerificationRepository.update(verification.id, {
      status: EmailVerificationStatus.VERIFIED,
      verifiedAt: new Date(),
    });

    // Update user email verification status
    await this.userRepository.update(verification.userId, {
      emailVerifiedAt: new Date(),
      isVerified: true,
    });

    return true;
  }

  async sendPasswordReset(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return;
    }

    // Invalidate any existing reset tokens
    await this.emailVerificationRepository.invalidateByUserId(
      user.id,
      EmailVerificationType.PASSWORD_RESET
    );

    // Generate OTP 6 số
    const otp = this.generateOtp();

    // Create verification record
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour

    await this.emailVerificationRepository.create({
      userId: user.id,
      email,
      otp,
      type: EmailVerificationType.PASSWORD_RESET,
      status: EmailVerificationStatus.PENDING,
      expiresAt,
    });

    // Send email (gửi OTP)
    await this.emailService.sendPasswordReset(email, otp, user.username);
  }

  async resetPassword(otp: string, email: string, newPassword: string): Promise<boolean> {
    const verification = await this.emailVerificationRepository.findByOtpAndEmail(
      otp,
      email
    );

    if (!verification) {
      throw new NotFoundException("Invalid reset code");
    }

    if (verification.status !== EmailVerificationStatus.PENDING) {
      throw new BadRequestException("Code has already been used or expired");
    }

    if (verification.expiresAt < new Date()) {
      await this.emailVerificationRepository.update(verification.id, {
        status: EmailVerificationStatus.EXPIRED,
      });
      throw new BadRequestException("Reset code has expired");
    }

    if (verification.type !== EmailVerificationType.PASSWORD_RESET) {
      throw new BadRequestException("Invalid code type");
    }

    // Hash new password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update user password
    await this.userRepository.update(verification.userId, {
      passwordHash,
    });

    // Update verification status
    await this.emailVerificationRepository.update(verification.id, {
      status: EmailVerificationStatus.USED,
      verifiedAt: new Date(),
    });

    return true;
  }

  async sendEmailChangeConfirmation(
    userId: number,
    newEmail: string,
    username: string
  ): Promise<void> {
    // Cập nhật luôn email mới vào user
    await this.userRepository.update(userId, {
      email: newEmail,
    });

    // Generate OTP 6 số
    const otp = this.generateOtp();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

    await this.emailVerificationRepository.create({
      userId,
      email: newEmail,
      otp,
      type: EmailVerificationType.EMAIL_CHANGE,
      status: EmailVerificationStatus.PENDING,
      expiresAt,
    });

    // Gửi email xác nhận tới email mới (gửi OTP)
    await this.emailService.sendEmailChangeConfirmation(
      newEmail,
      otp,
      username
    );
  }

  async confirmEmailChange(otp: string, email: string): Promise<boolean> {
    const verification = await this.emailVerificationRepository.findByOtpAndEmail(
      otp,
      email
    );

    if (!verification) {
      throw new NotFoundException("Invalid confirmation code");
    }

    if (verification.status !== EmailVerificationStatus.PENDING) {
      throw new BadRequestException("Code has already been used or expired");
    }

    if (verification.expiresAt < new Date()) {
      await this.emailVerificationRepository.update(verification.id, {
        status: EmailVerificationStatus.EXPIRED,
      });
      throw new BadRequestException("Confirmation code has expired");
    }

    if (verification.type !== EmailVerificationType.EMAIL_CHANGE) {
      throw new BadRequestException("Invalid code type");
    }

    // Update user email
    await this.userRepository.update(verification.userId, {
      email: verification.email,
      emailVerifiedAt: new Date(),
      isVerified: true,
    });

    // Update verification status
    await this.emailVerificationRepository.update(verification.id, {
      status: EmailVerificationStatus.VERIFIED,
      verifiedAt: new Date(),
    });

    return true;
  }

  async resendVerification(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.emailVerifiedAt) {
      throw new BadRequestException("Email is already verified");
    }

    await this.sendEmailVerification(user.id, email, user.username);
  }

  private generateOtp(): string {
    // Sinh mã OTP 6 số, chỉ số
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
