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
import { UserActivityRepository } from "@/infrastructure/database/repositories/user-activity.repository";
import { UserDeviceRepository } from "@/infrastructure/database/repositories/user-device.repository";
import { ActivityType } from "@/infrastructure/database/entities/user-activity.entity";
import { DeviceType } from "@/infrastructure/database/entities/user-device.entity";
import { IUserRoleRepository } from "@/domain/repositories/user-role.repository.interface";
import { Role } from "@/infrastructure/database/entities/role.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

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
    private readonly userSessionRepository: UserSessionRepository,
    private readonly userActivityRepository: UserActivityRepository,
    private readonly userDeviceRepository: UserDeviceRepository,
    @Inject("IUserRoleRepository")
    private readonly userRoleRepository: IUserRoleRepository,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  async register(registerDto: RegisterDtoWithIp): Promise<RegisterResponseDto> {
    const { username, email, password, phone, accountType, ip, userAgent } =
      registerDto;

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

    // 3. Track user activity
    try {
      await this.userActivityRepository.create({
        userId: user.id,
        activityType: ActivityType.PROFILE_CREATED,
        description: `User ${username} registered successfully`,
        metadata: {
          username,
          email,
          accountType,
          registrationMethod: "email",
        },
        ipAddress: ip,
        userAgent: userAgent,
      });
      console.log("✅ Activity tracked: PROFILE_CREATED for user", user.id);
    } catch (error) {
      console.error("❌ Failed to track activity:", error);
    }

    // 4. Assign default role based on account type
    try {
      let defaultRoleName = "student"; // Default role

      // Map account type to role
      switch (accountType) {
        case "super_admin":
          defaultRoleName = "super_admin";
          break;
        case "admin":
          defaultRoleName = "admin";
          break;
        case "moderator":
          defaultRoleName = "moderator";
          break;
        case "university_rep":
          defaultRoleName = "university_representative";
          break;
        case "student":
        default:
          defaultRoleName = "student";
          break;
      }

      // Get role by name
      const role = await this.roleRepository.findOne({
        where: { name: defaultRoleName },
      });

      if (role) {
        const userRole = this.userRoleRepository.create({
          user_id: user.id,
          role_id: role.id,
        });
        await this.userRoleRepository.save(userRole);
        console.log(
          `✅ Assigned role '${defaultRoleName}' to user ${username}`
        );
      } else {
        console.error(`❌ Role '${defaultRoleName}' not found`);
      }
    } catch (error) {
      console.error("❌ Failed to assign role:", error);
    }

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

    console.log("🔍 Login attempt for:", identifier);
    console.log("📱 Device ID:", deviceId);
    console.log("🌐 IP:", ip);
    console.log("🔧 User Agent:", userAgent);

    // Check if user exists first
    const user = await this.userRepository.findByEmailOrUsername(identifier);
    if (!user) {
      console.log("❌ Login failed: Account not found");
      throw new UnauthorizedException(
        "Account not found. Please check your email/username and try again."
      );
    }

    // Check if account is active
    if (user.status !== UserStatus.ACTIVE) {
      console.log("❌ Login failed: Account not active");
      throw new UnauthorizedException(
        "Account is not active. Please contact support."
      );
    }

    // Check if email is verified
    if (!user.isVerified || !user.emailVerifiedAt) {
      console.log("❌ Login failed: Email not verified");
      throw new ForbiddenException(
        "Email not verified. Please check your email and verify your account."
      );
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      // Increment failed login attempts
      await this.userRepository.update(user.id, {
        failedLoginAttempts: user.failedLoginAttempts + 1,
      });
      console.log("❌ Login failed: Invalid password");
      throw new UnauthorizedException(
        "Invalid password. Please check your password and try again."
      );
    }

    console.log("✅ User validated:", user.username);
    console.log("✅ All checks passed, proceeding with login...");

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

    console.log("✅ Session and tokens created successfully");

    // Track device
    if (deviceId) {
      try {
        const deviceInfo = this.parseUserAgent(userAgent);
        await this.userDeviceRepository.createOrUpdate({
          userId: user.id,
          deviceId: deviceId,
          deviceName: deviceInfo.deviceName,
          deviceType: deviceInfo.deviceType,
          platform: deviceInfo.platform,
          browser: deviceInfo.browser,
          lastUsedAt: new Date(),
        });
        console.log("✅ Device tracked for user", user.id);
      } catch (error) {
        console.error("❌ Failed to track device:", error);
      }
    }

    // Track successful login
    try {
      await this.userActivityRepository.create({
        userId: user.id,
        activityType: ActivityType.LOGIN_SUCCESS,
        description: `User ${user.username} logged in successfully`,
        metadata: {
          deviceId,
          rememberMe,
          loginMethod: "email",
        },
        ipAddress: ip,
        userAgent: userAgent,
      });
      console.log("✅ Activity tracked: LOGIN_SUCCESS for user", user.id);
    } catch (error) {
      console.error("❌ Failed to track activity:", error);
    }

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

      // Track logout activity
      try {
        await this.userActivityRepository.create({
          userId: userId,
          activityType: ActivityType.LOGOUT,
          description: `User logged out`,
          metadata: {
            sessionToken: sessionToken ? "specific" : "all",
          },
          ipAddress: null,
          userAgent: null,
        });
        console.log("✅ Activity tracked: LOGOUT for user", userId);
      } catch (error) {
        console.error("❌ Failed to track logout activity:", error);
      }
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  private parseUserAgent(userAgent: string): {
    deviceName: string;
    deviceType: DeviceType;
    platform: string;
    browser: string;
  } {
    const ua = userAgent.toLowerCase();

    // Detect device type
    let deviceType = DeviceType.WEB;
    if (ua.includes("mobile")) deviceType = DeviceType.MOBILE;
    else if (ua.includes("tablet")) deviceType = DeviceType.TABLET;
    else if (ua.includes("windows") || ua.includes("macintosh"))
      deviceType = DeviceType.DESKTOP;

    // Detect platform
    let platform = "Unknown";
    if (ua.includes("windows")) platform = "Windows";
    else if (ua.includes("macintosh")) platform = "macOS";
    else if (ua.includes("linux")) platform = "Linux";
    else if (ua.includes("android")) platform = "Android";
    else if (ua.includes("iphone") || ua.includes("ipad")) platform = "iOS";

    // Detect browser
    let browser = "Unknown";
    if (ua.includes("chrome")) browser = "Chrome";
    else if (ua.includes("firefox")) browser = "Firefox";
    else if (ua.includes("safari")) browser = "Safari";
    else if (ua.includes("edge")) browser = "Edge";
    else if (ua.includes("opera")) browser = "Opera";

    return {
      deviceName: `${platform} ${browser}`,
      deviceType,
      platform,
      browser,
    };
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
    refreshExpiresIn: number;
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
      refreshExpiresIn: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60, // seconds
    };
  }
}
