export interface IEmailService {
  sendEmailVerification(
    email: string,
    token: string,
    username: string
  ): Promise<void>;
  sendPasswordReset(
    email: string,
    token: string,
    username: string
  ): Promise<void>;
  sendWelcomeEmail(email: string, username: string): Promise<void>;
  sendEmailChangeConfirmation(
    email: string,
    token: string,
    username: string
  ): Promise<void>;
  sendAccountDeactivated(
    email: string,
    username: string,
    reason?: string
  ): Promise<void>;
  sendAccountDeleted(
    email: string,
    username: string,
    reason?: string
  ): Promise<void>;
}
