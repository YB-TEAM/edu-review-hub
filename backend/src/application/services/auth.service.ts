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

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    @Inject("IEmailVerificationService")
    private readonly emailVerificationService: IEmailVerificationService,
    private readonly jwtService: JwtService
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

    // Create user profile
    const profile = new UserProfile();
    profile.firstName = "";
    profile.lastName = "";
    profile.displayName = username;

    // Create user
    const user = await this.userRepository.create({
      username,
      email,
      passwordHash,
      phone,
      accountType,
      status: UserStatus.ACTIVE,
      isVerified: false,
      profile,
    });

    // Send email verification
    await this.emailVerificationService.sendEmailVerification(
      user.id,
      email,
      username
    );

    // Generate tokens
    const tokens = await this.generateTokens(user);

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
    const { identifier, password, deviceId, rememberMe } = loginDto;

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

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findById(payload.sub);

      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const tokens = await this.generateTokens(user);

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

  async logout(userId: number, deviceId?: string): Promise<void> {
    // In a real implementation, you would invalidate the refresh token
    // For now, we'll just update the last activity
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
