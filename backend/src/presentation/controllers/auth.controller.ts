import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  Inject,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody, // Keep ApiBody for other DTOs
  ApiBearerAuth,
} from "@nestjs/swagger";
import { IAuthService } from "@/application/services/auth.service.interface";
import {
  RegisterDto,
  RegisterDtoWithIp,
} from "@/application/dto/auth/register.dto";
import { LoginDto, LoginDtoWithIp } from "@/application/dto/auth/login.dto";
import { RefreshTokenDto } from "@/application/dto/auth/refresh-token.dto";
import { AuthResponseDto } from "@/application/dto/auth/auth-response.dto";
import { RegisterResponseDto } from "@/application/dto/auth/register-response.dto";
import {
  ErrorResponseDto,
  ValidationErrorResponseDto,
} from "@/application/dto/common/error-response.dto";
import { LocalAuthGuard } from "@/presentation/guards/local-auth.guard";
import { JwtAuthGuard } from "@/presentation/guards/jwt-auth.guard";

@Controller("auth")
@ApiTags("Authentication")
export class AuthController {
  constructor(
    @Inject("IAuthService") private readonly authService: IAuthService
  ) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Register new user",
    description: "Create a new user account. Email verification will be sent.",
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: "User registered successfully",
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: "Email or username already exists",
    type: ErrorResponseDto,
  })
  async register(
    @Body() registerDto: RegisterDto,
    @Request() req
  ): Promise<RegisterResponseDto> {
    // Extract IP address from request
    const ip =
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.headers["x-forwarded-for"] ||
      "unknown";
    // Extract user agent from request headers
    const userAgent = req.headers["user-agent"] || "unknown";
    const registerDtoWithIp: RegisterDtoWithIp = {
      ...registerDto,
      ip,
      userAgent,
    };
    return this.authService.register(registerDtoWithIp);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Login user",
    description: "Authenticate user with email/username and password",
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: "Login successful",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Account not found or invalid password",
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: "Email not verified",
    type: ErrorResponseDto,
  })
  async login(
    @Body() loginDto: LoginDto,
    @Request() req
  ): Promise<AuthResponseDto> {
    // Extract IP address from request
    const ip =
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.headers["x-forwarded-for"] ||
      "unknown";
    // Extract user agent from request headers
    const userAgent = req.headers["user-agent"] || "unknown";
    const loginDtoWithIp: LoginDtoWithIp = {
      ...loginDto,
      ip,
      userAgent,
    };
    return this.authService.login(loginDtoWithIp);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Refresh access token",
    description: "Get new access token using refresh token",
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: "Token refreshed successfully",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Invalid refresh token",
    type: ErrorResponseDto,
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(
      refreshTokenDto.refreshToken,
      refreshTokenDto.deviceId
    );
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Logout user",
    description: "Logout user and invalidate all sessions",
  })
  @ApiResponse({
    status: 200,
    description: "Logout successful",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    type: ErrorResponseDto,
  })
  async logout(@Request() req): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        throw new Error("Invalid user in request");
      }

      // Extract session token from Authorization header
      const authHeader = req.headers.authorization;
      const sessionToken = authHeader
        ? authHeader.replace("Bearer ", "")
        : null;

      return this.authService.logout(req.user.id, sessionToken);
    } catch (error) {
      console.error("Logout controller error:", error);
      throw error;
    }
  }
}
