import {
  EmailVerification,
  EmailVerificationType,
  EmailVerificationStatus,
} from "@/infrastructure/database/entities/email-verification.entity";

export interface IEmailVerificationRepository {
  create(verification: Partial<EmailVerification>): Promise<EmailVerification>;
  findByEmailAndType(
    email: string,
    type: EmailVerificationType
  ): Promise<EmailVerification | null>;
  update(
    id: number,
    verification: Partial<EmailVerification>
  ): Promise<EmailVerification>;
  delete(id: number): Promise<void>;
  deleteExpired(): Promise<void>;
  invalidateByUserId(
    userId: number,
    type: EmailVerificationType
  ): Promise<void>;
  findByOtpAndEmail(otp: string, email: string): Promise<EmailVerification | null>;
}
