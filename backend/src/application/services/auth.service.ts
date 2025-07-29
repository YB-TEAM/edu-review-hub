import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
  ForbiddenException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { IAuthService } from "./auth.service.interface";
import { IUserRepository } from "@/domain/repositories/user.repository.interface";
import { IEmailVerificationService } from "./email-verification.service.interface";
import { RegisterDtoWithIp } from "../dto/auth/register.dto";
import { LoginDtoWithIp } from "../dto/auth/login.dto";
import { AuthResponseDto } from "../dto/auth/auth-response.dto";
import { RegisterResponseDto } from "../dto/auth/register-response.dto";
import {
  User,
  UserStatus,
} from "@/infrastructure/database/entities/user.entity";
import { UserProfile } from "@/infrastructure/database/entities/user-profile.entity";
import { RefreshTokenRepository } from "@/infrastructure/database/repositories/refresh-token.repository";
import { RefreshToken } from "@/infrastructure/database/entities/refresh-token.entity";
import { UserSessionRepository } from "@/infrastructure/database/repositories/user-session.repository";
import { UserSession } from "@/infrastructure/database/entities/user-session.entity";

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    @Inject("IEmailVerificationService")
    private readonly emailVerificationService: IEmailVerificationService,
    private readonly jwtService: JwtService,
    @Inject("IUserProfileRepository")
    private readonly userProfileRepository: any, // Nên dùng interface IUserProfileRepository nếu có
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userSessionRepository: UserSessionRepository
  ) {}

  async register(registerDto: RegisterDtoWithIp): Promise<RegisterResponseDto> {
    const { username, email, password, phone, accountType } = registerDto;

    // Check if user already exists
    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new ConflictException("Email already exists");
    }

    const existingUserByUsername = await this.userRepository.findByUsername(
      username
    );
    if (existingUserByUsername) {
      throw new ConflictException("Username already exists");
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 1. Tạo user trước (chưa có profile)
    const user = await this.userRepository.create({
      username,
      email,
      passwordHash,
      phone,
      accountType,
      status: UserStatus.ACTIVE,
      isVerified: false,
    });

    // 2. Tạo profile, gán userId
    await this.userProfileRepository.create({
      displayName: username,
      userId: user.id,
      firstName: "",
      lastName: "",
    });

    // Send email verification
    await this.emailVerificationService.sendEmailVerification(
      user.id,
      email,
      username
    );

    return {
      message:
        "Registration successful. Please check your email to verify your account.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        accountType: user.accountType,
        status: user.status,
        isVerified: user.isVerified,
      },
    };
  }

  async login(loginDto: LoginDtoWithIp): Promise<AuthResponseDto> {
    const { identifier, password, deviceId, rememberMe, ip, userAgent } =
      loginDto;

    // Validate user
    const user = await this.validateUser(identifier, password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Check if account is active
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("Account is not active");
    }

    // Check if email is verified
    if (!user.isVerified || !user.emailVerifiedAt) {
      throw new ForbiddenException(
        "Email not verified. Please check your email and verify your account."
      );
    }

    // Update last login
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
      lastActivityAt: new Date(),
      failedLoginAttempts: 0,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user, rememberMe);

    // Save refresh token to DB
    await this.refreshTokenRepository.save({
      user: user,
      refresh_token: tokens.refreshToken,
      device_id: deviceId,
      ip_address: ip,
      user_agent: userAgent,
      is_active: true,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    // Create user session
    const sessionExpiry = rememberMe
      ? 30 * 24 * 60 * 60 * 1000
      : 7 * 24 * 60 * 60 * 1000; // 30 days or 7 days
    await this.userSessionRepository.createAndSave({
      userId: user.id,
      sessionToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      deviceId: deviceId,
      ipAddress: ip,
      userAgent: userAgent,
      isActive: true,
      lastActivityAt: new Date(),
      expiresAt: new Date(Date.now() + sessionExpiry),
    });

    return {
      ...tokens,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        accountType: user.accountType,
        status: user.status,
        isVerified: user.isVerified,
      },
    };
  }

  async refreshToken(
    refreshToken: string,
    deviceId?: string
  ): Promise<AuthResponseDto> {
    try {
      // 1. Verify JWT
      const payload = this.jwtService.verify(refreshToken);

      // 2. Tìm token trong DB theo giá trị token
      const dbToken = await this.refreshTokenRepository.findOne({
        where: { refresh_token: refreshToken },
        relations: ["user"],
      });

      // 3. Kiểm tra các điều kiện
      if (
        !dbToken ||
        !dbToken.is_active ||
        (dbToken.expires_at && dbToken.expires_at < new Date()) ||
        (deviceId && dbToken.device_id !== deviceId)
      ) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const user = dbToken.user;
      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      // 4. Thu hồi token cũ
      await this.refreshTokenRepository.update(dbToken.id, {
        is_active: false,
      });

      // 5. Sinh token mới và lưu vào DB
      const tokens = await this.generateTokens(user);
      await this.refreshTokenRepository.save({
        user: user,
        refresh_token: tokens.refreshToken,
        device_id: dbToken.device_id,
        ip_address: dbToken.ip_address,
        user_agent: dbToken.user_agent,
        is_active: true,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      // Update session
      await this.userSessionRepository.updateLastActivity(tokens.accessToken);

      return {
        ...tokens,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          accountType: user.accountType,
          status: user.status,
          isVerified: user.isVerified,
        },
      };
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logout(userId: number, sessionToken?: string): Promise<void> {
    try {
      console.log(`Logging out user ID: ${userId}`);

      if (sessionToken) {
        // Logout specific session
        await this.userSessionRepository.deactivateSession(sessionToken);
        console.log(`Deactivated session: ${sessionToken}`);
      } else {
        // Logout all sessions for user
        await this.userSessionRepository.deactivateAllForUser(userId);
        console.log(`Deactivated all sessions for user ID: ${userId}`);
      }

      // Thu hồi tất cả refresh tokens của user
      await this.refreshTokenRepository.deactivateAllForUser(userId);
      console.log(`Deactivated all refresh tokens for user ID: ${userId}`);

      // Update last activity
      await this.userRepository.update(userId, {
        lastActivityAt: new Date(),
      });
      console.log(`Updated last activity for user ID: ${userId}`);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  async validateUser(
    identifier: string,
    password: string
  ): Promise<User | null> {
    const user = await this.userRepository.findByEmailOrUsername(identifier);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      // Increment failed login attempts
      await this.userRepository.update(user.id, {
        failedLoginAttempts: user.failedLoginAttempts + 1,
      });
      return null;
    }

    return user;
  }

  private async generateTokens(
    user: User,
    rememberMe = false
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
  }> {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      accountType: user.accountType,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: rememberMe ? "30d" : "7d",
    });

    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60, // seconds
    };
  }
}
