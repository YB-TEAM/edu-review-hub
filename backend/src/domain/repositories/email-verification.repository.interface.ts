import {
  EmailVerification,
  EmailVerificationType,
  EmailVerificationStatus,
} from "@/infrastructure/database/entities/email-verification.entity";

export interface IEmailVerificationRepository {
  create(verification: Partial<EmailVerification>): Promise<EmailVerification>;
  findByToken(token: string): Promise<EmailVerification | null>;
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
}
