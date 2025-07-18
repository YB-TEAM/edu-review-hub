import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Inject,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from "@nestjs/swagger";
import { IAccountDeactivationService } from "@/application/services/account-deactivation.service.interface";
import { DeactivateAccountDto } from "@/application/dto/auth/deactivate-account.dto";
import { DeleteAccountDto } from "@/application/dto/auth/delete-account.dto";
import { ReactivateAccountDto } from "@/application/dto/auth/reactivate-account.dto";
import { JwtAuthGuard } from "@/presentation/guards/jwt-auth.guard";

@ApiTags("Account Deactivation")
@Controller("account")
export class AccountDeactivationController {
  constructor(
    @Inject("IAccountDeactivationService")
    private readonly accountDeactivationService: IAccountDeactivationService
  ) {}

  @Post("deactivate")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Deactivate account (user-initiated)" })
  @ApiBody({ type: DeactivateAccountDto })
  @ApiResponse({ status: 200, description: "Account deactivated successfully" })
  async deactivate(
    @Request() req,
    @Body() dto: DeactivateAccountDto
  ): Promise<{ message: string }> {
    await this.accountDeactivationService.deactivateAccount(
      req.user.id,
      dto,
      req.ip,
      req.headers["user-agent"]
    );
    return { message: "Account deactivated successfully" };
  }

  @Post("delete")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Delete account (user-initiated)" })
  @ApiBody({ type: DeleteAccountDto })
  @ApiResponse({ status: 200, description: "Account deleted successfully" })
  async delete(
    @Request() req,
    @Body() dto: DeleteAccountDto
  ): Promise<{ message: string }> {
    await this.accountDeactivationService.deleteAccount(
      req.user.id,
      dto,
      req.ip,
      req.headers["user-agent"]
    );
    return { message: "Account deleted successfully" };
  }

  @Post("reactivate")
  @ApiOperation({ summary: "Reactivate account (user-initiated)" })
  @ApiBody({ type: ReactivateAccountDto })
  @ApiResponse({ status: 200, description: "Account reactivated successfully" })
  async reactivate(
    @Body() dto: ReactivateAccountDto
  ): Promise<{ message: string }> {
    await this.accountDeactivationService.reactivateAccount(dto);
    return { message: "Account reactivated successfully" };
  }
}
