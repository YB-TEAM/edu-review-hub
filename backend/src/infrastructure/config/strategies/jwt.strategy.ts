import { Injectable, UnauthorizedException, Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { IUserRepository } from "@/domain/repositories/user.repository.interface";
import { UserStatus } from "@/infrastructure/database/entities/user.entity";
import { IUserRoleRepository } from "@/domain/repositories/user-role.repository.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    @Inject("IUserRoleRepository")
    private readonly userRoleRepository: IUserRoleRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findById(payload.sub);

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("User not found or inactive");
    }

    // Load user roles with permissions
    const userRoles = await this.userRoleRepository.findByUserId(user.id);

    const roles = [];
    for (const userRole of userRoles) {
      if (userRole.role && userRole.role.permissions) {
        roles.push({
          id: userRole.role.id,
          name: userRole.role.name,
          permissions: userRole.role.permissions,
        });
      }
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      accountType: user.accountType,
      roles: roles,
    };
  }
}
