import {
  AccountDeactivation,
  DeactivationType,
  DeactivationStatus,
} from "@/infrastructure/database/entities/account-deactivation.entity";

export interface IAccountDeactivationRepository {
  create(
    deactivation: Partial<AccountDeactivation>
  ): Promise<AccountDeactivation>;
  findByUserId(userId: number): Promise<AccountDeactivation[]>;
  findActiveByUserId(userId: number): Promise<AccountDeactivation | null>;
  update(
    id: number,
    deactivation: Partial<AccountDeactivation>
  ): Promise<AccountDeactivation>;
  delete(id: number): Promise<void>;
  findScheduledDeletions(): Promise<AccountDeactivation[]>;
  cancelPendingDeactivations(userId: number): Promise<void>;
}
