import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { IAuthService } from "./auth.service.interface";
import { IUserRepository } from "@/domain/repositories/user.repository.interface";
import { IEmailVerificationService } from "./email-verification.service.interface";
import { RegisterDto } from "../dto/auth/register.dto";
import { LoginDto } from "../dto/auth/login.dto";
import { AuthResponseDto } from "../dto/auth/auth-response.dto";
import {
  User,
  UserStatus,
} from "@/infrastructure/database/entities/user.entity";
import { UserProfile } from "@/infrastructure/database/entities/user-profile.entity";
import { RefreshTokenRepository } from "@/infrastructure/database/repositories/refresh-token.repository";
import { RefreshToken } from "@/infrastructure/database/entities/refresh-token.entity";

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
    @Inject("RefreshTokenRepository")
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
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

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Save refresh token to DB
    await this.refreshTokenRepository.save({
      user: user,
      refresh_token: tokens.refreshToken,
      device_id: registerDto.deviceId,
      ip_address: registerDto.ip,
      user_agent: registerDto.userAgent,
      is_active: true,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
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

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { identifier, password, deviceId, rememberMe, ip, userAgent } = loginDto;

    // Validate user
    const user = await this.validateUser(identifier, password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Check if account is active
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("Account is not active");
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

  async refreshToken(refreshToken: string, deviceId?: string): Promise<AuthResponseDto> {
    try {
      // 1. Verify JWT
      const payload = this.jwtService.verify(refreshToken);

      // 2. Tìm token trong DB theo giá trị token
      const dbToken = await this.refreshTokenRepository.findOne({
        where: { refresh_token: refreshToken },
        relations: ['user'],
      });

      // 3. Kiểm tra các điều kiện
      if (
        !dbToken ||
        !dbToken.is_active ||
        (dbToken.expires_at && dbToken.expires_at < new Date()) ||
        (deviceId && dbToken.device_id !== deviceId)
      ) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = dbToken.user;
      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // 4. Thu hồi token cũ
      await this.refreshTokenRepository.update(dbToken.id, { is_active: false });

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
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number, deviceId?: string): Promise<void> {
    // Thu hồi refresh token theo deviceId nếu có, hoặc toàn bộ nếu không có
    if (deviceId) {
      await this.refreshTokenRepository.deactivateByUserAndDevice(userId, deviceId);
    } else {
      await this.refreshTokenRepository.deactivateAllForUser(userId);
    }
    await this.userRepository.update(userId, {
      lastActivityAt: new Date(),
    });
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
