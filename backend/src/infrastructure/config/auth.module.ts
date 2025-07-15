import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthController } from "@/presentation/controllers/auth.controller";
import { EmailVerificationController } from "@/presentation/controllers/email-verification.controller";
import { AuthService } from "@/application/services/auth.service";
import { EmailService } from "@/infrastructure/services/email.service";
import { EmailVerificationService } from "@/application/services/email-verification.service";
import { UserRepository } from "@/infrastructure/database/repositories/user.repository";
import { EmailVerificationRepository } from "@/infrastructure/database/repositories/email-verification.repository";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

import { User } from "@/infrastructure/database/entities/user.entity";
import { UserProfile } from "@/infrastructure/database/entities/user-profile.entity";
import { UserSession } from "@/infrastructure/database/entities/user-session.entity";
import { UserDevice } from "@/infrastructure/database/entities/user-device.entity";
import { Role } from "@/infrastructure/database/entities/role.entity";
import { Permission } from "@/infrastructure/database/entities/permission.entity";
import { EmailVerification } from "@/infrastructure/database/entities/email-verification.entity";
import { AccountDeactivation } from "@/infrastructure/database/entities/account-deactivation.entity";
import { AccountDeactivationRepository } from "@/infrastructure/database/repositories/account-deactivation.repository";
import { AccountDeactivationService } from "@/application/services/account-deactivation.service";
import { AccountDeactivationController } from "@/presentation/controllers/account-deactivation.controller";
import { UserProfileRepository } from "@/infrastructure/database/repositories/user-profile.repository";
import { UserProfileService } from "@/application/services/user-profile.service";
import { ProfileController } from "@/presentation/controllers/profile.controller";
import { CloudinaryService } from "@/infrastructure/services/cloudinary.service";
import { UserActivity } from "@/infrastructure/database/entities/user-activity.entity";
import { UserActivityRepository } from "@/infrastructure/database/repositories/user-activity.repository";
import { UserActivityService } from "@/application/services/user-activity.service";
import { UserActivityController } from "@/presentation/controllers/user-activity.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserProfile,
      UserSession,
      UserDevice,
      Role,
      Permission,
      EmailVerification,
      AccountDeactivation,
      UserActivity,
    ]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRES_IN"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AuthController,
    EmailVerificationController,
    AccountDeactivationController,
    ProfileController,
    UserActivityController,
  ],
  providers: [
    AuthService,
    EmailService,
    EmailVerificationService,
    UserRepository,
    EmailVerificationRepository,
    AccountDeactivationService,
    AccountDeactivationRepository,
    UserProfileService,
    UserProfileRepository,
    CloudinaryService,
    UserActivityService,
    UserActivityRepository,
    JwtStrategy,
    LocalStrategy,
    {
      provide: "IAuthService",
      useClass: AuthService,
    },
    {
      provide: "IEmailService",
      useClass: EmailService,
    },
    {
      provide: "IEmailVerificationService",
      useClass: EmailVerificationService,
    },
    {
      provide: "IUserRepository",
      useClass: UserRepository,
    },
    {
      provide: "IEmailVerificationRepository",
      useClass: EmailVerificationRepository,
    },
    {
      provide: "IAccountDeactivationService",
      useClass: AccountDeactivationService,
    },
    {
      provide: "IAccountDeactivationRepository",
      useClass: AccountDeactivationRepository,
    },
    {
      provide: "IUserProfileService",
      useClass: UserProfileService,
    },
    {
      provide: "IUserProfileRepository",
      useClass: UserProfileRepository,
    },
    {
      provide: "IUserActivityService",
      useClass: UserActivityService,
    },
    {
      provide: "IUserActivityRepository",
      useClass: UserActivityRepository,
    },
  ],
  exports: [AuthService, UserRepository],
})
export class AuthModule {}
