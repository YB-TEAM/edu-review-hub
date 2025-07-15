import { DeactivateAccountDto } from "../dto/auth/deactivate-account.dto";
import { DeleteAccountDto } from "../dto/auth/delete-account.dto";
import { ReactivateAccountDto } from "../dto/auth/reactivate-account.dto";

export interface IAccountDeactivationService {
  deactivateAccount(
    userId: number,
    dto: DeactivateAccountDto,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void>;
  deleteAccount(
    userId: number,
    dto: DeleteAccountDto,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void>;
  reactivateAccount(dto: ReactivateAccountDto): Promise<void>;
}
