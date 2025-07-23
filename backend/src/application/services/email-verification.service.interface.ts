import { EmailVerificationType } from "@/infrastructure/database/entities/email-verification.entity";
export interface IEmailVerificationService {
  sendEmailVerification(
    userId: number,
    email: string,
    username: string
  ): Promise<void>;
  verifyEmail(otp: string, email: string): Promise<boolean>;
  sendPasswordReset(email: string): Promise<void>;
  resetPassword(otp: string, email: string, newPassword: string): Promise<boolean>;
  sendEmailChangeConfirmation(
    userId: number,
    newEmail: string,
    username: string
  ): Promise<void>;
  confirmEmailChange(otp: string, email: string): Promise<boolean>;
  resendVerification(email: string): Promise<void>;
}
