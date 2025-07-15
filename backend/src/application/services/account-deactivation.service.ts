import {
  Injectable,
  Inject,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { IAccountDeactivationService } from "./account-deactivation.service.interface";
import { IUserRepository } from "@/domain/repositories/user.repository.interface";
import { IAccountDeactivationRepository } from "@/domain/repositories/account-deactivation.repository.interface";
import { IEmailService } from "./email.service.interface";
import { DeactivateAccountDto } from "../dto/auth/deactivate-account.dto";
import { DeleteAccountDto } from "../dto/auth/delete-account.dto";
import { ReactivateAccountDto } from "../dto/auth/reactivate-account.dto";
import {
  AccountDeactivation,
  DeactivationType,
  DeactivationStatus,
} from "@/infrastructure/database/entities/account-deactivation.entity";
import { UserStatus } from "@/infrastructure/database/entities/user.entity";
import { UserSession } from "@/infrastructure/database/entities/user-session.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AccountDeactivationService implements IAccountDeactivationService {
  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    @Inject("IAccountDeactivationRepository")
    private readonly accountDeactivationRepository: IAccountDeactivationRepository,
    @Inject("IEmailService")
    private readonly emailService: IEmailService,
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>
  ) {}

  async deactivateAccount(
    userId: number,
    dto: DeactivateAccountDto,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UnauthorizedException("User not found");

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash
    );
    if (!isPasswordValid) throw new UnauthorizedException("Invalid password");

    // Cancel any pending deactivations
    await this.accountDeactivationRepository.cancelPendingDeactivations(userId);

    // Update user status
    await this.userRepository.update(userId, { status: UserStatus.INACTIVE });

    // Log deactivation
    await this.accountDeactivationRepository.create({
      userId,
      type: DeactivationType.DEACTIVATE,
      status: DeactivationStatus.COMPLETED,
      reason: dto.reason,
      deactivatedAt: new Date(),
      ipAddress,
      userAgent,
    });

    // Logout all sessions
    await this.userSessionRepository.update({ userId }, { isActive: false });

    // Send email notification
    await this.emailService.sendAccountDeactivated(
      user.email,
      user.username,
      dto.reason
    );
  }

  async deleteAccount(
    userId: number,
    dto: DeleteAccountDto,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UnauthorizedException("User not found");

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash
    );
    if (!isPasswordValid) throw new UnauthorizedException("Invalid password");

    // Cancel any pending deactivations
    await this.accountDeactivationRepository.cancelPendingDeactivations(userId);

    // Soft delete user (or set status to DELETED)
    await this.userRepository.update(userId, {
      status: UserStatus.DELETED,
      deletedAt: new Date(),
    });

    // Log deletion
    await this.accountDeactivationRepository.create({
      userId,
      type: DeactivationType.DELETE,
      status: DeactivationStatus.COMPLETED,
      reason: dto.reason,
      deactivatedAt: new Date(),
      isPermanent: dto.confirmPermanentDeletion,
      ipAddress,
      userAgent,
      scheduledDeletionAt: dto.confirmPermanentDeletion ? null : undefined,
    });

    // Logout all sessions
    await this.userSessionRepository.update({ userId }, { isActive: false });

    // Send email notification
    await this.emailService.sendAccountDeleted(
      user.email,
      user.username,
      dto.reason
    );
  }

  async reactivateAccount(dto: ReactivateAccountDto): Promise<void> {
    // Find user by email and username
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user || user.username !== dto.username)
      throw new UnauthorizedException("User not found");

    if (user.status !== UserStatus.INACTIVE)
      throw new BadRequestException("Account is not deactivated");

    // Reactivate user
    await this.userRepository.update(user.id, { status: UserStatus.ACTIVE });

    // Log reactivation
    await this.accountDeactivationRepository.create({
      userId: user.id,
      type: DeactivationType.REACTIVATE,
      status: DeactivationStatus.COMPLETED,
      reactivatedAt: new Date(),
    });
  }
}
