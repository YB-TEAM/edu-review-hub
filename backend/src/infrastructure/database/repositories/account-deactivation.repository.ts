import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThan } from "typeorm";
import {
  AccountDeactivation,
  DeactivationStatus,
  DeactivationType,
} from "../entities/account-deactivation.entity";
import { IAccountDeactivationRepository } from "@/domain/repositories/account-deactivation.repository.interface";

@Injectable()
export class AccountDeactivationRepository
  implements IAccountDeactivationRepository
{
  constructor(
    @InjectRepository(AccountDeactivation)
    private readonly accountDeactivationRepository: Repository<AccountDeactivation>
  ) {}

  async create(
    deactivation: Partial<AccountDeactivation>
  ): Promise<AccountDeactivation> {
    const newDeactivation =
      this.accountDeactivationRepository.create(deactivation);
    return this.accountDeactivationRepository.save(newDeactivation);
  }

  async findByUserId(userId: number): Promise<AccountDeactivation[]> {
    return this.accountDeactivationRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
  }

  async findActiveByUserId(
    userId: number
  ): Promise<AccountDeactivation | null> {
    return this.accountDeactivationRepository.findOne({
      where: {
        userId,
        status: DeactivationStatus.COMPLETED,
        type: DeactivationType.DEACTIVATE,
      },
      order: { createdAt: "DESC" },
    });
  }

  async update(
    id: number,
    deactivation: Partial<AccountDeactivation>
  ): Promise<AccountDeactivation> {
    await this.accountDeactivationRepository.update(id, deactivation);
    return this.accountDeactivationRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.accountDeactivationRepository.delete(id);
  }

  async findScheduledDeletions(): Promise<AccountDeactivation[]> {
    const now = new Date();
    return this.accountDeactivationRepository.find({
      where: {
        type: DeactivationType.DELETE,
        status: DeactivationStatus.COMPLETED,
        scheduledDeletionAt: LessThan(now),
      },
    });
  }

  async cancelPendingDeactivations(userId: number): Promise<void> {
    await this.accountDeactivationRepository.update(
      { userId, status: DeactivationStatus.PENDING },
      { status: DeactivationStatus.CANCELLED }
    );
  }
}
