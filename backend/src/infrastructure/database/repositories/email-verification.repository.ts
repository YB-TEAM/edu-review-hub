import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThan } from "typeorm";
import {
  EmailVerification,
  EmailVerificationType,
  EmailVerificationStatus,
} from "../entities/email-verification.entity";
import { IEmailVerificationRepository } from "@/domain/repositories/email-verification.repository.interface";

@Injectable()
export class EmailVerificationRepository
  implements IEmailVerificationRepository
{
  constructor(
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>
  ) {}

  async create(
    verification: Partial<EmailVerification>
  ): Promise<EmailVerification> {
    const newVerification =
      this.emailVerificationRepository.create(verification);
    return this.emailVerificationRepository.save(newVerification);
  }

  async findByToken(token: string): Promise<EmailVerification | null> {
    return this.emailVerificationRepository.findOne({
      where: { token },
      relations: ["user"],
    });
  }

  async findByEmailAndType(
    email: string,
    type: EmailVerificationType
  ): Promise<EmailVerification | null> {
    return this.emailVerificationRepository.findOne({
      where: { email, type },
      relations: ["user"],
    });
  }

  async update(
    id: number,
    verification: Partial<EmailVerification>
  ): Promise<EmailVerification> {
    await this.emailVerificationRepository.update(id, verification);
    return this.emailVerificationRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.emailVerificationRepository.delete(id);
  }

  async deleteExpired(): Promise<void> {
    const now = new Date();
    await this.emailVerificationRepository.delete({
      expiresAt: LessThan(now),
    });
  }

  async invalidateByUserId(
    userId: number,
    type: EmailVerificationType
  ): Promise<void> {
    await this.emailVerificationRepository.update(
      { userId, type, status: EmailVerificationStatus.PENDING },
      { status: EmailVerificationStatus.EXPIRED }
    );
  }
}
